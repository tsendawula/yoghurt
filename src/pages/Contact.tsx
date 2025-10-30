import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import './Contact.css'

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase
      .from('contact_submissions')
      .insert(formData)

    setSubmitting(false)

    if (error) {
      alert('Error submitting contact form. Please try again.')
      console.error(error)
    } else {
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
      setTimeout(() => setSuccess(false), 5000)
    }
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>Have questions or special requests? We'd love to hear from you!</p>
        </div>
      </section>

      <div className="contact-content container">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email Us</h3>
              <p>info@kumaloyoghurt.com</p>
              <p className="info-detail">We'll respond within 24 hours</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Call Us</h3>
              <p>Phone number available on request</p>
              <p className="info-detail">Monday - Saturday, 8am - 6pm</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🚚</div>
              <h3>Delivery Areas</h3>
              <p>We deliver fresh yoghurt to your area</p>
              <p className="info-detail">Ask about delivery options</p>
            </div>

            <div className="info-card">
              <div className="info-icon">💼</div>
              <h3>Bulk Orders</h3>
              <p>Special pricing for large orders</p>
              <p className="info-detail">Perfect for events and businesses</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <h2>Send Us a Message</h2>

              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>

              {success && (
                <div className="success-message">
                  Thank you for contacting us! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
