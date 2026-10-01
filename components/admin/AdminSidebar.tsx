'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  Users,
  Boxes,
  Star,
  Image as ImageIcon,
  Home,
  Compass,
  Tag,
  BarChart3,
  UserCheck,
  FolderOpen,
  FileText,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Headphones,
  ArrowRight,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import { MKMonogramSvg } from '@/components/ui/BrandLogo';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Collections', href: '/admin/collections', icon: Sparkles },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '12' },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Reviews', href: '/admin/reviews', icon: Star, badge: '5' },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Homepage', href: '/admin/content/homepage', icon: Home },
  { label: 'Navigation', href: '/admin/navigation', icon: Compass },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/admin/reports', icon: FileSpreadsheet },
  { label: 'Users & Roles', href: '/admin/users', icon: UserCheck },
  { label: 'Media Library', href: '/admin/media', icon: FolderOpen },
  { label: 'Blog / Content', href: '/admin/content', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Top Logo & Title */}
        <div className="sidebar-brand-box">
          <Link href="/admin" className="brand-link" title="MK Silver Hub Admin">
            <div className="brand-monogram-ring">
              <MKMonogramSvg size={collapsed ? 30 : 36} variant="silver" />
            </div>
            {!collapsed && (
              <div className="brand-text-col">
                <span className="brand-name">MK SILVER HUB</span>
                <span className="brand-sub">FINE 925 STERLING JEWELLERY</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="collapse-toggle-btn desktop-only"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="sidebar-nav" aria-label="Admin Navigation">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href} className="nav-item">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="nav-icon-wrap">
                      <Icon size={17} strokeWidth={1.75} className="nav-icon" />
                    </span>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="nav-badge-pill">{item.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Bottom: Support Card & Copyright */}
        <div className="sidebar-bottom-block">
          {!collapsed && (
            <div className="support-card">
              <div className="support-top-row">
                <div className="support-icon-ring">
                  <Headphones size={15} />
                </div>
                <div className="support-text">
                  <span className="support-title">Need Help?</span>
                  <span className="support-sub">We&apos;re here to support you.</span>
                </div>
              </div>
              <Link href="/admin/settings" className="support-action-btn">
                <span>Contact Support</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          <div className="sidebar-meta-footer">
            {!collapsed ? (
              <div className="footer-flex-row">
                <span>© 2026 MK Silver Hub</span>
                <span className="version-tag">v1.0.0</span>
              </div>
            ) : (
              <span className="version-tag-collapsed">v1.0</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
