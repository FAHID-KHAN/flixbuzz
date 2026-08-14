# FlixBuzz Repo Context

This document is for future development handoff. It explains how the current FlixBuzz site is structured, what state is stored where, and what should be considered before production.

## Product Goal

FlixBuzz is a business website for selling subscription products such as Netflix, Prime Video, ChatGPT Plus, Canva Pro, Coursera Plus, VPNs, and software licenses. The current business flow is manual:

1. Customer browses products.
2. Customer selects a product, plan, and payment method.
3. Checkout opens WhatsApp with a structured order message.
4. Admin verifies payment/order manually.
5. Admin delivers the subscription manually.

There is intentionally no payment gateway or database in the current build.

## App Architecture

Main entry:

```text
src/main.jsx
src/App.jsx
```

`src/App.jsx` handles routing by reading `window.location.pathname`:

- `/admin` renders `AdminPage`.
- `/checkout` renders `CheckoutPage`.
- `/product` renders `ProductDetailPage`.
- `/review` renders `ReviewPage`.
- Everything else renders `HomePage`.

There is no React Router installed. Navigation uses regular anchor links.

## Key State

State is held in `App.jsx`:

- `products` - initialized from `localStorage` key `flixbuzz-products` when available, otherwise from `initialProducts`.
- `selectedId` - selected product for hero/preview behavior.
- `activeCategory` - catalog category filter.
- `sortBy` - catalog sorting mode.
- `searchTerm` - catalog search input.
- `theme` - persisted to `localStorage` as `flixbuzz-theme`.
- `isLoading` - first-load screen gate; uses `sessionStorage` key `flixbuzz-loaded`.
- `verification` - home page order verification form state.
- `review` - review page form state.
- `orders` - local in-memory checkout requests.
- `adminPasscode` - browser-local admin passcode from `localStorage`.
- `isLoggedIn` - admin login status for the current app session.

## Data Files

Product/catalog data:

```text
src/data/products.js
```

Exports:

- `categories`
- `durationLabels`
- `featuredProductNames`
- `bundleOffers`
- `initialProducts`

Brand logo mappings:

```text
src/data/brandLogos.js
```

Product logos are currently loaded via Google favicon URLs. If logos fail to load or exact brand assets are required, replace this with local image assets.

Admin catalog edits are currently saved in browser `localStorage` under:

```text
flixbuzz-products
```

Admins must click **Save catalog** in `/admin` to write price edits, availability edits, and newly added products to this key. After saving, changes show on the public website after navigating away from `/admin` or refreshing in the same browser. This is still browser-local and not shared across devices.

## Main Pages

Home page:

```text
src/pages/Home.jsx
```

Home renders:

- `Navbar`
- `Hero`
- `SubscriptionRail`
- `FeaturedProducts`
- `BundleOffers`
- `Services`
- `Contact`
- `Reviews`
- `FAQ`
- `ClientBanner`
- `Footer`

Checkout page:

```text
src/pages/Checkout.jsx
```

Creates a local order object through `handleCreateOrder`, then opens WhatsApp with a formatted order message.

Product detail page:

```text
src/pages/ProductDetail.jsx
```

Uses `?id=` query param to select the product.

Review page:

```text
src/pages/ReviewPage.jsx
```

Collects customer review details and opens WhatsApp with a formatted review submission.

Admin page:

```text
src/pages/Admin.jsx
```

Not linked from the public site. Available at `/admin`.

## Admin Behavior

There is no hardcoded admin password.

On first login, `/admin` asks the user to create a passcode with at least 8 characters. It stores the passcode in browser `localStorage` as:

```text
flixbuzz-admin-passcode
```

This is only a prototype/local convenience. It is not secure enough for production because the passcode lives in the browser and all admin behavior is client-side.

Production admin should use server-side authentication and authorization.

## Styling

Primary stylesheet:

```text
src/App.css
```

Global base styles:

```text
src/index.css
src/styles/global.css
```

The default visual theme is dark. Light mode is implemented with `.theme-light` overrides. If a section does not respond to dark mode, look for hardcoded light backgrounds in `src/App.css` and either make dark the default or add proper `.theme-light` overrides.

Design direction:

- Premium but playful.
- Red is brand accent only, not the default trust/action color.
- Primary conversion actions use calmer slate/blue tones.
- Cards use 8px border radius.
- Avoid visible admin links in public navigation.

## WhatsApp Number

Business WhatsApp number:

```text
+8801580744443
```

The shorter local number shown in footer:

```text
01580-744443
```

If the business number changes, update:

- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`
- `src/pages/Checkout.jsx`
- `src/pages/ReviewPage.jsx`
- `src/components/BundleOffers.jsx`

## Current Limitations

- No real backend.
- No database.
- Admin catalog edits are browser-local only.
- No real order tracking persistence.
- No real authentication.
- No payment gateway.
- No review approval system.
- External brand logos may fail if favicon services are blocked.

## Recommended Next Steps

1. Add a database for products, orders, and reviews.
2. Replace local admin passcode with real authentication.
3. Persist admin price/product edits in a real database.
4. Add order status lookup by order ID and phone.
5. Add approved review publishing.
6. Add environment variables for WhatsApp/contact configuration.
7. Replace external favicon logos with optimized local assets.
8. Add deployment config for the chosen hosting platform.

## Common Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Git Notes

The repo is connected to:

```text
git@github.com:FAHID-KHAN/flixbuzz.git
```

Main branch:

```text
main
```
