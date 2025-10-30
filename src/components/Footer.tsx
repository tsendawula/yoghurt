import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Kumalo Quality Yoghurt</h3>
            <p>Fresh, creamy, and delicious yoghurt made with love and the finest ingredients.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/order">Order Now</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@kumaloyoghurt.com</p>
            <p>Phone: Available on request</p>
            <p>We deliver fresh yoghurt to your doorstep</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Kumalo Quality Yoghurt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
