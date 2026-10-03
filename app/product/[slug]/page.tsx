'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';
import ProductCard from '@/components/products/ProductCard';

const CHAIN_LENGTHS = ['16-inch', '18-inch', '20-inch'];
const RING_SIZES = ['Size 6', 'Size 7', 'Size 8', 'Size 9', 'Free Size'];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, toggleWishlist, isInWishlist } = useCommerce();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>('18-inch');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('desc');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setProduct(data.product || null);
          setRelatedProducts(data.relatedProducts || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProduct(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '160px 20px',
          minHeight: '70vh',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '2px solid #E8E7E2',
            borderTopColor: '#111111',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.7s linear infinite',
          }}
        />
        <p style={{ fontFamily: 'var(--font-ui), "Jost", sans-serif', color: '#6F6F6A', fontSize: '0.85rem' }}>
          Loading 925 Sterling Jewellery Piece...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '120px 20px',
          minHeight: '60vh',
          backgroundColor: '#FFFFFF',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
            fontSize: '2.2rem',
            margin: '0 0 12px',
          }}
        >
          Jewellery Piece Not Found
        </h2>
        <p style={{ color: '#6F6F6A', marginBottom: '24px', fontSize: '0.88rem' }}>
          The requested silver jewellery item does not exist or has been archived.
        </p>
        <Link
          href="/shop"
          style={{
            padding: '12px 28px',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            fontSize: '0.74rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Browse All Pieces
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOption);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedOption);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  const isRing = product.category?.toLowerCase() === 'rings';
  const optionsList = isRing ? RING_SIZES : CHAIN_LENGTHS;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
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
        {/* 1. BREADCRUMB (Mockup Screen 5) */}
        <nav
          aria-label="Breadcrumb"
          style={{
            padding: '24px 0 20px',
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
          <Link href={`/shop?category=${product.category}`} style={{ color: '#6F6F6A', textDecoration: 'none', textTransform: 'capitalize' }}>
            {product.category || 'Jewellery'}
          </Link>
          <span>/</span>
          <span style={{ color: '#111111', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* 2. MAIN 2-COLUMN PDP LAYOUT (Mockup Screen 5) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: 'clamp(28px, 4.5vw, 64px)',
            alignItems: 'start',
            marginBottom: '72px',
          }}
          className="pdp-main-grid"
        >
          {/* ================================================================= */}
          {/* LEFT: GALLERY WITH VERTICAL THUMBNAILS & LARGE MAIN VIEW          */}
          {/* ================================================================= */}
          <div style={{ display: 'flex', gap: '16px' }} className="pdp-gallery-container">
            {/* Vertical Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  width: '74px',
                  flexShrink: 0,
                }}
                className="pdp-thumb-strip"
              >
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    style={{
                      position: 'relative',
                      width: '74px',
                      height: '92px',
                      border: selectedImageIdx === idx ? '1.5px solid #111111' : '1px solid #E8E7E2',
                      backgroundColor: '#F8F7F3',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      padding: 0,
                      opacity: selectedImageIdx === idx ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Large Hero Product Photo */}
            <div
              style={{
                position: 'relative',
                flex: 1,
                paddingTop: '118%',
                backgroundColor: '#F8F7F3',
                border: '1px solid #E8E7E2',
                overflow: 'hidden',
              }}
              className="pdp-main-image-wrapper"
            >
              <Image
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                style={{ objectFit: 'cover' }}
              />

              {/* Wishlist Button on Image Top-Right */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              >
                <Heart
                  size={18}
                  fill={isFavorited ? '#111111' : 'none'}
                  color={isFavorited ? '#111111' : '#6F6F6A'}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT: PRODUCT INFORMATION & COMMERCE ACTIONS                    */}
          {/* ================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
                fontWeight: 500,
                color: '#111111',
                margin: '0 0 10px',
                lineHeight: 1.18,
                letterSpacing: '0.02em',
              }}
            >
              {product.name}
            </h1>

            {/* Price & Discount */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '1.45rem',
                  fontWeight: 600,
                  color: '#111111',
                }}
              >
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '1.05rem',
                    color: '#6F6F6A',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {discountPercent && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    backgroundColor: '#F8F7F3',
                    border: '1px solid #D8D5CE',
                    color: '#111111',
                    padding: '3px 8px',
                  }}
                >
                  ({discountPercent}% OFF)
                </span>
              )}
            </div>

            {/* Rating & Reviews */}
            {(product.reviewsCount ?? 0) > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      fill={s <= Math.round(product.rating || 5) ? '#111111' : 'none'}
                      color="#111111"
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.78rem',
                    color: '#6F6F6A',
                    marginLeft: '4px',
                  }}
                >
                  ({product.reviewsCount} {product.reviewsCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.78rem',
                    color: '#8E8D88',
                  }}
                >
                  No reviews yet
                </span>
              </div>
            )}

            {/* Short Editorial Description */}
            <p
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: '#4A4A46',
                margin: '0 0 24px',
                paddingBottom: '20px',
                borderBottom: '1px solid #E8E7E2',
              }}
            >
              {product.description ||
                'A timeless solitaire piece crafted in pure 925 sterling silver with precision diamond-cut stones and hypoallergenic protective rhodium finish.'}
            </p>

            {/* Specifications list */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
              }}
            >
              <div>
                <span style={{ color: '#6F6F6A' }}>Material: </span>
                <strong style={{ color: '#111111', fontWeight: 600 }}>925 Sterling Silver</strong>
              </div>
              <div>
                <span style={{ color: '#6F6F6A' }}>Finish: </span>
                <strong style={{ color: '#111111', fontWeight: 600 }}>Anti-Tarnish Rhodium</strong>
              </div>
            </div>

            {/* Size / Length Selector */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                  color: '#111111',
                }}
              >
                <span>{isRing ? 'Ring Size:' : 'Chain Length:'}</span>
                <Link
                  href="/size-guide"
                  style={{
                    color: '#6F6F6A',
                    textDecoration: 'underline',
                    fontSize: '0.72rem',
                    textTransform: 'none',
                    fontWeight: 400,
                  }}
                >
                  Size Guide
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {optionsList.map((opt) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      style={{
                        padding: '8px 16px',
                        border: isSelected ? '1.5px solid #111111' : '1px solid #E8E7E2',
                        backgroundColor: isSelected ? '#111111' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#111111',
                        fontSize: '0.76rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#111111',
                }}
              >
                Quantity:
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #E8E7E2',
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    width: '36px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-ui), "Jost", sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons (ADD TO BAG & BUY NOW) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  border: '1px solid #111111',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#252525')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
              >
                <ShoppingBag size={16} />
                <span>ADD TO BAG</span>
              </button>

              <button
                onClick={handleBuyNow}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: '1px solid #111111',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F7F3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                BUY NOW
              </button>
            </div>

            {/* Secondary Wishlist / Share Actions */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid #E8E7E2',
                marginBottom: '24px',
              }}
            >
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: isFavorited ? '#111111' : '#6F6F6A',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Heart size={14} fill={isFavorited ? '#111111' : 'none'} />
                <span>{isFavorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={handleShare}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#6F6F6A',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Share2 size={14} />
                <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* 4 Trust Benefits Strip (Mockup Screen 5) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
                padding: '16px',
                backgroundColor: '#F8F7F3',
                border: '1px solid #E8E7E2',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={17} color="#111111" />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#111111' }}>Free Shipping</div>
                  <div style={{ fontSize: '0.68rem', color: '#6F6F6A' }}>Above ₹1,000</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={17} color="#111111" />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#111111' }}>Easy Returns</div>
                  <div style={{ fontSize: '0.68rem', color: '#6F6F6A' }}>7 Days Hassle-Free</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={17} color="#111111" />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#111111' }}>925 Silver</div>
                  <div style={{ fontSize: '0.68rem', color: '#6F6F6A' }}>BIS Hallmarked</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={17} color="#111111" />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#111111' }}>Safe Payments</div>
                  <div style={{ fontSize: '0.68rem', color: '#6F6F6A' }}>100% Encrypted</div>
                </div>
              </div>
            </div>

            {/* Product Accordions (Description, Specs, Shipping, Returns, Reviews) */}
            <div style={{ borderTop: '1px solid #E8E7E2' }}>
              {/* Accordion 1: Description */}
              <div style={{ borderBottom: '1px solid #E8E7E2' }}>
                <button
                  onClick={() => toggleAccordion('desc')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#111111',
                  }}
                >
                  <span>Description</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: activeAccordion === 'desc' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                {activeAccordion === 'desc' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.84rem', lineHeight: 1.6, color: '#4A4A46' }}>
                    <p style={{ margin: 0 }}>
                      Each piece is hand-sculpted in solid 925 sterling silver by master craftsmen in Jaipur. Finished with a protective rhodium layer for unmatched tarnish resistance and everyday durability.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Specifications */}
              <div style={{ borderBottom: '1px solid #E8E7E2' }}>
                <button
                  onClick={() => toggleAccordion('specs')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#111111',
                  }}
                >
                  <span>Specifications</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: activeAccordion === 'specs' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                {activeAccordion === 'specs' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.82rem', lineHeight: 1.6, color: '#4A4A46' }}>
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      <li>Purity: 92.5% Solid Sterling Silver (Hallmarked)</li>
                      <li>Plating: Anti-Tarnish High-Gloss Rhodium Seal</li>
                      <li>Stone: Premium AAA Grade Cubic Zirconia</li>
                      <li>Weight: Approx 4.2 grams</li>
                      <li>Origin: Jaipur, Rajasthan, India</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Returns */}
              <div style={{ borderBottom: '1px solid #E8E7E2' }}>
                <button
                  onClick={() => toggleAccordion('shipping')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#111111',
                  }}
                >
                  <span>Shipping & Returns</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: activeAccordion === 'shipping' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                {activeAccordion === 'shipping' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.84rem', lineHeight: 1.6, color: '#4A4A46' }}>
                    <p style={{ margin: '0 0 8px' }}>
                      Orders are dispatched within 24–48 hours in tamper-proof luxury packaging. Standard insured delivery takes 3–5 business days across India.
                    </p>
                    <p style={{ margin: 0 }}>
                      We offer a 7-day hassle-free return and exchange window on all unworn items with security tag intact.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. RELATED PRODUCTS: "YOU MAY ALSO LIKE" */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '80px', borderTop: '1px solid #E8E7E2', paddingTop: '56px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  margin: '0 0 8px',
                }}
              >
                YOU MAY ALSO LIKE
              </h2>
              <p style={{ fontFamily: 'var(--font-ui), "Jost", sans-serif', fontSize: '0.84rem', color: '#6F6F6A', margin: 0 }}>
                Curated companions to elevate your silver jewellery collection.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  relatedProducts.length === 1
                    ? 'minmax(260px, 320px)'
                    : relatedProducts.length === 2
                    ? 'repeat(auto-fit, minmax(260px, 320px))'
                    : 'repeat(auto-fit, minmax(240px, 1fr))',
                justifyContent: relatedProducts.length < 3 ? 'center' : 'start',
                gap: '24px',
                maxWidth: relatedProducts.length === 1 ? '340px' : relatedProducts.length === 2 ? '700px' : '100%',
                margin: relatedProducts.length < 3 ? '0 auto' : '0',
              }}
            >
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id || p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .pdp-main-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .pdp-gallery-container {
            flex-direction: column-reverse !important;
          }
          .pdp-thumb-strip {
            flex-direction: row !important;
            width: 100% !important;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
