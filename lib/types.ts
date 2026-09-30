export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'earrings' | 'necklaces' | 'rings' | 'bracelets' | 'pendants' | 'anklets';
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  weight: string;
  purity: string;
  badge?: 'NEW ARRIVAL' | 'BEST SELLER' | 'ENGRAVABLE' | 'FESTIVE SPECIAL';
  images: string[];
  secondaryImage?: string;
  description: string;
  shortDescription: string;
  details: {
    material: string;
    plating: string;
    dimensions: string;
    gemstone?: string;
    claspType?: string;
    hallmark: string;
  };
  occasion: ('everyday' | 'office' | 'festive' | 'gifting')[];
  style: ('minimal' | 'classic' | 'statement' | 'festive')[];
  inStock: boolean;
  featured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface Review {
  id: string;
  productId?: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  location: string;
  avatarUrl?: string;
  purchasedProduct: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  customEngraving?: string;
}
