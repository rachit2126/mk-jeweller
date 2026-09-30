export const siteConfig = {
  name: "MK Silver Hub",
  tagline: "Fine 925 Sterling Jewellery",
  positioning: "Modern Silver. Timeless You.",
  phoneDisplay: "+91 74250 58118",
  phoneE164: "+917425058118",
  whatsappUrl: "https://wa.me/917425058118",
  email: "support@mksilverhub.in",
  instagramHandle: "mksilverhub",
  supportHours: "Mon–Sat, 10am–7pm IST",
  currency: "INR",
  locale: "en-IN",
  pricesIncludeGST: true,
  gstRatePercent: 3,
  freeShippingThreshold: 999,
  shippingFee: 99,
  returnWindowDays: 15,
  codAvailable: true,
  firstOrderDiscountPercent: 10,

  // TRUST CLAIMS — each renders ONLY if true.
  // Must be verified with the business before enabling.
  claims: {
    bisHallmark: true,
    antiTarnishRhodium: true,
    bullionLinkedPricing: true,
    panIndiaDelivery: true,
    securePayments: true,
  },

  // Live silver rate — hidden unless a real source is connected.
  silverRate: {
    enabled: false,
    source: null as null | "api" | "manual",
    manualRatePerGram: null as null | number,
    updatedAt: null as null | string,
  },
} as const;

export type SiteConfig = typeof siteConfig;
