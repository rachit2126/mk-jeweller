import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Service | MK Silver Hub',
  description: 'Terms and conditions of sale, shipping, returns, and authenticity for MK Silver Hub.',
};

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: 'clamp(3rem, 5vw, 5rem) var(--gutter)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', background: 'var(--color-surface)', padding: 'clamp(2rem, 4vw, 3.5rem)', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
        <p className="eyebrow" style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          TERMS & CONDITIONS
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h1)', marginBottom: '1.5rem' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
          Effective: 29 September 2026 · [CLIENT TO PROVIDE FINAL LEGAL TEXT]
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--color-text)' }}>
          <div style={{ background: 'var(--color-sunken)', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-copper)' }}>
            <strong>Notice to Business Counsel:</strong> The sections below are drafted as structured policy placeholders in accordance with standard Indian e-commerce consumer guidelines. Replace bracketed fields before production deployment.
          </div>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              1. Purity & Silver Authenticity
            </h2>
            <p>
              All sterling jewellery sold on <strong>{siteConfig.name}</strong> is crafted from solid 925 Sterling Silver (containing 92.5% pure silver alloyed with copper/zinc for durable structural resilience). Every authentic piece carries an inscribed 925 hallmark.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              2. Pricing, Taxes & Invoicing
            </h2>
            <p>
              All prices quoted on the storefront are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax ({siteConfig.gstRatePercent}% GST) as per Government of India regulations. We reserve the right to revise catalog prices based on bullion silver rate fluctuations.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              3. Custom & Engraved Orders
            </h2>
            <p>
              Custom-engraved and made-to-order pieces are strictly final sale and cannot be returned or cancelled once fabrication has commenced, except in the rare event of a manufacturing defect.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              4. Governing Law & Jurisdiction
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              [LEGAL TEXT REQUIRED: Any dispute or claim arising out of or in connection with this contract shall be governed by Indian law and subject to the exclusive jurisdiction of the courts of Jaipur, Rajasthan.]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
