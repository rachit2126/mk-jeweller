'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import MobileDrawer from './MobileDrawer';
import { useCommerce } from '@/components/commerce/CommerceContext';

import ShopMegaMenu from './ShopMegaMenu';
import CollectionsMegaMenu from './CollectionsMegaMenu';
import AccountDropdown from './AccountDropdown';
import WishlistPreview from './WishlistPreview';
import CartPreview from './CartPreview';
import SearchOverlay from './SearchOverlay';

export default function MainNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'shop' | 'collections' | 'account' | 'wishlist' | 'cart' | 'search' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bagAnimated, setBagAnimated] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const prevCartCountRef = useRef(0);
  const { cartCount, wishlistCount } = useCommerce();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  // Click outside and Escape key handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Trigger subtle bounce on Bag icon when an item is added
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setBagAnimated(true);
      const t = setTimeout(() => setBagAnimated(false), 350);
      return () => clearTimeout(t);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  // Dropdown open/close with graceful hover delay
  const handleMouseEnter = (menu: 'shop' | 'collections') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveMenu((prev) => (prev === 'shop' || prev === 'collections' ? null : prev));
    }, 240);
  };

  const handleMegaMenuMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
  };

  const toggleMenu = (menu: 'account' | 'wishlist' | 'cart' | 'search') => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const isHomePage = pathname === '/';
  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  if (isAuthOrAdmin) return null;

  return (
    <>
      <header
        style={{
          position: isHomePage ? (isScrolled ? 'fixed' : 'absolute') : 'sticky',
          top: isHomePage ? (isScrolled ? '12px' : '48px') : '12px',
          left: 0,
          right: 0,
          zIndex: 100,
          width: '100%',
          pointerEvents: 'none',
          margin: isHomePage ? 0 : '12px 0 20px 0',
          padding: 0,
          border: 'none',
          transition: 'top 0.28s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.28s ease',
        }}
      >
        <div
          ref={navbarRef}
          className="floating-navbar-pill"
          style={{
            pointerEvents: 'auto',
            width: 'min(92%, 1400px)',
            margin: '0 auto',
            height: isScrolled ? '68px' : '76px',
            borderRadius: '24px',
            backgroundColor: isScrolled
              ? 'rgba(255, 249, 243, 0.96)'
              : 'rgba(255, 255, 255, 0.90)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isScrolled
              ? '1px solid rgba(232, 216, 208, 0.92)'
              : '1px solid rgba(232, 216, 208, 0.75)',
            boxShadow: isScrolled
              ? '0 14px 40px rgba(59, 43, 43, 0.10)'
              : '0 10px 32px rgba(59, 43, 43, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(18px, 2.5vw, 32px)',
            position: 'relative',
            transition: 'all 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Mobile Left: Menu Toggle Button */}
          <div className="mobile-nav-toggle" style={{ display: 'none' }}>
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
                color: '#3B2B2B',
                cursor: 'pointer',
              }}
            >
              <Menu size={22} strokeWidth={1.35} />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="brand-logo-container desktop-logo" style={{ flexShrink: 0 }}>
            <BrandLogo size={isScrolled ? 'compact' : 'normal'} />
          </div>
          <div className="brand-logo-container mobile-logo" style={{ flexShrink: 0, display: 'none' }}>
            <BrandLogo size="compact" />
          </div>

          {/* Center Navigation Links (Minimalist 4-Item Architecture with Warm Animations) */}
          <nav
            className="desktop-nav-menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(26px, 2.6vw, 46px)',
              height: '100%',
            }}
          >
            {/* 1. SHOP (Mega Menu Trigger) */}
            <div
              onMouseEnter={() => handleMouseEnter('shop')}
              onMouseLeave={handleMouseLeave}
              style={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <Link
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu((prev) => (prev === 'shop' ? null : 'shop'));
                }}
                className={`nav-btn-link ${pathname.startsWith('/shop') || activeMenu === 'shop' ? 'active' : ''}`}
              >
                <span>SHOP</span>
                <ChevronDown
                  size={12}
                  strokeWidth={1.5}
                  className={`nav-chevron ${activeMenu === 'shop' ? 'open' : ''}`}
                />
              </Link>
            </div>

            {/* 2. COLLECTIONS (Mega Menu Trigger) */}
            <div
              onMouseEnter={() => handleMouseEnter('collections')}
              onMouseLeave={handleMouseLeave}
              style={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <Link
                href="/collections"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu((prev) => (prev === 'collections' ? null : 'collections'));
                }}
                className={`nav-btn-link ${pathname.startsWith('/collections') || activeMenu === 'collections' ? 'active' : ''}`}
              >
                <span>COLLECTIONS</span>
                <ChevronDown
                  size={12}
                  strokeWidth={1.5}
                  className={`nav-chevron ${activeMenu === 'collections' ? 'open' : ''}`}
                />
              </Link>
            </div>

            {/* 3. GIFTS (Direct Link) */}
            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <Link
                href="/gifts"
                className={`nav-btn-link ${pathname === '/gifts' ? 'active' : ''}`}
              >
                <span>GIFTS</span>
              </Link>
            </div>

            {/* 4. ABOUT (Direct Link) */}
            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <Link
                href="/about"
                className={`nav-btn-link ${pathname === '/about' ? 'active' : ''}`}
              >
                <span>ABOUT</span>
              </Link>
            </div>
          </nav>

          {/* Right Action Icons */}
          <div
            className="nav-actions-right"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 1.2vw, 16px)',
              flexShrink: 0,
            }}
          >
            {/* Search */}
            <button
              onClick={() => toggleMenu('search')}
              aria-label="Search catalogue"
              className={`nav-action-icon-btn nav-icon-search ${activeMenu === 'search' ? 'active-icon' : ''}`}
            >
              <Search size={19} strokeWidth={1.3} />
            </button>

            {/* Account */}
            <div style={{ position: 'relative' }} className="hidden-mobile">
              <button
                onClick={() => toggleMenu('account')}
                aria-label="Account and orders"
                className={`nav-action-icon-btn nav-icon-account ${activeMenu === 'account' ? 'active-icon' : ''}`}
              >
                <User size={19} strokeWidth={1.3} />
              </button>
              {activeMenu === 'account' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    right: 0,
                    zIndex: 130,
                  }}
                >
                  <AccountDropdown onClose={() => setActiveMenu(null)} />
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleMenu('wishlist')}
                aria-label={`Wishlist (${wishlistCount} items)`}
                className={`nav-action-icon-btn nav-icon-wishlist ${activeMenu === 'wishlist' ? 'active-icon' : ''}`}
              >
                <Heart size={19} strokeWidth={1.3} className="wishlist-heart-svg" />
                {wishlistCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '3px',
                      backgroundColor: '#B76E79',
                      color: '#FFFFFF',
                      fontSize: '0.55rem',
                      fontWeight: 600,
                      minWidth: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 2px',
                      lineHeight: 1,
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>
              {activeMenu === 'wishlist' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    right: 0,
                    zIndex: 130,
                  }}
                >
                  <WishlistPreview onClose={() => setActiveMenu(null)} />
                </div>
              )}
            </div>

            {/* Bag */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleMenu('cart')}
                aria-label={`Shopping bag with ${cartCount} items`}
                className={`nav-action-icon-btn nav-icon-bag ${bagAnimated ? 'bag-bounce' : ''} ${activeMenu === 'cart' ? 'active-icon' : ''}`}
              >
                <ShoppingBag size={19} strokeWidth={1.3} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '2px',
                      backgroundColor: '#B76E79',
                      color: '#FFFFFF',
                      fontSize: '0.55rem',
                      fontWeight: 600,
                      minWidth: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 2px',
                      lineHeight: 1,
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
              {activeMenu === 'cart' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    right: 0,
                    zIndex: 130,
                  }}
                >
                  <CartPreview onClose={() => setActiveMenu(null)} />
                </div>
              )}
            </div>
          </div>

          {/* SHOP MEGA MENU */}
          {activeMenu === 'shop' && (
            <div
              onMouseEnter={handleMegaMenuMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="desktop-mega-wrapper"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                width: '100%',
                zIndex: 120,
              }}
            >
              <ShopMegaMenu onClose={() => setActiveMenu(null)} />
            </div>
          )}

          {/* COLLECTIONS MEGA MENU */}
          {activeMenu === 'collections' && (
            <div
              onMouseEnter={handleMegaMenuMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="desktop-mega-wrapper"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                width: '100%',
                zIndex: 120,
              }}
            >
              <CollectionsMegaMenu onClose={() => setActiveMenu(null)} />
            </div>
          )}

          {/* SEARCH OVERLAY */}
          {activeMenu === 'search' && (
            <div
              className="desktop-mega-wrapper"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                width: '100%',
                zIndex: 120,
              }}
            >
              <SearchOverlay onClose={() => setActiveMenu(null)} />
            </div>
          )}
        </div>
      </header>

      {/* Clean Mobile Drawer Navigation */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <style jsx>{`
        .nav-btn-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          color: #3B2B2B;
          text-decoration: none;
          padding: 8px 2px;
          transition: color 240ms cubic-bezier(0.22, 1, 0.36, 1), transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-btn-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          right: 0;
          height: 1.5px;
          background-color: #B76E79;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-btn-link:hover {
          color: #B76E79 !important;
          transform: translateY(-1.5px);
        }
        .nav-btn-link:hover::after,
        .nav-btn-link.active::after {
          transform: scaleX(1);
        }
        .nav-btn-link.active {
          color: #B76E79;
        }

        .nav-chevron {
          opacity: 0.65;
          transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease;
        }
        .nav-chevron.open {
          transform: rotate(180deg);
          opacity: 1;
        }

        /* Dropdown Animation */
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .dropdown-menu-card {
          animation: dropdownSlideIn 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .shop-dropdown-row:hover {
          background-color: #FFE3D3 !important;
          color: #B76E79 !important;
          transform: translateX(2px);
        }
        .shop-dropdown-row:hover .shop-chevron-right {
          color: #B76E79 !important;
          transform: translateX(2px);
        }

        /* Action Icon Animations */
        .nav-action-icon-btn {
          background: transparent;
          border: none;
          color: #3B2B2B;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          cursor: pointer;
          position: relative;
          text-decoration: none;
          transition: color 200ms cubic-bezier(0.22, 1, 0.36, 1), transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nav-icon-search:hover {
          color: #B76E79 !important;
          transform: scale(1.06) rotate(-3deg);
        }

        .nav-icon-account:hover {
          color: #B76E79 !important;
          transform: scale(1.06) translateY(-1px);
        }

        .nav-icon-wishlist:hover {
          color: #B76E79 !important;
          transform: scale(1.06);
        }
        .nav-icon-wishlist:hover :global(.wishlist-heart-svg) {
          transform: scale(1.14);
          transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nav-icon-bag:hover {
          color: #B76E79 !important;
          transform: scale(1.06) translateY(-1.5px);
        }

        .nav-action-icon-btn.active-icon {
          color: #B76E79 !important;
          background-color: #FFE3D3;
          border-radius: 50%;
        }

        @keyframes bagBounceAnim {
          0% { transform: scale(1); }
          40% { transform: scale(1.2); }
          75% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .bag-bounce {
          animation: bagBounceAnim 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (max-width: 990px) {
          .floating-navbar-pill {
            width: 92% !important;
            height: 58px !important;
            border-radius: 20px !important;
            padding: 0 16px !important;
          }
          .desktop-nav-menu {
            display: none !important;
          }
          .desktop-mega-wrapper {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
          .desktop-logo {
            display: none !important;
          }
          .mobile-logo {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .brand-logo-container {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        @media (max-width: 640px) {
          .hidden-mobile {
            display: none !important;
          }
          .floating-navbar-pill {
            padding: 0 10px !important;
            height: 56px !important;
          }
          .nav-action-icon-btn {
            padding: 4px !important;
          }
        }
        @media (max-width: 400px) {
          .nav-actions-right {
            gap: 2px !important;
          }
        }
        @media (max-width: 360px) {
          .floating-navbar-pill {
            padding: 0 6px !important;
            width: 96% !important;
          }
          .nav-action-icon-btn {
            padding: 2px !important;
          }
        }
      `}</style>
    </>
  );
}
