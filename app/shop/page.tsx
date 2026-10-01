'use client';

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/types';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
  ShieldCheck,
  Award,
  Flower2,
  HeartHandshake,
  Check,
  ArrowUpDown,
} from 'lucide-react';

/* Subcategories mapping for each primary category */
const SUBCATEGORIES_CONFIG: Record<
  string,
  { label: string; value: string; image: string }[]
> = {
  necklaces: [
    { label: 'All Necklaces', value: 'all', image: '/images/collection-necklaces.jpg' },
    { label: 'Choker Necklaces', value: 'choker', image: '/images/products/necklaces-pearl-blossom-collar-01.png' },
    { label: 'Pendant Necklaces', value: 'pendant', image: '/images/why-choose/ethically-sourced-necklace.jpg' },
    { label: 'Layered Necklaces', value: 'layered', image: '/images/products/necklaces-modern-baroque-pearl-chain-01.png' },
    { label: 'Temple Necklaces', value: 'temple', image: '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg' },
    { label: 'Pearl Necklaces', value: 'pearl', image: '/images/occasions/everyday-elegance.jpg' },
    { label: 'Statement Sets', value: 'statement', image: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg' },
  ],
  earrings: [
    { label: 'All Earrings', value: 'all', image: '/images/collection-earrings.jpg' },
    { label: 'Chandbalis', value: 'chandbali', image: '/images/collections/earrings-editorial.jpg' },
    { label: 'Jhumkis', value: 'jhumki', image: '/images/why-choose/unique-designs-earrings.jpg' },
    { label: 'Studs', value: 'stud', image: '/images/collection-earrings.jpg' },
    { label: 'Drops & Danglers', value: 'drop', image: '/images/collections/earrings-editorial.jpg' },
    { label: 'Hoops', value: 'hoop', image: '/images/collection-earrings.jpg' },
    { label: 'Floral Clusters', value: 'floral', image: '/images/why-choose/unique-designs-earrings.jpg' },
  ],
  rings: [
    { label: 'All Rings', value: 'all', image: '/images/collection-rings.jpg' },
    { label: 'Solitaire Rings', value: 'solitaire', image: '/images/why-choose/premium-quality-ring.jpg' },
    { label: 'Band Rings', value: 'band', image: '/images/collections/rings-editorial.jpg' },
    { label: 'Eternity Rings', value: 'eternity', image: '/images/collection-rings.jpg' },
    { label: 'Statement Rings', value: 'statement', image: '/images/collections/rings-editorial.jpg' },
    { label: 'Stackable Rings', value: 'stackable', image: '/images/why-choose/premium-quality-ring.jpg' },
  ],
  bracelets: [
    { label: 'All Bracelets', value: 'all', image: '/images/occasions/everyday-elegance.jpg' },
    { label: 'Tennis Bracelets', value: 'tennis', image: '/images/occasions/everyday-elegance.jpg' },
    { label: 'Cuff Bracelets', value: 'cuff', image: '/images/occasions/everyday-elegance.jpg' },
    { label: 'Chain Bracelets', value: 'chain', image: '/images/occasions/everyday-elegance.jpg' },
    { label: 'Charm Bracelets', value: 'charm', image: '/images/occasions/gifting-collection.jpg' },
    { label: 'Bangles', value: 'bangle', image: '/images/occasions/bridal-collection.jpg' },
  ],
  pendants: [
    { label: 'All Pendants', value: 'all', image: '/images/why-choose/ethically-sourced-necklace.jpg' },
    { label: 'Solitaire Pendants', value: 'solitaire', image: '/images/why-choose/ethically-sourced-necklace.jpg' },
    { label: 'Floral Pendants', value: 'floral', image: '/images/products/necklaces-modern-baroque-pearl-chain-01.png' },
    { label: 'Teardrop Pendants', value: 'teardrop', image: '/images/why-choose/ethically-sourced-necklace.jpg' },
    { label: 'Temple & Spiritual', value: 'temple', image: '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg' },
  ],
  anklets: [
    { label: 'All Anklets', value: 'all', image: '/images/collection-earrings.jpg' },
    { label: 'Minimal Chains', value: 'minimal', image: '/images/collection-earrings.jpg' },
    { label: 'Charm Anklets', value: 'charm', image: '/images/collection-earrings.jpg' },
    { label: 'Traditional Payal', value: 'traditional', image: '/images/collection-earrings.jpg' },
  ],
};

/* Category editorial headers data */
const CATEGORY_EDITORIAL_INFO: Record<
  string,
  { title: string; eyebrow: string; description: string; image: string }
> = {
  necklaces: {
    eyebrow: '925 STERLING CURATION',
    title: 'Necklaces Collection',
    description:
      'Handcrafted in solid 925 sterling silver with precision settings and rhodium protective seal. Each piece is hallmarked by BIS for assured bullion purity.',
    image: '/images/collections/necklace-editorial.jpg',
  },
  earrings: {
    eyebrow: '925 STERLING CURATION',
    title: 'Earrings Collection',
    description:
      'From delicate daily studs to regal festive chandbalis, crafted in pure sterling silver with luminous freshwater pearls and crystal brilliance.',
    image: '/images/collections/earrings-editorial.jpg',
  },
  rings: {
    eyebrow: '925 STERLING CURATION',
    title: 'Rings Collection',
    description:
      'Symbols of devotion and modern empowerment. Hand-sculpted by Jaipur artisans with certified cubic zirconia and anti-tarnish protective barrier.',
    image: '/images/collections/rings-editorial.jpg',
  },
  bracelets: {
    eyebrow: '925 STERLING CURATION',
    title: 'Bracelets Collection',
    description:
      'Featherlight wrist essentials and statement cuffs in 925 hallmarked sterling silver, designed for effortless stacking and lasting radiance.',
    image: '/images/occasions/everyday-elegance.jpg',
  },
  pendants: {
    eyebrow: '925 STERLING CURATION',
    title: 'Pendants Collection',
    description:
      'Intricately detailed talisman pendants and gemstone motifs cast in solid sterling silver for everyday meaning and graceful poise.',
    image: '/images/why-choose/ethically-sourced-necklace.jpg',
  },
  anklets: {
    eyebrow: '925 STERLING CURATION',
    title: 'Anklets Collection',
    description:
      'Delicate silver payal and modern ankle chains designed with soothing motion, comfortable clasps, and high-purity hallmarked silver.',
    image: '/images/collection-earrings.jpg',
  },
};

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL query params
  const categoryParam = searchParams.get('category') || 'all';
  const subcategoryParam = searchParams.get('subcategory') || 'all';
  const collectionParam = searchParams.get('collection') || '';
  const occasionParam = searchParams.get('occasion') || 'all';
  const badgeParam = searchParams.get('badge') || '';
  const searchParam = searchParams.get('search') || '';

  // Dynamic MongoDB state
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Local state
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    occasionParam !== 'all' ? [occasionParam] : []
  );
  const [inStockOnly, setInStockOnly] = useState(true);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<
    'featured' | 'newest' | 'bestselling' | 'price-low' | 'price-high'
  >('featured');

  // Mobile modals state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // Fetch products dynamically from MongoDB
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (collectionParam) params.set('collection', collectionParam);
      if (badgeParam) params.set('badge', badgeParam);
      if (searchParam) params.set('search', searchParam);
      if (selectedOccasions.length === 1) params.set('occasion', selectedOccasions[0]);
      params.set('limit', '60');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDbProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, collectionParam, badgeParam, searchParam, selectedOccasions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync state when URL params change
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedSubcategory(subcategoryParam);
    if (occasionParam !== 'all') {
      setSelectedOccasions([occasionParam]);
    }
  }, [categoryParam, subcategoryParam, occasionParam]);

  // Update query params helper
  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Switch Category
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('all');
    updateUrlParam('category', cat);
    updateUrlParam('subcategory', 'all');
  };

  // Switch Subcategory
  const handleSubcategorySelect = (sub: string) => {
    setSelectedSubcategory(sub);
    updateUrlParam('subcategory', sub);
  };

  // Filter products logic from MongoDB data
  const filteredProducts = useMemo(() => {
    let result = [...dbProducts];

    // Search query
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Subcategory matching (name, description or style)
    if (selectedSubcategory && selectedSubcategory !== 'all') {
      const sub = selectedSubcategory.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(sub) ||
          p.description?.toLowerCase().includes(sub) ||
          p.shortDescription?.toLowerCase().includes(sub) ||
          p.style?.some((s) => s.toLowerCase().includes(sub))
      );
    }

    // Collection (new-arrivals, best-sellers)
    if (collectionParam === 'new-arrivals') {
      result = result.filter((p) => p.isNewArrival || p.badge === 'NEW ARRIVAL');
    } else if (collectionParam === 'best-sellers') {
      result = result.filter((p) => p.isBestSeller || p.badge === 'BEST SELLER');
    }

    // Badge
    if (badgeParam) {
      result = result.filter((p) => p.badge === badgeParam);
    }

    // Occasion
    if (selectedOccasions.length > 0) {
      result = result.filter((p) =>
        selectedOccasions.some((occ) => p.occasion?.includes(occ as any))
      );
    }

    // Availability
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Price range
    result = result.filter((p) => p.price <= priceRange);

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
  }, [
    dbProducts,
    selectedCategory,
    selectedSubcategory,
    selectedOccasions,
    inStockOnly,
    priceRange,
    sortBy,
    searchParam,
    collectionParam,
    badgeParam,
  ]);


  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedOccasions([]);
    setInStockOnly(false);
    setPriceRange(10000);
    router.push('/shop', { scroll: false });
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    selectedOccasions.length > 0 ||
    priceRange < 10000 ||
    !inStockOnly;

  // Active category editorial info
  const editorial =
    CATEGORY_EDITORIAL_INFO[selectedCategory] || {
      eyebrow: '925 STERLING CURATION',
      title:
        collectionParam === 'new-arrivals'
          ? 'New Arrivals Collection'
          : collectionParam === 'best-sellers'
          ? 'Best Sellers Collection'
          : 'Fine 925 Sterling Jewellery',
      description:
        'Explore our hallmark-certified solid silver catalogue. Designed with anti-tarnish rhodium finish for everyday poise and festive splendour.',
      image: '/images/editorial/bridal-banner-clean-hd.jpg',
    };

  // Subcategories list for active category
  const activeSubcategories =
    SUBCATEGORIES_CONFIG[selectedCategory] || [
      { label: 'All Jewellery', value: 'all', image: '/images/editorial/bridal-banner-clean-hd.jpg' },
      { label: 'Necklaces', value: 'necklaces', image: '/images/collection-necklaces.jpg' },
      { label: 'Earrings', value: 'earrings', image: '/images/collection-earrings.jpg' },
      { label: 'Rings', value: 'rings', image: '/images/collection-rings.jpg' },
      { label: 'Bracelets', value: 'bracelets', image: '/images/occasions/everyday-elegance.jpg' },
      { label: 'Pendants', value: 'pendants', image: '/images/why-choose/ethically-sourced-necklace.jpg' },
    ];

  const categoryDisplayName =
    selectedCategory !== 'all'
      ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
      : 'All Pieces';

  return (
    <div className="shop-page-wrapper">
      <div className="container">
        {/* ========================================================================= */}
        {/* 1. BREADCRUMB                                                             */}
        {/* ========================================================================= */}
        <nav aria-label="Breadcrumb" className="shop-breadcrumbs">
          <Link href="/" className="crumb-link">
            Home
          </Link>
          <span className="crumb-sep">/</span>
          <Link href="/shop" className="crumb-link">
            Shop
          </Link>
          {selectedCategory !== 'all' && (
            <>
              <span className="crumb-sep">/</span>
              <span className="crumb-active">{categoryDisplayName}</span>
            </>
          )}
        </nav>

        {/* ========================================================================= */}
        {/* 2. CATEGORY EDITORIAL HERO (Ivory / Blush / Soft Champagne)               */}
        {/* ========================================================================= */}
        <div className="category-editorial-hero">
          <div className="hero-text-block">
            <span className="hero-eyebrow">{editorial.eyebrow}</span>
            <h1 className="hero-heading">{editorial.title}</h1>
            <p className="hero-desc">{editorial.description}</p>

            {/* 4 Compact Benefit Strip Pills */}
            <div className="category-benefit-strip">
              <div className="benefit-pill">
                <Award size={15} color="#B76E79" />
                <span>BIS Hallmarked</span>
              </div>
              <div className="benefit-pill">
                <Flower2 size={15} color="#B76E79" />
                <span>Tarnish Resistant</span>
              </div>
              <div className="benefit-pill">
                <ShieldCheck size={15} color="#B76E79" />
                <span>Skin Friendly</span>
              </div>
              <div className="benefit-pill">
                <Sparkles size={15} color="#B76E79" />
                <span>Lifetime Elegance</span>
              </div>
            </div>
          </div>

          <div className="hero-media-block">
            <div className="hero-media-wrapper">
              <Image
                src={editorial.image}
                alt={editorial.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 42vw"
                className="hero-media-img"
              />
              <div className="hero-media-soft-gradient" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SUBCATEGORY CAROUSEL CHIPS (Horizontal Scrollable Thumbnail Cards)      */}
        {/* ========================================================================= */}
        <div className="subcategory-carousel-container">
          <div className="subcategory-track">
            {activeSubcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub.value;

              return (
                <button
                  key={sub.value}
                  onClick={() => {
                    if (selectedCategory === 'all' && sub.value !== 'all') {
                      handleCategorySelect(sub.value);
                    } else {
                      handleSubcategorySelect(sub.value);
                    }
                  }}
                  className={`subcategory-chip-card ${isSelected ? 'active-chip' : ''}`}
                >
                  <div className="chip-thumbnail-box">
                    <Image
                      src={sub.image}
                      alt={sub.label}
                      fill
                      sizes="80px"
                      className="chip-thumbnail-img"
                    />
                  </div>
                  <span className="chip-label">{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. SHOP TOOLBAR (Showing X Pieces, Sort By, Mobile Filter Trigger)        */}
        {/* ========================================================================= */}
        <div className="shop-toolbar-bar">
          <div className="toolbar-left">
            <span className="results-count-text">
              Showing <strong>{filteredProducts.length}</strong>{' '}
              {selectedCategory !== 'all' ? categoryDisplayName : 'Jewellery Pieces'}
            </span>
          </div>

          <div className="toolbar-right">
            {/* Desktop / Tablet Sort Select */}
            <div className="desktop-sort-box">
              <span className="sort-label">Sort By:</span>
              <div className="sort-select-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="sort-native-select"
                >
                  <option value="featured">Featured First</option>
                  <option value="bestselling">Best Selling</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="sort-chevron-icon" />
              </div>
            </div>

            {/* Mobile Filter / Sort Buttons */}
            <div className="mobile-toolbar-actions">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="mobile-tool-btn filter-btn"
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
                {hasActiveFilters && <span className="active-dot" />}
              </button>

              <button
                onClick={() => setIsMobileSortOpen(true)}
                className="mobile-tool-btn sort-btn"
              >
                <ArrowUpDown size={14} />
                <span>Sort</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. MAIN LAYOUT: DESKTOP FILTER SIDEBAR + PRODUCT GRID                      */}
        {/* ========================================================================= */}
        <div className="shop-layout-split">
          {/* Left Sidebar Filter Panel (Desktop) */}
          <aside className="desktop-filter-sidebar">
            <div className="filter-panel-card">
              <div className="filter-panel-header">
                <h3 className="filter-panel-title">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="clear-all-btn">
                    Clear All
                  </button>
                )}
              </div>

              {/* 1. Availability */}
              <div className="filter-group">
                <div className="filter-group-header">Availability</div>
                <div className="checkbox-stack">
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="custom-checkbox"
                    />
                    <span>In Stock ({dbProducts.filter((p) => p.inStock).length})</span>
                  </label>
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={!inStockOnly}
                      onChange={(e) => setInStockOnly(!e.target.checked)}
                      className="custom-checkbox"
                    />
                    <span>All Items ({dbProducts.length})</span>
                  </label>
                </div>
              </div>

              {/* 2. Price Range Slider */}
              <div className="filter-group">
                <div className="filter-group-header">Price Range</div>
                <div className="price-slider-display">
                  <span>₹0</span>
                  <span className="price-current-tag">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="price-range-slider"
                />
              </div>

              {/* 3. Category / Subcategory Type */}
              <div className="filter-group">
                <div className="filter-group-header">
                  {selectedCategory !== 'all' ? `${categoryDisplayName} Type` : 'Categories'}
                </div>
                <div className="checkbox-stack">
                  {activeSubcategories.slice(1).map((sub) => {
                    const isChecked = selectedSubcategory === sub.value;

                    return (
                      <label key={sub.value} className="filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            handleSubcategorySelect(isChecked ? 'all' : sub.value)
                          }
                          className="custom-checkbox"
                        />
                        <span>{sub.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Occasion */}
              <div className="filter-group">
                <div className="filter-group-header">Occasion</div>
                <div className="checkbox-stack">
                  {[
                    { id: 'everyday', label: 'Everyday' },
                    { id: 'festive', label: 'Festive' },
                    { id: 'bridal', label: 'Bridal' },
                    { id: 'gifting', label: 'Gifts' },
                  ].map((occ) => {
                    const isChecked = selectedOccasions.includes(occ.id);

                    return (
                      <label key={occ.id} className="filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedOccasions((prev) => prev.filter((o) => o !== occ.id));
                            } else {
                              setSelectedOccasions((prev) => [...prev, occ.id]);
                            }
                          }}
                          className="custom-checkbox"
                        />
                        <span>{occ.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={() => window.scrollTo({ top: 380, behavior: 'smooth' })}
                className="apply-filters-btn"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="shop-products-container">
            {filteredProducts.length === 0 ? (
              <div className="empty-products-state">
                <Sparkles size={40} color="#B76E79" className="empty-sparkle-icon" />
                <h3 className="empty-state-title">No pieces match your selected filters.</h3>
                <p className="empty-state-desc">
                  Try adjusting the price range or resetting occasion and category filters.
                </p>
                <button onClick={resetFilters} className="empty-reset-pill">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="shop-product-grid">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 6} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. MOBILE STICKY BOTTOM TOOLBAR ([FILTER]  [SORT])                        */}
      {/* ========================================================================= */}
      <div className="mobile-sticky-bottom-toolbar">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="mobile-sticky-btn"
        >
          <SlidersHorizontal size={15} />
          <span>FILTER</span>
          {hasActiveFilters && <span className="sticky-dot" />}
        </button>

        <div className="mobile-sticky-sep" />

        <button
          onClick={() => setIsMobileSortOpen(true)}
          className="mobile-sticky-btn"
        >
          <ArrowUpDown size={15} />
          <span>SORT</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 7. MOBILE FULL-HEIGHT FILTER DRAWER                                       */}
      {/* ========================================================================= */}
      {isMobileFilterOpen && (
        <div className="mobile-filter-drawer-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
          <div
            className="mobile-filter-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <h3 className="drawer-title">Filter Jewels</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="drawer-close-btn"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="drawer-content-scroll">
              {/* Availability */}
              <div className="drawer-section">
                <span className="drawer-section-title">Availability</span>
                <label className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Price Range */}
              <div className="drawer-section">
                <div className="price-slider-display">
                  <span className="drawer-section-title">Max Price:</span>
                  <span className="price-current-tag">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="price-range-slider"
                />
              </div>

              {/* Subcategories */}
              <div className="drawer-section">
                <span className="drawer-section-title">
                  {selectedCategory !== 'all' ? `${categoryDisplayName} Type` : 'Categories'}
                </span>
                <div className="checkbox-stack">
                  {activeSubcategories.slice(1).map((sub) => (
                    <label key={sub.value} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedSubcategory === sub.value}
                        onChange={() =>
                          handleSubcategorySelect(
                            selectedSubcategory === sub.value ? 'all' : sub.value
                          )
                        }
                        className="custom-checkbox"
                      />
                      <span>{sub.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className="drawer-section">
                <span className="drawer-section-title">Occasion</span>
                <div className="checkbox-stack">
                  {[
                    { id: 'everyday', label: 'Everyday Wear' },
                    { id: 'festive', label: 'Festive & Celebration' },
                    { id: 'bridal', label: 'Bridal Collection' },
                    { id: 'gifting', label: 'Gifting Sets' },
                  ].map((occ) => {
                    const isChecked = selectedOccasions.includes(occ.id);
                    return (
                      <label key={occ.id} className="filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedOccasions((prev) => prev.filter((o) => o !== occ.id));
                            } else {
                              setSelectedOccasions((prev) => [...prev, occ.id]);
                            }
                          }}
                          className="custom-checkbox"
                        />
                        <span>{occ.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button onClick={resetFilters} className="drawer-reset-btn">
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="drawer-apply-btn"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MOBILE BOTTOM-SHEET SORT SELECTOR                                      */}
      {/* ========================================================================= */}
      {isMobileSortOpen && (
        <div className="mobile-sort-sheet-backdrop" onClick={() => setIsMobileSortOpen(false)}>
          <div
            className="mobile-sort-sheet-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-header">
              <span className="sheet-title">Sort By</span>
              <button
                onClick={() => setIsMobileSortOpen(false)}
                className="sheet-close-btn"
                aria-label="Close sort"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sheet-options-list">
              {[
                { value: 'featured', label: 'Featured First' },
                { value: 'bestselling', label: 'Best Selling' },
                { value: 'newest', label: 'New Arrivals' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value as any);
                    setIsMobileSortOpen(false);
                  }}
                  className={`sheet-option-item ${sortBy === opt.value ? 'selected-option' : ''}`}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.value && <Check size={16} color="#B76E79" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STYLES: EDITORIAL ECOMMERCE SHOP PAGE                                     */}
      {/* ========================================================================= */}
      <style jsx>{`
        .shop-page-wrapper {
          background-color: #FFF9F3;
          min-height: 100vh;
          padding-top: 24px;
          padding-bottom: 90px;
        }

        /* BREADCRUMB */
        .shop-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #806D68;
          margin-bottom: 22px;
        }

        :global(.crumb-link) {
          color: #806D68;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        :global(.crumb-link:hover) {
          color: #B76E79;
        }

        .crumb-sep {
          color: #D9C2B8;
        }

        .crumb-active {
          color: #342727;
          font-weight: 600;
        }

        /* CATEGORY EDITORIAL HERO */
        .category-editorial-hero {
          background: linear-gradient(
            135deg,
            #FFFFFF 0%,
            #FFF6F2 48%,
            #FFEFE8 100%
          );
          border-radius: 28px;
          border: 1px solid rgba(232, 216, 208, 0.85);
          box-shadow: 0 14px 40px rgba(59, 43, 43, 0.06);
          padding: clamp(28px, 4vw, 44px);
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(24px, 4vw, 48px);
          align-items: center;
          margin-bottom: 34px;
          overflow: hidden;
          position: relative;
        }

        .hero-text-block {
          z-index: 2;
        }

        .hero-eyebrow {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #B76E79;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .hero-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          font-weight: 500;
          color: #342727;
          line-height: 1.08;
          margin: 0 0 12px 0;
          letter-spacing: -0.01em;
        }

        .hero-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.94rem;
          color: #806D68;
          line-height: 1.6;
          margin: 0 0 24px 0;
          max-width: 560px;
        }

        /* BENEFIT STRIP */
        .category-benefit-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .benefit-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(232, 216, 208, 0.85);
          padding: 6px 14px;
          border-radius: 999px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          font-weight: 500;
          color: #342727;
          box-shadow: 0 2px 8px rgba(59, 43, 43, 0.04);
        }

        .hero-media-block {
          position: relative;
          z-index: 1;
        }

        .hero-media-wrapper {
          position: relative;
          width: 100%;
          height: clamp(240px, 26vw, 320px);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(59, 43, 43, 0.1);
          border: 1px solid rgba(232, 216, 208, 0.85);
          background-color: #FFE3D3;
        }

        :global(.hero-media-img) {
          object-fit: cover;
          object-position: center 25%;
        }

        .hero-media-soft-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 60%,
            rgba(59, 43, 43, 0.15) 100%
          );
        }

        /* SUBCATEGORY CAROUSEL CHIPS */
        .subcategory-carousel-container {
          margin-bottom: 28px;
        }

        .subcategory-track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 4px 2px 14px 2px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .subcategory-track::-webkit-scrollbar {
          display: none;
        }

        .subcategory-chip-card {
          flex: 0 0 clamp(100px, 11vw, 130px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px 8px 12px 8px;
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.85);
          border-radius: 18px;
          cursor: pointer;
          scroll-snap-align: start;
          transition: all 0.22s ease;
          box-shadow: 0 3px 12px rgba(59, 43, 43, 0.04);
        }

        .subcategory-chip-card:hover {
          border-color: #B76E79;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.15);
        }

        .subcategory-chip-card.active-chip {
          background-color: #B76E79;
          border-color: #B76E79;
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.35);
        }

        .chip-thumbnail-box {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #FFE3D3;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
        }

        :global(.chip-thumbnail-img) {
          object-fit: cover;
        }

        .chip-label {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          font-weight: 500;
          color: #342727;
          text-align: center;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .active-chip .chip-label {
          color: #FFFFFF;
          font-weight: 600;
        }

        /* SHOP TOOLBAR */
        .shop-toolbar-bar {
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.85);
          border-radius: 18px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          box-shadow: 0 4px 16px rgba(59, 43, 43, 0.04);
        }

        .results-count-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.88rem;
          color: #806D68;
        }

        .results-count-text strong {
          color: #342727;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .desktop-sort-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-label {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          color: #806D68;
        }

        .sort-select-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .sort-native-select {
          appearance: none;
          background: #FFF9F3;
          border: 1px solid rgba(232, 216, 208, 0.85);
          border-radius: 999px;
          padding: 7px 30px 7px 14px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          color: #342727;
          font-weight: 500;
          cursor: pointer;
          outline: none;
        }

        .sort-chevron-icon {
          position: absolute;
          right: 10px;
          pointer-events: none;
          color: #806D68;
        }

        .mobile-toolbar-actions {
          display: none;
          gap: 8px;
        }

        .mobile-tool-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid rgba(232, 216, 208, 0.85);
          background: #FFF9F3;
          color: #342727;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          position: relative;
        }

        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #B76E79;
        }

        /* SHOP LAYOUT: SIDEBAR + PRODUCT GRID */
        .shop-layout-split {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 28px;
          align-items: flex-start;
        }

        /* DESKTOP FILTER SIDEBAR */
        .desktop-filter-sidebar {
          position: sticky;
          top: 90px;
        }

        .filter-panel-card {
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.85);
          border-radius: 22px;
          padding: 22px;
          box-shadow: 0 6px 20px rgba(59, 43, 43, 0.05);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .filter-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(232, 216, 208, 0.65);
        }

        .filter-panel-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #342727;
          margin: 0;
        }

        .clear-all-btn {
          background: none;
          border: none;
          color: #B76E79;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-group-header {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #342727;
        }

        .checkbox-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          color: #6F5A58;
          cursor: pointer;
          user-select: none;
        }

        .custom-checkbox {
          accent-color: #B76E79;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }

        .price-slider-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          color: #806D68;
        }

        .price-current-tag {
          color: #B76E79;
          font-weight: 600;
        }

        .price-range-slider {
          width: 100%;
          accent-color: #B76E79;
          cursor: pointer;
        }

        .apply-filters-btn {
          width: 100%;
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          padding: 11px;
          border-radius: 999px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.3);
          transition: background-color 0.2s ease;
        }

        .apply-filters-btn:hover {
          background-color: #9C5762;
        }

        /* PRODUCT GRID */
        .shop-products-container {
          min-height: 400px;
        }

        .shop-product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* EMPTY STATE */
        .empty-products-state {
          text-align: center;
          padding: 70px 24px;
          background: #FFFFFF;
          border-radius: 22px;
          border: 1px solid rgba(232, 216, 208, 0.85);
          box-shadow: 0 6px 20px rgba(59, 43, 43, 0.04);
        }

        :global(.empty-sparkle-icon) {
          margin: 0 auto 14px;
        }

        .empty-state-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.5rem;
          color: #342727;
          margin: 0 0 8px 0;
        }

        .empty-state-desc {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.88rem;
          color: #806D68;
          margin: 0 0 20px 0;
        }

        .empty-reset-pill {
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          padding: 10px 24px;
          border-radius: 999px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
        }

        /* MOBILE STICKY TOOLBAR */
        .mobile-sticky-bottom-toolbar {
          display: none;
          position: fixed;
          bottom: 70px;
          left: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(232, 216, 208, 0.85);
          border-radius: 999px;
          box-shadow: 0 8px 30px rgba(59, 43, 43, 0.18);
          z-index: 120;
          align-items: center;
          height: 48px;
        }

        .mobile-sticky-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: none;
          border: none;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #342727;
          cursor: pointer;
          position: relative;
        }

        .sticky-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #B76E79;
        }

        .mobile-sticky-sep {
          width: 1px;
          height: 22px;
          background-color: #E8D8D0;
        }

        /* MOBILE FILTER DRAWER */
        .mobile-filter-drawer-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(59, 43, 43, 0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 250;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-filter-drawer-panel {
          width: 86vw;
          max-width: 360px;
          height: 100%;
          background: #FFF9F3;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(59, 43, 43, 0.2);
          animation: slideInRight 0.25s ease;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .drawer-header {
          padding: 18px 20px;
          border-bottom: 1px solid #E8D8D0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .drawer-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          color: #342727;
          margin: 0;
        }

        .drawer-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #FFE3D3;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #342727;
          cursor: pointer;
        }

        .drawer-content-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .drawer-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .drawer-section-title {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #342727;
        }

        .drawer-footer {
          padding: 16px 20px;
          border-top: 1px solid #E8D8D0;
          display: flex;
          gap: 12px;
          background: #FFFFFF;
        }

        .drawer-reset-btn {
          flex: 0 0 80px;
          border: 1px solid #E8D8D0;
          background: #FFFFFF;
          padding: 10px;
          border-radius: 999px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #342727;
          cursor: pointer;
        }

        .drawer-apply-btn {
          flex: 1;
          border: none;
          background: #B76E79;
          color: #FFFFFF;
          padding: 10px;
          border-radius: 999px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
        }

        /* MOBILE SORT SHEET */
        .mobile-sort-sheet-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(59, 43, 43, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 250;
          display: flex;
          align-items: flex-end;
        }

        .mobile-sort-sheet-panel {
          width: 100%;
          background: #FFF9F3;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          padding: 20px 20px 34px 20px;
          animation: slideUp 0.22s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .sheet-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.3rem;
          color: #342727;
          font-weight: 600;
        }

        .sheet-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #FFE3D3;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #342727;
          cursor: pointer;
        }

        .sheet-options-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sheet-option-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: #FFFFFF;
          border: 1px solid rgba(232, 216, 208, 0.8);
          border-radius: 14px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.86rem;
          color: #342727;
          cursor: pointer;
        }

        .sheet-option-item.selected-option {
          border-color: #B76E79;
          font-weight: 600;
          color: #B76E79;
          background: #FFF5F2;
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 1100px) {
          .shop-layout-split {
            grid-template-columns: 1fr;
          }
          .desktop-filter-sidebar {
            display: none;
          }
          .desktop-sort-box {
            display: none;
          }
          .mobile-toolbar-actions {
            display: flex;
          }
        }

        @media (max-width: 900px) {
          .category-editorial-hero {
            grid-template-columns: 1fr;
            padding: 24px;
          }
          .hero-media-wrapper {
            height: 220px;
          }
        }

        @media (max-width: 768px) {
          .mobile-sticky-bottom-toolbar {
            display: flex;
          }
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .category-benefit-strip {
            gap: 6px;
          }
          .benefit-pill {
            padding: 4px 10px;
            font-size: 0.72rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#FFF9F3', minHeight: '100vh' }}>
          <p style={{ fontFamily: 'var(--font-ui), "Jost", sans-serif', color: '#806D68' }}>
            Loading MK Silver Hub jewellery...
          </p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
