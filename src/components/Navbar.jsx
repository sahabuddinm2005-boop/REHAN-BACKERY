import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Cake, Settings } from 'lucide-react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const { user, isAdmin, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/cart', label: 'Cart' }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <Cake size={32} className="brand-icon" />
            <span className="brand-name">Rehan Bakery</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar-nav desktop-nav">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
                {link.path === '/cart' && itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="navbar-auth desktop-nav">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="user-greeting nav-user-link">
                  <User size={18} />
                  {user.name || user.full_name}
                </Link>
                <Link to="/settings" className="btn btn-secondary btn-sm">
                  <Settings size={16} />
                  Settings
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                {link.path === '/cart' && itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </Link>
            )}
            <div className="mobile-auth">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                    <User size={18} />
                    Profile
                  </Link>
                  <Link to="/settings" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                    <Settings size={18} />
                    Settings
                  </Link>
                  <span className="user-greeting">
                    <User size={18} />
                    {user.name || user.full_name}
                  </span>
                  <button onClick={handleLogout} className="btn btn-secondary w-full">
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary w-full" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary w-full" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>

      <style>{`
        .navbar {
          background-color: var(--color-white);
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .brand-icon {
          color: var(--color-primary);
        }

        .brand-name {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-accent);
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: var(--color-text);
          text-decoration: none;
          padding: 0.5rem 0;
          position: relative;
          transition: color 0.2s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--color-primary);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--color-primary);
        }

        .cart-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-white);
          background-color: var(--color-highlight);
          border-radius: var(--radius-full);
        }

        .navbar-auth {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-user-link {
          text-decoration: none;
        }

        .user-greeting {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: var(--color-accent);
        }

        .auth-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--color-text);
          cursor: pointer;
          padding: 0.5rem;
        }

        .desktop-nav {
          display: flex;
        }

        .mobile-nav {
          display: none;
          flex-direction: column;
          padding: 1rem 0;
          border-top: 1px solid var(--color-border);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 0;
          font-weight: 500;
          color: var(--color-text);
          text-decoration: none;
          border-bottom: 1px solid var(--color-border);
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--color-primary);
        }

        .mobile-auth {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-nav {
            display: flex;
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar
