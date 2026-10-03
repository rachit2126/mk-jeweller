'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  sortOrder?: number;
  productCount?: number;
}

interface HomepageSectionConfig {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
}

export default function CategorySection() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [homepageConfig, setHomepageConfig] = useState<HomepageSectionConfig>({
    enabled: true,
    title: 'SHOP BY CATEGORY',
    subtitle: 'Distinctive silver pieces for every expression.',
  });
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(2); // Start centered (e.g. Rings / Bracelets)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1280);
  const [windowWidth, setWindowWidth] = useState(1440);

  // Drag / swipe states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // 1. Fetch categories and CMS config from MongoDB
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetch('/api/categories').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/homepage').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([catData, homeData]) => {
        if (!isMounted) return;

        if (catData?.categories && Array.isArray(catData.categories)) {
          setCategories(catData.categories);
          if (catData.categories.length > 0) {
            // Center around index 2 or 3
            const mid = Math.min(3, Math.floor(catData.categories.length / 2));
            setActiveIndex(mid);
          }
        }

        if (homeData?.sections && Array.isArray(homeData.sections)) {
          const sec = homeData.sections.find((s: any) => s.type === 'categories');
          if (sec) {
            setHomepageConfig({
              enabled: sec.enabled !== false,
              title: sec.title?.trim() || 'SHOP BY CATEGORY',
              subtitle: sec.subtitle?.trim() || 'Distinctive silver pieces for every expression.',
            });
          }
        }
      })
      .catch((err) => {
        console.error('[CategorySection] Failed to load data:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Measure viewport and stage container dimensions
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (stageRef.current) {
        setContainerWidth(stageRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Viewport entrance animation (triggers ONCE)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    // Fallback timer to ensure visibility even if observer triggers late
    const timer = setTimeout(() => {
      setInView(true);
      setHasAnimated(true);
    }, 800);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // 4. Navigation controls
  const totalCards = categories.length;

  const handlePrev = useCallback(() => {
    if (totalCards === 0) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalCards - 1));
  }, [totalCards]);

  const handleNext = useCallback(() => {
    if (totalCards === 0) return;
    setActiveIndex((prev) => (prev < totalCards - 1 ? prev + 1 : 0));
  }, [totalCards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Drag / touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 45;
    if (dragOffset > threshold) {
      handlePrev();
    } else if (dragOffset < -threshold) {
      handleNext();
    }
    setDragOffset(0);
  };

  const handleCardClick = (e: React.MouseEvent, index: number) => {
    if (isDragging && Math.abs(dragOffset) > 10) {
      e.preventDefault();
      return;
    }
    // Clicking any card brings it into center focus if not active
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (homepageConfig.enabled === false) {
    return null;
  }

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Precise sizing parameters for clean horizontal editorial presentation
  const cardWidth = isMobile ? (windowWidth < 360 ? 205 : 240) : (isTablet ? 212 : 236);
  const cardGap = isMobile ? (windowWidth < 360 ? 12 : 16) : (isTablet ? 18 : 24);
  const step = cardWidth + cardGap;

  // Center active card in container
  const trackTranslateX = (containerWidth / 2) - (activeIndex * step + cardWidth / 2) + dragOffset;

  return (
    <section
      ref={sectionRef}
      aria-label="Shop By Category"
      className="cat-editorial-section"
    >
      <div className="cat-editorial-inner">
        {/* Header Block with Editorial Typography & Minimal Silver Motif */}
        <header className={`cat-editorial-header ${hasAnimated ? 'has-animated' : ''}`}>
          <span className="cat-eyebrow">
            EXPLORE OUR COLLECTIONS
          </span>

          <h2 className="cat-main-title">
            {homepageConfig.title || 'SHOP BY CATEGORY'}
          </h2>

          <p className="cat-subtitle">
            {homepageConfig.subtitle || 'Distinctive silver pieces for every expression.'}
          </p>

          {/* Minimal Silver Ornamental Line & Emblem */}
          <div className="cat-silver-ornament" aria-hidden="true">
            <span className="cat-hairline" />
            <svg
              className="cat-diamond-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#A8A49C"
              strokeWidth="1.2"
            >
              <rect x="8" y="2" width="6" height="6" transform="rotate(45 8 2)" fill="#D4D0C6" stroke="#9A968D" />
            </svg>
            <span className="cat-hairline" />
          </div>
        </header>

        {/* Carousel Stage Container */}
        <div ref={stageRef} className="cat-carousel-stage">
          {/* Navigation Arrows (Desktop & Tablet) */}
          <button
            type="button"
            className="cat-nav-btn cat-nav-prev"
            onClick={handlePrev}
            aria-label="Previous categories"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            className="cat-nav-btn cat-nav-next"
            onClick={handleNext}
            aria-label="Next categories"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Horizontal Carousel Track */}
          <div
            className="cat-track-viewport"
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            <div
              className={`cat-slider-track ${hasAnimated ? 'has-animated' : ''}`}
              style={{
                transform: `translateX(${trackTranslateX}px)`,
                transition: isDragging ? 'none' : 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {loading ? (
                // Clean rectangular skeleton cards during initial data fetch
                Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="cat-editorial-card skeleton-card">
                    <div className="skeleton-image" />
                    <div className="skeleton-info">
                      <div className="skeleton-text" />
                      <div className="skeleton-subtext" />
                    </div>
                  </div>
                ))
              ) : (
                categories.map((cat, idx) => {
                  const isActive = idx === activeIndex;
                  const hasValidImage = Boolean(cat.image && !failedImages[cat.id]);

                  return (
                    <div
                      key={cat.id || cat.slug}
                      className={`cat-editorial-card ${isActive ? 'is-active' : ''}`}
                      onClick={(e) => handleCardClick(e, idx)}
                      style={{
                        transitionDelay: hasAnimated ? '0ms' : `${idx * 60}ms`,
                      }}
                    >
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="cat-card-link"
                        aria-label={`Explore ${cat.name} Collection`}
                      >
                        {/* 4:5 Rectangular Editorial Photography Frame */}
                        <div className="cat-image-frame">
                          {hasValidImage ? (
                            <Image
                              src={cat.image!}
                              alt={`Authentic 925 oxidised silver ${cat.name} collection`}
                              fill
                              sizes="(max-width: 768px) 260px, 240px"
                              className="cat-editorial-img"
                              onError={() => setFailedImages((prev) => ({ ...prev, [cat.id]: true }))}
                              priority={idx <= 4}
                            />
                          ) : (
                            <div className="cat-fallback-frame">
                              <span className="cat-fallback-letter">
                                {cat.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="cat-frame-overlay" />
                        </div>

                        {/* Minimalist Lower Information Area */}
                        <div className="cat-card-body">
                          <h3 className="cat-card-name">
                            {cat.name}
                          </h3>

                          {/* Subtle Editorial Underline Indicator */}
                          <span className="cat-card-underline" />

                          <div className="cat-explore-row">
                            <span className="cat-explore-text">Explore</span>
                            <span className="cat-explore-arrow">→</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Minimal Editorial Pagination Dots & Active Pill Bar */}
        <div className="cat-editorial-pagination" aria-label="Carousel pagination">
          {categories.map((c, i) => (
            <button
              key={c.id || c.slug}
              type="button"
              className={`cat-p-item ${i === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to ${c.name} collection`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        /* 1. Full-Width Independent Editorial Section */
        .cat-editorial-section {
          position: relative;
          width: 100%;
          background-color: #F7F5F0;
          padding: 52px 0 54px;
          border-top: 1px solid #EBE7DF;
          border-bottom: 1px solid #EBE7DF;
          overflow: hidden;
          box-sizing: border-box;
          user-select: none;
        }

        .cat-editorial-inner {
          position: relative;
          max-width: 1520px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* 2. Top Header Typography & Silver Minimal Motif */
        .cat-editorial-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 0 20px;
        }

        .cat-eyebrow {
          display: block;
          font-family: var(--font-ui), 'Jost', 'DM Sans', -apple-system, sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #7D7972;
          margin-bottom: 8px;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .cat-main-title {
          font-family: var(--font-heading), 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: clamp(2.15rem, 3.2vw, 2.85rem);
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #141312;
          margin: 0 0 8px;
          line-height: 1.15;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.08s, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.08s;
        }

        .cat-subtitle {
          font-family: var(--font-ui), 'Jost', 'DM Sans', -apple-system, sans-serif;
          font-size: clamp(0.92rem, 1.1vw, 1.02rem);
          font-weight: 400;
          letter-spacing: 0.02em;
          color: #69665E;
          margin: 0 0 14px;
          line-height: 1.4;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
        }

        .cat-silver-ornament {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.22s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.22s;
        }

        .cat-hairline {
          display: inline-block;
          width: 36px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #CBC7BD, transparent);
        }

        .cat-diamond-icon {
          width: 10px;
          height: 10px;
        }

        /* Entrance Animation Triggered Once */
        .cat-editorial-header.has-animated .cat-eyebrow,
        .cat-editorial-header.has-animated .cat-main-title,
        .cat-editorial-header.has-animated .cat-subtitle,
        .cat-editorial-header.has-animated .cat-silver-ornament {
          opacity: 1;
          transform: translateY(0);
        }

        /* 3. Carousel Stage & Minimalist Navigation */
        .cat-carousel-stage {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .cat-track-viewport {
          position: relative;
          width: 100%;
          overflow: visible;
          mask-image: linear-gradient(to right, transparent 0%, black 48px, black calc(100% - 48px), transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 48px, black calc(100% - 48px), transparent 100%);
        }

        .cat-slider-track {
          display: flex;
          align-items: center;
          gap: 24px;
          width: max-content;
          will-change: transform;
          padding: 12px 0 16px;
        }

        /* 4. Elegant Rectangular Editorial Cards (2-6px subtle corners) */
        .cat-editorial-card {
          flex: 0 0 236px;
          width: 236px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #ECE8DF;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(28, 24, 18, 0.05);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease, border-color 0.45s ease, opacity 0.45s ease;
          opacity: 0.92;
        }

        .cat-slider-track.has-animated .cat-editorial-card {
          /* Smooth card entrance */
        }

        /* Active Card Presentation: subtle scale(1.04), deep shadow, prominent underline */
        .cat-editorial-card.is-active {
          transform: scale(1.04);
          opacity: 1;
          z-index: 10;
          border-color: #D6D0C4;
          box-shadow: 0 16px 36px -8px rgba(32, 28, 22, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .cat-card-link {
          display: block;
          width: 100%;
          text-decoration: none;
          color: inherit;
        }

        /* 4:5 Photography Frame */
        .cat-image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background-color: #ECE8E0;
          overflow: hidden;
        }

        .cat-editorial-img {
          object-fit: cover;
          object-position: center center;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Desktop Hover: subtle zoom & title lift */
        @media (hover: hover) and (pointer: fine) {
          .cat-editorial-card:hover {
            opacity: 1;
            border-color: #141312;
            box-shadow: 0 18px 40px -8px rgba(24, 20, 16, 0.14);
          }

          .cat-editorial-card:hover .cat-editorial-img {
            transform: scale(1.04);
          }

          .cat-editorial-card:hover .cat-card-name {
            transform: translateY(-2px);
            color: #000000;
          }

          .cat-editorial-card:hover .cat-card-underline {
            width: 24px;
            background-color: #141312;
          }

          .cat-editorial-card:hover .cat-explore-arrow {
            transform: translateX(3px);
            color: #141312;
          }

          .cat-editorial-card:hover .cat-explore-text {
            color: #141312;
          }
        }

        .cat-frame-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 70%, rgba(20, 18, 16, 0.05) 100%);
          pointer-events: none;
        }

        .cat-fallback-frame {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ECE8DE;
        }

        .cat-fallback-letter {
          font-family: var(--font-heading), 'Cormorant Garamond', Georgia, serif;
          font-size: 2.8rem;
          color: #928D84;
        }

        /* Information Area */
        .cat-card-body {
          padding: 16px 14px 18px;
          text-align: center;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cat-card-name {
          font-family: var(--font-heading), 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1A1918;
          margin: 0;
          line-height: 1.25;
          transition: transform 0.35s ease, color 0.35s ease;
        }

        .cat-card-underline {
          display: block;
          height: 1.5px;
          width: 0;
          background-color: transparent;
          margin: 6px auto 7px;
          transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease;
        }

        .cat-editorial-card.is-active .cat-card-underline {
          width: 24px;
          background-color: #141312;
        }

        .cat-explore-row {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .cat-explore-text {
          font-family: var(--font-ui), 'Jost', 'DM Sans', -apple-system, sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #736F68;
          transition: color 0.3s ease;
        }

        .cat-explore-arrow {
          font-size: 0.85rem;
          line-height: 1;
          color: #736F68;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        /* 5. Minimal Circular Navigation Buttons (40-44px) */
        .cat-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #D8D5CE;
          color: #1A1918;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          z-index: 40;
          transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }

        .cat-nav-btn:hover {
          background: #141312;
          border-color: #141312;
          color: #FFFFFF;
          transform: translateY(-50%) scale(1.06);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        }

        .cat-nav-btn:active {
          transform: translateY(-50%) scale(0.96);
        }

        .cat-nav-prev {
          left: clamp(10px, 2.5vw, 36px);
        }

        .cat-nav-next {
          right: clamp(10px, 2.5vw, 36px);
        }

        /* 6. Pagination Indicators: ● ● ● ━ ● ● ● */
        .cat-editorial-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .cat-p-item {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #D4D0C5;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.35s ease, background-color 0.35s ease;
        }

        .cat-p-item.is-active {
          width: 26px;
          height: 4px;
          border-radius: 3px;
          background-color: #141312;
        }

        .cat-p-item:hover:not(.is-active) {
          background-color: #A39F95;
        }

        /* Skeletons */
        .skeleton-card {
          width: 236px;
          height: 380px;
          opacity: 0.6;
        }

        .skeleton-image {
          width: 100%;
          aspect-ratio: 4 / 5;
          background: #E8E4DA;
          animation: skelPulse 1.4s infinite ease-in-out;
        }

        .skeleton-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .skeleton-text {
          width: 90px;
          height: 12px;
          background: #E8E4DA;
          border-radius: 2px;
          animation: skelPulse 1.4s infinite ease-in-out;
        }

        .skeleton-subtext {
          width: 50px;
          height: 8px;
          background: #E8E4DA;
          border-radius: 2px;
          animation: skelPulse 1.4s infinite ease-in-out;
        }

        @keyframes skelPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .cat-editorial-section {
            padding: 46px 0 48px;
          }
          .cat-editorial-card {
            flex: 0 0 212px;
            width: 212px;
          }
          .cat-slider-track {
            gap: 18px;
          }
        }

        @media (max-width: 768px) {
          .cat-editorial-section {
            padding: 34px 0 38px;
          }
          .cat-editorial-header {
            margin-bottom: 20px;
          }
          .cat-eyebrow {
            font-size: 0.68rem;
            letter-spacing: 0.18em;
          }
          .cat-main-title {
            font-size: clamp(1.65rem, 6.5vw, 2.1rem);
            letter-spacing: 0.06em;
          }
          .cat-subtitle {
            font-size: 0.85rem;
            margin-bottom: 10px;
          }
          .cat-track-viewport {
            mask-image: none;
            -webkit-mask-image: none;
            overflow-x: hidden;
          }
          .cat-slider-track {
            gap: 16px;
            padding: 6px 0 10px;
          }
          .cat-editorial-card {
            flex: 0 0 240px;
            width: 240px;
            opacity: 0.88;
          }
          .cat-card-body {
            padding: 12px 10px 14px;
          }
          .cat-editorial-card.is-active {
            transform: scale(1.02);
            opacity: 1;
          }
          .cat-nav-btn {
            display: none; /* Mobile touch swipe enabled */
          }
          .cat-editorial-pagination {
            margin-top: 16px;
          }
        }

        @media (max-width: 360px) {
          .cat-editorial-card {
            flex: 0 0 205px;
            width: 205px;
          }
          .cat-slider-track {
            gap: 12px;
          }
          .cat-card-name {
            font-size: 0.95rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cat-eyebrow,
          .cat-main-title,
          .cat-subtitle,
          .cat-silver-ornament,
          .cat-slider-track,
          .cat-editorial-card,
          .cat-editorial-img {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
