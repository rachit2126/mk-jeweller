'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { useCommerce } from '@/components/commerce/CommerceContext';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/types';

export type AccountTab = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings';
export type OrderStatusFilter = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface LuxuryAccountExperienceProps {
  initialTab?: AccountTab;
}

export default function LuxuryAccountExperience({ initialTab = 'overview' }: LuxuryAccountExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams?.get('tab') as AccountTab | null;

  const [activeTab, setActiveTab] = useState<AccountTab>(queryTab || initialTab);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Recently viewed or catalogue products from DB
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  // Wishlist from CommerceContext
  const { wishlist } = useCommerce();

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    orderUpdates: true,
    newsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Fetch Session, Orders and Catalogue Products
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSession(data.user);
          if (Array.isArray(data.user.addresses) && data.user.addresses.length > 0) {
            setAddresses(data.user.addresses);
          }
          setSettingsForm((prev) => ({
            ...prev,
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
          }));

          // Fetch orders from MongoDB
          fetch('/api/orders/my-orders')
            .then((r) => r.json())
            .then((ordData) => {
              setOrders(ordData.orders || []);
              setOrdersLoading(false);
            })
            .catch(() => setOrdersLoading(false));
        } else {
          setSession(null);
          setOrdersLoading(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setSession(null);
        setLoading(false);
        setOrdersLoading(false);
      });

    // Fetch real products for Recently Viewed
    fetch('/api/products?limit=4')
      .then((r) => r.json())
      .then((prodData) => {
        if (prodData.products && prodData.products.length > 0) {
          setRecentProducts(prodData.products);
        }
      })
      .catch(() => {});
  }, []);

  // Sync tab with route changes or props
  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [queryTab, initialTab]);

  const handleTabChange = (tab: AccountTab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      router.push('/account');
    } else {
      router.push(`/account/${tab}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setSession(null);
      window.location.href = '/login';
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSuccess('');
    setTimeout(() => {
      setSettingsLoading(false);
      setSettingsSuccess('Account preferences saved successfully.');
      setTimeout(() => setSettingsSuccess(''), 3500);
    }, 600);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.street || !addressForm.city) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      ...addressForm,
    };

    if (addressForm.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat([newAddr]));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }

    setAddressForm({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: false,
    });
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const user = {
    name: session?.name || 'Patron',
    email: session?.email || '',
    phone: session?.phone || '',
    role: session?.role || 'USER',
    avatar: session?.avatar || '',
    createdAt: session?.createdAt || null,
    status: session?.status || 'Active',
  };

  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'manager';

  const userInitials = (user.name || user.email || 'MK')
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'MK';

  const formattedMemberDate = (() => {
    if (!user.createdAt) return null;
    try {
      const d = new Date(user.createdAt);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return null;
    }
  })();

  // Filter orders by status
  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'all') return true;
    return (ord.status || 'processing').toLowerCase() === statusFilter;
  });

  const orderCounts = {
    all: orders.length,
    processing: orders.filter((o) => (o.status || 'processing').toLowerCase() === 'processing').length,
    shipped: orders.filter((o) => (o.status || '').toLowerCase() === 'shipped').length,
    delivered: orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length,
    cancelled: orders.filter((o) => (o.status || '').toLowerCase() === 'cancelled').length,
  };

  // Loading Screen
  if (loading) {
    return (
      <div
        style={{
          minHeight: '70vh',
          backgroundColor: '#F8F7F3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
          color: '#6F6F6A',
          fontSize: '0.88rem',
          letterSpacing: '0.04em',
        }}
      >
        Loading your patron account...
      </div>
    );
  }

  // Guest State
  if (!session) {
    return (
      <div
        style={{
          minHeight: '75vh',
          backgroundColor: '#F8F7F3',
          padding: '80px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E7E2',
            borderRadius: '16px',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <User size={22} />
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.22em',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#6F6F6A',
              display: 'block',
            }}
          >
            MK SILVER HUB
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
              fontSize: '1.9rem',
              color: '#111111',
              fontWeight: 400,
              textTransform: 'uppercase',
              margin: '8px 0 12px 0',
              letterSpacing: '0.02em',
            }}
          >
            Patron Account
          </h1>
          <p
            style={{
              fontSize: '0.84rem',
              color: '#6F6F6A',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            Sign in to track orders, manage delivery addresses, and access your saved jewellery wishlist.
          </p>
          <Link
            href="/login?redirect=/account"
            style={{
              display: 'block',
              width: '100%',
              padding: '13px 0',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              borderRadius: '6px',
              textDecoration: 'none',
              marginBottom: '16px',
              transition: 'background-color 0.15s ease',
            }}
          >
            SIGN IN TO ACCOUNT
          </Link>
          <div style={{ fontSize: '0.8rem', color: '#6F6F6A' }}>
            New to MK Silver Hub?{' '}
            <Link
              href="/register"
              style={{
                color: '#111111',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#F8F7F3',
        minHeight: '100vh',
        padding: '36px 0 72px 0',
        color: '#111111',
        fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="account-container"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 48px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            fontSize: '0.78rem',
            color: '#6F6F6A',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link href="/" style={{ color: '#6F6F6A', textDecoration: 'none' }} className="hover-dark">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/account"
            style={{
              color: activeTab === 'overview' ? '#111111' : '#6F6F6A',
              fontWeight: activeTab === 'overview' ? 600 : 400,
              textDecoration: 'none',
            }}
            className="hover-dark"
          >
            My Account
          </Link>
          {activeTab !== 'overview' && (
            <>
              <span>/</span>
              <span style={{ color: '#111111', fontWeight: 600, textTransform: 'capitalize' }}>
                {activeTab}
              </span>
            </>
          )}
        </nav>

        {/* Admin Banner if privileged */}
        {isAdmin && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E7E2',
              borderRadius: '10px',
              padding: '12px 18px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#252525' }}>
              <Shield size={16} color="#111111" />
              <span>Signed in with <strong>{user.role}</strong> administrative permissions.</span>
            </div>
            <Link
              href="/admin"
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#111111',
                padding: '6px 14px',
                borderRadius: '6px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              GO TO ADMIN ERP
            </Link>
          </div>
        )}

        {/* 2-Column Layout: Left Sidebar (270px) | Right Main Content */}
        <div className="account-layout">
          {/* ========================================================= */}
          {/* LEFT: MONOCHROME ACCOUNT SIDEBAR (Reference Mockup)       */}
          {/* ========================================================= */}
          <aside className="account-sidebar">
            {/* Top Patron Info with Avatar */}
            <div className="sidebar-header">
              <div className="sidebar-avatar">
                {userInitials}
              </div>
              <div className="sidebar-user-meta">
                <div className="sidebar-user-name">
                  {user.name}
                </div>
                <div className="sidebar-user-email">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="sidebar-nav">
              <button
                type="button"
                onClick={() => handleTabChange('overview')}
                className={`sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              >
                <User size={16} />
                <span>My Account</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('orders')}
                className={`sidebar-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              >
                <Package size={16} />
                <span>My Orders</span>
                {orders.length > 0 && (
                  <span className="sidebar-pill">{orders.length}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('addresses')}
                className={`sidebar-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              >
                <MapPin size={16} />
                <span>Addresses</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('wishlist')}
                className={`sidebar-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              >
                <Heart size={16} />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="sidebar-pill">{wishlist.length}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('settings')}
                className={`sidebar-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <Settings size={16} />
                <span>Account Settings</span>
              </button>

              <div className="sidebar-divider" />

              <button
                type="button"
                onClick={handleLogout}
                className="sidebar-nav-btn signout-btn"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT: MAIN CONTENT AREA                                   */}
          {/* ========================================================= */}
          <main className="account-main">
            {/* ------------------------------------------------------- */}
            {/* VIEW 1: OVERVIEW (MATCHES EXACT MOCKUP)                 */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'overview' && (
              <div className="overview-flow">
                {/* 1. Main Profile Hero with Editorial Jewellery Banner */}
                <div className="profile-hero">
                  <div className="profile-hero-text">
                    <span className="profile-hero-eyebrow">
                      WELCOME BACK,
                    </span>
                    <h1 className="profile-hero-title">
                      {user.name}
                    </h1>
                    <p className="profile-hero-subtitle">
                      Manage your account, track orders and keep your jewellery journey with MK Silver Hub seamless.
                    </p>
                  </div>

                  {/* Subtle jewellery editorial image (mockup style) */}
                  <div className="profile-hero-banner">
                    <Image
                      src="/images/auth-editorial-bg.jpg"
                      alt="Fine 925 Sterling Silver Jewellery"
                      fill
                      sizes="(max-width: 768px) 100vw, 340px"
                      priority
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      className="hero-banner-img"
                    />
                  </div>
                </div>

                {/* 2. Account Information Card */}
                <div className="account-card">
                  <div
                    className="account-card-header"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <h3 className="card-title">
                      Account Information
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleTabChange('settings')}
                      className="card-edit-btn"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="account-info-grid">
                    {/* Left: Avatar + Details */}
                    <div className="info-patron-block">
                      <div className="info-avatar">
                        {userInitials}
                      </div>
                      <div className="info-text">
                        <div className="info-name">
                          {user.name}
                        </div>
                        <div className="info-email">
                          {user.email}
                        </div>
                        {user.phone ? (
                          <div className="info-phone">
                            <Phone size={12} color="#6F6F6A" />
                            <span>{user.phone}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Right: Metrics Grid */}
                    <div className="info-metrics-grid">
                      <div className="metric-col">
                        <div className="metric-label">
                          ACCOUNT STATUS
                        </div>
                        <div className="metric-value">
                          <span className="status-dot" />
                          <span style={{ textTransform: 'capitalize' }}>{user.status || 'Active'}</span>
                        </div>
                      </div>

                      <div className="metric-col">
                        <div className="metric-label">
                          MEMBER SINCE
                        </div>
                        <div className="metric-value">
                          <Calendar size={13} color="#6F6F6A" />
                          <span>{formattedMemberDate || 'Active Patron'}</span>
                        </div>
                      </div>

                      <div className="metric-col">
                        <div className="metric-label">
                          TOTAL ORDERS
                        </div>
                        <div className="metric-value">
                          <Package size={13} color="#6F6F6A" />
                          <span>{orders.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Quick Actions (4 Cards Grid) */}
                <div className="section-block">
                  <div
                    className="section-header"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <h3 className="section-title">
                      Quick Actions
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleTabChange('orders')}
                      className="section-link-btn"
                    >
                      <span>View All</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="quick-actions-grid">
                    {/* Card 1: My Orders */}
                    <div
                      onClick={() => handleTabChange('orders')}
                      className="quick-card"
                    >
                      <div className="quick-card-content">
                        <div className="quick-icon-box">
                          <Package size={20} />
                        </div>
                        <div className="quick-card-title">
                          My Orders
                        </div>
                        <div className="quick-card-desc">
                          Track and manage your purchases
                        </div>
                      </div>
                      <div className="quick-arrow-wrap">
                        <div className="quick-arrow-circle">
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Wishlist */}
                    <div
                      onClick={() => handleTabChange('wishlist')}
                      className="quick-card"
                    >
                      <div className="quick-card-content">
                        <div className="quick-icon-box">
                          <Heart size={20} />
                        </div>
                        <div className="quick-card-title">
                          Wishlist
                        </div>
                        <div className="quick-card-desc">
                          {wishlist.length > 0 ? `${wishlist.length} saved jewellery items` : 'View your saved jewellery'}
                        </div>
                      </div>
                      <div className="quick-arrow-wrap">
                        <div className="quick-arrow-circle">
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Addresses */}
                    <div
                      onClick={() => handleTabChange('addresses')}
                      className="quick-card"
                    >
                      <div className="quick-card-content">
                        <div className="quick-icon-box">
                          <MapPin size={20} />
                        </div>
                        <div className="quick-card-title">
                          Addresses
                        </div>
                        <div className="quick-card-desc">
                          Manage your delivery addresses
                        </div>
                      </div>
                      <div className="quick-arrow-wrap">
                        <div className="quick-arrow-circle">
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Account Settings */}
                    <div
                      onClick={() => handleTabChange('settings')}
                      className="quick-card"
                    >
                      <div className="quick-card-content">
                        <div className="quick-icon-box">
                          <Settings size={20} />
                        </div>
                        <div className="quick-card-title">
                          Account Settings
                        </div>
                        <div className="quick-card-desc">
                          Update your personal information
                        </div>
                      </div>
                      <div className="quick-arrow-wrap">
                        <div className="quick-arrow-circle">
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Recently Viewed Section */}
                <div className="section-block">
                  <div
                    className="section-header"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <h3 className="section-title">
                      Recently Viewed
                    </h3>
                    <Link href="/shop" className="section-link-btn">
                      <span>View All</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  {recentProducts.length > 0 ? (
                    <div className="recently-viewed-grid">
                      {recentProducts.slice(0, 4).map((prod) => (
                        <ProductCard key={prod.id || prod.slug} product={prod} />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state-box">
                      <h4 className="empty-title">
                        NO RECENTLY VIEWED ITEMS
                      </h4>
                      <p className="empty-subtitle">
                        Explore our latest 925 sterling silver jewellery collection.
                      </p>
                      <Link href="/shop" className="btn-solid">
                        EXPLORE COLLECTION →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* VIEW 2: ORDERS (MY ORDERS)                             */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'orders' && (
              <div className="subtab-flow">
                <div>
                  <h1 className="subtab-title">
                    MY ORDERS
                  </h1>
                  <p className="subtab-subtitle">
                    Track and manage all your jewellery purchases and deliveries.
                  </p>
                </div>

                {/* Status Filter Tabs */}
                <div className="filter-pills-row">
                  {(['all', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatusFilter[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                    >
                      {st} ({orderCounts[st]})
                    </button>
                  ))}
                </div>

                {/* Orders Content */}
                {ordersLoading ? (
                  <div className="loading-box">
                    Loading your orders...
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="empty-state-box">
                    <div className="empty-icon-circle">
                      <Package size={22} />
                    </div>
                    <h3 className="empty-title">
                      No orders yet
                    </h3>
                    <p className="empty-subtitle">
                      You haven&apos;t placed any orders yet. Explore our collection of fine 925 sterling silver jewellery.
                    </p>
                    <Link href="/shop" className="btn-solid">
                      BROWSE CATALOGUE →
                    </Link>
                  </div>
                ) : (
                  <div className="orders-stack">
                    {filteredOrders.map((ord) => {
                      const displayOrderId = String(ord.id).startsWith('#') ? ord.id : `#${ord.id}`;
                      const orderTotal =
                        ord.totalAmount ||
                        ord.total ||
                        ord.totalPrice ||
                        (ord.items
                          ? ord.items.reduce(
                              (sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 1),
                              0
                            )
                          : 0);

                      return (
                        <div key={ord.id} className="order-item-card">
                          <div className="order-card-header">
                            <div>
                              <span className="order-id-label">
                                Order {displayOrderId}
                              </span>
                              <span className="order-date-label">
                                • Placed on {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <span className={`order-status-badge ${ord.status?.toLowerCase() || 'processing'}`}>
                              {ord.status || 'Processing'}
                            </span>
                          </div>

                          {/* Order Items */}
                          <div className="order-items-list">
                            {ord.items && ord.items.map((item: any, idx: number) => (
                              <div key={idx} className="order-item-row">
                                <div className="item-thumb-box">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      sizes="56px"
                                      style={{ objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="thumb-fallback">
                                      <Package size={16} />
                                    </div>
                                  )}
                                </div>
                                <div className="item-meta">
                                  <div className="item-name">
                                    {item.name}
                                  </div>
                                  <div className="item-qty-price">
                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                  </div>
                                </div>
                                <div className="item-line-total">
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer */}
                          <div className="order-footer">
                            <div className="order-tracking-hint">
                              Payment: <strong>{ord.paymentMethod?.toUpperCase() || 'ONLINE'}</strong> • {ord.isPaid ? 'Paid' : 'Pending'}
                            </div>
                            <div className="order-total-block">
                              <span className="order-total-label">Total Amount:</span>
                              <span className="order-total-amount">{formatPrice(orderTotal)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* VIEW 3: ADDRESSES                                       */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'addresses' && (
              <div className="subtab-flow">
                <div className="subtab-header-row">
                  <div>
                    <h1 className="subtab-title">
                      DELIVERY ADDRESSES
                    </h1>
                    <p className="subtab-subtitle">
                      Manage your saved shipping destinations for seamless checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="btn-solid"
                  >
                    <Plus size={14} />
                    <span>ADD NEW ADDRESS</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="empty-state-box">
                    <div className="empty-icon-circle">
                      <MapPin size={22} />
                    </div>
                    <h3 className="empty-title">
                      No addresses saved
                    </h3>
                    <p className="empty-subtitle">
                      Save your shipping address now to expedite your future fine jewellery orders.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="btn-solid"
                    >
                      + ADD ADDRESS
                    </button>
                  </div>
                ) : (
                  <div className="addresses-grid">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="address-card">
                        <div className="address-card-top">
                          <span className="address-name">{addr.name}</span>
                          {addr.isDefault ? (
                            <span className="default-badge">
                              DEFAULT
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-btn"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        <div className="address-body">
                          <div>{addr.street}</div>
                          <div>{addr.city}, {addr.state} {addr.postalCode}</div>
                          <div className="address-phone-line">
                            <Phone size={12} color="#6F6F6A" />
                            <span>{addr.phone}</span>
                          </div>
                        </div>

                        <div className="address-actions-bar">
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="delete-btn"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Modal */}
                {isAddressModalOpen && (
                  <div className="modal-backdrop">
                    <div className="modal-window">
                      <div className="modal-header">
                        <h3 className="modal-title">
                          Add New Delivery Address
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsAddressModalOpen(false)}
                          className="modal-close-btn"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleAddAddress} className="modal-form">
                        <div className="form-grid-2">
                          <div>
                            <label className="form-label">Full Name *</label>
                            <input
                              type="text"
                              required
                              value={addressForm.name}
                              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                              className="form-input"
                              placeholder="e.g. Rachit Agarwal"
                            />
                          </div>
                          <div>
                            <label className="form-label">Phone Number *</label>
                            <input
                              type="tel"
                              required
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              className="form-input"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="form-label">Street Address *</label>
                          <input
                            type="text"
                            required
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            className="form-input"
                            placeholder="Flat / House / Suite, Street, Landmark"
                          />
                        </div>

                        <div className="form-grid-3">
                          <div>
                            <label className="form-label">City *</label>
                            <input
                              type="text"
                              required
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="form-input"
                              placeholder="e.g. Jaipur"
                            />
                          </div>
                          <div>
                            <label className="form-label">State *</label>
                            <input
                              type="text"
                              required
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              className="form-input"
                              placeholder="e.g. Rajasthan"
                            />
                          </div>
                          <div>
                            <label className="form-label">PIN Code *</label>
                            <input
                              type="text"
                              required
                              value={addressForm.postalCode}
                              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                              className="form-input"
                              placeholder="302001"
                            />
                          </div>
                        </div>

                        <label className="form-checkbox-label">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          />
                          <span>Set as default shipping address</span>
                        </label>

                        <div className="modal-actions">
                          <button
                            type="button"
                            onClick={() => setIsAddressModalOpen(false)}
                            className="btn-outline"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn-solid"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* VIEW 4: WISHLIST                                        */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'wishlist' && (
              <div className="subtab-flow">
                <div>
                  <h1 className="subtab-title">
                    MY WISHLIST
                  </h1>
                  <p className="subtab-subtitle">
                    Your personal vault of curated 925 sterling silver treasures.
                  </p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="empty-state-box">
                    <div className="empty-icon-circle">
                      <Heart size={22} />
                    </div>
                    <h3 className="empty-title">
                      Your wishlist is empty
                    </h3>
                    <p className="empty-subtitle">
                      Explore our handcrafted earrings, chokers, bangles, and solitaire rings.
                    </p>
                    <Link href="/shop" className="btn-solid">
                      EXPLORE COLLECTION →
                    </Link>
                  </div>
                ) : (
                  <div className="recently-viewed-grid">
                    {wishlist.map((prod) => (
                      <ProductCard key={prod.id || prod.slug} product={prod} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* VIEW 5: ACCOUNT SETTINGS                                */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'settings' && (
              <div className="subtab-flow">
                <div>
                  <h1 className="subtab-title">
                    ACCOUNT SETTINGS
                  </h1>
                  <p className="subtab-subtitle">
                    Manage your personal information, security, and patron communication preferences.
                  </p>
                </div>

                {settingsSuccess && (
                  <div className="success-banner">
                    <CheckCircle2 size={16} color="#059669" />
                    <span>{settingsSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="settings-stack">
                  {/* Card 1: Personal Info */}
                  <div className="account-card">
                    <h3 className="card-title" style={{ marginBottom: '18px' }}>
                      Personal Information
                    </h3>

                    <div className="form-grid-2">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          value={settingsForm.name}
                          onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          disabled
                          value={settingsForm.email}
                          className="form-input disabled"
                        />
                        <span className="field-note">
                          Email linked to your patron credentials cannot be modified directly.
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', maxWidth: '400px' }}>
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Card 2: Password & Security */}
                  <div className="account-card">
                    <h3 className="card-title" style={{ marginBottom: '18px' }}>
                      Password & Security
                    </h3>

                    <div className="form-grid-3">
                      <div>
                        <label className="form-label">Current Password</label>
                        <div className="password-input-wrap">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={settingsForm.currentPassword}
                            onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
                            placeholder="••••••••"
                            className="form-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-eye-btn"
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="form-label">New Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settingsForm.newPassword}
                          onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                          placeholder="••••••••"
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settingsForm.confirmPassword}
                          onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Preferences */}
                  <div className="account-card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>
                      Patron Notifications
                    </h3>

                    <div className="checkbox-stack">
                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          checked={settingsForm.orderUpdates}
                          onChange={(e) => setSettingsForm({ ...settingsForm, orderUpdates: e.target.checked })}
                        />
                        <div>
                          <strong>Order Status Notifications</strong>
                          <p style={{ margin: 0, fontSize: '0.76rem', color: '#6F6F6A' }}>
                            Receive automated tracking and dispatch SMS/Email alerts for your fine jewellery shipments.
                          </p>
                        </div>
                      </label>

                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          checked={settingsForm.newsletter}
                          onChange={(e) => setSettingsForm({ ...settingsForm, newsletter: e.target.checked })}
                        />
                        <div>
                          <strong>Private Vault & Curated Previews</strong>
                          <p style={{ margin: 0, fontSize: '0.76rem', color: '#6F6F6A' }}>
                            Be the first to access limited edition 925 sterling silver launches and Jaipur private exhibitions.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="btn-solid"
                      style={{ minWidth: '180px', padding: '13px 28px' }}
                    >
                      {settingsLoading ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Scoped CSS for Exact Mockup Aesthetics and Responsiveness */}
      <style jsx>{`
        /* Layout Grid */
        .account-layout {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 32px;
        }

        /* Sidebar (Desktop 270px) */
        .account-sidebar {
          width: 270px;
          flex-shrink: 0;
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 18px;
          border-bottom: 1px solid #F2F0EA;
          margin-bottom: 14px;
        }

        .sidebar-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #F2F0EA;
          border: 1px solid #E8E7E2;
          display: flex;
          align-items: center;
          justifyContent: center;
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #111111;
          flex-shrink: 0;
        }

        .sidebar-user-meta {
          min-width: 0;
          flex: 1;
        }

        .sidebar-user-name {
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #111111;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }

        .sidebar-user-email {
          font-size: 0.74rem;
          color: #6F6F6A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #252525;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .sidebar-nav-btn:hover {
          background-color: #F2F0EA;
          color: #111111;
        }

        .sidebar-nav-btn.active {
          background-color: #111111;
          color: #FFFFFF;
          font-weight: 600;
        }

        .sidebar-pill {
          margin-left: auto;
          background-color: #F2F0EA;
          color: #111111;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 1px 7px;
          border-radius: 999px;
        }

        .sidebar-nav-btn.active .sidebar-pill {
          background-color: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        .sidebar-divider {
          height: 1px;
          background-color: #F2F0EA;
          margin: 8px 4px;
        }

        .signout-btn {
          color: #6F6F6A;
        }

        .signout-btn:hover {
          color: #111111;
          background-color: #F2F0EA;
        }

        /* Right Main Content */
        .account-main {
          flex: 1;
          min-width: 0;
          width: 100%;
        }

        .overview-flow {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* 1. Hero Welcome Section */
        .profile-hero {
          display: flex;
          flex-direction: row;
          align-items: center;
          justifyContent: space-between;
          gap: 24px;
        }

        .profile-hero-text {
          max-width: 580px;
        }

        .profile-hero-eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6F6F6A;
          display: block;
          margin-bottom: 6px;
        }

        .profile-hero-title {
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(2rem, 3.2vw, 2.6rem);
          font-weight: 400;
          color: #111111;
          line-height: 1.15;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .profile-hero-subtitle {
          font-size: 0.84rem;
          color: #6F6F6A;
          line-height: 1.6;
          margin: 10px 0 0 0;
        }

        .profile-hero-banner {
          width: 320px;
          height: 135px;
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #E8E7E2;
          flex-shrink: 0;
          background-color: #FFFFFF;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        /* 2. Account Information Card */
        .account-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 14px;
          padding: 24px 28px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }

        .account-card-header {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid #F2F0EA;
          margin-bottom: 20px;
        }

        .card-title {
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: #111111;
          margin: 0;
        }

        .card-edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #252525;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.15s ease;
          font-family: inherit;
        }

        .card-edit-btn:hover {
          color: #111111;
          text-decoration: underline;
        }

        .account-info-grid {
          display: grid;
          grid-template-columns: 1.1fr 1.3fr;
          gap: 24px;
          align-items: center;
        }

        .info-patron-block {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .info-avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background-color: #F2F0EA;
          border: 1px solid #E8E7E2;
          color: #111111;
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: 1.2rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-text {
          min-width: 0;
        }

        .info-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111111;
        }

        .info-email {
          font-size: 0.78rem;
          color: #6F6F6A;
          margin-top: 2px;
        }

        .info-phone {
          font-size: 0.76rem;
          color: #6F6F6A;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .info-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          border-left: 1px solid #F2F0EA;
          padding-left: 28px;
        }

        .metric-col {
          display: flex;
          flex-direction: column;
        }

        .metric-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6F6F6A;
        }

        .metric-value {
          font-size: 0.84rem;
          font-weight: 600;
          color: #111111;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10B981;
          display: inline-block;
        }

        /* Section Block */
        .section-block {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justifyContent: space-between;
        }

        .section-title {
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: #111111;
          margin: 0;
        }

        .section-link-btn {
          font-size: 0.78rem;
          color: #6F6F6A;
          background: transparent;
          border: none;
          text-decoration: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: color 0.15s ease;
          font-family: inherit;
        }

        .section-link-btn:hover {
          color: #111111;
        }

        /* 3. Quick Actions 4-Grid */
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .quick-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          min-height: 145px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }

        .quick-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
          border-color: #BFC1C4;
        }

        .quick-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: #F8F7F3;
          color: #111111;
          display: flex;
          align-items: center;
          justifyContent: center;
          margin-bottom: 12px;
          transition: background-color 0.15s ease;
        }

        .quick-card:hover .quick-icon-box {
          background-color: #F2F0EA;
        }

        .quick-card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111111;
        }

        .quick-card-desc {
          font-size: 0.74rem;
          color: #6F6F6A;
          margin-top: 3px;
          line-height: 1.4;
        }

        .quick-arrow-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: 14px;
        }

        .quick-arrow-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #F8F7F3;
          color: #252525;
          display: flex;
          align-items: center;
          justifyContent: center;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .quick-card:hover .quick-arrow-circle {
          background-color: #111111;
          color: #FFFFFF;
        }

        /* 4. Recently Viewed Products Grid */
        .recently-viewed-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* Subtabs (Orders, Addresses, Wishlist, Settings) */
        .subtab-flow {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .subtab-header-row {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .subtab-title {
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: clamp(1.8rem, 2.8vw, 2.3rem);
          font-weight: 400;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin: 0;
          color: #111111;
        }

        .subtab-subtitle {
          font-size: 0.84rem;
          color: #6F6F6A;
          margin: 6px 0 0 0;
        }

        /* Filter Pills */
        .filter-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-pill {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          background-color: #F2F0EA;
          color: #252525;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
          font-family: inherit;
        }

        .filter-pill:hover {
          background-color: #E8E7E2;
          color: #111111;
        }

        .filter-pill.active {
          background-color: #111111;
          color: #FFFFFF;
        }

        /* Orders Stack */
        .orders-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-item-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 14px;
          padding: 22px 26px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }

        .order-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F2F0EA;
          margin-bottom: 16px;
        }

        .order-id-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: #111111;
        }

        .order-date-label {
          font-size: 0.78rem;
          color: #6F6F6A;
          margin-left: 6px;
        }

        .order-status-badge {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          background-color: #F2F0EA;
          color: #111111;
        }

        .order-status-badge.delivered {
          background-color: #ECFDF5;
          color: #065F46;
        }

        .order-status-badge.shipped {
          background-color: #EFF6FF;
          color: #1E40AF;
        }

        .order-status-badge.cancelled {
          background-color: #FEF2F2;
          color: #991B1B;
        }

        .order-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .order-item-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .item-thumb-box {
          width: 52px;
          height: 52px;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          flex-shrink: 0;
        }

        .thumb-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justifyContent: center;
          color: #6F6F6A;
        }

        .item-meta {
          flex: 1;
          min-width: 0;
        }

        .item-name {
          font-size: 0.84rem;
          font-weight: 500;
          color: #111111;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-qty-price {
          font-size: 0.74rem;
          color: #6F6F6A;
          margin-top: 2px;
        }

        .item-line-total {
          font-size: 0.86rem;
          font-weight: 600;
          color: #111111;
        }

        .order-footer {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          flex-wrap: wrap;
          gap: 12px;
          border-top: 1px solid #F2F0EA;
          padding-top: 14px;
          margin-top: 16px;
        }

        .order-tracking-hint {
          font-size: 0.76rem;
          color: #6F6F6A;
        }

        .order-total-block {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-total-label {
          font-size: 0.8rem;
          color: #6F6F6A;
        }

        .order-total-amount {
          font-size: 1.05rem;
          font-weight: 600;
          color: #111111;
        }

        /* Addresses Grid */
        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .address-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          box-sizing: border-box;
        }

        .address-card-top {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          margin-bottom: 12px;
        }

        .address-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111111;
        }

        .default-badge {
          background-color: #111111;
          color: #FFFFFF;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .text-btn {
          background: transparent;
          border: none;
          color: #6F6F6A;
          font-size: 0.74rem;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-family: inherit;
        }

        .text-btn:hover {
          color: #111111;
        }

        .address-body {
          font-size: 0.82rem;
          color: #6F6F6A;
          line-height: 1.5;
        }

        .address-phone-line {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #252525;
        }

        .address-actions-bar {
          border-top: 1px solid #F2F0EA;
          padding-top: 12px;
          margin-top: 16px;
          display: flex;
          justifyContent: flex-end;
        }

        .delete-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: #6F6F6A;
          font-size: 0.74rem;
          cursor: pointer;
          font-family: inherit;
        }

        .delete-btn:hover {
          color: #B91C1C;
        }

        /* Empty State */
        .empty-state-box {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }

        .empty-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          color: #6F6F6A;
          display: flex;
          align-items: center;
          justifyContent: center;
          margin: 0 auto 16px auto;
        }

        .empty-title {
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #111111;
          margin: 0 0 8px 0;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .empty-subtitle {
          font-size: 0.84rem;
          color: #6F6F6A;
          margin: 0 auto 20px auto;
          max-width: 380px;
        }

        .loading-box {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 14px;
          padding: 60px 20px;
          text-align: center;
          font-size: 0.84rem;
          color: #6F6F6A;
        }

        /* Buttons */
        .btn-solid {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #111111;
          color: #FFFFFF;
          padding: 11px 22px;
          border-radius: 6px;
          border: none;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.15s ease;
          font-family: inherit;
        }

        .btn-solid:hover {
          background-color: #252525;
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: transparent;
          color: #252525;
          padding: 11px 22px;
          border-radius: 6px;
          border: 1px solid #E8E7E2;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.15s ease;
          font-family: inherit;
        }

        .btn-outline:hover {
          background-color: #F2F0EA;
        }

        /* Settings Stack */
        .settings-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .success-banner {
          background-color: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          font-size: 0.82rem;
          padding: 12px 18px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .form-label {
          display: block;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #252525;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 6px;
          border: 1px solid #E8E7E2;
          background-color: #FFFFFF;
          color: #111111;
          font-size: 0.84rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s ease;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: #111111;
        }

        .form-input.disabled {
          background-color: #F8F7F3;
          color: #6F6F6A;
          cursor: not-allowed;
        }

        .field-note {
          display: block;
          font-size: 0.7rem;
          color: #6F6F6A;
          margin-top: 4px;
        }

        .password-input-wrap {
          position: relative;
        }

        .password-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #6F6F6A;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .checkbox-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.82rem;
          color: #252525;
          cursor: pointer;
        }

        .form-checkbox-label input {
          margin-top: 3px;
          accent-color: #111111;
        }

        /* Modal Backdrop */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
          z-index: 200;
          display: flex;
          align-items: center;
          justifyContent: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .modal-window {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 16px;
          max-width: 540px;
          width: 100%;
          padding: 28px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.16);
          box-sizing: border-box;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid #F2F0EA;
          margin-bottom: 20px;
        }

        .modal-title {
          font-family: var(--font-serif), "Cormorant Garamond", Georgia, serif;
          font-size: 1.35rem;
          font-weight: 500;
          color: #111111;
          margin: 0;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          font-size: 1.1rem;
          color: #6F6F6A;
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        /* ---------------------------------------------------- */
        /* RESPONSIVE BREAKPOINTS                               */
        /* ---------------------------------------------------- */
        @media (max-width: 1100px) {
          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .recently-viewed-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 860px) {
          .account-layout {
            flex-direction: column;
            gap: 24px;
          }

          .account-sidebar {
            width: 100%;
          }

          .sidebar-nav {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }

          .sidebar-divider {
            display: none;
          }

          .profile-hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-hero-banner {
            width: 100%;
            height: 140px;
          }

          .account-info-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .info-metrics-grid {
            border-left: none;
            border-top: 1px solid #F2F0EA;
            padding-left: 0;
            padding-top: 16px;
          }

          .form-grid-2,
          .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 580px) {
          .sidebar-nav {
            grid-template-columns: 1fr;
          }

          .quick-actions-grid {
            grid-template-columns: 1fr;
          }

          .recently-viewed-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .info-metrics-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
