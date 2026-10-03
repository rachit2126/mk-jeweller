'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Check,
  RotateCw,
  AlertTriangle,
  Sparkles,
  Upload,
  Star,
  X,
  ExternalLink,
} from 'lucide-react';
import { DbBanner } from '@/lib/db/types';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<DbBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<DbBanner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DbBanner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formEyebrow, setFormEyebrow] = useState('AUTHENTIC 925 STERLING SILVER');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDesktopImage, setFormDesktopImage] = useState('');
  const [formMobileImage, setFormMobileImage] = useState('');
  const [formAltText, setFormAltText] = useState('');
  const [formCtaText, setFormCtaText] = useState('SHOP COLLECTION');
  const [formCtaUrl, setFormCtaUrl] = useState('/shop');
  const [formSecondaryCtaText, setFormSecondaryCtaText] = useState('EXPLORE NEW ARRIVALS');
  const [formSecondaryCtaUrl, setFormSecondaryCtaUrl] = useState('/shop?sort=newest');
  const [formPlacement, setFormPlacement] = useState<DbBanner['placement']>('homepage_hero');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners || []);
      }
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleOpenModal = (b?: DbBanner) => {
    if (b) {
      setEditingBanner(b);
      setFormEyebrow(b.eyebrow || 'AUTHENTIC 925 STERLING SILVER');
      setFormTitle(b.title || '');
      setFormSubtitle(b.subtitle || '');
      setFormDesktopImage(b.desktopImage || '');
      setFormMobileImage(b.mobileImage || '');
      setFormAltText(b.altText || '');
      setFormCtaText(b.ctaText || 'SHOP COLLECTION');
      setFormCtaUrl(b.ctaUrl || '/shop');
      setFormSecondaryCtaText(b.secondaryCtaText || 'EXPLORE NEW ARRIVALS');
      setFormSecondaryCtaUrl(b.secondaryCtaUrl || '/shop?sort=newest');
      setFormPlacement(b.placement || 'homepage_hero');
      setFormStatus(b.status || 'active');
    } else {
      setEditingBanner(null);
      setFormEyebrow('AUTHENTIC 925 STERLING SILVER');
      setFormTitle('');
      setFormSubtitle('');
      setFormDesktopImage('');
      setFormMobileImage('');
      setFormAltText('');
      setFormCtaText('SHOP COLLECTION');
      setFormCtaUrl('/shop');
      setFormSecondaryCtaText('EXPLORE NEW ARRIVALS');
      setFormSecondaryCtaUrl('/shop?sort=newest');
      setFormPlacement('homepage_hero');
      setFormStatus('active');
    }
    setModalOpen(true);
  };

  // Direct file upload to production media endpoint
  const handleUploadImage = async (file: File, type: 'desktop' | 'mobile') => {
    if (!file) return;

    if (type === 'desktop') setUploadingDesktop(true);
    else setUploadingMobile(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'banners');
      formData.append('preset', 'high_quality');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      const uploadedUrl = data.item?.url || data.items?.[0]?.url;

      if (uploadedUrl) {
        if (type === 'desktop') {
          setFormDesktopImage(uploadedUrl);
        } else {
          setFormMobileImage(uploadedUrl);
        }
        showToast(`Image uploaded successfully`);
      } else {
        showToast('Image uploaded but no URL returned');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image');
    } finally {
      if (type === 'desktop') setUploadingDesktop(false);
      else setUploadingMobile(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesktopImage.trim()) {
      showToast('Title and Desktop Image are required');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<DbBanner> = {
        eyebrow: formEyebrow.trim(),
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        desktopImage: formDesktopImage.trim(),
        mobileImage: formMobileImage.trim() || undefined,
        altText: formAltText.trim() || undefined,
        ctaText: formCtaText.trim(),
        ctaUrl: formCtaUrl.trim(),
        secondaryCtaText: formSecondaryCtaText.trim() || undefined,
        secondaryCtaUrl: formSecondaryCtaUrl.trim() || undefined,
        placement: formPlacement,
        status: formStatus,
      };

      if (editingBanner) {
        const res = await fetch('/api/admin/banners', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingBanner.id, ...payload }),
        });
        if (res.ok) {
          showToast(`Updated banner "${formTitle}" in MongoDB`);
          setModalOpen(false);
          fetchBanners();
        } else {
          showToast('Failed to update banner');
        }
      } else {
        const res = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Created banner "${formTitle}" in MongoDB`);
          setModalOpen(false);
          fetchBanners();
        } else {
          showToast('Failed to create banner');
        }
      }
    } catch {
      showToast('Error saving banner to MongoDB');
    } finally {
      setSaving(false);
    }
  };

  const handleSetAsActiveHero = async (banner: DbBanner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: banner.id,
          placement: 'homepage_hero',
          status: 'active',
        }),
      });
      if (res.ok) {
        showToast(`Set "${banner.title}" as single active storefront hero`);
        fetchBanners();
      } else {
        showToast('Failed to activate hero banner');
      }
    } catch {
      showToast('Error updating active hero');
    }
  };

  const handleToggleStatus = async (banner: DbBanner) => {
    const nextStatus = banner.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(`${nextStatus === 'active' ? 'Enabled' : 'Disabled'} "${banner.title}"`);
        fetchBanners();
      }
    } catch {
      showToast('Failed to change banner status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/banners?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `Deleted "${deleteTarget.title}" from MongoDB`);
        setDeleteTarget(null);
        fetchBanners();
      } else {
        showToast(data.error || 'Failed to delete banner');
      }
    } catch {
      showToast('Error deleting banner');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F7F3', minHeight: '100vh', padding: '24px 28px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontSize: '0.84rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
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
            Banners &amp; Hero Management
          </h1>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#6F6F6A' }}>
            Manage the static editorial homepage hero, promotional campaigns, and banner photography across MK Silver Hub.
          </p>
        </div>

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
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners Grid / List */}
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
            Loading banners from MongoDB...
          </div>
        ) : banners.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: '#FAFAF8',
              borderRadius: '8px',
              border: '1px dashed #D8D5CE',
            }}
          >
            <ImageIcon size={32} color="#8E8D88" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111111', margin: '0 0 4px' }}>
              No Banners Found in MongoDB
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6F6F6A', margin: '0 0 16px' }}>
              Create your first promotional hero banner to showcase seasonal jewellery highlights.
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
              Add First Banner
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {banners.map((b) => {
              const isHero = b.placement === 'homepage_hero';
              const isActiveHero = isHero && b.status === 'active';

              return (
                <div
                  key={b.id}
                  style={{
                    border: isActiveHero ? '2px solid #111111' : '1px solid #E8E7E2',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  {/* Image Preview */}
                  <div style={{ position: 'relative', width: '100%', height: '190px', backgroundColor: '#F2F0EA' }}>
                    {b.desktopImage ? (
                      <Image
                        src={b.desktopImage}
                        alt={b.altText || b.title}
                        fill
                        sizes="400px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <ImageIcon size={28} color="#8E8D88" />
                      </div>
                    )}

                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                      <span
                        style={{
                          backgroundColor: b.status === 'active' ? '#1E7E5E' : '#6F6F6A',
                          color: '#FFFFFF',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {b.status}
                      </span>
                      {isActiveHero && (
                        <span
                          style={{
                            backgroundColor: '#111111',
                            color: '#F8F7F3',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Star size={11} fill="#F8F7F3" /> Active Hero
                        </span>
                      )}
                    </div>

                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(17,17,17,0.75)',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {b.placement}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {b.eyebrow && (
                        <div
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#8E8D88',
                            marginBottom: '4px',
                          }}
                        >
                          {b.eyebrow}
                        </div>
                      )}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#111111', margin: '0 0 6px' }}>
                        {b.title}
                      </h3>
                      {b.subtitle && (
                        <p style={{ fontSize: '0.8rem', color: '#6F6F6A', margin: '0 0 10px', lineHeight: 1.4 }}>
                          {b.subtitle}
                        </p>
                      )}
                      <div style={{ fontSize: '0.74rem', color: '#6F6F6A', lineHeight: 1.5 }}>
                        <div>
                          Primary CTA: <strong>{b.ctaText || 'Shop'}</strong> &rarr; {b.ctaUrl || '/shop'}
                        </div>
                        {b.secondaryCtaText && (
                          <div>
                            Secondary CTA: <strong>{b.secondaryCtaText}</strong> &rarr; {b.secondaryCtaUrl || '#'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid #F2F0EA',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      {/* Set as Active Hero action */}
                      {isHero && !isActiveHero && (
                        <button
                          type="button"
                          onClick={() => handleSetAsActiveHero(b)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '4px',
                            border: '1px solid #111111',
                            backgroundColor: '#111111',
                            color: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Star size={11} />
                          <span>Set Active Hero</span>
                        </button>
                      )}

                      {/* Status toggle */}
                      {(!isHero || isActiveHero) && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(b)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            border: '1px solid #D8D5CE',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: b.status === 'active' ? '#1E7E5E' : '#6F6F6A',
                          }}
                        >
                          {b.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      )}

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenModal(b)}
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
                          onClick={() => setDeleteTarget(b)}
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
                  </div>
                </div>
              );
            })}
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
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111111', margin: 0 }}>
                {editingBanner ? 'Edit Banner / Hero' : 'Create New Banner'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} color="#6F6F6A" />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Eyebrow */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={formEyebrow}
                  onChange={(e) => setFormEyebrow(e.target.value)}
                  placeholder="e.g. AUTHENTIC 925 STERLING SILVER"
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

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                  Main Heading / Title <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Timeless Traditions, Modern You."
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

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Handcrafted oxidised silver jewellery, inspired by India’s heritage..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '5px',
                    border: '1px solid #D8D5CE',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Desktop Image with Upload & Preview */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>
                    Desktop Hero Image URL <span style={{ color: '#C0392B' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => desktopFileInputRef.current?.click()}
                    disabled={uploadingDesktop}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: '1px solid #D8D5CE',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    <Upload size={12} />
                    <span>{uploadingDesktop ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                  <input
                    type="file"
                    ref={desktopFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, 'desktop');
                    }}
                  />
                </div>
                <input
                  type="text"
                  required
                  value={formDesktopImage}
                  onChange={(e) => setFormDesktopImage(e.target.value)}
                  placeholder="/images/hero/hero-oxidised-silver.jpg"
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
                {formDesktopImage && (
                  <div
                    style={{
                      marginTop: '8px',
                      position: 'relative',
                      width: '100%',
                      height: '110px',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      border: '1px solid #E8E7E2',
                    }}
                  >
                    <Image
                      src={formDesktopImage}
                      alt="Preview"
                      fill
                      sizes="600px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              {/* Mobile Image with Upload & Preview */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>
                    Mobile Hero Image URL (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => mobileFileInputRef.current?.click()}
                    disabled={uploadingMobile}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: '1px solid #D8D5CE',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    <Upload size={12} />
                    <span>{uploadingMobile ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                  <input
                    type="file"
                    ref={mobileFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, 'mobile');
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={formMobileImage}
                  onChange={(e) => setFormMobileImage(e.target.value)}
                  placeholder="/images/hero/hero-oxidised-silver-mobile.jpg"
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

              {/* Alt Text */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                  Image Alt Text (SEO &amp; Accessibility)
                </label>
                <input
                  type="text"
                  value={formAltText}
                  onChange={(e) => setFormAltText(e.target.value)}
                  placeholder="e.g. Handcrafted oxidised 925 sterling silver jhumkas on travertine stone"
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

              {/* Primary CTA */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="SHOP COLLECTION"
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
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={formCtaUrl}
                    onChange={(e) => setFormCtaUrl(e.target.value)}
                    placeholder="/shop"
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
              </div>

              {/* Secondary CTA */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={formSecondaryCtaText}
                    onChange={(e) => setFormSecondaryCtaText(e.target.value)}
                    placeholder="EXPLORE NEW ARRIVALS"
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
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={formSecondaryCtaUrl}
                    onChange={(e) => setFormSecondaryCtaUrl(e.target.value)}
                    placeholder="/shop?sort=newest"
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
              </div>

              {/* Placement & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                    Placement
                  </label>
                  <select
                    value={formPlacement}
                    onChange={(e) => setFormPlacement(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '5px',
                      border: '1px solid #D8D5CE',
                      fontSize: '0.82rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="homepage_hero">Homepage Hero (Single Active)</option>
                    <option value="homepage_middle">Homepage Middle</option>
                    <option value="shop_top">Shop Top</option>
                    <option value="promotional">Promotional</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '5px',
                      border: '1px solid #D8D5CE',
                      fontSize: '0.82rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
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
                    <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
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
              borderRadius: '8px',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#C0392B', marginBottom: '12px' }}>
              <AlertTriangle size={20} />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Delete Banner</h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#6F6F6A', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>&quot;{deleteTarget.title}&quot;</strong> from MongoDB?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                style={{
                  padding: '7px 14px',
                  borderRadius: '5px',
                  border: '1px solid #D8D5CE',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  padding: '7px 16px',
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
                {isDeleting ? (
                  <>
                    <RotateCw size={13} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Banner</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
