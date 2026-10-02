'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useCommerce } from './CommerceContext';
import { formatPrice } from '@/lib/format';

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
    amountNeededForFreeShipping,
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

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'var(--font-ui), "Jost", sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E8E7E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontWeight: 600,
                color: '#111111',
                margin: 0,
              }}
            >
              Shopping Bag
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#6F6F6A' }}>
              {totalCount} {totalCount === 1 ? 'piece' : 'pieces'} selected
            </span>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#F8F7F3',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111111',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Notice */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#F8F7F3',
            borderBottom: '1px solid #E8E7E2',
            fontSize: '0.78rem',
            color: '#111111',
          }}
        >
          {amountNeededForFreeShipping === 0 ? (
            <span>Complimentary insured shipping unlocked!</span>
          ) : (
            <span>
              Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>Free Shipping</strong>
            </span>
          )}
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#6F6F6A', fontSize: '0.86rem', marginBottom: '20px' }}>
                Your shopping bag is empty.
              </p>
              <button
                onClick={closeCart}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Browse Jewellery
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${idx}`}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '20px 0',
                    borderBottom: '1px solid #E8E7E2',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '74px',
                      height: '88px',
                      backgroundColor: '#F8F7F3',
                      border: '1px solid #E8E7E2',
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: '#111111',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '2px',
                      }}
                    >
                      {item.product.name}
                    </div>

                    {item.variant && (
                      <div style={{ fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                        Size: {item.variant}
                      </div>
                    )}

                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#111111', marginBottom: '8px' }}>
                      {formatPrice(item.product.price)}
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #E8E7E2',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          style={{
                            width: '26px',
                            height: '26px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            color: '#111111',
                          }}
                        >
                          -
                        </button>
                        <span style={{ width: '26px', textAlign: 'center', fontSize: '0.76rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{
                            width: '26px',
                            height: '26px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            color: '#111111',
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Remove item"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#6F6F6A',
                          padding: '4px',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid #E8E7E2',
              backgroundColor: '#F8F7F3',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
              <span style={{ color: '#6F6F6A' }}>Subtotal</span>
              <span style={{ fontWeight: 600, color: '#111111' }}>{formatPrice(cartSubtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.84rem' }}>
              <span style={{ color: '#6F6F6A' }}>Shipping</span>
              <span style={{ fontWeight: 600, color: '#111111' }}>
                {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111111',
                borderTop: '1px solid #E8E7E2',
                paddingTop: '12px',
              }}
            >
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href="/checkout"
                onClick={closeCart}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px 0',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <span>CHECKOUT</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/cart"
                onClick={closeCart}
                style={{
                  textAlign: 'center',
                  fontSize: '0.74rem',
                  color: '#111111',
                  textDecoration: 'underline',
                  padding: '6px 0',
                }}
              >
                View Full Bag
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
