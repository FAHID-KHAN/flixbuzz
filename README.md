# FlixBuzz

FlixBuzz is a React + Vite business website for selling verified subscription services through WhatsApp. It includes a public catalog, product detail pages, checkout inquiry flow, bundle offers, reviews, light/dark theme support, and a real SQLite-backed admin/API layer for saving product and pricing updates.

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
- First-run admin passcode setup stored in SQLite.
- Express API for product loading and catalog saves.
- SQLite database for products and admin credentials.
- Dark/light theme toggle persisted in `localStorage`.
- Quirky first-load screen, animated hero, and subscription logo rail.

## Tech Stack

- React 19
- Vite 8
- Node.js + Express
- SQLite through `better-sqlite3`
- lucide-react icons
- Plain CSS in `src/App.css`
- Seed product data in `src/data/products.js`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the backend API:

```bash
npm run dev:api
```

Run the frontend dev server in another terminal:

```bash
npm run dev:web
```

`npm run dev` also starts the Vite frontend. During local development, Vite proxies `/api` requests to `http://localhost:4000`.

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

On first visit to `/admin`, enter a passcode with at least 8 characters. The backend hashes and stores that passcode in SQLite. Later admin logins must use the same passcode.

The current API uses in-memory session tokens after login. For production, use HTTPS, Kubernetes secrets, and consider upgrading to durable sessions/JWTs.

## Product Data

Seed catalog data lives in:

```text
src/data/products.js
```

The live catalog is loaded from SQLite through:

```text
GET /api/products
```

Brand favicon/logo mappings live in:

```text
src/data/brandLogos.js
```

The admin page can edit prices, update availability, and add products. Click **Save catalog** in `/admin` to write those changes to SQLite through:

```text
PUT /api/admin/products
```

After saving, all customers who load the public website receive the updated catalog from the API.

## Backend API

Backend entry:

```text
server/index.js
```

SQLite/database layer:

```text
server/database.js
```

Default SQLite path:

```text
data/flixbuzz.sqlite
```

API routes:

```text
GET  /api/health
GET  /api/products
GET  /api/admin/status
POST /api/admin/login
PUT  /api/admin/products
```

## WhatsApp Flow

Orders and reviews are processed manually through WhatsApp:

- Business WhatsApp number: `+8801580744443`
- Checkout creates a formatted order message with product, plan, price, payment method, name, phone, and notes.
- Review page creates a formatted review message for manual approval.
- Bundle cards create a formatted bundle inquiry message.

## Important Limitations

- No payment gateway.
- No persistent order storage.
- Admin session tokens are in-memory and reset on backend restart.
- SQLite should run with one backend writer replica and a persistent volume.
- Product logo images use external favicon URLs, so they depend on network access.

See [CONTEXT.md](./CONTEXT.md) for architecture notes and future implementation guidance.

For a full cloud-native production launch roadmap, see [KUBERNETES_PRODUCTION_PLAN.md](./KUBERNETES_PRODUCTION_PLAN.md).
