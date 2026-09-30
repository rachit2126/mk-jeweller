'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useCommerce } from './CommerceContext';
import { PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/api';
import { useRecentSearchesStore } from '@/stores/recent-searches';

const POPULAR_SEARCHES = ['Chandbali', 'Polki Choker', '925 Silver Ring', 'Ruby Pendant', 'Freshwater Pearls', 'Kada Bangles'];

export default function SearchModal() {
  const { isSearchOpen, closeSearch, openQuickView } = useCommerce();
  const [query, setQuery] = useState('');
  const { searches: recentSearches, addSearch } = useRecentSearchesStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, closeSearch]);

  const filteredProducts = useMemo(() => {
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

  if (!isSearchOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 350, display: 'flex', flexDirection: 'column' }}>
      {/* Backdrop */}
      <div
        onClick={closeSearch}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(20, 18, 15, 0.65)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Search Header Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: 'var(--bg-cream)',
          borderBottom: '1px solid var(--color-border)',
          padding: '32px 0 24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          zIndex: 10,
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-champagne)', fontWeight: 600 }}>
              Search Catalogue
            </span>
            <button
              onClick={closeSearch}
              aria-label="Close search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--color-espresso)',
                fontSize: '0.85rem'
              }}
            >
              <span>ESC</span>
              <X size={18} />
            </button>
          </div>

          {/* Search Input Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 20px',
              gap: '12px',
              boxShadow: '0 4px 18px rgba(25, 20, 15, 0.05)'
            }}
          >
            <Search size={22} color="var(--color-champagne)" />
            <input
              type="text"
              placeholder="Search jewellery, earrings, polki, rings, 925 silver..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1.1rem',
                backgroundColor: 'transparent',
                color: 'var(--color-espresso)',
                fontFamily: 'var(--font-ui)'
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: 'var(--color-muted-text)', padding: '4px' }}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* Recent & Popular Tag Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
            {recentSearches && recentSearches.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> Recent:
                </span>
                {recentSearches.slice(0, 4).map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(term);
                      addSearch(term);
                    }}
                    style={{
                      fontSize: '0.78rem',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-sunken)',
                      color: 'var(--color-espresso)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer'
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>Popular:</span>
              {POPULAR_SEARCHES.map((term, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(term);
                    addSearch(term);
                  }}
                  style={{
                    fontSize: '0.78rem',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: '#F0ECE4',
                    color: 'var(--color-espresso)',
                    cursor: 'pointer'
                  }}
                  className="search-tag-pill"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results View */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          backgroundColor: 'rgba(252, 250, 246, 0.98)',
          zIndex: 10,
          overflowY: 'auto',
          padding: '36px 0'
        }}
      >
        <div className="container" style={{ maxWidth: '1000px' }}>
          {query.trim() === '' ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted-text)' }}>
              <Sparkles size={32} color="var(--color-champagne)" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '1rem', color: 'var(--color-espresso)' }}>Start typing to discover fine 925 sterling pieces.</p>
              <p style={{ fontSize: '0.85rem' }}>Browse rings, necklaces, earrings, bracelets, and heirloom gifts.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '8px' }}>
                Nothing found for &ldquo;{query}&rdquo;
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-text)', marginBottom: '24px' }}>
                Try another jewellery style, collection, or metal keyword.
              </p>
              <Link
                href="/shop"
                onClick={closeSearch}
                className="btn-primary"
              >
                Browse Full Collection
              </Link>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-muted-text)' }}>
                  Found <strong>{filteredProducts.length}</strong> matching pieces
                </span>
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={closeSearch}
                  style={{ fontSize: '0.85rem', color: 'var(--color-champagne)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>View All in Shop</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    className="luxury-card"
                    style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}
                  >
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={closeSearch}
                      style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#F0ECE6' }}
                    >
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="250px"
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                    <div style={{ marginTop: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-text)', textTransform: 'uppercase' }}>
                          {p.purity}
                        </span>
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={closeSearch}
                          style={{ display: 'block', fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-espresso)', marginTop: '2px' }}
                        >
                          {p.name}
                        </Link>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                          {formatPrice(p.price)}
                        </span>
                        <button
                          onClick={() => {
                            closeSearch();
                            openQuickView(p);
                          }}
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-champagne)',
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)'
                          }}
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-tag-pill:hover {
          background-color: var(--color-espresso);
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}
