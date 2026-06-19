import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, tax, total, itemCount } = useCart()
  const { isAuthenticated } = useAuth()

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-header">
          <h1>Shopping Cart</h1>
        </div>
        <div className="container">
          <div className="empty-state">
            <ShoppingBag size={80} />
            <h3>Your Cart is Empty</h3>
            <p>Looks like you have not added anything to your cart yet. Browse our delicious products and find something you will love!</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1>Shopping Cart</h1>
      </div>

      <div className="container">
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</span>
              <button onClick={clearCart} className="clear-cart-btn">
                <Trash2 size={16} />
                Clear Cart
              </button>
            </div>

            {items.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="quantity-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {isAuthenticated ? (
              <Link to="/checkout" className="btn btn-highlight btn-lg w-full">
                Proceed to Checkout
                <ArrowRight size={20} />
              </Link>
            ) : (
              <div className="checkout-auth">
                <p>Please login to checkout</p>
                <Link to="/login" className="btn btn-primary w-full">
                  Login to Continue
                </Link>
                <p className="register-link">
                  Do not have an account? <Link to="/register">Register</Link>
                </p>
              </div>
            )}

            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page {
          padding-bottom: 4rem;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .cart-layout {
            grid-template-columns: 1fr 380px;
          }
        }

        .cart-items {
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          font-weight: 500;
        }

        .clear-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: var(--color-error);
          background: none;
          border: 1px solid var(--color-error);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-cart-btn:hover {
          background-color: var(--color-error);
          color: var(--color-white);
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .cart-item-details {
          flex: 1;
          min-width: 0;
        }

        .cart-item-details h3 {
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cart-item-category {
          color: var(--color-text-light);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .cart-item-price {
          font-weight: 600;
          color: var(--color-primary);
          margin: 0;
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }

        .quantity-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text);
          transition: background-color 0.2s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background-color: var(--color-secondary);
        }

        .quantity-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .quantity-value {
          width: 48px;
          text-align: center;
          font-weight: 600;
        }

        .item-total {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-accent);
          min-width: 80px;
          text-align: right;
        }

        .remove-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          color: var(--color-text-light);
          cursor: pointer;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background-color: #FEE2E2;
          color: var(--color-error);
        }

        @media (max-width: 768px) {
          .cart-item {
            flex-wrap: wrap;
          }

          .cart-item-details {
            flex: 1 1 calc(100% - 116px);
          }

          .cart-item-actions {
            flex: 1 1 100%;
            justify-content: space-between;
            margin-top: 1rem;
          }
        }

        /* Order Summary */
        .order-summary {
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .order-summary h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          color: var(--color-text-light);
        }

        .summary-row.total {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-accent);
          padding-top: 1rem;
          margin-top: 1rem;
          border-top: 2px solid var(--color-border);
        }

        .order-summary .btn {
          margin-top: 1.5rem;
        }

        .checkout-auth {
          margin-top: 1.5rem;
          text-align: center;
        }

        .checkout-auth p {
          color: var(--color-text-light);
          margin-bottom: 1rem;
        }

        .register-link {
          margin-top: 1rem;
          font-size: 0.875rem;
        }

        .register-link a {
          color: var(--color-primary);
          font-weight: 600;
        }

        .continue-shopping {
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          color: var(--color-primary);
          font-weight: 500;
        }

        .continue-shopping:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default Cart
