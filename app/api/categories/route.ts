import { NextResponse } from 'next/server';
import { getCategoriesFromDb } from '@/lib/services/products';

export async function GET() {
  try {
    const categories = await getCategoriesFromDb();
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('[Categories API Error]:', error?.message);
    return NextResponse.json({ error: 'Unable to retrieve categories' }, { status: 500 });
  }
}
