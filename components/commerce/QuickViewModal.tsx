'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, ShieldCheck, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { useCommerce } from './CommerceContext';
import { formatPrice } from '@/lib/api';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist } = useCommerce();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Default');

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
  const whatsappUrl = `https://wa.me/917425058118?text=${encodeURIComponent(
    `Hi MK Silver Hub, I'm interested in ${quickViewProduct.name} (${formatPrice(quickViewProduct.price)}). Can you share more details?`
  )}`;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(20, 18, 15, 0.6)',
          backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Modal Dialog Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-cream)',
          borderRadius: 'var(--radius-editorial)',
          boxShadow: 'var(--shadow-modal)',
          zIndex: 10,
          overflowY: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '28px',
          padding: '32px'
        }}
        className="quickview-grid"
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(33, 25, 20, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-espresso)',
            zIndex: 20
          }}
        >
          <X size={20} />
        </button>

        {/* Left: Gallery */}
        <div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '380px',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#F0ECE6',
              marginBottom: '12px'
            }}
          >
            <Image
              src={quickViewProduct.images[selectedImageIdx] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              style={{ objectFit: 'cover' }}
            />
            {quickViewProduct.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  fontSize: '0.65rem',
                  padding: '4px 10px',
                  backgroundColor: 'var(--color-espresso)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 600,
                  letterSpacing: '0.08em'
                }}
              >
                {quickViewProduct.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {quickViewProduct.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIdx(i)}
                  style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedImageIdx === i ? '2px solid var(--color-champagne)' : '1px solid var(--color-border)',
                    opacity: selectedImageIdx === i ? 1 : 0.7
                  }}
                >
                  <Image src={img} alt="Thumbnail" fill sizes="60px" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-champagne)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
              <ShieldCheck size={16} />
              <span>{quickViewProduct.purity} • {quickViewProduct.weight}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.2, color: 'var(--color-espresso)', marginBottom: '8px' }}>
              {quickViewProduct.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(quickViewProduct.rating) ? '#D4AF37' : 'none'} color="#D4AF37" />
                ))}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
                {quickViewProduct.rating}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
                ({quickViewProduct.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.compareAtPrice && (
                <>
                  <span style={{ fontSize: '1rem', color: 'var(--color-light-text)', textDecoration: 'line-through' }}>
                    {formatPrice(quickViewProduct.compareAtPrice)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-copper)', fontWeight: 600 }}>
                    {quickViewProduct.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.6, marginBottom: '20px' }}>
              {quickViewProduct.description}
            </p>

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-espresso)' }}>Quantity:</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '6px 12px', color: 'var(--color-espresso)' }}
                >
                  -
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '6px 12px', color: 'var(--color-espresso)' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  addToCart(quickViewProduct, quantity, selectedSize);
                  closeQuickView();
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '14px' }}
              >
                <ShoppingBag size={18} />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                aria-label="Wishlist toggle"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isFavorited ? '#E53E3E' : 'var(--color-espresso)'
                }}
              >
                <Heart size={20} fill={isFavorited ? '#E53E3E' : 'none'} />
              </button>
            </div>

            {/* WhatsApp Consultation */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: '#E8F8EE',
                color: '#128C7E',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageCircle size={16} />
              <span>Ask details on WhatsApp</span>
            </a>

            {/* View Full Product link */}
            <Link
              href={`/product/${quickViewProduct.slug}`}
              onClick={closeQuickView}
              style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'var(--color-champagne)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                marginTop: '4px'
              }}
            >
              <span>View Complete Specifications & 360° View</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .quickview-grid {
            grid-template-columns: 1fr !important;
            padding: 24px 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
