'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Boxes,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/format';

function SafeThumb({
  src,
  alt,
  className,
  width,
  height,
}: {
  src?: string;
  alt: string;
  className: string;
  width: number;
  height: number;
}) {
  const [error, setError] = useState(false);
  const initials = alt ? alt.trim().slice(0, 2).toUpperCase() : 'MK';

  if (error || !src) {
    return (
      <div className="cat-fallback-badge">
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');
  const [categoryMetric, setCategoryMetric] = useState<'revenue' | 'products' | 'orders'>('revenue');
  const [activePoint, setActivePoint] = useState<number | null>(5); // Default active on Sep 30
  const [greeting, setGreeting] = useState('Good Morning');
  const [adminName, setAdminName] = useState('Rachit');

  useEffect(() => {
    // Dynamic time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch Admin Analytics data
    fetch('/api/admin/analytics')
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData) setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin analytics:', err);
        setLoading(false);
      });

    // Fetch Authenticated Admin Name
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((meData) => {
        if (meData?.user?.name) {
          const firstName = meData.user.name.split(' ')[0];
          setAdminName(firstName);
        }
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading-skeleton">
        <div className="skeleton-hero" />
        <div className="skeleton-grid-4">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
        <div className="skeleton-grid-split">
          <div className="skeleton-chart" />
          <div className="skeleton-categories" />
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalRevenue: 3998,
    revenueGrowth: '+12.5%',
    totalOrders: 1,
    ordersGrowth: '+8.2%',
    totalCustomers: 12,
    customersGrowth: '+14.3%',
    totalProducts: 17,
    productsGrowth: '+6.1%',
  };

  const chartDays =
    data?.chartDays && data.chartDays.length > 0
      ? data.chartDays
      : [
          { date: 'Sep 25', revenue: 0, orders: 0 },
          { date: 'Sep 26', revenue: 0, orders: 0 },
          { date: 'Sep 27', revenue: 0, orders: 0 },
          { date: 'Sep 28', revenue: 3998, orders: 1 },
          { date: 'Sep 29', revenue: 0, orders: 0 },
          { date: 'Sep 30', revenue: 42350, orders: 4 },
          { date: 'Oct 1', revenue: 0, orders: 0 },
        ];

  const topCategories =
    data?.topCategories && data.topCategories.length > 0
      ? data.topCategories
      : [
          { name: 'Rings', productCount: 6, revenueShare: 35, image: '/images/collection-rings.jpg' },
          { name: 'Necklaces', productCount: 5, revenueShare: 29, image: '/images/collection-necklaces.jpg' },
          { name: 'Bracelets', productCount: 2, revenueShare: 12, image: 'https://images.unsplash.com/photo-1611591475871-3bc6e0b74052?q=80&w=300' },
          { name: 'Pendants', productCount: 2, revenueShare: 12, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300' },
          { name: 'Earrings', productCount: 1, revenueShare: 6, image: '/images/collection-earrings.jpg' },
        ];

  const recentOrders =
    data?.recentOrders && data.recentOrders.length > 0
      ? data.recentOrders
      : [
          {
            id: '#MKT12341',
            customerName: 'Karan Verma',
            items: [{ name: 'Silver Ring' }],
            amount: 3998,
            status: 'cancelled',
            date: 'Sep 28, 2026',
            image: '/images/collection-rings.jpg',
          },
          {
            id: '#MKT12340',
            customerName: 'Priya Sharma',
            items: [{ name: 'Necklace' }, { name: 'Earrings' }],
            amount: 5499,
            status: 'processing',
            date: 'Sep 27, 2026',
            image: '/images/collection-necklaces.jpg',
          },
          {
            id: '#MKT12339',
            customerName: 'Amit Patel',
            items: [{ name: 'Polki Chandbali' }],
            amount: 2699,
            status: 'delivered',
            date: 'Sep 26, 2026',
            image: '/images/collection-earrings.jpg',
          },
          {
            id: '#MKT12338',
            customerName: 'Neha Singh',
            items: [{ name: '1' }, { name: '2' }, { name: '3' }],
            amount: 7499,
            status: 'shipped',
            date: 'Sep 25, 2026',
            image: 'https://images.unsplash.com/photo-1611591475871-3bc6e0b74052?q=80&w=300',
          },
          {
            id: '#MKT12337',
            customerName: 'Rohit Mehta',
            items: [{ name: 'Lotus Pendant' }],
            amount: 1999,
            status: 'delivered',
            date: 'Sep 24, 2026',
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300',
          },
        ];

  const lowStockList =
    data?.lowStockList && data.lowStockList.length > 0
      ? data.lowStockList
      : [
          { id: '1', name: 'Ruby Drop Pendant', sku: 'MK-PEN-103', stock: 5, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300' },
          { id: '2', name: 'Classic Silver Bangles Set', sku: 'MK-BAN-201', stock: 3, image: 'https://images.unsplash.com/photo-1611591475871-3bc6e0b74052?q=80&w=300' },
          { id: '3', name: 'Pearl Drop Earrings', sku: 'MK-EAR-092', stock: 4, image: '/images/collection-earrings.jpg' },
          { id: '4', name: 'Minimal Chain Necklace', sku: 'MK-NEC-075', stock: 6, image: '/images/collection-necklaces.jpg' },
          { id: '5', name: 'Floral Ring', sku: 'MK-RIN-011', stock: 2, image: '/images/collection-rings.jpg' },
        ];

  // SVG Chart Coordinates & Interactive Tooltip Data
  const chartCoordinates = [
    { x: 35, y: 200, val: 0, date: 'Sep 25' },
    { x: 135, y: 190, val: 0, date: 'Sep 26' },
    { x: 235, y: 175, val: 0, date: 'Sep 27' },
    { x: 335, y: 145, val: 3998, date: 'Sep 28' },
    { x: 435, y: 120, val: 24500, date: 'Sep 29' },
    { x: 535, y: 70, val: 42350, date: 'Sep 30' },
    { x: 635, y: 110, val: 18200, date: 'Oct 1' },
  ];

  const activeCoord = activePoint !== null ? chartCoordinates[activePoint] : chartCoordinates[5];

  return (
    <div className="dashboard-content-flow">
      {/* ============================================================ */}
      {/* 1. DASHBOARD HERO BANNER                                     */}
      {/* ============================================================ */}
      <section className="dashboard-hero-banner">
        <div className="hero-left-content">
          <h1 className="hero-greeting">
            {greeting}, {adminName}! <span className="greeting-wave">👋</span>
          </h1>
          <p className="hero-subtext">Here&apos;s what&apos;s happening with your store today.</p>
        </div>

        {/* Center / Right Editorial Quote */}
        <div className="hero-quote-box">
          <span className="quote-ornament left">⤚</span>
          <span className="quote-text">“Beautiful Jewellery Builds Brighter Stories”</span>
          <span className="quote-ornament right">⤙</span>
        </div>

        {/* Subtle Decorative Jewellery Background Overlay */}
        <div className="hero-jewellery-backdrop" aria-hidden="true" />
      </section>

      {/* ============================================================ */}
      {/* 2. KPI CARDS (4 Premium Luxury Cards with Sparklines)        */}
      {/* ============================================================ */}
      <section className="kpi-cards-grid">
        {/* Card 1: Total Revenue */}
        <Link href="/admin/analytics" className="luxury-kpi-card" title="View revenue analytics">
          <div className="kpi-card-inner">
            <div className="kpi-left-col">
              <div className="kpi-top-row">
                <div className="kpi-icon-bubble">
                  <span className="kpi-currency-symbol">₹</span>
                </div>
                <span className="kpi-label">Total Revenue</span>
              </div>
              <div className="kpi-metric-number">{formatPrice(kpis.totalRevenue)}</div>
              <div className="kpi-trend-row">
                <span className="trend-badge positive">
                  <ArrowUpRight size={12} />
                  <span>{kpis.revenueGrowth}</span>
                </span>
                <span className="trend-caption">vs last 30 days</span>
              </div>
            </div>

            {/* Vertical Bar Sparkline */}
            <div className="sparkline-bars" aria-hidden="true">
              <span className="bar" style={{ height: '30%' }} />
              <span className="bar" style={{ height: '45%' }} />
              <span className="bar" style={{ height: '40%' }} />
              <span className="bar" style={{ height: '65%' }} />
              <span className="bar" style={{ height: '80%' }} />
              <span className="bar active" style={{ height: '98%' }} />
            </div>
          </div>
        </Link>

        {/* Card 2: Total Orders */}
        <Link href="/admin/orders" className="luxury-kpi-card" title="View all orders">
          <div className="kpi-card-inner">
            <div className="kpi-left-col">
              <div className="kpi-top-row">
                <div className="kpi-icon-bubble">
                  <ShoppingBag size={15} />
                </div>
                <span className="kpi-label">Total Orders</span>
              </div>
              <div className="kpi-metric-number">{kpis.totalOrders}</div>
              <div className="kpi-trend-row">
                <span className="trend-badge positive">
                  <ArrowUpRight size={12} />
                  <span>{kpis.ordersGrowth}</span>
                </span>
                <span className="trend-caption">vs last 30 days</span>
              </div>
            </div>

            <div className="sparkline-bars" aria-hidden="true">
              <span className="bar" style={{ height: '40%' }} />
              <span className="bar" style={{ height: '50%' }} />
              <span className="bar" style={{ height: '45%' }} />
              <span className="bar" style={{ height: '70%' }} />
              <span className="bar" style={{ height: '75%' }} />
              <span className="bar active" style={{ height: '90%' }} />
            </div>
          </div>
        </Link>

        {/* Card 3: Total Customers */}
        <Link href="/admin/customers" className="luxury-kpi-card" title="View customer directory">
          <div className="kpi-card-inner">
            <div className="kpi-left-col">
              <div className="kpi-top-row">
                <div className="kpi-icon-bubble">
                  <Users size={15} />
                </div>
                <span className="kpi-label">Total Customers</span>
              </div>
              <div className="kpi-metric-number">{kpis.totalCustomers.toLocaleString('en-IN')}</div>
              <div className="kpi-trend-row">
                <span className="trend-badge positive">
                  <ArrowUpRight size={12} />
                  <span>{kpis.customersGrowth}</span>
                </span>
                <span className="trend-caption">vs last 30 days</span>
              </div>
            </div>

            <div className="sparkline-bars" aria-hidden="true">
              <span className="bar" style={{ height: '35%' }} />
              <span className="bar" style={{ height: '40%' }} />
              <span className="bar" style={{ height: '60%' }} />
              <span className="bar" style={{ height: '55%' }} />
              <span className="bar" style={{ height: '80%' }} />
              <span className="bar active" style={{ height: '95%' }} />
            </div>
          </div>
        </Link>

        {/* Card 4: Total Products */}
        <Link href="/admin/products" className="luxury-kpi-card" title="Manage catalog products">
          <div className="kpi-card-inner">
            <div className="kpi-left-col">
              <div className="kpi-top-row">
                <div className="kpi-icon-bubble">
                  <Package size={15} />
                </div>
                <span className="kpi-label">Total Products</span>
              </div>
              <div className="kpi-metric-number">{kpis.totalProducts}</div>
              <div className="kpi-trend-row">
                <span className="trend-badge positive">
                  <ArrowUpRight size={12} />
                  <span>{kpis.productsGrowth}</span>
                </span>
                <span className="trend-caption">vs last 30 days</span>
              </div>
            </div>

            <div className="sparkline-bars" aria-hidden="true">
              <span className="bar" style={{ height: '50%' }} />
              <span className="bar" style={{ height: '60%' }} />
              <span className="bar" style={{ height: '65%' }} />
              <span className="bar" style={{ height: '70%' }} />
              <span className="bar" style={{ height: '80%' }} />
              <span className="bar active" style={{ height: '92%' }} />
            </div>
          </div>
        </Link>
      </section>

      {/* ============================================================ */}
      {/* 3. MIDDLE ROW: Revenue Overview (Left) & Top Categories (Right)*/}
      {/* ============================================================ */}
      <section className="dashboard-grid-split">
        {/* Revenue Overview Card */}
        <div className="luxury-card revenue-card">
          <div className="card-top-header">
            <div className="card-title-stack">
              <h2 className="card-title">Revenue Overview</h2>
              <p className="card-subtitle">Track your store performance over time</p>
            </div>

            <div className="card-controls-pill">
              <select
                value={chartMetric}
                onChange={(e) => setChartMetric(e.target.value as any)}
                className="header-select-pill"
                aria-label="Filter chart metric"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
              </select>
            </div>
          </div>

          {/* SVG Smooth Curved Area Chart with Tooltip Pin */}
          <div className="chart-wrapper">
            <div className="chart-y-axis">
              <span>₹60K</span>
              <span>₹40K</span>
              <span>₹20K</span>
              <span>0</span>
            </div>

            <div className="chart-svg-viewport">
              <svg viewBox="0 0 680 220" className="chart-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="roseAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#B76E79" stopOpacity="0.28" />
                    <stop offset="65%" stopColor="#B76E79" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#B76E79" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Dashed Grid Lines */}
                <line x1="0" y1="40" x2="680" y2="40" stroke="#F0E8E2" strokeDasharray="3 3" />
                <line x1="0" y1="95" x2="680" y2="95" stroke="#F0E8E2" strokeDasharray="3 3" />
                <line x1="0" y1="150" x2="680" y2="150" stroke="#F0E8E2" strokeDasharray="3 3" />
                <line x1="0" y1="205" x2="680" y2="205" stroke="#EADED6" />

                {/* Smooth Gradient Fill Path */}
                <path
                  d="M 35 200
                     C 85 195, 110 190, 135 190
                     C 185 185, 210 180, 235 175
                     C 285 165, 310 150, 335 145
                     C 385 135, 410 125, 435 120
                     C 485 90, 510 70, 535 70
                     C 585 90, 610 110, 635 110
                     L 635 205 L 35 205 Z"
                  fill="url(#roseAreaGradient)"
                />

                {/* Smooth Stroke Line */}
                <path
                  d="M 35 200
                     C 85 195, 110 190, 135 190
                     C 185 185, 210 180, 235 175
                     C 285 165, 310 150, 335 145
                     C 385 135, 410 125, 435 120
                     C 485 90, 510 70, 535 70
                     C 585 90, 610 110, 635 110"
                  fill="none"
                  stroke="#B76E79"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />

                {/* Tooltip Vertical Dashed Anchor on Active Point (Sep 30) */}
                <line
                  x1={activeCoord.x}
                  y1={activeCoord.y}
                  x2={activeCoord.x}
                  y2="205"
                  stroke="#B76E79"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />

                {/* Data Points */}
                {chartCoordinates.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === activePoint ? 5 : 3.5}
                    fill="#FFFFFF"
                    stroke="#B76E79"
                    strokeWidth={i === activePoint ? 2.5 : 1.8}
                    className="chart-dot"
                    onClick={() => setActivePoint(i)}
                  />
                ))}
              </svg>

              {/* Floating Tooltip Pin (Sep 30 / ₹42,350) */}
              <div
                className="chart-floating-tooltip"
                style={{
                  left: `${(activeCoord.x / 680) * 100}%`,
                  top: `${(activeCoord.y / 220) * 100}%`,
                }}
              >
                <div className="tooltip-amount">
                  {chartMetric === 'revenue' ? `₹${activeCoord.val.toLocaleString('en-IN')}` : `${activeCoord.val} orders`}
                </div>
                <div className="tooltip-date">{activeCoord.date}, 2026</div>
              </div>

              {/* X-Axis Labels */}
              <div className="chart-x-axis">
                {chartDays.map((d: any, idx: number) => (
                  <span
                    key={idx}
                    className={`x-label ${idx === activePoint ? 'is-active' : ''}`}
                    onClick={() => setActivePoint(idx)}
                  >
                    {d.date}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories Card */}
        <div className="luxury-card categories-card">
          <div className="card-top-header">
            <h2 className="card-title">Top Categories</h2>
            <div className="card-controls-pill">
              <select
                value={categoryMetric}
                onChange={(e) => setCategoryMetric(e.target.value as any)}
                className="header-select-pill"
                aria-label="Filter categories metric"
              >
                <option value="revenue">By Revenue</option>
                <option value="products">By Products</option>
                <option value="orders">By Orders</option>
              </select>
            </div>
          </div>

          <div className="categories-list">
            {topCategories.map((cat: any, i: number) => (
              <div key={i} className="category-item-row">
                <div className="cat-thumbnail-frame">
                  <SafeThumb
                    src={cat.image}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="cat-img"
                  />
                </div>
                <div className="cat-info-stack">
                  <span className="cat-title">{cat.name}</span>
                  <span className="cat-count-sub">{cat.productCount} products</span>
                </div>
                <div className="cat-bar-stack">
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${Math.min(cat.revenueShare || 15, 100)}%` }}
                    />
                  </div>
                  <span className="cat-pct-label">{cat.revenueShare || 10}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. BOTTOM ROW: Recent Orders (Left) & Low Stock (Right)      */}
      {/* ============================================================ */}
      <section className="dashboard-grid-split">
        {/* Recent Orders Table Card */}
        <div className="luxury-card orders-card">
          <div className="card-top-header">
            <h2 className="card-title">Recent Orders</h2>
            <Link href="/admin/orders" className="view-all-link">
              <span>View All Orders</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="orders-table-container">
            <table className="luxury-data-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td>
                      <div className="order-id-cell">
                        <div className="order-thumb-wrap">
                          <SafeThumb
                            src={order.image || '/images/collection-rings.jpg'}
                            alt="Product preview"
                            width={32}
                            height={32}
                            className="order-thumb-img"
                          />
                        </div>
                        <span className="order-id-code">{order.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="customer-name">{order.customerName}</span>
                    </td>
                    <td>
                      <span className="items-count-tag">
                        {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>
                    <td>
                      <strong className="order-amount">₹{order.amount?.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <span className={`status-pill status-${order.status?.toLowerCase()}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="order-date">{order.date}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/orders/${encodeURIComponent(order.id.replace('#', ''))}`}
                        className="order-view-pill-btn"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Products Card */}
        <div className="luxury-card low-stock-card">
          <div className="card-top-header">
            <h2 className="card-title">Low Stock Products</h2>
            <Link href="/admin/inventory" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="low-stock-list">
            {lowStockList.map((item: any) => (
              <div key={item.id} className="low-stock-row">
                <div className="product-thumb-frame">
                  <SafeThumb
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="product-thumb-img"
                  />
                </div>
                <div className="product-info-stack">
                  <span className="product-name">{item.name}</span>
                  <span className="product-sku">{item.sku}</span>
                </div>
                <span className="stock-warning-badge">{item.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. COMPACT QUICK ACTIONS TOOLBAR                             */}
      {/* ============================================================ */}
      <section className="quick-actions-strip">
        <span className="quick-actions-label">Quick Actions:</span>
        <div className="actions-buttons-row">
          <Link href="/admin/products" className="qa-btn">
            <Plus size={14} />
            <span>Add Product</span>
          </Link>
          <Link href="/admin/categories" className="qa-btn">
            <Layers size={14} />
            <span>Add Category</span>
          </Link>
          <Link href="/admin/collections" className="qa-btn">
            <Sparkles size={14} />
            <span>Create Collection</span>
          </Link>
          <Link href="/admin/orders" className="qa-btn">
            <ShoppingBag size={14} />
            <span>View Orders</span>
          </Link>
          <Link href="/admin/inventory" className="qa-btn">
            <Boxes size={14} />
            <span>Manage Inventory</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
