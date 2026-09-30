import React from 'react';
import { Sparkles, Droplets, ShieldCheck, Sun, HeartHandshake, Package } from 'lucide-react';

const CARE_TIPS = [
  {
    icon: Package,
    title: 'Individual Storage',
    desc: 'Always store each piece separately in the airtight anti-tarnish pouch provided with your order to avoid scratching and exposure to atmospheric moisture.'
  },
  {
    icon: Sun,
    title: 'The Last On, First Off Rule',
    desc: 'Put your silver jewellery on after applying cosmetics, hairspray, lotions, and perfumes. Allow all beauty products to fully dry before wearing your jewels.'
  },
  {
    icon: Droplets,
    title: 'Keep Away from Moisture & Pools',
    desc: 'Remove your 925 sterling pieces before showering, swimming in chlorinated pools, ocean water, or hot yoga sessions to preserve the protective rhodium coat.'
  },
  {
    icon: Sparkles,
    title: 'Gentle Microfiber Polish',
    desc: 'Buff gently with the complimentary soft microfiber cloth provided. Never use harsh paper towels or abrasive toothpaste which may scratch the mirror finish.'
  },
  {
    icon: ShieldCheck,
    title: 'Tarnish Prevention',
    desc: 'Solid 925 silver can naturally react to airborne sulfur over prolonged periods. Regular gentle wear actually prevents tarnish as skin oils naturally protect silver.'
  },
  {
    icon: HeartHandshake,
    title: 'Patron Re-Polishing Service',
    desc: 'MK Silver Hub offers lifelong professional ultrasonic cleaning and rhodium re-plating services for all registered purchases.'
  }
];

export default function JewelleryCarePage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="eyebrow">PRESERVING LUSTER</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'var(--color-espresso)', marginBottom: '16px' }}>
            Care For Your Silver
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-muted-text)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
            Your 925 sterling silver jewels are crafted to be cherished for lifetimes. Follow these simple guidelines to keep your pieces radiating pure moonlight brilliance.
          </p>
        </div>

        {/* Tips Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px', marginBottom: '64px' }} className="care-grid">
          {CARE_TIPS.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-cream)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--color-border)',
                  padding: '32px 28px',
                  display: 'flex',
                  gap: '20px'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(201, 163, 90, 0.15)',
                    color: 'var(--color-champagne)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '8px' }}>
                    {tip.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.6, margin: 0 }}>
                    {tip.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Section */}
        <div style={{ textAlign: 'center', padding: '36px', backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '8px' }}>
            Have a question about caring for a specific gemstone?
          </h3>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.92rem', marginBottom: '20px' }}>
            Our jewellery concierge in Jaipur is available on WhatsApp to assist with care recommendations.
          </p>
          <a
            href="https://wa.me/917425058118?text=Hi%20MK%20Silver%20Hub%2C%20I%20have%20a%20question%20regarding%20jewellery%20care."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
          >
            Ask On WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
