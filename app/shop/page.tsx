'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { PRODUCTS } from '@/data/products';
import { Filter, SlidersHorizontal, ChevronDown, X, Sparkles } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialOccasion = searchParams.get('occasion') || 'all';
  const initialStyle = searchParams.get('style') || 'all';
  const initialBadge = searchParams.get('badge') || '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'bestselling' | 'price-low' | 'price-high'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'earrings', label: 'Earrings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'rings', label: 'Rings' },
    { id: 'bracelets', label: 'Bracelets' },
    { id: 'pendants', label: 'Pendants' },
    { id: 'anklets', label: 'Anklets' }
  ];

  const styles = [
    { id: 'all', label: 'All Styles' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'classic', label: 'Classic' },
    { id: 'statement', label: 'Statement' },
    { id: 'festive', label: 'Festive' }
  ];

  const occasions = [
    { id: 'all', label: 'All Occasions' },
    { id: 'everyday', label: 'Everyday Wear' },
    { id: 'office', label: 'Office & Minimal' },
    { id: 'festive', label: 'Festive Looks' },
    { id: 'gifting', label: 'Gifting' }
  ];

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (initialSearch) {
      const q = initialSearch.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (initialBadge) {
      result = result.filter(p => p.badge === initialBadge);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedStyle !== 'all') {
      result = result.filter(p => p.style.includes(selectedStyle as any));
    }

    if (selectedOccasion !== 'all') {
      result = result.filter(p => p.occasion.includes(selectedOccasion as any));
    }

    result = result.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else if (sortBy === 'bestselling') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, selectedStyle, selectedOccasion, priceRange, sortBy, initialSearch, initialBadge]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedOccasion('all');
    setSelectedStyle('all');
    setPriceRange(10000);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedOccasion !== 'all' ||
    selectedStyle !== 'all' ||
    priceRange < 10000;

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)', marginBottom: '8px' }}>
            <span>Home</span> / <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>Shop Jewellery</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--color-espresso)', marginBottom: '8px' }}>
            Fine 925 Sterling Jewellery
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-muted-text)', maxWidth: '680px' }}>
            Explore our hallmark-certified solid silver catalogue. Designed with anti-tarnish rhodium finish for everyday poise and festive splendour.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: 'var(--bg-cream)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          {/* Left Category Quick Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', maxWidth: '70%' }} className="quick-category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  backgroundColor: selectedCategory === cat.id ? 'var(--color-espresso)' : '#FFFFFF',
                  color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--color-espresso)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Sort & Mobile Filter Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
              className="mobile-filter-trigger"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-muted-text)', whiteSpace: 'nowrap' }} className="hidden-mobile">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-espresso)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="featured">Featured First</option>
                <option value="bestselling">Best Selling</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="shop-layout-grid">
          {/* Desktop Sidebar Filters */}
          <aside className="desktop-filter-sidebar">
            <div
              style={{
                backgroundColor: 'var(--bg-cream)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-card)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                position: 'sticky',
                top: '90px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  Filter Jewels
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    style={{ fontSize: '0.75rem', color: 'var(--color-copper)', fontWeight: 600 }}
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>Max Price:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-champagne)' }}>₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-champagne)', cursor: 'pointer' }}
                />
              </div>

              {/* Style Filter */}
              <div>
                <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted-text)', marginBottom: '12px' }}>
                  Aesthetic Style
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {styles.map(s => (
                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="style"
                        checked={selectedStyle === s.id}
                        onChange={() => setSelectedStyle(s.id)}
                        style={{ accentColor: 'var(--color-espresso)' }}
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasion Filter */}
              <div>
                <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted-text)', marginBottom: '12px' }}>
                  Occasion
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {occasions.map(o => (
                    <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="occasion"
                        checked={selectedOccasion === o.id}
                        onChange={() => setSelectedOccasion(o.id)}
                        style={{ accentColor: 'var(--color-espresso)' }}
                      />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {/* Results Count & Active Tags */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)' }}>
                Showing <strong>{filteredProducts.length}</strong> handcrafted silver pieces
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
                <Sparkles size={36} color="var(--color-champagne)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '8px' }}>No pieces match your selected filters.</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', marginBottom: '20px' }}>
                  Try resetting price range or selecting another style category.
                </p>
                <button onClick={resetFilters} className="btn-primary">Reset All Filters</button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px'
                }}
                className="shop-products-grid"
              >
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setIsMobileFilterOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(20, 18, 15, 0.5)' }} />
          <div style={{ position: 'relative', width: '85vw', maxWidth: '340px', height: '100%', backgroundColor: 'var(--bg-cream)', padding: '24px', zIndex: 10, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Filter Jewels</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}><X size={20} /></button>
            </div>
            {/* Same controls for mobile */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span>Max Price:</span>
                <strong>₹{priceRange.toLocaleString('en-IN')}</strong>
              </div>
              <input type="range" min="1000" max="10000" step="500" value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Style</h4>
              {styles.map(s => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <input type="radio" name="m-style" checked={selectedStyle === s.id} onChange={() => setSelectedStyle(s.id)} />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Occasion</h4>
              {occasions.map(o => (
                <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <input type="radio" name="m-occ" checked={selectedOccasion === o.id} onChange={() => setSelectedOccasion(o.id)} />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
            <button onClick={() => setIsMobileFilterOpen(false)} className="btn-primary" style={{ width: '100%' }}>
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 1024px) {
          .shop-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .desktop-filter-sidebar {
            display: none !important;
          }
          .mobile-filter-trigger {
            display: flex !important;
          }
          .shop-products-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .shop-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .quick-category-tabs {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px 0', textAlign: 'center' }}>Loading Shop Catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
