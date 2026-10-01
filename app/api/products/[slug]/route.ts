import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlugFromDb, getRelatedProductsFromDb } from '@/lib/services/products';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Product slug is required' }, { status: 400 });
    }

    const product = await getProductBySlugFromDb(slug);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const relatedProducts = await getRelatedProductsFromDb(product.category, product.id, 4);

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error: any) {
    console.error('[Public Product Detail API Error]:', error?.message);
    return NextResponse.json(
      { error: 'Unable to retrieve product details.' },
      { status: 500 }
    );
  }
}
