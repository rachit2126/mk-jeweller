'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Truck, Clock, ShieldCheck } from 'lucide-react';
import { DbOrder } from '@/lib/db/types';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<string>('');
  const [timelineNote, setTimelineNote] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${resolvedParams.id}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        setNewStatus(data.order.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [resolvedParams.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          timelineNote: timelineNote || `Status updated to ${newStatus}`,
        }),
      });

      if (res.ok) {
        showToast(`Order status updated to ${newStatus}`);
        setTimelineNote('');
        fetchOrder();
      }
    } catch {
      showToast('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#806D68' }}>Loading order details...</div>;
  }

  if (!order) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#C53030' }}>Order not found.</div>;
  }

  return (
    <div className="order-detail-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="order-header-row">
        <div className="header-left">
          <Link href="/admin/orders" className="back-btn" title="Back to orders">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="order-title">Order {order.id}</h1>
            <span className="order-date-label">Placed on {order.date}</span>
          </div>
        </div>

        <div className="status-badge-wrap">
          <span className={`status-pill ${order.status}`}>
            {order.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="order-grid">
        {/* Left: Items & Financial Breakdown */}
        <div className="order-left-col">
          {/* Items Card */}
          <div className="content-card">
            <h2 className="card-heading">Ordered Items ({order.items?.length || 0})</h2>
            <div className="items-list">
              {order.items?.map((item, i) => (
                <div key={i} className="item-row">
                  <div className="item-thumb-box">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="thumb-img" />
                  </div>
                  <div className="item-details-col">
                    <span className="item-name">{item.name}</span>
                    <span className="item-meta">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</span>
                  </div>
                  <strong className="item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="financials-strip">
              <div className="fin-row">
                <span>Subtotal:</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="fin-row">
                <span>GST (3% Silver Jewellery):</span>
                <span>₹{order.tax?.toLocaleString('en-IN')}</span>
              </div>
              <div className="fin-row">
                <span>Insured Shipping:</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="fin-row total">
                <span>Total Paid:</span>
                <strong>₹{order.amount?.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="content-card" style={{ marginTop: '16px' }}>
            <h2 className="card-heading">Order Timeline & Tracking</h2>
            <div className="timeline-list">
              {order.timeline?.map((t, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-top">
                      <strong className="timeline-status">{t.status}</strong>
                      <span className="timeline-time">{t.timestamp}</span>
                    </div>
                    <p className="timeline-note">{t.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Customer & Fulfillment Status Control */}
        <div className="order-right-col">
          {/* Status Update Card */}
          <div className="content-card">
            <h2 className="card-heading">Update Order Status</h2>
            <div className="status-form">
              <label className="field-label">Fulfillment Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing (In Workshop)</option>
                <option value="shipped">Shipped (In Transit)</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled & Refunded</option>
              </select>

              <label className="field-label">Timeline Note</label>
              <input
                type="text"
                value={timelineNote}
                onChange={(e) => setTimelineNote(e.target.value)}
                placeholder="e.g. Dispatched via BlueDart AWB #8491203"
                className="status-input"
              />

              <button
                type="button"
                disabled={saving}
                onClick={handleUpdateStatus}
                className="btn-update-status"
              >
                {saving ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="content-card" style={{ marginTop: '16px' }}>
            <h2 className="card-heading">Customer Information</h2>
            <div className="customer-info-box">
              <span className="cust-name-large">{order.customerName}</span>
              <span className="cust-email-link">{order.email}</span>
              <span className="cust-phone-link">{order.phone}</span>

              <div className="shipping-address-box">
                <span className="address-header">Shipping Address</span>
                <p className="address-text">
                  {order.shippingAddress?.addressLine}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                  {order.shippingAddress?.country}
                </p>
              </div>

              <div className="payment-box">
                <span className="address-header">Payment Method</span>
                <span className="payment-method-text">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-detail-page { display: flex; flex-direction: column; gap: 18px; }
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #2F855A; color: #FFF; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; }
        .order-header-row { display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; padding: 16px 22px; border-radius: 16px; border: 1px solid #EAE2DB; }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .back-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid #E8D8D0; background: #FFF9F3; display: flex; align-items: center; justify-content: center; color: #342727; text-decoration: none; }
        .order-title { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600; margin: 0; color: #342727; line-height: 1.1; }
        .order-date-label { font-size: 0.78rem; color: #806D68; }
        .status-pill { padding: 4px 12px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; }
        .status-pill.delivered { background-color: #E6FFFA; color: #234E52; }
        .status-pill.shipped { background-color: #EBF8FF; color: #2B6CB0; }
        .status-pill.processing { background-color: #FEFCBF; color: #744210; }
        .status-pill.cancelled { background-color: #FFF5F5; color: #9B2C2C; }
        .order-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 18px; }
        .content-card { background: #FFFFFF; border: 1px solid #EAE2DB; border-radius: 18px; padding: 20px; box-shadow: 0 4px 16px rgba(59, 43, 43, 0.02); }
        .card-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 600; color: #342727; margin: 0 0 14px 0; }
        .items-list { display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid #F0E8E2; padding-bottom: 14px; }
        .item-row { display: flex; align-items: center; gap: 12px; }
        .item-thumb-box { width: 48px; height: 48px; border-radius: 8px; overflow: hidden; border: 1px solid #E8D8D0; flex-shrink: 0; }
        :global(.thumb-img) { object-fit: cover; }
        .item-details-col { flex: 1; display: flex; flex-direction: column; }
        .item-name { font-weight: 600; font-size: 0.88rem; color: #342727; }
        .item-meta { font-size: 0.76rem; color: #806D68; }
        .item-total { font-size: 0.9rem; color: #342727; }
        .financials-strip { display: flex; flex-direction: column; gap: 8px; padding-top: 14px; }
        .fin-row { display: flex; justify-content: space-between; font-size: 0.84rem; color: #6F5A58; }
        .fin-row.total { font-size: 1rem; color: #342727; border-top: 1px solid #F0E8E2; padding-top: 8px; margin-top: 4px; }
        .timeline-list { display: flex; flex-direction: column; gap: 16px; position: relative; padding-left: 14px; }
        .timeline-list::before { content: ''; position: absolute; top: 6px; bottom: 6px; left: 4px; width: 2px; background: #EAE2DB; }
        .timeline-item { position: relative; display: flex; flex-direction: column; gap: 2px; }
        .timeline-dot { position: absolute; left: -14px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #B76E79; border: 2px solid #FFFFFF; }
        .timeline-top { display: flex; justify-content: space-between; font-size: 0.82rem; }
        .timeline-status { color: #342727; }
        .timeline-time { color: #806D68; font-size: 0.74rem; }
        .timeline-note { margin: 2px 0 0 0; font-size: 0.78rem; color: #6F5A58; }
        .status-form { display: flex; flex-direction: column; gap: 10px; }
        .field-label { font-size: 0.76rem; font-weight: 600; color: #342727; }
        .status-select, .status-input { background: #FFF9F3; border: 1px solid #E8D8D0; border-radius: 8px; padding: 8px 12px; font-size: 0.86rem; outline: none; }
        .btn-update-status { margin-top: 6px; background-color: #B76E79; color: #FFF; border: none; padding: 9px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-update-status:hover { background-color: #9C5762; }
        .customer-info-box { display: flex; flex-direction: column; gap: 6px; }
        .cust-name-large { font-weight: 600; font-size: 1rem; color: #342727; }
        .cust-email-link, .cust-phone-link { font-size: 0.84rem; color: #6F5A58; }
        .shipping-address-box, .payment-box { margin-top: 10px; padding-top: 10px; border-top: 1px solid #F0E8E2; }
        .address-header { font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: #806D68; display: block; margin-bottom: 4px; }
        .address-text, .payment-method-text { font-size: 0.84rem; color: #342727; line-height: 1.5; margin: 0; }
        @media (max-width: 1024px) { .order-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
