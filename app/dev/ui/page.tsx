import type { Metadata } from 'next';
import { Star, ArrowRight, ShieldCheck, Heart, ShoppingBag, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Design System & UI Primitives | MK Silver Hub (Internal Dev)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevUIPage() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: 'clamp(2rem, 4vw, 4rem) var(--gutter)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '3rem' }}>
          <span className="badge" style={{ background: 'var(--color-copper)', color: '#fff', marginBottom: '0.5rem', display: 'inline-block' }}>
            INTERNAL QA / DESIGN SYSTEM
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h1)', margin: '0.5rem 0' }}>
            MK Silver Hub — UI Primitives & Design Tokens
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Specification verification for WCAG 2.2 AA accessibility, button variants, badges, typography hierarchy, and state tokens.
          </p>
        </div>

        {/* 1. Brand Color Swatches */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h3)', marginBottom: '1.25rem' }}>
            1. Core Palette Tokens
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { name: '--color-bg', hex: '#F7F4EF', text: '#181715', role: 'Main Page Canvas' },
              { name: '--color-surface', hex: '#FCFAF6', text: '#181715', role: 'Cards & Drawers' },
              { name: '--color-espresso', hex: '#211914', text: '#F7F4EF', role: 'Dark Sections & CTAs' },
              { name: '--color-brown', hex: '#2D211B', text: '#F7F4EF', role: 'Dark Hover / Accents' },
              { name: '--color-copper', hex: '#9A4F2F', text: '#FFFFFF', role: 'Sale & Savings Accent' },
              { name: '--color-champagne', hex: '#C9A35A', text: '#181715', role: 'Luxury Accent ≤5%' },
              { name: '--color-silver', hex: '#B9B7B2', text: '#181715', role: 'Dividers & Hallmark' },
              { name: '--color-sunken', hex: '#EFEBE5', text: '#181715', role: 'Subtle Sections' },
            ].map((col) => (
              <div
                key={col.name}
                style={{
                  background: col.hex,
                  color: col.text,
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '110px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>{col.name}</strong>
                  <code style={{ fontSize: '0.8rem', opacity: 0.85 }}>{col.hex}</code>
                </div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{col.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Button Variants & Sizes */}
        <section style={{
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          marginBottom: '3.5rem'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h3)', marginBottom: '1.25rem' }}>
            2. Button Variants & Touch Targets (&ge;44px)
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
            <button className="btn-primary" style={{ minHeight: '48px' }}>
              PRIMARY (MD) <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" style={{ minHeight: '48px' }}>
              SECONDARY (MD)
            </button>
            <button className="btn-outline" style={{ minHeight: '48px' }}>
              OUTLINE BUTTON
            </button>
            <button className="btn-whatsapp" style={{ minHeight: '48px' }}>
              WHATSAPP BUTTON
            </button>
            <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed', minHeight: '48px' }}>
              DISABLED STATE
            </button>
          </div>

          <div style={{
            background: 'var(--color-espresso)',
            padding: '1.5rem',
            borderRadius: '12px',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: 'var(--color-champagne)', fontSize: '0.85rem', fontWeight: 600 }}>
              DARK SECTION CTAS:
            </span>
            <button className="btn-dark-outline" style={{
              background: 'transparent',
              border: '1px solid var(--color-silver)',
              color: 'var(--color-text-on-dark)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-btn)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              EXPLORE COLLECTION <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* 3. Badges & Chips */}
        <section style={{
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          marginBottom: '3.5rem'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h3)', marginBottom: '1.25rem' }}>
            3. Badges & Metadata Chips
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge" style={{ background: 'var(--color-espresso)', color: '#FCFAF6' }}>
              NEW ARRIVAL
            </span>
            <span className="badge" style={{ background: 'var(--color-surface)', color: 'var(--color-copper)', border: '1px solid var(--color-copper)' }}>
              BEST SELLER
            </span>
            <span className="badge" style={{ background: 'var(--color-sunken)', color: 'var(--color-espresso)' }}>
              ENGRAVABLE
            </span>
            <span className="badge" style={{ background: 'var(--color-copper)', color: '#FFFFFF' }}>
              17% OFF
            </span>
            <span className="badge" style={{ background: '#FFF3E0', color: 'var(--color-warning)', border: '1px solid #FFE0B2' }}>
              ONLY 3 LEFT
            </span>
            <span className="badge" style={{ background: '#E0E0E0', color: '#616161' }}>
              SOLD OUT
            </span>
          </div>
        </section>

        {/* 4. Form Inputs & States */}
        <section style={{
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          marginBottom: '3.5rem'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h3)', marginBottom: '1.25rem' }}>
            4. Form Controls & Validation
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Default Text Input
              </label>
              <input
                type="text"
                placeholder="e.g. Priyanshu Sharma"
                className="input-field"
                defaultValue="Priyanshu Sharma"
                style={{ width: '100%', height: '48px', padding: '0 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Pincode Delivery Check
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="6-digit pincode"
                  defaultValue="302001"
                  maxLength={6}
                  style={{ flex: 1, height: '48px', padding: '0 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
                />
                <button className="btn-primary" style={{ padding: '0 1.25rem', height: '48px' }}>CHECK</button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-error)' }}>
                Error State (aria-invalid)
              </label>
              <input
                type="text"
                defaultValue="invalid-email@"
                aria-invalid="true"
                style={{ width: '100%', height: '48px', padding: '0 1rem', borderRadius: '10px', border: '1.5px solid var(--color-error)', background: '#FFF8F7' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-error)', marginTop: '0.25rem', display: 'block' }}>
                Please enter a valid 10-digit phone or email.
              </span>
            </div>
          </div>
        </section>

        {/* 5. Rating & Price Typography */}
        <section style={{
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          marginBottom: '3.5rem'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h3)', marginBottom: '1.25rem' }}>
            5. Price & Rating Formats
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                STANDARD PRICE ROW (Tabular Nums)
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-espresso)', fontVariantNumeric: 'tabular-nums' }}>
                  ₹2,499
                </span>
                <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--color-text-light)', fontVariantNumeric: 'tabular-nums' }}>
                  ₹3,299
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-copper)', fontWeight: 600 }}>
                  Save ₹800 (24%)
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                STAR RATING (WCAG Champagne Fill)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', color: 'var(--color-champagne)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>4.8</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>(142 reviews)</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Loading Skeletons */}
        <section style={{
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          marginBottom: '3.5rem'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h3)', marginBottom: '1.25rem' }}>
            6. Shimmer Skeleton (Zero CLS placeholder)
          </h2>
          <div style={{ maxWidth: '300px' }}>
            <div className="skeleton" style={{ width: '100%', aspectRatio: '4/5', borderRadius: '12px', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ width: '50%', height: '14px', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ width: '90%', height: '20px', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ width: '40%', height: '18px', borderRadius: '4px' }} />
          </div>
        </section>
      </div>
    </div>
  );
}
