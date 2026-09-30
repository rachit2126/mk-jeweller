import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Heart, Sparkles, Scale, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="eyebrow">OUR HERITAGE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-espresso)', marginBottom: '16px', lineHeight: 1.15 }}>
            The Story Behind<br />MK Silver Hub
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-muted-text)', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
            Rooted in the timeless silversmithing capital of Jaipur, MK Silver Hub is dedicated to crafting fine 925 sterling silver jewellery that celebrates your unique journey with grace and integrity.
          </p>
        </div>

        {/* Feature Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '480px',
            borderRadius: 'var(--radius-editorial)',
            overflow: 'hidden',
            marginBottom: '64px',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)'
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop"
            alt="MK Silver Hub jewelry heritage"
            fill
            sizes="1000px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '72px' }}>
          <div>
            <span className="eyebrow">OUR ORIGINS</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--color-espresso)', marginBottom: '16px' }}>
              Born in Johari Bazaar, Jaipur
            </h2>
            <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.7, marginBottom: '16px' }}>
              For generations, Jaipur&apos;s Johari Bazaar has been the epicenter of royal gemstone cutting and delicate metal filigree. MK Silver Hub was conceived with a clear vision: to free sterling silver from traditional rigidity and transform it into an everyday luxury statement.
            </p>
            <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.7 }}>
              Every jewel starts with certified 92.5% pure bullion silver, hand-sculpted by hereditary karigars whose ancestral techniques have been refined over centuries.
            </p>
          </div>
          <div style={{ position: 'relative', height: '360px', borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <Image
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
              alt="Jaipur silversmith detail"
              fill
              sizes="500px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div style={{ backgroundColor: 'var(--bg-cream)', borderRadius: 'var(--radius-editorial)', padding: '54px 40px', border: '1px solid var(--color-border)', marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow">OUR PILLARS</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--color-espresso)' }}>
              The Four Cornerstones of MK Silver Hub
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(201, 163, 90, 0.15)', color: 'var(--color-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '6px' }}>100% BIS Hallmarked Purity</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.5 }}>
                  Every piece carries the official Bureau of Indian Standards 925 hallmark stamp, guaranteeing 92.5% pure elemental silver content.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(201, 163, 90, 0.15)', color: 'var(--color-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '6px' }}>Anti-Tarnish Rhodium Seal</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.5 }}>
                  Triple-dipped in rare platinum-group rhodium to prevent natural oxidation and ensure skin-friendly, hypoallergenic wear.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(201, 163, 90, 0.15)', color: 'var(--color-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Scale size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '6px' }}>Ethical Bullion Pricing</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.5 }}>
                  We believe in radical transparency. Pricing reflects certified metal weight and fair artisanal wages without inflated brand markups.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(201, 163, 90, 0.15)', color: 'var(--color-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '6px' }}>Direct Concierge Support</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.5 }}>
                  Reach our jewellery advisors directly over WhatsApp or phone for personalised sizing, gift advice, and bespoke styling consultations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--color-espresso)', borderRadius: 'var(--radius-editorial)', color: '#FFFFFF' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: '12px' }}>
            Experience Jaipur Silversmithing
          </h2>
          <p style={{ color: '#D8D1C7', maxWidth: '540px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
            Discover our latest suites crafted in pure 925 silver with complimentary insured delivery across India.
          </p>
          <Link href="/shop" className="btn-primary" style={{ backgroundColor: '#FCFAF6', color: 'var(--color-espresso)', border: 'none' }}>
            <span>Explore The Collection</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
