import { NextRequest, NextResponse } from 'next/server';
import { getProductsFromDb } from '@/lib/services/products';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category') || undefined;
    const collection = searchParams.get('collection') || undefined;
    const occasion = searchParams.get('occasion') || undefined;
    const search = searchParams.get('search') || searchParams.get('q') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'newest';
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 12;

    const isBestSeller = searchParams.get('isBestSeller') === 'true' || undefined;
    const isNewArrival = searchParams.get('isNewArrival') === 'true' || undefined;
    const featured = searchParams.get('featured') === 'true' || undefined;
    const badge = searchParams.get('badge') || undefined;
    const style = searchParams.get('style') || undefined;

    const result = await getProductsFromDb({
      category,
      collection,
      occasion,
      search,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      isBestSeller,
      isNewArrival,
      featured,
      badge,
      style,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Public Products API Error]:', error?.message);
    return NextResponse.json(
      { error: 'Unable to retrieve products at this time.' },
      { status: 500 }
    );
  }
}
