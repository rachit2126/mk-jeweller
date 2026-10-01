import { Product } from '@/lib/types';

export interface DbProduct extends Product {
  sku: string;
  costPrice?: number;
  stock: number;
  reservedStock?: number;
  lowStockThreshold?: number;
  status: 'active' | 'draft' | 'archived' | 'out_of_stock';
  collectionIds?: string[];
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
  rules?: {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
    value: string | number;
  }[];
  productIds: string[];
  status: 'active' | 'inactive';
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
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
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  placement: 'homepage_hero' | 'homepage_middle' | 'shop_top' | 'promotional';
  sortOrder: number;
  status: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
}

export interface DbNavigationItem {
  id: string;
  label: string;
  url: string;
  type?: string;
  icon?: string;
  image?: string;
  badge?: string;
  highlight?: boolean;
  menuColumns?: any[];
  parentId?: string | null;
  placement?: 'header' | 'mega_menu' | 'mobile' | 'footer' | string;
  sortOrder: number;
  status: 'active' | 'inactive';
  children?: DbNavigationItem[];
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
