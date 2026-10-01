'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { DbCategory } from '@/lib/db/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/collection-necklaces.jpg');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (cat?: DbCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setSlug(cat.slug);
      setDescription(cat.description || '');
      setImage(cat.image);
      setSortOrder(cat.sortOrder);
    } else {
      setEditingCategory(null);
      setName('');
      setSlug('');
      setDescription('');
      setImage('/images/collection-necklaces.jpg');
      setSortOrder(categories.length + 1);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const payload = editingCategory
        ? { id: editingCategory.id, name, slug, description, image, sortOrder }
        : { name, slug, description, image, sortOrder };

      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save category');
      } else {
        showToast(editingCategory ? 'Category updated!' : 'Category created!');
        setModalOpen(false);
        fetchCategories();
      }
    } catch {
      showToast('Error saving category');
    }
  };

  const handleToggleStatus = async (cat: DbCategory) => {
    try {
      const nextStatus = cat.status === 'active' ? 'inactive' : 'active';
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Category "${cat.name}" is now ${nextStatus}`);
        fetchCategories();
      }
    } catch {
      showToast('Failed to update status');
    }
  };

  const handleDelete = async (cat: DbCategory) => {
    if (cat.productCount > 0) {
      alert(`This category contains ${cat.productCount} product(s). Please move or delete these products before deleting this category.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${cat.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete');
      } else {
        showToast(`Deleted category "${cat.name}"`);
        fetchCategories();
      }
    } catch {
      showToast('Error deleting category');
    }
  };

  return (
    <div className="admin-categories-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Categories</h1>
          <p className="page-sub">Manage product categories.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="categories-table-card">
        <div className="table-responsive-box">
          <table className="categories-data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th>Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="table-empty">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty">No categories found.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div className="cat-table-thumb">
                        <Image
                          src={cat.image || '/images/collection-necklaces.jpg'}
                          alt={cat.name}
                          width={42}
                          height={42}
                          className="thumb-img"
                        />
                      </div>
                    </td>
                    <td>
                      <span className="cat-table-name">{cat.name}</span>
                    </td>
                    <td>
                      <span className="cat-table-slug">{cat.slug}</span>
                    </td>
                    <td>
                      <span className="cat-table-count">{cat.productCount}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`status-toggle-pill ${cat.status}`}
                        title="Click to toggle active state"
                      >
                        {cat.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <span className="cat-table-order">{cat.sortOrder}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cell">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="icon-btn"
                          title="Edit Category"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="icon-btn delete"
                          title="Delete Category"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Add New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label className="field-label">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Mangalsutra"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="mangalsutra"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short category description..."
                  className="form-textarea"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          background-color: #2F855A;
          color: #FFFFFF;
          padding: 10px 18px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 300;
          font-size: 0.86rem;
        }

        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .page-heading {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 600;
          color: #342727;
          margin: 0;
        }

        .page-sub {
          font-size: 0.88rem;
          color: #806D68;
          margin: 4px 0 0 0;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #B76E79;
          color: #FFFFFF;
          padding: 9px 18px;
          border-radius: 10px;
          border: none;
          font-family: inherit;
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.3);
          transition: background 0.2s ease;
        }

        .btn-primary:hover {
          background-color: #9C5762;
        }

        .categories-table-card {
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          border-radius: 18px;
          box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03);
          overflow: hidden;
        }

        .table-responsive-box {
          overflow-x: auto;
        }

        .categories-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
        }

        .categories-data-table th {
          text-align: left;
          padding: 12px 16px;
          font-weight: 600;
          color: #806D68;
          border-bottom: 1px solid #EAE2DB;
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background-color: #FAF7F4;
        }

        .categories-data-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #F4EFEB;
          color: #342727;
          vertical-align: middle;
        }

        .cat-table-thumb {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          overflow: hidden;
          background-color: #F8F5F2;
          border: 1px solid #E8D8D0;
        }

        :global(.thumb-img) {
          object-fit: cover;
        }

        .cat-table-name {
          font-weight: 600;
          color: #342727;
        }

        .cat-table-slug {
          color: #806D68;
          font-size: 0.8rem;
        }

        .cat-table-count {
          font-weight: 600;
        }

        .status-toggle-pill {
          border: none;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
        }

        .status-toggle-pill.active {
          background-color: #E6FFFA;
          color: #234E52;
        }

        .status-toggle-pill.inactive {
          background-color: #EDF2F7;
          color: #4A5568;
        }

        .actions-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid #EAE2DB;
          background: #FFFFFF;
          color: #806D68;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .icon-btn:hover {
          border-color: #B76E79;
          color: #B76E79;
          background-color: #FFF5F2;
        }

        .icon-btn.delete:hover {
          border-color: #E53E3E;
          color: #E53E3E;
          background-color: #FFF5F5;
        }

        .table-empty {
          text-align: center;
          padding: 40px !important;
          color: #806D68;
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
          width: min(92%, 500px);
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .modal-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: #342727;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #806D68;
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #342727;
        }

        .form-input, .form-textarea {
          background-color: #FFF9F3;
          border: 1px solid #E8D8D0;
          border-radius: 10px;
          padding: 9px 12px;
          font-family: inherit;
          font-size: 0.86rem;
          color: #342727;
          outline: none;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #B76E79;
          background-color: #FFFFFF;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .btn-cancel {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #E8D8D0;
          background: #FFFFFF;
          color: #342727;
          cursor: pointer;
        }

        .btn-save {
          padding: 8px 18px;
          border-radius: 8px;
          border: none;
          background-color: #B76E79;
          color: #FFFFFF;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
