import type { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mksilverhub.com';

  const staticRoutes = [
    '',
    '/shop',
    '/collections',
    '/gifts',
    '/about',
    '/craftsmanship',
    '/jewellery-care',
    '/size-guide',
    '/shipping',
    '/returns',
    '/faq',
    '/contact',
    '/login',
    '/register',
    '/forgot-password',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const db = await connectDB();
    const [categories, products] = await Promise.all([
      db.collection('categories').find({ status: 'active' }, { projection: { slug: 1, id: 1 } }).toArray(),
      db.collection('products').find({ status: 'active' }, { projection: { slug: 1 } }).toArray(),
    ]);

    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/shop?category=${cat.slug || cat.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

    productRoutes = products.map((prod) => ({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.error('[Sitemap MongoDB error]:', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

