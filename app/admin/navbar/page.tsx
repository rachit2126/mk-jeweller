'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GripVertical,
  Plus,
  Search,
  Filter,
  Eye,
  Save,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ExternalLink,
  Monitor,
  Smartphone,
  Box,
  Sparkles,
  Package,
  Link as LinkIcon,
  X,
  Check,
  AlertTriangle,
  MoveUp,
  MoveDown,
  ShoppingBag,
  Heart,
  User,
  Menu as MenuIcon,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { DbNavigationItem, DbNavigationColumn } from '@/lib/db/types';
import DynamicMegaMenu from '@/components/navigation/DynamicMegaMenu';

interface MongoRef {
  id: string;
  name: string;
  slug: string;
  image?: string;
  sku?: string;
}

export default function NavbarCmsPage() {
  // Navigation State
  const [items, setItems] = useState<DbNavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // References for linking
  const [categoriesList, setCategoriesList] = useState<MongoRef[]>([]);
  const [collectionsList, setCollectionsList] = useState<MongoRef[]>([]);
  const [productsList, setProductsList] = useState<MongoRef[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Expanded Groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'nav-earrings': true,
  });

  // Preview State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewActiveItem, setPreviewActiveItem] = useState<string>('nav-earrings');
  const [previewMobileMenuOpen, setPreviewMobileMenuOpen] = useState(false);
  const [previewMobileExpanded, setPreviewMobileExpanded] = useState<Record<string, boolean>>({
    'nav-earrings': true,
  });

  // Modal / Drawer State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DbNavigationItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DbNavigationItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Modal Form Fields
  const [formLabel, setFormLabel] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formType, setFormType] = useState<'category' | 'collection' | 'product' | 'custom'>('category');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formReferenceId, setFormReferenceId] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formOpenInNewTab, setFormOpenInNewTab] = useState(false);
  const [formMegaMenuEnabled, setFormMegaMenuEnabled] = useState(false);
  const [formImage, setFormImage] = useState('');
  const [formFeaturedTitle, setFormFeaturedTitle] = useState('');
  const [formFeaturedDescription, setFormFeaturedDescription] = useState('');
  const [formFeaturedCtaText, setFormFeaturedCtaText] = useState('');
  const [formFeaturedCtaUrl, setFormFeaturedCtaUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formColumns, setFormColumns] = useState<DbNavigationColumn[]>([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Warn on leave with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Fetch Navigation Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/navbar');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setCategoriesList(data.categories || []);
        setCollectionsList(data.collections || []);
        setProductsList(data.products || []);
      } else {
        throw new Error('Failed to load navigation configuration');
      }
    } catch (err: any) {
      showToast(err.message || 'Error loading navigation', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Separate Level 1 Root items and Level 2 Children
  const rootItems = useMemo(() => {
    return items
      .filter((i) => !i.parentId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [items]);

  const childrenMap = useMemo(() => {
    const map = new Map<string, DbNavigationItem[]>();
    items.forEach((item) => {
      if (item.parentId) {
        if (!map.has(item.parentId)) map.set(item.parentId, []);
        map.get(item.parentId)!.push(item);
      }
    });
    // Sort each group by order
    map.forEach((val) => val.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    return map;
  }, [items]);

  // Filtered Roots for CMS List
  const filteredRootItems = useMemo(() => {
    return rootItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (childrenMap.get(item.id) || []).some((child) =>
          child.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesType =
        typeFilter === 'all' ||
        item.type === typeFilter ||
        (childrenMap.get(item.id) || []).some((child) => child.type === typeFilter);

      return matchesSearch && matchesType;
    });
  }, [rootItems, childrenMap, searchQuery, typeFilter]);

  // Toggle Accordion Group in CMS
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Toggle Active State
  const toggleActiveStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const nextActive = !item.isActive;

    // Optimistically update React state
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isActive: nextActive } : i))
    );

    try {
      const res = await fetch('/api/admin/navbar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: nextActive }),
      });
      if (!res.ok) {
        throw new Error('Failed to update status in MongoDB');
      }
      window.dispatchEvent(new CustomEvent('mk:navbar-updated'));
      showToast(`${nextActive ? 'Enabled' : 'Disabled'} "${item.label}" in MongoDB`);
    } catch (err: any) {
      // Revert on failure
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isActive: !nextActive } : i))
      );
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  // Reorder Roots
  const moveRootItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rootItems.length) return;

    const newRoots = [...rootItems];
    const [moved] = newRoots.splice(index, 1);
    newRoots.splice(targetIndex, 0, moved);

    // Reassign order
    const updatedOrder = newRoots.map((item, idx) => ({
      ...item,
      order: idx + 1,
      sortOrder: idx + 1,
    }));

    setItems((prev) => {
      const children = prev.filter((i) => Boolean(i.parentId));
      return [...updatedOrder, ...children];
    });
    setHasUnsavedChanges(true);
  };

  // Reorder Sub-Items within a parent
  const moveSubItem = (parentId: string, index: number, direction: 'up' | 'down') => {
    const currentSubs = childrenMap.get(parentId) || [];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSubs.length) return;

    const newSubs = [...currentSubs];
    const [moved] = newSubs.splice(index, 1);
    newSubs.splice(targetIndex, 0, moved);

    const updatedSubOrder = newSubs.map((item, idx) => ({
      ...item,
      order: idx + 1,
      sortOrder: idx + 1,
    }));

    setItems((prev) => {
      const rest = prev.filter((i) => i.parentId !== parentId);
      return [...rest, ...updatedSubOrder];
    });
    setHasUnsavedChanges(true);
  };

  // Save All Changes to MongoDB
  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/admin/navbar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save navigation changes');
      }

      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      showToast('Navbar changes saved successfully to MongoDB!');
      window.dispatchEvent(new CustomEvent('mk:navbar-updated'));
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err: any) {
      setSaveStatus('error');
      showToast(err.message || 'Error saving changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Open Add/Edit Modal
  const handleOpenModal = (item?: DbNavigationItem, defaultParentId?: string) => {
    if (item) {
      setEditingItem(item);
      setFormLabel(item.label);
      setFormSlug(item.slug || '');
      setFormUrl(item.url || '');
      setFormType((item.type as any) || 'category');
      setFormParentId(item.parentId || '');
      setFormReferenceId(item.referenceId || '');
      setFormIsActive(item.isActive !== false);
      setFormOpenInNewTab(Boolean(item.openInNewTab));
      setFormMegaMenuEnabled(Boolean(item.megaMenuEnabled));
      setFormImage(item.image || '');
      setFormDescription(item.description || '');
      setFormOrder(item.order || item.sortOrder || 1);
      setFormFeaturedTitle(item.featuredTitle || '');
      setFormFeaturedDescription(item.featuredDescription || '');
      setFormFeaturedCtaText(item.featuredCtaText || '');
      setFormFeaturedCtaUrl(item.featuredCtaUrl || '');
      setFormColumns(item.columns ? JSON.parse(JSON.stringify(item.columns)) : []);
    } else {
      setEditingItem(null);
      setFormLabel('');
      setFormSlug('');
      setFormUrl('');
      setFormType(defaultParentId ? 'category' : 'category');
      setFormParentId(defaultParentId || '');
      setFormReferenceId('');
      setFormIsActive(true);
      setFormOpenInNewTab(false);
      setFormMegaMenuEnabled(!defaultParentId);
      setFormImage('');
      setFormDescription('');
      const siblings = defaultParentId ? (childrenMap.get(defaultParentId) || []) : rootItems;
      setFormOrder(siblings.length + 1);
      setFormFeaturedTitle('');
      setFormFeaturedDescription('');
      setFormFeaturedCtaText('');
      setFormFeaturedCtaUrl('');
      setFormColumns([]);
    }
    setModalOpen(true);
  };

  // Type change handler in Modal
  const handleTypeChange = (newType: 'category' | 'collection' | 'product' | 'custom') => {
    setFormType(newType);
    setFormReferenceId('');
    if (newType === 'category') {
      const first = categoriesList[0];
      if (first) {
        setFormReferenceId(first.id);
        if (!formLabel) setFormLabel(first.name);
        setFormUrl(`/shop?category=${encodeURIComponent(first.slug)}`);
      }
    } else if (newType === 'collection') {
      const first = collectionsList[0];
      if (first) {
        setFormReferenceId(first.id);
        if (!formLabel) setFormLabel(first.name);
        setFormUrl(`/collections/${encodeURIComponent(first.slug)}`);
      }
    } else if (newType === 'product') {
      const first = productsList[0];
      if (first) {
        setFormReferenceId(first.id);
        if (!formLabel) setFormLabel(first.name);
        setFormUrl(`/product/${encodeURIComponent(first.slug)}`);
      }
    }
  };

  // Reference select handler
  const handleReferenceSelect = (refId: string) => {
    setFormReferenceId(refId);
    if (formType === 'category') {
      const match = categoriesList.find((c) => c.id === refId || c.slug === refId);
      if (match) {
        if (!editingItem) setFormLabel(match.name);
        setFormSlug(match.slug);
        setFormUrl(
          formParentId
            ? `/shop?category=${encodeURIComponent(formParentId.replace('nav-', ''))}&subcategory=${encodeURIComponent(match.slug)}`
            : `/shop?category=${encodeURIComponent(match.slug)}`
        );
      }
    } else if (formType === 'collection') {
      const match = collectionsList.find((c) => c.id === refId || c.slug === refId);
      if (match) {
        if (!editingItem) setFormLabel(match.name);
        setFormSlug(match.slug);
        setFormUrl(`/collections/${encodeURIComponent(match.slug)}`);
      }
    } else if (formType === 'product') {
      const match = productsList.find((p) => p.id === refId || p.slug === refId);
      if (match) {
        if (!editingItem) setFormLabel(match.name);
        setFormSlug(match.slug);
        setFormUrl(`/product/${encodeURIComponent(match.slug)}`);
      }
    }
  };

  // Submit Modal Form (Persists to MongoDB)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim()) {
      showToast('Label is required', 'error');
      return;
    }

    const resolvedSlug =
      formSlug.trim() ||
      formLabel
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

    const resolvedUrl = formUrl.trim() || `/shop?category=${encodeURIComponent(resolvedSlug)}`;

    try {
      if (editingItem) {
        // Update existing item in MongoDB
        const updatePayload = {
          id: editingItem.id,
          label: formLabel.trim(),
          slug: resolvedSlug,
          url: resolvedUrl,
          type: formType,
          parentId: formParentId || null,
          referenceId: formReferenceId || null,
          isActive: formIsActive,
          openInNewTab: formOpenInNewTab,
          megaMenuEnabled: formMegaMenuEnabled,
          image: formImage.trim() || null,
          description: formDescription.trim() || null,
          order: Number(formOrder) || (editingItem.order || 1),
          sortOrder: Number(formOrder) || (editingItem.order || 1),
          featuredTitle: formFeaturedTitle.trim() || null,
          featuredDescription: formFeaturedDescription.trim() || null,
          featuredCtaText: formFeaturedCtaText.trim() || null,
          featuredCtaUrl: formFeaturedCtaUrl.trim() || null,
          columns: formColumns.length > 0 ? formColumns : undefined,
          level: formParentId ? 2 : 1,
        };

        const res = await fetch('/api/admin/navbar', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to update navigation item');
        }

        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...updatePayload } : i))
        );
        window.dispatchEvent(new CustomEvent('mk:navbar-updated'));
        showToast(`Updated "${formLabel}" in MongoDB`);
      } else {
        // Create new item in MongoDB
        const currentSiblings = formParentId
          ? childrenMap.get(formParentId) || []
          : rootItems;

        const createPayload = {
          label: formLabel.trim(),
          slug: resolvedSlug,
          url: resolvedUrl,
          type: formType,
          parentId: formParentId || null,
          referenceId: formReferenceId || null,
          order: Number(formOrder) || (currentSiblings.length + 1),
          sortOrder: Number(formOrder) || (currentSiblings.length + 1),
          level: formParentId ? 2 : 1,
          isActive: formIsActive,
          megaMenuEnabled: formMegaMenuEnabled,
          openInNewTab: formOpenInNewTab,
          image: formImage.trim() || null,
          description: formDescription.trim() || null,
          featuredTitle: formFeaturedTitle.trim() || null,
          featuredDescription: formFeaturedDescription.trim() || null,
          featuredCtaText: formFeaturedCtaText.trim() || null,
          featuredCtaUrl: formFeaturedCtaUrl.trim() || null,
          columns: formColumns.length > 0 ? formColumns : undefined,
        };

        const res = await fetch('/api/admin/navbar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createPayload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to create navigation item');
        }

        const createdItem = data.item;
        setItems((prev) => [...prev, createdItem]);
        if (formParentId) {
          setExpandedGroups((prev) => ({ ...prev, [formParentId]: true }));
        }
        window.dispatchEvent(new CustomEvent('mk:navbar-updated'));
        showToast(`Created "${formLabel}" in MongoDB`);
      }

      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving navigation item', 'error');
    }
  };

  // Confirm and Execute Delete (Immediately persists to MongoDB and cleans children)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const target = deleteTarget;
    setIsDeletingItem(true);
    try {
      const res = await fetch(`/api/admin/navbar?id=${encodeURIComponent(target.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete navigation item');
      }

      // Remove target and any child items from React state
      setItems((prev) =>
        prev.filter((i) => i.id !== target.id && i.parentId !== target.id)
      );

      // Invalidate and refresh storefront navigation immediately
      window.dispatchEvent(new CustomEvent('mk:navbar-updated'));

      showToast(data.message || `Deleted "${target.label}" from navbar`);
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || 'Error deleting navigation item', 'error');
    } finally {
      setIsDeletingItem(false);
    }
  };

  // Helper for type icons
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'collection':
        return <Sparkles size={14} className="text-amber-600" />;
      case 'product':
        return <Package size={14} className="text-indigo-600" />;
      case 'custom':
        return <LinkIcon size={14} className="text-blue-500" />;
      case 'category':
      default:
        return <Box size={14} className="text-neutral-700" />;
    }
  };

  // Currently Previewed Root Item for Desktop Mega Menu
  const activePreviewItem = useMemo(() => {
    return (
      rootItems.find((i) => i.id === previewActiveItem) ||
      rootItems[0] ||
      null
    );
  }, [rootItems, previewActiveItem]);

  return (
    <div style={{ backgroundColor: '#F8F7F3', minHeight: '100vh', padding: '24px 28px' }}>
      {/* 1. TOP HEADER ROW */}
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
              letterSpacing: '0.02em',
            }}
          >
            Navbar CMS
          </h1>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#6F6F6A', fontFamily: 'var(--font-ui), "Jost", sans-serif' }}>
            Manage your storefront navigation, dropdown menus and links. All changes reflect in real-time preview.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              transition: 'all 0.15s ease',
            }}
          >
            <span>View Storefront</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={handleSaveChanges}
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: saveStatus === 'saved' ? '#1E7E5E' : '#111111',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 20px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {saving ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check size={15} />
            ) : (
              <Save size={15} />
            )}
            <span>
              {saving
                ? 'Saving...'
                : saveStatus === 'saved'
                ? 'Saved!'
                : hasUnsavedChanges
                ? 'Save Changes *'
                : 'Save Changes'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. SPLIT-SCREEN MAIN GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(420px, 48%) minmax(480px, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ========================================================= */}
        {/* LEFT COLUMN: NAVIGATION STRUCTURE */}
        {/* ========================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E7E2',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}
        >
          {/* Section Header */}
          <div style={{ marginBottom: '18px' }}>
            <h2
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 3px',
                letterSpacing: '0.01em',
              }}
            >
              Navigation Structure
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6F6F6A' }}>
              Drag and drop to reorder. Add, edit or remove navigation items.
            </p>
          </div>

          {/* + Add Main Navigation Item Button */}
          <button
            onClick={() => handleOpenModal()}
            style={{
              width: '100%',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              border: 'none',
              padding: '11px 0',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#252525')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
          >
            <Plus size={15} />
            <span>Add Main Navigation Item</span>
          </button>

          {/* Search & Filter Toolbar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={14}
                style={{ position: 'absolute', left: '10px', color: '#8E8D88' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search navigation items..."
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '6px',
                  border: '1px solid #E8E7E2',
                  backgroundColor: '#FAFAF8',
                  fontSize: '0.8rem',
                  color: '#111111',
                  outline: 'none',
                }}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #E8E7E2',
                backgroundColor: '#FAFAF8',
                fontSize: '0.8rem',
                color: '#111111',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Types</option>
              <option value="category">Category</option>
              <option value="collection">Collection</option>
              <option value="product">Product</option>
              <option value="custom">Custom URL</option>
            </select>
          </div>

          {/* Navigation Items Tree List */}
          {loading ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#6F6F6A', fontSize: '0.84rem' }}>
              Loading navigation structure...
            </div>
          ) : filteredRootItems.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#FAFAF8',
                borderRadius: '8px',
                border: '1px dashed #D8D5CE',
              }}
            >
              <Box size={32} color="#8E8D88" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111111', marginBottom: '4px' }}>
                Your navbar is empty
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6F6F6A', margin: '0 0 16px' }}>
                No navigation items found. Click below to add your first main category.
              </p>
              <button
                onClick={() => handleOpenModal()}
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Add Main Navigation Item
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredRootItems.map((root, rootIndex) => {
                const subItems = childrenMap.get(root.id) || [];
                const isExpanded = Boolean(expandedGroups[root.id]);
                const isActive = root.isActive;

                return (
                  <div
                    key={root.id}
                    style={{
                      border: '1px solid #E8E7E2',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    {/* Level 1 Main Item Row */}
                    <div
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFFFF',
                        borderBottom: isExpanded && subItems.length > 0 ? '1px solid #F2F0EA' : 'none',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      onClick={() => toggleGroup(root.id)}
                    >
                      {/* Left: Drag Handle, Icon, Title, Items Count */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            cursor: 'grab',
                            color: '#8E8D88',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GripVertical size={14} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {getTypeIcon(root.type)}
                        </div>

                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '0.84rem',
                            color: isActive ? '#111111' : '#8E8D88',
                            textDecoration: isActive ? 'none' : 'line-through',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {root.label}
                        </span>

                        {subItems.length > 0 && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              backgroundColor: '#F2F0EA',
                              color: '#6F6F6A',
                              padding: '2px 8px',
                              borderRadius: '12px',
                            }}
                          >
                            {subItems.length} items
                          </span>
                        )}

                        {root.megaMenuEnabled && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              backgroundColor: '#111111',
                              color: '#FFFFFF',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              letterSpacing: '0.04em',
                            }}
                          >
                            MEGA
                          </span>
                        )}
                      </div>

                      {/* Right: Reorder, Active Toggle, Edit, Delete, Chevron */}
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Reorder Buttons */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button
                            disabled={rootIndex === 0}
                            onClick={() => moveRootItem(rootIndex, 'up')}
                            style={{
                              border: 'none',
                              background: 'none',
                              padding: '2px',
                              cursor: rootIndex === 0 ? 'not-allowed' : 'pointer',
                              color: rootIndex === 0 ? '#D8D5CE' : '#6F6F6A',
                            }}
                            title="Move Up"
                          >
                            <MoveUp size={13} />
                          </button>
                          <button
                            disabled={rootIndex === rootItems.length - 1}
                            onClick={() => moveRootItem(rootIndex, 'down')}
                            style={{
                              border: 'none',
                              background: 'none',
                              padding: '2px',
                              cursor: rootIndex === rootItems.length - 1 ? 'not-allowed' : 'pointer',
                              color: rootIndex === rootItems.length - 1 ? '#D8D5CE' : '#6F6F6A',
                            }}
                            title="Move Down"
                          >
                            <MoveDown size={13} />
                          </button>
                        </div>

                        {/* Active Toggle Switch */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          onClick={(e) => toggleActiveStatus(root.id, e)}
                          style={{
                            width: '32px',
                            height: '18px',
                            backgroundColor: isActive ? '#1E7E5E' : '#D8D5CE',
                            borderRadius: '20px',
                            position: 'relative',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            padding: 0,
                          }}
                          title={isActive ? 'Active' : 'Inactive'}
                        >
                          <span
                            style={{
                              display: 'block',
                              width: '14px',
                              height: '14px',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '2px',
                              left: isActive ? '16px' : '2px',
                              transition: 'left 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                          />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenModal(root)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            color: '#6F6F6A',
                            cursor: 'pointer',
                          }}
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteTarget(root)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            color: '#8E8D88',
                            cursor: 'pointer',
                          }}
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Expand / Collapse Chevron */}
                        <div
                          onClick={() => toggleGroup(root.id)}
                          style={{ padding: '2px', color: '#6F6F6A', cursor: 'pointer' }}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Level 2 Sub-Items Group (Indented) */}
                    {isExpanded && (
                      <div style={{ backgroundColor: '#FAFAF8', padding: '6px 14px 12px 28px' }}>
                        {subItems.length === 0 ? (
                          <div style={{ padding: '8px 0', fontSize: '0.75rem', color: '#8E8D88' }}>
                            No subcategories under {root.label}.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                            {subItems.map((sub, subIndex) => {
                              const isSubActive = sub.isActive;
                              return (
                                <div
                                  key={sub.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '7px 10px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '5px',
                                    border: '1px solid #E8E7E2',
                                  }}
                                >
                                  {/* Sub-item Info */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                    <GripVertical size={13} color="#BFC1C4" style={{ cursor: 'grab' }} />
                                    <span style={{ fontSize: '0.78rem', color: isSubActive ? '#111111' : '#8E8D88', fontWeight: 500 }}>
                                      {sub.label}
                                    </span>
                                    {typeof sub.productCount === 'number' && (
                                      <span
                                        style={{
                                          fontSize: '0.68rem',
                                          color: '#8E8D88',
                                          backgroundColor: '#F2F0EA',
                                          padding: '1px 6px',
                                          borderRadius: '8px',
                                        }}
                                      >
                                        {sub.productCount}
                                      </span>
                                    )}
                                  </div>

                                  {/* Sub-item Actions */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {/* Sub Reorder */}
                                    <button
                                      disabled={subIndex === 0}
                                      onClick={() => moveSubItem(root.id, subIndex, 'up')}
                                      style={{
                                        border: 'none',
                                        background: 'none',
                                        padding: '1px',
                                        cursor: subIndex === 0 ? 'not-allowed' : 'pointer',
                                        color: subIndex === 0 ? '#D8D5CE' : '#6F6F6A',
                                      }}
                                    >
                                      <MoveUp size={12} />
                                    </button>
                                    <button
                                      disabled={subIndex === subItems.length - 1}
                                      onClick={() => moveSubItem(root.id, subIndex, 'down')}
                                      style={{
                                        border: 'none',
                                        background: 'none',
                                        padding: '1px',
                                        cursor: subIndex === subItems.length - 1 ? 'not-allowed' : 'pointer',
                                        color: subIndex === subItems.length - 1 ? '#D8D5CE' : '#6F6F6A',
                                      }}
                                    >
                                      <MoveDown size={12} />
                                    </button>

                                    {/* Sub Active Toggle */}
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={isSubActive}
                                      onClick={(e) => toggleActiveStatus(sub.id, e)}
                                      style={{
                                        width: '28px',
                                        height: '16px',
                                        backgroundColor: isSubActive ? '#1E7E5E' : '#D8D5CE',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                      }}
                                    >
                                      <span
                                        style={{
                                          display: 'block',
                                          width: '12px',
                                          height: '12px',
                                          backgroundColor: '#FFFFFF',
                                          borderRadius: '50%',
                                          position: 'absolute',
                                          top: '2px',
                                          left: isSubActive ? '14px' : '2px',
                                          transition: 'left 0.2s',
                                        }}
                                      />
                                    </button>

                                    <button
                                      onClick={() => handleOpenModal(sub, root.id)}
                                      style={{ background: 'none', border: 'none', padding: '3px', color: '#6F6F6A', cursor: 'pointer' }}
                                    >
                                      <Edit2 size={13} />
                                    </button>

                                    <button
                                      onClick={() => setDeleteTarget(sub)}
                                      style={{ background: 'none', border: 'none', padding: '3px', color: '#8E8D88', cursor: 'pointer' }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* + Add Sub Item Button */}
                        <button
                          onClick={() => handleOpenModal(undefined, root.id)}
                          style={{
                            width: '100%',
                            padding: '6px 0',
                            backgroundColor: '#FFFFFF',
                            border: '1px dashed #D8D5CE',
                            borderRadius: '5px',
                            fontSize: '0.74rem',
                            fontWeight: 500,
                            color: '#111111',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <Plus size={13} />
                          <span>Add Sub Item to {root.label}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: LIVE STOREFRONT PREVIEW */}
        {/* ========================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E7E2',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: '80px',
          }}
        >
          {/* Header with Device Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: '#111111',
                  margin: '0 0 3px',
                  letterSpacing: '0.01em',
                }}
              >
                Live Storefront Preview
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6F6F6A' }}>
                See how your navigation looks on the actual website. Changes update in real-time.
              </p>
            </div>

            {/* Desktop / Mobile Buttons */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#F2F0EA',
                borderRadius: '6px',
                padding: '3px',
                gap: '2px',
              }}
            >
              <button
                onClick={() => setPreviewDevice('desktop')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: previewDevice === 'desktop' ? '#111111' : 'transparent',
                  color: previewDevice === 'desktop' ? '#FFFFFF' : '#6F6F6A',
                  transition: 'all 0.15s ease',
                }}
              >
                <Monitor size={13} />
                <span>Desktop</span>
              </button>

              <button
                onClick={() => setPreviewDevice('mobile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: previewDevice === 'mobile' ? '#111111' : 'transparent',
                  color: previewDevice === 'mobile' ? '#FFFFFF' : '#6F6F6A',
                  transition: 'all 0.15s ease',
                }}
              >
                <Smartphone size={13} />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* PREVIEW CANVAS CONTAINER */}
          <div
            style={{
              backgroundColor: '#FAFAF8',
              borderRadius: '8px',
              border: '1px solid #E8E7E2',
              overflow: 'auto',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {previewDevice === 'desktop' ? (
              /* DESKTOP PREVIEW */
              <div style={{ backgroundColor: '#FFFFFF', minWidth: '920px', width: '100%' }}>
                {/* 1. Black Announcement Bar */}
                <div
                  style={{
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    padding: '6px 16px',
                    fontSize: '0.64rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  }}
                >
                  <div>
                    Free Shipping on All Orders &nbsp;|&nbsp; 925 Sterling Silver &nbsp;|&nbsp; Easy 7-Day Returns
                  </div>
                  <div>
                    Track Order &nbsp;|&nbsp; Help & Support
                  </div>
                </div>

                {/* 2. Main Storefront Header */}
                <div
                  style={{
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #E8E7E2',
                  }}
                >
                  {/* Left Search */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#6F6F6A',
                      fontSize: '0.72rem',
                    }}
                  >
                    <Search size={14} color="#111111" />
                    <span>Search jewellery...</span>
                  </div>

                  {/* Center Brand Logo */}
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        color: '#111111',
                      }}
                    >
                      MK SILVER HUB
                    </div>
                    <div style={{ fontSize: '0.45rem', letterSpacing: '0.2em', color: '#6F6F6A' }}>
                      FINE 925 STERLING JEWELLERY
                    </div>
                  </div>

                  {/* Right Icons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#111111' }}>
                    <User size={15} />
                    <Heart size={15} />
                    <div style={{ position: 'relative' }}>
                      <ShoppingBag size={15} />
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-8px',
                          backgroundColor: '#111111',
                          color: '#FFFFFF',
                          fontSize: '0.55rem',
                          borderRadius: '50%',
                          width: '13px',
                          height: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        0
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Horizontal Main Navigation Bar */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E8E7E2',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {rootItems
                    .filter((i) => i.isActive)
                    .map((item) => {
                      const isHovered = previewActiveItem === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setPreviewActiveItem(item.id)}
                          onMouseEnter={() => setPreviewActiveItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '10px 4px',
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            fontSize: '0.68rem',
                            fontWeight: isHovered ? 600 : 500,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: isHovered ? '#111111' : '#6F6F6A',
                            borderBottom: isHovered ? '2px solid #111111' : '2px solid transparent',
                            cursor: 'pointer',
                          }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                </div>

                {/* 4. Live Mega Menu Overlay (for active preview item) */}
                {activePreviewItem && activePreviewItem.megaMenuEnabled && (
                  <div style={{ padding: '16px 14px 20px', backgroundColor: '#F8F7F3' }}>
                    <DynamicMegaMenu
                      categories={rootItems.filter((i) => i.isActive)}
                      activeItem={{
                        ...activePreviewItem,
                        children: (childrenMap.get(activePreviewItem.id) || []).filter((c) => c.isActive),
                      }}
                      onSelectCategory={(slug) => {
                        const target = rootItems.find((i) => i.slug === slug);
                        if (target) setPreviewActiveItem(target.id);
                      }}
                      onClose={() => {}}
                    />
                  </div>
                )}

                {/* 5. Realistic Storefront Snippet beneath (Category Pills & Hero) */}
                <div style={{ padding: '24px 18px', backgroundColor: '#FAFAF8' }}>
                  {/* Category Circles Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                      overflowX: 'auto',
                      marginBottom: '20px',
                    }}
                  >
                    {rootItems
                      .filter((i) => i.isActive)
                      .slice(0, 7)
                      .map((cat) => (
                        <div key={cat.id} style={{ textAlign: 'center', width: '56px' }}>
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              backgroundColor: '#E8E7E2',
                              margin: '0 auto 6px',
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            {cat.image ? (
                              <Image src={cat.image} alt={cat.label} fill style={{ objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600, color: '#6F6F6A' }}>
                                {cat.label.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: '#111111', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cat.label}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Hero Banner Mockup */}
                  <div
                    style={{
                      position: 'relative',
                      height: '140px',
                      backgroundColor: '#252525',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 24px',
                      color: '#FFFFFF',
                    }}
                  >
                    <Image
                      src="/images/editorial/bridal-banner-clean-hd.jpg"
                      alt="Hero Banner"
                      fill
                      style={{ objectFit: 'cover', opacity: 0.65 }}
                    />
                    <div style={{ position: 'relative', zIndex: 2, maxWidth: '280px' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                          fontSize: '1.15rem',
                          fontWeight: 500,
                          lineHeight: 1.2,
                          marginBottom: '4px',
                        }}
                      >
                        Timeless Elegance In Every Detail
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#E8E7E2', marginBottom: '8px' }}>
                        Handcrafted 925 Silver Jewellery for Your Special Moments
                      </div>
                      <button
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#111111',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                        }}
                      >
                        Explore Collection →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* MOBILE PREVIEW */
              <div
                style={{
                  width: '320px',
                  margin: '24px auto',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  border: '8px solid #111111',
                  overflow: 'hidden',
                  minHeight: '520px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Mobile Status Bar */}
                <div style={{ backgroundColor: '#111111', height: '14px', width: '100%' }} />

                {/* Mobile Header */}
                <div
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #E8E7E2',
                  }}
                >
                  <button
                    onClick={() => setPreviewMobileMenuOpen(!previewMobileMenuOpen)}
                    style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                  >
                    {previewMobileMenuOpen ? <X size={18} /> : <MenuIcon size={18} />}
                  </button>

                  <div style={{ fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em', color: '#111111' }}>
                    MK SILVER HUB
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Search size={16} />
                    <ShoppingBag size={16} />
                  </div>
                </div>

                {/* Mobile Drawer Accordion Menu */}
                {previewMobileMenuOpen ? (
                  <div style={{ padding: '12px 14px', flex: 1, backgroundColor: '#FFFFFF', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#8E8D88', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Shop Categories
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {rootItems
                        .filter((i) => i.isActive)
                        .map((root) => {
                          const subItems = (childrenMap.get(root.id) || []).filter((s) => s.isActive);
                          const isExpanded = Boolean(previewMobileExpanded[root.id]);

                          return (
                            <div key={root.id} style={{ borderBottom: '1px solid #F2F0EA', paddingBottom: '6px' }}>
                              <div
                                onClick={() =>
                                  setPreviewMobileExpanded((prev) => ({
                                    ...prev,
                                    [root.id]: !prev[root.id],
                                  }))
                                }
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 0',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  color: '#111111',
                                  cursor: 'pointer',
                                }}
                              >
                                <span>{root.label}</span>
                                {subItems.length > 0 && (
                                  <div>
                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  </div>
                                )}
                              </div>

                              {/* Accordion Subitems */}
                              {isExpanded && subItems.length > 0 && (
                                <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
                                  {subItems.map((sub) => (
                                    <div
                                      key={sub.id}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '0.76rem',
                                        color: '#6F6F6A',
                                        padding: '3px 0',
                                      }}
                                    >
                                      <span>{sub.label}</span>
                                      {typeof sub.productCount === 'number' && (
                                        <span style={{ fontSize: '0.68rem', color: '#8E8D88' }}>
                                          {sub.productCount}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#111111', paddingTop: '4px' }}>
                                    View All {root.label} →
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '24px 14px', textAlign: 'center', flex: 1, backgroundColor: '#FAFAF8' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6F6F6A', marginBottom: '8px' }}>
                      Mobile Preview Mode
                    </div>
                    <button
                      onClick={() => setPreviewMobileMenuOpen(true)}
                      style={{
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Open Navigation Drawer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ADD / EDIT NAVIGATION ITEM MODAL */}
      {/* ========================================================= */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '20px',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #E8E7E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '1.05rem', fontWeight: 600, color: '#111111' }}>
                  {editingItem ? `Edit "${editingItem.label}"` : 'Add Navigation Item'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#6F6F6A' }}>
                  Configure link destination, hierarchy, and optional mega menu features.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#6F6F6A' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} style={{ padding: '20px 24px' }}>
              {/* Parent Category Hierarchy */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>
                  Parent Item (Hierarchy)
                </label>
                <select
                  value={formParentId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setFormParentId(pid);
                    if (pid) setFormMegaMenuEnabled(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #E8E7E2',
                    backgroundColor: '#FAFAF8',
                    fontSize: '0.82rem',
                    color: '#111111',
                    outline: 'none',
                  }}
                >
                  <option value="">None (Top-Level Main Category)</option>
                  {rootItems
                    .filter((r) => !editingItem || r.id !== editingItem.id)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        Under {r.label}
                      </option>
                    ))}
                </select>
                <span style={{ fontSize: '0.7rem', color: '#8E8D88', display: 'block', marginTop: '4px' }}>
                  Select a parent to create an indented subcategory.
                </span>
              </div>

              {/* Link Type Radio Pills */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>
                  Link Destination Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {(['category', 'collection', 'product', 'custom'] as const).map((t) => {
                    const isSelected = formType === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleTypeChange(t)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '6px',
                          border: isSelected ? '1px solid #111111' : '1px solid #E8E7E2',
                          backgroundColor: isSelected ? '#111111' : '#FAFAF8',
                          color: isSelected ? '#FFFFFF' : '#111111',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real MongoDB Entity Selector based on Link Type */}
              {formType === 'category' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>
                    Select Real Category from MongoDB *
                  </label>
                  <select
                    value={formReferenceId}
                    onChange={(e) => handleReferenceSelect(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E8E7E2',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                    }}
                  >
                    <option value="">-- Choose a Category --</option>
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formType === 'collection' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>
                    Select Real Collection from MongoDB *
                  </label>
                  <select
                    value={formReferenceId}
                    onChange={(e) => handleReferenceSelect(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E8E7E2',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                    }}
                  >
                    <option value="">-- Choose a Collection --</option>
                    {collectionsList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formType === 'product' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>
                    Select Real Product from MongoDB *
                  </label>
                  <select
                    value={formReferenceId}
                    onChange={(e) => handleReferenceSelect(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E8E7E2',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                    }}
                  >
                    <option value="">-- Choose a Product --</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.sku ? `(${p.sku})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Label & URL Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>
                    Navigation Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. Earrings, Studs"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E8E7E2',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>
                    Destination URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="/shop?category=earrings"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E8E7E2',
                      fontSize: '0.82rem',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>

              {/* Status & Options Checkboxes */}
              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid #E8E7E2',
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '18px',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    style={{ accentColor: '#111111' }}
                  />
                  <span>Active in Storefront</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formOpenInNewTab}
                    onChange={(e) => setFormOpenInNewTab(e.target.checked)}
                    style={{ accentColor: '#111111' }}
                  />
                  <span>Open in New Tab</span>
                </label>

                {!formParentId && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formMegaMenuEnabled}
                      onChange={(e) => setFormMegaMenuEnabled(e.target.checked)}
                      style={{ accentColor: '#111111' }}
                    />
                    <span>Enable Mega Menu</span>
                  </label>
                )}
              </div>

              {/* Subcategory Image, Description & Display Order (when item is under a Parent) */}
              {Boolean(formParentId) && (
                <div
                  style={{
                    backgroundColor: '#FAFAF8',
                    border: '1px solid #E8E7E2',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111111', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={14} />
                    <span>Subcategory Card Details (4:3 Thumbnail & Description)</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                        Image Path / URL
                      </label>
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="/images/subcategories/studs.jpg"
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '5px',
                          border: '1px solid #E8E7E2',
                          fontSize: '0.78rem',
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                        Subtitle / Short Description
                      </label>
                      <input
                        type="text"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="e.g. Classic & everyday"
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '5px',
                          border: '1px solid #E8E7E2',
                          fontSize: '0.78rem',
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview & Clear Button */}
                  {formImage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '64px',
                          height: '48px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid #E8E7E2',
                          backgroundColor: '#F5F3EF',
                          position: 'relative',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formImage}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6F6F6A' }}>
                        Live 4:3 card thumbnail preview
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid #E8E7E2',
                          backgroundColor: '#FFFFFF',
                          color: '#C0392B',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                      Display Order (Sort Position)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formOrder}
                      onChange={(e) => setFormOrder(Number(e.target.value))}
                      style={{
                        width: '100px',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        border: '1px solid #E8E7E2',
                        fontSize: '0.78rem',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Mega Menu Builder Settings (Only for Root Categories with Mega Menu Enabled) */}
              {formMegaMenuEnabled && !formParentId && (
                <div
                  style={{
                    backgroundColor: '#FAFAF8',
                    border: '1px solid #E8E7E2',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111111', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} />
                    <span>Mega Menu Configuration</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                        Featured Promo Image URL
                      </label>
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="/images/collection-earrings.jpg"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '5px', border: '1px solid #E8E7E2', fontSize: '0.78rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                        Featured Title
                      </label>
                      <input
                        type="text"
                        value={formFeaturedTitle}
                        onChange={(e) => setFormFeaturedTitle(e.target.value)}
                        placeholder="EARRINGS"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '5px', border: '1px solid #E8E7E2', fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                      Featured Description
                    </label>
                    <input
                      type="text"
                      value={formFeaturedDescription}
                      onChange={(e) => setFormFeaturedDescription(e.target.value)}
                      placeholder="Elegant designs for every occasion in pure 925 silver."
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '5px', border: '1px solid #E8E7E2', fontSize: '0.78rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={formFeaturedCtaText}
                        onChange={(e) => setFormFeaturedCtaText(e.target.value)}
                        placeholder="Shop Earrings →"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '5px', border: '1px solid #E8E7E2', fontSize: '0.78rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                        CTA Button URL
                      </label>
                      <input
                        type="text"
                        value={formFeaturedCtaUrl}
                        onChange={(e) => setFormFeaturedCtaUrl(e.target.value)}
                        placeholder="/shop?category=earrings"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '5px', border: '1px solid #E8E7E2', fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #E8E7E2',
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
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {editingItem ? 'Update Item' : 'Add to Navbar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
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
          onClick={() => setDeleteTarget(null)}
        >
          {(() => {
            const childItems = items.filter((i) => i.parentId === deleteTarget.id);
            const childCount = childItems.length;

            return (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  maxWidth: '460px',
                  width: '100%',
                  padding: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#C0392B', marginBottom: '12px' }}>
                  <AlertTriangle size={20} />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                    {childCount > 0 ? `Delete "${deleteTarget.label}" & ${childCount} Child Items?` : `Delete "${deleteTarget.label}"?`}
                  </h3>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#6F6F6A', lineHeight: 1.5 }}>
                  Are you sure you want to permanently delete <strong>&quot;{deleteTarget.label}&quot;</strong> from the navigation?
                  {childCount > 0 && (
                    <span style={{ display: 'block', marginTop: '10px', padding: '10px 12px', backgroundColor: '#FDF2F2', border: '1px solid #F8D7DA', borderRadius: '6px', color: '#721C24', fontSize: '0.78rem' }}>
                      <strong>Cascade Deletion Notice:</strong> This item has <strong>{childCount} subcategory items</strong> ({childItems.map((c) => c.label).join(', ')}). Deleting it will safely remove both this parent category and all its child items from MongoDB and the storefront.
                    </span>
                  )}
                  <span style={{ display: 'block', marginTop: '10px', fontSize: '0.75rem', color: '#8E8D88' }}>
                    Note: This removes the navigation entry from MongoDB, but preserves any underlying product and category catalogue records.
                  </span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeletingItem}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '5px',
                      border: '1px solid #E8E7E2',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      cursor: isDeletingItem ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeletingItem}
                    style={{
                      padding: '7px 18px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#C0392B',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: isDeletingItem ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isDeletingItem ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Deleting from DB...</span>
                      </>
                    ) : (
                      <span>{childCount > 0 ? `Delete (${childCount + 1} items)` : 'Delete Item'}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. FLOATING TOAST NOTIFICATION */}
      {/* ========================================================= */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toastType === 'error' ? '#C0392B' : '#111111',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {toastType === 'error' ? <AlertTriangle size={15} /> : <Check size={15} />}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
