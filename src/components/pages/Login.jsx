import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Notification from '../Notification'
import '../../styles/Auth.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })
  const navigate = useNavigate()

  const showNotification = (message, type = 'success') => {
    setNotification({
      isVisible: true,
      message,
      type
    })
  }

  const hideNotification = () => {
    setNotification({ ...notification, isVisible: false })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        showNotification(`Welcome back, ${data.user.firstName}!`, 'success')
        
        // Trigger storage event for header to update
        window.dispatchEvent(new Event('storage'))
        
        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin')
          } else {
            navigate('/')
          }
        }, 1500)
      } else {
        showNotification(data.message || 'Login failed', 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      showNotification('Connection error. Please make sure the server is running.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-content">
        <div className="auth-form-container">
          <div className="auth-back">
            <Link to="/" className="auth-back-link">← Back to Home</Link>
          </div>
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your RentEase account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
            <div className="admin-hint">
              <p className="info-text">🔑 Admin accounts get redirected to the dashboard automatically</p>
            </div>
          </div>
        </div>
      </div>
      
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  )
}

export default Login
