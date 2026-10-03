'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, CheckCircle2, X } from 'lucide-react';
import { DbCoupon } from '@/lib/db/types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<DbCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(1999);
  const [maxDiscount, setMaxDiscount] = useState<number>(1000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type, value, minOrder, maxDiscount }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to create coupon');
      } else {
        showToast(`Coupon "${code}" created!`);
        setModalOpen(false);
        setCode('');
        fetchCoupons();
      }
    } catch {
      showToast('Error creating coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Coupon deleted');
        fetchCoupons();
      }
    } catch {
      showToast('Error deleting coupon');
    }
  };

  return (
    <div className="admin-coupons-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Discount Coupons</h1>
          <p className="page-sub">Create promotional discount codes with usage limits, minimum cart rules, and expirations.</p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Coupon</span>
        </button>
      </div>

      <div className="coupons-table-card">
        <div className="table-responsive">
          <table className="coupons-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. Order</th>
                <th>Usage</th>
                <th>Validity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="empty-cell">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={7} className="empty-cell">No active coupons found.</td></tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="code-badge">{c.code}</span>
                    </td>
                    <td>
                      <span className="discount-val">
                        {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </span>
                    </td>
                    <td>
                      <span>₹{c.minOrder?.toLocaleString('en-IN')}</span>
                    </td>
                    <td>
                      <span>{c.usageCount} / {c.usageLimit} uses</span>
                    </td>
                    <td>
                      <span className="date-range">{c.startDate} to {c.endDate}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${c.status}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(c.id)} className="btn-delete" title="Delete coupon">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Coupon</h3>
              <button onClick={() => setModalOpen(false)} className="close-btn"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label className="field-label">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  className="form-input"
                />
              </div>

              <div className="fields-2">
                <div className="form-group">
                  <label className="field-label">Discount Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as any)} className="form-select">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="field-label">Value *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="fields-2">
                <div className="form-group">
                  <label className="field-label">Min. Order Amount (₹)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">Max. Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-coupons-page { display: flex; flex-direction: column; gap: 20px; }
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #111111; color: #FFF; padding: 10px 18px; border-radius: 8px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; border: 1px solid #252525; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .page-heading { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 1.5rem; font-weight: 700; color: #111111; margin: 0; letter-spacing: -0.02em; }
        .page-sub { font-size: 0.85rem; color: #6F6F6A; margin: 4px 0 0 0; }
        .btn-primary { display: inline-flex; align-items: center; gap: 6px; background-color: #111111; color: #FFFFFF; padding: 9px 18px; border-radius: 8px; border: 1px solid #111111; font-size: 0.86rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
        .btn-primary:hover { background-color: #252525; }
        .coupons-table-card { background: #FFFFFF; border: 1px solid #E8E7E2; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); }
        .table-responsive { overflow-x: auto; }
        .coupons-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .coupons-table th { text-align: left; padding: 12px 16px; background-color: #F8F7F3; font-size: 0.72rem; text-transform: uppercase; color: #6F6F6A; font-weight: 600; letter-spacing: 0.04em; border-bottom: 1px solid #E8E7E2; }
        .coupons-table td { padding: 14px 16px; border-bottom: 1px solid #F2F0EA; vertical-align: middle; color: #111111; }
        .code-badge { background-color: #F8F7F3; border: 1px dashed #BFC1C4; color: #111111; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-size: 0.82rem; letter-spacing: 0.05em; }
        .discount-val { font-weight: 600; }
        .date-range { font-size: 0.76rem; color: #6F6F6A; }
        .status-pill.active { background-color: #E6FFFA; color: #1E7E5E; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; }
        .btn-delete { background: none; border: 1px solid #E8E7E2; border-radius: 6px; padding: 6px; color: #6F6F6A; cursor: pointer; transition: all 0.15s ease; }
        .btn-delete:hover { color: #C0392B; border-color: #F8D7DA; background: #FFF5F5; }
        .empty-cell { text-align: center; padding: 40px !important; color: #6F6F6A; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 250; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { width: min(92%, 480px); background: #FFFFFF; border-radius: 12px; padding: 24px; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12); border: 1px solid #E8E7E2; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .modal-title { font-size: 1.15rem; font-weight: 700; color: #111111; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: #6F6F6A; }
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .fields-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: 0.76rem; font-weight: 600; color: #111111; }
        .form-input, .form-select { background: #F8F7F3; border: 1px solid #E8E7E2; border-radius: 6px; padding: 8px 12px; font-size: 0.86rem; color: #111111; outline: none; }
        .form-input:focus, .form-select:focus { border-color: #111111; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
        .btn-cancel { padding: 7px 14px; border-radius: 6px; border: 1px solid #E8E7E2; background: #FFF; color: #6F6F6A; cursor: pointer; }
        .btn-save { padding: 7px 16px; border-radius: 6px; border: 1px solid #111111; background: #111111; color: #FFF; font-weight: 600; cursor: pointer; }
        .btn-save:hover { background: #252525; }
      `}</style>
    </div>
  );
}
