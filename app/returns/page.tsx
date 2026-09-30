import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageCircle } from 'lucide-react';

const RETURN_STEPS = [
  { step: '01', title: 'Initiate Request', desc: 'Message our concierge on WhatsApp (+91 74250 58118) or log into your account within 15 days of delivery.' },
  { step: '02', title: 'Doorstep Pickup', desc: 'Our courier partner will schedule a complimentary insured reverse pickup from your home address.' },
  { step: '03', title: 'Quality Inspection', desc: 'Upon reaching our Jaipur facility, our gemologist verifies the 925 hallmark tag and original condition.' },
  { step: '04', title: 'Instant Refund', desc: '100% refund is initiated back to your original payment card, UPI ID, or bank account within 24 hours.' }
];

export default function ReturnsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow">HASSLE-FREE ASSURANCE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'var(--color-espresso)', marginBottom: '16px' }}>
            15-Day Easy Returns & Exchange
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-muted-text)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
            We want you to adore your MK Silver Hub pieces. If a design does not fit or delight you completely, return or exchange it with zero friction.
          </p>
        </div>

        {/* 4 Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '56px' }} className="returns-steps-grid">
          {RETURN_STEPS.map((st, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-cream)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
                padding: '28px',
                display: 'flex',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-espresso)',
                  color: 'var(--color-champagne)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}
              >
                {st.step}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '6px' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.5, margin: 0 }}>
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Eligibility criteria */}
        <div style={{ backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-editorial)', border: '1px solid var(--color-border)', padding: '36px', marginBottom: '40px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '16px' }}>
            Return Conditions & Eligibility
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--color-muted-text)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span>Jewel must be in unused, unblemished condition with original security tag intact.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span>Must include the original MK presentation box and BIS 925 Hallmark Certificate.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span>Custom engraved personalised pieces are eligible for resizing or exchange, but not full bullion return.</span>
            </li>
          </ul>
        </div>

        {/* WhatsApp CTA */}
        <div style={{ textAlign: 'center', padding: '36px', backgroundColor: '#E8F8EE', borderRadius: 'var(--radius-card)', border: '1px solid rgba(37, 211, 102, 0.4)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#128C7E', marginBottom: '8px' }}>
            Ready to initiate a return or size exchange?
          </h3>
          <p style={{ color: 'var(--color-espresso)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Our team will arrange your reverse pickup within 10 minutes.
          </p>
          <a
            href="https://wa.me/917425058118?text=Hi%20MK%20Silver%20Hub%2C%20I%20would%20like%20to%20request%20a%20return%20or%20exchange%20for%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp (+91 74250 58118)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
