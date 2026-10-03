'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Download,
  Upload,
  Search,
  Edit2,
  Trash2,
  Eye,
  Copy,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import { DbProduct } from '@/lib/db/types';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/categories?limit=all')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories) setAvailableCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== category) {
      setCategory(cat);
      setPage(1);
    }
  }, [searchParams]);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<DbProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '8',
        search,
        category,
        status,
        sort,
      });

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, sort]);

  useEffect(() => {
    fetchProducts();
    const handleUpdate = () => fetchProducts();
    window.addEventListener('mk:inventory-updated', handleUpdate);
    window.addEventListener('mk:product-updated', handleUpdate);
    return () => {
      window.removeEventListener('mk:inventory-updated', handleUpdate);
      window.removeEventListener('mk:product-updated', handleUpdate);
    };
  }, [fetchProducts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDuplicate = async (product: DbProduct) => {
    try {
      const duplicated = {
        ...product,
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy`,
        sku: `${product.sku}-CP`,
      };
      delete (duplicated as any).id;
      delete (duplicated as any).createdAt;
      delete (duplicated as any).updatedAt;

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });

      if (res.ok) {
        showToast(`Duplicated "${product.name}" successfully!`);
        fetchProducts();
      }
    } catch {
      showToast('Failed to duplicate product');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id || (deleteTarget as any)._id?.toString();
    if (!targetId) {
      showToast('Error: Product ID is missing');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${targetId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Failed to delete product');
      } else {
        showToast(data.message || `Deleted "${deleteTarget.name}"`);
        setDeleteTarget(null);
        setProducts((prev) => prev.filter((p) => p.id !== targetId && (p as any)._id !== targetId));
        await fetchProducts();
      }
    } catch {
      showToast('Unable to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkStatusChange = async (newStatus: 'active' | 'draft') => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: selectedIds, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || `Failed to update ${selectedIds.length} products`);
      } else {
        showToast(data.message || `Updated ${selectedIds.length} products to ${newStatus}`);
        setSelectedIds([]);
        await fetchProducts();
      }
    } catch {
      showToast('Error updating products. Please try again.');
    } finally {
      setBulkLoading(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete selected products');
      } else {
        showToast(data.message || `Successfully removed ${selectedIds.length} products`);
        setShowBulkDeleteModal(false);
        setSelectedIds([]);
        await fetchProducts();
      }
    } catch {
      showToast('Error deleting products. Please try again.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
    const rows = products.map(p => [p.id, `"${p.name}"`, p.sku, p.category, p.price, p.stock, p.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mk_products_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported products to CSV');
  };

  return (
    <div className="admin-products-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Products</h1>
          <p className="page-sub">Manage all products in your store.</p>
        </div>

        <div className="top-actions-group">
          <button onClick={() => showToast('Import feature: ready for CSV / Shopify JSON upload')} className="btn-secondary">
            <Upload size={15} />
            <span>Import</span>
          </button>
          <button onClick={handleExportCSV} className="btn-secondary">
            <Download size={15} />
            <span>Export</span>
          </button>
          <Link href="/admin/products/new" className="btn-primary">
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="products-table-card">
        {/* Filters Bar matching reference screenshot */}
        <div className="table-filters-row">
          <div className="search-input-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="table-search-input"
            />
          </div>

          <div className="dropdowns-group">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c.id || c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="archived">Archived</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="filter-select"
              aria-label="Sort products"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="stock_asc">Stock: Low to High</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when selected) */}
        {selectedIds.length > 0 && (
          <div className="bulk-actions-strip">
            <span>{selectedIds.length} product(s) selected</span>
            <div className="bulk-btn-group">
              <button
                type="button"
                onClick={() => handleBulkStatusChange('active')}
                disabled={bulkLoading}
                className="bulk-pill"
              >
                {bulkLoading ? 'Updating...' : 'Set Active'}
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('draft')}
                disabled={bulkLoading}
                className="bulk-pill"
              >
                {bulkLoading ? 'Updating...' : 'Set Draft'}
              </button>
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(true)}
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

        {/* Table */}
        <div className="table-responsive-box">
          <table className="products-data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedIds.length === products.length}
                    onChange={handleSelectAll}
                    aria-label="Select all products"
                    className="admin-checkbox"
                  />
                </th>
                <th style={{ width: '60px' }}>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="table-empty-row">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty-row">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isChecked = selectedIds.includes(product.id);
                  const isOutOfStock = product.stock === 0 || product.status === 'out_of_stock';

                  return (
                    <tr key={product.id} className={isChecked ? 'selected-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(product.id)}
                          aria-label={`Select ${product.name}`}
                          className="admin-checkbox"
                        />
                      </td>
                      <td>
                        <div className="product-table-thumb">
                          <Image
                            src={product.images[0] || '/images/collection-necklaces.jpg'}
                            alt={product.name}
                            width={42}
                            height={42}
                            className="table-img"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="product-title-cell">
                          <span className="prod-name">{product.name}</span>
                          <span className="prod-sku">{product.sku}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-cell-text">{product.categoryLabel || product.category}</span>
                      </td>
                      <td>
                        <span className="price-cell-text">₹{product.price.toLocaleString('en-IN')}</span>
                      </td>
                      <td>
                        <span className={`stock-cell-text ${product.stock <= 5 ? 'low-stock-warn' : ''}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`prod-status-pill ${
                            isOutOfStock
                              ? 'out-of-stock'
                              : product.status === 'draft'
                              ? 'draft'
                              : 'active'
                          }`}
                        >
                          {isOutOfStock ? 'Out of Stock' : product.status === 'draft' ? 'Draft' : 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-icons-wrap">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="icon-action-btn"
                            title="Preview on Storefront"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="icon-action-btn"
                            title="Edit Product"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(product)}
                            className="icon-action-btn"
                            title="Duplicate Product"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteTarget(product);
                            }}
                            className="icon-action-btn delete"
                            title="Delete Product"
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

        {/* Table Bottom Pagination matching reference screenshot */}
        <div className="table-pagination-footer">
          <span className="pagination-count-label">
            Showing {products.length > 0 ? (page - 1) * 8 + 1 : 0} to{' '}
            {Math.min(page * 8, total)} of {total} products
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!deleting) setDeleteTarget(null);
          }}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-badge">
              <AlertCircle size={24} color="#C53030" />
            </div>
            <h3 className="modal-title">Delete Product?</h3>
            <p className="modal-desc">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong> (SKU: {deleteTarget.sku})? This action will remove it from the catalog.
            </p>
            <div className="modal-actions-row">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="modal-btn-cancel"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="modal-btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!bulkLoading) setShowBulkDeleteModal(false);
          }}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-badge">
              <AlertCircle size={24} color="#C53030" />
            </div>
            <h3 className="modal-title">Delete {selectedIds.length} Products?</h3>
            <p className="modal-desc">
              Are you sure you want to permanently delete <strong>{selectedIds.length}</strong> selected products? If any product has existing customer orders, it will be securely archived instead of broken.
            </p>
            <div className="modal-actions-row">
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(false)}
                className="modal-btn-cancel"
                disabled={bulkLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBulkDelete}
                className="modal-btn-danger"
                disabled={bulkLoading}
              >
                {bulkLoading ? 'Deleting...' : `Delete ${selectedIds.length} Products`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-products-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-toast {
          position: fixed;
          top: 84px;
          right: 28px;
          background-color: #2F855A;
          color: #FFFFFF;
          padding: 10px 18px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 300;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.86rem;
          font-weight: 500;
          animation: slideIn 0.25s ease;
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
          padding: 7px 12px;
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
          text-decoration: none;
          transition: all 0.18s ease;
        }

        .btn-primary:hover {
          background-color: #252525;
        }

        .products-table-card {
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
          width: clamp(220px, 28vw, 360px);
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
          gap: 6px;
        }

        .bulk-pill {
          background-color: #FFFFFF;
          border: 1px solid #111111;
          color: #111111;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .bulk-pill:hover:not(:disabled) {
          background-color: #111111;
          color: #FFFFFF;
        }

        .bulk-pill.danger {
          background-color: #FDF0EE;
          border-color: #FDF0EE;
          color: #C0392B;
        }

        .bulk-pill.danger:hover:not(:disabled) {
          background-color: #C0392B;
          color: #FFFFFF;
        }

        .bulk-pill.secondary {
          background-color: #FFFFFF;
          border-color: #E8E7E2;
          color: #6F6F6A;
        }

        .bulk-pill.secondary:hover:not(:disabled) {
          background-color: #F8F7F3;
          color: #111111;
        }

        .bulk-pill:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .table-responsive-box {
          overflow-x: auto;
        }

        .products-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }

        .products-data-table th {
          text-align: left;
          padding: 10px 14px;
          font-weight: 700;
          color: #6F6F6A;
          border-bottom: 1px solid #E8E7E2;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background-color: #F8F7F3;
        }

        .products-data-table td {
          padding: 11px 14px;
          border-bottom: 1px solid #E8E7E2;
          color: #111111;
          vertical-align: middle;
        }

        .selected-row {
          background-color: #F8F7F3;
        }

        .admin-checkbox {
          width: 15px;
          height: 15px;
          accent-color: #111111;
          cursor: pointer;
        }

        .product-table-thumb {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          overflow: hidden;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
        }

        :global(.table-img) {
          object-fit: cover;
        }

        .product-title-cell {
          display: flex;
          flex-direction: column;
        }

        .prod-name {
          font-weight: 600;
          color: #111111;
        }

        .prod-sku {
          font-size: 0.7rem;
          color: #8E8D88;
        }

        .category-cell-text {
          color: #6F6F6A;
        }

        .price-cell-text {
          font-weight: 600;
          color: #111111;
        }

        .stock-cell-text {
          font-weight: 500;
        }

        .stock-cell-text.low-stock-warn {
          color: #C0392B;
          font-weight: 700;
        }

        .prod-status-pill {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .prod-status-pill.active {
          background-color: #EDF7F2;
          color: #1E7E5E;
        }

        .prod-status-pill.draft {
          background-color: #FEF8ED;
          color: #C07D1C;
        }

        .prod-status-pill.out-of-stock {
          background-color: #FDF0EE;
          color: #C0392B;
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
          background: #FFFFFF;
          color: #6F6F6A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .icon-action-btn:hover {
          border-color: #111111;
          color: #111111;
          background-color: #F8F7F3;
        }

        .icon-action-btn.delete:hover {
          border-color: #C0392B;
          color: #C0392B;
          background-color: #FDF0EE;
        }

        .table-empty-row {
          text-align: center;
          padding: 40px !important;
          color: #8E8D88;
        }

        /* PAGINATION FOOTER */
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
          gap: 5px;
        }

        .page-nav-btn {
          width: 30px;
          height: 30px;
          border-radius: 4px;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .page-nav-btn:hover:not(:disabled) {
          border-color: #111111;
          background-color: #F8F7F3;
        }

        .page-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-num-btn {
          min-width: 30px;
          height: 30px;
          border-radius: 4px;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          color: #111111;
          font-family: inherit;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .page-num-btn:hover {
          border-color: #111111;
        }

        .page-num-btn.active {
          background-color: #111111;
          border-color: #111111;
          color: #FFFFFF;
          font-weight: 600;
        }

        .page-ellipsis {
          color: #8E8D88;
          padding: 0 4px;
        }

        /* MODAL */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(52, 39, 39, 0.45);
          backdrop-filter: blur(4px);
          z-index: 250;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          width: min(92%, 460px);
          background: #FFFFFF;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .modal-icon-badge {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: #FFF5F5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .modal-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #342727;
          margin: 0 0 8px 0;
        }

        .modal-desc {
          font-size: 0.88rem;
          color: #806D68;
          margin: 0 0 22px 0;
          line-height: 1.5;
        }

        .modal-actions-row {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .modal-btn-cancel {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #E8D8D0;
          background: #FFFFFF;
          font-family: inherit;
          font-size: 0.86rem;
          color: #342727;
          cursor: pointer;
        }

        .modal-btn-danger {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: none;
          background-color: #C53030;
          color: #FFFFFF;
          font-family: inherit;
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
