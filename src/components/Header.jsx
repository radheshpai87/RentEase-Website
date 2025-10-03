import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Header.css'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr)
          setUser(userData)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    }

    checkAuth()
    // Listen for auth changes
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const goToLogin = () => {
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const goToSignUp = () => {
    navigate('/signup')
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setMobileMenuOpen(false)
    navigate('/')
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
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link admin-link">Admin</Link>
            )}
            <div className="nav-buttons">
              {user ? (
                <div className="user-menu">
                  <span className="user-name">Hi, {user.firstName}</span>
                  <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
              ) : (
                <>
                  <button className="btn-secondary" onClick={goToLogin}>Sign In</button>
                  <button className="btn-primary" onClick={goToSignUp}>Sign Up</button>
                </>
              )}
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
          {user?.role === 'admin' && (
            <Link to="/admin" className="mobile-nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          )}
          <div className="mobile-nav-buttons">
            {user ? (
              <>
                <span className="user-name">Hi, {user.firstName}</span>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button className="btn-secondary" onClick={goToLogin}>Sign In</button>
                <button className="btn-primary" onClick={goToSignUp}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
