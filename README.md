# E-Commerce Platform

A full-stack e-commerce application built with a Node.js + Express backend and a React + Vite frontend. The project includes authentication, product management, shopping cart, checkout, orders, admin dashboard, and Cloudinary-based image uploads.

## Overview

This repository contains both backend APIs and the frontend client.

- Backend: Node.js, Express 5, TypeScript, MongoDB, Mongoose
- Frontend: React 19, Vite, TypeScript
- Auth: JWT registration/login flow
- Roles: User and admin access control
- Uploads: Multer + Cloudinary
- Client app: product browsing, cart, checkout, dashboard, admin pages

## Tech Stack

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT + bcryptjs
- Cloudinary
- Multer
- dotenv
- CORS

### Frontend

- React 19
- Vite
- TypeScript
- React Router
- Axios
- Custom styling and component-based pages

## Project Structure

```text
ecommerce/
├── .env
├── .env.example
├── .gitignore
├── dist/
├── frontend/
│   ├── public/
│   │   └── google338dfca98d9fc749.html
│   ├── src/
│   │   ├── App.tsx
│   │   ├── config.ts
│   │   ├── main.tsx
│   │   ├── types.ts
│   │   ├── vite-env.d.ts
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── ProductFormModal.tsx
│   │   │   ├── auth/
│   │   │   │   ├── AdminRoute.tsx
│   │   │   │   ├── AuthPlaceholder.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartSummary.tsx
│   │   │   ├── home/
│   │   │   │   ├── CallToAction.tsx
│   │   │   │   ├── CategoriesSection.tsx
│   │   │   │   ├── CategoryCard.tsx
│   │   │   │   ├── FeatureCard.tsx
│   │   │   │   ├── FeaturedProducts.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── HeroShowcase.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   └── WhyChooseUs.tsx
│   │   │   ├── layout/
│   │   │   ├── orders/
│   │   │   ├── product/
│   │   │   └── ui/
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAdminOrders.ts
│   │   │   ├── useAdminProducts.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useDocumentTitle.ts
│   │   │   ├── useMyOrders.ts
│   │   │   ├── useOrder.ts
│   │   │   ├── useProduct.ts
│   │   │   └── useProducts.ts
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx
│   │   ├── pages/
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── ComingSoonPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── OrderDetailsPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── ProductDetailsPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.tsx
│   │   │       ├── AdminOrdersPage.tsx
│   │   │       └── AdminProductsPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── productService.ts
│   │   │   └── uploadService.ts
│   │   ├── styles/
│   │   │   ├── admin.css
│   │   │   ├── auth.css
│   │   │   ├── base.css
│   │   │   ├── dashboard.css
│   │   │   ├── home.css
│   │   │   ├── index.css
│   │   │   ├── layout.css
│   │   │   ├── products.css
│   │   │   ├── shop.css
│   │   │   ├── tokens.css
│   │   │   └── ui.css
│   │   ├── utils/
│   │   │   ├── authStorage.ts
│   │   │   ├── cart.ts
│   │   │   ├── errors.ts
│   │   │   ├── formatters.ts
│   │   │   ├── orders.ts
│   │   │   └── products.ts
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   ├── vite.config.js
│   └── public/
├── package.json
├── server.ts
├── tsconfig.json
├── README.md
├── src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   └── db.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── cartController.ts
│   │   ├── orderController.ts
│   │   ├── productController.ts
│   │   └── uploadController.ts
│   ├── middleware/
│   │   ├── adminMiddleware.ts
│   │   ├── authMiddleware.ts
│   │   └── uploadMiddleware.ts
│   ├── models/
│   │   ├── Cart.ts
│   │   ├── Order.ts
│   │   ├── Product.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── authRoute.ts
│   │   ├── cartRoute.ts
│   │   ├── orderRoute.ts
│   │   ├── productRoute.ts
│   │   └── uploadRoute.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── env.d.ts
│   │   ├── express.d.ts
│   │   └── requests.ts
│   └── utils/
│       └── errors.ts
└── node_modules/
```

## Main Features

### Backend

- User registration and login
- JWT authentication
- Admin/user authorization
- Product CRUD operations
- Shopping cart management
- Order creation and handling
- User order history
- Admin order management
- Cloudinary image upload support
- MongoDB setup with Mongoose
- Type-safe Express API handlers

### Frontend

- Home page and product browsing
- Product detail page
- Login and registration screens
- Protected routes for authenticated users
- Cart and checkout flow
- User dashboard and order pages
- Admin dashboard for products and orders
- Responsive design, custom CSS styling

## API Structure

The backend mounts these route groups under `/api`:

```ts
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
```

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Cart

- `GET /api/cart` (authenticated user)
- `POST /api/cart` (authenticated user)
- `PUT /api/cart/:productId` (authenticated user)
- `DELETE /api/cart/:productId` (authenticated user)
- `DELETE /api/cart` (authenticated user)

### Orders

- `POST /api/orders` (authenticated user)
- `GET /api/orders/my-orders` (authenticated user)
- `GET /api/orders/:id` (authenticated user/admin)
- `GET /api/orders` (admin)
- `PUT /api/orders/:id/status` (admin)
- `DELETE /api/orders/:id` (admin)

### Upload

- `POST /api/upload/product-image` (admin)

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or Atlas)
- Cloudinary account

## Environment Setup

### Root backend `.env`

Use `.env.example` as a template:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend `.env`

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Shopfront
VITE_CURRENCY=PKR
```

## Installation

### 1) Install backend dependencies

```bash
npm install
```

### 2) Install frontend dependencies

```bash
cd frontend
npm install
```

## Run the Project

### Start backend

From the root directory:

```bash
npm run dev
```

### Start frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

The frontend is usually available at a local Vite URL such as:

```bash
http://localhost:5173
```

## Scripts

### Root scripts

```bash
npm run dev         # start backend development server
npm run build       # compile TypeScript to dist/
npm run typecheck  # TypeScript validation
npm start           # run compiled backend
```

### Frontend scripts

```bash
npm run dev         # start Vite app
npm run build       # production build
npm run preview     # preview production build
npm run typecheck   # TypeScript check
npm run lint        # lint frontend code
```

## App Flow

1. User registers or logs in
2. User browses products
3. User adds product to the cart
4. User proceeds to checkout
5. Order is created from cart items
6. Admin manages products and orders from admin pages

## Security Notes

- Passwords are hashed with `bcryptjs`
- JWT tokens protect private routes
- Admin-only endpoints are restricted
- Image upload endpoint is protected
- Do not commit real `.env` values to Git

## Deployment

This project is structured for separate deployment of frontend and backend. The frontend reads the API URL from `VITE_API_BASE_URL`, while the backend uses environment variables from its deployment environment.

## Repository

GitHub Repository:

https://github.com/tahirabatool218-uoe/ecommerceapp.git

### Clone

```bash
git clone https://github.com/tahirabatool218-uoe/ecommerceapp.git
cd ecommerceapp
```

## License

This project is intended for learning, portfolio, and demo purposes.