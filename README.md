# ShopKart

ShopKart is a full-stack ecommerce frontend/backend project created for the engineering lab sequence. It includes customer authentication, product discovery, and wishlist management.

## Tech Stack

- Frontend: React + Vite + JavaScript
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT via HTTP-only cookies

## Project Structure

- `backend/` — Express API, MongoDB models, routes, and controllers
- `frontend/` — React frontend for authentication, product browsing, and wishlist UI

## Setup

1. Copy the environment example files and fill in your local values:
   - `backend/.env.example` → `backend/.env`
   - `frontend/.env.example` → `frontend/.env`

2. Install dependencies:
   - `cd backend && npm install`
   - `cd frontend && npm install`

3. Start the backend:
   - `cd backend && npm start`

4. Start the frontend:
   - `cd frontend && npm run dev -- --host 0.0.0.0`

5. Open the app in the browser at:
   - `http://localhost:5174`

## Notes

- The backend API runs on port `5000` by default.
- The frontend expects `VITE_API_URL` to point to the backend server.
- Actual secrets should never be committed to GitHub; use local `.env` files only.
