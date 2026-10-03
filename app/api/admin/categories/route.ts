import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbCategory } from '@/lib/db/types';
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
 * Check if targetParentId is a descendant of categoryId to prevent circular hierarchy
 */
async function isDescendant(db: any, categoryId: string, targetParentId: string): Promise<boolean> {
  let currentParentId = targetParentId;
  const visited = new Set<string>();

  while (currentParentId) {
    if (visited.has(currentParentId)) break;
    visited.add(currentParentId);

    if (currentParentId === categoryId) return true;

    const parent = await db.collection('categories').findOne({
      $or: [{ id: currentParentId }, { slug: currentParentId }],
    });
    if (!parent || !parent.parentId) break;
    currentParentId = parent.parentId;
  }

  return false;
}

let indexesEnsured = false;
async function ensureCategoryIndexes(db: any) {
  if (indexesEnsured) return;
  try {
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true, background: true });
    await db.collection('categories').createIndex({ name: 1 }, { background: true });
    await db.collection('categories').createIndex({ parentId: 1 }, { background: true });
    await db.collection('categories').createIndex({ status: 1 }, { background: true });
    await db.collection('categories').createIndex({ sortOrder: 1 }, { background: true });
    indexesEnsured = true;
  } catch {
    indexesEnsured = true;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const statusFilter = searchParams.get('status') || 'all';
    const parentFilter = searchParams.get('parentId') || 'all';
    const productsFilter = searchParams.get('productsFilter') || 'all';
    const sort = searchParams.get('sort') || 'order_asc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limitParam = searchParams.get('limit');
    const isAll = limitParam === 'all' || limitParam === '0';
    const limit = isAll ? 1000 : Math.max(1, Math.min(100, parseInt(limitParam || '15', 10)));

    const db = await connectDB();

    // Query categories and active non-deleted products in parallel
    const [allCategories, activeProducts] = await Promise.all([
      db.collection('categories').find({}).sort({ sortOrder: 1, name: 1 }).toArray(),
      db.collection('products').find(
        { isDeleted: { $ne: true }, status: { $ne: 'archived' } },
        { projection: { id: 1, name: 1, slug: 1, sku: 1, price: 1, images: 1, category: 1, categoryLabel: 1, stock: 1, status: 1 } }
      ).toArray(),
    ]);

    // Build product count map & product associations map
    const productCountMap = new Map<string, number>();
    const categoryProductsMap = new Map<string, any[]>();

    activeProducts.forEach((p: any) => {
      const catKey = (p.category || '').toLowerCase().trim();
      if (catKey) {
        productCountMap.set(catKey, (productCountMap.get(catKey) || 0) + 1);
        if (!categoryProductsMap.has(catKey)) categoryProductsMap.set(catKey, []);
        categoryProductsMap.get(catKey)!.push({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          price: p.price,
          stock: p.stock,
          status: p.status,
          image: Array.isArray(p.images) ? p.images[0] : p.images,
        });
      }
    });

    // Format categories with dynamic product counts and resolved parent info
    const catMap = new Map<string, any>();
    allCategories.forEach(c => catMap.set(c.id, c));
    allCategories.forEach(c => catMap.set(c.slug, c));

    let enriched = allCategories.map((c: any) => {
      const { _id, ...rest } = c;
      const count = productCountMap.get(c.slug?.toLowerCase()) || productCountMap.get(c.id?.toLowerCase()) || 0;
      const parent = c.parentId ? catMap.get(c.parentId) : null;

      return {
        ...rest,
        id: rest.id || _id?.toString(),
        productCount: count,
        parentName: parent ? parent.name : null,
        products: categoryProductsMap.get(c.slug?.toLowerCase()) || [],
        image: rest.image || '/images/collection-necklaces.jpg',
        status: rest.status || 'active',
        sortOrder: rest.sortOrder ?? 1,
        parentId: rest.parentId || null,
        showInNavbar: rest.showInNavbar !== false,
        visibleOnStore: rest.visibleOnStore !== false,
        megaMenuImage: rest.megaMenuImage || rest.image || null,
        seoTitle: rest.seoTitle || `${rest.name} | Fine 925 Sterling Jewellery | MK Silver Hub`,
        seoDescription: rest.seoDescription || `Discover handcrafted 925 sterling silver ${rest.name.toLowerCase()} at MK Silver Hub.`,
        seoKeywords: rest.seoKeywords || `925 silver ${rest.name.toLowerCase()}, sterling silver`,
      } as DbCategory & { parentName?: string | null; products?: any[] };
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

    // 3. Parent Filter
    if (parentFilter === 'root') {
      enriched = enriched.filter((c) => !c.parentId);
    } else if (parentFilter !== 'all') {
      enriched = enriched.filter((c) => c.parentId === parentFilter);
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

    // List of parents available for hierarchy dropdowns
    const allParents = allCategories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentId: c.parentId || null,
    }));

    return NextResponse.json({
      success: true,
      categories: paginated,
      total,
      page: isAll ? 1 : page,
      limit: isAll ? total : limit,
      totalPages: isAll ? 1 : Math.ceil(total / limit) || 1,
      allParents,
    });
  } catch (error: any) {
    console.error('Error fetching admin categories:', error);
    return NextResponse.json({ error: 'Failed to retrieve categories from database' }, { status: 500 });
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
      return NextResponse.json({ error: 'Category name must be at least 2 characters' }, { status: 400 });
    }

    const db = await connectDB();
    await ensureCategoryIndexes(db);
    const slug = slugify(data.slug || rawName);

    if (!slug) {
      return NextResponse.json({ error: 'Valid category slug is required' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.collection('categories').findOne({
      $or: [{ slug }, { id: `cat-${slug}` }],
    });

    if (existing) {
      return NextResponse.json(
        { error: `A category with slug "${slug}" already exists. Please choose a unique name or slug.` },
        { status: 409 }
      );
    }

    // Check name uniqueness (case-insensitive)
    const escapedName = rawName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingName = await db.collection('categories').findOne({
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') },
    });
    if (existingName) {
      return NextResponse.json(
        { error: 'A category with this name already exists.' },
        { status: 409 }
      );
    }

    // Validate parent category if specified
    const parentId = data.parentId ? String(data.parentId).trim() : null;
    if (parentId) {
      const parent = await db.collection('categories').findOne({
        $or: [{ id: parentId }, { slug: parentId }],
      });
      if (!parent) {
        return NextResponse.json({ error: 'Selected parent category does not exist' }, { status: 400 });
      }
    }

    const currentCount = await db.collection('categories').countDocuments();
    const sortOrder = typeof data.sortOrder === 'number' && !isNaN(data.sortOrder)
      ? data.sortOrder
      : currentCount + 1;

    const id = `cat-${slug}`;
    const now = new Date().toISOString();

    const newCategory: DbCategory = {
      id,
      name: rawName,
      slug,
      description: (data.description || '').trim(),
      image: (data.image || '').trim() || '/images/collection-necklaces.jpg',
      parentId,
      productCount: 0,
      status: data.status === 'inactive' ? 'inactive' : 'active',
      sortOrder,
      showInNavbar: data.showInNavbar !== false,
      visibleOnStore: data.visibleOnStore !== false,
      megaMenuImage: (data.megaMenuImage || data.image || '').trim(),
      seoTitle: (data.seoTitle || '').trim() || `${rawName} | Fine 925 Sterling Jewellery | MK Silver Hub`,
      seoDescription: (data.seoDescription || '').trim() || `Explore fine 925 sterling silver ${rawName.toLowerCase()} crafted with hallmark purity.`,
      seoKeywords: (data.seoKeywords || '').trim() || `925 silver ${rawName.toLowerCase()}, luxury jewellery`,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('categories').insertOne(newCategory as any);

    await logAuditMongo(
      session.name,
      session.email,
      'CATEGORY_CREATED',
      'Category',
      id,
      `Created category "${rawName}" (Slug: ${slug}, Status: ${newCategory.status})`
    );

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const db = await connectDB();
    await ensureCategoryIndexes(db);
    const category = await db.collection('categories').findOne({
      $or: [{ id }, { slug: id }],
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const categoryId = category.id;
    const setUpdates: any = { updatedAt: new Date().toISOString() };

    // Validate name if provided
    if (updates.name !== undefined) {
      const trimmedName = String(updates.name).trim();
      if (!trimmedName || trimmedName.length < 2) {
        return NextResponse.json({ error: 'Category name must be at least 2 characters' }, { status: 400 });
      }

      // Check name uniqueness across other categories
      const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const nameCollision = await db.collection('categories').findOne({
        name: { $regex: new RegExp(`^${escapedName}$`, 'i') },
        id: { $ne: categoryId },
      });

      if (nameCollision) {
        return NextResponse.json(
          { error: 'A category with this name already exists.' },
          { status: 409 }
        );
      }

      setUpdates.name = trimmedName;
    }

    // Validate slug if changed
    if (updates.slug !== undefined) {
      const newSlug = slugify(updates.slug);
      if (!newSlug) {
        return NextResponse.json({ error: 'Slug cannot be empty' }, { status: 400 });
      }

      if (newSlug !== category.slug) {
        const slugCollision = await db.collection('categories').findOne({
          slug: newSlug,
          id: { $ne: categoryId },
        });

        if (slugCollision) {
          return NextResponse.json(
            { error: `Slug "${newSlug}" is already in use by another category.` },
            { status: 409 }
          );
        }
        setUpdates.slug = newSlug;
      }
    }

    // Validate parentId & circular hierarchy prevention
    if (updates.parentId !== undefined) {
      const parentId = updates.parentId ? String(updates.parentId).trim() : null;

      if (parentId) {
        if (parentId === categoryId || parentId === category.slug) {
          return NextResponse.json({ error: 'A category cannot be its own parent' }, { status: 400 });
        }

        const isCycle = await isDescendant(db, categoryId, parentId);
        if (isCycle) {
          return NextResponse.json(
            { error: 'Invalid parent: Cannot set a descendant subcategory as parent (circular hierarchy)' },
            { status: 400 }
          );
        }
      }
      setUpdates.parentId = parentId;
    }

    if (updates.description !== undefined) setUpdates.description = String(updates.description).trim();
    if (updates.image !== undefined) setUpdates.image = String(updates.image).trim();
    if (updates.status !== undefined) setUpdates.status = updates.status === 'inactive' ? 'inactive' : 'active';
    if (updates.sortOrder !== undefined && !isNaN(Number(updates.sortOrder))) {
      setUpdates.sortOrder = Number(updates.sortOrder);
    }
    if (updates.showInNavbar !== undefined) setUpdates.showInNavbar = Boolean(updates.showInNavbar);
    if (updates.visibleOnStore !== undefined) setUpdates.visibleOnStore = Boolean(updates.visibleOnStore);
    if (updates.megaMenuImage !== undefined) setUpdates.megaMenuImage = String(updates.megaMenuImage).trim();
    if (updates.seoTitle !== undefined) setUpdates.seoTitle = String(updates.seoTitle).trim();
    if (updates.seoDescription !== undefined) setUpdates.seoDescription = String(updates.seoDescription).trim();
    if (updates.seoKeywords !== undefined) setUpdates.seoKeywords = String(updates.seoKeywords).trim();

    await db.collection('categories').updateOne({ id: categoryId }, { $set: setUpdates });

    const isImageOnly = updates.image && updates.image !== category.image && Object.keys(updates).length <= 2;
    const isStatusOnly = updates.status && updates.status !== category.status && Object.keys(updates).length <= 2;
    const action = isImageOnly
      ? 'CATEGORY_IMAGE_UPDATED'
      : isStatusOnly
      ? 'CATEGORY_STATUS_CHANGED'
      : 'CATEGORY_UPDATED';

    await logAuditMongo(
      session.name,
      session.email,
      action as any,
      'Category',
      categoryId,
      `Updated category "${setUpdates.name || category.name}" (${action})`
    );

    const updatedDoc: any = await db.collection('categories').findOne({ id: categoryId });
    const clean = updatedDoc ? { ...updatedDoc, _id: undefined } : null;

    return NextResponse.json({ success: true, category: clean });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const targetReassignCategory = searchParams.get('reassignTo'); // Optional product migration

  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  const db = await connectDB();
  const category = await db.collection('categories').findOne({
    $or: [{ id }, { slug: id }],
  });

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const categoryId = category.id;
  const categorySlug = category.slug?.toLowerCase();

  // 1. Dependency check: Child subcategories
  const childCategories = await db.collection('categories').find({
    $or: [{ parentId: categoryId }, { parentId: categorySlug }],
  }).toArray();

  if (childCategories.length > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete "${category.name}": it has ${childCategories.length} subcategory(s) attached (${childCategories.map(c => c.name).join(', ')}). Please reassign or delete the subcategories first.`,
        childCount: childCategories.length,
      },
      { status: 400 }
    );
  }

  // 2. Dependency check: Active products
  const productFilter = {
    $or: [{ category: categorySlug }, { category: categoryId }],
    status: { $ne: 'archived' },
    isDeleted: { $ne: true },
  };

  const associatedProductsCount = await db.collection('products').countDocuments(productFilter);

  if (associatedProductsCount > 0) {
    // If admin requested migration to another category
    if (targetReassignCategory) {
      const target = await db.collection('categories').findOne({
        $or: [{ id: targetReassignCategory }, { slug: targetReassignCategory }],
      });

      if (!target) {
        return NextResponse.json({ error: 'Target reassign category does not exist' }, { status: 400 });
      }

      await db.collection('products').updateMany(productFilter, {
        $set: {
          category: target.slug.toLowerCase(),
          categoryLabel: target.name,
          updatedAt: new Date().toISOString(),
        },
      });

      await logAuditMongo(
        session.name,
        session.email,
        'PRODUCT_UPDATED' as any,
        'Category',
        target.id,
        `Reassigned ${associatedProductsCount} products from "${category.name}" to "${target.name}" prior to category deletion`
      );
    } else {
      return NextResponse.json(
        {
          error: `Cannot delete "${category.name}": This category contains ${associatedProductsCount} active product(s). Please move these products to another category or archive this category instead.`,
          productCount: associatedProductsCount,
          canReassign: true,
        },
        { status: 400 }
      );
    }
  }

  // Safe to delete
  await db.collection('categories').deleteOne({ id: categoryId });

  await logAuditMongo(
    session.name,
    session.email,
    'CATEGORY_DELETED',
    'Category',
    categoryId,
    `Permanently deleted category "${category.name}" (Slug: ${category.slug}) from MongoDB`
  );

  return NextResponse.json({
    success: true,
    message: `Category "${category.name}" deleted successfully`,
  });
}
