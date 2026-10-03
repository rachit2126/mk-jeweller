'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface AdminStatsContextType {
  orderStats: OrderStats | null;
  reviewStats: ReviewStats | null;
  reviewsCount: number | null;
  loading: boolean;
  refreshOrderStats: () => Promise<void>;
  refreshReviewStats: () => Promise<void>;
}

const AdminStatsContext = createContext<AdminStatsContextType>({
  orderStats: null,
  reviewStats: null,
  reviewsCount: null,
  loading: true,
  refreshOrderStats: async () => {},
  refreshReviewStats: async () => {},
});

export function AdminStatsProvider({ children }: { children: React.ReactNode }) {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [reviewsCount, setReviewsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [orderRes, reviewRes] = await Promise.all([
        fetch('/api/admin/orders/stats'),
        fetch('/api/admin/reviews/stats'),
      ]);

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData.success && orderData.stats) {
          setOrderStats(orderData.stats);
        }
      }

      if (reviewRes.ok) {
        const revData = await reviewRes.json();
        if (revData.success) {
          setReviewStats({
            total: revData.total || 0,
            pending: revData.pending || 0,
            approved: revData.approved || 0,
            rejected: revData.rejected || 0,
          });
          setReviewsCount(revData.total || 0);
        }
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const handleUpdate = () => {
      fetchStats();
    };

    window.addEventListener('mk:order-updated', handleUpdate);
    window.addEventListener('mk:review-updated', handleUpdate);
    window.addEventListener('mk:reviews-updated', handleUpdate);
    window.addEventListener('mk:refresh-admin-stats', handleUpdate);

    return () => {
      window.removeEventListener('mk:order-updated', handleUpdate);
      window.removeEventListener('mk:review-updated', handleUpdate);
      window.removeEventListener('mk:reviews-updated', handleUpdate);
      window.removeEventListener('mk:refresh-admin-stats', handleUpdate);
    };
  }, [fetchStats]);

  return (
    <AdminStatsContext.Provider
      value={{
        orderStats,
        reviewStats,
        reviewsCount,
        loading,
        refreshOrderStats: fetchStats,
        refreshReviewStats: fetchStats,
      }}
    >
      {children}
    </AdminStatsContext.Provider>
  );
}

export function useAdminStats() {
  return useContext(AdminStatsContext);
}
