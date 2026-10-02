import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'Privacy policy and data security practices of MK Silver Hub.',
};

export default function PrivacyPage() {
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Privacy Policy</span>
        </nav>

        {/* Title */}
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
            Privacy Policy
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.9rem',
              color: '#6F6F6A',
              margin: 0,
            }}
          >
            How MK Silver Hub collects, encrypts, and protects your personal and order data.
          </p>
        </div>

        {/* Content Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              1. Information We Collect
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.65, margin: 0 }}>
              When you purchase pieces or create an account with MK Silver Hub, we collect essential details including your name, delivery address, phone number, and email. This information is strictly utilized to process insured deliveries, send order status updates, and provide personalized customer care.
            </p>
          </div>

          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              2. Payment Security & Encryption
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.65, margin: 0 }}>
              All online transactions are processed through verified, RBI-compliant PCI-DSS Level 1 payment gateways. MK Silver Hub never captures, views, or stores your credit/debit card numbers, CVV codes, or UPI passwords.
            </p>
          </div>

          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              3. WhatsApp & Transactional Communications
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.65, margin: 0 }}>
              We communicate order status, dispatch tracking, and delivery receipts through WhatsApp and email. You can opt out of promotional newsletters at any time by clicking the unsubscribe link or adjusting account preferences.
            </p>
          </div>

          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              4. Data Privacy Inquiries
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.65, margin: 0 }}>
              For any privacy inquiries or to request data modification, contact our grievance team at <strong>privacy@mksilverhub.com</strong> or our Jaipur office at <strong>+91 74250 58118</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
