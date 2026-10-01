'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/types';
import { Sparkles, Compass, Gem, Crown } from 'lucide-react';

const STYLES = [
  {
    id: 'minimal',
    label: 'MINIMAL',
    desc: 'Clean everyday jewellery',
    icon: Compass
  },
  {
    id: 'classic',
    label: 'CLASSIC',
    desc: 'Timeless designs',
    icon: Gem
  },
  {
    id: 'statement',
    label: 'STATEMENT',
    desc: 'Bold and expressive',
    icon: Crown
  },
  {
    id: 'festive',
    label: 'FESTIVE',
    desc: 'Elegant celebration pieces',
    icon: Sparkles
  }
];

export default function StyleSelectorSection() {
  const [activeStyle, setActiveStyle] = useState('minimal');
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?style=${activeStyle}&limit=4`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setMatchingProducts(data.products);
        }
      })
      .catch(err => console.error('Failed to load style products:', err));
  }, [activeStyle]);

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
          <span className="eyebrow">CURATED AESTHETICS</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--color-espresso)', marginBottom: '8px' }}>
            What&apos;s Your Silver Style?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-muted-text)' }}>
            Choose an aesthetic below to discover hand-selected 925 sterling pieces.
          </p>
        </div>

        {/* Style Selector Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '40px'
          }}
          className="style-selector-grid"
        >
          {STYLES.map((style) => {
            const isSelected = activeStyle === style.id;
            const Icon = style.icon;
            return (
              <button
                key={style.id}
                onClick={() => setActiveStyle(style.id)}
                style={{
                  padding: '24px 20px',
                  borderRadius: 'var(--radius-card)',
                  backgroundColor: isSelected ? 'var(--color-espresso)' : 'var(--bg-cream)',
                  border: isSelected ? '1px solid var(--color-champagne)' : '1px solid var(--color-border)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-espresso)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '8px',
                  boxShadow: isSelected ? '0 12px 30px rgba(33, 25, 20, 0.15)' : 'none',
                  transition: 'all 0.25s ease'
                }}
                className="style-tab-btn"
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'rgba(201, 163, 90, 0.2)' : 'rgba(33, 25, 20, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'var(--color-champagne)' : 'var(--color-espresso)',
                    marginBottom: '4px'
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    letterSpacing: '0.12em'
                  }}
                >
                  {style.label}
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: isSelected ? '#D8D1C7' : 'var(--color-muted-text)',
                    lineHeight: 1.3
                  }}
                >
                  {style.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Products Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}
          className="style-products-grid"
        >
          {matchingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .style-tab-btn:hover {
          transform: translateY(-2px);
          border-color: var(--color-champagne);
        }
        @media (max-width: 1024px) {
          .style-selector-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .style-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .style-selector-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .style-products-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
