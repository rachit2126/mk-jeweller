import React from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Returns & Exchange</span>
        </nav>

        {/* Page Title */}
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
            Returns & Exchange Policy
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.9rem',
              color: '#6F6F6A',
              margin: 0,
            }}
          >
            Our commitment to your satisfaction with our Jaipur hallmarked silver pieces.
          </p>
        </div>

        {/* Policy Content Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              7-Day Return & Exchange Window
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.6, margin: 0 }}>
              We offer a straightforward 7-day return and exchange policy from the date of delivery. If you are not completely delighted with your purchase, you may request an exchange or full refund.
            </p>
          </div>

          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              Eligibility Criteria
            </h2>
            <ul style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.7, margin: 0, paddingLeft: '20px' }}>
              <li>Item must be in its original, unworn condition.</li>
              <li>Original packaging, certificate of authenticity, and security tags must remain intact.</li>
              <li>Personalised or custom-engraved pieces are non-returnable unless defective.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              Reverse Pickup & Refund Process
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.6, margin: '0 0 12px' }}>
              Our logistics partner will arrange an insured doorstep pickup. Once the parcel arrives at our Jaipur atelier and passes quality inspection, refunds are processed within 2–4 business days to your original payment method.
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.84rem', color: '#6F6F6A', margin: 0 }}>
              To initiate a return or exchange, message our customer support on WhatsApp at <strong>+91 74250 58118</strong> or email <strong>support@mksilverhub.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
