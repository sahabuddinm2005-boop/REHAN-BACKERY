import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { placeOrder } from '../api/api'
import { CheckCircle, ArrowLeft, CreditCard, Banknote, Wallet } from 'lucide-react'

function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, tax, total, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'Credit Card',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart')
      return
    }
    // Pre-fill user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }))
    }
  }, [isAuthenticated, items, user, navigate, orderPlaced])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const orderData = {
        user_id: user?.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        payment_method: formData.paymentMethod,
        notes: formData.notes,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      }

      const response = await placeOrder(orderData)
      
      if (response.success) {
        setOrderId(response.order_id)
        setOrderPlaced(true)
        clearCart()
      } else {
        setErrors({ submit: response.message || 'Failed to place order' })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to place order. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const paymentMethods = [
    { value: 'Credit Card', icon: CreditCard, label: 'Credit Card' },
    { value: 'Cash on Delivery', icon: Banknote, label: 'Cash on Delivery' },
    { value: 'PayPal', icon: Wallet, label: 'PayPal' }
  ]

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <CheckCircle size={80} className="success-icon" />
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your order. We have received your order and will process it soon.</p>
            <div className="order-details-box">
              <p><strong>Order ID:</strong> #{orderId}</p>
              <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {formData.paymentMethod}</p>
            </div>
            <p className="confirmation-email">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>
            <div className="success-actions">
              <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
              <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="page-header">
        <h1>Checkout</h1>
      </div>

      <div className="container">
        <Link to="/cart" className="back-link">
          <ArrowLeft size={20} />
          Back to Cart
        </Link>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h2>Delivery Information</h2>
              
              {errors.submit && (
                <div className="alert alert-error">{errors.submit}</div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Enter your full delivery address"
                  rows={3}
                />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>

              <h2>Payment Method</h2>
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <label
                    key={method.value}
                    className={`payment-option ${formData.paymentMethod === method.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <method.icon size={24} />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Any special instructions for your order?"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="btn btn-highlight btn-lg w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} className="summary-item-image" />
                  <div className="summary-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="summary-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
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
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page {
          padding-bottom: 4rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          color: var(--color-primary);
          font-weight: 500;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .checkout-layout {
            grid-template-columns: 1fr 400px;
          }
        }

        .checkout-form-container {
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 2rem;
        }

        .checkout-form h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-border);
        }

        .checkout-form h2:not(:first-child) {
          margin-top: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .form-grid .form-group:first-child {
            grid-column: span 2;
          }
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 640px) {
          .payment-methods {
            grid-template-columns: 1fr;
          }
        }

        .payment-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem 1rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .payment-option:hover {
          border-color: var(--color-primary);
        }

        .payment-option.selected {
          border-color: var(--color-primary);
          background-color: rgba(139, 69, 19, 0.05);
        }

        .payment-option svg {
          color: var(--color-primary);
        }

        .payment-option span {
          font-weight: 500;
          font-size: 0.875rem;
        }

        /* Order Summary */
        .checkout-summary {
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .checkout-summary h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-border);
        }

        .summary-items {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 1.5rem;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border);
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .summary-item-details {
          flex: 1;
        }

        .summary-item-details h4 {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .summary-item-details p {
          font-size: 0.75rem;
          color: var(--color-text-light);
          margin: 0;
        }

        .summary-item-price {
          font-weight: 600;
          color: var(--color-accent);
        }

        .summary-totals {
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          color: var(--color-text-light);
        }

        .summary-row.total {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-accent);
          padding-top: 0.75rem;
          margin-top: 0.75rem;
          border-top: 2px solid var(--color-border);
        }

        /* Order Success */
        .order-success {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .success-icon {
          color: var(--color-success);
          margin-bottom: 1.5rem;
        }

        .order-success h1 {
          margin-bottom: 1rem;
        }

        .order-success > p {
          color: var(--color-text-light);
          margin-bottom: 2rem;
        }

        .order-details-box {
          background-color: var(--color-white);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .order-details-box p {
          margin-bottom: 0.5rem;
        }

        .order-details-box p:last-child {
          margin-bottom: 0;
        }

        .confirmation-email {
          color: var(--color-text-light);
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  )
}

export default Checkout
