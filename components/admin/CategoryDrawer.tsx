'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import NextImage from 'next/image';
import {
  X,
  Upload,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Check,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import { DbCategory } from '@/lib/db/types';

export interface CategoryWithMeta extends DbCategory {
  parentName?: string | null;
  products?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    stock: number;
    status: string;
    image?: string;
  }[];
}

export interface ParentOption {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryWithMeta | null; // null => Add Mode, object => Edit Mode
  allCategories: CategoryWithMeta[];
  allParents: ParentOption[];
  onSaveSuccess: (updatedCategory: DbCategory) => void;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function CategoryDrawer({
  isOpen,
  onClose,
  category,
  allCategories,
  allParents,
  onSaveSuccess,
  onToast,
}: CategoryDrawerProps) {
  // 1. Form States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/category/earrings.jpg');
  const [parentId, setParentId] = useState<string>('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [showInNavbar, setShowInNavbar] = useState(true);
  const [visibleOnStore, setVisibleOnStore] = useState(true);
  const [megaMenuImage, setMegaMenuImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // 2. UI Control States
  const [showSeo, setShowSeo] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);
  const [showRemoveImageConfirm, setShowRemoveImageConfirm] = useState(false);

  // 3. Image Upload States
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'preparing' | 'uploading' | 'optimizing' | 'completed' | 'failed'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [imageMeta, setImageMeta] = useState<{
    filename?: string;
    sizeFormatted?: string;
    dimensions?: { width: number; height: number };
    format?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');

  // Helper to slugify text
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Populate or reset form whenever `category` or `isOpen` changes
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (category) {
      // Edit Mode
      setName(category.name || '');
      setSlug(category.slug || '');
      setIsSlugManuallyEdited(true);
      setDescription(category.description || '');
      setImage(category.image || '/images/category/earrings.jpg');
      setParentId(category.parentId || '');
      setStatus(category.status || 'active');
      setSortOrder(category.sortOrder ?? 1);
      setShowInNavbar(category.showInNavbar !== false);
      setVisibleOnStore(category.visibleOnStore !== false);
      setMegaMenuImage(category.megaMenuImage || '');
      setSeoTitle(category.seoTitle || '');
      setSeoDescription(category.seoDescription || '');
      setSeoKeywords(category.seoKeywords || '');

      const snapshot = JSON.stringify({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image: category.image || '/images/category/earrings.jpg',
        parentId: category.parentId || '',
        status: category.status || 'active',
        sortOrder: category.sortOrder ?? 1,
        showInNavbar: category.showInNavbar !== false,
        visibleOnStore: category.visibleOnStore !== false,
        megaMenuImage: category.megaMenuImage || '',
        seoTitle: category.seoTitle || '',
        seoDescription: category.seoDescription || '',
        seoKeywords: category.seoKeywords || '',
      });
      setInitialSnapshot(snapshot);
    } else {
      // Create / Add Mode
      setName('');
      setSlug('');
      setIsSlugManuallyEdited(false);
      setDescription('');
      setImage('/images/category/earrings.jpg');
      setParentId('');
      setStatus('active');
      setSortOrder((allCategories.length || 0) + 1);
      setShowInNavbar(true);
      setVisibleOnStore(true);
      setMegaMenuImage('');
      setSeoTitle('');
      setSeoDescription('');
      setSeoKeywords('');

      const snapshot = JSON.stringify({
        name: '',
        slug: '',
        description: '',
        image: '/images/category/earrings.jpg',
        parentId: '',
        status: 'active',
        sortOrder: (allCategories.length || 0) + 1,
        showInNavbar: true,
        visibleOnStore: true,
        megaMenuImage: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
      });
      setInitialSnapshot(snapshot);
    }

    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadError(null);
    setIsSaved(false);
  }, [isOpen, category, allCategories.length]);

  // Check dirty state (unsaved changes)
  const isDirty = useMemo(() => {
    if (!isOpen || !initialSnapshot) return false;
    const current = JSON.stringify({
      name,
      slug,
      description,
      image,
      parentId,
      status,
      sortOrder,
      showInNavbar,
      visibleOnStore,
      megaMenuImage,
      seoTitle,
      seoDescription,
      seoKeywords,
    });
    return current !== initialSnapshot;
  }, [
    isOpen,
    initialSnapshot,
    name,
    slug,
    description,
    image,
    parentId,
    status,
    sortOrder,
    showInNavbar,
    visibleOnStore,
    megaMenuImage,
    seoTitle,
    seoDescription,
    seoKeywords,
  ]);

  // Close Interceptor: checks for unsaved changes before exiting
  const requestClose = useCallback(() => {
    if (isDirty && !isSaving) {
      setShowUnsavedPrompt(true);
    } else {
      onClose();
    }
  }, [isDirty, isSaving, onClose]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        requestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, requestClose]);

  // Handle Category Name changes + auto slug generation
  const handleNameChange = (val: string) => {
    setName(val);
    if (!category && !isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  // Validation: Check duplicate name against other categories
  const nameCollision = useMemo(() => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return false;
    return allCategories.some(
      (c) => c.name.trim().toLowerCase() === trimmed && (!category || c.id !== category.id)
    );
  }, [name, allCategories, category]);

  // Validation: Check duplicate slug against other categories
  const slugCollision = useMemo(() => {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) return false;
    return allCategories.some(
      (c) => c.slug.trim().toLowerCase() === trimmed && (!category || c.id !== category.id)
    );
  }, [slug, allCategories, category]);

  // Warning when changing existing production slug
  const isExistingSlugChanged = Boolean(category && slug !== category.slug);

  // Available Parents (exclude current category and avoid circular reference)
  const availableParents = useMemo(() => {
    if (!category) return allParents;
    // Exclude current category and its children
    return allParents.filter((p) => p.id !== category.id && p.slug !== category.slug && p.parentId !== category.id);
  }, [allParents, category]);

  // Image Upload Pipeline using `/api/admin/media/upload`
  const handleFileProcess = async (file: File) => {
    setUploadError(null);

    // 1. Validate MIME type & file extension
    const validExtensions = /\.(jpe?g|png|webp|avif)$/i;
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];

    if (!validMimes.includes(file.type.toLowerCase()) && !validExtensions.test(file.name)) {
      setUploadError('Unsupported format. Please select a valid JPG, PNG, WEBP, or AVIF image.');
      setUploadStatus('failed');
      return;
    }

    // 2. Validate file size (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`);
      setUploadStatus('failed');
      return;
    }

    // 3. Initiate Upload Pipeline
    setUploadStatus('uploading');
    setUploadProgress(25);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');
      formData.append('preset', 'high_quality');

      setUploadProgress(50);
      setUploadStatus('optimizing');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to optimize and upload image.');
      }

      const uploadedUrl = data.url || data.items?.[0]?.url || data.media?.url;
      if (!uploadedUrl) {
        throw new Error('Upload succeeded but no image URL was returned.');
      }

      setImage(uploadedUrl);
      setUploadStatus('completed');
      setUploadProgress(100);

      // Save upload metadata for preview
      const opt = data.optimization || {};
      setImageMeta({
        filename: file.name,
        sizeFormatted: opt.optimizedSizeBytes
          ? `${(opt.optimizedSizeBytes / 1024).toFixed(0)} KB`
          : `${(file.size / 1024).toFixed(0)} KB`,
        dimensions: opt.dimensions || { width: 800, height: 800 },
        format: 'WebP',
      });

      onToast('Image uploaded and optimized to WebP successfully!');
    } catch (err: any) {
      console.error('[CategoryDrawer] Upload Error:', err);
      setUploadError(err.message || 'Image upload failed. Please try another file.');
      setUploadStatus('failed');
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // Remove Image handler
  const handleRemoveImage = () => {
    setImage('/images/category/earrings.jpg');
    setImageMeta(null);
    setShowRemoveImageConfirm(false);
    onToast('Image removed. Click Save Changes to commit.', 'success');
  };

  // Save / Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      onToast('Category name is required.', 'error');
      return;
    }

    if (nameCollision) {
      onToast('A category with this name already exists. Please choose a unique name.', 'error');
      return;
    }

    if (!slug.trim()) {
      onToast('URL Slug is required.', 'error');
      return;
    }

    if (slugCollision) {
      onToast(`Slug "${slug}" is already in use by another category.`, 'error');
      return;
    }

    setIsSaving(true);
    setIsSaved(false);

    try {
      const payload: any = {
        name: name.trim(),
        slug: slugify(slug),
        description: description.trim(),
        image: image.trim() || '/images/category/earrings.jpg',
        parentId: parentId ? String(parentId).trim() : null,
        status,
        sortOrder: Number(sortOrder) || 1,
        showInNavbar: Boolean(showInNavbar),
        visibleOnStore: Boolean(visibleOnStore),
        megaMenuImage: megaMenuImage.trim() || undefined,
        seoTitle: seoTitle.trim() || `${name.trim()} | Fine 925 Sterling Jewellery | MK Silver Hub`,
        seoDescription: seoDescription.trim() || `Explore handcrafted 925 sterling silver ${name.trim().toLowerCase()} at MK Silver Hub.`,
        seoKeywords: seoKeywords.trim() || `925 silver ${name.trim().toLowerCase()}, sterling silver, luxury jewellery`,
      };

      if (category) {
        payload.id = category.id;
      }

      const method = category ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to save category in MongoDB.');
      }

      setIsSaved(true);
      onToast(category ? `Category "${name}" updated successfully.` : `Category "${name}" created successfully.`);
      onSaveSuccess(resData.category || payload);

      // Revalidate / broadcast global category update event
      window.dispatchEvent(new CustomEvent('mk:category-updated'));

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('[CategoryDrawer] Submit Error:', err);
      onToast(err.message || 'Unable to update category. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cd-backdrop" onClick={requestClose}>
      <aside
        className="cd-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label={category ? 'Edit Category' : 'Create Category'}
        role="dialog"
        aria-modal="true"
      >
        {/* 1. Sticky Header */}
        <header className="cd-header">
          <div className="cd-header-content">
            <div className="cd-header-title-row">
              <span className="cd-badge-sub">CATALOGUE MANAGEMENT</span>
              <div className="cd-badges-group">
                <span className={`cd-status-badge ${status === 'active' ? 'active' : 'inactive'}`}>
                  <span className="cd-status-dot" />
                  {status === 'active' ? 'Active' : 'Inactive'}
                </span>
                {isDirty && (
                  <span className="cd-dirty-badge" title="You have unsaved changes">
                    ● Unsaved Changes
                  </span>
                )}
              </div>
            </div>

            <h2 className="cd-title">
              {category ? 'EDIT CATEGORY' : 'CREATE CATEGORY'}
            </h2>

            <p className="cd-subtitle">
              {category
                ? `Updating category properties for "${category.name}"`
                : 'Create a new luxury jewellery category in your MongoDB catalogue.'}
            </p>
          </div>

          <button
            type="button"
            onClick={requestClose}
            className="cd-close-btn"
            aria-label="Close category drawer"
          >
            <X size={18} />
          </button>
        </header>

        {/* 2. Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="cd-body">
          {/* Section: Category Imagery */}
          <div className="cd-section-card">
            <div className="cd-section-header">
              <label className="cd-section-title">
                Category Image *
              </label>
              <span className="cd-section-hint">Square or 4:5 editorial photography</span>
            </div>

            {/* Production Drag & Drop Uploader */}
            <div
              className={`cd-dropzone ${isDraggingOver ? 'is-dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="cd-preview-box">
                <NextImage
                  src={image || '/images/category/earrings.jpg'}
                  alt={name || 'Category'}
                  fill
                  sizes="160px"
                  className="cd-preview-img"
                  onError={() => setImage('/images/category/earrings.jpg')}
                />
              </div>

              <div className="cd-uploader-info">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileProcess(f);
                  }}
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  style={{ display: 'none' }}
                />

                <div className="cd-uploader-actions">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadStatus === 'uploading' || uploadStatus === 'optimizing'}
                    className="cd-btn-upload"
                  >
                    {uploadStatus === 'uploading' || uploadStatus === 'optimizing' ? (
                      <>
                        <RefreshCw size={14} className="cd-spin" />
                        <span>Optimizing ({uploadProgress}%)...</span>
                      </>
                    ) : image ? (
                      <>
                        <Upload size={14} />
                        <span>Replace Image</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>Upload Image</span>
                      </>
                    )}
                  </button>

                  {image && image !== '/images/category/earrings.jpg' && (
                    <button
                      type="button"
                      onClick={() => setShowRemoveImageConfirm(true)}
                      className="cd-btn-remove"
                      title="Remove category image"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="cd-upload-guidelines">
                  <span>Drag & drop file here or click to browse.</span>
                  <span>JPG, PNG, WEBP, AVIF up to 10MB. Sharp-optimized to WebP.</span>
                </div>

                {imageMeta && (
                  <div className="cd-image-meta-pill">
                    <span>{imageMeta.filename}</span>
                    <span>•</span>
                    <span>{imageMeta.dimensions?.width}×{imageMeta.dimensions?.height}px</span>
                    <span>•</span>
                    <span>{imageMeta.sizeFormatted}</span>
                  </div>
                )}

                {uploadError && (
                  <div className="cd-upload-error-row">
                    <AlertCircle size={14} />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Image URL input */}
            <div className="cd-field-row" style={{ marginTop: '12px' }}>
              <label className="cd-sublabel">Direct Asset Path or CDN URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/category/earrings.jpg"
                className="cd-input cd-input-mono text-xs"
              />
            </div>
          </div>

          {/* Section: Category Core Properties */}
          <div className="cd-section-card">
            {/* Category Name */}
            <div className="cd-field-group">
              <div className="cd-field-header">
                <label className="cd-label">
                  Category Name <span className="cd-required">*</span>
                </label>
                <span className="cd-counter">{name.length} / 60</span>
              </div>
              <input
                type="text"
                required
                maxLength={60}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Earrings, Statement Necklaces"
                className={`cd-input ${nameCollision ? 'is-error' : ''}`}
              />
              {nameCollision && (
                <span className="cd-field-error">
                  <AlertCircle size={13} />
                  A category with this name already exists.
                </span>
              )}
            </div>

            {/* URL Slug */}
            <div className="cd-field-group">
              <div className="cd-field-header">
                <label className="cd-label">
                  URL Slug <span className="cd-required">*</span>
                </label>
                <span className="cd-counter">/shop?category={slug || 'slug'}</span>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setIsSlugManuallyEdited(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="e.g. earrings"
                className={`cd-input cd-input-mono ${slugCollision ? 'is-error' : ''}`}
              />
              {slugCollision && (
                <span className="cd-field-error">
                  <AlertCircle size={13} />
                  A category with slug &quot;{slug}&quot; already exists in MongoDB.
                </span>
              )}
              {isExistingSlugChanged && (
                <div className="cd-slug-warning">
                  <AlertTriangle size={14} />
                  <span>Changing this URL may affect existing links, customer bookmarks, and SEO ranking.</span>
                </div>
              )}
            </div>

            {/* Parent Category Hierarchy */}
            <div className="cd-field-group">
              <label className="cd-label">Parent Category</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="cd-select"
              >
                <option value="">None (Top-Level Root Category)</option>
                {availableParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.parentId ? `  └─ ${p.name}` : `● ${p.name}`}
                  </option>
                ))}
              </select>
              <span className="cd-hint">Organize nested subcategories (e.g. Jewellery → Necklaces).</span>
            </div>

            {/* Editorial Description */}
            <div className="cd-field-group">
              <div className="cd-field-header">
                <label className="cd-label">Description</label>
                <span className="cd-counter">{description.length} / 400</span>
              </div>
              <textarea
                rows={3}
                maxLength={400}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Editorial subtitle for catalogue banners and search results..."
                className="cd-textarea"
              />
            </div>

            {/* Status and Sort Order Grid */}
            <div className="cd-grid-2">
              <div className="cd-field-group">
                <label className="cd-label">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="cd-select"
                >
                  <option value="active">Active (Visible on Store)</option>
                  <option value="inactive">Inactive (Hidden from Store)</option>
                </select>
              </div>

              <div className="cd-field-group">
                <label className="cd-label">Sort Order</label>
                <input
                  type="number"
                  min={1}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="cd-input"
                />
              </div>
            </div>
          </div>

          {/* Section: Storefront Navigation Controls */}
          <div className="cd-section-card">
            <span className="cd-section-title">Storefront Navigation Controls</span>

            <div className="cd-toggles-list">
              <label className="cd-toggle-row">
                <input
                  type="checkbox"
                  checked={showInNavbar}
                  onChange={(e) => setShowInNavbar(e.target.checked)}
                  className="cd-checkbox"
                />
                <div>
                  <span className="cd-toggle-title">Show in Top Navbar</span>
                  <span className="cd-toggle-desc">Display in the global store header navigation bar</span>
                </div>
              </label>

              <label className="cd-toggle-row">
                <input
                  type="checkbox"
                  checked={visibleOnStore}
                  onChange={(e) => setVisibleOnStore(e.target.checked)}
                  className="cd-checkbox"
                />
                <div>
                  <span className="cd-toggle-title">Show in Storefront Filtering</span>
                  <span className="cd-toggle-desc">Show category in /shop sidebar filters and homepage catalog</span>
                </div>
              </label>
            </div>

            <div className="cd-field-group" style={{ marginTop: '12px' }}>
              <label className="cd-sublabel">Mega Menu Promo Banner Image (Optional)</label>
              <input
                type="text"
                value={megaMenuImage}
                onChange={(e) => setMegaMenuImage(e.target.value)}
                placeholder="/images/category/bangles.jpg"
                className="cd-input cd-input-mono text-xs"
              />
            </div>
          </div>

          {/* Section: Collapsible SEO & Metadata Settings */}
          <div className="cd-section-card">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="cd-collapsible-btn"
            >
              <div className="cd-collapsible-left">
                <Sparkles size={16} />
                <span>SEO & Search Metadata</span>
              </div>
              <span className="cd-collapsible-toggle">{showSeo ? 'Hide' : 'Configure'}</span>
            </button>

            {showSeo && (
              <div className="cd-collapsible-content">
                <div className="cd-field-group">
                  <div className="cd-field-header">
                    <label className="cd-label">SEO Meta Title</label>
                    <span className="cd-counter">{seoTitle.length} / 70</span>
                  </div>
                  <input
                    type="text"
                    maxLength={70}
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={`${name || 'Category'} | Fine 925 Sterling Jewellery`}
                    className="cd-input"
                  />
                </div>

                <div className="cd-field-group">
                  <div className="cd-field-header">
                    <label className="cd-label">SEO Meta Description</label>
                    <span className="cd-counter">{seoDescription.length} / 160</span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={160}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={`Discover handcrafted 925 sterling silver ${name.toLowerCase() || 'jewellery'} with certified purity at MK Silver Hub.`}
                    className="cd-textarea"
                  />
                </div>

                <div className="cd-field-group">
                  <label className="cd-label">SEO Keywords</label>
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="925 silver, oxidised jewellery, pure sterling"
                    className="cd-input"
                  />
                </div>

                {/* Google SERP Snippet Preview */}
                <div className="cd-serp-preview">
                  <span className="cd-serp-tag">GOOGLE SEARCH PREVIEW</span>
                  <div className="cd-serp-title">
                    {seoTitle || `${name || 'Category'} | Fine 925 Sterling Jewellery | MK Silver Hub`}
                  </div>
                  <div className="cd-serp-url">
                    https://mksilverhub.com/shop?category={slug || 'slug'}
                  </div>
                  <div className="cd-serp-desc">
                    {seoDescription ||
                      `Discover authentic handcrafted 925 sterling silver ${name.toLowerCase() || 'jewellery'} crafted by master Jaipuri artisans at MK Silver Hub.`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Live Storefront Card Preview */}
          <div className="cd-section-card">
            <div className="cd-section-header">
              <span className="cd-section-title">Storefront Preview</span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="cd-text-btn"
              >
                {showPreview ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {showPreview && (
              <div className="cd-store-preview-wrapper">
                <div className="cd-preview-editorial-card">
                  <div className="cd-preview-card-img">
                    <NextImage
                      src={image || '/images/category/earrings.jpg'}
                      alt={name || 'Category'}
                      fill
                      sizes="220px"
                      className="cd-preview-img-fill"
                    />
                  </div>
                  <div className="cd-preview-card-info">
                    <h4 className="cd-preview-card-title">{name || 'CATEGORY NAME'}</h4>
                    <span className="cd-preview-underline" />
                    <div className="cd-preview-cta">
                      <span>Explore</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>

                <div className="cd-preview-meta-details">
                  <div className="cd-meta-row">
                    <strong>Route:</strong> <code>/shop?category={slug || '...'}</code>
                  </div>
                  <div className="cd-meta-row">
                    <strong>Navbar:</strong> {showInNavbar ? 'Visible' : 'Hidden'}
                  </div>
                  <div className="cd-meta-row">
                    <strong>Filter:</strong> {visibleOnStore ? 'Active' : 'Disabled'}
                  </div>
                  <div className="cd-meta-row">
                    <strong>Sort:</strong> Order #{sortOrder}
                  </div>
                  {description && (
                    <p className="cd-preview-desc-text">&quot;{description}&quot;</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* 3. Sticky Footer Actions */}
        <footer className="cd-footer">
          <button
            type="button"
            onClick={requestClose}
            disabled={isSaving}
            className="cd-btn-cancel"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || Boolean(nameCollision) || Boolean(slugCollision)}
            className="cd-btn-save"
          >
            {isSaving ? (
              <>
                <RefreshCw size={15} className="cd-spin" />
                <span>Saving to Database...</span>
              </>
            ) : isSaved ? (
              <>
                <Check size={16} />
                <span>Saved ✓</span>
              </>
            ) : category ? (
              <span>Save Changes</span>
            ) : (
              <span>Create Category</span>
            )}
          </button>
        </footer>

        {/* Unsaved Changes Confirmation Dialog */}
        {showUnsavedPrompt && (
          <div className="cd-submodal-backdrop" onClick={() => setShowUnsavedPrompt(false)}>
            <div className="cd-submodal" onClick={(e) => e.stopPropagation()}>
              <div className="cd-submodal-icon">
                <AlertTriangle size={24} color="#111111" />
              </div>
              <h3 className="cd-submodal-title">Unsaved Changes</h3>
              <p className="cd-submodal-desc">
                You have unsaved changes in this category. Are you sure you want to discard them and leave?
              </p>
              <div className="cd-submodal-actions">
                <button
                  type="button"
                  onClick={() => setShowUnsavedPrompt(false)}
                  className="cd-submodal-stay"
                >
                  Stay
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUnsavedPrompt(false);
                    onClose();
                  }}
                  className="cd-submodal-discard"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Image Confirmation Dialog */}
        {showRemoveImageConfirm && (
          <div className="cd-submodal-backdrop" onClick={() => setShowRemoveImageConfirm(false)}>
            <div className="cd-submodal" onClick={(e) => e.stopPropagation()}>
              <div className="cd-submodal-icon">
                <Trash2 size={24} color="#111111" />
              </div>
              <h3 className="cd-submodal-title">Remove Category Image?</h3>
              <p className="cd-submodal-desc">
                This will reset the category image to the default placeholder. You will need to save the category to apply this change.
              </p>
              <div className="cd-submodal-actions">
                <button
                  type="button"
                  onClick={() => setShowRemoveImageConfirm(false)}
                  className="cd-submodal-stay"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="cd-submodal-discard"
                >
                  Remove Image
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      <style jsx>{`
        /* Backdrop */
        .cd-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(18, 16, 14, 0.45);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          animation: cdFadeIn 0.25s ease-out;
        }

        /* Drawer Panel: 560px on desktop, full-screen on mobile */
        .cd-drawer-panel {
          position: relative;
          width: 560px;
          max-width: 100vw;
          height: 100vh;
          background: #FFFFFF;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.16);
          display: flex;
          flex-direction: column;
          animation: cdSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          user-select: none;
        }

        /* 1. Sticky Header */
        .cd-header {
          position: sticky;
          top: 0;
          z-index: 20;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E3DE;
          padding: 20px 24px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .cd-header-content {
          flex: 1;
        }

        .cd-header-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .cd-badge-sub {
          font-family: var(--font-ui), -apple-system, sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #7D7972;
        }

        .cd-badges-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cd-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cd-status-badge.active {
          background: #EDF7EE;
          color: #2E7D32;
        }

        .cd-status-badge.inactive {
          background: #F5F5F3;
          color: #7A7874;
        }

        .cd-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .cd-dirty-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 12px;
          background: #FFF8E6;
          color: #8C6D1F;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .cd-title {
          font-family: var(--font-heading), 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: #111111;
          margin: 0 0 4px;
        }

        .cd-subtitle {
          font-size: 0.8rem;
          color: #6D6A64;
          margin: 0;
          line-height: 1.35;
        }

        .cd-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: #F8F7F3;
          border: 1px solid #E5E3DE;
          color: #1D1D1B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .cd-close-btn:hover {
          background: #111111;
          border-color: #111111;
          color: #FFFFFF;
        }

        /* 2. Scrollable Body */
        .cd-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          background: #F8F7F3;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Section Cards */
        .cd-section-card {
          background: #FFFFFF;
          border: 1px solid #E5E3DE;
          border-radius: 6px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cd-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cd-section-title {
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #111111;
        }

        .cd-section-hint {
          font-size: 0.72rem;
          color: #7D7972;
        }

        /* Production Dropzone & Image Info */
        .cd-dropzone {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 14px;
          border: 1px dashed #D6D2C8;
          border-radius: 6px;
          background: #FCFBF9;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .cd-dropzone.is-dragging {
          border-color: #111111;
          background: #F3F1EC;
        }

        .cd-preview-box {
          position: relative;
          width: 90px;
          height: 112px;
          border-radius: 4px;
          overflow: hidden;
          background: #ECE8E0;
          border: 1px solid #E5E3DE;
          flex-shrink: 0;
        }

        .cd-preview-img {
          object-fit: cover;
        }

        .cd-uploader-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cd-uploader-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cd-btn-upload {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 4px;
          background: #111111;
          color: #FFFFFF;
          font-size: 0.76rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .cd-btn-upload:hover:not(:disabled) {
          background: #2D2D29;
        }

        .cd-btn-remove {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: 4px;
          background: #FFFFFF;
          border: 1px solid #E5E3DE;
          color: #8C2A2A;
          font-size: 0.74rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cd-btn-remove:hover {
          background: #FDF2F2;
          border-color: #D32F2F;
        }

        .cd-upload-guidelines {
          font-size: 0.72rem;
          color: #7D7972;
          line-height: 1.35;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cd-image-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          border-radius: 4px;
          background: #F2EFE8;
          font-size: 0.68rem;
          color: #4D4A45;
          font-family: monospace;
          width: fit-content;
        }

        .cd-upload-error-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #D32F2F;
          font-weight: 500;
        }

        /* Form Inputs */
        .cd-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cd-field-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cd-label {
          font-size: 0.76rem;
          font-weight: 600;
          color: #1D1D1B;
          letter-spacing: 0.02em;
        }

        .cd-sublabel {
          font-size: 0.72rem;
          color: #6D6A64;
          margin-bottom: 4px;
        }

        .cd-required {
          color: #D32F2F;
        }

        .cd-counter {
          font-size: 0.68rem;
          color: #8A8780;
        }

        .cd-input,
        .cd-select,
        .cd-textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 8px 12px;
          background: #FFFFFF;
          border: 1px solid #DCD9D0;
          border-radius: 4px;
          font-size: 0.82rem;
          color: #111111;
          font-family: var(--font-ui), -apple-system, sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .cd-input:focus,
        .cd-select:focus,
        .cd-textarea:focus {
          outline: none;
          border-color: #111111;
          box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.08);
        }

        .cd-input.is-error {
          border-color: #D32F2F;
          background: #FFFDFD;
        }

        .cd-input-mono {
          font-family: monospace;
          letter-spacing: -0.01em;
        }

        .cd-field-error {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: #D32F2F;
          font-weight: 500;
        }

        .cd-hint {
          font-size: 0.7rem;
          color: #7D7972;
        }

        .cd-slug-warning {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 4px;
          background: #FFF9E6;
          border: 1px solid #F0E2AF;
          font-size: 0.72rem;
          color: #7C5D14;
          line-height: 1.35;
        }

        .cd-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Navigation Toggles */
        .cd-toggles-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cd-toggle-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }

        .cd-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #111111;
          cursor: pointer;
          margin-top: 2px;
        }

        .cd-toggle-title {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #111111;
        }

        .cd-toggle-desc {
          display: block;
          font-size: 0.7rem;
          color: #7D7972;
        }

        /* Collapsible Section */
        .cd-collapsible-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: #111111;
        }

        .cd-collapsible-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .cd-collapsible-toggle {
          font-size: 0.74rem;
          color: #7D7972;
          text-decoration: underline;
        }

        .cd-collapsible-content {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: cdFadeIn 0.2s ease-out;
        }

        /* Google SERP Preview */
        .cd-serp-preview {
          padding: 12px;
          border-radius: 4px;
          background: #FDFCF9;
          border: 1px solid #EBE7DF;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cd-serp-tag {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #8C8A84;
        }

        .cd-serp-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1A0DAB;
          line-height: 1.25;
        }

        .cd-serp-url {
          font-size: 0.72rem;
          color: #006621;
        }

        .cd-serp-desc {
          font-size: 0.74rem;
          color: #545454;
          line-height: 1.35;
        }

        /* Storefront Card Preview */
        .cd-text-btn {
          background: none;
          border: none;
          font-size: 0.74rem;
          color: #7D7972;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .cd-store-preview-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding-top: 4px;
        }

        .cd-preview-editorial-card {
          width: 140px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #ECE8DF;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
          flex-shrink: 0;
        }

        .cd-preview-card-img {
          position: relative;
          width: 100%;
          height: 160px;
          background: #ECE8E0;
        }

        .cd-preview-img-fill {
          object-fit: cover;
        }

        .cd-preview-card-info {
          padding: 10px 8px 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cd-preview-card-title {
          font-family: var(--font-heading), 'Cormorant Garamond', Georgia, serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1A1918;
          margin: 0;
        }

        .cd-preview-underline {
          display: block;
          width: 16px;
          height: 1.5px;
          background: #111111;
          margin: 4px auto 5px;
        }

        .cd-preview-cta {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #736F68;
        }

        .cd-preview-meta-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.74rem;
          color: #4D4A45;
        }

        .cd-meta-row strong {
          color: #111111;
        }

        .cd-meta-row code {
          background: #F0EFE9;
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 0.7rem;
        }

        .cd-preview-desc-text {
          margin: 4px 0 0;
          font-style: italic;
          color: #7D7972;
          font-size: 0.72rem;
          line-height: 1.35;
        }

        /* 3. Sticky Footer Actions */
        .cd-footer {
          position: sticky;
          bottom: 0;
          z-index: 20;
          background: #FFFFFF;
          border-top: 1px solid #E5E3DE;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .cd-btn-cancel {
          padding: 9px 18px;
          border-radius: 4px;
          background: #FFFFFF;
          border: 1px solid #DCD9D0;
          color: #1D1D1B;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cd-btn-cancel:hover:not(:disabled) {
          background: #F8F7F3;
          border-color: #111111;
        }

        .cd-btn-save {
          padding: 9px 22px;
          border-radius: 4px;
          background: #111111;
          border: 1px solid #111111;
          color: #FFFFFF;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .cd-btn-save:hover:not(:disabled) {
          background: #2C2C28;
        }

        .cd-btn-save:active:not(:disabled) {
          transform: scale(0.98);
        }

        .cd-btn-save:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* Submodal Dialog (Unsaved changes / Remove image) */
        .cd-submodal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(18, 16, 14, 0.5);
          backdrop-filter: blur(2px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cd-submodal {
          background: #FFFFFF;
          border: 1px solid #E5E3DE;
          border-radius: 6px;
          padding: 22px;
          max-width: 380px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: cdScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cd-submodal-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #F8F7F3;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .cd-submodal-title {
          font-family: var(--font-heading), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111111;
          margin: 0 0 6px;
        }

        .cd-submodal-desc {
          font-size: 0.78rem;
          color: #6D6A64;
          line-height: 1.4;
          margin: 0 0 18px;
        }

        .cd-submodal-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .cd-submodal-stay {
          flex: 1;
          padding: 8px 14px;
          border-radius: 4px;
          background: #111111;
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
        }

        .cd-submodal-discard {
          flex: 1;
          padding: 8px 14px;
          border-radius: 4px;
          background: #FFFFFF;
          border: 1px solid #DCD9D0;
          color: #6D6A64;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
        }

        .cd-submodal-discard:hover {
          color: #D32F2F;
          border-color: #D32F2F;
        }

        .cd-spin {
          animation: cdRotate 1s infinite linear;
        }

        @keyframes cdFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes cdSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes cdScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes cdRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile full-screen adaptation */
        @media (max-width: 768px) {
          .cd-drawer-panel {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          }
          .cd-header {
            padding: 16px 18px;
          }
          .cd-body {
            padding: 16px 18px;
          }
          .cd-footer {
            padding: 14px 18px;
          }
          .cd-grid-2 {
            grid-template-columns: 1fr;
          }
          .cd-dropzone {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .cd-store-preview-wrapper {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
