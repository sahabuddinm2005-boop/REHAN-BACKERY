import { Link } from 'react-router-dom'
import { Cake, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <Cake size={32} />
              <span>Rehan Bakery</span>
            </div>
            <p className="footer-description">
              Crafting delicious memories since 2010. Fresh artisan baked goods made with love and the finest ingredients.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=Cakes">Cakes</Link></li>
              <li><Link to="/products?category=Pastries">Pastries</Link></li>
              <li><Link to="/products?category=Breads">Breads</Link></li>
              <li><Link to="/products?category=Cookies">Cookies</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li>
                <MapPin size={18} />
                <span>123 Bakery Street, Sweet Town, ST 12345</span>
              </li>
              <li>
                <Phone size={18} />
                <span>(555) 123-4567</span>
              </li>
              <li>
                <Mail size={18} />
                <span>hello@rehanbakery.com</span>
              </li>
              <li>
                <Clock size={18} />
                <span>Mon-Sat: 7am - 8pm, Sun: 8am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Rehan Bakery Shop. All rights reserved.</p>
          <p>Made with love and fresh ingredients.</p>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--color-accent);
          color: var(--color-white);
          padding: 4rem 0 2rem;
          margin-top: auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
        }

        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
          }
        }

        .footer-section h4 {
          color: var(--color-white);
          font-size: 1.125rem;
          margin-bottom: 1.25rem;
          font-family: var(--font-heading);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .footer-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          color: var(--color-white);
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background-color: var(--color-primary);
          transform: translateY(-2px);
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--color-highlight);
        }

        .contact-list {
          list-style: none;
        }

        .contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .contact-list li svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--color-highlight);
        }

        .footer-bottom {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-bottom p {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </footer>
  )
}

export default Footer
