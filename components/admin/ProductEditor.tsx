'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Check,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { DbProduct } from '@/lib/db/types';

import MultiImageUploader from './MultiImageUploader';

interface ProductEditorProps {
  initialProduct?: DbProduct;
  isEditing?: boolean;
}

export default function ProductEditor({ initialProduct, isEditing = false }: ProductEditorProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'pricing' | 'attributes' | 'seo' | 'related'>('basic');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [category, setCategory] = useState(initialProduct?.category || 'necklaces');
  const [collection, setCollection] = useState(initialProduct?.collectionIds?.[0] || 'bridal-collection');
  const [price, setPrice] = useState<number | string>(initialProduct?.price ?? 2999);
  const [compareAtPrice, setCompareAtPrice] = useState<number | string>(initialProduct?.compareAtPrice ?? 3999);
  const [costPrice, setCostPrice] = useState<number | string>(initialProduct?.costPrice ?? 1600);
  const [stock, setStock] = useState<number | string>(initialProduct?.stock ?? 12);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | string>(initialProduct?.lowStockThreshold ?? 5);

  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string; slug: string; status: string }[]>([]);
  const [availableCollections, setAvailableCollections] = useState<{ id: string; name: string; slug: string; status: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/categories?limit=all')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories) {
          setAvailableCategories(data.categories);
        }
      })
      .catch(() => {});

    fetch('/api/admin/collections?limit=all')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.collections) {
          setAvailableCollections(data.collections);
        }
      })
      .catch(() => {});
  }, []);

  const [isFeatured, setIsFeatured] = useState(!!initialProduct?.featured);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival ?? true);
  const [isBestSeller, setIsBestSeller] = useState(!!initialProduct?.isBestSeller);

  const [shortDesc, setShortDesc] = useState(initialProduct?.shortDescription || 'Elegant Kundan chandbali necklace crafted in pure 925 sterling silver.');
  const [fullDesc, setFullDesc] = useState(initialProduct?.description || 'A timeless Kundan chandbali necklace handcrafted in pure 925 sterling silver, designed for modern elegance with traditional charm. Finished with anti-tarnish rhodium.');

  // Jewellery Attributes
  const [material, setMaterial] = useState(initialProduct?.details?.material || 'Solid 925 Sterling Silver');
  const [purity, setPurity] = useState(initialProduct?.attributes?.purity || '925');
  const [weight, setWeight] = useState(initialProduct?.weight || '8.4g');
  const [gemstone, setGemstone] = useState(initialProduct?.details?.gemstone || 'Natural Pearls & Cubic Zirconia');
  const [plating, setPlating] = useState(initialProduct?.details?.plating || 'Anti-Tarnish Rhodium Finish');
  const [dimensions, setDimensions] = useState(initialProduct?.details?.dimensions || '42mm x 18mm');
  const [claspType, setClaspType] = useState(initialProduct?.details?.claspType || 'Comfort Push Back');
  const [hallmark, setHallmark] = useState(initialProduct?.details?.hallmark || 'BIS 925 Hallmarked');

  // Media
  const [images, setImages] = useState<string[]>(
    initialProduct?.images?.length
      ? initialProduct.images
      : ['/images/collection-necklaces.jpg', '/images/editorial/bridal-banner-clean-hd.jpg', '/images/collection-earrings.jpg']
  );

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (status: 'active' | 'draft') => {
    if (!name.trim()) {
      showToast('Product name is required');
      setActiveTab('basic');
      return;
    }

    setSaving(true);
    const payload = {
      name,
      slug,
      sku: sku || `MK-${category.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-3)}`,
      category,
      categoryLabel: availableCategories.find(c => c.slug === category)?.name || (category.charAt(0).toUpperCase() + category.slice(1)),
      price: Number(price),
      compareAtPrice: Number(compareAtPrice),
      costPrice: Number(costPrice),
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      status,
      featured: isFeatured,
      isNewArrival,
      isBestSeller,
      shortDescription: shortDesc,
      description: fullDesc,
      images,
      collectionIds: [collection],
      weight,
      purity,
      material,
      plating,
      dimensions,
      gemstone,
      claspType,
      hallmark,
    };

    try {
      const url = isEditing && initialProduct?.id
        ? `/api/admin/products/${initialProduct.id}`
        : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || 'Failed to save product');
      } else {
        showToast(isEditing ? 'Product updated successfully!' : 'Product published successfully!');
        setTimeout(() => {
          router.push('/admin/products');
        }, 800);
      }
    } catch {
      showToast('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!initialProduct) return;
    const targetId = initialProduct.id || (initialProduct as any)._id?.toString();
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
        showToast(data.message || 'Product deleted successfully');
        setShowDeleteModal(false);
        setTimeout(() => {
          router.push('/admin/products');
        }, 600);
      }
    } catch {
      showToast('Unable to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="product-editor-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="editor-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar matching reference screenshot */}
      <div className="editor-top-bar">
        <div className="top-bar-left">
          <Link href="/admin/products" className="back-btn" title="Back to products list">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="editor-page-title">
            {isEditing ? `Edit: ${initialProduct?.name}` : 'Add New Product'}
          </h1>
        </div>

        <div className="top-bar-actions">
          {isEditing && (
            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => setShowDeleteModal(true)}
              className="btn-delete-editor"
              title="Delete this product"
            >
              <Trash2 size={15} />
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          )}
          <button
            type="button"
            disabled={saving || deleting}
            onClick={() => handleSave('draft')}
            className="btn-draft"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving || deleting}
            onClick={() => handleSave('active')}
            className="btn-publish"
          >
            <span>{saving ? 'Publishing...' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar matching reference screenshot */}
      <div className="tabs-header-bar">
        {[
          { key: 'basic', label: 'Basic Information' },
          { key: 'media', label: 'Images & Media' },
          { key: 'pricing', label: 'Pricing & Inventory' },
          { key: 'attributes', label: 'Attributes & Variants' },
          { key: 'seo', label: 'SEO & Details' },
          { key: 'related', label: 'Related Products' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="editor-grid">
        {/* Left Column: Tab Forms */}
        <div className="editor-left-card">
          {activeTab === 'basic' && (
            <div className="tab-pane">
              <div className="fields-grid-2">
                <div className="field-group">
                  <label className="field-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Kundan Chandbali Necklace"
                    className="form-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="kundan-chandbali-necklace"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="fields-grid-2">
                <div className="field-group">
                  <label className="field-label">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="form-select"
                  >
                    {availableCategories.length === 0 ? (
                      <option value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ) : (
                      availableCategories
                        .filter(c => c.status === 'active' || c.slug === category)
                        .map(c => (
                          <option key={c.id || c.slug} value={c.slug}>
                            {c.name} {c.status === 'inactive' ? '(Inactive)' : ''}
                          </option>
                        ))
                    )}
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Collection</label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="form-select"
                  >
                    <option value="">None</option>
                    {availableCollections
                      .filter((c) => c.status === 'active' || c.slug === collection)
                      .map((c) => (
                        <option key={c.id || c.slug} value={c.slug}>
                          {c.name} {c.status === 'inactive' ? '(Inactive)' : ''}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Toggles Row matching screenshot */}
              <div className="toggles-row">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="toggle-switch"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="toggle-switch"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="toggle-switch"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              {/* Short Description */}
              <div className="field-group">
                <label className="field-label">Short Description *</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>

              {/* Full Description with Formatting Toolbar */}
              <div className="field-group">
                <label className="field-label">Full Description</label>
                <div className="editor-rich-toolbar">
                  <span className="tool-btn font-bold">B</span>
                  <span className="tool-btn italic">I</span>
                  <span className="tool-btn underline">U</span>
                  <span className="tool-btn">List</span>
                  <span className="tool-btn">Link</span>
                  <span className="tool-btn">Clear</span>
                </div>
                <textarea
                  rows={4}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="form-textarea full-desc"
                />
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="tab-pane">
              <h3 className="section-title">Pricing & Financials</h3>
              <div className="fields-grid-3">
                <div className="field-group">
                  <label className="field-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Compare at Price (₹)</label>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <h3 className="section-title" style={{ marginTop: '20px' }}>Inventory Control</h3>
              <div className="fields-grid-3">
                <div className="field-group">
                  <label className="field-label">SKU (Stock Keeping Unit)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="MK-NEC-101"
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Current Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attributes' && (
            <div className="tab-pane">
              <h3 className="section-title">Jewellery Specifications</h3>
              <div className="fields-grid-2">
                <div className="field-group">
                  <label className="field-label">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Silver Purity</label>
                  <input
                    type="text"
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Hallmark Certification</label>
                  <input
                    type="text"
                    value={hallmark}
                    onChange={(e) => setHallmark(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Plating / Finish</label>
                  <input
                    type="text"
                    value={plating}
                    onChange={(e) => setPlating(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Gemstone</label>
                  <input
                    type="text"
                    value={gemstone}
                    onChange={(e) => setGemstone(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Dimensions</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Clasp / Closure</label>
                  <input
                    type="text"
                    value={claspType}
                    onChange={(e) => setClaspType(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="tab-pane">
              <h3 className="section-title">Search Engine Optimization</h3>
              <div className="field-group">
                <label className="field-label">SEO Page Title</label>
                <input
                  type="text"
                  placeholder={`${name || 'Product'} | MK Silver Hub`}
                  className="form-input"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Meta Description</label>
                <textarea
                  rows={3}
                  placeholder={`Buy genuine 925 sterling silver ${name.toLowerCase()} online at MK Silver Hub. BIS hallmarked with pan-India insured delivery.`}
                  className="form-textarea"
                />
              </div>
            </div>
          )}

          {(activeTab === 'media' || activeTab === 'related') && (
            <div className="tab-pane">
              <h3 className="section-title">Media & Associations</h3>
              <p className="tab-hint">
                Manage high resolution product gallery images and cross-sell suites on the right panel.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Multi-Image Upload & Optimization Pipeline */}
        <div className="editor-right-col">
          <div className="media-widget-card" style={{ padding: '22px' }}>
            <MultiImageUploader
              images={images}
              onChange={(newImgs) => setImages(newImgs)}
              onToast={(msg, type) => showToast(msg)}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && initialProduct && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!deleting) setShowDeleteModal(false);
          }}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-badge">
              <AlertCircle size={24} color="#C53030" />
            </div>
            <h3 className="modal-title">Delete Product?</h3>
            <p className="modal-desc">
              Are you sure you want to delete <strong>{name || initialProduct.name}</strong> (SKU: {sku || initialProduct.sku})? This action will remove it from the catalog.
            </p>
            <div className="modal-actions-row">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="modal-btn-cancel"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="modal-btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .product-editor-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .editor-toast {
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
          font-weight: 500;
        }

        .editor-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          padding: 14px 20px;
          border-radius: 16px;
          border: 1px solid #EAE2DB;
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #E8D8D0;
          background: #FFF9F3;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #342727;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .back-btn:hover {
          background-color: #F2F0EA;
          color: #111111;
        }

        .editor-page-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #111111;
          margin: 0;
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-draft {
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          color: #111111;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-draft:hover {
          border-color: #111111;
          background-color: #F8F7F3;
        }

        .btn-publish {
          background-color: #111111;
          color: #FFFFFF;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s ease;
        }

        .btn-publish:hover:not(:disabled) {
          background-color: #252525;
        }

        .btn-publish:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* TABS HEADER */
        .tabs-header-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }

        .tab-btn {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          padding: 7px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #6F6F6A;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .tab-btn:hover {
          background-color: #F8F7F3;
          color: #111111;
        }

        .tab-btn.active {
          background-color: #111111;
          border-color: #111111;
          color: #FFFFFF;
          font-weight: 600;
        }

        /* 2-COLUMN GRID */
        .editor-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 18px;
        }

        .editor-left-card {
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 4px 16px rgba(59, 43, 43, 0.02);
        }

        .tab-pane {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .fields-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .fields-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .field-group {
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
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          padding: 8px 12px;
          font-family: inherit;
          font-size: 0.84rem;
          color: #111111;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #111111;
          background-color: #FFFFFF;
        }

        .toggles-row {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 10px 0;
          flex-wrap: wrap;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          color: #111111;
          cursor: pointer;
        }

        .toggle-switch {
          width: 16px;
          height: 16px;
          accent-color: #111111;
          cursor: pointer;
        }

        .editor-rich-toolbar {
          display: flex;
          gap: 6px;
          background: #F8F5F2;
          padding: 6px 10px;
          border-radius: 8px 8px 0 0;
          border: 1px solid #E8D8D0;
          border-bottom: none;
        }

        .tool-btn {
          font-size: 0.76rem;
          color: #806D68;
          padding: 2px 6px;
          cursor: pointer;
        }

        .form-textarea.full-desc {
          border-radius: 0 0 10px 10px;
        }

        .section-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #342727;
          margin: 0;
        }

        .tab-hint {
          font-size: 0.82rem;
          color: #806D68;
          margin: 0;
        }

        /* RIGHT COLUMN (IMAGES & OPTIMIZATION) */
        .editor-right-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .media-widget-card, .optimization-widget-card {
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(59, 43, 43, 0.02);
        }

        .media-header, .opt-header {
          margin-bottom: 14px;
        }

        .media-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #342727;
          margin: 0 0 2px 0;
        }

        .media-rec, .opt-sub {
          font-size: 0.74rem;
          color: #806D68;
        }

        .images-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .main-image-slot {
          position: relative;
          height: 180px;
          border-radius: 14px;
          overflow: hidden;
          background: #F8F5F2;
          border: 1px solid #E8D8D0;
        }

        .main-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background-color: #111111;
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          z-index: 10;
        }

        .thumbnails-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .thumb-slot {
          position: relative;
          height: 86px;
          border-radius: 6px;
          overflow: hidden;
          background: #F8F7F3;
          border: 1px solid #E8E7E2;
        }

        :global(.slot-img) {
          object-fit: cover;
        }

        .delete-img-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 18px;
          height: 18px;
          background: rgba(0, 0, 0, 0.7);
          color: #FFFFFF;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }

        .upload-dropzone {
          border: 1.5px dashed #D8D5CE;
          background-color: #F8F7F3;
          border-radius: 6px;
          height: 86px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 6px;
          text-align: center;
          transition: all 0.15s ease;
        }

        .upload-dropzone:hover {
          background-color: #F2F0EA;
          border-color: #111111;
        }

        .upload-txt {
          font-size: 0.74rem;
          font-weight: 600;
          color: #111111;
          margin-top: 3px;
        }

        .upload-sub {
          font-size: 0.62rem;
          color: #6F6F6A;
        }

        /* OPTIMIZATION CARD MATCHING SCREENSHOT */
        .opt-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #342727;
          margin: 0 0 2px 0;
        }

        .opt-result-box {
          background-color: #F8F5F2;
          border: 1px solid #EAE2DB;
          border-radius: 12px;
          padding: 12px 14px;
        }

        .opt-file-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .opt-thumb-mini {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid #E8D8D0;
          flex-shrink: 0;
        }

        :global(.mini-img) {
          object-fit: cover;
        }

        .opt-file-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .opt-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .opt-filename {
          font-size: 0.8rem;
          font-weight: 600;
          color: #342727;
        }

        .opt-badge-success {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background-color: #E6FFFA;
          color: #234E52;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .opt-stats-row {
          font-size: 0.74rem;
          color: #6F5A58;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .dot-sep {
          color: #D9C8BE;
        }

        .savings-highlight {
          color: #2F855A;
          font-weight: 600;
        }

        .opt-pills-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid #EAE2DB;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sizes-pills {
          display: flex;
          gap: 4px;
        }

        .size-pill {
          background-color: #FFFFFF;
          border: 1px solid #E8D8D0;
          font-size: 0.68rem;
          padding: 2px 6px;
          border-radius: 4px;
          color: #806D68;
        }

        .format-pill {
          background-color: #F2F0EA;
          color: #111111;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .btn-delete-editor {
          background: #FFFFFF;
          border: 1px solid #FEB2B2;
          color: #C53030;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .btn-delete-editor:hover:not(:disabled) {
          background-color: #FFF5F5;
          border-color: #E53E3E;
        }

        .btn-delete-editor:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          background-color: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #EAE2DB;
          max-width: 440px;
          width: 100%;
          padding: 26px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 12px 36px rgba(52, 39, 39, 0.16);
          animation: modalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-icon-badge {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: #FFF5F5;
          border: 1px solid #FED7D7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .modal-title {
          font-family: var(--font-display), 'Cormorant Garamond', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #342727;
          margin: 0 0 8px 0;
        }

        .modal-desc {
          font-size: 0.86rem;
          line-height: 1.5;
          color: #6F5A58;
          margin: 0 0 22px 0;
        }

        .modal-actions-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .modal-btn-cancel {
          flex: 1;
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          color: #342727;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.86rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .modal-btn-cancel:hover:not(:disabled) {
          background-color: #F8F5F2;
        }

        .modal-btn-danger {
          flex: 1;
          background-color: #E53E3E;
          border: 1px solid #E53E3E;
          color: #FFFFFF;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .modal-btn-danger:hover:not(:disabled) {
          background-color: #C53030;
        }

        .modal-btn-danger:disabled, .modal-btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .editor-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
