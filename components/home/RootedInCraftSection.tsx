'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function RootedInCraftSection() {
  return (
    <section
      aria-label="Rooted In Craft Heritage"
      style={{
        width: '100%',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        overflow: 'hidden',
        borderTop: '1px solid #252525',
        borderBottom: '1px solid #252525',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Editorial Storytelling */}
        <div
          style={{
            padding: 'clamp(44px, 6vw, 84px) clamp(24px, 4vw, 64px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#BFC1C4',
              display: 'block',
              marginBottom: '14px',
            }}
          >
            HERITAGE & CRAFTSMANSHIP
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              lineHeight: 1.12,
              margin: '0 0 16px',
              textTransform: 'uppercase',
            }}
          >
            ROOTED<br />IN CRAFT
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.92rem',
              lineHeight: 1.65,
              color: '#BFC1C4',
              maxWidth: '460px',
              margin: '0 0 28px',
            }}
          >
            Inspired by India&apos;s rich jewellery traditions, reimagined through contemporary
            925 sterling silver. Handcrafted in Jaipur by master artisans with certified purity.
          </p>
          <Link
            href="/about"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.76rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              width: 'fit-content',
              borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
              paddingBottom: '4px',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)')}
          >
            <span>EXPLORE OUR STORY</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Right: Handcrafted Silver Jewellery Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(320px, 40vw, 440px)',
            backgroundColor: '#1E1E1E',
          }}
        >
          <Image
            src="/images/why-choose/master-craftsmanship-detail.jpg"
            alt="Handcrafted Silver Jewellery Craftsmanship in Jaipur"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  );
}
