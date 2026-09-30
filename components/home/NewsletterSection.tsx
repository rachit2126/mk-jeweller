'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section" aria-label="Stay Connected Newsletter">
      {/* Background still-life image layer */}
      <div className="newsletter-bg-layer" />

      {/* Subtle ivory/blush gradient overlay on the left to guarantee readability */}
      <div className="newsletter-overlay-gradient" />

      {/* Decorative botanical branch watermark in top-left corner */}
      <svg
        className="newsletter-botanical"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M-10 15 C25 45 55 90 95 120"
          stroke="rgba(183, 110, 121, 0.22)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M18 36 C14 26 27 21 34 28 C35 38 25 40 18 36 Z"
          stroke="rgba(183, 110, 121, 0.22)"
          strokeWidth="1"
          fill="rgba(255, 245, 242, 0.4)"
        />
        <path
          d="M38 60 C32 50 45 44 53 52 C53 61 44 63 38 60 Z"
          stroke="rgba(183, 110, 121, 0.22)"
          strokeWidth="1"
          fill="rgba(255, 245, 242, 0.4)"
        />
        <path
          d="M62 86 C56 75 70 70 77 79 C78 88 69 90 62 86 Z"
          stroke="rgba(183, 110, 121, 0.22)"
          strokeWidth="1"
          fill="rgba(255, 245, 242, 0.4)"
        />
        <path
          d="M84 112 C76 104 87 97 95 106 C96 115 89 117 84 112 Z"
          stroke="rgba(183, 110, 121, 0.22)"
          strokeWidth="1"
          fill="rgba(255, 245, 242, 0.4)"
        />
      </svg>

      <div className="newsletter-container">
        {/* LEFT COLUMN: Editorial Content & Form */}
        <div className="newsletter-content-col">
          {/* Eyebrow with flanking subtle rules */}
          <div className="newsletter-eyebrow anim-eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">STAY CONNECTED</span>
            <span className="eyebrow-line" />
          </div>

          {/* Heading: Stay In The Loop */}
          <h2 className="newsletter-heading anim-heading">
            <span className="heading-line-1">Stay In The</span>
            <span className="heading-loop-wrapper">
              <span className="heading-loop-text">Loop</span>
              {/* Four-point sparkling star */}
              <svg
                className="sparkle-star"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2 C12.6 6.8 15.2 9.4 20 10 C15.2 10.6 12.6 13.2 12 18 C11.4 13.2 8.8 10.6 4 10 C8.8 9.4 11.4 6.8 12 2 Z"
                  fill="#B76E79"
                />
              </svg>
              {/* Calligraphic underline flourish */}
              <svg
                className="loop-swoosh"
                viewBox="0 0 170 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 16 C38 27 96 26 166 4 C118 14 65 17 22 20"
                  stroke="rgba(183, 110, 121, 0.48)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          {/* Supporting Text */}
          <p className="newsletter-subheading anim-supporting">
            Get exclusive offers, new arrivals and jewellery updates.
          </p>

          {/* Form / Success state */}
          <div className="newsletter-form-container anim-form">
            {isSubmitted ? (
              <div className="newsletter-success-pill" role="status">
                <CheckCircle2 size={20} className="success-icon" />
                <span className="success-text">
                  You&apos;re on the list.
                </span>
              </div>
            ) : (
              <div className="newsletter-form-wrapper">
                {/* Dreamy rose button aura glow */}
                <div className="btn-glow-aura" />

                <form onSubmit={handleSubmit} className="newsletter-form">
                  <div className="input-group">
                    <Mail size={19} className="mail-icon" strokeWidth={1.6} />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="email-input"
                      aria-label="Email address"
                    />
                  </div>
                  <button type="submit" className="subscribe-btn" aria-label="Subscribe to newsletter">
                    <span className="btn-text">Subscribe</span>
                    <ArrowRight size={15} className="arrow-icon" strokeWidth={2} />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* 3 Benefits with HTML/SVG Icons */}
          <div className="newsletter-benefits anim-benefits">
            {/* Benefit 1: Exclusive Offers */}
            <div className="benefit-item">
              <div className="benefit-badge">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="benefit-svg"
                >
                  <defs>
                    <linearGradient id="giftBoxGrad" x1="4" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFF5F2" />
                      <stop offset="1" stopColor="#F5D2C9" />
                    </linearGradient>
                    <linearGradient id="ribbonGrad" x1="12" y1="8" x2="20" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D98A94" />
                      <stop offset="1" stopColor="#B76E79" />
                    </linearGradient>
                  </defs>
                  {/* Box base */}
                  <rect x="5.5" y="14" width="21" height="13.5" rx="2.5" fill="url(#giftBoxGrad)" stroke="#B76E79" strokeWidth="1.1" />
                  {/* Lid */}
                  <rect x="4" y="10" width="24" height="4.5" rx="1.5" fill="#FFFFFF" stroke="#B76E79" strokeWidth="1.1" />
                  {/* Vertical ribbon */}
                  <rect x="14.2" y="10" width="3.6" height="17.5" fill="url(#ribbonGrad)" />
                  {/* Horizontal ribbon on lid */}
                  <rect x="4" y="11.5" width="24" height="1.6" fill="url(#ribbonGrad)" opacity="0.45" />
                  {/* Bow */}
                  <path d="M16 10 C13 5.5 8 6.5 10 9 C11.5 11 16 10 16 10 Z" fill="url(#ribbonGrad)" stroke="#9C5762" strokeWidth="0.7" />
                  <path d="M16 10 C19 5.5 24 6.5 22 9 C20.5 11 16 10 16 10 Z" fill="url(#ribbonGrad)" stroke="#9C5762" strokeWidth="0.7" />
                  <circle cx="16" cy="10" r="1.6" fill="#9C5762" />
                </svg>
              </div>
              <span className="benefit-label">Exclusive Offers</span>
            </div>

            {/* Divider */}
            <div className="benefit-divider" />

            {/* Benefit 2: New Arrivals */}
            <div className="benefit-item">
              <div className="benefit-badge">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="benefit-svg"
                >
                  <defs>
                    <linearGradient id="ringBoxGrad" x1="6" y1="14" x2="26" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FDEAE8" />
                      <stop offset="1" stopColor="#EAB2BC" />
                    </linearGradient>
                    <linearGradient id="silverShine" x1="12" y1="6" x2="20" y2="16" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF" />
                      <stop offset="0.6" stopColor="#D5CDC7" />
                      <stop offset="1" stopColor="#9E9690" />
                    </linearGradient>
                  </defs>
                  {/* Open box cushion */}
                  <path
                    d="M7 16 C7 15 8 14 10 14 L22 14 C24 14 25 15 25 16 L24 25 C24 26.5 22.5 27.5 21 27.5 L11 27.5 C9.5 27.5 8 26.5 8 25 Z"
                    fill="url(#ringBoxGrad)"
                    stroke="#B76E79"
                    strokeWidth="1.1"
                  />
                  {/* Velvet slot */}
                  <ellipse cx="16" cy="18" rx="6.5" ry="2.2" fill="#8C4A55" opacity="0.85" />
                  {/* Ring band */}
                  <ellipse cx="16" cy="14" rx="4.2" ry="3.8" fill="none" stroke="url(#silverShine)" strokeWidth="1.7" />
                  {/* Solitaire diamond */}
                  <polygon points="16,6.5 18.8,9.8 16,12.8 13.2,9.8" fill="#FFFFFF" stroke="#B76E79" strokeWidth="0.8" />
                  <path d="M13.2 9.8 L18.8 9.8" stroke="#B76E79" strokeWidth="0.5" />
                  {/* Diamond glint */}
                  <path d="M19.5 6 L20.2 7.6 L21.8 8.3 L20.2 9 L19.5 10.6 L18.8 9 L17.2 8.3 L18.8 7.6 Z" fill="#D9B98A" />
                  {/* Open lid arch */}
                  <path
                    d="M8.5 14 L10.5 8 C11.2 6.5 12.8 5.5 14.5 5.5 L17.5 5.5 C19.2 5.5 20.8 6.5 21.5 8 L23.5 14"
                    stroke="#B76E79"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
              <span className="benefit-label">New Arrivals</span>
            </div>

            {/* Divider */}
            <div className="benefit-divider" />

            {/* Benefit 3: Jewellery Updates */}
            <div className="benefit-item">
              <div className="benefit-badge">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="benefit-svg"
                >
                  <defs>
                    <linearGradient id="bellGrad" x1="8" y1="6" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFF6F3" />
                      <stop offset="0.6" stopColor="#F5D7CF" />
                      <stop offset="1" stopColor="#E4A89C" />
                    </linearGradient>
                  </defs>
                  {/* Bell body */}
                  <path
                    d="M16 6.5 C12.2 6.5 9.8 9.5 9.8 14 C9.8 18 8.4 20.2 7.4 21.6 C7 22.3 7.5 23.5 8.4 23.5 L23.6 23.5 C24.5 23.5 25 22.3 24.6 21.6 C23.6 20.2 22.2 18 22.2 14 C22.2 9.5 19.8 6.5 16 6.5 Z"
                    fill="url(#bellGrad)"
                    stroke="#B76E79"
                    strokeWidth="1.1"
                  />
                  {/* Clapper */}
                  <circle cx="16" cy="25" r="2" fill="#B76E79" />
                  {/* Top loop */}
                  <path
                    d="M14.2 6.5 C14.2 5 15 4 16 4 C17 4 17.8 5 17.8 6.5"
                    stroke="#B76E79"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Small ribbon bow */}
                  <path d="M12.5 7.5 C10.5 6.5 10 8 11.5 8.5 C13 9 14.5 7.5 14.5 7.5 Z" fill="#B76E79" />
                  <path d="M19.5 7.5 C21.5 6.5 22 8 20.5 8.5 C19 9 17.5 7.5 17.5 7.5 Z" fill="#B76E79" />
                  {/* Sparkle */}
                  <path d="M24.5 9 L25.2 10.3 L26.5 11 L25.2 11.7 L24.5 13 L23.8 11.7 L22.5 11 L23.8 10.3 Z" fill="#D9B98A" />
                </svg>
              </div>
              <span className="benefit-label">Jewellery Updates</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Clear opening that naturally showcases the 925 silver rings, tennis bracelet, travertine pedestals & flowers */}
        <div className="newsletter-still-life-col" aria-hidden="true" />
      </div>

      <style jsx>{`
        /* SECTION BASE: Edge-to-edge full width */
        .newsletter-section {
          position: relative;
          width: 100%;
          min-height: 560px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background-color: #FFF9F3;
          border-top: 1px solid rgba(232, 216, 208, 0.45);
          border-bottom: 1px solid rgba(232, 216, 208, 0.45);
        }

        /* BACKGROUND LAYER: Full-bleed photography with subtle parallax zoom */
        .newsletter-bg-layer {
          position: absolute;
          inset: 0;
          background-image: url('/images/newsletter/newsletter-bg.jpg');
          background-size: cover;
          background-position: center right;
          background-repeat: no-repeat;
          transform: scale(1.008);
          transition: transform 10s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 1;
        }

        @media (hover: hover) {
          .newsletter-section:hover .newsletter-bg-layer {
            transform: scale(1.025);
          }
        }

        /* IVORY / BLUSH GRADIENT OVERLAY: Ensures pristine text legibility on left */
        .newsletter-overlay-gradient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background: linear-gradient(
            90deg,
            rgba(255, 249, 243, 0.98) 0%,
            rgba(255, 249, 243, 0.94) 34%,
            rgba(255, 249, 243, 0.82) 48%,
            rgba(255, 249, 243, 0.35) 62%,
            rgba(255, 249, 243, 0) 78%
          );
        }

        /* TOP-LEFT BOTANICAL FLOURISH WATERMARK */
        .newsletter-botanical {
          position: absolute;
          top: 0;
          left: 0;
          width: 150px;
          height: 150px;
          pointer-events: none;
          z-index: 3;
        }

        /* INNER CONTAINER */
        .newsletter-container {
          position: relative;
          z-index: 4;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          padding: 68px 32px 64px 48px;
          display: grid;
          grid-template-columns: minmax(320px, 540px) 1fr;
          gap: 32px;
          align-items: center;
        }

        /* LEFT CONTENT COLUMN */
        .newsletter-content-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        /* EYEBROW */
        .newsletter-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .eyebrow-line {
          display: inline-block;
          width: 28px;
          height: 1px;
          background-color: rgba(183, 110, 121, 0.5);
        }

        .eyebrow-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #B76E79;
        }

        /* HEADING */
        .newsletter-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.7rem, 4.4vw, 3.8rem);
          font-weight: 400;
          color: #2D201E;
          line-height: 1.06;
          letter-spacing: -0.015em;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }

        .heading-line-1 {
          display: block;
        }

        .heading-loop-wrapper {
          position: relative;
          display: inline-block;
          width: fit-content;
        }

        .heading-loop-text {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          color: #B76E79;
          margin-right: 6px;
        }

        /* SPARKLE STAR */
        .sparkle-star {
          position: absolute;
          top: -2px;
          right: -24px;
          width: 18px;
          height: 18px;
        }

        /* CALLIGRAPHIC UNDERLINE SWOOSH */
        .loop-swoosh {
          position: absolute;
          bottom: -14px;
          left: -4px;
          width: 165px;
          height: 28px;
          pointer-events: none;
        }

        /* SUBHEADING */
        .newsletter-subheading {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          color: #62504E;
          line-height: 1.6;
          margin-bottom: 28px;
          max-width: 440px;
        }

        /* FORM CONTAINER */
        .newsletter-form-container {
          position: relative;
          width: 100%;
          max-width: 460px;
          margin-bottom: 34px;
        }

        .newsletter-form-wrapper {
          position: relative;
          width: 100%;
        }

        /* DREAMY ROSE AURA GLOW */
        .btn-glow-aura {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          width: 140px;
          height: 70px;
          background: radial-gradient(ellipse, rgba(183, 110, 121, 0.22) 0%, transparent 72%);
          pointer-events: none;
          z-index: 1;
        }

        /* FORM PILL */
        .newsletter-form {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 9999px;
          padding: 6px 6px 6px 18px;
          box-shadow: 0 8px 24px rgba(59, 43, 43, 0.06), 0 2px 6px rgba(183, 110, 121, 0.08);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .newsletter-form:focus-within {
          border-color: #B76E79;
          box-shadow: 0 10px 28px rgba(183, 110, 121, 0.16), 0 0 0 1px rgba(183, 110, 121, 0.2);
        }

        .input-group {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
          gap: 10px;
        }

        .mail-icon {
          color: #7A6563;
          flex-shrink: 0;
        }

        .email-input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.94rem;
          color: #2D201E;
        }

        .email-input::placeholder {
          color: #8E7A77;
          font-weight: 400;
        }

        /* SUBSCRIBE BUTTON */
        .subscribe-btn {
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          padding: 11px 24px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(183, 110, 121, 0.35);
          transition: background-color 300ms ease, transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 300ms ease;
        }

        .arrow-icon {
          transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .subscribe-btn:hover {
          background-color: #9C5762;
          transform: translateY(-1.5px);
          box-shadow: 0 8px 22px rgba(183, 110, 121, 0.45);
        }

        .subscribe-btn:hover .arrow-icon {
          transform: translateX(4px);
        }

        .subscribe-btn:active {
          transform: translateY(0);
          box-shadow: 0 3px 10px rgba(183, 110, 121, 0.3);
        }

        /* SUCCESS MESSAGE */
        .newsletter-success-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid #E8D8D0;
          border-radius: 9999px;
          color: #3E8E68;
          box-shadow: 0 6px 20px rgba(59, 43, 43, 0.06);
        }

        .success-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: #2D201E;
        }

        /* 3 BENEFITS ROW */
        .newsletter-benefits {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 20px;
          width: 100%;
          max-width: 480px;
          padding-top: 4px;
        }

        .benefit-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          cursor: default;
          flex: 1;
        }

        .benefit-badge {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FEECE8 55%, #F7D4CC 100%);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 6px 16px rgba(183, 110, 121, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 320ms ease;
        }

        .benefit-item:hover .benefit-badge {
          transform: translateY(-3px) scale(1.06);
          box-shadow: 0 10px 22px rgba(183, 110, 121, 0.22), inset 0 1px 2px rgba(255, 255, 255, 1);
        }

        .benefit-svg {
          display: block;
        }

        .benefit-label {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 0.96rem;
          font-weight: 500;
          color: #2D201E;
          letter-spacing: -0.01em;
          white-space: nowrap;
          transition: color 250ms ease;
        }

        .benefit-item:hover .benefit-label {
          color: #B76E79;
        }

        .benefit-divider {
          width: 1px;
          height: 38px;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(217, 185, 138, 0.45) 30%,
            rgba(183, 110, 121, 0.35) 70%,
            transparent 100%
          );
          flex-shrink: 0;
        }

        /* STILL LIFE COLUMN (empty spacer on desktop so right photography breathes) */
        .newsletter-still-life-col {
          display: block;
          min-height: 440px;
        }

        /* REFINED ENTRANCE ANIMATIONS */
        @keyframes subtleFadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .anim-eyebrow {
          animation: subtleFadeUp 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .anim-heading {
          animation: subtleFadeUp 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards;
          opacity: 0;
        }

        .anim-supporting {
          animation: subtleFadeUp 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
          opacity: 0;
        }

        .anim-form {
          animation: subtleFadeUp 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards;
          opacity: 0;
        }

        .anim-benefits {
          animation: subtleFadeUp 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards;
          opacity: 0;
        }

        /* ACCESSIBILITY: PREFERS REDUCED MOTION */
        @media (prefers-reduced-motion: reduce) {
          .anim-eyebrow,
          .anim-heading,
          .anim-supporting,
          .anim-form,
          .anim-benefits {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .newsletter-bg-layer {
            transition: none !important;
            transform: none !important;
          }
          .subscribe-btn,
          .arrow-icon,
          .benefit-badge {
            transition: none !important;
          }
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1024px) {
          .newsletter-container {
            grid-template-columns: minmax(320px, 480px) 1fr;
            padding: 56px 28px 56px 36px;
          }
          .newsletter-heading {
            font-size: clamp(2.4rem, 4vw, 3.2rem);
          }
        }

        @media (max-width: 860px) {
          .newsletter-section {
            min-height: auto;
            padding: 60px 0 54px 0;
          }

          .newsletter-bg-layer {
            background-position: center bottom;
          }

          .newsletter-overlay-gradient {
            background: linear-gradient(
              180deg,
              rgba(255, 249, 243, 0.98) 0%,
              rgba(255, 249, 243, 0.95) 45%,
              rgba(255, 249, 243, 0.82) 70%,
              rgba(255, 249, 243, 0.45) 100%
            );
          }

          .newsletter-container {
            grid-template-columns: 1fr;
            padding: 24px 20px;
            max-width: 520px;
          }

          .newsletter-content-col {
            align-items: center;
            text-align: center;
          }

          .newsletter-subheading {
            text-align: center;
            margin-bottom: 24px;
          }

          .loop-swoosh {
            left: 50%;
            transform: translateX(-50%);
          }

          .newsletter-still-life-col {
            display: none;
          }

          .newsletter-benefits {
            justify-content: center;
          }
        }

        @media (max-width: 540px) {
          .newsletter-container {
            padding: 16px 14px;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .newsletter-form-container {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          .newsletter-form {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            padding: 4px 4px 4px 12px;
          }

          .subscribe-btn {
            padding: 9px 15px;
            font-size: 0.82rem;
          }

          .email-input {
            font-size: 0.85rem;
          }

          .newsletter-benefits {
            gap: 12px;
          }

          .benefit-badge {
            width: 48px;
            height: 48px;
          }

          .benefit-label {
            font-size: 0.84rem;
            white-space: normal;
            line-height: 1.25;
          }

          .benefit-divider {
            height: 30px;
          }
        }

        @media (max-width: 360px) {
          .newsletter-form {
            flex-direction: column;
            border-radius: 22px;
            padding: 12px 14px;
            gap: 10px;
          }

          .input-group {
            width: 100%;
          }

          .subscribe-btn {
            width: 100%;
            justify-content: center;
            padding: 11px 18px;
          }

          .newsletter-heading {
            font-size: 2.15rem;
          }

          .benefit-label {
            font-size: 0.76rem;
          }

          .benefit-badge {
            width: 42px;
            height: 42px;
          }

          .benefit-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
