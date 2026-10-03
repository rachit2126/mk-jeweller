import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/admin/navigation',
        destination: '/admin/navbar',
        permanent: false,
      },

      {
        source: '/admin/analytics',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/admin/reports',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/admin/content/homepage',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/silver-care',
        destination: '/jewellery-care',
        permanent: true,
      },
      {
        source: '/exchange',
        destination: '/returns',
        permanent: true,
      },
      {
        source: '/refund-policy',
        destination: '/returns',
        permanent: true,
      },
      {
        source: '/create-account',
        destination: '/register',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;


