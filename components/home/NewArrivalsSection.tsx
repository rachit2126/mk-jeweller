'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Heart, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { addToCart, toggleWishlist, isInWishlist } = useCommerce();

  useEffect(() => {
    fetch('/api/products?isNewArrival=true&limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to load new arrivals:', err))
      .finally(() => setLoading(false));
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="new-arrivals"
      aria-label="MK Silver Hub New Arrivals"
      style={{
        width: '100%',
        backgroundColor: '#F8F7F3',
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
        <div className="new-arrivals-layout">
          {/* Left Column: Heading, Subtitle & Shop Now CTA */}
          <div className="new-arrivals-header-col">
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              JUST IN
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: '#111111',
                margin: '0 0 10px 0',
                lineHeight: 1.1,
              }}
            >
              NEW ARRIVALS
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body), "Jost", -apple-system, sans-serif',
                fontSize: '0.92rem',
                color: '#6F6F6A',
                margin: '0 0 24px 0',
                lineHeight: 1.5,
              }}
            >
              Fresh designs for your jewellery collection.
            </p>

            <div>
              <Link
                href="/shop?sort=newest"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  textDecoration: 'none',
                  paddingBottom: '3px',
                  borderBottom: '1px solid #111111',
                }}
                className="shop-now-link"
              >
                <span>SHOP NOW</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column: Carousel with product cards */}
          <div className="new-arrivals-slider-col">
            <div
              ref={sliderRef}
              className="new-arrivals-track"
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                paddingBottom: '8px',
              }}
            >
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: '0 0 240px',
                      height: '300px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E7E2',
                    }}
                  />
                ))
              ) : (
                products.map((product) => {
                  const wishlisted = isInWishlist?.(product.id) || false;
                  const img = product.images?.[0] || '/images/collection-rings.jpg';

                  return (
                    <div
                      key={product.id}
                      className="na-card"
                      style={{
                        flex: '0 0 240px',
                        scrollSnapAlign: 'start',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8E7E2',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Image */}
                      <Link
                        href={`/product/${product.slug || product.id}`}
                        style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '1/1',
                          backgroundColor: '#F8F7F3',
                          overflow: 'hidden',
                          display: 'block',
                          marginBottom: '10px',
                        }}
                      >
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          style={{ objectFit: 'cover' }}
                          className="na-img"
                        />
                      </Link>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        aria-label={`Wishlist ${product.name}`}
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          zIndex: 3,
                          background: 'rgba(255, 255, 255, 0.85)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: wishlisted ? '#B76E79' : '#111111',
                        }}
                      >
                        <Heart
                          size={14}
                          strokeWidth={1.5}
                          fill={wishlisted ? '#B76E79' : 'none'}
                        />
                      </button>

                      {/* Info */}
                      <Link
                        href={`/product/${product.slug || product.id}`}
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          color: '#111111',
                          textDecoration: 'none',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          marginBottom: '4px',
                        }}
                      >
                        {product.name}
                      </Link>

                      <span
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#111111',
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Slider Next Arrow Overlay */}
            <button
              onClick={scrollRight}
              aria-label="Next new arrival products"
              className="na-arrow-btn"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .new-arrivals-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          align-items: center;
        }

        .new-arrivals-header-col {
          display: flex;
          flex-direction: column;
          justifyContent: center;
        }

        .new-arrivals-slider-col {
          position: relative;
          overflow: hidden;
        }

        .new-arrivals-track::-webkit-scrollbar {
          display: none;
        }

        .na-card {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .na-card:hover {
          border-color: #111111;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
        }

        .na-card:hover .na-img {
          transform: scale(1.04);
        }

        .na-img {
          transition: transform 0.4s ease;
        }

        .na-arrow-btn {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          z-index: 5;
          transition: all 0.2s ease;
        }

        .na-arrow-btn:hover {
          background: #111111;
          color: #FFFFFF;
          border-color: #111111;
        }

        .shop-now-link:hover {
          opacity: 0.75;
        }

        @media (max-width: 900px) {
          .new-arrivals-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
