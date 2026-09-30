'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '28px',
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
      className="whatsapp-floating-wrapper"
    >
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 30px rgba(59, 43, 43, 0.12)',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1px solid #E8D8D0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.4s ease',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
          }}
          className="whatsapp-tooltip"
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#3B2B2B' }}>
              Need styling advice?
            </span>
            <span style={{ fontSize: '0.68rem', color: '#6F5A58' }}>
              Chat with our silver expert
            </span>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Dismiss tooltip"
            style={{ color: '#8E7A77', padding: '2px' }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Button */}
      <a
        href="https://wa.me/917425058118?text=Hi%20MK%20Silver%20Hub%2C%20I%20would%20like%20to%20know%20more%20about%20your%20925%20silver%20jewellery%20collection."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Support"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          position: 'relative',
          transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
        className="whatsapp-btn animate-pulse-glow"
      >
        <MessageCircle size={28} />
      </a>

      <style jsx>{`
        .whatsapp-btn:hover {
          transform: scale(1.08);
        }
        @media (max-width: 768px) {
          .whatsapp-floating-wrapper {
            bottom: 82px !important;
            right: 14px !important;
            flex-direction: column-reverse !important;
            align-items: flex-end !important;
            gap: 6px !important;
            z-index: 140 !important;
          }
          .whatsapp-tooltip {
            display: flex !important;
            max-width: 220px !important;
            padding: 6px 10px !important;
            border-radius: 10px !important;
          }
          :global(.whatsapp-btn) {
            width: 50px !important;
            height: 50px !important;
          }
        }
      `}</style>
    </div>
  );
}
