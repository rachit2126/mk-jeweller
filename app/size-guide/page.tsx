import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Jewellery Size Guide | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'Indian ring size conversion chart, necklace chain length comparisons, and bangle fit guide.',
};

const ringSizes = [
  { indian: '6', diameterMm: '14.6', circumferenceMm: '45.9' },
  { indian: '8', diameterMm: '15.3', circumferenceMm: '48.1' },
  { indian: '10', diameterMm: '16.0', circumferenceMm: '50.3' },
  { indian: '12', diameterMm: '16.6', circumferenceMm: '52.2' },
  { indian: '14', diameterMm: '17.3', circumferenceMm: '54.3' },
  { indian: '16', diameterMm: '18.0', circumferenceMm: '56.5' },
  { indian: '18', diameterMm: '18.6', circumferenceMm: '58.4' },
  { indian: '20', diameterMm: '19.3', circumferenceMm: '60.6' },
];

const chainLengths = [
  { length: '16 inches (40 cm)', fit: 'Choker / Collar', bestFor: 'Petite necklines, crew necks, open collars' },
  { length: '18 inches (45 cm)', fit: 'Princess (Standard)', bestFor: 'Sits at the collarbone. Ideal for everyday pendants' },
  { length: '20 inches (50 cm)', fit: 'Matinee', bestFor: 'Sits just below collarbone. Elegant with plunge necklines' },
  { length: '22–24 inches (55–60 cm)', fit: 'Opera', bestFor: 'Dramatic evening wear, high neck tops and layered looks' },
];

export default function SizeGuidePage() {
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Size Guide</span>
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
            Jewellery Size & Fit Guide
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.9rem',
              color: '#6F6F6A',
              margin: 0,
            }}
          >
            Find your exact fit with Indian ring size standards and necklace chain length comparisons.
          </p>
        </div>

        {/* 1. Indian Ring Size Chart */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 600, margin: '0 0 16px' }}>
            Ring Sizing Chart
          </h2>
          <div style={{ overflowX: 'auto', border: '1px solid #E8E7E2' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8F7F3', borderBottom: '1px solid #E8E7E2' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Indian Ring Size</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Inner Diameter (mm)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Inner Circumference (mm)</th>
                </tr>
              </thead>
              <tbody>
                {ringSizes.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E8E7E2' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{r.indian}</td>
                    <td style={{ padding: '12px 16px', color: '#6F6F6A' }}>{r.diameterMm} mm</td>
                    <td style={{ padding: '12px 16px', color: '#6F6F6A' }}>{r.circumferenceMm} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Chain Length Comparison */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 600, margin: '0 0 16px' }}>
            Necklace Chain Lengths
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {chainLengths.map((ch, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F8F7F3',
                  border: '1px solid #E8E7E2',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#111111' }}>{ch.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6F6F6A' }}>{ch.fit}</div>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#4A4A46' }}>{ch.bestFor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
