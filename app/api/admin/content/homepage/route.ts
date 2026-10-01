import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbHomepageSection } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET() {
  const db = await connectDB();
  const docs = await db.collection('homepage').find({}).sort({ sortOrder: 1 }).toArray();
  const sections = docs.map(s => {
    const { _id, ...rest } = s;
    return { ...rest, id: rest.id || _id?.toString() } as DbHomepageSection;
  });
  return NextResponse.json({ sections });
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sections } = await req.json();
    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Sections array required' }, { status: 400 });
    }

    const db = await connectDB();
    await db.collection('homepage').deleteMany({});
    if (sections.length > 0) {
      const cleaned = sections.map((sec: any, idx: number) => {
        const { _id, ...rest } = sec;
        return {
          ...rest,
          id: rest.id || `sec-${idx + 1}`,
          sortOrder: idx + 1,
        };
      });
      await db.collection('homepage').insertMany(cleaned);
    }

    await logAuditMongo(
      session.name,
      session.email,
      'HOMEPAGE_CMS_UPDATED',
      'Content',
      'homepage',
      'Reordered and updated homepage layout sections in MongoDB'
    );

    const docs = await db.collection('homepage').find({}).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ success: true, sections: docs.map(({ _id, ...r }) => r) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update homepage CMS' }, { status: 500 });
  }
}
