import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbCategory } from '@/lib/db/types';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET() {
  const db = await connectDB();
  const [categories, products] = await Promise.all([
    db.collection('categories').find({}).sort({ sortOrder: 1 }).toArray(),
    db.collection('products').find({ status: 'active' }, { projection: { category: 1 } }).toArray(),
  ]);

  const categoriesWithCounts = categories.map(cat => {
    const { _id, ...rest } = cat;
    const count = products.filter(p => p.category?.toLowerCase() === cat.slug?.toLowerCase()).length;
    return {
      ...rest,
      id: rest.id || _id?.toString(),
      productCount: count,
    } as DbCategory;
  });

  return NextResponse.json({ categories: categoriesWithCounts });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const db = await connectDB();
    const slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const id = `cat-${slug}`;
    const count = await db.collection('categories').countDocuments();
    const newCategory: DbCategory = {
      id,
      name: data.name,
      slug,
      description: data.description || '',
      image: data.image || '/images/collection-necklaces.jpg',
      parentId: data.parentId || null,
      productCount: 0,
      status: data.status || 'active',
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : count + 1,
      seoTitle: data.seoTitle || `${data.name} | MK Silver Hub`,
      seoDescription: data.seoDescription || `Shop authentic 925 sterling silver ${data.name.toLowerCase()}.`,
    };

    await db.collection('categories').insertOne(newCategory as any);

    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName: session.name,
      adminEmail: session.email,
      action: 'CATEGORY_CREATED',
      resource: 'Category',
      resourceId: id,
      details: `Created category "${newCategory.name}" in MongoDB`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
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
    const db = await connectDB();
    const category = await db.collection('categories').findOne({
      $or: [{ id }, { slug: id }],
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const categoryId = category.id;
    const updated = {
      ...category,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    delete (updated as any)._id;

    await db.collection('categories').updateOne(
      { id: categoryId },
      { $set: updated }
    );

    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName: session.name,
      adminEmail: session.email,
      action: 'CATEGORY_UPDATED',
      resource: 'Category',
      resourceId: categoryId,
      details: `Updated category "${updated.name}" in MongoDB`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
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

  // Safety check: Does this category contain active products?
  const associatedProductsCount = await db.collection('products').countDocuments({
    category: category.slug?.toLowerCase(),
    status: { $ne: 'archived' },
  });

  if (associatedProductsCount > 0) {
    return NextResponse.json(
      {
        error: `This category contains ${associatedProductsCount} product(s). Please reassign or delete these products before deleting this category.`,
      },
      { status: 400 }
    );
  }

  await db.collection('categories').deleteOne({ id: category.id });

  await db.collection('audit_logs').insertOne({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    adminName: session.name,
    adminEmail: session.email,
    action: 'CATEGORY_DELETED',
    resource: 'Category',
    resourceId: category.id,
    details: `Deleted category "${category.name}" from MongoDB`,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, message: 'Category deleted successfully' });
}

