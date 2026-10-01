import React from 'react';
import Link from 'next/link';
import { Gift, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { getProductsFromDb } from '@/lib/services/products';

const GIFT_CATEGORIES = [
  { title: 'For Her', desc: 'Delicate floral halos & pearls', link: '/shop?occasion=gifting', count: '24 Designs' },
  { title: 'For Him', desc: 'Textured kada bangles & minimal rings', link: '/shop?category=bracelets', count: '12 Designs' },
  { title: 'Anniversary', desc: 'Timeless polki chokers & ruby sets', link: '/shop?style=statement', count: '18 Designs' },
  { title: 'Birthday Delights', desc: 'Personalised engravable silver', link: '/shop?badge=ENGRAVABLE', count: '16 Designs' },
  { title: 'Under ₹1,999', desc: 'Affordable luxury silver everyday wear', link: '/shop', count: '30 Designs' },
  { title: 'Under ₹2,999', desc: 'Festive statement pieces with hallmark', link: '/shop', count: '45 Designs' }
];

export default async function GiftsPage() {
  const result = await getProductsFromDb({ occasion: 'gifting', limit: 12 });
  const giftingProducts = result.products.length > 0
    ? result.products
    : (await getProductsFromDb({ limit: 12 })).products;

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container">
        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
          <span className="eyebrow">CURATED LUXURY</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-espresso)', marginBottom: '16px' }}>
            Give Something Meaningful
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-muted-text)', lineHeight: 1.7 }}>
            Celebrate milestones, love, and joyous occasions with pure 925 sterling silver gifts that last a lifetime. Includes bespoke packaging and personalized handwritten greeting cards.
          </p>
        </div>

        {/* Gift Categories Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '72px' }} className="gift-categories-grid">
          {GIFT_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              style={{
                backgroundColor: 'var(--bg-cream)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
              className="gift-cat-card"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--color-champagne)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {cat.count}
                  </span>
                  <Gift size={20} color="var(--color-champagne)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '6px' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', margin: 0 }}>
                  {cat.desc}
                </p>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-espresso)', marginTop: '20px' }}>
                <span>Explore Curated Pieces</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Gift Pieces */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <span className="eyebrow">HANDPICKED</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--color-espresso)' }}>
                Most Cherished Gift Pieces
              </h2>
            </div>
            <Link href="/shop?occasion=gifting" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
              <span>View All Gifting</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="gift-products-grid">
            {giftingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
