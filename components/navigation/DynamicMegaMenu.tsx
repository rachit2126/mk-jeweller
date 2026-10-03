'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { DbNavigationItem } from '@/lib/db/types';

interface DynamicMegaMenuProps {
  categories: DbNavigationItem[];
  activeItem: DbNavigationItem;
  onSelectCategory: (slug: string) => void;
  onClose: () => void;
}

// Minimal curated popular style tags per category
const POPULAR_STYLES_MAP: Record<string, string[]> = {
  earrings: ['Studs', 'Hoops', 'Jhumki', 'Oxidised', 'Pearl', 'Floral', 'Minimal', 'Statement'],
  necklaces: ['Gold Plated', 'Minimal', 'Statement', 'Religious', 'Initial', 'Couple', 'Everyday', 'Bridal'],
  rings: ['Solitaire', 'Band', 'Eternity', 'Adjustable', 'Stackable', 'Cocktail', 'Couple'],
  bracelets: ['Tennis', 'Cuff', 'Evil Eye', 'Charms', 'Links', 'Minimal'],
  bangles: ['Kada', 'Stacking', 'Traditional', 'Smooth', 'Filigree'],
  anklets: ['Payal', 'Bells', 'Minimal', 'Black Bead', 'Bridal'],
  pendants: ['Solitaire', 'Spiritual', 'Alphabet', 'Gemstone', 'Floral'],
  mangalsutra: ['Daily Wear', 'Traditional', 'Single Bead', 'Diamond Look'],
  collections: ['Heritage', 'Bridal', 'Everyday', 'Minimal', 'Festive', 'Men'],
};

// Subtle luxury line icons for each category selector
function CategoryIcon({ slug }: { slug?: string }) {
  const s = (slug || '').toLowerCase();

  if (s.includes('earring')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="7" r="3" />
        <path d="M8 10v7a2 2 0 0 0 4 0" />
        <circle cx="16" cy="7" r="3" />
        <path d="M16 10v7a2 2 0 0 1-4 0" />
      </svg>
    );
  }
  if (s.includes('necklace')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4c0 7 4 12 8 12s8-5 8-12" />
        <circle cx="12" cy="18.5" r="2.5" />
      </svg>
    );
  }
  if (s.includes('ring')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="7" />
        <path d="M12 2l2 4h-4l2-4z" />
      </svg>
    );
  }
  if (s.includes('bracelet')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(-25 12 12)" />
        <circle cx="16" cy="8" r="1.5" />
      </svg>
    );
  }
  if (s.includes('bangle')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (s.includes('anklet')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 14c3-3 7-4 14-1" />
        <circle cx="9" cy="16" r="1" />
        <circle cx="14" cy="15" r="1" />
      </svg>
    );
  }
  if (s.includes('pendant')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3l6 6 6-6" />
        <path d="M12 9v4" />
        <polygon points="12,13 15,18 9,18" />
      </svg>
    );
  }
  if (s.includes('mangalsutra')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5c4 4 6 9 9 9s5-5 9-9" />
        <circle cx="12" cy="17" r="1.8" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
      </svg>
    );
  }
  // Collections / Default
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 5.6L20 10l-4.4 4 1.4 5.8L12 17l-5 2.8 1.4-5.8L4 10l5.6-2.4z" />
    </svg>
  );
}

// Isolated Subcategory Card with robust image fallback
function SubcategoryCard({
  sub,
  activeItemSlug,
  onClose,
}: {
  sub: DbNavigationItem;
  activeItemSlug?: string;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  const href =
    sub.url ||
    (activeItemSlug === 'collections'
      ? `/shop?collection=${encodeURIComponent(sub.slug || '')}`
      : `/shop?category=${encodeURIComponent(activeItemSlug || '')}&subcategory=${encodeURIComponent(sub.slug || '')}`);

  return (
    <Link
      href={href}
      onClick={onClose}
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
      className="subcategory-card"
    >
      {/* 4:3 Aspect Ratio Image Thumbnail */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#F5F3EF',
          border: '1px solid #EAE8E2',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {sub.image && !imgError ? (
          <Image
            src={sub.image}
            alt={sub.label}
            fill
            sizes="(max-width: 1200px) 150px, 180px"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
            className="sub-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8A8A85',
              backgroundColor: '#F5F3EF',
            }}
          >
            <CategoryIcon slug={activeItemSlug} />
          </div>
        )}
      </div>

      {/* Info Row: Title & Subtitle on left, Circular Arrow on right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginTop: '8px',
          minWidth: 0,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            className="sub-card-title"
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#111111',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 0.18s ease',
            }}
          >
            {sub.label}
          </div>
          {sub.description && (
            <div
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.7rem',
                color: '#777772',
                lineHeight: 1.2,
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {sub.description}
            </div>
          )}
        </div>

        {/* Circular Arrow Button */}
        <div
          className="sub-arrow-btn"
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E7E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111111',
            flexShrink: 0,
            transition: 'all 0.18s ease',
          }}
        >
          <ArrowRight size={10} strokeWidth={2} />
        </div>
      </div>
    </Link>
  );
}

export default function DynamicMegaMenu({
  categories,
  activeItem,
  onSelectCategory,
  onClose,
}: DynamicMegaMenuProps) {
  const [imageFailed, setImageFailed] = useState(false);

  // Eligible categories for the left sidebar selector
  const eligibleCategories = (categories || []).filter(
    (c) => c.megaMenuEnabled || (c.children && c.children.length > 0)
  );

  // Subcategories of currently active item
  const children = (activeItem.children || []) as DbNavigationItem[];

  // Featured Promo Card Data
  const featuredImage = activeItem.image;
  const featuredTitle = activeItem.featuredTitle || activeItem.label;
  const featuredDescription =
    activeItem.featuredDescription ||
    `Handcrafted 925 sterling silver ${activeItem.label.toLowerCase()} for every occasion.`;
  const featuredCtaText = activeItem.featuredCtaText || `SHOP ${activeItem.label.toUpperCase()} →`;
  const featuredCtaUrl =
    activeItem.featuredCtaUrl || activeItem.url || `/shop?category=${encodeURIComponent(activeItem.slug || '')}`;

  const showFeaturedCard = Boolean(featuredImage && !imageFailed);
  const popularStyles = POPULAR_STYLES_MAP[activeItem.slug || ''] || POPULAR_STYLES_MAP.earrings;

  // Grid columns layout:
  // 2-4 items: 1 row
  // 5+ items: 4 columns across
  const gridColumns =
    children.length <= 4
      ? `repeat(${Math.max(children.length, 2)}, minmax(0, 1fr))`
      : 'repeat(4, minmax(0, 1fr))';

  return (
    <div
      role="region"
      aria-label={`${activeItem.label} Navigation Menu`}
      className="dynamic-mega-menu-wrapper"
      style={{
        width: '100%',
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '0 clamp(16px, 2.5vw, 32px)',
        boxSizing: 'border-box',
        pointerEvents: 'auto',
      }}
    >
      <div
        className="dynamic-mega-menu-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          padding: '24px 28px',
          maxHeight: '620px',
          height: 'auto',
          display: 'grid',
          gridTemplateColumns: showFeaturedCard
            ? '190px minmax(0, 1fr) 280px'
            : '190px minmax(0, 1fr)',
          gap: 'clamp(20px, 2.5vw, 32px)',
          boxSizing: 'border-box',
          alignItems: 'stretch',
          overflow: 'hidden',
          animation: 'megaMenuSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ======================================================== */}
        {/* PART 1: LEFT CATEGORY SELECTOR                           */}
        {/* ======================================================== */}
        <div
          className="mega-category-selector"
          style={{
            borderRight: '1px solid #F0EEE9',
            paddingRight: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {eligibleCategories.map((cat) => {
            const isActive = cat.slug === activeItem.slug;
            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onMouseEnter={() => onSelectCategory(cat.slug || '')}
                onClick={() => onSelectCategory(cat.slug || '')}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? '#F4F1EB' : 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: isActive ? '#111111' : '#555550',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.02em',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  boxSizing: 'border-box',
                }}
                className={`category-selector-btn ${isActive ? 'is-active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span style={{ color: isActive ? '#111111' : '#8A8A85', display: 'flex' }}>
                    <CategoryIcon slug={cat.slug} />
                  </span>
                  <span>{cat.label}</span>
                </div>
                <ChevronRight
                  size={13}
                  strokeWidth={isActive ? 2 : 1.5}
                  color={isActive ? '#111111' : '#BFC1C4'}
                  className="cat-chevron"
                  style={{ transition: 'transform 0.18s ease' }}
                />
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* PART 2: CENTER SUBCATEGORY CONTENT                       */}
        {/* ======================================================== */}
        <div
          className="mega-center-content"
          style={{
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px',
            boxSizing: 'border-box',
          }}
        >
          {/* Header Row: Eyebrow, Title, Subtitle, and View All Link */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '4px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#8A8A85',
                    marginBottom: '3px',
                  }}
                >
                  EXPLORE OUR COLLECTION
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                    fontSize: '1.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#111111',
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  {activeItem.label}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.8rem',
                    color: '#6F6F6A',
                    margin: '3px 0 0 0',
                    lineHeight: 1.35,
                  }}
                >
                  {activeItem.featuredDescription || `Elegant designs for every occasion in pure 925 silver.`}
                </p>
              </div>

              <Link
                href={activeItem.url || `/shop?category=${encodeURIComponent(activeItem.slug || '')}`}
                onClick={onClose}
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#111111',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  letterSpacing: '0.04em',
                  transition: 'opacity 0.15s ease',
                  whiteSpace: 'nowrap',
                  marginTop: '4px',
                }}
                className="view-all-link"
              >
                <span>View All {activeItem.label}</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Subcategory Grid Cards (4 columns desktop) */}
          <div style={{ flex: 1, minHeight: 0 }}>
            {children.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridColumns,
                  gap: '12px 14px',
                  alignItems: 'start',
                }}
                className="subcategories-grid"
              >
                {children.map((sub) => (
                  <SubcategoryCard
                    key={sub.id || sub.slug}
                    sub={sub}
                    activeItemSlug={activeItem.slug}
                    onClose={onClose}
                  />
                ))}
              </div>
            ) : (
              /* Graceful minimal state if no subcategories exist */
              <div
                style={{
                  padding: '24px 16px',
                  backgroundColor: '#FBFBF9',
                  borderRadius: '10px',
                  border: '1px solid #F0EEE9',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.84rem',
                    color: '#6F6F6A',
                    margin: '0 0 10px 0',
                  }}
                >
                  Explore our entire selection of handcrafted {activeItem.label.toLowerCase()}.
                </p>
                <Link
                  href={activeItem.url || `/shop?category=${encodeURIComponent(activeItem.slug || '')}`}
                  onClick={onClose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#111111',
                    textDecoration: 'none',
                    borderBottom: '1px solid #111111',
                    paddingBottom: '2px',
                  }}
                >
                  <span>View All {activeItem.label}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Bottom Section: POPULAR STYLES Pills */}
          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid #F0EEE9',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.64rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#8A8A85',
                whiteSpace: 'nowrap',
              }}
            >
              POPULAR STYLES
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {popularStyles.map((style) => (
                <Link
                  key={style}
                  href={`/shop?category=${encodeURIComponent(activeItem.slug || '')}&style=${encodeURIComponent(style.toLowerCase())}`}
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: '#252525',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DDD8D0',
                    borderRadius: '999px',
                    height: '32px',
                    padding: '0 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.18s ease',
                    boxSizing: 'border-box',
                  }}
                  className="style-pill"
                >
                  {style}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 3: RIGHT EDITORIAL FEATURED CARD                    */}
        {/* ======================================================== */}
        {showFeaturedCard && (
          <div
            className="mega-featured-column"
            style={{
              height: '100%',
              minHeight: '340px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundColor: '#111111',
                boxSizing: 'border-box',
              }}
            >
              {/* High-res Image */}
              <Image
                src={featuredImage!}
                alt={featuredTitle}
                fill
                sizes="300px"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
                className="featured-bg-img"
                onError={() => setImageFailed(true)}
              />

              {/* Dark Bottom Gradient Scrim */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0.05) 100%)',
                  zIndex: 1,
                }}
              />

              {/* Text & Action Overlay */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '22px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  boxSizing: 'border-box',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#D8D5CE',
                  }}
                >
                  FEATURED
                </span>

                <h4
                  style={{
                    fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                    fontSize: '1.45rem',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  {featuredTitle}
                </h4>

                <p
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.74rem',
                    color: 'rgba(255, 255, 255, 0.88)',
                    lineHeight: 1.35,
                    margin: '0 0 10px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {featuredDescription}
                </p>

                {/* Prominent White Button with Black Text */}
                <Link
                  href={featuredCtaUrl}
                  onClick={onClose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    padding: '10px 18px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.18s ease, transform 0.18s ease',
                  }}
                  className="featured-cta-btn"
                >
                  <span>{featuredCtaText}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes megaMenuSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-selector-btn:hover:not(.is-active) {
          background-color: #F8F7F3 !important;
          color: #111111 !important;
        }

        .category-selector-btn:hover .cat-chevron {
          transform: translateX(3px);
        }

        .subcategory-card:hover .sub-img {
          transform: scale(1.03);
        }

        .subcategory-card:hover .sub-card-title {
          color: #000000 !important;
        }

        .subcategory-card:hover .sub-arrow-btn {
          background-color: #111111 !important;
          color: #FFFFFF !important;
          border-color: #111111 !important;
          transform: translateX(4px);
        }

        .style-pill:hover {
          background-color: #111111 !important;
          color: #FFFFFF !important;
          border-color: #111111 !important;
        }

        .featured-cta-btn:hover {
          background-color: #F4F1EB !important;
          transform: translateY(-1px);
        }

        .view-all-link:hover {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
