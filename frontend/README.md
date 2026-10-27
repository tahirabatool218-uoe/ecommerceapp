# E-Commerce Frontend

React, Vite, and TypeScript storefront for the existing Express/MongoDB e-commerce API.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173` by default. Start the backend separately; its default port is `5000`.

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp` if needed.

## Environment variables

Only public values belong in this file. Every `VITE_*` variable is bundled into the browser build.

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, including `/api` | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Brand name shown in the interface and page titles | `Shopfront` |
| `VITE_CURRENCY` | ISO currency code used to format prices | `PKR` |

## Scripts

- `npm run dev` — start the development server.
- `npm run typecheck` — run the TypeScript compiler without emitting files.
- `npm run build` — create the production build.
- `npm run preview` — preview the production build locally.
- `npm run lint` — run the configured ESLint checks.

## Source structure

- `src/components/` — shared UI, layout, home, product, cart, order, authentication, and admin components.
- `src/pages/` — storefront, authentication, cart, checkout, orders, and admin pages.
- `src/services/` — typed Axios client and API service functions.
- `src/hooks/` — reusable data-fetching and document-title hooks.
- `src/context/` — authentication and theme contexts.
- `src/types.ts` — shared frontend types, API response types, and form models.
- `src/utils/` — authentication storage, error handling, formatting, cart calculations, and product/order helpers.
- `src/styles/` — application styles and design tokens.

## API integration

The frontend uses the backend endpoints under `/api`, including authentication, products, cart, orders, and product-image uploads. API payloads and responses are typed in the service layer.
