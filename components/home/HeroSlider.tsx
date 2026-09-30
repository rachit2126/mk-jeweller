'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from 'lucide-react';

interface SlideData {
  id: number;
  mediaType: 'video' | 'image';
  videoSrc?: string;
  image: string;
  thumbImage: string;
  alt: string;
  objectPosition: string;
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  subtitle: string;
  primaryBtn: { text: string; href: string };
  secondaryBtn: { text: string; href: string };
}

const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    mediaType: 'video',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-sparkling-jewelry-41584-large.mp4',
    image: '/images/products/necklaces-emerald-polki-bridal-set-01.png',
    thumbImage: '/images/products/necklaces-emerald-polki-bridal-set-01.png',
    alt: 'Contemporary Indian model in draped attire wearing handcrafted 925 sterling silver bridal polki jewellery',
    objectPosition: 'center 24%',
    eyebrow: 'DISTINCTIVE · MODERN · REFINED',
    headingLine1: 'Designed To Be',
    headingLine2: 'Remembered',
    subtitle:
      'Distinctive 925 sterling silver pieces sculpted with modern poise, crafted to make every moment feel special.',
    primaryBtn: { text: 'Shop Collection', href: '/shop' },
    secondaryBtn: { text: 'Explore New Arrivals', href: '/shop?badge=NEW%20ARRIVAL' },
  },
  {
    id: 2,
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1400&auto=format&fit=crop',
    thumbImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop',
    alt: 'Masterfully crafted 925 sterling silver solitaire ring in soft rose lighting',
    objectPosition: 'center 46%',
    eyebrow: 'TIMELESS · ELEGANT · YOURS',
    headingLine1: 'Jewellery That Tells',
    headingLine2: 'Your Story',
    subtitle:
      "From everyday essentials to extraordinary statements, discover 925 sterling silver jewellery crafted to celebrate you.",
    primaryBtn: { text: 'Shop Collection', href: '/collections/rings' },
    secondaryBtn: { text: 'Explore New Arrivals', href: '/collections' },
  },
  {
    id: 3,
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1400&auto=format&fit=crop',
    thumbImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=300&auto=format&fit=crop',
    alt: 'Handcrafted floral 925 sterling silver earrings',
    objectPosition: 'center 38%',
    eyebrow: 'HANDCRAFTED · ARTISANAL · EXCLUSIVE',
    headingLine1: 'Pure Elegance in',
    headingLine2: 'Every Detail',
    subtitle:
      'Meticulously set 925 silver adorned with radiant hand-cut stones, reflecting heritage craftsmanship with a modern spirit.',
    primaryBtn: { text: 'Shop Collection', href: '/collections/earrings' },
    secondaryBtn: { text: 'Explore New Arrivals', href: '/craftsmanship' },
  },
];

const AUTOPLAY_INTERVAL = 6500;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Autoplay management
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  // Video playback coordination
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const idx = Number(key);
      const video = videoRefs.current[idx];
      if (!video) return;
      if (idx === current && isPlaying && !prefersReducedMotion) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [current, isPlaying, prefersReducedMotion]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = HERO_SLIDES[current];

  // Motion variants for sequential staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.14,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.28, ease: 'easeOut' as const },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      aria-label="Featured Collection Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        outline: 'none',
        height: 'clamp(580px, 86svh, 840px)',
        backgroundColor: '#FFE3D3',
        overflow: 'hidden',
        color: '#3B2B2B',
        userSelect: 'none',
      }}
    >
      {/* Background Media Slides (Images & Autoplaying Loop Videos) */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              padding: 0,
              border: 'none',
              opacity: isActive ? 1 : 0,
              transition: prefersReducedMotion
                ? 'opacity 0.4s ease'
                : 'opacity 0.85s cubic-bezier(0.25, 1, 0.36, 1)',
              zIndex: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            <motion.div
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              animate={
                prefersReducedMotion
                  ? { scale: 1 }
                  : { scale: isActive ? 1 : 1.045 }
              }
              transition={{
                duration: 6.5,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              {/* High-Res Image Poster / Fallback */}
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={idx === 0}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: slide.objectPosition,
                  display: 'block',
                  margin: 0,
                  border: 'none',
                  zIndex: 1,
                }}
              />

              {/* Video Element if mediaType is video */}
              {slide.mediaType === 'video' && slide.videoSrc && (
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={idx === 0 ? 'auto' : 'metadata'}
                  poster={slide.image}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: slide.objectPosition,
                    display: 'block',
                    margin: 0,
                    border: 'none',
                    zIndex: 2,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                  }}
                >
                  <source src={slide.videoSrc} type="video/mp4" />
                </video>
              )}
            </motion.div>

            {/* Soft Warm Peach/Rose Vignette Atmosphere (not too dark) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                background:
                  'linear-gradient(to right, rgba(59, 43, 43, 0.64) 0%, rgba(59, 43, 43, 0.32) 48%, rgba(246, 214, 217, 0.18) 85%), linear-gradient(to top, rgba(59, 43, 43, 0.45) 0%, transparent 42%)',
              }}
            />
          </div>
        );
      })}

      {/* Center Left Arrow (<) */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hero-side-nav-btn prev-btn"
        style={{
          position: 'absolute',
          left: 'clamp(14px, 2.2vw, 32px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          transition: 'all 0.22s ease',
          boxShadow: '0 4px 14px rgba(59, 43, 43, 0.12)',
        }}
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>

      {/* Center Right Arrow (>) */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="hero-side-nav-btn next-btn"
        style={{
          position: 'absolute',
          right: 'clamp(14px, 2.2vw, 32px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          transition: 'all 0.22s ease',
          boxShadow: '0 4px 14px rgba(59, 43, 43, 0.12)',
        }}
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Main Editorial Content Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'clamp(95px, 14vh, 130px)',
          paddingBottom: '80px',
          maxWidth: '1540px',
          margin: '0 auto',
          paddingLeft: 'clamp(1.5rem, 5vw, 4.5rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4.5rem)',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              {/* 1. Eyebrow */}
              <motion.p
                variants={itemVariants}
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.24em',
                  color: '#FFE3D3',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  lineHeight: 1,
                  textShadow: '0 1px 8px rgba(59, 43, 43, 0.4)',
                }}
              >
                {activeSlide.eyebrow}
              </motion.p>

              {/* 2. Main Heading (Soft Line Reveal) */}
              <motion.h1
                variants={headingVariants}
                style={{
                  fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(2.6rem, 5.4vw, 4.8rem)',
                  fontWeight: 400,
                  lineHeight: 1.08,
                  color: '#FFFFFF',
                  marginBottom: '20px',
                  letterSpacing: '-0.01em',
                  textShadow: '0 2px 16px rgba(59, 43, 43, 0.45)',
                }}
              >
                <span>{activeSlide.headingLine1}</span>
                <br />
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{activeSlide.headingLine2}</span>
              </motion.h1>

              {/* 3. Supporting Description */}
              <motion.p
                variants={itemVariants}
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: 'clamp(0.92rem, 1.2vw, 1.08rem)',
                  color: 'rgba(255, 249, 243, 0.94)',
                  lineHeight: 1.65,
                  maxWidth: '520px',
                  marginBottom: '36px',
                  textShadow: '0 1px 8px rgba(59, 43, 43, 0.35)',
                }}
              >
                {activeSlide.subtitle}
              </motion.p>

              {/* 4. Action Buttons */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Primary Button (#B76E79) */}
                <Link
                  href={activeSlide.primaryBtn.href}
                  className="hero-primary-cta"
                >
                  <span>{activeSlide.primaryBtn.text}</span>
                  <ArrowRight size={14} className="cta-arrow" />
                </Link>

                {/* Secondary Button */}
                <Link
                  href={activeSlide.secondaryBtn.href}
                  className="hero-secondary-cta"
                >
                  <span>{activeSlide.secondaryBtn.text}</span>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Indicators & Media Thumbnail Strip Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '26px',
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '0 clamp(1.5rem, 5vw, 4.5rem)',
          maxWidth: '1540px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {/* Minimal Slide Indicators: 01 —— 02 —— 03 */}
        <div
          role="tablist"
          aria-label="Slide selectors"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '0.76rem',
            letterSpacing: '0.12em',
            pointerEvents: 'auto',
          }}
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={slide.id}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${slide.id}`}
                onClick={() => setCurrent(idx)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '6px 2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'color 0.25s ease',
                }}
              >
                <span>0{slide.id}</span>
                {idx < HERO_SLIDES.length - 1 && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: isActive ? '34px' : '16px',
                      height: '1px',
                      backgroundColor: isActive ? '#B76E79' : 'rgba(255, 255, 255, 0.35)',
                      transition: 'width 0.35s ease, background-color 0.35s ease',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* HERO MEDIA THUMBNAIL STRIP */}
        <div
          className="hero-thumbnail-strip"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'auto',
          }}
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Switch to slide ${slide.id}: ${slide.alt}`}
                className={`hero-thumb-btn ${isActive ? 'active' : ''}`}
                style={{
                  position: 'relative',
                  width: '56px',
                  height: '46px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  padding: 0,
                  backgroundColor: '#FFE3D3',
                  border: isActive
                    ? '2px solid #B76E79'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive
                    ? '0 4px 16px rgba(183, 110, 121, 0.45)'
                    : '0 2px 8px rgba(59, 43, 43, 0.2)',
                  transition: 'all 0.22s ease',
                  flexShrink: 0,
                }}
              >
                <Image
                  src={slide.thumbImage}
                  alt={slide.alt}
                  fill
                  sizes="60px"
                  style={{
                    objectFit: 'cover',
                    objectPosition: slide.objectPosition,
                    opacity: isActive ? 1 : 0.85,
                    transition: 'opacity 0.2s ease',
                  }}
                />

                {slide.mediaType === 'video' && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.24)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(59, 43, 43, 0.65)',
                        backdropFilter: 'blur(3px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Play size={8} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '1px' }} />
                    </div>
                  </div>
                )}
              </button>
            );
          })}

          {/* Autoplay Pause / Play button */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className="hero-pause-btn"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              marginLeft: '4px',
              flexShrink: 0,
              transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
            }}
          >
            {isPlaying ? <Pause size={12} strokeWidth={1.5} /> : <Play size={12} strokeWidth={1.5} style={{ marginLeft: '1px' }} />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .hero-primary-cta {
          background-color: #B76E79;
          color: #FFFFFF;
          border: 1px solid #B76E79;
          border-radius: 999px;
          padding: 13px 28px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.24s ease;
          box-shadow: 0 6px 20px rgba(183, 110, 121, 0.35);
        }
        .hero-primary-cta:hover {
          background-color: #9C5762;
          border-color: #9C5762;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(183, 110, 121, 0.45);
        }
        .hero-primary-cta:hover .cta-arrow {
          transform: translateX(4px);
        }
        .cta-arrow {
          transition: transform 0.2s ease;
        }
        .hero-secondary-cta {
          background-color: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 999px;
          padding: 13px 28px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.24s ease;
          backdrop-filter: blur(6px);
        }
        .hero-secondary-cta:hover {
          border-color: #FFFFFF;
          background-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }
        .hero-side-nav-btn:hover {
          background-color: rgba(255, 255, 255, 0.45) !important;
          border-color: #FFFFFF !important;
          transform: translateY(-50%) scale(1.06) !important;
        }
        .hero-thumb-btn:hover {
          border-color: #B76E79 !important;
          transform: scale(1.06) !important;
        }
        .hero-pause-btn:hover {
          background-color: rgba(255, 255, 255, 0.4) !important;
          border-color: #FFFFFF !important;
          transform: scale(1.05);
        }
        @media (max-width: 900px) {
          .hero-side-nav-btn {
            display: none !important;
          }
          .hero-thumbnail-strip {
            gap: 6px !important;
          }
          .hero-thumb-btn {
            width: 44px !important;
            height: 38px !important;
          }
        }
        @media (max-width: 640px) {
          .cta-arrow {
            display: inline-block;
          }
          .hero-thumbnail-strip {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
