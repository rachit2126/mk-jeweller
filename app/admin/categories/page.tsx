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
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderTree,
  Package,
  ShieldAlert,
} from 'lucide-react';
import { DbCategory } from '@/lib/db/types';
import CategoryDrawer from '@/components/admin/CategoryDrawer';

interface CategoryWithMeta extends DbCategory {
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

interface ParentOption {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

function CategoryThumb({ src, alt }: { src?: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = alt ? alt.trim().slice(0, 2).toUpperCase() : 'MK';

  if (imgError || !src) {
    return (
      <div className="cat-img-fallback" title={alt}>
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
      className="cat-thumb-img"
      onError={() => setImgError(true)}
    />
  );
}

export default function AdminCategoriesPage() {
  const router = useRouter();

  // State
  const [categories, setCategories] = useState<CategoryWithMeta[]>([]);
  const [allParents, setAllParents] = useState<ParentOption[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [parentFilter, setParentFilter] = useState('all');
  const [productsFilter, setProductsFilter] = useState('all');
  const [sort, setSort] = useState('order_asc');

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Form Drawer (Add / Edit)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithMeta | null>(null);

  // Detail View Drawer
  const [detailCategory, setDetailCategory] = useState<CategoryWithMeta | null>(null);

  // Delete & Safety Modal
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithMeta | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Reorder state
  const [isReordering, setIsReordering] = useState(false);

  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

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

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        search: debouncedSearch,
        status: statusFilter,
        parentId: parentFilter,
        productsFilter,
        sort,
      });

      const res = await fetch(`/api/admin/categories?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load categories (${res.status})`);
      }
      const data = await res.json();
      setCategories(data.categories || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.allParents) {
        setAllParents(data.allParents);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to retrieve categories from database.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, parentFilter, productsFilter, sort]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Open Form Drawer
  const handleOpenDrawer = (cat?: CategoryWithMeta) => {
    setEditingCategory(cat || null);
    setDrawerOpen(true);
  };

  // Quick Status Toggle
  const handleToggleStatus = async (cat: CategoryWithMeta) => {
    const nextStatus = cat.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change status');

      showToast(`Category "${cat.name}" is now ${nextStatus}`);
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, status: nextStatus } : c))
      );
      window.dispatchEvent(new CustomEvent('mk:category-updated'));
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  // Duplicate Category
  const handleDuplicate = async (cat: CategoryWithMeta) => {
    try {
      const duplicated = {
        name: `${cat.name} (Copy)`,
        slug: `${cat.slug}-copy`,
        description: cat.description || '',
        image: cat.image,
        parentId: cat.parentId || null,
        status: 'active',
        sortOrder: (cat.sortOrder ?? 1) + 1,
        seoTitle: cat.seoTitle ? `${cat.seoTitle} (Copy)` : undefined,
        seoDescription: cat.seoDescription || undefined,
      };

      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to duplicate category');

      showToast(`Duplicated "${cat.name}" successfully!`);
      await fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate category', 'error');
    }
  };

  // Reorder Movement (Move Up / Down)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...categories];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Optimistically update sortOrder in UI
    const updatedWithOrder = reordered.map((cat, idx) => ({
      ...cat,
      sortOrder: idx + 1,
    }));
    setCategories(updatedWithOrder);
    setIsReordering(true);

    try {
      const itemsPayload = updatedWithOrder.map((cat) => ({
        id: cat.id,
        sortOrder: cat.sortOrder,
      }));

      const res = await fetch('/api/admin/categories/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      });

      if (!res.ok) throw new Error('Failed to update sort order on server');
      showToast('Category sort order updated!');
      window.dispatchEvent(new CustomEvent('mk:category-updated'));
    } catch (err: any) {
      showToast(err.message || 'Error updating order', 'error');
      fetchCategories();
    } finally {
      setIsReordering(false);
    }
  };

  // Delete Category confirmation & dependency handling
  const handleOpenDeleteModal = (cat: CategoryWithMeta) => {
    setDeleteTarget(cat);
    setDeleteError(null);
    setReassignTargetId('');
  };

  const handleConfirmDelete = async (forceArchive = false) => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      if (forceArchive) {
        // Safe archive option: set category to inactive
        const res = await fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deleteTarget.id, status: 'inactive' }),
        });
        if (!res.ok) throw new Error('Failed to archive category');
        showToast(`Archived "${deleteTarget.name}". It is now hidden from storefront.`);
        setDeleteTarget(null);
        await fetchCategories();
        return;
      }

      let url = `/api/admin/categories?id=${encodeURIComponent(deleteTarget.id)}`;
      if (reassignTargetId) {
        url += `&reassignTo=${encodeURIComponent(reassignTargetId)}`;
      }

      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete category');
        return;
      }

      showToast(data.message || `Deleted category "${deleteTarget.name}"`);
      setDeleteTarget(null);
      await fetchCategories();
      window.dispatchEvent(new CustomEvent('mk:category-updated'));
    } catch (err: any) {
      setDeleteError(err.message || 'Error executing delete operation');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(categories.map((c) => c.id));
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
      const res = await fetch('/api/admin/categories/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bulk action failed');

      showToast(data.message || `Bulk ${action} completed`);
      setSelectedIds([]);
      await fetchCategories();
      window.dispatchEvent(new CustomEvent('mk:category-updated'));
    } catch (err: any) {
      showToast(err.message || `Error performing bulk ${action}`, 'error');
    } finally {
      setBulkLoading(false);
    }
  };



  return (
    <div className="admin-categories-page">
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
          <h1 className="page-heading">Categories</h1>
          <p className="page-sub">Manage product categories and catalogue structure.</p>
        </div>

        <div className="top-actions-group">
          <button onClick={() => fetchCategories()} className="btn-secondary" title="Refresh category data">
            <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={() => handleOpenDrawer()} className="btn-primary">
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="categories-table-card">
        {/* Filters Bar */}
        <div className="table-filters-row">
          <div className="search-input-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories by name, slug..."
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

            {/* Parent Category Filter */}
            <select
              value={parentFilter}
              onChange={(e) => {
                setParentFilter(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              aria-label="Filter by parent"
            >
              <option value="all">All Levels</option>
              <option value="root">Root Categories Only</option>
              {allParents.map((p) => (
                <option key={p.id} value={p.id}>
                  Parent: {p.name}
                </option>
              ))}
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
              <option value="empty">Empty Categories</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="filter-select"
              aria-label="Sort categories"
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
            <span className="bulk-count-label">{selectedIds.length} category(ies) selected</span>
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
            <button onClick={() => fetchCategories()} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* Categories Table */}
        <div className="table-responsive-box">
          <table className="categories-data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={categories.length > 0 && selectedIds.length === categories.length}
                    onChange={handleSelectAll}
                    aria-label="Select all categories"
                    className="admin-checkbox"
                  />
                </th>
                <th style={{ width: '64px' }}>IMAGE</th>
                <th>CATEGORY</th>
                <th>SLUG</th>
                <th style={{ textAlign: 'center' }}>PRODUCTS</th>
                <th>PARENT</th>
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
                    <td><div className="skeleton-cell text-sm" /></td>
                    <td><div className="skeleton-cell badge" /></td>
                    <td><div className="skeleton-cell text-sm" /></td>
                    <td><div className="skeleton-cell pill" /></td>
                    <td><div className="skeleton-cell order" /></td>
                    <td><div className="skeleton-cell actions" /></td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty-row">
                    <div className="empty-state-content">
                      <FolderTree size={36} strokeWidth={1.5} className="empty-icon" />
                      <h3>No categories found</h3>
                      <p>
                        {search || statusFilter !== 'all' || parentFilter !== 'all'
                          ? 'No categories match the active filter criteria.'
                          : 'Create your first category to organize your jewellery catalogue.'}
                      </p>
                      <button onClick={() => handleOpenDrawer()} className="btn-primary">
                        <Plus size={15} />
                        <span>Add Category</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => {
                  const isChecked = selectedIds.includes(cat.id);

                  return (
                    <tr key={cat.id} className={isChecked ? 'selected-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(cat.id)}
                          aria-label={`Select ${cat.name}`}
                          className="admin-checkbox"
                        />
                      </td>

                      <td>
                        <div className="cat-table-thumb">
                          <CategoryThumb src={cat.image} alt={cat.name} />
                        </div>
                      </td>

                      <td>
                        <div className="cat-title-cell">
                          <button
                            onClick={() => setDetailCategory(cat)}
                            className="cat-name-link"
                            title="View category details & products"
                          >
                            {cat.name}
                          </button>
                          {cat.description && (
                            <span className="cat-desc-preview" title={cat.description}>
                              {cat.description}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <code className="cat-slug-code">{cat.slug}</code>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <Link
                          href={`/admin/products?category=${encodeURIComponent(cat.slug)}`}
                          className={`product-count-badge ${cat.productCount > 0 ? 'has-products' : 'empty'}`}
                          title={`Click to view all ${cat.productCount} product(s) in "${cat.name}"`}
                        >
                          <Package size={12} />
                          <span>{cat.productCount}</span>
                        </Link>
                      </td>

                      <td>
                        <span className={`parent-badge ${cat.parentName ? 'sub' : 'root'}`}>
                          {cat.parentName || 'Root'}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat)}
                          className={`cat-status-pill ${cat.status === 'active' ? 'active' : 'inactive'}`}
                          title={`Click to switch to ${cat.status === 'active' ? 'Inactive' : 'Active'}`}
                        >
                          <span className="status-dot" />
                          <span>{cat.status === 'active' ? 'Active' : 'Inactive'}</span>
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
                          <span className="order-number">{cat.sortOrder ?? index + 1}</span>
                          <button
                            disabled={index === categories.length - 1 || isReordering}
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
                            onClick={() => setDetailCategory(cat)}
                            className="icon-action-btn"
                            title="View Category Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenDrawer(cat)}
                            className="icon-action-btn"
                            title="Edit Category"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(cat)}
                            className="icon-action-btn"
                            title="Duplicate Category"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(cat)}
                            className="icon-action-btn delete"
                            title="Delete or Archive Category"
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
            Showing {categories.length > 0 ? (page - 1) * 15 + 1 : 0} to{' '}
            {Math.min(page * 15, total)} of {total} categories
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

      {/* Add / Edit Category Drawer (Redesigned Production Component) */}
      <CategoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        category={editingCategory}
        allCategories={categories}
        allParents={allParents}
        onSaveSuccess={() => {
          fetchCategories();
        }}
        onToast={showToast}
      />

      {/* Category Detail View Drawer */}
      {detailCategory && (
        <div className="drawer-backdrop" onClick={() => setDetailCategory(null)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">{detailCategory.name}</h2>
                <p className="drawer-sub">Catalogue Overview & Attached Products</p>
              </div>
              <button onClick={() => setDetailCategory(null)} className="drawer-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="detail-drawer-body">
              {/* Category Snapshot */}
              <div className="detail-banner-card">
                <div className="detail-banner-thumb">
                  <CategoryThumb src={detailCategory.image} alt={detailCategory.name} />
                </div>
                <div className="detail-meta-col">
                  <div className="detail-meta-title-row">
                    <h3>{detailCategory.name}</h3>
                    <span className={`cat-status-pill ${detailCategory.status === 'active' ? 'active' : 'inactive'}`}>
                      {detailCategory.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="detail-meta-desc">
                    {detailCategory.description || 'No description provided for this category.'}
                  </p>
                  <div className="detail-pills-row">
                    <span className="detail-info-pill">Slug: {detailCategory.slug}</span>
                    <span className="detail-info-pill">Order: #{detailCategory.sortOrder}</span>
                    <span className="detail-info-pill">Parent: {detailCategory.parentName || 'Root'}</span>
                  </div>
                </div>
              </div>

              {/* Associated Products Section */}
              <div className="detail-section">
                <div className="detail-section-header">
                  <h4>Products in this Category ({detailCategory.products?.length || detailCategory.productCount || 0})</h4>
                  <Link
                    href={`/admin/products?category=${encodeURIComponent(detailCategory.slug)}`}
                    className="view-in-products-btn"
                  >
                    <span>Open in Products Tab</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>

                {detailCategory.products && detailCategory.products.length > 0 ? (
                  <div className="detail-products-list">
                    {detailCategory.products.map((p) => (
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
                    <p>No products are currently assigned to this category.</p>
                    <Link href="/admin/products/new" className="btn-secondary text-xs">
                      <Plus size={13} />
                      <span>Add Product to this Category</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="drawer-footer">
              <button
                onClick={() => {
                  const catToEdit = detailCategory;
                  setDetailCategory(null);
                  handleOpenDrawer(catToEdit);
                }}
                className="btn-primary w-full"
              >
                <Edit2 size={14} />
                <span>Edit Category Details</span>
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

            <h3 className="modal-title">Delete Category &quot;{deleteTarget.name}&quot;?</h3>

            {deleteTarget.productCount > 0 ? (
              <div className="modal-body-blocked">
                <div className="dependency-alert-box">
                  <ShieldAlert size={18} color="#C53030" />
                  <div>
                    <strong>Category Contains {deleteTarget.productCount} Active Product(s)</strong>
                    <p>
                      To protect catalogue data integrity, categories with active products cannot be blindly deleted.
                      Choose an action below:
                    </p>
                  </div>
                </div>

                {/* Option 1: Reassign Products */}
                <div className="reassign-box">
                  <label className="field-label">Option A: Move products to another category:</label>
                  <select
                    value={reassignTargetId}
                    onChange={(e) => setReassignTargetId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select target category...</option>
                    {allParents
                      .filter((p) => p.id !== deleteTarget.id && p.slug !== deleteTarget.slug)
                      .map((p) => (
                        <option key={p.id} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>

                {deleteError && <div className="modal-error-text">{deleteError}</div>}

                <div className="modal-actions-col">
                  {reassignTargetId && (
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleConfirmDelete(false)}
                      className="modal-btn-danger"
                    >
                      {isDeleting ? 'Reassigning & Deleting...' : `Move ${deleteTarget.productCount} Product(s) & Delete Category`}
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleConfirmDelete(true)}
                    className="modal-btn-archive"
                  >
                    Option B: Archive Category (Hide from Storefront, keep products safe)
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
                  This category has 0 products and can be safely removed from MongoDB.
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
                    {isDeleting ? 'Deleting...' : 'Delete Category'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Luxury Monochrome Styles */}
      <style jsx>{`
        .admin-categories-page {
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

        .categories-table-card {
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

        .categories-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
        }

        .categories-data-table th {
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

        .categories-data-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #E8E7E2;
          color: #111111;
          vertical-align: middle;
        }

        .categories-data-table tr:hover td {
          background-color: #FCFBF9;
        }

        .selected-row td {
          background-color: #F8F7F3 !important;
        }

        .cat-table-thumb {
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

        :global(.cat-thumb-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cat-img-fallback {
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

        .cat-title-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cat-name-link {
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

        .cat-name-link:hover {
          text-decoration: underline;
        }

        .cat-desc-preview {
          font-size: 0.76rem;
          color: #6F6F6A;
          max-width: 320px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cat-slug-code {
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
          text-decoration: none;
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
          border-color: #111111;
        }

        .product-count-badge.empty {
          background-color: transparent;
          color: #8E8D88;
          border: 1px dashed #E8E7E2;
        }

        .parent-badge {
          display: inline-block;
          font-size: 0.76rem;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .parent-badge.root {
          color: #6F6F6A;
          background-color: #F8F7F3;
        }

        .parent-badge.sub {
          color: #111111;
          background-color: #EFEFEA;
          border: 1px solid #E8E7E2;
        }

        .cat-status-pill {
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

        .cat-status-pill.active {
          background-color: #F0FDF4;
          color: #166534;
        }

        .cat-status-pill.inactive {
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
          width: clamp(340px, 90vw, 480px);
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

        /* Modal */
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

        .reassign-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
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

        /* Skeleton styles */
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
        .skeleton-cell.badge { width: 34px; height: 22px; margin: 0 auto; border-radius: 12px; }
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
