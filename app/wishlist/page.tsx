'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCommerce();

  if (wishlist.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(201, 163, 90, 0.12)',
              color: 'var(--color-champagne)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}
          >
            <Heart size={32} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '10px' }}>
            Your wishlist is waiting.
          </h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem', marginBottom: '32px' }}>
            Save your favourite sterling silver pieces and revisit them whenever you are ready to treat yourself or a loved one.
          </p>
          <Link href="/shop" className="btn-primary" style={{ padding: '16px 36px' }}>
            Explore Jewellery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '40px 0 100px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="eyebrow">SAVED TREASURES</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: 'var(--color-espresso)', marginBottom: '6px' }}>
              Your Wishlist
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-muted-text)' }}>
              {wishlist.length} {wishlist.length === 1 ? 'precious piece' : 'precious pieces'} saved
            </p>
          </div>

          <Link href="/shop" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}
          className="wishlist-grid"
        >
          {wishlist.map(product => (
            <div
              key={product.id}
              className="luxury-card"
              style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', paddingTop: '120%', backgroundColor: '#F0ECE6' }}>
                <Link href={`/product/${product.slug}`} style={{ position: 'absolute', inset: 0 }}>
                  <Image src={product.images[0]} alt={product.name} fill sizes="300px" style={{ objectFit: 'cover' }} />
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Remove from wishlist"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-espresso)'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Details */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-text)', textTransform: 'uppercase' }}>
                    {product.purity} • {product.weight}
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    style={{ display: 'block', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-espresso)', marginTop: '2px', lineHeight: 1.3 }}
                  >
                    {product.name}
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 16px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-light-text)', textDecoration: 'line-through' }}>
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to bag */}
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    toggleWishlist(product);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.82rem' }}
                >
                  <ShoppingBag size={15} />
                  <span>Move To Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .wishlist-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
