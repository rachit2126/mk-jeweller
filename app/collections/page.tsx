'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const CURATED_COLLECTIONS = [
  {
    title: 'THE MINIMAL COLLECTION',
    subtitle: 'LESS. BUT BETTER.',
    desc: 'Clean lines, refined finishes and everyday solid 925 sterling silver essentials.',
    href: '/shop?collection=minimal',
    image: '/images/collections/rings-editorial.jpg',
  },
  {
    title: 'BRIDAL COLLECTION',
    subtitle: 'TIMELESS HEIRLOOMS',
    desc: 'Regal silver suites, polki choker accents and bridal chandbalis for your special moments.',
    href: '/shop?category=bridal',
    image: '/images/occasions/bridal-collection.jpg',
  },
  {
    title: 'ROOTED IN CRAFT',
    subtitle: 'HERITAGE JAIPUR',
    desc: 'Centuries-old artisanal filigree techniques reimagined through contemporary sterling silver.',
    href: '/shop?collection=heritage',
    image: '/images/why-choose/master-craftsmanship-detail.jpg',
  },
  {
    title: 'SILVER FOR HIM',
    subtitle: 'MODERN MASCULINE',
    desc: 'Heavy curb chains, cuff bracelets, and signet rings in hallmarked 925 sterling silver.',
    href: '/shop?category=men',
    image: '/images/categories/men-chains.png',
  },
  {
    title: 'EVERYDAY MOMENTS',
    subtitle: 'EFFORTLESS POISE',
    desc: 'Featherlight studs, daily pendants and delicate stacking chains made to be lived in.',
    href: '/shop?occasion=everyday',
    image: '/images/occasions/everyday-elegance.jpg',
  },
  {
    title: 'FESTIVE SPLENDOUR',
    subtitle: 'CELEBRATION GLOW',
    desc: 'Luminous statement jhumkis and gemstone-accented silver necklaces for grand festivities.',
    href: '/shop?occasion=festive',
    image: '/images/occasions/festive-sparkle.jpg',
  },
];

export default function CollectionsPage() {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#111111',
        minHeight: '100vh',
        padding: '0 0 100px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            padding: '24px 0 32px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
            color: '#6F6F6A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link href="/" style={{ color: '#6F6F6A', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: '#111111', fontWeight: 600 }}>Collections</span>
        </nav>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6F6F6A',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            CURATED EDITS
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 500,
              color: '#111111',
              margin: '0 0 14px',
              textTransform: 'uppercase',
            }}
          >
            Curated Collections
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.94rem',
              color: '#6F6F6A',
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Explore our themed curations, sculpted in hallmark-certified 925 sterling silver in Jaipur.
          </p>
        </div>

        {/* Collections Editorial Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '32px',
          }}
        >
          {CURATED_COLLECTIONS.map((c, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#F8F7F3',
                border: '1px solid #E8E7E2',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '80%',
                  backgroundColor: '#E8E7E2',
                  overflow: 'hidden',
                }}
              >
                <Link href={c.href} style={{ position: 'absolute', inset: 0 }}>
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
              </div>

              {/* Text Area */}
              <div
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#6F6F6A',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    {c.subtitle}
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: '#111111',
                      margin: '0 0 10px',
                    }}
                  >
                    {c.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      fontSize: '0.86rem',
                      color: '#4A4A46',
                      lineHeight: 1.6,
                      margin: '0 0 20px',
                    }}
                  >
                    {c.desc}
                  </p>
                </div>

                <Link
                  href={c.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#111111',
                    textDecoration: 'none',
                    borderBottom: '1px solid #111111',
                    paddingBottom: '2px',
                    width: 'fit-content',
                  }}
                >
                  <span>DISCOVER COLLECTION</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
