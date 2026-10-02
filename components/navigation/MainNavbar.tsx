'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import MobileDrawer from './MobileDrawer';
import { useCommerce } from '@/components/commerce/CommerceContext';

import ShopMegaMenu from './ShopMegaMenu';
import AccountDropdown from './AccountDropdown';
import WishlistPreview from './WishlistPreview';
import CartPreview from './CartPreview';
import SearchOverlay from './SearchOverlay';

const CATEGORY_NAV_ITEMS = [
  { label: 'EARRINGS', href: '/shop?category=earrings', hasMega: true },
  { label: 'NECKLACES', href: '/shop?category=necklaces', hasMega: true },
  { label: 'RINGS', href: '/shop?category=rings', hasMega: true },
  { label: 'BRACELETS', href: '/shop?category=bracelets', hasMega: true },
  { label: 'BANGLES', href: '/shop?category=bangles', hasMega: true },
  { label: 'ANKLETS', href: '/shop?category=anklets', hasMega: true },
  { label: 'PENDANTS', href: '/shop?category=pendants', hasMega: true },
  { label: 'MEN', href: '/shop?category=men', hasMega: true },
  { label: 'BRIDAL', href: '/collections/bridal', hasMega: true },
  { label: 'COLLECTIONS', href: '/collections', hasMega: true },
  { label: 'NEW ARRIVALS', href: '/shop?sort=newest', hasMega: false },
  { label: 'BEST SELLERS', href: '/shop?isBestSeller=true', hasMega: false },
  { label: 'ABOUT', href: '/about', hasMega: false },
];

export default function MainNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'account' | 'wishlist' | 'cart' | 'search' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bagAnimated, setBagAnimated] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const prevCartCountRef = useRef(0);
  const { cartCount, wishlistCount, toggleCartDrawer, toggleSearchModal } = useCommerce();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setActiveMenu(null);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  // Click outside and Escape key handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setIsMegaMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setIsMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Trigger bounce on Bag icon when an item is added
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setBagAnimated(true);
      const t = setTimeout(() => setBagAnimated(false), 350);
      return () => clearTimeout(t);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  const handleNavMouseEnter = (hasMega: boolean) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (hasMega) {
      setIsMegaMenuOpen(true);
    } else {
      setIsMegaMenuOpen(false);
    }
  };

  const handleNavMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 250);
  };

  const handleMegaMenuMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
  };

  const toggleMenu = (menu: 'account' | 'wishlist' | 'cart' | 'search') => {
    if (menu === 'cart') {
      toggleCartDrawer();
      return;
    }
    if (menu === 'search') {
      toggleSearchModal();
      return;
    }
    setActiveMenu((prev) => (prev === menu ? null : menu));
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
          transition: 'all 0.25s ease',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.04)' : 'none',
        }}
      >
        {/* ROW 1: MAIN HEADER (Search Left, Logo Center, Account/Wishlist/Bag Right) */}
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            height: isScrolled ? '58px' : '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(16px, 3vw, 40px)',
            transition: 'height 0.25s ease',
            position: 'relative',
          }}
        >
          {/* Mobile Left: Menu Toggle Button */}
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

          {/* Desktop Left: Search Bar & Icon */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => toggleMenu('search')}
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
              onClick={() => toggleMenu('search')}
              aria-label="Search jewellery"
              className="nav-icon-btn mobile-only-icon"
            >
              <Search size={19} strokeWidth={1.4} />
            </button>

            {/* Account */}
            <div style={{ position: 'relative' }} className="hidden-mobile">
              <button
                onClick={() => toggleMenu('account')}
                aria-label="Account and orders"
                className="nav-icon-btn"
              >
                <User size={19} strokeWidth={1.4} />
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
                className="nav-icon-btn"
              >
                <Heart size={19} strokeWidth={1.4} />
                {wishlistCount > 0 && (
                  <span className="nav-badge">
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
                className={`nav-icon-btn ${bagAnimated ? 'bag-bounce' : ''}`}
              >
                <ShoppingBag size={19} strokeWidth={1.4} />
                <span className="nav-badge">
                  {cartCount}
                </span>
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
        </div>

        {/* ROW 2: CATEGORY NAVIGATION ROW BELOW (Screen 1 & 2 in Mockup) */}
        <div
          className="desktop-category-bar"
          style={{
            borderTop: '1px solid #F2F0EA',
            backgroundColor: '#FFFFFF',
            width: '100%',
          }}
        >
          <div
            style={{
              maxWidth: '1440px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(14px, 1.8vw, 28px)',
              padding: '0 24px',
              height: isScrolled ? '36px' : '42px',
              transition: 'height 0.25s ease',
            }}
          >
            {CATEGORY_NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                onMouseEnter={() => handleNavMouseEnter(item.hasMega)}
                onMouseLeave={handleNavMouseLeave}
                style={{ height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <Link
                  href={item.href}
                  className={`nav-sub-link ${pathname === item.href || (item.hasMega && isMegaMenuOpen && pathname.startsWith(item.href.split('?')[0])) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* MEGA MENU DROPDOWN (Matches Screen 2 in Mockup) */}
        {isMegaMenuOpen && (
          <div
            onMouseEnter={handleMegaMenuMouseEnter}
            onMouseLeave={handleNavMouseLeave}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              zIndex: 120,
            }}
          >
            <ShopMegaMenu onClose={() => setIsMegaMenuOpen(false)} />
          </div>
        )}

        {/* Global Search Overlay (if active) */}
        {activeMenu === 'search' && (
          <SearchOverlay onClose={() => setActiveMenu(null)} />
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <style jsx>{`
        .nav-sub-link {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #252525;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          padding: 6px 2px;
          position: relative;
          transition: color 0.15s ease;
        }

        .nav-sub-link:hover,
        .nav-sub-link.active {
          color: #111111;
        }

        .nav-sub-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 100%;
          height: 1.5px;
          background-color: #111111;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .nav-sub-link:hover::after,
        .nav-sub-link.active::after {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-icon-btn {
          background: transparent;
          border: none;
          padding: 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          cursor: pointer;
          position: relative;
          border-radius: 50%;
          transition: background-color 0.2s ease, transform 0.15s ease;
        }

        .nav-icon-btn:hover {
          background-color: #F8F7F3;
        }

        .nav-badge {
          position: absolute;
          top: 0px;
          right: 0px;
          background-color: #111111;
          color: #FFFFFF;
          font-size: 0.6rem;
          font-weight: 600;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .bag-bounce {
          animation: bagBounceAnim 0.35s ease;
        }

        @keyframes bagBounceAnim {
          0% { transform: scale(1); }
          50% { transform: scale(1.22); }
          100% { transform: scale(1); }
        }

        .mobile-only-icon {
          display: none;
        }

        .mobile-nav-toggle {
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
            display: inline-flex !important;
          }
          .mobile-nav-toggle {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
