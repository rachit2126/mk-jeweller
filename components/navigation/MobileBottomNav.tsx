'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, toggleCartDrawer, toggleSearchModal } = useCommerce();

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
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #E8E7E2',
        zIndex: 150,
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '2px 6px calc(6px + env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 -4px 18px rgba(0, 0, 0, 0.04)',
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
          color: isHome ? '#111111' : '#6F6F6A',
          textDecoration: 'none',
          fontSize: '0.66rem',
          fontWeight: isHome ? 600 : 500,
          flex: 1,
          padding: '4px 0',
          letterSpacing: '0.04em',
        }}
      >
        <Home size={19} strokeWidth={isHome ? 2 : 1.4} />
        <span>HOME</span>
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
          color: isShop ? '#111111' : '#6F6F6A',
          textDecoration: 'none',
          fontSize: '0.66rem',
          fontWeight: isShop ? 600 : 500,
          flex: 1,
          padding: '4px 0',
          letterSpacing: '0.04em',
        }}
      >
        <Compass size={19} strokeWidth={isShop ? 2 : 1.4} />
        <span>SHOP</span>
      </Link>

      {/* 3. Search */}
      <button
        onClick={toggleSearchModal}
        className="bottom-nav-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#6F6F6A',
          textDecoration: 'none',
          fontSize: '0.66rem',
          fontWeight: 500,
          flex: 1,
          padding: '4px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.04em',
        }}
      >
        <Search size={19} strokeWidth={1.4} />
        <span>SEARCH</span>
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
          color: isWishlist ? '#111111' : '#6F6F6A',
          textDecoration: 'none',
          fontSize: '0.66rem',
          fontWeight: isWishlist ? 600 : 500,
          position: 'relative',
          flex: 1,
          padding: '4px 0',
          letterSpacing: '0.04em',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Heart size={19} strokeWidth={isWishlist ? 2 : 1.4} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                backgroundColor: '#111111',
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
        <span>WISHLIST</span>
      </Link>

      {/* 5. Bag */}
      <button
        onClick={toggleCartDrawer}
        aria-label="Open shopping bag"
        className="bottom-nav-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#6F6F6A',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '0.66rem',
          fontWeight: 500,
          position: 'relative',
          flex: 1,
          padding: '4px 0',
          cursor: 'pointer',
          letterSpacing: '0.04em',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={19} strokeWidth={1.4} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                backgroundColor: '#111111',
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
              {cartCount}
            </span>
          )}
        </div>
        <span>BAG</span>
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
