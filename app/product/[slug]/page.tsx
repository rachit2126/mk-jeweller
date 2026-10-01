'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Star,
  MessageCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  RotateCw,
  Maximize2
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';
import ProductCard from '@/components/products/ProductCard';
import { useRecentlyViewedStore } from '@/stores/recently-viewed';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addRecentlyViewed = useRecentlyViewedStore(state => state.addSlug);

  const { addToCart, toggleWishlist, isInWishlist } = useCommerce();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard Size');
  const [activeTab, setActiveTab] = useState<'images' | '360'>('images');
  const [spinDegree, setSpinDegree] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    addRecentlyViewed(slug);

    let isMounted = true;
    setLoading(true);

    fetch(`/api/products/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
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
  }, [slug, addRecentlyViewed]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '140px 20px', minHeight: '60vh', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(183, 110, 121, 0.2)', borderTopColor: '#B76E79', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-muted-text)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Loading Jaipur Hallmarked Silver...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', minHeight: '60vh', backgroundColor: 'var(--bg-main)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-muted-text)', margin: '12px 0 24px' }}>The jewellery piece you are seeking does not exist or has been archived.</p>
        <Link href="/shop" className="btn-primary">Browse All Jewellery</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const whatsappMessage = `Hi MK Silver Hub, I'm interested in ${product.name} (${formatPrice(product.price)}). Can you help me with more details?`;
  const whatsappUrl = `https://wa.me/917425058118?text=${encodeURIComponent(whatsappMessage)}`;

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    router.push('/checkout');
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  // 360 Spin auto simulation
  const handleRotate360 = () => {
    setIsSpinning(true);
    let deg = spinDegree;
    const interval = setInterval(() => {
      deg += 15;
      setSpinDegree(deg);
      if (deg >= spinDegree + 360) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 40);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '36px 0 100px' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-muted-text)', marginBottom: '32px' }}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <Link href={`/collections/${product.category}`}>{product.categoryLabel}</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Grid: 55-60% Gallery | 40-45% Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 1fr',
            gap: '54px',
            alignItems: 'start'
          }}
          className="product-detail-grid"
        >
          {/* LEFT: Gallery & 360 Viewer */}
          <div>
            {/* View Mode Toggle: Standard Photography vs 360° View */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button
                onClick={() => setActiveTab('images')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: activeTab === 'images' ? 'var(--color-espresso)' : 'var(--bg-cream)',
                  color: activeTab === 'images' ? '#FFFFFF' : 'var(--color-espresso)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease'
                }}
              >
                Photography Gallery
              </button>
              <button
                onClick={() => setActiveTab('360')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: activeTab === '360' ? 'var(--color-espresso)' : 'var(--bg-cream)',
                  color: activeTab === '360' ? '#FFFFFF' : 'var(--color-espresso)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease'
                }}
              >
                <RotateCw size={14} />
                <span>Interactive 360° Spin</span>
              </button>
            </div>

            {activeTab === 'images' ? (
              <div style={{ display: 'flex', gap: '16px' }} className="gallery-layout">
                {/* Thumbnails Column (Desktop) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="gallery-thumbs">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      style={{
                        position: 'relative',
                        width: '74px',
                        height: '92px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: selectedImageIdx === idx ? '2px solid var(--color-champagne)' : '1px solid var(--color-border)',
                        opacity: selectedImageIdx === idx ? 1 : 0.65,
                        transition: 'all 0.2s ease',
                        backgroundColor: '#F0ECE6'
                      }}
                    >
                      <Image src={img} alt="Thumbnail" fill sizes="80px" style={{ objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>

                {/* Main Hero Photo Container */}
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    height: '560px',
                    borderRadius: 'var(--radius-editorial)',
                    overflow: 'hidden',
                    backgroundColor: '#EDE8E0',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                  className="main-photo-box"
                >
                  <Image
                    src={product.images[selectedImageIdx] || product.images[0]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    style={{ objectFit: 'cover', transition: 'opacity 0.3s ease' }}
                  />

                  {product.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-espresso)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em'
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* 360° Interactive Simulator */
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '560px',
                  borderRadius: 'var(--radius-editorial)',
                  backgroundColor: '#EAE5DC',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  boxShadow: 'var(--shadow-card)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '320px',
                    height: '380px',
                    transform: `rotate(${spinDegree}deg)`,
                    transition: isSpinning ? 'transform 0.05s linear' : 'transform 0.3s ease',
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.18))'
                  }}
                >
                  <Image
                    src={product.images[0]}
                    alt={`${product.name} 360 view`}
                    fill
                    sizes="340px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                {/* 360 Controls */}
                <div style={{ position: 'absolute', bottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={handleRotate360}
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.8rem' }}
                  >
                    <RotateCw size={15} />
                    <span>Auto Spin 360°</span>
                  </button>
                  <button
                    onClick={() => setSpinDegree(prev => prev + 45)}
                    className="btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '0.8rem' }}
                  >
                    +45° Step
                  </button>
                  <button
                    onClick={() => setSpinDegree(0)}
                    className="btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '0.8rem' }}
                  >
                    Reset Angle
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Product Information */}
          <div>
            {/* Hallmark Assurance Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-pill)', backgroundColor: 'rgba(201, 163, 90, 0.12)', color: 'var(--color-espresso)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '14px' }}>
              <ShieldCheck size={16} color="var(--color-champagne)" />
              <span>BIS 925 Hallmark Certified • Pure Sterling Silver</span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                fontWeight: 600,
                lineHeight: 1.15,
                color: 'var(--color-espresso)',
                marginBottom: '12px'
              }}
            >
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'} color="#D4AF37" />
                ))}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                {product.rating}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)' }}>
                ({product.reviewsCount} customer reviews)
              </span>
            </div>

            {/* Price Box */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span style={{ fontSize: '1.15rem', color: 'var(--color-light-text)', textDecoration: 'line-through' }}>
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-copper)', fontWeight: 700, backgroundColor: 'rgba(154, 79, 47, 0.1)', padding: '4px 10px', borderRadius: 'var(--radius-pill)' }}>
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Weight & Metal Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-cream)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', display: 'block' }}>Silver Weight</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-espresso)' }}>{product.weight}</strong>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-cream)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', display: 'block' }}>Purity Grade</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-espresso)' }}>925 Sterling</strong>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-cream)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', display: 'block' }}>Protection</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-espresso)' }}>Rhodium Seal</strong>
              </div>
            </div>

            {/* Size / Variant Selector if rings/bangles */}
            {['rings', 'bracelets'].includes(product.category) && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Select Size:</span>
                  <Link href="/faq" style={{ color: 'var(--color-champagne)', fontSize: '0.78rem', textDecoration: 'underline' }}>
                    View Sizing Guide
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Size S (2.4)', 'Size M (2.6)', 'Size L (2.8)', 'Adjustable'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: selectedSize === sz ? '2px solid var(--color-espresso)' : '1px solid var(--color-border)',
                        backgroundColor: selectedSize === sz ? 'var(--color-espresso)' : '#FFFFFF',
                        color: selectedSize === sz ? '#FFFFFF' : 'var(--color-espresso)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-espresso)' }}>Quantity:</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '8px 14px', color: 'var(--color-espresso)' }}>-</button>
                <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '8px 14px', color: 'var(--color-espresso)' }}>+</button>
              </div>
            </div>

            {/* Core Action CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  className="btn-primary"
                  style={{ flex: 1, padding: '16px', fontSize: '0.92rem' }}
                >
                  <ShoppingBag size={18} />
                  <span>Add To Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Save to wishlist"
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isFavorited ? '#E53E3E' : 'var(--color-espresso)',
                    flexShrink: 0
                  }}
                >
                  <Heart size={22} fill={isFavorited ? '#E53E3E' : 'none'} />
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                onClick={handleBuyNow}
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: 'var(--color-champagne)',
                  color: 'var(--color-espresso)',
                  borderColor: 'var(--color-champagne)',
                  fontWeight: 700
                }}
              >
                <span>Buy It Now • Instant Checkout</span>
              </button>

              {/* WhatsApp Consultation Button with dynamic product prefill */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: '#E8F8EE',
                  color: '#128C7E',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <MessageCircle size={18} />
                <span>Ask Details on WhatsApp</span>
              </a>
            </div>

            {/* Quick Guarantees */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: '#F4EFE8', borderRadius: '12px', fontSize: '0.82rem', color: 'var(--color-espresso)', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="var(--color-champagne)" />
                <span>Complimentary insured shipping on orders above ₹999</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={16} color="var(--color-champagne)" />
                <span>15-day hassle-free doorstep returns and exchanges</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--color-champagne)" />
                <span>Includes anti-tarnish storage pouch & purity certificate</span>
              </div>
            </div>

            {/* Detailed Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--color-border)' }}>
              {/* Accordion 1: Description */}
              <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => toggleAccordion('desc')}
                  style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-espresso)' }}
                >
                  <span>Description & Story</span>
                  <ChevronDown size={18} style={{ transform: openAccordion === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                </button>
                {openAccordion === 'desc' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.9rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
                    {product.description}
                  </div>
                )}
              </div>

              {/* Accordion 2: Material & Purity */}
              <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => toggleAccordion('mat')}
                  style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-espresso)' }}
                >
                  <span>Material & Purity Specifications</span>
                  <ChevronDown size={18} style={{ transform: openAccordion === 'mat' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                </button>
                {openAccordion === 'mat' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.85rem', color: 'var(--color-muted-text)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div><strong>Metal:</strong> {product.details.material}</div>
                    <div><strong>Finish:</strong> {product.details.plating}</div>
                    <div><strong>Dimensions:</strong> {product.details.dimensions}</div>
                    <div><strong>Stone Setting:</strong> {product.details.gemstone || 'Pure Silver Sculpted'}</div>
                    <div><strong>Clasp / Fastening:</strong> {product.details.claspType || 'Comfort Fastening'}</div>
                    <div><strong>Stamp Certification:</strong> {product.details.hallmark}</div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Care Guidelines */}
              <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => toggleAccordion('care')}
                  style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-espresso)' }}
                >
                  <span>Care & Maintenance</span>
                  <ChevronDown size={18} style={{ transform: openAccordion === 'care' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                </button>
                {openAccordion === 'care' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.88rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
                    Store in the provided airtight MK Silver Hub anti-tarnish pouch. Keep away from harsh perfumes, chemicals, and saltwater. Clean gently with a soft micro-fiber cloth to restore mirror luster.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete The Look / Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '90px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span className="eyebrow">COMPLETE YOUR LOOK</span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', color: 'var(--color-espresso)' }}>
                Complementary Pieces
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="related-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .gallery-layout {
            flex-direction: column-reverse !important;
          }
          .gallery-thumbs {
            flex-direction: row !important;
            overflow-x: auto;
          }
          .main-photo-box {
            height: 380px !important;
          }
          .related-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
