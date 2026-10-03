'use client';

import React, { useState, useRef, TouchEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Check, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

export interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'slider' | 'compact' | 'editorial' | 'list';
  priority?: boolean;
  showWishlist?: boolean;
  showQuickView?: boolean;
  showRating?: boolean;
  showCategory?: boolean;
  showBadge?: boolean;
  showAddToCart?: boolean;
  showComparePrice?: boolean;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onRemoveWishlist?: (product: Product) => void;
}

export default function ProductCard({
  product,
  layout = 'grid',
  priority = false,
  showWishlist = true,
  showQuickView = true,
  showRating = true,
  showCategory = true,
  showBadge = true,
  showAddToCart = true,
  showComparePrice = true,
  onQuickView,
  onAddToCart,
  onRemoveWishlist,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useCommerce();

  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cartState, setCartState] = useState<'idle' | 'adding' | 'added'>('idle');
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const [primaryImageFailed, setPrimaryImageFailed] = useState(false);
  const [secondaryImageFailed, setSecondaryImageFailed] = useState(false);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const isFavorited = isInWishlist ? isInWishlist(product.id) : false;

  // Real images array
  const images = (product.images && product.images.length > 0)
    ? product.images
    : product.secondaryImage
    ? [product.secondaryImage]
    : [];

  const primaryImage = images[0];
  const secondaryImage = images[1] || product.secondaryImage;
  const hasMultipleImages = images.length > 1 || Boolean(secondaryImage);

  // Discount calculation
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  // Stock status
  const isOutOfStock = product.inStock === false || (product.stock !== undefined && product.stock === 0);
  const isLowStock = !isOutOfStock && product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  // Real reviews check: strictly hide if 0 reviews
  const realReviewsCount = product.reviewsCount ?? product.numReviews ?? 0;
  const hasRealReviews = realReviewsCount > 0;

  // Category name or label
  const categoryLabel =
    product.categoryLabel ||
    product.categoryName ||
    (typeof product.category === 'string' ? product.category.replace(/-/g, ' ') : 'Fine Jewellery');

  // Handle Add to Cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || cartState !== 'idle') return;

    setCartState('adding');
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1);
    }

    setTimeout(() => {
      setCartState('added');
      setTimeout(() => {
        setCartState('idle');
      }, 1500);
    }, 450);
  };

  // Handle Wishlist Click
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistPulse(true);
    setTimeout(() => setWishlistPulse(false), 350);

    if (onRemoveWishlist && isFavorited) {
      onRemoveWishlist(product);
    } else {
      toggleWishlist(product);
    }
  };

  // Handle Quick View
  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else if (openQuickView) {
      openQuickView(product);
    }
  };

  // Touch handlers for mobile image swiping
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45 && activeImageIndex < images.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    } else if (distance < -45 && activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Layout-specific styling
  const isSlider = layout === 'slider';
  const isCompact = layout === 'compact';
  const isEditorial = layout === 'editorial';
  const isList = layout === 'list';

  return (
    <article
      className={`mk-product-card layout-${layout} ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImageIndex(0);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E7E2',
        position: 'relative',
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        height: '100%',
        width: isSlider ? '100%' : undefined,
        minWidth: isSlider ? '260px' : undefined,
        maxWidth: isSlider ? '340px' : undefined,
        boxSizing: 'border-box',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 30px rgba(0, 0, 0, 0.06)' : 'none',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.25s ease',
      }}
    >
      {/* ======================================================== */}
      {/* 1. HERO PRODUCT IMAGE AREA                               */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'relative',
          width: isList ? '40%' : '100%',
          paddingTop: isList ? '0' : isEditorial ? '125%' : '115%',
          height: isList ? '100%' : undefined,
          backgroundColor: '#F8F7F3',
          overflow: 'hidden',
        }}
      >
        <Link
          href={`/product/${product.slug || product.id}`}
          aria-label={product.name}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            zIndex: 1,
          }}
        >
          {primaryImage && !primaryImageFailed ? (
            <>
              {/* Primary Image */}
              <Image
                src={images[activeImageIndex] || primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                onError={() => setPrimaryImageFailed(true)}
                style={{
                  objectFit: 'cover',
                  opacity: isHovered && secondaryImage && !secondaryImageFailed && activeImageIndex === 0 ? 0 : 1,
                  transform: isHovered ? 'scale(1.035)' : 'scale(1)',
                  filter: isOutOfStock ? 'grayscale(0.3) opacity(0.85)' : 'none',
                  transition: 'opacity 0.4s ease-out, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              />

              {/* Secondary Image crossfade on desktop hover */}
              {secondaryImage && !secondaryImageFailed && activeImageIndex === 0 && (
                <Image
                  src={secondaryImage}
                  alt={`${product.name} alternate view`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={() => setSecondaryImageFailed(true)}
                  style={{
                    objectFit: 'cover',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'scale(1.035)' : 'scale(1)',
                    filter: isOutOfStock ? 'grayscale(0.3) opacity(0.85)' : 'none',
                    transition: 'opacity 0.4s ease-out, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
              )}
            </>
          ) : (
            /* Neutral Luxury Jewellery Broken Image Placeholder */
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#F8F7F3',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6F6F6A',
                gap: '8px',
              }}
            >
              <Sparkles size={24} strokeWidth={1.2} color="#8A8A85" />
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.66rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#8A8A85',
                  fontWeight: 600,
                }}
              >
                MK 925 SILVER
              </span>
            </div>
          )}
        </Link>

        {/* ======================================================== */}
        {/* 2. DYNAMIC BADGES (Top-Left, Stacked Vertically)         */}
        {/* ======================================================== */}
        {showBadge && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            {/* Out of Stock Badge */}
            {isOutOfStock && (
              <span
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  display: 'inline-block',
                }}
              >
                OUT OF STOCK
              </span>
            )}

            {/* Sale / Discount Badge */}
            {!isOutOfStock && discountPercent && discountPercent > 0 && (
              <span
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '3px 8px',
                  display: 'inline-block',
                }}
              >
                -{discountPercent}%
              </span>
            )}

            {/* New Arrival Badge */}
            {!isOutOfStock && product.isNewArrival && (
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: '1px solid #111111',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  display: 'inline-block',
                }}
              >
                NEW
              </span>
            )}

            {/* Best Seller Badge */}
            {!isOutOfStock && product.isBestSeller && !product.isNewArrival && (
              <span
                style={{
                  backgroundColor: '#F8F7F3',
                  color: '#111111',
                  border: '1px solid #E8E7E2',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  display: 'inline-block',
                }}
              >
                BEST SELLER
              </span>
            )}

            {/* Low Stock Badge */}
            {isLowStock && (
              <span
                style={{
                  backgroundColor: '#F8F7F3',
                  color: '#111111',
                  border: '1px solid #E8E7E2',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  padding: '2px 6px',
                  display: 'inline-block',
                }}
              >
                ONLY {product.stock} LEFT
              </span>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. WISHLIST BUTTON (Top-Right, Circular, Scale Pulse)    */}
        {/* ======================================================== */}
        {showWishlist && (
          <button
            onClick={handleWishlist}
            aria-label={isFavorited ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(232, 231, 226, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 4,
              cursor: 'pointer',
              color: isFavorited ? '#111111' : '#6F6F6A',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              transform: wishlistPulse ? 'scale(1.18)' : isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, color 0.2s ease',
            }}
          >
            <Heart
              size={15}
              fill={isFavorited ? '#111111' : 'none'}
              color={isFavorited ? '#111111' : '#6F6F6A'}
              strokeWidth={1.6}
            />
          </button>
        )}

        {/* ======================================================== */}
        {/* 4. MULTI-IMAGE DOTS INDICATOR (Optional / Mobile Swipe)  */}
        {/* ======================================================== */}
        {hasMultipleImages && images.length > 1 && (
          <div
            className="card-image-dots"
            style={{
              position: 'absolute',
              bottom: isHovered && showQuickView ? '48px' : '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '5px',
              zIndex: 3,
              transition: 'bottom 0.25s ease',
            }}
          >
            {images.slice(0, 4).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                aria-label={`View image ${idx + 1}`}
                style={{
                  width: activeImageIndex === idx ? '16px' : '5px',
                  height: '5px',
                  borderRadius: '3px',
                  backgroundColor: activeImageIndex === idx ? '#111111' : 'rgba(17, 17, 17, 0.28)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. QUICK VIEW BUTTON (Desktop Hover Reveal from Bottom)  */}
        {/* ======================================================== */}
        {showQuickView && (
          <div
            className="quickview-overlay"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              zIndex: 4,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
              pointerEvents: isHovered ? 'auto' : 'none',
              transition: 'opacity 0.28s ease, transform 0.28s ease',
            }}
          >
            <button
              onClick={handleQuickViewClick}
              aria-label={`Quick view ${product.name}`}
              style={{
                width: '100%',
                padding: '10px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(6px)',
                color: '#111111',
                border: '1px solid #111111',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease, color 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#111111';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.96)';
                e.currentTarget.style.color = '#111111';
              }}
            >
              <Eye size={13} strokeWidth={1.8} />
              <span>QUICK VIEW</span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 6. PRODUCT INFORMATION                                   */}
      {/* ======================================================== */}
      <div
        style={{
          padding: isCompact ? '12px 14px 14px' : '16px 18px 18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div>
          {/* Category / Subtitle */}
          {showCategory && (
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.66rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8A8A85',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {categoryLabel}
            </span>
          )}

          {/* Product Title */}
          <Link
            href={`/product/${product.slug || product.id}`}
            style={{
              textDecoration: 'none',
              color: '#111111',
              display: 'block',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", Georgia, serif',
                fontSize: isCompact ? '1.02rem' : isEditorial ? '1.25rem' : '1.1rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 8px',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '0.01em',
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Price Hierarchy */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: hasRealReviews && showRating ? '6px' : '14px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: isCompact ? '0.94rem' : '1rem',
                fontWeight: 600,
                color: '#111111',
                letterSpacing: '0.01em',
              }}
            >
              {formatPrice(product.price)}
            </span>

            {showComparePrice && product.compareAtPrice && product.compareAtPrice > product.price && (
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.82rem',
                  color: '#8A8A85',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(product.compareAtPrice)}
              </span>
            )}

            {discountPercent && discountPercent > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#111111',
                  letterSpacing: '0.04em',
                }}
              >
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Rating Display — Strictly hidden if no real reviews! */}
          {showRating && hasRealReviews && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }} aria-label={`${product.rating} stars rating`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={11}
                    fill={s <= Math.round(product.rating || 5) ? '#111111' : 'none'}
                    color="#111111"
                    strokeWidth={1}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.74rem',
                  color: '#6F6F6A',
                  marginLeft: '3px',
                }}
              >
                ({realReviewsCount})
              </span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 7. ADD TO CART CTA BUTTON                                */}
        {/* ======================================================== */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || cartState === 'adding'}
            aria-label={
              isOutOfStock
                ? `${product.name} is out of stock`
                : cartState === 'added'
                ? `Added ${product.name} to cart`
                : `Add ${product.name} to cart`
            }
            className={`card-add-btn ${cartState}`}
            style={{
              width: '100%',
              padding: isCompact ? '10px 0' : '11px 0',
              backgroundColor: cartState === 'added' ? '#111111' : '#FFFFFF',
              color: cartState === 'added' ? '#FFFFFF' : isOutOfStock ? '#8A8A85' : '#111111',
              border: isOutOfStock ? '1px solid #E8E7E2' : '1px solid #111111',
              borderRadius: '0px',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              if (!isOutOfStock && cartState === 'idle') {
                e.currentTarget.style.backgroundColor = '#111111';
                e.currentTarget.style.color = '#FFFFFF';
              }
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock && cartState === 'idle') {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#111111';
              }
            }}
          >
            {cartState === 'adding' ? (
              <span>ADDING...</span>
            ) : cartState === 'added' ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                <span>ADDED ✓</span>
              </>
            ) : isOutOfStock ? (
              <span>OUT OF STOCK</span>
            ) : (
              <>
                <span>ADD TO CART</span>
                <ArrowRight size={13} className="cta-arrow" />
              </>
            )}
          </button>
        )}
      </div>

      <style jsx>{`
        .cta-arrow {
          transition: transform 0.2s ease;
        }
        .card-add-btn:hover .cta-arrow {
          transform: translateX(3px);
        }
        @media (hover: none) {
          .quickview-overlay {
            display: none !important;
          }
        }
      `}</style>
    </article>
  );
}
