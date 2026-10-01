'use client';

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  DollarSign, 
  Package, 
  Phone, 
  Share2, 
  ShieldAlert, 
  Save, 
  Check, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface Settings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  freeShippingThreshold: number;
  defaultLowStockThreshold: number;
  supportWhatsApp: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    storeName: 'MK Silver Hub',
    tagline: 'Fine 925 Sterling Jewellery',
    contactEmail: 'care@mksilverhub.com',
    contactPhone: '+91 98765 43210',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 3,
    freeShippingThreshold: 1999,
    defaultLowStockThreshold: 5,
    supportWhatsApp: '+919876543210',
    address: 'B-12, Johari Bazar, Jaipur, Rajasthan 302003',
    instagramUrl: 'https://instagram.com/mksilverhub',
    facebookUrl: 'https://facebook.com/mksilverhub',
    youtubeUrl: 'https://youtube.com/@mksilverhub',
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Store settings successfully saved and synced!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-stone-500">
          <RefreshCw className="w-5 h-5 animate-spin text-[#B76E79]" />
          <span>Loading store settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900 tracking-tight">Store Settings</h1>
          <p className="text-sm text-stone-500">Configure global business information, currencies, tax, shipping, and brand links</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B76E79] hover:bg-[#a05d67] text-white text-sm font-medium rounded-xl shadow-sm transition disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Information */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5F2] flex items-center justify-center text-[#B76E79]">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">General Information</h2>
              <p className="text-xs text-stone-500">Brand identity and official contact details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Store Name *</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Contact Email *</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">Official Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financials */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5F2] flex items-center justify-center text-[#B76E79]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">Currency & Taxes</h2>
              <p className="text-xs text-stone-500">Pricing display, GST, and free shipping limits</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Currency Code</label>
              <input
                type="text"
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={e => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Jewellery GST Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={e => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Free Shipping (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={e => setSettings({ ...settings, freeShippingThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
          </div>
        </div>

        {/* Inventory Defaults */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5F2] flex items-center justify-center text-[#B76E79]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">Inventory Automation</h2>
              <p className="text-xs text-stone-500">Thresholds for low stock triggers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Default Low Stock Alert Threshold</label>
              <input
                type="number"
                value={settings.defaultLowStockThreshold}
                onChange={e => setSettings({ ...settings, defaultLowStockThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
              <p className="text-[11px] text-stone-400 mt-1">Products with inventory at or below this number appear on the Low Stock dashboard widget.</p>
            </div>
          </div>
        </div>

        {/* Social & Support Channels */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5F2] flex items-center justify-center text-[#B76E79]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">Social & Support Links</h2>
              <p className="text-xs text-stone-500">Floating WhatsApp widget and social accounts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Support WhatsApp (with country code)</label>
              <input
                type="text"
                value={settings.supportWhatsApp}
                onChange={e => setSettings({ ...settings, supportWhatsApp: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">YouTube URL</label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79]"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-stone-900">Maintenance Mode</h2>
                <p className="text-xs text-stone-500">Temporarily show a maintenance banner to customer visitors</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B76E79]"></div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
