import { Product, Review } from './types';
import { PRODUCTS, CATEGORIES_DATA, REVIEWS_DATA } from '@/data/products';

// Mock API Abstraction Layer for MK Silver Hub
// This allows seamless connection to headless Shopify, Medusa, custom Node/Express, or MongoDB backend later.

export async function getProducts(options?: {
  category?: string;
  occasion?: string;
  style?: string;
  search?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  limit?: number;
}): Promise<Product[]> {
  // Simulate network latency if needed, or return immediate
  let filtered = [...PRODUCTS];

  if (options?.category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === options.category?.toLowerCase());
  }

  if (options?.occasion) {
    filtered = filtered.filter(p => p.occasion.includes(options.occasion as any));
  }

  if (options?.style) {
    filtered = filtered.filter(p => p.style.includes(options.style as any));
  }

  if (options?.isBestSeller) {
    filtered = filtered.filter(p => p.isBestSeller);
  }

  if (options?.isNewArrival) {
    filtered = filtered.filter(p => p.isNewArrival);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const found = PRODUCTS.find(p => p.slug === slug);
  return found || null;
}

export async function getCategories() {
  return CATEGORIES_DATA;
}

export async function getReviews(productId?: string): Promise<Review[]> {
  if (productId) {
    return REVIEWS_DATA.filter(r => r.productId === productId);
  }
  return REVIEWS_DATA;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
