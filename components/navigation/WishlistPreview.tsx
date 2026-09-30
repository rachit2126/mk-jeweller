'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Trash2, ArrowRight, Heart } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/api';

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

// Fallback sample items matching reference image if wishlist is empty
const SAMPLE_WISHLIST: DisplayWishlistItem[] = [
  {
    id: 'sample-w-1',
    slug: 'floral-silver-earrings',
    name: 'Floral Stud Earrings',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'sample-w-2',
    slug: 'pearl-blossom-necklace',
    name: 'Silver Pendant Necklace',
    price: 3999,
    image: '/images/products/necklaces-pearl-blossom-collar-01.png',
  },
  {
    id: 'sample-w-3',
    slug: 'minimal-silver-ring',
    name: 'Minimal Silver Ring',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
  },
];

export default function WishlistPreview({ isOpen = true, onClose }: WishlistPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const { wishlist, toggleWishlist, wishlistCount } = useCommerce();

  if (!isOpen) return null;

  const displayItems: DisplayWishlistItem[] = wishlist.length > 0
    ? wishlist.slice(0, 4).map(item => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.images?.[0] || '/images/collection-rings.jpg',
        originalProduct: item,
      }))
    : SAMPLE_WISHLIST;

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
            <span className="wishlist-count-badge">({wishlistCount || displayItems.length})</span>
          </div>
          <Link href="/wishlist" onClick={onClose} className="view-all-link">
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Items List */}
        <div className="wishlist-items-list">
          {displayItems.map((item) => (
            <div key={item.id} className="wishlist-item-row">
              <Link href={`/product/${item.slug}`} onClick={onClose} className="item-thumb-link">
                <div className="item-thumb">
                  <Image
                    src={item.image}
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
                onClick={() => {
                  if ('originalProduct' in item && item.originalProduct) {
                    toggleWishlist(item.originalProduct);
                  }
                }}
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
            <span>View Wishlist</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .wishlist-preview-wrapper {
          position: relative;
          z-index: 130;
          pointer-events: auto;
        }

        .wishlist-card {
          width: 370px;
          background: rgba(255, 249, 243, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid rgba(232, 216, 208, 0.85);
          border-radius: 20px;
          box-shadow: 0 20px 48px rgba(65, 40, 35, 0.12), 0 4px 12px rgba(183, 110, 121, 0.08);
          padding: 18px;
        }

        .wishlist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(232, 216, 208, 0.6);
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
          color: #2D201E;
          margin: 0;
        }

        .wishlist-count-badge {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          color: #806D68;
          font-weight: 500;
        }

        .view-all-link {
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

        .view-all-link:hover {
          color: #9C5762;
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
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.5);
          transition: background-color 180ms ease, border-color 180ms ease;
        }

        .wishlist-item-row:hover {
          border-color: rgba(183, 110, 121, 0.35);
          background-color: #FFFDFC;
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

        .item-price {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #B76E79;
          margin-top: 2px;
        }

        .item-remove-btn {
          background: transparent;
          border: none;
          color: #806D68;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 180ms ease, background-color 180ms ease;
        }

        .item-remove-btn:hover {
          color: #B76E79;
          background-color: #FCECE9;
        }

        .wishlist-footer {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid rgba(232, 216, 208, 0.6);
        }

        .view-wishlist-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          background: #B76E79;
          color: #FFFFFF;
          padding: 9px 16px;
          border-radius: 999px;
          text-decoration: none;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.25);
          transition: background-color 180ms ease, transform 180ms ease;
        }

        .view-wishlist-cta:hover {
          background: #9C5762;
          transform: translateY(-1px);
        }
      `}</style>
    </motion.div>
  );
}
