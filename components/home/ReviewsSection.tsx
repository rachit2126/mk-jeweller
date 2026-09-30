'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';

interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  productImage: string;
  productAlt: string;
}

const REVIEWS_DATA: TestimonialItem[] = [
  {
    id: 'priya-sharma',
    author: 'Priya Sharma',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    quote: 'The jewellery is absolutely stunning! Perfect quality and beautiful designs. The packaging was also so premium.',
    rating: 5,
    productImage: '/images/occasions/gifting-collection.jpg',
    productAlt: 'Handcrafted 925 sterling silver floral tennis bracelet in luxury presentation box',
  },
  {
    id: 'aarushi-mehta',
    author: 'Aarushi Mehta',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    quote: 'Absolutely in love with their jewellery! The quality is amazing and the designs are so elegant. Will shop again for sure!',
    rating: 5,
    productImage: '/images/collections/necklace-editorial.jpg',
    productAlt: 'Royal teardrop diamond pendant in sterling silver on blush silk',
  },
  {
    id: 'neha-kapoor',
    author: 'Neha Kapoor',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    quote: 'Beautiful collection and super fast delivery. The pieces are even more gorgeous in real life. Highly recommend MK Silver Hub!',
    rating: 5,
    productImage: '/images/collections/earrings-editorial.jpg',
    productAlt: 'Sparkling floral cluster sterling silver studs on silk',
  },
  {
    id: 'ananya-roy',
    author: 'Ananya Roy',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    quote: 'Ordered the bridal choker set for my sister’s wedding. The sparkle, polki craftsmanship and finish are truly royal!',
    rating: 5,
    productImage: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg',
    productAlt: 'Royal bridal polki silver choker set',
  },
  {
    id: 'meera-kapoor',
    author: 'Meera Kapoor',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    quote: 'Authentic 925 sterling silver with genuine BIS hallmarking. The brilliance and delicate details exceeded my expectations.',
    rating: 5,
    productImage: '/images/collections/rings-editorial.jpg',
    productAlt: 'Solitaire diamond eternity ring in 925 silver',
  },
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = REVIEWS_DATA.length;
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Autoplay (5.5s interval)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Track mobile scroll position
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.offsetWidth * 0.86 + 16;
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveMobileIndex(Math.min(Math.max(idx, 0), total - 1));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [total]);

  const scrollMobileTo = (index: number) => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.86 + 16;
    el.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveMobileIndex(index);
  };

  // Compute 3 visible cards for desktop
  const leftIndex = (currentIndex - 1 + total) % total;
  const centerIndex = currentIndex;
  const rightIndex = (currentIndex + 1) % total;

  const leftItem = REVIEWS_DATA[leftIndex];
  const centerItem = REVIEWS_DATA[centerIndex];
  const rightItem = REVIEWS_DATA[rightIndex];

  return (
    <section
      className="reviews-editorial-section"
      id="customer-reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Editorial Luxury Ambient Background */}
      <div className="reviews-bg-layer" aria-hidden="true" />

      {/* Decorative Champagne Curves & Floating Rose Petals */}
      <div className="reviews-decorations" aria-hidden="true">
        <div className="champagne-curve curve-top-left" />
        <div className="champagne-curve curve-bottom-right" />
        <div className="floating-petal petal-1" />
        <div className="floating-petal petal-2" />
        <div className="floating-petal petal-3" />

        {/* Botanical Sketch - Left */}
        <svg className="botanical-sketch sketch-left" width="280" height="280" viewBox="0 0 200 200" fill="none">
          <path d="M15 185 C45 130 90 95 185 45" stroke="#B76E79" strokeWidth="0.8" strokeLinecap="round" opacity="0.32" />
          <path d="M55 140 C50 125 60 115 75 120 C80 130 70 145 55 140Z" fill="rgba(246, 214, 217, 0.25)" stroke="#B76E79" strokeWidth="0.75" opacity="0.35" />
          <path d="M115 100 C110 85 125 75 135 82 C140 92 130 105 115 100Z" fill="rgba(255, 227, 211, 0.3)" stroke="#B76E79" strokeWidth="0.75" opacity="0.35" />
          <circle cx="95" cy="110" r="2" fill="#D9B98A" opacity="0.45" />
        </svg>

        {/* Botanical Sketch - Right */}
        <svg className="botanical-sketch sketch-right" width="260" height="260" viewBox="0 0 200 200" fill="none">
          <path d="M185 185 C145 125 105 85 35 45" stroke="#B76E79" strokeWidth="0.8" strokeLinecap="round" opacity="0.28" />
          <path d="M125 130 C130 115 120 105 105 110 C100 120 110 135 125 130Z" fill="rgba(246, 214, 217, 0.22)" stroke="#B76E79" strokeWidth="0.75" opacity="0.32" />
          <circle cx="110" cy="100" r="2" fill="#D9B98A" opacity="0.45" />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        {/* Section Header */}
        <div className="reviews-header">
          <div className="eyebrow-container">
            <span className="eyebrow-line" />
            <span className="eyebrow">CUSTOMER LOVE</span>
            <span className="eyebrow-line" />
          </div>

          <h2 className="reviews-title">
            Real Stories, <em className="reviews-title-italic">Timeless Jewellery</em>
          </h2>

          <p className="reviews-subtitle">
            Loved by thousands for our quality, designs and service.
          </p>

          {/* Lotus motif divider */}
          <div className="header-lotus-motif" aria-hidden="true">
            <svg width="48" height="14" viewBox="0 0 48 14" fill="none">
              <line x1="0" y1="7" x2="16" y2="7" stroke="#B76E79" strokeWidth="0.7" strokeOpacity="0.4" />
              <path d="M24 2 C22 6 20 8 18 9 C20 10 22 11 24 12 C26 11 28 10 30 9 C28 8 26 6 24 2Z" fill="rgba(183, 110, 121, 0.25)" stroke="#B76E79" strokeWidth="0.8" />
              <circle cx="24" cy="7" r="1.2" fill="#D9B98A" />
              <line x1="32" y1="7" x2="48" y2="7" stroke="#B76E79" strokeWidth="0.7" strokeOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Desktop 3-Card Interactive Carousel Stage */}
        <div className="desktop-slider-wrapper">
          {/* Previous Arrow Button */}
          <button
            type="button"
            className="slider-nav-btn prev-btn"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={22} className="btn-icon-left" />
          </button>

          {/* 3-Card Carousel Track */}
          <div className="slider-stage">
            {/* Left Card (Previous) */}
            <div className="review-card side-card card-left" onClick={prevSlide} role="button" tabIndex={0}>
              <CardInner item={leftItem} />
            </div>

            {/* Center Card (Hero / Active) */}
            <div className="review-card center-card">
              <CardInner item={centerItem} isHero />
            </div>

            {/* Right Card (Next) */}
            <div className="review-card side-card card-right" onClick={nextSlide} role="button" tabIndex={0}>
              <CardInner item={rightItem} />
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            className="slider-nav-btn next-btn"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <ChevronRight size={22} className="btn-icon-right" />
          </button>
        </div>

        {/* Mobile Swipe Track */}
        <div className="mobile-slider-track" ref={mobileScrollRef}>
          {REVIEWS_DATA.map((item) => (
            <div key={item.id} className="mobile-card-wrapper">
              <div className="review-card mobile-card">
                <CardInner item={item} isHero />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Controls & Pagination */}
        <div className="slider-controls-bottom">
          <button
            type="button"
            className="mobile-nav-arrow mobile-prev"
            onClick={() => scrollMobileTo(Math.max(0, activeMobileIndex - 1))}
            aria-label="Previous review"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Animated Pagination Dots */}
          <div className="pagination-dots" aria-label="Review pagination">
            {REVIEWS_DATA.map((_, dotIdx) => {
              const isActive = (currentIndex === dotIdx) || (activeMobileIndex === dotIdx);
              return (
                <button
                  key={dotIdx}
                  type="button"
                  className={`dot ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentIndex(dotIdx);
                    scrollMobileTo(dotIdx);
                  }}
                  aria-label={`Go to review ${dotIdx + 1}`}
                />
              );
            })}
          </div>

          <button
            type="button"
            className="mobile-nav-arrow mobile-next"
            onClick={() => scrollMobileTo(Math.min(total - 1, activeMobileIndex + 1))}
            aria-label="Next review"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .reviews-editorial-section {
          position: relative;
          background-color: #FFF9F3;
          padding: clamp(84px, 8.5vw, 125px) 0 clamp(90px, 9vw, 130px);
          overflow: hidden;
        }

        /* Ambient Luxury Background Texture */
        .reviews-bg-layer {
          position: absolute;
          inset: 0;
          background-color: #FFF9F3;
          background-image:
            radial-gradient(ellipse at 50% 25%, rgba(255, 227, 211, 0.6) 0%, rgba(246, 214, 217, 0.28) 45%, rgba(255, 249, 243, 0) 80%),
            radial-gradient(circle at 12% 75%, rgba(255, 238, 230, 0.55) 0%, transparent 55%),
            radial-gradient(circle at 88% 75%, rgba(246, 214, 217, 0.5) 0%, transparent 55%),
            url('/images/collections/collections-asymmetric-bg.jpg');
          background-size: cover;
          background-position: center;
          opacity: 0.28;
          pointer-events: none;
          z-index: 1;
        }

        /* Decorative Arcs & Petals */
        .reviews-decorations {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .champagne-curve {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(217, 185, 138, 0.38);
          pointer-events: none;
        }
        .curve-top-left {
          width: 580px;
          height: 580px;
          top: -140px;
          left: -160px;
          opacity: 0.5;
        }
        .curve-bottom-right {
          width: 640px;
          height: 640px;
          bottom: -180px;
          right: -180px;
          opacity: 0.45;
        }

        .botanical-sketch {
          position: absolute;
          pointer-events: none;
        }
        .sketch-left {
          top: 8%;
          left: -15px;
        }
        .sketch-right {
          bottom: 5%;
          right: -10px;
        }

        @keyframes floatGentlePetal {
          0%, 100% {
            transform: translateY(0px) rotate(-20deg);
          }
          50% {
            transform: translateY(-10px) rotate(-12deg);
          }
        }
        @keyframes floatGentlePetalAlt {
          0%, 100% {
            transform: translateY(0px) rotate(28deg);
          }
          50% {
            transform: translateY(-12px) rotate(35deg);
          }
        }

        .floating-petal {
          position: absolute;
          pointer-events: none;
        }
        .petal-1 {
          top: 12%;
          left: 18%;
          width: 24px;
          height: 30px;
          border-radius: 50% 0 50% 50%;
          background: linear-gradient(135deg, rgba(246, 214, 217, 0.92) 0%, rgba(255, 240, 242, 0.95) 100%);
          box-shadow: 0 3px 10px rgba(183, 110, 121, 0.16);
          opacity: 0.85;
          animation: floatGentlePetal 7s ease-in-out infinite;
        }
        .petal-2 {
          bottom: 12%;
          left: 16%;
          width: 19px;
          height: 25px;
          border-radius: 0 50% 50% 50%;
          background: linear-gradient(135deg, rgba(255, 227, 211, 0.92) 0%, rgba(246, 214, 217, 0.85) 100%);
          box-shadow: 0 3px 8px rgba(183, 110, 121, 0.14);
          opacity: 0.8;
          animation: floatGentlePetalAlt 8.5s ease-in-out infinite 1s;
        }
        .petal-3 {
          bottom: 15%;
          right: 14%;
          width: 22px;
          height: 28px;
          border-radius: 50% 50% 0 50%;
          background: linear-gradient(135deg, rgba(246, 214, 217, 0.9) 0%, rgba(255, 240, 242, 0.88) 100%);
          box-shadow: 0 3px 9px rgba(183, 110, 121, 0.14);
          opacity: 0.8;
          animation: floatGentlePetal 9s ease-in-out infinite 0.5s;
        }

        /* Header Styling */
        .reviews-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto clamp(42px, 5.5vw, 65px);
          animation: fadeInHeader 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fadeInHeader {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .eyebrow-container {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .eyebrow-line {
          width: 38px;
          height: 1px;
          background-color: #B76E79;
          opacity: 0.55;
          display: inline-block;
        }

        .eyebrow {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          color: #B76E79;
          text-transform: uppercase;
        }

        .reviews-title {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(42px, 4.8vw, 64px);
          font-weight: 400;
          color: #3B2B2B;
          line-height: 1.08;
          margin: 0 0 14px 0;
          letter-spacing: -0.015em;
        }

        .reviews-title-italic {
          font-style: italic;
          color: #B76E79;
          font-weight: 400;
        }

        .reviews-subtitle {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: clamp(15px, 1.2vw, 17px);
          color: #6F5A58;
          margin: 0;
          line-height: 1.6;
          font-weight: 400;
        }

        .header-lotus-motif {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
          margin-top: 14px;
        }

        /* Desktop Slider Stage */
        .desktop-slider-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 1240px;
          margin: 0 auto;
          min-height: 580px;
        }

        .slider-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(16px, 2.4vw, 36px);
          width: 100%;
        }

        /* Circular Navigation Buttons */
        .slider-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(183, 110, 121, 0.28);
          box-shadow: 0 10px 25px rgba(50, 30, 30, 0.10);
          color: #3B2B2B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .prev-btn {
          left: -10px;
        }
        .next-btn {
          right: -10px;
        }

        .slider-nav-btn:hover {
          background: #B76E79;
          color: #FFFFFF;
          border-color: #B76E79;
          transform: translateY(-50%) scale(1.06);
          box-shadow: 0 12px 28px rgba(183, 110, 121, 0.35);
        }

        .slider-nav-btn:hover :global(.btn-icon-left) {
          transform: translateX(-2px);
        }
        .slider-nav-btn:hover :global(.btn-icon-right) {
          transform: translateX(2px);
        }

        :global(.btn-icon-left), :global(.btn-icon-right) {
          transition: transform 250ms ease;
        }

        /* Review Cards (Glassmorphism & Architecture) */
        .review-card {
          border-radius: 40px 40px 28px 28px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.48) 100%
          );
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 20px 55px rgba(70, 45, 40, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95);
          overflow: hidden;
          transition: all 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Side Cards (Left / Right) */
        .side-card {
          width: clamp(290px, 24vw, 340px);
          transform: scale(0.93);
          opacity: 0.86;
          z-index: 2;
          cursor: pointer;
        }

        .side-card:hover {
          opacity: 0.96;
          transform: scale(0.95);
        }

        /* Center Card (Hero) */
        .center-card {
          width: clamp(335px, 28vw, 385px);
          transform: scale(1.03);
          opacity: 1;
          z-index: 4;
          box-shadow: 0 25px 65px rgba(70, 45, 40, 0.16), inset 0 1.5px 0 rgba(255, 255, 255, 0.98);
          border-color: rgba(255, 255, 255, 0.98);
        }

        /* Mobile Slider Track */
        .mobile-slider-track {
          display: none;
        }

        /* Slider Controls Bottom (Pagination & Mobile Nav) */
        .slider-controls-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 36px;
        }

        .mobile-nav-arrow {
          display: none;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(183, 110, 121, 0.3);
          color: #3B2B2B;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 250ms ease;
        }

        .mobile-nav-arrow:hover {
          background: #B76E79;
          color: white;
        }

        .pagination-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E8D8D0;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .dot.active {
          width: 28px;
          height: 7px;
          border-radius: 999px;
          background: #B76E79;
          box-shadow: 0 2px 8px rgba(183, 110, 121, 0.35);
        }

        /* Tablet Responsive (<= 1024px and >= 769px) */
        @media (max-width: 1024px) and (min-width: 769px) {
          .prev-btn {
            left: 5px;
          }
          .next-btn {
            right: 5px;
          }
          .side-card {
            width: 280px;
            transform: scale(0.9);
          }
          .center-card {
            width: 320px;
          }
        }

        /* Mobile Viewport (<= 768px) */
        @media (max-width: 768px) {
          .reviews-editorial-section {
            padding: 60px 0 75px;
          }

          .desktop-slider-wrapper {
            display: none;
          }

          .mobile-slider-track {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 16px;
            padding: 10px 24px 20px;
            scrollbar-width: none;
            margin: 0 -20px;
          }

          .mobile-slider-track::-webkit-scrollbar {
            display: none;
          }

          .mobile-card-wrapper {
            flex: 0 0 86%;
            max-width: 340px;
            scroll-snap-align: center;
          }

          .mobile-card {
            width: 100% !important;
            transform: none !important;
            opacity: 1 !important;
          }

          .mobile-nav-arrow {
            display: flex;
          }

          .botanical-sketch {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-petal, .reviews-header, .review-card, .slider-nav-btn {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// Reusable Testimonial Card Content Component
function CardInner({ item, isHero }: { item: TestimonialItem; isHero?: boolean }) {
  return (
    <div className={`card-content ${isHero ? 'is-hero-content' : ''}`}>
      {/* Top Header: Avatar + Star Rating */}
      <div className="card-top-row">
        <div className="avatar-wrapper">
          <Image
            src={item.avatar}
            alt={item.author}
            fill
            sizes="72px"
            className="avatar-img"
          />
        </div>

        {/* 5 Soft Champagne Stars */}
        <div className="stars-row" aria-label="5 star rating">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} size={15} fill="#D9B98A" color="#D9B98A" className="star-icon" />
          ))}
        </div>
      </div>

      {/* Quote Block */}
      <div className="quote-block">
        <span className="quote-symbol" aria-hidden="true">
          “
        </span>
        <p className="quote-text">{item.quote}</p>
      </div>

      {/* Author Name & Verified Badge */}
      <div className="author-row">
        <h4 className="author-name">
          <span>{item.author}</span>
          <span className="verified-badge" title="Verified Buyer">
            <Check size={9} strokeWidth={3} className="check-icon" />
          </span>
        </h4>
        <span className="verified-label">{item.role}</span>
      </div>

      {/* Bottom Product Image Showcase */}
      <div className="product-showcase">
        <Image
          src={item.productImage}
          alt={item.productAlt}
          fill
          sizes="(max-width: 640px) 80vw, 360px"
          className="product-img"
        />
        <div className="product-glass-sheen" />
      </div>

      <style jsx>{`
        .card-content {
          padding: 30px 24px 22px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .is-hero-content {
          padding: 34px 28px 24px;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .avatar-wrapper {
          position: relative;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          overflow: hidden;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 6px 18px rgba(65, 40, 35, 0.12);
          flex-shrink: 0;
          background-color: #FFE3D3;
        }

        :global(.avatar-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .stars-row {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        :global(.star-icon) {
          filter: drop-shadow(0 1px 2px rgba(217, 185, 138, 0.35));
        }

        .quote-block {
          position: relative;
          margin-bottom: 16px;
          flex: 1;
        }

        .quote-symbol {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: 32px;
          line-height: 0.8;
          color: #B76E79;
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .quote-text {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: 18.5px;
          font-style: italic;
          color: #3B2B2B;
          line-height: 1.45;
          margin: 0;
          font-weight: 400;
          letter-spacing: -0.01em;
          min-height: 80px;
        }

        .author-row {
          margin-bottom: 16px;
          padding-top: 10px;
          border-top: 1px solid rgba(232, 216, 208, 0.6);
        }

        .author-name {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #3B2B2B;
          margin: 0 0 2px 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .verified-badge {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #B76E79;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        :global(.check-icon) {
          stroke: #FFFFFF;
        }

        .verified-label {
          display: block;
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 12px;
          color: #765F5F;
          font-weight: 400;
        }

        /* Bottom Product Image Showcase */
        .product-showcase {
          position: relative;
          width: 100%;
          height: 165px;
          border-radius: 20px;
          overflow: hidden;
          background-color: #F8ECE4;
          border: 1px solid rgba(217, 185, 138, 0.45);
          box-shadow: 0 6px 18px rgba(65, 40, 35, 0.08);
        }

        :global(.product-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        .product-glass-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 60%,
            rgba(217, 185, 138, 0.1) 100%
          );
          pointer-events: none;
        }

        :global(.review-card:hover .product-img) {
          transform: scale(1.05) !important;
        }
      `}</style>
    </div>
  );
}
