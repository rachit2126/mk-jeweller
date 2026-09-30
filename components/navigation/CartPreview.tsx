'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/api';

interface CartPreviewProps {
  isOpen?: boolean;
  onClose: () => void;
}

// Sample fallback items matching the reference image if cart is empty
const SAMPLE_CART = [
  {
    product: {
      id: 'sample-c-1',
      slug: 'floral-silver-earrings',
      name: 'Silver Hoop Earrings',
      price: 2499,
      images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=200&auto=format&fit=crop'],
    },
    quantity: 1,
  },
  {
    product: {
      id: 'sample-c-2',
      slug: 'minimal-silver-ring',
      name: 'Dainty Ring',
      price: 1999,
      images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop'],
    },
    quantity: 1,
  },
];

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

  const hasRealItems = cart.length > 0;
  const items = hasRealItems ? cart : SAMPLE_CART;
  const displayCount = hasRealItems ? cartCount : 2;
  const displaySubtotal = hasRealItems ? cartSubtotal : 4498;
  const displayAmountNeeded = hasRealItems ? amountNeededForFreeShipping : 501;
  const progressPercent = Math.min(100, Math.round(((freeShippingThreshold - displayAmountNeeded) / freeShippingThreshold) * 100));

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
            <span className="cart-count">({displayCount})</span>
          </div>
          <Link href="/cart" onClick={onClose} className="view-cart-link">
            <span>View Cart</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Free Shipping Progress */}
        <div className="shipping-progress-box">
          <div className="progress-text">
            {displayAmountNeeded > 0 ? (
              <>
                You&apos;re <strong style={{ color: '#B76E79' }}>{formatPrice(displayAmountNeeded)}</strong> away from <strong>FREE SHIPPING</strong>
              </>
            ) : (
              <strong style={{ color: '#2E7D32' }}>🎉 Congratulations! You have unlocked Free Shipping</strong>
            )}
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Product Items */}
        <div className="cart-items-list">
          {items.map((item) => (
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
                  onClick={() => hasRealItems && updateQuantity(item.product.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  className="qty-btn"
                >
                  <Minus size={11} />
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  onClick={() => hasRealItems && updateQuantity(item.product.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                  className="qty-btn"
                >
                  <Plus size={11} />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => hasRealItems && removeFromCart(item.product.id)}
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
            <span className="subtotal-value">{formatPrice(displaySubtotal)}</span>
          </div>

          <div className="cart-actions-grid">
            <Link href="/checkout" onClick={onClose} className="checkout-btn">
              <span>Checkout</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-preview-wrapper {
          position: relative;
          z-index: 130;
          pointer-events: auto;
        }

        .cart-preview-card {
          width: 410px;
          background: rgba(255, 249, 243, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid rgba(232, 216, 208, 0.85);
          border-radius: 20px;
          box-shadow: 0 20px 48px rgba(65, 40, 35, 0.12), 0 4px 12px rgba(183, 110, 121, 0.08);
          padding: 18px 20px;
        }

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(232, 216, 208, 0.6);
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
          color: #2D201E;
          margin: 0;
        }

        .cart-count {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          color: #806D68;
          font-weight: 500;
        }

        .view-cart-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: #B76E79;
          text-decoration: none;
          transition: transform 180ms ease, color 180ms ease;
        }

        .view-cart-link:hover {
          color: #9C5762;
          transform: translateX(2px);
        }

        /* FREE SHIPPING */
        .shipping-progress-box {
          margin: 12px 0 14px;
          padding: 10px 12px;
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.7);
          border-radius: 12px;
        }

        .progress-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          color: #6F5A58;
          line-height: 1.3;
          margin-bottom: 6px;
          text-align: left;
        }

        .progress-bar-track {
          width: 100%;
          height: 5px;
          background: #F4E4DF;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #D9B98A 0%, #B76E79 100%);
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
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.5);
          transition: border-color 180ms ease;
        }

        .cart-item-row:hover {
          border-color: rgba(183, 110, 121, 0.35);
        }

        .item-thumb-link {
          flex-shrink: 0;
        }

        .item-thumb {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          overflow: hidden;
          background: #FCECE9;
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
          color: #2D201E;
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 180ms ease;
        }

        .item-name:hover {
          color: #B76E79;
        }

        .item-price-unit {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #B76E79;
          margin-top: 2px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          background: #FCECE9;
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
          color: #3B2B2B;
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 150ms ease;
        }

        .qty-btn:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .qty-value {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          font-weight: 600;
          min-width: 14px;
          text-align: center;
          color: #2D201E;
        }

        .remove-btn {
          background: transparent;
          border: none;
          color: #806D68;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 180ms ease, background-color 180ms ease;
        }

        .remove-btn:hover {
          color: #B76E79;
          background: #FCECE9;
        }

        /* FOOTER */
        .cart-footer {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(232, 216, 208, 0.6);
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
          color: #6F5A58;
          font-weight: 500;
        }

        .subtotal-value {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #2D201E;
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
          background: #B76E79 !important;
          color: #FFFFFF !important;
          padding: 12px 20px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          font-family: var(--font-ui), 'Jost', sans-serif !important;
          font-size: 0.86rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.03em !important;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.3) !important;
          transition: background-color 180ms ease, transform 180ms ease !important;
        }

        :global(.checkout-btn:hover) {
          background: #9C5762 !important;
          transform: translateY(-1px) !important;
        }
      `}</style>
    </motion.div>
  );
}
