import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Product } from '../lib/supabase'
import './Home.css'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(3)

    if (data && !error) {
      setFeaturedProducts(data)
    }
    setLoading(false)
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Kumalo Quality Yoghurt</h1>
            <p className="hero-subtitle">
              Experience the rich, creamy taste of premium yoghurt crafted with the finest ingredients.
              Fresh, healthy, and delivered to your door.
            </p>
            <div className="hero-buttons">
              <Link to="/order" className="btn btn-primary">Order Now</Link>
              <Link to="/products" className="btn btn-secondary">View Products</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🥛</div>
              <h3>Premium Quality</h3>
              <p>Made with the finest ingredients and traditional methods for authentic taste</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fresh Delivery</h3>
              <p>Delivered fresh to your doorstep, ensuring maximum freshness and quality</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3>100% Natural</h3>
              <p>No artificial flavors or preservatives, just pure, natural goodness</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Flavors</h2>
          <p className="section-subtitle">Discover our most popular yoghurt varieties</p>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image_url} alt={product.name} />
                    <div className="product-badge">{product.flavor}</div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      <Link to="/order" className="btn-order">Order Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-products">No featured products available yet.</p>
          )}

          <div className="view-all">
            <Link to="/products" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "The best yoghurt I've ever tasted! Kumalo's strawberry flavor is absolutely divine.
                Fresh, creamy, and delivered right to my door."
              </p>
              <p className="testimonial-author">- Thandi M.</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                "I love the natural taste and quality. You can really tell they use premium ingredients.
                My whole family enjoys it every day!"
              </p>
              <p className="testimonial-author">- John K.</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                "Excellent service and amazing yoghurt! The chocolate flavor is my favorite.
                Highly recommend Kumalo Quality Yoghurt!"
              </p>
              <p className="testimonial-author">- Sarah N.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Taste the Difference?</h2>
            <p>Order your favorite yoghurt flavors today and enjoy fresh delivery</p>
            <Link to="/order" className="btn btn-primary btn-large">Place Your Order</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
