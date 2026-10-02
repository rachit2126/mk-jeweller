'use client';

import React from 'react';
import { Gem, Truck, RefreshCw, Feather, Award } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Gem,
    title: '925 STERLING SILVER',
    subtitle: 'Hallmarked',
  },
  {
    icon: Truck,
    title: 'SECURE SHIPPING',
    subtitle: 'Across India',
  },
  {
    icon: RefreshCw,
    title: 'EASY EXCHANGE',
    subtitle: 'Hassle Free',
  },
  {
    icon: Feather,
    title: 'HYPOALLERGENIC',
    subtitle: 'Skin Friendly',
  },
  {
    icon: Award,
    title: 'AUTHENTIC CRAFT',
    subtitle: 'Made in Jaipur',
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
        padding: '24px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="trust-strip-container"
      >
        {TRUST_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.title}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  flex: 1,
                  justifyContent: 'center',
                  padding: '4px 12px',
                }}
                className="trust-item"
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#F8F7F3',
                    border: '1px solid #E8E7E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111111',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} strokeWidth={1.4} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#111111',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body), "Jost", sans-serif',
                      fontSize: '0.72rem',
                      color: '#6F6F6A',
                      marginTop: '2px',
                    }}
                  >
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {idx < TRUST_ITEMS.length - 1 && (
                <div
                  style={{
                    width: '1px',
                    height: '32px',
                    backgroundColor: '#E8E7E2',
                  }}
                  className="trust-divider"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .trust-strip-container {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            justify-content: flex-start !important;
            gap: 20px;
            padding-bottom: 8px !important;
            -webkit-overflow-scrolling: touch;
          }
          .trust-strip-container::-webkit-scrollbar {
            display: none;
          }
          .trust-item {
            flex: 0 0 auto !important;
            scroll-snap-align: start;
            min-width: 190px;
          }
          .trust-divider {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
