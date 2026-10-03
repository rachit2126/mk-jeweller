'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Eye,
  Filter,
  Download,
  Plus,
  ShoppingBag,
  Clock,
  PackageCheck,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Truck,
  CreditCard,
  MapPin,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { DbOrder } from '@/lib/db/types';
import { useAdminStats } from '@/components/admin/AdminStatsContext';

interface OrderCounts {
  all: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
}

export default function AdminOrdersPage() {
  const { refreshOrderStats } = useAdminStats();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [counts, setCounts] = useState<OrderCounts>({
    all: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Filters state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showFiltersBar, setShowFiltersBar] = useState(true);

  // Drawer & Modal state
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [timelineNote, setTimelineNote] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // New manual order form state
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    productName: '925 Sterling Silver Ring',
    sku: 'MK-RING-925',
    price: 3998,
    quantity: 1,
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'paid',
    addressLine: '102 Royal Silver Residency, MI Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    postalCode: '302001',
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch orders from MongoDB backed API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        status: status === 'all' ? '' : status,
        paymentStatus: paymentStatus === 'all' ? '' : paymentStatus,
        sort,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load orders: ${res.status}`);
      }
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.counts) {
        setCounts(data.counts);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      showToast('Unable to load orders from MongoDB. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, paymentStatus, sort, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Open Drawer and fetch freshest details
  const openOrderDrawer = async (orderId: string) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const cleanId = encodeURIComponent(orderId.replace('#', ''));
      const res = await fetch(`/api/admin/orders/${cleanId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setSelectedOrder(data.order);
          setNewStatus(data.order.status || 'processing');
          return;
        }
      }
      // Fallback to locally held order in table
      const local = orders.find((o) => o.id === orderId);
      if (local) {
        setSelectedOrder(local);
        setNewStatus(local.status || 'processing');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeOrderDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
    setTimelineNote('');
  };

  // Update order status in MongoDB
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdatingStatus(true);
    try {
      const cleanId = encodeURIComponent(selectedOrder.id.replace('#', ''));
      const res = await fetch(`/api/admin/orders/${cleanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          timelineNote: timelineNote.trim() || `Status updated to ${newStatus.toUpperCase()}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update order status');
      }

      const data = await res.json();
      if (data.success && data.order) {
        setSelectedOrder(data.order);
        setTimelineNote('');
        showToast('Order status updated successfully.', 'success');
        // Refresh orders list to update counters & table
        fetchOrders();
        refreshOrderStats();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mk:order-updated'));
        }
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error updating order status in database.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Create manual order
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOrder(true);
    try {
      const subtotal = Number(newOrderForm.price) * Number(newOrderForm.quantity);
      const tax = Math.round(subtotal * 0.03); // 3% silver jewellery GST
      const amount = subtotal + tax;

      const payload = {
        customerName: newOrderForm.customerName.trim(),
        email: newOrderForm.email.trim(),
        phone: newOrderForm.phone.trim(),
        paymentMethod: newOrderForm.paymentMethod,
        paymentStatus: newOrderForm.paymentStatus,
        subtotal,
        tax,
        shipping: 0,
        amount,
        shippingAddress: {
          addressLine: newOrderForm.addressLine,
          city: newOrderForm.city,
          state: newOrderForm.state,
          postalCode: newOrderForm.postalCode,
          country: 'India',
        },
        items: [
          {
            name: newOrderForm.productName,
            sku: newOrderForm.sku,
            price: Number(newOrderForm.price),
            quantity: Number(newOrderForm.quantity),
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
          },
        ],
      };

      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create order');
      }

      showToast('Order created successfully and saved to MongoDB.', 'success');
      setCreateModalOpen(false);
      fetchOrders();
      refreshOrderStats();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mk:order-updated'));
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to create order.', 'error');
    } finally {
      setCreatingOrder(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No orders available to export.', 'error');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Email',
      'Phone',
      'Items Count',
      'Subtotal (INR)',
      'Tax (INR)',
      'Total Amount (INR)',
      'Payment Status',
      'Payment Method',
      'Fulfillment Status',
      'City',
      'State',
      'Postal Code',
    ];

    const rows = orders.map((o) => {
      const itemsCount = o.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || o.items?.length || 1;
      return [
        `"${o.id}"`,
        `"${o.date || ''}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${o.email || ''}"`,
        `"${o.phone || ''}"`,
        itemsCount,
        o.subtotal || o.amount || 0,
        o.tax || 0,
        o.amount || 0,
        `"${(o.paymentStatus || 'pending').toUpperCase()}"`,
        `"${o.paymentMethod || 'Razorpay UPI'}"`,
        `"${(o.status || 'processing').toUpperCase()}"`,
        `"${o.shippingAddress?.city || ''}"`,
        `"${o.shippingAddress?.state || ''}"`,
        `"${o.shippingAddress?.postalCode || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mk_silver_hub_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${orders.length} orders as CSV.`, 'success');
  };

  const clearAllFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('all');
    setPaymentStatus('all');
    setSort('newest');
    setPage(1);
  };

  // Helpers for customer initials
  const getInitials = (name?: string) => {
    if (!name) return 'MK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  // Stepper helper
  const getTimelineSteps = (currentStatus: string) => {
    const steps = [
      { key: 'placed', label: 'Order Placed' },
      { key: 'confirmed', label: 'Payment Confirmed' },
      { key: 'processing', label: 'Processing' },
      { key: 'shipped', label: 'Shipped' },
      { key: 'delivered', label: 'Delivered' },
    ];

    const statusOrder: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: -1,
    };

    const currentRank = statusOrder[currentStatus?.toLowerCase()] ?? 2;

    return steps.map((step, idx) => {
      let state: 'completed' | 'current' | 'future' = 'future';
      if (currentStatus === 'cancelled') {
        state = idx === 0 ? 'completed' : 'future';
      } else if (idx < currentRank) {
        state = 'completed';
      } else if (idx === currentRank) {
        state = 'current';
      }
      return { ...step, state };
    });
  };

  return (
    <div className="orders-page-flow">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="orders-toast-message"
          style={{
            backgroundColor: toastType === 'error' ? 'var(--admin-danger)' : 'var(--admin-success)',
          }}
          role="status"
          aria-live="polite"
        >
          {toastType === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="orders-page-header">
        <div className="orders-header-titles">
          <h1 className="orders-main-title">Orders</h1>
          <p className="orders-main-subtext">
            Manage customer orders, payments, fulfilment and delivery tracking.
          </p>
        </div>

        <div className="orders-header-buttons">
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-luxury-secondary"
            aria-label="Export orders to CSV"
            title="Download CSV export of currently listed orders"
          >
            <Download size={14} />
            <span>Export Orders</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFiltersBar(!showFiltersBar)}
            className={`btn-luxury-secondary ${showFiltersBar ? 'active' : ''}`}
            aria-label="Toggle advanced filters"
          >
            <Filter size={14} />
            <span>Filter</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="btn-luxury-primary"
            aria-label="Create manual order"
          >
            <Plus size={15} />
            <span>+ Create Order</span>
          </button>
        </div>
      </div>

      {/* 2. Order Summary Cards (backed by live MongoDB count aggregation) */}
      <div className="orders-summary-grid">
        {/* Total Orders */}
        <div className="order-summary-card">
          <div className="summary-icon-circle all">
            <ShoppingBag size={20} />
          </div>
          <div className="summary-data-col">
            <span className="summary-metric-val">
              {loading && counts.all === 0 ? '—' : counts.all}
            </span>
            <span className="summary-label-txt">Total Orders</span>
          </div>
        </div>

        {/* Pending */}
        <div className="order-summary-card">
          <div className="summary-icon-circle pending">
            <Clock size={20} />
          </div>
          <div className="summary-data-col">
            <span className="summary-metric-val">
              {loading && counts.pending === 0 ? '—' : counts.pending}
            </span>
            <span className="summary-label-txt">Pending</span>
          </div>
        </div>

        {/* Processing */}
        <div className="order-summary-card">
          <div className="summary-icon-circle processing">
            <PackageCheck size={20} />
          </div>
          <div className="summary-data-col">
            <span className="summary-metric-val">
              {loading && counts.processing === 0 ? '—' : counts.processing}
            </span>
            <span className="summary-label-txt">Processing</span>
          </div>
        </div>

        {/* Completed (Delivered) */}
        <div className="order-summary-card">
          <div className="summary-icon-circle completed">
            <CheckCircle2 size={20} />
          </div>
          <div className="summary-data-col">
            <span className="summary-metric-val">
              {loading && counts.delivered === 0 ? '—' : counts.delivered}
            </span>
            <span className="summary-label-txt">Completed</span>
          </div>
        </div>

        {/* Cancelled */}
        <div className="order-summary-card">
          <div className="summary-icon-circle cancelled">
            <XCircle size={20} />
          </div>
          <div className="summary-data-col">
            <span className="summary-metric-val">
              {loading && counts.cancelled === 0 ? '—' : counts.cancelled}
            </span>
            <span className="summary-label-txt">Cancelled</span>
          </div>
        </div>
      </div>

      {/* 3. Segmented Order Status Tabs */}
      <div className="orders-tabs-wrapper" role="tablist" aria-label="Order status filter tabs">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'pending', label: 'Pending', count: counts.pending },
          { key: 'processing', label: 'Processing', count: counts.processing },
          { key: 'shipped', label: 'Shipped', count: counts.shipped },
          { key: 'delivered', label: 'Delivered', count: counts.delivered },
          { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          { key: 'refunded', label: 'Refunded', count: counts.refunded },
        ].map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={status === tab.key}
            onClick={() => {
              setStatus(tab.key);
              setPage(1);
            }}
            className={`order-status-tab-btn ${status === tab.key ? 'active' : ''}`}
          >
            <span>{tab.label}</span>
            <span className="tab-count-pill">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* 4. Main Card: Toolbar + Table / Mobile Cards + Pagination */}
      <div className="orders-table-card">
        {/* Search & Filter Toolbar */}
        {showFiltersBar && (
          <div className="orders-filter-toolbar">
            <div className="orders-search-input-wrap">
              <Search size={15} color="var(--admin-text-secondary)" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID, customer name, email, phone..."
                className="orders-search-input"
                aria-label="Search orders"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="orders-search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="orders-filter-dropdowns">
              {/* Payment Status Filter */}
              <select
                value={paymentStatus}
                onChange={(e) => {
                  setPaymentStatus(e.target.value);
                  setPage(1);
                }}
                className="orders-select-field"
                aria-label="Filter by payment status"
              >
                <option value="all">All Payments</option>
                <option value="paid">Payment: Paid</option>
                <option value="pending">Payment: Pending</option>
                <option value="failed">Payment: Failed</option>
                <option value="refunded">Payment: Refunded</option>
              </select>

              {/* Sort Filter */}
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="orders-select-field"
                aria-label="Sort orders"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="highest">Sort: Highest Value</option>
                <option value="lowest">Sort: Lowest Value</option>
              </select>

              {/* Clear Filters Button */}
              {(debouncedSearch || status !== 'all' || paymentStatus !== 'all' || sort !== 'newest') && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn-clear-filters"
                  aria-label="Clear all applied filters"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="orders-table-wrapper">
          <table className="orders-luxury-table">
            <thead>
              <tr>
                <th scope="col">ORDER</th>
                <th scope="col">CUSTOMER</th>
                <th scope="col">ITEMS</th>
                <th scope="col">TOTAL</th>
                <th scope="col">PAYMENT</th>
                <th scope="col">FULFILMENT</th>
                <th scope="col">DATE</th>
                <th scope="col" style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skel-${idx}`}>
                    <td colSpan={8} style={{ padding: '16px 20px' }}>
                      <div
                        style={{
                          height: '24px',
                          background: '#F5EEE9',
                          borderRadius: '6px',
                          animation: 'pulse 1.5s infinite',
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="orders-empty-state-box">
                      <div className="empty-state-icon-bubble">
                        <ShoppingBag size={28} />
                      </div>
                      <h3 className="empty-state-title">No orders found</h3>
                      <p className="empty-state-desc">
                        {debouncedSearch || status !== 'all' || paymentStatus !== 'all'
                          ? 'No customer orders match your current filter criteria.'
                          : 'Customer orders will appear here once your store receives its first order.'}
                      </p>
                      {(debouncedSearch || status !== 'all' || paymentStatus !== 'all') ? (
                        <button
                          type="button"
                          onClick={clearAllFilters}
                          className="btn-luxury-secondary"
                          style={{ marginTop: '8px' }}
                        >
                          <RotateCcw size={13} />
                          <span>Reset Filters</span>
                        </button>
                      ) : (
                        <Link href="/shop" target="_blank" className="btn-luxury-primary" style={{ marginTop: '8px' }}>
                          <ExternalLink size={13} />
                          <span>View Store</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const itemCount =
                    order.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) ||
                    order.items?.length ||
                    1;
                  const firstItem = order.items?.[0];
                  const cleanOrderId = order.id.startsWith('#') ? order.id : `#${order.id}`;

                  return (
                    <tr key={order.id}>
                      {/* ORDER */}
                      <td>
                        <div className="order-id-cell-wrap">
                          <button
                            type="button"
                            onClick={() => openOrderDrawer(order.id)}
                            className="order-id-title"
                            style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
                            aria-label={`View details for order ${cleanOrderId}`}
                          >
                            {cleanOrderId}
                          </button>
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td>
                        <div className="order-customer-cell">
                          <div className="customer-avatar-initials" aria-hidden="true">
                            {getInitials(order.customerName)}
                          </div>
                          <div className="customer-info-stack">
                            <span className="customer-name-txt">{order.customerName || 'Customer'}</span>
                            <span className="customer-email-txt">{order.email || '—'}</span>
                          </div>
                        </div>
                      </td>

                      {/* ITEMS */}
                      <td>
                        <div className="order-items-cell">
                          <div className="order-item-thumbnail-mini" aria-hidden="true">
                            {firstItem?.image ? (
                              <Image
                                src={firstItem.image}
                                alt={firstItem.name || 'Jewellery'}
                                width={34}
                                height={34}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                unoptimized
                              />
                            ) : (
                              <ShoppingBag size={14} color="var(--admin-text-secondary)" />
                            )}
                          </div>
                          <span className="order-item-count-badge">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>

                      {/* TOTAL */}
                      <td>
                        <strong style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                          ₹{Number(order.amount || 0).toLocaleString('en-IN')}
                        </strong>
                      </td>

                      {/* PAYMENT STATUS */}
                      <td>
                        <span className={`badge-payment-status ${order.paymentStatus || 'pending'}`}>
                          {(order.paymentStatus || 'pending').toUpperCase()}
                        </span>
                      </td>

                      {/* FULFILMENT STATUS */}
                      <td>
                        <span className={`badge-fulfilment-status ${order.status || 'processing'}`}>
                          {(order.status || 'processing').toUpperCase()}
                        </span>
                      </td>

                      {/* DATE */}
                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>
                          {order.date || '—'}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => openOrderDrawer(order.id)}
                          className="order-view-action-btn"
                          aria-label={`View order ${cleanOrderId}`}
                        >
                          <Eye size={13} />
                          <span>View →</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards Layout */}
        <div className="mobile-orders-cards-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--admin-text-secondary)' }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-empty-state-box">
              <ShoppingBag size={24} />
              <p>No orders found.</p>
            </div>
          ) : (
            orders.map((order) => {
              const itemCount =
                order.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) ||
                order.items?.length ||
                1;
              const cleanOrderId = order.id.startsWith('#') ? order.id : `#${order.id}`;

              return (
                <div key={`m-${order.id}`} className="mobile-order-card-item">
                  <div className="mobile-card-top-row">
                    <button
                      type="button"
                      onClick={() => openOrderDrawer(order.id)}
                      className="order-id-title"
                      style={{ background: 'none', border: 'none', padding: 0 }}
                    >
                      {cleanOrderId}
                    </button>
                    <strong style={{ color: 'var(--admin-text-primary)' }}>
                      ₹{Number(order.amount || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div className="order-customer-cell">
                    <div className="customer-avatar-initials">
                      {getInitials(order.customerName)}
                    </div>
                    <div className="customer-info-stack">
                      <span className="customer-name-txt">{order.customerName || 'Customer'}</span>
                      <span className="customer-email-txt">{order.email}</span>
                    </div>
                  </div>

                  <div className="mobile-card-badges-row">
                    <span className={`badge-payment-status ${order.paymentStatus || 'pending'}`}>
                      {(order.paymentStatus || 'pending').toUpperCase()}
                    </span>
                    <span className={`badge-fulfilment-status ${order.status || 'processing'}`}>
                      {(order.status || 'processing').toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-secondary)', marginLeft: 'auto' }}>
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '4px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--admin-border-light)',
                    }}
                  >
                    <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-secondary)' }}>
                      {order.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => openOrderDrawer(order.id)}
                      className="order-view-action-btn"
                    >
                      <Eye size={13} />
                      <span>View Order →</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. Pagination Row */}
        {total > 0 && (
          <div className="orders-pagination-row">
            <span className="pagination-summary-text">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} orders
            </span>

            <div className="pagination-controls-group">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="pagination-pill-btn"
                aria-label="Previous page"
              >
                <ChevronLeft size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Only show around current page if there are many pages
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`pagination-page-number ${page === pageNum ? 'active' : ''}`}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={page === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="pagination-pill-btn"
                aria-label="Next page"
              >
                Next
                <ChevronRight size={13} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 2 }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Order Details Drawer (Right-side Slide-in Panel) */}
      {drawerOpen && (
        <div
          className="order-drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeOrderDrawer();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Order Details"
        >
          <div className="order-drawer-panel">
            {/* Drawer Header */}
            <div className="drawer-header-row">
              <div className="drawer-header-left">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 className="drawer-order-id">
                    {selectedOrder?.id?.startsWith('#') ? selectedOrder.id : `#${selectedOrder?.id}`}
                  </h2>
                  <Link
                    href={`/admin/orders/${encodeURIComponent((selectedOrder?.id || '').replace('#', ''))}`}
                    target="_blank"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.74rem',
                      color: 'var(--admin-accent-rose)',
                      textDecoration: 'none',
                    }}
                    title="Open in dedicated page"
                  >
                    <span>Full Page</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
                <span className="drawer-order-date">
                  Placed on {selectedOrder?.date || '—'}
                </span>
              </div>

              <button
                type="button"
                onClick={closeOrderDrawer}
                className="drawer-close-btn"
                aria-label="Close order details drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="drawer-scroll-body">
              {drawerLoading || !selectedOrder ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                  Loading order details...
                </div>
              ) : (
                <>
                  {/* Visual Order Timeline Stepper */}
                  <div className="drawer-card-box">
                    <h3 className="drawer-card-title">
                      <span>Order Progress</span>
                      <span className={`badge-fulfilment-status ${selectedOrder.status}`}>
                        {selectedOrder.status?.toUpperCase()}
                      </span>
                    </h3>

                    <div className="visual-timeline-stepper">
                      <div className="visual-timeline-track" />
                      {getTimelineSteps(selectedOrder.status).map((step, idx) => (
                        <div key={step.key} className={`timeline-step-node ${step.state}`}>
                          <div className="timeline-step-circle">
                            {step.state === 'completed' ? '✓' : idx + 1}
                          </div>
                          <span className="timeline-step-label">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Update Control */}
                  <div className="drawer-card-box">
                    <h3 className="drawer-card-title">Update Fulfilment Status</h3>
                    <div className="drawer-status-update-row">
                      <div className="update-field-group">
                        <label className="update-field-label" htmlFor="drawer-status-select">
                          Change Status
                        </label>
                        <select
                          id="drawer-status-select"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="update-input-control"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing (In Workshop)</option>
                          <option value="shipped">Shipped (In Transit)</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled & Refunded</option>
                        </select>
                      </div>

                      <div className="update-field-group">
                        <label className="update-field-label" htmlFor="drawer-timeline-note">
                          Tracking / Note (Optional)
                        </label>
                        <input
                          id="drawer-timeline-note"
                          type="text"
                          value={timelineNote}
                          onChange={(e) => setTimelineNote(e.target.value)}
                          placeholder="e.g. Dispatched via BlueDart AWB #9283104"
                          className="update-input-control"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleUpdateStatus}
                        disabled={updatingStatus}
                        className="btn-update-order-status"
                      >
                        {updatingStatus ? 'Updating Database...' : 'Update Status in MongoDB'}
                      </button>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="drawer-card-box">
                    <h3 className="drawer-card-title">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={15} color="var(--admin-accent-rose)" />
                        Customer Information
                      </span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--admin-text-primary)' }}>
                        {selectedOrder.customerName || 'Guest Customer'}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                        Email: {selectedOrder.email || '—'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                        Phone: {selectedOrder.phone || '—'}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: '1px solid var(--admin-border-light)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 12,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'var(--admin-text-secondary)',
                            display: 'block',
                            marginBottom: 4,
                          }}
                        >
                          Shipping Address
                        </span>
                        <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-primary)', margin: 0, lineHeight: 1.4 }}>
                          {selectedOrder.shippingAddress?.addressLine || '—'}<br />
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{' '}
                          {selectedOrder.shippingAddress?.postalCode}<br />
                          {selectedOrder.shippingAddress?.country || 'India'}
                        </p>
                      </div>

                      <div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'var(--admin-text-secondary)',
                            display: 'block',
                            marginBottom: 4,
                          }}
                        >
                          Payment & Method
                        </span>
                        <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-primary)', margin: 0, lineHeight: 1.4 }}>
                          Method: {selectedOrder.paymentMethod || 'Razorpay UPI'}<br />
                          Status:{' '}
                          <span className={`badge-payment-status ${selectedOrder.paymentStatus}`}>
                            {(selectedOrder.paymentStatus || 'paid').toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="drawer-card-box">
                    <h3 className="drawer-card-title">
                      <span>Ordered Items ({selectedOrder.items?.length || 0})</span>
                    </h3>

                    <div className="drawer-items-list">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={`d-item-${idx}`} className="drawer-item-row">
                          <div className="drawer-item-thumb">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={44}
                                height={44}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                unoptimized
                              />
                            ) : (
                              <ShoppingBag size={18} color="var(--admin-text-secondary)" />
                            )}
                          </div>

                          <div className="drawer-item-info">
                            <span className="drawer-item-title">{item.name}</span>
                            <span className="drawer-item-meta">
                              SKU: {item.sku || 'MK-SILVER'} • Qty: {item.quantity} × ₹
                              {Number(item.price || 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <span className="drawer-item-subtotal">
                            ₹{(Number(item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="drawer-card-box">
                    <h3 className="drawer-card-title">Order Financials</h3>
                    <div className="drawer-financials-stack">
                      <div className="drawer-fin-line">
                        <span>Items Subtotal</span>
                        <span>₹{Number(selectedOrder.subtotal || selectedOrder.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="drawer-fin-line">
                        <span>GST (3% Sterling Silver)</span>
                        <span>₹{Number(selectedOrder.tax || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="drawer-fin-line">
                        <span>Insured Delivery</span>
                        <span>{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
                      </div>
                      {selectedOrder.discount ? (
                        <div className="drawer-fin-line" style={{ color: 'var(--admin-success)' }}>
                          <span>Promotional Discount</span>
                          <span>-₹{Number(selectedOrder.discount).toLocaleString('en-IN')}</span>
                        </div>
                      ) : null}
                      <div className="drawer-fin-line total-line">
                        <span>Grand Total</span>
                        <span style={{ color: 'var(--admin-accent-rose)' }}>
                          ₹{Number(selectedOrder.amount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Audit / Timeline History */}
                  {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                    <div className="drawer-card-box">
                      <h3 className="drawer-card-title">Activity Trail</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selectedOrder.timeline.map((entry, idx) => (
                          <div
                            key={`hist-${idx}`}
                            style={{
                              padding: '8px 12px',
                              background: '#ffffff',
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                              <strong style={{ color: 'var(--admin-text-primary)' }}>{entry.status}</strong>
                              <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.72rem' }}>
                                {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            <span style={{ color: 'var(--admin-text-secondary)' }}>{entry.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Create Manual Order Modal */}
      {createModalOpen && (
        <div
          className="order-drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Create Manual Order"
        >
          <div
            className="order-drawer-panel"
            style={{ maxWidth: '620px', borderRadius: '18px 0 0 18px' }}
          >
            <div className="drawer-header-row">
              <div className="drawer-header-left">
                <h2 className="drawer-order-id">+ Create Manual Order</h2>
                <span className="drawer-order-date">
                  Direct entry into MongoDB collection
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="drawer-close-btn"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="drawer-scroll-body">
              <div className="drawer-card-box">
                <h3 className="drawer-card-title">Customer Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="update-field-group">
                    <label className="update-field-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newOrderForm.customerName}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                      placeholder="e.g. Radhika Singhal"
                      className="update-input-control"
                    />
                  </div>
                  <div className="update-field-group">
                    <label className="update-field-label">Email *</label>
                    <input
                      type="email"
                      required
                      value={newOrderForm.email}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, email: e.target.value })}
                      placeholder="customer@domain.com"
                      className="update-input-control"
                    />
                  </div>
                  <div className="update-field-group" style={{ gridColumn: 'span 2' }}>
                    <label className="update-field-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newOrderForm.phone}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                      placeholder="+91 98290 12345"
                      className="update-input-control"
                    />
                  </div>
                </div>
              </div>

              <div className="drawer-card-box">
                <h3 className="drawer-card-title">Jewellery Item Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                  <div className="update-field-group">
                    <label className="update-field-label">Item Title</label>
                    <input
                      type="text"
                      required
                      value={newOrderForm.productName}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, productName: e.target.value })}
                      className="update-input-control"
                    />
                  </div>
                  <div className="update-field-group">
                    <label className="update-field-label">SKU</label>
                    <input
                      type="text"
                      value={newOrderForm.sku}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, sku: e.target.value })}
                      className="update-input-control"
                    />
                  </div>
                  <div className="update-field-group">
                    <label className="update-field-label">Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={newOrderForm.price}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, price: Number(e.target.value) })}
                      className="update-input-control"
                    />
                  </div>
                  <div className="update-field-group">
                    <label className="update-field-label">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={newOrderForm.quantity}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: Number(e.target.value) })}
                      className="update-input-control"
                    />
                  </div>
                </div>
              </div>

              <div className="drawer-card-box">
                <h3 className="drawer-card-title">Delivery Address</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    type="text"
                    required
                    placeholder="Street Address / Flat No"
                    value={newOrderForm.addressLine}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, addressLine: e.target.value })}
                    className="update-input-control"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newOrderForm.city}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, city: e.target.value })}
                      className="update-input-control"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newOrderForm.state}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, state: e.target.value })}
                      className="update-input-control"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={newOrderForm.postalCode}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, postalCode: e.target.value })}
                      className="update-input-control"
                    />
                  </div>
                </div>
              </div>

              <div className="drawer-card-box">
                <h3 className="drawer-card-title">Payment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="update-field-group">
                    <label className="update-field-label">Payment Method</label>
                    <select
                      value={newOrderForm.paymentMethod}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })}
                      className="update-input-control"
                    >
                      <option value="Razorpay UPI">Razorpay UPI</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Credit / Debit Card">Credit / Debit Card</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </div>
                  <div className="update-field-group">
                    <label className="update-field-label">Payment Status</label>
                    <select
                      value={newOrderForm.paymentStatus}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentStatus: e.target.value })}
                      className="update-input-control"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingOrder}
                className="btn-luxury-primary"
                style={{ padding: '12px', justifyContent: 'center', marginTop: 10 }}
              >
                {creatingOrder ? 'Saving Order in MongoDB...' : 'Save & Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
