'use client';

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, ChevronDown, X, Check, ArrowUpDown } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/types';
import { useNavigation } from '@/components/navigation/NavigationContext';

const OCCASIONS_LIST = [
  { label: 'Everyday', value: 'everyday' },
  { label: 'Date Night', value: 'date-night' },
  { label: 'Festive', value: 'festive' },
  { label: 'Bridal', value: 'bridal' },
  { label: 'Workwear', value: 'workwear' },
];

const COLLECTIONS_LIST = [
  { label: 'Minimal', value: 'minimal' },
  { label: 'Everyday Essentials', value: 'everyday' },
  { label: 'Royal Heritage', value: 'heritage' },
  { label: 'Bridal Curations', value: 'bridal' },
];

const MATERIALS_LIST = [
  { label: '925 Sterling Silver', value: '925-sterling' },
  { label: 'Oxidised 925 Silver', value: 'oxidised-silver' },
  { label: 'Rhodium Polished', value: 'rhodium' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { categories: navCategories } = useNavigation();

  const categoryParam = searchParams.get('category') || 'all';
  const subcategoryParam = searchParams.get('subcategory') || searchParams.get('sub') || '';
  const collectionParam = searchParams.get('collection') || '';
  const occasionParam = searchParams.get('occasion') || '';
  const searchParam = searchParams.get('q') || searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  // Dynamic MongoDB products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(occasionParam ? [occasionParam] : []);
  const [selectedCollection, setSelectedCollection] = useState<string>(collectionParam);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('925-sterling');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>(sortParam);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Derive dynamic categories list from MongoDB navigation data
  const categoriesList = useMemo(() => {
    return [
      { label: 'All Jewellery', value: 'all' },
      ...navCategories.map((c) => ({
        label: c.name,
        value: c.slug,
      })),
    ];
  }, [navCategories]);

  // Fetch products from MongoDB API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
      if (selectedCollection) params.set('collection', selectedCollection);
      if (searchParam) params.set('search', searchParam);
      params.set('limit', '50');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubcategory, selectedCollection, searchParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedSubcategory(subcategoryParam);
  }, [categoryParam, subcategoryParam]);

  const updateCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('subcategory');
    params.delete('sub');
    if (cat === 'all') params.delete('category');
    else params.set('category', cat);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('');
    setSelectedOccasions([]);
    setSelectedCollection('');
    setSelectedMaterial('925-sterling');
    setInStockOnly(false);
    setPriceRange(10000);
    router.push('/shop', { scroll: false });
  };

  // Filter & Sort Products
  const displayedProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Subcategory filter
    if (selectedSubcategory) {
      const sub = selectedSubcategory.toLowerCase();
      list = list.filter((p) => {
        const pSub = ((p as any).subcategory || (p as any).subcategoryId || '').toLowerCase();
        if (pSub === sub) return true;
        const tags = (p as any).tags;
        if (tags && Array.isArray(tags) && tags.some((t: string) => t.toLowerCase() === sub)) return true;
        if (p.name && p.name.toLowerCase().includes(sub)) return true;
        return false;
      });
    }

    // Occasions filter
    if (selectedOccasions.length > 0) {
      list = list.filter((p) =>
        selectedOccasions.some((occ) => p.occasion?.includes(occ as any))
      );
    }

    // Stock
    if (inStockOnly) {
      list = list.filter((p) => p.inStock !== false);
    }

    // Price
    list = list.filter((p) => p.price <= priceRange);

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else if (sortBy === 'bestseller') {
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, selectedSubcategory, selectedOccasions, inStockOnly, priceRange, sortBy]);

  const categoryTitle =
    selectedCategory !== 'all'
      ? selectedSubcategory
        ? `${selectedCategory.toUpperCase()} — ${selectedSubcategory.replace(/-/g, ' ').toUpperCase()}`
        : selectedCategory.toUpperCase()
      : searchParam
      ? `SEARCH: "${searchParam.toUpperCase()}"`
      : 'ALL JEWELLERY';

  const activeNavCategory = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return null;
    return navCategories.find((c) => c.slug.toLowerCase() === selectedCategory.toLowerCase());
  }, [navCategories, selectedCategory]);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#111111',
        minHeight: '100vh',
        paddingBottom: '80px',
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
        {/* 1. BREADCRUMBS */}
        <nav
          aria-label="Breadcrumb"
          style={{
            padding: '24px 0 16px',
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
          {selectedCategory !== 'all' ? (
            <>
              <Link href="/shop" style={{ color: '#6F6F6A', textDecoration: 'none' }}>
                Shop
              </Link>
              <span>/</span>
              {selectedSubcategory ? (
                <>
                  <Link
                    href={`/shop?category=${selectedCategory}`}
                    style={{ color: '#6F6F6A', textDecoration: 'none', textTransform: 'capitalize' }}
                  >
                    {selectedCategory}
                  </Link>
                  <span>/</span>
                  <span style={{ color: '#111111', fontWeight: 600, textTransform: 'capitalize' }}>
                    {selectedSubcategory.replace(/-/g, ' ')}
                  </span>
                </>
              ) : (
                <span style={{ color: '#111111', fontWeight: 600, textTransform: 'capitalize' }}>
                  {selectedCategory}
                </span>
              )}
            </>
          ) : (
            <span style={{ color: '#111111', fontWeight: 600 }}>Shop</span>
          )}
        </nav>

        {/* 2. CATEGORY HEADER (Title, Subtitle, Product Count & Sort Dropdown) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E8E7E2',
            paddingBottom: '24px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 3.5vw, 2.85rem)',
                fontWeight: 500,
                letterSpacing: '0.04em',
                lineHeight: 1.15,
                margin: '0 0 6px',
                textTransform: 'uppercase',
                color: '#111111',
              }}
            >
              {categoryTitle}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.84rem',
                color: '#6F6F6A',
                margin: 0,
              }}
            >
              Explore our hallmark-certified 925 sterling silver collection.
            </p>
          </div>

          {/* Right: Products Count & Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.8rem',
                color: '#6F6F6A',
              }}
            >
              {displayedProducts.length} {displayedProducts.length === 1 ? 'Piece' : 'Pieces'}
            </span>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="mobile-filter-trigger"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={13} />
              <span>FILTERS</span>
            </button>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  color: '#6F6F6A',
                  letterSpacing: '0.04em',
                }}
              >
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: '1px solid #E8E7E2',
                  backgroundColor: '#FFFFFF',
                  padding: '7px 12px',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: '#111111',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. MAIN PLP 2-COLUMN LAYOUT (Mockup Screen 4) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '240px minmax(0, 1fr)',
            gap: '40px',
            alignItems: 'start',
          }}
          className="plp-grid-container"
        >
          {/* ======================================================= */}
          {/* LEFT SIDEBAR FILTERS                                     */}
          {/* ======================================================= */}
          <aside className="plp-sidebar-filters" style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '14px',
                borderBottom: '1px solid #E8E7E2',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#111111',
                }}
              >
                FILTERS
              </span>
              <button
                onClick={resetAllFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6F6F6A',
                  fontSize: '0.72rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Reset All
              </button>
            </div>

            {/* Filter 1: Price Range */}
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  marginBottom: '10px',
                  color: '#111111',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <span>Price</span>
                <span style={{ color: '#6F6F6A' }}>Up to ₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#111111',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Filter 2: Category */}
            <div style={{ marginBottom: '28px' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  margin: '0 0 12px',
                }}
              >
                Category
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categoriesList.map((cat) => {
                  const isChecked = selectedCategory === cat.value;
                  return (
                    <div key={cat.value}>
                      <button
                        onClick={() => updateCategory(cat.value)}
                        style={{
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          width: '100%',
                          padding: '3px 0',
                          fontSize: '0.8rem',
                          color: isChecked ? '#111111' : '#6F6F6A',
                          fontWeight: isChecked ? 600 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        <span>{cat.label}</span>
                        {isChecked && <Check size={13} color="#111111" />}
                      </button>

                      {/* Dynamic Subcategories if Category is Active */}
                      {isChecked && activeNavCategory && activeNavCategory.children && activeNavCategory.children.length > 0 && (
                        <div
                          style={{
                            marginLeft: '12px',
                            marginTop: '6px',
                            marginBottom: '6px',
                            paddingLeft: '10px',
                            borderLeft: '1px solid #E8E7E2',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                          }}
                        >
                          <button
                            onClick={() => {
                              setSelectedSubcategory('');
                              const params = new URLSearchParams(searchParams.toString());
                              params.delete('subcategory');
                              params.delete('sub');
                              router.push(`${pathname}?${params.toString()}`, { scroll: false });
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              padding: '2px 0',
                              fontSize: '0.74rem',
                              color: !selectedSubcategory ? '#111111' : '#8A8A85',
                              fontWeight: !selectedSubcategory ? 600 : 400,
                              cursor: 'pointer',
                            }}
                          >
                            All {activeNavCategory.name}
                          </button>
                          {activeNavCategory.children.map((sub) => (
                            <button
                              key={sub.slug}
                              onClick={() => {
                                setSelectedSubcategory(sub.slug);
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('subcategory', sub.slug);
                                router.push(`${pathname}?${params.toString()}`, { scroll: false });
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                padding: '2px 0',
                                fontSize: '0.74rem',
                                color: selectedSubcategory === sub.slug ? '#111111' : '#8A8A85',
                                fontWeight: selectedSubcategory === sub.slug ? 600 : 400,
                                cursor: 'pointer',
                              }}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Occasion */}
            <div style={{ marginBottom: '28px' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  margin: '0 0 12px',
                }}
              >
                Occasion
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {OCCASIONS_LIST.map((occ) => {
                  const isChecked = selectedOccasions.includes(occ.value);
                  return (
                    <label
                      key={occ.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                        color: isChecked ? '#111111' : '#6F6F6A',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOccasion(occ.value)}
                        style={{ accentColor: '#111111', cursor: 'pointer' }}
                      />
                      <span>{occ.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 4: Collection */}
            <div style={{ marginBottom: '28px' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  margin: '0 0 12px',
                }}
              >
                Collection
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {COLLECTIONS_LIST.map((col) => {
                  const isChecked = selectedCollection === col.value;
                  return (
                    <button
                      key={col.value}
                      onClick={() => setSelectedCollection(isChecked ? '' : col.value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        padding: '3px 0',
                        fontSize: '0.8rem',
                        color: isChecked ? '#111111' : '#6F6F6A',
                        fontWeight: isChecked ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      <span>{col.label}</span>
                      {isChecked && <Check size={13} color="#111111" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 5: Availability */}
            <div style={{ marginBottom: '28px' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  margin: '0 0 12px',
                }}
              >
                Availability
              </h4>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: inStockOnly ? '#111111' : '#6F6F6A',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: '#111111', cursor: 'pointer' }}
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Filter 6: Material */}
            <div style={{ marginBottom: '28px' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  margin: '0 0 12px',
                }}
              >
                Material
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {MATERIALS_LIST.map((mat) => (
                  <label
                    key={mat.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8rem',
                      color: selectedMaterial === mat.value ? '#111111' : '#6F6F6A',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="material"
                      checked={selectedMaterial === mat.value}
                      onChange={() => setSelectedMaterial(mat.value)}
                      style={{ accentColor: '#111111', cursor: 'pointer' }}
                    />
                    <span>{mat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ======================================================= */}
          {/* RIGHT PRODUCT GRID (4 Columns Desktop, 3 Tablet, 2 Mob)  */}
          {/* ======================================================= */}
          <main style={{ width: '100%' }}>
            {loading ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                  gap: '20px',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div
                    key={n}
                    style={{
                      backgroundColor: '#F8F7F3',
                      height: '380px',
                      border: '1px solid #E8E7E2',
                      animation: 'pulse 1.5s infinite',
                    }}
                  />
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  backgroundColor: '#F8F7F3',
                  border: '1px solid #E8E7E2',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                    fontSize: '1.6rem',
                    fontWeight: 500,
                    margin: '0 0 10px',
                  }}
                >
                  No Jewellery Pieces Found
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.85rem',
                    color: '#6F6F6A',
                    margin: '0 0 20px',
                  }}
                >
                  Try adjusting your filter options or search terms to explore our sterling collection.
                </p>
                <button
                  onClick={resetAllFilters}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="plp-product-grid">
                {displayedProducts.map((prod, index) => (
                  <ProductCard
                    key={prod.id || prod._id || prod.slug}
                    product={prod}
                    priority={index < 4}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      {isMobileFilterOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
          }}
        >
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: '85vw',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              padding: '24px',
              overflowY: 'auto',
              boxShadow: '10px 0 30px rgba(0, 0, 0, 0.2)',
              marginLeft: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #E8E7E2',
                paddingBottom: '14px',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.85rem' }}>
                FILTERS
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Filter Controls */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '8px' }}>
                Price (Up to ₹{priceRange.toLocaleString('en-IN')})
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#111111' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '8px' }}>
                Category
              </div>
              {categoriesList.map((c) => {
                const isSelected = selectedCategory === c.value;
                return (
                  <div key={c.value}>
                    <button
                      onClick={() => {
                        updateCategory(c.value);
                        if (c.value === 'all') setIsMobileFilterOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '6px 0',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.82rem',
                        color: isSelected ? '#111111' : '#6F6F6A',
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {c.label}
                    </button>
                    {isSelected && activeNavCategory && activeNavCategory.children && activeNavCategory.children.length > 0 && (
                      <div style={{ paddingLeft: '12px', marginBottom: '6px', borderLeft: '1px solid #E8E7E2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {activeNavCategory.children.map((sub) => (
                          <button
                            key={sub.slug}
                            onClick={() => {
                              setSelectedSubcategory(sub.slug);
                              const params = new URLSearchParams(searchParams.toString());
                              params.set('subcategory', sub.slug);
                              router.push(`${pathname}?${params.toString()}`, { scroll: false });
                              setIsMobileFilterOpen(false);
                            }}
                            style={{
                              display: 'block',
                              textAlign: 'left',
                              padding: '4px 0',
                              background: 'none',
                              border: 'none',
                              fontSize: '0.76rem',
                              color: selectedSubcategory === sub.slug ? '#111111' : '#8A8A85',
                              fontWeight: selectedSubcategory === sub.slug ? 600 : 400,
                            }}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              style={{
                width: '100%',
                padding: '12px 0',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.76rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginTop: '20px',
              }}
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .plp-product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 1200px) {
          .plp-product-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 1024px) {
          .plp-grid-container {
            grid-template-columns: 1fr !important;
          }
          .plp-sidebar-filters {
            display: none !important;
          }
          .mobile-filter-trigger {
            display: inline-flex !important;
          }
        }

        @media (max-width: 640px) {
          .plp-product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
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
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading collection...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
