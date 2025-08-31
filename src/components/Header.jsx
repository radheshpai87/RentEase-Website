import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Header.css'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignIn = () => {
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const handleSignUp = () => {
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
          
          {/* Desktop Navigation */}
          <nav className="nav-links desktop-nav">
            <a href="#properties" className="nav-link">Properties</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
            <a href="#help" className="nav-link">Help</a>
            <div className="nav-buttons">
              <button className="btn-secondary" onClick={handleSignIn}>Sign In</button>
              <button className="btn-primary" onClick={handleSignUp}>Sign Up</button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <a href="#properties" className="mobile-nav-link">Properties</a>
          <a href="#about" className="mobile-nav-link">About</a>
          <a href="#contact" className="mobile-nav-link">Contact</a>
          <a href="#help" className="mobile-nav-link">Help</a>
          <div className="mobile-nav-buttons">
            <button className="btn-secondary" onClick={handleSignIn}>Sign In</button>
            <button className="btn-primary" onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
