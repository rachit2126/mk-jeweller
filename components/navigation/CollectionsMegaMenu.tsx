'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, ArrowRight, Sparkles, Flame, Gem, Flower2, Crown, Gift } from 'lucide-react';

interface CollectionsMegaMenuProps {
  isOpen?: boolean;
  onClose: () => void;
}

const COLLECTIONS_LIST = [
  { label: 'Best Sellers', href: '/shop?badge=BEST%20SELLER', icon: Flame, tag: 'Most Loved' },
  { label: 'New Arrivals', href: '/shop?badge=NEW%20ARRIVAL', icon: Sparkles, tag: 'Fresh Drop' },
  { label: 'Everyday Essentials', href: '/collections', icon: Gem, tag: 'Daily Silver' },
  { label: 'Festive Collection', href: '/collections', icon: Flower2, tag: 'Celebrations' },
  { label: 'Bridal Collection', href: '/collections', icon: Crown, tag: 'Royal Heirloom' },
  { label: 'Gifts Collection', href: '/gifts', icon: Gift, tag: 'Curated Sets' },
];

const FEATURED_MINI_CARDS = [
  {
    title: 'Everyday Elegance',
    desc: 'Featherlight 925 silver for desk to dinner',
    image: '/images/occasions/everyday-elegance.jpg',
    href: '/collections',
  },
  {
    title: 'Bridal & Polki',
    desc: 'Regal kundan & baroque pearl choker sets',
    image: '/images/occasions/bridal-collection.jpg',
    href: '/collections',
  },
];

export default function CollectionsMegaMenu({ isOpen = true, onClose }: CollectionsMegaMenuProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredItem, setHoveredItem] = useState<string>('Best Sellers');

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
        {/* LEFT COLUMN: Collections List */}
        <div className="mega-left-col">
          <div className="column-eyebrow">Collections</div>
          <div className="collection-list">
            {COLLECTIONS_LIST.map((item) => {
              const Icon = item.icon;
              const isSelected = hoveredItem === item.label;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  className={`collection-item-link ${isSelected ? 'active-item' : ''}`}
                >
                  <div className="item-left">
                    <span className="item-icon-box">
                      <Icon size={15} color={isSelected ? '#B76E79' : '#806D68'} />
                    </span>
                    <span className="item-name">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className="item-arrow" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* MIDDLE COLUMN: Large Editorial Image Card */}
        <div className="mega-middle-col">
          <div className="editorial-hero-card">
            <Image
              src="/images/products/necklaces-emerald-polki-bridal-set-01.png"
              alt="Curated Collections For Every You"
              fill
              sizes="(max-width: 1400px) 450px, 520px"
              style={{ objectFit: 'cover' }}
              className="editorial-hero-img"
            />
            <div className="editorial-hero-overlay">
              <span className="editorial-badge">SIGNATURE SERIES</span>
              <h3 className="editorial-hero-title">
                Curated Collections
                <span className="editorial-italic-line">For Every You</span>
              </h3>
              <p className="editorial-hero-desc">
                From subtle daily brilliance to royal celebration statements.
              </p>
              <Link href="/collections" onClick={onClose} className="editorial-cta-btn">
                <span>Explore Collections</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Featured Mini Collection Cards */}
        <div className="mega-right-col">
          <div className="column-eyebrow">Featured Themes</div>
          <div className="mini-cards-stack">
            {FEATURED_MINI_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                onClick={onClose}
                className="mini-collection-card"
              >
                <div className="mini-card-thumb">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="110px"
                    style={{ objectFit: 'cover' }}
                    className="mini-thumb-img"
                  />
                </div>
                <div className="mini-card-body">
                  <h4 className="mini-card-title">{card.title}</h4>
                  <p className="mini-card-desc">{card.desc}</p>
                  <span className="mini-card-link">
                    <span>Discover</span>
                    <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
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
          grid-template-columns: 240px 1.4fr 320px;
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

        .collection-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        :global(.collection-item-link) {
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

        .item-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .item-icon-box {
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

        .item-name {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        :global(.item-arrow) {
          flex-shrink: 0 !important;
          color: #806D68;
          opacity: 0.6;
          transition: transform 200ms ease, opacity 200ms ease, color 200ms ease;
        }

        :global(.collection-item-link:hover),
        :global(.collection-item-link.active-item) {
          background-color: #FCECE9 !important;
          color: #B76E79 !important;
        }

        :global(.collection-item-link:hover) .item-icon-box,
        :global(.collection-item-link.active-item) .item-icon-box {
          background-color: #FFFFFF;
        }

        :global(.collection-item-link:hover) :global(.item-arrow),
        :global(.collection-item-link.active-item) :global(.item-arrow) {
          color: #B76E79 !important;
          opacity: 1 !important;
          transform: translateX(4px) !important;
        }

        /* MIDDLE COLUMN: EDITORIAL CARD */
        .mega-middle-col {
          display: flex;
          flex-direction: column;
        }

        .editorial-hero-card {
          position: relative;
          height: 100%;
          min-height: 280px;
          border-radius: 20px;
          overflow: hidden;
          background: #2D201E;
          box-shadow: 0 8px 24px rgba(65, 40, 35, 0.12);
        }

        :global(.editorial-hero-img) {
          transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1) !important;
          opacity: 0.82;
        }

        .editorial-hero-card:hover :global(.editorial-hero-img) {
          transform: scale(1.05);
        }

        .editorial-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(32, 20, 18, 0.92) 0%,
            rgba(32, 20, 18, 0.55) 50%,
            rgba(32, 20, 18, 0.25) 100%
          );
          padding: 26px 30px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          z-index: 2;
        }

        .editorial-badge {
          display: inline-block;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #D9B98A;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .editorial-hero-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.85rem;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 1.15;
          margin: 0 0 6px 0;
          display: flex;
          flex-direction: column;
        }

        .editorial-italic-line {
          font-style: italic;
          color: #F6D6D9;
          font-weight: 400;
        }

        .editorial-hero-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.4;
          margin: 0 0 16px 0;
          max-width: 360px;
        }

        :global(.editorial-cta-btn) {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          background: #B76E79 !important;
          color: #FFFFFF !important;
          padding: 10px 22px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          font-family: var(--font-ui), 'Jost', sans-serif !important;
          font-size: 0.82rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.04em !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;
          transition: background-color 200ms ease, transform 200ms ease !important;
        }

        :global(.editorial-cta-btn:hover) {
          background: #9C5762 !important;
          transform: translateX(3px) !important;
        }

        /* RIGHT COLUMN: FEATURED MINI CARDS */
        .mega-right-col {
          border-left: 1px solid rgba(232, 216, 208, 0.6);
          padding-left: 24px;
        }

        .mini-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mini-collection-card {
          display: flex;
          gap: 14px;
          text-decoration: none;
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.7);
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0 4px 12px rgba(65, 40, 35, 0.03);
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }

        .mini-collection-card:hover {
          transform: translateY(-2px);
          border-color: rgba(183, 110, 121, 0.4);
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.12);
        }

        .mini-card-thumb {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          background: #FCECE9;
        }

        :global(.mini-thumb-img) {
          transition: transform 350ms ease !important;
        }

        .mini-collection-card:hover :global(.mini-thumb-img) {
          transform: scale(1.08);
        }

        .mini-card-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
        }

        .mini-card-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.08rem;
          font-weight: 600;
          color: #2D201E;
          margin: 0 0 3px 0;
          line-height: 1.2;
          transition: color 200ms ease;
        }

        .mini-collection-card:hover .mini-card-title {
          color: #B76E79;
        }

        .mini-card-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          color: #806D68;
          line-height: 1.35;
          margin: 0 0 6px 0;
        }

        .mini-card-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: #B76E79;
          transition: transform 200ms ease;
        }

        .mini-collection-card:hover .mini-card-link {
          transform: translateX(3px);
        }
      `}</style>
    </motion.div>
  );
}
