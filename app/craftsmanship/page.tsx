import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Concept & Hand Sketching',
    desc: 'Each jewel begins as a pencil sketch inspired by traditional Mughal motifs, geometric architecture, and modern minimalist contours.',
    image: 'https://images.unsplash.com/photo-1513201099705-a9742e15a5b6?q=80&w=600&auto=format&fit=crop'
  },
  {
    step: '02',
    title: 'Pure Bullion Alloy & Casting',
    desc: 'Certified 99.9% pure fine silver is blended with precisely 7.5% copper alloy to achieve the optimal durability and luster of 925 sterling silver.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'
  },
  {
    step: '03',
    title: 'Intricate Hand-Filigree & Chasing',
    desc: 'Master karigars hand-twist, hammer, and chase delicate silver wires to construct breathtaking openwork lacework and traditional jhumka bells.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop'
  },
  {
    step: '04',
    title: 'Precision Micro-Setting',
    desc: 'Freshwater pearls, rubies, and AAA-grade moissanite zirconias are seated under magnification in micro-prongs and bezel collars.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
  },
  {
    step: '05',
    title: 'BIS 925 Hallmark Laser Assay',
    desc: 'Prior to finishing, every batch is independently assayed and laser-inscribed with the official government BIS 925 purity mark and logo.',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop'
  },
  {
    step: '06',
    title: 'Platinum Rhodium Bath & Final Polish',
    desc: 'A final electrochemical dip in pure white rhodium seals the silver against oxidation, bestowing a mirror-like finish that endures.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
  }
];

export default function CraftsmanshipPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="eyebrow">ARTISANAL HERITAGE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-espresso)', marginBottom: '16px' }}>
            The Art Behind Every Piece
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-muted-text)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
            Discover the six meticulous stages that transform solid bullion into breathtaking, lifetime-lasting 925 sterling jewellery.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', marginBottom: '80px' }} className="craft-grid">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-cream)',
                borderRadius: 'var(--radius-editorial)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
              className="craft-step-card"
            >
              <div style={{ position: 'relative', width: '100%', height: '260px', backgroundColor: '#EDE8E0' }}>
                <Image src={s.image} alt={s.title} fill sizes="500px" style={{ objectFit: 'cover' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
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
                    fontSize: '1.1rem'
                  }}
                >
                  {s.step}
                </span>
              </div>

              <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '8px' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'var(--color-espresso)', borderRadius: 'var(--radius-editorial)', color: '#FFFFFF' }}>
          <Sparkles size={32} color="var(--color-champagne)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '12px' }}>
            Wear Heritage. Wear Authenticity.
          </h2>
          <p style={{ color: '#D8D1C7', maxWidth: '520px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
            Every creation is shipped with a certified BIS 925 authenticity card and custom velvet anti-tarnish storage pouch.
          </p>
          <Link href="/shop" className="btn-primary" style={{ backgroundColor: '#FCFAF6', color: 'var(--color-espresso)', border: 'none' }}>
            <span>Explore Handcrafted Suites</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
