'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowUp, CheckCircle2, ChevronDown } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/ui/Icons';
import BrandLogo from '@/components/ui/BrandLogo';

/* Clean SVG Pinterest Icon */
function PinterestIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.79-.17-2 .04-2.86.19-.78 1.23-5.21 1.23-5.21s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.26-.87 3.51-.25 1.05.53 1.91 1.56 1.91 1.88 0 3.32-1.98 3.32-4.84 0-2.53-1.82-4.3-4.42-4.3-3.01 0-4.78 2.26-4.78 4.59 0 .91.35 1.88.79 2.41.09.11.1.2.07.31-.08.33-.26 1.05-.3 1.2-.05.21-.17.26-.39.16-1.46-.68-2.37-2.81-2.37-4.52 0-3.68 2.67-7.06 7.71-7.06 4.05 0 7.19 2.89 7.19 6.74 0 4.02-2.54 7.26-6.06 7.26-1.18 0-2.3-.61-2.68-1.34l-.73 2.78c-.26 1.01-.98 2.27-1.46 3.05.99.31 2.04.47 3.12.47 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [customerCareOpen, setCustomerCareOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root" aria-label="MK Silver Hub Footer">
      {/* Top-Right Decorative Botanical Floral Line Art */}
      <svg
        className="footer-botanical-right"
        viewBox="0 0 160 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M170 10 C120 40 85 90 70 150"
          stroke="rgba(183, 110, 121, 0.28)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M125 45 C135 25 155 30 150 48 C145 62 125 60 125 45 Z"
          stroke="rgba(183, 110, 121, 0.3)"
          strokeWidth="1"
          fill="rgba(246, 214, 217, 0.25)"
        />
        <path
          d="M95 85 C105 70 125 72 120 88 C115 100 98 98 95 85 Z"
          stroke="rgba(183, 110, 121, 0.3)"
          strokeWidth="1"
          fill="rgba(246, 214, 217, 0.25)"
        />
        <path
          d="M75 125 C82 110 100 114 96 128 C92 138 78 136 75 125 Z"
          stroke="rgba(183, 110, 121, 0.3)"
          strokeWidth="1"
          fill="rgba(246, 214, 217, 0.25)"
        />
      </svg>

      {/* Top-Left Subtle Botanical Branch Accent */}
      <svg
        className="footer-botanical-left"
        viewBox="0 0 140 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M-10 15 C30 45 60 85 75 140"
          stroke="rgba(183, 110, 121, 0.2)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M25 45 C20 32 35 28 42 36 C42 48 30 52 25 45 Z"
          stroke="rgba(183, 110, 121, 0.22)"
          strokeWidth="0.9"
          fill="rgba(246, 214, 217, 0.2)"
        />
        <path
          d="M50 78 C44 65 58 60 66 70 C66 80 55 85 50 78 Z"
          stroke="rgba(183, 110, 121, 0.22)"
          strokeWidth="0.9"
          fill="rgba(246, 214, 217, 0.2)"
        />
      </svg>

      <div className="footer-container">
        {/* 4-COLUMN MAIN EDITORIAL GRID */}
        <div className="footer-main-grid">
          {/* ========================================================= */}
          {/* COLUMN 1: BRAND AREA + TRUST FEATURES + SOCIAL ICONS      */}
          {/* ========================================================= */}
          <div className="footer-col-brand">
            {/* Brand Logo & Typography with final intertwined MK monogram */}
            <div style={{ marginBottom: '14px' }}>
              <BrandLogo variant="silver" layout="horizontal" size="normal" />
            </div>

            {/* Description */}
            <p className="footer-description">
              Fine 925 sterling silver jewellery crafted for everyday elegance and special moments.
            </p>

            {/* TRUST FEATURES: EXACTLY THE 3 SPECIFIED */}
            <div className="footer-trust-row">
              {/* Trust 1: Authentic 925 Silver */}
              <div className="trust-item">
                <div className="trust-badge">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B76E79"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 3h12l4 6-10 12L2 9z" />
                    <path d="M10 3l2 6-6 12" />
                    <path d="M14 3l-2 6 6 12" />
                    <path d="M2 9h20" />
                  </svg>
                </div>
                <span className="trust-label">
                  Authentic<br />925 Silver
                </span>
              </div>

              <div className="trust-divider" />

              {/* Trust 2: Premium Quality */}
              <div className="trust-item">
                <div className="trust-badge">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B76E79"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="trust-label">
                  Premium<br />Quality
                </span>
              </div>

              <div className="trust-divider" />

              {/* Trust 3: Secure Worldwide Shipping */}
              <div className="trust-item">
                <div className="trust-badge">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B76E79"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="3" width="14" height="13" rx="1.5" />
                    <polygon points="15 8 19 8 22 11 22 16 15 16 15 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="17.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <span className="trust-label">
                  Secure<br />Worldwide Shipping
                </span>
              </div>
            </div>

            {/* SOCIAL ICONS (Instagram, Facebook, YouTube) */}
            <div className="footer-social-row">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MK Silver Hub Instagram"
                className="social-icon-btn"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MK Silver Hub Facebook"
                className="social-icon-btn"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MK Silver Hub YouTube"
                className="social-icon-btn"
              >
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 2: QUICK LINKS ACCORDION                           */}
          {/* ========================================================= */}
          <div className="footer-col-nav">
            <button
              type="button"
              className="col-heading-btn"
              onClick={() => setQuickLinksOpen(!quickLinksOpen)}
              aria-expanded={quickLinksOpen}
            >
              <h3 className="col-heading">Quick Links</h3>
              <span className="accordion-chevron-wrap">
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${quickLinksOpen ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            <div className="heading-underline" />

            <ul className={`col-link-list ${quickLinksOpen ? 'show-mobile' : ''}`}>
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/collections" className="footer-link">Collections</Link></li>
              <li><Link href="/shop" className="footer-link">Jewellery</Link></li>
              <li><Link href="/gifts" className="footer-link">Gifts</Link></li>
              <li><Link href="/about" className="footer-link">About</Link></li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 3: CUSTOMER CARE ACCORDION                         */}
          {/* ========================================================= */}
          <div className="footer-col-nav">
            <button
              type="button"
              className="col-heading-btn"
              onClick={() => setCustomerCareOpen(!customerCareOpen)}
              aria-expanded={customerCareOpen}
            >
              <h3 className="col-heading">Customer Care</h3>
              <span className="accordion-chevron-wrap">
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${customerCareOpen ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            <div className="heading-underline" />

            <ul className={`col-link-list ${customerCareOpen ? 'show-mobile' : ''}`}>
              <li><Link href="/account" className="footer-link">Track Order</Link></li>
              <li><Link href="/shipping" className="footer-link">Shipping Policy</Link></li>
              <li><Link href="/returns" className="footer-link">Returns & Exchange</Link></li>
              <li><Link href="/faq" className="footer-link">FAQs</Link></li>
              <li><Link href="/size-guide" className="footer-link">Size Guide</Link></li>
              <li><Link href="/jewellery-care" className="footer-link">Care Instructions</Link></li>
            </ul>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 4: POLICIES ACCORDION (Mobile) / NEWSLETTER (Desk) */}
          {/* ========================================================= */}
          <div className="footer-col-nav footer-col-policies-mobile">
            <button
              type="button"
              className="col-heading-btn"
              onClick={() => setPoliciesOpen(!policiesOpen)}
              aria-expanded={policiesOpen}
            >
              <h3 className="col-heading">Policies</h3>
              <span className="accordion-chevron-wrap">
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${policiesOpen ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            <div className="heading-underline" />

            <ul className={`col-link-list ${policiesOpen ? 'show-mobile' : ''}`}>
              <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/terms" className="footer-link">Terms & Conditions</Link></li>
              <li><Link href="/returns" className="footer-link">Return Policy</Link></li>
              <li><Link href="/shipping" className="footer-link">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 5: CONTACT ACCORDION (Mobile)                      */}
          {/* ========================================================= */}
          <div className="footer-col-nav footer-col-contact-mobile">
            <button
              type="button"
              className="col-heading-btn"
              onClick={() => setContactOpen(!contactOpen)}
              aria-expanded={contactOpen}
            >
              <h3 className="col-heading">Contact</h3>
              <span className="accordion-chevron-wrap">
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${contactOpen ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            <div className="heading-underline" />

            <ul className={`col-link-list ${contactOpen ? 'show-mobile' : ''}`}>
              <li><a href="tel:+917425058118" className="footer-link">+91 74250 58118</a></li>
              <li><a href="mailto:support@mksilverhub.in" className="footer-link">support@mksilverhub.in</a></li>
              <li><span className="footer-link" style={{ cursor: 'default' }}>Jaipur, Rajasthan, India</span></li>
            </ul>
          </div>

          {/* Desktop Newsletter Column */}
          <div className="footer-col-newsletter">
            <h3 className="col-heading">Subscribe to Our Newsletter</h3>
            <div className="heading-underline" />

            <p className="newsletter-col-text">
              Get exclusive offers, new arrivals and jewellery updates.
            </p>

            {isSubscribed ? (
              <div className="newsletter-col-success" role="status">
                <CheckCircle2 size={16} className="success-icon" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <div className="footer-input-box">
                  <Mail size={16} className="footer-mail-icon" strokeWidth={1.6} />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="footer-email-input"
                    aria-label="Email address for newsletter"
                  />
                  <button type="submit" className="footer-submit-circle-btn" aria-label="Subscribe">
                    <ArrowRight size={14} strokeWidth={2} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM BAR: COPYRIGHT + POLICIES + SCROLL TO TOP          */}
        {/* ========================================================= */}
        <div className="footer-bottom-bar">
          <div className="copyright-text">
            © 2026 MK Silver Hub. All rights reserved.
          </div>

          <div className="bottom-links-group">
            <Link href="/privacy" className="bottom-link">Privacy Policy</Link>
            <span className="bottom-sep">|</span>
            <Link href="/terms" className="bottom-link">Terms of Service</Link>
            <span className="bottom-sep">|</span>
            <Link href="/cookies" className="bottom-link">Cookies</Link>
            <span className="bottom-sep">|</span>

            {/* Circular Back-to-Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="back-to-top-btn"
              aria-label="Scroll back to top of page"
            >
              <ArrowUp size={14} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ROOT FOOTER */
        .footer-root {
          position: relative;
          background-color: #FFF9F3;
          color: #3B2B2B;
          padding-top: 56px;
          padding-bottom: 28px;
          border-top: 1px solid #E8DCD5;
          font-family: var(--font-ui), 'Jost', sans-serif;
          overflow: hidden;
        }

        /* CORNER BOTANICAL FLOURISHES */
        .footer-botanical-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 140px;
          height: 160px;
          pointer-events: none;
          z-index: 1;
        }

        .footer-botanical-left {
          position: absolute;
          top: 0;
          left: 0;
          width: 120px;
          height: 140px;
          pointer-events: none;
          z-index: 1;
        }

        /* CONTAINER */
        .footer-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* MAIN 4-COLUMN GRID */
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.45fr 0.85fr 0.95fr 1.25fr;
          gap: clamp(28px, 3.5vw, 48px);
          padding-bottom: 44px;
          border-bottom: 1px solid #E8DCD5;
          align-items: start;
        }

        /* BRAND AREA */
        .footer-col-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-brand-header {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          margin-bottom: 14px;
        }

        .footer-monogram {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 250ms ease;
        }

        .footer-brand-header:hover .footer-monogram {
          transform: rotate(3deg) scale(1.04);
        }

        .footer-brand-text {
          display: flex;
          flex-direction: column;
        }

        .footer-brand-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.34rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #2D201E;
          line-height: 1.1;
        }

        .footer-brand-subtitle {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #8E7A77;
          margin-top: 4px;
          text-transform: uppercase;
        }

        .footer-description {
          color: #5A4846;
          font-size: 0.88rem;
          line-height: 1.62;
          max-width: 320px;
          margin-bottom: 22px;
        }

        /* TRUST FEATURES: 3 CLEAN ITEMS */
        .footer-trust-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
          padding: 6px 0;
          width: 100%;
          max-width: 360px;
        }

        .trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          flex: 1;
        }

        .trust-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FEECE8 65%, #F7D8D2 100%);
          border: 1px solid rgba(183, 110, 121, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(183, 110, 121, 0.08);
          transition: transform 250ms ease, box-shadow 250ms ease;
        }

        .trust-item:hover .trust-badge {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(183, 110, 121, 0.18);
        }

        .trust-label {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #2D201E;
          line-height: 1.25;
        }

        .trust-divider {
          width: 1px;
          height: 28px;
          background: #E8DCD5;
          flex-shrink: 0;
        }

        /* SOCIAL ICONS */
        .footer-social-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .social-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 1px solid #E8DCD5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5A4846;
          text-decoration: none;
          transition: transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 250ms ease,
            color 250ms ease,
            box-shadow 250ms ease;
        }

        .social-icon-btn:hover {
          transform: translateY(-2px) scale(1.05);
          border-color: #B76E79;
          color: #B76E79;
          box-shadow: 0 4px 12px rgba(183, 110, 121, 0.16);
        }

        /* COLUMN HEADINGS & UNDERLINES */
        .col-heading-btn {
          background: none;
          border: none;
          padding: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: default;
        }

        .col-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.18rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #2D201E;
          margin: 0;
        }

        .accordion-chevron-wrap {
          display: none;
        }

        .heading-underline {
          width: 28px;
          height: 1.5px;
          background-color: #B76E79;
          margin-top: 6px;
          margin-bottom: 16px;
        }

        /* LINK LISTS */
        .col-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .footer-link {
          color: #5A4846;
          text-decoration: none;
          font-size: 0.88rem;
          transition: color 200ms ease, transform 200ms ease;
          display: inline-block;
        }

        .footer-link:hover {
          color: #B76E79;
          transform: translateX(2px);
        }

        /* NEWSLETTER COLUMN */
        .newsletter-col-text {
          color: #5A4846;
          font-size: 0.86rem;
          line-height: 1.55;
          margin-bottom: 16px;
        }

        .footer-newsletter-form {
          width: 100%;
          max-width: 320px;
        }

        .footer-input-box {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E8DCD5;
          border-radius: 9999px;
          padding: 4px 4px 4px 14px;
          box-shadow: 0 2px 10px rgba(59, 43, 43, 0.04);
          transition: border-color 220ms ease, box-shadow 220ms ease;
        }

        .footer-input-box:focus-within {
          border-color: #B76E79;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.15);
        }

        .footer-mail-icon {
          color: #8E7A77;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .footer-email-input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
          color: #2D201E;
        }

        .footer-email-input::placeholder {
          color: #9C8987;
        }

        .footer-submit-circle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background-color 220ms ease, transform 220ms ease;
        }

        .footer-submit-circle-btn:hover {
          background-color: #9C5762;
          transform: scale(1.06);
        }

        .newsletter-col-success {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #3E8E68;
          font-size: 0.84rem;
          font-weight: 500;
          padding: 8px 14px;
          background: #FFFFFF;
          border: 1px solid #E8DCD5;
          border-radius: 9999px;
        }

        /* BOTTOM BAR */
        .footer-bottom-bar {
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.8rem;
          color: #6F5A58;
        }

        .copyright-text {
          font-size: 0.8rem;
          color: #6F5A58;
        }

        .bottom-links-group {
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }

        .bottom-link {
          color: #6F5A58;
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 180ms ease;
        }

        .bottom-link:hover {
          color: #B76E79;
        }

        .bottom-sep {
          color: #D5CDC7;
          font-size: 0.74rem;
        }

        .back-to-top-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-left: 6px;
          transition: background-color 220ms ease, transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .back-to-top-btn:hover {
          background-color: #9C5762;
          transform: translateY(-2px) scale(1.06);
        }

        /* PREFERS REDUCED MOTION */
        @media (prefers-reduced-motion: reduce) {
          .social-icon-btn,
          .footer-submit-circle-btn,
          .back-to-top-btn,
          .footer-monogram,
          .trust-badge,
          .footer-link {
            transition: none !important;
            transform: none !important;
          }
        }

        .footer-col-policies-mobile,
        .footer-col-contact-mobile {
          display: none;
        }

        /* RESPONSIVE TABLET */
        @media (max-width: 960px) {
          .footer-main-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px;
          }
        }

        /* RESPONSIVE MOBILE */
        @media (max-width: 768px) {
          .footer-col-policies-mobile,
          .footer-col-contact-mobile {
            display: block !important;
          }

          .footer-col-newsletter {
            display: none !important;
          }

          .footer-root {
            padding-top: 40px;
            padding-bottom: 96px; /* extra clearance for mobile bottom floating nav */
          }

          .footer-container {
            padding: 0 18px;
          }

          .footer-main-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            padding-bottom: 24px;
          }

          .col-heading-btn {
            cursor: pointer;
            padding: 8px 0;
          }

          .accordion-chevron-wrap {
            display: flex !important;
            align-items: center;
          }

          .accordion-chevron {
            color: #8E7A77;
            transition: transform 220ms ease;
          }

          .accordion-chevron.open {
            transform: rotate(180deg);
            color: #B76E79;
          }

          .heading-underline {
            display: none;
          }

          .col-link-list {
            display: none;
            padding-bottom: 8px;
          }

          .col-link-list.show-mobile {
            display: flex !important;
            flex-direction: column;
            gap: 10px;
            padding-top: 6px;
          }

          .footer-trust-row {
            display: none !important;
          }

          .footer-bottom-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
          }

          .bottom-links-group {
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
          }
        }

        @media (max-width: 380px) {
          .footer-trust-row {
            gap: 8px;
          }
          .trust-badge {
            width: 34px;
            height: 34px;
          }
          .trust-label {
            font-size: 0.72rem;
          }
        }
      `}</style>
    </footer>
  );
}
