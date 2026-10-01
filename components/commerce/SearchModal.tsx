'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { useCommerce } from './CommerceContext';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useRecentSearchesStore } from '@/stores/recent-searches';
import BrandLogo from '@/components/ui/BrandLogo';

const POPULAR_SEARCHES = ['Silver Rings', '925 Necklaces', 'Stud Earrings', 'Bracelets', 'New Arrivals'];

export default function SearchModal() {
  const { isSearchOpen, closeSearch, openQuickView } = useCommerce();
  const [query, setQuery] = useState('');
  const { searches: recentSearches, addSearch } = useRecentSearchesStore();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch('/api/products?limit=4&isBestSeller=true')
      .then(res => res.json())
      .then(data => {
        if (data.products) setTrendingProducts(data.products);
      })
      .catch(err => console.error(err));
  }, []);

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

  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setFilteredProducts(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
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
          backgroundColor: '#FFF9F3',
          borderBottom: '1px solid var(--color-border)',
          padding: '24px 0 20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          zIndex: 10,
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Mobile Top Navigation Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button
              onClick={closeSearch}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#342727', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', padding: '4px' }}
            >
              <ArrowLeft size={18} color="#B76E79" />
              <span>Back</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrandLogo size="compact" />
            </div>

            <button
              onClick={closeSearch}
              aria-label="Close search"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(183, 110, 121, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#342727',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Input Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #F6D6D9',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 18px',
              gap: '12px',
              boxShadow: '0 4px 18px rgba(183, 110, 121, 0.08)'
            }}
          >
            <Search size={20} color="#B76E79" />
            <input
              type="text"
              placeholder="Search necklaces, rings, earrings..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                backgroundColor: 'transparent',
                color: '#342727',
                fontFamily: 'var(--font-ui)'
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: '#806D68', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
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
            <div style={{ padding: '6px 0 30px' }}>
              {/* Popular Searches */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#342727', marginBottom: '12px', letterSpacing: '0.04em' }}>
                  Popular Searches
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {POPULAR_SEARCHES.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(term);
                        addSearch(term);
                      }}
                      style={{
                        fontSize: '0.82rem',
                        padding: '8px 16px',
                        borderRadius: '999px',
                        backgroundColor: '#FFFFFF',
                        color: '#342727',
                        border: '1px solid #F6D6D9',
                        cursor: 'pointer',
                        fontWeight: 500,
                        boxShadow: '0 2px 6px rgba(183, 110, 121, 0.05)'
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Products */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#342727', marginBottom: '14px', letterSpacing: '0.04em' }}>
                  Trending Products
                </h4>
                <div
                  className="no-scrollbar"
                  style={{
                    display: 'flex',
                    gap: '14px',
                    overflowX: 'auto',
                    paddingBottom: '10px',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {trendingProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        closeSearch();
                        openQuickView(p);
                      }}
                      style={{
                        minWidth: '130px',
                        maxWidth: '130px',
                        cursor: 'pointer',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '8px',
                        border: '1px solid #F6D6D9',
                        boxShadow: '0 4px 12px rgba(183, 110, 121, 0.06)'
                      }}
                    >
                      <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FCE8DE' }}>
                        <Image src={p.images[0]} alt={p.name} fill sizes="130px" style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ marginTop: '8px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#342727', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </p>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B76E79', marginTop: '2px' }}>
                          {formatPrice(p.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
