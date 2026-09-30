'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/lib/types';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/api';

export default function BestSellersSection() {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useCommerce();

  // Curated Best Sellers list (matches the reference: Pearl Blossom, Lotus Bloom, Baroque Pearl, Pink Stone Floral + top best sellers)
  const bestSellers: Product[] = React.useMemo(() => {
    // Specifically arrange the 4 hero pieces from the mockup first:
    const targetOrder = [
      'pearl-blossom-necklace',
      'kundan-chandbali-earrings', // Lotus Bloom Ruby & Polki Choker Set
      'minimal-silver-chain-necklace', // Sculpted Baroque Pearl Layered Chain
      'pink-stone-pendant',
      'emerald-dewdrop-ring',
      'floral-silver-earrings',
      'royal-heritage-choker-set',
      'rose-quartz-pendant',
    ];

    const ordered: Product[] = [];
    targetOrder.forEach((slug) => {
      const match = PRODUCTS.find((p) => p.slug === slug);
      if (match && !ordered.some((item) => item.id === match.id)) {
        ordered.push(match);
      }
    });

    // Fill remaining if needed
    PRODUCTS.forEach((p) => {
      if ((p.isBestSeller || p.badge === 'BEST SELLER') && !ordered.some((item) => item.id === p.id)) {
        ordered.push(p);
      }
    });

    return ordered.slice(0, 8);
  }, []);

  const total = bestSellers.length;
  // On desktop 4 visible cards, maxIndex is total - 4
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Drag & Swipe states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const maxDesktopIndex = Math.max(0, total - 4);
  const maxTabletIndex = Math.max(0, total - 2);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxDesktopIndex));
  }, [maxDesktopIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < maxDesktopIndex ? prev + 1 : 0));
  }, [maxDesktopIndex]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(Math.min(idx, maxDesktopIndex));
  };

  // Autoplay (5.5s interval, pauses on hover / interaction)
  useEffect(() => {
    if (isPaused || isDragging) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, isDragging, handleNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Mouse Drag handlers for Desktop
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -50) {
      handleNext();
    } else if (dragOffset > 50) {
      handlePrev();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      if (dragOffset < -50) handleNext();
      else if (dragOffset > 50) handlePrev();
      setIsDragging(false);
      setDragOffset(0);
    }
    setIsPaused(false);
  };

  // Touch Swipe handlers for mobile / tablet
  const onTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    if (dragOffset < -45) {
      handleNext();
    } else if (dragOffset > 45) {
      handlePrev();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  // Synchronize mobile scroll position with active dot
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.clientWidth * 0.82;
    const newIdx = Math.round(scrollLeft / cardWidth);
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < total) {
      setCurrentIndex(newIdx);
    }
  };

  return (
    <section
      className="bestsellers-editorial-section"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        backgroundColor: '#FFF9F3',
        paddingTop: 'clamp(96px, 10vw, 126px)',
        paddingBottom: 'clamp(72px, 8vw, 110px)',
        overflow: 'hidden',
        outline: 'none',
      }}
    >
      {/* Editorial Soft Peach & Rose Radial Light Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 28%, rgba(255, 227, 211, 0.55) 0%, rgba(246, 214, 217, 0.28) 45%, rgba(255, 249, 243, 0) 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Subtle Floating Petals for Editorial Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <div
          className="petal-anim-1"
          style={{
            position: 'absolute',
            top: '18%',
            left: '6%',
            width: '20px',
            height: '26px',
            borderRadius: '50% 0 50% 50%',
            transform: 'rotate(-25deg)',
            background: 'linear-gradient(135deg, rgba(246, 214, 217, 0.85) 0%, rgba(255, 240, 242, 0.95) 100%)',
            boxShadow: '0 2px 8px rgba(183, 110, 121, 0.12)',
            opacity: 0.75,
          }}
        />
        <div
          className="petal-anim-2"
          style={{
            position: 'absolute',
            top: '24%',
            right: '28%',
            width: '18px',
            height: '24px',
            borderRadius: '0 50% 50% 50%',
            transform: 'rotate(35deg)',
            background: 'linear-gradient(135deg, rgba(255, 227, 211, 0.9) 0%, rgba(246, 214, 217, 0.8) 100%)',
            boxShadow: '0 2px 8px rgba(183, 110, 121, 0.10)',
            opacity: 0.72,
          }}
        />
        <div
          className="petal-anim-3"
          style={{
            position: 'absolute',
            bottom: '14%',
            left: '4%',
            width: '22px',
            height: '28px',
            borderRadius: '50% 50% 0 50%',
            transform: 'rotate(-15deg)',
            background: 'linear-gradient(135deg, rgba(246, 214, 217, 0.88) 0%, rgba(255, 238, 230, 0.9) 100%)',
            boxShadow: '0 2px 8px rgba(183, 110, 121, 0.12)',
            opacity: 0.7,
          }}
        />
      </div>

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(1.2rem, 3.5vw, 3rem)',
        }}
      >
        {/* Section Editorial Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 'clamp(36px, 4.5vw, 54px)',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  color: '#B76E79',
                  textTransform: 'uppercase',
                }}
              >
                BEST SELLERS
              </span>
              <span
                style={{
                  width: '32px',
                  height: '1px',
                  backgroundColor: '#B76E79',
                  opacity: 0.55,
                  display: 'inline-block',
                }}
              />
            </div>

            {/* Main Editorial Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(2.4rem, 4.2vw, 3.5rem)',
                fontWeight: 400,
                color: '#3B2B2B',
                lineHeight: 1.12,
                margin: '0 0 10px 0',
                letterSpacing: '-0.01em',
              }}
            >
              Our Most <span style={{ fontStyle: 'italic', color: '#B76E79' }}>Loved Pieces</span>
            </h2>

            {/* Supporting Description */}
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: 'clamp(0.92rem, 1.05vw, 1.02rem)',
                color: '#6F5A58',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Timeless designs, chosen and loved by our customers.
            </p>
          </div>

          {/* Refined View All Button */}
          <Link
            href="/shop?badge=BEST%20SELLER"
            className="bestseller-view-all-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.84rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              color: '#3B2B2B',
              backgroundColor: 'transparent',
              border: '1.2px solid rgba(59, 43, 43, 0.35)',
              padding: '11px 26px',
              borderRadius: '999px',
              textDecoration: 'none',
              transition: 'all 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <span>View All</span>
            <ArrowRight size={14} className="view-all-arrow" />
          </Link>
        </div>

        {/* Desktop & Tablet Carousel Stage */}
        <div
          className="editorial-carousel-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            position: 'relative',
            width: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous products"
            className="carousel-nav-btn arrow-prev"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next products"
            className="carousel-nav-btn arrow-next"
          >
            <ChevronRight size={22} />
          </button>

          {/* Carousel Viewport Overflow Wrapper */}
          <div
            className="carousel-viewport-wrapper"
            style={{
              width: '100%',
              overflow: 'hidden',
              padding: '24px 0 34px 0',
            }}
          >
            {/* Sliding Track */}
            <div
              ref={trackRef}
              className="carousel-sliding-track"
              style={{
                display: 'flex',
                gap: 'clamp(14px, 1.8vw, 22px)',
                transform: `translateX(calc(-1 * (${currentIndex} * (100% + clamp(14px, 1.8vw, 22px)) / 4) + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 700ms cubic-bezier(.22, 1, .36, 1)',
              }}
            >
              {bestSellers.map((product, index) => {
                // Compute relative slot (0 to 3 in viewport)
                const relSlot = index - currentIndex;
                const isHovered = hoveredCardId === product.id;
                const isItemAdded = addedId === product.id;
                const isFavorited = isInWishlist(product.id);

                // Editorial Wave Calculations (Slot 0 lower, Slot 1 highest, Slot 2 medium-high, Slot 3 lower)
                let waveY = 0;
                let waveScale = 1;
                let waveZ = 1;
                let waveOpacity = 1;

                if (relSlot === 0) {
                  waveY = 22;
                  waveScale = 0.95;
                  waveZ = 2;
                  waveOpacity = 0.94;
                } else if (relSlot === 1) {
                  waveY = -14;
                  waveScale = 1.04;
                  waveZ = 5;
                  waveOpacity = 1;
                } else if (relSlot === 2) {
                  waveY = 2;
                  waveScale = 1.02;
                  waveZ = 4;
                  waveOpacity = 1;
                } else if (relSlot === 3) {
                  waveY = 24;
                  waveScale = 0.95;
                  waveZ = 2;
                  waveOpacity = 0.94;
                } else {
                  waveY = 24;
                  waveScale = 0.92;
                  waveZ = 1;
                  waveOpacity = 0.35;
                }

                // If currently hovered by user, lift slightly and elevate z-index
                const finalY = isHovered ? waveY - 6 : waveY;
                const finalScale = isHovered ? waveScale * 1.015 : waveScale;
                const finalZ = isHovered ? 12 : waveZ;

                return (
                  <div
                    key={product.id}
                    className="editorial-product-slide"
                    onMouseEnter={() => setHoveredCardId(product.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    style={{
                      flex: '0 0 calc((100% - 3 * clamp(14px, 1.8vw, 22px)) / 4)',
                      minWidth: '260px',
                      transform: `translateY(${finalY}px) scale(${finalScale})`,
                      opacity: waveOpacity,
                      zIndex: finalZ,
                      transition: isDragging
                        ? 'none'
                        : 'transform 700ms cubic-bezier(.22, 1, .36, 1), opacity 700ms ease',
                    }}
                  >
                    {/* Rounded Card Shell with Soft Cream/White Glass Surface */}
                    <div
                      className="bestseller-card-shell"
                      style={{
                        position: 'relative',
                        width: '100%',
                        borderRadius: '28px',
                        background: 'rgba(255, 255, 255, 0.45)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1.2px solid rgba(255, 255, 255, 0.85)',
                        boxShadow: isHovered
                          ? '0 24px 55px rgba(65, 40, 35, 0.16), 0 0 24px rgba(217, 185, 138, 0.22), inset 0 1px 2px rgba(255, 255, 255, 0.95)'
                          : '0 18px 45px rgba(65, 40, 35, 0.11), 0 0 16px rgba(217, 185, 138, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
                        overflow: 'hidden',
                        transition: 'box-shadow 350ms ease, border-color 350ms ease',
                      }}
                    >
                      {/* Media Image Frame */}
                      <div
                        className="bestseller-img-container"
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: 'clamp(310px, 26vw, 360px)',
                          borderRadius: '22px 22px 0 0',
                          overflow: 'hidden',
                          backgroundColor: '#FFF9F3',
                        }}
                      >
                        <Link
                          href={`/product/${product.slug}`}
                          style={{ position: 'absolute', inset: 0, display: 'block' }}
                        >
                          {/* Primary Image */}
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
                            style={{
                              objectFit: 'cover',
                              transform:
                                isHovered && product.secondaryImage
                                  ? 'scale(1.05)'
                                  : isHovered
                                  ? 'scale(1.04)'
                                  : 'scale(1)',
                              opacity: isHovered && product.secondaryImage ? 0 : 1,
                              transition: 'transform 600ms cubic-bezier(.22, 1, .36, 1), opacity 450ms ease',
                            }}
                          />

                          {/* Secondary Image crossfade on hover */}
                          {product.secondaryImage && (
                            <Image
                              src={product.secondaryImage}
                              alt={`${product.name} alternate view`}
                              fill
                              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
                              style={{
                                objectFit: 'cover',
                                transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                                opacity: isHovered ? 1 : 0,
                                transition: 'transform 600ms cubic-bezier(.22, 1, .36, 1), opacity 450ms ease',
                              }}
                            />
                          )}
                        </Link>

                        {/* Top-Left Badge (BEST SELLER / NEW) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            zIndex: 3,
                          }}
                        >
                          {product.badge === 'NEW ARRIVAL' ? (
                            <span
                              style={{
                                fontSize: '0.64rem',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                backgroundColor: 'rgba(156, 87, 98, 0.88)',
                                backdropFilter: 'blur(8px)',
                                color: '#FFFFFF',
                                padding: '4px 11px',
                                borderRadius: '999px',
                                border: '1px solid rgba(255, 255, 255, 0.65)',
                                display: 'inline-block',
                                boxShadow: '0 2px 8px rgba(65, 40, 35, 0.12)',
                              }}
                            >
                              NEW
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: '0.64rem',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                backgroundColor: 'rgba(183, 110, 121, 0.88)',
                                backdropFilter: 'blur(8px)',
                                color: '#FFFFFF',
                                padding: '4px 11px',
                                borderRadius: '999px',
                                border: '1px solid rgba(255, 255, 255, 0.65)',
                                display: 'inline-block',
                                boxShadow: '0 2px 8px rgba(183, 110, 121, 0.25)',
                              }}
                            >
                              BEST SELLER
                            </span>
                          )}
                        </div>

                        {/* Top-Right Translucent Circular Wishlist Button */}
                        <button
                          onClick={(e) => handleWishlist(e, product)}
                          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                          className="bestseller-wishlist-circle"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.88)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(65, 40, 35, 0.10)',
                            zIndex: 3,
                            cursor: 'pointer',
                            transition: 'all 0.22s ease',
                          }}
                        >
                          <Heart
                            size={16}
                            fill={isFavorited ? '#B76E79' : 'none'}
                            color={isFavorited ? '#B76E79' : '#5A4545'}
                          />
                        </button>

                        {/* Center-Bottom Quick View Glass Button (Appears on Hover) */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '50px',
                            left: '0',
                            right: '0',
                            display: 'flex',
                            justifyContent: 'center',
                            zIndex: 4,
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                            transition: 'all 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            pointerEvents: isHovered ? 'auto' : 'none',
                          }}
                        >
                          <button
                            onClick={(e) => handleQuickView(e, product)}
                            className="bestseller-quickview-btn"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.92)',
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.95)',
                              color: '#3B2B2B',
                              padding: '7px 18px',
                              borderRadius: '999px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                              boxShadow: '0 6px 18px rgba(65, 40, 35, 0.12)',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Eye size={13} color="#B76E79" />
                            <span>Quick View</span>
                          </button>
                        </div>
                      </div>

                      {/* Floating Frosted Glass Information Panel Overlapping Image */}
                      <div
                        className="bestseller-glass-panel"
                        style={{
                          position: 'relative',
                          margin: '-42px 8px 8px 8px',
                          zIndex: 5,
                          backgroundColor: 'rgba(255, 255, 255, 0.74)',
                          backdropFilter: 'blur(18px)',
                          WebkitBackdropFilter: 'blur(18px)',
                          border: '1px solid rgba(255, 255, 255, 0.85)',
                          borderRadius: '22px',
                          padding: '14px 14px 14px 14px',
                          boxShadow:
                            '0 12px 30px rgba(65, 40, 35, 0.08), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
                        }}
                      >
                        {/* Botanical Line-Art Watermark in Bottom-Right */}
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 28 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '12px',
                            opacity: 0.35,
                            pointerEvents: 'none',
                          }}
                          aria-hidden="true"
                        >
                          <path
                            d="M14 26 C14 18 19 12 25 8"
                            stroke="#B76E79"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M14 19 C10 16 6 12 5 7"
                            stroke="#B76E79"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          <path
                            d="M14 14 C17 10 21 9 22 6 C20 6 16 8 14 12Z"
                            fill="rgba(246, 214, 217, 0.35)"
                            stroke="#B76E79"
                            strokeWidth="0.9"
                          />
                        </svg>

                        {/* Product Title */}
                        <Link
                          href={`/product/${product.slug}`}
                          className="bestseller-title-link"
                          style={{
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            fontSize: '0.94rem',
                            fontWeight: 500,
                            color: '#3B2B2B',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: '6px',
                            textDecoration: 'none',
                            transition: 'color 0.2s ease',
                          }}
                        >
                          {product.name}
                        </Link>

                        {/* Pricing & Discount Row */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '8px',
                            marginBottom: '6px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '1.04rem',
                              fontWeight: 600,
                              color: '#3B2B2B',
                              fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            }}
                          >
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span
                              style={{
                                fontSize: '0.8rem',
                                color: '#8E7A77',
                                textDecoration: 'line-through',
                                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                              }}
                            >
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                          {product.discountPercent && (
                            <span
                              style={{
                                fontSize: '0.66rem',
                                fontWeight: 600,
                                letterSpacing: '0.04em',
                                backgroundColor: 'rgba(183, 110, 121, 0.14)',
                                color: '#B76E79',
                                padding: '2px 7px',
                                borderRadius: '999px',
                              }}
                            >
                              {product.discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Star Rating & Review Count */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            marginBottom: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', color: '#D9B98A' }}>
                            {[...Array(5)].map((_, starIdx) => (
                              <Star
                                key={starIdx}
                                size={12}
                                fill={starIdx < Math.floor(product.rating) ? '#D9B98A' : 'none'}
                                color="#D9B98A"
                              />
                            ))}
                          </div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: '#6F5A58',
                              fontWeight: 500,
                              fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            }}
                          >
                            ({product.reviewsCount})
                          </span>
                        </div>

                        {/* Add to Bag Primary Action Button */}
                        <button
                          onClick={(e) => handleAdd(e, product)}
                          className="bestseller-add-to-bag-btn"
                          style={{
                            width: '100%',
                            backgroundColor: isItemAdded ? '#3E8E68' : '#B76E79',
                            color: '#FFFFFF',
                            padding: '10px 14px',
                            borderRadius: '999px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '7px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: isItemAdded
                              ? '0 4px 14px rgba(62, 142, 104, 0.35)'
                              : '0 4px 14px rgba(183, 110, 121, 0.28)',
                            transition: 'all 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
                            position: 'relative',
                            zIndex: 6,
                          }}
                        >
                          <ShoppingBag size={13} />
                          <span>{isItemAdded ? 'Added to Bag' : 'Add to Bag'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Swipeable Lookbook Container (<= 768px) */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="bestsellers-mobile-scroll"
          style={{
            display: 'none',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            gap: '14px',
            padding: '16px 4px 24px 4px',
            scrollbarWidth: 'none',
          }}
        >
          {bestSellers.map((product) => {
            const isItemAdded = addedId === product.id;
            const isFavorited = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="mobile-product-card-wrap"
                style={{
                  flex: '0 0 clamp(270px, 80vw, 320px)',
                  scrollSnapAlign: 'center',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '26px',
                    background: 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1.2px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 16px 40px rgba(65, 40, 35, 0.10)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '310px',
                      borderRadius: '20px 20px 0 0',
                      overflow: 'hidden',
                      backgroundColor: '#FFF9F3',
                    }}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      style={{ position: 'absolute', inset: 0, display: 'block' }}
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 85vw, 320px"
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>

                    {/* Badge */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          backgroundColor:
                            product.badge === 'NEW ARRIVAL'
                              ? 'rgba(156, 87, 98, 0.9)'
                              : 'rgba(183, 110, 121, 0.9)',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: '999px',
                        }}
                      >
                        {product.badge === 'NEW ARRIVAL' ? 'NEW' : 'BEST SELLER'}
                      </span>
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={(e) => handleWishlist(e, product)}
                      aria-label="Wishlist"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.88)',
                        border: '1px solid rgba(255, 255, 255, 0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                      }}
                    >
                      <Heart
                        size={15}
                        fill={isFavorited ? '#B76E79' : 'none'}
                        color={isFavorited ? '#B76E79' : '#5A4545'}
                      />
                    </button>
                  </div>

                  {/* Glass Info Panel */}
                  <div
                    style={{
                      position: 'relative',
                      margin: '-40px 8px 8px 8px',
                      zIndex: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.78)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.85)',
                      borderRadius: '20px',
                      padding: '14px',
                    }}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      style={{
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.92rem',
                        fontWeight: 500,
                        color: '#3B2B2B',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '6px',
                        textDecoration: 'none',
                      }}
                    >
                      {product.name}
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#3B2B2B' }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span style={{ fontSize: '0.78rem', color: '#8E7A77', textDecoration: 'line-through' }}>
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                      {product.discountPercent && (
                        <span
                          style={{
                            fontSize: '0.64rem',
                            fontWeight: 600,
                            backgroundColor: 'rgba(183, 110, 121, 0.14)',
                            color: '#B76E79',
                            padding: '2px 6px',
                            borderRadius: '999px',
                          }}
                        >
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', color: '#D9B98A' }}>
                        {[...Array(5)].map((_, sIdx) => (
                          <Star
                            key={sIdx}
                            size={11}
                            fill={sIdx < Math.floor(product.rating) ? '#D9B98A' : 'none'}
                            color="#D9B98A"
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#6F5A58' }}>({product.reviewsCount})</span>
                    </div>

                    <button
                      onClick={(e) => handleAdd(e, product)}
                      style={{
                        width: '100%',
                        backgroundColor: isItemAdded ? '#3E8E68' : '#B76E79',
                        color: '#FFFFFF',
                        padding: '10px',
                        borderRadius: '999px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <ShoppingBag size={13} />
                      <span>{isItemAdded ? 'Added' : 'Add to Bag'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Pagination Progress Indicators (● ━ ━ ━ ━) */}
        <div
          className="carousel-pagination-pills"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '28px',
          }}
        >
          {Array.from({ length: maxDesktopIndex + 1 }).map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  height: '5px',
                  width: isActive ? '34px' : '9px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#B76E79' : 'rgba(59, 43, 43, 0.20)',
                  transition: 'all 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                  padding: 0,
                }}
              />
            );
          })}
        </div>
      </div>

      <style jsx>{`
        /* Petal Animations */
        @keyframes floatPetalSlow {
          0%, 100% {
            transform: translateY(0px) rotate(-25deg);
          }
          50% {
            transform: translateY(-8px) rotate(-18deg);
          }
        }
        @keyframes floatPetalMid {
          0%, 100% {
            transform: translateY(0px) rotate(35deg);
          }
          50% {
            transform: translateY(-10px) rotate(42deg);
          }
        }
        .petal-anim-1 {
          animation: floatPetalSlow 7s ease-in-out infinite;
        }
        .petal-anim-2 {
          animation: floatPetalMid 8.5s ease-in-out infinite 1s;
        }
        .petal-anim-3 {
          animation: floatPetalSlow 9s ease-in-out infinite 0.5s;
        }

        /* View All Hover */
        .bestseller-view-all-pill:hover {
          border-color: #B76E79 !important;
          background-color: #B76E79 !important;
          color: #FFFFFF !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.35);
        }
        .bestseller-view-all-pill:hover .view-all-arrow {
          transform: translateX(4px);
        }
        .view-all-arrow {
          transition: transform 0.25s ease;
        }

        /* Carousel Navigation Buttons */
        .carousel-nav-btn {
          position: absolute;
          top: 48%;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 24px rgba(65, 40, 35, 0.12);
          color: #B76E79;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 10;
        }
        .arrow-prev {
          left: -24px;
          transform: translateY(-50%);
        }
        .arrow-next {
          right: -24px;
          transform: translateY(-50%);
        }
        .carousel-nav-btn:hover {
          background-color: #B76E79;
          color: #FFFFFF;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 12px 28px rgba(183, 110, 121, 0.42);
        }

        /* Card Interactive States */
        .bestseller-title-link:hover {
          color: #B76E79 !important;
        }

        .bestseller-wishlist-circle:hover {
          background-color: rgba(255, 255, 255, 1) !important;
          transform: scale(1.08);
        }

        .bestseller-quickview-btn:hover {
          background-color: #FFFFFF !important;
          color: #B76E79 !important;
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(65, 40, 35, 0.18) !important;
        }

        .bestseller-add-to-bag-btn:hover {
          background-color: #9C5762 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.42) !important;
        }

        /* Tablet Responsive (<= 1024px) */
        @media (max-width: 1024px) {
          .editorial-product-slide {
            flex: 0 0 calc((100% - clamp(14px, 1.8vw, 22px)) / 2) !important;
            min-width: 250px !important;
          }
          .arrow-prev {
            left: -12px;
          }
          .arrow-next {
            right: -12px;
          }
        }

        /* Mobile Responsive (<= 768px) */
        @media (max-width: 768px) {
          .editorial-carousel-stage {
            display: none !important;
          }
          .bestsellers-mobile-scroll {
            display: flex !important;
          }
          .carousel-nav-btn {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .editorial-product-slide,
          .carousel-sliding-track {
            transition: none !important;
          }
          .petal-anim-1,
          .petal-anim-2,
          .petal-anim-3 {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
