import { Product } from '@/lib/types';

export interface DbProduct extends Product {
  sku: string;
  costPrice?: number;
  stock: number;
  reservedStock?: number;
  lowStockThreshold?: number;
  status: 'active' | 'draft' | 'archived' | 'out_of_stock';
  collectionIds?: string[];
  subcategoryId?: string;
  subcategory?: string;
  attributes?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  parentId?: string | null;
  productCount: number;
  status: 'active' | 'inactive';
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  showInNavbar?: boolean;
  visibleOnStore?: boolean;
  megaMenuImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionRule {
  field: 'category' | 'status' | 'price' | 'stock' | 'isNewArrival' | 'isBestSeller' | 'featured' | 'tag';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_than_or_equal' | 'less_than_or_equal' | 'contains';
  value: string | number | boolean;
}

export interface DbCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  heroImage?: string;
  thumbnail: string;
  productCount: number;
  type: 'manual' | 'automatic';
  ruleMatch?: 'ALL' | 'ANY';
  rules?: CollectionRule[];
  productIds: string[];
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'best_selling';
  status: 'active' | 'inactive';
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DbInventoryRecord {
  id: string;
  sku: string;
  productId: string;
  productName: string;
  productImage: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order' | 'discontinued';
  history: {
    id: string;
    previous: number;
    change: number;
    new: number;
    reason: string;
    admin: string;
    timestamp: string;
  }[];
  updatedAt: string;
}

export interface DbOrderItem {
  productId: string;
  name: string;
  sku?: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface DbOrder {
  id: string; // e.g. #MKT12345
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  items: DbOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled' | 'pending';
  shippingAddress: {
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  timeline: {
    status: string;
    note: string;
    timestamp: string;
  }[];
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpend: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
  addresses: {
    id: string;
    type: 'home' | 'office';
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  wishlist: string[];
  createdAt: string;
}

export interface DbReview {
  id: string;
  productId?: string;
  productName?: string;
  purchasedProduct?: string;
  productImage?: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  location: string;
  featured?: boolean;
}

export interface DbCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'inactive' | 'expired';
  categoryRestrictions?: string[];
}

export interface DbMediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video';
  mimeType: string;
  sizeBytes: number;
  originalSizeBytes?: number;
  savingsPercent?: number;
  dimensions: { width: number; height: number };
  formats: ('original' | 'webp' | 'avif')[];
  sizes: {
    thumbnail?: string;
    sm?: string; // 400px
    md?: string; // 800px
    lg?: string; // 1200px
    xl?: string; // 1600px
  };
  folder: 'products' | 'categories' | 'banners' | 'general';
  tags: string[];
  usedBy: string[];
  createdAt: string;
}

export interface DbBanner {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage?: string;
  altText?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  placement: 'homepage_hero' | 'homepage_middle' | 'shop_top' | 'promotional';
  sortOrder: number;
  status: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DbNavigationColumn {
  heading: string;
  links: {
    label: string;
    url: string;
    count?: number;
  }[];
}

export interface DbNavigationItem {
  _id?: any;
  id: string;
  label: string;
  slug?: string;
  url: string;
  type?: 'category' | 'collection' | 'product' | 'custom' | string;
  icon?: string;
  image?: string | null;
  badge?: string;
  highlight?: boolean;
  parentId?: string | null;
  referenceId?: string | null;
  customUrl?: string | null;
  order?: number;
  sortOrder?: number;
  level?: number;
  isActive?: boolean;
  status?: 'active' | 'inactive';
  megaMenuEnabled?: boolean;
  openInNewTab?: boolean;
  description?: string | null;
  featuredTitle?: string | null;
  featuredDescription?: string | null;
  featuredCtaText?: string | null;
  featuredCtaUrl?: string | null;
  columns?: DbNavigationColumn[];
  menuColumns?: any[];
  placement?: 'header' | 'mega_menu' | 'mobile' | 'footer' | string;
  children?: DbNavigationItem[];
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DbHomepageSection {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  sortOrder: number;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  image?: string;
  mobileImage?: string;
  collectionId?: string;
  productIds?: string[];
  customData?: Record<string, any>;
}

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'admin' | 'manager' | 'editor' | 'support' | 'viewer' | 'USER' | 'user' | 'SUPER_ADMIN' | 'ADMIN';
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface DbAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string; // e.g. 'PRODUCT_CREATED', 'PRICE_UPDATED', 'STOCK_ADJUSTED'
  resource: string; // e.g. 'Product', 'Category', 'Order'
  resourceId: string;
  details: string;
  timestamp: string;
}

export interface DbSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  freeShippingThreshold: number;
  defaultLowStockThreshold: number;
  supportWhatsApp: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  maintenanceMode: boolean;
}

export interface DbContentItem {
  id: string;
  title: string;
  slug: string;
  type: 'blog' | 'editorial' | 'guide' | 'faq' | 'legal';
  status: 'published' | 'draft' | 'scheduled';
  author: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  sections?: Array<{
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    content?: string;
    image?: string;
    buttonText?: string;
    buttonUrl?: string;
    items?: Array<{ title: string; description: string; icon?: string }>;
  }>;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
