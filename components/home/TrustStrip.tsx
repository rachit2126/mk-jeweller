'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Unified luxury outline SVG icons (matching reference) */
function RibbonAwardIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="6" />
      {/* 5-point star inside rosette */}
      <path d="M12 5.5 L12.7 7 L14.3 7.2 L13.1 8.3 L13.4 9.9 L12 9.1 L10.6 9.9 L10.9 8.3 L9.7 7.2 L11.3 7 Z" fill={color} fillOpacity="0.3" stroke="none" />
      {/* Ribbon tails with forked ends */}
      <path d="M8.2 13.5 L7 22 L10.5 19.5 L12 21" />
      <path d="M15.8 13.5 L17 22 L13.5 19.5 L12 21" />
    </svg>
  );
}

function CircularReturnIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <polyline points="3 3 3 8 8 8" />
    </svg>
  );
}

function ShieldCheckIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function FastShippingTruckIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1" y="3" width="14" height="13" rx="1.5" />
      <polygon points="15 8 19 8 22 11 22 16 15 16 15 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function WhatsAppChatIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.5 9.5c.2.6.5 1.2 1 1.7.5.5 1.1.8 1.7 1 .3.1.6 0 .8-.2l.6-.6c.2-.2.5-.2.7-.1l1.3.7c.3.2.4.4.3.7-.2.8-1 1.4-1.9 1.4-1.4 0-2.8-.8-3.9-1.9C9 12.1 8.2 10.7 8.2 9.3c0-.9.6-1.7 1.4-1.9.3-.1.5 0 .7.3l.7 1.3c.1.2.1.5-.1.7l-.6.6c-.2.2-.3.5-.2.8" />
    </svg>
  );
}

interface BenefitItem {
  id: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  description: string;
  isHero?: boolean;
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'silver',
    icon: RibbonAwardIcon,
    title: '925 Sterling Silver',
    description: 'Authentic silver jewellery',
    isHero: true,
  },
  {
    id: 'returns',
    icon: CircularReturnIcon,
    title: 'Easy Returns',
    description: 'Simple hassle-free returns',
  },
  {
    id: 'payments',
    icon: ShieldCheckIcon,
    title: 'Secure Payments',
    description: '100% secure checkout',
  },
  {
    id: 'shipping',
    icon: FastShippingTruckIcon,
    title: 'Fast Shipping',
    description: 'Across India',
  },
  {
    id: 'support',
    icon: WhatsAppChatIcon,
    title: 'WhatsApp Support',
    description: 'Talk to our jewellery experts',
  },
];

export default function TrustStrip() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="trust-strip-section" aria-label="Why Shop With MK Silver Hub">
      <div className="trust-strip-container">
        {/* Background Subtle Floral & Silk Corners Framed Inside Rounded Pill */}
        <div className="floral-corner floral-corner-left" aria-hidden="true" />
        <div className="floral-corner floral-corner-right" aria-hidden="true" />

        <div className="trust-strip-track">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === BENEFITS.length - 1;

            return (
              <React.Fragment key={item.id}>
                {/* Single Benefit Item */}
                <motion.div
                  className={`trust-motion-wrapper ${isLast ? 'trust-item-last' : ''}`}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '60px' }}
                  transition={{
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ width: '100%' }}
                >
                  <div className={`trust-benefit-card ${item.isHero ? 'hero-item' : ''}`}>
                    {/* Circular Blush Badge */}
                    <div className="badge-glow-wrap">
                      <div className="badge-circle">
                        <Icon size={item.isHero ? 24 : 22} color="#B76E79" />
                      </div>
                    </div>

                    {/* Heading */}
                    <h3 className="benefit-title">{item.title}</h3>

                    {/* Tiny Decorative Underline */}
                    <span className="benefit-decorative-line" aria-hidden="true" />

                    {/* Description */}
                    <p className="benefit-description">{item.description}</p>
                  </div>
                </motion.div>

                {/* Vertical Separator with 4-Point Diamond Sparkle Ornament */}
                {!isLast && (
                  <div className="benefit-separator-col" aria-hidden="true">
                    <div className="sep-line-top" />
                    <svg className="sep-diamond-star" viewBox="0 0 16 16" width="10" height="10" fill="none">
                      <path
                        d="M8 0 L9.8 6.2 L16 8 L9.8 9.8 L8 16 L6.2 9.8 L0 8 L6.2 6.2 Z"
                        fill="#B76E79"
                      />
                    </svg>
                    <div className="sep-line-bottom" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        /* SECTION BASE: Floating overlap bridge between Collections & Best Sellers */
        .trust-strip-section {
          position: relative;
          z-index: 10;
          width: 100%;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(16px, 3.5vw, 40px);
          margin-top: -65px;
          margin-bottom: -70px;
        }

        /* CONTAINER: Floating luxury rounded capsule / pill */
        .trust-strip-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          border-radius: 9999px;
          background: linear-gradient(
            180deg,
            #FFFFFF 0%,
            #FFF8F3 52%,
            #FFF2EC 100%
          );
          border: 1.5px solid rgba(232, 216, 208, 0.85);
          box-shadow: 0 18px 45px rgba(80, 45, 40, 0.10);
          padding: 34px clamp(24px, 4vw, 56px);
          overflow: hidden;
        }

        /* SUBTLE FLORAL & SILK BACKGROUND ACCENTS AT FAR LEFT & RIGHT */
        .floral-corner {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 110px;
          pointer-events: none;
          background-size: cover;
          background-repeat: no-repeat;
          z-index: 1;
        }

        .floral-corner-left {
          left: 0;
          background-image: url('/images/trust-floral-left.png');
          background-position: left center;
          -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0) 100%);
          mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0) 100%);
          opacity: 0.9;
        }

        .floral-corner-right {
          right: 0;
          background-image: url('/images/trust-floral-right.png');
          background-position: right center;
          -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0) 100%);
          mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0) 100%);
          opacity: 0.9;
        }

        /* TRACK: 5 EQUAL COLUMNS WITH CENTERED SEPARATORS */
        :global(.trust-strip-track) {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        /* SINGLE BENEFIT CARD */
        .trust-benefit-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 12px 10px;
          cursor: default;
          transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .trust-benefit-card:hover {
          transform: translateY(-2.5px);
        }

        /* CIRCULAR ICON CONTAINER */
        .badge-glow-wrap {
          position: relative;
          margin-bottom: 14px;
        }

        .badge-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FEECE8 58%, #F7D4CC 100%);
          border: 1px solid rgba(183, 110, 121, 0.32);
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 260ms ease,
            border-color 260ms ease,
            background 260ms ease;
        }

        /* HERO ITEM: 925 STERLING SILVER (SLIGHTLY PROMINENT) */
        .hero-item .badge-circle {
          width: 64px;
          height: 64px;
          border-color: rgba(217, 185, 138, 0.65);
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.18), inset 0 1.5px 3px rgba(255, 255, 255, 1);
          background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FFF0EB 52%, #F6D2C8 100%);
        }

        .trust-benefit-card:hover .badge-circle {
          transform: scale(1.07);
          border-color: #B76E79;
          box-shadow: 0 8px 22px rgba(183, 110, 121, 0.24), inset 0 1px 2px rgba(255, 255, 255, 1);
          background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FFF3F0 50%, #F8D9D2 100%);
        }

        /* HEADING */
        .benefit-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.22rem, 1.4vw, 1.42rem);
          font-weight: 500;
          color: #2D201E;
          letter-spacing: -0.01em;
          line-height: 1.15;
          margin: 0;
          transition: color 240ms ease;
        }

        .hero-item .benefit-title {
          font-weight: 600;
          font-size: clamp(1.28rem, 1.45vw, 1.48rem);
        }

        .trust-benefit-card:hover .benefit-title {
          color: #B76E79;
        }

        /* DECORATIVE LINE BENEATH HEADING */
        .benefit-decorative-line {
          display: block;
          width: 20px;
          height: 1.5px;
          background-color: rgba(183, 110, 121, 0.45);
          border-radius: 1px;
          margin: 8px auto 9px auto;
          transition: width 260ms ease, background-color 260ms ease;
        }

        .trust-benefit-card:hover .benefit-decorative-line {
          width: 34px;
          background-color: #B76E79;
        }

        /* DESCRIPTION */
        .benefit-description {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.86rem;
          color: #7A6866;
          line-height: 1.4;
          margin: 0;
          max-width: 200px;
        }

        /* VERTICAL SEPARATOR WITH CENTER DIAMOND STAR */
        .benefit-separator-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60px;
          align-self: center;
          padding: 0 6px;
        }

        .sep-line-top,
        .sep-line-bottom {
          width: 1px;
          height: 22px;
          background-color: #E7CFC5;
          opacity: 0.75;
        }

        .sep-diamond-star {
          margin: 3px 0;
          opacity: 0.85;
        }

        /* RESPONSIVE: TABLET (1024px and below) */
        @media (max-width: 1024px) {
          .trust-strip-section {
            margin-top: -45px;
            margin-bottom: -50px;
            padding: 0 20px;
          }

          .trust-strip-container {
            border-radius: 40px;
            padding: 30px 24px;
          }

          :global(.trust-strip-track) {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .benefit-separator-col {
            display: none;
          }

          .trust-benefit-card {
            padding: 8px;
          }
        }

        /* RESPONSIVE: MOBILE (768px and below) */
        @media (max-width: 768px) {
          .trust-strip-section {
            margin-top: -24px;
            margin-bottom: 12px;
            padding: 0 14px;
            position: relative;
            z-index: 10;
          }

          .trust-strip-container {
            border-radius: 24px;
            padding: 16px 12px;
            background: rgba(255, 249, 243, 0.94);
            box-shadow: 0 8px 24px rgba(59, 43, 43, 0.06);
          }

          .floral-corner {
            display: none;
          }

          .benefit-separator-col {
            display: none !important;
          }

          :global(.trust-strip-track) {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            gap: 12px !important;
            padding: 6px 4px 10px 4px !important;
            scrollbar-width: none;
          }

          :global(.trust-strip-track)::-webkit-scrollbar {
            display: none;
          }

          :global(.trust-motion-wrapper) {
            flex: 0 0 78vw !important;
            max-width: 300px !important;
            scroll-snap-align: center !important;
          }

          .trust-benefit-card {
            background: #FFFFFF;
            border-radius: 18px;
            border: 1px solid rgba(232, 216, 208, 0.85);
            padding: 18px 14px;
            box-shadow: 0 4px 14px rgba(59, 43, 43, 0.04);
            height: 100%;
          }

          .badge-circle {
            width: 48px;
            height: 48px;
          }

          .hero-item .badge-circle {
            width: 50px;
            height: 50px;
          }

          .benefit-title {
            font-size: 1.1rem;
          }

          .hero-item .benefit-title {
            font-size: 1.14rem;
          }

          .benefit-description {
            font-size: 0.78rem;
            max-width: 220px;
          }

          .benefit-decorative-line {
            margin: 6px auto 8px auto;
          }
        }

        @media (max-width: 360px) {
          .benefit-title {
            font-size: 0.98rem;
          }
          .benefit-description {
            font-size: 0.74rem;
          }
          .badge-circle {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
    </section>
  );
}
