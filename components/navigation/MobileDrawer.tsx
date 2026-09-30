'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronDown, MessageCircle, Heart, User } from 'lucide-react';
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
];

const COLLECTION_LINKS = [
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Everyday Essentials', href: '/collections' },
  { label: 'Bridal Collection', href: '/collections' },
];

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

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
          width: '86vw',
          maxWidth: '360px',
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
            padding: '20px 24px',
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

        {/* Navigation List */}
        <nav style={{ padding: '16px 24px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 1. SHOP Accordion */}
            <div style={{ borderBottom: '1px solid #E8D8D0' }}>
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#3B2B2B',
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
                    color: isShopOpen ? '#B76E79' : '#6F5A58',
                  }}
                />
              </button>

              {isShopOpen && (
                <div style={{ paddingLeft: '14px', paddingBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            <div style={{ borderBottom: '1px solid #E8D8D0' }}>
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#3B2B2B',
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
                    color: isCollectionsOpen ? '#B76E79' : '#6F5A58',
                  }}
                />
              </button>

              {isCollectionsOpen && (
                <div style={{ paddingLeft: '14px', paddingBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

            {/* 3. GIFTS Direct Link */}
            <div style={{ borderBottom: '1px solid #E8D8D0' }}>
              <Link
                href="/gifts"
                onClick={onClose}
                style={{
                  padding: '14px 0',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#3B2B2B',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                GIFTS
              </Link>
            </div>

            {/* 4. ABOUT Direct Link */}
            <div style={{ borderBottom: '1px solid #E8D8D0' }}>
              <Link
                href="/about"
                onClick={onClose}
                style={{
                  padding: '14px 0',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#3B2B2B',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                ABOUT
              </Link>
            </div>

            {/* 5. CONTACT Direct Link */}
            <div style={{ borderBottom: '1px solid #E8D8D0' }}>
              <Link
                href="/contact"
                onClick={onClose}
                style={{
                  padding: '14px 0',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#3B2B2B',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                CONTACT
              </Link>
            </div>
          </div>

          {/* Quick Account / Wishlist Links */}
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href="/account"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.84rem',
                color: '#3B2B2B',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <User size={16} strokeWidth={1.4} />
              <span>My Account</span>
            </Link>

            <Link
              href="/wishlist"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.84rem',
                color: '#3B2B2B',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <Heart size={16} strokeWidth={1.4} color="#B76E79" />
              <span>Saved Wishlist</span>
            </Link>
          </div>
        </nav>

        {/* Bottom Styling Advice & WhatsApp CTA */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#FFE3D3',
            borderTop: '1px solid #E8D8D0',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#B76E79',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '3px',
            }}
          >
            Need styling advice?
          </span>
          <p
            style={{
              margin: '0 0 10px 0',
              fontSize: '0.82rem',
              color: '#6F5A58',
            }}
          >
            Chat with our silver expert
          </p>
          <a
            href="https://wa.me/917425058118?text=Hi%20MK%20Silver%20Hub,%20I'd%20like%20styling%20advice%20for%20your%20925%20silver%20jewellery."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#B76E79',
              color: '#FFFFFF',
              padding: '9px 16px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
            }}
          >
            <MessageCircle size={15} />
            <span>WhatsApp Us</span>
          </a>
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
