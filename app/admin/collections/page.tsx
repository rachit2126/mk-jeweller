'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Copy,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  X,
  Upload,
  MoveUp,
  MoveDown,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderTree,
  Package,
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';
import { DbCollection, CollectionRule } from '@/lib/db/types';

interface CollectionWithMeta extends DbCollection {
  products?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    stock: number;
    status: string;
    image?: string;
    salesCount?: number;
  }[];
}

interface AvailableProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  categoryLabel?: string;
  status: string;
  image?: string;
}

function CollectionThumb({ src, alt }: { src?: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = alt ? alt.trim().slice(0, 2).toUpperCase() : 'MK';

  if (imgError || !src) {
    return (
      <div className="col-img-fallback" title={alt}>
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${alt} - MK Silver Hub`}
      width={56}
      height={56}
      className="col-thumb-img"
      onError={() => setImgError(true)}
    />
  );
}

export default function AdminCollectionsPage() {
  const router = useRouter();

  // State
  const [collections, setCollections] = useState<CollectionWithMeta[]>([]);
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [productsFilter, setProductsFilter] = useState('all');
  const [sort, setSort] = useState('order_asc');

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Form Drawer (Add / Edit)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionWithMeta | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [formDescription, setFormDescription] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('/images/collection-necklaces.jpg');
  const [formHeroImage, setFormHeroImage] = useState('/images/editorial/bridal-banner-clean-hd.jpg');
  const [formType, setFormType] = useState<'manual' | 'automatic'>('manual');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formSortOrder, setFormSortOrder] = useState<number>(1);
  const [formProductIds, setFormProductIds] = useState<string[]>([]);
  const [formRuleMatch, setFormRuleMatch] = useState<'ALL' | 'ANY'>('ALL');
  const [formRules, setFormRules] = useState<CollectionRule[]>([]);
  const [formLimit, setFormLimit] = useState<number>(12);
  const [formSortBy, setFormSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'best_selling'>('newest');
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDescription, setFormSeoDescription] = useState('');
  const [formSeoKeywords, setFormSeoKeywords] = useState('');
  const [showSeoAccordion, setShowSeoAccordion] = useState(false);

  // Product Selector Modal (for Manual Collections)
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('all');

  // Live Rule Preview (for Automatic Collections)
  const [previewOpen, setPreviewOpen] = useState(false);

  // Detail View Drawer
  const [detailCollection, setDetailCollection] = useState<CollectionWithMeta | null>(null);

  // Delete & Safety Modal
  const [deleteTarget, setDeleteTarget] = useState<CollectionWithMeta | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reorder & Submission states
  const [isReordering, setIsReordering] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch collections from backend
  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        search: debouncedSearch,
        status: statusFilter,
        type: typeFilter,
        productsFilter,
        sort,
      });

      const res = await fetch(`/api/admin/collections?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load collections (${res.status})`);
      }
      const data = await res.json();
      setCollections(data.collections || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.availableProducts) {
        setAvailableProducts(data.availableProducts);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to retrieve collections from database.');
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, typeFilter, productsFilter, sort]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Auto-generate slug from name in Add mode
  const handleNameChange = (newName: string) => {
    setFormName(newName);
    if (!editingCollection && !isSlugManuallyEdited) {
      const autoSlug = newName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
      setFormSlug(autoSlug);
    }
  };

  // Open Form Drawer
  const handleOpenDrawer = (col?: CollectionWithMeta) => {
    if (col) {
      setEditingCollection(col);
      setFormName(col.name);
      setFormSlug(col.slug);
      setIsSlugManuallyEdited(true);
      setFormDescription(col.description || '');
      setFormThumbnail(col.thumbnail || '/images/collection-necklaces.jpg');
      setFormHeroImage(col.heroImage || '/images/editorial/bridal-banner-clean-hd.jpg');
      setFormType(col.type);
      setFormStatus(col.status);
      setFormSortOrder(col.sortOrder ?? 1);
      setFormProductIds(col.products?.map((p) => p.id) || col.productIds || []);
      setFormRuleMatch(col.ruleMatch || 'ALL');
      setFormRules(col.rules && col.rules.length > 0 ? col.rules : [{ field: 'isNewArrival', operator: 'equals', value: true }]);
      setFormLimit(col.limit || 12);
      setFormSortBy(col.sortBy || 'newest');
      setFormSeoTitle(col.seoTitle || '');
      setFormSeoDescription(col.seoDescription || '');
      setFormSeoKeywords(col.seoKeywords || '');
      setShowSeoAccordion(false);
    } else {
      setEditingCollection(null);
      setFormName('');
      setFormSlug('');
      setIsSlugManuallyEdited(false);
      setFormDescription('');
      setFormThumbnail('/images/collection-necklaces.jpg');
      setFormHeroImage('/images/editorial/bridal-banner-clean-hd.jpg');
      setFormType('manual');
      setFormStatus('active');
      setFormSortOrder(total + 1);
      setFormProductIds([]);
      setFormRuleMatch('ALL');
      setFormRules([{ field: 'isNewArrival', operator: 'equals', value: true }]);
      setFormLimit(12);
      setFormSortBy('newest');
      setFormSeoTitle('');
      setFormSeoDescription('');
      setFormSeoKeywords('');
      setShowSeoAccordion(false);
    }
    setDrawerOpen(true);
  };

  // Image Upload handler
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast('Unsupported format. Please upload JPG, PNG, WEBP, or AVIF.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image is larger than 10MB limit.', 'error');
      return;
    }

    setUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'collections');
      formData.append('preset', 'high_quality');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      const uploadedUrl = data.files?.[0]?.url || data.stats?.[0]?.url;
      if (uploadedUrl) {
        setFormThumbnail(uploadedUrl);
        showToast('Collection thumbnail uploaded and optimized!');
      }
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingThumb(false);
    }
  };

  // Save Collection
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Collection name is required', 'error');
      return;
    }

    setSubmittingForm(true);
    try {
      const payload: any = {
        name: formName.trim(),
        slug: formSlug.trim() || undefined,
        description: formDescription.trim(),
        thumbnail: formThumbnail.trim() || '/images/collection-necklaces.jpg',
        heroImage: formHeroImage.trim() || '/images/editorial/bridal-banner-clean-hd.jpg',
        type: formType,
        status: formStatus,
        sortOrder: Number(formSortOrder) || 1,
        productIds: formType === 'manual' ? formProductIds : [],
        ruleMatch: formType === 'automatic' ? formRuleMatch : undefined,
        rules: formType === 'automatic' ? formRules : [],
        limit: formType === 'automatic' ? Number(formLimit) : undefined,
        sortBy: formType === 'automatic' ? formSortBy : undefined,
        seoTitle: formSeoTitle.trim() || undefined,
        seoDescription: formSeoDescription.trim() || undefined,
        seoKeywords: formSeoKeywords.trim() || undefined,
      };

      if (editingCollection) {
        payload.id = editingCollection.id;
      }

      const method = editingCollection ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/collections', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save collection');
      }

      showToast(editingCollection ? `Updated collection "${formName}"` : `Created collection "${formName}"`);
      setDrawerOpen(false);
      window.dispatchEvent(new CustomEvent('mk:collection-updated'));
      await fetchCollections();
    } catch (err: any) {
      showToast(err.message || 'Error saving collection', 'error');
    } finally {
      setSubmittingForm(false);
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (col: CollectionWithMeta) => {
    const nextStatus = col.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/admin/collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: col.id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change status');

      showToast(`Collection "${col.name}" is now ${nextStatus}`);
      setCollections((prev) =>
        prev.map((c) => (c.id === col.id ? { ...c, status: nextStatus } : c))
      );
      window.dispatchEvent(new CustomEvent('mk:collection-updated'));
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  // Duplicate Collection
  const handleDuplicate = async (col: CollectionWithMeta) => {
    try {
      const duplicated = {
        name: `${col.name} (Copy)`,
        slug: `${col.slug}-copy`,
        description: col.description || '',
        thumbnail: col.thumbnail,
        heroImage: col.heroImage,
        type: col.type,
        status: 'active',
        sortOrder: (col.sortOrder ?? 1) + 1,
        productIds: col.productIds || [],
        ruleMatch: col.ruleMatch,
        rules: col.rules || [],
        limit: col.limit,
        sortBy: col.sortBy,
        seoTitle: col.seoTitle ? `${col.seoTitle} (Copy)` : undefined,
        seoDescription: col.seoDescription || undefined,
      };

      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to duplicate collection');

      showToast(`Duplicated "${col.name}" successfully!`);
      await fetchCollections();
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate collection', 'error');
    }
  };

  // Reorder Collections (Move Up / Down)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === collections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...collections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const updatedWithOrder = reordered.map((col, idx) => ({
      ...col,
      sortOrder: idx + 1,
    }));
    setCollections(updatedWithOrder);
    setIsReordering(true);

    try {
      const itemsPayload = updatedWithOrder.map((col) => ({
        id: col.id,
        sortOrder: col.sortOrder,
      }));

      const res = await fetch('/api/admin/collections/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      });

      if (!res.ok) throw new Error('Failed to update sort order on server');
      showToast('Collection order updated!');
      window.dispatchEvent(new CustomEvent('mk:collection-updated'));
    } catch (err: any) {
      showToast(err.message || 'Error updating order', 'error');
      fetchCollections();
    } finally {
      setIsReordering(false);
    }
  };

  // Delete Collection confirmation & dependency handling
  const handleOpenDeleteModal = (col: CollectionWithMeta) => {
    setDeleteTarget(col);
    setDeleteError(null);
  };

  const handleConfirmDelete = async (forceArchive = false) => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      if (forceArchive) {
        // Safe archive option: set collection to inactive
        const res = await fetch('/api/admin/collections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deleteTarget.id, status: 'inactive' }),
        });
        if (!res.ok) throw new Error('Failed to archive collection');
        showToast(`Archived "${deleteTarget.name}". It is now hidden from storefront.`);
        setDeleteTarget(null);
        await fetchCollections();
        return;
      }

      const res = await fetch(`/api/admin/collections?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete collection');
        return;
      }

      showToast(data.message || `Deleted collection "${deleteTarget.name}"`);
      setDeleteTarget(null);
      await fetchCollections();
      window.dispatchEvent(new CustomEvent('mk:collection-updated'));
    } catch (err: any) {
      setDeleteError(err.message || 'Error executing delete operation');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(collections.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/collections/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bulk action failed');

      showToast(data.message || `Bulk ${action} completed`);
      setSelectedIds([]);
      await fetchCollections();
      window.dispatchEvent(new CustomEvent('mk:collection-updated'));
    } catch (err: any) {
      showToast(err.message || `Error performing bulk ${action}`, 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  // Rule Builder Helpers (Automatic Collections)
  const handleAddRule = () => {
    setFormRules([
      ...formRules,
      { field: 'category', operator: 'equals', value: 'necklaces' },
    ]);
  };

  const handleUpdateRule = (index: number, updated: Partial<CollectionRule>) => {
    const next = [...formRules];
    next[index] = { ...next[index], ...updated };
    setFormRules(next);
  };

  const handleRemoveRule = (index: number) => {
    setFormRules(formRules.filter((_, i) => i !== index));
  };

  // Manual Collection: Product Picker toggle
  const handleTogglePickProduct = (productId: string) => {
    if (formProductIds.includes(productId)) {
      setFormProductIds(formProductIds.filter((id) => id !== productId));
    } else {
      setFormProductIds([...formProductIds, productId]);
    }
  };

  const handleRemoveManualProduct = (productId: string) => {
    setFormProductIds(formProductIds.filter((id) => id !== productId));
  };

  const handleMoveProductOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formProductIds.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...formProductIds];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setFormProductIds(reordered);
  };

  // Filter available products in picker
  const filteredPickerProducts = availableProducts.filter((p) => {
    const matchesSearch =
      !pickerSearch ||
      p.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(pickerSearch.toLowerCase());
    const matchesCat = pickerCategory === 'all' || p.category === pickerCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-collections-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`admin-toast ${toastType}`}>
          {toastType === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Collections</h1>
          <p className="page-sub">Manage special suites, merchandising groups, and dynamic catalogue rules.</p>
        </div>

        <div className="top-actions-group">
          <button onClick={() => fetchCollections()} className="btn-secondary" title="Refresh collection data">
            <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={() => handleOpenDrawer()} className="btn-primary">
            <Plus size={16} />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="collections-table-card">
        {/* Filters Bar */}
        <div className="table-filters-row">
          <div className="search-input-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search collections by name, slug..."
              className="table-search-input"
            />
            {search && (
              <button onClick={() => setSearch('')} className="search-clear-btn">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="dropdowns-group">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="manual">Manual Collections</option>
              <option value="automatic">Automatic Collections</option>
            </select>

            {/* Products Filter */}
            <select
              value={productsFilter}
              onChange={(e) => {
                setProductsFilter(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              aria-label="Filter by products"
            >
              <option value="all">All Products</option>
              <option value="with_products">With Products</option>
              <option value="empty">Empty Collections</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="filter-select"
              aria-label="Sort collections"
            >
              <option value="order_asc">Order: Ascending</option>
              <option value="order_desc">Order: Descending</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="products_desc">Most Products</option>
              <option value="products_asc">Least Products</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="bulk-actions-strip">
            <span className="bulk-count-label">{selectedIds.length} collection(s) selected</span>
            <div className="bulk-btn-group">
              <button
                type="button"
                onClick={() => handleBulkAction('activate')}
                disabled={bulkLoading}
                className="bulk-pill"
              >
                Set Active
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction('deactivate')}
                disabled={bulkLoading}
                className="bulk-pill"
              >
                Set Inactive
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction('delete')}
                disabled={bulkLoading}
                className="bulk-pill danger"
              >
                Delete Selected
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                disabled={bulkLoading}
                className="bulk-pill secondary"
              >
                Deselect
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="table-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => fetchCollections()} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* Collections Table */}
        <div className="table-responsive-box">
          <table className="collections-data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={collections.length > 0 && selectedIds.length === collections.length}
                    onChange={handleSelectAll}
                    aria-label="Select all collections"
                    className="admin-checkbox"
                  />
                </th>
                <th style={{ width: '64px' }}>IMAGE</th>
                <th>COLLECTION</th>
                <th>TYPE</th>
                <th>SLUG</th>
                <th style={{ textAlign: 'center' }}>PRODUCTS</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'center', width: '100px' }}>ORDER</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    <td><div className="skeleton-cell check" /></td>
                    <td><div className="skeleton-cell img" /></td>
                    <td><div className="skeleton-cell text-lg" /></td>
                    <td><div className="skeleton-cell badge" /></td>
                    <td><div className="skeleton-cell text-sm" /></td>
                    <td><div className="skeleton-cell badge" /></td>
                    <td><div className="skeleton-cell pill" /></td>
                    <td><div className="skeleton-cell order" /></td>
                    <td><div className="skeleton-cell actions" /></td>
                  </tr>
                ))
              ) : collections.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty-row">
                    <div className="empty-state-content">
                      <FolderTree size={36} strokeWidth={1.5} className="empty-icon" />
                      <h3>No collections found</h3>
                      <p>
                        {search || statusFilter !== 'all' || typeFilter !== 'all'
                          ? 'No collections match the active filter criteria.'
                          : 'Create your first merchandising suite to curate products for your customers.'}
                      </p>
                      <button onClick={() => handleOpenDrawer()} className="btn-primary">
                        <Plus size={15} />
                        <span>Add Collection</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                collections.map((col, index) => {
                  const isChecked = selectedIds.includes(col.id);

                  return (
                    <tr key={col.id} className={isChecked ? 'selected-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(col.id)}
                          aria-label={`Select ${col.name}`}
                          className="admin-checkbox"
                        />
                      </td>

                      <td>
                        <div className="col-table-thumb">
                          <CollectionThumb src={col.thumbnail} alt={col.name} />
                        </div>
                      </td>

                      <td>
                        <div className="col-title-cell">
                          <button
                            onClick={() => setDetailCollection(col)}
                            className="col-name-link"
                            title="View collection details & products"
                          >
                            {col.name}
                          </button>
                          {col.description && (
                            <span className="col-desc-preview" title={col.description}>
                              {col.description}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className={`col-type-badge ${col.type === 'automatic' ? 'auto' : 'manual'}`}>
                          {col.type === 'automatic' ? 'AUTOMATIC' : 'MANUAL'}
                        </span>
                      </td>

                      <td>
                        <code className="col-slug-code">{col.slug}</code>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => setDetailCollection(col)}
                          className={`product-count-badge ${col.productCount > 0 ? 'has-products' : 'empty'}`}
                          title={`Click to view all ${col.productCount} product(s) in "${col.name}"`}
                        >
                          <Package size={12} />
                          <span>{col.productCount}</span>
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(col)}
                          className={`col-status-pill ${col.status === 'active' ? 'active' : 'inactive'}`}
                          title={`Click to switch to ${col.status === 'active' ? 'Inactive' : 'Active'}`}
                        >
                          <span className="status-dot" />
                          <span>{col.status === 'active' ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div className="order-control-box">
                          <button
                            disabled={index === 0 || isReordering}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="order-btn"
                            title="Move Up"
                          >
                            <MoveUp size={12} />
                          </button>
                          <span className="order-number">{col.sortOrder ?? index + 1}</span>
                          <button
                            disabled={index === collections.length - 1 || isReordering}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="order-btn"
                            title="Move Down"
                          >
                            <MoveDown size={12} />
                          </button>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div className="action-icons-wrap">
                          <button
                            onClick={() => setDetailCollection(col)}
                            className="icon-action-btn"
                            title="View Collection Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenDrawer(col)}
                            className="icon-action-btn"
                            title="Edit Collection"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(col)}
                            className="icon-action-btn"
                            title="Duplicate Collection"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(col)}
                            className="icon-action-btn delete"
                            title="Delete or Archive Collection"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Pagination */}
        <div className="table-pagination-footer">
          <span className="pagination-count-label">
            Showing {collections.length > 0 ? (page - 1) * 15 + 1 : 0} to{' '}
            {Math.min(page * 15, total)} of {total} collections
          </span>

          <div className="pagination-controls">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="page-nav-btn"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`page-num-btn ${page === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="page-ellipsis">...</span>
                <button onClick={() => setPage(totalPages)} className="page-num-btn">
                  {totalPages}
                </button>
              </>
            )}

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="page-nav-btn"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Drawer */}
      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">{editingCollection ? 'Edit Collection' : 'Add Collection'}</h2>
                <p className="drawer-sub">
                  {editingCollection
                    ? `Updating merchandising configuration for "${editingCollection.name}"`
                    : 'Create a new curated suite or automatic rule-driven collection.'}
                </p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="drawer-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="drawer-form">
              {/* Type Switcher */}
              <div className="type-toggle-container">
                <label className="field-label">Collection Type</label>
                <div className="type-toggle-pills">
                  <button
                    type="button"
                    onClick={() => {
                      if (formType === 'automatic' && formRules.length > 0) {
                        if (!confirm('Switching to Manual will disable automatic rules and allow custom product picking. Continue?')) return;
                      }
                      setFormType('manual');
                    }}
                    className={`type-pill-btn ${formType === 'manual' ? 'selected' : ''}`}
                  >
                    <span>Manual</span>
                    <span className="type-pill-desc">Hand-pick specific products</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (formType === 'manual' && formProductIds.length > 0) {
                        if (!confirm('Switching to Automatic will use rule-based membership instead of your manual product list. Continue?')) return;
                      }
                      setFormType('automatic');
                    }}
                    className={`type-pill-btn ${formType === 'automatic' ? 'selected' : ''}`}
                  >
                    <span>Automatic</span>
                    <span className="type-pill-desc">Rule-driven (New Arrivals, etc.)</span>
                  </button>
                </div>
              </div>

              {/* Collection Name */}
              <div className="drawer-field-group">
                <label className="field-label">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Bridal Suite, Everyday Essentials"
                  className="form-input"
                />
              </div>

              {/* Collection Slug */}
              <div className="drawer-field-group">
                <label className="field-label">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. bridal-suite"
                  className="form-input font-mono"
                />
                <span className="field-hint">Used in URLs: /collections/{formSlug || 'slug'}</span>
              </div>

              {/* Description */}
              <div className="drawer-field-group">
                <label className="field-label">Editorial Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Curated suite description displayed on collection landing pages..."
                  className="form-textarea"
                />
              </div>

              {/* Thumbnail Image */}
              <div className="drawer-field-group">
                <label className="field-label">Thumbnail Image</label>
                <div className="image-upload-widget">
                  <div className="image-preview-box">
                    <CollectionThumb src={formThumbnail} alt={formName || 'Collection'} />
                  </div>
                  <div className="image-controls-col">
                    <div className="image-btn-row">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleThumbnailUpload}
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingThumb}
                        className="btn-upload"
                      >
                        <Upload size={14} />
                        <span>{uploadingThumb ? 'Optimizing...' : 'Upload Image'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormThumbnail('/images/collection-necklaces.jpg')}
                        className="btn-reset-img"
                      >
                        Default
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formThumbnail}
                      onChange={(e) => setFormThumbnail(e.target.value)}
                      placeholder="Or enter direct image URL..."
                      className="form-input text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Manual Collection: Product Management Section */}
              {formType === 'manual' ? (
                <div className="form-sub-card">
                  <div className="form-sub-header">
                    <div>
                      <h4 className="sub-card-title">Assigned Products ({formProductIds.length})</h4>
                      <p className="sub-card-sub">Products explicitly curated in this collection.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductPickerOpen(true)}
                      className="btn-secondary text-xs"
                    >
                      <Plus size={13} />
                      <span>Pick Products</span>
                    </button>
                  </div>

                  {formProductIds.length > 0 ? (
                    <div className="chosen-products-list">
                      {formProductIds.map((pid, idx) => {
                        const prod = availableProducts.find((p) => p.id === pid);
                        if (!prod) return null;

                        return (
                          <div key={pid} className="chosen-prod-row">
                            <span className="chosen-order-num">#{idx + 1}</span>
                            <div className="chosen-thumb">
                              <Image
                                src={prod.image || '/images/collection-necklaces.jpg'}
                                alt={prod.name}
                                width={36}
                                height={36}
                                className="prod-thumb"
                              />
                            </div>
                            <div className="chosen-info">
                              <span className="prod-name-sm">{prod.name}</span>
                              <span className="prod-sku-sm">SKU: {prod.sku} • ₹{prod.price}</span>
                            </div>
                            <div className="chosen-actions">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveProductOrder(idx, 'up')}
                                className="tiny-order-btn"
                                title="Move Up"
                              >
                                <MoveUp size={11} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === formProductIds.length - 1}
                                onClick={() => handleMoveProductOrder(idx, 'down')}
                                className="tiny-order-btn"
                                title="Move Down"
                              >
                                <MoveDown size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveManualProduct(pid)}
                                className="tiny-remove-btn"
                                title="Remove Product"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-products-notice">
                      <Package size={24} className="empty-notice-icon" />
                      <span>No products selected yet. Click &quot;Pick Products&quot; to curate items.</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Automatic Collection: Rule Builder */
                <div className="form-sub-card">
                  <div className="form-sub-header">
                    <div>
                      <h4 className="sub-card-title">Dynamic Collection Rules</h4>
                      <p className="sub-card-sub">Products matching these rules are included automatically.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(!previewOpen)}
                      className="btn-secondary text-xs"
                    >
                      <Eye size={13} />
                      <span>{previewOpen ? 'Hide Preview' : 'Preview Match'}</span>
                    </button>
                  </div>

                  {/* Match ALL / ANY */}
                  <div className="rule-match-row">
                    <span className="field-label text-xs">Products must match:</span>
                    <div className="match-radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="ruleMatch"
                          checked={formRuleMatch === 'ALL'}
                          onChange={() => setFormRuleMatch('ALL')}
                        />
                        <span>ALL conditions (AND)</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="ruleMatch"
                          checked={formRuleMatch === 'ANY'}
                          onChange={() => setFormRuleMatch('ANY')}
                        />
                        <span>ANY condition (OR)</span>
                      </label>
                    </div>
                  </div>

                  {/* Rules Rows */}
                  <div className="rules-builder-list">
                    {formRules.map((rule, idx) => (
                      <div key={idx} className="rule-config-row">
                        {/* Field Select */}
                        <select
                          value={rule.field}
                          onChange={(e) => handleUpdateRule(idx, { field: e.target.value as any })}
                          className="form-select rule-select"
                        >
                          <option value="isNewArrival">Is New Arrival</option>
                          <option value="isBestSeller">Is Best Seller</option>
                          <option value="category">Category</option>
                          <option value="price">Price</option>
                          <option value="stock">Stock</option>
                          <option value="status">Status</option>
                          <option value="featured">Featured</option>
                        </select>

                        {/* Operator */}
                        <select
                          value={rule.operator}
                          onChange={(e) => handleUpdateRule(idx, { operator: e.target.value as any })}
                          className="form-select rule-select"
                        >
                          <option value="equals">is equal to</option>
                          <option value="not_equals">is not equal to</option>
                          {['price', 'stock'].includes(rule.field) && (
                            <>
                              <option value="greater_than_or_equal">is at least (&gt;=)</option>
                              <option value="less_than_or_equal">is at most (&lt;=)</option>
                            </>
                          )}
                        </select>

                        {/* Target Value Input */}
                        {['isNewArrival', 'isBestSeller', 'featured'].includes(rule.field) ? (
                          <select
                            value={String(rule.value)}
                            onChange={(e) => handleUpdateRule(idx, { value: e.target.value === 'true' })}
                            className="form-select rule-select"
                          >
                            <option value="true">True (Yes)</option>
                            <option value="false">False (No)</option>
                          </select>
                        ) : rule.field === 'category' ? (
                          <select
                            value={String(rule.value)}
                            onChange={(e) => handleUpdateRule(idx, { value: e.target.value })}
                            className="form-select rule-select"
                          >
                            <option value="necklaces">Necklaces</option>
                            <option value="earrings">Earrings</option>
                            <option value="rings">Rings</option>
                            <option value="bracelets">Bracelets</option>
                            <option value="pendants">Pendants</option>
                            <option value="mangalsutra">Mangalsutra</option>
                          </select>
                        ) : (
                          <input
                            type={['price', 'stock'].includes(rule.field) ? 'number' : 'text'}
                            value={String(rule.value)}
                            onChange={(e) => handleUpdateRule(idx, { value: e.target.value })}
                            className="form-input rule-input"
                            placeholder="Value..."
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          className="rule-del-btn"
                          title="Remove Rule"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    <button type="button" onClick={handleAddRule} className="btn-add-rule">
                      <Plus size={13} />
                      <span>Add Condition</span>
                    </button>
                  </div>

                  {/* Sort By & Limit */}
                  <div className="drawer-grid-2" style={{ marginTop: '14px' }}>
                    <div className="drawer-field-group">
                      <label className="field-label text-xs">Sort Products By</label>
                      <select
                        value={formSortBy}
                        onChange={(e) => setFormSortBy(e.target.value as any)}
                        className="form-select"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="best_selling">Best Selling (Sales Data)</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                    </div>

                    <div className="drawer-field-group">
                      <label className="field-label text-xs">Product Limit</label>
                      <select
                        value={formLimit}
                        onChange={(e) => setFormLimit(parseInt(e.target.value, 10) || 12)}
                        className="form-select"
                      >
                        <option value="8">8 Products</option>
                        <option value="12">12 Products</option>
                        <option value="16">16 Products</option>
                        <option value="24">24 Products</option>
                        <option value="32">32 Products</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Status and Sort Order */}
              <div className="drawer-grid-2">
                <div className="drawer-field-group">
                  <label className="field-label">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                <div className="drawer-field-group">
                  <label className="field-label">Sort Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(parseInt(e.target.value, 10) || 1)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* SEO Settings Accordion */}
              <div className="seo-accordion-card">
                <button
                  type="button"
                  onClick={() => setShowSeoAccordion(!showSeoAccordion)}
                  className="seo-accordion-trigger"
                >
                  <div className="seo-trigger-title">
                    <Sparkles size={15} />
                    <span>SEO & Metadata Settings</span>
                  </div>
                  {showSeoAccordion ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showSeoAccordion && (
                  <div className="seo-accordion-content">
                    <div className="drawer-field-group">
                      <label className="field-label">SEO Title</label>
                      <input
                        type="text"
                        value={formSeoTitle}
                        onChange={(e) => setFormSeoTitle(e.target.value)}
                        placeholder={`${formName || 'Collection'} | Fine 925 Sterling Jewellery`}
                        className="form-input"
                      />
                    </div>

                    <div className="drawer-field-group">
                      <label className="field-label">SEO Meta Description</label>
                      <textarea
                        rows={2}
                        value={formSeoDescription}
                        onChange={(e) => setFormSeoDescription(e.target.value)}
                        placeholder={`Explore the handcrafted ${formName || 'jewellery'} collection in authentic 925 silver.`}
                        className="form-textarea"
                      />
                    </div>

                    <div className="drawer-field-group">
                      <label className="field-label">Keywords</label>
                      <input
                        type="text"
                        value={formSeoKeywords}
                        onChange={(e) => setFormSeoKeywords(e.target.value)}
                        placeholder="925 silver, bridal collection, luxury suites"
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Actions */}
              <div className="drawer-actions-row">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  disabled={submittingForm}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submittingForm} className="btn-submit">
                  {submittingForm
                    ? 'Saving...'
                    : editingCollection
                    ? 'Save Changes'
                    : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Product Picker Modal */}
      {productPickerOpen && (
        <div className="modal-backdrop" onClick={() => setProductPickerOpen(false)}>
          <div className="modal-card picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="picker-modal-header">
              <div>
                <h3 className="modal-title">Select Products for Collection</h3>
                <p className="modal-desc">
                  Curate real active products from your catalogue ({formProductIds.length} selected).
                </p>
              </div>
              <button onClick={() => setProductPickerOpen(false)} className="drawer-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="picker-filters-row">
              <div className="search-input-box text-xs">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search products by name, SKU..."
                  className="table-search-input"
                />
              </div>

              <select
                value={pickerCategory}
                onChange={(e) => setPickerCategory(e.target.value)}
                className="filter-select text-xs"
              >
                <option value="all">All Categories</option>
                <option value="necklaces">Necklaces</option>
                <option value="earrings">Earrings</option>
                <option value="rings">Rings</option>
                <option value="bracelets">Bracelets</option>
                <option value="pendants">Pendants</option>
              </select>
            </div>

            <div className="picker-products-list">
              {filteredPickerProducts.length > 0 ? (
                filteredPickerProducts.map((p) => {
                  const isSelected = formProductIds.includes(p.id);

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleTogglePickProduct(p.id)}
                      className={`picker-product-row ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        aria-label={`Select ${p.name}`}
                        className="admin-checkbox"
                      />
                      <div className="picker-thumb">
                        <Image
                          src={p.image || '/images/collection-necklaces.jpg'}
                          alt={p.name}
                          width={40}
                          height={40}
                          className="prod-thumb"
                        />
                      </div>
                      <div className="picker-prod-meta">
                        <span className="prod-name-sm">{p.name}</span>
                        <span className="prod-sku-sm">
                          SKU: {p.sku} • {p.categoryLabel || p.category} • Stock: {p.stock}
                        </span>
                      </div>
                      <span className="prod-price-badge">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  );
                })
              ) : (
                <div className="picker-empty-state">
                  <Package size={28} className="empty-icon-sm" />
                  <p>No products found matching filter criteria.</p>
                </div>
              )}
            </div>

            <div className="picker-modal-footer">
              <span className="selected-count-text">{formProductIds.length} product(s) selected</span>
              <button
                type="button"
                onClick={() => setProductPickerOpen(false)}
                className="btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collection Detail View Drawer */}
      {detailCollection && (
        <div className="drawer-backdrop" onClick={() => setDetailCollection(null)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">{detailCollection.name}</h2>
                <p className="drawer-sub">Catalogue Overview & Attached Merchandising</p>
              </div>
              <button onClick={() => setDetailCollection(null)} className="drawer-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="detail-drawer-body">
              <div className="detail-banner-card">
                <div className="detail-banner-thumb">
                  <CollectionThumb src={detailCollection.thumbnail} alt={detailCollection.name} />
                </div>
                <div className="detail-meta-col">
                  <div className="detail-meta-title-row">
                    <h3>{detailCollection.name}</h3>
                    <span className={`col-status-pill ${detailCollection.status === 'active' ? 'active' : 'inactive'}`}>
                      {detailCollection.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="detail-meta-desc">
                    {detailCollection.description || 'No editorial description provided for this collection.'}
                  </p>
                  <div className="detail-pills-row">
                    <span className="detail-info-pill">Slug: {detailCollection.slug}</span>
                    <span className="detail-info-pill">Type: {detailCollection.type.toUpperCase()}</span>
                    <span className="detail-info-pill">Order: #{detailCollection.sortOrder}</span>
                  </div>
                </div>
              </div>

              {/* Products in Collection */}
              <div className="detail-section">
                <div className="detail-section-header">
                  <h4>Products in Collection ({detailCollection.products?.length || detailCollection.productCount || 0})</h4>
                  <Link
                    href={`/shop?collection=${encodeURIComponent(detailCollection.slug)}`}
                    target="_blank"
                    className="view-in-products-btn"
                  >
                    <span>View on Storefront</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>

                {detailCollection.products && detailCollection.products.length > 0 ? (
                  <div className="detail-products-list">
                    {detailCollection.products.map((p) => (
                      <div key={p.id} className="detail-prod-item">
                        <div className="detail-prod-img">
                          <Image
                            src={p.image || '/images/collection-necklaces.jpg'}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="prod-thumb"
                          />
                        </div>
                        <div className="detail-prod-info">
                          <span className="prod-name">{p.name}</span>
                          <span className="prod-sku">SKU: {p.sku} • Stock: {p.stock}</span>
                        </div>
                        <div className="detail-prod-actions">
                          <span className="prod-price">₹{p.price.toLocaleString('en-IN')}</span>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="btn-edit-sm"
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-sub-products">
                    <Package size={28} className="empty-icon-sm" />
                    <p>
                      {detailCollection.type === 'automatic'
                        ? 'No active products currently satisfy the automatic rules.'
                        : 'No products are currently assigned to this manual collection.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="drawer-footer">
              <button
                onClick={() => {
                  const colToEdit = detailCollection;
                  setDetailCollection(null);
                  handleOpenDrawer(colToEdit);
                }}
                className="btn-primary w-full"
              >
                <Edit2 size={14} />
                <span>Edit Collection & Rules</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete / Dependency Safety Modal */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => !isDeleting && setDeleteTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-badge">
              <AlertCircle size={24} color="#C53030" />
            </div>

            <h3 className="modal-title">Delete Collection &quot;{deleteTarget.name}&quot;?</h3>

            {deleteTarget.productCount > 0 ? (
              <div className="modal-body-blocked">
                <div className="dependency-alert-box">
                  <ShieldAlert size={18} color="#C53030" />
                  <div>
                    <strong>Collection Contains {deleteTarget.productCount} Active Product(s)</strong>
                    <p>
                      To prevent catalog inconsistency, collections with active products should be archived or unlinked.
                    </p>
                  </div>
                </div>

                {deleteError && <div className="modal-error-text">{deleteError}</div>}

                <div className="modal-actions-col">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleConfirmDelete(true)}
                    className="modal-btn-archive"
                  >
                    Archive Collection (Safe: hides from storefront, keeps products intact)
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="modal-btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-body-clean">
                <p className="modal-desc">
                  Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong> (Slug: {deleteTarget.slug})?
                  This collection has 0 active products and can be safely removed from MongoDB.
                </p>

                {deleteError && <div className="modal-error-text">{deleteError}</div>}

                <div className="modal-actions-row">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="modal-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleConfirmDelete(false)}
                    className="modal-btn-danger"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Collection'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Luxury Monochrome Styles */}
      <style jsx>{`
        .admin-collections-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-toast {
          position: fixed;
          top: 84px;
          right: 28px;
          background-color: #111111;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 400;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          animation: slideIn 0.25s ease;
        }

        .admin-toast.error {
          background-color: #C53030;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .page-heading {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 2.1rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
          line-height: 1.1;
        }

        .page-sub {
          font-size: 0.86rem;
          color: #6F6F6A;
          margin: 4px 0 0 0;
        }

        .top-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          color: #111111;
          padding: 7px 14px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-secondary:hover {
          border-color: #111111;
          background-color: #F8F7F3;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #111111;
          color: #FFFFFF;
          padding: 8px 16px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.84rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-primary:hover {
          background-color: #252525;
        }

        .collections-table-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .table-filters-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid #E8E7E2;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-input-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          padding: 7px 12px;
          width: clamp(240px, 32vw, 420px);
        }

        .search-icon {
          color: #6F6F6A;
        }

        .table-search-input {
          border: none;
          background: none;
          font-family: inherit;
          font-size: 0.84rem;
          color: #111111;
          width: 100%;
          outline: none;
        }

        .search-clear-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6F6F6A;
        }

        .dropdowns-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-select {
          border: 1px solid #E8E7E2;
          background-color: #FFFFFF;
          border-radius: 6px;
          padding: 6px 12px;
          font-family: inherit;
          font-size: 0.8rem;
          color: #111111;
          cursor: pointer;
          outline: none;
        }

        .bulk-actions-strip {
          background-color: #F8F7F3;
          border-bottom: 1px solid #E8E7E2;
          padding: 8px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #111111;
          font-weight: 500;
        }

        .bulk-btn-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bulk-pill {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #111111;
          background: #111111;
          color: #ffffff;
        }

        .bulk-pill.danger {
          background: #C53030;
          border-color: #C53030;
        }

        .bulk-pill.secondary {
          background: #FFFFFF;
          color: #111111;
          border-color: #E8E7E2;
        }

        .table-error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background-color: #FFF5F5;
          color: #C53030;
          border-bottom: 1px solid #FED7D7;
          font-size: 0.84rem;
        }

        .retry-btn {
          margin-left: auto;
          background: none;
          border: 1px solid #C53030;
          color: #C53030;
          padding: 3px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.76rem;
        }

        .table-responsive-box {
          overflow-x: auto;
        }

        .collections-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
        }

        .collections-data-table th {
          background-color: #FAF9F6;
          color: #6F6F6A;
          text-align: left;
          padding: 11px 16px;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #E8E7E2;
          white-space: nowrap;
        }

        .collections-data-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #E8E7E2;
          color: #111111;
          vertical-align: middle;
        }

        .collections-data-table tr:hover td {
          background-color: #FCFBF9;
        }

        .selected-row td {
          background-color: #F8F7F3 !important;
        }

        .col-table-thumb {
          width: 52px;
          height: 52px;
          border-radius: 6px;
          overflow: hidden;
          background-color: #FAF9F6;
          border: 1px solid #E8E7E2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.col-thumb-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .col-img-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #111111 0%, #2A2A2A 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .col-title-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .col-name-link {
          background: none;
          border: none;
          text-align: left;
          font-size: 0.92rem;
          font-weight: 600;
          color: #111111;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
        }

        .col-name-link:hover {
          text-decoration: underline;
        }

        .col-desc-preview {
          font-size: 0.76rem;
          color: #6F6F6A;
          max-width: 320px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .col-type-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .col-type-badge.auto {
          background-color: #F0FDF4;
          color: #166534;
          border: 1px solid #DCFCE7;
        }

        .col-type-badge.manual {
          background-color: #F8F7F3;
          color: #555550;
          border: 1px solid #E8E7E2;
        }

        .col-slug-code {
          font-family: ui-monospace, Menlo, Consolas, monospace;
          font-size: 0.76rem;
          background-color: #F8F7F3;
          padding: 3px 6px;
          border-radius: 4px;
          color: #555550;
        }

        .product-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.76rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .product-count-badge.has-products {
          background-color: #F8F7F3;
          color: #111111;
          border: 1px solid #E8E7E2;
        }

        .product-count-badge.has-products:hover {
          background-color: #111111;
          color: #FFFFFF;
        }

        .product-count-badge.empty {
          background-color: transparent;
          color: #8E8D88;
          border: 1px dashed #E8E7E2;
        }

        .col-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .col-status-pill.active {
          background-color: #F0FDF4;
          color: #166534;
        }

        .col-status-pill.inactive {
          background-color: #F8F7F3;
          color: #6F6F6A;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
        }

        .order-control-box {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #FAF9F6;
          border: 1px solid #E8E7E2;
          padding: 3px 6px;
          border-radius: 6px;
        }

        .order-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          color: #6F6F6A;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
        }

        .order-btn:hover:not(:disabled) {
          background-color: #E8E7E2;
          color: #111111;
        }

        .order-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .order-number {
          font-size: 0.76rem;
          font-weight: 700;
          min-width: 14px;
          text-align: center;
        }

        .action-icons-wrap {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .icon-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid #E8E7E2;
          background-color: #FFFFFF;
          color: #6F6F6A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .icon-action-btn:hover {
          border-color: #111111;
          color: #111111;
          background-color: #F8F7F3;
        }

        .icon-action-btn.delete:hover {
          border-color: #C53030;
          color: #C53030;
          background-color: #FFF5F5;
        }

        .table-pagination-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-top: 1px solid #E8E7E2;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pagination-count-label {
          font-size: 0.8rem;
          color: #6F6F6A;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-nav-btn,
        .page-num-btn {
          min-width: 28px;
          height: 28px;
          padding: 0 6px;
          border: 1px solid #E8E7E2;
          background-color: #FFFFFF;
          color: #111111;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-num-btn.active {
          background-color: #111111;
          border-color: #111111;
          color: #FFFFFF;
        }

        .page-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Drawers */
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
          z-index: 500;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }

        .drawer-panel {
          width: clamp(340px, 92vw, 520px);
          height: 100vh;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
          animation: slideLeft 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #E8E7E2;
        }

        .drawer-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
          line-height: 1.2;
        }

        .drawer-sub {
          font-size: 0.8rem;
          color: #6F6F6A;
          margin: 4px 0 0 0;
        }

        .drawer-close-btn {
          background: none;
          border: none;
          color: #6F6F6A;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .drawer-close-btn:hover {
          color: #111111;
          background-color: #F8F7F3;
        }

        .drawer-form {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .type-toggle-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .type-toggle-pills {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .type-pill-btn {
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid #E8E7E2;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 3px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .type-pill-btn span:first-child {
          font-size: 0.84rem;
          font-weight: 600;
          color: #111111;
        }

        .type-pill-desc {
          font-size: 0.72rem;
          color: #6F6F6A;
        }

        .type-pill-btn.selected {
          border-color: #111111;
          background-color: #F8F7F3;
          box-shadow: inset 0 0 0 1px #111111;
        }

        .drawer-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .drawer-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #111111;
          letter-spacing: 0.02em;
        }

        .field-hint {
          font-size: 0.72rem;
          color: #8E8D88;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          border: 1px solid #E8E7E2;
          background-color: #FFFFFF;
          border-radius: 6px;
          padding: 8px 12px;
          font-family: inherit;
          font-size: 0.84rem;
          color: #111111;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: #111111;
        }

        .image-upload-widget {
          display: flex;
          align-items: center;
          gap: 14px;
          background-color: #FAF9F6;
          border: 1px solid #E8E7E2;
          padding: 12px;
          border-radius: 6px;
        }

        .image-preview-box {
          width: 68px;
          height: 68px;
          border-radius: 6px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-controls-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .image-btn-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-upload {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #111111;
          color: #FFFFFF;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.76rem;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-reset-img {
          background: none;
          border: 1px solid #E8E7E2;
          color: #6F6F6A;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.76rem;
          cursor: pointer;
        }

        /* Sub Cards (Products / Rules) */
        .form-sub-card {
          border: 1px solid #E8E7E2;
          border-radius: 8px;
          padding: 14px;
          background-color: #FAF9F6;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-sub-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sub-card-title {
          margin: 0;
          font-size: 0.88rem;
          font-weight: 600;
          color: #111111;
        }

        .sub-card-sub {
          margin: 2px 0 0 0;
          font-size: 0.74rem;
          color: #6F6F6A;
        }

        .chosen-products-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 240px;
          overflow-y: auto;
        }

        .chosen-prod-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
        }

        .chosen-order-num {
          font-size: 0.72rem;
          font-weight: 700;
          color: #8E8D88;
          width: 20px;
        }

        .chosen-thumb {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #E8E7E2;
          flex-shrink: 0;
        }

        .chosen-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .prod-name-sm {
          font-size: 0.78rem;
          font-weight: 600;
          color: #111111;
        }

        .prod-sku-sm {
          font-size: 0.7rem;
          color: #6F6F6A;
        }

        .chosen-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tiny-order-btn,
        .tiny-remove-btn {
          width: 22px;
          height: 22px;
          border-radius: 3px;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6F6F6A;
        }

        .tiny-order-btn:hover:not(:disabled) {
          color: #111111;
          border-color: #111111;
        }

        .tiny-order-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .tiny-remove-btn:hover {
          color: #C53030;
          border-color: #C53030;
          background: #FFF5F5;
        }

        .empty-products-notice {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 20px;
          border: 1px dashed #E8E7E2;
          border-radius: 6px;
          color: #8E8D88;
          font-size: 0.78rem;
          text-align: center;
        }

        .rule-match-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid #E8E7E2;
        }

        .match-radio-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: #111111;
          cursor: pointer;
        }

        .rules-builder-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rule-config-row {
          display: grid;
          grid-template-columns: 1.3fr 1.2fr 1.2fr 28px;
          gap: 6px;
          align-items: center;
        }

        .rule-select,
        .rule-input {
          font-size: 0.78rem;
          padding: 6px 8px;
        }

        .rule-del-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          color: #6F6F6A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .rule-del-btn:hover {
          color: #C53030;
          border-color: #C53030;
        }

        .btn-add-rule {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: 1px dashed #BFC1C4;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.76rem;
          font-weight: 500;
          color: #111111;
          cursor: pointer;
          align-self: flex-start;
          margin-top: 4px;
        }

        .btn-add-rule:hover {
          border-color: #111111;
          background: #FFFFFF;
        }

        .seo-accordion-card {
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          overflow: hidden;
        }

        .seo-accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background-color: #FAF9F6;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          color: #111111;
        }

        .seo-trigger-title {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .seo-accordion-content {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: #FFFFFF;
          border-top: 1px solid #E8E7E2;
        }

        .drawer-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid #E8E7E2;
          margin-top: auto;
        }

        .btn-cancel {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          color: #111111;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-submit {
          background-color: #111111;
          color: #FFFFFF;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-submit:disabled,
        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modals */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 600;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }

        .modal-card {
          background-color: #FFFFFF;
          border-radius: 10px;
          max-width: 480px;
          width: 100%;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-sizing: border-box;
        }

        .picker-modal {
          max-width: 600px;
          max-height: 85vh;
        }

        .picker-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #E8E7E2;
          padding-bottom: 12px;
        }

        .picker-filters-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .picker-products-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 380px;
          overflow-y: auto;
        }

        .picker-product-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .picker-product-row:hover {
          background-color: #FAF9F6;
        }

        .picker-product-row.selected {
          background-color: #F8F7F3;
          border-color: #111111;
        }

        .picker-thumb {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #E8E7E2;
          flex-shrink: 0;
        }

        .picker-prod-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .prod-price-badge {
          font-size: 0.8rem;
          font-weight: 600;
          color: #111111;
        }

        .picker-empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #8E8D88;
          font-size: 0.82rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .picker-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #E8E7E2;
        }

        .selected-count-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #111111;
        }

        /* Detail Drawer */
        .detail-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-banner-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background-color: #FAF9F6;
          border: 1px solid #E8E7E2;
          border-radius: 8px;
        }

        .detail-banner-thumb {
          width: 72px;
          height: 72px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #E8E7E2;
          flex-shrink: 0;
        }

        .detail-meta-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .detail-meta-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-meta-title-row h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #111111;
        }

        .detail-meta-desc {
          margin: 0;
          font-size: 0.8rem;
          color: #6F6F6A;
          line-height: 1.4;
        }

        .detail-pills-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .detail-info-pill {
          font-size: 0.72rem;
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          padding: 2px 6px;
          border-radius: 4px;
          color: #555550;
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-section-header h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #111111;
        }

        .view-in-products-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          color: #111111;
          text-decoration: underline;
        }

        .detail-products-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-prod-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
        }

        .detail-prod-img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #E8E7E2;
          flex-shrink: 0;
        }

        :global(.prod-thumb) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-prod-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .prod-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #111111;
        }

        .prod-sku {
          font-size: 0.72rem;
          color: #6F6F6A;
        }

        .detail-prod-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .prod-price {
          font-size: 0.84rem;
          font-weight: 600;
          color: #111111;
        }

        .btn-edit-sm {
          width: 26px;
          height: 26px;
          border-radius: 4px;
          border: 1px solid #E8E7E2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          text-decoration: none;
        }

        .empty-sub-products {
          padding: 28px 16px;
          text-align: center;
          background-color: #FAF9F6;
          border: 1px dashed #E8E7E2;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6F6F6A;
          font-size: 0.82rem;
        }

        .drawer-footer {
          padding: 16px 24px;
          border-top: 1px solid #E8E7E2;
        }

        /* Delete Modal */
        .modal-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #FFF5F5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .modal-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
          line-height: 1.2;
        }

        .modal-desc {
          font-size: 0.84rem;
          color: #6F6F6A;
          line-height: 1.5;
          margin: 0;
        }

        .dependency-alert-box {
          display: flex;
          gap: 12px;
          background-color: #FFF5F5;
          border: 1px solid #FED7D7;
          border-radius: 6px;
          padding: 12px;
          font-size: 0.82rem;
          color: #9B2C2C;
          line-height: 1.4;
        }

        .dependency-alert-box p {
          margin: 4px 0 0 0;
          font-size: 0.78rem;
          color: #742A2A;
        }

        .modal-error-text {
          color: #C53030;
          font-size: 0.8rem;
          font-weight: 500;
          background-color: #FFF5F5;
          padding: 8px 12px;
          border-radius: 4px;
        }

        .modal-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }

        .modal-actions-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }

        .modal-btn-danger {
          background-color: #C53030;
          color: #FFFFFF;
          border: none;
          padding: 9px 16px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-btn-archive {
          background-color: #111111;
          color: #FFFFFF;
          border: none;
          padding: 9px 16px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-btn-cancel {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          color: #111111;
          padding: 9px 16px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
        }

        /* Skeletons */
        .skeleton-row td {
          padding: 16px;
        }

        .skeleton-cell {
          height: 14px;
          background: linear-gradient(90deg, #F0EFEA 25%, #E8E7E2 50%, #F0EFEA 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-cell.check { width: 18px; height: 18px; }
        .skeleton-cell.img { width: 52px; height: 52px; border-radius: 6px; }
        .skeleton-cell.text-lg { width: 140px; height: 16px; }
        .skeleton-cell.text-sm { width: 80px; }
        .skeleton-cell.badge { width: 44px; height: 22px; border-radius: 4px; }
        .skeleton-cell.pill { width: 64px; height: 24px; border-radius: 12px; }
        .skeleton-cell.order { width: 50px; height: 24px; margin: 0 auto; }
        .skeleton-cell.actions { width: 110px; margin-left: auto; }

        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .table-empty-row {
          text-align: center;
          padding: 60px 20px !important;
        }

        .empty-state-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          max-width: 380px;
          margin: 0 auto;
        }

        .empty-icon {
          color: #8E8D88;
        }

        .empty-state-content h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #111111;
        }

        .empty-state-content p {
          margin: 0;
          font-size: 0.84rem;
          color: #6F6F6A;
          line-height: 1.4;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .table-filters-row {
            flex-direction: column;
            align-items: stretch;
          }
          .search-input-box {
            width: 100%;
          }
          .dropdowns-group {
            width: 100%;
          }
          .filter-select {
            flex: 1;
          }
          .drawer-panel {
            width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}
