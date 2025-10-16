import { useState, useEffect, useCallback } from 'react'
import '../../styles/AdminCMS.css'

function AdminCMS() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filters, setFilters] = useState({
    type: 'all',
    isActive: 'all'
  })
  const [formData, setFormData] = useState({
    type: 'faq',
    title: '',
    content: '',
    image: '',
    link: '',
    order: 0,
    isActive: true,
    metadata: {
      author: '',
      tags: [],
      excerpt: ''
    }
  })

  const contentTypes = [
    { value: 'banner', label: '🎨 Banner', icon: '🎨' },
    { value: 'faq', label: '❓ FAQ', icon: '❓' },
    { value: 'blog', label: '📝 Blog', icon: '📝' },
    { value: 'testimonial', label: '💬 Testimonial', icon: '💬' },
    { value: 'social_link', label: '🔗 Social Link', icon: '🔗' }
  ]

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (filters.type && filters.type !== 'all') {
        queryParams.append('type', filters.type)
      }
      if (filters.isActive !== 'all') {
        queryParams.append('isActive', filters.isActive)
      }

      const response = await fetch(`http://localhost:5000/api/cms?${queryParams}`)

      if (response.ok) {
        const data = await response.json()
        setContent(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch CMS content')
        setContent([])
      }
    } catch (err) {
      console.error('Error fetching CMS content:', err)
      setContent([])
    } finally {
      setLoading(false)
    }
  }, [filters.type, filters.isActive])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const resetForm = () => {
    setFormData({
      type: 'faq',
      title: '',
      content: '',
      image: '',
      link: '',
      order: 0,
      isActive: true,
      metadata: {
        author: '',
        tags: [],
        excerpt: ''
      }
    })
    setEditingItem(null)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      type: item.type,
      title: item.title,
      content: item.content,
      image: item.image || '',
      link: item.link || '',
      order: item.order || 0,
      isActive: item.isActive,
      metadata: item.metadata || {
        author: '',
        tags: [],
        excerpt: ''
      }
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      const url = editingItem
        ? `http://localhost:5000/api/cms/${editingItem._id}`
        : 'http://localhost:5000/api/cms'

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchContent()
        setShowForm(false)
        resetForm()
      } else {
        alert('Failed to save content')
      }
    } catch (err) {
      console.error('Error saving content:', err)
      alert('Error saving content')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/cms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchContent()
      } else {
        alert('Failed to delete content')
      }
    } catch (err) {
      console.error('Error deleting content:', err)
      alert('Error deleting content')
    }
  }

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/cms/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        await fetchContent()
      } else {
        alert('Failed to update status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Error updating status')
    }
  }

  const getTypeIcon = (type) => {
    const typeObj = contentTypes.find(t => t.value === type)
    return typeObj ? typeObj.icon : '📄'
  }

  if (loading) {
    return (
      <div className="admin-cms">
        <div className="loading">Loading CMS content...</div>
      </div>
    )
  }

  return (
    <div className="admin-cms">
      {/* Header */}
      <div className="cms-header">
        <div className="header-content">
          <h2>📄 Content Management System</h2>
          <p>Manage banners, FAQs, blogs, testimonials, and social links</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Add Content
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-item">
            <label>Content Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Status</label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {content.length === 0 ? (
        <div className="no-content">
          <p>No content found. Add your first content item!</p>
        </div>
      ) : (
        <div className="content-grid">
          {content.map((item) => (
            <div key={item._id} className="content-card">
              <div className="card-header">
                <span className="type-badge">
                  {getTypeIcon(item.type)} {item.type}
                </span>
                <div className="card-actions-header">
                  <button
                    className={`toggle-btn ${item.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleActive(item._id, item.isActive)}
                    title={item.isActive ? 'Active' : 'Inactive'}
                  >
                    {item.isActive ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {item.image && (
                <div className="card-image">
                  <img src={item.image} alt={item.title} />
                </div>
              )}

              <div className="card-content">
                <h3>{item.title}</h3>
                <p className="content-preview">
                  {item.content.length > 150
                    ? `${item.content.substring(0, 150)}...`
                    : item.content}
                </p>

                {item.link && (
                  <p className="content-link">
                    <span className="icon">🔗</span>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.link}
                    </a>
                  </p>
                )}

                <div className="card-meta">
                  <span className="order-badge">Order: {item.order}</span>
                  <span className="date">
                    {new Date(item.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Content' : 'Add New Content'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="cms-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Content Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    {contentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Content *</label>
                  <textarea
                    rows="6"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Link URL</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>

                {formData.type === 'blog' && (
                  <>
                    <div className="form-group full-width">
                      <label>Author</label>
                      <input
                        type="text"
                        value={formData.metadata.author}
                        onChange={(e) => setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, author: e.target.value }
                        })}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Excerpt</label>
                      <textarea
                        rows="3"
                        value={formData.metadata.excerpt}
                        onChange={(e) => setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, excerpt: e.target.value }
                        })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCMS
