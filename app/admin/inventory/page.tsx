'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Edit2,
  AlertTriangle,
  CheckCircle2,
  History,
  X,
  Search,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Package
} from 'lucide-react';
import { DbInventoryRecord } from '@/lib/db/types';

interface InventoryResponse {
  inventory: DbInventoryRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<DbInventoryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [adjustTarget, setAdjustTarget] = useState<DbInventoryRecord | null>(null);
  const [adjustType, setAdjustType] = useState<'set' | 'change'>('set');
  const [stockValue, setStockValue] = useState<number>(0);
  const [reason, setReason] = useState('Stock count verification');
  const [submitting, setSubmitting] = useState(false);

  const [historyTarget, setHistoryTarget] = useState<DbInventoryRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch real inventory derived from MongoDB products
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        status: statusFilter,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/admin/inventory?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load inventory (${res.status})`);
      }

      const data: InventoryResponse = await res.json();
      setInventory(data.inventory || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error('Inventory fetch error:', err);
      setError(err.message || 'Unable to load inventory from database.');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page, limit]);

  useEffect(() => {
    fetchInventory();
    const handleUpdate = () => fetchInventory();
    window.addEventListener('mk:product-updated', handleUpdate);
    window.addEventListener('mk:inventory-updated', handleUpdate);
    return () => {
      window.removeEventListener('mk:product-updated', handleUpdate);
      window.removeEventListener('mk:inventory-updated', handleUpdate);
    };
  }, [fetchInventory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdjust = (item: DbInventoryRecord) => {
    setAdjustTarget(item);
    setAdjustType('set');
    setStockValue(item.currentStock);
    setReason('Stock count verification');
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;

    setSubmitting(true);
    try {
      const payload: any = {
        productId: adjustTarget.productId,
        reason: reason.trim() || 'Manual Admin Stock Adjustment',
      };

      if (adjustType === 'set') {
        payload.newStock = Number(stockValue);
      } else {
        payload.change = Number(stockValue);
      }

      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update stock');
      }

      showToast(`Stock successfully updated for "${adjustTarget.productName}"`);
      setAdjustTarget(null);
      fetchInventory();

      // Dispatch global events to keep Products page & dashboard in sync
      window.dispatchEvent(new CustomEvent('mk:inventory-updated'));
      window.dispatchEvent(new CustomEvent('mk:product-updated'));
      window.dispatchEvent(new CustomEvent('mk:refresh-admin-stats'));
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusPill = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <span className="status-badge in-stock">IN STOCK</span>;
      case 'low_stock':
        return <span className="status-badge low-stock">LOW STOCK</span>;
      case 'out_of_stock':
        return <span className="status-badge out-stock">OUT OF STOCK</span>;
      default:
        return <span className="status-badge">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="admin-inventory-flow">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} color="#FFFFFF" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Row */}
      <div className="page-header-row">
        <div>
          <div className="title-with-count">
            <h1 className="page-heading">Inventory & Stock Control</h1>
            {!loading && (
              <span className="inventory-count-badge">
                {total} {total === 1 ? 'Product' : 'Products'}
              </span>
            )}
          </div>
          <p className="page-sub">
            Track real-time warehouse stock levels, low-stock thresholds, and atomic adjustment history directly synced with product catalog.
          </p>
        </div>
      </div>

      {/* 2. Main Table Card */}
      <div className="table-card">
        {/* Toolbar: Search & Status Filter */}
        <div className="toolbar-row">
          <div className="search-wrap">
            <Search size={15} color="#6F6F6A" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU, or category..."
              className="search-input"
              aria-label="Search inventory"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="filter-controls">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="status-select"
              aria-label="Filter by stock status"
            >
              <option value="all">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '64px' }}>IMAGE</th>
                <th scope="col">PRODUCT</th>
                <th scope="col">SKU</th>
                <th scope="col">CURRENT STOCK</th>
                <th scope="col">AVAILABLE</th>
                <th scope="col">THRESHOLD</th>
                <th scope="col">STATUS</th>
                <th scope="col" style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={`skel-${idx}`}>
                    <td colSpan={8} style={{ padding: '16px 20px' }}>
                      <div className="table-skeleton-row" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={8}>
                    <div className="error-state-box">
                      <AlertCircle size={32} color="#DC2626" />
                      <h3 className="error-title">Unable to load inventory</h3>
                      <p className="error-desc">{error}</p>
                      <button onClick={fetchInventory} className="btn-retry">
                        <RotateCcw size={13} />
                        <span>Please try again</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state-box">
                      <div className="empty-icon-bubble">
                        <Boxes size={28} strokeWidth={1.5} color="#6F6F6A" />
                      </div>
                      <h3 className="empty-title">
                        {debouncedSearch || statusFilter !== 'all'
                          ? 'No matching inventory items'
                          : 'No inventory items yet'}
                      </h3>
                      <p className="empty-desc">
                        {debouncedSearch || statusFilter !== 'all'
                          ? `No inventory records matched your filter criteria.`
                          : 'Active products added to your catalog will automatically appear here with live stock control.'}
                      </p>
                      {debouncedSearch || statusFilter !== 'all' ? (
                        <button
                          onClick={() => { setSearch(''); setStatusFilter('all'); }}
                          className="btn-reset"
                        >
                          <span>Reset Filters</span>
                        </button>
                      ) : (
                        <Link href="/admin/products/new" className="btn-create">
                          <Package size={14} />
                          <span>Add First Product</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id || item.productId}>
                    {/* Image */}
                    <td>
                      <div className="item-thumb-box">
                        <Image
                          src={item.productImage || '/images/products/ring-minimal-silver-01.jpg'}
                          alt={item.productName}
                          width={44}
                          height={44}
                          className="item-thumb-img"
                        />
                      </div>
                    </td>

                    {/* Product Name */}
                    <td>
                      <div className="product-title-col">
                        <Link href={`/admin/products`} className="product-name-link">
                          {item.productName}
                        </Link>
                        <span className="product-id-sub">ID: {item.productId}</span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td>
                      <span className="sku-mono">{item.sku}</span>
                    </td>

                    {/* Current Stock */}
                    <td>
                      <strong className="stock-number">{item.currentStock}</strong>
                    </td>

                    {/* Available */}
                    <td>
                      <span className="stock-available">{item.availableStock}</span>
                    </td>

                    {/* Threshold */}
                    <td>
                      <span className="threshold-pill">
                        {item.lowStockThreshold} units
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      {renderStatusPill(item.status)}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="actions-cell">
                        <button
                          onClick={() => handleOpenAdjust(item)}
                          className="btn-action-adjust"
                          title="Adjust Stock"
                        >
                          <Edit2 size={13} />
                          <span>Adjust</span>
                        </button>
                        <button
                          onClick={() => setHistoryTarget(item)}
                          className="btn-action-history"
                          title="View Adjustment History"
                          aria-label="View history"
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

        {/* Server-Side Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total} products
            </span>
            <div className="pagination-btns">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="page-btn"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <span className="page-indicator">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="page-btn"
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {adjustTarget && (
        <div className="modal-backdrop" onClick={() => setAdjustTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Adjust Inventory</h3>
                <p className="modal-sub">{adjustTarget.productName} ({adjustTarget.sku})</p>
              </div>
              <button onClick={() => setAdjustTarget(null)} className="modal-close" aria-label="Close modal">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="modal-form">
              <div className="current-stock-callout">
                <span className="callout-label">Current Stock in MongoDB</span>
                <span className="callout-value">{adjustTarget.currentStock} units</span>
              </div>

              <div className="form-group">
                <label className="form-label">Adjustment Mode</label>
                <div className="mode-toggle-row">
                  <button
                    type="button"
                    onClick={() => { setAdjustType('set'); setStockValue(adjustTarget.currentStock); }}
                    className={`mode-btn ${adjustType === 'set' ? 'active' : ''}`}
                  >
                    Set Exact Quantity
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdjustType('change'); setStockValue(0); }}
                    className={`mode-btn ${adjustType === 'change' ? 'active' : ''}`}
                  >
                    Add / Deduct Units
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {adjustType === 'set' ? 'New Total Stock' : 'Units to Add (+) or Deduct (-)'}
                </label>
                <input
                  type="number"
                  required
                  value={stockValue}
                  onChange={(e) => setStockValue(parseInt(e.target.value, 10) || 0)}
                  className="form-input"
                  min={adjustType === 'set' ? 0 : -adjustTarget.currentStock}
                  placeholder={adjustType === 'set' ? 'e.g. 15' : 'e.g. +5 or -2'}
                />
                {adjustType === 'change' && (
                  <span className="form-hint">
                    Resulting stock: {Math.max(0, adjustTarget.currentStock + (stockValue || 0))} units
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Audit Note</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Received new shipment from Jaipur studio"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setAdjustTarget(null)}
                  className="btn-cancel"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Updating Database...' : 'Save Stock Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyTarget && (
        <div className="modal-backdrop" onClick={() => setHistoryTarget(null)}>
          <div className="modal-card history-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Inventory Adjustment History</h3>
                <p className="modal-sub">{historyTarget.productName} ({historyTarget.sku})</p>
              </div>
              <button onClick={() => setHistoryTarget(null)} className="modal-close" aria-label="Close modal">
                <X size={16} />
              </button>
            </div>

            <div className="history-content-scroll">
              {(!historyTarget.history || historyTarget.history.length === 0) ? (
                <div className="no-history-box">
                  <p className="no-history-text">No inventory adjustments yet.</p>
                  <span className="no-history-sub">Future manual adjustments and restock logs will appear here.</span>
                </div>
              ) : (
                <div className="history-timeline">
                  {historyTarget.history.map((h: any, idx: number) => (
                    <div key={h.id || idx} className="history-entry">
                      <div className="history-lead">
                        <span className={`diff-pill ${h.change >= 0 ? 'plus' : 'minus'}`}>
                          {h.change >= 0 ? `+${h.change}` : h.change}
                        </span>
                        <div className="history-math">
                          <strong>{h.new} units</strong>
                          <span className="prev-units">(was {h.previous})</span>
                        </div>
                      </div>
                      <div className="history-details">
                        <p className="history-reason">{h.reason || 'Manual Adjustment'}</p>
                        <span className="history-meta">
                          By {h.admin || 'Admin'} • {new Date(h.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-inventory-flow {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-toast {
          position: fixed;
          top: 84px;
          right: 28px;
          background-color: #111111;
          color: #FFFFFF;
          padding: 10px 18px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 500;
          font-size: 0.84rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .title-with-count {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .page-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 2.1rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .inventory-count-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #6F6F6A;
          text-transform: uppercase;
        }

        .page-sub {
          font-size: 0.86rem;
          color: #6F6F6A;
          margin: 4px 0 0 0;
        }

        .table-card {
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        .toolbar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #E8E7E2;
          gap: 14px;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 280px;
          max-width: 480px;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          padding: 0 12px;
          transition: border-color 0.2s;
        }

        .search-wrap:focus-within {
          border-color: #111111;
          background: #FFFFFF;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 9px 8px;
          font-size: 0.84rem;
          color: #111111;
        }

        .search-input::placeholder {
          color: #8E8D88;
        }

        .search-clear-btn {
          background: transparent;
          border: none;
          padding: 4px;
          color: #6F6F6A;
          cursor: pointer;
        }

        .status-select {
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 0.82rem;
          color: #111111;
          cursor: pointer;
          outline: none;
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .inv-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .inv-table th {
          background: #FAF9F6;
          padding: 12px 18px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6F6F6A;
          border-bottom: 1px solid #E8E7E2;
          white-space: nowrap;
        }

        .inv-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #F0EFEA;
          font-size: 0.84rem;
          vertical-align: middle;
        }

        .inv-table tr:last-child td {
          border-bottom: none;
        }

        .item-thumb-box {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-thumb-img {
          object-fit: cover;
        }

        .product-title-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .product-name-link {
          font-weight: 600;
          color: #111111;
          text-decoration: none;
        }

        .product-name-link:hover {
          text-decoration: underline;
        }

        .product-id-sub {
          font-size: 0.72rem;
          color: #8E8D88;
        }

        .sku-mono {
          font-family: monospace;
          font-size: 0.78rem;
          color: #4A4A46;
          background: #FAF9F6;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #E8E7E2;
        }

        .stock-number {
          font-size: 0.94rem;
          font-weight: 700;
          color: #111111;
        }

        .stock-available {
          font-size: 0.88rem;
          color: #4A4A46;
        }

        .threshold-pill {
          font-size: 0.76rem;
          color: #6F6F6A;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .status-badge.in-stock {
          background: #EDF7F2;
          color: #1E7E5E;
        }

        .status-badge.low-stock {
          background: #FEF3C7;
          color: #92400E;
        }

        .status-badge.out-stock {
          background: #FEE2E2;
          color: #991B1B;
        }

        .actions-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .btn-action-adjust {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 5px;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          color: #111111;
          font-size: 0.76rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-action-adjust:hover {
          border-color: #111111;
          background: #FAF9F6;
        }

        .btn-action-history {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 8px;
          border-radius: 5px;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          color: #6F6F6A;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-action-history:hover {
          color: #111111;
          border-color: #111111;
        }

        /* Empty / Error States */
        .empty-state-box, .error-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          text-align: center;
        }

        .empty-icon-bubble {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .empty-title, .error-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #111111;
          margin: 0 0 6px 0;
        }

        .empty-desc, .error-desc {
          font-size: 0.84rem;
          color: #6F6F6A;
          max-width: 440px;
          margin: 0 0 20px 0;
          line-height: 1.5;
        }

        .btn-create, .btn-reset, .btn-retry {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .btn-create {
          background: #111111;
          color: #FFFFFF;
        }

        .btn-create:hover {
          background: #333333;
        }

        .btn-reset, .btn-retry {
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          color: #111111;
        }

        .table-skeleton-row {
          height: 24px;
          background: #FAF9F6;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Pagination */
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid #E8E7E2;
          background: #FAF9F6;
        }

        .pagination-info {
          font-size: 0.78rem;
          color: #6F6F6A;
        }

        .pagination-btns {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 5px;
          font-size: 0.76rem;
          color: #111111;
          cursor: pointer;
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-indicator {
          font-size: 0.76rem;
          color: #6F6F6A;
          padding: 0 4px;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 600;
          padding: 20px;
        }

        .modal-card {
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 10px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          animation: popIn 0.2s ease-out;
        }

        .history-modal-card {
          max-width: 540px;
        }

        @keyframes popIn {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid #E8E7E2;
        }

        .modal-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #111111;
          margin: 0 0 4px 0;
        }

        .modal-sub {
          font-size: 0.8rem;
          color: #6F6F6A;
          margin: 0;
        }

        .modal-close {
          background: transparent;
          border: none;
          padding: 4px;
          color: #6F6F6A;
          cursor: pointer;
        }

        .modal-form {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .current-stock-callout {
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .callout-label {
          font-size: 0.8rem;
          color: #6F6F6A;
        }

        .callout-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: #111111;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #111111;
        }

        .mode-toggle-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .mode-btn {
          padding: 8px 10px;
          border-radius: 5px;
          border: 1px solid #E8E7E2;
          background: #FAF9F6;
          font-size: 0.78rem;
          font-weight: 500;
          color: #6F6F6A;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mode-btn.active {
          border-color: #111111;
          background: #111111;
          color: #FFFFFF;
        }

        .form-input {
          padding: 9px 12px;
          border-radius: 6px;
          border: 1px solid #E8E7E2;
          font-size: 0.86rem;
          color: #111111;
          outline: none;
        }

        .form-input:focus {
          border-color: #111111;
        }

        .form-hint {
          font-size: 0.74rem;
          color: #6F6F6A;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }

        .btn-cancel {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          color: #6F6F6A;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .btn-submit {
          padding: 8px 18px;
          border-radius: 6px;
          border: 1px solid #111111;
          background: #111111;
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-submit:hover:not(:disabled) {
          background: #333333;
        }

        /* History modal content */
        .history-content-scroll {
          padding: 20px 24px;
          max-height: 380px;
          overflow-y: auto;
        }

        .no-history-box {
          text-align: center;
          padding: 32px 0;
        }

        .no-history-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111111;
          margin: 0 0 4px 0;
        }

        .no-history-sub {
          font-size: 0.78rem;
          color: #8E8D88;
        }

        .history-timeline {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .history-entry {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F0EFEA;
        }

        .history-entry:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .diff-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 0.78rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .diff-pill.plus {
          background: #EDF7F2;
          color: #1E7E5E;
        }

        .diff-pill.minus {
          background: #FEE2E2;
          color: #991B1B;
        }

        .history-math {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 80px;
        }

        .history-math strong {
          font-size: 0.86rem;
          color: #111111;
        }

        .prev-units {
          font-size: 0.74rem;
          color: #8E8D88;
        }

        .history-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .history-reason {
          font-size: 0.82rem;
          color: #111111;
          margin: 0;
          font-weight: 500;
        }

        .history-meta {
          font-size: 0.72rem;
          color: #8E8D88;
        }
      `}</style>
    </div>
  );
}
