import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Header.css'
import { checkAuthValidity, clearAuth } from '../utils/auth.js'
import Notification from './Notification'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: 'info', isVisible: false })
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      // First, do an immediate server availability check
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/server-status');
          if (!response.ok) {
            // Server is down, clear auth immediately
            clearAuth();
            setUser(null);
            setNotification({
              message: 'Server is not available. You have been logged out.',
              type: 'warning',
              isVisible: true
            });
            return;
          }
        } catch {
          // Server is down, clear auth immediately
          clearAuth();
          setUser(null);
          setNotification({
            message: 'Server is not available. You have been logged out.',
            type: 'warning',
            isVisible: true
          });
          return;
        }
      }
      
      // Now do the full auth validity check
      const authResult = await checkAuthValidity()
      
      if (authResult.isAuthenticated) {
        setUser(authResult.user)
      } else {
        setUser(null)
        
        // Show message if server restarted or is down
        if ((authResult.serverRestarted || authResult.serverDown) && authResult.message) {
          setNotification({
            message: authResult.message,
            type: 'warning',
            isVisible: true
          })
        }
      }
    }

    checkAuth()
    
    // Check auth periodically to detect server restarts
    const interval = setInterval(checkAuth, 30000) // Check every 30 seconds
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const goToLogin = () => {
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const goToSignUp = () => {
    navigate('/signup')
    setMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    
    // Call logout endpoint to blacklist token on server
    if (token) {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.error('Logout request failed:', error)
        // Continue with local logout even if server request fails
      }
    }
    
    clearAuth()
    setUser(null)
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
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
    </>
  )
}

export default Header
