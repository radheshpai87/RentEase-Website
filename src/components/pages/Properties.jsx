import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/Properties.css'

function Properties() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [locations, setLocations] = useState({})
  const [categories, setCategories] = useState([])
  const [savedProperties, setSavedProperties] = useState(new Set())
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProperties: 0
  })
  
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'all',
    bathrooms: 'all',
    location: '',
    state: '',
    city: '',
    status: 'available',
    featured: false,
    page: 1,
    limit: 12
  })
  
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const getMockProperties = () => {
    return [
      {
        _id: '1',
        title: "Modern Downtown Apartment",
        type: "apartment",
        price: 85000,
        location: { city: "Mumbai", state: "Maharashtra", locality: "Bandra" },
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: ["/4.jpg"],
        amenities: ["Parking", "Gym", "Pool", "Security"],
        status: "available",
        featured: true,
        isSaved: false
      },
      {
        _id: '2',
        title: "Cozy Studio Loft",
        type: "studio",
        price: 45000,
        location: { city: "Bangalore", state: "Karnataka", locality: "Koramangala" },
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        images: ["/5.jpg"],
        amenities: ["Parking", "Laundry", "Pet Friendly"],
        status: "available",
        isSaved: false
      },
      {
        _id: '3',
        title: "Luxury Family House",
        type: "house",
        price: 150000,
        location: { city: "Gurgaon", state: "Haryana", locality: "DLF Phase 1" },
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        images: ["/6.jpg"],
        amenities: ["Garden", "Garage", "Fireplace", "Storage"],
        status: "available",
        isSaved: false
      },
      {
        _id: '4',
        title: "Executive Penthouse",
        type: "apartment",
        price: 200000,
        location: { city: "Delhi", state: "Delhi", locality: "Connaught Place" },
        bedrooms: 3,
        bathrooms: 2,
        area: 2200,
        images: ["/7.jpg"],
        amenities: ["Balcony", "Concierge", "Gym", "City View"],
        status: "sold",
        isSaved: false
      },
      {
        _id: '5',
        title: "Student-Friendly Apartment",
        type: "apartment",
        price: 25000,
        location: { city: "Pune", state: "Maharashtra", locality: "Kothrud" },
        bedrooms: 2,
        bathrooms: 1,
        area: 900,
        images: ["/8.jpg"],
        amenities: ["Internet", "Furnished", "Parking"],
        status: "available",
        isSaved: false
      },
      {
        _id: '6',
        title: "Suburban Family Home",
        type: "house",
        price: 75000,
        location: { city: "Bangalore", state: "Karnataka", locality: "Whitefield" },
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        images: ["/1.jpg"],
        amenities: ["Garden", "Garage", "Quiet Area"],
        status: "available",
        isSaved: false
      }
    ]
  }

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const headers = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      // Build query parameters
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          params.append(key, value)
        }
      })
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`http://localhost:5000/api/properties?${params}`, {
        headers
      })

      if (!response.ok) {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data')
        const mockData = getMockProperties()
        setProperties(mockData)
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalProperties: mockData.length
        })
        setLoading(false)
        return
      }

      const data = await response.json()
      setProperties(data.properties || [])
      setPagination(data.pagination || {})
      
      // Update saved properties set
      if (token) {
        const saved = new Set(
          data.properties
            .filter(p => p.isSaved)
            .map(p => p._id)
        )
        setSavedProperties(saved)
      }
    } catch (err) {
      console.warn('Error fetching properties, using mock data:', err)
      const mockData = getMockProperties()
      setProperties(mockData)
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProperties: mockData.length
      })
      setError('')
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, sortOrder])

  // Fetch data on component mount and filter changes
  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  useEffect(() => {
    fetchLocations()
    fetchCategories()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/locations?type=hierarchy')
      if (response.ok) {
        const data = await response.json()
        setLocations(data)
      }
    } catch (err) {
      console.error('Error fetching locations:', err)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleSaveProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to save property')
      }

      const data = await response.json()
      
      // Update saved properties set
      const newSavedProperties = new Set(savedProperties)
      if (data.isSaved) {
        newSavedProperties.add(propertyId)
      } else {
        newSavedProperties.delete(propertyId)
      }
      setSavedProperties(newSavedProperties)

      // Update properties list
      setProperties(prev => prev.map(p => 
        p._id === propertyId ? { ...p, isSaved: data.isSaved } : p
      ))
    } catch (err) {
      console.error('Error saving property:', err)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'all',
      bathrooms: 'all',
      location: '',
      state: '',
      city: '',
      status: 'available',
      featured: false,
      page: 1,
      limit: 12
    })
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  const getLocationString = (location) => {
    if (!location) return 'Unknown Location'
    return `${location.locality || ''}, ${location.city || ''}, ${location.state || ''}`.replace(/^,\s*|,\s*$/g, '')
  }

  if (loading) {
    return (
      <div className="properties-container">
        <div className="loading">Loading properties...</div>
      </div>
    )
  }

  return (
    <div className="properties-container">
      <div className="properties-hero">
        <div className="container">
          <h1>Find Your Perfect <span className="accent-text">Home</span></h1>
          <p>Discover amazing properties that match your lifestyle</p>
        </div>
      </div>

      <div className="container">
        {/* Enhanced Filters */}
        <div className="properties-filters">
          <div className="filter-group">
            <label>Property Type</label>
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="villa">Villa</option>
              <option value="office">Office</option>
              <option value="shop">Shop</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price (₹)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="Min Price"
            />
          </div>

          <div className="filter-group">
            <label>Max Price (₹)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="Max Price"
            />
          </div>

          <div className="filter-group">
            <label>Bedrooms</label>
            <select value={filters.bedrooms} onChange={(e) => handleFilterChange('bedrooms', e.target.value)}>
              <option value="all">Any</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Bathrooms</label>
            <select value={filters.bathrooms} onChange={(e) => handleFilterChange('bathrooms', e.target.value)}>
              <option value="all">Any</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3+ Bathrooms</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Search by city, locality, pincode..."
            />
          </div>

          <div className="filter-group">
            <label>Featured</label>
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
            />
          </div>

          <div className="filter-actions">
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Sort and Results */}
        <div className="properties-controls">
          <div className="properties-results">
            <p>{pagination.totalProperties || properties.length} properties found</p>
          </div>
          
          <div className="sort-controls">
            <label>Sort by:</label>
            <select 
              value={`${sortBy}-${sortOrder}`} 
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-')
                setSortBy(newSortBy)
                setSortOrder(newSortOrder)
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-desc">Area: Large to Small</option>
              <option value="area-asc">Area: Small to Large</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Properties Grid */}
        <div className="properties-grid">
          {properties.map(property => (
            <div key={property._id} className={`property-card ${property.status !== 'available' ? 'unavailable' : ''}`}>
              <div className="property-image">
                <img 
                  src={property.images?.[0] || '/placeholder.jpg'} 
                  alt={property.title}
                  onClick={() => navigate(`/properties/${property._id}`)}
                />
                {property.featured && <div className="featured-badge">Featured</div>}
                {property.status !== 'available' && <div className="status-badge">{property.status}</div>}
                <div className="property-actions">
                  <button 
                    className={`save-btn ${property.isSaved || savedProperties.has(property._id) ? 'saved' : ''}`}
                    onClick={() => handleSaveProperty(property._id)}
                    title={property.isSaved || savedProperties.has(property._id) ? 'Remove from saved' : 'Save property'}
                  >
                    {property.isSaved || savedProperties.has(property._id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
              
              <div className="property-info">
                <div className="property-header">
                  <h3 
                    className="property-title"
                    onClick={() => navigate(`/properties/${property._id}`)}
                  >
                    {property.title}
                  </h3>
                  <div className="property-price">{formatPrice(property.price)}</div>
                </div>
                
                <div className="property-location">
                  <i className="location-icon">📍</i>
                  <span>{getLocationString(property.location)}</span>
                </div>
                
                <div className="property-features">
                  <div className="feature">
                    <i className="icon">🛏️</i>
                    <span>{property.bedrooms} Bed</span>
                  </div>
                  <div className="feature">
                    <i className="icon">🚿</i>
                    <span>{property.bathrooms} Bath</span>
                  </div>
                  <div className="feature">
                    <i className="icon">📐</i>
                    <span>{property.area} {property.areaUnit || 'sqft'}</span>
                  </div>
                  <div className="feature">
                    <i className="icon">🏠</i>
                    <span className="property-type">{property.type}</span>
                  </div>
                </div>
                
                {property.amenities?.length > 0 && (
                  <div className="property-amenities">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="amenity-more">+{property.amenities.length - 3} more</span>
                    )}
                  </div>
                )}
                
                <div className="property-actions-bottom">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/properties/${property._id}`)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate(`/properties/${property._id}#inquiry`)}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-outline"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </button>
            
            <div className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            <button 
              className="btn btn-outline"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </button>
          </div>
        )}

        {properties.length === 0 && !loading && (
          <div className="no-properties">
            <h3>No properties found</h3>
            <p>Try adjusting your search filters to find more properties.</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Properties
