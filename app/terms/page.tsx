import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'Terms of service and sale for MK Silver Hub jewellery.',
};

export default function TermsPage() {
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Terms & Conditions</span>
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
            Terms & Conditions
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.9rem',
              color: '#6F6F6A',
              margin: 0,
            }}
          >
            Terms of service governing purchases, deliveries, and warranties at MK Silver Hub.
          </p>
        </div>

        {/* Content Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              1. Purity & Hallmark Guarantee
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.65, margin: 0 }}>
              All jewellery manufactured and sold by MK Silver Hub is certified 925 sterling silver, stamped with official BIS hallmarking symbols. We guarantee a minimum fineness of 925 parts per thousand pure silver.
            </p>
          </div>

          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              2. Orders & Pricing
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.65, margin: 0 }}>
              All prices shown on the website are in Indian Rupees (INR) and inclusive of applicable GST taxes. We reserve the right to correct any typographical or bullion market price anomalies prior to order dispatch.
            </p>
          </div>

          <div style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8E7E2', padding: '28px 32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
              3. Transit Liability & Insurance
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.65, margin: 0 }}>
              MK Silver Hub bears full financial liability and insurance coverage for all parcels until physical handover at the patron&apos;s registered delivery address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
