import type { Metadata } from 'next';
import Link from 'next/link';
import { Ruler, Sparkles, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Jewellery Size Guide | Ring, Chain & Bracelet Sizing | MK Silver Hub',
  description: 'Find your perfect fit. Indian ring size conversion chart (diameter & circumference mm), chain length comparison guide, and bracelet sizing instructions.',
};

const ringSizes = [
  { indian: '6', diameterMm: '14.6', circumferenceMm: '45.9' },
  { indian: '7', diameterMm: '15.0', circumferenceMm: '47.1' },
  { indian: '8', diameterMm: '15.3', circumferenceMm: '48.1' },
  { indian: '9', diameterMm: '15.6', circumferenceMm: '49.0' },
  { indian: '10', diameterMm: '16.0', circumferenceMm: '50.3' },
  { indian: '11', diameterMm: '16.3', circumferenceMm: '51.2' },
  { indian: '12', diameterMm: '16.6', circumferenceMm: '52.2' },
  { indian: '13', diameterMm: '17.0', circumferenceMm: '53.4' },
  { indian: '14', diameterMm: '17.3', circumferenceMm: '54.3' },
  { indian: '15', diameterMm: '17.6', circumferenceMm: '55.3' },
  { indian: '16', diameterMm: '18.0', circumferenceMm: '56.5' },
  { indian: '17', diameterMm: '18.3', circumferenceMm: '57.5' },
  { indian: '18', diameterMm: '18.6', circumferenceMm: '58.4' },
  { indian: '19', diameterMm: '19.0', circumferenceMm: '59.7' },
  { indian: '20', diameterMm: '19.3', circumferenceMm: '60.6' },
  { indian: '22', diameterMm: '20.0', circumferenceMm: '62.8' },
];

const chainLengths = [
  { length: '16 inches (40 cm)', fit: 'Choker / Collar', bestFor: 'Petite necklines, crew necks, open collars' },
  { length: '18 inches (45 cm)', fit: 'Princess (Most Popular)', bestFor: 'Sits at the collarbone. Ideal for everyday pendants' },
  { length: '20 inches (50 cm)', fit: 'Matinee', bestFor: 'Sits just below collarbone. Elegant with plunge necklines' },
  { length: '22–24 inches (55–60 cm)', fit: 'Opera', bestFor: 'Dramatic evening wear, high neck tops and layered looks' }
];

export default function SizeGuidePage() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Editorial Header */}
      <section style={{
        background: 'var(--color-espresso)',
        color: 'var(--color-text-on-dark)',
        padding: 'clamp(3rem, 5vw, 5rem) var(--gutter)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne)', marginBottom: '0.75rem' }}>
            ACCURACY & ELEGANCE
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-h1)',
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: '1rem',
            color: '#FCFAF6'
          }}>
            Jewellery Size & Fit Guide
          </h1>
          <p style={{
            fontSize: 'var(--fs-body)',
            color: 'rgba(247,244,239,0.78)',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Every silver piece should feel like second skin. Use our verified Indian standard sizing tables and simple measurement techniques.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 var(--gutter)' }}>
        {/* Navigation Quicklinks */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          margin: '2rem 0 3rem'
        }}>
          <a href="#ring-sizing" className="btn-secondary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
            Ring Size Chart
          </a>
          <a href="#how-to-measure" className="btn-secondary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
            How to Measure at Home
          </a>
          <a href="#chain-guide" className="btn-secondary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
            Chain & Necklace Lengths
          </a>
          <a href="#bangle-guide" className="btn-secondary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
            Bangle & Bracelet Sizes
          </a>
        </div>

        {/* Ring Sizing Chart */}
        <section id="ring-sizing" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Ruler size={24} style={{ color: 'var(--color-copper)' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)', margin: 0 }}>
              Indian Standard Ring Size Chart
            </h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            All MK Silver Hub rings are crafted in precision Indian jeweller sizes. If between two sizes, we recommend ordering the larger size.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-sunken)' }}>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>Indian Ring Size</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>Inner Diameter (mm)</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>Inner Circumference (mm)</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>US / Canada Equivalent</th>
                </tr>
              </thead>
              <tbody>
                {ringSizes.map((row, idx) => (
                  <tr
                    key={row.indian}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(239,235,229,0.3)'
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
                      Size {row.indian}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontVariantNumeric: 'tabular-nums' }}>
                      {row.diameterMm} mm
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontVariantNumeric: 'tabular-nums' }}>
                      {row.circumferenceMm} mm
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>
                      approx. US {(parseFloat(row.indian) * 0.45 + 1.5).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Measure at Home */}
        <section id="how-to-measure" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)', marginBottom: '1.5rem' }}>
            How to Measure Your Ring Size at Home
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'var(--color-bg)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-espresso)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                marginBottom: '1rem'
              }}>1</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>The Paper Strip Method</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Cut a thin strip of paper (~10cm long). Wrap it snugly around the base of the finger you plan to wear the ring on.
              </p>
            </div>

            <div style={{
              background: 'var(--color-bg)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-espresso)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                marginBottom: '1rem'
              }}>2</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Mark the Overlap</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Mark the exact point where the paper meets with a fine pen. Ensure it can slide gently over your knuckle.
              </p>
            </div>

            <div style={{
              background: 'var(--color-bg)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-espresso)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                marginBottom: '1rem'
              }}>3</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Measure with a Ruler</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Lay the paper flat and measure the distance in millimetres. Match your circumference in our chart above.
              </p>
            </div>
          </div>
        </section>

        {/* Chain & Necklace Lengths */}
        <section id="chain-guide" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)', marginBottom: '1rem' }}>
            Chain & Necklace Length Guide
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Discover how each chain length falls naturally on the neckline to style solo or layered.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {chainLengths.map((item) => (
              <div key={item.length} style={{
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '1.25rem',
                background: 'var(--color-bg)'
              }}>
                <span className="badge" style={{ background: 'var(--color-sunken)', color: 'var(--color-espresso)', marginBottom: '0.5rem', display: 'inline-block' }}>
                  {item.fit}
                </span>
                <h3 style={{ fontSize: '1.15rem', margin: '0.25rem 0 0.5rem', fontWeight: 600 }}>{item.length}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {item.bestFor}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bangles & Bracelets */}
        <section id="bangle-guide" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)', marginBottom: '1rem' }}>
            Bangle & Bracelet Sizing
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            For traditional silver kadas and bangles, measure across the widest part of your hand when bringing your fingers together. Most chain bracelets at MK Silver Hub include a 1-inch extender for an adjustable fit.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
              <strong>Size 2-4:</strong> 2.25 inches (57.2 mm inner diameter)
            </div>
            <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
              <strong>Size 2-6:</strong> 2.37 inches (60.3 mm inner diameter)
            </div>
            <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
              <strong>Size 2-8:</strong> 2.50 inches (63.5 mm inner diameter)
            </div>
            <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
              <strong>Size 2-10:</strong> 2.62 inches (66.7 mm inner diameter)
            </div>
          </div>
        </section>

        {/* Sizing Help CTA */}
        <div style={{
          background: 'var(--color-sunken)',
          borderRadius: 'var(--radius-card)',
          padding: '2.5rem',
          textAlign: 'center',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            Still unsure of your size?
          </h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Our jewellery specialists can verify your measurements before placing an order.
          </p>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Ask Sizing Expert on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
