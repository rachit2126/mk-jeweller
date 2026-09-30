'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div
      style={{
        backgroundColor: '#FFE3D3',
        color: '#3B2B2B',
        height: '36px',
        fontSize: '0.74rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(12px, 3vw, 42px)',
        position: 'relative',
        zIndex: 50,
        border: 'none',
        margin: 0,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-ui), "Jost", sans-serif',
      }}
    >
      {/* Left: Support Call */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
        <Phone size={13} color="#B76E79" />
        <span style={{ color: '#6F5A58' }}>Expert Jewellery Support:</span>
        <a
          href="tel:+917425058118"
          style={{ color: '#3B2B2B', fontWeight: 500, letterSpacing: '0.02em', textDecoration: 'none' }}
        >
          +91 74250 58118
        </a>
      </div>

      {/* Center: Offer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontWeight: 500,
          letterSpacing: '0.03em',
          color: '#3B2B2B',
          textAlign: 'center',
          flex: 1,
        }}
      >
        <span className="desktop-announcement">Flat 10% Off on First Order · Code: <strong>FIRST10</strong></span>
        <span className="mobile-announcement">Flat 10% Off · Code: <strong>FIRST10</strong></span>
      </div>

      {/* Right: Hallmark & Shop Now */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="hidden-mobile">
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ShieldCheck size={14} color="#B76E79" />
          <span style={{ color: '#6F5A58' }}>BIS 925 Hallmarked</span>
        </div>
        <span style={{ color: '#E8D8D0' }}>·</span>
        <Link
          href="/shop"
          style={{
            color: '#B76E79',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          className="announcement-link"
        >
          <span>Shop Now</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      <style jsx>{`
        .announcement-link:hover {
          color: #9C5762 !important;
        }
        .mobile-announcement {
          display: none;
        }
        @media (max-width: 900px) {
          .hidden-mobile {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .desktop-announcement {
            display: none !important;
          }
          .mobile-announcement {
            display: inline !important;
            font-size: 0.72rem !important;
          }
        }
      `}</style>
    </div>
  );
}
