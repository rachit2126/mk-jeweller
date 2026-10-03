import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();

    // Query active categories, collections, and products in parallel
    const [allCats, allColls, activeProducts] = await Promise.all([
      db.collection('categories')
        .find({ status: 'active' })
        .sort({ sortOrder: 1, name: 1 })
        .toArray(),
      db.collection('collections')
        .find({ status: 'active' })
        .sort({ sortOrder: 1, name: 1 })
        .toArray(),
      db.collection('products')
        .find(
          { isDeleted: { $ne: true }, status: { $ne: 'archived' } },
          { projection: { id: 1, category: 1, subcategory: 1, subcategoryId: 1, collectionIds: 1 } }
        )
        .toArray(),
    ]);

    // Build real product counts per category and subcategory
    const catCountMap = new Map<string, number>();
    const subCountMap = new Map<string, number>();
    const collCountMap = new Map<string, number>();

    activeProducts.forEach((p: any) => {
      const catKey = (p.category || '').toLowerCase().trim();
      if (catKey) {
        catCountMap.set(catKey, (catCountMap.get(catKey) || 0) + 1);
      }
      const subKey = (p.subcategory || p.subcategoryId || '').toLowerCase().trim();
      if (subKey) {
        subCountMap.set(subKey, (subCountMap.get(subKey) || 0) + 1);
      }
      if (Array.isArray(p.collectionIds)) {
        p.collectionIds.forEach((cId: string) => {
          const k = cId.toLowerCase().trim();
          collCountMap.set(k, (collCountMap.get(k) || 0) + 1);
        });
      }
    });

    // Clean categories
    const normalizedCats = allCats.map((doc: any) => {
      const { _id, ...rest } = doc;
      return {
        ...rest,
        id: rest.id || _id?.toString(),
      };
    });

    // Identify root categories and subcategories
    const rootCategories: any[] = [];
    const childrenByParent = new Map<string, any[]>();

    normalizedCats.forEach((c: any) => {
      // Check if excluded from storefront
      if (c.visibleOnStore === false || c.showInNavbar === false) {
        return;
      }

      const pId = c.parentId ? String(c.parentId).trim() : null;
      if (!pId) {
        rootCategories.push(c);
      } else {
        if (!childrenByParent.has(pId)) {
          childrenByParent.set(pId, []);
        }
        childrenByParent.get(pId)!.push(c);
      }
    });

    // Assemble category tree
    const categoryTree = rootCategories.map((root: any) => {
      // Match children by parent ID or slug
      const children = (
        childrenByParent.get(root.id) ||
        childrenByParent.get(root.slug) ||
        childrenByParent.get(`cat-${root.slug}`) ||
        []
      ).map((child: any) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        image: child.image || null,
        productCount: subCountMap.get(child.slug.toLowerCase()) || subCountMap.get(child.id.toLowerCase()) || 0,
        sortOrder: child.sortOrder ?? 0,
      }));

      // Sort children by sortOrder
      children.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      const directCount = catCountMap.get(root.slug.toLowerCase()) || catCountMap.get(root.id.toLowerCase()) || 0;
      const childrenTotal = children.reduce((sum: number, ch: any) => sum + ch.productCount, 0);

      return {
        id: root.id,
        name: root.name,
        slug: root.slug,
        image: root.image || null,
        megaMenuImage: root.megaMenuImage || root.image || null,
        productCount: directCount || childrenTotal,
        sortOrder: root.sortOrder ?? 0,
        children,
      };
    });

    // Clean collections
    const collections = allColls
      .filter((coll: any) => coll.visibleOnStore !== false)
      .map((coll: any) => {
        const { _id, ...rest } = coll;
        const cId = rest.id || _id?.toString();
        const pCount = collCountMap.get(rest.slug?.toLowerCase()) || collCountMap.get(cId?.toLowerCase()) || (Array.isArray(rest.productIds) ? rest.productIds.length : 0);
        return {
          id: cId,
          name: rest.name,
          slug: rest.slug,
          image: rest.heroImage || rest.thumbnail || null,
          productCount: pCount,
          sortOrder: rest.sortOrder ?? 0,
        };
      });

    return NextResponse.json(
      {
        categories: categoryTree,
        collections,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: any) {
    console.error('[Categories Navigation API Error]:', error?.message);
    return NextResponse.json(
      { error: 'Unable to load navigation categories from database' },
      { status: 500 }
    );
  }
}
