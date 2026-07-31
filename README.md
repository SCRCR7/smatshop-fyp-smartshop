# SmartShop FYP - AI-Powered E-commerce Platform

SmartShop is a full-stack e-commerce web application built for online product browsing, cart management, checkout, seller onboarding, and AI-assisted shopping experiences. The platform combines a React + Vite frontend with an Express + MongoDB backend and integrates modern services such as Google OAuth, Stripe payments, and Gemini AI for voice and intent handling.

## Project Overview

SmartShop is designed as a multi-role e-commerce marketplace with the following main flows:

- Product browsing and category-based search
- User authentication and registration
- Google login/signup
- Cart and checkout experience
- Order tracking and order management
- Seller application and seller approval workflow
- Admin controls for products, orders, and banners
- AI voice-driven shopping assistance using Gemini
- Flash sale and homepage banner management

This project is a strong example of a modern commerce platform that blends standard e-commerce features with AI-powered user interaction.

---

## What This Project Is About

The repository contains a complete commerce application with two main parts:

1. Frontend
   - Built with React, Vite, Tailwind CSS, Redux Toolkit, and React Router.
   - Provides the customer-facing storefront, authentication pages, product pages, checkout flow, profile, seller pages, and admin pages.

2. Backend
   - Built with Node.js and Express.
   - Exposes REST APIs for authentication, products, orders, payments, seller applications, banners, flash sale, and voice features.
   - Uses MongoDB via Mongoose for persistence.

The application supports different user roles:

- Buyer
- Seller
- Admin

The backend also supports Google OAuth-based login and a voice command endpoint that uses Gemini to interpret shopper requests in English or Roman Urdu.

---

## Main Features

### Customer-facing Features
- Browse products by category
- Search and filter products
- Add products to cart
- Complete checkout with Stripe payment integration
- View orders and order status
- Track order pages
- Guest checkout support
- AI voice assistant for searching, navigation, and cart-related shopping actions

### Seller Features
- Seller application and admin approval request
- Seller dashboard and seller product management
- Seller-specific order visibility

### Admin Features
- Approve/reject seller applications
- Manage banners and flash sale settings
- Access order analytics and administrative order endpoints
- Manage products and seller content

### AI Features
- Gemini-powered voice intent understanding
- Natural-language shopping commands in English and Roman Urdu
- AI-based search and route interpretation for customer experience

---

## Technology Stack

### Frontend
- React 19
- Vite 6
- Tailwind CSS
- Redux Toolkit
- React Router
- Framer Motion
- Recharts
- Axios
- Lucide React
- React OAuth Google

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- JWT Authentication
- Stripe SDK
- Google Generative AI SDK
- Google Auth Library
- Multer
- Helmet
- CORS
- Express Rate Limit
- Express Mongo Sanitize
- Winston Logger

### External Integrations
- Google OAuth 2.0
- Google Gemini AI
- Stripe Checkout + Webhooks
- MongoDB Atlas or local MongoDB instance

---

## Project Structure

```text
smartshop-fyp-smartshop/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── scripts/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## Core Database Models / Schemas

### User Model
File: `backend/models/User.js`

Stores user-level information, including:
- `name`
- `email`
- `password`
- `role` (`buyer`, `seller_pending`, `seller`, `admin`)
- `sellerApplicationStatus`
- `sellerApplicationDate`
- `sellerApprovedDate`
- `sellerRejectionReason`
- `googleId`
- `avatar`

### Product Model
File: `backend/models/Product.js`

Stores product data, such as:
- `title`
- `description`
- `price`
- `category`
- `stock`
- `images`
- `reviews`
- `rating`
- `numReviews`
- `tags`
- `attributes`
- `user` reference

Important note: a text index is created on title, description, and tags for search support.

### Order Model
File: `backend/models/Order.js`

Stores order details:
- `user` or guest checkout information
- `guestName`, `guestEmail`, `guestPhone`, `guestAddress`
- `orderItems` with product and seller references
- `shippingAddress`
- `totalAmount`
- `status`
- `isPaid`
- `paidAt`

### Banner Model
File: `backend/models/Banner.js`

Used to store marketing or promotional banner content.

### Flash Sale Config Model
File: `backend/models/FlashSaleConfig.js`

Used to configure flash sale campaigns and related sale metadata.

---

## API Overview

The backend is mounted around the following route groups:

### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/auth/google` (Google auth flow endpoint)

### Products
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `GET /api/v1/products/category/:slug`
- `POST /api/v1/products` (seller/admin protected)
- `PUT /api/v1/products/:id` (admin protected)
- `DELETE /api/v1/products/:id` (admin protected)
- `POST /api/v1/products/:id/reviews`

### Orders
- `POST /api/v1/orders`
- `GET /api/v1/orders/myorders`
- `GET /api/v1/orders/:id`
- `PUT /api/v1/orders/:id/pay`
- `PUT /api/v1/orders/:id/deliver`
- `GET /api/v1/orders/stats` (admin)
- `GET /api/v1/orders/analytics` (admin)
- `GET /api/v1/orders/seller/my-orders` (seller)

### Payments
- `POST /api/payment/create-checkout-session`
- `GET /api/payment/config`
- `POST /api/payment/webhook`

### Voice / AI Assistant
- `POST /api/v1/voice/analyze`
- `POST /api/v1/voice/command`
- `GET /api/test-gemini`

### Seller Applications
- `POST /api/v1/seller-applications/apply`
- `GET /api/v1/seller-applications/status`
- `POST /api/v1/seller-applications/reapply`
- `GET /api/v1/seller-applications/` (admin)
- `PUT /api/v1/seller-applications/:userId/approve`
- `PUT /api/v1/seller-applications/:userId/reject`

### Banner / Flash Sale
- `GET /api/banners`
- `GET /api/banners/all` (admin)
- `POST /api/banners`
- `PUT /api/banners/:id`
- `DELETE /api/banners/:id`
- `GET /api/flash-sale`
- `PUT /api/flash-sale`

---

## Environment Variables (.env)

The backend uses environment variables from a `.env` file inside the `backend/` folder.

### Backend `.env` Example

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartshop
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Stripe
STRIPE_Secret_key=sk_test_your_stripe_secret_key
STRIPE_Publishable_key=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key
```

### Notes on the Variables

- `MONGO_URI` points to the MongoDB database used by the API
- `JWT_SECRET` secures user login tokens
- `FRONTEND_URL` is used for CORS and payment redirect URLs
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` enable Google OAuth login
- `GOOGLE_CALLBACK_URL` must match your Google OAuth callback route
- `STRIPE_Secret_key` is used server-side for Stripe checkout creation
- `STRIPE_Publishable_key` is exposed safely to the frontend for payment UI
- `STRIPE_WEBHOOK_SECRET` verifies Stripe webhook events
- `GEMINI_API_KEY` is required for AI voice and intent features

> Important: the project currently expects the backend `.env` file at `backend/.env` because `server.js` loads it from that directory.

---

## Recommended Development Setup

### 1. Clone the Repository

```bash
git clone <repo-url>
cd smatshop-fyp-smartshop
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Create the Backend `.env` File

Create `backend/.env` using the example above.

Make sure the following are active before starting:
- MongoDB server is running
- Google OAuth credentials are configured
- Stripe keys are available
- Gemini API key is valid

### 5. Start MongoDB

If you are using a local MongoDB instance:

```bash
mongod
```

Or use MongoDB Atlas with the appropriate connection string in `MONGO_URI`.

### 6. Start the Backend

From the `backend/` folder:

```bash
npm run dev
```

The backend server runs by default on:

- `http://localhost:5000`

### 7. Start the Frontend

From the `frontend/` folder:

```bash
npm run dev
```

The frontend dev server runs on:

- `http://localhost:5173`

---

## Useful Admin / Seed Scripts

The repository includes helper scripts for database setup and admin management.

### Seed Sample Data

From the `backend/` folder:

```bash
node scripts/seed.js
```

This is useful for populating the database with sample products and categories.

### Create Admin User

```bash
node scripts/createAdmin.js
```

### Promote Existing User to Admin

```bash
node scripts/promoteAdmin.js
```

---

## Production Notes

For production, the backend serves the built frontend from the `backend/public` folder when `NODE_ENV=production` is set.

You should also:
- Use a secure `JWT_SECRET`
- Use your real Stripe live keys in production
- Store credentials in a secure secret manager or deployment environment settings
- Use HTTPS and valid domain URLs in `FRONTEND_URL`, `GOOGLE_CALLBACK_URL`, and Stripe webhook settings

---

## Common Project Workflow

Typical development workflow:

1. Start MongoDB
2. Set up `backend/.env`
3. Run backend dev server
4. Run frontend dev server
5. Use Google OAuth and Stripe keys from your developer console
6. Seed data and create admin user when needed

---

## Summary

This repository is a complete e-commerce application with:
- React frontend
- Express + MongoDB backend
- Google auth integration
- Stripe checkout
- Gemini AI voice assistant
- role-based seller/admin architecture
- order and product management

It is ideal for showcasing a full-stack commerce platform with AI and payment workflows in one codebase.
