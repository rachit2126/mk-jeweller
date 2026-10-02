'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Search, Heart, User, ShoppingBag, MessageCircle } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccordionCategory {
  title: string;
  href: string;
  items: { label: string; href: string }[];
}

const ACCORDION_CATEGORIES: AccordionCategory[] = [
  {
    title: 'EARRINGS',
    href: '/shop?category=earrings',
    items: [
      { label: 'All Earrings', href: '/shop?category=earrings' },
      { label: 'Studs', href: '/shop?category=earrings&sub=studs' },
      { label: 'Hoops', href: '/shop?category=earrings&sub=hoops' },
      { label: 'Drop Earrings', href: '/shop?category=earrings&sub=drop' },
      { label: 'Jhumki', href: '/shop?category=earrings&sub=jhumki' },
      { label: 'Everyday Earrings', href: '/shop?category=earrings&sub=everyday' },
      { label: 'Statement Earrings', href: '/shop?category=earrings&sub=statement' },
    ],
  },
  {
    title: 'NECKLACES',
    href: '/shop?category=necklaces',
    items: [
      { label: 'All Necklaces', href: '/shop?category=necklaces' },
      { label: 'Pendant Necklaces', href: '/shop?category=necklaces&sub=pendant' },
      { label: 'Chains', href: '/shop?category=necklaces&sub=chains' },
      { label: 'Chokers', href: '/shop?category=necklaces&sub=chokers' },
      { label: 'Layered Necklaces', href: '/shop?category=necklaces&sub=layered' },
      { label: 'Everyday Necklaces', href: '/shop?category=necklaces&sub=everyday' },
      { label: 'Bridal Necklaces', href: '/shop?category=necklaces&sub=bridal' },
    ],
  },
  {
    title: 'RINGS',
    href: '/shop?category=rings',
    items: [
      { label: 'All Rings', href: '/shop?category=rings' },
      { label: 'Everyday Rings', href: '/shop?category=rings&sub=everyday' },
      { label: 'Silver Rings', href: '/shop?category=rings&sub=silver' },
      { label: 'Solitaire Rings', href: '/shop?category=rings&sub=solitaire' },
      { label: 'Statement Rings', href: '/shop?category=rings&sub=statement' },
      { label: 'Couple Rings', href: '/shop?category=rings&sub=couple' },
      { label: 'Bridal Rings', href: '/shop?category=rings&sub=bridal' },
    ],
  },
  {
    title: 'BRACELETS',
    href: '/shop?category=bracelets',
    items: [
      { label: 'All Bracelets', href: '/shop?category=bracelets' },
      { label: 'Chain Bracelets', href: '/shop?category=bracelets&sub=chain' },
      { label: 'Cuff Bracelets', href: '/shop?category=bracelets&sub=cuff' },
      { label: 'Charm Bracelets', href: '/shop?category=bracelets&sub=charm' },
      { label: 'Everyday Bracelets', href: '/shop?category=bracelets&sub=everyday' },
    ],
  },
  {
    title: 'BANGLES',
    href: '/shop?category=bangles',
    items: [
      { label: 'All Bangles', href: '/shop?category=bangles' },
      { label: 'Silver Bangles', href: '/shop?category=bangles&sub=silver' },
      { label: 'Kada', href: '/shop?category=bangles&sub=kada' },
      { label: 'Stacking Bangles', href: '/shop?category=bangles&sub=stacking' },
      { label: 'Traditional Bangles', href: '/shop?category=bangles&sub=traditional' },
    ],
  },
  {
    title: 'ANKLETS',
    href: '/shop?category=anklets',
    items: [
      { label: 'All Anklets', href: '/shop?category=anklets' },
      { label: 'Everyday Anklets', href: '/shop?category=anklets&sub=everyday' },
      { label: 'Silver Anklets', href: '/shop?category=anklets&sub=silver' },
      { label: 'Bridal Anklets', href: '/shop?category=anklets&sub=bridal' },
    ],
  },
  {
    title: 'PENDANTS',
    href: '/shop?category=pendants',
    items: [
      { label: 'All Pendants', href: '/shop?category=pendants' },
      { label: 'Solitaire Pendants', href: '/shop?category=pendants&sub=solitaire' },
      { label: 'Floral Pendants', href: '/shop?category=pendants&sub=floral' },
      { label: 'Spiritual Pendants', href: '/shop?category=pendants&sub=spiritual' },
    ],
  },
  {
    title: 'MEN',
    href: '/shop?category=men',
    items: [
      { label: 'All Men’s Jewellery', href: '/shop?category=men' },
      { label: 'Chains', href: '/shop?category=men&sub=chains' },
      { label: 'Bracelets', href: '/shop?category=men&sub=bracelets' },
      { label: 'Pendants', href: '/shop?category=men&sub=pendants' },
      { label: 'Rings', href: '/shop?category=men&sub=rings' },
      { label: 'Cufflinks', href: '/shop?category=men&sub=cufflinks' },
    ],
  },
  {
    title: 'BRIDAL',
    href: '/collections/bridal',
    items: [
      { label: 'Bridal Edit', href: '/collections/bridal' },
      { label: 'Bridal Sets', href: '/shop?category=bridal&sub=sets' },
      { label: 'Necklaces', href: '/shop?category=necklaces&sub=bridal' },
      { label: 'Earrings', href: '/shop?category=earrings&sub=bridal' },
      { label: 'Rings', href: '/shop?category=rings&sub=bridal' },
    ],
  },
  {
    title: 'COLLECTIONS',
    href: '/collections',
    items: [
      { label: 'All Collections', href: '/collections' },
      { label: 'Minimal', href: '/collections/minimal' },
      { label: 'Everyday', href: '/collections/everyday' },
      { label: 'Festive', href: '/collections/festive' },
      { label: 'Bridal', href: '/collections/bridal' },
      { label: 'Heritage', href: '/collections/heritage' },
    ],
  },
];

const DIRECT_ITEMS = [
  { label: 'NEW ARRIVALS', href: '/shop?sort=newest' },
  { label: 'BEST SELLERS', href: '/shop?isBestSeller=true' },
  { label: 'ABOUT', href: '/about' },
];

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

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
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '88vw',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '10px 0 40px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
          fontFamily: 'var(--font-ui), "Jost", sans-serif',
        }}
      >
        {/* Drawer Top Header (Mockup Screen 3) */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E8E7E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
          }}
        >
          <BrandLogo size="compact" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#F8F7F3',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111111',
              cursor: 'pointer',
            }}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Search Field */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F2F0EA' }}>
          <form onSubmit={handleSearchSubmit}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F8F7F3',
                borderRadius: '0px',
                border: '1px solid #E8E7E2',
                padding: '10px 14px',
                gap: '10px',
              }}
            >
              <Search size={16} color="#6F6F6A" />
              <input
                type="text"
                placeholder="Search jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontSize: '0.85rem',
                  color: '#111111',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                }}
              />
            </div>
          </form>
        </div>

        {/* Accordion Categories List (Screen 3 in Mockup) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {ACCORDION_CATEGORIES.map((cat) => {
            const isOpen = openSection === cat.title;

            return (
              <div key={cat.title} style={{ borderBottom: '1px solid #F2F0EA' }}>
                <button
                  onClick={() => toggleSection(cat.title)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: '#111111',
                    cursor: 'pointer',
                  }}
                >
                  <span>{cat.title}</span>
                  {isOpen ? (
                    <Minus size={14} color="#111111" />
                  ) : (
                    <Plus size={14} color="#6F6F6A" />
                  )}
                </button>

                {isOpen && (
                  <div
                    style={{
                      backgroundColor: '#F8F7F3',
                      padding: '8px 20px 14px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {cat.items.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={onClose}
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.82rem',
                          color: '#252525',
                          textDecoration: 'none',
                          padding: '3px 0',
                          display: 'block',
                        }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Direct Items: NEW ARRIVALS, BEST SELLERS, ABOUT */}
          {DIRECT_ITEMS.map((item) => (
            <div key={item.label} style={{ borderBottom: '1px solid #F2F0EA' }}>
              <Link
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'block',
                  padding: '14px 20px',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#111111',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Drawer Bottom Quick Actions */}
        <div
          style={{
            padding: '18px 20px',
            borderTop: '1px solid #E8E7E2',
            backgroundColor: '#F8F7F3',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <Link
              href="/account"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '9px 12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E7E2',
                color: '#111111',
                fontSize: '0.74rem',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <User size={14} />
              <span>Account</span>
            </Link>

            <Link
              href="/wishlist"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '9px 12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E7E2',
                color: '#111111',
                fontSize: '0.74rem',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Heart size={14} />
              <span>Wishlist</span>
            </Link>
          </div>

          <a
            href="https://wa.me/917425058118"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 14px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <MessageCircle size={15} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      <style jsx global>{`
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
