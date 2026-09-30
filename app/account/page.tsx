'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Package, MapPin, Heart, LogOut, CheckCircle2, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/api';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Mock logged-in user details
  const user = {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    memberSince: 'October 2025'
  };

  // Mock orders with timeline
  const mockOrders = [
    {
      id: 'MK-842910',
      date: 'September 24, 2026',
      status: 'Shipped',
      total: 4798,
      items: [
        {
          name: 'Floral Silver Earrings',
          purity: '925 Sterling Silver',
          price: 2499,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=400&auto=format&fit=crop'
        },
        {
          name: 'Pearl Blossom Necklace',
          purity: '925 Sterling Silver',
          price: 2299,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=400&auto=format&fit=crop'
        }
      ],
      steps: [
        { label: 'Confirmed', done: true, time: '24 Sep, 10:30 AM' },
        { label: 'Packed', done: true, time: '24 Sep, 04:15 PM' },
        { label: 'Shipped', done: true, current: true, time: '25 Sep, 09:00 AM' },
        { label: 'Out for Delivery', done: false, time: 'Expected 29 Sep' },
        { label: 'Delivered', done: false, time: 'Pending' }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '40px 0 100px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <span className="eyebrow">PATRON PORTAL</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: 'var(--color-espresso)', marginBottom: '6px' }}>
            My Account
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-muted-text)' }}>
            Welcome back, {user.name}. Manage your jewellery orders, saved addresses, and concierge inquiries.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px' }} className="account-grid">
          {/* Left: Navigation Menu */}
          <aside>
            <div
              style={{
                backgroundColor: 'var(--bg-cream)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: activeTab === 'orders' ? 'var(--color-espresso)' : 'transparent',
                  color: activeTab === 'orders' ? '#FFFFFF' : 'var(--color-espresso)',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <Package size={18} />
                <span>Orders & Timeline</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: activeTab === 'profile' ? 'var(--color-espresso)' : 'transparent',
                  color: activeTab === 'profile' ? '#FFFFFF' : 'var(--color-espresso)',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <User size={18} />
                <span>Profile Details</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: activeTab === 'addresses' ? 'var(--color-espresso)' : 'transparent',
                  color: activeTab === 'addresses' ? '#FFFFFF' : 'var(--color-espresso)',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <MapPin size={18} />
                <span>Saved Addresses</span>
              </button>

              <Link
                href="/wishlist"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--color-espresso)'
                }}
              >
                <Heart size={18} />
                <span>My Wishlist</span>
              </Link>
            </div>
          </aside>

          {/* Right: Tab Content */}
          <div style={{ backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-editorial)', border: '1px solid var(--color-border)', padding: '32px' }}>
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '24px' }}>
                  Recent Orders & Live Shipment Timeline
                </h2>

                {mockOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-card)',
                      padding: '24px',
                      backgroundColor: '#FFFFFF',
                      marginBottom: '24px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>Order Number</span>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-espresso)' }}>{order.id}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>Date Placed</span>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.date}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>Total Paid</span>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-champagne)' }}>{formatPrice(order.total)}</div>
                      </div>
                      <span
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: '#E8F5E9',
                          color: '#2E7D32',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          letterSpacing: '0.05em'
                        }}
                      >
                        IN TRANSIT ({order.status})
                      </span>
                    </div>

                    {/* Timeline */}
                    <div style={{ marginBottom: '28px', padding: '16px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        {order.steps.map((st, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 2, flex: 1 }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: st.done ? 'var(--color-success)' : st.current ? 'var(--color-champagne)' : '#E0DCD5',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              {st.done ? '✓' : i + 1}
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-espresso)' }}>{st.label}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-muted-text)', marginTop: '2px' }}>{st.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ position: 'relative', width: '60px', height: '70px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F0ECE6' }}>
                            <Image src={item.image} alt={item.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>{item.purity} • Qty: {item.quantity}</div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{formatPrice(item.price)}</div>
                        </div>
                      ))}
                    </div>

                    {/* Support Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                      <a
                        href={`https://wa.me/917425058118?text=${encodeURIComponent(
                          `Hi MK Silver Hub, I need an update regarding my order ${order.id}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#128C7E', fontSize: '0.85rem', fontWeight: 600 }}
                      >
                        <MessageCircle size={16} />
                        <span>Chat on WhatsApp regarding Order</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '20px' }}>
                  Profile Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Member Status</label>
                    <input type="text" readOnly defaultValue="Patron Club Member (BIS Guaranteed)" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', color: 'var(--color-champagne)', fontWeight: 600 }} />
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
                    Priya Sharma<br />
                    Flat 402, Royal Palms, C-Scheme<br />
                    Jaipur, Rajasthan 302001<br />
                    Phone: +91 98765 43210
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
