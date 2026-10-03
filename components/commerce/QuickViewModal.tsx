'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, Star, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCommerce } from './CommerceContext';
import { formatPrice } from '@/lib/format';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist } = useCommerce();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setSelectedImageIdx(0);
    setQuantity(1);
    setIsAdded(false);
  }, [quickViewProduct]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickView();
    };
    if (quickViewProduct) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quickViewProduct, closeQuickView]);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist ? isInWishlist(quickViewProduct.id) : false;
  const isOutOfStock = quickViewProduct.inStock === false || (quickViewProduct.stock !== undefined && quickViewProduct.stock === 0);
  const realReviewsCount = quickViewProduct.reviewsCount ?? quickViewProduct.numReviews ?? 0;
  const hasRealReviews = realReviewsCount > 0;

  const images = (quickViewProduct.images && quickViewProduct.images.length > 0)
    ? quickViewProduct.images
    : quickViewProduct.secondaryImage
    ? [quickViewProduct.secondaryImage]
    : [];

  const activeImage = images[selectedImageIdx] || images[0];

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(quickViewProduct, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      closeQuickView();
    }, 1200);
  };

  const discountPercent =
    quickViewProduct.compareAtPrice && quickViewProduct.compareAtPrice > quickViewProduct.price
      ? Math.round(((quickViewProduct.compareAtPrice - quickViewProduct.price) / quickViewProduct.compareAtPrice) * 100)
      : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 3vw, 32px)',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Modal Dialog Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E7E2',
          overflowY: 'auto',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
          animation: 'modalZoom 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          fontFamily: 'var(--font-ui), "Jost", sans-serif',
        }}
        className="quickview-modal-grid"
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          aria-label="Close Quick View"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#F8F7F3',
            border: '1px solid #E8E7E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            color: '#111111',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E8E7E2')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8F7F3')}
        >
          <X size={16} />
        </button>

        {/* Left Column: Product Image & Gallery */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#F8F7F3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid #E8E7E2',
          }}
        >
          {/* Main Large Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '115%',
              overflow: 'hidden',
            }}
          >
            {activeImage ? (
              <Image
                src={activeImage}
                alt={quickViewProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8A8A85',
                }}
              >
                <Sparkles size={32} strokeWidth={1.2} />
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(quickViewProduct)}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: '1px solid #E8E7E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isFavorited ? '#111111' : '#6F6F6A',
                zIndex: 5,
              }}
            >
              <Heart
                size={15}
                fill={isFavorited ? '#111111' : 'none'}
                color={isFavorited ? '#111111' : '#6F6F6A'}
                strokeWidth={1.6}
              />
            </button>
          </div>

          {/* Thumbnails Strip */}
          {images.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid #E8E7E2',
                overflowX: 'auto',
              }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  style={{
                    position: 'relative',
                    width: '54px',
                    height: '54px',
                    flexShrink: 0,
                    border: selectedImageIdx === idx ? '2px solid #111111' : '1px solid #E8E7E2',
                    padding: 0,
                    backgroundColor: '#F8F7F3',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill sizes="54px" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div
          style={{
            padding: 'clamp(24px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#8A8A85',
                }}
              >
                {quickViewProduct.categoryLabel || quickViewProduct.category || '925 Sterling Silver'}
              </span>
              <span style={{ color: '#D8D5CE' }}>•</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: isOutOfStock ? '#A83232' : '#2D6A4F',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {isOutOfStock ? 'Out of Stock' : 'In Stock & Ready to Ship'}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 10px',
                lineHeight: 1.2,
              }}
            >
              {quickViewProduct.name}
            </h2>

            {/* Price section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 600, color: '#111111' }}>
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.compareAtPrice && quickViewProduct.compareAtPrice > quickViewProduct.price && (
                <span style={{ fontSize: '0.94rem', color: '#8A8A85', textDecoration: 'line-through' }}>
                  {formatPrice(quickViewProduct.compareAtPrice)}
                </span>
              )}
              {discountPercent && (
                <span
                  style={{
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '2px 7px',
                  }}
                >
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Real Rating guard */}
            {hasRealReviews && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      fill={s <= Math.round(quickViewProduct.rating || 5) ? '#111111' : 'none'}
                      color="#111111"
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.74rem', color: '#6F6F6A' }}>({realReviewsCount} reviews)</span>
              </div>
            )}

            {/* Short Description */}
            <p
              style={{
                fontSize: '0.86rem',
                color: '#4A4A46',
                lineHeight: 1.65,
                margin: '0 0 20px',
              }}
            >
              {quickViewProduct.shortDescription ||
                quickViewProduct.description ||
                'Exquisitely crafted in solid 925 sterling silver with protective rhodium anti-tarnish finish. Hypoallergenic, nickel-free and BIS hallmarked.'}
            </p>

            {/* Hallmark Trust Highlight */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#F8F7F3',
                border: '1px solid #E8E7E2',
                marginBottom: '24px',
                fontSize: '0.75rem',
                color: '#111111',
              }}
            >
              <ShieldCheck size={16} strokeWidth={1.8} color="#111111" />
              <span>Certified BIS 925 Sterling Silver with Authenticity Guarantee</span>
            </div>

            {/* Quantity Picker */}
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Quantity:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #111111' }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    -
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', fontSize: '0.84rem', fontWeight: 600 }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              style={{
                width: '100%',
                padding: '13px 0',
                backgroundColor: isAdded ? '#111111' : isOutOfStock ? '#E8E7E2' : '#111111',
                color: isOutOfStock ? '#8A8A85' : '#FFFFFF',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease',
              }}
            >
              {isAdded ? (
                <>
                  <Check size={15} strokeWidth={2.5} />
                  <span>ADDED TO BAG</span>
                </>
              ) : isOutOfStock ? (
                <span>OUT OF STOCK</span>
              ) : (
                <span>ADD TO BAG</span>
              )}
            </button>

            <Link
              href={`/product/${quickViewProduct.slug || quickViewProduct.id}`}
              onClick={closeQuickView}
              style={{
                textAlign: 'center',
                fontSize: '0.76rem',
                color: '#111111',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 0',
              }}
            >
              <span>View Full Product Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalZoom {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @media (max-width: 768px) {
          .quickview-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
