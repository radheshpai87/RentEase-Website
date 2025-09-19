import { useState } from 'react'
import { Link } from 'react-router-dom'
import Notification from '../Notification'
import '../../styles/Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })

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

    // Simulate form submission
    try {
      // In a real app, this would send to your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showNotification('Thank you for your message! We\'ll get back to you soon.', 'success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
      })
    } catch {
      showNotification('There was an error sending your message. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: '📞',
      title: 'Phone',
      details: ['+91 98765-43210', 'Mon-Fri 9AM-6PM IST']
    },
    {
      icon: '✉️',
      title: 'Email',
      details: ['support@rentease.com', 'info@rentease.com']
    },
    {
      icon: '📍',
      title: 'Office',
      details: ['Sector 18, Cyber City', 'Gurgaon, Haryana 122015']
    },
    {
      icon: '⏰',
      title: 'Hours',
      details: ['Monday - Friday: 9AM - 6PM IST', 'Weekend: 10AM - 4PM IST']
    }
  ]

  const faqItems = [
    {
      question: "How do I list my property on RentEase?",
      answer: "You can list your property by creating a landlord account and using our easy-to-use listing wizard. Our team will review and approve your listing within 24 hours."
    },
    {
      question: "Are there any fees for tenants?",
      answer: "No, RentEase is completely free for tenants. We charge a small commission to landlords only when a successful rental is completed."
    },
    {
      question: "How do you verify properties and landlords?",
      answer: "We have a comprehensive verification process that includes identity checks, property ownership verification, and quality inspections for all listings."
    },
    {
      question: "Can I schedule property viewings through the platform?",
      answer: "Yes! You can schedule viewings directly through our platform. We also offer virtual tours for many properties."
    }
  ]

  return (
    <div className="contact-container">
      <Notification 
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />

      <div className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We're here to help you with any questions or concerns</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="property">Property Question</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card">
                  <div className="contact-icon">{info.icon}</div>
                  <h3>{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="map-section">
              <h3>Find Us</h3>
              <div className="map-placeholder">
                <div className="map-content">
                  <p>📍 Interactive Map</p>
                  <p>123 Business District<br />New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-cta">
          <div className="cta-content">
            <h2>Need Immediate Assistance?</h2>
            <p>Our support team is available during business hours to help you right away.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">Call Now</Link>
              <button className="btn-secondary">Live Chat</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact
