import { useEffect, useState } from 'react'
import { supabase, Order, ContactSubmission, Product } from '../lib/supabase'
import './AdminDashboard.css'

type Tab = 'orders' | 'contacts' | 'products'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)

    if (activeTab === 'orders') {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setOrders(data)
    } else if (activeTab === 'contacts') {
      const { data } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setContacts(data)
    } else if (activeTab === 'products') {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setProducts(data)
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (!error) {
      fetchData()
    }
  }

  const markContactAsRead = async (contactId: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', contactId)

    if (!error) {
      fetchData()
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (!error) {
        fetchData()
      }
    }
  }

  const deleteContact = async (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', contactId)

      if (!error) {
        fetchData()
      }
    }
  }

  const updateProductStock = async (productId: string, newStatus: string) => {
    const { error } = await supabase
      .from('products')
      .update({ stock_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', productId)

    if (!error) {
      fetchData()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B'
      case 'confirmed': return '#3B82F6'
      case 'preparing': return '#8B5CF6'
      case 'delivered': return '#10B981'
      case 'cancelled': return '#EF4444'
      default: return '#6B7280'
    }
  }

  return (
    <div className="admin-dashboard container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Messages ({contacts.filter(c => !c.is_read).length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'orders' && (
              <div className="orders-section">
                {orders.length === 0 ? (
                  <p className="empty-state">No orders yet</p>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>{order.customer_name}</h3>
                            <p className="order-date">
                              {new Date(order.created_at).toLocaleDateString()} at{' '}
                              {new Date(order.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <div
                            className="order-status"
                            style={{ backgroundColor: getStatusColor(order.status) }}
                          >
                            {order.status}
                          </div>
                        </div>

                        <div className="order-details">
                          <p><strong>Email:</strong> {order.customer_email}</p>
                          <p><strong>Phone:</strong> {order.customer_phone}</p>
                          <p><strong>Address:</strong> {order.delivery_address}</p>
                          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                        </div>

                        <div className="order-items">
                          <strong>Items:</strong>
                          <ul>
                            {order.order_items.map((item: any, idx: number) => (
                              <li key={idx}>
                                {item.product_name} x {item.quantity} - R{(item.price * item.quantity).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="order-footer">
                          <div className="order-total">
                            <strong>Total: R{order.total_amount.toFixed(2)}</strong>
                          </div>
                          <div className="order-actions">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="btn-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="contacts-section">
                {contacts.length === 0 ? (
                  <p className="empty-state">No contact submissions yet</p>
                ) : (
                  <div className="contacts-list">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`contact-card ${contact.is_read ? 'read' : 'unread'}`}
                      >
                        <div className="contact-header">
                          <div>
                            <h3>{contact.name}</h3>
                            <p className="contact-date">
                              {new Date(contact.created_at).toLocaleDateString()} at{' '}
                              {new Date(contact.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          {!contact.is_read && <span className="unread-badge">New</span>}
                        </div>

                        <div className="contact-details">
                          <p><strong>Email:</strong> {contact.email}</p>
                          {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
                        </div>

                        <div className="contact-message">
                          <strong>Message:</strong>
                          <p>{contact.message}</p>
                        </div>

                        <div className="contact-actions">
                          {!contact.is_read && (
                            <button
                              onClick={() => markContactAsRead(contact.id)}
                              className="btn-mark-read"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="products-section">
                {products.length === 0 ? (
                  <p className="empty-state">No products yet. Add products using the database.</p>
                ) : (
                  <div className="products-grid">
                    {products.map((product) => (
                      <div key={product.id} className="product-card-admin">
                        <div className="product-image-admin">
                          <img src={product.image_url} alt={product.name} />
                        </div>
                        <div className="product-info-admin">
                          <h3>{product.name}</h3>
                          <p className="product-flavor">{product.flavor}</p>
                          <p className="product-price-admin">R{product.price.toFixed(2)}</p>
                          <p className="product-description-admin">{product.description}</p>
                          <div className="product-stock">
                            <label>Stock Status:</label>
                            <select
                              value={product.stock_status}
                              onChange={(e) => updateProductStock(product.id, e.target.value)}
                              className="stock-select"
                            >
                              <option value="in_stock">In Stock</option>
                              <option value="low_stock">Low Stock</option>
                              <option value="out_of_stock">Out of Stock</option>
                            </select>
                          </div>
                          {product.is_featured && (
                            <span className="featured-badge">Featured</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
