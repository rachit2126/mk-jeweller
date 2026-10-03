import { connectDB } from '@/lib/db/mongodb';
import { DbProduct, DbCategory, DbCollection } from '@/lib/db/types';

export interface ProductQueryOptions {
  category?: string;
  subcategory?: string;
  collection?: string;
  occasion?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  featured?: boolean;
  status?: string;
  badge?: string;
  style?: string;
}


export interface PaginatedProductsResult {
  products: DbProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  priceRange: { min: number; max: number };
}

/**
 * Clean Mongo document by removing or converting _id to string id
 */
function normalizeProduct(doc: any): DbProduct {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: rest.id || _id?.toString(),
  };
}

/**
 * Direct MongoDB query for products with full filtering, sorting, and pagination.
 */
export async function getProductsFromDb(options: ProductQueryOptions = {}): Promise<PaginatedProductsResult> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(100, options.limit || 12));

  try {
    const db = await connectDB();
    const collection = db.collection('products');

    const query: any = {};

    // Status guard: default to 'active' for storefront unless explicitly queried by admin
    if (options.status && options.status !== 'all') {
      query.status = options.status;
    } else if (!options.status) {
      query.status = 'active';
    }
    query.isDeleted = { $ne: true };

    // Category filter
    if (options.category && options.category !== 'all') {
      query.category = options.category.toLowerCase().trim();
    }

    // Subcategory filter
    if (options.subcategory && options.subcategory !== 'all') {
      const sub = options.subcategory.toLowerCase().trim();
      const subRegex = new RegExp(sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { subcategory: sub },
        { subcategoryId: sub },
        { subcategoryId: `cat-${sub}` },
        { 'attributes.subcategory': sub },
        { tags: sub },
        { name: subRegex },
      ];
    }

    // Occasion filter
    if (options.occasion && options.occasion !== 'all') {
      query.occasion = options.occasion.toLowerCase().trim();
    }

    // Flags
    if (options.isBestSeller) {
      query.isBestSeller = true;
    }
    if (options.isNewArrival) {
      query.isNewArrival = true;
    }
    if (options.featured) {
      query.featured = true;
    }
    if (options.badge) {
      query.badge = options.badge;
    }
    if (options.style && options.style !== 'all') {
      query.style = options.style.toLowerCase().trim();
    }

    // Collection filter mapping
    if (options.collection && options.collection !== 'all') {
      const collSlug = options.collection.toLowerCase().trim();
      if (collSlug === 'best-sellers') {
        query.isBestSeller = true;
      } else if (collSlug === 'new-arrivals') {
        query.isNewArrival = true;
      } else {
        query.$or = [
          { collectionIds: collSlug },
          { collectionIds: `col-${collSlug}` },
          { occasion: collSlug },
        ];
      }
    }

    // Search filter across name, sku, description, categoryLabel
    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      const regex = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { name: regex },
        { sku: regex },
        { description: regex },
        { categoryLabel: regex },
        { 'details.gemstone': regex },
      ];
    }

    // Price range filter
    if (typeof options.minPrice === 'number' || typeof options.maxPrice === 'number') {
      query.price = {};
      if (typeof options.minPrice === 'number') query.price.$gte = options.minPrice;
      if (typeof options.maxPrice === 'number') query.price.$lte = options.maxPrice;
    }

    // Sort logic
    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1, reviewsCount: -1 },
      name_asc: { name: 1 },
      stock_desc: { stock: -1 },
    };

    const sortDirection = sortMap[options.sort || 'newest'] || { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [docs, total, stats] = await Promise.all([
      collection.find(query).sort(sortDirection).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query),
      collection.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]).toArray(),
    ]);

    const priceRange = stats[0]
      ? { min: stats[0].minPrice || 1499, max: stats[0].maxPrice || 19999 }
      : { min: 1499, max: 19999 };

    return {
      products: docs.map(normalizeProduct),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      priceRange,
    };
  } catch (err: any) {
    console.error('[getProductsFromDb Error]:', err?.message || err);
    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 1,
      priceRange: { min: 1499, max: 19999 },
    };
  }
}

/**
 * Fetch a single product by slug from MongoDB.
 */
export async function getProductBySlugFromDb(slug: string): Promise<DbProduct | null> {
  try {
    const db = await connectDB();
    const cleanSlug = slug.toLowerCase().trim();
    
    const doc = await db.collection('products').findOne({
      $or: [{ slug: cleanSlug }, { id: cleanSlug }],
      status: { $ne: 'archived' },
      isDeleted: { $ne: true },
    });

    if (!doc) return null;
    return normalizeProduct(doc);
  } catch (err: any) {
    console.error('[getProductBySlugFromDb Error]:', err?.message || err);
    return null;
  }
}

/**
 * Fetch related products in the same category from MongoDB.
 */
export async function getRelatedProductsFromDb(category: string, excludeId: string, limit: number = 4): Promise<DbProduct[]> {
  try {
    const db = await connectDB();
    const docs = await db.collection('products')
      .find({
        category: category.toLowerCase().trim(),
        id: { $ne: excludeId },
        status: 'active',
      })
      .limit(limit)
      .toArray();

    return docs.map(normalizeProduct);
  } catch (err: any) {
    console.error('[getRelatedProductsFromDb Error]:', err?.message || err);
    return [];
  }
}

/**
 * Fetch active categories from MongoDB.
 */
export async function getCategoriesFromDb(): Promise<DbCategory[]> {
  try {
    const db = await connectDB();
    const docs = await db.collection('categories').find({ status: 'active' }).sort({ sortOrder: 1 }).toArray();
    return docs.map(d => {
      const { _id, ...rest } = d;
      return { ...rest, id: rest.id || _id?.toString() } as DbCategory;
    });
  } catch (err: any) {
    console.error('[getCategoriesFromDb Error]:', err?.message || err);
    return [];
  }
}

/**
 * Fetch active collections from MongoDB.
 */
export async function getCollectionsFromDb(): Promise<DbCollection[]> {
  try {
    const db = await connectDB();
    const docs = await db.collection('collections').find({ status: 'active' }).sort({ sortOrder: 1 }).toArray();
    return docs.map(d => {
      const { _id, ...rest } = d;
      return { ...rest, id: rest.id || _id?.toString() } as DbCollection;
    });
  } catch (err: any) {
    console.error('[getCollectionsFromDb Error]:', err?.message || err);
    return [];
  }
}
