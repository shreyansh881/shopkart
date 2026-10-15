# ShopKart

ShopKart is a full-stack e-commerce application that lets users browse products, add items to a wishlist or cart, register and log in securely, and complete checkout with Razorpay. The application is built with a React frontend and an Express + MongoDB backend.

## Features

- Customer registration and login
- JWT-based authentication using HTTP-only cookies
- Product catalog and product detail pages
- Wishlist management
- Cart management with quantity updates
- Order creation and payment verification with Razorpay
- Order history and order detail pages

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT + cookie-based session handling
- Payments: Razorpay

## Project Structure

```text
shopkart/
├── backend/                  # Express API and MongoDB models
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── seedProducts.js
├── frontend/                 # React application
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── README.md                 # Project overview and setup guide
└── .gitignore
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ and npm
- A MongoDB instance or MongoDB Atlas connection string
- Razorpay test keys for sandbox payments

## Environment Setup

Create your local environment files from the provided examples.

On Windows PowerShell:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

On macOS/Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in the values in each `.env` file.

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopkart
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=replace_with_your_test_secret
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

## Installation

Install both app dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Running the App

### 1) Start the backend

```bash
cd backend
npm run dev
```

The backend starts on `http://localhost:5000` by default.

### 2) Seed sample products

Open a second terminal and run:

```bash
cd backend
node seedProducts.js
```

This inserts sample products into MongoDB so the storefront has data to display.

### 3) Start the frontend

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

The frontend is usually available at:

```text
http://localhost:5173
```

## Core API Endpoints

The backend exposes these main routes:

### Authentication

- `POST /customers/register` — register a new customer
- `POST /customers/login` — log in and receive a JWT cookie
- `GET /customers/me` — fetch logged-in customer profile
- `POST /customers/logout` — clear the authentication cookie
- `PATCH /customers/change-password` — update password

### Products

- `GET /products` — get all products
- `GET /products/:id` — get a single product
- `POST /products` — create a product

### Wishlist

- `POST /wishlist/:productId` — add product to wishlist
- `GET /wishlist` — get wishlist items
- `DELETE /wishlist/:productId` — remove product from wishlist

### Cart

- `GET /cart` — get cart items
- `POST /cart/:productId` — add product to cart
- `PATCH /cart/:productId` — update product quantity
- `DELETE /cart/:productId` — remove product from cart

### Orders and Payment

- `POST /orders/create-payment-order` — create Razorpay order
- `POST /orders/verify-payment` — verify Razorpay payment
- `GET /orders` — fetch all user orders
- `GET /orders/:id` — fetch a specific order

## Notes

- The backend uses `JWT_SECRET` to sign auth tokens.
- Payment integration is configured for Razorpay sandbox credentials.
- Do not commit real secrets to version control; keep values in local `.env` files.
- For backend-specific API details and auth behavior, see [backend/README.md](backend/README.md).

## License

This project does not include a formal license file at the repository root. If you plan to reuse or distribute it, confirm the intended licensing terms with the repository owner before doing so.

