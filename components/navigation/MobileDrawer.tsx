'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ChevronDown, MessageCircle, Heart, User, Search, ShoppingBag, Package, HelpCircle } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHOP_CATEGORIES = [
  { label: 'Earrings', href: '/collections/earrings' },
  { label: 'Necklaces', href: '/collections/necklaces' },
  { label: 'Rings', href: '/collections/rings' },
  { label: 'Bracelets', href: '/collections/bracelets' },
  { label: 'Pendants', href: '/collections/pendants' },
  { label: 'Mangalsutra', href: '/collections?category=mangalsutra' },
];

const COLLECTION_LINKS = [
  { label: 'New Arrivals', href: '/shop?badge=NEW%20ARRIVAL' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Everyday Essentials', href: '/collections' },
  { label: 'Festive Collection', href: '/collections?theme=festive' },
  { label: 'Bridal Collection', href: '/collections?theme=bridal' },
];

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(59, 43, 43, 0.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.22s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'relative',
          width: '90vw',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: '#FFF9F3',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '0 20px 50px rgba(59, 43, 43, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideInLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
          fontFamily: 'var(--font-ui), "Jost", sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 20px 14px 20px',
            borderBottom: '1px solid #E8D8D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <BrandLogo size="compact" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFE3D3',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B2B2B',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Field */}
        <div style={{ padding: '16px 20px 8px 20px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E8D8D0',
                padding: '10px 14px',
                gap: '10px',
                boxShadow: '0 2px 8px rgba(59, 43, 43, 0.04)',
              }}
            >
              <Search size={16} color="#806D68" />
              <input
                type="text"
                placeholder="Search jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.86rem',
                  color: '#342727',
                  width: '100%',
                }}
              />
            </div>
          </form>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '8px 20px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 0. HOME Link */}
            <div style={{ borderBottom: '1px solid #F0E2DA' }}>
              <Link
                href="/"
                onClick={onClose}
                style={{
                  display: 'block',
                  padding: '13px 0',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#342727',
                  textDecoration: 'none',
                }}
              >
                HOME
              </Link>
            </div>

            {/* 1. SHOP Accordion */}
            <div style={{ borderBottom: '1px solid #F0E2DA' }}>
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: isShopOpen ? '#B76E79' : '#342727',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>SHOP</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: isShopOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.22s ease',
                    color: isShopOpen ? '#B76E79' : '#806D68',
                  }}
                />
              </button>

              {isShopOpen && (
                <div style={{ paddingLeft: '14px', paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SHOP_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={onClose}
                      style={{
                        fontSize: '0.86rem',
                        color: '#6F5A58',
                        textDecoration: 'none',
                        padding: '6px 0',
                        display: 'block',
                        transition: 'color 0.18s ease',
                      }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 2. COLLECTIONS Accordion */}
            <div style={{ borderBottom: '1px solid #F0E2DA' }}>
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: isCollectionsOpen ? '#B76E79' : '#342727',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>COLLECTIONS</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: isCollectionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.22s ease',
                    color: isCollectionsOpen ? '#B76E79' : '#806D68',
                  }}
                />
              </button>

              {isCollectionsOpen && (
                <div style={{ paddingLeft: '14px', paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {COLLECTION_LINKS.map((col) => (
                    <Link
                      key={col.label}
                      href={col.href}
                      onClick={onClose}
                      style={{
                        fontSize: '0.86rem',
                        color: '#6F5A58',
                        textDecoration: 'none',
                        padding: '6px 0',
                        display: 'block',
                        transition: 'color 0.18s ease',
                      }}
                    >
                      {col.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. GIFTS */}
            <div style={{ borderBottom: '1px solid #F0E2DA' }}>
              <Link
                href="/gifts"
                onClick={onClose}
                style={{
                  display: 'block',
                  padding: '13px 0',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#342727',
                  textDecoration: 'none',
                }}
              >
                GIFTS
              </Link>
            </div>

            {/* 4. ABOUT */}
            <div style={{ borderBottom: '1px solid #F0E2DA' }}>
              <Link
                href="/about"
                onClick={onClose}
                style={{
                  display: 'block',
                  padding: '13px 0',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#342727',
                  textDecoration: 'none',
                }}
              >
                ABOUT
              </Link>
            </div>

            {/* 5. CONTACT */}
            <div style={{ borderBottom: '1px solid #F0E2DA' }}>
              <Link
                href="/contact"
                onClick={onClose}
                style={{
                  display: 'block',
                  padding: '13px 0',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#342727',
                  textDecoration: 'none',
                }}
              >
                CONTACT
              </Link>
            </div>

            {/* 6. FAQ */}
            <div style={{ borderBottom: '1px solid #F0E2DA' }}>
              <Link
                href="/faq"
                onClick={onClose}
                style={{
                  display: 'block',
                  padding: '13px 0',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#342727',
                  textDecoration: 'none',
                }}
              >
                FAQ
              </Link>
            </div>
          </div>
        </nav>

        {/* WhatsApp Styling Advice Card (Section 3) */}
        <div style={{ padding: '14px 20px', backgroundColor: '#FCE8DE', margin: '0 16px 12px 16px', borderRadius: '16px', border: '1px solid #E8D8D0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#342727' }}>Need styling advice?</div>
              <div style={{ fontSize: '0.72rem', color: '#806D68' }}>Chat with our silver expert</div>
            </div>
            <a
              href="https://wa.me/917425058118?text=Hi%20MK%20Silver%20Hub%2C%20I%20need%20styling%20advice"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Styling Advice"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)',
              }}
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Bottom Quick Actions (Matching Screen 2 in Reference) */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #E8D8D0',
            backgroundColor: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            textAlign: 'center',
          }}
        >
          <Link
            href="/account"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: '#806D68',
              textDecoration: 'none',
              fontSize: '0.66rem',
            }}
          >
            <User size={18} />
            <span>My Account</span>
          </Link>
          <Link
            href="/account#orders"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: '#806D68',
              textDecoration: 'none',
              fontSize: '0.66rem',
            }}
          >
            <Package size={18} />
            <span>My Orders</span>
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: '#806D68',
              textDecoration: 'none',
              fontSize: '0.66rem',
            }}
          >
            <Heart size={18} />
            <span>Wishlist</span>
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: '#806D68',
              textDecoration: 'none',
              fontSize: '0.66rem',
            }}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
