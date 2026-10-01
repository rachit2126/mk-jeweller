'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Calendar,
  Menu,
  ExternalLink,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import GlobalCommandSearch from './GlobalCommandSearch';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  collapsed: boolean;
}

export default function AdminHeader({ onToggleMobileMenu, collapsed }: AdminHeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('Last 30 days');
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch real authenticated admin info
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  const adminName = user?.name || 'Rachit Sharma';
  const adminRole =
    user?.role === 'SUPER_ADMIN'
      ? 'Super Admin'
      : user?.role === 'ADMIN'
      ? 'Admin'
      : 'Super Admin';

  const initials = adminName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <header className={`admin-top-header ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="header-left">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleMobileMenu}
            className="mobile-menu-btn"
            aria-label="Open sidebar navigation"
          >
            <Menu size={18} />
          </button>

          {/* Global Search Bar (⌘ K) */}
          <div
            className="global-search-trigger"
            onClick={() => setSearchOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Search dashboard"
          >
            <Search size={15} className="search-icon" />
            <span className="search-placeholder">Search products, orders, customers...</span>
            <kbd className="search-shortcut">⌘ K</kbd>
          </div>
        </div>

        <div className="header-right">
          {/* View Live Store */}
          <Link href="/" target="_blank" className="store-link-btn" title="View live storefront">
            <span>View Store</span>
            <ExternalLink size={13} />
          </Link>

          {/* Date Filter Dropdown */}
          <div className="date-filter-pill">
            <Calendar size={13} className="calendar-icon" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="date-select"
              aria-label="Filter timeline date range"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* Notifications with badge 6 */}
          <button
            className="notifications-btn"
            aria-label="Notifications (6 unread)"
            title="6 unread notifications"
          >
            <Bell size={17} />
            <span className="notif-badge">6</span>
          </button>

          {/* Admin Profile Dropdown */}
          <div className="admin-profile-relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="admin-profile-trigger"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="admin-avatar-initials">
                <span>{initials}</span>
              </div>
              <div className="admin-info-col">
                <span className="admin-name">{adminName}</span>
                <span className="admin-role-badge">{adminRole}</span>
              </div>
              <ChevronDown size={14} className="dropdown-caret" />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown-card">
                <div className="dropdown-user-header">
                  <span className="dd-name">{adminName}</span>
                  <span className="dd-email">{user?.email || 'admin@mksilverhub.com'}</span>
                </div>
                <div className="dd-divider" />
                <Link
                  href="/admin/users"
                  onClick={() => setDropdownOpen(false)}
                  className="dd-item"
                >
                  <User size={15} />
                  <span>Admin Profile</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="dd-item"
                >
                  <Settings size={15} />
                  <span>Store Settings</span>
                </Link>
                <div className="dd-divider" />
                <button type="button" onClick={handleLogout} className="dd-item dd-danger">
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Search Overlay */}
      {searchOpen && <GlobalCommandSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
}
