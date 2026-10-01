'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import { DbCollection } from '@/lib/db/types';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<DbCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<DbCollection | null>(null);

  // Form
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('/images/collection-necklaces.jpg');
  const [heroImage, setHeroImage] = useState('/images/editorial/bridal-banner-clean-hd.jpg');
  const [type, setType] = useState<'manual' | 'automatic'>('manual');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/collections');
      const data = await res.json();
      setCollections(data.collections || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (col?: DbCollection) => {
    if (col) {
      setEditingCollection(col);
      setName(col.name);
      setSlug(col.slug);
      setDescription(col.description || '');
      setThumbnail(col.thumbnail);
      setHeroImage(col.heroImage || '/images/editorial/bridal-banner-clean-hd.jpg');
      setType(col.type);
      setSortOrder(col.sortOrder);
    } else {
      setEditingCollection(null);
      setName('');
      setSlug('');
      setDescription('');
      setThumbnail('/images/collection-necklaces.jpg');
      setHeroImage('/images/editorial/bridal-banner-clean-hd.jpg');
      setType('manual');
      setSortOrder(collections.length + 1);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCollection ? 'PUT' : 'POST';
      const payload = editingCollection
        ? { id: editingCollection.id, name, slug, description, thumbnail, heroImage, type, sortOrder }
        : { name, slug, description, thumbnail, heroImage, type, sortOrder };

      const res = await fetch('/api/admin/collections', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save collection');
      } else {
        showToast(editingCollection ? 'Collection updated!' : 'Collection created!');
        setModalOpen(false);
        fetchCollections();
      }
    } catch {
      showToast('Error saving collection');
    }
  };

  const handleToggleStatus = async (col: DbCollection) => {
    try {
      const nextStatus = col.status === 'active' ? 'inactive' : 'active';
      const res = await fetch('/api/admin/collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: col.id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Collection "${col.name}" is now ${nextStatus}`);
        fetchCollections();
      }
    } catch {
      showToast('Failed to update status');
    }
  };

  const handleDelete = async (col: DbCollection) => {
    if (!confirm(`Are you sure you want to delete collection "${col.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/collections?id=${col.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Deleted collection "${col.name}"`);
        fetchCollections();
      }
    } catch {
      showToast('Error deleting collection');
    }
  };

  return (
    <div className="admin-collections-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Collections</h1>
          <p className="page-sub">Manage special suites & collections.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={16} />
          <span>Add Collection</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="collections-table-card">
        <div className="table-responsive-box">
          <table className="collections-data-table">
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
                  <td colSpan={7} className="table-empty">Loading collections...</td>
                </tr>
              ) : collections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty">No collections found.</td>
                </tr>
              ) : (
                collections.map((col) => (
                  <tr key={col.id}>
                    <td>
                      <div className="col-table-thumb">
                        <Image
                          src={col.thumbnail || '/images/collection-necklaces.jpg'}
                          alt={col.name}
                          width={42}
                          height={42}
                          className="thumb-img"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="col-title-col">
                        <span className="col-table-name">{col.name}</span>
                        <span className="col-type-badge">{col.type}</span>
                      </div>
                    </td>
                    <td>
                      <span className="col-table-slug">{col.slug}</span>
                    </td>
                    <td>
                      <span className="col-table-count">{col.productCount}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(col)}
                        className={`status-toggle-pill ${col.status}`}
                        title="Click to toggle active state"
                      >
                        {col.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <span className="col-table-order">{col.sortOrder}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cell">
                        <button
                          onClick={() => handleOpenModal(col)}
                          className="icon-btn"
                          title="Edit Collection"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(col)}
                          className="icon-btn delete"
                          title="Delete Collection"
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

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCollection ? `Edit: ${editingCollection.name}` : 'Add New Collection'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label className="field-label">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCollection) {
                      setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Royal Jaipur Heirlooms"
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
                  placeholder="royal-jaipur-heirlooms"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Collection Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="form-select"
                >
                  <option value="manual">Manual Collection (Select Products)</option>
                  <option value="automatic">Automatic Collection (Rule Based)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
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
                  placeholder="Collection narrative..."
                  className="form-textarea"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingCollection ? 'Save Changes' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        .collections-table-card {
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          border-radius: 18px;
          box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03);
          overflow: hidden;
        }

        .table-responsive-box {
          overflow-x: auto;
        }

        .collections-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
        }

        .collections-data-table th {
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

        .collections-data-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #F4EFEB;
          color: #342727;
          vertical-align: middle;
        }

        .col-table-thumb {
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

        .col-title-col {
          display: flex;
          flex-direction: column;
        }

        .col-table-name {
          font-weight: 600;
          color: #342727;
        }

        .col-type-badge {
          font-size: 0.68rem;
          text-transform: uppercase;
          color: #B76E79;
          font-weight: 600;
        }

        .col-table-slug {
          color: #806D68;
          font-size: 0.8rem;
        }

        .col-table-count {
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

        .form-input, .form-select, .form-textarea {
          background-color: #FFF9F3;
          border: 1px solid #E8D8D0;
          border-radius: 10px;
          padding: 9px 12px;
          font-family: inherit;
          font-size: 0.86rem;
          color: #342727;
          outline: none;
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
