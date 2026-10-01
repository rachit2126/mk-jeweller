import { NextRequest, NextResponse } from 'next/server';
import { optimizeJewelleryImage } from '@/lib/services/imageOptimizer';
import { connectDB } from '@/lib/db/mongodb';
import { DbMediaItem } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;
    const allFiles: File[] = files.length > 0 ? files : (singleFile ? [singleFile] : []);
    const folder = (formData.get('folder') as any) || 'products';
    const preset = (formData.get('preset') as any) || 'high_quality';

    if (allFiles.length === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const db = await connectDB();
    const processedItems: DbMediaItem[] = [];
    const optimizationStats: any[] = [];

    for (const file of allFiles) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
      if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
        throw new Error(`Unsupported file format for "${file.name}". Supported formats: JPG, PNG, WEBP, AVIF.`);
      }

      // Max size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`"${file.name}" is larger than 10 MB.`);
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Pass through sharp optimization pipeline
      const result = await optimizeJewelleryImage(buffer, file.name, preset);

      const mediaItem: DbMediaItem = {
        id: result.id,
        filename: `${result.id}-1200w.webp`,
        originalName: result.originalName,
        url: result.urls.lg || result.urls.original,
        type: 'image',
        mimeType: 'image/webp',
        sizeBytes: result.optimizedSizeBytes,
        originalSizeBytes: result.originalSizeBytes,
        savingsPercent: result.savingsPercent,
        dimensions: result.dimensions,
        formats: result.formats,
        sizes: result.urls,
        folder,
        tags: ['upload', folder],
        usedBy: [],
        createdAt: new Date().toISOString(),
      };

      await db.collection('media').insertOne(mediaItem as any);
      processedItems.push(mediaItem);
      optimizationStats.push({
        id: result.id,
        filename: file.name,
        originalSizeBytes: result.originalSizeBytes,
        optimizedSizeBytes: result.optimizedSizeBytes,
        savingsPercent: result.savingsPercent,
        dimensions: result.dimensions,
        url: mediaItem.url,
        thumbnailUrl: result.urls.thumbnail || mediaItem.url,
      });
    }

    // Log audit in MongoDB
    await logAuditMongo(
      session.name,
      session.email,
      'MEDIA_UPLOADED',
      'Media',
      processedItems.map((m) => m.id).join(', '),
      `Uploaded & sharp-optimized ${processedItems.length} product image(s) in MongoDB`
    );

    const firstItem = processedItems[0];
    const firstOpt = optimizationStats[0];

    return NextResponse.json({
      success: true,
      items: processedItems,
      optimizations: optimizationStats,
      // Backward compatibility fields for single-upload callers
      media: firstItem,
      url: firstItem.url,
      optimization: firstOpt,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Image processing failed' }, { status: 500 });
  }
}
