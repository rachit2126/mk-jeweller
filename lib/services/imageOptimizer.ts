import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface OptimizationResult {
  id: string;
  originalName: string;
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  savingsPercent: number;
  dimensions: {
    width: number;
    height: number;
  };
  formats: ('original' | 'webp' | 'avif')[];
  urls: {
    original: string;
    thumbnail: string;
    sm: string;  // 400px
    md: string;  // 800px
    lg: string;  // 1200px
    xl: string;  // 1600px
    avif?: string;
  };
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'optimized');

// Supported mime types
const SUPPORTED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/jpg',
];

export async function optimizeJewelleryImage(
  buffer: Buffer,
  originalFilename: string,
  preset: 'balanced' | 'high_quality' | 'maximum_compression' = 'high_quality'
): Promise<OptimizationResult> {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const id = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const cleanBaseName = originalFilename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 30);

  // Validate image with sharp
  const metadata = await sharp(buffer).metadata();
  if (!metadata.format || !metadata.width || !metadata.height) {
    throw new Error('Invalid or corrupted image file');
  }

  // Quality settings tailored for fine 925 silver & gemstones
  let webpQuality = 85;
  let avifQuality = 75;

  if (preset === 'high_quality') {
    webpQuality = 88;
    avifQuality = 80;
  } else if (preset === 'maximum_compression') {
    webpQuality = 75;
    avifQuality = 65;
  }

  const originalSizeBytes = buffer.length;

  // 1. Save sanitized original
  const origFileName = `${id}-${cleanBaseName}.${metadata.format}`;
  const origFilePath = path.join(UPLOADS_DIR, origFileName);
  fs.writeFileSync(origFilePath, buffer);

  // 2. Generate Thumbnail (160x160 square)
  const thumbFileName = `${id}-${cleanBaseName}-thumb.webp`;
  const thumbFilePath = path.join(UPLOADS_DIR, thumbFileName);
  await sharp(buffer)
    .resize(160, 160, { fit: 'cover', position: 'center' })
    .webp({ quality: webpQuality })
    .toFile(thumbFilePath);

  // 3. Generate 400px (Mobile card)
  const smFileName = `${id}-${cleanBaseName}-400w.webp`;
  const smFilePath = path.join(UPLOADS_DIR, smFileName);
  await sharp(buffer)
    .resize(Math.min(400, metadata.width), null, { withoutEnlargement: true })
    .webp({ quality: webpQuality })
    .toFile(smFilePath);

  // 4. Generate 800px (Tablet / Desktop Card)
  const mdFileName = `${id}-${cleanBaseName}-800w.webp`;
  const mdFilePath = path.join(UPLOADS_DIR, mdFileName);
  await sharp(buffer)
    .resize(Math.min(800, metadata.width), null, { withoutEnlargement: true })
    .webp({ quality: webpQuality })
    .toFile(mdFilePath);

  // 5. Generate 1200px (Product Detail Zoom)
  const lgFileName = `${id}-${cleanBaseName}-1200w.webp`;
  const lgFilePath = path.join(UPLOADS_DIR, lgFileName);
  await sharp(buffer)
    .resize(Math.min(1200, metadata.width), null, { withoutEnlargement: true })
    .webp({ quality: webpQuality })
    .toFile(lgFilePath);

  // 6. Generate 1600px (Hero / High-DPI screens)
  const xlFileName = `${id}-${cleanBaseName}-1600w.webp`;
  const xlFilePath = path.join(UPLOADS_DIR, xlFileName);
  await sharp(buffer)
    .resize(Math.min(1600, metadata.width), null, { withoutEnlargement: true })
    .webp({ quality: webpQuality })
    .toFile(xlFilePath);

  // 7. Generate AVIF for ultra-modern browsers
  const avifFileName = `${id}-${cleanBaseName}-1200w.avif`;
  const avifFilePath = path.join(UPLOADS_DIR, avifFileName);
  await sharp(buffer)
    .resize(Math.min(1200, metadata.width), null, { withoutEnlargement: true })
    .avif({ quality: avifQuality })
    .toFile(avifFilePath);

  // Calculate size of main delivery size (1200px WebP)
  const stats = fs.statSync(lgFilePath);
  const optimizedSizeBytes = stats.size;
  const savingsPercent = Math.max(
    0,
    Math.round(((originalSizeBytes - optimizedSizeBytes) / originalSizeBytes) * 100)
  );

  return {
    id,
    originalName: originalFilename,
    originalSizeBytes,
    optimizedSizeBytes,
    savingsPercent,
    dimensions: {
      width: metadata.width,
      height: metadata.height,
    },
    formats: ['original', 'webp', 'avif'],
    urls: {
      original: `/uploads/optimized/${origFileName}`,
      thumbnail: `/uploads/optimized/${thumbFileName}`,
      sm: `/uploads/optimized/${smFileName}`,
      md: `/uploads/optimized/${mdFileName}`,
      lg: `/uploads/optimized/${lgFileName}`,
      xl: `/uploads/optimized/${xlFileName}`,
      avif: `/uploads/optimized/${avifFileName}`,
    },
  };
}
