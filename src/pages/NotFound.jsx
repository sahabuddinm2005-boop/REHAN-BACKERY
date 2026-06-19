import { Link } from 'react-router-dom'
import { AlertTriangle, Home, ShoppingBag } from 'lucide-react'

function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon"><AlertTriangle size={56} /></div>
        <p className="error-code">404</p>
        <h1>Page Not Found</h1>
        <p className="not-found-text">
          Sorry, jis page ko aap open kar rahe hain wo available nahi hai. Home page ya products page par wapas ja sakte hain.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary"><Home size={18} /> Go Home</Link>
          <Link to="/products" className="btn btn-secondary"><ShoppingBag size={18} /> View Products</Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound
