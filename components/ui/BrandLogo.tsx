'use client';

import React from 'react';
import Link from 'next/link';

export interface BrandLogoProps {
  variant?: 'silver' | 'monochrome' | 'light' | 'dark';
  layout?: 'horizontal' | 'stacked' | 'compact' | 'icon-only';
  size?: 'compact' | 'normal' | 'large';
  showTagline?: boolean;
  className?: string;
  href?: string;
}

/* Vector SVG Monogram Component (for monochrome, crisp scaling, and fallback) */
export function MKMonogramSvg({
  size = 40,
  variant = 'silver',
  className = '',
}: {
  size?: number;
  variant?: 'silver' | 'monochrome' | 'light' | 'dark';
  className?: string;
}) {
  const isLight = variant === 'light';
  const isMono = variant === 'monochrome';

  const silverStop1 = isLight ? '#FFFFFF' : isMono ? '#3B2B2B' : '#FFFFFF';
  const silverStop2 = isLight ? '#E6E6E6' : isMono ? '#3B2B2B' : '#C2C2C2';
  const silverStop3 = isLight ? '#C5C5C5' : isMono ? '#3B2B2B' : '#8E8E8E';

  const roseStop1 = isLight ? '#FCEEEB' : isMono ? '#3B2B2B' : '#FCEEEB';
  const roseStop2 = isLight ? '#E0A6AF' : isMono ? '#3B2B2B' : '#D99BA4';
  const roseStop3 = isLight ? '#C07480' : isMono ? '#3B2B2B' : '#B76E79';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`silverGrad-${variant}`} x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor={silverStop1} />
          <stop offset="0.35" stopColor={silverStop2} />
          <stop offset="0.7" stopColor={silverStop1} />
          <stop offset="1" stopColor={silverStop3} />
        </linearGradient>
        <linearGradient id={`roseGrad-${variant}`} x1="20" y1="100" x2="100" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor={roseStop1} />
          <stop offset="0.5" stopColor={roseStop2} />
          <stop offset="1" stopColor={roseStop3} />
        </linearGradient>
      </defs>

      {/* Outer Intertwined Rose-Gold Frame Ring */}
      <circle cx="64" cy="60" r="48" stroke={`url(#roseGrad-${variant})`} strokeWidth="1.8" />

      {/* Inner Polished Silver Frame Ring */}
      <circle cx="61" cy="58" r="45" stroke={`url(#silverGrad-${variant})`} strokeWidth="2.2" />

      {/* Botanical Jewellery Branch on the Left */}
      <path
        d="M24 64 C20 45 28 32 40 24"
        stroke={`url(#roseGrad-${variant})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M26 62 C23 75 32 86 48 94"
        stroke={`url(#roseGrad-${variant})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sculpted Leaves */}
      <path d="M26 40 C18 36 18 28 25 30 C30 32 28 38 26 40 Z" fill={`url(#roseGrad-${variant})`} stroke="#9C5762" strokeWidth="0.5" />
      <path d="M22 50 C14 48 15 40 22 42 C27 44 25 49 22 50 Z" fill={`url(#roseGrad-${variant})`} stroke="#9C5762" strokeWidth="0.5" />
      <path d="M24 62 C16 64 18 72 25 70 C29 68 27 63 24 62 Z" fill={`url(#roseGrad-${variant})`} stroke="#9C5762" strokeWidth="0.5" />
      <path d="M32 78 C26 84 31 92 38 88 C40 85 36 80 32 78 Z" fill={`url(#roseGrad-${variant})`} stroke="#9C5762" strokeWidth="0.5" />
      <path d="M42 90 C38 96 46 102 52 96 C53 93 47 88 42 90 Z" fill={`url(#roseGrad-${variant})`} stroke="#9C5762" strokeWidth="0.5" />

      {/* 5-Petal Flower with Diamond Center */}
      <g transform="translate(32, 68)">
        <circle cx="0" cy="-5" r="3.5" fill={`url(#roseGrad-${variant})`} />
        <circle cx="4.8" cy="-1.5" r="3.5" fill={`url(#roseGrad-${variant})`} />
        <circle cx="3" cy="4.2" r="3.5" fill={`url(#roseGrad-${variant})`} />
        <circle cx="-3" cy="4.2" r="3.5" fill={`url(#roseGrad-${variant})`} />
        <circle cx="-4.8" cy="-1.5" r="3.5" fill={`url(#roseGrad-${variant})`} />
        {/* Diamond Center */}
        <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" stroke="#9C5762" strokeWidth="0.6" />
        <circle cx="0" cy="0" r="1" fill="#D9B98A" />
      </g>

      {/* Bezel-Set Diamond Dewdrops along Vine */}
      <circle cx="24" cy="35" r="2.2" fill="#FFFFFF" stroke="#B76E79" strokeWidth="0.6" />
      <circle cx="38" cy="92" r="2" fill="#FFFFFF" stroke="#B76E79" strokeWidth="0.6" />

      {/* 4-Point Diamond Sparkle Star (Top Right) */}
      <path
        d="M88 32 C88.5 35.5 90.5 37.5 94 38 C90.5 38.5 88.5 40.5 88 44 C87.5 40.5 85.5 38.5 82 38 C85.5 37.5 87.5 35.5 88 32 Z"
        fill={`url(#roseGrad-${variant})`}
      />

      {/* Intertwined MK Monogram (Letter M) */}
      <path
        d="M38 32 C41 30 46 29 49 34 C52 40 56 60 58 72 L52 72 C50 62 47 44 45 38 C43 35 41 36 39 37 L38 32 Z"
        fill={`url(#silverGrad-${variant})`}
      />
      <path
        d="M48 35 C52 42 60 62 65 72 L60 74 C56 64 50 48 47 38 C46 36 47 35 48 35 Z"
        fill={`url(#silverGrad-${variant})`}
      />
      <path
        d="M64 42 C64 36 67 31 72 31 C73 31 74 32 74 34 C72 36 70 42 70 48 C70 58 74 68 82 72 C87 74 92 73 95 72 L93 75 C89 77 82 77 76 73 C68 68 64 56 64 42 Z"
        fill={`url(#silverGrad-${variant})`}
      />

      {/* Letter K: Upright stem, upper flared arm, lower sweeping leg extending past ring */}
      <rect x="66" y="32" width="3.2" height="40" rx="0.8" fill={`url(#silverGrad-${variant})`} />
      <path d="M68 50 L84 34 L89 34 L73 50 Z" fill={`url(#silverGrad-${variant})`} />
      <path d="M71 48 L96 76 C98 78 101 80 104 81 L103 82.5 C99 81.5 95 79 92 75 L70 52 Z" fill={`url(#silverGrad-${variant})`} />
    </svg>
  );
}

export default function BrandLogo({
  variant = 'silver',
  layout = 'horizontal',
  size = 'normal',
  showTagline = true,
  className = '',
  href = '/',
}: BrandLogoProps) {
  const isLight = variant === 'light';
  const isMono = variant === 'monochrome';
  const isCompact = size === 'compact' || layout === 'compact';
  const isStacked = layout === 'stacked';
  const isIconOnly = layout === 'icon-only';

  const emblemHeight = size === 'large' ? 52 : size === 'compact' ? 32 : 38;
  const textColor = isLight ? '#FFF9F3' : '#2D201E';
  const subTextColor = isLight ? 'rgba(255, 249, 243, 0.7)' : '#7A6866';

  const titleFontSize =
    size === 'large'
      ? '1.5rem'
      : size === 'compact'
      ? '1.06rem'
      : '1.22rem';

  const subtitleFontSize =
    size === 'large'
      ? '0.62rem'
      : size === 'compact'
      ? '0.48rem'
      : '0.54rem';

  const content = (
    <div
      className={`brand-logo-root ${isStacked ? 'stacked' : 'horizontal'} ${isIconOnly ? 'icon-only' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: isStacked ? 'column' : 'row',
        alignItems: 'center',
        gap: isStacked ? '12px' : size === 'compact' ? '10px' : '12px',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {/* MONOGRAM EMBLEM */}
      <div
        className="brand-monogram-container"
        style={{
          height: `${emblemHeight}px`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {variant === 'silver' ? (
          <img
            src="/images/logo/mk-monogram-silver.png"
            alt="MK Silver Hub Hallmark Monogram"
            style={{
              height: `${emblemHeight}px`,
              width: 'auto',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 2px 5px rgba(59, 43, 43, 0.06))',
            }}
            loading="eager"
          />
        ) : (
          <MKMonogramSvg size={emblemHeight} variant={variant} />
        )}
      </div>

      {/* WORDMARK & TAGLINE (If not icon-only) */}
      {!isIconOnly && (
        <div
          className="brand-text-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isStacked ? 'center' : 'flex-start',
            textAlign: isStacked ? 'center' : 'left',
          }}
        >
          {/* Main Brand Name */}
          <span
            className="brand-title"
            style={{
              fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
              fontWeight: 600,
              fontSize: titleFontSize,
              letterSpacing: '0.16em',
              color: textColor,
              lineHeight: 1.05,
              whiteSpace: 'nowrap',
            }}
          >
            <span className="brand-title-full">MK SILVER HUB</span>
            <span className="brand-title-mobile">MK SILVER</span>
          </span>

          {/* Decorative Divider with Central Diamond Star */}
          {showTagline && (
            <div
              className="brand-divider"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isStacked ? 'center' : 'flex-start',
                width: '100%',
                margin: isStacked ? '6px 0 5px 0' : '4px 0 3px 0',
                gap: '8px',
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.3)' : 'rgba(183, 110, 121, 0.35)',
                }}
              />
              <svg width="8" height="8" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 0 L9.8 6.2 L16 8 L9.8 9.8 L8 16 L6.2 9.8 L0 8 L6.2 6.2 Z"
                  fill={isLight ? '#FCEEEB' : '#B76E79'}
                />
              </svg>
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.3)' : 'rgba(183, 110, 121, 0.35)',
                }}
              />
            </div>
          )}

          {/* Tagline */}
          {showTagline && (
            <span
              className="brand-tagline"
              style={{
                fontFamily: 'var(--font-ui), "Jost", sans-serif',
                fontWeight: 500,
                fontSize: subtitleFontSize,
                letterSpacing: '0.24em',
                color: subTextColor,
                textTransform: 'uppercase',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              FINE 925 STERLING JEWELLERY
            </span>
          )}
        </div>
      )}

      <style jsx>{`
        .brand-logo-root:hover .brand-monogram-container {
          transform: scale(1.05) rotate(2deg);
        }

        .brand-title-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .brand-logo-root.horizontal .brand-divider {
            display: none !important;
          }
          .brand-logo-root.horizontal .brand-tagline {
            display: none !important;
          }
          .brand-title {
            font-size: 0.98rem !important;
            letter-spacing: 0.12em !important;
          }
        }

        @media (max-width: 540px) {
          .brand-title-full {
            display: none !important;
          }
          .brand-title-mobile {
            display: inline !important;
            font-size: 0.88rem !important;
            letter-spacing: 0.08em !important;
          }
        }

        @media (max-width: 360px) {
          .brand-title-mobile {
            font-size: 0.82rem !important;
            letter-spacing: 0.06em !important;
          }
        }
      `}</style>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="MK Silver Hub Home" style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}
