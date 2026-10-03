import fs from 'fs';
import path from 'path';
import {
  DbProduct,
  DbCategory,
  DbCollection,
  DbInventoryRecord,
  DbOrder,
  DbCustomer,
  DbReview,
  DbCoupon,
  DbMediaItem,
  DbBanner,
  DbNavigationItem,
  DbHomepageSection,
  DbUser,
  DbAuditLog,
  DbSettings,
} from './types';
import { PRODUCTS, CATEGORIES_DATA, REVIEWS_DATA } from '@/data/products';

export interface DatabaseSchema {
  products: DbProduct[];
  categories: DbCategory[];
  collections: DbCollection[];
  inventory: DbInventoryRecord[];
  orders: DbOrder[];
  customers: DbCustomer[];
  reviews: DbReview[];
  coupons: DbCoupon[];
  media: DbMediaItem[];
  banners: DbBanner[];
  navigation: DbNavigationItem[];
  homepage: DbHomepageSection[];
  users: DbUser[];
  auditLogs: DbAuditLog[];
  settings: DbSettings;
  version: number;
}

const DB_DIR = path.join(process.cwd(), 'data', 'db');
const DB_FILE = path.join(DB_DIR, 'mk_store.json');

// In-memory cache for fast read performance
let memoryCache: DatabaseSchema | null = null;

// Initial Seed Data Generator
function generateInitialDatabase(): DatabaseSchema {
  // Convert mock products into full database products with SKUs, stock, timestamps
  const initialProducts: DbProduct[] = PRODUCTS.map((p, index) => {
    const sku = `MK-${p.category.toUpperCase().slice(0, 3)}-${String(100 + index + 1)}`;
    const stock = index === 0 ? 12 : index === 1 ? 8 : index === 2 ? 5 : index === 3 ? 15 : index === 4 ? 20 : index === 5 ? 7 : index === 6 ? 0 : 3;
    const status = stock === 0 ? 'out_of_stock' : index === 5 ? 'draft' : 'active';

    return {
      ...p,
      sku,
      stock,
      reservedStock: 0,
      lowStockThreshold: 5,
      costPrice: Math.round(p.price * 0.55),
      status,
      collectionIds: p.isBestSeller ? ['best-sellers'] : p.isNewArrival ? ['new-arrivals'] : ['everyday-essentials'],
      attributes: {
        material: p.details?.material || 'Solid 925 Sterling Silver',
        purity: '925',
        weight: p.weight || '8.4g',
        hallmark: 'BIS 925 Hallmarked',
        plating: p.details?.plating || 'Anti-Tarnish Rhodium Finish',
      },
      createdAt: new Date(Date.now() - (index * 86400000 * 2)).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Categories matching reference screenshot
  const initialCategories: DbCategory[] = [
    {
      id: 'cat-necklaces',
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Handcrafted Jaipur 925 sterling silver necklaces, royal polki chokers and chains.',
      image: '/images/collection-necklaces.jpg',
      productCount: 42,
      status: 'active',
      sortOrder: 1,
      seoTitle: 'Silver Necklaces & Chokers | MK Silver Hub',
      seoDescription: 'Shop authentic 925 sterling silver necklaces crafted by master Jaipur silversmiths.',
    },
    {
      id: 'cat-earrings',
      name: 'Earrings',
      slug: 'earrings',
      description: 'Everyday studs to statement royal chandbalis in pure 925 silver.',
      image: '/images/collection-earrings.jpg',
      productCount: 36,
      status: 'active',
      sortOrder: 2,
      seoTitle: '925 Silver Earrings | MK Silver Hub',
      seoDescription: 'Handcrafted silver earrings, chandbalis, and studs hallmarked BIS 925.',
    },
    {
      id: 'cat-rings',
      name: 'Rings',
      slug: 'rings',
      description: 'Solitaire bands, floral halo rings, and adjustable gemstone rings.',
      image: '/images/collection-rings.jpg',
      productCount: 18,
      status: 'active',
      sortOrder: 3,
      seoTitle: 'Sterling Silver Rings | MK Silver Hub',
      seoDescription: 'Discover timeless 925 silver rings sculpted for every modern celebration.',
    },
    {
      id: 'cat-bracelets',
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Sleek tennis bracelets, silver cuffs, and floral daily charms.',
      image: 'https://images.unsplash.com/photo-1611591475155-426c04a29c61?q=80&w=1000&auto=format&fit=crop',
      productCount: 16,
      status: 'active',
      sortOrder: 4,
      seoTitle: 'Silver Bracelets & Bangles | MK Silver Hub',
      seoDescription: 'Shop modern essentials and minimal 925 sterling silver bracelets.',
    },
    {
      id: 'cat-pendants',
      name: 'Pendants',
      slug: 'pendants',
      description: 'Delicate solitaire and deity pendants with certified silver chains.',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
      productCount: 16,
      status: 'active',
      sortOrder: 5,
      seoTitle: 'Silver Pendants & Charms | MK Silver Hub',
      seoDescription: 'Meaningful pure 925 silver pendants with anti-tarnish rhodium sheen.',
    },
    {
      id: 'cat-mangalsutra',
      name: 'Mangalsutra',
      slug: 'mangalsutra',
      description: 'Contemporary sterling silver sacred black bead mangalsutras.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
      productCount: 8,
      status: 'active',
      sortOrder: 6,
    },
  ];

  // Collections matching reference screenshot
  const initialCollections: DbCollection[] = [
    {
      id: 'col-new-arrivals',
      name: 'New Arrivals',
      slug: 'new-arrivals',
      description: 'The latest contemporary additions sculpted in pure 925 sterling silver.',
      thumbnail: '/images/products/necklaces-modern-baroque-pearl-chain-01.png',
      heroImage: '/images/editorial/bridal-banner-clean-hd.jpg',
      productCount: 24,
      type: 'automatic',
      rules: [{ field: 'isNewArrival', operator: 'equals', value: 'true' }],
      productIds: initialProducts.filter(p => p.isNewArrival).map(p => p.id),
      status: 'active',
      sortOrder: 1,
    },
    {
      id: 'col-best-sellers',
      name: 'Best Sellers',
      slug: 'best-sellers',
      description: 'Our most loved and cherished handcrafted Jaipur creations.',
      thumbnail: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg',
      heroImage: '/images/editorial/bridal-banner-clean-hd.jpg',
      productCount: 18,
      type: 'automatic',
      rules: [{ field: 'isBestSeller', operator: 'equals', value: 'true' }],
      productIds: initialProducts.filter(p => p.isBestSeller).map(p => p.id),
      status: 'active',
      sortOrder: 2,
    },
    {
      id: 'col-everyday',
      name: 'Everyday Essentials',
      slug: 'everyday-essentials',
      description: 'Understated, featherlight 925 silver pieces for your daily routine.',
      thumbnail: '/images/occasions/everyday-elegance.jpg',
      productCount: 32,
      type: 'manual',
      productIds: initialProducts.slice(0, 4).map(p => p.id),
      status: 'active',
      sortOrder: 3,
    },
    {
      id: 'col-festive',
      name: 'Festive Collection',
      slug: 'festive-collection',
      description: 'Opulent chandbalis, temple necklaces, and royal polki heirlooms.',
      thumbnail: '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg',
      productCount: 16,
      type: 'manual',
      productIds: initialProducts.slice(1, 5).map(p => p.id),
      status: 'active',
      sortOrder: 4,
    },
    {
      id: 'col-bridal',
      name: 'Bridal Collection',
      slug: 'bridal-collection',
      description: 'Couture Jaipur bridal chokers, jhumkas, and sets for your big day.',
      thumbnail: '/images/occasions/bridal-collection.jpg',
      productCount: 12,
      type: 'manual',
      productIds: initialProducts.slice(0, 3).map(p => p.id),
      status: 'active',
      sortOrder: 5,
    },
    {
      id: 'col-gifts',
      name: 'Gifts Collection',
      slug: 'gifts-collection',
      description: 'Thoughtfully packaged timeless expressions in hallmarked silver.',
      thumbnail: '/images/occasions/gifting-collection.jpg',
      productCount: 20,
      type: 'manual',
      productIds: initialProducts.slice(2, 6).map(p => p.id),
      status: 'active',
      sortOrder: 6,
    },
  ];

  // Inventory records - Derived dynamically from active products in MongoDB
  const initialInventory: DbInventoryRecord[] = [];

  // Initial Orders matching reference screenshot (#MKT12345 to #MKT12341)
  const initialOrders: DbOrder[] = [
    {
      id: '#MKT12345',
      customerName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98201 44521',
      items: [
        {
          productId: 'prod-01',
          name: 'Floral Silver Earrings',
          image: '/images/collection-earrings.jpg',
          price: 2499,
          quantity: 1,
          total: 2499,
        },
        {
          productId: 'prod-05',
          name: 'Minimal Silver Ring',
          image: '/images/collection-rings.jpg',
          price: 1799,
          quantity: 1,
          total: 1799,
        },
      ],
      subtotal: 4298,
      discount: 0,
      tax: 128,
      shipping: 0,
      amount: 4298,
      paymentStatus: 'paid',
      paymentMethod: 'Razorpay UPI',
      status: 'delivered',
      shippingAddress: {
        addressLine: 'A-402, Oberoi Splendor, JVLR',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400060',
        country: 'India',
      },
      timeline: [
        { status: 'Delivered', note: 'Package handed over to customer', timestamp: '2026-09-30 14:20' },
        { status: 'Shipped', note: 'Dispatched via BlueDart AWB #8491203', timestamp: '2026-09-29 11:00' },
        { status: 'Confirmed', note: 'Order placed & payment verified', timestamp: '2026-09-28 16:30' },
      ],
      date: 'Sep 30, 2026',
      createdAt: '2026-09-28T16:30:00Z',
      updatedAt: '2026-09-30T14:20:00Z',
    },
    {
      id: '#MKT12344',
      customerName: 'Ananya Singh',
      email: 'ananya.s@example.com',
      phone: '+91 98112 55902',
      items: [
        {
          productId: 'prod-01',
          name: 'Floral Silver Earrings',
          image: '/images/collection-earrings.jpg',
          price: 2499,
          quantity: 1,
          total: 2499,
        },
      ],
      subtotal: 2499,
      discount: 0,
      tax: 75,
      shipping: 0,
      amount: 2499,
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card (Visa)',
      status: 'shipped',
      shippingAddress: {
        addressLine: 'B-12, Sector 44',
        city: 'Noida',
        state: 'Uttar Pradesh',
        postalCode: '201301',
        country: 'India',
      },
      timeline: [
        { status: 'Shipped', note: 'Handed over to courier partner Delhivery', timestamp: '2026-09-30 09:15' },
        { status: 'Confirmed', note: 'Payment verified', timestamp: '2026-09-29 18:45' },
      ],
      date: 'Sep 30, 2026',
      createdAt: '2026-09-29T18:45:00Z',
      updatedAt: '2026-09-30T09:15:00Z',
    },
    {
      id: '#MKT12343',
      customerName: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      phone: '+91 97693 88123',
      items: [
        {
          productId: 'prod-02',
          name: 'Pearl Blossom Choker Necklace',
          image: '/images/products/necklaces-pearl-blossom-collar-01.png',
          price: 3499,
          quantity: 1,
          total: 3499,
        },
        {
          productId: 'prod-03',
          name: 'Royal Polki Choker',
          image: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg',
          price: 3500,
          quantity: 1,
          total: 3500,
        },
      ],
      subtotal: 6999,
      discount: 0,
      tax: 210,
      shipping: 0,
      amount: 6999,
      paymentStatus: 'paid',
      paymentMethod: 'NetBanking (HDFC)',
      status: 'processing',
      shippingAddress: {
        addressLine: 'Flat 101, Palm Court, Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        country: 'India',
      },
      timeline: [
        { status: 'Processing', note: 'Item undergoing final quality polish & hallmark verification', timestamp: '2026-09-29 12:00' },
        { status: 'Confirmed', note: 'Payment verified', timestamp: '2026-09-29 11:30' },
      ],
      date: 'Sep 29, 2026',
      createdAt: '2026-09-29T11:30:00Z',
      updatedAt: '2026-09-29T12:00:00Z',
    },
    {
      id: '#MKT12342',
      customerName: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+91 99304 12890',
      items: [
        {
          productId: 'prod-04',
          name: 'Lotus Pendant with Silver Chain',
          image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
          price: 1999,
          quantity: 1,
          total: 1999,
        },
      ],
      subtotal: 1999,
      discount: 0,
      tax: 60,
      shipping: 0,
      amount: 1999,
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
      status: 'delivered',
      shippingAddress: {
        addressLine: 'Plot 45, Vasant Vihar',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110057',
        country: 'India',
      },
      timeline: [
        { status: 'Delivered', note: 'Delivered to resident', timestamp: '2026-09-29 17:00' },
      ],
      date: 'Sep 29, 2026',
      createdAt: '2026-09-27T10:15:00Z',
      updatedAt: '2026-09-29T17:00:00Z',
    },
    {
      id: '#MKT12341',
      customerName: 'Karan Verma',
      email: 'karan.verma@example.com',
      phone: '+91 98402 77341',
      items: [
        {
          productId: 'prod-02',
          name: 'Kundan Chandbali Necklace',
          image: '/images/collection-necklaces.jpg',
          price: 3998,
          quantity: 1,
          total: 3998,
        },
      ],
      subtotal: 3998,
      discount: 0,
      tax: 120,
      shipping: 0,
      amount: 3998,
      paymentStatus: 'refunded',
      paymentMethod: 'Credit Card',
      status: 'cancelled',
      shippingAddress: {
        addressLine: '7th Cross, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
      timeline: [
        { status: 'Cancelled', note: 'Customer requested cancellation before dispatch. Refund issued.', timestamp: '2026-09-28 15:00' },
      ],
      date: 'Sep 28, 2026',
      createdAt: '2026-09-28T14:10:00Z',
      updatedAt: '2026-09-28T15:00:00Z',
    },
  ];

  // Customers - Production Only (no mock or demo customers)
  const initialCustomers: DbCustomer[] = [];

  // Reviews - Production Only (no mock or demo reviews)
  const initialReviews: DbReview[] = [];

  // Coupons
  const initialCoupons: DbCoupon[] = [
    {
      id: 'coup-01',
      code: 'FIRST10',
      type: 'percentage',
      value: 10,
      minOrder: 1999,
      maxDiscount: 1000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 5000,
      usageCount: 842,
      status: 'active',
    },
    {
      id: 'coup-02',
      code: 'FESTIVE500',
      type: 'fixed',
      value: 500,
      minOrder: 3999,
      startDate: '2026-09-01',
      endDate: '2026-11-15',
      usageLimit: 1000,
      usageCount: 154,
      status: 'active',
    },
  ];

  // Media Library initial items
  const initialMedia: DbMediaItem[] = [
    {
      id: 'media-01',
      filename: 'bridal-banner-clean-hd.webp',
      originalName: 'bridal-banner-clean-hd.jpg',
      url: '/images/editorial/bridal-banner-clean-hd.jpg',
      type: 'image',
      mimeType: 'image/webp',
      sizeBytes: 266933,
      originalSizeBytes: 1824000,
      savingsPercent: 85,
      dimensions: { width: 1920, height: 1080 },
      formats: ['original', 'webp', 'avif'],
      sizes: {
        thumbnail: '/images/editorial/bridal-banner-clean-hd.jpg',
        sm: '/images/editorial/bridal-banner-clean-hd.jpg',
        md: '/images/editorial/bridal-banner-clean-hd.jpg',
        lg: '/images/editorial/bridal-banner-clean-hd.jpg',
        xl: '/images/editorial/bridal-banner-clean-hd.jpg',
      },
      folder: 'banners',
      tags: ['hero', 'editorial', 'bridal', 'jaipur'],
      usedBy: ['Homepage Hero', 'Collections Hero'],
      createdAt: '2026-09-29T12:00:00Z',
    },
    {
      id: 'media-02',
      filename: 'collection-necklaces.webp',
      originalName: 'collection-necklaces.jpg',
      url: '/images/collection-necklaces.jpg',
      type: 'image',
      mimeType: 'image/webp',
      sizeBytes: 79448,
      originalSizeBytes: 640000,
      savingsPercent: 88,
      dimensions: { width: 1200, height: 1200 },
      formats: ['original', 'webp', 'avif'],
      sizes: {
        thumbnail: '/images/collection-necklaces.jpg',
        md: '/images/collection-necklaces.jpg',
      },
      folder: 'categories',
      tags: ['necklaces', 'category', 'silver'],
      usedBy: ['Shop The Collections', 'Category: Necklaces'],
      createdAt: '2026-09-29T12:00:00Z',
    },
    {
      id: 'media-03',
      filename: 'collection-earrings.webp',
      originalName: 'collection-earrings.jpg',
      url: '/images/collection-earrings.jpg',
      type: 'image',
      mimeType: 'image/webp',
      sizeBytes: 74354,
      originalSizeBytes: 580000,
      savingsPercent: 87,
      dimensions: { width: 1200, height: 1200 },
      formats: ['original', 'webp', 'avif'],
      sizes: {
        thumbnail: '/images/collection-earrings.jpg',
        md: '/images/collection-earrings.jpg',
      },
      folder: 'categories',
      tags: ['earrings', 'category'],
      usedBy: ['Shop The Collections', 'Category: Earrings'],
      createdAt: '2026-09-29T12:00:00Z',
    },
    {
      id: 'media-04',
      filename: 'collection-rings.webp',
      originalName: 'collection-rings.jpg',
      url: '/images/collection-rings.jpg',
      type: 'image',
      mimeType: 'image/webp',
      sizeBytes: 67153,
      originalSizeBytes: 520000,
      savingsPercent: 87,
      dimensions: { width: 1200, height: 1200 },
      formats: ['original', 'webp', 'avif'],
      sizes: {
        thumbnail: '/images/collection-rings.jpg',
        md: '/images/collection-rings.jpg',
      },
      folder: 'categories',
      tags: ['rings', 'category'],
      usedBy: ['Shop The Collections', 'Category: Rings'],
      createdAt: '2026-09-29T12:00:00Z',
    },
  ];

  // Banners
  const initialBanners: DbBanner[] = [
    {
      id: 'ban-01',
      title: 'Timeless Jaipur 925 Silver',
      subtitle: 'Pure Sterling Silver Handcrafted for Royal Moments',
      desktopImage: '/images/editorial/bridal-banner-clean-hd.jpg',
      ctaText: 'Explore Collections',
      ctaUrl: '/shop',
      placement: 'homepage_hero',
      sortOrder: 1,
      status: 'active',
    },
  ];

  // Navigation Items
  const initialNavigation: DbNavigationItem[] = [
    {
      id: 'nav-01',
      label: 'Shop',
      url: '/shop',
      placement: 'header',
      sortOrder: 1,
      status: 'active',
    },
    {
      id: 'nav-02',
      label: 'Collections',
      url: '/collections',
      placement: 'header',
      sortOrder: 2,
      status: 'active',
    },
    {
      id: 'nav-03',
      label: 'Gifts',
      url: '/shop?category=gifts',
      placement: 'header',
      sortOrder: 3,
      status: 'active',
    },
    {
      id: 'nav-04',
      label: 'About',
      url: '/about',
      placement: 'header',
      sortOrder: 4,
      status: 'active',
    },
  ];

  // Homepage Sections (Order & CMS Control)
  const initialHomepage: DbHomepageSection[] = [
    { id: 'sec-announcement', type: 'announcement', name: 'Announcement Bar', enabled: true, sortOrder: 1 },
    { id: 'sec-hero', type: 'hero', name: 'Full-screen Hero Slider', enabled: true, sortOrder: 2 },
    { id: 'sec-trust', type: 'trust_strip', name: 'Trust Brand Promise Strip', enabled: true, sortOrder: 3 },
    { id: 'sec-categories', type: 'categories', name: 'Shop By Category', enabled: true, sortOrder: 4 },
    { id: 'sec-bestsellers', type: 'best_sellers', name: 'Best Sellers Slider', enabled: true, sortOrder: 5 },
    { id: 'sec-newarrivals', type: 'new_arrivals', name: 'New Arrivals Slider', enabled: true, sortOrder: 6 },
    { id: 'sec-occasions', type: 'occasions', name: 'Curated Occasions', enabled: true, sortOrder: 7 },
    { id: 'sec-editorial', type: 'editorial', name: 'Jaipur Heritage Campaign', enabled: true, sortOrder: 8 },
    { id: 'sec-whychoose', type: 'why_choose', name: 'Why Choose MK Silver Hub', enabled: true, sortOrder: 9 },
    { id: 'sec-testimonials', type: 'testimonials', name: 'Customer Testimonials', enabled: true, sortOrder: 10 },
    { id: 'sec-newsletter', type: 'newsletter', name: 'Newsletter Signup', enabled: true, sortOrder: 11 },
  ];

  // Default Admin User matching reference screenshot (Rachit Sharma, Super Admin)
  const initialUsers: DbUser[] = [
    {
      id: 'user-01',
      name: 'Rachit Sharma',
      email: 'admin@mksilverhub.com',
      // Verified bcrypt hash (10 rounds) for AdminPassword123!
      passwordHash: '$2b$10$krfCSgf/pxX19eXfUJusbe8pk/Ld75mXPmJ1O9LY/bb8PtPEtlTmK',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      status: 'active',
      createdAt: '2026-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
    },
    {
      id: 'user-02',
      name: 'Priya Sharma',
      email: 'customer@mksilverhub.com',
      // Verified bcrypt hash (10 rounds) for CustomerPassword123!
      passwordHash: '$2b$10$aM6VpMA0gR3LAZfEHlbBs.JBN9waB5HiJlgxz0uvqZKqJ6EKJV1MS',
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      status: 'active',
      createdAt: '2026-01-15T00:00:00Z',
      lastLogin: new Date().toISOString(),
    },
  ];

  // Initial Audit Logs
  const initialAuditLogs: DbAuditLog[] = [
    {
      id: 'log-01',
      adminName: 'Rachit Sharma',
      adminEmail: 'admin@mksilverhub.com',
      action: 'SYSTEM_INITIALIZED',
      resource: 'Store',
      resourceId: 'mk-silver-hub',
      details: 'Enterprise dynamic e-commerce CMS database initialized successfully',
      timestamp: new Date().toISOString(),
    },
  ];

  // Settings
  const initialSettings: DbSettings = {
    storeName: 'MK Silver Hub',
    tagline: 'Fine 925 Sterling Jewellery',
    contactEmail: 'support@mksilverhub.com',
    contactPhone: '+91 74250 58118',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 3, // 3% GST on silver jewellery in India
    freeShippingThreshold: 1999,
    defaultLowStockThreshold: 5,
    supportWhatsApp: '+917425058118',
    address: 'Johari Bazaar, Jaipur, Rajasthan 302003, India',
    instagramUrl: 'https://instagram.com/mksilverhub',
    facebookUrl: 'https://facebook.com/mksilverhub',
    youtubeUrl: 'https://youtube.com',
    maintenanceMode: false,
  };

  return {
    products: initialProducts,
    categories: initialCategories,
    collections: initialCollections,
    inventory: initialInventory,
    orders: initialOrders,
    customers: initialCustomers,
    reviews: initialReviews,
    coupons: initialCoupons,
    media: initialMedia,
    banners: initialBanners,
    navigation: initialNavigation,
    homepage: initialHomepage,
    users: initialUsers,
    auditLogs: initialAuditLogs,
    settings: initialSettings,
    version: 1,
  };
}

/**
 * Ensures database file exists and loads it into memory.
 */
export function getDb(): DatabaseSchema {
  if (process.env.NODE_ENV === 'development') {
    memoryCache = null;
  }
  if (memoryCache) {
    return memoryCache;
  }

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial = generateInitialDatabase();
      saveDb(initial);
      memoryCache = initial;
      return initial;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(fileContent) as DatabaseSchema;
    memoryCache = parsed;
    return parsed;
  } catch (error) {
    console.error('Error reading database file, initializing fallback:', error);
    const initial = generateInitialDatabase();
    memoryCache = initial;
    return initial;
  }
}

/**
 * Thread-safe atomic write to disk.
 */
export function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    memoryCache = data;
  } catch (error) {
    console.error('Failed to write database file:', error);
    throw error;
  }
}

/**
 * Records an audit log entry for changes.
 */
export function logAudit(
  adminName: string,
  adminEmail: string,
  action: string,
  resource: string,
  resourceId: string,
  details: string
): void {
  try {
    const db = getDb();
    const entry: DbAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName,
      adminEmail,
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date().toISOString(),
    };

    db.auditLogs.unshift(entry);
    // Keep max 500 audit logs
    if (db.auditLogs.length > 500) {
      db.auditLogs = db.auditLogs.slice(0, 500);
    }
    saveDb(db);
  } catch (err) {
    console.error('Failed to record audit log:', err);
  }
}
