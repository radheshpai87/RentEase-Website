import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/PropertyDetail.css';

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSaveProperty = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/properties/${id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save property');
      }

      const data = await response.json();
      setProperty(prev => ({ ...prev, isSaved: data.isSaved }));
    } catch (err) {
      console.error('Error saving property:', err);
    }
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

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setInquirySuccess(true);
      setInquiryData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setShowInquiryForm(false);
        setInquirySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
    } finally {
      setInquiryLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
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
      <div className="property-detail-container">
        <div className="loading">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail-container">
        <div className="error-message">
          <h2>Property Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/properties')} className="btn btn-primary">
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-container">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
          <span className="breadcrumb-separator">›</span>
          <span onClick={() => navigate('/properties')} className="breadcrumb-link">Properties</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{property.title}</span>
        </div>

        {/* Property Header */}
        <div className="property-header">
          <div className="property-title-section">
            <h1>{property.title}</h1>
            <div className="property-location">
              <i className="location-icon">📍</i>
              <span>
                {property.location?.locality}, {property.location?.city}, {property.location?.state} - {property.location?.pincode}
              </span>
            </div>
            <div className="property-meta">
              <span className="property-type">{property.type}</span>
              <span className="property-status status-{property.status}">{property.status}</span>
              {property.featured && <span className="featured-badge">Featured</span>}
            </div>
          </div>
          <div className="property-price-section">
            <div className="property-price">{formatPrice(property.price)}</div>
            <div className="price-type">/{property.priceType}</div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="property-gallery">
          <div className="gallery-main">
            <img 
              src={property.images[currentImageIndex]} 
              alt={property.title}
              className="main-image"
            />
            {property.images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}>‹</button>
                <button className="gallery-nav next" onClick={nextImage}>›</button>
                <div className="image-counter">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>
          {property.images.length > 1 && (
            <div className="gallery-thumbnails">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="property-content">
          {/* Property Info */}
          <div className="property-main">
            <div className="property-details">
              <h2>Property Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Bedrooms</span>
                  <span className="detail-value">{property.bedrooms}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Bathrooms</span>
                  <span className="detail-value">{property.bathrooms}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Area</span>
                  <span className="detail-value">{property.area} {property.areaUnit}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{property.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{property.category?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">{property.status}</span>
                </div>
              </div>
            </div>

            <div className="property-description">
              <h2>Description</h2>
              <p>{property.description}</p>
            </div>

            {property.amenities?.length > 0 && (
              <div className="property-amenities">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <i className="amenity-icon">✓</i>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.nearbyPlaces?.length > 0 && (
              <div className="nearby-places">
                <h2>Nearby Places</h2>
                <div className="nearby-grid">
                  {property.nearbyPlaces.map((place, index) => (
                    <div key={index} className="nearby-item">
                      <div className="nearby-name">{place.name}</div>
                      <div className="nearby-distance">{place.distance}</div>
                      <div className="nearby-type">{place.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="property-sidebar">
            <div className="sidebar-card">
              <div className="contact-info">
                <h3>Contact Property Owner</h3>
                <div className="owner-info">
                  <div className="owner-name">
                    {property.owner?.firstName} {property.owner?.lastName}
                  </div>
                  <div className="owner-contact">
                    <div>📧 {property.owner?.email}</div>
                    <div>📞 {property.owner?.phoneNumber}</div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-primary btn-full"
                  onClick={() => setShowInquiryForm(true)}
                >
                  Send Inquiry
                </button>
                <button 
                  className={`btn btn-outline btn-full ${property.isSaved ? 'saved' : ''}`}
                  onClick={handleSaveProperty}
                >
                  {property.isSaved ? '❤️ Saved' : '🤍 Save Property'}
                </button>
              </div>
            </div>

            {property.coordinates?.latitude && property.coordinates?.longitude && (
              <div className="sidebar-card">
                <h3>Location</h3>
                <div className="map-placeholder">
                  <p>Map view will be here</p>
                  <div className="coordinates">
                    Lat: {property.coordinates.latitude}<br/>
                    Lng: {property.coordinates.longitude}
                  </div>
                </div>
              </div>
            )}

            <div className="sidebar-card">
              <h3>Property Address</h3>
              <div className="full-address">
                {property.address}<br/>
                {property.location?.locality}<br/>
                {property.location?.town}, {property.location?.city}<br/>
                {property.location?.state} - {property.location?.pincode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
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
                <h3>Inquiry Sent Successfully!</h3>
                <p>The property owner will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="inquiry-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                    placeholder="I'm interested in this property. Please contact me..."
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-full"
                  disabled={inquiryLoading}
                >
                  {inquiryLoading ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetail;