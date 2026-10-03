'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetch('/api/products?isNewArrival=true&limit=12')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to load new arrivals:', err))
      .finally(() => setLoading(false));
  }, []);

  // Check scroll position for slider controls
  const checkScrollState = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    checkScrollState();
    const current = sliderRef.current;
    if (current) {
      current.addEventListener('scroll', checkScrollState, { passive: true });
      window.addEventListener('resize', checkScrollState);
    }
    return () => {
      if (current) current.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState, products, loading]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const delta = direction === 'left' ? -310 : 310;
    sliderRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(checkScrollState, 450);
  };

  const count = products.length;

  return (
    <section
      id="new-arrivals"
      aria-label="MK Silver Hub New Arrivals"
      style={{
        width: '100%',
        backgroundColor: '#F8F7F3',
        padding: 'clamp(56px, 7vw, 92px) 0',
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
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 'clamp(28px, 4vw, 40px)',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#8A8A85',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              JUST IN
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: '#111111',
                margin: '0 0 6px 0',
                lineHeight: 1.1,
              }}
            >
              NEW ARRIVALS
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.92rem',
                color: '#6F6F6A',
                margin: 0,
              }}
            >
              Fresh designs for your jewellery collection.
            </p>
          </div>

          {/* Right Header: Shop Now Link + Slider Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <Link
              href="/shop?sort=newest"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#111111',
                textDecoration: 'none',
                paddingBottom: '2px',
                borderBottom: '1px solid #111111',
              }}
            >
              <span>SHOP NOW</span>
              <ArrowRight size={13} />
            </Link>

            {!loading && count >= 4 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => scrollByAmount('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous new arrivals"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E7E2',
                    color: canScrollLeft ? '#111111' : '#CCCCCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                    opacity: canScrollLeft ? 1 : 0.45,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ChevronLeft size={17} strokeWidth={1.8} />
                </button>

                <button
                  onClick={() => scrollByAmount('right')}
                  disabled={!canScrollRight}
                  aria-label="Next new arrivals"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E7E2',
                    color: canScrollRight ? '#111111' : '#CCCCCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: canScrollRight ? 'pointer' : 'not-allowed',
                    opacity: canScrollRight ? 1 : 0.45,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ChevronRight size={17} strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* ADAPTIVE PRESENTATION                                    */}
        {/* ======================================================== */}

        {/* 1. Loading */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E7E2',
                  height: '420px',
                  animation: 'shimmerPulse 1.6s infinite ease-in-out',
                }}
              />
            ))}
          </div>
        )}

        {/* 2. Empty State */}
        {!loading && count === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E7E2',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.92rem',
                color: '#6F6F6A',
                margin: '0 0 16px',
              }}
            >
              New 925 sterling pieces are currently being hallmarked in our workshop.
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Explore Collection
            </Link>
          </div>
        )}

        {/* 3. Exactly 1 Product -> Centered Luxury Showcase */}
        {!loading && count === 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '0 auto',
              width: '100%',
              maxWidth: '360px',
            }}
          >
            <ProductCard product={products[0]} priority={true} />
          </div>
        )}

        {/* 4. Exactly 2 Products -> Centered 2-Card Layout */}
        {!loading && count === 2 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 340px))',
              justifyContent: 'center',
              gap: '24px',
              maxWidth: '740px',
              margin: '0 auto',
            }}
          >
            {products.map((p, idx) => (
              <ProductCard key={p.id || p.slug} product={p} priority={idx === 0} />
            ))}
          </div>
        )}

        {/* 5. Exactly 3 Products -> Centered 3-Card Layout */}
        {!loading && count === 3 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 340px))',
              justifyContent: 'center',
              gap: '24px',
              maxWidth: '1080px',
              margin: '0 auto',
            }}
          >
            {products.map((p, idx) => (
              <ProductCard key={p.id || p.slug} product={p} priority={idx < 2} />
            ))}
          </div>
        )}

        {/* 6. 4+ Products -> Horizontal Carousel Track */}
        {!loading && count >= 4 && (
          <div
            ref={sliderRef}
            className="new-arrivals-slider-track"
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '16px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
            }}
          >
            {products.map((product, idx) => (
              <div
                key={product.id || product.slug}
                className="na-slide-item"
                style={{
                  flex: '0 0 calc(25% - 15px)',
                  minWidth: '260px',
                  maxWidth: '320px',
                  scrollSnapAlign: 'start',
                  boxSizing: 'border-box',
                }}
              >
                <ProductCard product={product} layout="slider" priority={idx < 4} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .new-arrivals-slider-track::-webkit-scrollbar {
          display: none;
        }
        @keyframes shimmerPulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
        @media (max-width: 1024px) {
          .na-slide-item {
            flex: 0 0 calc(33.333% - 14px) !important;
            min-width: 240px !important;
          }
        }
        @media (max-width: 640px) {
          .na-slide-item {
            flex: 0 0 76vw !important;
            min-width: 220px !important;
          }
        }
      `}</style>
    </section>
  );
}
