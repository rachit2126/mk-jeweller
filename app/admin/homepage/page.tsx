'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Layout,
  Plus,
  Edit2,
  Trash2,
  Check,
  RotateCw,
  AlertTriangle,
  MoveUp,
  MoveDown,
  ExternalLink,
} from 'lucide-react';
import { DbHomepageSection } from '@/lib/db/types';

export default function AdminHomepageSectionsPage() {
  const [sections, setSections] = useState<DbHomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<DbHomepageSection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DbHomepageSection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCtaText, setFormCtaText] = useState('');
  const [formCtaUrl, setFormCtaUrl] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/homepage');
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
      }
    } catch (err) {
      console.error('Failed to load homepage sections:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleOpenModal = (sec?: DbHomepageSection) => {
    if (sec) {
      setEditingSection(sec);
      setFormName(sec.name || '');
      setFormType(sec.type || '');
      setFormTitle(sec.title || '');
      setFormSubtitle(sec.subtitle || '');
      setFormCtaText(sec.ctaText || '');
      setFormCtaUrl(sec.ctaUrl || '');
      setFormEnabled(sec.enabled !== false);
    } else {
      setEditingSection(null);
      setFormName('');
      setFormType('editorial');
      setFormTitle('');
      setFormSubtitle('');
      setFormCtaText('');
      setFormCtaUrl('');
      setFormEnabled(true);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formType.trim()) {
      showToast('Section name and type are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        type: formType.trim(),
        title: formTitle.trim() || undefined,
        subtitle: formSubtitle.trim() || undefined,
        ctaText: formCtaText.trim() || undefined,
        ctaUrl: formCtaUrl.trim() || undefined,
        enabled: formEnabled,
      };

      if (editingSection) {
        const res = await fetch('/api/admin/homepage', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingSection.id, ...payload }),
        });
        if (res.ok) {
          showToast(`Updated section "${formName}" in MongoDB`);
          setModalOpen(false);
          fetchSections();
        } else {
          showToast('Failed to update section');
        }
      } else {
        const res = await fetch('/api/admin/homepage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Created section "${formName}" in MongoDB`);
          setModalOpen(false);
          fetchSections();
        } else {
          showToast('Failed to create section');
        }
      }
    } catch {
      showToast('Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (sec: DbHomepageSection) => {
    const nextEnabled = !sec.enabled;
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sec.id, enabled: nextEnabled }),
      });
      if (res.ok) {
        showToast(`${nextEnabled ? 'Enabled' : 'Disabled'} "${sec.name}" in MongoDB`);
        fetchSections();
      }
    } catch {
      showToast('Failed to change section status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/homepage?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `Deleted "${deleteTarget.name}" from MongoDB`);
        setDeleteTarget(null);
        fetchSections();
      } else {
        showToast(data.error || 'Failed to delete section');
      }
    } catch {
      showToast('Error deleting section');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F7F3', minHeight: '100vh', padding: '24px 28px' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
              fontSize: '2rem',
              fontWeight: 600,
              color: '#111111',
              margin: '0 0 4px',
            }}
          >
            Homepage CMS Sections
          </h1>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#6F6F6A' }}>
            Control homepage layout blocks, toggle visibility, and configure promotional sections.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8D5CE',
              color: '#111111',
              padding: '9px 16px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <span>Preview Homepage</span>
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={() => handleOpenModal()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              padding: '9px 18px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>Add Section</span>
          </button>
        </div>
      </div>

      {/* Sections Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E7E2',
          borderRadius: '10px',
          padding: '24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}
      >
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#6F6F6A', fontSize: '0.86rem' }}>
            Loading homepage sections from MongoDB...
          </div>
        ) : sections.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: '#FAFAF8',
              borderRadius: '8px',
              border: '1px dashed #D8D5CE',
            }}
          >
            <Layout size={32} color="#8E8D88" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111111', margin: '0 0 4px' }}>
              No Sections in MongoDB
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6F6F6A', margin: '0 0 16px' }}>
              All homepage sections have been deleted or not yet configured.
            </p>
            <button
              onClick={() => handleOpenModal()}
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Add First Section
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: sec.enabled ? '#FFFFFF' : '#FAFAF8',
                  border: '1px solid #E8E7E2',
                  borderRadius: '8px',
                  opacity: sec.enabled ? 1 : 0.65,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      color: '#8E8D88',
                      minWidth: '24px',
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          backgroundColor: '#E8E7E2',
                          borderRadius: '3px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {sec.type}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111' }}>
                        {sec.name}
                      </span>
                    </div>
                    {sec.title && (
                      <div style={{ fontSize: '0.76rem', color: '#6F6F6A', marginTop: '3px' }}>
                        &quot;{sec.title}&quot; {sec.subtitle ? `— ${sec.subtitle}` : ''}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Enable / Disable Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(sec)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '4px',
                      border: '1px solid #D8D5CE',
                      backgroundColor: sec.enabled ? '#E6F4EA' : '#F1F3F4',
                      color: sec.enabled ? '#137333' : '#5F6368',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {sec.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => handleOpenModal(sec)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #E8E7E2',
                      borderRadius: '5px',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget(sec)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #F8D7DA',
                      borderRadius: '5px',
                      backgroundColor: '#FFF1F0',
                      color: '#C0392B',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '20px',
          }}
          onClick={() => !saving && setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111111', margin: '0 0 16px' }}>
              {editingSection ? 'Edit Homepage Section' : 'Add Homepage Section'}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                  Section Display Name <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Best Sellers Product Slider"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '5px',
                    border: '1px solid #D8D5CE',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                  Section Type Identifier <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  placeholder="e.g. best_sellers, hero, trust_strip, editorial"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '5px',
                    border: '1px solid #D8D5CE',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                  Custom Headline Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Optional section headline..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '5px',
                    border: '1px solid #D8D5CE',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Optional description line..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '5px',
                    border: '1px solid #D8D5CE',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="formEnabled"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                />
                <label htmlFor="formEnabled" style={{ fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                  Enable Section (Visible on Storefront)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '5px',
                    border: '1px solid #D8D5CE',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {saving ? (
                    <>
                      <RotateCw size={13} className="animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <span>{editingSection ? 'Update Section' : 'Create Section'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 210,
            padding: '20px',
          }}
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#C0392B', marginBottom: '12px' }}>
              <AlertTriangle size={20} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Delete Homepage Section?</h3>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#6F6F6A', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>&quot;{deleteTarget.name}&quot;</strong> ({deleteTarget.type})? This will permanently delete the section configuration from MongoDB.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '5px',
                  border: '1px solid #E8E7E2',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                style={{
                  padding: '7px 18px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#C0392B',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isDeleting ? 'Deleting from DB...' : 'Delete Section'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 999,
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
