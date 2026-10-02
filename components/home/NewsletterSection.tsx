'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Gift, BookOpen, Check } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing to MK Silver Hub stories.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <section
      aria-label="MK Silver Hub Newsletter"
      style={{
        width: '100%',
        backgroundColor: '#F8F7F3',
        padding: 'clamp(56px, 7vw, 96px) 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #E8E7E2',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 40px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'center',
        }}
        className="newsletter-grid"
      >
        {/* Left Side: Typography & Decorative Branch */}
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: '#111111',
              margin: '0 0 12px 0',
              lineHeight: 1.1,
            }}
          >
            STAY IN THE LOOP
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body), "Jost", -apple-system, sans-serif',
              fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)',
              color: '#6F6F6A',
              margin: 0,
              lineHeight: 1.5,
              maxWidth: '440px',
            }}
          >
            Discover new collections, limited drops and jewellery stories.
          </p>
        </div>

        {/* Right Side: Input Form & Benefit Pills */}
        <div>
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                backgroundColor: '#FFFFFF',
                border: '1px solid #111111',
                borderRadius: '0px',
                overflow: 'hidden',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === 'loading' || status === 'success'}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                  fontSize: '0.88rem',
                  color: '#111111',
                  background: 'transparent',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0 28px',
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s ease',
                }}
                className="newsletter-btn"
              >
                <span>{status === 'success' ? 'SUBSCRIBED' : 'SUBSCRIBE'}</span>
                {status === 'success' ? <Check size={14} /> : <ArrowRight size={14} />}
              </button>
            </div>

            {message && (
              <p
                style={{
                  fontFamily: 'var(--font-ui), "Jost", sans-serif',
                  fontSize: '0.78rem',
                  color: status === 'error' ? '#D9534F' : '#2E7D32',
                  marginTop: '8px',
                  marginBottom: 0,
                }}
              >
                {message}
              </p>
            )}
          </form>

          {/* 3 Benefit Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(16px, 2.5vw, 32px)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6F6F6A' }}>
              <Sparkles size={15} color="#111111" />
              <span style={{ fontFamily: 'var(--font-ui), "Jost", sans-serif', fontSize: '0.76rem' }}>
                New Arrivals
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6F6F6A' }}>
              <Gift size={15} color="#111111" />
              <span style={{ fontFamily: 'var(--font-ui), "Jost", sans-serif', fontSize: '0.76rem' }}>
                Private Offers
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6F6F6A' }}>
              <BookOpen size={15} color="#111111" />
              <span style={{ fontFamily: 'var(--font-ui), "Jost", sans-serif', fontSize: '0.76rem' }}>
                Jewellery Stories
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .newsletter-btn:hover:not(:disabled) {
          background-color: #252525 !important;
        }
        @media (max-width: 900px) {
          .newsletter-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
