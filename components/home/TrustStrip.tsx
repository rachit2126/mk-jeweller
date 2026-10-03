'use client';

import React from 'react';
import { Gem, Truck, Package, ShieldCheck, Sparkles } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Sparkles,
    line1: 'HANDCRAFTED',
    line2: 'EXCELLENCE',
  },
  {
    icon: Gem,
    line1: '925 STERLING',
    line2: 'SILVER',
  },
  {
    icon: Truck,
    line1: 'FREE SHIPPING',
    line2: 'ON ₹1,000+',
  },
  {
    icon: Package,
    line1: 'EASY',
    line2: 'RETURNS',
  },
  {
    icon: ShieldCheck,
    line1: 'TRUSTED',
    line2: 'BY CUSTOMERS',
  },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="MK Silver Hub Hallmark Promises"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E8E7E2',
        borderBottom: '1px solid #E8E7E2',
        height: '84px',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="trust-strip-container"
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {TRUST_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.line1 + item.line2}>
              <div
                className="trust-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1,
                  justifyContent: 'center',
                  padding: '4px 10px',
                }}
              >
                <div
                  style={{
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={1.3} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    lineHeight: 1.25,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#111111',
                    }}
                  >
                    {item.line1}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#4A4A45',
                    }}
                  >
                    {item.line2}
                  </span>
                </div>
              </div>

              {idx < TRUST_ITEMS.length - 1 && (
                <div
                  className="trust-divider"
                  style={{
                    width: '1px',
                    height: '32px',
                    backgroundColor: '#E8E7E2',
                    flexShrink: 0,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          section {
            height: auto !important;
            padding: 14px 0 !important;
          }
          .trust-strip-container {
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            justify-content: flex-start !important;
            gap: 16px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .trust-strip-container::-webkit-scrollbar {
            display: none;
          }
          .trust-item {
            flex: 0 0 auto !important;
            scroll-snap-align: start;
            padding: 4px 12px !important;
          }
          .trust-divider {
            display: block;
          }
        }
      `}</style>
    </section>
  );
}
