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

export const metadata: Metadata = {
  title: 'MK Silver Hub | Fine 925 Sterling Jewellery',
  description: 'Shop authentic BIS 925 Hallmarked silver jewellery online. Handcrafted earrings, necklaces, rings, bracelets, and pendants designed for everyday elegance and royal celebrations.',
  keywords: '925 silver jewellery, sterling silver, silver earrings, polki necklace, silver chandbali, jaipur silver jewellery, MK Silver Hub',
  openGraph: {
    title: 'MK Silver Hub | Fine 925 Sterling Jewellery',
    description: 'Modern Silver. Timeless You. Discover BIS 925 Hallmarked sterling silver jewellery with pan-India insured shipping.',
    type: 'website',
    locale: 'en_IN',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
