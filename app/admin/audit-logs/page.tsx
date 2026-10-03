'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck,
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar, 
  Users, 
  LogIn,
  FileText,
  Package,
  Settings as SettingsIcon,
  Trash2,
  FolderOpen,
  Image as ImageIcon,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  AlertCircle,
  X,
  Tag,
  Clock
} from 'lucide-react';

interface AuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Inspector Modal
  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const fetchLogs = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/audit-logs?limit=500');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setTotalCount(data.total || data.logs.length);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter calculations
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search
      const searchLower = search.toLowerCase().trim();
      const matchesSearch = !searchLower || (
        (log.adminName && log.adminName.toLowerCase().includes(searchLower)) ||
        (log.adminEmail && log.adminEmail.toLowerCase().includes(searchLower)) ||
        (log.action && log.action.toLowerCase().includes(searchLower)) ||
        (log.resource && log.resource.toLowerCase().includes(searchLower)) ||
        (log.resourceId && log.resourceId.toLowerCase().includes(searchLower)) ||
        (log.details && log.details.toLowerCase().includes(searchLower))
      );

      // Action Filter
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;

      // Resource Filter
      const matchesResource = resourceFilter === 'all' || 
        log.resource.toLowerCase() === resourceFilter.toLowerCase();

      // Date Filter
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateFilter === 'today') {
          matchesDate = logDate >= startOfToday;
        } else if (dateFilter === 'yesterday') {
          const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
          matchesDate = logDate >= startOfYesterday && logDate < startOfToday;
        } else if (dateFilter === 'last7') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= sevenDaysAgo;
        } else if (dateFilter === 'last30') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= thirtyDaysAgo;
        } else if (dateFilter === 'thisMonth') {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          matchesDate = logDate >= startOfMonth;
        }
      }

      return matchesSearch && matchesAction && matchesResource && matchesDate;
    });
  }, [logs, search, actionFilter, resourceFilter, dateFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, actionFilter, resourceFilter, dateFilter, pageSize]);

  // KPI Metrics Calculation (strictly based on real logs)
  const metrics = useMemo(() => {
    const totalEvents = totalCount || logs.length;
    const adminActions = logs.filter(l => l.action !== 'ADMIN_LOGIN').length;
    const loginEvents = logs.filter(l => l.action === 'ADMIN_LOGIN').length;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const changesToday = logs.filter(l => new Date(l.timestamp) >= startOfToday).length;

    return { totalEvents, adminActions, loginEvents, changesToday };
  }, [logs, totalCount]);

  // Dynamic Action Options from actual dataset
  const availableActions = useMemo(() => {
    const actionsSet = new Set<string>();
    logs.forEach(l => {
      if (l.action) actionsSet.add(l.action);
    });
    return Array.from(actionsSet);
  }, [logs]);

  // Dynamic Resource Options from actual dataset
  const availableResources = useMemo(() => {
    const resSet = new Set<string>();
    logs.forEach(l => {
      if (l.resource) resSet.add(l.resource);
    });
    return Array.from(resSet);
  }, [logs]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setActionFilter('all');
    setResourceFilter('all');
    setDateFilter('all');
  };

  const hasActiveFilters = Boolean(search || actionFilter !== 'all' || resourceFilter !== 'all' || dateFilter !== 'all');

  // Copy Resource ID
  const handleCopyId = (idText: string) => {
    navigator.clipboard.writeText(idText);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // CSV Export
  const exportCSV = () => {
    setExporting(true);
    try {
      const headers = ['Timestamp', 'Admin Name', 'Admin Email', 'Action', 'Resource', 'Resource ID', 'Details'];
      const rows = filteredLogs.map(l => [
        `"${new Date(l.timestamp).toISOString()}"`,
        `"${l.adminName.replace(/"/g, '""')}"`,
        `"${l.adminEmail.replace(/"/g, '""')}"`,
        `"${l.action}"`,
        `"${l.resource}"`,
        `"${l.resourceId}"`,
        `"${l.details.replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `mk_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (e) {
      console.error('Export CSV error:', e);
    } finally {
      setExporting(false);
    }
  };

  // Render Action Badge
  const renderActionBadge = (action: string) => {
    const actUpper = action.toUpperCase();

    if (actUpper === 'ADMIN_LOGIN') {
      return (
        <span className="action-pill action-login">
          <Shield size={12} className="pill-icon" />
          <span>Admin Login</span>
        </span>
      );
    }
    if (actUpper.includes('DELETED')) {
      const label = actUpper === 'PRODUCT_DELETED' ? 'Product Deleted' : actUpper === 'MEDIA_DELETED' ? 'Media Deleted' : 'Record Deleted';
      return (
        <span className="action-pill action-deleted">
          <Trash2 size={12} className="pill-icon" />
          <span>{label}</span>
        </span>
      );
    }
    if (actUpper.includes('CREATED')) {
      const label = actUpper === 'PRODUCT_CREATED' ? 'Product Created' : 'Item Created';
      return (
        <span className="action-pill action-created">
          <Package size={12} className="pill-icon" />
          <span>{label}</span>
        </span>
      );
    }
    if (actUpper.includes('UPLOADED')) {
      return (
        <span className="action-pill action-uploaded">
          <ImageIcon size={12} className="pill-icon" />
          <span>Media Uploaded</span>
        </span>
      );
    }
    if (actUpper.includes('SETTINGS')) {
      return (
        <span className="action-pill action-settings">
          <SettingsIcon size={12} className="pill-icon" />
          <span>Settings Updated</span>
        </span>
      );
    }
    if (actUpper.includes('PRICE') || actUpper.includes('STOCK') || actUpper.includes('UPDATED')) {
      return (
        <span className="action-pill action-updated">
          <Tag size={12} className="pill-icon" />
          <span>{action.replace(/_/g, ' ')}</span>
        </span>
      );
    }

    return (
      <span className="action-pill action-default">
        <span>{action.replace(/_/g, ' ')}</span>
      </span>
    );
  };

  // Render Resource Icon
  const renderResourceIcon = (resource: string) => {
    const resLower = resource.toLowerCase();
    if (resLower.includes('auth')) return <Shield size={15} className="res-icon" />;
    if (resLower.includes('product')) return <Package size={15} className="res-icon" />;
    if (resLower.includes('setting')) return <SettingsIcon size={15} className="res-icon" />;
    if (resLower.includes('media') || resLower.includes('image')) return <ImageIcon size={15} className="res-icon" />;
    if (resLower.includes('order')) return <FolderOpen size={15} className="res-icon" />;
    return <FileText size={15} className="res-icon" />;
  };

  // Format Timestamp
  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const datePart = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const timePart = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return { datePart, timePart };
    } catch {
      return { datePart: isoString, timePart: '' };
    }
  };

  return (
    <div className="audit-logs-workspace">
      {/* ========================================================
          1. PAGE HEADER ROW
         ======================================================== */}
      <header className="page-header-row">
        <div className="header-titles">
          <h1 className="page-heading">Security & Audit Logs</h1>
          <p className="page-subheading">
            Immutable chronological record of administrative actions, pricing edits, and access events.
          </p>
        </div>

        <div className="header-actions-group">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchLogs(true)}
            disabled={refreshing || loading}
            className="btn-refresh"
            title="Refresh audit events"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={exportCSV}
            disabled={exporting || filteredLogs.length === 0}
            className="btn-export-primary"
            title="Export filtered audit logs as CSV"
          >
            {exporting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Exporting...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check size={14} />
                <span>Exported ✓</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================
          2. KPI SUMMARY CARDS
         ======================================================== */}
      <section className="kpi-cards-grid">
        {/* Total Events */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-wrap">
              <Shield size={16} />
            </div>
            <div className="kpi-sparkline" aria-hidden="true">
              <span className="spark-bar" style={{ height: '35%' }} />
              <span className="spark-bar" style={{ height: '55%' }} />
              <span className="spark-bar" style={{ height: '40%' }} />
              <span className="spark-bar" style={{ height: '75%' }} />
              <span className="spark-bar active-bar" style={{ height: '100%' }} />
            </div>
          </div>
          <div className="kpi-label">TOTAL EVENTS</div>
          <div className="kpi-value">{metrics.totalEvents.toLocaleString()}</div>
        </div>

        {/* Admin Actions */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-wrap">
              <Users size={16} />
            </div>
            <div className="kpi-sparkline" aria-hidden="true">
              <span className="spark-bar" style={{ height: '45%' }} />
              <span className="spark-bar" style={{ height: '60%' }} />
              <span className="spark-bar" style={{ height: '50%' }} />
              <span className="spark-bar" style={{ height: '80%' }} />
              <span className="spark-bar active-bar" style={{ height: '90%' }} />
            </div>
          </div>
          <div className="kpi-label">ADMIN ACTIONS</div>
          <div className="kpi-value">{metrics.adminActions.toLocaleString()}</div>
        </div>

        {/* Login Events */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-wrap">
              <LogIn size={16} />
            </div>
            <div className="kpi-sparkline" aria-hidden="true">
              <span className="spark-bar" style={{ height: '30%' }} />
              <span className="spark-bar" style={{ height: '45%' }} />
              <span className="spark-bar" style={{ height: '40%' }} />
              <span className="spark-bar" style={{ height: '65%' }} />
              <span className="spark-bar active-bar" style={{ height: '85%' }} />
            </div>
          </div>
          <div className="kpi-label">LOGIN EVENTS</div>
          <div className="kpi-value">{metrics.loginEvents.toLocaleString()}</div>
        </div>

        {/* Changes Today */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-wrap">
              <FileText size={16} />
            </div>
            <div className="kpi-sparkline" aria-hidden="true">
              <span className="spark-bar" style={{ height: '20%' }} />
              <span className="spark-bar" style={{ height: '35%' }} />
              <span className="spark-bar" style={{ height: '50%' }} />
              <span className="spark-bar" style={{ height: '70%' }} />
              <span className="spark-bar active-bar" style={{ height: '95%' }} />
            </div>
          </div>
          <div className="kpi-label">CHANGES TODAY</div>
          <div className="kpi-value">{metrics.changesToday.toLocaleString()}</div>
        </div>
      </section>

      {/* ========================================================
          3. FILTER TOOLBAR
         ======================================================== */}
      <section className="filter-toolbar-card">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by admin name, action, resource or details..."
            className="filter-text-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="clear-search-btn"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Action Dropdown */}
        <div className="select-wrapper">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="custom-filter-select"
          >
            <option value="all">All Actions</option>
            {availableActions.map(action => (
              <option key={action} value={action}>
                {action.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>

        {/* Resource Dropdown */}
        <div className="select-wrapper">
          <select
            value={resourceFilter}
            onChange={e => setResourceFilter(e.target.value)}
            className="custom-filter-select"
          >
            <option value="all">All Resources</option>
            {availableResources.map(res => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>

        {/* Date Filter Dropdown */}
        <div className="select-wrapper">
          <Calendar size={14} className="date-icon" />
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="custom-filter-select with-date-icon"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="btn-clear-filters"
          >
            Clear Filters
          </button>
        )}
      </section>

      {/* ========================================================
          4. ENTERPRISE AUDIT TABLE
         ======================================================== */}
      <section className="table-container-card">
        <div className="table-responsive-scroll">
          <table className="audit-table">
            <thead>
              <tr>
                <th style={{ width: '135px' }}>TIMESTAMP</th>
                <th style={{ width: '210px' }}>ADMINISTRATOR</th>
                <th style={{ width: '175px' }}>ACTION</th>
                <th style={{ width: '175px' }}>RESOURCE</th>
                <th>DETAILS</th>
                <th style={{ width: '50px', textAlign: 'center' }}>···</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton Rows
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="skeleton-row">
                    <td>
                      <div className="skel-box skel-w-80" />
                      <div className="skel-box skel-w-50 skel-mt-4" />
                    </td>
                    <td>
                      <div className="skel-admin-group">
                        <div className="skel-avatar" />
                        <div>
                          <div className="skel-box skel-w-100" />
                          <div className="skel-box skel-w-70 skel-mt-4" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="skel-pill" />
                    </td>
                    <td>
                      <div className="skel-box skel-w-80" />
                      <div className="skel-box skel-w-60 skel-mt-4" />
                    </td>
                    <td>
                      <div className="skel-box skel-w-full" />
                    </td>
                    <td>
                      <div className="skel-dot" />
                    </td>
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={6} className="empty-state-cell">
                    <div className="empty-state-box">
                      <div className="empty-icon-ring">
                        <ShieldCheck size={28} />
                      </div>
                      <h3 className="empty-title">No audit events found</h3>
                      <p className="empty-desc">No administrative activity matches your current filters or date range.</p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="btn-empty-clear"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Real Data Rows
                paginatedLogs.map((log) => {
                  const { datePart, timePart } = formatTimestamp(log.timestamp);
                  const initials = log.adminName
                    ? log.adminName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'AD';

                  return (
                    <tr
                      key={log.id}
                      className="audit-row"
                      onClick={() => setInspectLog(log)}
                    >
                      {/* Timestamp */}
                      <td className="cell-timestamp">
                        <div className="ts-date">{datePart}</div>
                        <div className="ts-time">{timePart}</div>
                      </td>

                      {/* Administrator */}
                      <td className="cell-administrator">
                        <div className="admin-profile-inline">
                          <div className="admin-avatar-circle" title={log.adminName}>
                            {initials}
                          </div>
                          <div className="admin-text-stack">
                            <span className="admin-name">{log.adminName}</span>
                            <span className="admin-email">{log.adminEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="cell-action">
                        {renderActionBadge(log.action)}
                      </td>

                      {/* Resource */}
                      <td className="cell-resource">
                        <div className="resource-stack">
                          <div className="resource-type-row">
                            {renderResourceIcon(log.resource)}
                            <span className="resource-type-name">{log.resource}</span>
                          </div>
                          <span className="resource-id-tag" title={log.resourceId}>
                            ID: {log.resourceId}
                          </span>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="cell-details">
                        <p className="details-text" title={log.details}>
                          {log.details}
                        </p>
                      </td>

                      {/* Inspect Action */}
                      <td className="cell-action-menu" onClick={(e) => { e.stopPropagation(); setInspectLog(log); }}>
                        <button
                          type="button"
                          className="btn-dots-trigger"
                          title="Inspect full audit record"
                          aria-label="Inspect log"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ========================================================
            5. PAGINATION & FOOTER BAR
           ======================================================== */}
        <div className="table-footer-pagination">
          <div className="pagination-info">
            Showing <strong className="text-black">
              {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>–<strong className="text-black">
              {Math.min(currentPage * pageSize, filteredLogs.length)}
            </strong> of <strong className="text-black">{filteredLogs.length.toLocaleString()}</strong> events
          </div>

          <div className="pagination-controls">
            {/* Prev Button */}
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="page-nav-btn"
              aria-label="Previous Page"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Page Numbers */}
            <div className="page-numbers-list">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  return Math.abs(page - currentPage) <= 1;
                })
                .reduce<(number | string)[]>((acc, page, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === 'number') {
                    const prev = arr[idx - 1] as number;
                    if (page - prev > 1) {
                      acc.push('...');
                    }
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, idx) => {
                  if (typeof item === 'string') {
                    return <span key={`ellipsis-${idx}`} className="page-ellipsis">...</span>;
                  }
                  const isActive = item === currentPage;
                  return (
                    <button
                      key={`page-${item}`}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      className={`page-num-btn ${isActive ? 'page-active' : ''}`}
                    >
                      {item}
                    </button>
                  );
                })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="page-nav-btn"
              aria-label="Next Page"
            >
              <ChevronRight size={15} />
            </button>

            {/* Page Size Dropdown */}
            <div className="page-size-wrap">
              <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                className="page-size-select"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <ChevronDown size={13} className="page-size-arrow" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. ROW INSPECTION MODAL (EXPANDED RECORD)
         ======================================================== */}
      {inspectLog && (
        <div className="modal-backdrop" onClick={() => setInspectLog(null)}>
          <div className="inspect-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-top-left">
                <ShieldCheck size={18} className="modal-shield-icon" />
                <h3 className="modal-heading">Audit Event Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="modal-close-btn"
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Event Badge & Verification Tag */}
              <div className="modal-status-strip">
                <div>{renderActionBadge(inspectLog.action)}</div>
                <span className="mongo-verified-tag">
                  <Check size={12} />
                  <span>Verified MongoDB Record</span>
                </span>
              </div>

              {/* Grid of properties */}
              <div className="inspect-grid">
                <div className="inspect-field">
                  <span className="field-caption">TIMESTAMP (LOCAL)</span>
                  <span className="field-data font-mono">
                    {new Date(inspectLog.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'full',
                      timeStyle: 'medium'
                    })}
                  </span>
                </div>

                <div className="inspect-field">
                  <span className="field-caption">ISO 8601 STRING</span>
                  <span className="field-data font-mono">{inspectLog.timestamp}</span>
                </div>

                <div className="inspect-field">
                  <span className="field-caption">ADMINISTRATOR</span>
                  <span className="field-data font-semibold text-black">{inspectLog.adminName}</span>
                </div>

                <div className="inspect-field">
                  <span className="field-caption">ADMIN EMAIL</span>
                  <span className="field-data">{inspectLog.adminEmail}</span>
                </div>

                <div className="inspect-field">
                  <span className="field-caption">RESOURCE TYPE</span>
                  <span className="field-data font-semibold text-black">{inspectLog.resource}</span>
                </div>

                <div className="inspect-field">
                  <span className="field-caption">RESOURCE ID</span>
                  <div className="id-copy-row">
                    <span className="field-data font-mono text-xs">{inspectLog.resourceId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(inspectLog.resourceId)}
                      className="btn-copy-id"
                      title="Copy resource ID"
                    >
                      {copiedId ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>{copiedId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="inspect-field col-span-2">
                  <span className="field-caption">EVENT DETAILS & AUDIT LOG PAYLOAD</span>
                  <div className="details-payload-box">
                    {inspectLog.details}
                  </div>
                </div>

                <div className="inspect-field col-span-2">
                  <span className="field-caption">MONGODB DOCUMENT ID</span>
                  <span className="field-data font-mono text-xs text-stone-500">{inspectLog.id}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer-bar">
              <span className="modal-immutable-note">
                <Clock size={13} />
                <span>Append-only immutable record</span>
              </span>
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="btn-modal-dismiss"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. SCOPED LUXURY MONOCHROME STYLES
         ======================================================== */}
      <style jsx>{`
        .audit-logs-workspace {
          max-width: 1320px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
          font-family: var(--font-ui), 'Jost', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #171717;
          box-sizing: border-box;
        }

        /* 1. PAGE HEADER */
        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-titles {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .page-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 2.6vw, 2.35rem);
          font-weight: 600;
          color: #111111;
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.15;
        }

        .page-subheading {
          font-size: 0.88rem;
          color: #6F6B65;
          margin: 0;
          line-height: 1.4;
        }

        .header-actions-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-refresh {
          height: 40px;
          padding: 0 16px;
          background: #FFFFFF;
          border: 1px solid #E8E5DF;
          color: #171717;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s ease;
        }
        .btn-refresh:hover:not(:disabled) {
          background-color: #FAF9F6;
          border-color: #D8D4CC;
        }

        .btn-export-primary {
          height: 40px;
          padding: 0 18px;
          background: #111111;
          border: 1px solid #111111;
          color: #FFFFFF;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: all 0.15s ease;
        }
        .btn-export-primary:hover:not(:disabled) {
          background-color: #252525;
          border-color: #252525;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }
        .btn-export-primary:disabled, .btn-refresh:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* 2. KPI CARDS */
        .kpi-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .kpi-card {
          background: #FFFFFF;
          border: 1px solid #E8E5DF;
          border-radius: 12px;
          padding: 16px 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .kpi-card:hover {
          border-color: #D8D4CC;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .kpi-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #FAF9F6;
          border: 1px solid #E8E5DF;
          color: #171717;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-sparkline {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 24px;
        }
        .spark-bar {
          width: 4px;
          background-color: #E8E5DF;
          border-radius: 2px;
        }
        .active-bar {
          background-color: #111111;
        }

        .kpi-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #6F6B65;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .kpi-value {
          font-size: 1.65rem;
          font-weight: 700;
          color: #111111;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        /* 3. FILTER TOOLBAR */
        .filter-toolbar-card {
          background: #FFFFFF;
          border: 1px solid #E8E5DF;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 260px;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: #9A958D;
          pointer-events: none;
        }

        .filter-text-input {
          width: 100%;
          height: 42px;
          padding-left: 38px;
          padding-right: 32px;
          border: 1px solid #E8E5DF;
          background-color: #FAF9F6;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.84rem;
          color: #111111;
          outline: none;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }
        .filter-text-input::placeholder {
          color: #9A958D;
        }
        .filter-text-input:focus {
          background-color: #FFFFFF;
          border-color: #111111;
          box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.06);
        }

        .clear-search-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: #9A958D;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .clear-search-btn:hover {
          color: #111111;
        }

        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .date-icon {
          position: absolute;
          left: 12px;
          color: #6F6B65;
          pointer-events: none;
        }

        .custom-filter-select {
          height: 42px;
          padding-left: 14px;
          padding-right: 32px;
          border: 1px solid #E8E5DF;
          background-color: #FFFFFF;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 500;
          color: #171717;
          outline: none;
          cursor: pointer;
          appearance: none;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .custom-filter-select.with-date-icon {
          padding-left: 34px;
        }
        .custom-filter-select:hover {
          border-color: #D8D4CC;
          background-color: #FAF9F6;
        }
        .custom-filter-select:focus {
          border-color: #111111;
          box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.06);
        }

        .select-arrow {
          position: absolute;
          right: 12px;
          color: #6F6B65;
          pointer-events: none;
        }

        .btn-clear-filters {
          height: 42px;
          padding: 0 14px;
          border: 1px solid #E8E5DF;
          background-color: #FFFFFF;
          color: #6F6B65;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .btn-clear-filters:hover {
          background-color: #FAF9F6;
          color: #111111;
          border-color: #D8D4CC;
        }

        /* 4. TABLE STYLING */
        .table-container-card {
          background: #FFFFFF;
          border: 1px solid #E8E5DF;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .table-responsive-scroll {
          overflow-x: auto;
          width: 100%;
        }

        .audit-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
          text-align: left;
        }

        .audit-table th {
          background-color: #FAF9F6;
          border-bottom: 1px solid #E8E5DF;
          padding: 13px 18px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #6F6B65;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .audit-row {
          border-bottom: 1px solid #F2F0EA;
          cursor: pointer;
          transition: background-color 0.12s ease;
        }
        .audit-row:hover {
          background-color: #FAF9F6;
        }

        .audit-table td {
          padding: 14px 18px;
          vertical-align: middle;
        }

        /* Timestamp Cell */
        .cell-timestamp {
          white-space: nowrap;
        }
        .ts-date {
          font-size: 0.82rem;
          font-weight: 600;
          color: #111111;
        }
        .ts-time {
          font-size: 0.72rem;
          color: #6F6B65;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          margin-top: 2px;
        }

        /* Administrator Cell */
        .admin-profile-inline {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #FAF9F6;
          border: 1px solid #E8E5DF;
          color: #111111;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.04em;
        }
        .admin-text-stack {
          display: flex;
          flex-direction: column;
        }
        .admin-name {
          font-size: 0.84rem;
          font-weight: 600;
          color: #111111;
          line-height: 1.25;
        }
        .admin-email {
          font-size: 0.72rem;
          color: #6F6B65;
        }

        /* Action Badges */
        .action-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 500;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .pill-icon {
          flex-shrink: 0;
        }

        .action-login {
          background-color: #F4F4F2;
          border-color: #E5E5E0;
          color: #171717;
        }
        .action-created {
          background-color: #F0FDF4;
          border-color: #DCFCE7;
          color: #166534;
        }
        .action-deleted {
          background-color: #FEF2F2;
          border-color: #FEE2E2;
          color: #991B1B;
        }
        .action-uploaded {
          background-color: #EFF6FF;
          border-color: #DBEAFE;
          color: #1D4ED8;
        }
        .action-settings {
          background-color: #F5F3FF;
          border-color: #EDE9FE;
          color: #5B21B6;
        }
        .action-updated {
          background-color: #FFFBEB;
          border-color: #FEF3C7;
          color: #92400E;
        }
        .action-default {
          background-color: #FAF9F6;
          border-color: #E8E5DF;
          color: #171717;
        }

        /* Resource Cell */
        .resource-stack {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .resource-type-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #111111;
        }
        .res-icon {
          color: #6F6B65;
          flex-shrink: 0;
        }
        .resource-id-tag {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.7rem;
          color: #6F6B65;
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Details Cell */
        .details-text {
          margin: 0;
          font-size: 0.82rem;
          color: #252525;
          line-height: 1.45;
          max-width: 440px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Dots Trigger */
        .btn-dots-trigger {
          background: none;
          border: 1px solid transparent;
          border-radius: 6px;
          color: #9A958D;
          padding: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .btn-dots-trigger:hover {
          color: #111111;
          background-color: #FAF9F6;
          border-color: #E8E5DF;
        }

        /* SKELETON STYLES */
        .skeleton-row td {
          padding: 16px 18px;
        }
        .skel-box {
          height: 12px;
          background: #E8E5DF;
          border-radius: 4px;
          animation: skelPulse 1.2s ease-in-out infinite;
        }
        .skel-w-80 { width: 80px; }
        .skel-w-50 { width: 50px; }
        .skel-w-70 { width: 70px; }
        .skel-w-100 { width: 100px; }
        .skel-w-60 { width: 60px; }
        .skel-w-full { width: 90%; }
        .skel-mt-4 { margin-top: 6px; }
        .skel-admin-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .skel-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #E8E5DF;
          animation: skelPulse 1.2s ease-in-out infinite;
        }
        .skel-pill {
          width: 100px;
          height: 24px;
          border-radius: 6px;
          background: #E8E5DF;
          animation: skelPulse 1.2s ease-in-out infinite;
        }
        .skel-dot {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: #E8E5DF;
          animation: skelPulse 1.2s ease-in-out infinite;
          margin: 0 auto;
        }

        @keyframes skelPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }

        /* EMPTY STATE */
        .empty-state-cell {
          padding: 56px 20px !important;
          text-align: center;
        }
        .empty-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          max-width: 320px;
          margin: 0 auto;
        }
        .empty-icon-ring {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FAF9F6;
          border: 1px solid #E8E5DF;
          color: #9A958D;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .empty-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
        }
        .empty-desc {
          font-size: 0.8rem;
          color: #6F6B65;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }
        .btn-empty-clear {
          padding: 7px 16px;
          background: #111111;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
        }

        /* 5. TABLE FOOTER & PAGINATION */
        .table-footer-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid #E8E5DF;
          background-color: #FFFFFF;
          gap: 16px;
          flex-wrap: wrap;
        }

        .pagination-info {
          font-size: 0.8rem;
          color: #6F6B65;
        }
        .text-black {
          color: #111111;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-nav-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #E8E5DF;
          background: #FFFFFF;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .page-nav-btn:hover:not(:disabled) {
          background-color: #FAF9F6;
          border-color: #D8D4CC;
        }
        .page-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-numbers-list {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-num-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 8px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: #6F6B65;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .page-num-btn:hover {
          background-color: #FAF9F6;
          color: #111111;
        }
        .page-num-btn.page-active {
          background-color: #111111;
          color: #FFFFFF;
          font-weight: 600;
        }

        .page-ellipsis {
          padding: 0 4px;
          color: #9A958D;
          font-size: 0.8rem;
        }

        .page-size-wrap {
          position: relative;
          display: flex;
          align-items: center;
          margin-left: 6px;
        }

        .page-size-select {
          height: 32px;
          padding-left: 10px;
          padding-right: 26px;
          border: 1px solid #E8E5DF;
          background: #FFFFFF;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #171717;
          cursor: pointer;
          outline: none;
          appearance: none;
        }
        .page-size-select:hover {
          border-color: #D8D4CC;
        }
        .page-size-arrow {
          position: absolute;
          right: 8px;
          color: #6F6B65;
          pointer-events: none;
        }

        /* 6. INSPECTION MODAL */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 17, 17, 0.45);
          backdrop-filter: blur(2px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .inspect-modal-card {
          width: min(92%, 620px);
          background: #FFFFFF;
          border: 1px solid #E8E5DF;
          border-radius: 14px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.16);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: modalPop 0.2s ease;
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid #E8E5DF;
          background-color: #FAF9F6;
        }
        .modal-top-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .modal-shield-icon {
          color: #111111;
        }
        .modal-heading {
          font-size: 1.05rem;
          font-weight: 700;
          color: #111111;
          margin: 0;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: #6F6B65;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-close-btn:hover {
          color: #111111;
          background-color: #E8E5DF;
        }

        .modal-body-scroll {
          padding: 22px 24px;
          max-height: 70vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .modal-status-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid #F2F0EA;
        }

        .mongo-verified-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          color: #2F7D63;
          background-color: #F0FDF4;
          border: 1px solid #DCFCE7;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .inspect-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .col-span-2 {
          grid-column: 1 / -1;
        }

        .inspect-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .field-caption {
          font-size: 0.68rem;
          font-weight: 600;
          color: #6F6B65;
          letter-spacing: 0.05em;
        }
        .field-data {
          font-size: 0.84rem;
          color: #252525;
          word-break: break-word;
        }

        .id-copy-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-copy-id {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          background-color: #FAF9F6;
          border: 1px solid #E8E5DF;
          border-radius: 5px;
          font-size: 0.72rem;
          color: #171717;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-copy-id:hover {
          background-color: #E8E5DF;
        }

        .details-payload-box {
          background-color: #FAF9F6;
          border: 1px solid #E8E5DF;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 0.84rem;
          color: #171717;
          line-height: 1.5;
        }

        .modal-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-top: 1px solid #E8E5DF;
          background-color: #FAF9F6;
        }

        .modal-immutable-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          color: #6F6B65;
        }

        .btn-modal-dismiss {
          padding: 7px 18px;
          background: #111111;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-modal-dismiss:hover {
          background-color: #252525;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 1024px) {
          .kpi-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .page-header-row {
            flex-direction: column;
            align-items: stretch;
          }
          .header-actions-group {
            width: 100%;
          }
          .btn-refresh, .btn-export-primary {
            flex: 1;
            justify-content: center;
          }

          .kpi-cards-grid {
            grid-template-columns: 1fr;
          }

          .filter-toolbar-card {
            flex-direction: column;
            align-items: stretch;
          }
          .search-input-wrapper {
            width: 100%;
          }
          .select-wrapper {
            width: 100%;
          }
          .custom-filter-select {
            width: 100%;
          }
          .btn-clear-filters {
            width: 100%;
            text-align: center;
          }

          .table-footer-pagination {
            flex-direction: column;
            align-items: stretch;
          }
          .pagination-controls {
            justify-content: space-between;
            width: 100%;
            flex-wrap: wrap;
          }
          .inspect-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
