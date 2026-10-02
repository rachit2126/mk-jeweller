'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto-dismiss tooltip after 8 seconds so it never stays in the user's way
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  if (isAuthOrAdmin) return null;

  return (
    <aside
      aria-label="Customer Support"
      className="whatsapp-floating-wrapper"
    >
      {/* Button */}
      <a
        href="https://wa.me/917425058118?text=Hi%20MK%20Silver%20Hub%2C%20I%20would%20like%20to%20know%20more%20about%20your%20925%20silver%20jewellery%20collection."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with silver jewellery styling expert"
        className="whatsapp-btn animate-pulse-glow"
      >
        <MessageCircle size={28} />
      </a>

      {/* Tooltip speech bubble - positioned ABOVE the button */}
      {showTooltip && (
        <div
          role="status"
          aria-live="polite"
          className="whatsapp-tooltip"
        >
          <div className="whatsapp-tooltip-text">
            <span className="tooltip-title">Need styling advice?</span>
            <span className="tooltip-sub">Chat with our silver expert</span>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Dismiss styling advice tooltip"
            className="tooltip-close-btn"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <style jsx>{`
        .whatsapp-floating-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 85;
          display: flex;
          flex-direction: column-reverse;
          align-items: flex-end;
          gap: 8px;
          pointer-events: none;
        }

        .whatsapp-btn {
          pointer-events: auto;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: #25D366;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
          transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease;
        }

        .whatsapp-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 28px rgba(37, 211, 102, 0.5);
        }

        .whatsapp-tooltip {
          pointer-events: auto;
          background-color: #FFFFFF;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid #E8E7E2;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: floatIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: var(--font-ui), 'Jost', sans-serif;
          max-width: 200px;
        }

        .whatsapp-tooltip-text {
          display: flex;
          flex-direction: column;
        }

        .tooltip-title {
          font-size: 0.74rem;
          font-weight: 600;
          color: #111111;
          line-height: 1.2;
        }

        .tooltip-sub {
          font-size: 0.65rem;
          color: #6F6F6A;
          line-height: 1.2;
        }

        .tooltip-close-btn {
          background: none;
          border: none;
          color: #6F6F6A;
          padding: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          transition: color 0.15s ease;
        }

        .tooltip-close-btn:hover {
          color: #111111;
        }

        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .whatsapp-floating-wrapper {
            bottom: 84px !important;
            right: 16px !important;
            z-index: 130 !important;
          }
          .whatsapp-btn {
            width: 48px;
            height: 48px;
          }
          .whatsapp-tooltip {
            max-width: 175px;
            padding: 6px 10px;
          }
          .tooltip-title {
            font-size: 0.72rem;
          }
          .tooltip-sub {
            font-size: 0.62rem;
          }
        }
      `}</style>
    </aside>
  );
}
