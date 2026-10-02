'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AnnouncementBar() {
  const pathname = usePathname();
  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  if (isAuthOrAdmin) return null;

  return (
    <div
      style={{
        backgroundColor: '#111111',
        color: '#FFFFFF',
        height: '34px',
        fontSize: '0.68rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        position: 'relative',
        zIndex: 60,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        margin: 0,
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          maxWidth: '1440px',
        }}
      >
        <button
          aria-label="Previous announcement"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#BFC1C4',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'nowrap', overflow: 'hidden' }}>
          <span>FLAT 10% OFF ON YOUR FIRST ORDER</span>
          <span style={{ color: '#6F6F6A' }}>·</span>
          <span>FREE SHIPPING ON ORDERS ₹1,000+</span>
          <span style={{ color: '#6F6F6A' }}>·</span>
          <span>EASY RETURNS</span>
          <span style={{ color: '#6F6F6A' }}>·</span>
          <span>925 SILVER HALLMARKED</span>
        </div>

        <button
          aria-label="Next announcement"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#BFC1C4',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
