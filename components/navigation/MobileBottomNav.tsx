'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, openCart, openSearch } = useCommerce();

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop');
  const isWishlist = pathname === '/wishlist';
  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  if (isAuthOrAdmin) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '68px',
        backgroundColor: 'rgba(255, 249, 243, 0.94)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderTop: '1px solid rgba(232, 216, 208, 0.85)',
        zIndex: 150,
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '4px 6px calc(8px + env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 -4px 20px rgba(59, 43, 43, 0.08)',
        fontFamily: 'var(--font-ui), "Jost", sans-serif',
      }}
      className="mobile-bottom-nav"
    >
      {/* 1. Home */}
      <Link
        href="/"
        className="bottom-nav-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isHome ? '#B76E79' : '#806D68',
          textDecoration: 'none',
          fontSize: '0.68rem',
          fontWeight: isHome ? 600 : 400,
          flex: 1,
          padding: '4px 0',
        }}
      >
        <Home size={20} strokeWidth={isHome ? 1.9 : 1.4} />
        <span>Home</span>
      </Link>

      {/* 2. Shop */}
      <Link
        href="/shop"
        className="bottom-nav-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isShop ? '#B76E79' : '#806D68',
          textDecoration: 'none',
          fontSize: '0.68rem',
          fontWeight: isShop ? 600 : 400,
          flex: 1,
          padding: '4px 0',
        }}
      >
        <Compass size={20} strokeWidth={isShop ? 1.9 : 1.4} />
        <span>Shop</span>
      </Link>

      {/* 3. Search */}
      <button
        onClick={openSearch}
        className="bottom-nav-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#806D68',
          textDecoration: 'none',
          fontSize: '0.68rem',
          fontWeight: 400,
          flex: 1,
          padding: '4px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Search size={20} strokeWidth={1.4} />
        <span>Search</span>
      </button>

      {/* 4. Wishlist */}
      <Link
        href="/wishlist"
        className="bottom-nav-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isWishlist ? '#B76E79' : '#806D68',
          textDecoration: 'none',
          fontSize: '0.68rem',
          fontWeight: isWishlist ? 600 : 400,
          position: 'relative',
          flex: 1,
          padding: '4px 0',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Heart size={20} strokeWidth={isWishlist ? 1.9 : 1.4} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                backgroundColor: '#B76E79',
                color: '#FFFFFF',
                fontSize: '0.55rem',
                fontWeight: 700,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {wishlistCount}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>

      {/* 5. Bag */}
      <button
        onClick={openCart}
        aria-label="Open shopping bag"
        className="bottom-nav-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#806D68',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '0.68rem',
          fontWeight: 400,
          position: 'relative',
          flex: 1,
          padding: '4px 0',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} strokeWidth={1.4} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                backgroundColor: '#B76E79',
                color: '#FFFFFF',
                fontSize: '0.55rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
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
