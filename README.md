
```md
# Product Admin Dashboard

A responsive Product Admin Dashboard built with **React, JavaScript, Vite, Tailwind CSS, and Axios**, using the DummyJSON API.

**Live demo:** https://admindashboard-rust-two.vercel.app

---

## 🚀 Features

* 🔐 Login and logout using DummyJSON authentication.
* 📦 View products in a responsive table/cards layout.
* 🔎 Debounced product search.
* 🗂️ Filter products by category.
* ↕️ Sort products by title, price, and rating.
* 📄 Pagination with 10, 20, and 50 items per page.
* 👁️ View detailed product information.
* ➕ Add new products with validation.
* ✏️ Edit existing products.
* 🗑️ Delete products with confirmation.
* ⏳ Loading, empty, and error states.
* 🔗 Search, filter, sorting, and pagination stored in URL.
* 📱 Fully responsive for desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

* **React** – UI development.
* **JavaScript** – Application logic.
* **Vite** – Development server and bundler.
* **React Router** – Client-side routing.
* **Tailwind CSS** – Responsive styling.
* **Axios** – API communication.
* **DummyJSON** – Product and authentication API.

---

## ▶️ Installation

Clone the repository:

```bash
git clone https://github.com/vishal14marathe/admindashboard.git
cd admindashboard
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
echo "VITE_API_URL=https://dummyjson.com" > .env
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173.

Node.js 18 or newer is required.

---

## 🔑 Login

Use the DummyJSON test credentials:

```text
Username: emilys
Password: emilyspass
```

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── AuthGuard.jsx
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── Filters.jsx
│   ├── ProductTable.jsx
│   ├── ProductCards.jsx
│   ├── Pagination.jsx
│   ├── ProductForm.jsx
│   ├── ConfirmDialog.jsx
│   ├── Stars.jsx
│   ├── Loader.jsx
│   ├── EmptyState.jsx
│   └── ErrorState.jsx
├── context/AuthContext.jsx
├── hooks/
│   ├── useDebounce.js
│   └── useUrlState.js
├── lib/
│   ├── axios.js
│   └── auth.js
├── pages/
│   ├── Login.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── ProductNew.jsx
│   ├── ProductEdit.jsx
│   └── NotFound.jsx
├── services/
│   ├── authService.js
│   └── productService.js
├── store/productOverlay.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 📡 API Endpoints Used

```text
POST   /auth/login
GET    /products
GET    /products/search?q=
GET    /products/{id}
GET    /products/categories
```

Base URL: `https://dummyjson.com`

---

## 🧠 Design Choices

A few decisions shaped how the app works:

**URL as the single source of truth.** Page number, limit, search query, category, and sort are kept in the query string. Refreshing or sharing the URL reproduces the same view, and the browser back/forward buttons work as expected. `useUrlState` wraps `URLSearchParams` so components never touch it directly.

**One Axios instance.** `src/lib/axios.js` creates a single client with a base URL from `VITE_API_URL` and two interceptors. One adds the auth token to outgoing requests. The other handles 401 responses centrally and redirects to `/login`. No component has to attach the token itself.

**Debounced search with a race guard.** The search input waits 500ms after the last keystroke before hitting the API, and every product request carries a monotonically increasing id. If an older request resolves after a newer one, its response is dropped. Fast typing never shows a stale result.

**Search and category don't mix.** DummyJSON serves `/products/search?q=` and `/products/category/:slug` from different endpoints, and neither accepts the other's filter. Instead of silently ignoring one, the category dropdown is disabled while a search is active, and a hint tells the user to clear the search. It's the least surprising behavior and makes the limitation visible instead of hidden.

**Invalid URL params don't crash the page.** `?page=abc` falls back to page 1, `?page=999` renders the empty state instead of throwing, and `?limit=999` clamps to one of the allowed sizes (10/20/50).

**Double-click protection.** Every submit handler (login, save, delete) checks its own loading flag and bails out if a request is already in flight. The button is also disabled during the request.

---

## 🔗 URL State

Search, category, sorting, page, and page size are all stored in the URL. Example:

```text
/products?page=2&limit=20&search=phone
```

Sharing this link reproduces exactly the same view.

---

## ⚡ Race Condition Handling

Fast typing could cause an older search response to arrive after a newer one and overwrite the correct data. This is fixed with a `useRef` counter in `Products.jsx`:

```js
const requestIdRef = useRef(0);

const loadProducts = useCallback(async () => {
  const requestId = ++requestIdRef.current;
  const data = await getProducts({ ... });
  if (requestId !== requestIdRef.current) return; // stale, drop it
  setProducts(data.products);
}, [/* deps */]);
```

Combined with a 500ms debounce on the search input, the UI always reflects the last query the user typed.

This was tested with `&delay=2000` added to the search endpoint to force out-of-order responses.

---

## 🧩 Add, Edit, and Delete

DummyJSON's write endpoints (`POST`, `PUT`, `DELETE`) return canned responses and don't actually persist anything. To make the UI feel real:

* All mutations are stored in a small **localStorage overlay** (`src/store/productOverlay.js`) with three buckets: `added`, `edited`, and `deleted`.
* On every product fetch, the API response is merged with the overlay before rendering.
* Changes survive a page refresh and look real to the user, while the actual API is untouched.
* The overlay uses a safe `write()` that catches `QuotaExceededError` and trims the oldest added product if storage fills up (base64 images can be large).

---

## ⏳ Loading, 📭 Empty, and ⚠️ Error States

* A centered loader shows while a request is in flight.
* An empty state renders when no products match the current search or filters.
* An error state with a **Retry** button appears when a request fails.

---

## 📱 Responsive Design

Desktop uses a full table (image, title, category, price, rating, stock, actions). Below the `md` breakpoint, the table is replaced with stacked product cards. The layout supports desktop, tablet, and mobile.

---

## 🤖 AI Usage

AI tools were used for two things:

1. **Scaffolding boilerplate** — the Axios interceptors, the `useDebounce` hook, and the pagination ellipsis logic. All generated code was reviewed and adapted to fit the URL-state pattern this app uses.
2. **Edge case sanity checks** — `page=999`, `limit=999`, the stale-search race, and double-submit guards. That surfaced a couple of subtle bugs early.

Every line in the repo is code I understand and can explain.

---

## 🚀 Deployment

Deployed on Vercel:

```text
https://admindashboard-rust-two.vercel.app
```

For SPA routing on Vercel, add a `vercel.json` in the project root so that any deep link serves `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 👨‍💻 Author

**Vishal Marathe**

B.Tech Computer Science & Engineering

GitHub: https://github.com/vishal14marathe
```

## Commit it

```bash
git add README.md
git commit -m "docs: add README with setup, features, and design notes"
git push origin main
```

