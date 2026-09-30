'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEGA_CATEGORIES = [
  { name: 'Minimal Jewellery', href: '/shop?style=minimal', desc: 'Clean lines for subtle elegance' },
  { name: 'Daily Wear', href: '/shop?occasion=everyday', desc: 'Lightweight comfortable silver' },
  { name: 'Festive Grandeur', href: '/shop?occasion=festive', desc: 'Regal sparkle for special occasions' },
  { name: 'Bridal Silver', href: '/shop?style=statement', desc: 'Heirloom polki & kundan sets' },
  { name: 'Gemstone Encrusted', href: '/shop?category=pendants', desc: 'Ruby, emerald & pearl drops' },
  { name: 'Personalised & Engravable', href: '/shop?badge=ENGRAVABLE', desc: 'Custom laser etched silver' },
  { name: 'Oxidised Vintage Silver', href: '/shop?style=classic', desc: 'Traditional tribal & antique motifs' },
  { name: 'Luxury Gifting', href: '/gifts', desc: 'Curated sets with certification' }
];

const FEATURED_COLLECTIONS = [
  {
    title: 'The Polki Heritage Collection',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop',
    href: '/collections/necklaces',
    badge: 'ROYAL RAJPUTANA'
  },
  {
    title: 'Modern Everyday Essentials',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    href: '/collections/earrings',
    badge: 'NEW SEASON'
  }
];

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-cream)',
        boxShadow: '0 25px 50px rgba(25, 20, 15, 0.12)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '36px 0',
        zIndex: 100,
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px' }}>
        {/* Left: Category list */}
        <div>
          <div style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-champagne)',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            Explore By Style & Craft
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
            {MEGA_CATEGORIES.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.18s ease'
                }}
                className="megamenu-item"
              >
                <span style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--color-espresso)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {item.name}
                  <ArrowUpRight size={14} color="var(--color-champagne)" />
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)', marginTop: '2px' }}>
                  {item.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Featured Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {FEATURED_COLLECTIONS.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              onClick={onClose}
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'block',
                height: '240px',
                backgroundColor: 'var(--color-espresso)'
              }}
              className="featured-col-card"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                style={{ objectFit: 'cover', opacity: 0.85, transition: 'transform 0.5s ease' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(20,15,10,0.85) 0%, rgba(20,15,10,0.2) 60%, transparent 100%)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-champagne)',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  {col.badge}
                </span>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  {col.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .megamenu-item:hover {
          background-color: rgba(201, 163, 90, 0.1);
        }
        .featured-col-card:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
