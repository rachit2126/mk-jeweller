import { NextResponse } from 'next/server';
import { getCollectionsFromDb } from '@/lib/services/products';

export async function GET() {
  try {
    const collections = await getCollectionsFromDb();
    return NextResponse.json({ collections });
  } catch (error: any) {
    console.error('[Collections API Error]:', error?.message);
    return NextResponse.json({ error: 'Unable to retrieve collections' }, { status: 500 });
  }
}
