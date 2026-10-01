'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Truck,
  ShieldCheck,
  Headphones,
  LogIn,
  UserPlus,
  Gem,
  ChevronDown,
} from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

interface LuxuryAuthExperienceProps {
  initialMode?: 'login' | 'register';
  initialRedirect?: string;
}

export default function LuxuryAuthExperience({
  initialMode = 'register',
  initialRedirect,
}: LuxuryAuthExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || initialRedirect || '';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Sync mode with route changes or prop
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // LOGIN STATE — STRICTLY EMPTY INITIAL VALUES
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRememberMe, setLoginRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // REGISTER STATE — STRICTLY EMPTY INITIAL VALUES
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCountryCode, setRegCountryCode] = useState('+91');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTerms, setRegTerms] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Switch tabs smoothly and update URL without full page reload
  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setLoginError('');
    setRegError('');
    const targetUrl = newMode === 'login' ? '/login' : '/register';
    const finalUrl = redirectTo ? `${targetUrl}?redirect=${encodeURIComponent(redirectTo)}` : targetUrl;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', finalUrl);
    }
  };

  // LOGIN SUBMIT HANDLER
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginLoading) return;

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email or username.');
      return;
    }

    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
          rememberMe: loginRememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Invalid email or password.');
        setLoginPassword('');
        setLoginLoading(false);
        return;
      }

      setLoginSuccess('Signing in to your patron account...');

      const target =
        redirectTo || data.redirectUrl || (data.user?.role === 'USER' ? '/account' : '/admin');

      setTimeout(() => {
        router.push(target);
        router.refresh();
      }, 500);
    } catch {
      setLoginError('Unable to connect. Please verify your connection.');
      setLoginPassword('');
      setLoginLoading(false);
    }
  };

  // REGISTER SUBMIT HANDLER
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regLoading) return;

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }

    if (!regEmail.trim()) {
      setRegError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setRegError('Please enter a valid email address.');
      return;
    }

    if (!regPassword) {
      setRegError('Please enter a password.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (regPhone.trim()) {
      const cleanPhone = regPhone.replace(/[\s\-\(\)\+]/g, '');
      if (cleanPhone.length < 10) {
        setRegError('Please enter a valid phone number (at least 10 digits).');
        return;
      }
    }

    if (!regTerms) {
      setRegError('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setRegLoading(true);
    setRegError('');
    setRegSuccess('');

    try {
      const fullPhone = regPhone.trim() ? `${regCountryCode} ${regPhone.trim()}` : '';

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: fullPhone,
          password: regPassword,
          confirmPassword: regConfirmPassword,
          terms: regTerms,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setRegError(data.error || 'Unable to create account. Please try again.');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegLoading(false);
        return;
      }

      setRegSuccess('Account created successfully! Directing to patron portal...');

      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegTerms(false);

      const target = redirectTo || data.redirectUrl || '/account';

      setTimeout(() => {
        router.push(target);
        router.refresh();
      }, 700);
    } catch {
      setRegError('Network connection error. Please verify your connection.');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegLoading(false);
    }
  };

  return (
    <div className="auth-root-viewport">
      {/* SHARP, CLEAR FULL BACKGROUND IMAGE (ZERO BLUR) */}
      <div className="auth-bg-layer" />

      {/* NATURAL SOFT READABILITY GRADIENT OVERLAY (FADES NATURALLY, NO RECTANGULAR BOX) */}
      <div className="auth-readability-overlay" />

      {/* Main Grid Container: 54% Left Editorial / 46% Right Floating Card */}
      <div className="auth-grid-container">
        {/* ============================================================ */}
        {/* LEFT EDITORIAL BRAND PANEL                                  */}
        {/* ============================================================ */}
        <aside className="auth-left-editorial">
          <div className="editorial-inner-stack">
            {/* Top Brand Logo */}
            <div className="editorial-logo-box anim-fade-up anim-d0">
              <BrandLogo layout="stacked" size="normal" showTagline={true} />
            </div>

            {/* Headline + Editorial Copy */}
            <div className="editorial-hero anim-fade-up anim-d1">
              <h1 className="editorial-heading">
                <span className="heading-line-1">Timeless Brilliance</span>
                <span className="heading-line-2">
                  For <span className="editorial-script-accent">Every You</span>
                  <span className="swash-heart-wrap">
                    <svg
                      width="40"
                      height="20"
                      viewBox="0 0 40 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-swash-svg"
                    >
                      <path
                        d="M2 11C9 11 14 9.5 19 8C23 7 26 9.5 28 8C30 6.5 32.5 5.5 35 7C37 8.5 37 11.5 35 13.5C33 15.5 30.5 16 28.5 14C27 12.5 27.5 10 29.5 8.5C31.5 7.5 34 8 36 9.5"
                        stroke="#B76E79"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </h1>
              <p className="editorial-description">
                Discover our exclusive 925 sterling silver jewellery crafted for modern elegance and
                everyday luxury.
              </p>
            </div>

            {/* 4 Compact Editorial Benefit Rows */}
            <div className="editorial-benefits-group anim-fade-up anim-d2">
              {/* Benefit 01 */}
              <div className="benefit-item">
                <div className="benefit-num">01</div>
                <div className="benefit-icon-bubble">
                  <Gem size={15} />
                </div>
                <div className="benefit-details">
                  <span className="benefit-main">100% 925 Sterling Silver</span>
                  <span className="benefit-caption">Authentic &amp; Hallmarked</span>
                </div>
              </div>

              {/* Benefit 02 */}
              <div className="benefit-item">
                <div className="benefit-num">02</div>
                <div className="benefit-icon-bubble">
                  <Truck size={15} />
                </div>
                <div className="benefit-details">
                  <span className="benefit-main">Secure &amp; Fast Delivery</span>
                  <span className="benefit-caption">Across India</span>
                </div>
              </div>

              {/* Benefit 03 */}
              <div className="benefit-item">
                <div className="benefit-num">03</div>
                <div className="benefit-icon-bubble">
                  <ShieldCheck size={15} />
                </div>
                <div className="benefit-details">
                  <span className="benefit-main">Safe &amp; Secure Payments</span>
                  <span className="benefit-caption">Multiple Payment Options</span>
                </div>
              </div>

              {/* Benefit 04 */}
              <div className="benefit-item">
                <div className="benefit-num">04</div>
                <div className="benefit-icon-bubble">
                  <Headphones size={15} />
                </div>
                <div className="benefit-details">
                  <span className="benefit-main">Dedicated Support</span>
                  <span className="benefit-caption">We&apos;re here to help</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* RIGHT FLOATING LUXURY AUTH CARD                              */}
        {/* ============================================================ */}
        <section className="auth-right-panel">
          <div className="luxury-auth-card anim-card-in">
            {/* Mobile-Only Header */}
            <div className="mobile-only-brand">
              <BrandLogo layout="stacked" size="compact" showTagline={true} />
            </div>

            {/* TAB SWITCHER: [ Sign In ] [ Create Account ] */}
            <div className="auth-tab-bar" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                onClick={() => switchMode('login')}
                className={`auth-tab-btn ${mode === 'login' ? 'is-active' : ''}`}
              >
                <div className="tab-icon-frame">
                  <LogIn size={15} />
                </div>
                <div className="tab-text-stack">
                  <span className="tab-head">Sign In</span>
                  <span className="tab-sub">Welcome back</span>
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                onClick={() => switchMode('register')}
                className={`auth-tab-btn ${mode === 'register' ? 'is-active' : ''}`}
              >
                <div className="tab-icon-frame">
                  <UserPlus size={15} />
                </div>
                <div className="tab-text-stack">
                  <span className="tab-head">Create Account</span>
                  <span className="tab-sub">Join community</span>
                </div>
              </button>
            </div>

            {/* ========================================================== */}
            {/* VIEW A: CREATE ACCOUNT FORM                                */}
            {/* ========================================================== */}
            {mode === 'register' && (
              <div className="auth-form-body">
                <div className="form-header-area">
                  <h2 className="form-title">Create Account</h2>
                  <p className="form-subtitle">
                    Join MK Silver Hub and discover fine 925 jewellery.
                  </p>
                </div>

                {regError && (
                  <div className="alert-message alert-error" role="alert">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="alert-message alert-success" role="status">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="auth-input-form" noValidate>
                  {/* Full Name */}
                  <div className="field-block">
                    <label htmlFor="auth-full-name" className="field-label">
                      Full Name *
                    </label>
                    <div className="input-shell">
                      <User size={15} className="field-icon" aria-hidden="true" />
                      <input
                        id="auth-full-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={regName}
                        onChange={(e) => {
                          setRegName(e.target.value);
                          if (regError) setRegError('');
                        }}
                        className="field-text-input"
                        disabled={regLoading}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="field-block">
                    <label htmlFor="auth-email" className="field-label">
                      Email Address *
                    </label>
                    <div className="input-shell">
                      <Mail size={15} className="field-icon" aria-hidden="true" />
                      <input
                        id="auth-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Enter your email address"
                        value={regEmail}
                        onChange={(e) => {
                          setRegEmail(e.target.value);
                          if (regError) setRegError('');
                        }}
                        className="field-text-input"
                        disabled={regLoading}
                      />
                    </div>
                  </div>

                  {/* Phone Number (Optional) with +91 Country Pill */}
                  <div className="field-block">
                    <label htmlFor="auth-phone" className="field-label">
                      Phone Number <span className="field-opt">(Optional)</span>
                    </label>
                    <div className="phone-composite-wrap">
                      <div className="country-code-pill">
                        <span>{regCountryCode}</span>
                        <ChevronDown size={12} className="opacity-60" />
                        <select
                          aria-label="Country Code"
                          value={regCountryCode}
                          onChange={(e) => setRegCountryCode(e.target.value)}
                          className="country-dropdown-overlay"
                        >
                          <option value="+91">+91 (India)</option>
                          <option value="+1">+1 (US/Canada)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+971">+971 (UAE)</option>
                          <option value="+61">+61 (Australia)</option>
                          <option value="+65">+65 (Singapore)</option>
                        </select>
                      </div>

                      <div className="input-shell phone-input-shell">
                        <Phone size={14} className="field-icon" aria-hidden="true" />
                        <input
                          id="auth-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="Enter your phone number"
                          value={regPhone}
                          onChange={(e) => {
                            setRegPhone(e.target.value);
                            if (regError) setRegError('');
                          }}
                          className="field-text-input"
                          disabled={regLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="field-block">
                    <label htmlFor="auth-reg-password" className="field-label">
                      Password *
                    </label>
                    <div className="input-shell">
                      <Lock size={15} className="field-icon" aria-hidden="true" />
                      <input
                        id="auth-reg-password"
                        name="password"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="Create a password (min 6 characters)"
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (regError) setRegError('');
                        }}
                        className="field-text-input pr-10"
                        disabled={regLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="eye-toggle-btn"
                        aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="field-block">
                    <label htmlFor="auth-confirm-password" className="field-label">
                      Confirm Password *
                    </label>
                    <div className="input-shell">
                      <Lock size={15} className="field-icon" aria-hidden="true" />
                      <input
                        id="auth-confirm-password"
                        name="confirmPassword"
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          if (regError) setRegError('');
                        }}
                        className="field-text-input pr-10"
                        disabled={regLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="eye-toggle-btn"
                        aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="terms-checkbox-wrap">
                    <label className="checkbox-label" htmlFor="auth-terms">
                      <input
                        id="auth-terms"
                        name="terms"
                        type="checkbox"
                        checked={regTerms}
                        onChange={(e) => {
                          setRegTerms(e.target.checked);
                          if (regError) setRegError('');
                        }}
                        className="styled-checkbox"
                      />
                      <span className="checkbox-text">
                        I agree to the{' '}
                        <Link href="/terms" target="_blank" className="policy-link">
                          Terms &amp; Conditions
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" target="_blank" className="policy-link">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                  </div>

                  {/* Create Account Button */}
                  <button
                    type="submit"
                    disabled={regLoading || !regTerms}
                    className="submit-action-btn"
                  >
                    {regLoading ? (
                      <span className="btn-content">
                        <RefreshCw size={15} className="spin-animation" />
                        <span>Creating Account...</span>
                      </span>
                    ) : (
                      <span className="btn-content">
                        <span>Create Account</span>
                        <ArrowRight size={15} className="btn-arrow-icon" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="card-bottom-switch">
                  <span className="switch-prompt">Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="switch-action-link"
                  >
                    Sign In →
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* VIEW B: SIGN IN FORM                                       */}
            {/* ========================================================== */}
            {mode === 'login' && (
              <div className="auth-form-body">
                <div className="form-header-area">
                  <h2 className="form-title">Welcome Back</h2>
                  <p className="form-subtitle">
                    Sign in to access your MK Silver Hub account.
                  </p>
                </div>

                {loginError && (
                  <div className="alert-message alert-error" role="alert">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {loginSuccess && (
                  <div className="alert-message alert-success" role="status">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>{loginSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="auth-input-form" noValidate>
                  {/* Email or Username */}
                  <div className="field-block">
                    <label htmlFor="auth-login-identifier" className="field-label">
                      Email or Username *
                    </label>
                    <div className="input-shell">
                      <Mail size={15} className="field-icon" aria-hidden="true" />
                      <input
                        id="auth-login-identifier"
                        name="email"
                        type="text"
                        required
                        autoComplete="username"
                        placeholder="Enter your email or username"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          if (loginError) setLoginError('');
                        }}
                        className="field-text-input"
                        disabled={loginLoading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="field-block">
                    <div className="field-label-split">
                      <label htmlFor="auth-login-password" className="field-label">
                        Password *
                      </label>
                      <Link href="/forgot-password" className="forgot-pass-anchor">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="input-shell">
                      <Lock size={15} className="field-icon" aria-hidden="true" />
                      <input
                        id="auth-login-password"
                        name="password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginError) setLoginError('');
                        }}
                        className="field-text-input pr-10"
                        disabled={loginLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="eye-toggle-btn"
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="remember-me-row">
                    <label className="checkbox-label" htmlFor="auth-remember">
                      <input
                        id="auth-remember"
                        name="rememberMe"
                        type="checkbox"
                        checked={loginRememberMe}
                        onChange={(e) => setLoginRememberMe(e.target.checked)}
                        className="styled-checkbox"
                      />
                      <span className="checkbox-text">Remember me</span>
                    </label>
                  </div>

                  {/* Sign In CTA */}
                  <button type="submit" disabled={loginLoading} className="submit-action-btn">
                    {loginLoading ? (
                      <span className="btn-content">
                        <RefreshCw size={15} className="spin-animation" />
                        <span>Signing In...</span>
                      </span>
                    ) : (
                      <span className="btn-content">
                        <span>Sign In</span>
                        <ArrowRight size={15} className="btn-arrow-icon" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="card-bottom-switch">
                  <span className="switch-prompt">Don&apos;t have an account?</span>
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="switch-action-link"
                  >
                    Create Account →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* SCOPED COMPONENT STYLES                                      */}
      {/* ============================================================ */}
      <style jsx>{`
        /* ------------------------------------------------------------- */
        /* ROOT VIEWPORT: Full-Screen Natural Viewport                   */
        /* ------------------------------------------------------------- */
        .auth-root-viewport {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          background-color: #fff8f2;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-x: hidden;
        }

        @media (min-width: 1024px) {
          .auth-root-viewport {
            height: 100dvh;
            max-height: 100dvh;
            overflow: hidden;
          }
        }

        /* ------------------------------------------------------------- */
        /* BACKGROUND IMAGE: CRISP, SHARP, EDITORIAL LUXURY JEWELLERY     */
        /* (NO BLUR FILTER, NO FROSTED EFFECT, SHIFTED FOR PERFECT SPACE)*/
        /* ------------------------------------------------------------- */
        .auth-bg-layer {
          position: absolute;
          inset: 0;
          background-image: url('/images/auth-editorial-bg.jpg');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          z-index: 1;
        }

        @media (min-width: 1024px) {
          .auth-bg-layer {
            background-position: 40% center;
          }
        }

        @media (max-width: 1023px) and (min-width: 769px) {
          .auth-bg-layer {
            background-position: 60% center;
          }
        }

        @media (max-width: 768px) {
          .auth-bg-layer {
            background-position: 65% center;
          }
        }

        /* ------------------------------------------------------------- */
        /* SUBTLE READABILITY OVERLAY GRADIENT                           */
        /* (EXTREMELY NATURAL, ELEVATES TEXT READABILITY, NO BLUR)       */
        /* ------------------------------------------------------------- */
        .auth-readability-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            rgba(255, 250, 246, 0.82) 0%,
            rgba(255, 250, 246, 0.62) 36%,
            rgba(255, 250, 246, 0.22) 68%,
            rgba(255, 250, 246, 0.04) 100%
          );
        }

        @media (max-width: 1023px) {
          .auth-readability-overlay {
            background: linear-gradient(
              180deg,
              rgba(255, 250, 246, 0.88) 0%,
              rgba(255, 250, 246, 0.65) 45%,
              rgba(255, 250, 246, 0.92) 100%
            );
          }
        }

        /* ------------------------------------------------------------- */
        /* GRID LAYOUT: Left Editorial (53%) / Right Auth Card (47%)     */
        /* ------------------------------------------------------------- */
        .auth-grid-container {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 1024px) {
          .auth-grid-container {
            display: grid;
            grid-template-columns: 53% 47%;
            align-items: center;
            height: 100dvh;
            max-height: 100dvh;
            padding: 0 clamp(20px, 3.5vw, 64px);
          }
        }

        @media (min-width: 1440px) {
          .auth-grid-container {
            grid-template-columns: 54% 46%;
            max-width: 1680px;
            margin: 0 auto;
          }
        }

        /* ------------------------------------------------------------- */
        /* LEFT EDITORIAL BRAND PANEL                                    */
        /* ------------------------------------------------------------- */
        .auth-left-editorial {
          display: none;
        }

        @media (min-width: 1024px) {
          .auth-left-editorial {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            padding: clamp(20px, 3vh, 36px) 40px clamp(20px, 3vh, 36px) clamp(32px, 6vw, 80px);
            max-width: 580px;
          }
        }

        .editorial-inner-stack {
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2.2vh, 24px);
        }

        .editorial-logo-box {
          display: flex;
          align-items: center;
        }

        .editorial-hero {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .editorial-heading {
          font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.2rem, 3.2vw, 3.2rem);
          font-weight: 500;
          line-height: 1.02;
          color: #342727;
          margin: 0;
          letter-spacing: -0.015em;
        }

        .heading-line-1 {
          display: block;
        }

        .heading-line-2 {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }

        .editorial-script-accent {
          font-family: 'Caveat', cursive;
          font-style: normal;
          font-size: 1.25em;
          font-weight: 600;
          color: #b76e79;
          letter-spacing: 0.02em;
        }

        .swash-heart-wrap {
          display: inline-flex;
          align-items: center;
          transform: translateY(2px);
          margin-left: 2px;
        }

        .inline-swash-svg {
          display: inline-block;
          overflow: visible;
        }

        .editorial-description {
          font-family: 'Jost', sans-serif;
          font-size: clamp(0.92rem, 1.05vw, 1.02rem);
          line-height: 1.55;
          color: #5c4a45;
          margin: 0;
          max-width: 480px;
        }

        /* 4 Brand Benefits */
        .editorial-benefits-group {
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin-top: 4px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .benefit-num {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          color: #b76e79;
          letter-spacing: 0.05em;
          opacity: 0.85;
          width: 18px;
        }

        .benefit-icon-bubble {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(231, 222, 213, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b76e79;
          box-shadow: 0 4px 10px rgba(52, 39, 39, 0.05);
          flex-shrink: 0;
        }

        .benefit-details {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .benefit-main {
          font-family: 'Jost', sans-serif;
          font-size: 0.86rem;
          font-weight: 600;
          color: #342727;
          letter-spacing: 0.01em;
        }

        .benefit-caption {
          font-family: 'Jost', sans-serif;
          font-size: 0.76rem;
          color: #6e5c57;
        }

        /* ------------------------------------------------------------- */
        /* RIGHT PANEL & FLOATING AUTHENTICATION CARD                    */
        /* ------------------------------------------------------------- */
        .auth-right-panel {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 16px 36px 16px;
        }

        @media (min-width: 1024px) {
          .auth-right-panel {
            height: 100%;
            padding: clamp(12px, 2vh, 24px) 0;
            justify-content: flex-end;
          }
        }

        .luxury-auth-card {
          width: min(100%, 540px);
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(231, 222, 213, 0.9);
          border-radius: 26px;
          box-shadow: 0 24px 50px -12px rgba(60, 40, 35, 0.12),
            0 8px 24px -4px rgba(60, 40, 35, 0.05);
          backdrop-filter: blur(12px);
          padding: clamp(20px, 2.8vh, 32px) clamp(22px, 2.6vw, 36px);
          display: flex;
          flex-direction: column;
          gap: clamp(8px, 1.4vh, 14px);
        }

        @media (max-width: 768px) {
          .luxury-auth-card {
            width: calc(100% - 24px);
            max-width: 480px;
            margin: 14px auto;
            border-radius: 22px;
            padding: 22px 18px;
          }
        }

        .mobile-only-brand {
          display: flex;
          justify-content: center;
          padding-bottom: 6px;
        }

        @media (min-width: 1024px) {
          .mobile-only-brand {
            display: none;
          }
        }

        /* ------------------------------------------------------------- */
        /* TAB SWITCHER                                                  */
        /* ------------------------------------------------------------- */
        .auth-tab-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          background: #fbf8f5;
          padding: 4px;
          border-radius: 16px;
          border: 1px solid #e7ded5;
        }

        .auth-tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          text-align: left;
        }

        .auth-tab-btn.is-active {
          background: #b76e79;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.22);
        }

        .tab-icon-frame {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.2);
          color: #342727;
          transition: all 0.2s ease;
        }

        .auth-tab-btn.is-active .tab-icon-frame {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .tab-text-stack {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .tab-head {
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: #342727;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .auth-tab-btn.is-active .tab-head {
          color: #ffffff;
        }

        .tab-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.66rem;
          color: #806d68;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .auth-tab-btn.is-active .tab-sub {
          color: rgba(255, 255, 255, 0.85);
        }

        @media (max-width: 480px) {
          .tab-sub {
            display: none;
          }
          .auth-tab-btn {
            justify-content: center;
            padding: 9px;
          }
        }

        /* ------------------------------------------------------------- */
        /* FORM BODY & HEADINGS                                          */
        /* ------------------------------------------------------------- */
        .auth-form-body {
          display: flex;
          flex-direction: column;
          gap: clamp(7px, 1.2vh, 12px);
        }

        .form-header-area {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .form-title {
          font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.4rem, 1.7vw, 1.65rem);
          font-weight: 500;
          color: #342727;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .form-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          color: #806d68;
          margin: 0;
        }

        /* ------------------------------------------------------------- */
        /* ALERTS                                                        */
        /* ------------------------------------------------------------- */
        .alert-message {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 12px;
          border-radius: 10px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
        }

        .alert-error {
          background-color: #fff1f2;
          color: #b91c1c;
          border: 1px solid #fecdd3;
        }

        .alert-success {
          background-color: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        /* ------------------------------------------------------------- */
        /* INPUT FIELDS                                                  */
        /* ------------------------------------------------------------- */
        .auth-input-form {
          display: flex;
          flex-direction: column;
          gap: clamp(5px, 1vh, 9px);
        }

        .field-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .field-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.77rem;
          font-weight: 600;
          color: #342727;
          letter-spacing: 0.01em;
        }

        .field-label-split {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .field-opt {
          font-weight: 400;
          color: #806d68;
          font-size: 0.72rem;
        }

        .input-shell {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .field-icon {
          position: absolute;
          left: 13px;
          color: #806d68;
          pointer-events: none;
          z-index: 2;
        }

        .field-text-input {
          width: 100%;
          height: clamp(38px, 4.1vh, 44px);
          padding: 0 14px 0 38px;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          color: #342727;
          background: #ffffff;
          border: 1px solid #e7ded5;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .field-text-input:focus {
          border-color: #b76e79;
          box-shadow: 0 0 0 3px rgba(183, 110, 121, 0.15);
        }

        .field-text-input::placeholder {
          color: #a89893;
          font-size: 0.82rem;
        }

        .field-text-input:disabled {
          background-color: #f7f4ef;
          color: #a39893;
          cursor: not-allowed;
        }

        .eye-toggle-btn {
          position: absolute;
          right: 11px;
          background: none;
          border: none;
          color: #806d68;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: color 0.18s ease;
        }

        .eye-toggle-btn:hover {
          color: #342727;
        }

        /* Composite Phone Input */
        .phone-composite-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .country-code-pill {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: clamp(38px, 4.1vh, 44px);
          padding: 0 11px;
          background: #fbf8f5;
          border: 1px solid #e7ded5;
          border-radius: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: #342727;
          cursor: pointer;
          flex-shrink: 0;
        }

        .country-dropdown-overlay {
          position: absolute;
          inset: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .phone-input-shell {
          flex: 1;
        }

        /* ------------------------------------------------------------- */
        /* CHECKBOX & TERMS                                              */
        /* ------------------------------------------------------------- */
        .terms-checkbox-wrap,
        .remember-me-row {
          display: flex;
          align-items: flex-start;
          margin-top: 1px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .styled-checkbox {
          width: 15px;
          height: 15px;
          border-radius: 4px;
          accent-color: #b76e79;
          cursor: pointer;
          flex-shrink: 0;
        }

        .checkbox-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.77rem;
          color: #6a5752;
          line-height: 1.4;
        }

        .policy-link {
          color: #b76e79;
          text-decoration: underline;
          text-underline-offset: 2px;
          font-weight: 500;
        }

        .policy-link:hover {
          color: #9c5a64;
        }

        .forgot-pass-anchor {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          color: #b76e79;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.18s ease;
        }

        .forgot-pass-anchor:hover {
          text-decoration: underline;
          color: #9c5a64;
        }

        /* ------------------------------------------------------------- */
        /* BUTTONS & FOOTERS                                             */
        /* ------------------------------------------------------------- */
        .submit-action-btn {
          width: 100%;
          height: clamp(40px, 4.3vh, 46px);
          background: #b76e79;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.22);
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          margin-top: 2px;
        }

        .submit-action-btn:hover:not(:disabled) {
          background: #a45f6a;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.28);
        }

        .submit-action-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-action-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-arrow-icon {
          transition: transform 0.2s ease;
        }

        .submit-action-btn:hover:not(:disabled) .btn-arrow-icon {
          transform: translateX(3px);
        }

        .spin-animation {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .card-bottom-switch {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 2px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
        }

        .switch-prompt {
          color: #806d68;
        }

        .switch-action-link {
          background: none;
          border: none;
          color: #b76e79;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          transition: color 0.18s ease;
        }

        .switch-action-link:hover {
          color: #9c5a64;
          text-decoration: underline;
        }

        /* ------------------------------------------------------------- */
        /* SUBTLE EDITORIAL ENTRANCE ANIMATIONS                          */
        /* ------------------------------------------------------------- */
        .anim-fade-up {
          animation: luxuryFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .anim-d0 {
          animation-delay: 0.05s;
        }

        .anim-d1 {
          animation-delay: 0.15s;
        }

        .anim-d2 {
          animation-delay: 0.25s;
        }

        .anim-card-in {
          animation: luxuryCardIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) backwards;
          animation-delay: 0.1s;
        }

        @keyframes luxuryFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes luxuryCardIn {
          from {
            opacity: 0;
            transform: scale(0.985) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up,
          .anim-card-in {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
