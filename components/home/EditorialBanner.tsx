'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function EditorialBanner() {
  return (
    <section
      aria-label="The Art of Silver Campaign"
      style={{
        width: '100%',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          alignItems: 'center',
          minHeight: 'clamp(380px, 48vh, 520px)',
        }}
        className="art-of-silver-grid"
      >
        {/* Left Typography & Story */}
        <div
          style={{
            padding: 'clamp(40px, 6vw, 80px) clamp(24px, 4vw, 64px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2rem, 3.4vw, 3rem)',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              margin: '0 0 16px 0',
              lineHeight: 1.1,
            }}
          >
            THE ART OF SILVER
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body), "Jost", -apple-system, sans-serif',
              fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)',
              lineHeight: 1.6,
              color: '#BFC1C4',
              margin: '0 0 32px 0',
              maxWidth: '440px',
              fontWeight: 400,
            }}
          >
            Contemporary forms. Traditional craftsmanship.
            <br />
            Timeless 925 silver.
          </p>

          <div>
            <Link
              href="/collections"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: '4px',
                borderBottom: '1px solid #FFFFFF',
                transition: 'opacity 0.2s ease',
              }}
              className="art-cta"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Full-Bleed Jewellery Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '340px',
          }}
          className="art-img-container"
        >
          <Image
            src="/images/editorial/art-of-silver-banner.jpg"
            alt="MK Silver Hub The Art of Silver 925 Floral Link Jewellery"
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .art-cta:hover {
          opacity: 0.8;
        }
        @media (max-width: 900px) {
          .art-of-silver-grid {
            grid-template-columns: 1fr;
          }
          .art-img-container {
            min-height: 280px;
          }
        }
      `}</style>
    </section>
  );
}
