import { Link } from 'react-router-dom'
import '../../styles/About.css'

function About() {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/P1.jpg",
      bio: "With over 15 years in real estate, Sarah founded RentEase to revolutionize the rental experience."
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Head of Technology",
      image: "/P3.jpg",
      bio: "Mike leads our tech team, ensuring our platform remains cutting-edge and user-friendly."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Property Relations Manager",
      image: "/P4.jpg",
      bio: "Emily works directly with property owners to expand our listing network and maintain quality."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Happy Tenants" },
    { number: "5,000+", label: "Properties Listed" },
    { number: "25+", label: "Indian Cities" },
    { number: "99%", label: "Customer Satisfaction" }
  ]

  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="container">
          <h1>About RentEase</h1>
          <p>Making rental experiences seamless, transparent, and stress-free</p>
        </div>
      </div>

      <div className="container">
        <section className="about-mission">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At RentEase, we believe that finding the perfect home shouldn't be a stressful experience. 
                We're dedicated to creating a platform that connects tenants with quality properties while 
                providing landlords with the tools they need to manage their rentals effectively.
              </p>
              <p>
                Founded in 2020, we've grown from a small startup to a trusted platform serving thousands 
                of users across multiple cities. Our commitment to transparency, quality, and customer 
                service has made us a leader in the rental marketplace.
              </p>
            </div>
            <div className="mission-image">
              <img src="/7.jpg" alt="Modern apartment building" />
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🏠</div>
              <h3>Quality First</h3>
              <p>We carefully vet all properties and landlords to ensure the highest standards for our users.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💬</div>
              <h3>Transparency</h3>
              <p>No hidden fees, no surprises. We believe in clear communication and honest dealings.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Trust</h3>
              <p>Building lasting relationships through reliable service and dependable support.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Innovation</h3>
              <p>Continuously improving our platform with the latest technology and user feedback.</p>
            </div>
          </div>
        </section>

        <section className="about-stats">
          <h2>RentEase by Numbers</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-team">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-content">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-story">
          <h2>Our Story</h2>
          <div className="story-content">
            <p>
              RentEase was born out of personal frustration with the traditional rental process. 
              Our founder, Sarah Johnson, experienced firsthand the challenges of finding quality 
              rental properties while dealing with unresponsive landlords and hidden fees.
            </p>
            <p>
              Determined to create a better solution, she assembled a team of real estate professionals 
              and technology experts to build a platform that prioritizes user experience, transparency, 
              and quality service.
            </p>
            <p>
              Today, RentEase serves as a bridge between property owners and tenants, creating a 
              marketplace built on trust, efficiency, and mutual respect. We're proud to have helped 
              thousands of people find their perfect home and continue to grow our community every day.
            </p>
          </div>
        </section>

        <section className="about-cta">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Home?</h2>
            <p>Join thousands of satisfied tenants who found their ideal rental through RentEase.</p>
            <div className="cta-buttons">
              <Link to="/properties" className="btn-primary">Browse Properties</Link>
              <button className="btn-secondary">List Your Property</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
