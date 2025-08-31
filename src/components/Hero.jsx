import { useState } from 'react'
import '../styles/Hero.css'

function Hero() {
  const [searchType, setSearchType] = useState('rent')
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [propertyType, setPropertyType] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // This would typically handle the search logic
    console.log('Search submitted:', { searchType, location, priceRange, propertyType })
  }

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Your Perfect
              <span className="accent-text"> Home</span>
            </h1>
            <p className="hero-subtitle">
              Discover thousands of rental properties perfect for families, students, 
              and young professionals. Your dream home is just a search away.
            </p>
          </div>

          {/* Search Form */}
          <div className="search-container">
            <div className="search-tabs">
              <button 
                className={`search-tab ${searchType === 'rent' ? 'active' : ''}`}
                onClick={() => setSearchType('rent')}
              >
                For Rent
              </button>
              <button 
                className={`search-tab ${searchType === 'buy' ? 'active' : ''}`}
                onClick={() => setSearchType('buy')}
              >
                For Sale
              </button>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-fields">
                <div className="search-field">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    placeholder="Enter city, neighborhood, or address"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <label htmlFor="property-type">Property Type</label>
                  <select
                    id="property-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="condo">Condo</option>
                  </select>
                </div>

                <div className="search-field">
                  <label htmlFor="price-range">Price Range</label>
                  <select
                    id="price-range"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="">Any Price</option>
                    <option value="0-1000">$0 - $1,000</option>
                    <option value="1000-2000">$1,000 - $2,000</option>
                    <option value="2000-3000">$2,000 - $3,000</option>
                    <option value="3000+">$3,000+</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary search-btn">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
