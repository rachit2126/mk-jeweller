# MK SILVER HUB — FINE 925 STERLING JEWELLERY
*Modern Silver. Timeless You.*

A luxury e-commerce storefront for MK Silver Hub, built with Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS design tokens with CSS cascade layers, Zustand with persistence, and WCAG 2.2 AA accessibility.

---

## 1. Quick Start & Scripts

### Prerequisites
- Node.js 18.18+ or 20+ LTS
- npm or pnpm

### Installation & Development
```bash
# Navigate to the workspace
cd mk-silver-hub

# Run development server (port 3000)
npm run dev

# Run full TypeScript check and production build
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 2. Architecture & Design System

### Design Philosophy
- **Editorial Luxury:** 70% editorial luxury, 20% commerce usability, 10% purposeful motion.
- **Palette:** Warm ivory (`#F7F4EF`), cream surface (`#FCFAF6`), deep espresso (`#211914`), with restrained champagne gold (`#C9A35A` ≤5%) and terracotta copper (`#9A4F2F`) accents.
- **Silver as Hero:** Cool, bright silver reflections contrasted against warm, tactile textures.
- **CSS Cascade Layers:** Modern Vanilla CSS without Tailwind, using `@layer reset, tokens, base, layout, components, utilities, overrides;`.

### Key Directory Structure
```
mk-silver-hub/
├── app/
│   ├── (storefront)/         # Homepage, Shop, Collections, PDP, Cart, Wishlist, Search
│   ├── checkout/             # Distraction-free checkout flow
│   ├── account/              # Customer portal, order history & timeline
│   ├── size-guide/           # Indian ring chart, chain lengths & bracelet guide
│   ├── craftsmanship/        # 6-step Jaipur silversmithing narrative
│   ├── jewellery-care/       # Silver cleaning, storage & tarnish prevention
│   ├── shipping/ & returns/  # Switch-guarded policies
│   ├── dev/ui/               # Internal design system QA showcase (noindex)
│   ├── sitemap.ts            # Dynamic XML sitemap
│   ├── robots.ts             # Robots.txt with protected route guards
│   └── manifest.ts           # Web App Manifest
├── components/
│   ├── navigation/           # MainNavbar, AnnouncementBar, MegaMenu, MobileDrawer, MobileBottomNav
│   ├── home/                 # HeroSlider, TrustStrip, BestSellers, Occasions, StyleSelector, etc.
│   ├── products/             # ProductCard (4:5), ProductRail, ProductGrid
│   ├── commerce/             # CartDrawer, QuickViewModal, SearchModal
│   └── ui/                   # BrandLogo, Icons, WhatsAppFloat
├── config/
│   └── site.ts               # Central business facts & trust switches
├── data/
│   └── products.ts           # Curated 925 sterling catalog & mock data
├── lib/
│   ├── api/                  # Commerce API adapter (Mock & HTTP backend adapter)
│   ├── commerce/             # Cart math (pure functions, free shipping, 3% embedded GST)
│   ├── format.ts             # Currency (INR), dates & weights formatters
│   └── whatsapp.ts           # Contextual WhatsApp deep-link builder
├── stores/                   # Zustand stores: cart, wishlist, recently-viewed, recent-searches
└── styles/                   # tokens.css, variables.css, globals.css
```

---

## 3. Configuration & Trust Claims Switches

All business facts and certifications reside exclusively in `config/site.ts`. Components never hardcode claims.

```typescript
export const siteConfig = {
  name: "MK Silver Hub",
  tagline: "Fine 925 Sterling Jewellery",
  positioning: "Modern Silver. Timeless You.",
  phoneDisplay: "+91 74250 58118",
  phoneE164: "+917425058118",
  whatsappUrl: "https://wa.me/917425058118",
  currency: "INR",
  locale: "en-IN",
  pricesIncludeGST: true,
  gstRatePercent: 3,
  freeShippingThreshold: 999,
  returnWindowDays: 15,

  // Trust claims — rendered ONLY when enabled by business
  claims: {
    bisHallmark: true,
    antiTarnishRhodium: true,
    bullionLinkedPricing: false,
    panIndiaDelivery: true,
    securePayments: true,
  },

  // Live silver rate — hidden unless real source is connected
  silverRate: {
    enabled: false,
    source: null,
    manualRatePerGram: null,
    updatedAt: null,
  },
};
```

---

## 4. Connecting a Real Backend & Payment Gateway

### 4.1 Commerce API Adapter (`lib/api/index.ts`)
The storefront communicates via a clean `CommerceAPI` abstraction. To switch from the built-in mock adapter to a live backend (Shopify Storefront, Medusa, or Custom Node/Django API):
1. Implement the interface in `lib/api/http-adapter.ts`.
2. Set the environment variable:
   ```env
   COMMERCE_ADAPTER=http
   NEXT_PUBLIC_API_URL=https://api.mksilverhub.com
   ```

### 4.2 Payment Gateway Integration
- **Recommended for India:** Razorpay or Cashfree.
- In `app/checkout/page.tsx`, the payment step is abstracted. To enable live payments:
  1. Add Razorpay Checkout script in `app/checkout/layout.tsx`.
  2. Call your backend order creation endpoint to obtain `razorpay_order_id`.
  3. Open `new (window as any).Razorpay(options).open()`.
  4. Redirect to `/order-confirmation/[id]` on successful signature verification.

---

## 5. Client Checklist & Open Items Before Launch

| Item | Current Status | Required Client Input |
|---|---|---|
| **Support Email** | Hidden | Provide official email (e.g. `support@mksilverhub.com`) |
| **Grievance Officer** | Placeholder `[CLIENT TO NOMINATE]` | Provide name and physical address for `/privacy` |
| **Legal Terms** | Structured placeholders | Review `/terms` and `/privacy` with legal counsel |
| **Silver Bullion API** | Disabled (`silverRate.enabled: false`) | Connect live MCX silver feed or enable manual daily rate |
| **Product Imagery** | Curated high-res samples | Replace with client studio master photography (see `ASSET_LIST.md`) |
| **GST Registration** | 3% embedded GST configured | Confirm GSTIN number for invoice printing |

---

## 6. Accessibility & Core Web Vitals
- **WCAG 2.2 AA Compliance:** High contrast text pairings, zero color-only feedback, explicit focus rings (`--focus-ring`), keyboard navigation on all modals/accordions.
- **Reduced Motion:** Automatic support via `prefers-reduced-motion` media queries and `useReducedMotion` hook (disables auto-play, parallax, and heavy transforms).
- **Core Web Vitals:** Next/Image with responsive `sizes`, WebP/AVIF formats, `fetchPriority="high"` on LCP hero slide, zero layout shift (CLS = 0) with matching skeleton placeholders.
