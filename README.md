# FlixBuzz

FlixBuzz is a React + Vite business website for selling verified subscription services through WhatsApp. It includes a public catalog, product detail pages, checkout inquiry flow, bundle offers, reviews, light/dark theme support, and a hidden admin endpoint for editing local catalog state.

## Features

- Premium subscription catalog with categories, sorting, search, and live suggestions.
- Product detail pages at `/product?id=<productId>`.
- WhatsApp checkout flow at `/checkout?id=<productId>`.
- Payment method selection for bKash, Nagad, bank transfer, or WhatsApp discussion.
- Featured best-seller section for popular products.
- Bundle offers for student, entertainment, and creator packs.
- Leave-a-review page at `/review`.
- Order verification section on the home page.
- Hidden admin route at `/admin`.
- First-run local admin passcode setup.
- Dark/light theme toggle persisted in `localStorage`.
- Quirky first-load screen, animated hero, and subscription logo rail.

## Tech Stack

- React 19
- Vite 8
- lucide-react icons
- Plain CSS in `src/App.css`
- Static product data in `src/data/products.js`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Routes

- `/` - Home page with hero, subscriptions, featured products, bundles, catalog, verification, reviews, FAQ, and footer.
- `/product?id=<id>` - Product detail page.
- `/checkout?id=<id>` - Checkout inquiry page that opens WhatsApp with an order message.
- `/review` - Customer review submission page that opens WhatsApp.
- `/admin` - Admin panel route. This is not linked from the main website.

## Admin Access

The admin page does not use a hardcoded password.

On first visit to `/admin`, enter a passcode with at least 8 characters. That passcode is saved in this browser's `localStorage` under `flixbuzz-admin-passcode`. Later admin logins on the same browser must use the same passcode.

This is suitable only for the current static/local prototype. For production, replace it with real server-side authentication.

## Product Data

Catalog data lives in:

```text
src/data/products.js
```

Brand favicon/logo mappings live in:

```text
src/data/brandLogos.js
```

The admin page can edit prices, update availability, and add products. Click **Save catalog** in `/admin` to write those changes to the browser's `localStorage` under `flixbuzz-products`. After saving, the public website uses the updated catalog after navigation or refresh in the same browser.

## WhatsApp Flow

Orders and reviews are processed manually through WhatsApp:

- Business WhatsApp number: `+8801580744443`
- Checkout creates a formatted order message with product, plan, price, payment method, name, phone, and notes.
- Review page creates a formatted review message for manual approval.
- Bundle cards create a formatted bundle inquiry message.

## Important Limitations

- No database yet.
- No payment gateway.
- No persistent order storage.
- Admin catalog edits are browser-local only until a database is added.
- Admin passcode is browser-local only and not production-grade security.
- Product logo images use external favicon URLs, so they depend on network access.

See [CONTEXT.md](./CONTEXT.md) for architecture notes and future implementation guidance.
