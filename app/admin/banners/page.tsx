'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { DbBanner } from '@/lib/db/types';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<DbBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [desktopImage, setDesktopImage] = useState('/images/editorial/bridal-banner-clean-hd.jpg');
  const [ctaText, setCtaText] = useState('Explore Suites');
  const [ctaUrl, setCtaUrl] = useState('/shop');
  const [placement, setPlacement] = useState<any>('homepage_hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subtitle, desktopImage, ctaText, ctaUrl, placement }),
      });
      if (res.ok) {
        showToast('Banner created!');
        setModalOpen(false);
        fetchBanners();
      }
    } catch {
      showToast('Error creating banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Banner deleted');
        fetchBanners();
      }
    } catch {
      showToast('Error deleting banner');
    }
  };

  return (
    <div className="admin-banners-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Promotional Banners</h1>
          <p className="page-sub">Manage hero slider visuals, promotional callouts, and category banner campaigns.</p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="banners-grid">
        {loading ? (
          <div className="empty-cell">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="empty-cell">No banners created yet.</div>
        ) : (
          banners.map((b) => (
            <div key={b.id} className="banner-card">
              <div className="banner-img-box">
                <Image src={b.desktopImage} alt={b.title} fill className="banner-img" />
                <span className="placement-pill">{b.placement.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="banner-content">
                <h3 className="banner-title">{b.title}</h3>
                <p className="banner-sub">{b.subtitle}</p>
                <div className="banner-bottom">
                  <span className="banner-cta">CTA: {b.ctaText} → {b.ctaUrl}</span>
                  <button onClick={() => handleDelete(b.id)} className="btn-del" title="Delete banner">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Banner</h3>
              <button onClick={() => setModalOpen(false)} className="close-btn"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label className="field-label">Banner Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="field-label">Subtitle</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="field-label">Placement</label>
                <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="form-select">
                  <option value="homepage_hero">Homepage Hero</option>
                  <option value="homepage_middle">Homepage Middle Campaign</option>
                  <option value="shop_top">Shop Category Top</option>
                  <option value="promotional">Promotional Sticky Strip</option>
                </select>
              </div>
              <div className="form-group">
                <label className="field-label">Image URL</label>
                <input type="text" value={desktopImage} onChange={(e) => setDesktopImage(e.target.value)} className="form-input" />
              </div>
              <div className="fields-2">
                <div className="form-group">
                  <label className="field-label">CTA Text</label>
                  <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="field-label">CTA Link URL</label>
                  <input type="text" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Create Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-banners-page { display: flex; flex-direction: column; gap: 20px; }
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #2F855A; color: #FFF; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .page-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: #342727; margin: 0; }
        .page-sub { font-size: 0.88rem; color: #806D68; margin: 4px 0 0 0; }
        .btn-primary { display: inline-flex; align-items: center; gap: 6px; background-color: #B76E79; color: #FFFFFF; padding: 9px 18px; border-radius: 10px; border: none; font-size: 0.86rem; font-weight: 600; cursor: pointer; }
        .banners-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
        .banner-card { background: #FFFFFF; border: 1px solid #EAE2DB; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03); display: flex; flex-direction: column; }
        .banner-img-box { position: relative; height: 160px; background: #F8F5F2; }
        :global(.banner-img) { object-fit: cover; }
        .placement-pill { position: absolute; top: 10px; left: 10px; background: rgba(0, 0, 0, 0.65); color: #FFF; font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
        .banner-content { padding: 16px; display: flex; flex-direction: column; gap: 4px; }
        .banner-title { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.25rem; margin: 0; color: #342727; }
        .banner-sub { font-size: 0.8rem; color: #806D68; margin: 0; }
        .banner-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; border-top: 1px solid #F0E8E2; padding-top: 10px; }
        .banner-cta { font-size: 0.76rem; color: #B76E79; font-weight: 600; }
        .btn-del { background: none; border: 1px solid #E8D8D0; border-radius: 6px; padding: 5px; color: #806D68; cursor: pointer; }
        .btn-del:hover { color: #C53030; border-color: #FEB2B2; background: #FFF5F5; }
        .empty-cell { grid-column: 1 / -1; text-align: center; padding: 40px; color: #806D68; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(52, 39, 39, 0.45); backdrop-filter: blur(4px); z-index: 250; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { width: min(92%, 480px); background: #FFFFFF; border-radius: 18px; padding: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .modal-title { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.3rem; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: #806D68; }
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .fields-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field-label { font-size: 0.76rem; font-weight: 600; color: #342727; }
        .form-input, .form-select { background: #FFF9F3; border: 1px solid #E8D8D0; border-radius: 8px; padding: 8px 12px; font-size: 0.86rem; outline: none; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
        .btn-cancel { padding: 7px 14px; border-radius: 6px; border: 1px solid #E8D8D0; background: #FFF; cursor: pointer; }
        .btn-save { padding: 7px 16px; border-radius: 6px; border: none; background: #B76E79; color: #FFF; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
