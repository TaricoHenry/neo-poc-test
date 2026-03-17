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


## If bundle cannot find the gem
Run these commands:
```bash
gem install bundler
bundle install
bundle exec jekyll serve
```
