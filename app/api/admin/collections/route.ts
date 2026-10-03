import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbCollection, CollectionRule } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Evaluate automatic collection rules against active products
 */
export function evaluateRules(
  rules: CollectionRule[] = [],
  matchType: 'ALL' | 'ANY' = 'ALL',
  products: any[],
  productSalesMap: Map<string, number>,
  sortBy: string = 'newest',
  limit?: number
): any[] {
  let matched = products.filter((p) => {
    if (!rules || rules.length === 0) return true;

    const results = rules.map((r) => {
      const field = r.field;
      const op = r.operator;
      const targetVal = r.value;

      let actualVal: any = p[field];

      if (field === 'category') {
        actualVal = (p.category || '').toLowerCase();
        const testVal = String(targetVal).toLowerCase();
        return op === 'equals' ? actualVal === testVal : actualVal !== testVal;
      }

      if (field === 'status') {
        return op === 'equals' ? p.status === targetVal : p.status !== targetVal;
      }

      if (field === 'price' || field === 'stock') {
        const numActual = Number(actualVal) || 0;
        const numTarget = Number(targetVal) || 0;
        if (op === 'greater_than') return numActual > numTarget;
        if (op === 'less_than') return numActual < numTarget;
        if (op === 'greater_than_or_equal') return numActual >= numTarget;
        if (op === 'less_than_or_equal') return numActual <= numTarget;
        if (op === 'equals') return numActual === numTarget;
        if (op === 'not_equals') return numActual !== numTarget;
        return true;
      }

      if (field === 'isNewArrival' || field === 'isBestSeller' || field === 'featured') {
        const boolActual = Boolean(actualVal);
        const boolTarget = targetVal === true || targetVal === 'true';
        return op === 'equals' ? boolActual === boolTarget : boolActual !== boolTarget;
      }

      return true;
    });

    return matchType === 'ANY' ? results.some(Boolean) : results.every(Boolean);
  });

  // Sort matching products
  matched.sort((a, b) => {
    if (sortBy === 'best_selling') {
      const salesA = productSalesMap.get(a.id) || 0;
      const salesB = productSalesMap.get(b.id) || 0;
      return salesB - salesA;
    }
    if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    // Default newest
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  if (limit && limit > 0) {
    matched = matched.slice(0, limit);
  }

  return matched;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const statusFilter = searchParams.get('status') || 'all';
    const typeFilter = searchParams.get('type') || 'all';
    const productsFilter = searchParams.get('productsFilter') || 'all';
    const sort = searchParams.get('sort') || 'order_asc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limitParam = searchParams.get('limit');
    const isAll = limitParam === 'all' || limitParam === '0';
    const limit = isAll ? 1000 : Math.max(1, Math.min(100, parseInt(limitParam || '15', 10)));

    const db = await connectDB();

    // Query collections, active non-deleted products, and orders in parallel
    const [allCollections, activeProducts, paidOrders] = await Promise.all([
      db.collection('collections').find({}).sort({ sortOrder: 1, name: 1 }).toArray(),
      db.collection('products').find(
        { isDeleted: { $ne: true }, status: { $ne: 'archived' } },
        {
          projection: {
            id: 1,
            name: 1,
            slug: 1,
            sku: 1,
            price: 1,
            images: 1,
            category: 1,
            categoryLabel: 1,
            stock: 1,
            status: 1,
            collectionIds: 1,
            isNewArrival: 1,
            isBestSeller: 1,
            featured: 1,
            createdAt: 1,
          },
        }
      ).toArray(),
      db.collection('orders').find(
        {
          status: { $in: ['delivered', 'shipped', 'processing', 'completed'] },
          paymentStatus: { $ne: 'refunded' },
        },
        { projection: { items: 1 } }
      ).toArray(),
    ]);

    // Build real product sales quantity map from completed/paid orders
    const productSalesMap = new Map<string, number>();
    paidOrders.forEach((order: any) => {
      (order.items || []).forEach((item: any) => {
        const pId = item.productId || item.id;
        const qty = Number(item.quantity) || 1;
        if (pId) {
          productSalesMap.set(pId, (productSalesMap.get(pId) || 0) + qty);
        }
      });
    });

    const productsById = new Map<string, any>();
    activeProducts.forEach((p: any) => productsById.set(p.id, p));

    // Enrich collections with database-derived product membership and exact count
    let enriched = allCollections.map((col: any) => {
      const { _id, ...rest } = col;
      const isAuto = col.type === 'automatic' || col.slug === 'new-arrivals' || col.slug === 'best-sellers';

      let matchedProducts: any[] = [];

      if (isAuto) {
        if (col.slug === 'best-sellers') {
          // Rule: Real sales data if available, or flagged isBestSeller
          matchedProducts = activeProducts.filter(
            (p) => (productSalesMap.get(p.id) || 0) > 0 || p.isBestSeller === true
          );
          matchedProducts.sort((a, b) => (productSalesMap.get(b.id) || 0) - (productSalesMap.get(a.id) || 0));
        } else if (col.slug === 'new-arrivals') {
          matchedProducts = activeProducts.filter((p) => p.isNewArrival === true);
          matchedProducts.sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
        } else {
          matchedProducts = evaluateRules(
            col.rules || [],
            col.ruleMatch || 'ALL',
            activeProducts,
            productSalesMap,
            col.sortBy || 'newest',
            col.limit
          );
        }

        if (col.limit && col.limit > 0) {
          matchedProducts = matchedProducts.slice(0, col.limit);
        }
      } else {
        // Manual collection: Products strictly from productIds array or product.collectionIds
        const idList: string[] = Array.isArray(col.productIds) ? col.productIds : [];
        const seen = new Set<string>();

        // 1. From ordered productIds
        idList.forEach((pid) => {
          const prod = productsById.get(pid);
          if (prod && !seen.has(prod.id)) {
            matchedProducts.push(prod);
            seen.add(prod.id);
          }
        });

        // 2. From product.collectionIds matching this collection
        activeProducts.forEach((p) => {
          if (
            Array.isArray(p.collectionIds) &&
            (p.collectionIds.includes(col.slug) || p.collectionIds.includes(col.id))
          ) {
            if (!seen.has(p.id)) {
              matchedProducts.push(p);
              seen.add(p.id);
            }
          }
        });
      }

      const formattedProducts = matchedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        price: p.price,
        stock: p.stock,
        status: p.status,
        image: Array.isArray(p.images) ? p.images[0] : p.images,
        salesCount: productSalesMap.get(p.id) || 0,
      }));

      return {
        ...rest,
        id: rest.id || _id?.toString(),
        type: isAuto ? 'automatic' : 'manual',
        productCount: formattedProducts.length,
        products: formattedProducts,
        status: rest.status || 'active',
        sortOrder: rest.sortOrder ?? 1,
        thumbnail: rest.thumbnail || '/images/collection-necklaces.jpg',
        heroImage: rest.heroImage || '/images/editorial/bridal-banner-clean-hd.jpg',
        rules: rest.rules || [],
        ruleMatch: rest.ruleMatch || 'ALL',
        limit: rest.limit || 12,
        sortBy: rest.sortBy || 'newest',
        productIds: isAuto ? [] : formattedProducts.map((p) => p.id),
        seoTitle: rest.seoTitle || `${rest.name} | Fine 925 Sterling Jewellery | MK Silver Hub`,
        seoDescription: rest.seoDescription || `Discover the exclusive ${rest.name} collection in 925 sterling silver.`,
        seoKeywords: rest.seoKeywords || `925 silver ${rest.name.toLowerCase()}, sterling silver jewellery`,
      } as DbCollection & { products?: any[] };
    });

    // 1. Search Filter
    if (search) {
      enriched = enriched.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.slug.toLowerCase().includes(search) ||
          (c.description && c.description.toLowerCase().includes(search))
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'all') {
      enriched = enriched.filter((c) => c.status === statusFilter);
    }

    // 3. Type Filter
    if (typeFilter !== 'all') {
      enriched = enriched.filter((c) => c.type === typeFilter);
    }

    // 4. Products Filter
    if (productsFilter === 'with_products') {
      enriched = enriched.filter((c) => c.productCount > 0);
    } else if (productsFilter === 'empty') {
      enriched = enriched.filter((c) => c.productCount === 0);
    }

    // 5. Sorting
    enriched.sort((a, b) => {
      switch (sort) {
        case 'order_asc':
          return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
        case 'order_desc':
          return (b.sortOrder ?? 0) - (a.sortOrder ?? 0);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'products_desc':
          return b.productCount - a.productCount;
        case 'products_asc':
          return a.productCount - b.productCount;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        default:
          return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      }
    });

    const total = enriched.length;
    const skip = (page - 1) * limit;
    const paginated = isAll ? enriched : enriched.slice(skip, skip + limit);

    // Provide active product list for the product selector in manual collections
    const availableProducts = activeProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      stock: p.stock,
      category: p.category,
      categoryLabel: p.categoryLabel || p.category,
      status: p.status,
      image: Array.isArray(p.images) ? p.images[0] : p.images,
    }));

    return NextResponse.json({
      success: true,
      collections: paginated,
      total,
      page: isAll ? 1 : page,
      limit: isAll ? total : limit,
      totalPages: isAll ? 1 : Math.ceil(total / limit) || 1,
      availableProducts,
    });
  } catch (error: any) {
    console.error('Error fetching admin collections:', error);
    return NextResponse.json({ error: 'Failed to retrieve collections from database' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const rawName = (data.name || '').trim();

    if (!rawName || rawName.length < 2) {
      return NextResponse.json({ error: 'Collection name must be at least 2 characters' }, { status: 400 });
    }

    const db = await connectDB();
    const slug = slugify(data.slug || rawName);

    if (!slug) {
      return NextResponse.json({ error: 'Valid collection slug is required' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.collection('collections').findOne({
      $or: [{ slug }, { id: `col-${slug}` }],
    });

    if (existing) {
      return NextResponse.json(
        { error: `A collection with slug "${slug}" already exists. Please choose a unique name or slug.` },
        { status: 409 }
      );
    }

    const currentCount = await db.collection('collections').countDocuments();
    const sortOrder = typeof data.sortOrder === 'number' && !isNaN(data.sortOrder)
      ? data.sortOrder
      : currentCount + 1;

    const id = `col-${slug}`;
    const now = new Date().toISOString();
    const type = data.type === 'automatic' ? 'automatic' : 'manual';
    const productIds = type === 'manual' && Array.isArray(data.productIds) ? data.productIds : [];

    const newCollection: DbCollection = {
      id,
      name: rawName,
      slug,
      description: (data.description || '').trim(),
      thumbnail: (data.thumbnail || '').trim() || '/images/collection-necklaces.jpg',
      heroImage: (data.heroImage || '').trim() || '/images/editorial/bridal-banner-clean-hd.jpg',
      productCount: productIds.length,
      type,
      ruleMatch: data.ruleMatch === 'ANY' ? 'ANY' : 'ALL',
      rules: type === 'automatic' && Array.isArray(data.rules) ? data.rules : [],
      limit: Number(data.limit) || 12,
      sortBy: data.sortBy || 'newest',
      productIds,
      status: data.status === 'inactive' ? 'inactive' : 'active',
      sortOrder,
      seoTitle: (data.seoTitle || '').trim() || `${rawName} | Fine 925 Sterling Jewellery | MK Silver Hub`,
      seoDescription: (data.seoDescription || '').trim() || `Explore the exclusive ${rawName} suite in certified 925 sterling silver.`,
      seoKeywords: (data.seoKeywords || '').trim() || `925 silver ${rawName.toLowerCase()}, luxury jewellery`,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('collections').insertOne(newCollection as any);

    // If manual collection and products assigned, sync product collectionIds
    if (type === 'manual' && productIds.length > 0) {
      await db.collection('products').updateMany(
        { id: { $in: productIds } },
        { $addToSet: { collectionIds: slug } as any }
      );
    }

    await logAuditMongo(
      session.name,
      session.email,
      'COLLECTION_CREATED' as any,
      'Collection',
      id,
      `Created collection "${rawName}" (Type: ${type}, Slug: ${slug})`
    );

    return NextResponse.json({ success: true, collection: newCollection });
  } catch (error: any) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: error.message || 'Failed to create collection' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
    }

    const db = await connectDB();
    const collection = await db.collection('collections').findOne({
      $or: [{ id }, { slug: id }],
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const collectionId = collection.id;
    const setUpdates: any = { updatedAt: new Date().toISOString() };

    // Validate name if provided
    if (updates.name !== undefined) {
      const trimmedName = String(updates.name).trim();
      if (!trimmedName || trimmedName.length < 2) {
        return NextResponse.json({ error: 'Collection name must be at least 2 characters' }, { status: 400 });
      }
      setUpdates.name = trimmedName;
    }

    // Validate slug if changed
    if (updates.slug !== undefined) {
      const newSlug = slugify(updates.slug);
      if (!newSlug) {
        return NextResponse.json({ error: 'Slug cannot be empty' }, { status: 400 });
      }

      if (newSlug !== collection.slug) {
        const slugCollision = await db.collection('collections').findOne({
          slug: newSlug,
          id: { $ne: collectionId },
        });

        if (slugCollision) {
          return NextResponse.json(
            { error: `Slug "${newSlug}" is already in use by another collection.` },
            { status: 409 }
          );
        }
        setUpdates.slug = newSlug;
      }
    }

    if (updates.description !== undefined) setUpdates.description = String(updates.description).trim();
    if (updates.thumbnail !== undefined) setUpdates.thumbnail = String(updates.thumbnail).trim();
    if (updates.heroImage !== undefined) setUpdates.heroImage = String(updates.heroImage).trim();
    if (updates.type !== undefined) setUpdates.type = updates.type === 'automatic' ? 'automatic' : 'manual';
    if (updates.status !== undefined) setUpdates.status = updates.status === 'inactive' ? 'inactive' : 'active';
    if (updates.ruleMatch !== undefined) setUpdates.ruleMatch = updates.ruleMatch === 'ANY' ? 'ANY' : 'ALL';
    if (updates.rules !== undefined) setUpdates.rules = Array.isArray(updates.rules) ? updates.rules : [];
    if (updates.limit !== undefined) setUpdates.limit = Number(updates.limit) || 12;
    if (updates.sortBy !== undefined) setUpdates.sortBy = updates.sortBy;
    if (updates.sortOrder !== undefined && !isNaN(Number(updates.sortOrder))) {
      setUpdates.sortOrder = Number(updates.sortOrder);
    }
    if (updates.seoTitle !== undefined) setUpdates.seoTitle = String(updates.seoTitle).trim();
    if (updates.seoDescription !== undefined) setUpdates.seoDescription = String(updates.seoDescription).trim();
    if (updates.seoKeywords !== undefined) setUpdates.seoKeywords = String(updates.seoKeywords).trim();

    // If manual collection products updated
    if (updates.productIds !== undefined && Array.isArray(updates.productIds)) {
      setUpdates.productIds = updates.productIds;

      // Sync product collectionIds in MongoDB
      const oldProductIds: string[] = collection.productIds || [];
      const newProductIds: string[] = updates.productIds;
      const targetSlug = setUpdates.slug || collection.slug;

      // Remove collection from products no longer in this collection
      const removedIds = oldProductIds.filter((pid) => !newProductIds.includes(pid));
      if (removedIds.length > 0) {
        await db.collection('products').updateMany(
          { id: { $in: removedIds } },
          { $pull: { collectionIds: targetSlug } as any }
        );
      }

      // Add collection to newly added products
      const addedIds = newProductIds.filter((pid) => !oldProductIds.includes(pid));
      if (addedIds.length > 0) {
        await db.collection('products').updateMany(
          { id: { $in: addedIds } },
          { $addToSet: { collectionIds: targetSlug } as any }
        );
      }
    }

    await db.collection('collections').updateOne({ id: collectionId }, { $set: setUpdates });

    const action = updates.status && Object.keys(updates).length <= 2
      ? 'COLLECTION_STATUS_CHANGED'
      : updates.productIds
      ? 'COLLECTION_PRODUCTS_UPDATED'
      : 'COLLECTION_UPDATED';

    await logAuditMongo(
      session.name,
      session.email,
      action as any,
      'Collection',
      collectionId,
      `Updated collection "${setUpdates.name || collection.name}"`
    );

    const updatedDoc: any = await db.collection('collections').findOne({ id: collectionId });
    const clean = updatedDoc ? { ...updatedDoc, _id: undefined } : null;

    return NextResponse.json({ success: true, collection: clean });
  } catch (error: any) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: error.message || 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
  }

  const db = await connectDB();
  const collection = await db.collection('collections').findOne({
    $or: [{ id }, { slug: id }],
  });

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const collectionId = collection.id;
  const collectionSlug = collection.slug;

  // Dependency Check: Active products associated
  const associatedCount = await db.collection('products').countDocuments({
    $or: [
      { id: { $in: collection.productIds || [] } },
      { collectionIds: collectionSlug },
      { collectionIds: collectionId },
    ],
    status: { $ne: 'archived' },
    isDeleted: { $ne: true },
  });

  if (associatedCount > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete "${collection.name}": It has ${associatedCount} active product(s) assigned. Please remove products from this collection or archive it instead.`,
        productCount: associatedCount,
      },
      { status: 400 }
    );
  }

  // Safe to delete
  await db.collection('collections').deleteOne({ id: collectionId });

  // Clean up any references in products
  await db.collection('products').updateMany(
    { collectionIds: collectionSlug },
    { $pull: { collectionIds: collectionSlug } as any }
  );

  await logAuditMongo(
    session.name,
    session.email,
    'COLLECTION_DELETED' as any,
    'Collection',
    collectionId,
    `Permanently deleted collection "${collection.name}" (Slug: ${collectionSlug}) from MongoDB`
  );

  return NextResponse.json({
    success: true,
    message: `Collection "${collection.name}" deleted successfully`,
  });
}
