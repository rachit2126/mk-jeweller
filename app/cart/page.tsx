'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Heart, ShieldCheck, RotateCcw, Lock, ArrowRight } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartTotal,
    shippingFee,
    toggleWishlist,
    isInWishlist,
  } = useCommerce();

  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponMessage(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscountApplied(data.discountAmount);
        setCouponMessage({ text: data.message || 'Coupon applied successfully!', success: true });
      } else {
        setDiscountApplied(0);
        setCouponMessage({ text: data.message || 'Invalid coupon code.', success: false });
      }
    } catch {
      setCouponMessage({ text: 'Unable to validate coupon at this time.', success: false });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountApplied);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: '2.4rem',
              fontWeight: 500,
              color: '#111111',
              margin: '0 0 12px',
            }}
          >
            Your Shopping Bag Is Empty
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              color: '#6F6F6A',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              margin: '0 0 28px',
            }}
          >
            Explore our curated 925 sterling silver collections, handcrafted in Jaipur with hallmark certified purity.
          </p>
          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.76rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
            }}
          >
            DISCOVER JEWELLERY
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        padding: '36px 0 100px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            paddingBottom: '24px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
            color: '#6F6F6A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link href="/" style={{ color: '#6F6F6A', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: '#111111', fontWeight: 600 }}>Cart</span>
        </nav>

        {/* Top Header Row with Title & Continue Shopping Link (Screen 6 in Mockup) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E8E7E2',
            paddingBottom: '18px',
            marginBottom: '36px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              fontWeight: 500,
              color: '#111111',
              margin: 0,
            }}
          >
            Your Cart ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
          </h1>

          <Link
            href="/shop"
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.78rem',
              color: '#111111',
              textDecoration: 'underline',
              letterSpacing: '0.04em',
            }}
          >
            Continue Shopping
          </Link>
        </div>

        {/* 2-Column Split: Cart Items | Order Summary (Screen 6 in Mockup) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)',
            gap: 'clamp(28px, 4.5vw, 56px)',
            alignItems: 'start',
          }}
          className="cart-split-grid"
        >
          {/* ======================================================= */}
          {/* LEFT: CART PRODUCTS LIST                                */}
          {/* ======================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cart.map((item, idx) => {
              const isFav = isInWishlist(item.product.id);

              return (
                <div
                  key={`${item.product.id}-${item.variant || 'std'}-${idx}`}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '24px 0',
                    borderBottom: '1px solid #E8E7E2',
                    alignItems: 'center',
                  }}
                  className="cart-item-row"
                >
                  {/* Item Image */}
                  <div
                    style={{
                      position: 'relative',
                      width: '90px',
                      height: '108px',
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
                      sizes="100px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Item Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/product/${item.product.slug}`}
                      style={{
                        fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                        fontSize: '1.15rem',
                        fontWeight: 600,
                        color: '#111111',
                        textDecoration: 'none',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {item.product.name}
                    </Link>

                    {item.variant && (
                      <div
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.78rem',
                          color: '#6F6F6A',
                          marginBottom: '8px',
                        }}
                      >
                        Size: {item.variant}
                      </div>
                    )}

                    <div
                      style={{
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        color: '#111111',
                      }}
                    >
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  {/* Quantity Selector [ - 1 + ] */}
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
                        width: '32px',
                        height: '32px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        color: '#111111',
                      }}
                    >
                      -
                    </button>
                    <span
                      style={{
                        width: '32px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        color: '#111111',
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Wishlist & Remove Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => toggleWishlist(item.product)}
                      aria-label="Save to Wishlist"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isFav ? '#111111' : '#6F6F6A',
                        padding: '6px',
                      }}
                    >
                      <Heart size={16} fill={isFav ? '#111111' : 'none'} />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label="Remove item"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6F6F6A',
                        padding: '6px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================= */}
          {/* RIGHT: ORDER SUMMARY (Screen 6 in Mockup)               */}
          {/* ======================================================= */}
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: 'clamp(24px, 3vw, 36px)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.45rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 20px',
                borderBottom: '1px solid #E8E7E2',
                paddingBottom: '14px',
              }}
            >
              Order Summary
            </h2>

            {/* Calculations List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.86rem',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6F6F6A' }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#111111' }}>{formatPrice(cartSubtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6F6F6A' }}>Shipping</span>
                <span style={{ fontWeight: 600, color: shippingFee === 0 ? '#111111' : '#111111' }}>
                  {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                </span>
              </div>

              {discountApplied > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111111' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 600 }}>-{formatPrice(discountApplied)}</span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #E8E7E2',
                  paddingTop: '16px',
                  marginTop: '4px',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: '#111111',
                }}
              >
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Apply Coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid #E8E7E2',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    outline: 'none',
                    textTransform: 'uppercase',
                  }}
                />
                <button
                  type="submit"
                  disabled={validatingCoupon}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: validatingCoupon ? '#6F6F6A' : '#111111',
                    color: '#FFFFFF',
                    border: 'none',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: validatingCoupon ? 'not-allowed' : 'pointer',
                  }}
                >
                  {validatingCoupon ? 'APPLYING...' : 'APPLY'}
                </button>
              </div>
              {couponMessage && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: couponMessage.success ? '#111111' : '#B00020',
                    margin: '8px 0 0',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  }}
                >
                  {couponMessage.text}
                </p>
              )}
            </form>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '16px 0',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                marginBottom: '24px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#252525')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={14} />
            </Link>

            {/* 3 Trust Icons (Mockup Screen 6) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                borderTop: '1px solid #E8E7E2',
                paddingTop: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Lock size={15} color="#111111" />
                <span style={{ fontSize: '0.68rem', color: '#6F6F6A', fontFamily: 'var(--font-ui), "Jost", sans-serif' }}>
                  Secure Checkout
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <RotateCcw size={15} color="#111111" />
                <span style={{ fontSize: '0.68rem', color: '#6F6F6A', fontFamily: 'var(--font-ui), "Jost", sans-serif' }}>
                  Easy Returns
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={15} color="#111111" />
                <span style={{ fontSize: '0.68rem', color: '#6F6F6A', fontFamily: 'var(--font-ui), "Jost", sans-serif' }}>
                  925 Silver
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .cart-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
