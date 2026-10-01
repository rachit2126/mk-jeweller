'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);

    // Simulate dispatch without revealing whether account exists (security best practice)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-card">
        {/* Brand Header */}
        <div className="brand-header">
          <BrandLogo layout="stacked" size="normal" showTagline={true} />
        </div>

        <div className="title-block">
          <h1 className="main-title">Reset Password</h1>
          <p className="subtitle">
            Enter your registered email address and we will dispatch password recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="success-box">
            <div className="check-ring">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h2 className="success-heading">Instructions Dispatched</h2>
            <p className="success-text">
              If an account is associated with <strong>{email}</strong>, a secure reset link has been sent to your inbox.
            </p>
            <p className="help-text">
              Please inspect your spam or junk folder if the link does not arrive within a few minutes.
            </p>

            <Link href="/login" className="return-login-btn">
              <ArrowLeft size={16} />
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label htmlFor="forgot-email" className="field-label">
                Email Address
              </label>
              <div className="input-wrap">
                <Mail size={16} className="field-icon" />
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-input"
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <span className="btn-content">
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Dispatching Link...</span>
                </span>
              ) : (
                <span className="btn-content">
                  <span>Send Reset Link</span>
                  <ArrowRight size={16} />
                </span>
              )}
            </button>

            <div className="back-wrap">
              <Link href="/login" className="back-link">
                <ArrowLeft size={14} />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .forgot-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFF9F3;
          background: radial-gradient(circle at 50% 10%, #FFFDF9 0%, #FAF5F0 50%, #F5ECE4 100%);
          padding: 24px 16px;
        }

        .forgot-card {
          width: 100%;
          max-width: 450px;
          background-color: #FFFFFF;
          border: 1px solid #E7E1D8;
          border-radius: 26px;
          padding: clamp(32px, 4vw, 42px) clamp(20px, 3.5vw, 36px);
          box-shadow: 0 12px 36px rgba(52, 39, 39, 0.05);
          text-align: center;
        }

        .brand-header {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .title-block {
          margin-bottom: 24px;
        }

        .main-title {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.85rem;
          font-weight: 600;
          color: #342727;
          margin: 0;
          line-height: 1.2;
        }

        .subtitle {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.85rem;
          color: #806D68;
          margin-top: 6px;
          line-height: 1.45;
        }

        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          text-align: left;
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
        }

        .input-wrap {
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

        .text-input:focus {
          border-color: #B76E79;
          box-shadow: 0 0 0 3px rgba(183, 110, 121, 0.15);
        }

        .submit-btn {
          width: 100%;
          height: 52px;
          background-color: #B76E79;
          color: #FFFFFF;
          border: none;
          border-radius: 14px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.25);
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #9C5762;
          box-shadow: 0 6px 18px rgba(183, 110, 121, 0.35);
          transform: translateY(-1px);
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .back-wrap {
          display: flex;
          justify-content: center;
          margin-top: 6px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.82rem;
          color: #806D68;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .back-link:hover {
          color: #B76E79;
        }

        .success-box {
          padding: 16px 0 8px;
        }

        .check-ring {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #ECFDF5;
          border: 1px solid #A7F3D0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .success-heading {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.45rem;
          color: #342727;
          margin: 0 0 8px;
        }

        .success-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.86rem;
          color: #4A3B39;
          line-height: 1.5;
        }

        .help-text {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          color: #806D68;
          margin-top: 10px;
          margin-bottom: 24px;
        }

        .return-login-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 48px;
          background-color: #FAF5F0;
          color: #4A3B39;
          border: 1px solid #E7E1D8;
          border-radius: 12px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.86rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .return-login-btn:hover {
          background-color: #F5EAE0;
          color: #B76E79;
          border-color: #D9B98A;
        }
      `}</style>
    </div>
  );
}
