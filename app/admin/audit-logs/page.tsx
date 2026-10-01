'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar, 
  User, 
  Layers, 
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.adminName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(search.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    if (action.includes('CREATED')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.includes('DELETED')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (action.includes('UPDATED') || action.includes('ADJUSTED')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (action.includes('LOGIN')) return 'bg-sky-50 text-sky-700 border-sky-200';
    return 'bg-stone-50 text-stone-700 border-stone-200';
  };

  const exportCSV = () => {
    const headers = ['Timestamp', 'Admin Name', 'Admin Email', 'Action', 'Resource', 'Resource ID', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.adminName}"`,
      `"${l.adminEmail}"`,
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900 tracking-tight">Security & Audit Logs</h1>
          <p className="text-sm text-stone-500">Immutable chronological trail of administrative actions, pricing edits, and access</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLogs}
            className="p-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportCSV}
            disabled={filteredLogs.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-medium rounded-xl transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by admin name, action, resource, or details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79] bg-white text-stone-700"
          >
            <option value="all">All Actions</option>
            <option value="PRODUCT_CREATED">Product Created</option>
            <option value="PRODUCT_UPDATED">Product Updated</option>
            <option value="PRICE_UPDATED">Price Updated</option>
            <option value="STOCK_ADJUSTED">Stock Adjusted</option>
            <option value="PRODUCT_DELETED">Product Deleted</option>
            <option value="SETTINGS_UPDATED">Settings Updated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-500 font-medium uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Resource</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B76E79]" />
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No audit records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-stone-900">{log.adminName}</div>
                      <div className="text-[11px] text-stone-400">{log.adminEmail}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-stone-800">{log.resource}</div>
                      <div className="text-[10px] text-stone-400 font-mono">ID: {log.resourceId}</div>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="text-stone-600 truncate" title={log.details}>
                        {log.details}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
