import { useState, useEffect, useCallback } from 'react'
import '../../styles/AdminProperties.css'

function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    location: '',
    search: ''
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    priceType: 'monthly',
    location: '',
    category: '',
    address: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    status: 'available',
    amenities: [],
    nearbyPlaces: [],
    images: ['https://via.placeholder.com/600x400'],
    featured: false
  })

  const fetchProperties = useCallback(async () => {
    try {
      console.log('AdminProperties: Fetching properties...')
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.type) queryParams.append('type', filters.type)
      if (filters.location) queryParams.append('location', filters.location)
      if (filters.search) queryParams.append('search', filters.search)

      const response = await fetch(`http://localhost:5000/api/properties?${queryParams}`, { 
        headers,
        timeout: 10000 // 10 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('AdminProperties: Properties fetched:', data)
        setProperties(Array.isArray(data) ? data : [])
      } else {
        console.error('AdminProperties: Properties fetch failed:', response.status)
        setProperties([]) // Set empty array on failure
      }
    } catch (err) {
      console.error('AdminProperties: Error fetching properties:', err)
      setProperties([]) // Set empty array on error
    }
  }, [filters])

  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/locations')
      if (response.ok) {
        const data = await response.json()
        setLocations(Array.isArray(data) ? data : [])
      } else {
        setLocations([])
      }
    } catch (err) {
      console.error('Error fetching locations:', err)
      setLocations([])
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      console.log('AdminProperties: Fetching categories...')
      const response = await fetch('http://localhost:5000/api/categories')
      if (response.ok) {
        const data = await response.json()
        console.log('AdminProperties: Categories fetched:', data)
        setCategories(Array.isArray(data) ? data : [])
      } else {
        console.error('AdminProperties: Categories fetch failed:', response.status)
        setCategories([])
      }
    } catch (err) {
      console.error('AdminProperties: Error fetching categories:', err)
      setCategories([])
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      // Set a maximum timeout for loading
      const loadingTimeout = setTimeout(() => {
        setLoading(false)
      }, 15000) // 15 seconds max
      
      try {
        await Promise.all([fetchProperties(), fetchLocations(), fetchCategories()])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        clearTimeout(loadingTimeout)
        setLoading(false)
      }
    }
    loadData()
  }, [fetchProperties, fetchLocations, fetchCategories])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      price: '',
      priceType: 'monthly',
      location: '',
      category: '',
      address: '',
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      status: 'available',
      amenities: [],
      nearbyPlaces: [],
      images: ['https://via.placeholder.com/600x400'],
      featured: false
    })
    setEditingProperty(null)
    setShowForm(false)
  }

  const editProperty = (property) => {
    setFormData({
      title: property.title || '',
      description: property.description || '',
      type: property.type || '',
      price: property.price || '',
      priceType: property.priceType || 'monthly',
      location: property.location?._id || '',
      category: property.category?._id || '',
      address: property.address || '',
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      area: property.area || '',
      status: property.status || 'available',
      amenities: property.amenities || [],
      nearbyPlaces: property.nearbyPlaces || [],
      images: property.images || ['https://via.placeholder.com/600x400'],
      featured: property.featured || false
    })
    setEditingProperty(property)
    setShowForm(true)
  }

  const deleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          fetchProperties()
          alert('Property deleted successfully!')
        } else {
          alert('Error deleting property')
        }
      } catch (err) {
        console.error('Error deleting property:', err)
        alert('Error deleting property')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const method = editingProperty ? 'PUT' : 'POST'
      const url = editingProperty 
        ? `http://localhost:5000/api/properties/${editingProperty._id}`
        : 'http://localhost:5000/api/properties'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        resetForm()
        fetchProperties()
        alert(editingProperty ? 'Property updated successfully!' : 'Property created successfully!')
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        alert(`Error: ${error.message || 'Something went wrong'}`)
      }
    } catch (err) {
      console.error('Error saving property:', err)
      alert('Error saving property')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#22c55e'
      case 'sold': return '#ef4444'
      case 'rented': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return <div className="loading">Loading properties...</div>
  }

  return (
    <div className="admin-properties">
      <div className="admin-header">
        <h2>Properties Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Property
        </button>
      </div>

      <div className="filters-section">
        <div className="filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
            <option value="shop">Shop</option>
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location._id} value={location._id}>
                {location.city}, {location.state}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search properties..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      <div className="properties-grid">
        {properties.length === 0 ? (
          <div className="no-properties">
            <p>No properties found. Add your first property!</p>
          </div>
        ) : (
          properties.map(property => (
            <div key={property._id} className="property-card">
              <div className="property-image">
                {property.images && property.images.length > 0 ? (
                  <img src={property.images[0]} alt={property.title} />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
                <div 
                  className="property-status"
                  style={{ backgroundColor: getStatusColor(property.status) }}
                >
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
                {property.featured && (
                  <div className="featured-badge">Featured</div>
                )}
              </div>
              
              <div className="property-info">
                <h3>{property.title}</h3>
                <p className="property-type">{property.type}</p>
                <p className="property-price">{formatPrice(property.price)}</p>
                <p className="property-location">
                  {property.location?.city}, {property.location?.state}
                </p>
                <p className="property-details">
                  {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sqft
                </p>
              </div>
              
              <div className="property-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => editProperty(property)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => deleteProperty(property._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="property-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="villa">Villa</option>
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Price Type *</label>
                  <select
                    required
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <select
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location._id} value={location._id}>
                        {location.city}, {location.state}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="form-group">
                  <label>Bedrooms *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="form-group">
                  <label>Bathrooms *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="form-group">
                  <label>Area (sq ft) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) || '' })}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Featured Property
                  </label>
                </div>
              </div>
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter property description"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProperties