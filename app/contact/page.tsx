'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="eyebrow">CUSTOMER CONCIERGE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'var(--color-espresso)', marginBottom: '16px' }}>
            We&apos;d Love To Hear From You
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-muted-text)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Our jewellery specialists are here to assist with design inquiries, custom orders, order tracking, and gifting advice.
          </p>
        </div>

        {/* 2-Column Split: Info | Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '48px', alignItems: 'start' }} className="contact-grid">
          {/* Left: Contact Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* WhatsApp Priority Card */}
            <div
              style={{
                backgroundColor: '#E8F8EE',
                border: '1px solid rgba(37, 211, 102, 0.4)',
                borderRadius: 'var(--radius-card)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#128C7E' }}>
                <MessageCircle size={24} />
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>WhatsApp Concierge</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-espresso)', lineHeight: 1.5, margin: 0 }}>
                Instant responses within minutes for styling advice, order status, or high-res video demonstrations of any jewel.
              </p>
              <a
                href="https://wa.me/917425058118?text=Hi%20MK%20Silver%20Hub%2C%20I%20would%20like%20to%20connect%20with%20your%20jewellery%20concierge."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366', width: '100%', marginTop: '6px' }}
              >
                <span>Chat on WhatsApp (+91 74250 58118)</span>
              </a>
            </div>

            {/* Direct Details Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-cream)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Phone size={18} color="var(--color-champagne)" style={{ marginTop: '3px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Phone Support</strong>
                  <a href="tel:+917425058118" style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)' }}>+91 74250 58118</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Mail size={18} color="var(--color-champagne)" style={{ marginTop: '3px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Email Inquiries</strong>
                  <a href="mailto:support@mksilverhub.in" style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)' }}>support@mksilverhub.in</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--color-champagne)" style={{ marginTop: '3px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Jaipur Showroom & Atelier</strong>
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.5, display: 'block' }}>
                    Johari Bazaar, Jaipur, Rajasthan 302003, India
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Clock size={18} color="var(--color-champagne)" style={{ marginTop: '3px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Visiting & Support Hours</strong>
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)' }}>
                    Monday – Saturday, 10:00 AM – 7:00 PM IST
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-cream)',
              borderRadius: 'var(--radius-editorial)',
              border: '1px solid var(--color-border)',
              padding: '36px'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
              Send an Inquiry
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-text)', marginBottom: '24px' }}>
              Fill out the form below and an advisor will respond within 4 business hours.
            </p>

            {isSent ? (
              <div
                style={{
                  padding: '32px 24px',
                  backgroundColor: 'rgba(19, 138, 91, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-success)',
                  textAlign: 'center'
                }}
              >
                <CheckCircle2 size={36} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--color-success)', marginBottom: '6px' }}>
                  Message Received
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-espresso)', margin: 0 }}>
                  Thank you for contacting MK Silver Hub. A representative will reach out to your email or phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="General Inquiry">General Jewellery Inquiry</option>
                    <option value="Order Status">Order Tracking & Delivery</option>
                    <option value="Custom Size">Bespoke Resizing & Personalisation</option>
                    <option value="Bulk/Wedding Gifting">Bridal & Corporate Gifting</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Your Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you are looking for..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
                  <Send size={16} />
                  <span>Send Message to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
