'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Save, X, ExternalLink } from 'lucide-react';
import { DbNavigationItem } from '@/lib/db/types';

export default function AdminNavigationPage() {
  const [navItems, setNavItems] = useState<DbNavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('/shop');
  const [placement, setPlacement] = useState<'header' | 'mega_menu' | 'mobile' | 'footer'>('header');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchNav = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/navigation');
      const data = await res.json();
      setNavItems(data.navigation || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: DbNavigationItem = {
      id: `nav-${Date.now()}`,
      label,
      url,
      placement,
      sortOrder: navItems.length + 1,
      status: 'active',
    };
    setNavItems([...navItems, newItem]);
    setModalOpen(false);
    setLabel('');
    showToast(`Added navigation item "${label}"`);
  };

  const handleDelete = (id: string) => {
    setNavItems(navItems.filter(n => n.id !== id));
    showToast('Removed navigation link');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: navItems }),
      });
      if (res.ok) {
        showToast('Navigation menus updated across storefront!');
      }
    } catch {
      showToast('Error updating navigation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-nav-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Navigation CMS</h1>
          <p className="page-sub">Manage storefront header links, dropdown menus, and footer navigation paths.</p>
        </div>

        <div className="btn-group">
          <button onClick={() => setModalOpen(true)} className="btn-secondary">
            <Plus size={16} />
            <span>Add Link</span>
          </button>
          <button onClick={handleSaveAll} disabled={saving} className="btn-primary">
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      <div className="nav-table-card">
        <table className="nav-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Label</th>
              <th>Destination URL</th>
              <th>Placement</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="empty-cell">Loading navigation...</td></tr>
            ) : navItems.length === 0 ? (
              <tr><td colSpan={6} className="empty-cell">No navigation items configured.</td></tr>
            ) : (
              navItems.map((item, idx) => (
                <tr key={item.id}>
                  <td><span className="order-tag">#{idx + 1}</span></td>
                  <td><strong className="item-label">{item.label}</strong></td>
                  <td><span className="item-url">{item.url}</span></td>
                  <td><span className="placement-tag">{(item.placement || 'header').toUpperCase()}</span></td>
                  <td>
                    <button
                      onClick={() => {
                        const updated = [...navItems];
                        updated[idx].status = updated[idx].status === 'active' ? 'inactive' : 'active';
                        setNavItems(updated);
                      }}
                      className={`status-pill ${item.status}`}
                    >
                      {item.status.toUpperCase()}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleDelete(item.id)} className="btn-delete" title="Delete link">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Navigation Link</h3>
              <button onClick={() => setModalOpen(false)} className="close-btn"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} className="modal-form">
              <div className="form-group">
                <label className="field-label">Menu Label *</label>
                <input type="text" required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Wedding Sets" className="form-input" />
              </div>
              <div className="form-group">
                <label className="field-label">Target URL *</label>
                <input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/shop?occasion=bridal" className="form-input" />
              </div>
              <div className="form-group">
                <label className="field-label">Placement</label>
                <select value={placement} onChange={(e) => setPlacement(e.target.value as any)} className="form-select">
                  <option value="header">Main Header Navbar</option>
                  <option value="mega_menu">Shop Mega Menu</option>
                  <option value="mobile">Mobile Navigation Drawer</option>
                  <option value="footer">Footer Quick Links</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-nav-page { display: flex; flex-direction: column; gap: 20px; }
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #2F855A; color: #FFF; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .page-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: #342727; margin: 0; }
        .page-sub { font-size: 0.88rem; color: #806D68; margin: 4px 0 0 0; }
        .btn-group { display: flex; gap: 10px; }
        .btn-secondary { display: inline-flex; align-items: center; gap: 6px; background: #FFFFFF; border: 1px solid #EAE2DB; color: #342727; padding: 8px 14px; border-radius: 10px; font-size: 0.84rem; cursor: pointer; }
        .btn-primary { display: inline-flex; align-items: center; gap: 6px; background-color: #B76E79; color: #FFFFFF; padding: 9px 18px; border-radius: 10px; border: none; font-size: 0.86rem; font-weight: 600; cursor: pointer; }
        .btn-primary:hover { background-color: #9C5762; }
        .nav-table-card { background: #FFFFFF; border: 1px solid #EAE2DB; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03); }
        .nav-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .nav-table th { text-align: left; padding: 12px 16px; background-color: #FAF7F4; font-size: 0.76rem; text-transform: uppercase; color: #806D68; font-weight: 600; border-bottom: 1px solid #EAE2DB; }
        .nav-table td { padding: 14px 16px; border-bottom: 1px solid #F4EFEB; vertical-align: middle; color: #342727; }
        .order-tag { font-weight: 700; color: #806D68; font-size: 0.76rem; }
        .item-label { font-weight: 600; }
        .item-url { font-family: monospace; font-size: 0.78rem; color: #6F5A58; }
        .placement-tag { background: #F8F5F2; padding: 3px 8px; border-radius: 4px; font-size: 0.68rem; font-weight: 700; color: #806D68; }
        .status-pill { border: none; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; cursor: pointer; }
        .status-pill.active { background: #E6FFFA; color: #234E52; }
        .status-pill.inactive { background: #EDF2F7; color: #4A5568; }
        .btn-delete { background: none; border: 1px solid #EAE2DB; border-radius: 6px; padding: 5px; color: #806D68; cursor: pointer; }
        .btn-delete:hover { color: #C53030; border-color: #FEB2B2; background: #FFF5F5; }
        .empty-cell { text-align: center; padding: 40px !important; color: #806D68; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(52, 39, 39, 0.45); backdrop-filter: blur(4px); z-index: 250; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { width: min(92%, 460px); background: #FFFFFF; border-radius: 18px; padding: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .modal-title { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.3rem; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: #806D68; }
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: 0.76rem; font-weight: 600; color: #342727; }
        .form-input, .form-select { background: #FFF9F3; border: 1px solid #E8D8D0; border-radius: 8px; padding: 8px 12px; font-size: 0.86rem; outline: none; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
        .btn-cancel { padding: 7px 14px; border-radius: 6px; border: 1px solid #E8D8D0; background: #FFF; cursor: pointer; }
        .btn-save { padding: 7px 16px; border-radius: 6px; border: none; background: #B76E79; color: #FFF; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
