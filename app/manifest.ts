import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: `${siteConfig.positioning} Authentic BIS 925 Hallmarked silver jewellery designed for contemporary elegance.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F4EF',
    theme_color: '#211914',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
