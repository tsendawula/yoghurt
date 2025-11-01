import { useEffect, useState, FormEvent } from 'react'
import { supabase, Product } from '../lib/supabase'
import './Order.css'

type CartItem = {
  product: Product
  quantity: number
}

export default function Order() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    notes: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('stock_status', 'out_of_stock')
      .order('name')

    if (data && !error) {
      setProducts(data)
    }
    setLoading(false)
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      alert('Please add items to your cart before placing an order')
      return
    }

    setSubmitting(true)

    const orderItems = cart.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }))

    const { error } = await supabase
      .from('orders')
      .insert({
        ...formData,
        order_items: orderItems,
        total_amount: calculateTotal(),
        status: 'pending'
      })

    setSubmitting(false)

    if (error) {
      alert('Error placing order. Please try again.')
      console.error(error)
    } else {
      setSuccess(true)
      setCart([])
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        delivery_address: '',
        notes: ''
      })
      setTimeout(() => setSuccess(false), 5000)
    }
  }

  return (
    <div className="order-page">
      <section className="order-hero">
        <div className="container">
          <h1>Place Your Order</h1>
          <p>Select your favorite yoghurt flavors and we'll deliver fresh to your door</p>
        </div>
      </section>

      <div className="order-content container">
        <div className="order-grid">
          <div className="products-section">
            <h2>Available Products</h2>
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length > 0 ? (
              <div className="product-list">
                {products.map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-item-image">
                      <img src={product.image_url} alt={product.name} />
                    </div>
                    <div className="product-item-info">
                      <h3>{product.name}</h3>
                      <p className="product-item-flavor">{product.flavor}</p>
                      <p className="product-item-price">${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      className="btn-add-to-cart"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-products">No products available for order at the moment.</p>
            )}
          </div>

          <div className="cart-section">
            <h2>Your Cart ({cart.length})</h2>
            {cart.length > 0 ? (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.product.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.product.name}</h4>
                        <p className="cart-item-price">${item.product.price.toFixed(2)} each</p>
                      </div>
                      <div className="cart-item-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className="btn-remove"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                </div>

                <form onSubmit={handleSubmit} className="order-form">
                  <h3>Delivery Details</h3>

                  <div className="form-group">
                    <label htmlFor="customer_name">Full Name *</label>
                    <input
                      type="text"
                      id="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customer_email">Email Address *</label>
                    <input
                      type="email"
                      id="customer_email"
                      required
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customer_phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="customer_phone"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="delivery_address">Delivery Address *</label>
                    <textarea
                      id="delivery_address"
                      required
                      rows={3}
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes (Optional)</label>
                    <textarea
                      id="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>

                  {success && (
                    <div className="success-message">
                      Order placed successfully! We'll contact you shortly to confirm delivery.
                    </div>
                  )}
                </form>
              </>
            ) : (
              <p className="empty-cart">Your cart is empty. Add some products to get started!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
