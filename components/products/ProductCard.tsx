'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCommerce();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const isFavorited = isInWishlist(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E7E2',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'border-color 0.2s ease, box-shadow 0.25s ease',
        boxShadow: isHovered ? '0 12px 32px rgba(0, 0, 0, 0.06)' : 'none',
      }}
      className="editorial-product-card"
    >
      {/* Product Image Area (1:1.15 aspect ratio) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '112%',
          backgroundColor: '#F8F7F3',
          overflow: 'hidden',
        }}
      >
        <Link href={`/product/${product.slug}`} style={{ position: 'absolute', inset: 0 }}>
          {/* Primary Image */}
          {product.images && product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              style={{
                objectFit: 'cover',
                transform: isHovered && product.secondaryImage ? 'scale(1.04)' : isHovered ? 'scale(1.03)' : 'scale(1)',
                opacity: isHovered && product.secondaryImage ? 0 : 1,
                transition: 'transform 0.45s ease, opacity 0.35s ease',
              }}
            />
          )}

          {/* Secondary Image crossfade on hover */}
          {product.secondaryImage && (
            <Image
              src={product.secondaryImage}
              alt={`${product.name} view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{
                objectFit: 'cover',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                opacity: isHovered ? 1 : 0,
                transition: 'transform 0.45s ease, opacity 0.35s ease',
              }}
            />
          )}
        </Link>

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 2,
          }}
        >
          {product.isNewArrival && (
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                padding: '3px 8px',
              }}
            >
              JUST IN
            </span>
          )}
          {discountPercent && (
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                backgroundColor: '#F2F0EA',
                color: '#111111',
                border: '1px solid #D8D5CE',
                padding: '2px 6px',
              }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            color: isFavorited ? '#111111' : '#6F6F6A',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Heart size={15} fill={isFavorited ? '#111111' : 'none'} color={isFavorited ? '#111111' : '#6F6F6A'} strokeWidth={1.5} />
        </button>
      </div>

      {/* Product Details */}
      <div
        style={{
          padding: '14px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Product Title */}
          <Link
            href={`/product/${product.slug}`}
            style={{
              textDecoration: 'none',
              color: '#111111',
              display: 'block',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.08rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 6px',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Price & Compare-at */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.92rem',
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
                  fontSize: '0.8rem',
                  color: '#6F6F6A',
                  textDecoration: 'line-line-through',
                }}
              >
                <s>{formatPrice(product.compareAtPrice)}</s>
              </span>
            )}
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  fill={s <= Math.round(product.rating || 5) ? '#111111' : 'none'}
                  color="#111111"
                  strokeWidth={1}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontSize: '0.72rem',
                color: '#6F6F6A',
                marginLeft: '4px',
              }}
            >
              ({product.reviewsCount || product.numReviews || 86})
            </span>
          </div>
        </div>

        {/* Add To Cart Button (Matches Mockup) */}
        <button
          onClick={handleAdd}
          disabled={product.inStock === false}
          style={{
            width: '100%',
            padding: '10px 0',
            backgroundColor: isAdded ? '#111111' : '#FFFFFF',
            color: isAdded ? '#FFFFFF' : '#111111',
            border: '1px solid #111111',
            borderRadius: '0px',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: product.inStock === false ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            if (!isAdded && product.inStock !== false) {
              e.currentTarget.style.backgroundColor = '#111111';
              e.currentTarget.style.color = '#FFFFFF';
            }
          }}
          onMouseLeave={(e) => {
            if (!isAdded && product.inStock !== false) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#111111';
            }
          }}
        >
          {isAdded ? (
            <>
              <Check size={13} strokeWidth={2.5} />
              <span>ADDED</span>
            </>
          ) : product.inStock === false ? (
            <span>OUT OF STOCK</span>
          ) : (
            <span>ADD TO CART</span>
          )}
        </button>
      </div>
    </div>
  );
}
