'use client';

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  DollarSign, 
  Package, 
  Share2, 
  Shield, 
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
    storeName: '',
    tagline: '',
    contactEmail: '',
    contactPhone: '',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 3,
    freeShippingThreshold: 0,
    defaultLowStockThreshold: 5,
    supportWhatsApp: '',
    address: '',
    instagramUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (saving) return;

    setSaving(true);
    setMessage(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Store settings successfully saved and synced to database.' });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
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
      <div className="settings-loading-screen">
        <div className="settings-loader-box">
          <RefreshCw className="w-5 h-5 animate-spin text-[#111111]" />
          <span>Loading store settings...</span>
        </div>
        <style jsx>{`
          .settings-loading-screen {
            min-height: 480px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F8F7F3;
          }
          .settings-loader-box {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #6F6F6A;
            font-size: 14px;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="settings-workspace">
      {/* ========================================================
          1. PAGE HEADER ROW
         ======================================================== */}
      <header className="settings-header-row">
        <div className="settings-header-left">
          <h1 className="settings-main-title">Store Settings</h1>
          <p className="settings-main-subtitle">
            Configure global business information, currencies, tax, shipping, and brand links.
          </p>
        </div>

        <div className="settings-header-right">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="save-btn-primary"
            aria-label="Save Settings"
          >
            {saving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check size={15} />
                <span>Saved ✓</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>SAVE SETTINGS</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Status Alert Notification */}
      {message && (
        <div className={`settings-alert-banner ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.type === 'success' ? (
            <Check size={16} className="alert-icon-success" />
          ) : (
            <AlertCircle size={16} className="alert-icon-error" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} noValidate className="settings-cards-stack">
        
        {/* ========================================================
            CARD 1: GENERAL INFORMATION
           ======================================================== */}
        <section className="settings-card">
          <div className="card-header-bar">
            <div className="card-icon-badge">
              <Store size={18} />
            </div>
            <div className="card-header-titles">
              <h2 className="card-heading">General Information</h2>
              <p className="card-subheading">Brand identity and official contact details</p>
            </div>
          </div>

          <div className="grid-2-col">
            <div className="form-field">
              <label htmlFor="setting-storeName" className="form-label">
                Store Name <span className="required-star">*</span>
              </label>
              <input
                id="setting-storeName"
                type="text"
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                placeholder="MK Silver Hub"
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="setting-tagline" className="form-label">
                Tagline
              </label>
              <input
                id="setting-tagline"
                type="text"
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Fine 925 Sterling Jewellery"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="setting-contactEmail" className="form-label">
                Contact Email <span className="required-star">*</span>
              </label>
              <input
                id="setting-contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="care@mksilverhub.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="setting-contactPhone" className="form-label">
                Support Phone
              </label>
              <input
                id="setting-contactPhone"
                type="text"
                value={settings.contactPhone}
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="form-input"
              />
            </div>

            <div className="form-field col-span-full">
              <label htmlFor="setting-address" className="form-label">
                Official Address
              </label>
              <textarea
                id="setting-address"
                rows={3}
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                placeholder="B-12, Johari Bazar, Jaipur, Rajasthan 302003"
                className="form-textarea"
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            CARD 2: CURRENCY & TAXES
           ======================================================== */}
        <section className="settings-card">
          <div className="card-header-bar">
            <div className="card-icon-badge">
              <DollarSign size={18} />
            </div>
            <div className="card-header-titles">
              <h2 className="card-heading">Currency & Taxes</h2>
              <p className="card-subheading">Pricing display, GST, and free shipping limits</p>
            </div>
          </div>

          <div className="grid-2-col">
            <div className="form-field">
              <label htmlFor="setting-currency" className="form-label">
                Currency Code
              </label>
              <input
                id="setting-currency"
                type="text"
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                placeholder="INR"
                className="form-input"
              />
              <span className="field-hint">ISO 4217 standard currency identifier (e.g. INR, USD)</span>
            </div>

            <div className="form-field">
              <label htmlFor="setting-currencySymbol" className="form-label">
                Currency Symbol
              </label>
              <input
                id="setting-currencySymbol"
                type="text"
                value={settings.currencySymbol}
                onChange={e => setSettings({ ...settings, currencySymbol: e.target.value })}
                placeholder="₹"
                className="form-input"
              />
              <span className="field-hint">Prefix symbol displayed next to catalog prices</span>
            </div>

            <div className="form-field">
              <label htmlFor="setting-taxRate" className="form-label">
                Jewellery GST Rate (%)
              </label>
              <input
                id="setting-taxRate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settings.taxRate}
                onChange={e => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                placeholder="3.0"
                className="form-input"
              />
              <span className="field-hint">Indian statutory GST rate for silver jewellery (typically 3%)</span>
            </div>

            <div className="form-field">
              <label htmlFor="setting-freeShippingThreshold" className="form-label">
                Free Shipping (₹)
              </label>
              <input
                id="setting-freeShippingThreshold"
                type="number"
                min="0"
                step="1"
                value={settings.freeShippingThreshold}
                onChange={e => setSettings({ ...settings, freeShippingThreshold: parseInt(e.target.value) || 0 })}
                placeholder="1999"
                className="form-input"
              />
              <span className="field-hint">Minimum cart total required to qualify for complimentary delivery</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            CARD 3: INVENTORY AUTOMATION
           ======================================================== */}
        <section className="settings-card">
          <div className="card-header-bar">
            <div className="card-icon-badge">
              <Package size={18} />
            </div>
            <div className="card-header-titles">
              <h2 className="card-heading">Inventory Automation</h2>
              <p className="card-subheading">Thresholds for low stock triggers</p>
            </div>
          </div>

          <div className="grid-2-col">
            <div className="form-field">
              <label htmlFor="setting-defaultLowStockThreshold" className="form-label">
                Default Low Stock Alert Threshold
              </label>
              <input
                id="setting-defaultLowStockThreshold"
                type="number"
                min="0"
                step="1"
                value={settings.defaultLowStockThreshold}
                onChange={e => setSettings({ ...settings, defaultLowStockThreshold: parseInt(e.target.value) || 0 })}
                placeholder="5"
                className="form-input"
              />
              <p className="field-hint">
                Products with inventory at or below this number appear on the Low Stock dashboard widget.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            CARD 4: SOCIAL & SUPPORT LINKS
           ======================================================== */}
        <section className="settings-card">
          <div className="card-header-bar">
            <div className="card-icon-badge">
              <Share2 size={18} />
            </div>
            <div className="card-header-titles">
              <h2 className="card-heading">Social & Support Links</h2>
              <p className="card-subheading">Floating WhatsApp widget and social accounts</p>
            </div>
          </div>

          <div className="grid-2-col">
            <div className="form-field">
              <label htmlFor="setting-supportWhatsApp" className="form-label">
                Support WhatsApp
              </label>
              <input
                id="setting-supportWhatsApp"
                type="text"
                value={settings.supportWhatsApp}
                onChange={e => setSettings({ ...settings, supportWhatsApp: e.target.value })}
                placeholder="+919876543210"
                className="form-input"
              />
              <span className="field-hint">Format with country code (e.g. +91 98765 43210) for direct WhatsApp chat</span>
            </div>

            <div className="form-field">
              <label htmlFor="setting-instagramUrl" className="form-label">
                Instagram URL
              </label>
              <input
                id="setting-instagramUrl"
                type="url"
                value={settings.instagramUrl}
                onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/mksilverhub"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="setting-facebookUrl" className="form-label">
                Facebook URL
              </label>
              <input
                id="setting-facebookUrl"
                type="url"
                value={settings.facebookUrl}
                onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/mksilverhub"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="setting-youtubeUrl" className="form-label">
                YouTube URL
              </label>
              <input
                id="setting-youtubeUrl"
                type="url"
                value={settings.youtubeUrl}
                onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/@mksilverhub"
                className="form-input"
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            CARD 5: MAINTENANCE MODE
           ======================================================== */}
        <section className="settings-card">
          <div className="card-header-bar">
            <div className="card-icon-badge">
              <Shield size={18} />
            </div>
            <div className="card-header-titles">
              <h2 className="card-heading">Maintenance Mode</h2>
              <p className="card-subheading">Temporarily show a maintenance banner to customer visitors.</p>
            </div>
          </div>

          <div className="maintenance-toggle-row">
            <div className="maintenance-info-text">
              <span className="maintenance-status-label">
                Storefront Status:{' '}
                <strong style={{ color: settings.maintenanceMode ? '#C0392B' : '#1E7E5E' }}>
                  {settings.maintenanceMode ? 'Maintenance Mode Enabled' : 'Live / Operational'}
                </strong>
              </span>
              <p className="maintenance-status-desc">
                {settings.maintenanceMode
                  ? 'Customer visitors see a maintenance notice. Administrators can still access the dashboard.'
                  : 'Your storefront is publicly accessible and processing live customer orders normally.'}
              </p>
            </div>

            {/* Custom Luxury Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={settings.maintenanceMode}
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`luxury-toggle-track ${settings.maintenanceMode ? 'toggle-on' : 'toggle-off'}`}
            >
              <span className={`luxury-toggle-thumb ${settings.maintenanceMode ? 'thumb-on' : 'thumb-off'}`} />
            </button>
          </div>

          {settings.maintenanceMode && (
            <div className="maintenance-active-callout">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px', color: '#111111' }} />
              <span>
                <strong>Warning:</strong> Maintenance mode is currently active. Public storefront visits will be redirected or presented with maintenance messaging until toggled off and saved.
              </span>
            </div>
          )}
        </section>

        {/* ========================================================
            BOTTOM STICKY/VISIBLE ACTION BAR FOR CONVENIENCE
           ======================================================== */}
        <div className="settings-bottom-bar">
          <span className="settings-sync-note">
            Changes will take effect store-wide immediately upon saving.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="save-btn-primary"
            aria-label="Save Settings"
          >
            {saving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check size={15} />
                <span>Saved ✓</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>SAVE SETTINGS</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ========================================================
          PREMIUM MONOCHROME STYLES (MATCHING MK SILVER HUB SYSTEM)
         ======================================================== */}
      <style jsx>{`
        /* PAGE CONTAINER: Natural occupation, centered 1100–1250px */
        .settings-workspace {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 40px 60px 40px;
          box-sizing: border-box;
          font-family: var(--font-ui), 'Jost', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #111111;
        }

        /* HEADER ROW */
        .settings-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .settings-header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .settings-main-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 3vw, 2.35rem);
          font-weight: 600;
          color: #111111;
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.15;
        }

        .settings-main-subtitle {
          font-size: 0.88rem;
          color: #6F6F6A;
          margin: 0;
          line-height: 1.45;
        }

        .settings-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* PRIMARY SAVE BUTTON */
        .save-btn-primary {
          height: 44px;
          padding: 0 22px;
          background-color: #111111;
          color: #FFFFFF;
          border: 1px solid #111111;
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: background-color 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
          white-space: nowrap;
        }

        .save-btn-primary:hover:not(:disabled) {
          background-color: #252525;
          border-color: #252525;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .save-btn-primary:active:not(:disabled) {
          transform: translateY(1px);
        }

        .save-btn-primary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* ALERTS */
        .settings-alert-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 18px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 500;
          margin-bottom: 22px;
          animation: fadeIn 0.2s ease;
        }

        .alert-success {
          background-color: #F8F7F3;
          border: 1px solid #1E7E5E;
          color: #1E7E5E;
        }

        .alert-error {
          background-color: #FFF5F5;
          border: 1px solid #C0392B;
          color: #C0392B;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* STACK OF CARDS */
        .settings-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* CARD COMPONENT */
        .settings-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 10px;
          padding: 28px 32px;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        .settings-card:hover {
          border-color: #D8D5CE;
        }

        /* CARD HEADER */
        .card-header-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 18px;
          margin-bottom: 24px;
          border-bottom: 1px solid #F2F0EA;
        }

        .card-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          color: #252525;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-header-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .card-subheading {
          font-size: 0.8rem;
          color: #6F6F6A;
          margin: 0;
          line-height: 1.4;
        }

        /* 2-COLUMN GRID */
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          box-sizing: border-box;
        }

        .col-span-full {
          grid-column: 1 / -1;
        }

        /* FORM FIELD */
        .form-field {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 13px;
          font-weight: 500;
          color: #252525;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
          display: flex;
          align-items: center;
        }

        .required-star {
          color: #C0392B;
          margin-left: 3px;
          font-weight: 700;
        }

        /* INPUTS & TEXTAREA */
        .form-input {
          height: 46px;
          border: 1px solid #D8D5CE;
          background-color: #FFFFFF;
          border-radius: 6px;
          padding: 0 14px;
          font-family: inherit;
          font-size: 14px;
          color: #111111;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
        }

        .form-input::placeholder {
          color: #9A9A95;
        }

        .form-input:focus {
          border-color: #111111;
          box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.06);
        }

        .form-textarea {
          min-height: 100px;
          border: 1px solid #D8D5CE;
          background-color: #FFFFFF;
          border-radius: 6px;
          padding: 12px 14px;
          font-family: inherit;
          font-size: 14px;
          color: #111111;
          outline: none;
          resize: vertical;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
          line-height: 1.5;
        }

        .form-textarea::placeholder {
          color: #9A9A95;
        }

        .form-textarea:focus {
          border-color: #111111;
          box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.06);
        }

        .field-hint {
          font-size: 12px;
          color: #6F6F6A;
          margin-top: 6px;
          line-height: 1.4;
        }

        /* MAINTENANCE MODE TOGGLE */
        .maintenance-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 6px 0;
        }

        .maintenance-info-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .maintenance-status-label {
          font-size: 13.5px;
          font-weight: 500;
          color: #252525;
        }

        .maintenance-status-desc {
          font-size: 12.5px;
          color: #6F6F6A;
          margin: 0;
          line-height: 1.45;
        }

        /* CUSTOM TOGGLE SWITCH */
        .luxury-toggle-track {
          width: 48px;
          height: 26px;
          border-radius: 9999px;
          border: 1px solid transparent;
          cursor: pointer;
          position: relative;
          padding: 0;
          display: inline-flex;
          align-items: center;
          transition: background-color 0.22s ease, border-color 0.22s ease;
          flex-shrink: 0;
          outline: none;
        }

        .luxury-toggle-track:focus-visible {
          box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.2);
        }

        .luxury-toggle-track.toggle-off {
          background-color: #D8D5CE;
        }

        .luxury-toggle-track.toggle-on {
          background-color: #111111;
        }

        .luxury-toggle-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: block;
        }

        .luxury-toggle-thumb.thumb-off {
          transform: translateX(3px);
        }

        .luxury-toggle-thumb.thumb-on {
          transform: translateX(25px);
        }

        .maintenance-active-callout {
          margin-top: 18px;
          padding: 12px 16px;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          font-size: 12.5px;
          color: #252525;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.5;
        }

        /* BOTTOM ACTION BAR */
        .settings-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .settings-sync-note {
          font-size: 12.5px;
          color: #6F6F6A;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 900px) {
          .settings-workspace {
            padding: 24px 20px 50px 20px;
          }
          .settings-card {
            padding: 22px 24px;
          }
        }

        @media (max-width: 768px) {
          .settings-workspace {
            padding: 18px 14px 40px 14px;
          }

          .grid-2-col {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .settings-header-row {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .settings-header-right {
            width: 100%;
          }

          .save-btn-primary {
            width: 100%;
          }

          .settings-card {
            padding: 18px 16px;
            margin-bottom: 16px;
          }

          .card-heading {
            font-size: 1.25rem;
          }

          .settings-bottom-bar {
            flex-direction: column-reverse;
            align-items: stretch;
          }

          .settings-sync-note {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
