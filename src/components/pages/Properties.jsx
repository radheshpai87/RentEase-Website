import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Properties.css';

function Properties() {
  const navigate = useNavigate();
  
  // State Management
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedProperties, setSavedProperties] = useState(new Set());
  
  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    status: 'available'
  });
  
  // Sorting State
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const propertiesPerPage = 9;

  // Fetch Properties
  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy, sortOrder, currentPage]);

  // Check Saved Properties
  useEffect(() => {
    const fetchSavedProperties = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/properties/saved', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSavedProperties(new Set(data.map(p => p._id)));
        }
      } catch (err) {
        console.error('Error fetching saved properties:', err);
      }
    };

    fetchSavedProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: propertiesPerPage,
        sortBy,
        sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type: filters.type }),
        ...(filters.category && { category: filters.category }),
        ...(filters.priceMin && { minPrice: filters.priceMin }),
        ...(filters.priceMax && { maxPrice: filters.priceMax }),
        ...(filters.bedrooms && { bedrooms: filters.bedrooms }),
        ...(filters.bathrooms && { bathrooms: filters.bathrooms }),
        ...(filters.location && { location: filters.location }),
        ...(filters.status && { status: filters.status })
      });

      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/properties?${params}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.properties || []);
      setTotalPages(data.totalPages || 1);
      setTotalProperties(data.total || 0);
    } catch (err) {
      setError(err.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      location: '',
      status: 'available'
    });
    setCurrentPage(1);
  };

  const handleSaveProperty = async (propertyId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedProperties(prev => {
          const newSet = new Set(prev);
          if (data.isSaved) {
            newSet.add(propertyId);
          } else {
            newSet.delete(propertyId);
          }
          return newSet;
        });
      }
    } catch (err) {
      console.error('Error saving property:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="properties-page">
      {/* Hero Section */}
      <section className="properties-hero">
        <div className="container">
          <div className="properties-hero-content">
            <h1>Find Your <span className="properties-accent-text">Perfect Space</span></h1>
            <p>Discover amazing properties that match your lifestyle and budget</p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Search & Filter Section */}
        <section className="filter-section">
          <div className="filter-header">
            <h2>Search Properties</h2>
            <button className="btn-reset" onClick={handleResetFilters}>
              <span>🔄</span> Reset Filters
            </button>
          </div>

          <div className="filters-grid">
            {/* Search Input */}
            <div className="filter-item full-width">
              <input
                type="text"
                name="search"
                placeholder="🔍 Search by title, location, or area..."
                value={filters.search}
                onChange={handleFilterChange}
                className="search-input"
              />
            </div>

            {/* Property Type */}
            <div className="filter-item">
              <label>Property Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-item">
              <label>Min Price</label>
              <input
                type="number"
                name="priceMin"
                placeholder="Min ₹"
                value={filters.priceMin}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-item">
              <label>Max Price</label>
              <input
                type="number"
                name="priceMax"
                placeholder="Max ₹"
                value={filters.priceMax}
                onChange={handleFilterChange}
              />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="filter-item">
              <label>Bedrooms</label>
              <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Bathrooms</label>
              <select name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Status */}
            <div className="filter-item">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <h3>
              {totalProperties} {totalProperties === 1 ? 'Property' : 'Properties'} Found
            </h3>
          </div>

          <div className="sort-controls">
            <label>Sort By:</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Name: A to Z</option>
              <option value="title-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading properties...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchProperties}>Try Again</button>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🏠</span>
            <h3>No Properties Found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button className="btn-primary" onClick={handleResetFilters}>Reset Filters</button>
          </div>
        ) : (
          <>
            <div className="properties-grid">
              {properties.map((property) => (
                <article key={property._id} className="property-card">
                  {/* Image Container */}
                  <div className="card-image-container">
                    <img
                      src={property.images?.[0] || '/placeholder.jpg'}
                      alt={property.title}
                      onClick={() => navigate(`/properties/${property._id}`)}
                    />
                    
                    {/* Badges */}
                    <div className="card-badges">
                      {property.featured && (
                        <span className="badge badge-featured">⭐ Featured</span>
                      )}
                      <span className={`badge badge-status badge-${property.status}`}>
                        {property.status}
                      </span>
                    </div>

                    {/* Save Button */}
                    <button
                      className={`save-btn ${savedProperties.has(property._id) ? 'saved' : ''}`}
                      onClick={() => handleSaveProperty(property._id)}
                      title={savedProperties.has(property._id) ? 'Remove from saved' : 'Save property'}
                    >
                      {savedProperties.has(property._id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <div className="card-header">
                      <h3
                        className="card-title"
                        onClick={() => navigate(`/properties/${property._id}`)}
                      >
                        {property.title}
                      </h3>
                      <span className="card-price">
                        {formatPrice(property.price)}
                      </span>
                    </div>

                    <div className="card-location">
                      <span className="icon">📍</span>
                      <span>
                        {property.location?.city || 'N/A'}, {property.location?.state || 'N/A'}
                      </span>
                    </div>

                    <div className="card-meta">
                      <span className="meta-item">
                        <span className="icon">🛏️</span>
                        {property.bedrooms} Bed
                      </span>
                      <span className="meta-item">
                        <span className="icon">🚿</span>
                        {property.bathrooms} Bath
                      </span>
                      <span className="meta-item">
                        <span className="icon">📐</span>
                        {property.area} sqft
                      </span>
                    </div>

                    {property.amenities && property.amenities.length > 0 && (
                      <div className="card-amenities">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="amenity-badge">
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="amenity-more">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="card-actions">
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/properties/${property._id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn-contact"
                        onClick={() => navigate(`/properties/${property._id}#contact`)}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="pagination-pages">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-page ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Properties;
