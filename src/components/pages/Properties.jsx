import { useState, useEffect } from 'react'
import '../../styles/Properties.css'

function Properties() {
  const [properties, setProperties] = useState([])
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    location: 'all',
    bedrooms: 'all'
  })
  const [sortBy, setSortBy] = useState('price-low')

  // Mock data for properties
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        title: "Modern Downtown Apartment",
        type: "apartment",
        price: 85000,
        location: "Bandra, Mumbai",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        image: "/4.jpg",
        features: ["Parking", "Gym", "Pool", "Security"],
        available: true
      },
      {
        id: 2,
        title: "Cozy Studio Loft",
        type: "studio",
        price: 45000,
        location: "Koramangala, Bangalore",
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        image: "/5.jpg",
        features: ["Parking", "Laundry", "Pet Friendly"],
        available: true
      },
      {
        id: 3,
        title: "Luxury Family House",
        type: "house",
        price: 150000,
        location: "Gurgaon, Delhi NCR",
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        image: "/6.jpg",
        features: ["Garden", "Garage", "Fireplace", "Storage"],
        available: true
      },
      {
        id: 4,
        title: "Executive Penthouse",
        type: "apartment",
        price: 200000,
        location: "Connaught Place, Delhi",
        bedrooms: 3,
        bathrooms: 2,
        area: 2200,
        image: "/7.jpg",
        features: ["Balcony", "Concierge", "Gym", "City View"],
        available: false
      },
      {
        id: 5,
        title: "Student-Friendly Apartment",
        type: "apartment",
        price: 25000,
        location: "Kothrud, Pune",
        bedrooms: 2,
        bathrooms: 1,
        area: 900,
        image: "/8.jpg",
        features: ["Internet", "Furnished", "Parking"],
        available: true
      },
      {
        id: 6,
        title: "Suburban Family Home",
        type: "house",
        price: 75000,
        location: "Whitefield, Bangalore",
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        image: "/1.jpg",
        features: ["Garden", "Garage", "Quiet Area"],
        available: true
      }
    ]
    setProperties(mockProperties)
  }, [])

  const filteredProperties = properties.filter(property => {
    return (
      (filters.type === 'all' || property.type === filters.type) &&
      (filters.location === 'all' || property.location === filters.location) &&
      (filters.bedrooms === 'all' || property.bedrooms.toString() === filters.bedrooms) &&
      (filters.priceRange === 'all' || 
        (filters.priceRange === 'low' && property.price < 50000) ||
        (filters.priceRange === 'medium' && property.price >= 50000 && property.price < 100000) ||
        (filters.priceRange === 'high' && property.price >= 100000))
    )
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'size-large':
        return b.area - a.area
      case 'size-small':
        return a.area - b.area
      default:
        return 0
    }
  })

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  return (
    <div className="properties-container">
      <div className="properties-hero">
        <div className="container">
          <h1>Find Your Perfect Home</h1>
          <p>Discover amazing properties that match your lifestyle</p>
        </div>
      </div>

      <div className="container">
        <div className="properties-filters">
          <div className="filter-group">
            <label>Property Type</label>
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select value={filters.priceRange} onChange={(e) => handleFilterChange('priceRange', e.target.value)}>
              <option value="all">All Prices</option>
              <option value="low">Under ₹50,000</option>
              <option value="medium">₹50,000 - ₹1,00,000</option>
              <option value="high">Above ₹1,00,000</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
              <option value="all">All Locations</option>
              <option value="Bandra, Mumbai">Bandra, Mumbai</option>
              <option value="Koramangala, Bangalore">Koramangala, Bangalore</option>
              <option value="Gurgaon, Delhi NCR">Gurgaon, Delhi NCR</option>
              <option value="Connaught Place, Delhi">Connaught Place, Delhi</option>
              <option value="Kothrud, Pune">Kothrud, Pune</option>
              <option value="Whitefield, Bangalore">Whitefield, Bangalore</option>
            </select>
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
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="size-large">Size: Large to Small</option>
              <option value="size-small">Size: Small to Large</option>
            </select>
          </div>
        </div>

        <div className="properties-results">
          <p>{filteredProperties.length} properties found</p>
        </div>

        <div className="properties-grid">
          {filteredProperties.map(property => (
            <div key={property.id} className={`property-card ${!property.available ? 'unavailable' : ''}`}>
              <div className="property-image">
                <img src={property.image} alt={property.title} />
                <div className="property-status">
                  {property.available ? 'Available' : 'Rented'}
                </div>
              </div>
              
              <div className="property-content">
                <h3>{property.title}</h3>
                <p className="property-location">📍 {property.location}</p>
                <p className="property-price">₹{property.price.toLocaleString()}/month</p>
                
                <div className="property-details">
                  <span>🛏️ {property.bedrooms} bed</span>
                  <span>🚿 {property.bathrooms} bath</span>
                  <span>📐 {property.area} sqft</span>
                </div>
                
                <div className="property-features">
                  {property.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                  {property.features.length > 3 && (
                    <span className="feature-tag">+{property.features.length - 3}</span>
                  )}
                </div>
                
                <div className="property-actions">
                  <button className="btn-primary" disabled={!property.available}>
                    {property.available ? 'View Details' : 'Not Available'}
                  </button>
                  <button className="btn-secondary">Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="no-results">
            <h3>No properties found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Properties
