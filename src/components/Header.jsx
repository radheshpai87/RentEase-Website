import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Header.css'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const goToLogin = () => {
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const goToSignUp = () => {
    navigate('/signup')
    setMobileMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="nav">
          <div className="logo">
            <Link to="/">
              <h2>🏠 RentEase</h2>
            </Link>
          </div>
          
          <nav className="nav-links desktop-nav">
            <Link to="/properties" className="nav-link">Properties</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/help" className="nav-link">Help</Link>
            <div className="nav-buttons">
              <button className="btn-secondary" onClick={goToLogin}>Sign In</button>
              <button className="btn-primary" onClick={goToSignUp}>Sign Up</button>
            </div>
          </nav>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <Link to="/properties" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Properties</Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <Link to="/help" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Help</Link>
          <div className="mobile-nav-buttons">
            <button className="btn-secondary" onClick={goToLogin}>Sign In</button>
            <button className="btn-primary" onClick={goToSignUp}>Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
