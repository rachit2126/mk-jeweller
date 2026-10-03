'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DbBanner } from '@/lib/db/types';

// Safe brand fallback matching active MongoDB ban-01
const DEFAULT_HERO: DbBanner = {
  id: 'ban-01',
  eyebrow: 'AUTHENTIC 925 STERLING SILVER',
  title: 'Timeless Traditions, Modern You.',
  subtitle: 'Handcrafted oxidised silver jewellery, inspired by India’s heritage, made for everyday elegance.',
  desktopImage: '/images/hero/hero-oxidised-silver.jpg',
  mobileImage: '/images/hero/hero-oxidised-silver-mobile.jpg',
  ctaText: 'SHOP COLLECTION',
  ctaUrl: '/shop',
  secondaryCtaText: 'EXPLORE NEW ARRIVALS',
  secondaryCtaUrl: '/shop?sort=newest',
  altText: 'Authentic handcrafted oxidised 925 sterling silver jhumkas on warm travertine stone',
  placement: 'homepage_hero',
  sortOrder: 1,
  status: 'active',
};

export default function StaticHero() {
  const [heroData, setHeroData] = useState<DbBanner>(DEFAULT_HERO);
  const [isHoverPrimary, setIsHoverPrimary] = useState(false);
  const [isHoverSecondary, setIsHoverSecondary] = useState(false);

  // Fetch active hero from live MongoDB banners collection
  useEffect(() => {
    let isMounted = true;
    fetch('/api/banners')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data?.banners || !Array.isArray(data.banners)) return;
        // Find single active homepage_hero banner
        const activeHero = data.banners.find(
          (b: DbBanner) => b.placement === 'homepage_hero' && b.status === 'active'
        );
        if (activeHero) {
          setHeroData(activeHero);
        }
      })
      .catch((err) => {
        console.error('[StaticHero] Error loading hero banner from MongoDB:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const eyebrow = heroData.eyebrow || 'AUTHENTIC 925 STERLING SILVER';
  const title = heroData.title || 'Timeless Traditions, Modern You.';
  const subtitle =
    heroData.subtitle ||
    'Handcrafted oxidised silver jewellery, inspired by India’s heritage, made for everyday elegance.';
  const desktopImg = heroData.desktopImage || '/images/hero/hero-oxidised-silver.jpg';
  const mobileImg = heroData.mobileImage || desktopImg;
  const primaryText = heroData.ctaText || 'SHOP COLLECTION';
  const primaryUrl = heroData.ctaUrl || '/shop';
  const secondaryText = heroData.secondaryCtaText || 'EXPLORE NEW ARRIVALS';
  const secondaryUrl = heroData.secondaryCtaUrl || '/shop?sort=newest';
  const altText = heroData.altText || 'Authentic 925 Sterling Silver Jewellery';

  // Format heading into 3 editorial lines if matching standard title
  const isStandardTitle =
    title.toLowerCase().includes('timeless') && title.toLowerCase().includes('traditions');

  return (
    <section
      aria-label="MK Silver Hub Editorial Campaign"
      className="static-hero-root"
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(650px, 72vh, 760px)',
        minHeight: '620px',
        backgroundColor: '#F8F7F3',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* 1. Desktop Hero Image (Hidden on Mobile) */}
      <div
        className="static-hero-desktop-media"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <Image
          src={desktopImg}
          alt={altText}
          fill
          priority
          sizes="100vw"
          quality={94}
          style={{
            objectFit: 'cover',
            objectPosition: 'right center',
          }}
        />
        {/* Subtle, soft contrast vignette on the left text area */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(248, 247, 243, 0.88) 0%, rgba(248, 247, 243, 0.7) 35%, rgba(248, 247, 243, 0.2) 55%, rgba(248, 247, 243, 0) 72%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* 2. Mobile Hero Image (Visible only on Mobile) */}
      <div
        className="static-hero-mobile-media"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '52%',
          zIndex: 1,
          display: 'none',
        }}
      >
        <Image
          src={mobileImg}
          alt={altText}
          fill
          priority
          sizes="100vw"
          quality={92}
          style={{
            objectFit: 'cover',
            objectPosition: 'center 40%',
          }}
        />
        {/* Soft bottom blend to seamlessly merge into the warm ivory text section */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(180deg, rgba(248, 247, 243, 0) 0%, #F8F7F3 100%)',
          }}
        />
      </div>

      {/* 3. Text & CTAs Content Container */}
      <div
        className="static-hero-content-wrapper"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 64px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <div
          className="static-hero-text-block"
          style={{
            maxWidth: '580px',
          }}
        >
          {/* Eyebrow with hairline accents */}
          <div
            className="static-hero-eyebrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '26px',
                height: '1px',
                backgroundColor: '#8E8D88',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#4A4A45',
                lineHeight: 1,
              }}
            >
              {eyebrow}
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '26px',
                height: '1px',
                backgroundColor: '#8E8D88',
              }}
            />
          </div>

          {/* Main Editorial Heading */}
          <h1
            className="static-hero-heading"
            style={{
              fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(46px, 5.4vw, 86px)',
              fontWeight: 400,
              lineHeight: 1.06,
              letterSpacing: '-0.015em',
              color: '#111111',
              margin: '0 0 20px',
              textTransform: 'capitalize',
            }}
          >
            {isStandardTitle ? (
              <>
                <span style={{ display: 'block' }}>Timeless</span>
                <span style={{ display: 'block' }}>Traditions,</span>
                <span
                  style={{
                    display: 'block',
                    fontStyle: 'italic',
                    fontWeight: 400,
                  }}
                >
                  Modern You.
                </span>
              </>
            ) : (
              title
            )}
          </h1>

          {/* Body Description */}
          <p
            className="static-hero-desc"
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: 'clamp(0.92rem, 1.1vw, 1.02rem)',
              lineHeight: 1.6,
              color: '#4A4A45',
              maxWidth: '430px',
              margin: '0 0 32px',
              fontWeight: 400,
            }}
          >
            {subtitle}
          </p>

          {/* Editorial CTAs */}
          <div
            className="static-hero-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            {/* Primary Button */}
            <Link
              href={primaryUrl}
              onMouseEnter={() => setIsHoverPrimary(true)}
              onMouseLeave={() => setIsHoverPrimary(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: isHoverPrimary ? '#262626' : '#111111',
                color: '#FFFFFF',
                padding: '14px 26px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
                border: '1px solid #111111',
                transition: 'background-color 200ms ease, border-color 200ms ease',
                boxSizing: 'border-box',
              }}
            >
              <span>{primaryText}</span>
              <ArrowRight
                size={14}
                style={{
                  transform: isHoverPrimary ? 'translateX(5px)' : 'translateX(0)',
                  transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              />
            </Link>

            {/* Secondary Button */}
            <Link
              href={secondaryUrl}
              onMouseEnter={() => setIsHoverSecondary(true)}
              onMouseLeave={() => setIsHoverSecondary(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: isHoverSecondary
                  ? '#FFFFFF'
                  : 'rgba(248, 247, 243, 0.85)',
                color: '#111111',
                padding: '14px 24px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
                border: '1px solid #111111',
                transition: 'background-color 200ms ease, border-color 200ms ease',
                boxSizing: 'border-box',
              }}
            >
              <span>{secondaryText}</span>
              <ArrowRight
                size={14}
                style={{
                  transform: isHoverSecondary ? 'translateX(5px)' : 'translateX(0)',
                  transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Scoped CSS for Responsive Viewports */}
      <style jsx>{`
        @media (max-width: 860px) {
          .static-hero-root {
            height: auto !important;
            min-height: 640px !important;
            padding-top: 260px;
            padding-bottom: 84px !important;
            align-items: flex-end !important;
          }
          .static-hero-desktop-media {
            display: none !important;
          }
          .static-hero-mobile-media {
            display: block !important;
          }
          .static-hero-text-block {
            max-width: 100% !important;
            padding: 20px 0 10px;
          }
          .static-hero-heading {
            font-size: clamp(38px, 9vw, 56px) !important;
            line-height: 1.1 !important;
          }
          .static-hero-desc {
            max-width: 100% !important;
            margin-bottom: 24px !important;
          }
          .static-hero-actions {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
            gap: 10px !important;
          }
          .static-hero-actions :global(a) {
            width: 100% !important;
            text-align: center !important;
          }
        }
        @media (max-width: 480px) {
          .static-hero-root {
            min-height: 660px !important;
            padding-top: 280px;
            padding-bottom: 30px;
          }
          .static-hero-mobile-media {
            height: 48% !important;
          }
          .static-hero-eyebrow {
            margin-bottom: 12px !important;
          }
          .static-hero-heading {
            font-size: 36px !important;
            margin-bottom: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}
