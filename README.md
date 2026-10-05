# Shopping Cart (React, state + localStorage only)

## Video walkthrough

**Video URL:** `PASTE_YOUR_PUBLIC_VIDEO_LINK_HERE`

## Run it

```bash
npm install
npm run dev
npm run build
```

## Requirements covered

| Requirement | Where |
|---|---|
| Product list (hardcoded) | `src/products.js`, rendered in `App.jsx` |
| Add to Cart | `addToCart` (adds, or increases quantity if already in cart) |
| Remove from Cart | `removeFromCart` |
| Increment / decrement | `increment`, `decrement` |
| Total price | `totalPrice` computed with `reduce` on every render |
| No negative quantities | `decrement` uses `Math.max(1, qty - 1)` and the minus button is disabled at 1. Removing is the way to reach zero. Saved data is also validated on load |
| React state only | `useState` and `useEffect`, no Redux or other libraries |
| localStorage persistence | Cart is loaded once on start (`loadCart`) and saved in a `useEffect` after every change |
| UI updates after every action | All values are derived from the `cart` state, so React re-renders automatically |
