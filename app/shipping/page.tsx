import React from 'react';
import { Truck, ShieldCheck, Clock } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow">DOORSTEP DELIVERY</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'var(--color-espresso)', marginBottom: '16px' }}>
            Shipping & Transit Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-muted-text)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
            Every MK Silver Hub parcel is shipped in tamper-evident, fully insured luxury packaging directly from our Jaipur atelier.
          </p>
        </div>

        {/* Core Policy Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }} className="shipping-cards-grid">
          <div style={{ backgroundColor: 'var(--bg-cream)', padding: '28px 20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <Truck size={28} color="var(--color-champagne)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>Free Shipping</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', margin: 0 }}>On all orders above ₹999 across India (flat ₹99 under ₹999).</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-cream)', padding: '28px 20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <Clock size={28} color="var(--color-champagne)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>3–5 Business Days</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', margin: 0 }}>Dispatch within 24 hours via BlueDart & Delhivery Express.</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-cream)', padding: '28px 20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <ShieldCheck size={28} color="var(--color-champagne)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>100% Transit Insured</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', margin: 0 }}>Full replacement guarantee against transit damage or loss.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div style={{ backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-editorial)', border: '1px solid var(--color-border)', padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '8px' }}>Pan-India Coverage</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
              We service over 25,000 PIN codes across all states and union territories in India. For metro cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata), delivery typically arrives within 48 to 72 hours.
            </p>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '8px' }}>Tamper-Evident Luxury Packaging</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
              All jewellery is encased in a signature MK Silver Hub presentation box, anti-tarnish velvet travel pouch, microfiber polishing cloth, and laminated BIS 925 Hallmark Purity Certificate.
            </p>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '8px' }}>Live Parcel Tracking</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
              As soon as your parcel departs our Johari Bazaar atelier, tracking notifications with a real-time tracking link are dispatched via SMS, Email, and WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
