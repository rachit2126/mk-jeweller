'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const OCCASIONS = [
  {
    title: 'EVERYDAY',
    href: '/shop?occasion=everyday',
    image: '/images/occasions/everyday-elegance.jpg',
    alt: 'MK Silver Hub Everyday Silver Jewellery',
  },
  {
    title: 'DATE NIGHT',
    href: '/shop?occasion=date-night',
    image: '/images/occasions/gifting-collection.jpg',
    alt: 'MK Silver Hub Date Night Shimmering Silver Jewellery',
  },
  {
    title: 'FESTIVE',
    href: '/shop?occasion=festive',
    image: '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg',
    alt: 'MK Silver Hub Festive Royal Silver Jhumkas and Chokers',
  },
  {
    title: 'BRIDAL',
    href: '/shop?occasion=bridal',
    image: '/images/occasions/bridal-collection.jpg',
    alt: 'MK Silver Hub Regal Polki Kundan Silver Bridal Sets',
  },
];

export default function OccasionSection() {
  return (
    <section
      aria-label="Jewellery For Every Moment"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 'clamp(56px, 7vw, 96px) 0',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 40px)',
        }}
      >
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 48px)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#111111',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            JEWELLERY FOR EVERY MOMENT
          </h2>
        </div>

        {/* 4 Occasion Cards */}
        <div className="occasion-grid">
          {OCCASIONS.map((occ) => (
            <Link
              key={occ.title}
              href={occ.href}
              className="occ-card"
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                backgroundColor: '#F8F7F3',
                overflow: 'hidden',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              <Image
                src={occ.image}
                alt={occ.alt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                style={{ objectFit: 'cover' }}
                className="occ-img"
              />
              <div className="occ-overlay" />
              <div className="occ-content">
                <span className="occ-title">{occ.title}</span>
                <ArrowRight size={14} className="occ-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .occasion-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .occ-img {
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .occ-card:hover .occ-img {
          transform: scale(1.06);
        }

        .occ-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(17, 17, 17, 0) 50%, rgba(17, 17, 17, 0.7) 100%);
          transition: opacity 0.3s ease;
        }

        .occ-content {
          position: absolute;
          bottom: 18px;
          left: 18px;
          right: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #FFFFFF;
          z-index: 2;
        }

        .occ-title {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letterSpacing: 0.16em;
          text-transform: uppercase;
          color: #FFFFFF;
        }

        .occ-arrow {
          transition: transform 0.25s ease;
        }

        .occ-card:hover .occ-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 900px) {
          .occasion-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .occasion-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 12px;
            padding-bottom: 8px;
          }
          .occasion-grid::-webkit-scrollbar {
            display: none;
          }
          .occ-card {
            flex: 0 0 74vw;
            aspect-ratio: 4/3;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
}
