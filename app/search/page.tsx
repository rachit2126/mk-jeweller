'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, Sparkles } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

function SearchInner() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(qParam);

  const popular = ['Chandbali', 'Polki Choker', 'Silver Ring', 'Freshwater Pearls', 'Ruby Pendant', 'Kada Bangles'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.style.some(s => s.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Search Input Box */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="eyebrow">DISCOVERY CATALOGUE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--color-espresso)', marginBottom: '20px' }}>
            Search Fine Jewellery
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              padding: '10px 24px',
              maxWidth: '680px',
              margin: '0 auto 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}
          >
            <Search size={22} color="var(--color-champagne)" style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Search earrings, necklaces, rings, polki..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1.1rem',
                color: 'var(--color-espresso)',
                backgroundColor: 'transparent'
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: 'var(--color-muted-text)' }}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* Popular Tag Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)' }}>Popular searches:</span>
            {popular.map((term, i) => (
              <button
                key={i}
                onClick={() => setQuery(term)}
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--bg-cream)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-espresso)',
                  cursor: 'pointer'
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {query.trim() === '' ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-muted-text)' }}>
            <Sparkles size={36} color="var(--color-champagne)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
              Explore Authentic 925 Sterling Silver
            </h3>
            <p style={{ fontSize: '0.9rem' }}>Type any design name, jewellery style, or gemstone above.</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '8px' }}>Nothing found for &ldquo;{query}&rdquo;</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-text)', marginBottom: '20px' }}>Try another jewellery style, gemstone, or collection.</p>
            <button onClick={() => setQuery('')} className="btn-secondary">Clear Search</button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--color-muted-text)' }}>
              Found <strong>{results.length}</strong> matching jewellery pieces
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px 0', textAlign: 'center' }}>Loading Search...</div>}>
      <SearchInner />
    </Suspense>
  );
}
