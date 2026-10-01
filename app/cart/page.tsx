'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
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
    freeShippingThreshold,
    amountNeededForFreeShipping
  } = useCommerce();

  const [giftNote, setGiftNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const progressPercent = Math.min(100, ((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'FIRST10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountApplied(discount);
      setCouponMessage('Privilege code FIRST10 applied! 10% savings granted.');
    } else {
      setCouponMessage('Invalid code. Try "FIRST10" for 10% off your order.');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountApplied);

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(201, 163, 90, 0.12)',
              color: 'var(--color-champagne)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}
          >
            <Sparkles size={32} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '10px' }}>
            Your bag is beautifully empty.
          </h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem', marginBottom: '32px' }}>
            Explore our curated collections in fine 925 sterling silver, crafted to bring timeless poise to your everyday and celebrations.
          </p>
          <Link href="/shop" className="btn-primary" style={{ padding: '16px 36px' }}>
            Discover Jewellery Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '40px 0 100px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: 'var(--color-espresso)', marginBottom: '6px' }}>
            Your Shopping Bag
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-muted-text)' }}>
            Review your selected 925 sterling pieces before safe, encrypted checkout.
          </p>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#FCFAF6',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--color-border)',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
              {amountNeededForFreeShipping === 0 ? (
                <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} /> Complimentary insured doorstep shipping unlocked!
                </span>
              ) : (
                <span>Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more to unlock <strong>Complimentary Insured Shipping</strong></span>
              )}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-champagne)' }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#E2DBD0', borderRadius: '999px', overflow: 'hidden' }}>
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

        {/* 2-Column Split: Cart Items | Order Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }} className="cart-grid">
          {/* Left: Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${idx}`}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '24px',
                  backgroundColor: 'var(--bg-cream)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--color-border)',
                  alignItems: 'center'
                }}
                className="cart-item-row"
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', width: '100px', height: '120px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#EDE8E0', flexShrink: 0 }}>
                  <Image src={item.product.images[0]} alt={item.product.name} fill sizes="100px" style={{ objectFit: 'cover' }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-muted-text)', textTransform: 'uppercase' }}>
                        {item.product.purity} • {item.product.weight}
                      </span>
                      <Link
                        href={`/product/${item.product.slug}`}
                        style={{ display: 'block', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-espresso)', marginTop: '2px' }}
                      >
                        {item.product.name}
                      </Link>
                      {item.selectedSize && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-champagne)', fontWeight: 600, marginTop: '4px' }}>
                          Size: {item.selectedSize}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label="Remove item"
                      style={{ color: 'var(--color-light-text)', padding: '6px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Quantity & Total Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ padding: '6px 12px', color: 'var(--color-espresso)' }}>-</button>
                      <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ padding: '6px 12px', color: 'var(--color-espresso)' }}>+</button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      {item.product.compareAtPrice && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-light-text)', textDecoration: 'line-through' }}>
                          {formatPrice(item.product.compareAtPrice * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Gift Note Box */}
            <div style={{ padding: '20px 24px', backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <MessageSquare size={16} color="var(--color-champagne)" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-espresso)' }}>Complimentary Gift Message</h4>
              </div>
              <textarea
                placeholder="Include a personalized handwritten greeting card with your parcel..."
                value={giftNote}
                onChange={e => setGiftNote(e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-cream)',
              borderRadius: 'var(--radius-editorial)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-subtle)',
              position: 'sticky',
              top: '90px'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '20px' }}>
              Order Summary
            </h3>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Coupon code (e.g. FIRST10)"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.82rem' }}>
                  Apply
                </button>
              </div>
              {couponMessage && (
                <div style={{ fontSize: '0.78rem', color: discountApplied > 0 ? 'var(--color-success)' : 'var(--color-copper)', marginTop: '6px' }}>
                  {couponMessage}
                </div>
              )}
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(cartSubtotal)}</span>
              </div>
              {discountApplied > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-success)' }}>
                  <span>Privilege Discount (10%)</span>
                  <span>-{formatPrice(discountApplied)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Insured Doorstep Shipping</span>
                <span style={{ fontWeight: 600, color: shippingFee === 0 ? 'var(--color-success)' : 'var(--color-espresso)' }}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Estimated GST (3% Silver Bullion)</span>
                <span style={{ fontWeight: 600, color: 'var(--color-muted-text)' }}>Included in Price</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '20px 0 24px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Grand Total</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                {formatPrice(finalTotal)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '0.95rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '18px', color: 'var(--color-muted-text)', fontSize: '0.78rem' }}>
              <ShieldCheck size={16} color="var(--color-champagne)" />
              <span>100% Encrypted & Insured Transit Protection</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .cart-item-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
