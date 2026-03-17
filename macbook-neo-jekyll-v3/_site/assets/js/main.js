const GOOGLE_SCRIPT_URL = (window.SITE_CONFIG && window.SITE_CONFIG.googleSheetWebAppUrl) || "https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYED_WEB_APP/exec";

const form = document.getElementById("checkoutForm");
const statusEl = document.getElementById("formStatus");
const modelSelect = form ? form.querySelector('[name="model"]') : null;
const colourSelect = form ? form.querySelector('[name="colour"]') : null;
const paymentSelect = form ? form.querySelector('[name="paymentMethod"]') : null;
const fulfillmentSelect = form ? form.querySelector('[name="fulfillment"]') : null;
const priceInput = form ? form.querySelector('[name="price"]') : null;

const summaryModel = document.querySelector('[data-summary-model]');
const summaryColour = document.querySelector('[data-summary-colour]');
const summaryPrice = document.querySelector('[data-summary-price]');
const summaryPayment = document.querySelector('[data-summary-payment]');
const summaryFulfillment = document.querySelector('[data-summary-fulfillment]');

const PRICE_MAP = {
  'MacBook Neo 256GB': '$130,000',
  'MacBook Neo 512GB': '$145,000',
  'MacBook Neo 512GB + Setup': '$160,000'
};

function syncSummary() {
  if (!form) return;
  const model = modelSelect.value || 'MacBook Neo 256GB';
  const colour = colourSelect.value || "Indigo"
  const price = PRICE_MAP[model] || '$130,000';
  const payment = paymentSelect.value || 'Choose at checkout';
  const fulfillment = fulfillmentSelect.value || 'Pickup or delivery';

  if (summaryModel) summaryModel.textContent = model;
  if (summaryColour) summaryColour.textContent = colour;
  if (summaryPrice) summaryPrice.textContent = price;
  if (summaryPayment) summaryPayment.textContent = payment;
  if (summaryFulfillment) summaryFulfillment.textContent = fulfillment;
  if (priceInput) priceInput.value = price;
}

if (form) {
  syncSummary();

  [modelSelect, paymentSelect, fulfillmentSelect,colourSelect ].forEach((element) => {
    if (element) element.addEventListener('change', syncSummary);
  });

  document.querySelectorAll('.product-select').forEach((button) => {
    button.addEventListener('click', () => {
      const model = button.dataset.model;
      if (modelSelect) modelSelect.value = model;
      syncSummary();
      document.getElementById('checkout').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncSummary();

    const data = Object.fromEntries(new FormData(form).entries());
    data.timestamp = new Date().toISOString();
    data.source = "MacBook Neo Guyana Jekyll Site";

    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_WEB_APP')) {
      statusEl.textContent = "Add your published Google Apps Script web app URL in _config.yml before going live.";
      statusEl.className = "form-status error";
      return;
    }

    statusEl.textContent = "Submitting reservation...";
    statusEl.className = "form-status";

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.ok) {
        statusEl.textContent = "Reservation submitted. Your team can now review it in Google Sheets.";
        statusEl.className = "form-status success";
        form.reset();
        if (modelSelect) modelSelect.value = 'MacBook Neo 512GB';
        syncSummary();
      } else {
        throw new Error(result.message || "Submission failed.");
      }
    } catch (error) {
      statusEl.textContent = "Could not submit right now. Please verify your Apps Script URL, deployment access, and response format.";
      statusEl.className = "form-status error";
      console.error(error);
    }
  });
}
