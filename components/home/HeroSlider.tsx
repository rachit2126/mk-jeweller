'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  label: string;
  headingPart1: string;
  headingPart2: string;
  headingPart3: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    label: '925 STERLING SILVER',
    headingPart1: 'CRAFTED',
    headingPart2: 'FOR YOUR',
    headingPart3: 'EVERYDAY.',
    description: 'Contemporary 925 sterling silver jewellery, designed in Jaipur for modern expression.',
    primaryCtaText: 'SHOP COLLECTION',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'EXPLORE NEW ARRIVALS →',
    secondaryCtaLink: '/shop?sort=newest',
    image: '/images/hero/hero-silver-editorial.jpg',
    alt: 'MK Silver Hub Fine 925 Sterling Floral Stud Earrings and Solitaire Ring',
  },
  {
    id: 'slide-2',
    label: 'HERITAGE POLKI & SILVER',
    headingPart1: 'ROYAL',
    headingPart2: 'JAIPUR',
    headingPart3: 'HEIRLOOMS.',
    description: 'Centuries of artisanal craftsmanship reimagined in luminous hallmarked 925 sterling silver.',
    primaryCtaText: 'DISCOVER BRIDAL',
    primaryCtaLink: '/shop?occasion=bridal',
    secondaryCtaText: 'VIEW BEST SELLERS →',
    secondaryCtaLink: '/shop?isBestSeller=true',
    image: '/images/editorial/bridal-banner-clean-hd.jpg',
    alt: 'MK Silver Hub Heritage Polki Choker Set in 925 Sterling Silver',
  },
  {
    id: 'slide-3',
    label: 'CONTEMPORARY MINIMALISM',
    headingPart1: 'LESS.',
    headingPart2: 'BUT',
    headingPart3: 'BETTER.',
    description: 'Featherlight pavé bands, floating pendants and everyday luxury made for quiet confidence.',
    primaryCtaText: 'EXPLORE MINIMAL',
    primaryCtaLink: '/collections',
    secondaryCtaText: 'SHOP RINGS →',
    secondaryCtaLink: '/shop?category=rings',
    image: '/images/occasions/everyday-elegance.jpg',
    alt: 'MK Silver Hub Minimal Silver Band and Floating Necklaces',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      aria-label="MK Silver Hub Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(580px, 88vh, 860px)',
        minHeight: '560px',
        backgroundColor: '#F8F7F3',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Images with Crossfade */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover',
            backgroundPosition: idx === 0 ? 'right center' : 'center center',
            backgroundRepeat: 'no-repeat',
            opacity: idx === currentSlide ? 1 : 0,
            transform: idx === currentSlide ? 'scale(1)' : 'scale(1.03)',
            transition: 'opacity 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
            zIndex: 1,
          }}
        >
          {/* Subtle gradient vignette to guarantee high typography contrast on the left */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(248, 247, 243, 0.6) 0%, rgba(248, 247, 243, 0.2) 40%, rgba(248, 247, 243, 0) 65%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      ))}

      {/* Main Content Container */}
      <div
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
        <div style={{ maxWidth: '620px', paddingTop: '20px' }}>
          {/* Small Category / Metal Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#6F6F6A',
              marginBottom: '16px',
            }}
          >
            <span style={{ width: '18px', height: '1px', backgroundColor: '#111111' }} />
            <span>{slide.label}</span>
          </div>

          {/* Large Hero Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2.6rem, 5.6vw, 4.8rem)',
              lineHeight: 1.02,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#111111',
              margin: '0 0 20px 0',
              textTransform: 'uppercase',
            }}
          >
            <span>{slide.headingPart1}</span>
            <br />
            <span>{slide.headingPart2}</span>
            <br />
            <span>{slide.headingPart3}</span>
          </h1>

          {/* Supporting Copy */}
          <p
            style={{
              fontFamily: 'var(--font-body), "Jost", -apple-system, sans-serif',
              fontSize: 'clamp(0.95rem, 1.25vw, 1.12rem)',
              lineHeight: 1.55,
              color: '#252525',
              margin: '0 0 34px 0',
              maxWidth: '480px',
              fontWeight: 400,
            }}
          >
            {slide.description}
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(14px, 2vw, 24px)',
              flexWrap: 'wrap',
            }}
          >
            {/* Primary Black Button */}
            <Link
              href={slide.primaryCtaLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '16px 32px',
                textDecoration: 'none',
                borderRadius: '0px',
                transition: 'background-color 0.25s ease, transform 0.2s ease',
              }}
              className="hero-primary-btn"
            >
              <span>{slide.primaryCtaText}</span>
              <ArrowRight size={14} />
            </Link>

            {/* Secondary Text Link */}
            <Link
              href={slide.secondaryCtaLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#111111',
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '10px 4px',
                position: 'relative',
                transition: 'opacity 0.2s ease',
              }}
              className="hero-secondary-btn"
            >
              <span>{slide.secondaryCtaText}</span>
            </Link>
          </div>
        </div>

        {/* Bottom Slide Controller Bar (matches reference image: 01 —— 02 —— 03 with arrow circles) */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: 'clamp(20px, 5vw, 64px)',
            right: 'clamp(20px, 5vw, 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 15,
          }}
        >
          {/* Slide Indicator Line: 01 —— 02 —— 03 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: '#111111',
            }}
          >
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  color: idx === currentSlide ? '#111111' : '#BFC1C4',
                  fontWeight: idx === currentSlide ? 600 : 400,
                  transition: 'color 0.2s ease',
                }}
              >
                <span>{`0${idx + 1}`}</span>
                {idx < HERO_SLIDES.length - 1 && (
                  <span
                    style={{
                      width: '32px',
                      height: '1px',
                      backgroundColor: idx === currentSlide ? '#111111' : '#D8D5CE',
                      transition: 'background-color 0.2s ease',
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Arrow Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={prevSlide}
              aria-label="Previous Hero Slide"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid #E8E7E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111111',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="hero-arrow-btn"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Hero Slide"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid #E8E7E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111111',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="hero-arrow-btn"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-primary-btn:hover {
          background-color: #252525 !important;
          transform: translateY(-1px);
        }
        .hero-secondary-btn:hover {
          opacity: 0.7;
        }
        .hero-arrow-btn:hover {
          background-color: #111111 !important;
          color: #FFFFFF !important;
          border-color: #111111 !important;
        }
        @media (max-width: 768px) {
          .hero-arrow-btn {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
