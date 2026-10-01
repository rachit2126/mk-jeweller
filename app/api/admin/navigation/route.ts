import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { DbNavigationItem } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET() {
  const db = await connectDB();
  const docs = await db.collection('navigation').find({}).sort({ sortOrder: 1 }).toArray();
  const navigation = docs.map(n => {
    const { _id, ...rest } = n;
    return { ...rest, id: rest.id || _id?.toString() } as DbNavigationItem;
  });
  return NextResponse.json({ navigation });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.label || !data.url) {
      return NextResponse.json({ error: 'Label and URL are required' }, { status: 400 });
    }

    const db = await connectDB();
    const count = await db.collection('navigation').countDocuments();

    const newItem: DbNavigationItem = {
      id: `nav-${Date.now()}`,
      label: data.label,
      url: data.url,
      type: data.type || 'link',
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : count + 1,
      badge: data.badge,
      highlight: !!data.highlight,
      status: data.status || 'active',
      menuColumns: data.menuColumns || [],
    };

    await db.collection('navigation').insertOne(newItem as any);
    await logAuditMongo(session.name, session.email, 'NAVIGATION_CREATED', 'Navigation', newItem.id, `Created nav link "${newItem.label}"`);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create navigation item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const db = await connectDB();

    // If whole items array is passed (reordering)
    if (Array.isArray(body.items)) {
      await db.collection('navigation').deleteMany({});
      if (body.items.length > 0) {
        const cleaned = body.items.map((item: any, idx: number) => {
          const { _id, ...rest } = item;
          return {
            ...rest,
            id: rest.id || `nav-${Date.now()}-${idx}`,
            sortOrder: idx + 1,
          };
        });
        await db.collection('navigation').insertMany(cleaned);
      }
      await logAuditMongo(session.name, session.email, 'NAVIGATION_UPDATED', 'Navigation', 'header', 'Reordered storefront navigation structure in MongoDB');
      const docs = await db.collection('navigation').find({}).sort({ sortOrder: 1 }).toArray();
      return NextResponse.json({ success: true, navigation: docs.map(({ _id, ...r }) => r) });
    }

    // Single item update
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });

    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    await db.collection('navigation').updateOne(filter, { $set: updates });
    await logAuditMongo(session.name, session.email, 'NAVIGATION_UPDATED', 'Navigation', id, 'Updated navigation item in MongoDB');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update navigation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const result = await db.collection('navigation').deleteOne(filter);
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await logAuditMongo(session.name, session.email, 'NAVIGATION_DELETED', 'Navigation', id, 'Deleted navigation item from MongoDB');

    return NextResponse.json({ success: true, message: 'Navigation item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete navigation item' }, { status: 500 });
  }
}
