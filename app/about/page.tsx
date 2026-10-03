'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Award, Heart, PackageOpen } from 'lucide-react';

interface AboutSectionItem {
  title: string;
  description: string;
  icon?: string;
}

interface AboutSection {
  id: string;
  type: 'hero' | 'values' | 'cta' | string;
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: AboutSectionItem[];
}

interface AboutContentDoc {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  author?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  sections?: AboutSection[];
}

export default function AboutPage() {
  const [doc, setDoc] = useState<AboutContentDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAboutContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content?slug=/about');
      if (res.ok) {
        const data = await res.json();
        setDoc(data.item || null);
      } else {
        setDoc(null);
      }
    } catch (err) {
      console.error('Failed to load about page content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutContent();

    const handleContentUpdated = () => {
      fetchAboutContent();
    };

    window.addEventListener('mk:content-updated', handleContentUpdated);
    return () => {
      window.removeEventListener('mk:content-updated', handleContentUpdated);
    };
  }, [fetchAboutContent]);

  // Section selectors from MongoDB document
  const sections = Array.isArray(doc?.sections) ? doc.sections : [];
  const heroSection = sections.find((s) => s.type === 'hero' || s.id === 'sec-about-hero');
  const valuesSection = sections.find((s) => s.type === 'values' || s.id === 'sec-about-values');
  const ctaSection = sections.find((s) => s.type === 'cta' || s.id === 'sec-about-cta');
  const customSections = sections.filter(
    (s) => s.id !== heroSection?.id && s.id !== valuesSection?.id && s.id !== ctaSection?.id
  );

  const getPillarIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'award':
        return <Award size={24} color="#111111" />;
      case 'sparkles':
        return <Sparkles size={24} color="#111111" />;
      case 'heart':
        return <Heart size={24} color="#111111" />;
      case 'shieldcheck':
      default:
        return <ShieldCheck size={24} color="#111111" />;
    }
  };

  const hasAnyContent = Boolean(
    heroSection || valuesSection || ctaSection || customSections.length > 0 || doc?.content
  );

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#111111',
        minHeight: '100vh',
        padding: '0 0 100px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            padding: '24px 0 32px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
            color: '#6F6F6A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link href="/" style={{ color: '#6F6F6A', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: '#111111', fontWeight: 600 }}>{doc?.title ? 'Our Story' : 'About'}</span>
        </nav>

        {loading ? (
          <div
            style={{
              padding: '120px 20px',
              textAlign: 'center',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              color: '#6F6F6A',
              fontSize: '0.86rem',
            }}
          >
            Loading MK Silver Hub editorial content...
          </div>
        ) : !hasAnyContent ? (
          /* MongoDB Empty State */
          <div
            style={{
              padding: '100px 24px',
              textAlign: 'center',
              backgroundColor: '#FAFAF8',
              border: '1px solid #E8E7E2',
              borderRadius: '8px',
              maxWidth: '680px',
              margin: '40px auto',
            }}
          >
            <PackageOpen size={36} color="#8E8D88" style={{ margin: '0 auto 16px' }} />
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.8rem',
                fontWeight: 500,
                color: '#111111',
                margin: '0 0 10px',
              }}
            >
              Section Under Curation
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.88rem',
                color: '#6F6F6A',
                lineHeight: 1.6,
                margin: '0 0 24px',
              }}
            >
              This about section has been removed or is currently being updated in the content management system.
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <span>Explore Jewellery</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            {/* HERO EDITORIAL STORY (Dynamic from MongoDB) */}
            {heroSection && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
                  gap: 'clamp(32px, 5vw, 64px)',
                  alignItems: 'center',
                  marginBottom: '80px',
                }}
                className="about-hero-grid"
              >
                {/* Left Text */}
                <div>
                  {heroSection.subtitle && (
                    <span
                      style={{
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#6F6F6A',
                        display: 'block',
                        marginBottom: '14px',
                      }}
                    >
                      {heroSection.subtitle}
                    </span>
                  )}
                  <h1
                    style={{
                      fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                      fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                      fontWeight: 500,
                      lineHeight: 1.12,
                      margin: '0 0 20px',
                      color: '#111111',
                      textTransform: 'uppercase',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {heroSection.title}
                  </h1>
                  {heroSection.content ? (
                    <div
                      style={{
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.96rem',
                        lineHeight: 1.7,
                        color: '#4A4A46',
                        margin: '0 0 28px',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {heroSection.content}
                    </div>
                  ) : null}
                  {heroSection.buttonText && (
                    <Link
                      href={heroSection.buttonUrl || '/shop'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '14px 32px',
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                      }}
                    >
                      <span>{heroSection.buttonText}</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>

                {/* Right Craftsman Image */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '110%',
                    backgroundColor: '#F8F7F3',
                    border: '1px solid #E8E7E2',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={heroSection.image || doc?.coverImage || '/images/why-choose/master-craftsmanship-detail.jpg'}
                    alt="Artisan sculpting 925 silver jewellery in Jaipur"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}

            {/* 4 CORNERSTONES / PILLARS SECTION (Dynamic from MongoDB) */}
            {valuesSection && (
              <div
                style={{
                  backgroundColor: '#F8F7F3',
                  border: '1px solid #E8E7E2',
                  padding: 'clamp(44px, 5.5vw, 68px) clamp(24px, 4vw, 56px)',
                  marginBottom: '80px',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  {valuesSection.subtitle && (
                    <span
                      style={{
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#6F6F6A',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      {valuesSection.subtitle}
                    </span>
                  )}
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                      fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                      fontWeight: 500,
                      color: '#111111',
                      margin: 0,
                    }}
                  >
                    {valuesSection.title}
                  </h2>
                </div>

                {Array.isArray(valuesSection.items) && valuesSection.items.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '36px',
                    }}
                  >
                    {valuesSection.items.map((item, idx) => (
                      <div key={idx}>
                        <div style={{ marginBottom: '14px' }}>
                          {getPillarIcon(item.icon)}
                        </div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            margin: '0 0 8px',
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            fontFamily: 'var(--font-ui)',
                            fontSize: '0.84rem',
                            color: '#6F6F6A',
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom CMS Sections */}
            {customSections.map((sec) => (
              <div
                key={sec.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E7E2',
                  padding: '40px clamp(20px, 4vw, 48px)',
                  marginBottom: '60px',
                }}
              >
                {sec.subtitle && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#6F6F6A',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    {sec.subtitle}
                  </span>
                )}
                <h2
                  style={{
                    fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                    fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
                    fontWeight: 500,
                    margin: '0 0 16px',
                  }}
                >
                  {sec.title}
                </h2>
                {sec.content && (
                  <p
                    style={{
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      fontSize: '0.92rem',
                      color: '#4A4A46',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line',
                      margin: 0,
                    }}
                  >
                    {sec.content}
                  </p>
                )}
              </div>
            ))}

            {/* BOTTOM FULL-WIDTH BLACK EDITORIAL CALL TO ACTION (Dynamic from MongoDB) */}
            {ctaSection && (
              <div
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  padding: 'clamp(48px, 6vw, 72px) clamp(24px, 4vw, 56px)',
                  textAlign: 'center',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                    fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
                    fontWeight: 500,
                    margin: '0 0 12px',
                  }}
                >
                  {ctaSection.title}
                </h2>
                {ctaSection.subtitle && (
                  <p
                    style={{
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      color: '#BFC1C4',
                      maxWidth: '520px',
                      margin: '0 auto 28px',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {ctaSection.subtitle}
                  </p>
                )}
                {ctaSection.buttonText && (
                  <Link
                    href={ctaSection.buttonUrl || '/shop'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 34px',
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{ctaSection.buttonText}</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
