'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCommerce } from './CommerceContext';
import { formatPrice } from '@/lib/api';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartTotal,
    shippingFee,
    freeShippingThreshold,
    amountNeededForFreeShipping
  } = useCommerce();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, ((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(20, 18, 15, 0.55)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--bg-cream)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '22px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FCFAF6'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              Your Shopping Bag
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>
              {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(33, 25, 20, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-espresso)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#F5EFE6',
            borderBottom: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-espresso)' }}>
              {amountNeededForFreeShipping === 0 ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} /> Congratulations! Complimentary insured shipping unlocked
                </span>
              ) : (
                <span>Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>FREE SHIPPING</strong></span>
              )}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-champagne)' }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#E2DBD0', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: progressPercent === 100 ? 'var(--color-success)' : 'var(--color-champagne)',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201, 163, 90, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--color-champagne)'
                }}
              >
                <Sparkles size={28} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '8px' }}>
                Your bag is beautifully empty.
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', marginBottom: '24px' }}>
                Explore our fine 925 sterling silver collections crafted for timeless poise.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Discover Jewellery
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid rgba(229, 222, 213, 0.7)'
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      position: 'relative',
                      width: '84px',
                      height: '96px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: '#F0ECE6'
                    }}
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="84px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: 'var(--color-espresso)',
                            lineHeight: 1.3
                          }}
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label="Remove item"
                          style={{ color: 'var(--color-light-text)', padding: '2px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)', marginTop: '4px' }}>
                        {item.product.purity} • {item.product.weight}
                      </div>

                      {item.selectedSize && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-champagne)', fontWeight: 500, marginTop: '2px' }}>
                          Size: {item.selectedSize}
                        </div>
                      )}
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          style={{ padding: '4px 8px', color: 'var(--color-espresso)' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          style={{ padding: '4px 8px', color: 'var(--color-espresso)' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                        {item.product.compareAtPrice && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-light-text)', textDecoration: 'line-through' }}>
                            {formatPrice(item.product.compareAtPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Checkout Summary */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: '#FCFAF6',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>{formatPrice(cartSubtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Insured Delivery</span>
                <span style={{ fontWeight: 600, color: shippingFee === 0 ? 'var(--color-success)' : 'var(--color-espresso)' }}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '8px',
                  color: 'var(--color-espresso)'
                }}
              >
                <span>Total Amount</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }}
              >
                <span>Proceed To Checkout</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                style={{
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  color: 'var(--color-muted-text)',
                  textDecoration: 'underline',
                  padding: '4px'
                }}
              >
                View Bag & Add Gift Note
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', color: 'var(--color-muted-text)', fontSize: '0.72rem' }}>
              <ShieldCheck size={14} color="var(--color-champagne)" />
              <span>100% BIS Hallmarked • Safe & Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
