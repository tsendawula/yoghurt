import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Product } from '../lib/supabase'
import './Products.css'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFlavor, setSelectedFlavor] = useState<string>('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && !error) {
      setProducts(data)
    }
    setLoading(false)
  }

  const flavors = ['all', ...new Set(products.map(p => p.flavor))]

  const filteredProducts = selectedFlavor === 'all'
    ? products
    : products.filter(p => p.flavor === selectedFlavor)

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <span className="stock-badge in-stock">In Stock</span>
      case 'low_stock':
        return <span className="stock-badge low-stock">Low Stock</span>
      case 'out_of_stock':
        return <span className="stock-badge out-of-stock">Out of Stock</span>
      default:
        return null
    }
  }

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="container">
          <h1>Our Premium Yoghurt Collection</h1>
          <p>Discover a world of rich, creamy flavors crafted with care</p>
        </div>
      </section>

      <section className="products-content">
        <div className="container">
          <div className="filters">
            <h3>Filter by Flavor:</h3>
            <div className="filter-buttons">
              {flavors.map((flavor) => (
                <button
                  key={flavor}
                  className={`filter-btn ${selectedFlavor === flavor ? 'active' : ''}`}
                  onClick={() => setSelectedFlavor(flavor)}
                >
                  {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image_url} alt={product.name} />
                    <div className="product-badges">
                      <span className="flavor-badge">{product.flavor}</span>
                      {getStockBadge(product.stock_status)}
                    </div>
                  </div>
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      <Link
                        to="/order"
                        className={`btn-order ${product.stock_status === 'out_of_stock' ? 'disabled' : ''}`}
                      >
                        {product.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Order Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found for the selected filter.</p>
            </div>
          )}
        </div>
      </section>

      <section className="products-cta">
        <div className="container">
          <h2>Can't Decide?</h2>
          <p>Contact us for recommendations or special orders</p>
          <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
        </div>
      </section>
    </div>
  )
}
