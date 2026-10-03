'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeritageData {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  image?: string;
  mobileImage?: string;
  alt?: string;
}

const DEFAULT_HERITAGE: HeritageData = {
  eyebrow: 'HERITAGE & CRAFTSMANSHIP',
  title: 'ROOTED IN SILVER.',
  subtitle: 'HERITAGE & CRAFTSMANSHIP',
  description:
    'Handcrafted silver jewellery inspired by Indian artistry, detailed textures and timeless forms.',
  ctaText: 'DISCOVER OUR CRAFT',
  ctaUrl: '/about',
  image: '/uploads/optimized/img-1791041173112-6or73l-heritage-craftsmanship-oxidise-1200w.webp',
  mobileImage: '/uploads/optimized/img-1791041173112-6or73l-heritage-craftsmanship-oxidise-800w.webp',
  alt: 'Handcrafted oxidised silver jewellery craftsmanship in Jaipur',
};

export default function RootedInCraftSection() {
  const [data, setData] = useState<HeritageData>(DEFAULT_HERITAGE);
  const [inView, setInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchHeritageData = async () => {
    try {
      const res = await fetch('/api/homepage', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch homepage data');
      const json = await res.json();
      const sec = json.sections?.find(
        (s: any) => s.id === 'sec-heritage' || s.type === 'heritage' || s.id === 'sec-editorial'
      );

      if (sec) {
        setData({
          eyebrow: sec.eyebrow || sec.subtitle || DEFAULT_HERITAGE.eyebrow,
          title: sec.title || DEFAULT_HERITAGE.title,
          subtitle: sec.subtitle || DEFAULT_HERITAGE.subtitle,
          description: sec.description || DEFAULT_HERITAGE.description,
          ctaText: sec.ctaText || DEFAULT_HERITAGE.ctaText,
          ctaUrl: sec.ctaUrl || DEFAULT_HERITAGE.ctaUrl,
          image: sec.image || DEFAULT_HERITAGE.image,
          mobileImage: sec.mobileImage || DEFAULT_HERITAGE.mobileImage,
          alt: sec.alt || DEFAULT_HERITAGE.alt,
        });
      }
    } catch (err) {
      console.warn('[RootedInCraftSection] Using verified oxidised silver craftsmanship fallback:', err);
    }
  };

  useEffect(() => {
    fetchHeritageData();

    const handleUpdate = () => fetchHeritageData();
    window.addEventListener('mk:homepage-updated', handleUpdate);
    return () => window.removeEventListener('mk:homepage-updated', handleUpdate);
  }, []);

  // Intersection observer for subtle entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Heritage and Craftsmanship"
      className={`heritage-section ${inView ? 'is-in-view' : ''}`}
    >
      <div className="heritage-container">
        <div className="heritage-grid">
          {/* LEFT: Charcoal Editorial Storytelling */}
          <div className="heritage-content-col">
            <div className="heritage-eyebrow-row">
              <span className="eyebrow-accent" />
              <span className="heritage-eyebrow">{data.eyebrow || 'HERITAGE & CRAFTSMANSHIP'}</span>
            </div>

            <h2 className="heritage-heading">
              <span className="heading-row">ROOTED IN</span>
              <span className="heading-row silver-highlight">SILVER.</span>
            </h2>

            <p className="heritage-desc">{data.description}</p>

            <div className="heritage-trust-badge">
              <Sparkles size={13} className="trust-icon" />
              <span>Jaipur Master Silversmiths • Certified 925 Hallmark</span>
            </div>

            <div className="heritage-cta-wrap">
              <Link
                href={data.ctaUrl || '/about'}
                className="heritage-cta-link"
                aria-label="Discover MK Silver Hub craft and heritage"
              >
                <span className="cta-text">{data.ctaText || 'DISCOVER OUR CRAFT'}</span>
                <span className="cta-arrow-circle">
                  <ArrowRight size={13} className="cta-arrow-icon" />
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT: Large Premium Editorial Craftsmanship Image */}
          <div className="heritage-media-col">
            <div className="heritage-image-frame">
              <Image
                src={data.image || DEFAULT_HERITAGE.image!}
                alt={data.alt || 'Handcrafted oxidised silver jewellery craftsmanship'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`heritage-img ${imageLoaded ? 'is-loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
              <div className="heritage-vignette" />

              {/* Discreet Caption Badge */}
              <div className="heritage-caption-badge">
                <span className="caption-text">FINE 925 STERLING • HAND-CHISELED FILIGREE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .heritage-section {
          width: 100%;
          background-color: #0E0E0E;
          color: #FFFFFF;
          position: relative;
          overflow: hidden;
          border-top: 1px solid #1F1F1F;
          border-bottom: 1px solid #1F1F1F;
        }

        .heritage-container {
          max-width: 1440px;
          margin: 0 auto;
        }

        .heritage-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 520px;
          align-items: stretch;
        }

        /* Left Editorial Column */
        .heritage-content-col {
          padding: clamp(48px, 6.5vw, 96px) clamp(24px, 5vw, 72px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          background-color: #0E0E0E;
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
                      transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .is-in-view .heritage-content-col {
          opacity: 1;
          transform: translateY(0);
        }

        .heritage-eyebrow-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .eyebrow-accent {
          width: 24px;
          height: 1px;
          background-color: #BFC1C4;
        }

        .heritage-eyebrow {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #BFC1C4;
        }

        .heritage-heading {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(2.4rem, 4.4vw, 3.8rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          color: #FFFFFF;
          margin: 0 0 20px;
          line-height: 1.08;
          display: flex;
          flex-direction: column;
        }

        .heading-row {
          display: block;
        }

        .silver-highlight {
          color: #E2E4E6;
        }

        .heritage-desc {
          font-family: var(--font-body), "Jost", -apple-system, sans-serif;
          font-size: clamp(0.92rem, 1.1vw, 1.05rem);
          line-height: 1.7;
          color: #A0A09C;
          max-width: 480px;
          margin: 0 0 26px;
        }

        .heritage-trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #D2D4D6;
          margin-bottom: 32px;
        }

        :global(.trust-icon) {
          color: #FFFFFF;
        }

        .heritage-cta-wrap {
          margin-top: 4px;
        }

        .heritage-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #FFFFFF;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.45);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .heritage-cta-link:hover {
          border-bottom-color: #FFFFFF;
        }

        .cta-text {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FFFFFF;
        }

        .cta-arrow-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          color: #FFFFFF;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      background-color 0.3s ease;
        }

        .heritage-cta-link:hover .cta-arrow-circle {
          transform: translateX(4px);
          background-color: #FFFFFF;
          color: #111111;
        }

        /* Right Media Column */
        .heritage-media-col {
          position: relative;
          width: 100%;
          min-height: 480px;
          background-color: #141414;
        }

        .heritage-image-frame {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        :global(.heritage-img) {
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .heritage-section:hover :global(.heritage-img) {
          transform: scale(1.03);
        }

        .heritage-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(14, 14, 14, 0.5) 0%,
            rgba(14, 14, 14, 0) 25%
          );
          pointer-events: none;
        }

        .heritage-caption-badge {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 2;
          background-color: rgba(14, 14, 14, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 6px 12px;
          border-radius: 9999px;
        }

        .caption-text {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .heritage-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          /* On mobile: IMAGE on top, content below */
          .heritage-media-col {
            order: 1;
            height: clamp(300px, 50vw, 420px);
            min-height: auto;
            position: relative;
          }
          .heritage-content-col {
            order: 2;
            padding: 44px 20px 52px;
          }
          .heritage-vignette {
            background: linear-gradient(
              180deg,
              rgba(14, 14, 14, 0) 70%,
              rgba(14, 14, 14, 0.6) 100%
            );
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .heritage-content-col,
          :global(.heritage-img),
          .cta-arrow-circle {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
