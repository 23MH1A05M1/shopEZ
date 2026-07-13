# ShopEZ — MERN E-Commerce Application

A full-stack e-commerce app built with **MongoDB, Express.js, React.js (Vite), and Node.js**.

Features:
- User registration/login with JWT authentication (roles: USER, ADMIN)
- Product catalog with search and category filtering
- Product detail pages
- Shopping cart (persisted in browser storage)
- Checkout that creates a real order and decrements stock
- Order history for users
- Admin dashboard: manage products (CRUD, with direct image file upload) and manage orders (update status)
- Customer reviews & star ratings on each product, with automatic average rating calculation

---

## 1. Prerequisites

Install these on your computer before you start:

1. **Node.js v18 or higher** — check with:
   ```
   node -v
   ```
   Download from https://nodejs.org if needed.

2. **MongoDB** — you have two options:
   - **Local MongoDB**: install MongoDB Community Server (https://www.mongodb.com/try/download/community) and make sure it's running on `mongodb://127.0.0.1:27017`.
   - **MongoDB Atlas (cloud, free tier)**: create a free cluster at https://www.mongodb.com/cloud/atlas and copy your connection string. This is the easiest option if you don't want to install MongoDB locally.

3. **npm** (comes bundled with Node.js).

---

## 2. Project Structure

```
ecommerce/
├── client/          React frontend (Vite)
│   ├── src/
│   │   ├── components/   Navbar, ProductCard, route guards
│   │   ├── pages/         Home, ProductDetail, Cart, Checkout, Login, Register,
│   │   │                  Orders, OrderDetail, AdminDashboard, AdminProducts, AdminOrders
│   │   ├── context/       AuthContext, CartContext
│   │   ├── services/      api.js (Axios instance)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/          Node + Express backend
│   ├── models/       User.js, Product.js, Order.js (Mongoose schemas)
│   ├── controllers/  authController.js, productController.js, orderController.js
│   ├── routes/        authRoutes.js, productRoutes.js, orderRoutes.js
│   ├── middleware/    auth.js (JWT + admin check), errorHandler.js
│   ├── config/         db.js (MongoDB connection)
│   ├── seed/           seedProducts.js (sample data + admin account)
│   ├── utils/           generateToken.js
│   ├── server.js       entry point
│   └── package.json
│
└── README.md (this file)
```

---

## 3. Backend Setup (server)

Open a terminal:

```bash
cd ecommerce/server
npm install
```

Now create your environment file:

```bash
cp .env.example .env
```

Open `.env` in a text editor and fill in the values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=replace_this_with_a_long_random_secret_string
NODE_ENV=development
```

- If you're using **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string, e.g.
  `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopez`
- `JWT_SECRET` can be any long random string (e.g. run `openssl rand -hex 32` in a terminal to generate one).

### Seed the database (optional but recommended)

This inserts 8 sample products and creates an admin account (`admin@shopez.com` / `admin123`):

```bash
npm run seed
```

### Start the backend server

```bash
npm run dev
```

You should see:
```
MongoDB Connected: <host>
Server running on port 5000
```

Verify it's working by visiting **http://localhost:5000/api/health** in your browser — you should see `{"status":"ok","message":"ShopEZ API is running"}`.

Leave this terminal running.

---

## 4. Frontend Setup (client)

Open a **second terminal** (keep the backend running in the first one):

```bash
cd ecommerce/client
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

The default value (`VITE_API_URL=http://localhost:5000/api`) already matches the backend, so you usually don't need to change it.

### Start the frontend

```bash
npm run dev
```

Vite will print a local URL, typically:
```
Local:   http://localhost:3000/
```

Open that URL in your browser. You should see the ShopEZ home page with the seeded products.

---

## 5. Using the App

- **Browse & search**: Home page lists products; use the search box and category dropdown to filter.
- **Register**: Create a normal user account via the Register page.
- **Add to cart / Checkout**: Add products to your cart, go to Cart, then Checkout — fill in shipping details and place the order (simulated "Cash on Delivery" payment).
- **My Orders**: View your order history and order details.
- **Reviews & Ratings**: On any product detail page, logged-in users can leave a star rating (1-5) and a written comment. One review per user per product. The product's average rating and review count update automatically and are also shown as a small star badge on product cards on the Home page.
- **Admin access**: Log in with `admin@shopez.com` / `admin123` (created by the seed script). You'll see an "Admin" link in the navbar leading to:
  - **Manage Products** — add, edit, delete products. Product images are uploaded directly from your computer (jpg, jpeg, png, webp, gif — up to 5MB) via the "Product Image" file picker in the form; a preview appears immediately, and the uploaded file is stored on the server in `server/uploads/` and served at `http://localhost:5000/uploads/<filename>`.
  - **Manage Orders** — view all customer orders and update their status (PENDING → PROCESSING → SHIPPED → DELIVERED, or CANCELLED).

---

## 6. Verifying Everything Works (quick checklist)

1. `GET http://localhost:5000/api/health` returns `{"status":"ok", ...}` ✅ backend is running and reachable.
2. Home page in the browser shows 8 sample products ✅ backend + frontend + database are connected.
3. Register a new account → you're logged in automatically ✅ auth works.
4. Add a product to cart → checkout → order appears under "My Orders" ✅ full order flow works.
5. Log out, log in as `admin@shopez.com` / `admin123` → "Admin" link appears → you can add/edit/delete a product ✅ role-based access works.

---

## 7. Building for Production

Frontend:
```bash
cd client
npm run build
```
This outputs static files to `client/dist/`, which you can deploy to any static host (Vercel, Netlify, Nginx, etc.) or serve via Express.

Backend: deploy `server/` to any Node host (Render, Railway, Heroku, a VPS, etc.), set the same environment variables from `.env` in that platform's dashboard, and point `VITE_API_URL` in the client's `.env` to your deployed backend URL before building the frontend.

---

## 8. Troubleshooting

| Problem | Likely fix |
|---|---|
| `MongoServerError` / connection refused | MongoDB isn't running locally, or your Atlas connection string/IP allowlist is wrong. |
| Frontend shows "Network Error" | Backend isn't running, or `VITE_API_URL` in `client/.env` doesn't match the backend's actual port. |
| `EADDRINUSE` on port 5000 or 3000 | Something else is already using that port — stop it, or change `PORT` in `server/.env` (and `VITE_API_URL` accordingly). |
| Login says "Invalid email or password" | Double-check you registered that email, or re-run `npm run seed` to recreate the admin account. |
| Admin link missing after login | You're logged in as a normal user, not the seeded admin account — log out and log in with `admin@shopez.com` / `admin123`. |

---

## 9. Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Axios, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (JWT), bcrypt.js for password hashing |
| File uploads | Multer (product images, stored in `server/uploads/`, served statically) |
| State | React Context API (Auth + Cart), localStorage for persistence |
