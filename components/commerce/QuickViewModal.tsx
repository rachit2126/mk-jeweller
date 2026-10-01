'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, ShieldCheck, Star, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useCommerce } from './CommerceContext';
import { formatPrice } from '@/lib/format';

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
    <div className="quickview-modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
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

      {/* Modal Dialog Card (Bottom sheet on mobile) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          backgroundColor: '#FFF9F3',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(59, 43, 43, 0.25)',
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
        {/* Mobile Drag Handle */}
        <div className="mobile-drag-handle" style={{ display: 'none' }}>
          <div style={{ width: '42px', height: '4.5px', borderRadius: '999px', backgroundColor: '#D5CDC7', margin: '0 auto 12px auto' }} />
        </div>
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

            {/* Hallmark & Certification Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '14px 0 20px 0' }}>
              <div style={{ textAlign: 'center', padding: '10px 6px', backgroundColor: '#FFFDF9', border: '1px solid #EFE6DE', borderRadius: '12px' }}>
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#B76E79' }}>925</span>
                <span style={{ fontSize: '0.68rem', color: '#806D68', letterSpacing: '0.02em' }}>Sterling Silver</span>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 6px', backgroundColor: '#FFFDF9', border: '1px solid #EFE6DE', borderRadius: '12px' }}>
                <ShieldCheck size={16} color="#B76E79" style={{ margin: '0 auto 2px auto' }} />
                <span style={{ fontSize: '0.68rem', color: '#806D68', letterSpacing: '0.02em', display: 'block' }}>Hypoallergenic</span>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 6px', backgroundColor: '#FFFDF9', border: '1px solid #EFE6DE', borderRadius: '12px' }}>
                <Sparkles size={16} color="#B76E79" style={{ margin: '0 auto 2px auto' }} />
                <span style={{ fontSize: '0.68rem', color: '#806D68', letterSpacing: '0.02em', display: 'block' }}>Premium Quality</span>
              </div>
            </div>

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-espresso)' }}>Quantity:</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '999px', backgroundColor: '#FFFFFF', padding: '2px 4px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-espresso)', fontSize: '1.1rem' }}
                >
                  -
                </button>
                <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-espresso)', fontSize: '1.1rem' }}
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
                style={{ flex: 1, padding: '14px', borderRadius: '999px', backgroundColor: '#B76E79', borderColor: '#B76E79', color: '#FFFFFF', fontWeight: 600 }}
              >
                <ShoppingBag size={18} />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => {
                  addToCart(quickViewProduct, quantity, selectedSize);
                  closeQuickView();
                  window.location.href = '/checkout';
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '999px',
                  backgroundColor: '#FCE8DE',
                  border: '1.5px solid #B76E79',
                  color: '#B76E79',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <span>Buy Now</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                aria-label="Wishlist toggle"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isFavorited ? '#E53E3E' : 'var(--color-espresso)',
                  flexShrink: 0
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
          :global(.quickview-modal-backdrop) {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .quickview-grid {
            grid-template-columns: 1fr !important;
            padding: 16px 20px 32px 20px !important;
            border-radius: 26px 26px 0 0 !important;
            max-height: 88vh !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: 0 -10px 40px rgba(52, 39, 39, 0.2) !important;
          }
          .mobile-drag-handle {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
