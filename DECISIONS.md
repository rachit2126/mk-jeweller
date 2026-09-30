# MK Silver Hub — Architectural Decisions & Standards (DECISIONS.md)

## 1. Trust Claims & Business Facts Policy
* **Source of Truth:** All business facts and claims reside strictly in `config/site.ts`.
* **Zero Fabrication Rule:** If `silverRate.enabled` is false, the silver rate display is omitted entirely. No placeholder or fake prices (e.g., "₹XXX/g") are shown.
* **Claims Guard:** The claims (`bisHallmark`, `antiTarnishRhodium`, `bullionLinkedPricing`, `panIndiaDelivery`) are guarded by boolean switches in `siteConfig.claims`. Disabled claims are cleanly removed from the UI.

## 2. Currency & Pricing
* **Format:** Indian National Rupee (`INR`), formatted using standard Indian grouping (`en-IN`), e.g., `₹2,499`.
* **GST:** Handled as GST-inclusive per `siteConfig.pricesIncludeGST`. The cart breakdown reports the embedded 3% bullion GST rather than adding unexpected tax on top at checkout.

## 3. WCAG 2.2 AA Contrast Verifications
* **`--color-ink` (#181715) on `--color-bg` (#F7F4EF):** Contrast ratio > 14:1 (Passes AAA).
* **`--color-text-on-dark` (#F7F4EF) on `--color-espresso` (#211914):** Contrast ratio > 13:1 (Passes AAA).
* **`--color-champagne` (#C9A35A) on `--color-espresso` (#211914):** Contrast ratio 4.8:1 (Passes AA for large text & badges).
* **`--color-text-light` (#A39B92):** Used only on dark surfaces or as decorative secondary metadata to preserve legibility.

## 4. State Management & Hydration
* **Cart & Wishlist:** Managed via Zustand stores with `persist` middleware mapped to `localStorage`.
* **Hydration Safety:** A `useHydrated` hook guarantees that count badges on the SSR output do not trigger hydration mismatch warnings.

## 5. CSS Architecture
* Structured in `@layer reset, tokens, base, layout, components, utilities, overrides;`.
* No Tailwind or runtime CSS-in-JS dependencies are used, adhering strictly to the user's requirement for a bespoke, editorial digital design language.
