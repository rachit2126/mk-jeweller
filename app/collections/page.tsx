import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES_DATA } from '@/data/products';

export default function CollectionsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
          <span className="eyebrow">CURATED SUITES</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)', color: 'var(--color-espresso)', marginBottom: '14px' }}>
            Signature Collections
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
            Each suite is sculpted in pure 925 sterling silver, honoring the eternal craft traditions of Jaipur while speaking to contemporary modern aesthetics.
          </p>
        </div>

        {/* 6 Collections Editorial Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px'
          }}
          className="collections-grid"
        >
          {CATEGORIES_DATA.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-editorial)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-espresso)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--color-border)',
                textDecoration: 'none'
              }}
              className="collection-card"
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '120%', overflow: 'hidden' }}>
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  className="col-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(24, 20, 16, 0.85) 0%, rgba(24, 20, 16, 0.1) 60%, transparent 100%)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    right: '24px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    color: '#FFFFFF'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-champagne)', fontWeight: 600 }}>
                      925 STERLING
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: '#FFFFFF', marginTop: '2px' }}>
                      {col.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#ECE7DE', margin: '4px 0 0' }}>
                      {col.tagline}
                    </p>
                  </div>

                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0
                    }}
                    className="col-arrow"
                  >
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
