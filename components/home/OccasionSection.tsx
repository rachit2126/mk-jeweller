'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS_DATA = [
  {
    id: 'everyday',
    titleLines: ['Everyday', 'Elegance'],
    description: 'Minimal pieces for everyday you.',
    href: '/shop?style=minimal',
    image: '/images/occasions/everyday-elegance.jpg',
    alt: 'Fine sterling silver royal sapphire teardrop earrings on cream travertine stone with green leaf',
    className: 'collection-everyday',
    botanicalSvg: (
      <svg
        className="botanical-icon"
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16 28 C16 19 12 12 6 7" stroke="#B76E79" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M16 19 C20 15 24 12 26 7" stroke="#B76E79" strokeWidth="1.0" strokeLinecap="round" />
        <path d="M16 14 C12 10 9 8 6 8 C6 12 10 14 14 15" fill="rgba(183, 110, 121, 0.22)" stroke="#B76E79" strokeWidth="0.9" />
        <path d="M17 11 C21 7 24 6 25 9 C24 12 21 13 17 12" fill="rgba(217, 185, 138, 0.25)" stroke="#B76E79" strokeWidth="0.9" />
        <circle cx="6" cy="7" r="1.5" fill="#D9B98A" />
      </svg>
    ),
  },
  {
    id: 'bridal',
    titleLines: ['Bridal', 'Collection'],
    description: 'Make your special day magical.',
    href: '/collections?theme=bridal',
    image: '/images/occasions/bridal-collection.jpg',
    alt: 'Contemporary Indian bride adorned in handcrafted sterling silver diamond choker necklace',
    className: 'collection-bridal',
    isHero: true,
    botanicalSvg: (
      <svg
        className="botanical-icon"
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16 28 V17" stroke="#B76E79" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M16 17 C12 13 10 10 16 5 C22 10 20 13 16 17Z" fill="rgba(246, 214, 217, 0.4)" stroke="#B76E79" strokeWidth="1.0" />
        <path d="M16 15 C10 13 7 16 9 21 C12 21 15 17 16 15Z" fill="rgba(183, 110, 121, 0.22)" stroke="#B76E79" strokeWidth="0.9" />
        <path d="M16 15 C22 13 25 16 23 21 C20 21 17 17 16 15Z" fill="rgba(183, 110, 121, 0.22)" stroke="#B76E79" strokeWidth="0.9" />
        <circle cx="16" cy="11" r="2" fill="#D9B98A" />
      </svg>
    ),
  },
  {
    id: 'gifting',
    titleLines: ['Gifting', 'Collection'],
    description: 'Because every moment matters.',
    href: '/gifts',
    image: '/images/occasions/gifting-collection.jpg',
    alt: 'Blush pink luxury MK Silver Hub gift box with sparkling 925 silver tennis bracelet on cushion',
    className: 'collection-gifting',
    botanicalSvg: (
      <svg
        className="botanical-icon"
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M7 26 C12 20 17 15 25 8" stroke="#B76E79" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M12 21 C9 17 10 14 14 15 C15 18 13 20 12 21Z" fill="rgba(228, 235, 217, 0.65)" stroke="#B76E79" strokeWidth="0.9" />
        <path d="M18 15 C16 11 19 8 22 10 C22 13 20 14 18 15Z" fill="rgba(217, 185, 138, 0.4)" stroke="#B76E79" strokeWidth="0.9" />
        <circle cx="25" cy="8" r="1.5" fill="#D9B98A" />
      </svg>
    ),
  },
];

export default function OccasionSection() {
  return (
    <section className="collections-editorial">
      {/* Background Layer with Muted Luxury Texture & Peach Warmth */}
      <div className="collections-bg" aria-hidden="true" />

      {/* Decorative Petals & Botanical Line Art */}
      <div className="editorial-decorations" aria-hidden="true">
        <div className="petal petal-1" />
        <div className="petal petal-2" />
        <div className="petal petal-3" />

        {/* Botanical Sketch - Left */}
        <svg
          className="botanical-drawing draw-left"
          width="320"
          height="320"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 190 C40 140 80 110 150 70 C170 58 190 40 200 20" stroke="#B76E79" strokeWidth="0.85" strokeLinecap="round" opacity="0.28" />
          <path d="M50 145 C45 130 55 120 70 125 C75 135 65 148 50 145Z" fill="rgba(246, 214, 217, 0.22)" stroke="#B76E79" strokeWidth="0.75" opacity="0.32" />
          <path d="M105 105 C100 90 115 80 125 88 C130 98 120 110 105 105Z" fill="rgba(255, 227, 211, 0.3)" stroke="#B76E79" strokeWidth="0.75" opacity="0.32" />
          <circle cx="85" cy="115" r="2" fill="#D9B98A" opacity="0.45" />
        </svg>

        {/* Botanical Sketch - Right */}
        <svg
          className="botanical-drawing draw-right"
          width="290"
          height="290"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M190 190 C150 130 110 90 40 50" stroke="#B76E79" strokeWidth="0.85" strokeLinecap="round" opacity="0.25" />
          <path d="M130 135 C135 120 125 110 110 115 C105 125 115 138 130 135Z" fill="rgba(246, 214, 217, 0.2)" stroke="#B76E79" strokeWidth="0.75" opacity="0.3" />
          <circle cx="115" cy="105" r="2" fill="#D9B98A" opacity="0.45" />
        </svg>
      </div>

      <div className="collections-content">
        {/* Left Side: Editorial Typography & CTA */}
        <div className="collections-copy">
          <div className="eyebrow-container">
            <span className="eyebrow">CURATED OCCASIONS</span>
            <span className="eyebrow-rule" />
          </div>

          <h2 className="editorial-title">
            Curated
            <span className="editorial-title-italic">For Every You</span>
          </h2>

          <p className="editorial-desc">
            From everyday minimal pieces to grand celebrations, discover silver jewellery styled for your special moments.
          </p>

          <Link href="/collections" className="collections-cta">
            <span>EXPLORE ALL OCCASIONS</span>
            <ArrowRight size={16} className="cta-arrow" />
          </Link>
        </div>

        {/* Right Side: 3 Overlapping Arched Collection Compositions */}
        <div className="collections-collage">
          {COLLECTIONS_DATA.map((col) => (
            <div key={col.id} className={`collection-card ${col.className}`}>
              <Link href={col.href} className="collection-anchor">
                {/* Portrait Image Frame with Arch Pill Curvature */}
                <div className={`image-frame ${col.isHero ? 'hero-arch' : ''}`}>
                  <Image
                    src={col.image}
                    alt={col.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
                    priority={col.isHero}
                    className="arch-img"
                  />
                  {/* Subtle Inner Champagne Glass Edge */}
                  <div className="arch-glass-outline" />

                  {/* Frosted Glass Information Panel Overlapping Bottom of Image */}
                  <div className="collection-glass">
                    <div className="glass-content">
                      <div className="botanical-box">{col.botanicalSvg}</div>

                      <div className="glass-labels">
                        <h3 className="glass-title">
                          {col.titleLines[0]}
                          <br />
                          {col.titleLines[1]}
                        </h3>
                        <p className="glass-desc">{col.description}</p>
                      </div>
                    </div>

                    {/* Circular Rose Button with Arrow */}
                    <div className="collection-arrow">
                      <ArrowRight size={18} className="arrow-svg" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Dedicated Mobile Horizontal Snap Carousel (Section 10: Everyday, Festive, Bridal, Date Night) */}
        <div className="mobile-occasions-carousel">
          {[
            {
              id: 'everyday',
              title: 'EVERYDAY',
              desc: 'Minimal pieces for every day.',
              image: '/images/occasions/everyday-elegance.jpg',
              href: '/shop?style=minimal',
            },
            {
              id: 'festive',
              title: 'FESTIVE',
              desc: 'Designed to make celebrations shine.',
              image: '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg',
              href: '/collections?theme=festive',
            },
            {
              id: 'bridal',
              title: 'BRIDAL',
              desc: 'Timeless pieces for special moments.',
              image: '/images/occasions/bridal-collection.jpg',
              href: '/collections?theme=bridal',
            },
            {
              id: 'date-night',
              title: 'DATE NIGHT',
              desc: 'Elegant statement pieces.',
              image: '/images/occasions/gifting-collection.jpg',
              href: '/collections?theme=statement',
            },
          ].map((occ) => (
            <Link key={occ.id} href={occ.href} className="mobile-occasion-card">
              <div className="mobile-occasion-img-wrap">
                <Image
                  src={occ.image}
                  alt={occ.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 320px"
                  style={{ objectFit: 'cover' }}
                />
                <div className="mobile-occasion-gradient" />
              </div>
              <div className="mobile-occasion-glass-panel">
                <div className="mobile-occasion-text">
                  <span className="mobile-occasion-title">{occ.title}</span>
                  <span className="mobile-occasion-desc">{occ.desc}</span>
                </div>
                <div className="mobile-occasion-arrow">
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .collections-editorial {
          position: relative;
          min-height: 760px;
          overflow: hidden;
          background-color: #FFF9F3;
          padding: clamp(80px, 8vw, 110px) clamp(1.5rem, 5vw, 4rem);
        }

        /* Background Texture with Soft Peach Glow & Floral Tone */
        .collections-bg {
          position: absolute;
          inset: 0;
          background-color: #FFF9F3;
          background-image:
            radial-gradient(ellipse at 75% 30%, rgba(255, 227, 211, 0.6) 0%, rgba(246, 214, 217, 0.28) 45%, rgba(255, 249, 243, 0) 80%),
            radial-gradient(circle at 12% 70%, rgba(255, 238, 230, 0.55) 0%, transparent 55%),
            url('/images/collections/collections-asymmetric-bg.jpg');
          background-size: cover;
          background-position: center 40%;
          opacity: 0.28;
          pointer-events: none;
          z-index: 1;
        }

        /* Floating Petals & Floral Line Art */
        .editorial-decorations {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .botanical-drawing {
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }
        .draw-left {
          bottom: 2%;
          left: -20px;
        }
        .draw-right {
          top: 3%;
          right: 2%;
        }

        @keyframes floatGentle {
          0%, 100% {
            transform: translateY(0px) rotate(-22deg);
          }
          50% {
            transform: translateY(-9px) rotate(-15deg);
          }
        }
        @keyframes floatGentleAlt {
          0%, 100% {
            transform: translateY(0px) rotate(32deg);
          }
          50% {
            transform: translateY(-11px) rotate(38deg);
          }
        }

        .petal {
          position: absolute;
          pointer-events: none;
        }
        .petal-1 {
          top: 14%;
          left: 27%;
          width: 24px;
          height: 30px;
          border-radius: 50% 0 50% 50%;
          background: linear-gradient(135deg, rgba(246, 214, 217, 0.92) 0%, rgba(255, 240, 242, 0.95) 100%);
          box-shadow: 0 3px 10px rgba(183, 110, 121, 0.16);
          opacity: 0.85;
          animation: floatGentle 7s ease-in-out infinite;
        }
        .petal-2 {
          bottom: 14%;
          left: 25%;
          width: 19px;
          height: 25px;
          border-radius: 0 50% 50% 50%;
          background: linear-gradient(135deg, rgba(255, 227, 211, 0.92) 0%, rgba(246, 214, 217, 0.85) 100%);
          box-shadow: 0 3px 8px rgba(183, 110, 121, 0.14);
          opacity: 0.8;
          animation: floatGentleAlt 8.5s ease-in-out infinite 1s;
        }
        .petal-3 {
          bottom: 16%;
          right: 5%;
          width: 20px;
          height: 26px;
          border-radius: 50% 50% 0 50%;
          background: linear-gradient(135deg, rgba(246, 214, 217, 0.9) 0%, rgba(255, 240, 242, 0.88) 100%);
          box-shadow: 0 3px 9px rgba(183, 110, 121, 0.14);
          opacity: 0.8;
          animation: floatGentle 9s ease-in-out infinite 0.5s;
        }

        /* 2-Column Desktop Grid Layout */
        .collections-content {
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: minmax(320px, 0.76fr) 1.44fr;
          align-items: center;
          gap: clamp(40px, 5vw, 70px);
          max-width: 1520px;
          margin: 0 auto;
        }

        /* Left Copy Column */
        .collections-copy {
          max-width: 480px;
          animation: fadeInLeft 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fadeInLeft {
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
          gap: 14px;
          margin-bottom: 20px;
        }

        .eyebrow {
          color: #B76E79;
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .eyebrow-rule {
          width: 38px;
          height: 1px;
          background-color: #B76E79;
          opacity: 0.55;
          display: inline-block;
        }

        .editorial-title {
          margin: 0 0 24px 0;
          color: #3B2B2B;
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(54px, 5.2vw, 82px);
          line-height: 0.95;
          font-weight: 400;
          letter-spacing: -0.015em;
        }

        .editorial-title-italic {
          display: block;
          color: #B76E79;
          font-style: italic;
          font-weight: 400;
        }

        .editorial-desc {
          max-width: 430px;
          color: #765F5F;
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 17px;
          line-height: 1.7;
          margin: 0 0 32px 0;
        }

        :global(.collections-cta) {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 16px 28px !important;
          background: #B76E79 !important;
          color: #FFFFFF !important;
          border-radius: 999px !important;
          font-family: var(--font-ui), "Jost", sans-serif !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
          text-decoration: none !important;
          box-shadow: 0 6px 20px rgba(183, 110, 121, 0.32) !important;
          transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        :global(.collections-cta:hover) {
          background: #9C5762 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 26px rgba(183, 110, 121, 0.45) !important;
        }

        :global(.collections-cta:hover .cta-arrow) {
          transform: translateX(4px) !important;
        }
        :global(.cta-arrow) {
          transition: transform 300ms ease !important;
        }

        /* Right Collage Stage: 3 Overlapping Arched Cards */
        .collections-collage {
          position: relative;
          width: 100%;
          min-height: 640px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .collection-card {
          position: absolute;
          width: 33%;
          min-width: 250px;
          max-width: 335px;
          transition: transform 600ms cubic-bezier(.22, 1, .36, 1), z-index 0s;
          animation: cardEntry 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardEntry {
          from {
            opacity: 0;
            transform: translateY(35px);
          }
          to {
            opacity: 1;
          }
        }

        .collection-everyday {
          animation-delay: 0.1s;
        }
        .collection-bridal {
          animation-delay: 0.22s;
        }
        .collection-gifting {
          animation-delay: 0.34s;
        }

        :global(.collection-anchor) {
          text-decoration: none !important;
          display: block !important;
          position: relative !important;
        }

        /* Arched Image Frames */
        .image-frame {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: clamp(440px, 38vw, 500px);
          border-radius: 90px 90px 24px 24px;
          border: 1px solid rgba(217, 185, 138, 0.65);
          box-shadow: 0 25px 60px rgba(70, 45, 38, 0.15);
          transition: all 400ms cubic-bezier(.22, 1, .36, 1);
        }

        /* Bridal Center Hero Arch: Tallest & dominant */
        .hero-arch {
          height: clamp(500px, 44vw, 570px) !important;
          border-radius: 115px 115px 28px 28px !important;
        }

        .arch-glass-outline {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 3;
          box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 0.85),
            inset 0 -2px 6px rgba(217, 185, 138, 0.25);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.24) 0%,
            rgba(255, 255, 255, 0.05) 25%,
            transparent 55%,
            rgba(217, 185, 138, 0.1) 100%
          );
        }

        :global(.arch-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 700ms cubic-bezier(.22, 1, .36, 1) !important;
        }

        .collection-card:hover :global(.arch-img) {
          transform: scale(1.045) !important;
        }

        /* FROSTED GLASS INFORMATION PANELS (Overlapping Bottom) */
        .collection-glass {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;

          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.65) 0%,
            rgba(255, 255, 255, 0.42) 100%
          );

          backdrop-filter: blur(24px) saturate(150%);
          -webkit-backdrop-filter: blur(24px) saturate(150%);

          border: 1.5px solid rgba(255, 255, 255, 0.85);
          border-radius: 28px;

          box-shadow:
            0 18px 45px rgba(65, 40, 35, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);

          z-index: 5;
          overflow: hidden;

          transition:
            transform 350ms cubic-bezier(.22, 1, .36, 1),
            background 300ms ease,
            border-color 300ms ease,
            box-shadow 300ms ease;
        }

        /* Subtle diagonal specular reflection */
        .collection-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.15) 30%,
            transparent 55%,
            rgba(255, 255, 255, 0.1) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .glass-content {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 2;
        }

        .botanical-box {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.92;
        }

        .glass-labels {
          text-align: left;
        }

        .glass-title {
          margin: 0;
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: 26px;
          font-weight: 500;
          color: #3B2B2B;
          line-height: 1.12;
          letter-spacing: -0.01em;
          transition: color 300ms ease;
        }

        .glass-desc {
          margin: 4px 0 0 0;
          color: #6F5A58;
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 13px;
          line-height: 1.35;
          font-weight: 400;
        }

        /* Circular Rose Arrow Button */
        .collection-arrow {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #B76E79;
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.65);
          box-shadow: 0 4px 12px rgba(183, 110, 121, 0.28);
          position: relative;
          z-index: 2;
          transition:
            transform 300ms cubic-bezier(.22, 1, .36, 1),
            background 300ms ease,
            box-shadow 300ms ease;
        }

        :global(.arrow-svg) {
          transition: transform 300ms ease !important;
        }

        /* ASYMMETRIC STAGGERED OVERLAPPING POSITIONS */
        .collection-everyday {
          left: 0;
          bottom: 30px;
          z-index: 2;
          transform: rotate(-1.5deg);
        }

        .collection-bridal {
          left: 33%;
          top: 0;
          z-index: 4;
          transform: scale(1.02);
        }

        .collection-gifting {
          right: 0;
          bottom: 40px;
          z-index: 2;
          transform: rotate(1.5deg);
        }

        /* Hover Micro-Interactions */
        .collection-card:hover {
          z-index: 12 !important;
        }
        .collection-everyday:hover {
          transform: translateY(-8px) rotate(0deg);
        }
        .collection-bridal:hover {
          transform: translateY(-8px) scale(1.035);
        }
        .collection-gifting:hover {
          transform: translateY(-8px) rotate(0deg);
        }

        .collection-card:hover .collection-glass {
          background: rgba(255, 255, 255, 0.75);
          border-color: rgba(255, 255, 255, 1);
          transform: translateY(-4px);
          box-shadow: 0 22px 50px rgba(65, 40, 35, 0.18), inset 0 1px 0 rgba(255, 255, 255, 1);
        }

        .collection-card:hover .glass-title {
          color: #B76E79;
        }

        .collection-card:hover .collection-arrow {
          transform: translateX(4px) scale(1.04);
          background: #9C5762;
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.42);
        }

        /* Tablet Responsive (<= 1140px) */
        @media (max-width: 1140px) {
          .collections-content {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .collections-copy {
            max-width: 580px;
            margin: 0 auto;
            text-align: left;
          }
          .collections-collage {
            max-width: 780px;
            margin: 0 auto;
            min-height: 560px;
          }
        }

        .mobile-occasions-carousel {
          display: none;
        }

        /* Mobile Alternating Lookbook Sequence (<= 768px) */
        @media (max-width: 768px) {
          .collections-collage {
            display: none !important;
          }
          .mobile-occasions-carousel {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 14px !important;
            padding: 10px 4px 20px 4px !important;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .mobile-occasions-carousel::-webkit-scrollbar {
            display: none;
          }
          :global(.mobile-occasion-card) {
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
          .mobile-occasion-img-wrap {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }
          .mobile-occasion-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(59, 43, 43, 0.45) 100%);
          }
          .mobile-occasion-glass-panel {
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
          .mobile-occasion-title {
            font-family: var(--font-ui), "Jost", sans-serif;
            font-size: 0.9rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: #342727;
            display: block;
          }
          .mobile-occasion-desc {
            font-family: var(--font-ui), "Jost", sans-serif;
            font-size: 0.74rem;
            color: #806D68;
            display: block;
            margin-top: 2px;
          }
          .mobile-occasion-arrow {
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

          .botanical-drawing {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .petal-1, .petal-2, .petal-3 {
            animation: none !important;
          }
          .collection-card,
          .collection-glass,
          .collection-arrow {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
