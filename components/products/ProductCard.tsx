'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useCommerce();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const isFavorited = isInWishlist(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8D8D0',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: '0 8px 24px rgba(59, 43, 43, 0.05)',
      }}
      className="product-card"
    >
      {/* Media Image Container (4:5 aspect ratio) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '115%',
          backgroundColor: '#FFF9F3',
          overflow: 'hidden',
        }}
      >
        <Link href={`/product/${product.slug}`} style={{ position: 'absolute', inset: 0 }}>
          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            style={{
              objectFit: 'cover',
              transform: isHovered && product.secondaryImage ? 'scale(1.05)' : isHovered ? 'scale(1.04)' : 'scale(1)',
              opacity: isHovered && product.secondaryImage ? 0 : 1,
              transition: 'transform 0.5s ease, opacity 0.4s ease',
            }}
          />

          {/* Secondary Image for crossfade hover */}
          {product.secondaryImage && (
            <Image
              src={product.secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{
                objectFit: 'cover',
                transform: isHovered ? 'scale(1.04)' : 'scale(1.01)',
                opacity: isHovered ? 1 : 0,
                transition: 'transform 0.5s ease, opacity 0.4s ease',
              }}
            />
          )}
        </Link>

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 2 }}>
          {product.badge === 'NEW ARRIVAL' && (
            <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', backgroundColor: '#B76E79', color: '#FFFFFF', padding: '3px 8px', borderRadius: '999px' }}>
              NEW
            </span>
          )}
          {product.badge === 'BEST SELLER' && (
            <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', backgroundColor: '#FFE3D3', color: '#B76E79', border: '1px solid #E8D8D0', padding: '3px 8px', borderRadius: '999px' }}>
              BEST SELLER
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 43, 43, 0.1)',
            zIndex: 2,
            transition: 'transform 0.22s ease, background-color 0.22s ease',
            color: isFavorited ? '#B76E79' : '#6F5A58',
          }}
          className="wishlist-btn"
        >
          <Heart size={16} fill={isFavorited ? '#B76E79' : 'none'} color={isFavorited ? '#B76E79' : '#6F5A58'} />
        </button>

        {/* Quick View Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            gap: '8px',
            zIndex: 2,
            transform: isHovered ? 'translateY(0)' : 'translateY(14px)',
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.24s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="quickview-overlay"
        >
          <button
            onClick={handleQuickView}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              color: '#3B2B2B',
              padding: '8px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: '1px solid #E8D8D0',
              boxShadow: '0 4px 12px rgba(59, 43, 43, 0.08)',
            }}
          >
            <Eye size={13} color="#B76E79" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.96rem',
              fontWeight: 500,
              color: '#342727',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '3px',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            className="product-title"
          >
            {product.name}
          </Link>

          {/* Material */}
          <span style={{ fontSize: '0.74rem', color: '#806D68', display: 'block', marginBottom: '6px' }}>
            925 Sterling Silver
          </span>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <Star size={11} fill="#B76E79" color="#B76E79" />
            <span style={{ fontSize: '0.76rem', color: '#B76E79', fontWeight: 600 }}>
              {product.rating}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#806D68' }}>
              ({product.reviewsCount})
            </span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.04rem', fontWeight: 600, color: '#342727', fontFamily: 'var(--font-ui), "Jost", sans-serif' }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '0.82rem', color: '#8E7A77', textDecoration: 'line-through' }}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Bag Button */}
        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            backgroundColor: isAdded ? '#3E8E68' : '#B76E79',
            color: '#FFFFFF',
            padding: '10px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            border: 'none',
          }}
          className="add-to-cart-btn"
        >
          <ShoppingBag size={14} />
          <span>{isAdded ? 'Added to Bag ✓' : 'Add to Bag'}</span>
        </button>
      </div>

      <style jsx>{`
        .product-card:hover {
          border-color: #B76E79 !important;
          box-shadow: 0 14px 36px rgba(183, 110, 121, 0.16) !important;
          transform: translateY(-4px);
        }
        .product-title:hover {
          color: #B76E79 !important;
        }
        .wishlist-btn:hover {
          transform: scale(1.12);
        }
        .add-to-cart-btn:hover {
          background-color: #9C5762 !important;
        }
        @media (max-width: 768px) {
          .quickview-overlay {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
