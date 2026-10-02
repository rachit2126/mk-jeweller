'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const MEN_CATEGORIES = [
  { label: 'CHAINS', href: '/shop?category=necklaces&collection=men' },
  { label: 'BRACELETS', href: '/shop?category=bracelets&collection=men' },
  { label: 'PENDANTS', href: '/shop?category=pendants&collection=men' },
  { label: 'RINGS', href: '/shop?category=rings&collection=men' },
  { label: 'CUFFLINKS', href: '/shop?collection=men' },
];

export default function MenJewellerySection() {
  return (
    <section
      aria-label="MK Silver Hub Men's Collection"
      style={{
        width: '100%',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 0.8fr',
          alignItems: 'center',
          minHeight: 'clamp(400px, 50vh, 540px)',
        }}
        className="men-section-grid"
      >
        {/* Left Column: Heading & CTAs */}
        <div
          style={{
            padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 48px)',
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
              margin: '0 0 14px 0',
              lineHeight: 1.1,
            }}
          >
            SILVER FOR HIM
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body), "Jost", -apple-system, sans-serif',
              fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)',
              lineHeight: 1.6,
              color: '#BFC1C4',
              margin: '0 0 32px 0',
              maxWidth: '380px',
            }}
          >
            Strength in simplicity.
            <br />
            Men&apos;s jewellery for modern expression.
          </p>

          <div>
            <Link
              href="/shop?collection=men"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #FFFFFF',
                color: '#FFFFFF',
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '14px 28px',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }}
              className="men-cta-btn"
            >
              <span>SHOP MEN&apos;S</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Center: Editorial Masculine Photography */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '340px',
          }}
          className="men-img-col"
        >
          <Image
            src="/images/editorial/silver-for-him.jpg"
            alt="MK Silver Hub 925 Sterling Silver Men's Curb Chain Bracelet"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>

        {/* Right Column: Category Quick Links */}
        <div
          style={{
            padding: 'clamp(32px, 4vw, 48px) clamp(24px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '8px',
          }}
          className="men-categories-col"
        >
          {MEN_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              className="men-cat-item"
            >
              <span>{cat.label}</span>
              <ArrowRight size={13} className="men-cat-arrow" />
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .men-cta-btn:hover {
          background-color: #FFFFFF !important;
          color: #111111 !important;
        }

        .men-cat-item:hover {
          color: #FFFFFF !important;
          padding-left: 6px !important;
          border-bottom-color: rgba(255, 255, 255, 0.4) !important;
        }

        .men-cat-item:hover .men-cat-arrow {
          transform: translateX(4px);
        }

        .men-cat-arrow {
          transition: transform 0.2s ease;
        }

        @media (max-width: 992px) {
          .men-section-grid {
            grid-template-columns: 1fr;
          }
          .men-img-col {
            min-height: 280px;
          }
        }
      `}</style>
    </section>
  );
}
