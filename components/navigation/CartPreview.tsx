'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

interface CartPreviewProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function CartPreview({ isOpen = true, onClose }: CartPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const {
    cart,
    cartCount,
    cartSubtotal,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    updateQuantity,
    removeFromCart,
  } = useCommerce();

  if (!isOpen) return null;

  const hasItems = cart.length > 0;
  const progressPercent = Math.min(100, Math.round(((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100));

  return (
    <motion.div
      className="cart-preview-wrapper"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={onClose}
    >
      <div className="cart-preview-card">
        {/* Header */}
        <div className="cart-header">
          <div className="header-left">
            <h4 className="cart-title">My Cart</h4>
            <span className="cart-count">({cartCount})</span>
          </div>
          {hasItems && (
            <Link href="/cart" onClick={onClose} className="view-cart-link">
              <span>View Cart</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {hasItems ? (
          <>
            {/* Free Shipping Progress */}
            <div className="shipping-progress-box">
              <div className="progress-text">
                {amountNeededForFreeShipping > 0 ? (
                  <>
                    Add <strong style={{ color: '#111111' }}>{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>FREE SHIPPING</strong>
                  </>
                ) : (
                  <strong style={{ color: '#166534' }}>✓ Free Shipping unlocked</strong>
                )}
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            {/* Product Items */}
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.product.id} className="cart-item-row">
                  <Link href={`/product/${item.product.slug}`} onClick={onClose} className="item-thumb-link">
                    <div className="item-thumb">
                      <Image
                        src={item.product.images?.[0] || '/images/collection-rings.jpg'}
                        alt={item.product.name}
                        fill
                        sizes="52px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </Link>

                  <div className="item-info">
                    <Link href={`/product/${item.product.slug}`} onClick={onClose} className="item-name">
                      {item.product.name}
                    </Link>
                    <div className="item-price-unit">{formatPrice(item.product.price)}</div>
                  </div>

                  {/* Quantity controls */}
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="qty-btn"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="qty-btn"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label={`Remove ${item.product.name}`}
                    className="remove-btn"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Subtotal & Actions */}
            <div className="cart-footer">
              <div className="subtotal-row">
                <span className="subtotal-label">Subtotal</span>
                <span className="subtotal-value">{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="cart-actions-grid">
                <Link href="/checkout" onClick={onClose} className="checkout-btn">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart-state">
            <div className="empty-cart-icon">
              <ShoppingBag size={28} strokeWidth={1.5} />
            </div>
            <p className="empty-cart-title">Your cart is empty</p>
            <p className="empty-cart-desc">Explore our fine 925 sterling jewellery collections and add your favourite pieces.</p>
            <Link href="/shop" onClick={onClose} className="discover-btn">
              <span>Explore Jewellery</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-preview-wrapper {
          position: relative;
          z-index: 130;
          pointer-events: auto;
        }

        .cart-preview-card {
          width: 400px;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 16px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
          padding: 18px 20px;
        }

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #F0EFEA;
        }

        .header-left {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .cart-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
        }

        .cart-count {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          color: #6F6F6A;
          font-weight: 500;
        }

        .view-cart-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: #111111;
          text-decoration: none;
          transition: transform 180ms ease, color 180ms ease;
        }

        .view-cart-link:hover {
          color: #6F6F6A;
          transform: translateX(2px);
        }

        /* FREE SHIPPING */
        .shipping-progress-box {
          margin: 12px 0 14px;
          padding: 10px 12px;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          border-radius: 10px;
        }

        .progress-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          color: #6F6F6A;
          line-height: 1.3;
          margin-bottom: 6px;
          text-align: left;
        }

        .progress-bar-track {
          width: 100%;
          height: 4px;
          background: #E8E7E2;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #111111;
          border-radius: 999px;
          transition: width 300ms ease;
        }

        /* ITEMS LIST */
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
          max-height: 240px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .cart-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          border-radius: 10px;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          transition: border-color 180ms ease;
        }

        .cart-item-row:hover {
          border-color: #BFC1C4;
        }

        .item-thumb-link {
          flex-shrink: 0;
        }

        .item-thumb {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          background: #F0EFEA;
        }

        .item-info {
          flex: 1;
          min-width: 0;
          text-align: left;
        }

        .item-name {
          display: block;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #111111;
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 180ms ease;
        }

        .item-name:hover {
          color: #6F6F6A;
        }

        .item-price-unit {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #111111;
          margin-top: 2px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 999px;
          padding: 2px 4px;
          gap: 4px;
        }

        .qty-btn {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #111111;
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 150ms ease;
        }

        .qty-btn:hover {
          background: #F0EFEA;
        }

        .qty-value {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          font-weight: 600;
          min-width: 14px;
          text-align: center;
          color: #111111;
        }

        .remove-btn {
          background: transparent;
          border: none;
          color: #6F6F6A;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 180ms ease, background-color 180ms ease;
        }

        .remove-btn:hover {
          color: #DC2626;
          background: #FEE2E2;
        }

        /* FOOTER */
        .cart-footer {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid #F0EFEA;
        }

        .subtotal-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 0 4px;
        }

        .subtotal-label {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          color: #6F6F6A;
          font-weight: 500;
        }

        .subtotal-value {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #111111;
        }

        .cart-actions-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        :global(.checkout-btn) {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 7px !important;
          width: 100% !important;
          background: #111111 !important;
          color: #FFFFFF !important;
          padding: 11px 20px !important;
          border-radius: 8px !important;
          text-decoration: none !important;
          font-family: var(--font-ui), 'Jost', sans-serif !important;
          font-size: 0.86rem !important;
          font-weight: 500 !important;
          letter-spacing: 0.02em !important;
          transition: background-color 180ms ease, transform 180ms ease !important;
        }

        :global(.checkout-btn:hover) {
          background: #252525 !important;
          transform: translateY(-1px) !important;
        }

        /* EMPTY STATE */
        .empty-cart-state {
          padding: 28px 16px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-cart-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6F6F6A;
          margin-bottom: 12px;
        }

        .empty-cart-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #111111;
          margin: 0 0 6px;
        }

        .empty-cart-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          color: #6F6F6A;
          line-height: 1.4;
          margin: 0 0 18px;
          max-width: 260px;
        }

        :global(.discover-btn) {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          background: #111111 !important;
          color: #FFFFFF !important;
          padding: 9px 18px !important;
          border-radius: 8px !important;
          text-decoration: none !important;
          font-family: var(--font-ui), 'Jost', sans-serif !important;
          font-size: 0.8rem !important;
          font-weight: 500 !important;
          transition: background 150ms ease !important;
        }

        :global(.discover-btn:hover) {
          background: #252525 !important;
        }
      `}</style>
    </motion.div>
  );
}
