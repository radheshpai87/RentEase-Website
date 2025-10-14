import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Notification from '../Notification'
import '../../styles/Auth.css'

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'user'
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
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        showNotification('Account created successfully!', 'success')
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Account created! Please sign in.',
              email: formData.email 
            }
          })
        }, 2000)
      } else {
        showNotification(data.message || 'Registration failed', 'error')
      }
    } catch (error) {
      console.error('Signup error:', error)
      showNotification('Connection error. Please make sure the server is running.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-content signup-content">
        <div className="auth-form-container">
          <div className="auth-back">
            <Link to="/" className="auth-back-link">← Back to Home</Link>
          </div>
          <div className="auth-header signup-header">
            <h1>Create Account</h1>
            <p>Join RentEase today</p>
            <div className="account-type-info">
              <p className="info-text">💡 Select "Admin User" to access property management features</p>
            </div>
          </div>

          <form className="auth-form signup-form" onSubmit={handleSubmit}>
            {/* Row 1: First Name, Last Name */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Row 2: Email, Phone Number */}
            <div className="form-row">
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
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>

            {/* Row 3: Password, Confirm Password */}
            <div className="form-row">
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
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            {/* Row 4: Account Type - Centered */}
            <div className="form-group account-type-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">Regular User</option>
                <option value="admin">Admin User</option>
              </select>
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
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

export default SignUp
