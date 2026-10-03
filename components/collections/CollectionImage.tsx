'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { resolveCollectionImage } from '@/lib/media';

interface CollectionImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  aspectRatio?: string;
}

export function CollectionImageFallback({
  aspectRatio,
  fill = true,
  className = '',
  style,
}: {
  aspectRatio?: string;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      style={{
        position: fill ? 'absolute' : 'relative',
        inset: fill ? 0 : undefined,
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F7F3',
        aspectRatio: aspectRatio || undefined,
        border: '1px solid #ECEAE3',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Minimal silver jewellery line-art icon */}
      <div
        style={{
          width: '46px',
          height: '46px',
          marginBottom: '10px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #D8D6CE',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0EEE8 100%)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8A8882"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Diamond / Faceted Silver Gem Silhouette */}
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M2 9h20" />
          <path d="M10 3L6 9l6 12 6-12-4-6" />
        </svg>
      </div>

      <span
        style={{
          fontFamily: 'var(--font-ui), "Jost", sans-serif',
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#8A8882',
        }}
      >
        Image coming soon
      </span>
      <span
        style={{
          fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
          fontSize: '0.82rem',
          fontStyle: 'italic',
          color: '#A8A69E',
          marginTop: '3px',
        }}
      >
        Fine 925 Sterling Silver
      </span>
    </div>
  );
}

export default function CollectionImage({
  src,
  alt,
  fill = true,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  style,
  aspectRatio,
}: CollectionImageProps) {
  const resolvedUrl = resolveCollectionImage(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [resolvedUrl]);

  if (!resolvedUrl || hasError) {
    return (
      <CollectionImageFallback
        aspectRatio={aspectRatio}
        fill={fill}
        className={className}
        style={style}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        position: fill ? 'absolute' : 'relative',
        inset: fill ? 0 : undefined,
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F7F3',
        aspectRatio: aspectRatio || undefined,
        ...style,
      }}
    >
      {/* Skeleton Shimmer while loading */}
      {isLoading && (
        <div
          className="absolute inset-0 z-10 animate-pulse"
          style={{
            backgroundColor: '#F2F0EA',
          }}
          aria-hidden="true"
        />
      )}

      <Image
        src={resolvedUrl}
        alt={alt ? `${alt} - MK Silver Hub` : 'Fine 925 Sterling Silver Collection'}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={`object-cover transition-all duration-500 ease-out ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[CollectionImage] Failed to load collection image:', resolvedUrl);
          }
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
