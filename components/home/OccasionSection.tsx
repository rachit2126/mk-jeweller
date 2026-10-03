'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface OccasionCardData {
  number: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  mobileImage?: string;
  alt: string;
}

const DEFAULT_CARDS: OccasionCardData[] = [
  {
    number: '01',
    title: 'EVERYDAY',
    description: 'Quiet pieces for everyday expression.',
    cta: 'EXPLORE',
    href: '/shop?occasion=everyday',
    image: '/uploads/optimized/img-1791041170014-qsq4vd-everyday-oxidised-silver-lifes-1200w.webp',
    mobileImage: '/uploads/optimized/img-1791041170014-qsq4vd-everyday-oxidised-silver-lifes-800w.webp',
    alt: 'MK Silver Hub Everyday Subtle Oxidised Silver Jewellery',
  },
  {
    number: '02',
    title: 'DATE NIGHT',
    description: 'Refined silver designed to catch the light.',
    cta: 'EXPLORE',
    href: '/shop?occasion=date-night',
    image: '/uploads/optimized/img-1791041170884-v62h01-date-night-oxidised-silver-por-1200w.webp',
    mobileImage: '/uploads/optimized/img-1791041170884-v62h01-date-night-oxidised-silver-por-800w.webp',
    alt: 'MK Silver Hub Date Night Antique Silver Collar and Drop Earrings',
  },
  {
    number: '03',
    title: 'FESTIVE',
    description: 'Statement pieces for moments worth celebrating.',
    cta: 'EXPLORE',
    href: '/shop?occasion=festive',
    image: '/uploads/optimized/img-1791041171737-zhwjtm-festive-oxidised-silver-statem-1200w.webp',
    mobileImage: '/uploads/optimized/img-1791041171737-zhwjtm-festive-oxidised-silver-statem-800w.webp',
    alt: 'MK Silver Hub Festive Statement Oxidised Hasli and Jhumkas',
  },
  {
    number: '04',
    title: 'BRIDAL',
    description: 'Timeless silver for unforgettable beginnings.',
    cta: 'EXPLORE',
    href: '/shop?occasion=bridal',
    image: '/uploads/optimized/img-1791041172584-0o05ay-bridal-oxidised-polki-silver-r-1200w.webp',
    mobileImage: '/uploads/optimized/img-1791041172584-0o05ay-bridal-oxidised-polki-silver-r-800w.webp',
    alt: 'MK Silver Hub Regal Polki Kundan Silver Bridal Sets',
  },
];

export default function OccasionSection() {
  const [cards, setCards] = useState<OccasionCardData[]>(DEFAULT_CARDS);
  const [sectionTitle, setSectionTitle] = useState('JEWELLERY FOR EVERY MOMENT');
  const [sectionSubtitle, setSectionSubtitle] = useState(
    'Silver pieces for everyday rituals, celebrations and unforgettable moments.'
  );
  const [eyebrow, setEyebrow] = useState('CURATED FOR YOUR STORY');
  const [loading, setLoading] = useState(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchOccasionData = async () => {
    try {
      const res = await fetch('/api/homepage', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch homepage data');
      const data = await res.json();
      const sec = data.sections?.find((s: any) => s.id === 'sec-occasions' || s.type === 'occasions');

      if (sec) {
        if (sec.title) setSectionTitle(sec.title);
        if (sec.subtitle) setSectionSubtitle(sec.subtitle);
        if (sec.customData?.eyebrow) setEyebrow(sec.customData.eyebrow);

        if (Array.isArray(sec.customData?.cards) && sec.customData.cards.length > 0) {
          setCards(sec.customData.cards);
        }
      }
    } catch (err) {
      console.warn('[OccasionSection] Using verified oxidised silver fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccasionData();

    const handleUpdate = () => fetchOccasionData();
    window.addEventListener('mk:homepage-updated', handleUpdate);
    window.addEventListener('mk:category-updated', handleUpdate);
    return () => {
      window.removeEventListener('mk:homepage-updated', handleUpdate);
      window.removeEventListener('mk:category-updated', handleUpdate);
    };
  }, []);

  // Subtle intersection entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Jewellery For Every Moment"
      className={`moment-section ${inView ? 'is-in-view' : ''}`}
    >
      <div className="moment-container">
        {/* Editorial Section Header */}
        <header className="moment-header">
          <div className="moment-eyebrow-wrap">
            <span className="moment-eyebrow-line" />
            <span className="moment-eyebrow">{eyebrow}</span>
            <span className="moment-eyebrow-line" />
          </div>

          <h2 className="moment-title">
            <span className="title-row">JEWELLERY</span>
            <span className="title-row">FOR EVERY MOMENT</span>
          </h2>

          <p className="moment-subtitle">{sectionSubtitle}</p>
        </header>

        {/* Editorial Asymmetric Cards Layout */}
        <div className="moment-cards-track">
          {cards.map((card, idx) => (
            <div
              key={card.number || card.title}
              className={`moment-card card-variant-${idx + 1}`}
              style={{ '--card-delay': `${idx * 0.1}s` } as React.CSSProperties}
            >
              <div className="card-media">
                <Image
                  src={card.image}
                  alt={card.alt || `MK Silver Hub ${card.title} Silver Jewellery`}
                  fill
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 25vw"
                  className="card-image"
                  priority={idx < 2}
                />
                <div className="card-gradient" />
              </div>

              {/* Number Badge Top Left */}
              <div className="card-badge">
                <span className="card-num">{card.number}</span>
              </div>

              {/* Editorial Card Body */}
              <div className="card-body">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.description}</p>

                <div className="card-cta-row">
                  <span className="cta-label">{card.cta || 'EXPLORE'}</span>
                  <span className="cta-arrow-circle">
                    <ArrowRight size={13} className="cta-arrow-icon" />
                  </span>
                </div>
              </div>

              {/* Interactive Click Overlay */}
              <Link
                href={card.href}
                className="card-link-overlay"
                aria-label={`Explore ${card.title} silver collection`}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .moment-section {
          width: 100%;
          background-color: #FFFFFF;
          padding: clamp(64px, 8vw, 108px) 0 clamp(72px, 8vw, 112px);
          position: relative;
          border-top: 1px solid #F0EFEB;
        }

        .moment-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(18px, 4vw, 56px);
        }

        /* Header */
        .moment-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto clamp(36px, 5vw, 60px);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
                      transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .is-in-view .moment-header {
          opacity: 1;
          transform: translateY(0);
        }

        .moment-eyebrow-wrap {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .moment-eyebrow-line {
          width: 28px;
          height: 1px;
          background-color: #BFC1C4;
        }

        .moment-eyebrow {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6F6F6A;
        }

        .moment-title {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(2.3rem, 4.4vw, 3.8rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          color: #111111;
          line-height: 1.08;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
        }

        .title-row {
          display: block;
        }

        .moment-subtitle {
          font-family: var(--font-body), "Jost", -apple-system, sans-serif;
          font-size: clamp(0.92rem, 1.1vw, 1.05rem);
          line-height: 1.65;
          color: #6F6F6A;
          margin: 0 auto;
          max-width: 580px;
        }

        /* 4 Editorial Cards Grid with intentional height variations */
        .moment-cards-track {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 2vw, 24px);
          align-items: end;
        }

        .moment-card {
          position: relative;
          background-color: #F8F7F3;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #E8E7E2;
          box-shadow: 0 4px 20px rgba(17, 17, 17, 0.03);
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.4s ease,
                      box-shadow 0.5s ease;
          opacity: 0;
          transform: translateY(28px);
        }

        .is-in-view .moment-card {
          opacity: 1;
          transform: translateY(0);
          transition-delay: var(--card-delay, 0s);
        }

        /* Editorial Height Variation on Desktop */
        .card-variant-1 {
          height: 440px;
        }
        .card-variant-2 {
          height: 500px;
        }
        .card-variant-3 {
          height: 460px;
        }
        .card-variant-4 {
          height: 520px;
        }

        .moment-card:hover {
          border-color: #BFC1C4;
          box-shadow: 0 16px 36px rgba(17, 17, 17, 0.1);
        }

        .card-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        :global(.card-image) {
          object-fit: cover;
          transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .moment-card:hover :global(.card-image) {
          transform: scale(1.045);
        }

        .card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(17, 17, 17, 0) 30%,
            rgba(17, 17, 17, 0.25) 55%,
            rgba(17, 17, 17, 0.88) 95%
          );
          transition: background 0.4s ease;
          pointer-events: none;
        }

        .moment-card:hover .card-gradient {
          background: linear-gradient(
            180deg,
            rgba(17, 17, 17, 0.05) 25%,
            rgba(17, 17, 17, 0.35) 50%,
            rgba(17, 17, 17, 0.92) 95%
          );
        }

        /* Number Badge */
        .card-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 2;
          background-color: rgba(17, 17, 17, 0.4);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 10px;
          border-radius: 9999px;
        }

        .card-num {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #FFFFFF;
        }

        /* Card Content */
        .card-body {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: clamp(18px, 2.2vw, 26px);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .card-title {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(1.35rem, 1.8vw, 1.65rem);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin: 0 0 6px;
          line-height: 1.15;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }

        .card-desc {
          font-family: var(--font-body), "Jost", -apple-system, sans-serif;
          font-size: 0.8rem;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-height: 2.9em;
        }

        .card-cta-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #FFFFFF;
        }

        .cta-label {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.72rem;
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
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      background-color 0.3s ease;
        }

        .moment-card:hover .cta-arrow-circle {
          transform: translateX(4px);
          background-color: #FFFFFF;
          color: #111111;
        }

        /* Overlay Link */
        .card-link-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          cursor: pointer;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .moment-cards-track {
            grid-template-columns: repeat(2, 1fr);
          }
          .card-variant-1,
          .card-variant-2,
          .card-variant-3,
          .card-variant-4 {
            height: 440px;
          }
        }

        @media (max-width: 640px) {
          .moment-section {
            padding: 48px 0 56px;
          }
          .moment-header {
            text-align: left;
            margin-bottom: 28px;
          }
          .moment-eyebrow-wrap {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
          .moment-eyebrow-line:last-child {
            display: none;
          }
          .moment-title {
            font-size: clamp(2rem, 8.5vw, 2.5rem);
            line-height: 1.1;
          }
          .moment-subtitle {
            margin: 0;
            font-size: 0.9rem;
          }

          /* Mobile Horizontal Swipe Carousel */
          .moment-cards-track {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 14px;
            padding-bottom: 16px;
            padding-right: 24px;
            margin-right: -18px;
            scrollbar-width: none;
          }
          .moment-cards-track::-webkit-scrollbar {
            display: none;
          }
          .moment-card {
            flex: 0 0 82vw;
            max-width: 330px;
            height: 440px;
            scroll-snap-align: start;
            scroll-snap-stop: always;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .moment-header,
          .moment-card,
          :global(.card-image),
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
