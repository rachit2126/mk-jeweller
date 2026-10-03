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
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mk:order-updated'));
        }
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
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #111111; color: #FFF; padding: 10px 18px; border-radius: 8px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; border: 1px solid #252525; }
        .order-header-row { display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; padding: 16px 22px; border-radius: 12px; border: 1px solid #E8E7E2; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .back-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid #E8E7E2; background: #F8F7F3; display: flex; align-items: center; justify-content: center; color: #111111; text-decoration: none; transition: all 0.15s ease; }
        .back-btn:hover { background: #E8E7E2; }
        .order-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 1.35rem; font-weight: 700; margin: 0; color: #111111; line-height: 1.2; letter-spacing: -0.02em; }
        .order-date-label { font-size: 0.78rem; color: #6F6F6A; }
        .status-pill { padding: 4px 12px; border-radius: 6px; font-size: 0.74rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
        .status-pill.delivered { background-color: #E6FFFA; color: #1E7E5E; }
        .status-pill.shipped { background-color: #F8F7F3; color: #111111; border: 1px solid #D8D5CE; }
        .status-pill.processing { background-color: #FEFCBF; color: #744210; }
        .status-pill.cancelled { background-color: #FFF5F5; color: #C0392B; }
        .order-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 18px; }
        .content-card { background: #FFFFFF; border: 1px solid #E8E7E2; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); }
        .card-heading { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 1rem; font-weight: 700; color: #111111; margin: 0 0 14px 0; }
        .items-list { display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid #F2F0EA; padding-bottom: 14px; }
        .item-row { display: flex; align-items: center; gap: 12px; }
        .item-thumb-box { width: 48px; height: 48px; border-radius: 8px; overflow: hidden; border: 1px solid #E8E7E2; flex-shrink: 0; background: #F8F7F3; }
        :global(.thumb-img) { object-fit: cover; }
        .item-details-col { flex: 1; display: flex; flex-direction: column; }
        .item-name { font-weight: 600; font-size: 0.88rem; color: #111111; }
        .item-meta { font-size: 0.76rem; color: #6F6F6A; }
        .item-total { font-size: 0.9rem; color: #111111; font-weight: 600; }
        .financials-strip { display: flex; flex-direction: column; gap: 8px; padding-top: 14px; }
        .fin-row { display: flex; justify-content: space-between; font-size: 0.84rem; color: #6F6F6A; }
        .fin-row.total { font-size: 1rem; color: #111111; font-weight: 700; border-top: 1px solid #F2F0EA; padding-top: 8px; margin-top: 4px; }
        .timeline-list { display: flex; flex-direction: column; gap: 16px; position: relative; padding-left: 14px; }
        .timeline-list::before { content: ''; position: absolute; top: 6px; bottom: 6px; left: 4px; width: 2px; background: #E8E7E2; }
        .timeline-item { position: relative; display: flex; flex-direction: column; gap: 2px; }
        .timeline-dot { position: absolute; left: -14px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #111111; border: 2px solid #FFFFFF; box-shadow: 0 0 0 1px #E8E7E2; }
        .timeline-top { display: flex; justify-content: space-between; font-size: 0.82rem; }
        .timeline-status { color: #111111; font-weight: 600; }
        .timeline-time { color: #6F6F6A; font-size: 0.74rem; }
        .timeline-note { margin: 2px 0 0 0; font-size: 0.78rem; color: #6F6F6A; }
        .status-form { display: flex; flex-direction: column; gap: 10px; }
        .field-label { font-size: 0.76rem; font-weight: 600; color: #111111; }
        .status-select, .status-input { background: #F8F7F3; border: 1px solid #E8E7E2; border-radius: 6px; padding: 8px 12px; font-size: 0.86rem; color: #111111; outline: none; }
        .status-select:focus, .status-input:focus { border-color: #111111; }
        .btn-update-status { margin-top: 6px; background-color: #111111; color: #FFF; border: 1px solid #111111; padding: 9px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
        .btn-update-status:hover { background-color: #252525; }
        .customer-info-box { display: flex; flex-direction: column; gap: 6px; }
        .cust-name-large { font-weight: 600; font-size: 1rem; color: #111111; }
        .cust-email-link, .cust-phone-link { font-size: 0.84rem; color: #6F6F6A; }
        .shipping-address-box, .payment-box { margin-top: 10px; padding-top: 10px; border-top: 1px solid #F2F0EA; }
        .address-header { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #6F6F6A; letter-spacing: 0.04em; display: block; margin-bottom: 4px; }
        .address-text, .payment-method-text { font-size: 0.84rem; color: #111111; line-height: 1.5; margin: 0; }
        @media (max-width: 1024px) { .order-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
