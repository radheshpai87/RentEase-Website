import { useState, useEffect, useCallback } from 'react'
import '../../styles/AdminInquiries.css'

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  })
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const queryParams = new URLSearchParams()
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status)
      }

      const response = await fetch(`http://localhost:5000/api/inquiries?${queryParams}`, {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setInquiries(data.inquiries || [])
      } else {
        console.error('Failed to fetch inquiries')
        setInquiries([])
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err)
      setInquiries([])
    } finally {
      setLoading(false)
    }
  }, [filters.status])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry)
    setNotes(inquiry.notes || '')
    setShowModal(true)
  }

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      setUpdating(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, notes })
      })

      if (response.ok) {
        await fetchInquiries()
        setShowModal(false)
        setSelectedInquiry(null)
      } else {
        alert('Failed to update inquiry status')
      }
    } catch (err) {
      console.error('Error updating inquiry:', err)
      alert('Error updating inquiry')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchInquiries()
        setShowModal(false)
        setSelectedInquiry(null)
      } else {
        alert('Failed to delete inquiry')
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err)
      alert('Error deleting inquiry')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { label: 'New', class: 'status-new' },
      contacted: { label: 'Contacted', class: 'status-contacted' },
      closed: { label: 'Closed', class: 'status-closed' }
    }
    return statusConfig[status] || statusConfig.new
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const searchLower = filters.search.toLowerCase()
    return (
      inquiry.name?.toLowerCase().includes(searchLower) ||
      inquiry.email?.toLowerCase().includes(searchLower) ||
      inquiry.phone?.includes(searchLower) ||
      inquiry.property?.title?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="admin-inquiries">
        <div className="loading">Loading inquiries...</div>
      </div>
    )
  }

  return (
    <div className="admin-inquiries">
      {/* Header */}
      <div className="inquiries-header">
        <h2>📧 Manage Inquiries</h2>
        <div className="header-stats">
          <span className="stat-badge">
            Total: <strong>{inquiries.length}</strong>
          </span>
          <span className="stat-badge status-new">
            New: <strong>{inquiries.filter(i => i.status === 'new').length}</strong>
          </span>
          <span className="stat-badge status-contacted">
            Contacted: <strong>{inquiries.filter(i => i.status === 'contacted').length}</strong>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-item">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="filter-item full-width">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name, email, phone, or property..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="no-inquiries">
          <p>No inquiries found</p>
        </div>
      ) : (
        <div className="inquiries-grid">
          {filteredInquiries.map((inquiry) => {
            const statusBadge = getStatusBadge(inquiry.status)
            return (
              <div key={inquiry._id} className="inquiry-card">
                <div className="inquiry-header">
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.label}
                  </span>
                  <span className="inquiry-date">
                    {new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="inquiry-content">
                  <h3>{inquiry.name}</h3>
                  <div className="inquiry-details">
                    <p className="detail-item">
                      <span className="icon">📧</span>
                      {inquiry.email}
                    </p>
                    <p className="detail-item">
                      <span className="icon">📱</span>
                      {inquiry.phone}
                    </p>
                  </div>

                  {inquiry.property && (
                    <div className="property-info">
                      <span className="icon">🏠</span>
                      <span className="property-title">{inquiry.property.title}</span>
                      {inquiry.property.location && (
                        <span className="property-location">
                          {inquiry.property.location.city}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="inquiry-message">
                    <p>{inquiry.message}</p>
                  </div>
                </div>

                <div className="inquiry-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewDetails(inquiry)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteInquiry(inquiry._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedInquiry && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inquiry Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{selectedInquiry.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{selectedInquiry.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{selectedInquiry.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(selectedInquiry.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {selectedInquiry.property && (
                <div className="detail-section">
                  <h3>Property Information</h3>
                  <div className="property-card-small">
                    {selectedInquiry.property.images && selectedInquiry.property.images[0] && (
                      <img src={selectedInquiry.property.images[0]} alt={selectedInquiry.property.title} />
                    )}
                    <div className="property-details-small">
                      <h4>{selectedInquiry.property.title}</h4>
                      <p className="property-type">{selectedInquiry.property.type}</p>
                      <p className="property-price">
                        ₹{selectedInquiry.property.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Message</h3>
                <div className="message-box">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="detail-section">
                <h3>Status & Notes</h3>
                <div className="status-update-section">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => setSelectedInquiry({ ...selectedInquiry, status: e.target.value })}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Admin Notes</label>
                    <textarea
                      rows="4"
                      placeholder="Add notes about this inquiry..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleUpdateStatus(selectedInquiry._id, selectedInquiry.status)}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Inquiry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminInquiries
