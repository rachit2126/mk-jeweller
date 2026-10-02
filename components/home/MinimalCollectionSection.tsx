'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const MINIMAL_ITEMS = [
  {
    title: 'Minimal Solitaire Band',
    category: 'Rings',
    image: '/images/why-choose/premium-quality-ring.jpg',
    href: '/shop?category=rings',
    alt: 'MK Silver Hub Minimal Silver Band',
  },
  {
    title: 'Floating Station Chain',
    category: 'Necklaces',
    image: '/images/why-choose/ethically-sourced-necklace.jpg',
    href: '/shop?category=necklaces',
    alt: 'MK Silver Hub Floating Station Silver Necklace',
  },
  {
    title: 'Polished Huggie Hoops',
    category: 'Earrings',
    image: '/images/why-choose/unique-designs-earrings.jpg',
    href: '/shop?category=earrings',
    alt: 'MK Silver Hub Polished Silver Huggie Hoop Earrings',
  },
];

export default function MinimalCollectionSection() {
  return (
    <section
      aria-label="The Minimal Collection Showcase"
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
        <div className="minimal-grid">
          {/* Left Editorial Text Column */}
          <div className="minimal-text-col">
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              THE MINIMAL COLLECTION
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: '#111111',
                margin: '0 0 16px 0',
                lineHeight: 1.05,
              }}
            >
              LESS.
              <br />
              BUT BETTER.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body), "Jost", -apple-system, sans-serif',
                fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)',
                lineHeight: 1.6,
                color: '#6F6F6A',
                margin: '0 0 32px 0',
                maxWidth: '360px',
              }}
            >
              Clean lines, refined finishes and everyday 925 silver.
            </p>

            <div>
              <Link
                href="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  textDecoration: 'none',
                  paddingBottom: '3px',
                  borderBottom: '1px solid #111111',
                }}
                className="minimal-cta"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right 3-Image Gallery */}
          <div className="minimal-images-row">
            {MINIMAL_ITEMS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="minimal-card"
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  backgroundColor: '#F8F7F3',
                  overflow: 'hidden',
                  display: 'block',
                  textDecoration: 'none',
                }}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  className="minimal-img"
                />
                <div className="minimal-overlay" />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      fontSize: '0.64rem',
                      fontWeight: 500,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.75)',
                      marginBottom: '2px',
                    }}
                  >
                    {item.category}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .minimal-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
          align-items: center;
        }

        .minimal-images-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .minimal-cta:hover {
          opacity: 0.75;
        }

        .minimal-img {
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .minimal-card:hover .minimal-img {
          transform: scale(1.05);
        }

        .minimal-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(17, 17, 17, 0) 55%, rgba(17, 17, 17, 0.7) 100%);
          transition: opacity 0.3s ease;
        }

        @media (max-width: 992px) {
          .minimal-grid {
            grid-template-columns: 1fr;
          }
          .minimal-images-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .minimal-images-row {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 12px;
            padding-bottom: 8px;
          }
          .minimal-images-row::-webkit-scrollbar {
            display: none;
          }
          .minimal-card {
            flex: 0 0 72vw !important;
            aspect-ratio: 3/4;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
}
