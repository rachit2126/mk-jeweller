'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Phone, Mail } from 'lucide-react';
import { DbCustomer } from '@/lib/db/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ search });
    fetch(`/api/admin/customers?${params}`)
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers || []);
        setLoading(false);
      });
  }, [search]);

  return (
    <div className="admin-customers-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Customers</h1>
          <p className="page-sub">Manage customer accounts, lifetime spend, order history, and profiles.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="search-bar-row">
          <div className="search-wrap">
            <Search size={15} color="#806D68" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email, or phone..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-wrap">
          <table className="cust-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Total Spend</th>
                <th>Last Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="empty-cell">Loading customers...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="empty-cell">No customers found.</td></tr>
              ) : (
                customers.map((cust) => (
                  <tr key={cust.id}>
                    <td>
                      <div className="cust-lead-col">
                        <span className="cust-name-text">{cust.name}</span>
                        <span className="cust-id-text">ID: {cust.id}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-col">
                        <span className="contact-item"><Mail size={12} /> {cust.email}</span>
                        <span className="contact-item"><Phone size={12} /> {cust.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="orders-badge">{cust.ordersCount} orders</span>
                    </td>
                    <td>
                      <strong className="spend-text">₹{cust.totalSpend?.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <span className="date-text">{cust.lastOrderDate || 'No orders yet'}</span>
                    </td>
                    <td>
                      <span className="status-pill active">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .admin-customers-page { display: flex; flex-direction: column; gap: 20px; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .page-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: #342727; margin: 0; }
        .page-sub { font-size: 0.88rem; color: #806D68; margin: 4px 0 0 0; }
        .table-card { background: #FFFFFF; border: 1px solid #EAE2DB; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03); }
        .search-bar-row { padding: 16px 20px; border-bottom: 1px solid #F0E8E2; }
        .search-wrap { display: flex; align-items: center; gap: 8px; background: #FFF9F3; border: 1px solid #E8D8D0; border-radius: 10px; padding: 7px 14px; width: clamp(240px, 32vw, 400px); }
        .search-input { border: none; background: none; font-size: 0.84rem; outline: none; width: 100%; }
        .table-wrap { overflow-x: auto; }
        .cust-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .cust-table th { text-align: left; padding: 12px 16px; background-color: #FAF7F4; font-size: 0.76rem; text-transform: uppercase; color: #806D68; font-weight: 600; border-bottom: 1px solid #EAE2DB; }
        .cust-table td { padding: 14px 16px; border-bottom: 1px solid #F4EFEB; vertical-align: middle; color: #342727; }
        .cust-lead-col { display: flex; flex-direction: column; }
        .cust-name-text { font-weight: 600; color: #342727; }
        .cust-id-text { font-size: 0.72rem; color: #806D68; }
        .contact-col { display: flex; flex-direction: column; gap: 2px; }
        .contact-item { display: inline-flex; align-items: center; gap: 4px; font-size: 0.76rem; color: #6F5A58; }
        .orders-badge { background-color: #F8F5F2; padding: 3px 8px; border-radius: 6px; font-size: 0.76rem; font-weight: 500; }
        .spend-text { font-size: 0.92rem; }
        .date-text { font-size: 0.78rem; color: #806D68; }
        .status-pill.active { background-color: #E6FFFA; color: #234E52; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; }
        .empty-cell { text-align: center; padding: 40px !important; color: #806D68; }
      `}</style>
    </div>
  );
}
