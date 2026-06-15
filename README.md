# 🧃 Quirky Fruity

A vibrant, full-stack e-commerce web application for a fictional fruit juice brand — built with the MERN stack (MongoDB, Express, React, Node.js). Features user authentication, product catalog, cart management, order placement, and a playful UI.

## ✨ Features

### 🛒 Shopping
- Browse juice products with dynamic image assets
- Add/remove items from cart with real-time quantity controls
- Cart persists across sessions via `localStorage`
- Guest users see "LOGIN TO BUY" — authenticated users get +/- controls

### 🔐 Authentication
- Login / Signup with JWT (stored in `localStorage`)
- Forgot / Reset password flow (simplified, no email required)
- Profile page with name & password editing
- 401 interceptor auto-clears expired tokens

### 📦 Orders
- Place orders with automatic stock validation & deduction
- View past orders with status badges (pending / confirmed / shipped / delivered)
- Order count displayed on profile

### 📬 Newsletter
- Subscription form with name, email, subject, and message fields
- Duplicate email detection with user-friendly error

### 🎨 Frontend
- **React 19** + **Vite 8** — blazing fast HMR & builds
- **MUI** (Material UI) — icons, snackbar toasts, badges
- **React Router v7** — SPA routing with scroll-to-section navigation
- Fully responsive — mobile hamburger menu, desktop nav with shrink-on-scroll
- IntersectionObserver-driven active section highlighting
- Styled with a playful, colorful identity (Poppins font, custom CSS variables)

### ⚙️ Backend
- **Express** REST API with ES modules
- **Mongoose** ODM — models for User, Product, Order, NewsletterSubscriber
- **JWT** authentication middleware
- **bcryptjs** — password hashing with 12 salt rounds
- **Supertest + Jest** — 19 integration tests covering all endpoints

## 🗂️ Project Structure

```
QUIRKY-FRUITY/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile, forgot/reset password
│   │   ├── orderController.js     # Create, list, count orders (auto-stock deduction)
│   │   ├── productController.js   # List all / get by ID
│   │   └── newsletterController.js # Subscribe with duplicate handling
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verify + protect middleware
│   ├── models/
│   │   ├── User.js                # bcrypt pre-save hook, password comparison
│   │   ├── Product.js             # Custom sequential ID, stock field
│   │   ├── Order.js               # Embedded items, status enum, user ref
│   │   └── NewsletterSubscriber.js # Unique email constraint
│   ├── routes/
│   │   ├── auth.js, orders.js, products.js, newsletter.js
│   ├── app.js                     # Express app, CORS, DB connection with syncIndexes
│   ├── server.js                  # Entry point — listens on PORT
│   ├── seed.js                    # Seeds 3 products (Orange, Pineapple, Papaya Juice)
│   └── api.test.js                # 19 integration tests
│
├── Frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # JWT state, login/register/logout/forgot/reset
│   │   │   └── CartContext.jsx    # localStorage-persisted cart
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── Navbar/            # Shrink-on-scroll, mobile menu, section observer
│   │   │   ├── AuthModal/         # 4-in-1: Login / Signup / Forgot / Reset
│   │   │   ├── CheckoutModal/     # Cart review, quantity adjust, place order
│   │   │   └── ProductCard/       # Conditional guest/auth buttons
│   │   ├── Pages/
│   │   │   ├── Homepage.jsx       # Full landing page with 10+ sections
│   │   │   ├── ProfilePage.jsx    # Name/password edit, order count, logout
│   │   │   └── OrdersPage.jsx     # Past orders with status badges
│   │   └── App.jsx                # Router, providers, modals, toast
│   └── vite.config.js             # Dev proxy /api → localhost:5000
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install
```bash
git clone https://github.com/qaz-safiullah/QUIRKY-FRUITY.git
cd QUIRKY-FRUITY

# Install backend
cd backend
npm install

# Install frontend
cd ../Frontend
npm install
```

### 2. Environment Variables

**`backend/.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=*                                      # Set to your frontend URL in production
```

**`Frontend/.env`** (dev only — Vite proxy handles `/api`)
```env
VITE_API_URL=                                       # Leave empty in dev; set to Railway URL in production
```

### 3. Seed the Database
```bash
cd backend
npm run seed
```
Inserts 3 products: Orange Juice, Pineapple Juice, Papaya Juice.

### 4. Run Development Servers
```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd Frontend
npm run dev
```

Visit `http://localhost:5173` — the Vite dev server proxies `/api` requests to the backend.

### 5. Run Tests
```bash
cd backend
npm test
```
19 tests covering authentication, orders, products, and newsletter endpoints.

## 🚢 Deployment

### Backend → Railway
1. Push the repo to GitHub
2. Go to [Railway](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Railway auto-detects Node.js and runs `npm start`
4. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`

### Frontend → Vercel
1. Go to [Vercel](https://vercel.com) → **Add New Project** → import repo
2. Set **Root Directory** to `Frontend`
3. Set environment variable: `VITE_API_URL` = your Railway URL (no trailing slash)
4. Vercel auto-detects Vite — deploys instantly

> **Note:** The `vercel.json` at the frontend root ensures SPA client-side routing works on all paths.

## 🧪 API Endpoints

| Method | Endpoint                    | Auth     | Description                    |
|--------|-----------------------------|----------|--------------------------------|
| GET    | `/api/products`             | ❌       | List all products              |
| GET    | `/api/products/:id`         | ❌       | Get product by ID              |
| POST   | `/api/users/register`       | ❌       | Create account                 |
| POST   | `/api/users/login`          | ❌       | Login, returns JWT             |
| GET    | `/api/users/profile`        | ✅ Bearer | Get profile                   |
| PUT    | `/api/users/profile`        | ✅ Bearer | Update name/password          |
| POST   | `/api/users/forgot-password`| ❌       | Check if email exists          |
| POST   | `/api/users/reset-password` | ❌       | Reset password by email        |
| POST   | `/api/orders`               | ✅ Bearer | Create order (auto stock dec)  |
| GET    | `/api/orders/myorders`      | ✅ Bearer | List user orders              |
| GET    | `/api/orders/count`         | ✅ Bearer | Get user order count          |
| POST   | `/api/newsletter`           | ❌       | Subscribe to newsletter        |
| GET    | `/api/health`               | ❌       | Health check                   |

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| **Frontend** | React 19, Vite 8, MUI 7, React Router 7, Axios |
| **Backend**  | Express 4, Mongoose 8, JWT, bcryptjs            |
| **Database** | MongoDB Atlas                                   |
| **Testing**  | Jest 30, Supertest 7                            |
| **Deploy**   | Vercel (frontend), Railway (backend)            |

## 📸 Screenshots

> *Coming soon — add screenshots of the homepage, product cards, checkout modal, profile page, and orders page.*
