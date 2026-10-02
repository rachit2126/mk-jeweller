'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Award, Heart } from 'lucide-react';

export default function AboutPage() {
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Our Story</span>
        </nav>

        {/* HERO EDITORIAL STORY (Screen 10 in Mockup) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center',
            marginBottom: '80px',
          }}
          className="about-hero-grid"
        >
          {/* Left Text */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                display: 'block',
                marginBottom: '14px',
              }}
            >
              ORIGIN & ETHOS
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                fontWeight: 500,
                lineHeight: 1.12,
                margin: '0 0 20px',
                color: '#111111',
                textTransform: 'uppercase',
              }}
            >
              MADE IN JAIPUR.<br />DESIGNED FOR NOW.
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#4A4A46',
                margin: '0 0 20px',
              }}
            >
              At MK Silver Hub, we craft contemporary 925 sterling silver jewellery inspired by the rich silversmithing traditions of Jaipur. Our pieces blend timeless artisanal techniques with modern silhouettes, sculpted for your everyday expressions.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                color: '#6F6F6A',
                margin: '0 0 32px',
              }}
            >
              Every jewel is hand-cast in pure 92.5% elemental silver, stamped with certified BIS hallmarks and finished with anti-tarnish rhodium to ensure lifelong brilliance and hypoallergenic comfort.
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 32px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right Craftsman Image (Screen 10 in Mockup) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '110%',
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/images/why-choose/master-craftsmanship-detail.jpg"
              alt="Artisan sculpting 925 silver jewellery in Jaipur"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* 4 CORNERSTONES SECTION */}
        <div
          style={{
            backgroundColor: '#F8F7F3',
            border: '1px solid #E8E7E2',
            padding: 'clamp(44px, 5.5vw, 68px) clamp(24px, 4vw, 56px)',
            marginBottom: '80px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              OUR PROMISE
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                fontWeight: 500,
                color: '#111111',
                margin: 0,
              }}
            >
              Four Pillars of MK Silver Hub
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '36px',
            }}
          >
            <div>
              <div style={{ marginBottom: '14px' }}>
                <ShieldCheck size={24} color="#111111" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px' }}>
                925 Sterling Silver
              </h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.84rem', color: '#6F6F6A', lineHeight: 1.6, margin: 0 }}>
                Every single piece is BIS hallmarked to certify 92.5% elemental bullion purity. No compromises, no synthetic shortcuts.
              </p>
            </div>

            <div>
              <div style={{ marginBottom: '14px' }}>
                <Award size={24} color="#111111" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px' }}>
                Crafted in Jaipur
              </h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.84rem', color: '#6F6F6A', lineHeight: 1.6, margin: 0 }}>
                Sculpted by master silversmiths whose families have perfected jewelry metalwork in the Pink City for generations.
              </p>
            </div>

            <div>
              <div style={{ marginBottom: '14px' }}>
                <Sparkles size={24} color="#111111" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px' }}>
                Skin Friendly & Hypoallergenic
              </h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.84rem', color: '#6F6F6A', lineHeight: 1.6, margin: 0 }}>
                100% nickel-free and lead-free. Sealed with high-grade rhodium to ensure soothing everyday contact with even sensitive skin.
              </p>
            </div>

            <div>
              <div style={{ marginBottom: '14px' }}>
                <Heart size={24} color="#111111" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px' }}>
                Made to Last
              </h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.84rem', color: '#6F6F6A', lineHeight: 1.6, margin: 0 }}>
                Engineered for daily resilience, reinforced clasps, and scratch-resistant luster designed to be worn and loved for years.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM FULL-WIDTH BLACK EDITORIAL CALL TO ACTION */}
        <div
          style={{
            backgroundColor: '#111111',
            color: '#FFFFFF',
            padding: ' clamp(48px, 6vw, 72px) clamp(24px, 4vw, 56px)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
              fontWeight: 500,
              margin: '0 0 12px',
            }}
          >
            Fine 925 Sterling Silver For Your Story
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              color: '#BFC1C4',
              maxWidth: '520px',
              margin: '0 auto 28px',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            Enjoy complimentary insured shipping across India and an unconditional 7-day exchange promise on every creation.
          </p>
          <Link
            href="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 34px',
              backgroundColor: '#FFFFFF',
              color: '#111111',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            <span>SHOP ALL JEWELLERY</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
