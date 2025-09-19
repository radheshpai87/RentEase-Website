import { useState } from 'react'
import '../styles/Hero.css'

function Hero() {
  const [searchData, setSearchData] = useState({
    type: 'rent',
    location: '',
    priceRange: '',
    propertyType: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchData({ ...searchData, [name]: value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search:', searchData)
  }

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Your Perfect <span className="accent-text">Home</span>
            </h1>
            <p className="hero-subtitle">
              Discover thousands of rental properties perfect for families, students, 
              and young professionals. Your dream home is just a search away.
            </p>
          </div>

          <div className="search-container">
            <div className="search-tabs">
              <button 
                className={`search-tab ${searchData.type === 'rent' ? 'active' : ''}`}
                onClick={() => setSearchData({ ...searchData, type: 'rent' })}
              >
                For Rent
              </button>
              <button 
                className={`search-tab ${searchData.type === 'buy' ? 'active' : ''}`}
                onClick={() => setSearchData({ ...searchData, type: 'buy' })}
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
                    name="location"
                    type="text"
                    placeholder="Enter city (Mumbai, Delhi, Bangalore...)"
                    value={searchData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="search-field">
                  <label htmlFor="propertyType">Property Type</label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={searchData.propertyType}
                    onChange={handleInputChange}
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="condo">Condo</option>
                  </select>
                </div>

                <div className="search-field">
                  <label htmlFor="priceRange">Price Range</label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    value={searchData.priceRange}
                    onChange={handleInputChange}
                  >
                    <option value="">Any Price</option>
                    <option value="0-25000">₹0 - ₹25,000</option>
                    <option value="25000-50000">₹25,000 - ₹50,000</option>
                    <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                    <option value="100000+">₹1,00,000+</option>
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
