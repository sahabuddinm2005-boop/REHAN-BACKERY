import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setQuantity(1)
    }, 1500)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  const isOutOfStock = product.stock === 0 || product.status === 'unavailable'

  return (
    <article className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <span className="product-category">{product.category}</span>
        {isOutOfStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>
          
          {!isOutOfStock && (
            <div className="product-actions">
              <div className="quantity-selector">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className={`add-to-cart-btn ${added ? 'added' : ''}`}
                disabled={added}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {!isOutOfStock && product.stock <= 5 && (
          <p className="low-stock-warning">Only {product.stock} left in stock!</p>
        )}
      </div>

      <style>{`
        .product-card {
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .product-image-container {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 0.25rem 0.75rem;
          background-color: var(--color-primary);
          color: var(--color-white);
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .out-of-stock-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .out-of-stock-overlay span {
          background-color: var(--color-error);
          color: var(--color-white);
          padding: 0.5rem 1rem;
          font-weight: 600;
          border-radius: var(--radius-md);
        }

        .product-content {
          padding: 1.25rem;
        }

        .product-name {
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .product-description {
          color: var(--color-text-light);
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-price {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .product-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .quantity-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
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
          width: 40px;
          text-align: center;
          font-weight: 600;
        }

        .add-to-cart-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: var(--color-highlight);
          color: var(--color-white);
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          background-color: #E07B00;
        }

        .add-to-cart-btn.added {
          background-color: var(--color-success);
        }

        .add-to-cart-btn:disabled {
          cursor: default;
        }

        .low-stock-warning {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: var(--color-error);
          font-weight: 500;
        }
      `}</style>
    </article>
  )
}

export default ProductCard
