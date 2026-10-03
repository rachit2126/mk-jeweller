import { ObjectId } from 'mongodb';
import { Product, Review } from './types';
import { connectDB } from '@/lib/db/mongodb';

function normalizeProduct(doc: any): Product {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: rest.id || _id?.toString(),
  };
}

/**
 * Dynamically queries products directly from MongoDB.
 */
export async function getProducts(options?: {
  category?: string;
  occasion?: string;
  style?: string;
  search?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  collection?: string;
  limit?: number;
}): Promise<Product[]> {
  const db = await connectDB();
  const query: any = {
    status: { $in: ['active', 'out_of_stock'] },
    isDeleted: { $ne: true },
  };

  if (options?.category) {
    query.category = options.category.toLowerCase().trim();
  }
  if (options?.occasion) {
    query.occasion = options.occasion.toLowerCase().trim();
  }
  if (options?.style) {
    query.style = options.style.toLowerCase().trim();
  }
  if (options?.isBestSeller) {
    query.isBestSeller = true;
  }
  if (options?.isNewArrival) {
    query.isNewArrival = true;
  }
  if (options?.search) {
    const q = options.search.trim();
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { categoryLabel: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { sku: { $regex: q, $options: 'i' } },
    ];
  }

  let cursor = db.collection('products').find(query);
  if (options?.limit) {
    cursor = cursor.limit(options.limit);
  }

  const docs = await cursor.toArray();
  return docs.map(normalizeProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await connectDB();
  const cleanSlug = slug.toLowerCase().trim();
  const doc = await db.collection('products').findOne({
    $or: [{ slug: cleanSlug }, { id: cleanSlug }],
    status: { $ne: 'archived' },
    isDeleted: { $ne: true },
  });
  return doc ? normalizeProduct(doc) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await connectDB();
  const doc = await db.collection('products').findOne({
    $or: [{ id }, { _id: (id && id.length === 24 && ObjectId.isValid(id) ? new ObjectId(id) : undefined) }],
    isDeleted: { $ne: true },
  });
  return doc ? normalizeProduct(doc) : null;
}

export async function getCategories() {
  const db = await connectDB();
  const docs = await db.collection('categories').find({ status: 'active' }).sort({ sortOrder: 1 }).toArray();
  return docs.map((d: any) => {
    const { _id, ...rest } = d;
    return { ...rest, id: rest.id || _id?.toString() };
  });
}

export async function getCollections() {
  const db = await connectDB();
  const docs = await db.collection('collections').find({ status: 'active' }).sort({ sortOrder: 1 }).toArray();
  return docs.map((d: any) => {
    const { _id, ...rest } = d;
    return { ...rest, id: rest.id || _id?.toString() };
  });
}

export async function getReviews(productId?: string): Promise<Review[]> {
  const db = await connectDB();
  const query: any = { status: 'approved' };
  if (productId) {
    query.productId = productId;
  }
  const reviews = await db.collection('reviews').find(query).toArray();
  return reviews.map((r: any) => ({
    id: r.id || r._id?.toString(),
    productId: r.productId,
    customerName: r.customerName,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    date: r.date,
    verified: r.verified,
    location: r.location,
    purchasedProduct: r.purchasedProduct || r.productName || '925 Sterling Jewellery',
  }));
}

export { formatPrice } from './format';


