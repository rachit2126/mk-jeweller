import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | MK Silver Hub',
  description: 'Privacy policy and data protection guidelines for MK Silver Hub online store.',
};

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: 'clamp(3rem, 5vw, 5rem) var(--gutter)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', background: 'var(--color-surface)', padding: 'clamp(2rem, 4vw, 3.5rem)', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
        <p className="eyebrow" style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          LEGAL & COMPLIANCE
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h1)', marginBottom: '1.5rem' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
          Last Updated: 29 September 2026 · [CLIENT TO PROVIDE FINAL LEGAL TEXT]
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--color-text)' }}>
          <div style={{ background: 'var(--color-sunken)', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-copper)' }}>
            <strong>Notice to Business Counsel:</strong> The sections below are drafted as structured policy placeholders in accordance with standard Indian e-commerce consumer guidelines. Replace bracketed fields before production deployment.
          </div>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              1. Information We Collect
            </h2>
            <p>
              When you purchase or browse through <strong>{siteConfig.name}</strong>, we collect personal information you share with us such as your name, delivery address, phone number (+91), email address, and IP address for checkout facilitation, pincode verification, and automated transaction updates.
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              [LEGAL TEXT REQUIRED: Specific cookie disclosure, third-party pixel tags, and analytics tracking specifics].
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              2. Payment Security & Processing
            </h2>
            <p>
              All online payment transactions are processed through certified PCI-DSS Level 1 compliant payment gateways. <strong>{siteConfig.name}</strong> does not store, process, or have access to your raw credit/debit card numbers or UPI PINs.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              3. Communication & WhatsApp Updates
            </h2>
            <p>
              By opting into order tracking, you consent to receive transactional notifications regarding dispatch, delivery tracking, and invoice receipts via SMS, WhatsApp, and email. You can opt out of promotional messages at any time.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              4. Contact the Grievance Officer
            </h2>
            <p>
              Under the Indian Information Technology Act 2000 and consumer rules, any inquiries or grievances regarding privacy data may be addressed to:
            </p>
            <div style={{ background: 'var(--color-bg)', padding: '1.25rem', borderRadius: '8px', marginTop: '0.75rem' }}>
              <p><strong>Grievance Officer:</strong> [CLIENT TO NOMINATE OFFICER]</p>
              <p><strong>Entity:</strong> {siteConfig.name}</p>
              <p><strong>Helpline:</strong> {siteConfig.phoneDisplay}</p>
              <p><strong>Direct Inquiries:</strong> <a href={siteConfig.whatsappUrl} style={{ textDecoration: 'underline' }}>WhatsApp Support</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
