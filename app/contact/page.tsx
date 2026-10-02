'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#111111',
        minHeight: '100vh',
        padding: '0 0 100px',
      }}
    >
      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            padding: '24px 0 32px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
            color: '#6F6F6A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link href="/" style={{ color: '#6F6F6A', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: '#111111', fontWeight: 600 }}>Contact Us</span>
        </nav>

        {/* Title */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #E8E7E2', paddingBottom: '24px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 500,
              color: '#111111',
              margin: '0 0 10px',
            }}
          >
            Contact Customer Concierge
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.9rem',
              color: '#6F6F6A',
              margin: 0,
            }}
          >
            We are here to assist with design inquiries, custom orders, order tracking, and gifting advice.
          </p>
        </div>

        {/* 2-Column Split: Info Cards | Message Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)',
            gap: '40px',
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left: Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* WhatsApp Priority Card */}
            <div
              style={{
                backgroundColor: '#F8F7F3',
                border: '1px solid #E8E7E2',
                padding: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <MessageCircle size={22} color="#111111" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                  WhatsApp Concierge
                </h3>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.84rem', color: '#6F6F6A', lineHeight: 1.5, margin: '0 0 16px' }}>
                Instant responses for bespoke designs, size assistance, or video previews of any 925 silver creation.
              </p>
              <a
                href="https://wa.me/917425058118?text=Hi%20MK%20Silver%20Hub%2C%20I%20would%20like%20to%20connect%20with%20your%20jewellery%20concierge."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px 0',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <span>CHAT ON WHATSAPP (+91 74250 58118)</span>
              </a>
            </div>

            {/* Atelier Info */}
            <div
              style={{
                backgroundColor: '#F8F7F3',
                border: '1px solid #E8E7E2',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={18} color="#111111" />
                <div>
                  <strong style={{ display: 'block', color: '#111111' }}>Direct Phone</strong>
                  <a href="tel:+917425058118" style={{ color: '#6F6F6A', textDecoration: 'none' }}>+91 74250 58118</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={18} color="#111111" />
                <div>
                  <strong style={{ display: 'block', color: '#111111' }}>Email</strong>
                  <a href="mailto:support@mksilverhub.com" style={{ color: '#6F6F6A', textDecoration: 'none' }}>support@mksilverhub.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={18} color="#111111" />
                <div>
                  <strong style={{ display: 'block', color: '#111111' }}>Atelier & Office</strong>
                  <span style={{ color: '#6F6F6A' }}>Johari Bazaar, Jaipur, Rajasthan 302003, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: '32px',
            }}
          >
            {isSent ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <CheckCircle2 size={36} color="#111111" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 8px' }}>
                  Message Received
                </h3>
                <p style={{ color: '#6F6F6A', fontSize: '0.86rem', margin: 0 }}>
                  Thank you for writing to MK Silver Hub. Our Jaipur concierge will respond within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 600, margin: 0 }}>
                  Send an Inquiry
                </h2>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #E8E7E2',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.84rem',
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #E8E7E2',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.84rem',
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #E8E7E2',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.84rem',
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #E8E7E2',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.84rem',
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '14px 0',
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    border: 'none',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginTop: '6px',
                  }}
                >
                  SUBMIT INQUIRY
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 800px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
