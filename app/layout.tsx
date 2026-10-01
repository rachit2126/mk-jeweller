import type { Metadata } from 'next';
import './globals.css';
import { CommerceProvider } from '@/components/commerce/CommerceContext';
import AnnouncementBar from '@/components/navigation/AnnouncementBar';
import MainNavbar from '@/components/navigation/MainNavbar';
import CartDrawer from '@/components/commerce/CartDrawer';
import QuickViewModal from '@/components/commerce/QuickViewModal';
import SearchModal from '@/components/commerce/SearchModal';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';
import Footer from '@/components/layout/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mk-jeweller.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'MK Silver Hub | Fine 925 Sterling Jewellery',
  description: 'Modern Silver. Timeless You. Discover BIS 925 Hallmarked sterling silver jewellery with pan-India insured shipping.',
  keywords: '925 silver jewellery, sterling silver, silver earrings, polki necklace, silver chandbali, jaipur silver jewellery, MK Silver Hub',
  applicationName: 'MK Silver Hub',
  authors: [{ name: 'MK Silver Hub' }],
  creator: 'MK Silver Hub',
  publisher: 'MK Silver Hub',
  openGraph: {
    title: 'MK Silver Hub | Fine 925 Sterling Jewellery',
    description: 'Modern Silver. Timeless You. Discover BIS 925 Hallmarked sterling silver jewellery with pan-India insured shipping.',
    url: siteUrl,
    siteName: 'MK Silver Hub',
    images: [
      {
        url: '/og-square.png',
        width: 800,
        height: 800,
        alt: 'MK Silver Hub — Fine 925 Sterling Jewellery',
        type: 'image/png',
      },
      {
        url: '/og-landscape.png',
        width: 1200,
        height: 630,
        alt: 'MK Silver Hub — Fine 925 Sterling Jewellery',
        type: 'image/png',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MK Silver Hub | Fine 925 Sterling Jewellery',
    description: 'Modern Silver. Timeless You. Discover BIS 925 Hallmarked sterling silver jewellery with pan-India insured shipping.',
    images: ['/og-landscape.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/og-square.png', sizes: '800x800', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/og-square.png', sizes: '800x800', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        {/* WhatsApp & Social Media Preview Meta Tags */}
        <meta property="og:image" content={`${siteUrl}/og-square.png`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/og-square.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content="MK Silver Hub Fine 925 Sterling Jewellery" />
        <link rel="image_src" href={`${siteUrl}/og-square.png`} />
      </head>
      <body>
        <CommerceProvider>
          {/* Top Announcement Bar */}
          <AnnouncementBar />

          {/* Floating Sticky Main Navbar */}
          <MainNavbar />

          {/* Main Page Content */}
          <main style={{ minHeight: '80vh', margin: 0, padding: 0, border: 'none', width: '100%', overflowX: 'hidden' }}>
            {children}
          </main>

          {/* Commerce Global Modals & Drawers */}
          <CartDrawer />
          <QuickViewModal />
          <SearchModal />
          <WhatsAppFloat />
          <MobileBottomNav />

          {/* Global Footer */}
          <Footer />
        </CommerceProvider>
      </body>
    </html>
  );
}
