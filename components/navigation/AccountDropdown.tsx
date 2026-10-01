'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Package, Heart, MapPin, LogOut, ChevronRight, LogIn, UserPlus, Shield } from 'lucide-react';
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

  return (
    <motion.div
      className="account-dropdown-wrapper"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={onClose}
    >
      <div className="account-dropdown-card">
        {/* Header */}
        <div className="account-header">
          <div className="account-avatar">
            <User size={18} color="#B76E79" />
          </div>
          <div className="header-info">
            <h4 className="account-title">
              {session ? session.name : 'Patron Portal'}
            </h4>
            <p className="account-subtitle">
              {session ? session.email : 'Welcome to MK Silver Hub'}
            </p>
          </div>
        </div>

        {/* Links list */}
        <div className="account-menu-list">
          {session ? (
            <>
              {isAdmin && (
                <Link href="/admin" onClick={onClose} className="account-menu-item admin-item">
                  <div className="item-left">
                    <Shield size={16} className="menu-icon" />
                    <span className="font-semibold text-[#B76E79]">Admin Dashboard</span>
                  </div>
                  <ChevronRight size={13} className="menu-arrow" />
                </Link>
              )}

              <Link href="/account" onClick={onClose} className="account-menu-item">
                <div className="item-left">
                  <User size={16} className="menu-icon" />
                  <span>My Account</span>
                </div>
                <ChevronRight size={13} className="menu-arrow" />
              </Link>

              <Link href="/account?tab=orders" onClick={onClose} className="account-menu-item">
                <div className="item-left">
                  <Package size={16} className="menu-icon" />
                  <span>My Orders</span>
                </div>
                <ChevronRight size={13} className="menu-arrow" />
              </Link>

              <Link href="/wishlist" onClick={onClose} className="account-menu-item">
                <div className="item-left">
                  <Heart size={16} className="menu-icon" />
                  <span>Wishlist</span>
                </div>
                <div className="item-right">
                  {wishlistCount > 0 && (
                    <span className="wishlist-badge">{wishlistCount}</span>
                  )}
                  <ChevronRight size={13} className="menu-arrow" />
                </div>
              </Link>

              <Link href="/account?tab=addresses" onClick={onClose} className="account-menu-item">
                <div className="item-left">
                  <MapPin size={16} className="menu-icon" />
                  <span>Addresses</span>
                </div>
                <ChevronRight size={13} className="menu-arrow" />
              </Link>

              <div className="account-divider" />

              <button
                onClick={async () => {
                  onClose();
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                  } finally {
                    window.location.href = '/login';
                  }
                }}
                className="account-logout-btn"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={onClose} className="account-menu-item primary-action">
                <div className="item-left">
                  <LogIn size={16} className="menu-icon" />
                  <span>Sign In</span>
                </div>
                <ChevronRight size={13} className="menu-arrow" />
              </Link>

              <Link href="/register" onClick={onClose} className="account-menu-item">
                <div className="item-left">
                  <UserPlus size={16} className="menu-icon" />
                  <span>Create Account</span>
                </div>
                <ChevronRight size={13} className="menu-arrow" />
              </Link>

              <Link href="/account?tab=orders" onClick={onClose} className="account-menu-item">
                <div className="item-left">
                  <Package size={16} className="menu-icon" />
                  <span>Track Orders</span>
                </div>
                <ChevronRight size={13} className="menu-arrow" />
              </Link>

              <Link href="/wishlist" onClick={onClose} className="account-menu-item">
                <div className="item-left">
                  <Heart size={16} className="menu-icon" />
                  <span>Wishlist</span>
                </div>
                <div className="item-right">
                  {wishlistCount > 0 && (
                    <span className="wishlist-badge">{wishlistCount}</span>
                  )}
                  <ChevronRight size={13} className="menu-arrow" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .account-dropdown-wrapper {
          position: relative;
          z-index: 130;
          pointer-events: auto;
        }

        .account-dropdown-card {
          width: 290px;
          background: rgba(255, 249, 243, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid rgba(232, 216, 208, 0.85);
          border-radius: 20px;
          box-shadow: 0 20px 48px rgba(65, 40, 35, 0.12), 0 4px 12px rgba(183, 110, 121, 0.08);
          padding: 16px;
        }

        .account-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 6px 12px 6px;
          border-bottom: 1px solid rgba(232, 216, 208, 0.6);
          margin-bottom: 8px;
        }

        .account-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FCECE9;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(183, 110, 121, 0.3);
          flex-shrink: 0;
        }

        .header-info {
          min-width: 0;
          flex: 1;
        }

        .account-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #2D201E;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .account-subtitle {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          color: #806D68;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .account-menu-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        :global(.account-menu-item) {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 9px 12px !important;
          border-radius: 10px !important;
          text-decoration: none !important;
          color: #3B2B2B !important;
          font-family: var(--font-ui), 'Jost', sans-serif !important;
          font-size: 0.84rem !important;
          font-weight: 500 !important;
          white-space: nowrap !important;
          flex-wrap: nowrap !important;
          transition: all 180ms ease !important;
        }

        :global(.account-menu-item.primary-action) {
          background-color: #FCE8DE !important;
          color: #B76E79 !important;
          font-weight: 600 !important;
        }

        :global(.account-menu-item.admin-item) {
          background-color: #FFF5F0 !important;
          border: 1px solid #F0D9D0 !important;
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .item-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        :global(.menu-icon) {
          color: #806D68;
          flex-shrink: 0 !important;
          transition: color 180ms ease;
        }

        :global(.menu-arrow) {
          color: #806D68;
          opacity: 0.5;
          flex-shrink: 0 !important;
          transition: transform 180ms ease, opacity 180ms ease, color 180ms ease;
        }

        .wishlist-badge {
          background-color: #B76E79;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 600;
          min-width: 17px;
          height: 17px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        :global(.account-menu-item:hover) {
          background-color: #FCECE9 !important;
          color: #B76E79 !important;
        }

        :global(.account-menu-item:hover) :global(.menu-icon),
        :global(.account-menu-item:hover) :global(.menu-arrow) {
          color: #B76E79 !important;
          opacity: 1 !important;
        }

        :global(.account-menu-item:hover) :global(.menu-arrow) {
          transform: translateX(3px) !important;
        }

        .account-divider {
          height: 1px;
          background-color: rgba(232, 216, 208, 0.7);
          margin: 8px 4px;
        }

        .account-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #806D68;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 180ms ease;
          text-align: left;
        }

        .account-logout-btn:hover {
          background-color: #FCECE9;
          color: #B76E79;
        }
      `}</style>
    </motion.div>
  );
}
