import React from 'react';
import Link from 'next/link';
import { Sparkles, Droplets, ShieldCheck, Sun, Package, RefreshCw } from 'lucide-react';

const CARE_TIPS = [
  {
    icon: Package,
    title: 'Individual Pouch Storage',
    desc: 'Store each piece separately in the complimentary airtight velvet pouch provided with your order to avoid friction scratching and moisture exposure.',
  },
  {
    icon: Sun,
    title: 'Last On, First Off',
    desc: 'Put your silver jewellery on after perfumes, lotions, and sprays have fully dried. Remove before bed to prevent tangling and pressure.',
  },
  {
    icon: Droplets,
    title: 'Avoid Water & Pools',
    desc: 'Remove before showering, swimming in chlorinated pools, or ocean water to protect the high-gloss anti-tarnish rhodium layer.',
  },
  {
    icon: Sparkles,
    title: 'Gentle Microfiber Polish',
    desc: 'Buff gently with the included soft polishing cloth. Never use abrasive toothpastes or chemical bleaches on fine sterling silver.',
  },
  {
    icon: ShieldCheck,
    title: 'Wear Regularly',
    desc: 'Solid 925 sterling silver loves to be worn. Natural skin contact creates a protective film that actively inhibits surface oxidation.',
  },
  {
    icon: RefreshCw,
    title: 'Atelier Re-Polishing',
    desc: 'We offer ultrasonic steam cleaning and rhodium re-plating services for all patron pieces at our Jaipur atelier whenever needed.',
  },
];

export default function JewelleryCarePage() {
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
          maxWidth: '960px',
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Jewellery Care</span>
        </nav>

        {/* Title */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #E8E7E2', paddingBottom: '24px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 500,
              color: '#111111',
              margin: '0 0 10px',
            }}
          >
            Care For Your 925 Silver
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.9rem',
              color: '#6F6F6A',
              margin: 0,
            }}
          >
            Simple rituals to preserve the lifelong radiance and mirror luster of your Jaipur hallmarked jewels.
          </p>
        </div>

        {/* 6 Tips Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {CARE_TIPS.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F8F7F3',
                  border: '1px solid #E8E7E2',
                  padding: '28px',
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <Icon size={22} color="#111111" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#111111',
                    margin: '0 0 8px',
                  }}
                >
                  {tip.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.84rem',
                    color: '#4A4A46',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {tip.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
