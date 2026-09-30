/**
 * Client & Server Analytics Stub (GA4 standard e-commerce events)
 * No-op until a real provider (Google Tag Manager, Segment, PostHog) is connected.
 */

export type AnalyticsEvent =
  | 'view_item_list'
  | 'select_item'
  | 'view_item'
  | 'add_to_wishlist'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'purchase'
  | 'search'
  | 'whatsapp_click'
  | 'newsletter_signup';

export function track(event: AnalyticsEvent, props?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    // Helpful development telemetry
    // console.log(`[Analytics: ${event}]`, props);
  }

  // Safe window check for browser execution
  if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
      event,
      ...props,
      timestamp: new Date().toISOString(),
    });
  }
}
