'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  X,
  Eye,
  Check,
  Globe,
  BookOpen,
  HelpCircle,
  Shield,
  FileCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { DbContentItem } from '@/lib/db/types';

export default function ContentManagementPage() {
  const [items, setItems] = useState<DbContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Editor Modal State
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<DbContentItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'editorial' as DbContentItem['type'],
    status: 'published' as DbContentItem['status'],
    author: 'Rachit Sharma',
    excerpt: '',
    content: '',
    coverImage: '',
    seoTitle: '',
    seoDescription: '',
  });

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState<{
    docId: string;
    docTitle: string;
    sectionId: string;
    sectionTitle: string;
  } | null>(null);
  const [expandedDocIds, setExpandedDocIds] = useState<Record<string, boolean>>({ 'cnt-about': true });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      type: 'editorial',
      status: 'published',
      author: 'Rachit Sharma',
      excerpt: '',
      content: '',
      coverImage: '',
      seoTitle: '',
      seoDescription: '',
    });
    setEditorOpen(true);
  };

  const handleOpenEdit = (item: DbContentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      type: item.type,
      status: item.status,
      author: item.author || 'Rachit Sharma',
      excerpt: item.excerpt || '',
      content: item.content || '',
      coverImage: item.coverImage || '',
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
    });
    setEditorOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData(prev => {
      const updates: any = { title: val };
      if (!editingItem && (!prev.slug || prev.slug === `/${prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`)) {
        updates.slug = `/${val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
      }
      return { ...prev, ...updates };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      showToast('Title and Slug are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        // Update
        const res = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...formData }),
        });
        if (res.ok) {
          showToast(`Updated "${formData.title}" in MongoDB`);
          setEditorOpen(false);
          window.dispatchEvent(new CustomEvent('mk:content-updated'));
          fetchContent();
        } else {
          showToast('Failed to update content', 'error');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          showToast(`Created "${formData.title}" in MongoDB`);
          setEditorOpen(false);
          window.dispatchEvent(new CustomEvent('mk:content-updated'));
          fetchContent();
        } else {
          showToast('Failed to create content', 'error');
        }
      }
    } catch {
      showToast('Error saving content record', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: DbContentItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(
          nextStatus === 'published'
            ? `Published "${item.title}"`
            : `Set "${item.title}" to draft`
        );
        window.dispatchEvent(new CustomEvent('mk:content-updated'));
        fetchContent();
      }
    } catch {
      showToast('Failed to change status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/content?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Content document deleted from MongoDB');
        setDeleteConfirmId(null);
        window.dispatchEvent(new CustomEvent('mk:content-updated'));
        fetchContent();
      } else {
        showToast(data.error || 'Failed to delete content', 'error');
      }
    } catch {
      showToast('Error deleting content', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSection = async (docId: string, sectionId: string, sectionTitle: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/content?id=${encodeURIComponent(docId)}&sectionId=${encodeURIComponent(sectionId)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `Deleted section "${sectionTitle}" from MongoDB`);
        setDeleteSectionTarget(null);
        window.dispatchEvent(new CustomEvent('mk:content-updated'));
        fetchContent();
      } else {
        showToast(data.error || 'Failed to delete section', 'error');
      }
    } catch {
      showToast('Error deleting section from MongoDB', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, searchQuery, typeFilter, statusFilter]);

  // Statistics calculated from real MongoDB data
  const publishedCount = items.filter(i => i.status === 'published').length;
  const draftCount = items.filter(i => i.status === 'draft').length;
  const scheduledCount = items.filter(i => i.status === 'scheduled').length;
  const totalArticles = items.length;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const getTypeMeta = (type: DbContentItem['type']) => {
    switch (type) {
      case 'editorial':
        return { label: 'Editorial', icon: BookOpen, className: 'badge-editorial' };
      case 'guide':
        return { label: 'Guide', icon: Sparkles, className: 'badge-guide' };
      case 'faq':
        return { label: 'FAQ', icon: HelpCircle, className: 'badge-faq' };
      case 'legal':
        return { label: 'Legal / Policy', icon: Shield, className: 'badge-legal' };
      case 'blog':
      default:
        return { label: 'Article / Blog', icon: FileText, className: 'badge-blog' };
    }
  };

  return (
    <div className="admin-content-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="content-header">
        <div className="header-text">
          <div className="flex items-center gap-2 mb-1">
            <span className="kpi-mini-pill">EDITORIAL CMS</span>
          </div>
          <h1 className="header-title">Content Management</h1>
          <p className="header-subtitle">
            Manage editorial articles, brand stories, SEO metadata, and customer-facing pages.
          </p>
        </div>

        <div className="header-actions">
          <button
            onClick={fetchContent}
            disabled={loading}
            className="action-btn-outline"
            title="Reload content from MongoDB"
          >
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button onClick={handleOpenCreate} className="action-btn-primary">
            <Plus size={15} />
            <span>Create Content</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="summary-strip">
        <div className="summary-card">
          <span className="summary-label">PUBLISHED</span>
          <span className="summary-val text-emerald-700">{loading ? '—' : publishedCount}</span>
          <span className="summary-sub">Live on customer storefront</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">DRAFTS</span>
          <span className="summary-val text-stone-600">{loading ? '—' : draftCount}</span>
          <span className="summary-sub">Unpublished work in progress</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">SCHEDULED</span>
          <span className="summary-val text-amber-600">{loading ? '—' : scheduledCount}</span>
          <span className="summary-sub">Queued for timed release</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">TOTAL ARTICLES &amp; PAGES</span>
          <span className="summary-val text-stone-900">{loading ? '—' : totalArticles}</span>
          <span className="summary-sub">Indexed MongoDB documents</span>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="workspace-card">
        {/* Filter Bar */}
        <div className="filter-bar">
          {/* Search Input */}
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content by title, slug, or author..."
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="filter-controls">
            {/* Type Filter */}
            <div className="select-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="custom-select"
              >
                <option value="all">All Content Types</option>
                <option value="editorial">Editorial</option>
                <option value="guide">Guides</option>
                <option value="blog">Blog / Articles</option>
                <option value="faq">FAQs</option>
                <option value="legal">Legal &amp; Policies</option>
              </select>
              <ChevronDown size={13} className="select-arrow" />
            </div>

            {/* Status Filter */}
            <div className="select-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="custom-select"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <ChevronDown size={13} className="select-arrow" />
            </div>

            {(searchQuery || typeFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setStatusFilter('all');
                }}
                className="btn-clear-filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Content Table */}
        <div className="table-responsive">
          <table className="content-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>CONTENT / TITLE</th>
                <th style={{ width: '14%' }}>TYPE</th>
                <th style={{ width: '12%' }}>STATUS</th>
                <th style={{ width: '14%' }}>AUTHOR</th>
                <th style={{ width: '10%' }}>UPDATED</th>
                <th style={{ width: '12%', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="skeleton-row-tr">
                    <td colSpan={6}>
                      <div className="table-skeleton-bar" />
                    </td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-table-cell">
                    <FileText size={32} className="text-stone-300 mx-auto mb-2" />
                    <p className="font-semibold text-stone-800">No content items match your filters</p>
                    <p className="text-xs text-stone-600 mt-1">
                      Try adjusting your search criteria or create a new article.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const typeMeta = getTypeMeta(item.type);
                  const TypeIcon = typeMeta.icon;

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="content-row">
                      {/* Title & Slug */}
                      <td>
                        <div className="flex flex-col">
                          <span className="item-title">{item.title}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="item-slug">{item.slug}</span>
                            {item.status === 'published' && (
                              <Link
                                href={item.slug}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="item-live-link"
                                title="Open customer page"
                              >
                                <ExternalLink size={11} />
                              </Link>
                            )}
                          </div>
                          {item.excerpt && (
                            <span className="item-excerpt line-clamp-1">{item.excerpt}</span>
                          )}
                          {Array.isArray(item.sections) && item.sections.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setExpandedDocIds(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                marginTop: '6px',
                                padding: '3px 8px',
                                backgroundColor: expandedDocIds[item.id] ? '#111111' : '#F2F0EA',
                                color: expandedDocIds[item.id] ? '#FFFFFF' : '#111111',
                                border: '1px solid #D8D5CE',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                width: 'fit-content',
                              }}
                            >
                              <Sparkles size={11} />
                              <span>{item.sections.length} Page Blocks {expandedDocIds[item.id] ? '▴' : '▾'}</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td>
                        <span className={`type-badge ${typeMeta.className}`}>
                          <TypeIcon size={12} />
                          <span>{typeMeta.label}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status === 'published' && <span className="status-dot-emerald" />}
                          {item.status === 'draft' && <span className="status-dot-stone" />}
                          {item.status === 'scheduled' && <span className="status-dot-amber" />}
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>

                      {/* Author */}
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="author-avatar">
                            {(item.author || 'RS')
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <span className="author-name">{item.author || 'Admin'}</span>
                        </div>
                      </td>

                      {/* Updated */}
                      <td>
                        <span className="date-cell">{formatDate(item.updatedAt)}</span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cluster">
                          {/* Live Preview Button */}
                          <Link
                            href={item.slug}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="row-btn"
                            title="Preview customer page"
                          >
                            <Eye size={13} />
                          </Link>

                          {/* Quick Publish / Unpublish Toggle */}
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`row-btn ${item.status === 'published' ? 'row-btn-active' : ''}`}
                            title={item.status === 'published' ? 'Unpublish to draft' : 'Publish live'}
                          >
                            <FileCheck size={13} />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="row-btn"
                            title="Edit content document"
                          >
                            <Edit3 size={13} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="row-btn row-btn-danger"
                            title="Delete content document"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedDocIds[item.id] && Array.isArray(item.sections) && item.sections.length > 0 && (
                      <tr key={`${item.id}-sections`} style={{ backgroundColor: '#F8F7F3' }}>
                        <td colSpan={6} style={{ padding: '12px 18px 18px', borderBottom: '1px solid #E8E7E2' }}>
                          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E7E2', borderRadius: '8px', padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6F6F6A' }}>
                                Blocks inside {item.title} ({item.slug})
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#8E8D88' }}>
                                Deleting a block removes it from MongoDB and updates the live storefront immediately
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {item.sections.map((sec) => (
                                <div
                                  key={sec.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '9px 12px',
                                    backgroundColor: '#FAFAF8',
                                    border: '1px solid #E8E7E2',
                                    borderRadius: '6px',
                                  }}
                                >
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '2px 6px', backgroundColor: '#E8E7E2', borderRadius: '3px', textTransform: 'uppercase' }}>
                                        {sec.type}
                                      </span>
                                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111111' }}>
                                        {sec.title}
                                      </span>
                                    </div>
                                    {sec.subtitle && (
                                      <div style={{ fontSize: '0.72rem', color: '#6F6F6A', marginTop: '2px' }}>
                                        {sec.subtitle}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteSectionTarget({
                                        docId: item.id,
                                        docTitle: item.title,
                                        sectionId: sec.id,
                                        sectionTitle: sec.title,
                                      })
                                    }
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      padding: '5px 10px',
                                      backgroundColor: '#FFF1F0',
                                      color: '#C0392B',
                                      border: '1px solid #F8D7DA',
                                      borderRadius: '4px',
                                      fontSize: '0.72rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                    }}
                                    title={`Delete ${sec.title} section from MongoDB`}
                                  >
                                    <Trash2 size={12} />
                                    <span>Delete Block</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal / Drawer */}
      {editorOpen && (
        <div className="modal-backdrop" onClick={() => !saving && setEditorOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {editingItem ? 'Edit Content Document' : 'Create New Content Document'}
                </h3>
                <p className="modal-sub">
                  Configure page title, canonical slug, editorial content, and SEO metadata.
                </p>
              </div>
              <button
                onClick={() => setEditorOpen(false)}
                disabled={saving}
                className="modal-close-btn"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-grid-2">
                {/* Title */}
                <div className="form-group col-span-2">
                  <label className="form-label">
                    Content Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. 925 Sterling Silver Care & Maintenance Guide"
                    className="form-input"
                  />
                </div>

                {/* Slug */}
                <div className="form-group">
                  <label className="form-label">
                    Canonical URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="/jewellery-care or /about"
                    className="form-input font-mono text-xs"
                  />
                </div>

                {/* Type */}
                <div className="form-group">
                  <label className="form-label">Content Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as DbContentItem['type'] })
                    }
                    className="form-input"
                  >
                    <option value="editorial">Editorial Page</option>
                    <option value="guide">Guide &amp; Care</option>
                    <option value="blog">Article / Blog Post</option>
                    <option value="faq">FAQ</option>
                    <option value="legal">Legal &amp; Policy</option>
                  </select>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="form-label">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as DbContentItem['status'] })
                    }
                    className="form-input"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Work in Progress)</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {/* Author */}
                <div className="form-group">
                  <label className="form-label">Author / Byline</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Rachit Sharma"
                    className="form-input"
                  />
                </div>

                {/* Excerpt */}
                <div className="form-group col-span-2">
                  <label className="form-label">Short Excerpt / Summary</label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence overview for indexing and search previews..."
                    className="form-textarea"
                  />
                </div>

                {/* Content / Body */}
                <div className="form-group col-span-2">
                  <label className="form-label">Body Content</label>
                  <textarea
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Detailed markdown or long-form copy..."
                    className="form-textarea font-mono text-xs"
                  />
                </div>

                {/* SEO Meta Title */}
                <div className="form-group">
                  <label className="form-label">SEO Meta Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="Title for Google search results..."
                    className="form-input"
                  />
                </div>

                {/* SEO Meta Description */}
                <div className="form-group">
                  <label className="form-label">SEO Meta Description</label>
                  <input
                    type="text"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="Meta description for search engines..."
                    className="form-input"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  disabled={saving}
                  className="btn-modal-cancel"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-modal-submit">
                  {saving ? (
                    <>
                      <RotateCw size={13} className="animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingItem ? 'Update Document' : 'Publish Document'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={28} className="text-red-500 mb-3" />
            <h3 className="confirm-title">Delete Content Document?</h3>
            <p className="confirm-sub">
              This action permanently deletes this record from MongoDB and generates an immutable security audit event.
            </p>
            <div className="confirm-actions">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn-danger-confirm"
              >
                {isDeleting ? 'Deleting from DB...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Section / Block Confirmation Modal */}
      {deleteSectionTarget && (
        <div className="modal-backdrop" onClick={() => !isDeleting && setDeleteSectionTarget(null)}>
          <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={28} className="text-red-500 mb-3" />
            <h3 className="confirm-title">
              Delete &quot;{deleteSectionTarget.sectionTitle}&quot; Block?
            </h3>
            <p className="confirm-sub">
              This action permanently deletes this block from the MongoDB <strong>{deleteSectionTarget.docTitle}</strong> record.
              It will immediately disappear from the live customer storefront.
            </p>
            <div className="confirm-actions">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteSectionTarget(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={() =>
                  handleDeleteSection(
                    deleteSectionTarget.docId,
                    deleteSectionTarget.sectionId,
                    deleteSectionTarget.sectionTitle
                  )
                }
                className="btn-danger-confirm"
              >
                {isDeleting ? 'Deleting from DB...' : 'Delete Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-content-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .admin-toast {
          position: fixed;
          top: 84px;
          right: 28px;
          background-color: #111111;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 500;
          font-size: 0.84rem;
          font-weight: 500;
          border: 1px solid #252525;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .kpi-mini-pill {
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #6f6b65;
          background: #f2f0ea;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .content-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .header-title {
          font-family: var(--font-display), 'Playfair Display', serif;
          font-size: 1.85rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .header-subtitle {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          color: #6f6b65;
          margin: 4px 0 0 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .action-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1px solid #e8e5df;
          color: #171717;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .action-btn-outline:hover:not(:disabled) {
          background: #faf9f6;
          border-color: #d8d4cc;
        }

        .action-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #111111;
          border: 1px solid #111111;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .action-btn-primary:hover {
          background: #252525;
        }

        /* Summary KPI Cards */
        .summary-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .summary-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .summary-strip {
            grid-template-columns: 1fr;
          }
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #e8e5df;
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
        }

        .summary-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #6f6b65;
          text-transform: uppercase;
        }

        .summary-val {
          font-size: 1.45rem;
          font-weight: 600;
          margin-top: 4px;
          font-variant-numeric: tabular-nums;
        }

        .summary-sub {
          font-size: 0.72rem;
          color: #9a958d;
          margin-top: 3px;
        }

        /* Workspace Card */
        .workspace-card {
          background: #ffffff;
          border: 1px solid #e8e5df;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 16px 20px;
          border-bottom: 1px solid #f2f0ea;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 260px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #9a958d;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 40px;
          background: #faf9f6;
          border: 1px solid #e8e5df;
          border-radius: 9px;
          padding: 0 34px;
          font-size: 0.82rem;
          color: #171717;
          transition: all 0.15s ease;
        }

        .search-input:focus {
          outline: none;
          background: #ffffff;
          border-color: #111111;
        }

        .clear-search-btn {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          color: #9a958d;
          cursor: pointer;
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .select-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .custom-select {
          appearance: none;
          background: #ffffff;
          border: 1px solid #e8e5df;
          border-radius: 9px;
          padding: 0 30px 0 12px;
          height: 40px;
          font-size: 0.8rem;
          color: #171717;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .custom-select:hover {
          border-color: #d8d4cc;
        }

        .custom-select:focus {
          outline: none;
          border-color: #111111;
        }

        .select-arrow {
          position: absolute;
          right: 10px;
          color: #6f6b65;
          pointer-events: none;
        }

        .btn-clear-filters {
          background: transparent;
          border: none;
          color: #6f6b65;
          font-size: 0.78rem;
          text-decoration: underline;
          cursor: pointer;
          padding: 6px 8px;
        }

        /* Table */
        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .content-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .content-table thead tr {
          background: #faf9f6;
          border-bottom: 1px solid #e8e5df;
        }

        .content-table th {
          padding: 12px 18px;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #6f6b65;
          text-transform: uppercase;
        }

        .content-row {
          border-bottom: 1px solid #f2f0ea;
          transition: background-color 0.15s ease;
        }

        .content-row:hover {
          background-color: #faf9f6;
        }

        .content-table td {
          padding: 14px 18px;
          vertical-align: middle;
        }

        .item-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #111111;
        }

        .item-slug {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.72rem;
          color: #6f6b65;
        }

        .item-live-link {
          color: #9a958d;
          display: inline-flex;
          align-items: center;
          transition: color 0.15s ease;
        }

        .item-live-link:hover {
          color: #111111;
        }

        .item-excerpt {
          font-size: 0.74rem;
          color: #9a958d;
          margin-top: 3px;
        }

        /* Type Badges */
        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 4px 9px;
          border-radius: 6px;
        }

        .badge-editorial {
          background: #f4f3ef;
          color: #1c1b18;
          border: 1px solid #e5e3db;
        }

        .badge-guide {
          background: #eef2ff;
          color: #3730a3;
          border: 1px solid #e0e7ff;
        }

        .badge-faq {
          background: #fdf4ff;
          color: #86198f;
          border: 1px solid #fae8ff;
        }

        .badge-legal {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
        }

        .badge-blog {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #d1fae5;
        }

        /* Status Badges */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 9999px;
        }

        .status-published {
          background: #ecfdf5;
          color: #2f7d63;
        }

        .status-draft {
          background: #f2f0ea;
          color: #6f6b65;
        }

        .status-scheduled {
          background: #fffbeb;
          color: #b7791f;
        }

        .status-dot-emerald {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #2f7d63;
        }

        .status-dot-stone {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #9a958d;
        }

        .status-dot-amber {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #b7791f;
        }

        /* Author */
        .author-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #111111;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .author-name {
          font-size: 0.78rem;
          font-weight: 500;
          color: #171717;
        }

        .date-cell {
          font-size: 0.78rem;
          color: #6f6b65;
          font-variant-numeric: tabular-nums;
        }

        /* Actions */
        .actions-cluster {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .row-btn {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          border: 1px solid #e8e5df;
          background: #ffffff;
          color: #171717;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .row-btn:hover {
          background: #111111;
          color: #ffffff;
          border-color: #111111;
        }

        .row-btn-active {
          color: #2f7d63;
          border-color: #a7f3d0;
          background: #f0fdf4;
        }

        .row-btn-danger:hover {
          background: #b84a4a !important;
          color: #ffffff !important;
          border-color: #b84a4a !important;
        }

        /* Skeleton & Empty */
        .table-skeleton-bar {
          height: 48px;
          background: #f2f0ea;
          border-radius: 8px;
          animation: pulse 1.5s infinite;
        }

        .empty-table-cell {
          text-align: center;
          padding: 56px 20px;
          color: #6f6b65;
        }

        /* Modal / Drawer */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
          z-index: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          background: #ffffff;
          border-radius: 14px;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
          border: 1px solid #e8e5df;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #f2f0ea;
        }

        .modal-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
        }

        .modal-sub {
          font-size: 0.78rem;
          color: #6f6b65;
          margin: 2px 0 0 0;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: #6f6b65;
          cursor: pointer;
          padding: 4px;
        }

        .modal-form {
          padding: 20px 24px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .col-span-2 {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-label {
          font-size: 0.76rem;
          font-weight: 600;
          color: #171717;
        }

        .form-input {
          height: 38px;
          border: 1px solid #e8e5df;
          border-radius: 8px;
          padding: 0 12px;
          font-size: 0.82rem;
          color: #111111;
          transition: border-color 0.15s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #111111;
        }

        .form-textarea {
          border: 1px solid #e8e5df;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.82rem;
          color: #111111;
          resize: vertical;
          transition: border-color 0.15s ease;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #111111;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #f2f0ea;
        }

        .btn-modal-cancel {
          background: #ffffff;
          border: 1px solid #e8e5df;
          color: #171717;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-modal-submit {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #111111;
          border: 1px solid #111111;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
        }

        /* Confirm Card */
        .confirm-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 24px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          border: 1px solid #e8e5df;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
        }

        .confirm-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
        }

        .confirm-sub {
          font-size: 0.8rem;
          color: #6f6b65;
          margin: 6px 0 20px 0;
          line-height: 1.45;
        }

        .confirm-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .btn-danger-confirm {
          background: #b84a4a;
          color: #ffffff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
