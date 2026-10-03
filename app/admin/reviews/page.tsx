'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  ShieldCheck,
  Check,
  Search,
  X,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAdminStats } from '@/components/admin/AdminStatsContext';

interface ReviewItem {
  id: string;
  productId?: string;
  productName?: string;
  productImage?: string | null;
  rating: number;
  title: string;
  comment: string;
  customerName: string;
  customerEmail?: string;
  location?: string | null;
  verifiedBuyer: boolean;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  createdAt?: string;
}

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function AdminReviewsPage() {
  const { refreshReviewStats } = useAdminStats();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Action status toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch reviews stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reviews/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats({
            total: data.total || 0,
            pending: data.pending || 0,
            approved: data.approved || 0,
            rejected: data.rejected || 0,
          });
        }
      }
    } catch (err) {
      console.error('Failed to load review stats:', err);
    }
  }, []);

  // Fetch paginated reviews list
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        status: activeTab,
        page: String(page),
        limit: String(limit),
      });

      if (ratingFilter !== 'all') {
        params.append('rating', ratingFilter);
      }

      if (verifiedOnly) {
        params.append('verified', 'true');
      }

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Unable to load reviews (${res.status})`);
      }

      const data = await res.json();
      setReviews(data.reviews || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error('Reviews load error:', err);
      setError(err.message || 'Unable to load customer reviews from database.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeTab, ratingFilter, verifiedOnly, page, limit]);

  useEffect(() => {
    fetchStats();
    fetchReviews();
  }, [fetchStats, fetchReviews]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoadingId(id);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Status update failed');

      showToast(`Review marked as ${status}`);
      fetchStats();
      fetchReviews();
      refreshReviewStats();
      window.dispatchEvent(new CustomEvent('mk:review-updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to update review status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this customer review?')) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      showToast('Review permanently deleted');
      fetchStats();
      fetchReviews();
      refreshReviewStats();
      window.dispatchEvent(new CustomEvent('mk:review-updated'));
    } catch (err: any) {
      showToast(err.message || 'Error deleting review');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'MK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="admin-reviews-flow">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} color="#FFFFFF" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="page-header-row">
        <div>
          <div className="title-with-count">
            <h1 className="page-heading">Customer Reviews & Moderation</h1>
            {!loading && (
              <span className="review-count-badge">
                {stats.total} {stats.total === 1 ? 'Review' : 'Reviews'}
              </span>
            )}
          </div>
          <p className="page-sub">
            Approve, reject, and audit authentic customer testimonials. Verified buyer status is database-confirmed against paid orders.
          </p>
        </div>
      </div>

      {/* 2. Main Container Card */}
      <div className="reviews-card-container">
        {/* Navigation Tabs (All, Pending, Approved, Rejected) */}
        <div className="tabs-bar">
          <div className="status-tabs-list">
            <button
              onClick={() => { setActiveTab('all'); setPage(1); }}
              className={`status-tab ${activeTab === 'all' ? 'active' : ''}`}
            >
              <span>All Reviews</span>
              <span className="tab-pill">{stats.total}</span>
            </button>
            <button
              onClick={() => { setActiveTab('pending'); setPage(1); }}
              className={`status-tab ${activeTab === 'pending' ? 'active' : ''}`}
            >
              <span>Pending</span>
              <span className="tab-pill pending-pill">{stats.pending}</span>
            </button>
            <button
              onClick={() => { setActiveTab('approved'); setPage(1); }}
              className={`status-tab ${activeTab === 'approved' ? 'active' : ''}`}
            >
              <span>Approved</span>
              <span className="tab-pill approved-pill">{stats.approved}</span>
            </button>
            <button
              onClick={() => { setActiveTab('rejected'); setPage(1); }}
              className={`status-tab ${activeTab === 'rejected' ? 'active' : ''}`}
            >
              <span>Rejected</span>
              <span className="tab-pill rejected-pill">{stats.rejected}</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Secondary Filters */}
        <div className="toolbar-row">
          <div className="search-wrap">
            <Search size={15} color="#6F6F6A" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, review text, or product..."
              className="search-input"
              aria-label="Search reviews"
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
            {/* Rating Selector */}
            <div className="select-wrap">
              <Star size={13} color="#6F6F6A" />
              <select
                value={ratingFilter}
                onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
                className="filter-select"
                aria-label="Filter by star rating"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Verified Buyer Toggle */}
            <button
              type="button"
              onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }}
              className={`toggle-verified-btn ${verifiedOnly ? 'active' : ''}`}
              title="Show only verified purchases"
            >
              <ShieldCheck size={13} />
              <span>Verified Buyers</span>
            </button>
          </div>
        </div>

        {/* Content Body: Loading, Error, Empty, or Reviews List */}
        {loading ? (
          <div className="reviews-skeleton-list">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`skel-${idx}`} className="review-skeleton-card">
                <div className="skel-line" style={{ width: '35%', height: '18px' }} />
                <div className="skel-line" style={{ width: '60%', height: '14px', marginTop: '10px' }} />
                <div className="skel-line" style={{ width: '90%', height: '14px' }} />
                <div className="skel-line" style={{ width: '25%', height: '14px', marginTop: '8px' }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-state-box">
            <AlertCircle size={32} color="#DC2626" />
            <h3 className="error-title">Unable to load reviews</h3>
            <p className="error-desc">{error}</p>
            <button onClick={fetchReviews} className="btn-retry">
              <RotateCcw size={13} />
              <span>Please try again</span>
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon-bubble">
              <MessageSquare size={28} strokeWidth={1.5} color="#6F6F6A" />
            </div>
            <h3 className="empty-title">
              {debouncedSearch || ratingFilter !== 'all' || verifiedOnly
                ? 'No matching reviews found'
                : 'No customer reviews yet'}
            </h3>
            <p className="empty-desc">
              {debouncedSearch || ratingFilter !== 'all' || verifiedOnly
                ? 'No review records matched the selected filters. Try adjusting your search query or criteria.'
                : 'Reviews submitted by real customers will appear here for moderation.'}
            </p>
            {debouncedSearch || ratingFilter !== 'all' || verifiedOnly ? (
              <button
                onClick={() => {
                  setSearch('');
                  setRatingFilter('all');
                  setVerifiedOnly(false);
                  setActiveTab('all');
                }}
                className="btn-reset"
              >
                <span>Reset Filters</span>
              </button>
            ) : (
              <Link href="/shop" target="_blank" className="btn-store">
                <span>View Store</span>
                <ExternalLink size={12} />
              </Link>
            )}
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((rev) => (
              <article key={rev.id} className="review-item-card">
                {/* Header: Author Info + Star Rating */}
                <div className="rev-header">
                  <div className="rev-author-box">
                    <div className="author-avatar-ring">
                      <span>{getInitials(rev.customerName)}</span>
                    </div>
                    <div className="author-meta-col">
                      <div className="author-name-row">
                        <strong className="author-name">{rev.customerName}</strong>
                        {rev.location && <span className="author-location">— {rev.location}</span>}
                        {rev.verifiedBuyer && (
                          <span className="verified-badge" title="Purchased in a verified order">
                            <ShieldCheck size={11} />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      {rev.customerEmail && (
                        <span className="author-email">{rev.customerEmail}</span>
                      )}
                    </div>
                  </div>

                  <div className="rev-rating-stars">
                    <div className="stars-row">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < Math.round(rev.rating) ? '#111111' : 'none'}
                          color="#111111"
                          strokeWidth={1}
                        />
                      ))}
                    </div>
                    <span className="rating-num">({Number(rev.rating).toFixed(1)})</span>
                  </div>
                </div>

                {/* Body: Title, Comment, Product Link */}
                <div className="rev-body">
                  {rev.title && <h4 className="rev-title">&ldquo;{rev.title}&rdquo;</h4>}
                  <p className="rev-comment">{rev.comment}</p>
                  <div className="rev-product-row">
                    <span className="product-label">Product:</span>
                    {rev.productId ? (
                      <Link
                        href={`/product/${encodeURIComponent(rev.productId)}`}
                        target="_blank"
                        className="product-link"
                      >
                        <span>{rev.productName || 'View Product'}</span>
                        <ExternalLink size={10} />
                      </Link>
                    ) : (
                      <span className="product-plain">{rev.productName || 'Jewellery Piece'}</span>
                    )}
                  </div>
                </div>

                {/* Footer: Date, Status Badge, Moderation Actions */}
                <div className="rev-footer-row">
                  <div className="rev-meta-info">
                    <span className="rev-date">{rev.date}</span>
                    <span className={`rev-status-pill status-${rev.status}`}>
                      {rev.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="rev-actions">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'approved')}
                        disabled={actionLoadingId === rev.id}
                        className="btn-approve"
                        title="Approve review for storefront"
                      >
                        <Check size={13} />
                        <span>Approve</span>
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                        disabled={actionLoadingId === rev.id}
                        className="btn-reject"
                        title="Reject review from storefront"
                      >
                        <XCircle size={13} />
                        <span>Reject</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev.id)}
                      disabled={actionLoadingId === rev.id}
                      className="btn-delete"
                      title="Permanently delete review"
                      aria-label="Delete review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Server-Side Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total} reviews
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

      <style jsx>{`
        .admin-reviews-flow {
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

        /* 1. Header */
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

        .review-count-badge {
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

        /* 2. Container Card */
        .reviews-card-container {
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 10px;
          padding: 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        /* Status Tabs Bar */
        .tabs-bar {
          border-bottom: 1px solid #E8E7E2;
          background: #FAF9F6;
          padding: 0 20px;
        }

        .status-tabs-list {
          display: flex;
          gap: 6px;
          overflow-x: auto;
        }

        .status-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 14px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 0.82rem;
          font-weight: 500;
          color: #6F6F6A;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .status-tab:hover {
          color: #111111;
        }

        .status-tab.active {
          color: #111111;
          font-weight: 600;
          border-bottom-color: #111111;
        }

        .tab-pill {
          padding: 1px 7px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 600;
          background: #E8E7E2;
          color: #111111;
        }

        .status-tab.active .tab-pill {
          background: #111111;
          color: #FFFFFF;
        }

        .tab-pill.pending-pill {
          background: #FEF3C7;
          color: #92400E;
        }

        .tab-pill.approved-pill {
          background: #D1FAE5;
          color: #065F46;
        }

        .tab-pill.rejected-pill {
          background: #FEE2E2;
          color: #991B1B;
        }

        /* Toolbar Row */
        .toolbar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          padding: 16px 20px;
          border-bottom: 1px solid #E8E7E2;
          background: #FFFFFF;
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

        .search-clear-btn:hover {
          color: #111111;
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .select-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          padding: 0 10px;
        }

        .filter-select {
          background: transparent;
          border: none;
          outline: none;
          padding: 8px 4px;
          font-size: 0.8rem;
          color: #111111;
          cursor: pointer;
        }

        .toggle-verified-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #6F6F6A;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .toggle-verified-btn:hover {
          color: #111111;
          border-color: #C8C7C2;
        }

        .toggle-verified-btn.active {
          background: #111111;
          color: #FFFFFF;
          border-color: #111111;
        }

        /* Reviews List */
        .reviews-list {
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 16px;
        }

        .review-item-card {
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 8px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s;
        }

        .review-item-card:hover {
          border-color: #C8C7C2;
        }

        /* Header of Card */
        .rev-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .rev-author-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar-ring {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.74rem;
          font-weight: 600;
          color: #111111;
          flex-shrink: 0;
        }

        .author-meta-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-name-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .author-name {
          font-size: 0.92rem;
          font-weight: 600;
          color: #111111;
        }

        .author-location {
          font-size: 0.76rem;
          color: #6F6F6A;
        }

        .author-email {
          font-size: 0.74rem;
          color: #8E8D88;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #EDF7F2;
          color: #1E7E5E;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .rev-rating-stars {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stars-row {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .rating-num {
          font-size: 0.78rem;
          font-weight: 600;
          color: #111111;
        }

        /* Body of Card */
        .rev-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rev-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .rev-comment {
          font-size: 0.84rem;
          color: #2D2D2A;
          margin: 0;
          line-height: 1.55;
        }

        .rev-product-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-size: 0.76rem;
        }

        .product-label {
          color: #6F6F6A;
          font-weight: 500;
        }

        .product-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #111111;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .product-link:hover {
          color: #4A4A46;
        }

        .product-plain {
          color: #111111;
          font-weight: 600;
        }

        /* Footer of Card */
        .rev-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #F0EFEA;
          padding-top: 12px;
          margin-top: 4px;
        }

        .rev-meta-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rev-date {
          font-size: 0.74rem;
          color: #8E8D88;
        }

        .rev-status-pill {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 2px 7px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .rev-status-pill.status-approved {
          background: #EDF7F2;
          color: #1E7E5E;
        }

        .rev-status-pill.status-pending {
          background: #FEF3C7;
          color: #92400E;
        }

        .rev-status-pill.status-rejected {
          background: #FEE2E2;
          color: #991B1B;
        }

        .rev-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-approve {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 5px;
          border: 1px solid #111111;
          background: #111111;
          color: #FFFFFF;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-approve:hover:not(:disabled) {
          background: #333333;
        }

        .btn-reject {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 5px;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          color: #6F6F6A;
          font-size: 0.74rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-reject:hover:not(:disabled) {
          color: #991B1B;
          border-color: #FEE2E2;
          background: #FEF2F2;
        }

        .btn-delete {
          background: transparent;
          border: 1px solid #E8E7E2;
          border-radius: 5px;
          padding: 6px 8px;
          color: #8E8D88;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-delete:hover:not(:disabled) {
          color: #DC2626;
          border-color: #FEE2E2;
          background: #FEF2F2;
        }

        /* Empty & Error States */
        .empty-state-box, .error-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          text-align: center;
          background: #FFFFFF;
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

        .btn-store, .btn-reset, .btn-retry {
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

        .btn-store {
          background: #111111;
          color: #FFFFFF;
        }

        .btn-store:hover {
          background: #2E2E2A;
        }

        .btn-reset, .btn-retry {
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          color: #111111;
        }

        .btn-reset:hover, .btn-retry:hover {
          background: #F0EFEA;
        }

        /* Skeleton States */
        .reviews-skeleton-list {
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 16px;
        }

        .review-skeleton-card {
          background: #FAF9F6;
          border: 1px solid #E8E7E2;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skel-line {
          background: #E8E7E2;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Pagination Bar */
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
      `}</style>
    </div>
  );
}
