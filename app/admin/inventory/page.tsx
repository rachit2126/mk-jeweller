'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Edit2, AlertTriangle, CheckCircle2, History, X } from 'lucide-react';
import { DbInventoryRecord } from '@/lib/db/types';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<DbInventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustTarget, setAdjustTarget] = useState<DbInventoryRecord | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [reason, setReason] = useState('Manual Stock Count Verification');
  const [historyTarget, setHistoryTarget] = useState<DbInventoryRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      setInventory(data.inventory || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: adjustTarget.productId,
          newStock: Number(newStock),
          reason,
        }),
      });

      if (res.ok) {
        showToast(`Stock updated for "${adjustTarget.productName}"`);
        setAdjustTarget(null);
        fetchInventory();
      }
    } catch {
      showToast('Failed to adjust stock');
    }
  };

  return (
    <div className="admin-inventory-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Inventory & Stock Control</h1>
          <p className="page-sub">Manage product stock levels, thresholds, and audit stock adjustment history.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Image</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Current Stock</th>
                <th>Available</th>
                <th>Threshold</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="empty-cell">Loading inventory...</td></tr>
              ) : inventory.length === 0 ? (
                <tr><td colSpan={8} className="empty-cell">No inventory records found.</td></tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="thumb-box">
                        <Image src={item.productImage} alt={item.productName} width={38} height={38} className="thumb-img" />
                      </div>
                    </td>
                    <td>
                      <span className="prod-name">{item.productName}</span>
                    </td>
                    <td>
                      <span className="sku-text">{item.sku}</span>
                    </td>
                    <td>
                      <strong className="stock-number">{item.currentStock}</strong>
                    </td>
                    <td>
                      <span className="avail-number">{item.availableStock}</span>
                    </td>
                    <td>
                      <span className="thresh-text">{item.lowStockThreshold} units</span>
                    </td>
                    <td>
                      <span className={`status-pill ${item.status}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cell">
                        <button
                          onClick={() => {
                            setAdjustTarget(item);
                            setNewStock(item.currentStock);
                          }}
                          className="action-btn"
                          title="Adjust Stock"
                        >
                          <Edit2 size={14} />
                          <span>Adjust</span>
                        </button>
                        <button
                          onClick={() => setHistoryTarget(item)}
                          className="action-btn"
                          title="View History"
                        >
                          <History size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustTarget && (
        <div className="modal-backdrop" onClick={() => setAdjustTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Adjust Stock: {adjustTarget.productName}</h3>
              <button onClick={() => setAdjustTarget(null)} className="close-btn"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdjustSubmit} className="modal-form">
              <div className="form-group">
                <label className="field-label">Current Stock</label>
                <input type="text" disabled value={adjustTarget.currentStock} className="form-input disabled" />
              </div>
              <div className="form-group">
                <label className="field-label">New Stock Level *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="field-label">Reason for Adjustment *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="form-select"
                >
                  <option value="Physical Stock Count Verification">Physical Stock Count Verification</option>
                  <option value="New Workshop Batch Received">New Workshop Batch Received</option>
                  <option value="Damaged / Hallmarking Defect">Damaged / Hallmarking Defect</option>
                  <option value="Storefront Return Restocked">Storefront Return Restocked</option>
                  <option value="Marketing Sample Dispatch">Marketing Sample Dispatch</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setAdjustTarget(null)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Save Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Log Modal */}
      {historyTarget && (
        <div className="modal-backdrop" onClick={() => setHistoryTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Stock Audit Log: {historyTarget.productName}</h3>
              <button onClick={() => setHistoryTarget(null)} className="close-btn"><X size={18} /></button>
            </div>
            <div className="history-list">
              {historyTarget.history?.map((entry) => (
                <div key={entry.id} className="history-row">
                  <div className="hist-meta">
                    <span className="hist-date">{new Date(entry.timestamp).toLocaleString()}</span>
                    <span className="hist-admin">By {entry.admin}</span>
                  </div>
                  <div className="hist-change">
                    <span>Previous: {entry.previous}</span>
                    <span className="hist-arrow">→</span>
                    <span>New: <strong>{entry.new}</strong></span>
                    <span className={`diff-pill ${entry.change >= 0 ? 'pos' : 'neg'}`}>
                      {entry.change >= 0 ? `+${entry.change}` : entry.change}
                    </span>
                  </div>
                  <span className="hist-reason">&quot;{entry.reason}&quot;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-inventory-page { display: flex; flex-direction: column; gap: 20px; }
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #2F855A; color: #FFF; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .page-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: #342727; margin: 0; }
        .page-sub { font-size: 0.88rem; color: #806D68; margin: 4px 0 0 0; }
        .table-card { background: #FFFFFF; border: 1px solid #EAE2DB; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03); }
        .table-wrap { overflow-x: auto; }
        .inv-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .inv-table th { text-align: left; padding: 12px 16px; background-color: #FAF7F4; font-size: 0.76rem; text-transform: uppercase; color: #806D68; font-weight: 600; border-bottom: 1px solid #EAE2DB; }
        .inv-table td { padding: 12px 16px; border-bottom: 1px solid #F4EFEB; vertical-align: middle; color: #342727; }
        .thumb-box { width: 38px; height: 38px; border-radius: 8px; overflow: hidden; border: 1px solid #E8D8D0; }
        :global(.thumb-img) { object-fit: cover; }
        .prod-name { font-weight: 600; }
        .sku-text { font-size: 0.78rem; color: #806D68; }
        .stock-number { font-size: 0.95rem; }
        .thresh-text { font-size: 0.76rem; color: #806D68; }
        .status-pill { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; }
        .status-pill.in_stock { background-color: #E6FFFA; color: #234E52; }
        .status-pill.low_stock { background-color: #FEFCBF; color: #744210; }
        .status-pill.out_of_stock { background-color: #FFF5F5; color: #9B2C2C; }
        .actions-cell { display: flex; align-items: center; justify-content: flex-end; gap: 6px; }
        .action-btn { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 6px; border: 1px solid #EAE2DB; background: #FFFFFF; font-size: 0.76rem; color: #342727; cursor: pointer; }
        .action-btn:hover { border-color: #B76E79; color: #B76E79; }
        .empty-cell { text-align: center; padding: 40px !important; color: #806D68; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(52, 39, 39, 0.45); backdrop-filter: blur(4px); z-index: 250; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { width: min(92%, 480px); background: #FFFFFF; border-radius: 18px; padding: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .modal-title { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.3rem; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: #806D68; }
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: 0.76rem; font-weight: 600; color: #342727; }
        .form-input, .form-select { background: #FFF9F3; border: 1px solid #E8D8D0; border-radius: 8px; padding: 8px 12px; font-size: 0.86rem; outline: none; }
        .form-input.disabled { background: #F8F5F2; color: #806D68; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
        .btn-cancel { padding: 7px 14px; border-radius: 6px; border: 1px solid #E8D8D0; background: #FFF; cursor: pointer; }
        .btn-save { padding: 7px 16px; border-radius: 6px; border: none; background: #B76E79; color: #FFF; font-weight: 600; cursor: pointer; }
        .history-list { display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto; }
        .history-row { background: #F8F5F2; padding: 10px 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 4px; }
        .hist-meta { display: flex; justify-content: space-between; font-size: 0.72rem; color: #806D68; }
        .hist-change { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; }
        .hist-arrow { color: #806D68; }
        .diff-pill { padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
        .diff-pill.pos { background: #E6FFFA; color: #234E52; }
        .diff-pill.neg { background: #FFF5F5; color: #9B2C2C; }
        .hist-reason { font-size: 0.74rem; font-style: italic; color: #6F5A58; }
      `}</style>
    </div>
  );
}
