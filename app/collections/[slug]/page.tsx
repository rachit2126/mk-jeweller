import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { PRODUCTS, CATEGORIES_DATA } from '@/data/products';
import { Sparkles } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES_DATA.find(c => c.id.toLowerCase() === slug.toLowerCase());

  if (!category) {
    notFound();
  }

  const products = PRODUCTS.filter(p => p.category.toLowerCase() === slug.toLowerCase());

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '40px 0 90px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-muted-text)', marginBottom: '24px' }}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/collections">Collections</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>{category.name}</span>
        </div>

        {/* Editorial Collection Hero Banner */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--color-espresso)',
            borderRadius: 'var(--radius-editorial)',
            padding: '60px 48px',
            color: '#FFFFFF',
            marginBottom: '48px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)'
          }}
          className="collection-hero-banner"
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              backgroundColor: 'rgba(201, 163, 90, 0.15)',
              filter: 'blur(80px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
            <span style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-champagne)', fontWeight: 600 }}>
              925 STERLING CURATION
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', fontWeight: 500, color: '#FCFAF6', margin: '8px 0 14px' }}>
              {category.name} Collection
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#ECE7DE', lineHeight: 1.6, marginBottom: '20px' }}>
              Handcrafted in solid 925 sterling silver with precision settings and rhodium protective seal. Each piece is hallmarked by BIS for assured bullion purity.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-champagne)' }}>
              <Sparkles size={16} />
              <span>Showing {products.length} exclusive hallmark-certified designs</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-card)' }}>
            <h3>No designs currently available in this suite.</h3>
            <Link href="/shop" className="btn-primary" style={{ marginTop: '16px' }}>
              Explore All Jewellery
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}
            className="category-products-grid"
          >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
