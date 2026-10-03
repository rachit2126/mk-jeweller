'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import MobileDrawer from './MobileDrawer';
import { useCommerce } from '@/components/commerce/CommerceContext';
import DynamicMegaMenu from './DynamicMegaMenu';
import AccountDropdown from './AccountDropdown';
import WishlistPreview from './WishlistPreview';
import CartPreview from './CartPreview';
import SearchOverlay from './SearchOverlay';
import { useNavigation } from './NavigationContext';
import { DbNavigationItem } from '@/lib/db/types';

export default function MainNavbar() {
  const pathname = usePathname();
  const { navbarItems, loading: navLoading } = useNavigation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenuSlug, setActiveMenuSlug] = useState<string | null>(null);
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState<'account' | 'wishlist' | 'cart' | 'search' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bagAnimated, setBagAnimated] = useState(false);

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const prevCartCountRef = useRef(0);
  const { cartCount, wishlistCount, toggleCartDrawer, toggleSearchModal } = useCommerce();

  // Scroll detection for sticky header compression
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveMenuSlug(null);
      setActiveHeaderDropdown(null);
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Click outside and Escape key handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setActiveMenuSlug(null);
        setActiveHeaderDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenuSlug(null);
        setActiveHeaderDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Trigger bounce on Bag icon when items are added to cart
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setBagAnimated(true);
      const t = setTimeout(() => setBagAnimated(false), 350);
      return () => clearTimeout(t);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  // Pure MongoDB Navigation data (Single source of truth)
  const navigationList: DbNavigationItem[] = useMemo(() => {
    if (navbarItems && navbarItems.length > 0) {
      return navbarItems;
    }
    return [];
  }, [navbarItems]);

  // Active mega menu item
  const activeItem = useMemo(() => {
    if (!activeMenuSlug) return null;
    return navigationList.find((i) => i.slug === activeMenuSlug) || null;
  }, [activeMenuSlug, navigationList]);

  // Robust unified hover handlers
  const handleNavPointerEnter = (item: DbNavigationItem) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (item.megaMenuEnabled) {
      setActiveMenuSlug(item.slug || null);
      setActiveHeaderDropdown(null);
    } else {
      setActiveMenuSlug(null);
    }
  };

  const handleRegionPointerEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleRegionPointerLeave = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActiveMenuSlug(null);
    }, 200);
  };

  // Header Dropdown Toggles (Account / Wishlist / Cart / Search)
  const toggleHeaderDropdown = (menu: 'account' | 'wishlist' | 'cart' | 'search') => {
    setActiveMenuSlug(null);
    if (menu === 'cart') {
      toggleCartDrawer();
      return;
    }
    if (menu === 'search') {
      toggleSearchModal();
      return;
    }
    setActiveHeaderDropdown((prev) => (prev === menu ? null : menu));
  };

  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  if (isAuthOrAdmin) return null;

  return (
    <>
      <header
        ref={navbarRef}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          width: '100%',
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : '#FFFFFF',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: '1px solid #E8E7E2',
          transition: 'box-shadow 0.25s ease, background-color 0.25s ease',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.04)' : 'none',
        }}
      >
        {/* ======================================================== */}
        {/* ROW 1: MAIN HEADER (Search Left, Logo Center, Right Actions) */}
        {/* ======================================================== */}
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            height: isScrolled ? '56px' : '66px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(16px, 3vw, 40px)',
            transition: 'height 0.25s ease',
            position: 'relative',
          }}
        >
          {/* Mobile Left: Hamburger Button */}
          <div className="mobile-nav-toggle">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111111',
                cursor: 'pointer',
              }}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Desktop Left: Search Quick Trigger */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => toggleHeaderDropdown('search')}
              aria-label="Search jewellery"
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#6F6F6A',
                padding: '6px 0',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.82rem',
              }}
            >
              <Search size={18} strokeWidth={1.4} color="#111111" />
              <span className="search-text-label">Search jewellery...</span>
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BrandLogo size={isScrolled ? 'compact' : 'normal'} layout="horizontal" />
          </div>

          {/* Right Action Icons (Account, Wishlist, Bag) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(10px, 1.3vw, 18px)',
              flexShrink: 0,
            }}
          >
            {/* Mobile Search Icon */}
            <button
              onClick={() => toggleHeaderDropdown('search')}
              aria-label="Search jewellery"
              className="nav-icon-btn mobile-only-icon"
            >
              <Search size={19} strokeWidth={1.4} />
            </button>

            {/* Account Icon */}
            <div style={{ position: 'relative' }} className="hidden-mobile">
              <button
                onClick={() => toggleHeaderDropdown('account')}
                aria-label="Account and orders"
                className="nav-icon-btn"
              >
                <User size={19} strokeWidth={1.4} />
              </button>
              {activeHeaderDropdown === 'account' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    right: 0,
                    zIndex: 130,
                  }}
                >
                  <AccountDropdown onClose={() => setActiveHeaderDropdown(null)} />
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleHeaderDropdown('wishlist')}
                aria-label={`Wishlist (${wishlistCount} items)`}
                className="nav-icon-btn"
              >
                <Heart size={19} strokeWidth={1.4} />
                {wishlistCount > 0 && (
                  <span className="nav-badge">
                    {wishlistCount}
                  </span>
                )}
              </button>
              {activeHeaderDropdown === 'wishlist' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    right: 0,
                    zIndex: 130,
                  }}
                >
                  <WishlistPreview onClose={() => setActiveHeaderDropdown(null)} />
                </div>
              )}
            </div>

            {/* Bag Icon */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleHeaderDropdown('cart')}
                aria-label={`Shopping bag with ${cartCount} items`}
                className={`nav-icon-btn ${bagAnimated ? 'bag-bounce' : ''}`}
              >
                <ShoppingBag size={19} strokeWidth={1.4} />
                <span className="nav-badge">
                  {cartCount}
                </span>
              </button>
              {activeHeaderDropdown === 'cart' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    right: 0,
                    zIndex: 130,
                  }}
                >
                  <CartPreview onClose={() => setActiveHeaderDropdown(null)} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ROW 2: UNIFIED CATEGORY NAVIGATION & DYNAMIC MEGA MENU   */}
        {/* ======================================================== */}
        <div
          className="nav-and-megamenu-region"
          onMouseEnter={handleRegionPointerEnter}
          onMouseLeave={handleRegionPointerLeave}
          style={{ position: 'relative', width: '100%' }}
        >
          {/* Category Bar */}
          <div
            className="desktop-category-bar"
            style={{
              borderTop: '1px solid #F2F0EA',
              backgroundColor: '#FFFFFF',
              width: '100%',
            }}
          >
            <nav
              aria-label="Category Navigation"
              style={{
                maxWidth: '1440px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(12px, 1.6vw, 26px)',
                padding: '0 24px',
                height: isScrolled ? '38px' : '44px',
                transition: 'height 0.25s ease',
              }}
            >
              {navLoading ? (
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '68px',
                        height: '13px',
                        backgroundColor: '#F8F7F3',
                        borderRadius: '2px',
                      }}
                    />
                  ))}
                </div>
              ) : navigationList.length === 0 ? (
                <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#6F6F6A' }}>
                  <span>Navigation hasn&apos;t been configured yet.</span>
                  <Link href="/admin/navbar" style={{ color: '#111111', textDecoration: 'underline', fontWeight: 600 }}>
                    Configure in Admin
                  </Link>
                </div>
              ) : (
                navigationList.map((item) => {
                  const isItemActive =
                    activeMenuSlug === item.slug ||
                    (pathname === item.url && !activeMenuSlug);

                  return (
                    <div
                      key={item.slug || item.id}
                      onMouseEnter={() => handleNavPointerEnter(item)}
                      style={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}
                    >
                      <Link
                        href={item.url}
                        aria-haspopup={item.megaMenuEnabled ? 'true' : undefined}
                        aria-expanded={activeMenuSlug === item.slug}
                        onFocus={() => handleNavPointerEnter(item)}
                        className={`nav-category-link ${isItemActive ? 'is-active' : ''}`}
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.72rem',
                          fontWeight: isItemActive ? 600 : 500,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: isItemActive ? '#111111' : '#252525',
                          textDecoration: 'none',
                          padding: '10px 4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          position: 'relative',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        <span>{item.label}</span>
                        {/* Subtle Active Underline Indicator */}
                        {isItemActive && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: '4px',
                              right: '4px',
                              height: '2px',
                              backgroundColor: '#111111',
                              borderRadius: '1px',
                            }}
                          />
                        )}
                      </Link>
                    </div>
                  );
                })
              )}
            </nav>
          </div>

          {/* DYNAMIC MEGA MENU CONTAINER */}
          {activeItem && activeItem.megaMenuEnabled && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                width: '100%',
                zIndex: 110,
                paddingTop: '6px',
              }}
            >
              <DynamicMegaMenu
                categories={navigationList}
                activeItem={activeItem}
                onSelectCategory={(slug) => setActiveMenuSlug(slug)}
                onClose={() => setActiveMenuSlug(null)}
              />
            </div>
          )}
        </div>

        {/* Global Search Overlay (if active) */}
        {activeHeaderDropdown === 'search' && (
          <SearchOverlay onClose={() => setActiveHeaderDropdown(null)} />
        )}
      </header>

      {/* Subtle Backdrop Dimmer when Mega Menu is Open (z-index: 90) */}
      {activeItem && activeItem.megaMenuEnabled && (
        <div
          onClick={() => setActiveMenuSlug(null)}
          style={{
            position: 'fixed',
            inset: 0,
            top: isScrolled ? '94px' : '110px',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            zIndex: 90,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      {/* Dedicated Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <style jsx>{`
        .nav-category-link:hover {
          color: #111111 !important;
        }
        .nav-icon-btn {
          background: transparent;
          border: none;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          cursor: pointer;
          position: relative;
          transition: transform 0.15s ease;
        }
        .nav-icon-btn:hover {
          transform: scale(1.06);
        }
        .nav-badge {
          position: absolute;
          top: 0px;
          right: 0px;
          background-color: #111111;
          color: #FFFFFF;
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bag-bounce {
          animation: bagBounce 0.35s ease;
        }
        @keyframes bagBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.22); }
          100% { transform: scale(1); }
        }
        .mobile-only-icon {
          display: none;
        }
        @media (max-width: 1024px) {
          .desktop-category-bar {
            display: none !important;
          }
          .hidden-mobile {
            display: none !important;
          }
          .mobile-only-icon {
            display: flex !important;
          }
        }
        @media (min-width: 1025px) {
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
