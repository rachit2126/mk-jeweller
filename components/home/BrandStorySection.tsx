'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface WhyFeature {
  id: string;
  title: string;
  descLines: [string, string];
  image: string;
  alt: string;
  icon: React.ReactNode;
}

const WHY_FEATURES: WhyFeature[] = [
  {
    id: 'premium-quality',
    title: 'Premium Quality',
    descLines: ['Crafted to perfection', 'in 925 sterling silver.'],
    image: '/images/why-choose/premium-quality-ring.jpg',
    alt: 'Close-up of premium 925 sterling silver ring on travertine stone with baby’s-breath',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
        <path d="M10.5 9 7 3" />
        <path d="M13.5 9 17 3" />
        <path d="M2 9h20" />
        <path d="M7 9l5 12 5-12" />
      </svg>
    ),
  },
  {
    id: 'ethically-sourced',
    title: 'Ethically Sourced',
    descLines: ['Responsibly sourced', 'for a better tomorrow.'],
    image: '/images/why-choose/ethically-sourced-necklace.jpg',
    alt: 'Handcrafted ethically sourced silver pendant necklace on draped blush silk with delicate flowers',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    id: 'unique-designs',
    title: 'Unique Designs',
    descLines: ['Distinctive pieces', 'for every occasion.'],
    image: '/images/why-choose/unique-designs-earrings.jpg',
    alt: 'Elegant 925 silver floral cluster earrings on soft blush silk with flowers and natural light',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'made-with-love',
    title: 'Made with Love',
    descLines: ['Because you matter', 'in every moment.'],
    image: '/images/why-choose/made-with-love-packaging.jpg',
    alt: 'MK Silver Hub luxury jewellery packaging with sparkling silver bracelet on satin cushion',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
];

export default function BrandStorySection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Track active slide on mobile swipe
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.offsetWidth * 0.82 + 16;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveSlide(Math.min(Math.max(index, 0), WHY_FEATURES.length - 1));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.82 + 16;
    el.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveSlide(index);
  };

  return (
    <section className="why-editorial-section" id="why-choose-us">
      {/* Editorial Luxury Background Texture */}
      <div className="why-bg-layer" aria-hidden="true" />

      {/* Champagne Arcs & Soft Floating Petals (Editorial Atmosphere) */}
      <div className="why-decorations" aria-hidden="true">
        <div className="champagne-arc arc-left" />
        <div className="champagne-arc arc-right" />
        <div className="petal petal-top-left" />
        <div className="petal petal-top-right" />
        <div className="petal petal-bottom-center" />

        {/* Botanical Sketch Watermark - Left */}
        <svg className="botanical-sketch sketch-left" width="280" height="280" viewBox="0 0 200 200" fill="none">
          <path d="M15 185 C45 130 90 95 185 45" stroke="#B76E79" strokeWidth="0.8" strokeLinecap="round" opacity="0.32" />
          <path d="M55 140 C50 125 60 115 75 120 C80 130 70 145 55 140Z" fill="rgba(246, 214, 217, 0.25)" stroke="#B76E79" strokeWidth="0.75" opacity="0.35" />
          <path d="M115 100 C110 85 125 75 135 82 C140 92 130 105 115 100Z" fill="rgba(255, 227, 211, 0.3)" stroke="#B76E79" strokeWidth="0.75" opacity="0.35" />
          <circle cx="95" cy="110" r="2" fill="#D9B98A" opacity="0.45" />
        </svg>

        {/* Botanical Sketch Watermark - Right */}
        <svg className="botanical-sketch sketch-right" width="260" height="260" viewBox="0 0 200 200" fill="none">
          <path d="M185 185 C145 125 105 85 35 45" stroke="#B76E79" strokeWidth="0.8" strokeLinecap="round" opacity="0.28" />
          <path d="M125 130 C130 115 120 105 105 110 C100 120 110 135 125 130Z" fill="rgba(246, 214, 217, 0.22)" stroke="#B76E79" strokeWidth="0.75" opacity="0.32" />
          <circle cx="110" cy="100" r="2" fill="#D9B98A" opacity="0.45" />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        {/* Section Header */}
        <div className="why-header">
          <div className="eyebrow-wrap">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">WHY CHOOSE MK SILVER HUB</span>
            <span className="eyebrow-line" />
          </div>

          <h2 className="why-title">
            More Than <em className="why-title-italic">Just Jewellery</em>
          </h2>

          <p className="why-subtitle">
            Thoughtfully crafted. Honestly sourced. Always with you.
          </p>
        </div>

        {/* 4 Feature Display Cards */}
        <div className="why-cards-grid" ref={carouselRef}>
          {WHY_FEATURES.map((item, idx) => (
            <div key={item.id} className="why-card-wrapper" style={{ animationDelay: `${0.12 * idx}s` }}>
              <div className="why-card">
                {/* Upper Arched Image Frame */}
                <div className="image-frame">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
                    className="card-jewellery-img"
                  />
                  {/* Subtle inner champagne edge reflection */}
                  <div className="arch-inner-rim" />
                </div>

                {/* Overlapping Frosted Glass Information Panel */}
                <div className="glass-panel">
                  {/* Circular Glass Icon Badge (Overlapping Top of Panel) */}
                  <div className="icon-badge">
                    <div className="icon-inner">{item.icon}</div>
                  </div>

                  {/* Panel Botanical Side Sketches */}
                  <div className="panel-botanical botanical-left" aria-hidden="true">
                    <svg width="34" height="60" viewBox="0 0 34 60" fill="none">
                      <path d="M28 55 C22 42 16 28 8 10" stroke="#B76E79" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
                      <path d="M18 42 C12 38 10 32 14 30 C18 32 18 38 18 42Z" fill="rgba(246, 214, 217, 0.4)" stroke="#B76E79" strokeWidth="0.7" opacity="0.45" />
                      <path d="M12 24 C6 20 8 15 12 16 C15 19 14 23 12 24Z" fill="rgba(255, 227, 211, 0.4)" stroke="#B76E79" strokeWidth="0.7" opacity="0.45" />
                      <circle cx="8" cy="10" r="1.5" fill="#D9B98A" opacity="0.5" />
                    </svg>
                  </div>
                  <div className="panel-botanical botanical-right" aria-hidden="true">
                    <svg width="34" height="60" viewBox="0 0 34 60" fill="none">
                      <path d="M6 55 C12 42 18 28 26 10" stroke="#B76E79" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
                      <path d="M16 42 C22 38 24 32 20 30 C16 32 16 38 16 42Z" fill="rgba(246, 214, 217, 0.4)" stroke="#B76E79" strokeWidth="0.7" opacity="0.45" />
                      <path d="M22 24 C28 20 26 15 22 16 C19 19 20 23 22 24Z" fill="rgba(255, 227, 211, 0.4)" stroke="#B76E79" strokeWidth="0.7" opacity="0.45" />
                      <circle cx="26" cy="10" r="1.5" fill="#D9B98A" opacity="0.5" />
                    </svg>
                  </div>

                  {/* Panel Typography */}
                  <div className="panel-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-desc">
                      {item.descLines[0]}
                      <br />
                      {item.descLines[1]}
                    </p>

                    {/* Bottom Lotus Motif Divider */}
                    <div className="card-bottom-motif" aria-hidden="true">
                      <svg width="48" height="14" viewBox="0 0 48 14" fill="none">
                        <line x1="0" y1="7" x2="16" y2="7" stroke="#B76E79" strokeWidth="0.7" strokeOpacity="0.4" />
                        <path d="M24 2 C22 6 20 8 18 9 C20 10 22 11 24 12 C26 11 28 10 30 9 C28 8 26 6 24 2Z" fill="rgba(183, 110, 121, 0.22)" stroke="#B76E79" strokeWidth="0.8" />
                        <circle cx="24" cy="7" r="1.2" fill="#D9B98A" />
                        <line x1="32" y1="7" x2="48" y2="7" stroke="#B76E79" strokeWidth="0.7" strokeOpacity="0.4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Pagination Dots */}
        <div className="mobile-dots" aria-label="Carousel pagination">
          {WHY_FEATURES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`dot ${activeSlide === dotIdx ? 'active' : ''}`}
              onClick={() => scrollToSlide(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .why-editorial-section {
          position: relative;
          background-color: #FFF9F3;
          padding: clamp(84px, 8vw, 120px) 0 clamp(90px, 9vw, 130px);
          overflow: hidden;
        }

        /* Ambient Luxury Background Texture */
        .why-bg-layer {
          position: absolute;
          inset: 0;
          background-color: #FFF9F3;
          background-image:
            radial-gradient(ellipse at 50% 20%, rgba(255, 227, 211, 0.55) 0%, rgba(246, 214, 217, 0.25) 45%, rgba(255, 249, 243, 0) 80%),
            radial-gradient(circle at 10% 80%, rgba(255, 238, 230, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(246, 214, 217, 0.45) 0%, transparent 50%),
            url('/images/collections/collections-asymmetric-bg.jpg');
          background-size: cover;
          background-position: center;
          opacity: 0.24;
          pointer-events: none;
          z-index: 1;
        }

        /* Champagne Arcs & Floating Petals */
        .why-decorations {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .champagne-arc {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(217, 185, 138, 0.35);
          pointer-events: none;
        }
        .arc-left {
          width: 580px;
          height: 580px;
          top: -120px;
          left: -180px;
          opacity: 0.5;
        }
        .arc-right {
          width: 620px;
          height: 620px;
          bottom: -160px;
          right: -200px;
          opacity: 0.45;
        }

        .botanical-sketch {
          position: absolute;
          pointer-events: none;
        }
        .sketch-left {
          top: 6%;
          left: -20px;
        }
        .sketch-right {
          bottom: 4%;
          right: -10px;
        }

        @keyframes petalFloatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(-18deg);
          }
          50% {
            transform: translateY(-10px) rotate(-10deg);
          }
        }
        @keyframes petalFloatAlt {
          0%, 100% {
            transform: translateY(0px) rotate(25deg);
          }
          50% {
            transform: translateY(-12px) rotate(32deg);
          }
        }

        .petal {
          position: absolute;
          pointer-events: none;
        }
        .petal-top-left {
          top: 10%;
          left: 14%;
          width: 22px;
          height: 28px;
          border-radius: 50% 0 50% 50%;
          background: linear-gradient(135deg, rgba(246, 214, 217, 0.9) 0%, rgba(255, 240, 242, 0.95) 100%);
          box-shadow: 0 3px 8px rgba(183, 110, 121, 0.15);
          opacity: 0.85;
          animation: petalFloatSlow 7s ease-in-out infinite;
        }
        .petal-top-right {
          top: 14%;
          right: 15%;
          width: 18px;
          height: 24px;
          border-radius: 0 50% 50% 50%;
          background: linear-gradient(135deg, rgba(255, 227, 211, 0.9) 0%, rgba(246, 214, 217, 0.85) 100%);
          box-shadow: 0 3px 8px rgba(183, 110, 121, 0.12);
          opacity: 0.8;
          animation: petalFloatAlt 8.5s ease-in-out infinite 1s;
        }
        .petal-bottom-center {
          bottom: 8%;
          left: 50%;
          width: 20px;
          height: 26px;
          border-radius: 50% 50% 0 50%;
          background: linear-gradient(135deg, rgba(246, 214, 217, 0.88) 0%, rgba(255, 240, 242, 0.9) 100%);
          box-shadow: 0 3px 8px rgba(183, 110, 121, 0.12);
          opacity: 0.75;
          animation: petalFloatSlow 9s ease-in-out infinite 0.5s;
        }

        /* Header Styling */
        .why-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto clamp(42px, 5.5vw, 68px);
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

        .eyebrow-wrap {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .eyebrow-line {
          width: 36px;
          height: 1px;
          background-color: #B76E79;
          opacity: 0.55;
          display: inline-block;
        }

        .eyebrow-text {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          color: #B76E79;
          text-transform: uppercase;
        }

        .why-title {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(42px, 4.8vw, 64px);
          font-weight: 400;
          color: #3B2B2B;
          line-height: 1.08;
          margin: 0 0 14px 0;
          letter-spacing: -0.015em;
        }

        .why-title-italic {
          font-style: italic;
          color: #B76E79;
          font-weight: 400;
        }

        .why-subtitle {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: clamp(15px, 1.2vw, 17px);
          color: #6F5A58;
          margin: 0;
          line-height: 1.6;
          font-weight: 400;
        }

        /* 4 Feature Cards Layout */
        .why-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(18px, 2.2vw, 30px);
          max-width: 1420px;
          margin: 0 auto;
        }

        .why-card-wrapper {
          animation: cardEntry 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardEntry {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .why-card {
          position: relative;
          height: 520px;
          display: flex;
          flex-direction: column;
          transition: transform 600ms cubic-bezier(.22, 1, .36, 1);
        }

        .why-card:hover {
          transform: translateY(-8px);
        }

        /* Upper Arched Image Frame */
        .image-frame {
          position: relative;
          width: 100%;
          height: 380px;
          overflow: hidden;
          border-radius: 110px 110px 24px 24px;
          border: 1.5px solid rgba(217, 185, 138, 0.75);
          box-shadow: 0 20px 50px rgba(65, 40, 35, 0.12);
          background-color: #FFE3D3;
          transition: all 450ms cubic-bezier(.22, 1, .36, 1);
        }

        .arch-inner-rim {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 3;
          box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.9),
            inset 0 -2px 6px rgba(217, 185, 138, 0.25);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.05) 25%,
            transparent 60%,
            rgba(217, 185, 138, 0.12) 100%
          );
        }

        :global(.card-jewellery-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 700ms cubic-bezier(.22, 1, .36, 1) !important;
        }

        .why-card:hover :global(.card-jewellery-img) {
          transform: scale(1.045) !important;
        }

        /* FROSTED GLASS INFORMATION PANEL */
        .glass-panel {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 12px;
          padding: 38px 18px 20px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.68) 0%,
            rgba(255, 255, 255, 0.44) 100%
          );
          backdrop-filter: blur(22px) saturate(145%);
          -webkit-backdrop-filter: blur(22px) saturate(145%);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          border-radius: 28px;
          box-shadow:
            0 18px 45px rgba(80, 50, 45, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.92);
          z-index: 5;
          text-align: center;
          transition:
            transform 400ms cubic-bezier(.22, 1, .36, 1),
            background 300ms ease,
            border-color 300ms ease,
            box-shadow 300ms ease;
        }

        /* Subtle diagonal specular sheen */
        .glass-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.12) 35%,
            transparent 55%,
            rgba(255, 255, 255, 0.1) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .why-card:hover .glass-panel {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.78);
          border-color: rgba(255, 255, 255, 1);
          box-shadow:
            0 24px 55px rgba(80, 50, 45, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        }

        /* Circular Glass Icon Badge (Overlapping Top) */
        .icon-badge {
          position: absolute;
          top: -31px;
          left: 50%;
          transform: translateX(-50%);
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 22px rgba(65, 40, 35, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 6;
          transition: transform 400ms cubic-bezier(.22, 1, .36, 1), background 300ms ease;
        }

        .why-card:hover .icon-badge {
          transform: translateX(-50%) scale(1.08);
          background: rgba(255, 255, 255, 0.95);
        }

        .icon-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #B76E79;
          transition: transform 300ms ease;
        }

        /* Botanical Side Accents on Glass Panel */
        .panel-botanical {
          position: absolute;
          bottom: 12px;
          pointer-events: none;
          z-index: 2;
        }
        .botanical-left {
          left: 6px;
        }
        .botanical-right {
          right: 6px;
        }

        .panel-content {
          position: relative;
          z-index: 3;
        }

        .card-title {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: 24px;
          font-weight: 600;
          color: #3B2B2B;
          margin: 0 0 6px 0;
          line-height: 1.15;
          letter-spacing: -0.01em;
          transition: color 300ms ease;
        }

        .why-card:hover .card-title {
          color: #B76E79;
        }

        .card-desc {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 13.5px;
          color: #6F5A58;
          line-height: 1.45;
          margin: 0 0 10px 0;
          font-weight: 400;
        }

        .card-bottom-motif {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
          margin-top: 6px;
        }

        /* Mobile Swipe Pagination Dots */
        .mobile-dots {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E8D8D0;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          width: 24px;
          border-radius: 999px;
          background: #B76E79;
        }

        /* Tablet Responsive (769px - 1080px): 2 x 2 Grid */
        @media (max-width: 1080px) and (min-width: 769px) {
          .why-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px;
            max-width: 740px;
          }
          .why-card {
            height: 500px;
          }
          .image-frame {
            height: 360px;
          }
        }

        /* Mobile Viewport (<= 768px): Vertical Stacked Premium Cards (Section 11) */
        @media (max-width: 768px) {
          .why-editorial-section {
            padding: 50px 0 65px;
          }

          .why-cards-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 28px !important;
            max-width: 350px !important;
            margin: 0 auto !important;
            padding: 8px 12px !important;
          }

          .why-card-wrapper {
            width: 100% !important;
            max-width: 100% !important;
          }

          .why-card {
            height: 440px !important;
          }

          .image-frame {
            height: 310px !important;
            border-radius: 95px 95px 22px 22px !important;
          }

          .glass-panel {
            left: 8px !important;
            right: 8px !important;
            bottom: 10px !important;
            padding: 34px 14px 16px !important;
            border-radius: 24px !important;
          }

          .card-title {
            font-size: 22px !important;
          }

          .card-desc {
            font-size: 13.5px !important;
          }

          .mobile-dots {
            display: none !important;
          }

          .botanical-sketch {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .petal, .why-header, .why-card-wrapper, .why-card, .glass-panel, .icon-badge {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
