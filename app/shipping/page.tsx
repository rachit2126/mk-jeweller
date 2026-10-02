import React from 'react';
import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function ShippingPage() {
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
          maxWidth: '880px',
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Shipping Policy</span>
        </nav>

        {/* Page Title (Screen 11 in Mockup) */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid #E8E7E2', paddingBottom: '20px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 500,
              color: '#111111',
              margin: '0 0 10px',
            }}
          >
            Shipping Policy
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.9rem',
              color: '#6F6F6A',
              margin: 0,
            }}
          >
            Everything you need to know about our insured pan-India jewellery transit.
          </p>
        </div>

        {/* Structured Sections (Screen 11 in Mockup) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. Processing Time */}
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: '28px 32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 10px',
              }}
            >
              Processing Time
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.88rem',
                color: '#4A4A46',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Orders are verified, hallmarked, and processed within 1–2 business days from our Jaipur atelier. You will receive an immediate SMS and email notification upon parcel handover.
            </p>
          </div>

          {/* 2. Shipping Timeline */}
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: '28px 32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 14px',
              }}
            >
              Shipping Timeline
            </h2>
            <ul
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.88rem',
                color: '#4A4A46',
                lineHeight: 1.7,
                margin: 0,
                paddingLeft: '20px',
              }}
            >
              <li>
                <strong>Standard Shipping:</strong> 3–7 business days across all supported Indian PIN codes.
              </li>
              <li>
                <strong>Express Shipping:</strong> 1–3 business days for major metropolitan areas (Delhi NCR, Mumbai, Bengaluru, Hyderabad).
              </li>
            </ul>
          </div>

          {/* 3. Shipping Charges */}
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: '28px 32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 10px',
              }}
            >
              Shipping Charges
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.88rem',
                color: '#4A4A46',
                lineHeight: 1.6,
                margin: '0 0 8px',
              }}
            >
              <strong>Complimentary Free Shipping</strong> on all orders above ₹1,000 anywhere in India.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.84rem',
                color: '#6F6F6A',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              For orders below ₹1,000, a nominal flat shipping fee of ₹99 is applied at checkout to cover insured transit packaging.
            </p>
          </div>

          {/* 4. International Shipping */}
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: '28px 32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 10px',
              }}
            >
              International Shipping
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.88rem',
                color: '#4A4A46',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Currently, we ship across India only. For international bulk inquiries or bespoke bridal orders outside India, please contact our concierge team at support@mksilverhub.com or via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
