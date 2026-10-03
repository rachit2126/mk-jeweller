'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import CollectionImage from '@/components/collections/CollectionImage';
import { DbCollection } from '@/lib/db/types';

interface CollectionsClientProps {
  initialCollections?: DbCollection[];
}

export default function CollectionsClient({
  initialCollections = [],
}: CollectionsClientProps) {
  const [collections, setCollections] = useState<DbCollection[]>(initialCollections);
  const [loading, setLoading] = useState<boolean>(initialCollections.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    // Only show full skeleton on initial load if no collections yet
    if (collections.length === 0) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch('/api/collections', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) {
        throw new Error(`Failed to load collections (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (Array.isArray(data.collections)) {
        const activeCols = data.collections.filter(
          (c: DbCollection) => c.status === 'active'
        );
        setCollections(activeCols);
      } else {
        setCollections([]);
      }
    } catch (err: any) {
      console.error('[Collections Page] Failed to fetch collections from database:', err);
      if (collections.length === 0) {
        setError(err?.message || 'Collections could not be loaded at this time.');
      }
    } finally {
      setLoading(false);
    }
  }, [collections.length]);

  useEffect(() => {
    fetchCollections();

    // Listen for admin collection updates across tabs or windows
    const handleCollectionUpdate = () => {
      fetchCollections();
    };

    window.addEventListener('mk:collection-updated', handleCollectionUpdate);
    window.addEventListener('focus', handleCollectionUpdate);

    return () => {
      window.removeEventListener('mk:collection-updated', handleCollectionUpdate);
      window.removeEventListener('focus', handleCollectionUpdate);
    };
  }, [fetchCollections]);


  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#111111',
        minHeight: '100vh',
        paddingBottom: '100px',
      }}
    >
      <div
        style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            padding: '20px 0 24px',
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
          <span style={{ color: '#C5C4BE' }}>/</span>
          <span style={{ color: '#111111', fontWeight: 600 }}>Collections</span>
        </nav>

        {/* 5. HERO / PAGE HEADER */}
        <header
          style={{
            textAlign: 'center',
            margin: '8px auto 48px',
            maxWidth: '720px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px',
            }}
          >
            <Sparkles size={11} color="#8A8882" aria-hidden="true" />
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
              }}
            >
              CURATED SILVER STORIES
            </span>
            <Sparkles size={11} color="#8A8882" aria-hidden="true" />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2.2rem, 4.2vw, 3.6rem)',
              fontWeight: 400,
              color: '#111111',
              margin: '0 0 14px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
            }}
          >
            THE COLLECTIONS
          </h1>

          {/* Minimal Silver Jewellery Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              margin: '0 auto 16px',
              maxWidth: '180px',
            }}
            aria-hidden="true"
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#D8D6CE' }} />
            <div
              style={{
                width: '5px',
                height: '5px',
                transform: 'rotate(45deg)',
                backgroundColor: '#8A8882',
              }}
            />
            <div style={{ flex: 1, height: '1px', backgroundColor: '#D8D6CE' }} />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: 'clamp(0.88rem, 1.4vw, 0.98rem)',
              color: '#6F6F6A',
              lineHeight: 1.6,
              margin: '0',
            }}
          >
            Discover thoughtfully curated 925 sterling silver jewellery, from everyday
            essentials to statement pieces.
          </p>
        </header>

        {/* 18. API ERROR STATE */}
        {error && !loading && collections.length === 0 && (
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: '48px 24px',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '32px auto',
              borderRadius: '2px',
            }}
            role="alert"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                backgroundColor: '#F0EEE8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6F6F6A',
              }}
            >
              <AlertCircle size={20} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.4rem',
                color: '#111111',
                margin: '0 0 8px',
                fontWeight: 600,
              }}
            >
              Collections couldn&apos;t be loaded.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.86rem',
                color: '#6F6F6A',
                marginBottom: '20px',
              }}
            >
              Please check your connection and try again.
            </p>
            <button
              onClick={() => fetchCollections()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                transition: 'background-color 0.2s ease',
              }}
            >
              <RefreshCw size={12} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 16. LOADING STATE (Skeleton Cards) */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: '28px',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F8F7F3',
                  border: '1px solid #ECEAE3',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '80%',
                    backgroundColor: '#F0EEE8',
                  }}
                  className="animate-pulse"
                />
                <div style={{ padding: '24px 20px', flex: 1 }}>
                  <div
                    style={{
                      height: '10px',
                      width: '35%',
                      backgroundColor: '#E8E6DF',
                      marginBottom: '10px',
                    }}
                    className="animate-pulse"
                  />
                  <div
                    style={{
                      height: '20px',
                      width: '70%',
                      backgroundColor: '#DFDDD6',
                      marginBottom: '12px',
                    }}
                    className="animate-pulse"
                  />
                  <div
                    style={{
                      height: '12px',
                      width: '90%',
                      backgroundColor: '#E8E6DF',
                      marginBottom: '8px',
                    }}
                    className="animate-pulse"
                  />
                  <div
                    style={{
                      height: '12px',
                      width: '60%',
                      backgroundColor: '#E8E6DF',
                      marginBottom: '20px',
                    }}
                    className="animate-pulse"
                  />
                  <div
                    style={{
                      height: '12px',
                      width: '45%',
                      backgroundColor: '#D8D6CE',
                    }}
                    className="animate-pulse"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 17. EMPTY STATE */}
        {!loading && !error && collections.length === 0 && (
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #ECEAE3',
              padding: '64px 24px',
              textAlign: 'center',
              maxWidth: '540px',
              margin: '32px auto',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.6rem',
                color: '#111111',
                margin: '0 0 10px',
              }}
            >
              No collections available yet.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.88rem',
                color: '#6F6F6A',
                marginBottom: '24px',
              }}
            >
              New collections will appear here soon.
            </p>
            <Link
              href="/admin/collections"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                border: '1px solid #111111',
                color: '#111111',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
              }}
            >
              <span>Manage Collections</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {/* 6. MAIN COLLECTION GRID (Desktop: 3 cols, Tablet: 2 cols, Mobile: 1 col) */}
        {!loading && !error && collections.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
              gap: '28px',
            }}
          >
            {collections.map((col) => {
              const eyebrow =
                col.type === 'automatic'
                  ? 'SIGNATURE EDIT'
                  : 'CURATED SUITE';

              const collectionUrl = `/collections/${col.slug}`;

              return (
                <article
                  key={col.id || col.slug}
                  className="group"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #ECEAE3',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 28px -6px rgba(0, 0, 0, 0.05), 0 4px 8px -2px rgba(0, 0, 0, 0.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Collection Image Container */}
                  <Link
                    href={collectionUrl}
                    style={{
                      display: 'block',
                      position: 'relative',
                      width: '100%',
                      paddingTop: '80%', // ~5:4 ratio
                      overflow: 'hidden',
                      backgroundColor: '#F8F7F3',
                      textDecoration: 'none',
                    }}
                    aria-label={`View ${col.name} collection`}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="group-hover:scale-[1.03]"
                    >
                      <CollectionImage
                        src={col.thumbnail}
                        alt={col.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div
                    style={{
                      padding: '24px 22px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      justifyContent: 'space-between',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <div>
                      {/* Eyebrow */}
                      <span
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: '#8A8882',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        {eyebrow}
                      </span>

                      {/* Collection Title */}
                      <h2
                        style={{
                          fontFamily: 'var(--font-heading), "Cormorant Garamond", Georgia, serif',
                          fontSize: '1.45rem',
                          fontWeight: 500,
                          color: '#111111',
                          margin: '0 0 8px',
                          letterSpacing: '0.02em',
                          lineHeight: 1.25,
                        }}
                      >
                        <Link
                          href={collectionUrl}
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                          }}
                        >
                          {col.name}
                        </Link>
                      </h2>

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.84rem',
                          color: '#6F6F6A',
                          lineHeight: 1.55,
                          margin: '0 0 20px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {col.description || 'Hallmark certified 925 sterling silver curation.'}
                      </p>
                    </div>

                    {/* CTA Link */}
                    <div>
                      <Link
                        href={collectionUrl}
                        className="group/cta"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: '#111111',
                          textDecoration: 'none',
                          borderBottom: '1px solid #111111',
                          paddingBottom: '3px',
                          width: 'fit-content',
                          transition: 'color 0.2s ease, border-color 0.2s ease',
                        }}
                      >
                        <span>DISCOVER COLLECTION</span>
                        <ArrowRight
                          size={12}
                          className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}


        {/* 13. SECONDARY SECTION ("EXPLORE YOUR STYLE") */}
        {!loading && !error && collections.length > 0 && (
          <section style={{ marginTop: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#8A8882',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                CURATED FOR EVERY AESTHETIC
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading), "Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                  fontWeight: 400,
                  color: '#111111',
                  margin: '0 0 10px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                EXPLORE YOUR STYLE
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.88rem',
                  color: '#6F6F6A',
                  margin: 0,
                }}
              >
                Find designs thoughtfully crafted to elevate your personal expression.
              </p>
            </div>

            {/* Quick Navigation Cards from Real Active Collections */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                gap: '18px',
              }}
            >
              {collections.slice(0, 6).map((item) => (
                <Link
                  key={item.id || item.slug}
                  href={`/collections/${item.slug}`}
                  className="group"
                  style={{
                    backgroundColor: '#F8F7F3',
                    border: '1px solid #ECEAE3',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F2F0EA';
                    e.currentTarget.style.borderColor = '#D8D6CE';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8F7F3';
                    e.currentTarget.style.borderColor = '#ECEAE3';
                  }}
                >
                  {/* Mini Thumb */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      position: 'relative',
                      flexShrink: 0,
                      overflow: 'hidden',
                      backgroundColor: '#ECEAE3',
                    }}
                  >
                    <CollectionImage
                      src={item.thumbnail}
                      alt={item.name}
                      fill
                      sizes="56px"
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading), "Cormorant Garamond", Georgia, serif',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#111111',
                        margin: '0 0 2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </h3>
                    <span
                      style={{
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.68rem',
                        color: '#6F6F6A',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 500,
                      }}
                    >
                      <span>Explore</span>
                      <ArrowRight
                        size={10}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
