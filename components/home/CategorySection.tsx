'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function CategorySection() {
  return (
    <section
      className="asymmetric-collections-section"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#FFF9F3',
        backgroundImage: "url('/images/collections/collections-asymmetric-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 45%',
        backgroundRepeat: 'no-repeat',
        padding: 'clamp(76px, 8vw, 120px) 0',
        overflow: 'hidden',
      }}
    >
      {/* Soft, Continuous Editorial Atmosphere Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(255, 249, 243, 0.96) 0%, rgba(255, 249, 243, 0.88) 32%, rgba(255, 249, 243, 0.58) 64%, rgba(255, 249, 243, 0.84) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Subtle Floating Petals (Editorial Atmosphere) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <div
          className="editorial-floating-petal petal-top-left"
          style={{
            position: 'absolute',
            top: '16%',
            left: '30%',
            width: '20px',
            height: '26px',
            borderRadius: '50% 0 50% 50%',
            transform: 'rotate(-25deg)',
            background: 'linear-gradient(135deg, rgba(246, 214, 217, 0.92) 0%, rgba(255, 240, 242, 0.95) 100%)',
            boxShadow: '0 2px 8px rgba(183, 110, 121, 0.15)',
            opacity: 0.82,
          }}
        />
        <div
          className="editorial-floating-petal petal-bottom-mid"
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '26%',
            width: '18px',
            height: '24px',
            borderRadius: '0 50% 50% 50%',
            transform: 'rotate(35deg)',
            background: 'linear-gradient(135deg, rgba(255, 227, 211, 0.92) 0%, rgba(246, 214, 217, 0.88) 100%)',
            boxShadow: '0 2px 6px rgba(183, 110, 121, 0.12)',
            opacity: 0.78,
          }}
        />
        <div
          className="editorial-floating-petal petal-right-bot"
          style={{
            position: 'absolute',
            bottom: '18%',
            right: '7%',
            width: '16px',
            height: '22px',
            borderRadius: '50% 50% 0 50%',
            transform: 'rotate(20deg)',
            background: 'linear-gradient(135deg, rgba(246, 214, 217, 0.9) 0%, rgba(255, 240, 242, 0.85) 100%)',
            boxShadow: '0 2px 8px rgba(183, 110, 121, 0.12)',
            opacity: 0.76,
          }}
        />
      </div>

      {/* Decorative Hand-Drawn Floral Line-Art Watermark - Bottom Left */}
      <svg
        className="corner-botanical-bottom"
        width="260"
        height="260"
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: '-15px',
          left: '-15px',
          zIndex: 2,
          opacity: 0.42,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <path
          d="M0 260 C60 200 100 160 160 120 C180 106 210 88 240 68"
          stroke="#B76E79"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M20 260 C70 180 120 130 190 85"
          stroke="#B76E79"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        <path
          d="M80 170 C70 152 85 136 102 144 C108 158 96 175 80 170Z"
          fill="rgba(246, 214, 217, 0.22)"
          stroke="#B76E79"
          strokeWidth="0.9"
        />
        <path
          d="M115 145 C110 128 126 114 138 122 C142 136 130 152 115 145Z"
          fill="rgba(246, 214, 217, 0.22)"
          stroke="#B76E79"
          strokeWidth="0.9"
        />
        <circle cx="95" cy="155" r="3" fill="#D9B98A" opacity="0.65" />
        <circle cx="128" cy="132" r="3" fill="#D9B98A" opacity="0.65" />
      </svg>

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 3.5rem)',
        }}
      >
        <div className="collections-editorial-layout">
          {/* Left Column: Editorial Story Copy (32–35% width) */}
          <div className="collections-story-col">
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.24em',
                  color: '#B76E79',
                  textTransform: 'uppercase',
                }}
              >
                OUR COLLECTIONS
              </span>
              <span
                style={{
                  width: '36px',
                  height: '1px',
                  backgroundColor: '#B76E79',
                  opacity: 0.55,
                  display: 'inline-block',
                }}
              />
            </div>

            {/* Main Editorial Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(2.7rem, 4.4vw, 4rem)',
                fontWeight: 400,
                lineHeight: 1.06,
                color: '#3B2B2B',
                marginBottom: '22px',
                letterSpacing: '-0.015em',
              }}
            >
              Designed<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>for Every Story</span>
            </h2>

            {/* Supporting Description */}
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: 'clamp(0.96rem, 1.1vw, 1.04rem)',
                lineHeight: 1.72,
                color: '#6F5A58',
                marginBottom: '34px',
                maxWidth: '410px',
              }}
            >
              From everyday essentials to extraordinary pieces, explore jewellery that celebrates every moment.
            </p>

            {/* Primary Action Button */}
            <Link
              href="/collections"
              className="collection-explore-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#B76E79',
                color: '#FFFFFF',
                padding: '14px 34px',
                borderRadius: '999px',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.82rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: '0 6px 20px rgba(183, 110, 121, 0.3)',
              }}
            >
              <span>Explore All Collections</span>
              <ArrowRight size={15} className="explore-arrow-icon" />
            </Link>
          </div>

          {/* Right Column: Layered Asymmetric Jewellery Collage */}
          <div className="editorial-collage-stage">
            {/* 1. NECKLACES (Tallest / Primary / Left) */}
            <div className="collage-node node-necklace">
              <Link href="/collections/necklaces" className="node-link-wrap">
                {/* Vertical Arched Image Frame */}
                <div className="arched-frame necklace-arch">
                  <Image
                    src="/images/collections/necklace-editorial.jpg"
                    alt="Handcrafted teardrop diamond halo sterling silver necklace"
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 38vw, 360px"
                    className="collage-jewellery-img"
                  />
                  <div className="arch-champagne-outline" />
                </div>

                {/* Overlapping Translucent Glass Information Panel */}
                <div className="overlapping-curved-panel panel-cream">
                  {/* Botanical Art Illustration */}
                  <svg
                    className="panel-botanical-art"
                    width="30"
                    height="30"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M18 32 C18 22 14 14 8 8" stroke="#B76E79" strokeWidth="1.1" strokeLinecap="round" />
                    <path d="M18 22 C22 18 26 14 28 8" stroke="#B76E79" strokeWidth="0.9" strokeLinecap="round" />
                    <path d="M18 16 C14 12 11 10 7 10 C7 14 11 16 16 17" fill="rgba(183, 110, 121, 0.18)" stroke="#B76E79" strokeWidth="0.9" />
                    <path d="M19 12 C23 8 27 7 28 10 C27 13 23 14 19 13" fill="rgba(217, 185, 138, 0.28)" stroke="#B76E79" strokeWidth="0.9" />
                    <circle cx="8" cy="8" r="1.5" fill="#D9B98A" />
                  </svg>

                  <div className="panel-copy">
                    <h3 className="panel-title">Necklaces</h3>
                    <p className="panel-desc">Timeless designs for every occasion.</p>
                    <span className="panel-cta">
                      <span>SHOP NOW</span>
                      <ArrowRight size={11} className="cta-arrow" />
                    </span>
                  </div>

                  <div className="panel-arrow-btn">
                    <ArrowRight size={14} className="arrow-btn-icon" />
                  </div>
                </div>
              </Link>
            </div>

            {/* 2. RINGS (Right / Upper / Elevated Visual) */}
            <div className="collage-node node-rings">
              <Link href="/collections/rings" className="node-link-wrap">
                {/* Elevated Arched Image Frame */}
                <div className="arched-frame rings-arch">
                  <Image
                    src="/images/collections/rings-editorial.jpg"
                    alt="Sparkling diamond solitaire halo and leaf eternity sterling silver rings"
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 38vw, 360px"
                    className="collage-jewellery-img"
                  />
                  <div className="arch-champagne-outline" />
                </div>

                {/* Overlapping Translucent Glass Information Panel */}
                <div className="overlapping-curved-panel panel-pistachio">
                  {/* Botanical Art Illustration */}
                  <svg
                    className="panel-botanical-art"
                    width="30"
                    height="30"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M8 30 C14 24 20 18 28 10" stroke="#6F5A58" strokeWidth="1.1" strokeLinecap="round" />
                    <path d="M14 24 C10 20 11 16 16 17 C17 21 15 23 14 24Z" fill="rgba(228, 235, 217, 0.6)" stroke="#6F5A58" strokeWidth="0.9" />
                    <path d="M21 17 C19 12 22 9 26 11 C26 15 23 16 21 17Z" fill="rgba(228, 235, 217, 0.6)" stroke="#6F5A58" strokeWidth="0.9" />
                    <circle cx="28" cy="10" r="1.5" fill="#D9B98A" />
                  </svg>

                  <div className="panel-copy">
                    <h3 className="panel-title">Rings</h3>
                    <p className="panel-desc">Everyday elegance with a touch of brilliance.</p>
                    <span className="panel-cta">
                      <span>SHOP NOW</span>
                      <ArrowRight size={11} className="cta-arrow" />
                    </span>
                  </div>

                  <div className="panel-arrow-btn">
                    <ArrowRight size={14} className="arrow-btn-icon" />
                  </div>
                </div>
              </Link>
            </div>

            {/* 3. EARRINGS (Center / Lower Foreground / Overlapping Layer) */}
            <div className="collage-node node-earrings">
              <Link href="/collections/earrings" className="node-link-wrap">
                {/* Rounded / Arched Image Frame */}
                <div className="arched-frame earrings-arch">
                  <Image
                    src="/images/collections/earrings-editorial.jpg"
                    alt="Floral cluster diamond sterling silver stud earrings"
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 36vw, 340px"
                    className="collage-jewellery-img"
                  />
                  <div className="arch-champagne-outline" />
                </div>

                {/* Overlapping Translucent Glass Information Panel */}
                <div className="overlapping-curved-panel panel-rose">
                  {/* Botanical Art Illustration */}
                  <svg
                    className="panel-botanical-art"
                    width="30"
                    height="30"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M18 32 V20" stroke="#B76E79" strokeWidth="1.1" strokeLinecap="round" />
                    <path d="M18 20 C14 16 12 12 18 6 C24 12 22 16 18 20Z" fill="rgba(246, 214, 217, 0.4)" stroke="#B76E79" strokeWidth="0.9" />
                    <path d="M18 17 C12 15 8 18 10 24 C14 24 17 20 18 17Z" fill="rgba(183, 110, 121, 0.22)" stroke="#B76E79" strokeWidth="0.9" />
                    <path d="M18 17 C24 15 28 18 26 24 C22 24 19 20 18 17Z" fill="rgba(183, 110, 121, 0.22)" stroke="#B76E79" strokeWidth="0.9" />
                    <circle cx="18" cy="14" r="2" fill="#D9B98A" />
                  </svg>

                  <div className="panel-copy">
                    <h3 className="panel-title">Earrings</h3>
                    <p className="panel-desc">Elegant pieces to complement your style.</p>
                    <span className="panel-cta">
                      <span>SHOP NOW</span>
                      <ArrowRight size={11} className="cta-arrow" />
                    </span>
                  </div>

                  <div className="panel-arrow-btn">
                    <ArrowRight size={14} className="arrow-btn-icon" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Dedicated Mobile Horizontal Snap Carousel (Section 6: NECKLACES, EARRINGS, RINGS, BRACELETS, PENDANTS) */}
          <div className="mobile-collections-carousel">
            {[
              {
                name: 'Necklaces',
                desc: 'Elegant & timeless',
                href: '/collections/necklaces',
                image: '/images/collection-necklaces.jpg',
              },
              {
                name: 'Earrings',
                desc: 'Everyday to statement',
                href: '/collections/earrings',
                image: '/images/collection-earrings.jpg',
              },
              {
                name: 'Rings',
                desc: 'Symbols of love',
                href: '/collections/rings',
                image: '/images/collection-rings.jpg',
              },
              {
                name: 'Bracelets',
                desc: 'Modern essentials',
                href: '/collections/bracelets',
                image: '/images/occasions/everyday-elegance.jpg',
              },
              {
                name: 'Pendants',
                desc: 'Delicate charm',
                href: '/collections/pendants',
                image: '/images/why-choose/ethically-sourced-necklace.jpg',
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="mobile-category-card"
              >
                <div className="mobile-card-img-wrap">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 80vw, 320px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="mobile-card-gradient" />
                </div>
                <div className="mobile-card-glass-panel">
                  <div className="mobile-card-text">
                    <span className="mobile-card-title">{cat.name}</span>
                    <span className="mobile-card-desc">{cat.desc}</span>
                  </div>
                  <div className="mobile-card-arrow-circle">
                    <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .collection-explore-btn:hover {
          background-color: #9C5762 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(183, 110, 121, 0.42) !important;
        }
        .collection-explore-btn:hover .explore-arrow-icon {
          transform: translateX(4px);
        }
        .explore-arrow-icon {
          transition: transform 0.22s ease;
        }

        /* Floating Petal Keyframe Animations */
        @keyframes floatPetalSlow {
          0%, 100% {
            transform: translateY(0px) rotate(-25deg);
          }
          50% {
            transform: translateY(-8px) rotate(-18deg);
          }
        }
        @keyframes floatPetalMid {
          0%, 100% {
            transform: translateY(0px) rotate(35deg);
          }
          50% {
            transform: translateY(-10px) rotate(42deg);
          }
        }
        .petal-top-left {
          animation: floatPetalSlow 7s ease-in-out infinite;
        }
        .petal-bottom-mid {
          animation: floatPetalMid 8.5s ease-in-out infinite 1s;
        }
        .petal-right-bot {
          animation: floatPetalSlow 9s ease-in-out infinite 0.5s;
        }

        /* 2-Column Editorial Grid Layout */
        .collections-editorial-layout {
          display: grid;
          grid-template-columns: minmax(310px, 34%) 1fr;
          gap: clamp(32px, 4vw, 56px);
          align-items: center;
        }

        .collections-story-col {
          max-width: 440px;
        }

        /* Right Stage: Absolute Asymmetric Layered Collage */
        .editorial-collage-stage {
          position: relative;
          width: 100%;
          height: clamp(560px, 48vw, 670px);
          max-width: 950px;
          margin-left: auto;
        }

        .collage-node {
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .node-link-wrap {
          text-decoration: none;
          display: block;
          position: relative;
        }

        /* 1. Necklaces: Tallest, sits high, on left */
        .node-necklace {
          position: absolute;
          left: 0;
          top: 10px;
          width: clamp(280px, 23.5vw, 340px);
          z-index: 2;
        }
        .necklace-arch {
          height: clamp(430px, 36vw, 520px);
          border-radius: 180px 180px 32px 32px;
        }

        /* 2. Rings: Tall, sits high, on right */
        .node-rings {
          position: absolute;
          right: 0;
          top: 0px;
          width: clamp(285px, 23.5vw, 340px);
          z-index: 2;
        }
        .rings-arch {
          height: clamp(410px, 34vw, 490px);
          border-radius: 175px 175px 32px 32px;
        }

        /* 3. Earrings: Sits lower down, center pocket, overlapping both in foreground */
        .node-earrings {
          position: absolute;
          left: 46%;
          transform: translateX(-50%);
          top: clamp(140px, 11.5vw, 180px);
          width: clamp(260px, 21.5vw, 315px);
          z-index: 6;
        }
        .earrings-arch {
          height: clamp(340px, 28vw, 410px);
          border-radius: 165px 165px 32px 32px;
        }

        /* Arched Image Frames with Champagne Outlines & Glass Refraction */
        .arched-frame {
          position: relative;
          width: 100%;
          overflow: hidden;

          background: rgba(255, 255, 255, 0.08);

          border: 1px solid rgba(217, 185, 138, 0.65);

          box-shadow:
            0 20px 55px rgba(70, 45, 38, 0.14),
            0 0 30px rgba(217, 185, 138, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);

          transition:
            transform 400ms cubic-bezier(.22, 1, .36, 1),
            box-shadow 400ms ease;
        }

        /* Specular Glass Bell Glint at top of arch */
        .arched-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 42%;
          border-radius: inherit;
          background: radial-gradient(
            ellipse at top center,
            rgba(255, 255, 255, 0.35) 0%,
            rgba(255, 255, 255, 0.08) 45%,
            transparent 80%
          );
          pointer-events: none;
          z-index: 4;
        }

        .collage-jewellery-img {
          object-fit: cover;
          display: block;
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .arch-champagne-outline {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 5;
          box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 0.75),
            inset 0 -2px 6px rgba(217, 185, 138, 0.2);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.04) 25%,
            transparent 55%,
            rgba(217, 185, 138, 0.08) 100%
          );
        }

        /* =========================================
           PREMIUM FROSTED GLASS COLLECTION PANELS
           ========================================= */

        .overlapping-curved-panel {
          position: absolute;
          bottom: 12px;
          left: 10px;
          right: 10px;
          z-index: 10;

          padding: 18px 18px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;

          border-radius: 30px;

          /* REAL GLASS */
          background: rgba(255, 255, 255, 0.20);

          backdrop-filter: blur(24px) saturate(145%);
          -webkit-backdrop-filter: blur(24px) saturate(145%);

          /* Glass edge */
          border: 1px solid rgba(255, 255, 255, 0.68);

          box-shadow:
            0 18px 45px rgba(65, 40, 35, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.85),
            inset 0 -1px 0 rgba(217, 185, 138, 0.22);

          overflow: hidden;

          transition:
            transform 300ms cubic-bezier(.22, 1, .36, 1),
            background 300ms ease,
            border-color 300ms ease,
            box-shadow 300ms ease;
        }

        /* Glass reflection */
        .overlapping-curved-panel::before {
          content: "";
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.42) 0%,
              rgba(255, 255, 255, 0.12) 28%,
              transparent 52%,
              rgba(255, 255, 255, 0.10) 100%
            );

          pointer-events: none;
          z-index: 0;
        }

        /* Subtle moving glass shine on hover */
        .overlapping-curved-panel::after {
          content: "";
          position: absolute;

          top: -80%;
          left: -40%;

          width: 45%;
          height: 220%;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.28),
            transparent
          );

          transform: rotate(20deg);

          opacity: 0;
          transition: left 700ms ease, opacity 300ms ease;

          pointer-events: none;
          z-index: 1;
        }

        .collage-node:hover .overlapping-curved-panel::after {
          left: 120%;
          opacity: 1;
        }

        /* =========================================
           SOFT GLASS TINTS
           ========================================= */

        .panel-cream {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.30),
              rgba(255, 245, 238, 0.16)
            );
        }

        .panel-rose {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.30),
              rgba(246, 214, 217, 0.18)
            );
        }

        .panel-pistachio {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.30),
              rgba(228, 235, 217, 0.18)
            );
        }

        /* =========================================
           GLASS CONTENT
           ========================================= */

        .panel-botanical-art,
        .panel-copy,
        .panel-arrow-btn {
          position: relative;
          z-index: 3;
        }

        .panel-botanical-art {
          flex-shrink: 0;
          opacity: 0.85;
        }

        .panel-copy {
          flex: 1;
          text-align: left;
        }

        .panel-title {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: 1.44rem;
          font-weight: 500;
          color: #3B2B2B;
          line-height: 1.15;
          margin: 0 0 3px 0;
          letter-spacing: -0.01em;
          transition: color 300ms ease;
        }

        .panel-desc {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.74rem;
          line-height: 1.35;
          color: #4A3A3A;
          margin: 0 0 7px 0;
          font-weight: 400;
        }

        .panel-cta {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.73rem;
          font-weight: 600;
          letter-spacing: 0.09em;
          color: #8B4E57;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-transform: uppercase;
          transition: color 300ms ease;
        }

        .cta-arrow {
          transition: transform 300ms ease;
        }

        /* =========================================
           GLASS ARROW BUTTON
           ========================================= */

        .panel-arrow-btn {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;

          background: rgba(183, 110, 121, 0.68);

          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);

          border: 1px solid rgba(255, 255, 255, 0.65);
          color: white;

          box-shadow:
            0 8px 22px rgba(183, 110, 121, 0.20),
            inset 0 1px 1px rgba(255, 255, 255, 0.75);

          transition:
            transform 250ms ease,
            background 250ms ease,
            box-shadow 250ms ease;
        }

        .arrow-btn-icon {
          transition: transform 300ms ease;
        }

        /* =========================================
           HOVER
           ========================================= */

        .node-necklace:hover,
        .node-rings:hover {
          transform: translateY(-3px);
          z-index: 12 !important;
        }
        .node-earrings:hover {
          transform: translate(-50%, -3px);
          z-index: 12 !important;
        }

        .collage-node:hover .arched-frame {
          box-shadow:
            0 28px 65px rgba(70, 45, 38, 0.18),
            0 0 35px rgba(217, 185, 138, 0.20),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .collage-node:hover .collage-jewellery-img {
          transform: scale(1.03);
        }

        .collage-node:hover .overlapping-curved-panel {
          background: rgba(255, 255, 255, 0.34);
          border-color: rgba(255, 255, 255, 0.9);
          transform: translateY(-3px);
          box-shadow:
            0 22px 50px rgba(65, 40, 35, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .collage-node:hover .panel-title {
          color: #B76E79;
        }

        .collage-node:hover .panel-cta {
          color: #9C5762;
        }

        .collage-node:hover .cta-arrow {
          transform: translateX(4px);
        }

        .collage-node:hover .panel-arrow-btn {
          transform: translateX(4px);
          background: rgba(183, 110, 121, 0.88);
          box-shadow:
            0 10px 25px rgba(183, 110, 121, 0.28),
            inset 0 1px 1px rgba(255, 255, 255, 0.9);
        }

        /* Tablet Responsive (<= 1140px) */
        @media (max-width: 1140px) {
          .collections-editorial-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .collections-story-col {
            max-width: 580px;
            margin: 0 auto;
            text-align: left;
          }
          .editorial-collage-stage {
            max-width: 760px;
            margin: 0 auto;
            height: 580px;
          }
        }

        .mobile-collections-carousel {
          display: none;
        }

        /* Mobile Alternating Editorial Sequence (<= 768px) */
        @media (max-width: 768px) {
          .editorial-collage-stage {
            display: none !important;
          }
          .mobile-collections-carousel {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 14px !important;
            padding: 10px 4px 20px 4px !important;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .mobile-collections-carousel::-webkit-scrollbar {
            display: none;
          }
          :global(.mobile-category-card) {
            flex: 0 0 78vw !important;
            max-width: 310px !important;
            height: 380px !important;
            scroll-snap-align: start !important;
            border-radius: 22px !important;
            overflow: hidden !important;
            position: relative !important;
            text-decoration: none !important;
            box-shadow: 0 12px 30px rgba(59, 43, 43, 0.12) !important;
            display: block !important;
          }
          .mobile-card-img-wrap {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }
          .mobile-card-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(59, 43, 43, 0.45) 100%);
          }
          .mobile-card-glass-panel {
            position: absolute;
            bottom: 12px;
            left: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.84);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 18px;
            padding: 12px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 8px 24px rgba(59, 43, 43, 0.10);
          }
          .mobile-card-title {
            font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
            font-size: 1.25rem;
            font-weight: 600;
            color: #342727;
            display: block;
            line-height: 1.15;
          }
          .mobile-card-desc {
            font-family: var(--font-ui), "Jost", sans-serif;
            font-size: 0.74rem;
            color: #806D68;
            display: block;
            margin-top: 2px;
          }
          .mobile-card-arrow-circle {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #B76E79;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(183, 110, 121, 0.35);
          }

          .corner-botanical-bottom {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .editorial-floating-petal {
            animation: none !important;
          }
          .collage-node {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
