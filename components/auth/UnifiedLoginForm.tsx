'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

interface UnifiedLoginFormProps {
  initialRedirect?: string;
  sourceLabel?: string;
}

export default function UnifiedLoginForm({ initialRedirect, sourceLabel }: UnifiedLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || initialRedirect || '';

  // Form states strictly initialized as empty
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim()) {
      setError('Please enter your email or username.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email or password.');
        setPassword('');
        setLoading(false);
        return;
      }

      setSuccessMessage('Signing in...');

      // Dynamic Role-Based Destination Routing determined strictly by Server
      const target = redirectTo || data.redirectUrl || (data.user?.role === 'USER' ? '/account' : '/admin');

      setTimeout(() => {
        router.push(target);
        router.refresh();
      }, 500);
    } catch {
      setError('Network connection error. Please verify your connection.');
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <div className="unified-auth-container">
      <div className="auth-card">
        {/* Brand Header using Official MK Silver Hub Logo */}
        <div className="auth-header">
          <div className="brand-logo-container">
            <BrandLogo layout="stacked" size="normal" showTagline={true} />
          </div>

          <div className="welcome-block">
            <h1 className="welcome-title">Welcome Back</h1>
            <p className="welcome-text">
              {sourceLabel ? sourceLabel : 'Sign in to access your MK Silver Hub account'}
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="alert-box error" role="alert">
            <AlertCircle size={16} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert-box success" role="status">
            <CheckCircle2 size={16} className="alert-icon" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email / Username Field */}
          <div className="form-group email-group">
            <label htmlFor="username" className="field-label">
              Email or Username
            </label>
            <div className="input-field-wrap">
              <Mail size={17} className="field-icon" aria-hidden="true" />
              <input
                id="username"
                name="username"
                type="email"
                required
                autoComplete="username"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="text-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group password-group">
            <div className="label-row">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <Link href="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="input-field-wrap">
              <Lock size={17} className="field-icon" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="text-input pr-11"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-pwd-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="remember-row">
            <label className="checkbox-label" htmlFor="rememberMe">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <span className="btn-content">
                <RefreshCw size={17} className="animate-spin" />
                <span>Signing In...</span>
              </span>
            ) : (
              <span className="btn-content">
                <span>Sign In</span>
                <ArrowRight size={17} className="btn-arrow" />
              </span>
            )}
          </button>
        </form>

        {/* Footer: Create Account Link */}
        <div className="auth-footer-row">
          <span className="footer-prompt">Don&apos;t have an account?</span>
          <Link href="/register" className="create-account-link">
            Create Account
          </Link>
        </div>
      </div>

      <style jsx global>{`
        /* Suppress dev overlays/issue counters from disturbing customer auth UI */
        nextjs-portal,
        [data-nextjs-toast],
        #__next-build-watcher {
          display: none !important;
        }
      `}</style>

      <style jsx>{`
        .unified-auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFF9F3;
          background-image: radial-gradient(circle at 50% 15%, #FFFFFF 0%, #FFF8F1 45%, #F7EFE7 100%);
          padding: 24px 16px;
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          background-color: #FFFFFF;
          border: 1px solid #E7E1D8;
          border-radius: 26px;
          padding: 38px 36px 36px 36px;
          box-shadow: 0 10px 32px rgba(52, 39, 39, 0.04);
          position: relative;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .brand-logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .welcome-block {
          margin-top: 0;
        }

        .welcome-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 2.5rem; /* ~40-42px */
          font-weight: 600;
          color: #342727;
          margin: 0 0 8px 0;
          letter-spacing: -0.01em;
          line-height: 1.15;
        }

        .welcome-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.88rem;
          color: #7A6964;
          margin: 0;
          line-height: 1.45;
        }

        .alert-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 0.82rem;
          margin-bottom: 20px;
          font-family: var(--font-ui), 'Jost', sans-serif;
        }

        .alert-box.error {
          background-color: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .alert-box.success {
          background-color: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .email-group {
          margin-bottom: 18px;
        }

        .password-group {
          margin-bottom: 16px;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .field-label {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #4A3B39;
          letter-spacing: 0.02em;
        }

        .forgot-link {
          color: #B76E79;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .forgot-link:hover {
          text-decoration: underline;
          color: #9C5762;
        }

        .input-field-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          color: #A3908B;
          pointer-events: none;
        }

        .text-input {
          width: 100%;
          height: 54px;
          padding: 0 16px 0 46px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.92rem;
          color: #342727;
          background-color: #FFFFFF;
          border: 1px solid #E7E1D8;
          border-radius: 13px;
          outline: none;
          transition: all 0.2s ease;
        }

        .text-input::placeholder {
          color: #A4938C;
        }

        .text-input:focus {
          border-color: #B76E79;
          box-shadow: 0 0 0 3px rgba(183, 110, 121, 0.18) !important;
        }

        /* Prevent ugly blue Chrome autofill styles while maintaining password manager functionality */
        .text-input:-webkit-autofill,
        .text-input:-webkit-autofill:hover, 
        .text-input:-webkit-autofill:focus,
        .text-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0px 1000px #FFFFFF inset !important;
          -webkit-text-fill-color: #342727 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .pr-11 {
          padding-right: 44px;
        }

        .toggle-pwd-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #A3908B;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          transition: color 0.15s ease;
        }

        .toggle-pwd-btn:hover {
          color: #342727;
        }

        .remember-row {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-input {
          accent-color: #B76E79;
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .checkbox-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #6B5B56;
        }

        .submit-btn {
          width: 100%;
          height: 54px;
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          border-radius: 13px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.94rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.22);
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #A25863;
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.32);
          transform: translateY(-1px);
        }

        .submit-btn:hover:not(:disabled) .btn-arrow {
          transform: translateX(3px);
        }

        .btn-arrow {
          transition: transform 0.2s ease;
        }

        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .auth-footer-row {
          margin-top: 24px;
          padding-top: 22px;
          border-top: 1px solid #F0E6DE;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.84rem;
        }

        .footer-prompt {
          color: #806D68;
        }

        .create-account-link {
          color: #B76E79;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .create-account-link:hover {
          color: #9C5762;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-card {
            border-radius: 22px;
            padding: 28px 20px;
          }
          .welcome-title {
            font-size: 2.15rem; /* ~34px */
          }
          .text-input {
            height: 52px;
            font-size: 0.88rem;
          }
          .submit-btn {
            height: 52px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
