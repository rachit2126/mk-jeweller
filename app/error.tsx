'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log sanitized error on client console without sensitive details
    console.error('[Application Error Boundary caught error]:', error?.message || 'Unexpected error');
  }, [error]);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-main, #FDFBF7)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-cream, #F5F2EB)',
            border: '1px solid var(--color-border, #E8E4DC)',
            marginBottom: '24px',
            color: 'var(--color-champagne, #8E7051)',
          }}
        >
          <AlertCircle size={28} strokeWidth={1.5} />
        </div>

        <span
          style={{
            display: 'block',
            fontSize: '0.78rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-champagne, #8E7051)',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          MK Silver Hub • Service Notice
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display, serif)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            color: 'var(--color-espresso, #1A1A1A)',
            lineHeight: 1.25,
            marginBottom: '14px',
            fontWeight: 500,
          }}
        >
          Something Went Unexpectedly
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-muted-text, #666666)',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}
        >
          We encountered a momentary glitch while preparing this page. Our artisans and technical team have been notified. Please try reloading.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-espresso, #1A1A1A)',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '2px',
              fontSize: '0.82rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              color: 'var(--color-espresso, #1A1A1A)',
              border: '1px solid var(--color-border, #E8E4DC)',
              padding: '12px 22px',
              borderRadius: '2px',
              fontSize: '0.82rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
