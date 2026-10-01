import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { DbMediaItem } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get('folder');
  const type = searchParams.get('type');
  const search = searchParams.get('search')?.toLowerCase();

  const db = await connectDB();
  const query: any = {};

  if (folder && folder !== 'all') {
    query.folder = folder;
  }

  if (type && type !== 'all') {
    query.type = type;
  }

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { filename: regex },
      { originalName: regex },
      { tags: regex },
    ];
  }

  const docs = await db.collection('media').find(query).sort({ createdAt: -1 }).toArray();
  const media = docs.map(m => {
    const { _id, ...rest } = m;
    return { ...rest, id: rest.id || _id?.toString() } as DbMediaItem;
  });

  return NextResponse.json({ media });
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const db = await connectDB();
  const isObjectId = ObjectId.isValid(id) && id.length === 24;
  const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

  const item = await db.collection('media').findOne(filter);
  if (!item) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 });
  }

  if (item.usedBy && item.usedBy.length > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete: File is actively referenced by: ${item.usedBy.join(', ')}`,
      },
      { status: 400 }
    );
  }

  const result = await db.collection('media').deleteOne(filter);
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 });
  }

  await logAuditMongo(
    session.name,
    session.email,
    'MEDIA_DELETED',
    'Media',
    id,
    `Deleted media file "${item.filename}" from MongoDB`
  );

  return NextResponse.json({ success: true, message: 'Media file deleted successfully' });
}
