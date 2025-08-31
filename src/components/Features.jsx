import '../styles/Features.css'

function Features() {
  const features = [
    {
      icon: "🏠",
      title: "Verified Properties",
      description: "All our listings are verified and up-to-date, ensuring you get accurate information every time."
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "We work directly with landlords to offer competitive pricing and transparent fees."
    },
    {
      icon: "🔍",
      title: "Easy Search",
      description: "Our intuitive search makes finding your perfect home simple and stress-free."
    }
  ]

  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
