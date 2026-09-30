'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';

interface ShopMegaMenuProps {
  isOpen?: boolean;
  onClose: () => void;
}

/* Custom delicate line icons for jewellery categories */
function EarringsIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <circle cx="15" cy="7" r="3" />
      <path d="M9 10v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-7" />
      <circle cx="9" cy="18" r="1.5" fill={color} />
      <circle cx="15" cy="18" r="1.5" fill={color} />
    </svg>
  );
}

function NecklaceIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7c0 7 3.5 12 8 12s8-5 8-12" />
      <circle cx="12" cy="19.5" r="2" fill={color} />
    </svg>
  );
}

function RingIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="6" />
      <path d="M12 4 L14 7 L10 7 Z" fill={color} />
    </svg>
  );
}

function BraceletIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
      <circle cx="12" cy="4" r="2" fill={color} />
      <circle cx="12" cy="20" r="2" fill={color} />
    </svg>
  );
}

function PendantIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v8" />
      <path d="M12 11 L16 16 L12 21 L8 16 Z" />
    </svg>
  );
}

function MangalsutraIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8c2 5 4 8 7 8s5-3 7-8" />
      <circle cx="12" cy="17" r="2" fill={color} />
      <circle cx="8" cy="12" r="1.5" fill={color} />
      <circle cx="16" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

const CATEGORIES = [
  { label: 'Earrings', href: '/collections/earrings', icon: EarringsIcon },
  { label: 'Necklaces', href: '/collections/necklaces', icon: NecklaceIcon },
  { label: 'Rings', href: '/collections/rings', icon: RingIcon },
  { label: 'Bracelets', href: '/collections/bracelets', icon: BraceletIcon },
  { label: 'Pendants', href: '/collections/pendants', icon: PendantIcon },
  { label: 'Mangalsutra', href: '/shop?category=mangalsutra', icon: MangalsutraIcon },
];

const POPULAR_CARDS = [
  {
    title: 'Earrings',
    subtitle: 'Everyday to statement',
    href: '/collections/earrings',
    image: '/images/collection-earrings.jpg',
  },
  {
    title: 'Necklaces',
    subtitle: 'Elegant & timeless',
    href: '/collections/necklaces',
    image: '/images/collection-necklaces.jpg',
  },
  {
    title: 'Rings',
    subtitle: 'Symbols of love',
    href: '/collections/rings',
    image: '/images/collection-rings.jpg',
  },
  {
    title: 'Bracelets',
    subtitle: 'Modern essentials',
    href: '/collections/bracelets',
    image: '/images/occasions/everyday-elegance.jpg',
  },
];

export default function ShopMegaMenu({ isOpen = true, onClose }: ShopMegaMenuProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredCategory, setHoveredCategory] = useState<string>('Earrings');

  if (!isOpen) return null;

  return (
    <motion.div
      className="mega-menu-wrapper"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.985 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={onClose}
    >
      <div className="mega-menu-card">
        {/* LEFT COLUMN: Shop by Category */}
        <div className="mega-left-col">
          <div className="column-eyebrow">Shop by Category</div>
          <div className="category-list">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = hoveredCategory === cat.label;

              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredCategory(cat.label)}
                  className={`category-item-link ${isSelected ? 'active-item' : ''}`}
                >
                  <div className="category-item-left">
                    <span className="category-icon-box">
                      <Icon size={15} color={isSelected ? '#B76E79' : '#806D68'} />
                    </span>
                    <span className="category-name">{cat.label}</span>
                  </div>
                  <ChevronRight size={13} className="category-arrow" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* MIDDLE AREA: Popular Categories 4 Cards */}
        <div className="mega-middle-col">
          <div className="column-eyebrow">Popular Categories</div>
          <div className="popular-cards-grid">
            {POPULAR_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                onClick={onClose}
                className="popular-card"
              >
                <div className="popular-card-image-wrap">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 1400px) 180px, 220px"
                    style={{ objectFit: 'cover' }}
                    className="popular-card-img"
                  />
                </div>
                <div className="popular-card-info">
                  <h4 className="popular-card-title">{card.title}</h4>
                  <p className="popular-card-desc">{card.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT AREA: Promotional Editorial Card */}
        <div className="mega-right-col">
          <div className="promo-editorial-card">
            <div className="promo-text-wrap">
              <h3 className="promo-title">New Arrivals</h3>
              <p className="promo-description">
                Discover our latest 925 silver collection
              </p>
              <Link href="/shop?badge=NEW%20ARRIVAL" onClick={onClose} className="promo-cta-btn">
                <span>Shop Now</span>
                <ArrowRight size={13} />
              </Link>
            </div>
            <div className="promo-image-wrap">
              <Image
                src="/images/collections/rings-editorial.jpg"
                alt="New Arrivals 925 Silver Jewellery"
                fill
                sizes="240px"
                style={{ objectFit: 'cover' }}
                className="promo-img"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mega-menu-wrapper {
          position: absolute;
          top: calc(100% + 14px);
          left: 0;
          right: 0;
          z-index: 120;
          display: flex;
          justify-content: center;
          padding: 0 20px;
          pointer-events: auto;
        }

        .mega-menu-card {
          width: 100%;
          max-width: 1380px;
          background: rgba(255, 249, 243, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid rgba(232, 216, 208, 0.85);
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(65, 40, 35, 0.12), 0 4px 16px rgba(183, 110, 121, 0.08);
          padding: 26px 32px;
          display: grid;
          grid-template-columns: 240px 1fr 340px;
          gap: 28px;
          align-items: stretch;
        }

        .column-eyebrow {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9C5762;
          margin-bottom: 14px;
          padding-left: 6px;
        }

        /* LEFT COLUMN */
        .mega-left-col {
          border-right: 1px solid rgba(232, 216, 208, 0.6);
          padding-right: 20px;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        :global(.category-item-link) {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 9px 12px !important;
          border-radius: 12px !important;
          text-decoration: none !important;
          color: #3B2B2B !important;
          background: transparent;
          white-space: nowrap !important;
          flex-wrap: nowrap !important;
          transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        .category-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .category-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          flex-shrink: 0;
          transition: background-color 200ms ease;
        }

        .category-name {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        :global(.category-arrow) {
          flex-shrink: 0 !important;
          color: #806D68;
          opacity: 0.6;
          transition: transform 200ms ease, opacity 200ms ease, color 200ms ease;
        }

        :global(.category-item-link:hover),
        :global(.category-item-link.active-item) {
          background-color: #FCECE9 !important;
          color: #B76E79 !important;
        }

        :global(.category-item-link:hover) .category-icon-box,
        :global(.category-item-link.active-item) .category-icon-box {
          background-color: #FFFFFF;
        }

        :global(.category-item-link:hover) :global(.category-arrow),
        :global(.category-item-link.active-item) :global(.category-arrow) {
          color: #B76E79 !important;
          opacity: 1 !important;
          transform: translateX(4px) !important;
        }

        /* MIDDLE AREA */
        .mega-middle-col {
          display: flex;
          flex-direction: column;
        }

        .popular-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          height: 100%;
        }

        .popular-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          border-radius: 16px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.7);
          box-shadow: 0 4px 14px rgba(65, 40, 35, 0.04);
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }

        .popular-card:hover {
          transform: translateY(-3px);
          border-color: rgba(183, 110, 121, 0.4);
          box-shadow: 0 8px 24px rgba(183, 110, 121, 0.12);
        }

        .popular-card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3.2;
          overflow: hidden;
          background: #FCECE9;
        }

        :global(.popular-card-img) {
          transition: transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        .popular-card:hover :global(.popular-card-img) {
          transform: scale(1.06);
        }

        .popular-card-info {
          padding: 10px 12px 12px;
          text-align: left;
        }

        .popular-card-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #2D201E;
          margin: 0 0 2px 0;
          line-height: 1.2;
          transition: color 200ms ease;
        }

        .popular-card:hover .popular-card-title {
          color: #B76E79;
        }

        .popular-card-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          color: #806D68;
          margin: 0;
          line-height: 1.3;
        }

        /* RIGHT AREA: PROMOTIONAL CARD */
        .mega-right-col {
          border-left: 1px solid rgba(232, 216, 208, 0.6);
          padding-left: 24px;
        }

        .promo-editorial-card {
          height: 100%;
          background: linear-gradient(135deg, #FFF0EC 0%, #FCE8E4 100%);
          border: 1px solid rgba(232, 216, 208, 0.8);
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(183, 110, 121, 0.08);
        }

        .promo-text-wrap {
          position: relative;
          z-index: 2;
          max-width: 220px;
        }

        .promo-badge {
          display: inline-block;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #B76E79;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .promo-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.55rem;
          font-weight: 600;
          color: #2D201E;
          line-height: 1.15;
          margin: 0 0 6px 0;
        }

        .promo-description {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          color: #6F5A58;
          line-height: 1.4;
          margin: 0 0 16px 0;
        }

        :global(.promo-cta-btn) {
          display: inline-flex !important;
          align-items: center !important;
          gap: 7px !important;
          background: #B76E79 !important;
          color: #FFFFFF !important;
          padding: 9px 20px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          font-family: var(--font-ui), 'Jost', sans-serif !important;
          font-size: 0.80rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.04em !important;
          box-shadow: 0 4px 12px rgba(183, 110, 121, 0.3) !important;
          transition: background-color 200ms ease, transform 200ms ease !important;
        }

        :global(.promo-cta-btn:hover) {
          background: #9C5762 !important;
          transform: translateX(3px) !important;
        }

        .promo-image-wrap {
          position: absolute;
          right: -10px;
          bottom: -15px;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          overflow: hidden;
          z-index: 1;
          box-shadow: 0 8px 24px rgba(65, 40, 35, 0.12);
        }

        :global(.promo-img) {
          transition: transform 400ms ease !important;
        }

        .promo-editorial-card:hover :global(.promo-img) {
          transform: scale(1.08);
        }
      `}</style>
    </motion.div>
  );
}
