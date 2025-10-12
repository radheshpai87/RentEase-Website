import { useState, useEffect, useCallback, useRef } from 'react'
import '../../styles/AdminProperties.css'
import '../../styles/ImageUpload.css'

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
    amenities: ['Parking', 'Swimming Pool', 'Garden', 'Security', 'Gym'],
    nearbyPlaces: [],
    images: [],
    featured: false
  })
  const [uploadingImage, setUploadingImage] = useState(false)

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

  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('basic')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [amenitiesList, setAmenitiesList] = useState([
    'Parking', 'Swimming Pool', 'Garden', 'Security', 'Gym',
    'Elevator', 'Air Conditioning', 'Balcony', 'Furnished', 
    'Laundry', 'Heating', 'Storage', 'Wheelchair Access', 'Pet Friendly'
  ])
  
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
      images: [],
      featured: false
    })
    setEditingProperty(null)
    setShowForm(false)
    setActiveTab('basic')
    setUploadProgress(0)
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
      images: property.images || [],
      featured: property.featured || false
    })
    setEditingProperty(property)
    setShowForm(true)
    setActiveTab('basic')
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

  const [uploadError, setUploadError] = useState(null)

  const handleImageUpload = async (e) => {
    const files = e.target.files
    
    if (!files || files.length === 0) return
    
    // Reset any previous errors
    setUploadError(null)
    
    const token = localStorage.getItem('token')
    if (!token) {
      setUploadError('Authentication token not found. Please log in again.')
      return
    }
    
    // Check file sizes before uploading
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setUploadError(`Some files are too large (max 5MB): ${oversizedFiles.map(f => f.name).join(', ')}`)
      return
    }
    
    setUploadingImage(true)
    console.log(`Starting upload of ${files.length} files`)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        console.log(`Processing file ${i+1}/${files.length}:`, file.name, file.type, file.size)
        
        // Create FormData for the image upload
        const formDataObj = new FormData()
        formDataObj.append('image', file)
        
        // Set progress for animation
        const progress = ((i + 0.5) / files.length) * 100
        setUploadProgress(progress)
        
        console.log('Sending request to upload endpoint...')
        
        // Upload image to server - don't set Content-Type header when using FormData
        let response
        try {
          response = await fetch('http://localhost:5000/api/properties/upload-image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
              // Don't set Content-Type here, browser will set it with boundary for FormData
            },
            body: formDataObj
          })
        } catch (fetchError) {
          console.error('Network error during upload:', fetchError)
          throw new Error('Network error. Please check your connection and try again.')
        }
        
        // Try to parse the JSON response
        let responseData
        try {
          responseData = await response.json()
          console.log('Upload response:', response.status, responseData)
        } catch (jsonError) {
          console.error('Error parsing response:', jsonError)
          throw new Error('Invalid response from server. Please try again.')
        }
        
        if (!response.ok) {
          // Extract the most useful error message
          const errorMsg = responseData.message || responseData.error || 
            (responseData.details ? JSON.stringify(responseData.details) : 'Unknown error')
          throw new Error(errorMsg)
        }
        
        if (!responseData.url) {
          throw new Error('Server response missing image URL')
        }
        
        // Update form data with the new image URL
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, responseData.url]
        }))
        
        console.log('Image uploaded successfully:', responseData.url)
        
      } catch (error) {
        console.error('Error uploading image:', error)
        setUploadError(`Error uploading ${file.name}: ${error.message}`)
        break // Stop processing remaining images on error
      }
    }
    
    setUploadProgress(100)
    
    // Reset the upload state after a delay
    setTimeout(() => {
      setUploadingImage(false)
      setUploadProgress(0)
    }, 1000)
  }
  
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  
  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(a => a !== amenity)
        }
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate that at least one image is uploaded
    if (formData.images.length === 0) {
      alert('Please upload at least one image of the property')
      return
    }
    
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
              <div className="form-tabs">
                <div 
                  className={`form-tab ${activeTab === 'basic' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('basic')}
                >
                  Basic Info
                </div>
                <div 
                  className={`form-tab ${activeTab === 'images' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('images')}
                >
                  Images
                </div>
                <div 
                  className={`form-tab ${activeTab === 'features' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('features')}
                >
                  Features & Amenities
                </div>
              </div>
              
              {/* Basic Info Tab */}
              <div className={`form-tab-content ${activeTab === 'basic' ? 'active' : ''}`}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter property title"
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
                      placeholder="Enter price"
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
                      placeholder="Enter area in sq ft"
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
              </div>
              
              {/* Images Tab */}
              <div className={`form-tab-content ${activeTab === 'images' ? 'active' : ''}`}>
                <div className="image-upload-container" onClick={() => fileInputRef.current?.click()}>
                  <div className="image-upload-icon">📸</div>
                  <div className="image-upload-text">
                    <p>Drag & drop images here or <span>Browse Files</span></p>
                    <p>Recommended size: 1200x800px (Max 10MB per image)</p>
                    <p className="image-upload-help">
                      Supported formats: JPG, PNG, WebP, GIF
                    </p>
                  </div>
                  <input 
                    type="file"
                    className="image-upload-input"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                  />
                  {uploadingImage && (
                    <div className="uploading-overlay">
                      <div className="uploading-spinner">⏳</div>
                      <div>Uploading... {Math.round(uploadProgress)}%</div>
                      <div className="upload-progress">
                        <div 
                          className="upload-progress-bar" 
                          style={{width: `${uploadProgress}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                {uploadError && (
                  <div className="upload-error">
                    <p><strong>Error:</strong> {uploadError}</p>
                    <button 
                      onClick={() => setUploadError(null)} 
                      className="upload-error-dismiss"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
                
                <div className="upload-instructions">
                  <h4>Image Upload Instructions</h4>
                  <ul>
                    <li>Click on the area above or drag and drop your images</li>
                    <li>You can upload multiple images at once</li>
                    <li>Maximum file size: 5MB per image</li>
                    <li>Supported formats: JPG, PNG, WebP, GIF</li>
                    <li>Make sure you're logged in as admin</li>
                  </ul>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="upload-preview-container">
                    {formData.images.map((image, index) => (
                      <div className="upload-preview-item" key={index}>
                        <img src={image} alt={`Property ${index + 1}`} />
                        <div 
                          className="upload-preview-remove"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Features Tab */}
              <div className={`form-tab-content ${activeTab === 'features' ? 'active' : ''}`}>
                <h4>Amenities</h4>
                <p>Select the amenities available in this property:</p>
                
                <div className="amenities-container">
                  {amenitiesList.map(amenity => (
                    <div className="amenity-item" key={amenity}>
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        className="amenity-checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      <label htmlFor={`amenity-${amenity}`} className="amenity-label">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
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