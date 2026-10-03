'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [greeting, setGreeting] = useState('Good Morning');
  const [adminName, setAdminName] = useState('Admin');

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
        if (resData) {
          setData(resData);
          if (resData.chartDays?.length > 0) {
            setActivePoint(resData.chartDays.length - 1);
          }
        }
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

  const kpis = useMemo(() => {
    return data?.kpis || {
      totalRevenue: 0,
      revenueGrowth: null,
      totalOrders: 0,
      ordersGrowth: null,
      totalCustomers: 0,
      customersGrowth: null,
      totalProducts: 0,
      productsGrowth: null,
    };
  }, [data]);

  const chartDays = useMemo(() => data?.chartDays || [], [data]);
  const topCategories = useMemo(() => data?.topCategories || [], [data]);
  const recentOrders = useMemo(() => data?.recentOrders || [], [data]);
  const lowStockList = useMemo(() => data?.lowStockList || [], [data]);

  // Compute dynamic SVG coordinates strictly from real MongoDB data
  const { chartCoordinates, pathD, areaD, hasChartData, maxMetricVal } = useMemo(() => {
    if (!chartDays || chartDays.length === 0) {
      return { chartCoordinates: [], pathD: '', areaD: '', hasChartData: false, maxMetricVal: 0 };
    }

    const values = chartDays.map((d: any) => (chartMetric === 'revenue' ? d.revenue : d.orders));
    const maxVal = Math.max(...values, chartMetric === 'revenue' ? 1000 : 5);
    const hasData = values.some((v: number) => v > 0);

    const coords = chartDays.map((d: any, i: number) => {
      const x = chartDays.length > 1 ? 35 + (i / (chartDays.length - 1)) * 610 : 340;
      const val = chartMetric === 'revenue' ? d.revenue : d.orders;
      const y = 205 - (val / maxVal) * 155;
      return { x, y, val, date: d.date };
    });

    const pD = coords.length > 1
      ? coords.map((pt: any, i: number) => (i === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`)).join(' ')
      : '';
    const aD = coords.length > 1
      ? `${pD} L ${coords[coords.length - 1].x} 205 L ${coords[0].x} 205 Z`
      : '';

    return {
      chartCoordinates: coords,
      pathD: pD,
      areaD: aD,
      hasChartData: hasData,
      maxMetricVal: maxVal,
    };
  }, [chartDays, chartMetric]);

  const activeCoord = useMemo(() => {
    if (activePoint !== null && chartCoordinates[activePoint]) {
      return chartCoordinates[activePoint];
    }
    return chartCoordinates[chartCoordinates.length - 1] || { x: 340, y: 205, val: 0, date: 'Today' };
  }, [activePoint, chartCoordinates]);

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

  return (
    <div className="dashboard-content-flow">
      {/* 1. DASHBOARD HERO BANNER */}
      <section className="dashboard-hero-banner">
        <div className="hero-left-content">
          <h1 className="hero-greeting">
            {greeting.toUpperCase()}, {adminName.toUpperCase()}
          </h1>
          <p className="hero-subtext">Here&apos;s the live executive summary of MK Silver Hub.</p>
        </div>

        <div className="hero-date-badge">
          <span className="hero-date-label">TODAY</span>
          <span className="hero-date-val">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).toUpperCase()}
          </span>
        </div>
      </section>

      {/* 2. KPI CARDS (Real MongoDB Data Only) */}
      <section className="kpi-cards-grid">
        {/* Card 1: Total Revenue */}
        <Link href="/admin/orders" className="luxury-kpi-card" title="View revenue and orders">
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
                {kpis.revenueGrowth ? (
                  <span className="trend-badge positive">
                    <ArrowUpRight size={12} />
                    <span>{kpis.revenueGrowth}</span>
                  </span>
                ) : (
                  <span className="trend-badge neutral">
                    <span>Active verified sales</span>
                  </span>
                )}
                <span className="trend-caption">eligible orders</span>
              </div>
            </div>

            <div className="sparkline-bars" aria-hidden="true">
              <span className="bar" style={{ height: '35%' }} />
              <span className="bar" style={{ height: '50%' }} />
              <span className="bar" style={{ height: '40%' }} />
              <span className="bar" style={{ height: '65%' }} />
              <span className="bar" style={{ height: '80%' }} />
              <span className="bar active" style={{ height: '95%' }} />
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
                {kpis.ordersGrowth ? (
                  <span className="trend-badge positive">
                    <ArrowUpRight size={12} />
                    <span>{kpis.ordersGrowth}</span>
                  </span>
                ) : (
                  <span className="trend-badge neutral">
                    <span>{kpis.totalOrders} placed</span>
                  </span>
                )}
                <span className="trend-caption">in database</span>
              </div>
            </div>

            <div className="sparkline-bars" aria-hidden="true">
              <span className="bar" style={{ height: '40%' }} />
              <span className="bar" style={{ height: '55%' }} />
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
                <span className="trend-badge neutral">
                  <span>Registered patrons</span>
                </span>
                <span className="trend-caption">in directory</span>
              </div>
            </div>

            <div className="sparkline-bars" aria-hidden="true">
              <span className="bar" style={{ height: '35%' }} />
              <span className="bar" style={{ height: '45%' }} />
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
                <span className="trend-badge neutral">
                  <span>{kpis.activeProducts || kpis.totalProducts} active</span>
                </span>
                <span className="trend-caption">in catalogue</span>
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

      {/* 3. MIDDLE ROW: Revenue Overview (Left) & Top Categories (Right) */}
      <section className="dashboard-grid-split">
        {/* Revenue Overview Card */}
        <div className="luxury-card revenue-card">
          <div className="card-top-header">
            <div className="card-title-stack">
              <h2 className="card-title">Revenue Overview</h2>
              <p className="card-subtitle">Real-time daily timeline from verified customer orders</p>
            </div>

            <div className="card-controls-pill">
              <select
                value={chartMetric}
                onChange={(e) => setChartMetric(e.target.value as any)}
                className="header-select-pill"
                aria-label="Filter chart metric"
              >
                <option value="revenue">Revenue (₹)</option>
                <option value="orders">Orders</option>
              </select>
            </div>
          </div>

          <div className="chart-wrapper">
            <div className="chart-y-axis">
              <span>{chartMetric === 'revenue' ? `₹${Math.round(maxMetricVal / 1000)}k` : maxMetricVal}</span>
              <span>{chartMetric === 'revenue' ? `₹${Math.round((maxMetricVal * 0.66) / 1000)}k` : Math.round(maxMetricVal * 0.66)}</span>
              <span>{chartMetric === 'revenue' ? `₹${Math.round((maxMetricVal * 0.33) / 1000)}k` : Math.round(maxMetricVal * 0.33)}</span>
              <span>0</span>
            </div>

            <div className="chart-svg-viewport">
              {!hasChartData ? (
                <div className="empty-chart-box">
                  <TrendingUp size={28} className="text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-800">No revenue data yet</p>
                  <p className="text-xs text-stone-500">Completed storefront orders will dynamically plot on this timeline.</p>
                </div>
              ) : (
                <svg viewBox="0 0 680 220" className="chart-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="monochromeAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#111111" stopOpacity="0.10" />
                      <stop offset="65%" stopColor="#111111" stopOpacity="0.02" />
                      <stop offset="100%" stopColor="#111111" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Dashed Grid Lines */}
                  <line x1="0" y1="40" x2="680" y2="40" stroke="#E8E7E2" strokeDasharray="3 3" />
                  <line x1="0" y1="95" x2="680" y2="95" stroke="#E8E7E2" strokeDasharray="3 3" />
                  <line x1="0" y1="150" x2="680" y2="150" stroke="#E8E7E2" strokeDasharray="3 3" />
                  <line x1="0" y1="205" x2="680" y2="205" stroke="#D8D5CE" />

                  {/* Dynamic Gradient Fill Path */}
                  {areaD && <path d={areaD} fill="url(#monochromeAreaGradient)" />}

                  {/* Dynamic Line Path */}
                  {pathD && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#111111"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Active Tooltip Anchor Line */}
                  {activeCoord && (
                    <line
                      x1={activeCoord.x}
                      y1={activeCoord.y}
                      x2={activeCoord.x}
                      y2="205"
                      stroke="#111111"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Data Points */}
                  {chartCoordinates.map((pt: any, i: number) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={i === activePoint ? 5 : 3.5}
                      fill="#FFFFFF"
                      stroke="#111111"
                      strokeWidth={i === activePoint ? 2.5 : 1.8}
                      className="chart-dot"
                      onClick={() => setActivePoint(i)}
                    />
                  ))}
                </svg>
              )}

              {/* Floating Tooltip */}
              {hasChartData && activeCoord && (
                <div
                  className="chart-floating-tooltip"
                  style={{
                    left: `${Math.min(90, Math.max(10, (activeCoord.x / 680) * 100))}%`,
                    top: `${Math.min(75, Math.max(10, (activeCoord.y / 220) * 100))}%`,
                  }}
                >
                  <div className="tooltip-amount">
                    {chartMetric === 'revenue'
                      ? `₹${activeCoord.val.toLocaleString('en-IN')}`
                      : `${activeCoord.val} orders`}
                  </div>
                  <div className="tooltip-date">{activeCoord.date}</div>
                </div>
              )}

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
            <Link href="/admin/categories" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="categories-list">
            {topCategories.length === 0 ? (
              <div className="empty-sub-card">
                <Layers size={24} className="text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-700">No categories found</p>
                <p className="text-xs text-stone-400 mt-0.5">Create categories in the catalog.</p>
              </div>
            ) : (
              topCategories.map((cat: any, i: number) => (
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
                    <span className="cat-pct-label">{cat.revenueShare || 0}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ROW: Recent Orders (Left) & Low Stock (Right) */}
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-stone-500 text-xs">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order: any) => (
                    <tr key={order.id}>
                      <td>
                        <div className="order-id-cell">
                          <span className="order-id-code font-mono text-xs">{order.id}</span>
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
                        <strong className="order-amount">₹{(order.amount || order.total || 0).toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <span className={`status-pill status-${order.status?.toLowerCase()}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className="order-date">
                          {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—')}
                        </span>
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
                  ))
                )}
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
            {lowStockList.length === 0 ? (
              <div className="empty-sub-card">
                <Boxes size={24} className="text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-800">All inventory levels healthy</p>
                <p className="text-xs text-stone-400 mt-0.5">No products currently below low-stock threshold.</p>
              </div>
            ) : (
              lowStockList.map((item: any) => (
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
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. COMPACT QUICK ACTIONS TOOLBAR */}
      <section className="quick-actions-strip">
        <span className="quick-actions-label">Quick Actions:</span>
        <div className="actions-buttons-row">
          <Link href="/admin/products/new" className="qa-btn">
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
