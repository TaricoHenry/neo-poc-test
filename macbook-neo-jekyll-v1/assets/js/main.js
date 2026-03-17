const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYED_WEB_APP/exec";

const form = document.getElementById("checkoutForm");
const statusEl = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    data.timestamp = new Date().toISOString();
    data.source = "MacBook Neo Guyana Jekyll Site";

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
      } else {
        throw new Error(result.message || "Submission failed.");
      }
    } catch (error) {
      statusEl.textContent = "Could not submit right now. Please verify your Apps Script URL and deployment settings.";
      statusEl.className = "form-status error";
      console.error(error);
    }
  });
}
