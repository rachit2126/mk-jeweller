'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

import ProductCard from '@/components/products/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useCommerce();

  if (wishlist.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F8F7F3',
              color: '#111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Heart size={24} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: '2.4rem',
              fontWeight: 500,
              color: '#111111',
              margin: '0 0 12px',
            }}
          >
            Your Wishlist Is Empty
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              color: '#6F6F6A',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              margin: '0 0 28px',
            }}
          >
            Save your favourite sterling silver pieces and revisit them whenever you are ready to treat yourself or a loved one.
          </p>
          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              padding: '14px 34px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.76rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            EXPLORE JEWELLERY
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        padding: '36px 0 100px',
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
            paddingBottom: '24px',
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
          <span style={{ color: '#111111', fontWeight: 600 }}>Wishlist</span>
        </nav>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E8E7E2',
            paddingBottom: '18px',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                fontWeight: 500,
                color: '#111111',
                margin: 0,
              }}
            >
              Saved Pieces ({wishlist.length})
            </h1>
          </div>

          <Link
            href="/shop"
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.78rem',
              color: '#111111',
              textDecoration: 'underline',
              letterSpacing: '0.04em',
            }}
          >
            Continue Shopping
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
          className="wishlist-product-grid"
        >
          {wishlist.map((prod) => (
            <ProductCard key={prod.id || prod.slug} product={prod} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .wishlist-product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .wishlist-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
