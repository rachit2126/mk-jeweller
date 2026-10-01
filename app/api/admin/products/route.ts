import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbProduct, DbInventoryRecord } from '@/lib/db/types';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const category = searchParams.get('category')?.toLowerCase().trim() || '';
  const status = searchParams.get('status')?.toLowerCase().trim() || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  const db = await connectDB();
  const query: any = {};

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { name: regex },
      { sku: regex },
      { categoryLabel: regex },
      { slug: regex },
    ];
  }

  if (category && category !== 'all') {
    query.category = category;
  }

  if (status && status !== 'all') {
    if (status === 'archived') {
      query.$or = [{ status: 'archived' }, { isDeleted: true }];
    } else {
      query.status = status;
      query.isDeleted = { $ne: true };
    }
  } else {
    query.status = { $ne: 'archived' };
    query.isDeleted = { $ne: true };
  }

  const sortMap: Record<string, any> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
    stock_asc: { stock: 1 },
  };

  const sortDirection = sortMap[sort] || { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    db.collection('products').find(query).sort(sortDirection).skip(skip).limit(limit).toArray(),
    db.collection('products').countDocuments(query),
  ]);

  const products = docs.map(doc => {
    const { _id, ...rest } = doc;
    return { ...rest, id: rest.id || _id?.toString() } as DbProduct;
  });

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    limit,
  });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.name || !data.category || typeof data.price !== 'number') {
      return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 });
    }

    const db = await connectDB();

    // Unique slug check against MongoDB
    let slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const slugExists = await db.collection('products').findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const id = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const productCount = await db.collection('products').countDocuments();
    const sku = data.sku || `MK-${data.category.toUpperCase().slice(0, 3)}-${String(100 + productCount + 1)}`;
    const stock = typeof data.stock === 'number' ? data.stock : 10;

    const newProduct: DbProduct = {
      id,
      slug,
      sku,
      name: data.name,
      category: data.category,
      categoryLabel: data.categoryLabel || data.category.charAt(0).toUpperCase() + data.category.slice(1),
      price: data.price,
      compareAtPrice: data.compareAtPrice || Math.round(data.price * 1.3),
      discountPercent: data.compareAtPrice
        ? Math.round(((data.compareAtPrice - data.price) / data.compareAtPrice) * 100)
        : 23,
      costPrice: data.costPrice || Math.round(data.price * 0.55),
      stock,
      reservedStock: 0,
      lowStockThreshold: data.lowStockThreshold || 5,
      rating: 5.0,
      reviewsCount: 0,
      weight: data.weight || '8.5g',
      purity: data.purity || '925 Sterling Silver',
      badge: data.badge || (data.isNewArrival ? 'NEW ARRIVAL' : undefined),
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['/images/collection-necklaces.jpg'],
      secondaryImage: data.secondaryImage || (data.images?.[1] || undefined),
      description: data.description || '',
      shortDescription: data.shortDescription || '',
      details: {
        material: data.material || 'Solid 925 Sterling Silver',
        plating: data.plating || 'Anti-Tarnish Rhodium Finish',
        dimensions: data.dimensions || '40mm x 18mm',
        gemstone: data.gemstone || 'Cubic Zirconia',
        claspType: data.claspType || 'Comfort Push Back',
        hallmark: 'BIS 925 Hallmarked',
      },
      occasion: data.occasion || ['everyday', 'festive'],
      style: data.style || ['classic'],
      inStock: stock > 0,
      status: data.status || (stock > 0 ? 'active' : 'out_of_stock'),
      featured: !!data.featured,
      isBestSeller: !!data.isBestSeller,
      isNewArrival: data.isNewArrival !== undefined ? !!data.isNewArrival : true,
      collectionIds: data.collectionIds || [],
      attributes: data.attributes || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save directly to MongoDB products collection
    await db.collection('products').insertOne(newProduct as any);

    // Create corresponding inventory record in MongoDB inventory collection
    const inventoryRecord: DbInventoryRecord = {
      id: `inv-${newProduct.id}`,
      sku: newProduct.sku,
      productId: newProduct.id,
      productName: newProduct.name,
      productImage: newProduct.images[0],
      currentStock: stock,
      reservedStock: 0,
      availableStock: stock,
      lowStockThreshold: newProduct.lowStockThreshold || 5,
      status: stock === 0 ? 'out_of_stock' : stock <= 5 ? 'low_stock' : 'in_stock',
      history: [
        {
          id: `hist-${Date.now()}`,
          previous: 0,
          change: stock,
          new: stock,
          reason: 'Initial Product Creation',
          admin: session.name,
          timestamp: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    await db.collection('inventory').insertOne(inventoryRecord as any);

    // Record audit log in MongoDB audit_logs collection
    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName: session.name,
      adminEmail: session.email,
      action: 'PRODUCT_CREATED',
      resource: 'Product',
      resourceId: newProduct.id,
      details: `Created product "${newProduct.name}" (SKU: ${newProduct.sku}) in MongoDB`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

