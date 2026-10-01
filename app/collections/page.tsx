'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/types';
import NewsletterSection from '@/components/home/NewsletterSection';

/* 5 Core Jewellery Categories */
const CATEGORY_CAROUSEL = [
  {
    id: 'necklaces',
    name: 'Necklaces',
    subtitle: 'Elegant & timeless',
    href: '/shop?category=necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    subtitle: 'Everyday to statement',
    href: '/shop?category=earrings',
    image: '/images/collection-earrings.jpg',
  },
  {
    id: 'rings',
    name: 'Rings',
    subtitle: 'Symbols of love',
    href: '/shop?category=rings',
    image: '/images/collection-rings.jpg',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    subtitle: 'Modern essentials',
    href: '/shop?category=bracelets',
    image: 'https://images.unsplash.com/photo-1611591475155-426c04a29c61?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'pendants',
    name: 'Pendants',
    subtitle: 'Meaningful pieces',
    href: '/shop?category=pendants',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
  },
];

/* 4 Curated Occasions */
const OCCASIONS_LIST = [
  {
    id: 'everyday',
    title: 'Everyday',
    desc: 'Minimal elegance',
    href: '/shop?occasion=everyday',
    image: '/images/occasions/everyday-elegance.jpg',
  },
  {
    id: 'festive',
    title: 'Festive',
    desc: 'Celebrate traditions',
    href: '/shop?occasion=festive',
    image: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg',
  },
  {
    id: 'bridal',
    title: 'Bridal',
    desc: 'For your big day',
    href: '/shop?occasion=bridal',
    image: '/images/occasions/bridal-collection.jpg',
  },
  {
    id: 'gifts',
    title: 'Gifts',
    desc: 'Thoughtful expressions',
    href: '/shop?occasion=gifts',
    image: '/images/occasions/gifting-collection.jpg',
  },
];

export default function CollectionsPage() {
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const occasionScrollRef = useRef<HTMLDivElement>(null);
  const bestSellersScrollRef = useRef<HTMLDivElement>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?isBestSeller=true&limit=6')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setBestSellerProducts(data.products);
        }
      })
      .catch(err => console.error('Failed to load collections best sellers:', err));
  }, []);

  // Track category carousel scroll position for progress dots
  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 18 : 280;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveCategoryIndex(Math.min(Math.max(index, 0), CATEGORY_CAROUSEL.length - 1));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollBestSellers = (direction: 'left' | 'right') => {
    if (bestSellersScrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      bestSellersScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollOccasions = (direction: 'left' | 'right') => {
    if (occasionScrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      occasionScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="collections-page-wrapper">
      {/* ========================================================================= */}
      {/* BREADCRUMB NAVIGATION — Establishes clear hierarchy below navbar          */}
      {/* ========================================================================= */}
      <nav aria-label="Breadcrumb" className="collections-breadcrumb-bar">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/" className="breadcrumb-link">Home</Link>
            </li>
            <li className="breadcrumb-separator" aria-hidden="true">/</li>
            <li aria-current="page" className="breadcrumb-current">Collections</li>
          </ol>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 1. EDITORIAL HERO: CURATED SUITES                                         */}
      {/* ========================================================================= */}
      <section className="collections-hero-section" aria-label="Signature Collections Hero">
        <div className="container">
          <div className="collections-hero-grid">
            {/* Left Content Column (45%) */}
            <div className="hero-content-col">
              <span className="hero-eyebrow">CURATED SUITES</span>
              <h1 className="hero-title">Signature Collections</h1>
              <p className="hero-description">
                Each suite is sculpted in pure 925 sterling silver, honoring the eternal craft
                traditions of Jaipur while speaking to contemporary modern aesthetics.
              </p>
              <div className="hero-cta-wrap">
                <Link href="/shop" className="hero-primary-pill">
                  <span>Explore All Jewellery</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Decorative Subtle Botanical Line Watermark */}
              <svg
                className="hero-botanical-watermark"
                width="130"
                height="130"
                viewBox="0 0 130 130"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 120 C35 85 65 45 115 15"
                  stroke="#B76E79"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.32"
                />
                <path
                  d="M40 88 C36 78 48 70 56 76 C59 86 50 94 40 88 Z"
                  fill="rgba(246, 214, 217, 0.35)"
                  stroke="#B76E79"
                  strokeWidth="0.8"
                  opacity="0.4"
                />
                <path
                  d="M78 55 C74 45 86 37 94 43 C97 53 88 61 78 55 Z"
                  fill="rgba(255, 227, 211, 0.4)"
                  stroke="#B76E79"
                  strokeWidth="0.8"
                  opacity="0.4"
                />
              </svg>
            </div>

            {/* Right Editorial Model Image (55%) */}
            <div className="hero-image-col">
              <div className="hero-image-wrapper">
                <Image
                  src="/images/editorial/bridal-banner-clean-hd.jpg"
                  alt="MK Silver Hub Signature 925 Sterling Silver Jewellery Suite"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 55vw"
                  className="hero-editorial-img"
                />
                <div className="hero-image-soft-gradient" />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. TRUST / BRAND PROMISE STRIP — Compact 3-Column Pill                     */}
          {/* ========================================================================= */}
          <div className="hero-trust-bar">
            {/* 1. 925 Sterling Silver */}
            <div className="hero-trust-item">
              <div className="trust-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                  <path d="M10.5 9 7 3" />
                  <path d="M13.5 9 17 3" />
                  <path d="M2 9h20" />
                  <path d="M7 9l5 12 5-12" />
                </svg>
              </div>
              <div className="trust-text-wrap">
                <span className="trust-main">925 Sterling Silver</span>
                <span className="trust-sub">Hallmarked Jewellery</span>
              </div>
            </div>

            <div className="trust-bar-separator" aria-hidden="true" />

            {/* 2. Timeless Designs */}
            <div className="hero-trust-item">
              <div className="trust-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4c-2.5 3-4 6-4 9 0 2.2 1.8 4 4 4s4-1.8 4-4c0-3-1.5-6-4-9z" />
                  <path d="M7 11c-1.5 2-2 4-2 6 0 1.7 1.3 3 3 3 1.8 0 3-1.3 3-3 0-2-.5-4-2-6z" />
                  <path d="M17 11c1.5 2 2 4 2 6 0 1.7-1.3 3-3 3-1.8 0-3-1.3-3-3 0-2 .5-4 2-6z" />
                </svg>
              </div>
              <div className="trust-text-wrap">
                <span className="trust-main">Timeless Designs</span>
                <span className="trust-sub">Inspired by Tradition</span>
              </div>
            </div>

            <div className="trust-bar-separator" aria-hidden="true" />

            {/* 3. Modern Aesthetics */}
            <div className="hero-trust-item">
              <div className="trust-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 L13.8 8.2 L20 10 L13.8 11.8 L12 18 L10.2 11.8 L4 10 L10.2 8.2 Z" fill="rgba(246, 214, 217, 0.45)" />
                  <path d="M18 16 L19 19 L22 20 L19 21 L18 24 L17 21 L14 20 L17 19 Z" />
                </svg>
              </div>
              <div className="trust-text-wrap">
                <span className="trust-main">Modern Aesthetics</span>
                <span className="trust-sub">For Every You</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOP THE COLLECTIONS: EDITORIAL CATEGORY CAROUSEL                       */}
      {/* ========================================================================= */}
      <section className="shop-the-collections-section" aria-label="Shop The Collections By Category">
        <div className="container">
          {/* Header Row with Title & Controls */}
          <div className="category-section-header">
            <div>
              <span className="section-eyebrow">EXPLORE BY CATEGORY</span>
              <h2 className="section-title">Shop The Collections</h2>
              <p className="section-description">
                From everyday essentials to bridal heirlooms, discover jewellery that celebrates
                every moment of your story.
              </p>
            </div>

            <div className="category-header-controls">
              <Link href="/shop" className="view-all-text-link">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>

              <div className="carousel-nav-arrows">
                <button
                  onClick={() => scrollCategories('left')}
                  aria-label="Previous categories"
                  className="arrow-nav-btn"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollCategories('right')}
                  aria-label="Next categories"
                  className="arrow-nav-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Snap Carousel — 0 Left Margin, 4.3 Cards on Desktop */}
          <div className="categories-carousel-outer">
            <div ref={categoryScrollRef} className="categories-horizontal-track">
              {CATEGORY_CAROUSEL.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="category-editorial-card"
                  aria-label={`Shop ${cat.name} Collection`}
                >
                  <div className="category-card-image-box">
                    <Image
                      src={cat.image}
                      alt={`MK Silver Hub ${cat.name}`}
                      fill
                      sizes="(max-width: 768px) 84vw, (max-width: 1200px) 25vw, 290px"
                      className="category-card-img"
                    />
                    <div className="category-card-overlay-gradient" />
                  </div>

                  <div className="category-card-info-panel">
                    <div className="category-card-text">
                      <h3 className="category-card-name">{cat.name}</h3>
                      <p className="category-card-tagline">{cat.subtitle}</p>
                    </div>
                    <div className="category-card-circle-btn">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile & Tablet Progress Indicator Dots */}
            <div className="carousel-progress-dots" aria-hidden="true">
              {CATEGORY_CAROUSEL.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (categoryScrollRef.current) {
                      const cardWidth = categoryScrollRef.current.firstElementChild
                        ? (categoryScrollRef.current.firstElementChild as HTMLElement).offsetWidth + 18
                        : 280;
                      categoryScrollRef.current.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                    }
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`progress-dot ${i === activeCategoryIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COLLECTIONS FOR EVERY OCCASION: SOFT BLUSH CARD BANNER                 */}
      {/* ========================================================================= */}
      <section className="collections-occasion-section" aria-label="Collections For Every Occasion">
        <div className="container">
          <div className="occasions-banner-layout">
            {/* Left Story Side */}
            <div className="occasion-story-col">
              <h2 className="occasion-main-title">Collections For Every Occasion</h2>
              <p className="occasion-main-desc">
                Thoughtfully curated suites for your most meaningful moments.
              </p>
              <Link href="/shop" className="occasion-primary-cta">
                <span>Explore Occasion Collections</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right Cards Track */}
            <div className="occasions-track-wrap">
              <div ref={occasionScrollRef} className="occasions-horizontal-track">
                {OCCASIONS_LIST.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="occasion-card"
                    aria-label={`Shop ${item.title} Occasion Jewellery`}
                  >
                    <div className="occasion-card-image-box">
                      <Image
                        src={item.image}
                        alt={`MK Silver Hub ${item.title} Collection`}
                        fill
                        sizes="(max-width: 768px) 70vw, 220px"
                        className="occasion-card-img"
                      />
                      <div className="occasion-card-gradient" />
                      {/* Subtle Wishlist Heart Icon */}
                      <div className="occasion-wishlist-badge">
                        <Heart size={14} strokeWidth={1.8} />
                      </div>
                    </div>

                    <div className="occasion-card-glass-footer">
                      <div className="occasion-footer-text">
                        <h3 className="occasion-card-title">{item.title}</h3>
                        <p className="occasion-card-desc">{item.desc}</p>
                      </div>
                      <div className="occasion-card-arrow">
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BEST SELLERS / CURATED PRODUCTS                                        */}
      {/* ========================================================================= */}
      <section className="collections-bestsellers-section" aria-label="Best Selling Silver Jewellery">
        <div className="container">
          <div className="category-section-header">
            <div>
              <span className="section-eyebrow">BEST SELLERS</span>
              <h2 className="section-title">Our Most Loved Pieces</h2>
            </div>

            <div className="category-header-controls">
              <Link href="/shop?collection=best-sellers" className="view-all-text-link">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>

              <div className="carousel-nav-arrows">
                <button
                  onClick={() => scrollBestSellers('left')}
                  aria-label="Previous best sellers"
                  className="arrow-nav-btn"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollBestSellers('right')}
                  aria-label="Next best sellers"
                  className="arrow-nav-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Cards Carousel */}
          <div ref={bestSellersScrollRef} className="bestsellers-horizontal-track">
            {bestSellerProducts.map((product) => (
              <div key={product.id} className="bestseller-item-wrap">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EDITORIAL STORY: THE JAIPUR HERITAGE                                   */}
      {/* ========================================================================= */}
      <section className="collections-editorial-story" aria-label="Our Silver Heritage">
        <div className="container">
          <div className="story-card-wrapper">
            <div className="story-content-col">
              <span className="section-eyebrow">THE JAIPUR HERITAGE</span>
              <h2 className="story-heading">Handcrafted In Jaipur. Cherished Everywhere.</h2>
              <p className="story-paragraph">
                Every MK Silver Hub creation begins with BIS 925 hallmarked sterling silver,
                sculpted by multi-generational silversmiths in Jaipur. From royal Polki settings
                to minimalist geometric statements, our jewellery balances historical craft
                with contemporary comfort.
              </p>
              <div className="story-badges-row">
                <div className="story-badge">
                  <span className="badge-value">100%</span>
                  <span className="badge-label">BIS Hallmarked</span>
                </div>
                <div className="story-badge-divider" />
                <div className="story-badge">
                  <span className="badge-value">Anti-Tarnish</span>
                  <span className="badge-label">Rhodium Polish</span>
                </div>
                <div className="story-badge-divider" />
                <div className="story-badge">
                  <span className="badge-value">Pan-India</span>
                  <span className="badge-label">Insured Shipping</span>
                </div>
              </div>
              <Link href="/about" className="story-text-cta">
                <span>Read Our Heritage Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="story-image-col">
              <div className="story-image-box">
                <Image
                  src="/images/editorial/editorial-campaign-banner.jpg"
                  alt="Jaipur master craftsman sculpting 925 sterling silver jewellery"
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  className="story-artisan-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. NEWSLETTER SECTION                                                     */}
      {/* ========================================================================= */}
      <NewsletterSection />

      {/* ========================================================================= */}
      {/* CSS STYLING: LUXURY INDIAN CONTEMPORARY 925 JEWELLERY                     */}
      {/* ========================================================================= */}
      <style jsx>{`
        .collections-page-wrapper {
          background-color: #FFF9F3;
          min-height: 100vh;
          overflow-x: hidden;
          width: 100%;
        }

        /* 1. BREADCRUMBS */
        .collections-breadcrumb-bar {
          padding-top: clamp(14px, 2vw, 24px);
          padding-bottom: 8px;
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #806D68;
        }

        .breadcrumb-link {
          color: #806D68;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .breadcrumb-link:hover {
          color: #B76E79;
        }

        .breadcrumb-separator {
          color: #D9B98A;
          user-select: none;
        }

        .breadcrumb-current {
          color: #342727;
          font-weight: 500;
        }

        /* 2. HERO SECTION */
        .collections-hero-section {
          padding: clamp(16px, 2.5vw, 32px) 0 clamp(28px, 3.5vw, 40px);
          position: relative;
        }

        .collections-hero-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: clamp(28px, 4.5vw, 56px);
          align-items: center;
        }

        .hero-content-col {
          max-width: 540px;
          position: relative;
        }

        .hero-eyebrow {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #B76E79;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 12px;
        }

        .hero-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.6rem, 4.2vw, 4rem);
          font-weight: 500;
          color: #342727;
          line-height: 1.08;
          margin: 0 0 14px 0;
          letter-spacing: -0.015em;
        }

        .hero-description {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: clamp(0.92rem, 1.05vw, 1.02rem);
          color: #806D68;
          line-height: 1.6;
          margin: 0 0 24px 0;
          max-width: 520px;
        }

        .hero-cta-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hero-primary-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #B76E79;
          color: #FFFFFF;
          padding: 12px 28px;
          border-radius: 999px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(183, 110, 121, 0.32);
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .hero-primary-pill:hover {
          background-color: #9C5762;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(183, 110, 121, 0.42);
        }

        .hero-botanical-watermark {
          position: absolute;
          bottom: -20px;
          right: 0;
          pointer-events: none;
          z-index: 0;
        }

        .hero-image-col {
          position: relative;
        }

        .hero-image-wrapper {
          position: relative;
          width: 100%;
          height: clamp(380px, 42vw, 470px);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 16px 45px rgba(59, 43, 43, 0.10);
          border: 1px solid rgba(232, 216, 208, 0.85);
          background-color: #FFE3D3;
        }

        :global(.hero-editorial-img) {
          object-fit: cover;
          object-position: center 25%;
          transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-image-wrapper:hover :global(.hero-editorial-img) {
          transform: scale(1.03);
        }

        .hero-image-soft-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255, 249, 243, 0.02) 0%,
            rgba(59, 43, 43, 0.18) 100%
          );
          pointer-events: none;
        }

        /* 3. HERO TRUST BAR — Tight Spacing Below Hero */
        .hero-trust-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-top: clamp(26px, 3.2vw, 36px);
          margin-bottom: clamp(36px, 4.2vw, 48px);
          padding: 18px 28px;
          background: #FFFFFF;
          border-radius: 24px;
          border: 1px solid rgba(232, 216, 208, 0.85);
          box-shadow: 0 6px 20px rgba(59, 43, 43, 0.04);
        }

        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .trust-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: rgba(255, 227, 211, 0.55);
          border: 1px solid rgba(232, 216, 208, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #B76E79;
          flex-shrink: 0;
        }

        .trust-text-wrap {
          display: flex;
          flex-direction: column;
        }

        .trust-main {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.08rem;
          font-weight: 600;
          color: #342727;
          line-height: 1.2;
        }

        .trust-sub {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          color: #806D68;
          letter-spacing: 0.02em;
        }

        .trust-bar-separator {
          width: 1px;
          height: 32px;
          background-color: #E8D8D0;
          opacity: 0.8;
        }

        /* 4. SHOP THE COLLECTIONS SECTION */
        .shop-the-collections-section {
          padding-top: 0;
          padding-bottom: clamp(48px, 6vw, 68px);
        }

        .category-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .section-eyebrow {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #B76E79;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .section-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.1rem, 3.4vw, 3.1rem);
          font-weight: 500;
          color: #342727;
          line-height: 1.12;
          margin: 0 0 6px 0;
        }

        .section-description {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.90rem;
          color: #806D68;
          margin: 0;
          max-width: 560px;
          line-height: 1.55;
        }

        .category-header-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .view-all-text-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #B76E79;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.86rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .view-all-text-link:hover {
          color: #9C5762;
        }

        .carousel-nav-arrows {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .arrow-nav-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #E8D8D0;
          background: #FFFFFF;
          color: #342727;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(59, 43, 43, 0.05);
        }

        .arrow-nav-btn:hover {
          background-color: #B76E79;
          border-color: #B76E79;
          color: #FFFFFF;
        }

        .categories-carousel-outer {
          position: relative;
          width: 100%;
        }

        .categories-horizontal-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 4px 0 16px 0;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .categories-horizontal-track::-webkit-scrollbar {
          display: none;
        }

        :global(.category-editorial-card) {
          flex: 0 0 calc((100% - 3 * 16px) / 4.35);
          min-width: 250px;
          max-width: 310px;
          height: clamp(340px, 30vw, 395px);
          scroll-snap-align: start;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          background: #FFFFFF;
          border: 1px solid #E7E1D8;
          box-shadow: 0 6px 20px rgba(59, 43, 43, 0.05);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, border-color 0.28s ease;
        }

        :global(.category-editorial-card:hover) {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(183, 110, 121, 0.16);
          border-color: #B76E79;
        }

        .category-card-image-box {
          position: relative;
          width: 100%;
          flex: 1;
          background-color: #FFE3D3;
          overflow: hidden;
        }

        :global(.category-card-img) {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        :global(.category-editorial-card:hover) :global(.category-card-img) {
          transform: scale(1.035);
        }

        .category-card-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(59, 43, 43, 0.2) 100%);
        }

        .category-card-info-panel {
          padding: 13px 18px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(232, 216, 208, 0.65);
        }

        .category-card-name {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #342727;
          margin: 0 0 2px 0;
          line-height: 1.15;
        }

        .category-card-tagline {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          color: #806D68;
          margin: 0;
        }

        .category-card-circle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #B76E79;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        :global(.category-editorial-card:hover) .category-card-circle-btn {
          background-color: #9C5762;
          transform: translateX(2px);
        }

        .carousel-progress-dots {
          display: none;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 14px;
        }

        .progress-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #D9C8BE;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .progress-dot.active {
          width: 20px;
          border-radius: 999px;
          background-color: #B76E79;
        }

        /* 5. COLLECTIONS FOR EVERY OCCASION */
        .collections-occasion-section {
          padding-bottom: clamp(48px, 6vw, 68px);
        }

        .occasions-banner-layout {
          display: grid;
          grid-template-columns: 270px 1fr;
          gap: 28px;
          align-items: center;
          background-color: #F8E9E5;
          border-radius: 28px;
          padding: clamp(24px, 3.6vw, 36px);
          border: 1px solid rgba(232, 216, 208, 0.85);
          box-shadow: 0 8px 30px rgba(59, 43, 43, 0.04);
        }

        .occasion-story-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .occasion-main-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.8rem, 2.7vw, 2.4rem);
          font-weight: 500;
          color: #342727;
          line-height: 1.15;
          margin: 0 0 10px 0;
        }

        .occasion-main-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.88rem;
          color: #806D68;
          line-height: 1.55;
          margin: 0 0 20px 0;
        }

        .occasion-primary-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #B76E79;
          color: #FFFFFF;
          padding: 10px 22px;
          border-radius: 999px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          text-decoration: none;
          align-self: flex-start;
          transition: background-color 0.2s ease, transform 0.2s ease;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.28);
        }

        .occasion-primary-cta:hover {
          background-color: #9C5762;
          transform: translateY(-1px);
        }

        .occasions-track-wrap {
          overflow: hidden;
          width: 100%;
        }

        .occasions-horizontal-track {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        :global(.occasion-card) {
          height: 250px;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.7);
          box-shadow: 0 6px 16px rgba(59, 43, 43, 0.05);
          text-decoration: none;
          display: block;
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }

        :global(.occasion-card:hover) {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(183, 110, 121, 0.18);
        }

        .occasion-card-image-box {
          position: absolute;
          inset: 0;
        }

        :global(.occasion-card-img) {
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        :global(.occasion-card:hover) :global(.occasion-card-img) {
          transform: scale(1.045);
        }

        .occasion-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(52, 39, 39, 0.75) 100%);
        }

        .occasion-wishlist-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(8px);
          color: #342727;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .occasion-card-glass-footer {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 14px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.95);
        }

        .occasion-card-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.02rem;
          font-weight: 600;
          color: #342727;
          margin: 0;
          line-height: 1.15;
        }

        .occasion-card-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.67rem;
          color: #806D68;
          margin: 0;
        }

        .occasion-card-arrow {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #B76E79;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* 6. BEST SELLERS SECTION */
        .collections-bestsellers-section {
          padding-bottom: clamp(48px, 6vw, 68px);
        }

        .bestsellers-horizontal-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 4px 0 16px 0;
          scrollbar-width: none;
        }

        .bestsellers-horizontal-track::-webkit-scrollbar {
          display: none;
        }

        .bestseller-item-wrap {
          flex: 0 0 calc((100% - 3 * 16px) / 4.3);
          min-width: 240px;
          max-width: 290px;
          scroll-snap-align: start;
        }

        /* 7. EDITORIAL HERITAGE STORY */
        .collections-editorial-story {
          padding-bottom: clamp(48px, 6vw, 68px);
        }

        .story-card-wrapper {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E8D8D0;
          border-radius: 28px;
          padding: clamp(28px, 4vw, 44px);
          box-shadow: 0 8px 30px rgba(59, 43, 43, 0.04);
        }

        .story-content-col {
          max-width: 520px;
        }

        .story-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 3.2vw, 2.8rem);
          font-weight: 500;
          color: #342727;
          line-height: 1.15;
          margin: 0 0 14px 0;
        }

        .story-paragraph {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.92rem;
          color: #806D68;
          line-height: 1.65;
          margin: 0 0 24px 0;
        }

        .story-badges-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .story-badge {
          display: flex;
          flex-direction: column;
        }

        .badge-value {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #B76E79;
          line-height: 1.2;
        }

        .badge-label {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          color: #806D68;
          letter-spacing: 0.02em;
        }

        .story-badge-divider {
          width: 1px;
          height: 30px;
          background-color: #E8D8D0;
        }

        .story-text-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #B76E79;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .story-text-cta:hover {
          color: #9C5762;
        }

        .story-image-col {
          position: relative;
        }

        .story-image-box {
          position: relative;
          width: 100%;
          height: clamp(280px, 32vw, 360px);
          border-radius: 22px;
          overflow: hidden;
          background-color: #FFE3D3;
          border: 1px solid rgba(232, 216, 208, 0.8);
        }

        :global(.story-artisan-img) {
          object-fit: cover;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1024px) {
          .collections-hero-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .hero-content-col {
            max-width: 100%;
          }
          .hero-image-wrapper {
            height: clamp(340px, 50vw, 420px);
          }
          .occasions-banner-layout {
            grid-template-columns: 1fr;
            gap: 22px;
          }
          .occasions-horizontal-track {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 12px;
            padding-bottom: 8px;
          }
          :global(.occasion-card) {
            flex: 0 0 190px;
          }
          .story-card-wrapper {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .carousel-progress-dots {
            display: flex;
          }
          :global(.category-editorial-card) {
            flex: 0 0 250px;
          }
          .bestseller-item-wrap {
            flex: 0 0 250px;
          }
        }

        @media (max-width: 768px) {
          .collections-hero-grid {
            display: flex;
            flex-direction: column-reverse;
          }
          .hero-image-wrapper {
            width: 100%;
            height: 380px;
            border-radius: 22px;
          }
          .hero-title {
            font-size: clamp(2.2rem, 7.5vw, 2.8rem);
          }
          .hero-trust-bar {
            flex-direction: column;
            gap: 14px;
            align-items: flex-start;
            padding: 16px 20px;
            margin-top: 22px;
            margin-bottom: 34px;
          }
          .trust-bar-separator {
            display: none;
          }
          .hero-trust-item {
            width: 100%;
          }
          :global(.category-editorial-card) {
            flex: 0 0 84vw !important;
            height: 370px !important;
            min-width: unset;
          }
          .carousel-progress-dots {
            display: flex;
          }
          .occasions-horizontal-track {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 12px;
            padding-bottom: 8px;
          }
          :global(.occasion-card) {
            flex: 0 0 75vw !important;
            height: 240px !important;
          }
          .bestseller-item-wrap {
            flex: 0 0 78vw !important;
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}
