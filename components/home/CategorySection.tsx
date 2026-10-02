'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryItem {
  title: string;
  href: string;
  image: string;
  alt: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: 'Earrings',
    href: '/shop?category=earrings',
    image: '/images/collection-earrings.jpg',
    alt: 'MK Silver Hub 925 Sterling Silver Earrings',
  },
  {
    title: 'Necklaces',
    href: '/shop?category=necklaces',
    image: '/images/collection-necklaces.jpg',
    alt: 'MK Silver Hub Fine Silver Necklaces',
  },
  {
    title: 'Rings',
    href: '/shop?category=rings',
    image: '/images/collection-rings.jpg',
    alt: 'MK Silver Hub Solitaire and Stacking Silver Rings',
  },
  {
    title: 'Bracelets',
    href: '/shop?category=bracelets',
    image: '/images/occasions/everyday-elegance.jpg',
    alt: 'MK Silver Hub Delicate Silver Bracelets',
  },
  {
    title: 'Bangles',
    href: '/shop?category=bangles',
    image: '/images/occasions/gifting-collection.jpg',
    alt: 'MK Silver Hub 925 Sterling Silver Bangles',
  },
  {
    title: 'Anklets',
    href: '/shop?category=anklets',
    image: '/images/occasions/festive-sparkle.jpg',
    alt: 'MK Silver Hub Handcrafted Silver Anklets',
  },
  {
    title: 'Pendants',
    href: '/shop?category=pendants',
    image: '/images/why-choose/ethically-sourced-necklace.jpg',
    alt: 'MK Silver Hub Solitaire and Gemstone Pendants',
  },
  {
    title: "Men's",
    href: '/shop?category=men',
    image: '/images/categories/men-chains.png',
    alt: 'MK Silver Hub Men Silver Chains and Bracelets',
  },
  {
    title: 'Bridal',
    href: '/collections/bridal',
    image: '/images/occasions/bridal-collection.jpg',
    alt: 'MK Silver Hub Royal Jaipur Bridal Silver Jewellery',
  },
];

export default function CategorySection() {
  return (
    <section
      aria-label="Shop MK Silver Hub by Category"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 'clamp(44px, 5.5vw, 68px) 0 clamp(48px, 6vw, 76px)',
        borderBottom: '1px solid #E8E7E2',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 3.8vw, 44px)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#111111',
              margin: '0 0 8px',
              lineHeight: 1.15,
            }}
          >
            SHOP BY CATEGORY
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.86rem',
              color: '#6F6F6A',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            Pieces designed for every expression.
          </p>
        </div>

        {/* Circular / Editorial Category Cards Row (Screen 1 in Reference Mockup) */}
        <div className="category-scroll-container">
          <div className="category-circular-grid">
            {CATEGORIES.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="category-circle-item"
              >
                {/* Circular Image Container */}
                <div className="circle-image-wrapper">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="140px"
                    className="circle-image"
                  />
                </div>

                {/* Category Title */}
                <span className="circle-item-title">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .category-scroll-container {
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 8px 4px 14px;
        }

        .category-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .category-circular-grid {
          display: flex;
          align-items: flex-start;
          justifyContent: space-between;
          gap: clamp(14px, 2vw, 28px);
          min-width: min-content;
        }

        .category-circle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          gap: 12px;
          flex-shrink: 0;
          width: clamp(96px, 9.8vw, 130px);
          cursor: pointer;
        }

        .circle-image-wrapper {
          position: relative;
          width: clamp(86px, 8.8vw, 120px);
          height: clamp(86px, 8.8vw, 120px);
          border-radius: 50%;
          overflow: hidden;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.35s ease;
        }

        .circle-image {
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .category-circle-item:hover .circle-image-wrapper {
          transform: translateY(-4px) scale(1.03);
          border-color: #111111;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
        }

        .category-circle-item:hover .circle-image {
          transform: scale(1.08);
        }

        .circle-item-title {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #111111;
          letter-spacing: 0.04em;
          text-align: center;
          transition: color 0.15s ease;
        }

        .category-circle-item:hover .circle-item-title {
          color: #111111;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .category-circular-grid {
            justify-content: flex-start;
          }
        }
      `}</style>
    </section>
  );
}
