'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Eye, CheckCircle2, Save, GripVertical } from 'lucide-react';
import { DbHomepageSection } from '@/lib/db/types';

export default function AdminHomepageCmsPage() {
  const [sections, setSections] = useState<DbHomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content/homepage');
      const data = await res.json();
      setSections(data.sections || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update sortOrder
    newSections.forEach((s, idx) => {
      s.sortOrder = idx + 1;
    });

    setSections(newSections);
  };

  const toggleSection = (index: number) => {
    const newSections = [...sections];
    newSections[index].enabled = !newSections[index].enabled;
    setSections(newSections);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      if (res.ok) {
        showToast('Homepage layout order saved successfully!');
      }
    } catch {
      showToast('Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-homepage-cms-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Homepage CMS & Section Ordering</h1>
          <p className="page-sub">Enable, disable, and rearrange storefront homepage sections without modifying code.</p>
        </div>

        <button onClick={handleSaveAll} disabled={saving} className="btn-save-all">
          <Save size={16} />
          <span>{saving ? 'Saving Changes...' : 'Save Layout Order'}</span>
        </button>
      </div>

      <div className="cms-sections-card">
        {loading ? (
          <div className="empty-cell">Loading homepage sections...</div>
        ) : (
          <div className="sections-list">
            {sections.map((section, idx) => (
              <div key={section.id} className={`section-cms-row ${!section.enabled ? 'disabled' : ''}`}>
                <div className="sec-order-col">
                  <GripVertical size={16} color="#806D68" />
                  <span className="order-num">#{section.sortOrder}</span>
                </div>

                <div className="sec-info-col">
                  <span className="sec-name">{section.name}</span>
                  <span className="sec-type-code">type: {section.type}</span>
                </div>

                <div className="sec-controls-col">
                  {/* Up / Down Move buttons */}
                  <div className="reorder-btns">
                    <button
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="arrow-move-btn"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="arrow-move-btn"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Enable / Disable toggle */}
                  <label className="toggle-wrap">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => toggleSection(idx)}
                      className="toggle-checkbox"
                    />
                    <span className="toggle-label">{section.enabled ? 'Visible' : 'Hidden'}</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-homepage-cms-page { display: flex; flex-direction: column; gap: 20px; }
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #2F855A; color: #FFF; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .page-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: #342727; margin: 0; }
        .page-sub { font-size: 0.88rem; color: #806D68; margin: 4px 0 0 0; }
        .btn-save-all { display: inline-flex; align-items: center; gap: 6px; background-color: #B76E79; color: #FFFFFF; padding: 9px 18px; border-radius: 10px; border: none; font-size: 0.86rem; font-weight: 600; cursor: pointer; }
        .btn-save-all:hover { background-color: #9C5762; }
        .cms-sections-card { background: #FFFFFF; border: 1px solid #EAE2DB; border-radius: 18px; padding: 20px; box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03); }
        .sections-list { display: flex; flex-direction: column; gap: 10px; }
        .section-cms-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: #FFF9F3; border: 1px solid #E8D8D0; border-radius: 12px; transition: all 0.2s ease; }
        .section-cms-row.disabled { opacity: 0.55; background: #F8F5F2; }
        .sec-order-col { display: flex; align-items: center; gap: 10px; }
        .order-num { font-weight: 700; color: #806D68; font-size: 0.82rem; }
        .sec-info-col { flex: 1; display: flex; flex-direction: column; padding-left: 14px; }
        .sec-name { font-weight: 600; font-size: 0.92rem; color: #342727; }
        .sec-type-code { font-size: 0.72rem; color: #806D68; font-family: monospace; }
        .sec-controls-col { display: flex; align-items: center; gap: 20px; }
        .reorder-btns { display: flex; gap: 4px; }
        .arrow-move-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid #E8D8D0; background: #FFFFFF; color: #342727; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .arrow-move-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .arrow-move-btn:hover:not(:disabled) { border-color: #B76E79; color: #B76E79; }
        .toggle-wrap { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .toggle-checkbox { width: 16px; height: 16px; accent-color: #B76E79; cursor: pointer; }
        .toggle-label { font-size: 0.8rem; font-weight: 600; color: #342727; }
        .empty-cell { text-align: center; padding: 40px; color: #806D68; }
      `}</style>
    </div>
  );
}
