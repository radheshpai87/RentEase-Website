import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Help.css'

function Help() {
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [searchTerm, setSearchTerm] = useState('')

  const helpCategories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'finding-properties', name: 'Finding Properties', icon: '🔍' },
    { id: 'applications', name: 'Applications', icon: '📝' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'landlords', name: 'For Landlords', icon: '🏠' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'technical', name: 'Technical Issues', icon: '⚙️' }
  ]

  const helpArticles = {
    'getting-started': [
      {
        id: 1,
        title: 'How to create an account on RentEase',
        content: 'Creating an account is simple and free. Click the "Sign Up" button, enter your email and password, verify your email address, and you\'re ready to start browsing properties.',
        tags: ['account', 'registration', 'signup']
      },
      {
        id: 2,
        title: 'Understanding your dashboard',
        content: 'Your dashboard shows your saved properties, application status, messages from landlords, and account settings. Navigate using the menu on the left side.',
        tags: ['dashboard', 'navigation', 'overview']
      },
      {
        id: 3,
        title: 'Setting up your profile',
        content: 'A complete profile helps landlords trust you. Add your employment information, references, and a profile photo. This increases your chances of application approval.',
        tags: ['profile', 'setup', 'verification']
      }
    ],
    'finding-properties': [
      {
        id: 4,
        title: 'Using search filters effectively',
        content: 'Use filters to narrow down properties by price, location, bedrooms, and amenities. Save your search criteria to get notifications when new matching properties are listed.',
        tags: ['search', 'filters', 'notifications']
      },
      {
        id: 5,
        title: 'Saving and organizing properties',
        content: 'Click the heart icon to save properties to your favorites. Create lists to organize properties by preference or location for easy comparison.',
        tags: ['favorites', 'organization', 'lists']
      },
      {
        id: 6,
        title: 'Scheduling property viewings',
        content: 'Most properties offer online scheduling. Click "Schedule Viewing" and choose from available time slots. You\'ll receive confirmation and reminders via email.',
        tags: ['viewing', 'scheduling', 'appointments']
      }
    ],
    'applications': [
      {
        id: 7,
        title: 'Submitting rental applications',
        content: 'Complete applications include personal information, employment details, references, and required documents. Incomplete applications may be rejected.',
        tags: ['applications', 'requirements', 'documents']
      },
      {
        id: 8,
        title: 'Required documents checklist',
        content: 'Typically needed: ID, proof of income, employment verification, bank statements, and references. Some landlords may require additional documents.',
        tags: ['documents', 'checklist', 'requirements']
      },
      {
        id: 9,
        title: 'Application status tracking',
        content: 'Track your applications in real-time. Statuses include: Submitted, Under Review, Approved, Rejected. You\'ll receive notifications for status changes.',
        tags: ['status', 'tracking', 'notifications']
      }
    ],
    'payments': [
      {
        id: 10,
        title: 'Security deposits and fees',
        content: 'Security deposits are held in escrow and returned after move-out (minus any deductions). Application fees are non-refundable processing charges.',
        tags: ['deposits', 'fees', 'escrow']
      },
      {
        id: 11,
        title: 'Setting up automatic rent payments',
        content: 'Enable autopay to never miss a rent payment. Payments are processed on your chosen date each month. You can modify or cancel anytime.',
        tags: ['autopay', 'rent', 'automatic']
      },
      {
        id: 12,
        title: 'Payment methods accepted',
        content: 'We accept major credit cards, debit cards, and bank transfers. Some properties may have specific payment requirements.',
        tags: ['payment methods', 'credit cards', 'bank transfer']
      }
    ],
    'landlords': [
      {
        id: 13,
        title: 'Creating your first property listing',
        content: 'Provide detailed descriptions, high-quality photos, accurate pricing, and clear rental terms. Complete listings get more inquiries.',
        tags: ['listing', 'properties', 'descriptions']
      },
      {
        id: 14,
        title: 'Managing tenant applications',
        content: 'Review applications in your landlord dashboard. You can approve, reject, or request additional information from applicants.',
        tags: ['applications', 'management', 'tenants']
      },
      {
        id: 15,
        title: 'Understanding RentEase fees',
        content: 'RentEase charges a service fee only when you successfully rent your property. No upfront costs or monthly fees for landlords.',
        tags: ['fees', 'pricing', 'charges']
      }
    ],
    'account': [
      {
        id: 16,
        title: 'Updating your profile information',
        content: 'Keep your profile current by updating employment, income, and contact information. This helps with faster application processing.',
        tags: ['profile', 'updates', 'information']
      },
      {
        id: 17,
        title: 'Privacy and security settings',
        content: 'Control who can see your information and how you receive notifications. Enable two-factor authentication for enhanced security.',
        tags: ['privacy', 'security', 'notifications']
      },
      {
        id: 18,
        title: 'Deleting your account',
        content: 'Account deletion is permanent and cannot be undone. Download any important data first. Contact support if you need assistance.',
        tags: ['deletion', 'account', 'permanent']
      }
    ],
    'technical': [
      {
        id: 19,
        title: 'Troubleshooting login issues',
        content: 'Try resetting your password, clearing browser cache, or using a different browser. Contact support if problems persist.',
        tags: ['login', 'troubleshooting', 'password']
      },
      {
        id: 20,
        title: 'Upload problems and file formats',
        content: 'Supported formats: JPG, PNG, PDF (max 10MB). If uploads fail, try a smaller file size or different format.',
        tags: ['uploads', 'file formats', 'problems']
      },
      {
        id: 21,
        title: 'Browser compatibility',
        content: 'RentEase works best on Chrome, Firefox, Safari, and Edge. Update your browser for optimal performance.',
        tags: ['browser', 'compatibility', 'performance']
      }
    ]
  }

  const currentArticles = helpArticles[activeCategory] || []
  
  const filteredArticles = currentArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="help-container">
      <div className="help-hero">
        <div className="container">
          <h1>Help Center</h1>
          <p>Find answers to your questions and get the most out of RentEase</p>
          
          <div className="help-search">
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="help-content">
          <div className="help-sidebar">
            <h3>Categories</h3>
            <nav className="help-nav">
              {helpCategories.map(category => (
                <button
                  key={category.id}
                  className={`help-nav-item ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="nav-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </nav>

            <div className="help-contact">
              <h4>Still need help?</h4>
              <p>Can't find what you're looking for?</p>
              <Link to="/contact" className="btn-primary">Contact Support</Link>
            </div>
          </div>

          <div className="help-main">
            <div className="help-header">
              <h2>
                {helpCategories.find(cat => cat.id === activeCategory)?.icon} {' '}
                {helpCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              <p>{filteredArticles.length} articles found</p>
            </div>

            <div className="help-articles">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <div key={article.id} className="help-article">
                    <h3>{article.title}</h3>
                    <p>{article.content}</p>
                    <div className="article-tags">
                      {article.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <h3>No articles found</h3>
                  <p>Try adjusting your search terms or browse different categories.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="help-quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <div className="action-card">
              <div className="action-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Get instant help from our support team</p>
              <button className="btn-secondary">Start Chat</button>
            </div>
            <div className="action-card">
              <div className="action-icon">📞</div>
              <h3>Phone Support</h3>
              <p>Speak directly with a support representative</p>
              <button className="btn-secondary">Call Now</button>
            </div>
            <div className="action-card">
              <div className="action-icon">✉️</div>
              <h3>Email Support</h3>
              <p>Send us a detailed message about your issue</p>
              <button className="btn-secondary">Send Email</button>
            </div>
            <div className="action-card">
              <div className="action-icon">📚</div>
              <h3>User Guide</h3>
              <p>Download our comprehensive user manual</p>
              <button className="btn-secondary">Download PDF</button>
            </div>
          </div>
        </section>

        <section className="help-feedback">
          <div className="feedback-content">
            <h2>Was this helpful?</h2>
            <p>Help us improve our help center by rating your experience.</p>
            <div className="feedback-buttons">
              <button className="feedback-btn positive">👍 Yes, helpful</button>
              <button className="feedback-btn negative">👎 Needs improvement</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Help
