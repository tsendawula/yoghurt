import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🥛</span>
            <span className="logo-text">Kumalo Quality Yoghurt</span>
          </Link>

          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
            >
              Products
            </Link>
            <Link
              to="/order"
              className={`nav-link ${location.pathname === '/order' ? 'active' : ''}`}
            >
              Order Now
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Link>
            <Link
              to="/admin"
              className={`nav-link admin-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
