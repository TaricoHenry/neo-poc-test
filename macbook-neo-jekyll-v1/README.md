# MacBook Neo Guyana Jekyll Site

This is a Jekyll landing page inspired by Apple's MacBook Neo product page, adapted for Guyana.

## Included
- Full landing page
- Local-market checkout flow
- Final checkout form that sends reservations to Google Sheets
- Google Apps Script endpoint example

## Run locally
```bash
bundle exec jekyll serve
```

## Hook up Google Sheets
1. Create a Google Sheet.
2. Open **Extensions -> Apps Script**.
3. Paste the code from `google-apps-script.js`.
4. Deploy it as a **Web app**.
5. Allow access for anyone with the link, if that fits your workflow.
6. Copy the deployment URL.
7. Replace `REPLACE_WITH_YOUR_DEPLOYED_WEB_APP` in `assets/js/main.js`.

## Suggested Sheet Columns
The script auto-creates these columns in a sheet named `Orders`:
- Timestamp
- Full Name
- Phone / WhatsApp
- Email
- Location
- Model
- Color
- Payment Method
- Fulfillment
- Notes
- Source

## Notes
- Prices are sample Guyana-dollar values and can be edited in `index.html`.
- The visual design uses original shapes and gradients, not Apple assets.
- This is a reservation flow, not a card payment gateway.


Thought for 4m 4s

I built a Jekyll project for this.

Downloads:

Jekyll project folder

ZIP package

What’s included:

Full one-page landing page

Apple-inspired structure and tone based on the MacBook Neo page’s hero, highlights, color-forward design, and “Hello, Neo.” positioning

Checkout flow adapted for Guyana with:

Cash on pickup

Bank transfer

MMG

Final checkout submission that sends an order record to Google Sheets through Google Apps Script

A sample google-apps-script.js file for the Sheet endpoint

Main files:

index.html

_layouts/default.html

assets/css/style.css

assets/js/main.js

google-apps-script.js

README.md

Important implementation note:
Because Jekyll is static, the Google Sheet write is done through a Google Apps Script web app endpoint, not directly from Jekyll itself. I wired the frontend for that, and you just need to replace the placeholder URL in assets/js/main.js.

I also adapted the checkout to a reservation/order-capture model instead of card payments, which fits the Guyana use case you described.

One thing I noticed: you wrote “allow the” but the sentence cut off. I went ahead and made the final checkout submit directly to Google Sheets, which looks like the main requirement.