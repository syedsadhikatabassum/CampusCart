# CampusCart

A frontend stationery shop for school and college students, built with React. There is no database and no account server. The app opens on the login page. The shop stays hidden until that browser has a login. Product data is loaded with Axios. Each student's cart, wishlist, budget and profile stay with that login.

## Run

```bash
npm install
npm run dev
```

Open the local address Vite prints, usually `http://localhost:5173`.

## What it uses

- React components for each part of the store
- `useState` for the cart, wishlist, search, theme, budget and forms
- Axios to fetch `public/products.json`
- React Router for Home, Shop, Categories, Product, Wishlist, Cart, Checkout, Budget, About, Login, Register and Account

Accounts, carts and orders are stored in `localStorage`, one bag per login. Nothing is sent to a server. Signing out returns to the login page.
