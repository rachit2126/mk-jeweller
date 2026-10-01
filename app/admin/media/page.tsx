'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  FolderPlus,
  Search,
  CheckCircle2,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';
import { DbMediaItem } from '@/lib/db/types';

export default function AdminMediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<DbMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inspector modal for selected media item
  const [inspectTarget, setInspectTarget] = useState<DbMediaItem | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        folder: folderFilter,
        type: typeFilter,
      });
      const res = await fetch(`/api/admin/media?${params}`);
      const data = await res.json();
      setMedia(data.media || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search, folderFilter, typeFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', activeTab === 'all' ? 'products' : activeTab);

        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) successCount++;
      } catch (err) {
        console.error(err);
      }
    }

    setUploading(false);
    showToast(`Uploaded & optimized ${successCount} image(s)`);
    fetchMedia();
  };

  const handleDelete = async (item: DbMediaItem) => {
    if (item.usedBy && item.usedBy.length > 0) {
      alert(`Cannot delete: This file is currently used by: ${item.usedBy.join(', ')}. Please replace or remove it before deleting.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete ${item.filename}?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${item.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete');
      } else {
        showToast('Media file deleted');
        setInspectTarget(null);
        fetchMedia();
      }
    } catch {
      showToast('Error deleting media');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    showToast('Copied image URL to clipboard!');
  };

  const filteredMedia = media.filter((m) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'images') return m.type === 'image';
    if (activeTab === 'videos') return m.type === 'video';
    if (activeTab === 'banners') return m.folder === 'banners';
    if (activeTab === 'category-images') return m.folder === 'categories';
    if (activeTab === 'product-images') return m.folder === 'products';
    return true;
  });

  return (
    <div className="admin-media-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Media Library</h1>
          <p className="page-sub">Manage all uploaded images and media files.</p>
        </div>

        <div className="header-actions">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-upload"
          >
            <Upload size={16} />
            <span>{uploading ? 'Optimizing Upload...' : 'Upload Files'}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button onClick={() => showToast('Folder created')} className="btn-folder">
            <FolderPlus size={16} />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Tabs Row matching reference screenshot */}
      <div className="media-tabs-bar">
        {[
          { key: 'all', label: 'All Files' },
          { key: 'images', label: 'Images' },
          { key: 'videos', label: 'Videos' },
          { key: 'banners', label: 'Banners' },
          { key: 'category-images', label: 'Category Images' },
          { key: 'product-images', label: 'Product Images' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`media-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controls & Filter Bar matching reference screenshot */}
      <div className="media-controls-card">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="media-search-input"
          />
        </div>

        <div className="filters-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="media-filter-select"
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>

          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="media-filter-select"
            aria-label="Filter by folder"
          >
            <option value="all">All Folders</option>
            <option value="products">Products</option>
            <option value="categories">Categories</option>
            <option value="banners">Banners</option>
          </select>

          <select className="media-filter-select" aria-label="Sort files">
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="size">Sort: File Size</option>
          </select>
        </div>
      </div>

      {/* Media Grid matching reference screenshot */}
      <div className="media-grid-container">
        {loading ? (
          <div className="media-empty">Loading media library...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="media-empty">No media files found. Upload images to get started.</div>
        ) : (
          filteredMedia.map((item) => (
            <div
              key={item.id}
              className="media-card-item"
              onClick={() => setInspectTarget(item)}
            >
              <div className="media-thumb-area">
                <Image
                  src={item.url}
                  alt={item.originalName}
                  fill
                  className="media-img"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 180px"
                />
                <span className="media-format-pill">
                  {item.mimeType.replace('image/', '').toUpperCase()}
                </span>
              </div>

              <div className="media-info-bar">
                <span className="media-filename" title={item.filename}>
                  {item.filename}
                </span>
                <span className="media-filesize">
                  {(item.sizeBytes / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Media Inspector Modal */}
      {inspectTarget && (
        <div className="modal-backdrop" onClick={() => setInspectTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">File Details</h3>
              <button onClick={() => setInspectTarget(null)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="inspect-layout">
              <div className="inspect-image-box">
                <Image
                  src={inspectTarget.url}
                  alt={inspectTarget.originalName}
                  width={240}
                  height={240}
                  className="inspect-img"
                />
              </div>

              <div className="inspect-details-col">
                <div className="detail-row">
                  <span className="detail-label">Original Name:</span>
                  <span className="detail-val">{inspectTarget.originalName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Dimensions:</span>
                  <span className="detail-val">{inspectTarget.dimensions?.width} × {inspectTarget.dimensions?.height} px</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">File Size:</span>
                  <span className="detail-val">{(inspectTarget.sizeBytes / 1024).toFixed(1)} KB</span>
                </div>
                {inspectTarget.savingsPercent && (
                  <div className="detail-row">
                    <span className="detail-label">Optimization Savings:</span>
                    <span className="detail-val savings">{inspectTarget.savingsPercent}% saved</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Used By:</span>
                  <span className="detail-val">
                    {inspectTarget.usedBy && inspectTarget.usedBy.length > 0
                      ? inspectTarget.usedBy.join(', ')
                      : 'Not in active use'}
                  </span>
                </div>

                <div className="inspect-actions">
                  <button onClick={() => copyUrl(inspectTarget.url)} className="btn-copy">
                    <Copy size={14} />
                    <span>Copy URL</span>
                  </button>
                  <button onClick={() => handleDelete(inspectTarget)} className="btn-delete">
                    <Trash2 size={14} />
                    <span>Delete File</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-media-page {
          display: flex;
          flex-direction: column;
          gap: 18px;
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
          flex-wrap: wrap;
          gap: 16px;
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

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-upload {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          padding: 9px 18px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.3);
          transition: background 0.2s ease;
        }

        .btn-upload:hover:not(:disabled) {
          background-color: #9C5762;
        }

        .btn-upload:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-folder {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          color: #342727;
          padding: 8px 14px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
        }

        /* TABS */
        .media-tabs-bar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .media-tab-btn {
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          color: #6F5A58;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .media-tab-btn.active {
          background-color: #FCE8DE;
          border-color: #F6D6D9;
          color: #B76E79;
          font-weight: 600;
        }

        /* CONTROLS */
        .media-controls-card {
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          border-radius: 14px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFF9F3;
          border: 1px solid #E8D8D0;
          border-radius: 8px;
          padding: 6px 12px;
          width: clamp(200px, 30vw, 340px);
        }

        .search-icon {
          color: #806D68;
        }

        .media-search-input {
          border: none;
          background: none;
          font-family: inherit;
          font-size: 0.84rem;
          color: #342727;
          outline: none;
          width: 100%;
        }

        .filters-wrap {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .media-filter-select {
          border: 1px solid #E8D8D0;
          border-radius: 8px;
          padding: 6px 10px;
          background: #FFFFFF;
          font-family: inherit;
          font-size: 0.8rem;
          color: #342727;
          outline: none;
          cursor: pointer;
        }

        /* MEDIA GRID MATCHING SCREENSHOT */
        .media-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 14px;
        }

        .media-card-item {
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .media-card-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(183, 110, 121, 0.12);
          border-color: #B76E79;
        }

        .media-thumb-area {
          position: relative;
          height: 140px;
          background: #F8F5F2;
        }

        :global(.media-img) {
          object-fit: cover;
        }

        .media-format-pill {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(0, 0, 0, 0.65);
          color: #FFFFFF;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .media-info-bar {
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .media-filename {
          font-size: 0.78rem;
          font-weight: 600;
          color: #342727;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .media-filesize {
          font-size: 0.7rem;
          color: #806D68;
        }

        .media-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 48px;
          color: #806D68;
        }

        /* MODAL */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(52, 39, 39, 0.45);
          backdrop-filter: blur(4px);
          z-index: 250;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          width: min(92%, 560px);
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .modal-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #806D68;
          cursor: pointer;
        }

        .inspect-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 18px;
        }

        .inspect-image-box {
          border-radius: 12px;
          overflow: hidden;
          background: #F8F5F2;
          border: 1px solid #E8D8D0;
          height: 200px;
          position: relative;
        }

        :global(.inspect-img) {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .inspect-details-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          font-size: 0.8rem;
        }

        .detail-label {
          color: #806D68;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .detail-val {
          color: #342727;
          font-weight: 500;
        }

        .detail-val.savings {
          color: #2F855A;
          font-weight: 700;
        }

        .inspect-actions {
          margin-top: 14px;
          display: flex;
          gap: 8px;
        }

        .btn-copy {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid #E8D8D0;
          background: #FFFFFF;
          font-size: 0.78rem;
          color: #342727;
          cursor: pointer;
        }

        .btn-delete {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 8px;
          border: none;
          background: #FFF5F5;
          color: #C53030;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
