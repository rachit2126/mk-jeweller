import { siteConfig } from '@/config/site';

export type WhatsAppContext =
  | { type: 'general' }
  | { type: 'product'; name: string; url: string; variant?: string; price?: number }
  | { type: 'order'; orderId: string }
  | { type: 'help-choosing' }
  | { type: 'size-help'; category: string };

export function buildWhatsAppUrl(context: WhatsAppContext = { type: 'general' }): string {
  let message = 'Hi MK Silver Hub, I would like to inquire about your fine 925 sterling jewellery.';

  if (context.type === 'product') {
    const variantStr = context.variant ? ` (${context.variant})` : '';
    const priceStr = context.price ? ` priced at ₹${context.price.toLocaleString('en-IN')}` : '';
    message = `Hi MK Silver Hub, I'm interested in ${context.name}${variantStr}${priceStr}. ${context.url} Can you help me with more details?`;
  } else if (context.type === 'order') {
    message = `Hi MK Silver Hub, I need an update regarding my order ${context.orderId}. Can you please assist?`;
  } else if (context.type === 'help-choosing') {
    message = "Hi MK Silver Hub, I'd like help choosing a piece for an upcoming occasion or gift.";
  } else if (context.type === 'size-help') {
    message = `Hi MK Silver Hub, I need guidance with sizing for ${context.category}.`;
  }

  return `${siteConfig.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
