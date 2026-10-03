'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Search, Heart, User, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import { useNavigation } from './NavigationContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}


export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const { navbarItems, categories, loading } = useNavigation();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback to categories if navbarItems is not yet loaded
  const itemsToRender = (navbarItems && navbarItems.length > 0)
    ? navbarItems
    : (categories && categories.length > 0)
      ? categories.map((c) => ({
          id: c.id,
          label: c.name,
          slug: c.slug,
          url: `/shop?category=${encodeURIComponent(c.slug)}`,
          children: (c.children || []).map((sub) => ({
            id: sub.id,
            label: sub.name,
            slug: sub.slug,
            url: `/shop?category=${encodeURIComponent(c.slug)}&subcategory=${encodeURIComponent(sub.slug)}`,
          })),
        }))
      : [];

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

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
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
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.25s ease',
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
        {/* Drawer Top Header */}
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

        {/* Categories List (Dynamic Single Source of Truth Navigation) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {loading && itemsToRender.length === 0 ? (
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '24px',
                    backgroundColor: '#F8F7F3',
                    borderRadius: '2px',
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
              ))}
            </div>
          ) : itemsToRender.length === 0 ? (
            <div style={{ padding: '24px 20px', textAlign: 'center', color: '#6F6F6A', fontSize: '0.85rem' }}>
              No navigation items available
            </div>
          ) : (
            itemsToRender.map((item) => {
              const children = (item.children || []) as any[];
              const hasChildren = children.length > 0;
              const isSectionOpen = openSection === item.id;

              if (hasChildren) {
                return (
                  <div key={item.id || item.slug} style={{ borderBottom: '1px solid #F2F0EA' }}>
                    <button
                      onClick={() => toggleSection(item.id)}
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
                      <span>{(item.label || '').toUpperCase()}</span>
                      {isSectionOpen ? (
                        <Minus size={14} color="#111111" />
                      ) : (
                        <Plus size={14} color="#6F6F6A" />
                      )}
                    </button>

                    {isSectionOpen && (
                      <div
                        style={{
                          backgroundColor: '#F8F7F3',
                          padding: '8px 20px 14px 24px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {/* View All Parent */}
                        <Link
                          href={item.url || `/shop?category=${encodeURIComponent(item.slug || '')}`}
                          onClick={onClose}
                          style={{
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#111111',
                            textDecoration: 'none',
                            padding: '3px 0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>View All {item.label}</span>
                          <ArrowRight size={11} />
                        </Link>

                        {/* Real Children */}
                        {children.map((sub: any) => (
                          <Link
                            key={sub.id || sub.slug}
                            href={sub.url || `/shop?category=${encodeURIComponent(item.slug || '')}&subcategory=${encodeURIComponent(sub.slug || '')}`}
                            onClick={onClose}
                            style={{
                              fontFamily: 'var(--font-ui), "Jost", sans-serif',
                              fontSize: '0.82rem',
                              color: '#555550',
                              textDecoration: 'none',
                              padding: '3px 0',
                              display: 'block',
                            }}
                          >
                            {sub.label || sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Direct link (no children)
              return (
                <div key={item.id || item.slug} style={{ borderBottom: '1px solid #F2F0EA' }}>
                  <Link
                    href={item.url || `/shop?category=${encodeURIComponent(item.slug || '')}`}
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
                    {(item.label || '').toUpperCase()}
                  </Link>
                </div>
              );
            })
          )}

          {/* Quick Account Links */}
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href="/account"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                color: '#111111',
                textDecoration: 'none',
              }}
            >
              <User size={16} strokeWidth={1.5} />
              <span>My Account</span>
            </Link>

            <Link
              href="/account/wishlist"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                color: '#111111',
                textDecoration: 'none',
              }}
            >
              <Heart size={16} strokeWidth={1.5} />
              <span>Wishlist</span>
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                color: '#111111',
                textDecoration: 'none',
              }}
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              <span>Shopping Bag</span>
            </Link>
          </div>
        </div>

        {/* Drawer Bottom Contact / WhatsApp */}
        <div
          style={{
            padding: '18px 20px',
            borderTop: '1px solid #E8E7E2',
            backgroundColor: '#F8F7F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6F6F6A' }}>
              NEED ASSISTANCE?
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>
              Jaipur Concierge
            </span>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hello%20MK%20Silver%20Hub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact MK Silver Hub on WhatsApp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '2px',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textDecoration: 'none',
            }}
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
