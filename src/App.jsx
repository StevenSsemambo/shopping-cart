import { useEffect, useState } from "react";
import { PRODUCTS } from "./products.js";

const STORAGE_KEY = "shopping-cart:v1";

// Read the saved cart once, when the app first loads.
// Wrapped in try/catch because localStorage can throw or hold bad JSON.
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Keep only valid entries with a positive whole-number quantity.
    return parsed.filter(
      (item) => item && Number.isInteger(item.qty) && item.qty > 0 && item.id && item.price >= 0
    );
  } catch {
    return [];
  }
}

const money = (n) => `$${n.toFixed(2)}`;

export default function App() {
  // Cart is an array of { id, name, price, emoji, qty }.
  const [cart, setCart] = useState(loadCart);

  // Persist after every change to the cart.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* storage full or blocked: app still works in memory */
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const increment = (id) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  // Decrementing never goes below 1. To go to zero the user removes the item,
  // so a negative (or zero) quantity can never exist in state.
  const decrement = (id) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="app">
      <header className="header">
        <h1>Shop</h1>
        <span className="badge" aria-label={`${totalItems} items in cart`}>
          🛒 {totalItems}
        </span>
      </header>

      <main className="layout">
        <section aria-labelledby="products-title">
          <h2 id="products-title">Products</h2>
          <div className="grid">
            {PRODUCTS.map((p) => {
              const inCart = cart.find((i) => i.id === p.id);
              return (
                <article className="card" key={p.id}>
                  <div className="emoji" aria-hidden="true">{p.emoji}</div>
                  <h3>{p.name}</h3>
                  <p className="price">{money(p.price)}</p>
                  <button className="btn primary" onClick={() => addToCart(p)}>
                    {inCart ? `Add another (${inCart.qty} in cart)` : "Add to Cart"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="cart" aria-labelledby="cart-title">
          <h2 id="cart-title">Your Cart</h2>

          {cart.length === 0 ? (
            <p className="empty">Your cart is empty.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item) => (
                  <li className="cart-item" key={item.id}>
                    <div className="cart-info">
                      <strong>{item.emoji} {item.name}</strong>
                      <span>{money(item.price)} each</span>
                    </div>
                    <div className="qty">
                      <button
                        className="btn small"
                        onClick={() => decrement(item.id)}
                        disabled={item.qty <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>
                      <span className="qty-num">{item.qty}</span>
                      <button
                        className="btn small"
                        onClick={() => increment(item.id)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <div className="line-total">{money(item.price * item.qty)}</div>
                    <button
                      className="btn danger small"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="total">
                <span>Total ({totalItems} items)</span>
                <strong>{money(totalPrice)}</strong>
              </div>
              <button className="btn ghost" onClick={clearCart}>Clear cart</button>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
