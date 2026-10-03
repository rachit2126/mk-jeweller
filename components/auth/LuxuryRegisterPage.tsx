'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Check,
} from 'lucide-react';

export default function LuxuryRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '';

  // Form states strictly empty by default — no prefilled values or hardcoded data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!terms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: phone.trim(),
          password,
          confirmPassword,
          terms,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Unable to complete registration. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess('Account created successfully! Preparing your patron account...');

      const target = redirectTo || data.redirectUrl || '/account';

      setTimeout(() => {
        router.push(target);
        router.refresh();
      }, 500);
    } catch {
      setError('Unable to connect to the registration service. Please verify your connection.');
      setLoading(false);
    }
  };

  const loginHref = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login';

  return (
    <div
      className="register-page-root"
      style={{
        width: '100vw',
        minHeight: '100dvh',
        height: '100dvh',
        backgroundColor: '#FFFFFF',
        color: '#111111',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
        fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
      }}
    >
      {/* ========================================================
          LEFT COLUMN — 55% DESKTOP EDITORIAL JEWELLERY VISUAL
         ======================================================== */}
      <aside
        className="register-visual"
        aria-label="MK Silver Hub Editorial Campaign"
        style={{
          width: '55%',
          height: '100dvh',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#111111',
          backgroundImage: "url('/images/editorial/login-editorial-heritage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(28px, 4vw, 48px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle vignette gradient for crystal-clear readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Campaign Typography */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.68rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '10px',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}
          >
            MK SILVER HUB · 925 STERLING
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2rem, 3.2vw, 3rem)',
              lineHeight: 1.08,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: '0 0 12px 0',
              textShadow: '0 2px 8px rgba(0,0,0,0.45)',
            }}
          >
            CREATE YOUR<br />
            SIGNATURE.
          </h2>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '380px',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}
          >
            Discover contemporary 925 sterling silver jewellery, designed in Jaipur for modern expression.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
            }}
          >
            <span style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }} />
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.8)' }} />
          </div>
        </div>

        {/* Bottom Editorial Trust Points */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              maxWidth: '520px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
                01
              </div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#FFFFFF', fontWeight: 600, textTransform: 'uppercase', marginTop: '3px' }}>
                925 STERLING
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>
                Authentic & Hallmarked
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
                02
              </div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#FFFFFF', fontWeight: 600, textTransform: 'uppercase', marginTop: '3px' }}>
                SECURE SHIPPING
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>
                Insured Across India
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
                03
              </div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#FFFFFF', fontWeight: 600, textTransform: 'uppercase', marginTop: '3px' }}>
                EASY EXCHANGE
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>
                Simple & Hassle-Free
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================
          RIGHT COLUMN — 45% DESKTOP CLEAN WHITE REGISTRATION PANEL
         ======================================================== */}
      <main
        className="register-panel"
        style={{
          width: '45%',
          height: '100dvh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 'clamp(16px, 2.8vw, 36px)',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Top Action Row: Back to Store */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(14px, 2vw, 24px)',
            right: 'clamp(16px, 2.5vw, 32px)',
            zIndex: 10,
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#6F6F6A',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#111111')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6F6F6A')}
            aria-label="Back to MK Silver Hub store"
          >
            <ArrowLeft size={13} />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Centered Form Card — max width 460px */}
        <div
          style={{
            width: 'min(100% - 32px, 460px)',
            margin: 'auto 0',
            boxSizing: 'border-box',
            paddingTop: '16px',
            paddingBottom: '16px',
          }}
        >
          {/* Compact Auth Switcher: SIGN IN / CREATE ACCOUNT */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F8F7F3',
              padding: '3px',
              borderRadius: '6px',
              border: '1px solid #E8E7E2',
              marginBottom: '16px',
            }}
          >
            <Link
              href={loginHref}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '7px 0',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#111111')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6F6F6A')}
            >
              SIGN IN
            </Link>
            <span
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '7px 0',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
            >
              CREATE ACCOUNT
            </span>
          </div>

          {/* Heading & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(1.5rem, 2vw, 1.8rem)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#111111',
                margin: '0 0 4px 0',
                lineHeight: 1.15,
              }}
            >
              CREATE ACCOUNT
            </h1>
            <p
              style={{
                fontSize: '0.78rem',
                color: '#6F6F6A',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Join MK Silver Hub and discover fine 925 sterling jewellery.
            </p>
          </div>

          {/* Error and Success Notices */}
          {error && (
            <div
              role="alert"
              style={{
                marginBottom: '12px',
                padding: '9px 12px',
                backgroundColor: '#FFF5F5',
                border: '1px solid #FED7D7',
                borderRadius: '6px',
                color: '#C53030',
                fontSize: '0.74rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.35,
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              style={{
                marginBottom: '12px',
                padding: '9px 12px',
                backgroundColor: '#111111',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={14} style={{ flexShrink: 0, color: '#48BB78' }} />
              <span>{success}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="reg-name"
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: '#252525',
                  marginBottom: '4px',
                  letterSpacing: '0.02em',
                }}
              >
                Full Name *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    pointerEvents: 'none',
                    color: '#6F6F6A',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <User size={15} />
                </span>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    height: '44px',
                    paddingLeft: '38px',
                    paddingRight: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E7E2',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    color: '#111111',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#111111';
                    e.currentTarget.style.boxShadow = '0 0 0 1px #111111';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E8E7E2';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Email & Phone side-by-side or stacked cleanly */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div>
                <label
                  htmlFor="reg-email"
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: '#252525',
                    marginBottom: '4px',
                    letterSpacing: '0.02em',
                  }}
                >
                  Email Address *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '11px',
                      pointerEvents: 'none',
                      color: '#6F6F6A',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Mail size={14} />
                  </span>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      height: '44px',
                      paddingLeft: '34px',
                      paddingRight: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E7E2',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#111111',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#111111';
                      e.currentTarget.style.boxShadow = '0 0 0 1px #111111';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E8E7E2';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: '#252525',
                    marginBottom: '4px',
                    letterSpacing: '0.02em',
                  }}
                >
                  Phone Number
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '11px',
                      pointerEvents: 'none',
                      color: '#6F6F6A',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Phone size={14} />
                  </span>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="98765 43210"
                    style={{
                      width: '100%',
                      height: '44px',
                      paddingLeft: '34px',
                      paddingRight: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E7E2',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#111111',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#111111';
                      e.currentTarget.style.boxShadow = '0 0 0 1px #111111';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E8E7E2';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label
                  htmlFor="reg-password"
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: '#252525',
                    marginBottom: '4px',
                    letterSpacing: '0.02em',
                  }}
                >
                  Password *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '11px',
                      pointerEvents: 'none',
                      color: '#6F6F6A',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Lock size={14} />
                  </span>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Min 6 chars"
                    style={{
                      width: '100%',
                      height: '44px',
                      paddingLeft: '34px',
                      paddingRight: '34px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E7E2',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#111111',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#111111';
                      e.currentTarget.style.boxShadow = '0 0 0 1px #111111';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E8E7E2';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#6F6F6A',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-confirm-password"
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: '#252525',
                    marginBottom: '4px',
                    letterSpacing: '0.02em',
                  }}
                >
                  Confirm Password *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '11px',
                      pointerEvents: 'none',
                      color: '#6F6F6A',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Lock size={14} />
                  </span>
                  <input
                    id="reg-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Re-enter password"
                    style={{
                      width: '100%',
                      height: '44px',
                      paddingLeft: '34px',
                      paddingRight: '34px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E7E2',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#111111',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#111111';
                      e.currentTarget.style.boxShadow = '0 0 0 1px #111111';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E8E7E2';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#6F6F6A',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
              <input
                id="reg-terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  if (error) setError('');
                }}
                style={{
                  width: '16px',
                  height: '16px',
                  marginTop: '2px',
                  accentColor: '#111111',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <label htmlFor="reg-terms" style={{ fontSize: '0.72rem', color: '#6F6F6A', lineHeight: 1.45, cursor: 'pointer' }}>
                I agree to the{' '}
                <Link href="/terms" target="_blank" style={{ color: '#111111', textDecoration: 'underline' }}>
                  Terms &amp; Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" style={{ color: '#111111', textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Create Account Button */}
            <div style={{ marginTop: '6px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s ease',
                  boxShadow: '0 2px 6px rgba(17, 17, 17, 0.12)',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#252525';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#111111';
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Already have an account prompt */}
          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <p style={{ fontSize: '0.74rem', color: '#6F6F6A', margin: 0 }}>
              Already have an account?{' '}
              <Link
                href={loginHref}
                style={{
                  color: '#111111',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <span>SIGN IN</span>
                <ArrowRight size={11} />
              </Link>
            </p>
          </div>

          {/* Security Message — Inside the Right Panel */}
          <div
            style={{
              marginTop: '14px',
              paddingTop: '10px',
              borderTop: '1px solid #F2F0EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textAlign: 'center',
              fontSize: '11px',
              color: '#6F6F6A',
            }}
          >
            <ShieldCheck size={13} style={{ flexShrink: 0, color: '#6F6F6A' }} />
            <span>Secure account creation · Your information is handled securely.</span>
          </div>
        </div>
      </main>

      {/* Responsive Media Query Styles strictly scoped to .register-page-root */}
      <style jsx>{`
        @media (max-width: 1023px) {
          .register-page-root {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100dvh !important;
            overflow-y: auto !important;
          }
          .register-visual {
            width: 100% !important;
            height: 220px !important;
            min-height: 220px !important;
            padding: 20px !important;
          }
          .register-panel {
            width: 100% !important;
            height: auto !important;
            min-height: calc(100dvh - 220px) !important;
            padding: 24px 20px 32px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
