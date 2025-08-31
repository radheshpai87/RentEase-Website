import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>RentEase</h4>
            <p>Making home rental simple and accessible for everyone.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#">Properties</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Help</a>
          </div>
          <div className="footer-section">
            <h4>For Landlords</h4>
            <a href="#">List Property</a>
            <a href="#">Landlord Resources</a>
            <a href="#">Property Management</a>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>help@rentease.com</p>
            <p>1-800-RENTEASE</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 RentEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
