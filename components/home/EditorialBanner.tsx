'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function EditorialBanner() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="bridal-editorial-section"
      style={{
        position: 'relative',
        backgroundColor: '#F6D6D9',
        overflow: 'hidden',
        minHeight: 'clamp(520px, 42vw, 620px)',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* Full-Bleed High-Res Cinematic Bridal Background Image */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
        initial={{ scale: 1 }}
        animate={prefersReducedMotion ? { scale: 1 } : { scale: 1.03 }}
        transition={{
          duration: 9,
          ease: [0.25, 1, 0.5, 1],
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <Image
          src="/images/editorial/bridal-banner-clean-hd.jpg"
          alt="MK Silver Hub exclusive handcrafted 925 sterling silver bridal jewellery collection"
          fill
          priority
          sizes="100vw"
          quality={95}
          style={{
            objectFit: 'cover',
            objectPosition: 'right 24%',
            display: 'block',
          }}
        />
      </motion.div>

      {/* Subtle Warm Tone Gradient on Left Only (Preserves skin tones & jewelry sharpness) */}
      <div
        className="bridal-gradient-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(253, 221, 213, 0.78) 0%, rgba(253, 221, 213, 0.6) 28%, rgba(253, 221, 213, 0.22) 48%, transparent 62%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Plaster/Paper Texture Accent Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(255, 227, 211, 0.12) 0%, transparent 50%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Floating Petals (Restrained Animation) */}
      <div
        className="floating-petals-container"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {/* Floating Petal 1 */}
        <div
          className="floating-petal petal-1"
          style={{
            position: 'absolute',
            top: '32%',
            left: '42%',
            width: '18px',
            height: '24px',
            borderRadius: '50% 0 50% 50%',
            transform: 'rotate(-25deg)',
            background: 'linear-gradient(135deg, rgba(246, 214, 217, 0.85) 0%, rgba(255, 240, 242, 0.95) 100%)',
            boxShadow: '0 2px 8px rgba(183, 110, 121, 0.15)',
            opacity: 0.85,
          }}
        />
        {/* Floating Petal 2 */}
        <div
          className="floating-petal petal-2"
          style={{
            position: 'absolute',
            top: '58%',
            left: '36%',
            width: '14px',
            height: '20px',
            borderRadius: '0 50% 50% 50%',
            transform: 'rotate(40deg)',
            background: 'linear-gradient(135deg, rgba(255, 227, 211, 0.9) 0%, rgba(246, 214, 217, 0.8) 100%)',
            boxShadow: '0 2px 6px rgba(183, 110, 121, 0.12)',
            opacity: 0.75,
          }}
        />
        {/* Floating Petal 3 */}
        <div
          className="floating-petal petal-3"
          style={{
            position: 'absolute',
            top: '24%',
            right: '10%',
            width: '16px',
            height: '22px',
            borderRadius: '50% 50% 0 50%',
            transform: 'rotate(15deg)',
            background: 'linear-gradient(135deg, rgba(246, 214, 217, 0.9) 0%, rgba(255, 240, 242, 0.8) 100%)',
            boxShadow: '0 2px 8px rgba(183, 110, 121, 0.15)',
            opacity: 0.8,
          }}
        />
      </div>

      {/* Delicate Bottom-Left Floral Line-Art Matching Reference Mockup */}
      <svg
        className="bridal-floral-lineart"
        width="220"
        height="220"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: '-10px',
          left: '-10px',
          zIndex: 4,
          opacity: 0.42,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {/* Main curved stems */}
        <path
          d="M0 240 C50 200 90 160 140 130 C160 118 190 100 220 80"
          stroke="#B76E79"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M20 240 C60 180 110 130 170 90"
          stroke="#B76E79"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        {/* Detailed Daisy / Rose Blossom Petals */}
        <path
          d="M70 170 C60 155 75 140 90 148 C95 160 85 175 70 170Z"
          fill="rgba(246, 214, 217, 0.2)"
          stroke="#B76E79"
          strokeWidth="0.9"
        />
        <path
          d="M100 145 C95 130 110 118 122 126 C126 138 115 152 100 145Z"
          fill="rgba(246, 214, 217, 0.2)"
          stroke="#B76E79"
          strokeWidth="0.9"
        />
        <path
          d="M130 120 C125 105 140 92 152 100 C156 112 145 126 130 120Z"
          fill="rgba(246, 214, 217, 0.2)"
          stroke="#B76E79"
          strokeWidth="0.9"
        />
        {/* Small buds and foliage */}
        <path
          d="M40 210 C35 195 48 185 58 190 C62 200 52 215 40 210Z"
          fill="rgba(255, 227, 211, 0.25)"
          stroke="#B76E79"
          strokeWidth="0.8"
        />
        <circle cx="85" cy="155" r="3" fill="#D9B98A" opacity="0.6" />
        <circle cx="115" cy="132" r="3" fill="#D9B98A" opacity="0.6" />
        <circle cx="145" cy="108" r="3" fill="#D9B98A" opacity="0.6" />
      </svg>

      {/* Main Editorial Text Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 5,
          padding: 'clamp(56px, 7vw, 88px) 24px',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <motion.div
          style={{ maxWidth: '480px' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
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
                letterSpacing: '0.22em',
                color: '#B76E79',
                textTransform: 'uppercase',
              }}
            >
              BRIDAL COLLECTION
            </span>
            <span
              style={{
                width: '32px',
                height: '1px',
                backgroundColor: '#B76E79',
                opacity: 0.55,
                display: 'inline-block',
              }}
            />
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2.7rem, 4.4vw, 4rem)',
              fontWeight: 400,
              lineHeight: 1.08,
              color: '#3B2B2B',
              marginBottom: '20px',
              letterSpacing: '-0.015em',
            }}
          >
            A Symbol<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>of Forever</span>
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: 'clamp(0.96rem, 1.15vw, 1.05rem)',
              color: '#6F5A58',
              lineHeight: 1.7,
              marginBottom: '34px',
              maxWidth: '430px',
            }}
          >
            Discover our exclusive bridal collection crafted for life&apos;s most beautiful moments.
          </p>

          {/* Primary Action Button */}
          <Link
            href="/collections?theme=bridal"
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
              boxShadow: '0 6px 20px rgba(183, 110, 121, 0.32)',
            }}
            className="bridal-cta-btn"
          >
            <span>Explore Bridal Collection</span>
            <ArrowRight size={15} className="bridal-arrow-icon" />
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .bridal-cta-btn:hover {
          background-color: #9C5762 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(183, 110, 121, 0.46) !important;
        }
        .bridal-cta-btn:hover .bridal-arrow-icon {
          transform: translateX(4px);
        }
        .bridal-arrow-icon {
          transition: transform 0.22s ease;
        }

        /* Subtle Petal Drift Keyframes */
        @keyframes petalFloat1 {
          0%, 100% {
            transform: translate(0, 0) rotate(-25deg);
          }
          50% {
            transform: translate(6px, -12px) rotate(-18deg);
          }
        }
        @keyframes petalFloat2 {
          0%, 100% {
            transform: translate(0, 0) rotate(40deg);
          }
          50% {
            transform: translate(-8px, -14px) rotate(48deg);
          }
        }
        @keyframes petalFloat3 {
          0%, 100% {
            transform: translate(0, 0) rotate(15deg);
          }
          50% {
            transform: translate(10px, -10px) rotate(22deg);
          }
        }

        .petal-1 {
          animation: petalFloat1 6s ease-in-out infinite;
        }
        .petal-2 {
          animation: petalFloat2 7.5s ease-in-out infinite 1s;
        }
        .petal-3 {
          animation: petalFloat3 8s ease-in-out infinite 0.5s;
        }

        @media (prefers-reduced-motion: reduce) {
          .petal-1, .petal-2, .petal-3 {
            animation: none !important;
          }
        }

        @media (max-width: 900px) {
          .bridal-gradient-overlay {
            background: linear-gradient(
              90deg,
              rgba(253, 221, 213, 0.92) 0%,
              rgba(253, 221, 213, 0.8) 50%,
              rgba(253, 221, 213, 0.3) 100%
            ) !important;
          }
        }

        @media (max-width: 640px) {
          .bridal-editorial-section {
            min-height: 460px !important;
          }
          .bridal-gradient-overlay {
            background: linear-gradient(
              to top,
              rgba(253, 221, 213, 0.96) 0%,
              rgba(253, 221, 213, 0.88) 55%,
              rgba(253, 221, 213, 0.4) 100%
            ) !important;
          }
          .bridal-floral-lineart {
            display: none;
          }
          .bridal-editorial-section h2 {
            font-size: clamp(2.1rem, 7vw, 2.6rem) !important;
            margin-bottom: 14px !important;
          }
          .bridal-editorial-section p {
            font-size: 0.92rem !important;
            margin-bottom: 24px !important;
          }
          .bridal-cta-btn {
            width: 100%;
            justify-content: center;
            padding: 13px 26px !important;
          }
        }
      `}</style>
    </section>
  );
}
