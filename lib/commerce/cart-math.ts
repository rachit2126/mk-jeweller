import { siteConfig } from '@/config/site';

export interface CartLineItem {
  id: string;
  price: number;
  quantity: number;
  compareAtPrice?: number;
  customEngravingFee?: number;
}

export function calculateSubtotal(items: CartLineItem[]): number {
  return items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity + (item.customEngravingFee || 0);
    return sum + itemTotal;
  }, 0);
}

export function calculateShipping(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.shippingFee;
}

export function calculateAmountForFreeShipping(subtotal: number): number {
  return Math.max(0, siteConfig.freeShippingThreshold - subtotal);
}

export function calculateEmbeddedGST(total: number, gstRatePercent: number = siteConfig.gstRatePercent): number {
  if (total <= 0) return 0;
  // If price is GST-inclusive: GST = Total - (Total / (1 + Rate / 100))
  const base = total / (1 + gstRatePercent / 100);
  return Math.round(total - base);
}

export function calculateCartSummary(
  items: CartLineItem[],
  discountAmount: number = 0
) {
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(subtotal);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const total = discountedSubtotal + shipping;
  const embeddedGST = calculateEmbeddedGST(total);

  return {
    subtotal,
    discountAmount,
    shipping,
    total,
    embeddedGST,
    freeShippingUnlocked: subtotal >= siteConfig.freeShippingThreshold,
    amountNeededForFreeShipping: calculateAmountForFreeShipping(subtotal)
  };
}
