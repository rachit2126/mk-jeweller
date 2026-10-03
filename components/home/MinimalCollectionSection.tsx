'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DbCategory } from '@/lib/db/types';

interface DisplayCategoryCard {
  slug: string;
  name: string;
  defaultTitle: string;
  description: string;
  image: string;
  href: string;
  productCount?: number;
}

const TARGET_SLUGS = ['rings', 'necklaces', 'earrings'];

const CURATED_METADATA: Record<string, { title: string; defaultDesc: string; fallbackImage: string }> = {
  rings: {
    title: 'RINGS',
    defaultDesc: 'Mandala bands, floral engravings and tribal antique silver.',
    fallbackImage: '/images/category/rings.jpg',
  },
  necklaces: {
    title: 'NECKLACES',
    defaultDesc: 'Jaipur royal polki chokers, temple motifs and oxidised chains.',
    fallbackImage: '/images/category/necklaces.jpg',
  },
  earrings: {
    title: 'EARRINGS',
    defaultDesc: 'Handcrafted royal chandbalis, dome jhumkas and daily studs.',
    fallbackImage: '/images/category/earrings.jpg',
  },
};

export default function MinimalCollectionSection() {
  const [categories, setCategories] = useState<DisplayCategoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      const allCats: DbCategory[] = data.categories || [];

      // Extract Rings, Necklaces, Earrings in exact order
      const cards: DisplayCategoryCard[] = TARGET_SLUGS.map((slug) => {
        const found = allCats.find((c) => c.slug.toLowerCase() === slug);
        const meta = CURATED_METADATA[slug];

        return {
          slug,
          name: found?.name ? found.name.toUpperCase() : meta.title,
          defaultTitle: meta.title,
          description: found?.description?.trim() || meta.defaultDesc,
          image: found?.image || meta.fallbackImage,
          href: `/shop?category=${found?.slug || slug}`,
          productCount: found?.productCount,
        };
      });

      setCategories(cards);
    } catch (err) {
      console.error('[MinimalCollectionSection] Category fetch error:', err);
      // Fallback with verified oxidised silver imagery from the project
      const fallbackCards: DisplayCategoryCard[] = TARGET_SLUGS.map((slug) => ({
        slug,
        name: CURATED_METADATA[slug].title,
        defaultTitle: CURATED_METADATA[slug].title,
        description: CURATED_METADATA[slug].defaultDesc,
        image: CURATED_METADATA[slug].fallbackImage,
        href: `/shop?category=${slug}`,
      }));
      setCategories(fallbackCards);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Listen for live category updates from admin drawer
    const handleUpdate = () => {
      fetchCategories();
    };
    window.addEventListener('mk:category-updated', handleUpdate);
    return () => window.removeEventListener('mk:category-updated', handleUpdate);
  }, []);

  // Intersection observer for subtle staggered entrance
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
      aria-label="The Oxidised Collection"
      className={`oxidised-section ${inView ? 'is-in-view' : ''}`}
    >
      <div className="oxidised-container">
        <div className="oxidised-grid">
          {/* LEFT: Editorial Introduction Block */}
          <div className="oxidised-intro-col">
            <div className="oxidised-eyebrow-row">
              <span className="oxidised-eyebrow-accent" />
              <span className="oxidised-eyebrow">THE OXIDISED COLLECTION</span>
            </div>

            <h2 className="oxidised-heading">
              <span className="oxidised-heading-line line-1">ROOTED IN SILVER.</span>
              <span className="oxidised-heading-line line-2">CRAFTED TO STAND OUT.</span>
            </h2>

            <p className="oxidised-description">
              Discover bold oxidised silver jewellery with handcrafted textures, intricate detailing
              and a distinctly Indian character.
            </p>

            <div className="oxidised-hallmark-badge">
              <Sparkles size={13} className="hallmark-icon" />
              <span>Certified 925 Sterling • Jaipur Artisan Craft</span>
            </div>

            <div className="oxidised-cta-wrap">
              <Link href="/shop" className="oxidised-cta-link" aria-label="Explore the oxidised collection">
                <span className="cta-text">EXPLORE COLLECTION</span>
                <span className="cta-arrow-circle">
                  <ArrowRight size={14} className="cta-arrow-icon" />
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT: 3 Premium Category Cards (Rings, Necklaces, Earrings) */}
          <div className="oxidised-cards-col">
            {loading ? (
              // Skeleton Loader
              <div className="cards-grid">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="card-skeleton" />
                ))}
              </div>
            ) : (
              <div className="cards-grid">
                {categories.map((card, idx) => (
                  <div
                    key={card.slug}
                    className="category-card"
                    style={{ '--card-index': idx } as React.CSSProperties}
                  >
                    <div className="card-media-wrapper">
                      <Image
                        src={card.image}
                        alt={`MK Silver Hub Fine Oxidised ${card.name}`}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 33vw, 25vw"
                        className="card-image"
                        priority={idx === 0}
                      />
                      <div className="card-gradient-overlay" />
                    </div>

                    <div className="card-content">
                      <div className="card-tag">
                        <span>OXIDISED 925</span>
                        {card.productCount !== undefined && card.productCount > 0 && (
                          <span className="product-count">({card.productCount})</span>
                        )}
                      </div>

                      <h3 className="card-title">{card.name}</h3>

                      <p className="card-desc">{card.description}</p>

                      <div className="card-explore-row">
                        <span className="explore-label">Explore</span>
                        <ArrowRight size={14} className="explore-arrow" />
                      </div>
                    </div>

                    <Link
                      href={card.href}
                      className="card-click-overlay"
                      aria-label={`Explore ${card.name} category`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .oxidised-section {
          width: 100%;
          background-color: #F8F7F3;
          border-top: 1px solid #E8E7E2;
          border-bottom: 1px solid #E8E7E2;
          padding: clamp(56px, 7vw, 100px) 0;
          position: relative;
          overflow: hidden;
        }

        .oxidised-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(16px, 3.5vw, 48px);
        }

        .oxidised-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: clamp(32px, 4vw, 56px);
          align-items: center;
        }

        /* Left Editorial Column */
        .oxidised-intro-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .oxidised-eyebrow-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .oxidised-eyebrow-accent {
          width: 24px;
          height: 1px;
          background-color: #BFC1C4;
        }

        .oxidised-eyebrow {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6F6F6A;
        }

        .oxidised-heading {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(2.1rem, 3.2vw, 3.1rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          color: #111111;
          margin: 0 0 20px 0;
          line-height: 1.1;
          display: flex;
          flex-direction: column;
        }

        .oxidised-heading-line {
          display: block;
        }

        .oxidised-description {
          font-family: var(--font-body), "Jost", -apple-system, sans-serif;
          font-size: clamp(0.92rem, 1.05vw, 1.02rem);
          line-height: 1.68;
          color: #6F6F6A;
          margin: 0 0 24px 0;
          max-width: 360px;
        }

        .oxidised-hallmark-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 9999px;
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #252525;
          margin-bottom: 32px;
        }

        :global(.hallmark-icon) {
          color: #111111;
        }

        .oxidised-cta-wrap {
          margin-top: 4px;
        }

        .oxidised-cta-link,
        :global(.oxidised-cta-link) {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #111111;
          padding-bottom: 6px;
          border-bottom: 1.5px solid #111111;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .cta-text {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #111111;
        }

        .cta-arrow-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: #111111;
          color: #FFFFFF;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .oxidised-cta-link:hover .cta-arrow-circle,
        :global(.oxidised-cta-link:hover) .cta-arrow-circle {
          transform: translateX(4px);
        }

        /* Right Cards Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 1.8vw, 24px);
        }

        .category-card {
          position: relative;
          aspect-ratio: 3 / 4;
          min-height: 380px;
          background-color: #EFECE6;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          overflow: hidden;
          display: block;
          box-shadow: 0 4px 18px rgba(17, 17, 17, 0.03);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
          cursor: pointer;
        }

        .category-card:hover {
          border-color: #BFC1C4;
          box-shadow: 0 12px 32px rgba(17, 17, 17, 0.08);
        }

        .card-click-overlay,
        :global(.card-click-overlay) {
          position: absolute;
          inset: 0;
          z-index: 10;
          cursor: pointer;
        }

        .card-media-wrapper {
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

        .category-card:hover :global(.card-image) {
          transform: scale(1.045);
        }

        .card-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(17, 17, 17, 0) 35%,
            rgba(17, 17, 17, 0.25) 60%,
            rgba(17, 17, 17, 0.85) 95%
          );
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: clamp(16px, 2vw, 24px);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .card-tag {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.82);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .product-count {
          opacity: 0.75;
          font-weight: 400;
        }

        .card-title {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(1.2rem, 1.6vw, 1.45rem);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin: 0 0 6px 0;
          line-height: 1.15;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .card-desc {
          font-family: var(--font-body), "Jost", sans-serif;
          font-size: 0.78rem;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 14px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-height: 2.9em;
        }

        .card-explore-row {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #FFFFFF;
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        :global(.explore-arrow) {
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .category-card:hover :global(.explore-arrow) {
          transform: translateX(5px);
        }

        /* Skeleton */
        .card-skeleton {
          aspect-ratio: 3 / 4;
          background: linear-gradient(90deg, #EFECE6 25%, #E5E3DE 50%, #EFECE6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
          border-radius: 6px;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Entrance Animations */
        .oxidised-intro-col,
        .category-card {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
                      transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .is-in-view .oxidised-intro-col {
          opacity: 1;
          transform: translateY(0);
        }

        .is-in-view .category-card {
          opacity: 1;
          transform: translateY(0);
          transition-delay: calc(0.12s * var(--card-index, 0));
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .oxidised-grid {
            grid-template-columns: 300px 1fr;
            gap: 28px;
          }
        }

        @media (max-width: 900px) {
          .oxidised-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .oxidised-intro-col {
            max-width: 580px;
          }
        }

        @media (max-width: 640px) {
          .oxidised-section {
            padding: 44px 0 56px 0;
          }
          .oxidised-heading {
            font-size: clamp(1.85rem, 8vw, 2.3rem);
            line-height: 1.12;
            margin: 0 0 16px 0;
          }
          .cards-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 14px;
            padding-bottom: 12px;
            padding-right: 20px;
            margin-right: -16px;
            scrollbar-width: none;
          }
          .cards-grid::-webkit-scrollbar {
            display: none;
          }
          .category-card {
            flex: 0 0 clamp(260px, 82vw, 320px);
            min-height: 380px;
            scroll-snap-align: start;
            scroll-snap-stop: always;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .oxidised-intro-col,
          .category-card,
          :global(.card-image),
          :global(.explore-arrow),
          .cta-arrow-circle {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
