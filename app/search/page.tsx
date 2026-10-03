'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';

const POPULAR_SEARCHES = ['Earrings', 'Silver Rings', 'Necklaces', 'Bracelets', 'Bridal', 'Minimal'];

function SearchInner() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || searchParams.get('search') || '';
  const [query, setQuery] = useState(qParam);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

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
          maxWidth: '1440px',
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Search</span>
        </nav>

        {/* Search Input Box */}
        <div style={{ textAlign: 'center', marginBottom: '44px', maxWidth: '720px', margin: '0 auto 44px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 500,
              color: '#111111',
              marginBottom: '20px',
            }}
          >
            Search Fine Jewellery
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8F7F3',
              border: '1.5px solid #111111',
              padding: '14px 20px',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <Search size={20} color="#111111" />
            <input
              type="text"
              placeholder="Search by jewellery type, design or gemstone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.94rem',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                color: '#111111',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <X size={18} color="#6F6F6A" />
              </button>
            )}
          </div>

          {/* Popular Searches */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: '#6F6F6A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Popular:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                style={{
                  border: '1px solid #E8E7E2',
                  backgroundColor: '#FFFFFF',
                  padding: '4px 12px',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  color: '#111111',
                  cursor: 'pointer',
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {isSearching ? (
          <p style={{ textAlign: 'center', color: '#6F6F6A', fontSize: '0.88rem' }}>
            Searching MongoDB jewellery catalogue...
          </p>
        ) : query.trim() && results.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 10px' }}>
              No matches found for &quot;{query}&quot;
            </h3>
            <p style={{ color: '#6F6F6A', fontSize: '0.86rem', margin: '0 0 20px' }}>
              Try searching for &quot;rings&quot;, &quot;earrings&quot;, &quot;necklaces&quot;, or browse our entire collection.
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Browse All Jewellery
            </Link>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div style={{ marginBottom: '24px', fontSize: '0.84rem', color: '#6F6F6A' }}>
              Found {results.length} {results.length === 1 ? 'creation' : 'creations'} for &quot;{query}&quot;
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  results.length === 1
                    ? 'minmax(260px, 320px)'
                    : results.length === 2
                    ? 'repeat(auto-fit, minmax(260px, 320px))'
                    : 'repeat(4, 1fr)',
                gap: '24px',
                maxWidth: results.length === 1 ? '340px' : results.length === 2 ? '720px' : '100%',
              }}
              className="search-results-grid"
            >
              {results.map((product) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .search-results-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .search-results-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', textAlign: 'center', paddingTop: '100px' }}>Loading search...</div>}>
      <SearchInner />
    </Suspense>
  );
}
