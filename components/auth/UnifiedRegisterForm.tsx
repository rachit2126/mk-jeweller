'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

export default function UnifiedRegisterForm() {
  const router = useRouter();

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
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Client-side validations
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
      if (cleanPhone.length < 10) {
        setError('Please enter a valid phone number (at least 10 digits).');
        return;
      }
    }

    if (!terms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          confirmPassword,
          terms,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Unable to create account. Please try again.');
        // Security: clear passwords on failure
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
        return;
      }

      setSuccessMessage('Account created successfully! Directing to patron portal...');

      // Clear all registration state upon success
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setTerms(false);

      setTimeout(() => {
        router.push(data.redirectUrl || '/account');
        router.refresh();
      }, 700);
    } catch {
      setError('Network connection error. Please verify your connection.');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    }
  };

  return (
    <div className="unified-register-container">
      <div className="register-card">
        {/* Brand Header using Official MK Silver Hub Logo */}
        <div className="register-header">
          <div className="brand-logo-container">
            <BrandLogo layout="stacked" size="normal" showTagline={true} />
          </div>

          <div className="welcome-block">
            <h1 className="welcome-title">Create Your Account</h1>
            <p className="welcome-text">
              Join MK Silver Hub and discover fine 925 sterling jewellery.
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="reg-name" className="field-label">
              Full Name *
            </label>
            <div className="input-field-wrap">
              <User size={16} className="field-icon" />
              <input
                id="reg-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="text-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="field-label">
              Email Address *
            </label>
            <div className="input-field-wrap">
              <Mail size={16} className="field-icon" />
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                autoComplete="email"
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

          {/* Phone Number (Optional) */}
          <div className="form-group">
            <label htmlFor="reg-phone" className="field-label">
              Phone Number <span className="optional-tag">(Optional)</span>
            </label>
            <div className="input-field-wrap">
              <Phone size={16} className="field-icon" />
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError('');
                }}
                className="text-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password" className="field-label">
              Password *
            </label>
            <div className="input-field-wrap">
              <Lock size={16} className="field-icon" />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="text-input pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-pwd-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm-password" className="field-label">
              Confirm Password *
            </label>
            <div className="input-field-wrap">
              <Lock size={16} className="field-icon" />
              <input
                id="reg-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                className="text-input pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-pwd-btn"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="terms-row">
            <label className="checkbox-label" htmlFor="reg-terms">
              <input
                id="reg-terms"
                name="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  if (error) setError('');
                }}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="inline-legal-link">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="inline-legal-link">
                  Privacy Policy
                </Link>
                .
              </span>
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
                <RefreshCw size={16} className="animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              <span className="btn-content">
                <span>Create Account</span>
                <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        {/* Footer: Already have an account? Sign In */}
        <div className="auth-footer-row">
          <span className="footer-prompt">Already have an account?</span>
          <Link href="/login" className="sign-in-link">
            Sign In
          </Link>
        </div>
      </div>

      <style jsx>{`
        .unified-register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFF9F3;
          background: radial-gradient(circle at 50% 10%, #FFFDF9 0%, #FAF5F0 50%, #F5ECE4 100%);
          padding: clamp(24px, 4vw, 48px) 16px;
        }

        .register-card {
          width: 100%;
          max-width: 460px;
          background-color: #FFFFFF;
          border: 1px solid #E7E1D8;
          border-radius: 26px;
          padding: clamp(28px, 4vw, 42px) clamp(20px, 3.5vw, 36px);
          box-shadow: 0 12px 36px rgba(52, 39, 39, 0.05);
          position: relative;
        }

        .register-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .brand-logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }

        .welcome-block {
          margin-top: 4px;
        }

        .welcome-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.85rem;
          font-weight: 600;
          color: #342727;
          margin: 0;
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .welcome-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.85rem;
          color: #806D68;
          margin-top: 6px;
          line-height: 1.4;
        }

        .alert-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
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

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #4A3B39;
          letter-spacing: 0.02em;
        }

        .optional-tag {
          font-weight: 400;
          color: #9E8D88;
          font-size: 0.72rem;
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
          height: 52px;
          padding: 0 14px 0 44px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #342727;
          background-color: #FFFFFF;
          border: 1px solid #E7E1D8;
          border-radius: 13px;
          outline: none;
          transition: all 0.2s ease;
        }

        .text-input::placeholder {
          color: #A4938C;
          opacity: 1;
        }

        .text-input:focus {
          border-color: #B76E79;
          box-shadow: 0 0 0 3px rgba(183, 110, 121, 0.15) !important;
        }

        /* Prevent ugly blue Chrome autofill styles while maintaining clean appearance */
        .text-input:-webkit-autofill,
        .text-input:-webkit-autofill:hover, 
        .text-input:-webkit-autofill:focus,
        .text-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0px 1000px #FFFFFF inset !important;
          -webkit-text-fill-color: #342727 !important;
          transition: background-color 5000s ease-in-out 0s;
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
          padding: 4px;
        }

        .toggle-pwd-btn:hover {
          color: #342727;
        }

        .terms-row {
          display: flex;
          align-items: flex-start;
          margin: 2px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }

        .checkbox-input {
          accent-color: #B76E79;
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .checkbox-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          color: #6B5B56;
          line-height: 1.45;
        }

        .inline-legal-link {
          color: #B76E79;
          text-decoration: underline;
          font-weight: 500;
        }

        .inline-legal-link:hover {
          color: #9C5762;
        }

        .submit-btn {
          width: 100%;
          height: 52px;
          margin-top: 6px;
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          border-radius: 14px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.25);
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #9C5762;
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.35);
          transform: translateY(-1px);
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
          padding-top: 18px;
          border-top: 1px solid #F0E6DE;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
        }

        .footer-prompt {
          color: #806D68;
        }

        .sign-in-link {
          color: #B76E79;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .sign-in-link:hover {
          color: #9C5762;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .register-card {
            border-radius: 20px;
            padding: 28px 18px;
          }
          .welcome-title {
            font-size: 1.55rem;
          }
          .text-input {
            height: 48px;
            font-size: 0.86rem;
          }
          .submit-btn {
            height: 48px;
            font-size: 0.88rem;
          }
        }
      `}</style>
    </div>
  );
}
