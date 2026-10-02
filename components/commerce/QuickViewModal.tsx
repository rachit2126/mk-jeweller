'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { useCommerce } from './CommerceContext';
import { formatPrice } from '@/lib/format';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist } = useCommerce();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedImageIdx(0);
    setQuantity(1);
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

  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(quickViewProduct, quantity);
    closeQuickView();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal Dialog Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E7E2',
          overflowY: 'auto',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
          animation: 'modalZoom 0.22s ease',
          fontFamily: 'var(--font-ui), "Jost", sans-serif',
        }}
        className="quickview-grid"
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F8F7F3',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            color: '#111111',
          }}
        >
          <X size={16} />
        </button>

        {/* Left: Product Image */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#F8F7F3',
            minHeight: '360px',
            borderRight: '1px solid #E8E7E2',
          }}
        >
          <Image
            src={quickViewProduct.images[selectedImageIdx] || quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            fill
            sizes="400px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right: Info */}
        <div
          style={{
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              925 STERLING SILVER
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 10px',
                lineHeight: 1.2,
              }}
            >
              {quickViewProduct.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111111' }}>
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.compareAtPrice && quickViewProduct.compareAtPrice > quickViewProduct.price && (
                <span style={{ fontSize: '0.92rem', color: '#6F6F6A', textDecoration: 'line-through' }}>
                  {formatPrice(quickViewProduct.compareAtPrice)}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.84rem', color: '#4A4A46', lineHeight: 1.6, margin: '0 0 20px' }}>
              {quickViewProduct.description ||
                'Handcrafted in solid 925 sterling silver with precision rhodium anti-tarnish protective barrier.'}
            </p>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Qty:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8E7E2' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ width: '28px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleAdd}
              style={{
                width: '100%',
                padding: '13px 0',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              ADD TO BAG
            </button>

            <Link
              href={`/product/${quickViewProduct.slug}`}
              onClick={closeQuickView}
              style={{
                textAlign: 'center',
                fontSize: '0.74rem',
                color: '#111111',
                textDecoration: 'underline',
                padding: '4px 0',
              }}
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
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
          .quickview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
