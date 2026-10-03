'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
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

export default function LuxuryLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '';

  // Form states strictly empty by default — no prefilled values or hardcoded data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleNotice, setGoogleNotice] = useState(false);

  // Load remembered email on mount if previously stored
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('mk_remember_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

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
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (rememberMe) {
        try {
          localStorage.setItem('mk_remember_email', trimmedEmail);
        } catch {
          // Ignore storage failures
        }
      } else {
        try {
          localStorage.removeItem('mk_remember_email');
        } catch {
          // Ignore storage failures
        }
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email address or password.');
        setPassword('');
        setLoading(false);
        return;
      }

      setSuccess('Signing in to your MK Silver Hub account...');

      const target =
        redirectTo || data.redirectUrl || (data.user?.role === 'ADMIN' ? '/admin' : '/account');

      setTimeout(() => {
        router.push(target);
        router.refresh();
      }, 400);
    } catch {
      setError('Unable to connect to the authentication service. Please check your network.');
      setPassword('');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleNotice(true);
    setTimeout(() => {
      setGoogleNotice(false);
    }, 4000);
  };

  const registerHref = redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : '/register';
  const forgotHref = redirectTo ? `/forgot-password?redirect=${encodeURIComponent(redirectTo)}` : '/forgot-password';

  return (
    <div
      className="login-page-root"
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
        className="login-visual"
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
        {/* Subtle, ultra-light vignette overlay to preserve jewellery sharpness and ensure text contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.45) 100%)',
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
            925 STERLING SILVER
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
            CRAFTED<br />
            FOR YOUR<br />
            EVERYDAY.
          </h2>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '360px',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}
          >
            Contemporary 925 sterling silver jewellery, designed in Jaipur for modern expression.
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

        {/* Bottom Editorial Brand Signature */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif), "Cormorant Garamond", serif',
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              color: '#FFFFFF',
              marginBottom: '10px',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}
          >
            MK
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif), "Cormorant Garamond", serif',
              letterSpacing: '0.24em',
              fontSize: '0.95rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textShadow: '0 1px 4px rgba(0,0,0,0.45)',
            }}
          >
            MK SILVER HUB
          </div>
          <div
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.85)',
              marginTop: '2px',
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}
          >
            FINE 925 STERLING JEWELLERY
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif), "Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '6px',
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}
          >
            &ldquo;Designed to be remembered.&rdquo;
          </div>
        </div>
      </aside>

      {/* ========================================================
          RIGHT COLUMN — 45% DESKTOP CLEAN WHITE AUTHENTICATION PANEL
         ======================================================== */}
      <main
        className="login-panel"
        style={{
          width: '45%',
          height: '100dvh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 'clamp(20px, 3.5vw, 40px)',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Top Action Row: Back to Store (Positioned neatly inside the panel) */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(16px, 2.5vw, 28px)',
            right: 'clamp(18px, 3vw, 36px)',
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

        {/* Centered Form Card — strictly constrained max width 420px */}
        <div
          style={{
            width: 'min(100% - 32px, 420px)',
            margin: 'auto 0',
            boxSizing: 'border-box',
          }}
        >
          {/* Small Logo / Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid #111111',
                margin: '0 auto 10px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
                fontSize: '1rem',
                letterSpacing: '0.08em',
                color: '#111111',
                fontWeight: 400,
              }}
            >
              MK
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
                letterSpacing: '0.24em',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#111111',
              }}
            >
              MK SILVER HUB
            </div>
            <div
              style={{
                fontSize: '0.58rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                marginTop: '2px',
              }}
            >
              FINE 925 STERLING JEWELLERY
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(1.65rem, 2.2vw, 1.95rem)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#111111',
                margin: '0 0 8px 0',
                lineHeight: 1.15,
              }}
            >
              WELCOME BACK
            </h1>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#6F6F6A',
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              Sign in to continue to your MK Silver Hub account.
            </p>
          </div>

          {/* Error and Feedback Notices */}
          {error && (
            <div
              role="alert"
              style={{
                marginBottom: '16px',
                padding: '10px 12px',
                backgroundColor: '#FFF5F5',
                border: '1px solid #FED7D7',
                borderRadius: '6px',
                color: '#C53030',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.4,
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
                marginBottom: '16px',
                padding: '10px 12px',
                backgroundColor: '#111111',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={14} style={{ flexShrink: 0, color: '#48BB78' }} />
              <span>{success}</span>
            </div>
          )}

          {googleNotice && (
            <div
              role="status"
              style={{
                marginBottom: '16px',
                padding: '10px 12px',
                backgroundColor: '#F8F7F3',
                border: '1px solid #E8E7E2',
                borderRadius: '6px',
                color: '#252525',
                fontSize: '0.74rem',
                display: 'flex',
                alignItems: 'start',
                gap: '8px',
                lineHeight: 1.4,
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#6F6F6A' }} />
              <span>Google authentication is being configured. Please use your email and password to sign in.</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Email Address Field */}
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: '#252525',
                  marginBottom: '6px',
                  letterSpacing: '0.02em',
                }}
              >
                Email Address
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
                  <Mail size={15} />
                </span>
                <input
                  id="login-email"
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
                  placeholder="Enter your email address"
                  style={{
                    width: '100%',
                    height: '46px',
                    paddingLeft: '38px',
                    paddingRight: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E7E2',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
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

            {/* Password Field */}
            <div>
              <label
                htmlFor="login-password"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: '#252525',
                  marginBottom: '6px',
                  letterSpacing: '0.02em',
                }}
              >
                Password
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
                  <Lock size={15} />
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    height: '46px',
                    paddingLeft: '38px',
                    paddingRight: '40px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E7E2',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#6F6F6A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  marginBottom: '2px',
                }}
              >
                {/* Remember Me Checkbox */}
                <label
                  htmlFor="login-remember-me"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    id="login-remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                  />
                  <span
                    style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '3px',
                      border: rememberMe ? '1px solid #111111' : '1px solid #D8D5CE',
                      backgroundColor: rememberMe ? '#111111' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {rememberMe && <Check size={11} strokeWidth={2.8} color="#FFFFFF" />}
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: '#252525',
                      fontWeight: 500,
                      letterSpacing: '0.01em',
                    }}
                  >
                    Remember me
                  </span>
                </label>

                {/* Forgot Password Link */}
                <Link
                  href={forgotHref}
                  style={{
                    fontSize: '0.72rem',
                    color: '#6F6F6A',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#111111';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6F6F6A';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
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
                  transition: 'background-color 0.2s ease, transform 0.1s ease',
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
                    <span>SIGNING IN...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social Divider */}
          <div
            style={{
              position: 'relative',
              textAlign: 'center',
              margin: '20px 0',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '100%', borderTop: '1px solid #E8E7E2' }} />
            </div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '0 12px',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#6F6F6A',
                }}
              >
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E7E2',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: '#252525',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8F7F3';
              e.currentTarget.style.borderColor = '#BFC1C4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E8E7E2';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Register Prompt */}
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <p style={{ fontSize: '0.74rem', color: '#6F6F6A', margin: 0 }}>
              Don&apos;t have an account?{' '}
              <Link
                href={registerHref}
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
                <span>CREATE ACCOUNT</span>
                <ArrowRight size={11} />
              </Link>
            </p>
          </div>

          {/* Security Text — Inside the Right Login Panel */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '14px',
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
            <span>Secure Login · Your account information is protected.</span>
          </div>
        </div>
      </main>

      {/* Responsive Media Query Styles strictly scoped to .login-page-root */}
      <style jsx>{`
        @media (max-width: 1023px) {
          .login-page-root {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100dvh !important;
            overflow-y: auto !important;
          }
          .login-visual {
            width: 100% !important;
            height: 240px !important;
            min-height: 240px !important;
            padding: 20px !important;
          }
          .login-panel {
            width: 100% !important;
            height: auto !important;
            min-height: calc(100dvh - 240px) !important;
            padding: 24px 20px 32px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
