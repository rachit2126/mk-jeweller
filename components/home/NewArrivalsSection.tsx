'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { PRODUCTS } from '@/data/products';

export default function NewArrivalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival || p.badge === 'NEW ARRIVAL' || p.featured).slice(0, 8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section
      style={{
        backgroundColor: '#FFF9F3',
        padding: 'clamp(48px, 6vw, 84px) 0',
        position: 'relative',
        borderTop: '1px solid rgba(232, 216, 208, 0.65)',
        borderBottom: '1px solid rgba(232, 216, 208, 0.65)',
      }}
    >
      <div className="container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                color: '#B76E79',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              NEW ARRIVALS
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(2.1rem, 3.4vw, 3rem)',
                fontWeight: 500,
                color: '#342727',
                lineHeight: 1.12,
                margin: 0,
              }}
            >
              Freshly crafted for you.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.88rem',
                color: '#806D68',
                marginTop: '6px',
                marginBottom: 0,
              }}
            >
              Handcrafted in 925 sterling silver, sculpted for effortless elegance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/shop?badge=NEW%20ARRIVAL"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#B76E79',
                textDecoration: 'none',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
              }}
              className="view-all-link"
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </Link>

            {/* Slider Navigation Controls (Desktop) */}
            <div className="desktop-slider-arrows" style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => scroll('left')}
                aria-label="Previous products"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid #E8D8D0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#342727',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(59, 43, 43, 0.05)',
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Next products"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid #E8D8D0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#342727',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(59, 43, 43, 0.05)',
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Slider (1.25-card horizontal carousel on mobile) */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '16px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="arrivals-slider"
        >
          {newArrivals.map((product, idx) => (
            <div
              key={product.id}
              style={{
                flex: '0 0 calc((100% - 48px) / 4)',
                minWidth: '260px',
                scrollSnapAlign: 'start',
              }}
              className="product-col"
            >
              <ProductCard product={product} priority={idx < 4} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .arrivals-slider::-webkit-scrollbar {
          display: none;
        }
        .view-all-link:hover {
          color: #9C5762;
        }
        @media (max-width: 1024px) {
          .product-col {
            flex: 0 0 calc((100% - 32px) / 3) !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-slider-arrows {
            display: none !important;
          }
          .product-col {
            flex: 0 0 78vw !important;
            max-width: 310px !important;
            min-width: 250px !important;
          }
        }
      `}</style>
    </section>
  );
}
