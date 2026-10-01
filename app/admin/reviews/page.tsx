'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, ShieldCheck, Check } from 'lucide-react';
import { DbReview } from '@/lib/db/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(`Review marked as ${status}`);
        fetchReviews();
      }
    } catch {
      showToast('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Review deleted');
        fetchReviews();
      }
    } catch {
      showToast('Error deleting review');
    }
  };

  return (
    <div className="admin-reviews-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Customer Reviews & Moderation</h1>
          <p className="page-sub">Approve, reject, feature, and audit customer testimonials. Verified buyer status is database-confirmed.</p>
        </div>
      </div>

      <div className="reviews-card-container">
        {loading ? (
          <div className="empty-cell">Loading customer reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="empty-cell">No reviews submitted yet.</div>
        ) : (
          <div className="reviews-list">
            {reviews.map((rev) => (
              <div key={rev.id} className="review-item-card">
                <div className="rev-header">
                  <div className="rev-author-box">
                    <span className="author-name">{rev.customerName}</span>
                    <span className="author-location">{rev.location}</span>
                    {rev.verified && (
                      <span className="verified-badge">
                        <ShieldCheck size={12} />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  <div className="rev-rating-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? '#D9B98A' : 'none'}
                        color={i < rev.rating ? '#D9B98A' : '#D9C8BE'}
                      />
                    ))}
                    <span className="rating-num">({rev.rating}.0)</span>
                  </div>
                </div>

                <div className="rev-body">
                  <strong className="rev-title">&quot;{rev.title}&quot;</strong>
                  <p className="rev-comment">{rev.comment}</p>
                  <span className="rev-product-tag">Product: {rev.purchasedProduct || rev.productName || '925 Silver Jewellery'}</span>
                </div>

                <div className="rev-footer-row">
                  <div className="rev-meta-info">
                    <span className="rev-date">{rev.date}</span>
                    <span className={`rev-status-pill ${rev.status}`}>
                      {rev.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="rev-actions">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'approved')}
                        className="btn-approve"
                        title="Approve review"
                      >
                        <Check size={14} />
                        <span>Approve</span>
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                        className="btn-reject"
                        title="Reject review"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="btn-delete"
                      title="Delete review"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-reviews-page { display: flex; flex-direction: column; gap: 20px; }
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #2F855A; color: #FFF; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .page-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: #342727; margin: 0; }
        .page-sub { font-size: 0.88rem; color: #806D68; margin: 4px 0 0 0; }
        .reviews-card-container { background: #FFFFFF; border: 1px solid #EAE2DB; border-radius: 18px; padding: 20px; box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03); }
        .reviews-list { display: flex; flex-direction: column; gap: 14px; }
        .review-item-card { background: #FFF9F3; border: 1px solid #E8D8D0; border-radius: 14px; padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
        .rev-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .rev-author-box { display: flex; align-items: center; gap: 10px; }
        .author-name { font-weight: 600; font-size: 0.92rem; color: #342727; }
        .author-location { font-size: 0.76rem; color: #806D68; }
        .verified-badge { display: inline-flex; align-items: center; gap: 4px; background: #E6FFFA; color: #234E52; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .rev-rating-stars { display: flex; align-items: center; gap: 2px; }
        .rating-num { font-size: 0.76rem; color: #806D68; margin-left: 4px; }
        .rev-body { display: flex; flex-direction: column; gap: 4px; }
        .rev-title { font-size: 0.9rem; color: #342727; }
        .rev-comment { font-size: 0.84rem; color: #6F5A58; margin: 0; line-height: 1.5; }
        .rev-product-tag { font-size: 0.74rem; color: #B76E79; font-weight: 500; margin-top: 4px; }
        .rev-footer-row { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F0E8E2; padding-top: 10px; }
        .rev-meta-info { display: flex; align-items: center; gap: 10px; }
        .rev-date { font-size: 0.74rem; color: #806D68; }
        .rev-status-pill { font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .rev-status-pill.approved { background: #E6FFFA; color: #234E52; }
        .rev-status-pill.pending { background: #FEFCBF; color: #744210; }
        .rev-status-pill.rejected { background: #FFF5F5; color: #9B2C2C; }
        .rev-actions { display: flex; align-items: center; gap: 8px; }
        .btn-approve { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 6px; border: 1px solid #2F855A; background: #FFFFFF; color: #2F855A; font-size: 0.76rem; font-weight: 600; cursor: pointer; }
        .btn-reject { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 6px; border: 1px solid #E8D8D0; background: #FFFFFF; color: #C53030; font-size: 0.76rem; cursor: pointer; }
        .btn-delete { background: none; border: 1px solid #EAE2DB; border-radius: 6px; padding: 6px; color: #806D68; cursor: pointer; }
        .btn-delete:hover { color: #C53030; border-color: #FEB2B2; background: #FFF5F5; }
        .empty-cell { text-align: center; padding: 40px; color: #806D68; }
      `}</style>
    </div>
  );
}
