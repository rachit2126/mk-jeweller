import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbCollection } from '@/lib/db/types';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET() {
  const db = await connectDB();
  const [collections, products] = await Promise.all([
    db.collection('collections').find({}).sort({ sortOrder: 1 }).toArray(),
    db.collection('products').find({ status: 'active' }, { projection: { isNewArrival: 1, isBestSeller: 1, collectionIds: 1 } }).toArray(),
  ]);

  const collectionsWithCounts = collections.map(col => {
    const { _id, ...rest } = col;
    let count = col.productIds?.length || 0;
    if (col.type === 'automatic') {
      if (col.slug === 'new-arrivals') {
        count = products.filter(p => p.isNewArrival).length;
      } else if (col.slug === 'best-sellers') {
        count = products.filter(p => p.isBestSeller).length;
      }
    } else {
      count = products.filter(p => p.collectionIds?.includes(col.slug) || p.collectionIds?.includes(col.id)).length || count;
    }
    return {
      ...rest,
      id: rest.id || _id?.toString(),
      productCount: count,
    } as DbCollection;
  });

  return NextResponse.json({ collections: collectionsWithCounts });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.name) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    const db = await connectDB();
    const slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const id = `col-${slug}`;
    const count = await db.collection('collections').countDocuments();
    const newCollection: DbCollection = {
      id,
      name: data.name,
      slug,
      description: data.description || '',
      thumbnail: data.thumbnail || '/images/collection-necklaces.jpg',
      heroImage: data.heroImage || '/images/editorial/bridal-banner-clean-hd.jpg',
      productCount: Array.isArray(data.productIds) ? data.productIds.length : 0,
      type: data.type || 'manual',
      rules: data.rules || [],
      productIds: Array.isArray(data.productIds) ? data.productIds : [],
      status: data.status || 'active',
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : count + 1,
      seoTitle: data.seoTitle || `${data.name} | MK Silver Hub`,
      seoDescription: data.seoDescription || `Discover the ${data.name} suite in 925 sterling silver.`,
    };

    await db.collection('collections').insertOne(newCollection as any);

    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName: session.name,
      adminEmail: session.email,
      action: 'COLLECTION_CREATED',
      resource: 'Collection',
      resourceId: id,
      details: `Created collection "${newCollection.name}" in MongoDB`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, collection: newCollection });
  } catch (error: any) {
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
    const db = await connectDB();
    const collection = await db.collection('collections').findOne({
      $or: [{ id }, { slug: id }],
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const collectionId = collection.id;
    const updated = {
      ...collection,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    delete (updated as any)._id;

    await db.collection('collections').updateOne(
      { id: collectionId },
      { $set: updated }
    );

    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName: session.name,
      adminEmail: session.email,
      action: 'COLLECTION_UPDATED',
      resource: 'Collection',
      resourceId: collectionId,
      details: `Updated collection "${updated.name}" in MongoDB`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, collection: updated });
  } catch (error: any) {
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

  await db.collection('collections').deleteOne({ id: collection.id });

  await db.collection('audit_logs').insertOne({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    adminName: session.name,
    adminEmail: session.email,
    action: 'COLLECTION_DELETED',
    resource: 'Collection',
    resourceId: collection.id,
    details: `Deleted collection "${collection.name}" from MongoDB`,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, message: 'Collection deleted successfully' });
}

