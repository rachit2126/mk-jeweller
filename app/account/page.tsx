'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/format';

type Tab = 'orders' | 'profile' | 'addresses' | 'settings';
type OrderStatusFilter = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSession(data.user);
          // Fetch real customer orders from MongoDB
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
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
    router.push('/login');
  };

  const user = {
    name: session?.name || 'Patron',
    email: session?.email || '',
    phone: session?.phone || 'Not provided',
    role: session?.role || 'USER',
  };

  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'manager';

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#6F6F6A', fontSize: '0.85rem', fontFamily: 'var(--font-ui), "Jost", sans-serif' }}>
          Loading your patron profile...
        </p>
      </div>
    );
  }

  // Not signed in
  if (!session) {
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          minHeight: '80vh',
          padding: '80px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: '#F8F7F3',
            border: '1px solid #E8E7E2',
            padding: '44px 32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <User size={20} />
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#6F6F6A',
            }}
          >
            MK SILVER HUB
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: '2rem',
              color: '#111111',
              margin: '8px 0 12px',
            }}
          >
            Patron Account
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#6F6F6A', lineHeight: 1.55, marginBottom: '24px' }}>
            Sign in to review your order history, manage insured deliveries and access saved wishlist pieces.
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
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              marginBottom: '16px',
            }}
          >
            SIGN IN TO ACCOUNT
          </Link>
          <div style={{ fontSize: '0.8rem', color: '#6F6F6A' }}>
            New to MK Silver Hub?{' '}
            <Link href="/register" style={{ color: '#111111', fontWeight: 600, textDecoration: 'underline' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter orders by status tab
  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'all') return true;
    return (ord.status || 'processing').toLowerCase() === statusFilter;
  });

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        padding: '36px 0 100px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Admin Banner if applicable */}
        {isAdmin && (
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: '12px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#111111" />
              <span style={{ fontSize: '0.82rem', color: '#111111' }}>
                Signed in with <strong>{user.role}</strong> permissions.
              </span>
            </div>
            <Link
              href="/admin"
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#111111',
                padding: '6px 14px',
                textDecoration: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Go to Admin ERP
            </Link>
          </div>
        )}

        {/* 2-Column Split: Sidebar | Main Dashboard Panel (Mockup Screen 9) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px minmax(0, 1fr)',
            gap: 'clamp(28px, 4vw, 56px)',
            alignItems: 'start',
          }}
          className="account-grid"
        >
          {/* ======================================================= */}
          {/* LEFT: CUSTOMER SIDEBAR (Screen 9 in Mockup)             */}
          {/* ======================================================= */}
          <aside
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: '24px 0',
            }}
          >
            {/* Patron Mini Bio */}
            <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #E8E7E2', marginBottom: '12px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#111111',
                }}
              >
                {user.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6F6F6A' }}>{user.email}</div>
            </div>

            {/* Navigation Links List */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  backgroundColor: activeTab === 'orders' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'orders' ? '3px solid #111111' : '3px solid transparent',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: activeTab === 'orders' ? 600 : 500,
                  color: '#111111',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Package size={17} color="#111111" />
                <span>Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  backgroundColor: activeTab === 'profile' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'profile' ? '3px solid #111111' : '3px solid transparent',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: activeTab === 'profile' ? 600 : 500,
                  color: '#111111',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <User size={17} color="#111111" />
                <span>My Account</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  backgroundColor: activeTab === 'addresses' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'addresses' ? '3px solid #111111' : '3px solid transparent',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: activeTab === 'addresses' ? 600 : 500,
                  color: '#111111',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <MapPin size={17} color="#111111" />
                <span>Addresses</span>
              </button>

              <Link
                href="/wishlist"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: '#111111',
                  textDecoration: 'none',
                }}
              >
                <Heart size={17} color="#111111" />
                <span>Wishlist</span>
              </Link>

              <button
                onClick={() => setActiveTab('settings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  backgroundColor: activeTab === 'settings' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === 'settings' ? '3px solid #111111' : '3px solid transparent',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: activeTab === 'settings' ? 600 : 500,
                  color: '#111111',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Settings size={17} color="#111111" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: '#6F6F6A',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '12px',
                  borderTop: '1px solid #E8E7E2',
                  paddingTop: '16px',
                }}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* ======================================================= */}
          {/* RIGHT: MAIN ORDERS / CONTENT PANEL (Screen 9 in Mockup) */}
          {/* ======================================================= */}
          <div>
            {activeTab === 'orders' && (
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                    fontSize: '1.9rem',
                    fontWeight: 500,
                    color: '#111111',
                    margin: '0 0 16px',
                  }}
                >
                  My Orders
                </h1>

                {/* Status Tabs (All | Processing | Shipped | Delivered | Cancelled) */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    borderBottom: '1px solid #E8E7E2',
                    paddingBottom: '12px',
                    marginBottom: '24px',
                    overflowX: 'auto',
                  }}
                >
                  {(['all', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatusFilter[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      style={{
                        padding: '6px 14px',
                        border: 'none',
                        backgroundColor: statusFilter === tab ? '#111111' : '#F8F7F3',
                        color: statusFilter === tab ? '#FFFFFF' : '#6F6F6A',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                {ordersLoading ? (
                  <p style={{ color: '#6F6F6A', fontSize: '0.84rem' }}>Fetching patron orders from MongoDB...</p>
                ) : filteredOrders.length === 0 ? (
                  <div
                    style={{
                      padding: '48px 20px',
                      textAlign: 'center',
                      backgroundColor: '#F8F7F3',
                      border: '1px solid #E8E7E2',
                    }}
                  >
                    <p style={{ color: '#6F6F6A', fontSize: '0.88rem', margin: '0 0 16px' }}>
                      No orders found in this category.
                    </p>
                    <Link
                      href="/shop"
                      style={{
                        padding: '10px 24px',
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                      }}
                    >
                      Browse Catalogue
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredOrders.map((ord) => {
                      const itemCount = ord.items?.length || 1;
                      const dateStr = ord.createdAt
                        ? new Date(ord.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recent';

                      const status = (ord.status || 'processing').toLowerCase();
                      const statusBg =
                        status === 'delivered' ? '#E8F5E9' : status === 'shipped' ? '#E3F2FD' : '#FFF3E0';
                      const statusColor =
                        status === 'delivered' ? '#2E7D32' : status === 'shipped' ? '#1565C0' : '#E65100';

                      return (
                        <div
                          key={ord.id || ord._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '18px 24px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E8E7E2',
                            flexWrap: 'wrap',
                            gap: '16px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                backgroundColor: '#F8F7F3',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Package size={18} color="#111111" />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111111' }}>
                                #{ord.id || ord._id}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#6F6F6A' }}>{dateStr}</div>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: '#6F6F6A' }}>
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </div>

                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111111' }}>
                            {formatPrice(ord.amount || ord.total || 0)}
                          </div>

                          <div>
                            <span
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                backgroundColor: statusBg,
                                color: statusColor,
                              }}
                            >
                              {ord.status || 'Processing'}
                            </span>
                          </div>

                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#111111',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>View</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div style={{ backgroundColor: '#F8F7F3', padding: '32px', border: '1px solid #E8E7E2' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 20px' }}>
                  Patron Profile Details
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', fontSize: '0.85rem' }}>
                  <div>
                    <label style={{ color: '#6F6F6A', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Full Name</label>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                  </div>
                  <div>
                    <label style={{ color: '#6F6F6A', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Email Address</label>
                    <div style={{ fontWeight: 600 }}>{user.email}</div>
                  </div>
                  <div>
                    <label style={{ color: '#6F6F6A', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                    <div style={{ fontWeight: 600 }}>{user.phone}</div>
                  </div>
                  <div>
                    <label style={{ color: '#6F6F6A', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Account Purity Tier</label>
                    <div style={{ fontWeight: 600 }}>BIS 925 Hallmark Verified</div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div style={{ backgroundColor: '#F8F7F3', padding: '32px', border: '1px solid #E8E7E2' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 16px' }}>
                  Saved Delivery Addresses
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#6F6F6A', margin: '0 0 20px' }}>
                  Your primary shipping address is automatically saved during checkout for seamless reordering.
                </p>
                <div style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E8E7E2', maxWidth: '380px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', marginBottom: '4px' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6F6F6A', lineHeight: 1.5 }}>
                    Jaipur, Rajasthan, India
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div style={{ backgroundColor: '#F8F7F3', padding: '32px', border: '1px solid #E8E7E2' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 16px' }}>
                  Security & Settings
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#6F6F6A', marginBottom: '20px' }}>
                  Manage notifications and order communication preferences.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#111111' }} />
                    <span>Receive WhatsApp order tracking updates</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#111111' }} />
                    <span>Receive new 925 silver collection drops</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .account-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
