import products from "../data/products.json";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LockedContent from "../components/ui/LockedContent";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LanguageContext";
import { formatPrice } from "../lib/constants";
import useReveal from "../hooks/useReveal";

import "./Cart.css";

const CART_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3.5 4h2l1.8 10.1a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 1.9-1.5L21 7H7" />
    <circle cx="9.5" cy="19" r="1.2" />
    <circle cx="17" cy="19" r="1.2" />
  </svg>
);

export default function Cart() {
  const { t, tProduct, tUnit } = useLang();
  const { isAuthenticated, loading } = useAuth();
  const { items, count, setQty, removeItem, clear } = useCart();

  useReveal([isAuthenticated, loading, items.length]);

  const lines = items
    .map((item) => ({
      ...item,
      product: products.find((product) => product.slug === item.slug),
    }))
    .filter((line) => line.product);

  /* Total per store (only stores that sell every product are comparable) */
  const stores = [
    ...new Set(
      lines.flatMap((line) => line.product.prices.map((p) => p.store))
    ),
  ];

  const storeTotals = stores
    .map((store) => {
      let total = 0;
      let available = 0;

      lines.forEach((line) => {
        const entry = line.product.prices.find((p) => p.store === store);
        if (entry) {
          total += Number(entry.price) * line.qty;
          available += 1;
        }
      });

      return { store, total, complete: available === lines.length };
    })
    .sort((a, b) => a.total - b.total);

  const comparable = storeTotals.filter((entry) => entry.complete);
  const cheapest = comparable[0];
  const priciest = comparable[comparable.length - 1];
  const savings =
    cheapest && priciest ? priciest.total - cheapest.total : 0;

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-main">
        <div className="cart-container">
          {/* Page header */}
          <div className="cart-heading">
            <div className="cart-heading-icon">{CART_ICON}</div>

            <div>
              <h1>{t("cart.title")}</h1>
              <p>{t("cart.subtitle")}</p>
            </div>
          </div>

          {!loading && !isAuthenticated ? (
            <LockedContent compact />
          ) : lines.length === 0 ? (
            <section className="cart-empty reveal">
              <div className="cart-empty-icon">{CART_ICON}</div>

              <h2>{t("cart.emptyTitle")}</h2>
              <p>{t("cart.emptyText")}</p>

              <a href="/" className="cart-empty-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>

                <span>{t("cart.start")}</span>
              </a>
            </section>
          ) : (
            <div className="cart-layout">
              {/* Items */}
              <section className="cart-items">
                {lines.map((line, index) => {
                  const cheapestPrice = Math.min(
                    ...line.product.prices.map((p) => Number(p.price))
                  );

                  return (
                    <article
                      className="cart-item reveal"
                      key={line.slug}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <a href={`/product/${line.slug}`}>
                        <img
                          src={line.product.image}
                          alt={tProduct(line.product, "name")}
                          className="cart-item-image"
                        />
                      </a>

                      <div className="cart-item-info">
                        <a
                          href={`/product/${line.slug}`}
                          className="cart-item-name"
                        >
                          {tProduct(line.product, "name")}
                        </a>
                        <span className="cart-item-unit">
                          {tUnit(line.product.unit)} ·{" "}
                          {formatPrice(cheapestPrice)}
                        </span>
                      </div>

                      <div className="cart-qty">
                        <button
                          type="button"
                          onClick={() => setQty(line.slug, line.qty - 1)}
                          aria-label="-"
                        >
                          −
                        </button>
                        <span key={line.qty}>{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.slug, line.qty + 1)}
                          aria-label="+"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => removeItem(line.slug)}
                      >
                        {t("cart.remove")}
                      </button>
                    </article>
                  );
                })}

                <button
                  type="button"
                  className="cart-clear"
                  onClick={clear}
                >
                  {t("cart.clear")} ({t("cart.items", { n: count })})
                </button>
              </section>

              {/* Totals per store */}
              <aside className="cart-summary reveal">
                <h2>{t("cart.compare")}</h2>

                {storeTotals.map((entry) => (
                  <div
                    key={entry.store}
                    className={`cart-store-row ${
                      cheapest?.store === entry.store ? "best" : ""
                    } ${entry.complete ? "" : "partial"}`}
                  >
                    <span>{entry.store}</span>
                    <strong>{formatPrice(entry.total)}</strong>
                  </div>
                ))}

                {cheapest && (
                  <div className="cart-best">
                    <span>{t("cart.cheapestStore")}</span>
                    <strong>
                      {cheapest.store} — {formatPrice(cheapest.total)}
                    </strong>
                  </div>
                )}

                {savings > 0 && (
                  <p className="cart-savings">
                    💚 {t("cart.youSave")}: {formatPrice(savings)}
                  </p>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
