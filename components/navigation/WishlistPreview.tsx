'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Trash2, ArrowRight, Heart } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

import { Product } from '@/lib/types';

interface WishlistPreviewProps {
  isOpen?: boolean;
  onClose: () => void;
}

interface DisplayWishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  originalProduct?: Product;
}

export default function WishlistPreview({ isOpen = true, onClose }: WishlistPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const { wishlist, toggleWishlist, wishlistCount } = useCommerce();

  if (!isOpen) return null;

  const hasItems = wishlist.length > 0;
  const displayItems = wishlist.slice(0, 4);

  return (
    <motion.div
      className="wishlist-preview-wrapper"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={onClose}
    >
      <div className="wishlist-card">
        {/* Header */}
        <div className="wishlist-header">
          <div className="header-left">
            <h4 className="wishlist-title">My Wishlist</h4>
            <span className="wishlist-count-badge">({wishlistCount})</span>
          </div>
          {hasItems && (
            <Link href="/wishlist" onClick={onClose} className="view-all-link">
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {hasItems ? (
          <>
            {/* Items List */}
            <div className="wishlist-items-list">
              {displayItems.map((item) => (
                <div key={item.id} className="wishlist-item-row">
                  <Link href={`/product/${item.slug}`} onClick={onClose} className="item-thumb-link">
                    <div className="item-thumb">
                      <Image
                        src={item.images?.[0] || '/images/collection-rings.jpg'}
                        alt={item.name}
                        fill
                        sizes="48px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </Link>

                  <div className="item-details">
                    <Link href={`/product/${item.slug}`} onClick={onClose} className="item-name">
                      {item.name}
                    </Link>
                    <div className="item-price">{formatPrice(item.price)}</div>
                  </div>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="item-remove-btn"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="wishlist-footer">
              <Link href="/wishlist" onClick={onClose} className="view-wishlist-cta">
                <span>View Full Wishlist</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-wishlist-state">
            <div className="empty-wishlist-icon">
              <Heart size={26} strokeWidth={1.5} />
            </div>
            <p className="empty-wishlist-title">Your wishlist is empty</p>
            <p className="empty-wishlist-desc">Save pieces you love by clicking the heart icon on any product.</p>
            <Link href="/shop" onClick={onClose} className="discover-btn">
              <span>Discover Pieces</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .wishlist-preview-wrapper {
          position: relative;
          z-index: 130;
          pointer-events: auto;
        }

        .wishlist-card {
          width: 370px;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 16px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
          padding: 18px;
        }

        .wishlist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #F0EFEA;
          margin-bottom: 10px;
        }

        .header-left {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .wishlist-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
        }

        .wishlist-count-badge {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          color: #6F6F6A;
          font-weight: 500;
        }

        .view-all-link {
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

        .view-all-link:hover {
          color: #6F6F6A;
          transform: translateX(2px);
        }

        .wishlist-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 270px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .wishlist-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 10px;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          transition: border-color 180ms ease;
        }

        .wishlist-item-row:hover {
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

        .item-details {
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

        .item-price {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #111111;
          margin-top: 2px;
        }

        .item-remove-btn {
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

        .item-remove-btn:hover {
          color: #DC2626;
          background-color: #FEE2E2;
        }

        .wishlist-footer {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid #F0EFEA;
        }

        .view-wishlist-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          background: #111111;
          color: #FFFFFF;
          padding: 10px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: background-color 180ms ease, transform 180ms ease;
        }

        .view-wishlist-cta:hover {
          background: #252525;
          transform: translateY(-1px);
        }

        /* EMPTY STATE */
        .empty-wishlist-state {
          padding: 28px 16px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-wishlist-icon {
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

        .empty-wishlist-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #111111;
          margin: 0 0 6px;
        }

        .empty-wishlist-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          color: #6F6F6A;
          line-height: 1.4;
          margin: 0 0 18px;
          max-width: 240px;
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
