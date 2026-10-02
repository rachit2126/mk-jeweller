'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface MegaMenuProps {
  isOpen?: boolean;
  onClose: () => void;
}

const CATEGORY_COLUMNS = [
  {
    title: 'EARRINGS',
    href: '/shop?category=earrings',
    items: [
      { label: 'Studs', href: '/shop?category=earrings&sub=studs' },
      { label: 'Hoops', href: '/shop?category=earrings&sub=hoops' },
      { label: 'Drop Earrings', href: '/shop?category=earrings&sub=drop' },
      { label: 'Jhumki', href: '/shop?category=earrings&sub=jhumki' },
      { label: 'Everyday Earrings', href: '/shop?category=earrings&sub=everyday' },
      { label: 'Statement Earrings', href: '/shop?category=earrings&sub=statement' },
    ],
  },
  {
    title: 'NECKLACES',
    href: '/shop?category=necklaces',
    items: [
      { label: 'Pendant Necklaces', href: '/shop?category=necklaces&sub=pendant' },
      { label: 'Chains', href: '/shop?category=necklaces&sub=chains' },
      { label: 'Chokers', href: '/shop?category=necklaces&sub=chokers' },
      { label: 'Layered Necklaces', href: '/shop?category=necklaces&sub=layered' },
      { label: 'Everyday Necklaces', href: '/shop?category=necklaces&sub=everyday' },
      { label: 'Bridal Necklaces', href: '/shop?category=necklaces&sub=bridal' },
    ],
  },
  {
    title: 'RINGS',
    href: '/shop?category=rings',
    items: [
      { label: 'Everyday Rings', href: '/shop?category=rings&sub=everyday' },
      { label: 'Silver Rings', href: '/shop?category=rings&sub=silver' },
      { label: 'Solitaire Rings', href: '/shop?category=rings&sub=solitaire' },
      { label: 'Statement Rings', href: '/shop?category=rings&sub=statement' },
      { label: 'Couple Rings', href: '/shop?category=rings&sub=couple' },
      { label: 'Bridal Rings', href: '/shop?category=rings&sub=bridal' },
    ],
  },
  {
    title: 'BRACELETS',
    href: '/shop?category=bracelets',
    items: [
      { label: 'Chain Bracelets', href: '/shop?category=bracelets&sub=chain' },
      { label: 'Cuff Bracelets', href: '/shop?category=bracelets&sub=cuff' },
      { label: 'Charm Bracelets', href: '/shop?category=bracelets&sub=charm' },
      { label: 'Everyday Bracelets', href: '/shop?category=bracelets&sub=everyday' },
    ],
  },
  {
    title: 'BANGLES',
    href: '/shop?category=bangles',
    items: [
      { label: 'Silver Bangles', href: '/shop?category=bangles&sub=silver' },
      { label: 'Kada', href: '/shop?category=bangles&sub=kada' },
      { label: 'Stacking Bangles', href: '/shop?category=bangles&sub=stacking' },
      { label: 'Traditional Bangles', href: '/shop?category=bangles&sub=traditional' },
    ],
  },
  {
    title: 'ANKLETS',
    href: '/shop?category=anklets',
    items: [
      { label: 'Everyday Anklets', href: '/shop?category=anklets&sub=everyday' },
      { label: 'Silver Anklets', href: '/shop?category=anklets&sub=silver' },
      { label: 'Bridal Anklets', href: '/shop?category=anklets&sub=bridal' },
    ],
  },
];

const DIRECT_LINKS = [
  { label: 'PENDANTS →', href: '/shop?category=pendants' },
  { label: 'MEN →', href: '/shop?category=men' },
  { label: 'BRIDAL →', href: '/shop?category=bridal' },
];

const COLLECTIONS = [
  { label: 'Minimal', href: '/collections/minimal' },
  { label: 'Everyday', href: '/collections/everyday' },
  { label: 'Festive', href: '/collections/festive' },
  { label: 'Bridal', href: '/collections/bridal' },
  { label: 'Heritage', href: '/collections/heritage' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
];

export default function ShopMegaMenu({ isOpen = true, onClose }: MegaMenuProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onMouseLeave={onClose}
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E8E7E2',
        borderBottom: '1px solid #111111',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.08)',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '36px 40px 40px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 300px',
          gap: '40px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Category Columns */}
        <div>
          {/* Main 6 Columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '24px',
              paddingBottom: '28px',
              borderBottom: '1px solid #E8E7E2',
            }}
          >
            {CATEGORY_COLUMNS.map((col) => (
              <div key={col.title}>
                <Link
                  href={col.href}
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#111111',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '14px',
                  }}
                >
                  {col.title}
                </Link>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {col.items.map((item) => (
                    <li key={item.label} style={{ marginBottom: '9px' }}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.8rem',
                          color: '#6F6F6A',
                          textDecoration: 'none',
                          transition: 'color 0.15s ease',
                          display: 'inline-block',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#111111')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#6F6F6A')}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Direct Category Links & Collections Row */}
          <div
            style={{
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '32px',
            }}
          >
            {/* Quick Arrow Links */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              {DIRECT_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#111111',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Collections Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#111111',
                }}
              >
                COLLECTIONS:
              </span>
              {COLLECTIONS.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.78rem',
                    color: '#6F6F6A',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#111111')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6F6F6A')}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Editorial Campaign Banner (Mockup Screen 2) */}
        <div
          style={{
            position: 'relative',
            borderRadius: '0px',
            overflow: 'hidden',
            backgroundColor: '#F8F7F3',
            height: '320px',
          }}
        >
          <Image
            src="/images/occasions/bridal-collection.jpg"
            alt="Bridal Collection"
            fill
            sizes="300px"
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.78) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '24px',
              color: '#FFFFFF',
            }}
          >
            <h4
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.45rem',
                fontWeight: 500,
                letterSpacing: '0.04em',
                lineHeight: 1.15,
                margin: '0 0 6px',
                textTransform: 'uppercase',
              }}
            >
              BRIDAL COLLECTION
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.76rem',
                color: 'rgba(255, 255, 255, 0.85)',
                margin: '0 0 16px',
                lineHeight: 1.4,
              }}
            >
              Timeless silver for your special moments
            </p>
            <Link
              href="/collections/bridal"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                padding: '9px 18px',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                width: 'fit-content',
                transition: 'background-color 0.2s ease',
              }}
            >
              <span>EXPLORE</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
