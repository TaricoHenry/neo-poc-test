// ==========================================
// API ENDPOINT
// ==========================================
// Change this when you deploy to production.
// Local Firebase emulator example:
const API_URL =
  (window.SITE_CONFIG && window.SITE_CONFIG.orderApiUrl) ||
  "http://127.0.0.1:5001/macbook-neo/us-central1/api/v1/orders";

// ==========================================
// FORM ELEMENTS
// ==========================================
const form = document.getElementById("checkoutForm");
const statusEl = document.getElementById("formStatus");

const modelSelect = form ? form.querySelector('[name="model"]') : null;
const colourSelect = form ? form.querySelector('[name="colour"]') : null;
const paymentSelect = form ? form.querySelector('[name="paymentMethod"]') : null;
const fulfillmentSelect = form ? form.querySelector('[name="fulfillment"]') : null;
const priceInput = form ? form.querySelector('[name="price"]') : null;

const fullNameInput = form ? form.querySelector('[name="fullName"]') : null;
const phoneInput = form ? form.querySelector('[name="phone"]') : null;
const emailInput = form ? form.querySelector('[name="email"]') : null;
const locationInput = form ? form.querySelector('[name="location"]') : null;
const notesInput = form ? form.querySelector('[name="notes"]') : null;

const summaryModel = document.querySelector('[data-summary-model]');
const summaryColour = document.querySelector('[data-summary-colour]');
const summaryPrice = document.querySelector('[data-summary-price]');
const summaryPayment = document.querySelector('[data-summary-payment]');
const summaryFulfillment = document.querySelector('[data-summary-fulfillment]');

// ==========================================
// PRICE MAP
// ==========================================
const PRICE_MAP = {
  "MacBook Neo 256GB": "$140,000",
  "MacBook Neo 512GB": "$155,000",
  "MacBook Neo 512GB + Setup": "$165,000"
};

// ==========================================
// ALLOWED VALUES
// ==========================================
const ALLOWED_MODELS = [
  "MacBook Neo 256GB",
  "MacBook Neo 512GB",
  "MacBook Neo 512GB + Setup"
];

const ALLOWED_COLOURS = [
  "Silver",
  "Blush",
  "Citrus",
  "Indigo"
];

const ALLOWED_PAYMENT_METHODS = [
  "Cash on pickup",
  "Cash on delivery",
  "Bank transfer",
  "MMG"
];

const ALLOWED_FULFILLMENT = [
  "Pickup",
  "Delivery"
];

// ==========================================
// SUMMARY SYNC
// ==========================================
function syncSummary() {
  if (!form) return;

  const model = modelSelect && modelSelect.value ? modelSelect.value : "MacBook Neo 256GB";
  const colour = colourSelect && colourSelect.value ? colourSelect.value : "Indigo";
  const price = PRICE_MAP[model] || "$140,000";
  const payment = paymentSelect && paymentSelect.value ? paymentSelect.value : "Choose at checkout";
  const fulfillment = fulfillmentSelect && fulfillmentSelect.value ? fulfillmentSelect.value : "Pickup or delivery";

  if (summaryModel) summaryModel.textContent = model;
  if (summaryColour) summaryColour.textContent = colour;
  if (summaryPrice) summaryPrice.textContent = price;
  if (summaryPayment) summaryPayment.textContent = payment;
  if (summaryFulfillment) summaryFulfillment.textContent = fulfillment;
  if (priceInput) priceInput.value = price;
}

// ==========================================
// STATUS HELPERS
// ==========================================
function setStatus(message, type = "") {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = type ? `form-status ${type}` : "form-status";
}

// ==========================================
// ERROR HELPERS
// ==========================================
function clearFieldErrors() {
  if (!form) return;

  form.querySelectorAll(".field-error").forEach((el) => el.remove());
  form.querySelectorAll(".has-error").forEach((el) => el.classList.remove("has-error"));
}

function showFieldError(field, message) {
  if (!field) return;

  field.classList.add("has-error");

  const error = document.createElement("div");
  error.className = "field-error";
  error.textContent = message;

  const label = field.closest("label");
  if (label) {
    label.appendChild(error);
  } else {
    field.insertAdjacentElement("afterend", error);
  }
}

// ==========================================
// VALIDATION
// ==========================================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone);
}

function validateForm(data) {
  const errors = {};

  // full name
  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  // phone
  if (!data.phone || !data.phone.trim()) {
    errors.phone = "WhatsApp / phone number is required.";
  } else if (!isValidPhone(data.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  // email
  if (!data.email || !data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  // model
  if (!data.model || !ALLOWED_MODELS.includes(data.model)) {
    errors.model = "Please choose a valid model.";
  }

  // colour
  if (!data.colour || !ALLOWED_COLOURS.includes(data.colour)) {
    errors.colour = "Please choose a valid colour.";
  }

  // payment method
  if (!data.paymentMethod || !ALLOWED_PAYMENT_METHODS.includes(data.paymentMethod)) {
    errors.paymentMethod = "Please choose a payment method.";
  }

  // fulfillment
  if (!data.fulfillment || !ALLOWED_FULFILLMENT.includes(data.fulfillment)) {
    errors.fulfillment = "Please choose pickup or delivery.";
  }

  // delivery area required if delivery selected
  if (data.fulfillment === "Delivery") {
    if (!data.location || !data.location.trim()) {
      errors.location = "Delivery area is required when delivery is selected.";
    }
  }

  // notes optional, but cap length if you want
  if (data.notes && data.notes.length > 500) {
    errors.notes = "Notes must be 500 characters or less.";
  }

  return errors;
}

// ==========================================
// FORM INIT
// ==========================================
if (form) {
  syncSummary();

  [modelSelect, paymentSelect, fulfillmentSelect, colourSelect].forEach((element) => {
    if (element) element.addEventListener("change", syncSummary);
  });

  document.querySelectorAll(".product-select").forEach((button) => {
    button.addEventListener("click", () => {
      const model = button.dataset.model;
      if (modelSelect) modelSelect.value = model;
      syncSummary();

      const checkout = document.getElementById("checkout");
      if (checkout) {
        checkout.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearFieldErrors();
    syncSummary();

    // get raw form data
    const rawData = Object.fromEntries(new FormData(form).entries());

    // normalize before validation / submit
    const data = {
      fullName: rawData.fullName ? rawData.fullName.trim() : "",
      phone: rawData.phone ? rawData.phone.trim() : "",
      email: rawData.email ? rawData.email.trim() : "",
      location: rawData.location ? rawData.location.trim() : "",
      model: rawData.model ? rawData.model.trim() : "",
      colour: rawData.colour ? rawData.colour.trim() : "",
      paymentMethod: rawData.paymentMethod ? rawData.paymentMethod.trim() : "",
      fulfillment: rawData.fulfillment ? rawData.fulfillment.trim() : "",
      notes: rawData.notes ? rawData.notes.trim() : ""
    };

    // client-side validation
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      if (errors.fullName) showFieldError(fullNameInput, errors.fullName);
      if (errors.phone) showFieldError(phoneInput, errors.phone);
      if (errors.email) showFieldError(emailInput, errors.email);
      if (errors.location) showFieldError(locationInput, errors.location);
      if (errors.model) showFieldError(modelSelect, errors.model);
      if (errors.colour) showFieldError(colourSelect, errors.colour);
      if (errors.paymentMethod) showFieldError(paymentSelect, errors.paymentMethod);
      if (errors.fulfillment) showFieldError(fulfillmentSelect, errors.fulfillment);
      if (errors.notes) showFieldError(notesInput, errors.notes);

      setStatus("Please fix the highlighted fields and try again.", "error");
      return;
    }

    setStatus("Submitting reservation...", "");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        const message =
          result.error ||
          (Array.isArray(result.errors) ? result.errors.join(" ") : null) ||
          "Submission failed.";
        throw new Error(message);
      }

      setStatus(`Reservation submitted successfully. Order ID: ${result.orderId}`, "success");

      form.reset();

      // reset defaults after form reset
      if (modelSelect) modelSelect.value = "MacBook Neo 256GB";
      if (colourSelect) colourSelect.value = "";
      if (paymentSelect) paymentSelect.value = "";
      if (fulfillmentSelect) fulfillmentSelect.value = "";

      syncSummary();
    } catch (error) {
      console.error(error);
      setStatus(error.message || "Could not submit right now. Please try again.", "error");
    }
  });
}