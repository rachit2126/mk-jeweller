'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  User,
  Phone,
  Mail,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { DbCustomer } from '@/lib/db/types';
import { formatPrice } from '@/lib/format';

interface CustomerResponse {
  customers: DbCustomer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch live customers from MongoDB
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load customers (${res.status})`);
      }

      const data: CustomerResponse = await res.json();
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Unable to load customer records from database.');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, limit]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const getInitials = (name?: string) => {
    if (!name) return 'MK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="admin-customers-flow">
      {/* 1. Header */}
      <div className="page-header-row">
        <div>
          <div className="title-with-count">
            <h1 className="page-heading">Customers</h1>
            {!loading && (
              <span className="customer-count-badge">
                {total} {total === 1 ? 'Customer' : 'Customers'}
              </span>
            )}
          </div>
          <p className="page-sub">
            Manage customer accounts, lifetime spend, order history, and profiles.
          </p>
        </div>
      </div>

      {/* 2. Main Content Card */}
      <div className="table-card">
        {/* Search Toolbar */}
        <div className="search-bar-row">
          <div className="search-wrap">
            <Search size={15} color="#6F6F6A" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email, phone, or ID..."
              className="search-input"
              aria-label="Search customers"
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
        </div>

        {/* Table View */}
        <div className="table-wrap">
          <table className="cust-table">
            <thead>
              <tr>
                <th scope="col">CUSTOMER</th>
                <th scope="col">CONTACT</th>
                <th scope="col">ORDERS</th>
                <th scope="col">TOTAL SPEND</th>
                <th scope="col">LAST ORDER</th>
                <th scope="col">STATUS</th>
                <th scope="col" style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={`skel-${idx}`}>
                    <td colSpan={7} style={{ padding: '16px 20px' }}>
                      <div className="table-skeleton-row" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={7}>
                    <div className="error-state-box">
                      <AlertCircle size={28} color="#DC2626" />
                      <h3 className="error-title">Unable to load customers</h3>
                      <p className="error-desc">{error}</p>
                      <button onClick={fetchCustomers} className="btn-retry">
                        <RotateCcw size={13} />
                        <span>Retry</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state-box">
                      <div className="empty-icon-bubble">
                        <User size={28} strokeWidth={1.5} color="#6F6F6A" />
                      </div>
                      <h3 className="empty-title">
                        {debouncedSearch ? 'No matching customers found' : 'No customers yet'}
                      </h3>
                      <p className="empty-desc">
                        {debouncedSearch
                          ? `No customer records matched "${debouncedSearch}".`
                          : 'Customer accounts will appear here automatically when patrons register on the storefront.'}
                      </p>
                      {debouncedSearch ? (
                        <button onClick={() => setSearch('')} className="btn-reset">
                          <span>Clear Search</span>
                        </button>
                      ) : (
                        <Link href="/shop" target="_blank" className="btn-store">
                          <span>View Store</span>
                          <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((cust) => {
                  const ordersCount = Number(cust.ordersCount) || 0;
                  const ordersText = `${ordersCount} ${ordersCount === 1 ? 'order' : 'orders'}`;

                  return (
                    <tr key={cust.id}>
                      {/* Customer Info */}
                      <td>
                        <div className="cust-lead-col">
                          <div className="cust-avatar-ring">
                            <span>{getInitials(cust.name)}</span>
                          </div>
                          <div className="cust-names-wrap">
                            <Link href={`/admin/customers/${encodeURIComponent(cust.id)}`} className="cust-name-link">
                              {cust.name}
                            </Link>
                            <span className="cust-id-text">ID: {cust.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td>
                        <div className="contact-col">
                          <span className="contact-item">
                            <Mail size={12} color="#6F6F6A" />
                            <span>{cust.email}</span>
                          </span>
                          {cust.phone && (
                            <span className="contact-item">
                              <Phone size={12} color="#6F6F6A" />
                              <span>{cust.phone}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Orders Count */}
                      <td>
                        <span className={`orders-badge ${ordersCount > 0 ? 'has-orders' : 'zero'}`}>
                          {ordersText}
                        </span>
                      </td>

                      {/* Total Spend */}
                      <td>
                        <strong className="spend-text">
                          {formatPrice(cust.totalSpend || 0)}
                        </strong>
                      </td>

                      {/* Last Order Date */}
                      <td>
                        <span className="date-text">
                          {cust.lastOrderDate || 'No orders yet'}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-pill ${cust.status === 'inactive' ? 'inactive' : 'active'}`}>
                          {(cust.status || 'Active').toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/admin/customers/${encodeURIComponent(cust.id)}`}
                          className="btn-view-customer"
                          title={`View ${cust.name} profile and order history`}
                        >
                          <span>View</span>
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Showing page {page} of {totalPages} ({total} total customers)
            </span>
            <div className="pagination-buttons">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-page"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-page"
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-customers-flow { display: flex; flex-direction: column; gap: 20px; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .title-with-count { display: flex; align-items: baseline; gap: 10px; }
        .page-heading { font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif; font-size: 2.1rem; font-weight: 600; color: #111111; margin: 0; line-height: 1.1; }
        .customer-count-badge { font-family: var(--font-ui), 'Jost', sans-serif; font-size: 0.74rem; font-weight: 600; background: #FAF9F6; border: 1px solid #E8E7E2; padding: 2px 8px; border-radius: 6px; color: #6F6F6A; }
        .page-sub { font-family: var(--font-ui), 'Jost', sans-serif; font-size: 0.86rem; color: #6F6F6A; margin: 4px 0 0 0; }

        .table-card { background: #FFFFFF; border: 1px solid #E8E7E2; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); }
        .search-bar-row { padding: 14px 18px; border-bottom: 1px solid #F0EFEA; background: #FFFFFF; }
        .search-wrap { display: flex; align-items: center; gap: 8px; background: #FAF9F6; border: 1px solid #E8E7E2; border-radius: 8px; padding: 7px 12px; width: clamp(260px, 32vw, 420px); transition: border-color 0.15s ease; }
        .search-wrap:focus-within { border-color: #111111; background: #FFFFFF; }
        .search-input { border: none; background: transparent; font-family: var(--font-ui), 'Jost', sans-serif; font-size: 0.82rem; outline: none; width: 100%; color: #111111; }
        .search-input::placeholder { color: #A8A29E; }
        .search-clear-btn { background: none; border: none; padding: 2px; color: #6F6F6A; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .table-wrap { overflow-x: auto; }
        .cust-table { width: 100%; border-collapse: collapse; font-family: var(--font-ui), 'Jost', sans-serif; font-size: 0.84rem; }
        .cust-table th { text-align: left; padding: 11px 16px; background-color: #FAF9F6; font-size: 0.72rem; letter-spacing: 0.04em; text-transform: uppercase; color: #6F6F6A; font-weight: 600; border-bottom: 1px solid #E8E7E2; }
        .cust-table td { padding: 13px 16px; border-bottom: 1px solid #F0EFEA; vertical-align: middle; color: #111111; }
        .cust-table tr:hover td { background-color: #FAFAF8; }

        .cust-lead-col { display: flex; align-items: center; gap: 12px; }
        .cust-avatar-ring { width: 34px; height: 34px; border-radius: 50%; background: #FAF9F6; border: 1px solid #E8E7E2; display: flex; align-items: center; justify-content: center; font-size: 0.74rem; font-weight: 600; color: #111111; flex-shrink: 0; }
        .cust-names-wrap { display: flex; flex-direction: column; gap: 1px; }
        .cust-name-link { font-weight: 600; color: #111111; text-decoration: none; transition: color 0.15s ease; }
        .cust-name-link:hover { color: #6F6F6A; text-decoration: underline; }
        .cust-id-text { font-family: monospace; font-size: 0.7rem; color: #6F6F6A; }

        .contact-col { display: flex; flex-direction: column; gap: 2px; }
        .contact-item { display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #6F6F6A; }

        .orders-badge { display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 6px; font-size: 0.74rem; font-weight: 500; }
        .orders-badge.has-orders { background: #FAF9F6; border: 1px solid #E8E7E2; color: #111111; }
        .orders-badge.zero { color: #A8A29E; }

        .spend-text { font-family: var(--font-ui), 'Jost', sans-serif; font-size: 0.88rem; font-weight: 600; color: #111111; }
        .date-text { font-size: 0.78rem; color: #6F6F6A; }

        .status-pill { display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 6px; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.03em; }
        .status-pill.active { background: #DCFCE7; color: #166534; }
        .status-pill.inactive { background: #F3F4F6; color: #4B5563; }

        .btn-view-customer { display: inline-flex; align-items: center; gap: 4px; font-size: 0.74rem; font-weight: 500; color: #111111; text-decoration: none; padding: 5px 10px; border-radius: 6px; border: 1px solid #E8E7E2; background: #FFFFFF; transition: all 0.15s ease; }
        .btn-view-customer:hover { background: #FAF9F6; border-color: #111111; }

        .table-skeleton-row { height: 26px; background: #F0EFEA; border-radius: 6px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .empty-state-box { text-align: center; padding: 48px 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .empty-icon-bubble { width: 52px; height: 52px; border-radius: 50%; background: #FAF9F6; border: 1px solid #E8E7E2; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
        .empty-title { font-family: var(--font-display), Georgia, serif; font-size: 1.25rem; font-weight: 600; color: #111111; margin: 0; }
        .empty-desc { font-size: 0.82rem; color: #6F6F6A; margin: 0 0 8px 0; max-width: 320px; line-height: 1.4; }
        .btn-reset { background: #FAF9F6; border: 1px solid #E8E7E2; color: #111111; padding: 7px 14px; border-radius: 6px; font-size: 0.78rem; cursor: pointer; }
        .btn-store { display: inline-flex; align-items: center; gap: 5px; background: #111111; color: #FFFFFF; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 0.8rem; font-weight: 500; }

        .error-state-box { text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .error-title { font-family: var(--font-display), serif; font-size: 1.2rem; color: #111111; margin: 0; }
        .error-desc { font-size: 0.82rem; color: #6F6F6A; margin: 0 0 6px; }
        .btn-retry { display: inline-flex; align-items: center; gap: 5px; background: #111111; color: #FFFFFF; border: none; padding: 8px 16px; border-radius: 6px; font-size: 0.78rem; cursor: pointer; }

        .pagination-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-top: 1px solid #F0EFEA; background: #FFFFFF; }
        .pagination-info { font-size: 0.76rem; color: #6F6F6A; }
        .pagination-buttons { display: flex; align-items: center; gap: 6px; }
        .btn-page { width: 30px; height: 30px; border-radius: 6px; border: 1px solid #E8E7E2; background: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #111111; }
        .btn-page:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
