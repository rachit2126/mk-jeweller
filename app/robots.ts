import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mksilverhub.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/account', '/cart', '/search', '/dev/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
