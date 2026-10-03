'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Package, Heart, MapPin, LogOut, ChevronRight, LogIn, UserPlus, Shield, Settings } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';

interface AccountDropdownProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function AccountDropdown({ isOpen = true, onClose }: AccountDropdownProps) {
  const shouldReduceMotion = useReducedMotion();
  const { wishlistCount } = useCommerce();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSession(data.user);
        } else {
          setSession(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setSession(null);
        setLoading(false);
      });
  }, []);

  if (!isOpen) return null;

  const isAdmin = session?.role === 'SUPER_ADMIN' || session?.role === 'ADMIN' || session?.role === 'manager';
  const userInitials = session?.name
    ? session.name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'MK';

  return (
    <motion.div
      className="account-dropdown-wrapper"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onMouseLeave={onClose}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        zIndex: 140,
        paddingTop: '8px',
      }}
    >
      <div
        style={{
          width: '310px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E7E2',
          borderRadius: '16px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
          padding: '16px',
          boxSizing: 'border-box',
          fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
        }}
      >
        {/* Top Header: Customer Info or Guest */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingBottom: '14px',
            borderBottom: '1px solid #E8E7E2',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111111',
              fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              flexShrink: 0,
            }}
          >
            {session ? userInitials : <User size={18} color="#111111" />}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4
              style={{
                fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: '#111111',
                margin: 0,
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {session ? session.name : 'Welcome to MK Silver Hub'}
            </h4>
            <p
              style={{
                fontSize: '0.74rem',
                color: '#6F6F6A',
                margin: '2px 0 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {session ? session.email : 'Sign in to access your patron privileges'}
            </p>
          </div>
        </div>

        {/* Links Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {session ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    backgroundColor: '#F8F7F3',
                    border: '1px solid #E8E7E2',
                    color: '#111111',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    transition: 'background-color 0.15s ease',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Shield size={15} color="#111111" />
                    <span>ADMIN DASHBOARD</span>
                  </div>
                  <ChevronRight size={13} color="#6F6F6A" />
                </Link>
              )}

              <Link
                href="/account"
                onClick={onClose}
                className="mk-dropdown-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#252525',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={15} color="#252525" />
                  <span>My Account</span>
                </div>
                <ChevronRight size={13} color="#6F6F6A" />
              </Link>

              <Link
                href="/account/orders"
                onClick={onClose}
                className="mk-dropdown-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#252525',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={15} color="#252525" />
                  <span>My Orders</span>
                </div>
                <ChevronRight size={13} color="#6F6F6A" />
              </Link>

              <Link
                href="/account/wishlist"
                onClick={onClose}
                className="mk-dropdown-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#252525',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Heart size={15} color="#252525" />
                  <span>Wishlist</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {wishlistCount > 0 && (
                    <span
                      style={{
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: '999px',
                      }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                  <ChevronRight size={13} color="#6F6F6A" />
                </div>
              </Link>

              <Link
                href="/account/addresses"
                onClick={onClose}
                className="mk-dropdown-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#252525',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={15} color="#252525" />
                  <span>Addresses</span>
                </div>
                <ChevronRight size={13} color="#6F6F6A" />
              </Link>

              <Link
                href="/account/settings"
                onClick={onClose}
                className="mk-dropdown-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#252525',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Settings size={15} color="#252525" />
                  <span>Account Settings</span>
                </div>
                <ChevronRight size={13} color="#6F6F6A" />
              </Link>

              <div style={{ height: '1px', backgroundColor: '#E8E7E2', margin: '8px 4px' }} />

              <button
                onClick={async () => {
                  onClose();
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                  } finally {
                    window.location.href = '/login';
                  }
                }}
                className="mk-dropdown-link"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#111111',
                  fontFamily: 'inherit',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <LogOut size={15} color="#111111" />
                  <span>Sign Out</span>
                </div>
                <ChevronRight size={13} color="#6F6F6A" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <LogIn size={15} color="#FFFFFF" />
                  <span>Sign In</span>
                </div>
                <ChevronRight size={13} color="#FFFFFF" />
              </Link>

              <Link
                href="/register"
                onClick={onClose}
                className="mk-dropdown-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#252525',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserPlus size={15} color="#252525" />
                  <span>Create Account</span>
                </div>
                <ChevronRight size={13} color="#6F6F6A" />
              </Link>

              <Link
                href="/account/orders"
                onClick={onClose}
                className="mk-dropdown-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#252525',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={15} color="#252525" />
                  <span>Track Orders</span>
                </div>
                <ChevronRight size={13} color="#6F6F6A" />
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="mk-dropdown-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#252525',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Heart size={15} color="#252525" />
                  <span>Wishlist</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {wishlistCount > 0 && (
                    <span
                      style={{
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: '999px',
                      }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                  <ChevronRight size={13} color="#6F6F6A" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        :global(.mk-dropdown-link:hover) {
          background-color: #F2F0EA !important;
          color: #111111 !important;
        }
      `}</style>
    </motion.div>
  );
}
