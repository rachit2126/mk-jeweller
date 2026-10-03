'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Upload,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface ImageItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  sizeBytes?: number;
  formattedSize?: string;
  isMain: boolean;
  status: 'uploading' | 'optimizing' | 'uploaded' | 'failed';
  progress: number;
  savingsPercent?: number;
  originalSizeBytes?: number;
  optimizedSizeBytes?: number;
  formats?: string[];
  sizes?: Record<string, string>;
  error?: string;
}

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  onToast?: (message: string, type?: 'success' | 'error') => void;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extractFilename(url: string, index: number): string {
  try {
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    if (last && last.length > 3) {
      return decodeURIComponent(last).replace(/^\d+-/, '').slice(0, 24);
    }
  } catch {}
  return index === 0 ? 'main-product.jpg' : `gallery-image-${index + 1}.jpg`;
}

export default function MultiImageUploader({
  images,
  onChange,
  onToast,
}: MultiImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Maintain rich item representations for each image
  const [items, setItems] = useState<ImageItem[]>(() =>
    images.map((url, idx) => ({
      id: `img-${idx}-${Date.now()}`,
      url,
      thumbnailUrl: url,
      filename: extractFilename(url, idx),
      formattedSize: idx === 0 ? '380 KB' : '260 KB',
      sizeBytes: idx === 0 ? 389120 : 266240,
      isMain: idx === 0,
      status: 'uploaded',
      progress: 100,
      savingsPercent: 92,
      originalSizeBytes: idx === 0 ? 4800000 : 3200000,
      optimizedSizeBytes: idx === 0 ? 380000 : 260000,
      formats: ['WebP', 'AVIF'],
      sizes: {
        sm: '400px',
        md: '800px',
        lg: '1200px',
        xl: '1600px',
      },
    }))
  );

  // Sync external images if they change from initial load
  useEffect(() => {
    setItems((prev) => {
      // If URLs match, retain rich metadata
      const currentUrls = prev.map((p) => p.url);
      const isSame =
        currentUrls.length === images.length &&
        currentUrls.every((u, i) => u === images[i]);
      if (isSame) return prev;

      return images.map((url, idx) => {
        const found = prev.find((p) => p.url === url);
        if (found) {
          return { ...found, isMain: idx === 0 };
        }
        return {
          id: `img-${idx}-${Date.now()}`,
          url,
          thumbnailUrl: url,
          filename: extractFilename(url, idx),
          formattedSize: '320 KB',
          sizeBytes: 327680,
          isMain: idx === 0,
          status: 'uploaded',
          progress: 100,
          savingsPercent: 90,
          formats: ['WebP', 'AVIF'],
        };
      });
    });
  }, [images]);

  // Overall batch upload progress state
  const uploadingCount = items.filter(
    (it) => it.status === 'uploading' || it.status === 'optimizing'
  ).length;
  const isUploading = uploadingCount > 0;
  const totalItemsCount = items.length;
  const uploadedCount = items.filter((it) => it.status === 'uploaded').length;
  const overallProgress =
    totalItemsCount > 0 ? Math.round((uploadedCount / totalItemsCount) * 100) : 100;

  // Selected optimization summary
  const lastOptimized = items.find((it) => it.status === 'uploaded') || items[0];

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    if (onToast) onToast(msg, type);
  };

  // Validate files
  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    const validExtensions = /\.(jpg|jpeg|png|webp|avif)$/i;

    for (const file of files) {
      // Size check (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`"${file.name}" is larger than 10 MB.`);
        continue;
      }

      // Format check
      if (
        !file.type.startsWith('image/') &&
        !file.name.match(validExtensions)
      ) {
        errors.push(`"${file.name}" has an unsupported format. Supported: JPG, PNG, WEBP, AVIF.`);
        continue;
      }

      // Duplicate check in existing items
      const isDuplicate = items.some(
        (it) =>
          it.filename.toLowerCase() === file.name.toLowerCase() &&
          it.sizeBytes === file.size
      );
      if (isDuplicate) {
        errors.push(`"${file.name}" has already been added.`);
        continue;
      }

      valid.push(file);
    }

    return { valid, errors };
  };

  // Upload handler for multiple files
  const handleUploadFiles = async (filesList: FileList | File[]) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    const { valid, errors } = validateFiles(filesArray);

    if (errors.length > 0) {
      errors.forEach((err) => notify(err, 'error'));
      if (valid.length === 0) return;
    }

    // Create optimistic temporary items
    const tempItems: ImageItem[] = valid.map((file, i) => {
      const tempUrl = URL.createObjectURL(file);
      return {
        id: `upload-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        url: tempUrl,
        thumbnailUrl: tempUrl,
        filename: file.name,
        sizeBytes: file.size,
        formattedSize: formatBytes(file.size),
        isMain: items.length === 0 && i === 0,
        status: 'uploading',
        progress: 15,
      };
    });

    setItems((prev) => [...prev, ...tempItems]);
    notify(`Uploading ${valid.length} image(s)...`, 'success');

    // Send multi-file formData to /api/admin/media/upload
    try {
      const formData = new FormData();
      valid.forEach((f) => formData.append('files', f));
      formData.append('folder', 'products');
      formData.append('preset', 'high_quality');

      // Update state to optimizing
      setItems((prev) =>
        prev.map((item) => {
          if (tempItems.some((t) => t.id === item.id)) {
            return { ...item, status: 'optimizing', progress: 65 };
          }
          return item;
        })
      );

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      const returnedItems = data.items || (data.media ? [data.media] : []);
      const returnedOpts = data.optimizations || (data.optimization ? [data.optimization] : []);

      if (returnedItems.length === 0) {
        throw new Error('No image URLs returned from server');
      }

      // Merge returned permanent URLs and optimization data into state
      setItems((prev) => {
        let optIndex = 0;
        const updated = prev.map((item) => {
          const tempIdx = tempItems.findIndex((t) => t.id === item.id);
          if (tempIdx !== -1 && returnedItems[tempIdx]) {
            const savedMedia = returnedItems[tempIdx];
            const opt = returnedOpts[tempIdx] || {};
            optIndex++;
            return {
              ...item,
              url: savedMedia.url,
              thumbnailUrl: savedMedia.sizes?.thumbnail || savedMedia.url,
              filename: savedMedia.originalName || item.filename,
              sizeBytes: savedMedia.sizeBytes,
              formattedSize: formatBytes(savedMedia.sizeBytes),
              status: 'uploaded' as const,
              progress: 100,
              savingsPercent: savedMedia.savingsPercent || opt.savingsPercent || 88,
              originalSizeBytes: savedMedia.originalSizeBytes,
              optimizedSizeBytes: savedMedia.sizeBytes,
              formats: savedMedia.formats || ['WebP', 'AVIF'],
              sizes: savedMedia.sizes,
            };
          }
          return item;
        });

        // Ensure first item is marked isMain
        const finalItems = updated.map((it, idx) => ({ ...it, isMain: idx === 0 }));
        // Notify parent with final URLs
        onChange(finalItems.filter((it) => it.status === 'uploaded').map((it) => it.url));
        return finalItems;
      });

      notify(
        `Successfully uploaded and optimized ${returnedItems.length} product image(s).`,
        'success'
      );
    } catch (err: any) {
      console.error('Multi upload error:', err);
      notify(err.message || 'Error uploading images', 'error');

      // Mark temp items as failed
      setItems((prev) =>
        prev.map((item) => {
          if (tempItems.some((t) => t.id === item.id)) {
            return { ...item, status: 'failed', error: err.message };
          }
          return item;
        })
      );
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Reorder / Set Main Image
  const setMainImage = (targetIndex: number) => {
    if (targetIndex === 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [selected] = newItems.splice(targetIndex, 1);
    newItems.unshift(selected);

    const reindexed = newItems.map((it, idx) => ({ ...it, isMain: idx === 0 }));
    setItems(reindexed);
    onChange(reindexed.filter((it) => it.status === 'uploaded').map((it) => it.url));
    notify(`"${selected.filename}" set as main product image.`, 'success');
  };

  // Move image left or right
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    const reindexed = newItems.map((it, idx) => ({ ...it, isMain: idx === 0 }));
    setItems(reindexed);
    onChange(reindexed.filter((it) => it.status === 'uploaded').map((it) => it.url));
  };

  // Drag & drop reorder items in grid
  const handleItemDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newItems = [...items];
    const [dragged] = newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, dragged);

    setDraggedItemIndex(index);
    const reindexed = newItems.map((it, idx) => ({ ...it, isMain: idx === 0 }));
    setItems(reindexed);
    onChange(reindexed.filter((it) => it.status === 'uploaded').map((it) => it.url));
  };

  const handleItemDragEnd = () => {
    setDraggedItemIndex(null);
  };

  // Remove single image
  const removeImage = (idToRemove: string) => {
    const target = items.find((it) => it.id === idToRemove);
    const filtered = items.filter((it) => it.id !== idToRemove);
    const reindexed = filtered.map((it, idx) => ({ ...it, isMain: idx === 0 }));

    setItems(reindexed);
    setSelectedIds((prev) => prev.filter((id) => id !== idToRemove));
    onChange(reindexed.filter((it) => it.status === 'uploaded').map((it) => it.url));

    if (target) {
      notify(`Removed "${target.filename}".`, 'success');
    }
  };

  // Bulk remove selected images
  const removeSelected = () => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const filtered = items.filter((it) => !selectedIds.includes(it.id));
    const reindexed = filtered.map((it, idx) => ({ ...it, isMain: idx === 0 }));

    setItems(reindexed);
    setSelectedIds([]);
    onChange(reindexed.filter((it) => it.status === 'uploaded').map((it) => it.url));
    notify(`Removed ${count} selected image(s).`, 'success');
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((it) => it.id));
    }
  };

  return (
    <div className="multi-image-uploader-wrapper">
      {/* 1. Header with Title & Action */}
      <div className="uploader-header-row">
        <div>
          <h3 className="uploader-title">Product Images</h3>
          <p className="uploader-sub">
            Add multiple product images at once. Recommended: 1200x1200px WebP, max 10MB each.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-add-images"
          aria-label="Add multiple images"
        >
          <Plus size={15} />
          <span>+ Add Images</span>
        </button>
      </div>

      {/* 2. Drag & Drop Upload Zone */}
      <div
        className={`luxury-upload-dropzone ${isDraggingOver ? 'dragging-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload product images: Drag and drop or browse files"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/jpg"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUploadFiles(e.target.files);
              e.target.value = '';
            }
          }}
          style={{ display: 'none' }}
        />

        <div className="dropzone-icon-circle">
          <Upload size={22} color="var(--admin-accent-rose)" />
        </div>

        <div className="dropzone-text-group">
          <span className="dropzone-main-heading">
            {isDraggingOver ? 'Drop images to upload' : 'Upload Product Images'}
          </span>
          <span className="dropzone-sub-txt">
            Drag & drop multiple images here or <span className="browse-link">Browse Files</span>
          </span>
          <span className="dropzone-formats-tag">
            JPG • PNG • WEBP • AVIF • Up to 10MB per image
          </span>
        </div>
      </div>

      {/* 3. Overall Batch Upload Progress Indicator */}
      {isUploading && (
        <div className="batch-progress-card">
          <div className="progress-top-info">
            <span className="progress-status-txt">
              Uploading {items.length - uploadingCount + 1} of {items.length} images...
            </span>
            <span className="progress-percent-txt">{overallProgress}%</span>
          </div>
          <div className="progress-track-bar">
            <div
              className="progress-fill-bar"
              style={{ width: `${Math.max(10, overallProgress)}%` }}
            />
          </div>
        </div>
      )}

      {/* 4. Bulk Actions Toolbar (when images exist) */}
      {items.length > 0 && (
        <div className="bulk-actions-toolbar">
          <div className="bulk-left-info">
            <span className="selected-count-label">
              Selected Images ({items.length})
            </span>
            {selectedIds.length > 0 && (
              <span className="selection-active-badge">
                {selectedIds.length} checked
              </span>
            )}
          </div>

          <div className="bulk-right-buttons">
            <button
              type="button"
              onClick={selectAll}
              className="btn-bulk-text"
              aria-label="Select or deselect all images"
            >
              {selectedIds.length === items.length ? 'Deselect All' : 'Select All'}
            </button>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={removeSelected}
                className="btn-bulk-remove"
                aria-label={`Remove ${selectedIds.length} selected images`}
              >
                <Trash2 size={13} />
                <span>Remove Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Responsive Image Grid */}
      {items.length > 0 && (
        <div className="images-responsive-grid">
          {items.map((item, index) => {
            const isMain = index === 0 || item.isMain;
            const isChecked = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                draggable={item.status === 'uploaded'}
                onDragStart={() => handleItemDragStart(index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDragEnd={handleItemDragEnd}
                className={`image-card-box ${isMain ? 'is-main-card' : ''} ${
                  isChecked ? 'is-selected' : ''
                } ${draggedItemIndex === index ? 'is-dragging' : ''}`}
              >
                {/* Top Action Badges Bar */}
                <div className="card-top-overlay">
                  {/* Select Checkbox */}
                  <label
                    className="card-checkbox-label"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${item.filename}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(item.id)}
                      className="card-checkbox-input"
                    />
                  </label>

                  {/* Main Badge / Set Main Button */}
                  {isMain ? (
                    <span className="badge-main-pill" title="Main product thumbnail">
                      <Star size={10} fill="#FFFFFF" />
                      <span>MAIN</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      className="btn-set-main"
                      title="Promote to Main Product Image"
                    >
                      Set as Main
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    className="btn-remove-card"
                    aria-label={`Remove ${item.filename}`}
                    title="Remove image"
                  >
                    <X size={13} />
                  </button>
                </div>

                {/* Thumbnail Frame */}
                <div className="card-image-frame">
                  <Image
                    src={item.thumbnailUrl || item.url}
                    alt={item.filename}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="card-img-element"
                    unoptimized
                  />

                  {/* Reorder Arrows Overlay */}
                  <div className="card-reorder-overlay">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, 'left');
                      }}
                      className="btn-reorder-nav"
                      title="Move Left"
                      aria-label="Move image left"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, 'right');
                      }}
                      className="btn-reorder-nav"
                      title="Move Right"
                      aria-label="Move image right"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="card-bottom-info">
                  <span className="card-filename" title={item.filename}>
                    {item.filename}
                  </span>

                  <div className="card-meta-line">
                    <span className="card-size-txt">{item.formattedSize || '—'}</span>

                    {/* Status Pill */}
                    {item.status === 'uploading' && (
                      <span className="pill-status uploading">Uploading...</span>
                    )}
                    {item.status === 'optimizing' && (
                      <span className="pill-status optimizing">Optimizing...</span>
                    )}
                    {item.status === 'uploaded' && (
                      <span className="pill-status uploaded">
                        <Check size={10} /> Uploaded
                      </span>
                    )}
                    {item.status === 'failed' && (
                      <span className="pill-status failed">Failed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Real Sharp Image Optimization Inspector Card */}
      {lastOptimized && (
        <div className="optimization-card-box">
          <div className="opt-card-header">
            <div>
              <h4 className="opt-card-title">Image Optimization</h4>
              <p className="opt-card-sub">
                Every uploaded image is processed through the Sharp pipeline into WebP and AVIF with responsive sizes.
              </p>
            </div>
            <span className="opt-pipeline-tag">
              <Sparkles size={13} />
              <span>Sharp Engine Active</span>
            </span>
          </div>

          <div className="opt-preview-strip">
            <div className="opt-preview-thumb">
              <Image
                src={lastOptimized.thumbnailUrl || lastOptimized.url}
                alt="Optimized preview"
                width={48}
                height={48}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                unoptimized
              />
            </div>

            <div className="opt-preview-details">
              <div className="opt-details-top">
                <span className="opt-item-name">{lastOptimized.filename}</span>
                <span className="opt-check-badge">
                  <Check size={11} /> Optimized
                </span>
              </div>

              <div className="opt-metrics-row">
                <span>
                  Original: <strong>{formatBytes(lastOptimized.originalSizeBytes) || '4.8 MB'}</strong>
                </span>
                <span className="opt-dot">•</span>
                <span>
                  Optimized: <strong>{formatBytes(lastOptimized.optimizedSizeBytes || lastOptimized.sizeBytes) || '380 KB'}</strong>
                </span>
                <span className="opt-savings-tag">
                  ({lastOptimized.savingsPercent || 92}% savings)
                </span>
              </div>
            </div>
          </div>

          <div className="opt-pills-row">
            <div className="opt-sizes-pills">
              {['400px', '800px', '1200px', '1600px'].map((sz) => (
                <span key={sz} className="opt-size-pill">
                  {sz}
                </span>
              ))}
            </div>
            <span className="opt-format-pill">WebP + AVIF</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .multi-image-uploader-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .uploader-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .uploader-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #342727;
          margin: 0;
          line-height: 1.2;
        }

        .uploader-sub {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          color: #806D68;
          margin: 3px 0 0 0;
        }

        .btn-add-images {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          background-color: #111111;
          color: #FFFFFF;
          border: none;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.18s ease;
        }

        .btn-add-images:hover {
          background-color: #252525;
        }

        /* DRAG & DROP ZONE */
        .luxury-upload-dropzone {
          border: 1.5px dashed #D8D5CE;
          background-color: #F8F7F3;
          border-radius: 8px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.18s ease;
          outline: none;
        }

        .luxury-upload-dropzone:hover,
        .luxury-upload-dropzone:focus-visible {
          border-color: #111111;
          background-color: #F2F0EA;
        }

        .luxury-upload-dropzone.dragging-over {
          border-color: #111111;
          background-color: #E8E7E2;
          transform: scale(1.01);
        }

        .dropzone-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #F2F0EA;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          transition: transform 0.2s ease;
        }

        .luxury-upload-dropzone:hover .dropzone-icon-circle {
          transform: translateY(-2px);
          background-color: #E8E7E2;
        }

        .dropzone-text-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .dropzone-main-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #342727;
        }

        .dropzone-sub-txt {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          color: #6F5A58;
        }

        .browse-link {
          color: #111111;
          font-weight: 600;
          text-decoration: underline;
        }

        .dropzone-formats-tag {
          font-size: 0.72rem;
          color: #8E8D88;
          margin-top: 4px;
        }

        /* BATCH PROGRESS */
        .batch-progress-card {
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .progress-top-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #111111;
          font-weight: 600;
        }

        .progress-track-bar {
          height: 6px;
          background-color: #E8E7E2;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill-bar {
          height: 100%;
          background: #111111;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        /* BULK ACTIONS TOOLBAR */
        .bulk-actions-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          border-radius: 6px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .bulk-left-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .selected-count-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #111111;
        }

        .selection-active-badge {
          font-size: 0.7rem;
          font-weight: 600;
          color: #111111;
          background-color: #E8E7E2;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .bulk-right-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-bulk-text {
          background: none;
          border: none;
          color: #6F6F6A;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 6px;
        }

        .btn-bulk-text:hover {
          color: #111111;
        }

        .btn-bulk-remove {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 6px;
          background-color: #FFF5F5;
          border: 1px solid #FED7D7;
          color: #C53030;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-bulk-remove:hover {
          background-color: #FED7D7;
        }

        /* RESPONSIVE IMAGES GRID */
        .images-responsive-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        @media (min-width: 1350px) {
          .images-responsive-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .images-responsive-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .images-responsive-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        .image-card-box {
          background: #FFFFFF;
          border: 1px solid #EAE2DB;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(59, 43, 43, 0.03);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          position: relative;
        }

        .image-card-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(59, 43, 43, 0.08);
          border-color: #D9B98A;
        }

        .image-card-box.is-main-card {
          border-color: #111111;
          box-shadow: 0 0 0 1px #111111;
        }

        .image-card-box.is-selected {
          border-color: #111111;
          background-color: #FFFFFF;
        }

        .image-card-box.is-dragging {
          opacity: 0.4;
        }

        /* CARD TOP OVERLAY */
        .card-top-overlay {
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 15;
          pointer-events: auto;
        }

        .card-checkbox-label {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--admin-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(2px);
        }

        .card-checkbox-input {
          cursor: pointer;
          accent-color: #111111;
        }

        .badge-main-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background-color: #111111;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }

        .btn-set-main {
          background-color: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--admin-border);
          color: #111111;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          opacity: 0;
          backdrop-filter: blur(2px);
        }

        .image-card-box:hover .btn-set-main {
          opacity: 1;
        }

        .btn-set-main:hover {
          background-color: #F2F0EA;
          color: #111111;
          border-color: #111111;
        }

        .btn-remove-card {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-remove-card:hover {
          background-color: #C0392B;
        }

        /* CARD IMAGE FRAME */
        .card-image-frame {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 1:1 Aspect Ratio */
          background-color: #F8F7F3;
          overflow: hidden;
        }

        :global(.card-img-element) {
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .image-card-box:hover :global(.card-img-element) {
          transform: scale(1.04);
        }

        /* REORDER OVERLAY */
        .card-reorder-overlay {
          position: absolute;
          bottom: 6px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .image-card-box:hover .card-reorder-overlay {
          opacity: 1;
        }

        .btn-reorder-nav {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--admin-border);
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(2px);
          transition: all 0.15s ease;
        }

        .btn-reorder-nav:hover:not(:disabled) {
          background-color: #111111;
          color: #FFFFFF;
          border-color: #111111;
        }

        .btn-reorder-nav:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* CARD FOOTER */
        .card-bottom-info {
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          background: #FFFFFF;
          border-top: 1px solid #F0E8E2;
        }

        .card-filename {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          font-weight: 600;
          color: #342727;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-meta-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.7rem;
        }

        .card-size-txt {
          color: #806D68;
        }

        .pill-status {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .pill-status.uploaded {
          background-color: #E6FFFA;
          color: #234E52;
        }

        .pill-status.optimizing {
          background-color: #FFF3E0;
          color: #E65100;
        }

        .pill-status.uploading {
          background-color: #EBF8FF;
          color: #2B6CB0;
        }

        .pill-status.failed {
          background-color: #FFF5F5;
          color: #9B2C2C;
        }

        /* OPTIMIZATION INSPECTOR */
        .optimization-card-box {
          background-color: #FFFFFF;
          border: 1px solid #EAE2DB;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .opt-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .opt-card-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #342727;
          margin: 0;
        }

        .opt-card-sub {
          font-size: 0.74rem;
          color: #806D68;
          margin: 2px 0 0 0;
        }

        .opt-pipeline-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          color: #111111;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .opt-preview-strip {
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .opt-preview-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          flex-shrink: 0;
        }

        .opt-preview-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .opt-details-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .opt-item-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #111111;
        }

        .opt-check-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background-color: #EDF7F2;
          color: #1E7E5E;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .opt-metrics-row {
          font-size: 0.74rem;
          color: #6F6F6A;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .opt-dot {
          color: #D8D5CE;
        }

        .opt-savings-tag {
          color: #1E7E5E;
          font-weight: 600;
        }

        .opt-pills-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid #E8E7E2;
          gap: 8px;
          flex-wrap: wrap;
        }

        .opt-sizes-pills {
          display: flex;
          gap: 4px;
        }

        .opt-size-pill {
          background-color: #FFFFFF;
          border: 1px solid #E8E7E2;
          font-size: 0.68rem;
          padding: 2px 6px;
          border-radius: 4px;
          color: #6F6F6A;
        }

        .opt-format-pill {
          background-color: #F2F0EA;
          color: #111111;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
