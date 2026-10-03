'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Heart } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  if (isAuthOrAdmin) return null;

  return (
    <footer
      aria-label="MK Silver Hub Footer"
      style={{
        width: '100%',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        padding: 'clamp(56px, 8vw, 84px) 0 32px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 40px)',
        }}
      >
        {/* Main Footer Columns */}
        <div className="footer-columns-grid">
          {/* Col 1: Brand Monogram & Info */}
          <div className="footer-brand-col">
            <BrandLogo variant="light" size="normal" layout="horizontal" />
            <p
              style={{
                fontFamily: 'var(--font-body), "Jost", -apple-system, sans-serif',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                color: '#BFC1C4',
                marginTop: '16px',
                maxWidth: '280px',
              }}
            >
              Handcrafted 925 sterling silver jewellery from Jaipur, designed for modern expression and everyday luxury.
            </p>
          </div>

          {/* Col 2: SHOP */}
          <div>
            <h4 className="footer-col-title">SHOP</h4>
            <ul className="footer-links-list">
              <li><Link href="/shop?category=earrings">Earrings</Link></li>
              <li><Link href="/shop?category=necklaces">Necklaces</Link></li>
              <li><Link href="/shop?category=rings">Rings</Link></li>
              <li><Link href="/shop?category=bracelets">Bracelets</Link></li>
              <li><Link href="/shop?category=bangles">Bangles</Link></li>
              <li><Link href="/shop?category=anklets">Anklets</Link></li>
            </ul>
          </div>

          {/* Col 3: COLLECTIONS */}
          <div>
            <h4 className="footer-col-title">COLLECTIONS</h4>
            <ul className="footer-links-list">
              <li><Link href="/collections">Minimal</Link></li>
              <li><Link href="/shop?occasion=bridal">Bridal</Link></li>
              <li><Link href="/shop?collection=men">Men</Link></li>
              <li><Link href="/shop?occasion=everyday">Everyday</Link></li>
              <li><Link href="/collections">Heritage</Link></li>
              <li><Link href="/collections">Kids</Link></li>
            </ul>
          </div>

          {/* Col 4: ABOUT */}
          <div>
            <h4 className="footer-col-title">ABOUT</h4>
            <ul className="footer-links-list">
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/craftsmanship">Craftsmanship</Link></li>
              <li><Link href="/about">Journal</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Col 5: CUSTOMER CARE */}
          <div>
            <h4 className="footer-col-title">CUSTOMER CARE</h4>
            <ul className="footer-links-list">
              <li><Link href="/shipping">Shipping</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/returns">Exchange</Link></li>
              <li><Link href="/jewellery-care">Silver Care</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Col 6: LEGAL & SOCIAL */}
          <div>
            <h4 className="footer-col-title">LEGAL</h4>
            <ul className="footer-links-list">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/returns">Refund Policy</Link></li>
            </ul>

            <h4 className="footer-col-title" style={{ marginTop: '24px' }}>FOLLOW US</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
              <a
                href="https://instagram.com/mksilverhub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-icon"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-icon"
              >
                <FacebookIcon size={17} />
              </a>
              <a
                href="https://wa.me/917425058118"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="social-icon"
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            marginTop: 'clamp(44px, 6vw, 64px)',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
            fontSize: '0.72rem',
            color: '#6F6F6A',
          }}
        >
          <div>
            © 2026 MK SILVER HUB · FINE 925 STERLING JEWELLERY
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Designed with</span>
            <Heart size={11} fill="#B76E79" stroke="none" />
            <span>in Jaipur, India</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-columns-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr 1.1fr 1.1fr;
          gap: clamp(20px, 3vw, 40px);
        }

        .footer-col-title {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin: 0 0 16px 0;
        }

        .footer-links-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links-list li a {
          font-family: var(--font-ui), "Jost", -apple-system, sans-serif;
          font-size: 0.78rem;
          color: #BFC1C4;
          text-decoration: none;
          transition: color 0.2s ease, padding-left 0.2s ease;
          display: inline-block;
        }

        .footer-links-list li a:hover {
          color: #FFFFFF;
          padding-left: 3px;
        }

        .social-icon {
          color: #BFC1C4;
          transition: color 0.2s ease, transform 0.2s ease;
          display: flex;
          align-items: center;
        }

        .social-icon:hover {
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .footer-columns-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .footer-brand-col {
            grid-column: span 3;
            margin-bottom: 12px;
          }
        }

        @media (max-width: 640px) {
          .footer-columns-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px 16px;
          }
          .footer-brand-col {
            grid-column: span 2;
          }
        }
      `}</style>
    </footer>
  );
}
