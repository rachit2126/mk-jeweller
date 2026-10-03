'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Clock
} from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  createdAt?: string;
  ordersCount: number;
  totalSpend: number;
  addresses?: any[];
  orders?: any[];
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/customers/${encodeURIComponent(resolvedParams.id)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Customer not found');
        return res.json();
      })
      .then((data) => {
        if (data.customer) {
          setCustomer(data.customer);
        } else {
          setError('Customer not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Unable to load customer profile');
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="cust-detail-loading">
        <div className="skeleton-line" style={{ width: '200px', height: '32px' }} />
        <div className="skeleton-grid" />
        <style jsx>{`
          .cust-detail-loading { padding: 32px 0; display: flex; flex-direction: column; gap: 20px; }
          .skeleton-line { background: #F0EFEA; border-radius: 6px; animation: pulse 1.5s infinite; }
          .skeleton-grid { height: 300px; background: #FAF9F6; border: 1px solid #E8E7E2; border-radius: 12px; animation: pulse 1.5s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="cust-detail-error">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#111111' }}>Customer Not Found</h2>
        <p style={{ color: '#6F6F6A', fontSize: '0.88rem' }}>The requested customer record does not exist in the database.</p>
        <Link href="/admin/customers" className="btn-back">
          <ArrowLeft size={14} />
          <span>Back to Customers</span>
        </Link>
        <style jsx>{`
          .cust-detail-error { padding: 48px 0; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
          .btn-back { display: inline-flex; align-items: center; gap: 6px; background: #111111; color: #FFFFFF; padding: 9px 18px; border-radius: 8px; font-size: 0.84rem; text-decoration: none; margin-top: 12px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="customer-detail-flow">
      {/* 1. Header */}
      <div className="detail-header">
        <div className="header-left">
          <Link href="/admin/customers" className="back-link" title="Return to Customers">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="title-row">
              <h1 className="customer-name">{customer.name}</h1>
              <span className={`status-pill ${customer.status === 'inactive' ? 'inactive' : 'active'}`}>
                {(customer.status || 'Active').toUpperCase()}
              </span>
            </div>
            <span className="customer-id-tag">ID: {customer.id}</span>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-bubble">
            <CreditCard size={18} />
          </div>
          <div>
            <span className="kpi-label">Lifetime Spend</span>
            <div className="kpi-val">{formatPrice(customer.totalSpend || 0)}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-bubble">
            <ShoppingBag size={18} />
          </div>
          <div>
            <span className="kpi-label">Total Orders</span>
            <div className="kpi-val">{customer.ordersCount} {customer.ordersCount === 1 ? 'order' : 'orders'}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-bubble">
            <Calendar size={18} />
          </div>
          <div>
            <span className="kpi-label">Member Since</span>
            <div className="kpi-val">
              {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Split: Order History (Left) | Profile & Addresses (Right) */}
      <div className="detail-main-split">
        {/* Left: Orders */}
        <div className="detail-card orders-card">
          <h2 className="card-heading">Order History</h2>
          {(!customer.orders || customer.orders.length === 0) ? (
            <div className="empty-orders-box">
              <ShoppingBag size={32} strokeWidth={1.5} color="#A8A29E" />
              <p className="empty-title">No orders yet</p>
              <p className="empty-sub">This customer has not completed any purchases on the storefront yet.</p>
            </div>
          ) : (
            <div className="orders-table-wrap">
              <table className="orders-subtable">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAYMENT</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((order: any) => (
                    <tr key={order.id || order._id}>
                      <td>
                        <strong className="order-num-text">{order.orderNumber || order.id}</strong>
                      </td>
                      <td>
                        <span className="date-subtext">
                          {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recent')}
                        </span>
                      </td>
                      <td>
                        <strong className="order-amt-text">{formatPrice(order.amount || order.total || 0)}</strong>
                      </td>
                      <td>
                        <span className={`payment-pill ${(order.paymentStatus || 'paid').toLowerCase()}`}>
                          {(order.paymentStatus || 'paid').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${(order.status || 'processing').toLowerCase()}`}>
                          {(order.status || 'processing').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/admin/orders/${encodeURIComponent((order.id || order.orderNumber).replace('#', ''))}`}
                          className="btn-view-order"
                        >
                          <span>View Order</span>
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Contact & Identity Info */}
        <div className="detail-card info-card">
          <h2 className="card-heading">Contact & Details</h2>

          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-val">
                <Mail size={13} /> {customer.email}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-val">
                <Phone size={13} /> {customer.phone || 'Not provided'}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Customer ID</span>
              <span className="info-val monospace">{customer.id}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Account Verification</span>
              <span className="info-val verified">
                <ShieldCheck size={14} /> Verified Store Patron
              </span>
            </div>
          </div>

          <div className="address-section">
            <h3 className="section-subheading">Saved Addresses</h3>
            {(!customer.addresses || customer.addresses.length === 0) ? (
              <p className="no-address-text">No delivery addresses saved yet.</p>
            ) : (
              <div className="addresses-list">
                {customer.addresses.map((addr: any, idx: number) => (
                  <div key={addr.id || idx} className="address-box">
                    <span className="addr-tag">{addr.type?.toUpperCase() || 'HOME'}</span>
                    <p className="addr-text">
                      {addr.addressLine}<br />
                      {addr.city}, {addr.state} {addr.postalCode}<br />
                      {addr.country || 'India'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .customer-detail-flow { display: flex; flex-direction: column; gap: 24px; }
        .detail-header { display: flex; align-items: center; justify-content: space-between; }
        .header-left { display: flex; align-items: center; gap: 14px; }
        .back-link { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #E8E7E2; background: #FFFFFF; display: flex; align-items: center; justify-content: center; color: #111111; transition: background 0.15s ease; text-decoration: none; }
        .back-link:hover { background: #F8F7F3; }
        .title-row { display: flex; align-items: center; gap: 10px; }
        .customer-name { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.85rem; font-weight: 600; color: #111111; margin: 0; line-height: 1.2; }
        .customer-id-tag { font-family: var(--font-ui), monospace; font-size: 0.76rem; color: #6F6F6A; }

        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        .kpi-card { background: #FFFFFF; border: 1px solid #E8E7E2; border-radius: 12px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
        .kpi-icon-bubble { width: 42px; height: 42px; border-radius: 10px; background: #FAF9F6; border: 1px solid #E8E7E2; display: flex; align-items: center; justify-content: center; color: #111111; }
        .kpi-label { font-family: var(--font-ui), 'Jost', sans-serif; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6F6F6A; font-weight: 500; display: block; margin-bottom: 2px; }
        .kpi-val { font-family: var(--font-ui), 'Jost', sans-serif; font-size: 1.25rem; font-weight: 600; color: #111111; }

        .detail-main-split { display: grid; grid-template-columns: 2fr 1.2fr; gap: 20px; align-items: flex-start; }
        @media (max-width: 960px) { .detail-main-split { grid-template-columns: 1fr; } }

        .detail-card { background: #FFFFFF; border: 1px solid #E8E7E2; border-radius: 14px; padding: 22px 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .card-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: #111111; margin: 0 0 16px; border-bottom: 1px solid #F0EFEA; padding-bottom: 12px; }

        .empty-orders-box { text-align: center; padding: 36px 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .empty-title { font-family: var(--font-display), serif; font-size: 1.15rem; color: #111111; margin: 4px 0 0; }
        .empty-sub { font-size: 0.8rem; color: #6F6F6A; max-width: 260px; margin: 0; }

        .orders-table-wrap { overflow-x: auto; }
        .orders-subtable { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .orders-subtable th { text-align: left; padding: 10px 12px; font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase; color: #6F6F6A; background: #FAF9F6; border-bottom: 1px solid #E8E7E2; font-weight: 600; }
        .orders-subtable td { padding: 12px; border-bottom: 1px solid #F0EFEA; vertical-align: middle; color: #111111; }
        .order-num-text { font-family: var(--font-ui), monospace; font-size: 0.84rem; font-weight: 600; color: #111111; }
        .date-subtext { font-size: 0.78rem; color: #6F6F6A; }
        .order-amt-text { font-weight: 600; }

        .status-pill { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.04em; }
        .status-pill.active { background: #DCFCE7; color: #166534; }
        .status-pill.inactive { background: #F3F4F6; color: #4B5563; }
        .status-pill.processing { background: #FEF3C7; color: #92400E; }
        .status-pill.delivered { background: #DCFCE7; color: #166534; }
        .status-pill.cancelled { background: #FEE2E2; color: #991B1B; }
        .status-pill.shipped { background: #DBEAFE; color: #1E40AF; }

        .payment-pill { display: inline-flex; align-items: center; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 600; }
        .payment-pill.paid { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
        .payment-pill.pending { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
        .payment-pill.refunded { background: #F1F5F9; color: #475569; border: 1px solid #CBD5E1; }

        .btn-view-order { display: inline-flex; align-items: center; gap: 4px; font-size: 0.76rem; font-weight: 500; color: #111111; text-decoration: none; padding: 5px 10px; border-radius: 6px; border: 1px solid #E8E7E2; background: #FFFFFF; transition: background 0.15s ease; }
        .btn-view-order:hover { background: #FAF9F6; }

        .info-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
        .info-item { display: flex; flex-direction: column; gap: 4px; }
        .info-label { font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.04em; color: #6F6F6A; font-weight: 500; }
        .info-val { display: inline-flex; align-items: center; gap: 6px; font-size: 0.84rem; color: #111111; font-weight: 500; }
        .info-val.monospace { font-family: monospace; font-size: 0.8rem; color: #6F6F6A; }
        .info-val.verified { color: #166534; font-weight: 600; font-size: 0.8rem; }

        .address-section { border-top: 1px solid #F0EFEA; padding-top: 16px; }
        .section-subheading { font-family: var(--font-ui), 'Jost', sans-serif; font-size: 0.84rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6F6F6A; margin: 0 0 12px; font-weight: 600; }
        .no-address-text { font-size: 0.8rem; color: #6F6F6A; margin: 0; }
        .addresses-list { display: flex; flex-direction: column; gap: 10px; }
        .address-box { background: #FAF9F6; border: 1px solid #E8E7E2; border-radius: 8px; padding: 10px 12px; }
        .addr-tag { display: inline-block; font-size: 0.66rem; font-weight: 600; color: #6F6F6A; margin-bottom: 4px; }
        .addr-text { font-size: 0.78rem; color: #111111; line-height: 1.4; margin: 0; }
      `}</style>
    </div>
  );
}
