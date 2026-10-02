'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Star, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

export default function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { addToCart, toggleWishlist, isInWishlist } = useCommerce();

  useEffect(() => {
    fetch('/api/products?isBestSeller=true&limit=10')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to load best sellers:', err))
      .finally(() => setLoading(false));
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="best-sellers"
      aria-label="MK Silver Hub Best Sellers"
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
        {/* Section Header with View All & Carousel Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 'clamp(28px, 4vw, 44px)',
            gap: '20px',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              POPULAR CHOICES
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: '#111111',
                margin: '0 0 6px 0',
                lineHeight: 1.1,
              }}
            >
              BEST SELLERS
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body), "Jost", -apple-system, sans-serif',
                fontSize: '0.92rem',
                color: '#6F6F6A',
                margin: 0,
              }}
            >
              The pieces everyone is wearing.
            </p>
          </div>

          {/* Right Header Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/shop?isBestSeller=true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.78rem',
                fontWeight: 500,
                color: '#111111',
                textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
              className="view-all-link"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={scrollLeft}
                aria-label="Previous products"
                className="slider-nav-btn"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Next products"
                className="slider-nav-btn"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Product Slider */}
        <div
          ref={sliderRef}
          className="product-slider-row"
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '16px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 calc(20% - 16px)',
                  minWidth: '240px',
                  height: '380px',
                  backgroundColor: '#F8F7F3',
                  borderRadius: '2px',
                }}
              />
            ))
          ) : (
            products.map((product) => {
              const wishlisted = isInWishlist?.(product.id) || false;
              const mainImg = product.images?.[0] || '/images/collection-rings.jpg';
              const hoverImg = product.images?.[1] || mainImg;
              const discountPercent =
                product.compareAtPrice && product.compareAtPrice > product.price
                  ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                  : 0;

              return (
                <div
                  key={product.id}
                  className="product-card"
                  style={{
                    flex: '0 0 calc(20% - 16px)',
                    minWidth: '240px',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E7E2',
                    padding: '12px',
                    position: 'relative',
                    boxSizing: 'border-box',
                    transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
                  }}
                >
                  {/* Image Container */}
                  <Link
                    href={`/product/${product.slug || product.id}`}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1/1',
                      backgroundColor: '#F8F7F3',
                      overflow: 'hidden',
                      display: 'block',
                      marginBottom: '14px',
                    }}
                    className="product-img-link"
                  >
                    <Image
                      src={mainImg}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      style={{ objectFit: 'cover' }}
                      className="product-img primary"
                    />
                    {hoverImg !== mainImg && (
                      <Image
                        src={hoverImg}
                        alt={`${product.name} alternate view`}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        style={{ objectFit: 'cover' }}
                        className="product-img secondary"
                      />
                    )}

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: '#111111',
                          color: '#FFFFFF',
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          padding: '3px 6px',
                          letterSpacing: '0.04em',
                          zIndex: 2,
                        }}
                      >
                        -{discountPercent}%
                      </span>
                    )}
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label={`Wishlist ${product.name}`}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      zIndex: 3,
                      background: 'rgba(255, 255, 255, 0.85)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: wishlisted ? '#B76E79' : '#111111',
                      transition: 'transform 0.15s ease, color 0.15s ease',
                    }}
                    className="wishlist-btn"
                  >
                    <Heart
                      size={15}
                      strokeWidth={1.5}
                      fill={wishlisted ? '#B76E79' : 'none'}
                    />
                  </button>

                  {/* Product Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Link
                      href={`/product/${product.slug || product.id}`}
                      style={{
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.84rem',
                        fontWeight: 500,
                        color: '#111111',
                        textDecoration: 'none',
                        lineHeight: 1.35,
                        marginBottom: '6px',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                      className="product-title"
                    >
                      {product.name}
                    </Link>

                    {/* Pricing */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          color: '#111111',
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span
                          style={{
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            fontSize: '0.8rem',
                            color: '#6F6F6A',
                            textDecoration: 'line-through',
                          }}
                        >
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', color: '#111111' }}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={11}
                            fill="#111111"
                            stroke="#111111"
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.72rem',
                          color: '#6F6F6A',
                        }}
                      >
                        ({product.reviewsCount || 128})
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product, 1)}
                      style={{
                        width: '100%',
                        backgroundColor: '#FFFFFF',
                        color: '#111111',
                        border: '1px solid #111111',
                        padding: '10px 0',
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        marginTop: 'auto',
                        transition: 'background-color 0.2s ease, color 0.2s ease',
                      }}
                      className="add-to-cart-btn"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        .product-slider-row::-webkit-scrollbar {
          display: none;
        }

        .slider-nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: '#111111';
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slider-nav-btn:hover {
          background-color: #111111;
          color: #FFFFFF;
          border-color: #111111;
        }

        .product-card:hover {
          border-color: #111111;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .product-img {
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease;
        }

        .product-img.secondary {
          opacity: 0;
        }

        .product-card:hover .product-img.primary {
          transform: scale(1.04);
        }

        .product-card:hover .product-img.secondary {
          opacity: 1;
          transform: scale(1.04);
        }

        .product-title:hover {
          color: #6F6F6A !important;
        }

        .add-to-cart-btn:hover {
          background-color: #111111 !important;
          color: #FFFFFF !important;
        }

        @media (max-width: 1200px) {
          .product-card {
            flex: 0 0 calc(25% - 16px) !important;
          }
        }

        @media (max-width: 900px) {
          .product-card {
            flex: 0 0 calc(40% - 12px) !important;
          }
        }

        @media (max-width: 600px) {
          .product-card {
            flex: 0 0 74vw !important;
          }
        }
      `}</style>
    </section>
  );
}
