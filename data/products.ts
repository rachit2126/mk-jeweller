import { Product, Review } from '@/lib/types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    slug: 'floral-silver-earrings',
    name: 'Floral Silver Earrings',
    category: 'earrings',
    categoryLabel: 'Earrings',
    price: 2499,
    compareAtPrice: 3499,
    discountPercent: 29,
    rating: 4.8,
    reviewsCount: 120,
    weight: '8.4g',
    purity: '925 Sterling Silver',
    badge: 'NEW ARRIVAL',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    description: 'Masterfully sculpted by our Jaipur silversmiths, these floral jhumka earrings unite delicate botanical filigree with lustrous freshwater pearls. Finished with anti-tarnish rhodium for an everlasting moonlight silver sheen.',
    shortDescription: 'Everyday to Extraordinary',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Anti-Tarnish Rhodium Finish',
      dimensions: '42mm x 18mm',
      gemstone: 'Natural Seed Pearls & Cubic Zirconia',
      claspType: 'Comfort Push Back',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['everyday', 'festive', 'gifting'],
    style: ['classic', 'festive'],
    inStock: true,
    isNewArrival: true,
    featured: true
  },
  {
    id: 'prod-02',
    slug: 'pearl-blossom-necklace',
    name: 'Pearl Blossom Choker Necklace',
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    price: 3499,
    compareAtPrice: 4699,
    discountPercent: 26,
    rating: 4.9,
    reviewsCount: 142,
    weight: '24.2g',
    purity: '925 Sterling Silver',
    badge: 'BEST SELLER',
    images: [
      '/images/products/necklaces-pearl-blossom-collar-01.png',
      '/images/products/necklaces-modern-baroque-pearl-chain-01.png',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: '/images/products/necklaces-pearl-blossom-collar-01.png',
    description: 'An ethereal collar of graduated freshwater pearls embraced by handcrafted sterling silver floral cups and crystal drop pendants. Perfect for graceful celebrations, intimate soirees, or royal evening gatherings.',
    shortDescription: 'Regal Statement Collar',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: '18K White Rhodium',
      dimensions: '16 inches + 2 inch extender',
      gemstone: 'Selected Cultured Freshwater Pearls',
      claspType: 'Spring Ring with 925 Stamp Tag',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['everyday', 'office', 'festive'],
    style: ['minimal', 'classic'],
    inStock: true,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'prod-03',
    slug: 'ruby-drop-pendant',
    name: 'Ruby Drop Pendant',
    category: 'pendants',
    categoryLabel: 'Pendants',
    price: 2999,
    compareAtPrice: 3999,
    discountPercent: 25,
    rating: 4.9,
    reviewsCount: 210,
    weight: '9.6g',
    purity: '925 Sterling Silver',
    badge: 'ENGRAVABLE',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1000&auto=format&fit=crop',
    description: 'A regal lab-grown pigeon blood ruby teardrop enveloped by a halo of brilliant pavé stones set in high-polish 925 sterling silver. Includes customizable complimentary back engraving.',
    shortDescription: 'Meaningful Designs',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Anti-Tarnish Rhodium',
      dimensions: '22mm pendant drop, 18-inch cable chain',
      gemstone: 'Synthetic Ruby (Grade AAA) & Zirconia',
      claspType: 'Lobster Clasp',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['festive', 'gifting', 'everyday'],
    style: ['classic', 'statement'],
    inStock: true,
    isNewArrival: true,
    featured: true
  },
  {
    id: 'prod-04',
    slug: 'golden-leaf-ring',
    name: 'Golden Leaf Ring',
    category: 'rings',
    categoryLabel: 'Rings',
    price: 1899,
    compareAtPrice: 2499,
    discountPercent: 24,
    rating: 4.6,
    reviewsCount: 76,
    weight: '4.8g',
    purity: '925 Sterling Silver',
    badge: 'NEW ARRIVAL',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
    description: 'A tribute to nature’s symmetry, featuring a hand-chiseled lotus petal motif cast in solid 925 sterling silver with micro-layer 18K yellow gold accents. Ergonomic comfort band.',
    shortDescription: 'For Every Occasion',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Dual-Tone 18K Gold & Rhodium',
      dimensions: 'Adjustable size (Fits US 6 to 9)',
      gemstone: 'None (Pure sculpted silver metalwork)',
      claspType: 'Open adjustable band',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['everyday', 'office', 'gifting'],
    style: ['minimal', 'classic'],
    inStock: true,
    isNewArrival: true,
    featured: true
  },
  {
    id: 'prod-05',
    slug: 'kundan-chandbali-earrings',
    name: 'Lotus Bloom Ruby & Polki Choker Set',
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    price: 5499,
    compareAtPrice: 7299,
    discountPercent: 25,
    rating: 5.0,
    reviewsCount: 188,
    weight: '32.5g',
    purity: '925 Sterling Silver',
    badge: 'BEST SELLER',
    images: [
      '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg',
      '/images/products/necklaces-emerald-polki-bridal-set-01.png',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg',
    description: 'A resplendent heritage necklace ensemble sculpted in solid 925 sterling silver with cabochon rubies, hand-carved mint jade beads, and diamond-cut polki florets. Accompanied by matching statement chandbali earrings.',
    shortDescription: 'Festive Grandeur & Heritage',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: '22K Antique Gold & Rhodium Micron Foil',
      dimensions: 'Choker width 38mm, 52mm earring drop',
      gemstone: 'Carved Mint Jade, Natural Rubies & Uncut Polki',
      claspType: 'Handcrafted Adjustable Silk Zari Dori',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['festive', 'gifting'],
    style: ['festive', 'statement'],
    inStock: true,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'prod-06',
    slug: 'minimal-silver-chain-necklace',
    name: 'Sculpted Baroque Pearl Layered Chain',
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    price: 3299,
    compareAtPrice: 4299,
    discountPercent: 23,
    rating: 4.8,
    reviewsCount: 94,
    weight: '18.8g',
    purity: '925 Sterling Silver',
    badge: 'NEW ARRIVAL',
    images: [
      '/images/products/necklaces-modern-baroque-pearl-chain-01.png',
      '/images/products/necklaces-pearl-blossom-collar-01.png',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: '/images/products/necklaces-modern-baroque-pearl-chain-01.png',
    description: 'Modern editorial layering at its finest. Natural irregular baroque pearls interlinked with sculptured floral drops and toggle charms in 18K yellow gold plated 925 sterling silver.',
    shortDescription: 'Contemporary Editorial Luxe',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: '18K Yellow Gold & Anti-Tarnish Rhodium',
      dimensions: 'Layer 1: 38cm, Layer 2: 44cm with T-bar toggle',
      gemstone: 'Natural Grade-AA Baroque Freshwater Pearls',
      claspType: 'Artisan T-Bar Toggle & Ring',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['everyday', 'office', 'festive'],
    style: ['minimal', 'statement'],
    inStock: true,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'prod-07',
    slug: 'pink-stone-pendant',
    name: 'Pink Stone Floral Pendant',
    category: 'pendants',
    categoryLabel: 'Pendants',
    price: 3499,
    compareAtPrice: 4599,
    discountPercent: 24,
    rating: 4.9,
    reviewsCount: 115,
    weight: '11.2g',
    purity: '925 Sterling Silver',
    badge: 'BEST SELLER',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
    description: 'A cluster of faceted blush-pink morganite zirconia blooms flanked by pavé crystal leaves, hanging from an Italian fine box chain.',
    shortDescription: 'Meaningful Designs',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Anti-Tarnish Rhodium',
      dimensions: '28mm x 15mm',
      gemstone: 'Blush Pink Morganite Zirconia',
      claspType: 'Spring Ring',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['festive', 'gifting', 'everyday'],
    style: ['classic', 'festive'],
    inStock: true,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'prod-08',
    slug: 'classic-bangles-set',
    name: 'Classic Silver Bangles Set',
    category: 'bracelets',
    categoryLabel: 'Bracelets',
    price: 2999,
    compareAtPrice: 3999,
    discountPercent: 25,
    rating: 4.8,
    reviewsCount: 142,
    weight: '28.5g',
    purity: '925 Sterling Silver',
    badge: 'BEST SELLER',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    description: 'Pair of solid sterling silver textured kada bangles featuring subtle diamond-cut facets that catch ambient light with every gesture.',
    shortDescription: 'Elegant & Timeless',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Pure Sterling Silver Polish',
      dimensions: 'Size 2.4, 2.6, 2.8 available',
      gemstone: 'None',
      claspType: 'Slip-on / Openable hinge with safety pin',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['everyday', 'festive'],
    style: ['classic', 'statement'],
    inStock: true,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'prod-09',
    slug: 'ornate-polki-silver-choker',
    name: 'Royal Emerald & Polki Bridal Set',
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    price: 7499,
    compareAtPrice: 9999,
    discountPercent: 25,
    rating: 5.0,
    reviewsCount: 72,
    weight: '48.0g',
    purity: '925 Sterling Silver',
    badge: 'BEST SELLER',
    images: [
      '/images/products/necklaces-emerald-polki-bridal-set-01.png',
      '/images/products/necklaces-royal-heritage-polki-choker-01.jpg',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: '/images/products/necklaces-emerald-polki-bridal-set-01.png',
    description: 'A regal Rajputana bridal necklace set sculpted in 925 sterling silver with 22K gold vermeil polish. Features double-tiered uncut polki diamond clusters with Colombian emerald teardrops, matching maang tikka, statement earrings, and openable kada bangles.',
    shortDescription: 'Regal Bridal Masterpiece',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: '22K Antique Gold Micron Polish',
      dimensions: 'Necklace drop 64mm, Tikka 12cm, Earrings 48mm',
      gemstone: 'Grade-AAA Uncut Polki & Hydrothermal Emeralds',
      claspType: 'Handmade Silk Zari Dori with Pearl Bead Tassels',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['festive', 'gifting'],
    style: ['statement', 'festive'],
    inStock: true,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'prod-10',
    slug: 'filigree-silver-kada-bracelet',
    name: 'Filigree Silver Kada Bracelet',
    category: 'bracelets',
    categoryLabel: 'Bracelets',
    price: 2699,
    compareAtPrice: 3499,
    discountPercent: 23,
    rating: 4.7,
    reviewsCount: 67,
    weight: '18.4g',
    purity: '925 Sterling Silver',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop',
    description: 'Intricate silver wire filigree lace handcrafted into a structured cuff that gently contours the wrist. Features an invisible side clasp for seamless wear.',
    shortDescription: 'Elegant & Timeless',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Anti-Tarnish Rhodium',
      dimensions: 'Inner Diameter 58mm',
      gemstone: 'None',
      claspType: 'Concealed Click Lock',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['office', 'festive', 'everyday'],
    style: ['classic', 'minimal'],
    inStock: true,
    featured: true
  },
  {
    id: 'prod-11',
    slug: 'solitaire-halo-silver-ring',
    name: 'Solitaire Halo Silver Ring',
    category: 'rings',
    categoryLabel: 'Rings',
    price: 1699,
    compareAtPrice: 2299,
    discountPercent: 26,
    rating: 4.8,
    reviewsCount: 190,
    weight: '3.9g',
    purity: '925 Sterling Silver',
    badge: 'ENGRAVABLE',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop',
    description: 'A round brilliant solitaire surrounded by a micro-pavé halo, set in high polish 925 silver. Radiates diamond-like brilliance with every movement.',
    shortDescription: 'For Every Occasion',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Platinum Rhodium Plated',
      dimensions: 'Available sizes 10, 12, 14, 16',
      gemstone: '1.5 Carat Equivalent Hearts & Arrows Zirconia',
      claspType: 'Solid Cast Band',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['everyday', 'office', 'gifting'],
    style: ['minimal', 'classic'],
    inStock: true,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'prod-12',
    slug: 'traditional-payal-anklet-pair',
    name: 'Traditional Payal Anklet Pair',
    category: 'anklets',
    categoryLabel: 'Anklets',
    price: 2899,
    compareAtPrice: 3799,
    discountPercent: 24,
    rating: 4.9,
    reviewsCount: 89,
    weight: '22.4g',
    purity: '925 Sterling Silver',
    badge: 'NEW ARRIVAL',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'
    ],
    secondaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
    description: 'Hand-linked pure silver chain anklets adorned with tiny melodic ghungroo bells and sparkling stones. Lightweight and skin-friendly for all-day comfort.',
    shortDescription: 'Subtle & Stylish',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Anti-Oxidation Seal',
      dimensions: '10.5 inches length with adjustable links',
      gemstone: 'Faceted Zirconia Accents',
      claspType: 'S-Hook with Safety Loop',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['everyday', 'festive', 'gifting'],
    style: ['classic', 'festive'],
    inStock: true,
    isNewArrival: true,
    featured: true
  },
  {
    id: 'prod-13',
    slug: 'heritage-royal-polki-choker',
    name: 'Heritage Royal Polki Choker',
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    price: 8999,
    compareAtPrice: 11999,
    discountPercent: 25,
    rating: 5.0,
    reviewsCount: 56,
    weight: '52.0g',
    purity: '925 Sterling Silver',
    badge: 'BEST SELLER',
    images: [
      '/images/products/necklaces-royal-heritage-polki-choker-01.jpg',
      '/images/products/necklaces-emerald-polki-bridal-set-01.png',
      '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg'
    ],
    secondaryImage: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg',
    description: 'An architectural heirloom choker crafted in pure 925 sterling silver with uncut jadau polki medallions and cascading seed pearl tassels. Designed for bridal couture and royal festivities.',
    shortDescription: 'Imperial Heritage Masterpiece',
    details: {
      material: 'Solid 925 Sterling Silver',
      plating: 'Antique Vintage Finish with 22K Gold accents',
      dimensions: 'Width 42mm, Adjustable dori cord',
      gemstone: 'Uncut Jadau Polki, Seed Pearls & Tourmaline',
      claspType: 'Handmade Silk Dori Tie',
      hallmark: 'BIS 925 Hallmarked'
    },
    occasion: ['festive', 'gifting'],
    style: ['statement', 'festive'],
    inStock: true,
    isBestSeller: true,
    featured: true
  }
];

export const CATEGORIES_DATA = [
  {
    id: 'earrings',
    name: 'Earrings',
    tagline: 'Everyday to Extraordinary',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop',
    href: '/collections/earrings'
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    tagline: 'Statement Pieces',
    image: '/images/products/necklaces-emerald-polki-bridal-set-01.png',
    href: '/collections/necklaces'
  },
  {
    id: 'rings',
    name: 'Rings',
    tagline: 'For Every Occasion',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    href: '/collections/rings'
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    tagline: 'Elegant & Timeless',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    href: '/collections/bracelets'
  },
  {
    id: 'pendants',
    name: 'Pendants',
    tagline: 'Meaningful Designs',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop',
    href: '/collections/pendants'
  },
  {
    id: 'anklets',
    name: 'Anklets',
    tagline: 'Subtle & Stylish',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    href: '/collections/anklets'
  }
];

export const OCCASIONS_DATA = [
  {
    id: 'everyday',
    title: 'Everyday Wear',
    subtitle: 'Subtle & Stylish',
    image: '/images/products/necklaces-modern-baroque-pearl-chain-01.png',
    href: '/shop?occasion=everyday'
  },
  {
    id: 'office',
    title: 'Office & Minimal',
    subtitle: 'Sophisticated. You.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    href: '/shop?occasion=office'
  },
  {
    id: 'festive',
    title: 'Festive Looks',
    subtitle: 'Celebrate in Style',
    image: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg',
    href: '/shop?occasion=festive'
  },
  {
    id: 'gifting',
    title: 'Gifting',
    subtitle: 'Make It Special',
    image: '/images/products/necklaces-pearl-blossom-collar-01.png',
    href: '/gifts'
  }
];

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-01',
    customerName: 'Priya S.',
    rating: 5,
    title: 'Exquisite Craftsmanship',
    comment: 'Absolutely stunning designs and amazing quality! The jewellery looks even more beautiful in person. The weight of 925 silver is tangible and the polish is pure luxury.',
    date: 'September 2026',
    verified: true,
    location: 'Jaipur, India',
    purchasedProduct: 'Floral Silver Earrings',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'rev-02',
    customerName: 'Ananya Sharma',
    rating: 5,
    title: 'Perfect Anniversary Gift',
    comment: 'My husband surprised me with the Pearl Blossom necklace and earrings set from MK Silver Hub. The packaging with hallmark certificate and anti-tarnish pouch is so thoughtful.',
    date: 'August 2026',
    verified: true,
    location: 'Mumbai, India',
    purchasedProduct: 'Pearl Blossom Necklace',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'rev-03',
    customerName: 'Meera Rajput',
    rating: 5,
    title: 'Authentic 925 Silver',
    comment: 'Being someone with sensitive skin, pure 925 silver without nickel is essential. I have worn my Kundan Chandbalis all festive week with zero irritation. Exceptional service on WhatsApp too!',
    date: 'July 2026',
    verified: true,
    location: 'New Delhi, India',
    purchasedProduct: 'Kundan Chandbali Earrings',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop'
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    likes: '1,420',
    caption: 'Effortless festive sparkle with our 925 Kundan Chandbalis #MKSilverHub'
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    likes: '980',
    caption: 'Modern minimalism meets royal Jaipur silversmithing.'
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop',
    likes: '2,150',
    caption: 'The Art of Layering: 925 silver chains made for everyday poise.'
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    likes: '1,830',
    caption: 'Crafted for life’s most cherished celebrations.'
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    likes: '1,290',
    caption: 'Delicate ruby halos sculpted in solid sterling silver.'
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    likes: '2,640',
    caption: 'Heirloom details that stay with you forever.'
  }
];
