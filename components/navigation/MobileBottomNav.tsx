'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, openCart, openSearch } = useCommerce();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '66px',
        backgroundColor: 'rgba(252, 250, 246, 0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border)',
        zIndex: 100,
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px calc(8px + env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 -4px 20px rgba(25, 20, 15, 0.06)'
      }}
      className="mobile-bottom-nav"
    >
      {/* Home */}
      <Link
        href="/"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: pathname === '/' ? 'var(--color-espresso)' : 'var(--color-muted-text)',
          fontSize: '0.68rem',
          fontWeight: pathname === '/' ? 600 : 400
        }}
      >
        <Home size={20} color={pathname === '/' ? 'var(--color-espresso)' : 'var(--color-muted-text)'} />
        <span>Home</span>
      </Link>

      {/* Shop */}
      <Link
        href="/shop"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: pathname.startsWith('/shop') || pathname.startsWith('/collections') ? 'var(--color-espresso)' : 'var(--color-muted-text)',
          fontSize: '0.68rem',
          fontWeight: pathname.startsWith('/shop') ? 600 : 400
        }}
      >
        <Compass size={20} color={pathname.startsWith('/shop') ? 'var(--color-espresso)' : 'var(--color-muted-text)'} />
        <span>Shop</span>
      </Link>

      {/* Search */}
      <button
        onClick={openSearch}
        aria-label="Search catalogue"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--color-muted-text)',
          fontSize: '0.68rem'
        }}
      >
        <Search size={20} />
        <span>Search</span>
      </button>

      {/* Wishlist */}
      <Link
        href="/wishlist"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: pathname === '/wishlist' ? 'var(--color-espresso)' : 'var(--color-muted-text)',
          fontSize: '0.68rem',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Heart size={20} color={pathname === '/wishlist' ? 'var(--color-espresso)' : 'var(--color-muted-text)'} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                backgroundColor: 'var(--color-champagne)',
                color: '#FFFFFF',
                fontSize: '0.55rem',
                fontWeight: 700,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {wishlistCount}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>

      {/* Cart */}
      <button
        onClick={openCart}
        aria-label="Open shopping bag"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--color-espresso)',
          fontSize: '0.68rem',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                backgroundColor: 'var(--color-espresso)',
                color: '#FFFFFF',
                fontSize: '0.55rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <span>Bag</span>
      </button>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
