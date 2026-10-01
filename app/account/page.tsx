'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut, CheckCircle2, Clock, MessageCircle, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setSession(data.user);
          // Fetch authenticated patron's real MongoDB orders
          fetch('/api/orders/my-orders')
            .then(r => r.json())
            .then(ordData => {
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
    memberSince: session?.createdAt ? new Date(session.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'September 2026',
    role: session?.role || 'USER',
  };

  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'manager';

  const getOrderSteps = (status: string = 'processing') => {
    const s = status.toLowerCase();
    const isDelivered = s === 'delivered';
    const isShipped = isDelivered || s === 'shipped';
    const isPacked = isShipped || s === 'packed';
    const isConfirmed = isPacked || s === 'processing' || s === 'confirmed' || s === 'paid';

    return [
      { label: 'Confirmed', done: isConfirmed, current: s === 'processing' || s === 'confirmed', time: 'Order verified' },
      { label: 'Packed', done: isPacked, current: s === 'packed', time: isPacked ? 'Jaipur Atelier' : 'In preparation' },
      { label: 'Shipped', done: isShipped, current: s === 'shipped', time: isShipped ? 'In transit' : 'Pending dispatch' },
      { label: 'Out for Delivery', done: isDelivered, current: s === 'out_for_delivery', time: isDelivered ? 'Completed' : 'Expected soon' },
      { label: 'Delivered', done: isDelivered, current: isDelivered, time: isDelivered ? 'Handed over' : 'Pending' },
    ];
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '0.9rem', fontFamily: 'var(--font-ui)' }}>
          Loading patron account...
        </p>
      </div>
    );
  }

  // If not logged in, show luxury invitation to sign in
  if (!session) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '80px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '460px', width: '100%', background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 12px 40px rgba(52,39,39,0.06)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFE8DE 0%, #F6D6D9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid #D9B98A' }}>
            <User size={24} color="#B76E79" />
          </div>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.16em', fontWeight: 600, color: 'var(--color-rose)' }}>MK SILVER HUB</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-espresso)', margin: '8px 0 10px' }}>Patron Portal</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-muted-text)', lineHeight: 1.5, marginBottom: '24px' }}>
            Sign in with your registered customer or administrative account to view orders, jewelry care records, and saved addresses.
          </p>
          <Link
            href="/login?redirect=/account"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '13px', backgroundColor: 'var(--color-rose)', color: '#FFFFFF', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 14px rgba(183,110,121,0.25)' }}
          >
            <span>Sign In to Your Account</span>
            <ArrowRight size={16} />
          </Link>
          <div style={{ marginTop: '16px', fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
            New patron?{' '}
            <Link href="/register" style={{ color: 'var(--color-rose)', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '40px 0 100px' }}>
      <div className="container">
        {/* Admin Quick Switch Notice if user is an Administrator */}
        {isAdmin && (
          <div style={{ backgroundColor: '#FFF5F0', border: '1px solid #F0D9D0', borderRadius: '14px', padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={18} color="#B76E79" />
              <span style={{ fontSize: '0.86rem', color: '#4A3B39', fontWeight: 500 }}>
                You are currently signed in with an <strong>{user.role}</strong> account.
              </span>
            </div>
            <Link
              href="/admin"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#B76E79', textDecoration: 'none', backgroundColor: '#FFFFFF', padding: '6px 14px', borderRadius: '8px', border: '1px solid #E5DCD5' }}
            >
              <span>Go to Admin Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <span className="eyebrow">PATRON PORTAL</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: 'var(--color-espresso)', marginBottom: '6px' }}>
            Namaste, {user.name}
          </h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem' }}>
            {user.email} • {isAdmin ? 'Administrator Privilege' : 'Patron Member'}
          </p>
        </div>

        {/* Account Dashboard Layout */}
        <div className="account-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Sidebar Nav */}
          <aside style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--color-border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'orders' ? 'var(--color-secondary)' : 'transparent',
                color: activeTab === 'orders' ? 'var(--color-espresso)' : 'var(--color-muted-text)',
                fontWeight: activeTab === 'orders' ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <Package size={18} />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'profile' ? 'var(--color-secondary)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--color-espresso)' : 'var(--color-muted-text)',
                fontWeight: activeTab === 'profile' ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <User size={18} />
              <span>Patron Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'addresses' ? 'var(--color-secondary)' : 'transparent',
                color: activeTab === 'addresses' ? 'var(--color-espresso)' : 'var(--color-muted-text)',
                fontWeight: activeTab === 'addresses' ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <MapPin size={18} />
              <span>Saved Addresses</span>
            </button>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />

            <Link
              href="/wishlist"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: 'var(--color-muted-text)',
                fontWeight: 500,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <Heart size={18} />
              <span>My Wishlist</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-rose)',
                fontWeight: 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </aside>

          {/* Main Content Pane */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--color-border)', padding: 'clamp(20px, 3vw, 36px)' }}>
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '20px' }}>
                  Order History & Live Tracking
                </h2>

                {ordersLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted-text)' }}>
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--bg-main)', borderRadius: '16px' }}>
                    <Package size={40} color="#B76E79" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
                      No Orders Placed Yet
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--color-muted-text)', maxWidth: '380px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                      When you purchase our authentic 925 sterling silver hallmarked heirlooms, your order history and live dispatch tracking will appear here.
                    </p>
                    <Link
                      href="/shop"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '11px 22px',
                        backgroundColor: 'var(--color-rose)',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <span>Explore Collections</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {orders.map((order) => {
                      const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent';
                      const items = order.items || [];
                      const steps = getOrderSteps(order.orderStatus || order.status);

                      return (
                        <div key={order.id} style={{ border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <strong style={{ fontSize: '1rem', color: 'var(--color-espresso)' }}>Order #{order.orderNumber || order.id}</strong>
                              <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', margin: '2px 0 0' }}>Placed on {orderDate}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.78rem', backgroundColor: '#EBF5FF', color: '#1E40AF', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                                {order.orderStatus || order.status || 'Processing'}
                              </span>
                              <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0 0' }}>{formatPrice(order.totalAmount || order.total || 0)}</p>
                            </div>
                          </div>

                          {/* Items */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {items.map((item: any, i: number) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-main)', flexShrink: 0 }}>
                                  <Image src={item.image || '/images/collection-necklaces.jpg'} alt={item.name || 'Silver Jewelry'} fill style={{ objectFit: 'cover' }} sizes="56px" />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>{item.name}</h4>
                                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)', margin: '2px 0 0' }}>
                                    {item.purity || '925 Sterling Silver'} • Qty: {item.quantity || 1}
                                  </p>
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatPrice(item.price || 0)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Timeline */}
                          <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', paddingBottom: '8px' }}>
                              {steps.map((st, sIdx) => (
                                <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: '80px', flex: 1 }}>
                                  <div style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    backgroundColor: st.done ? 'var(--color-rose)' : '#EAE2DB',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    marginBottom: '6px',
                                    border: st.current ? '2px solid var(--color-champagne)' : 'none'
                                  }}>
                                    {st.done ? '✓' : ''}
                                  </div>
                                  <span style={{ fontSize: '0.72rem', fontWeight: st.current ? 700 : 500, color: st.done ? 'var(--color-espresso)' : 'var(--color-muted-text)' }}>
                                    {st.label}
                                  </span>
                                  <span style={{ fontSize: '0.66rem', color: 'var(--color-muted-text)', marginTop: '2px' }}>
                                    {st.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '20px' }}>
                  Patron Details
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <input type="text" readOnly defaultValue={user.name} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email</label>
                    <input type="email" readOnly defaultValue={user.email} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Phone</label>
                    <input type="tel" readOnly defaultValue={user.phone} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Access Level</label>
                    <input type="text" readOnly defaultValue={isAdmin ? 'Administrator (Store Staff)' : 'Verified Customer (BIS Hallmark)'} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', color: 'var(--color-rose)', fontWeight: 600 }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '20px' }}>
                  Saved Delivery Addresses
                </h2>
                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', maxWidth: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Primary Residence</strong>
                    <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(201,163,90,0.15)', color: 'var(--color-champagne)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>DEFAULT</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', lineHeight: 1.5 }}>
                    {user.name}<br />
                    14/B, Lotus Boulevard, Civil Lines<br />
                    Jaipur, Rajasthan 302006<br />
                    Phone: {user.phone}
                  </p>
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
