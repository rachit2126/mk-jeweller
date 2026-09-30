'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { PRODUCTS } from '@/data/products';

export default function NewArrivalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const newArrivals = PRODUCTS.filter(p => p.isNewArrival || p.featured).slice(0, 8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg-cream)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="eyebrow">JUST DROPPED</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--color-espresso)', marginBottom: '8px' }}>
              New Arrivals
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-muted-text)' }}>
              Fresh designs, made to become your next favourites.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/shop?badge=NEW%20ARRIVAL"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-espresso)'
              }}
              className="view-all-link"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>

            {/* Slider Navigation Controls */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => scroll('left')}
                aria-label="Previous products"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-espresso)',
                  transition: 'all 0.2s ease'
                }}
                className="nav-arrow-btn"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Next products"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-espresso)',
                  transition: 'all 0.2s ease'
                }}
                className="nav-arrow-btn"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Slider / Grid */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '16px',
            scrollbarWidth: 'none'
          }}
          className="arrivals-slider"
        >
          {newArrivals.map((product, idx) => (
            <div
              key={product.id}
              style={{
                flex: '0 0 calc(25% - 15px)',
                minWidth: '260px',
                scrollSnapAlign: 'start'
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
          color: var(--color-champagne);
        }
        .nav-arrow-btn:hover {
          background-color: var(--color-espresso);
          color: #FFFFFF;
          border-color: var(--color-espresso);
        }
        @media (max-width: 1024px) {
          .product-col {
            flex: 0 0 calc(33.333% - 14px) !important;
          }
        }
        @media (max-width: 640px) {
          .product-col {
            flex: 0 0 calc(75% - 10px) !important;
            min-width: 210px !important;
          }
        }
      `}</style>
    </section>
  );
}
