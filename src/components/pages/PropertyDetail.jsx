import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/PropertyDetail.css';

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Management
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  
  // Inquiry Form State
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Fetch Property Data
  useEffect(() => {
    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Property not found');
      }

      const data = await response.json();
      setProperty(data);
      setIsSaved(data.isSaved || false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Save Property
  const handleSaveProperty = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.isSaved);
      }
    } catch (err) {
      console.error('Error saving property:', err);
    }
  };

  // Gallery Navigation
  const nextImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  // Inquiry Form Handlers
  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          propertyId: id,
          ...inquiryData
        })
      });

      if (response.ok) {
        setInquirySuccess(true);
        setInquiryData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => {
          setShowInquiryForm(false);
          setInquirySuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
    } finally {
      setInquiryLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="property-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail-page">
        <div className="container">
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <h2>Property Not Found</h2>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => navigate('/properties')}>
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="property-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span onClick={() => navigate('/properties')} className="breadcrumb-link">Properties</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{property.title}</span>
        </nav>

        {/* Main Content */}
        <div className="detail-layout">
          {/* Left Column - Main Content */}
          <div className="detail-main">
            {/* Property Header */}
            <section className="property-header">
              <div className="header-content">
                <h1>{property.title}</h1>
                <div className="header-meta">
                  <span className="location">
                    <span className="icon">📍</span>
                    {property.location?.city}, {property.location?.state}
                  </span>
                  <span className={`status-badge status-${property.status}`}>
                    {property.status}
                  </span>
                  {property.featured && <span className="featured-badge">⭐ Featured</span>}
                </div>
                <div className="header-price">
                  <span className="price">{formatPrice(property.price)}</span>
                  <span className="price-type">/ {property.priceType || 'month'}</span>
                </div>
              </div>
            </section>

            {/* Gallery */}
            <section className="gallery-section">
              <div className="gallery-main">
                <img
                  src={property.images?.[currentImageIndex] || '/placeholder.jpg'}
                  alt={property.title}
                />
                <div className="gallery-controls">
                  <button
                    className="gallery-btn"
                    onClick={prevImage}
                    disabled={!property.images || property.images.length <= 1}
                  >
                    ← Prev
                  </button>
                  <span className="image-counter">
                    {currentImageIndex + 1} / {property.images?.length || 1}
                  </span>
                  <button
                    className="gallery-btn"
                    onClick={nextImage}
                    disabled={!property.images || property.images.length <= 1}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {property.images && property.images.length > 1 && (
                <div className="gallery-thumbnails">
                  {property.images.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img src={img} alt={`View ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Property Details */}
            <section className="details-section">
              <h2>Property Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-icon">🏠</span>
                  <div>
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{property.type}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🛏️</span>
                  <div>
                    <span className="detail-label">BHK</span>
                    <span className="detail-value">{property.bedrooms} BHK</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🚿</span>
                  <div>
                    <span className="detail-label">Bathrooms</span>
                    <span className="detail-value">{property.bathrooms}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">📐</span>
                  <div>
                    <span className="detail-label">Area</span>
                    <span className="detail-value">{property.area} {property.areaUnit || 'sqft'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}
            {property.description && (
              <section className="description-section">
                <h2>Description</h2>
                <p>{property.description}</p>
              </section>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <section className="amenities-section">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Nearby Places */}
            {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
              <section className="nearby-section">
                <h2>Nearby Places</h2>
                <div className="nearby-grid">
                  {property.nearbyPlaces.map((place, index) => (
                    <div key={index} className="nearby-item">
                      <span className="nearby-icon">
                        {place.type === 'school' && '🏫'}
                        {place.type === 'hospital' && '🏥'}
                        {place.type === 'mall' && '🛒'}
                        {place.type === 'transport' && '🚊'}
                        {place.type === 'restaurant' && '🍽️'}
                        {!['school', 'hospital', 'mall', 'transport', 'restaurant'].includes(place.type) && '📍'}
                      </span>
                      <div>
                        <div className="nearby-name">{place.name}</div>
                        <div className="nearby-distance">{place.distance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="detail-sidebar">
            {/* Contact Card */}
            <div className="contact-card">
              <h3>Contact Owner</h3>
              <div className="contact-actions">
                <button
                  className="btn-save"
                  onClick={handleSaveProperty}
                >
                  {isSaved ? '❤️ Saved' : '🤍 Save Property'}
                </button>
                <button
                  className="btn-inquiry"
                  onClick={() => setShowInquiryForm(true)}
                >
                  📧 Send Inquiry
                </button>
                <button
                  className="btn-contact"
                  onClick={() => navigate('/contact')}
                >
                  📞 Contact Us
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="quick-info-card">
              <h3>Quick Info</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Property ID</span>
                  <span className="info-value">#{property._id?.slice(-6)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className="info-value">{property.status}</span>
                </div>
                {property.category?.name && (
                  <div className="info-item">
                    <span className="info-label">Category</span>
                    <span className="info-value">{property.category.name}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Inquiry Form Modal */}
      {showInquiryForm && (
        <div className="modal-overlay" onClick={() => setShowInquiryForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Inquiry</h2>
              <button
                className="modal-close"
                onClick={() => setShowInquiryForm(false)}
              >
                ×
              </button>
            </div>

            {inquirySuccess ? (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <p>Your inquiry has been sent successfully!</p>
              </div>
            ) : (
              <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={inquiryData.name}
                    onChange={handleInquiryChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={inquiryData.email}
                    onChange={handleInquiryChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={inquiryData.phone}
                    onChange={handleInquiryChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={inquiryData.message}
                    onChange={handleInquiryChange}
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowInquiryForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={inquiryLoading}
                  >
                    {inquiryLoading ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetail;
