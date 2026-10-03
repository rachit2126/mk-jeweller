import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-main, #FDFBF7)',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-cream, #F5F2EB)',
            border: '1px solid var(--color-border, #E8E4DC)',
            marginBottom: '28px',
            color: 'var(--color-espresso, #1A1A1A)',
          }}
        >
          <Compass size={30} strokeWidth={1.5} />
        </div>

        <span
          style={{
            display: 'block',
            fontSize: '0.78rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-champagne, #8E7051)',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          404 • Page Not Found
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display, serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-espresso, #1A1A1A)',
            lineHeight: 1.2,
            marginBottom: '16px',
            fontWeight: 500,
          }}
        >
          A Lost Treasure
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--color-muted-text, #666666)',
            lineHeight: 1.7,
            marginBottom: '36px',
          }}
        >
          The piece or curation you were searching for is not available or may have moved. Explore our hallmarked 925 sterling silver catalog.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-espresso, #1A1A1A)',
              color: '#FFFFFF',
              padding: '14px 28px',
              borderRadius: '2px',
              fontSize: '0.85rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
            }}
          >
            <span>Explore All Jewellery</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              color: 'var(--color-espresso, #1A1A1A)',
              border: '1px solid var(--color-border, #E8E4DC)',
              padding: '14px 26px',
              borderRadius: '2px',
              fontSize: '0.85rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
