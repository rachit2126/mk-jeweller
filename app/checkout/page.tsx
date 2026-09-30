'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, MessageCircle, Truck, Sparkles } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/api';

type CheckoutStep = 'info' | 'delivery' | 'payment' | 'success';

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartTotal, shippingFee, clearCart } = useCommerce();
  const [step, setStep] = useState<CheckoutStep>('info');

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    deliveryMethod: 'insured-free',
    paymentMethod: 'upi'
  });

  const [orderNumber, setOrderNumber] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = () => {
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    const generatedId = `MK-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedId);
    setStep('success');
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (step === 'success') {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: 'var(--bg-cream)',
            borderRadius: 'var(--radius-editorial)',
            padding: '48px 36px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'rgba(19, 138, 91, 0.12)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <span className="eyebrow" style={{ color: 'var(--color-success)' }}>ORDER CONFIRMED</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
            Thank You, {formData.firstName || 'Valued Patron'}!
          </h1>
          <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Your order <strong>{orderNumber}</strong> has been received by our Jaipur atelier. A confirmation email and tracking link will be sent to <strong>{formData.email || 'your email'}</strong>.
          </p>

          {/* Details summary */}
          <div style={{ backgroundColor: '#F2EDE5', borderRadius: '12px', padding: '18px 24px', textAlign: 'left', fontSize: '0.85rem', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Estimated Delivery:</span>
              <strong style={{ color: 'var(--color-espresso)' }}>3 – 5 Business Days</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Shipping Address:</span>
              <strong style={{ color: 'var(--color-espresso)' }}>{formData.city}, {formData.pincode}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Hallmark Assurance:</span>
              <span style={{ color: 'var(--color-champagne)', fontWeight: 600 }}>BIS 925 Certificate Included</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a
              href={`https://wa.me/917425058118?text=${encodeURIComponent(
                `Hi MK Silver Hub, I just placed order ${orderNumber}. Can you confirm order status?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <MessageCircle size={18} />
              <span>Get Order Updates on WhatsApp</span>
            </a>

            <Link href="/" className="btn-secondary" style={{ padding: '14px' }}>
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '40px 0 100px' }}>
      <div className="container">
        {/* Step Indicator Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: step === 'info' ? 700 : 500, color: step === 'info' ? 'var(--color-espresso)' : 'var(--color-muted-text)' }}>
              1. Information
            </span>
            <span style={{ color: 'var(--color-border)' }}>—</span>
            <span style={{ fontWeight: step === 'delivery' ? 700 : 500, color: step === 'delivery' ? 'var(--color-espresso)' : 'var(--color-muted-text)' }}>
              2. Delivery
            </span>
            <span style={{ color: 'var(--color-border)' }}>—</span>
            <span style={{ fontWeight: step === 'payment' ? 700 : 500, color: step === 'payment' ? 'var(--color-espresso)' : 'var(--color-muted-text)' }}>
              3. Payment
            </span>
          </div>
        </div>

        {/* 2-Column Split: Form | Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '48px', alignItems: 'start' }} className="checkout-grid">
          {/* Left: Step Form */}
          <div style={{ backgroundColor: 'var(--bg-cream)', padding: '36px', borderRadius: 'var(--radius-editorial)', border: '1px solid var(--color-border)' }}>
            {step === 'info' && (
              <form onSubmit={handleProceedToDelivery}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '20px' }}>
                  Contact Information
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="your.email@domain.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Mobile Phone (for delivery SMS & WhatsApp updates)</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '20px' }}>
                  Shipping Address
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>First Name</label>
                    <input
                      type="text"
                      required
                      name="firstName"
                      placeholder="Priya"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Last Name</label>
                    <input
                      type="text"
                      required
                      name="lastName"
                      placeholder="Sharma"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Street Address / Flat No.</label>
                    <input
                      type="text"
                      required
                      name="address"
                      placeholder="House No, Society, Landmark"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>City</label>
                      <input
                        type="text"
                        required
                        name="city"
                        placeholder="Jaipur"
                        value={formData.city}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                      >
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>PIN Code</label>
                      <input
                        type="text"
                        required
                        name="pincode"
                        placeholder="302001"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
                  <span>Continue to Delivery Options</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {step === 'delivery' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '16px' }}>
                  Shipping & Transit Method
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 20px',
                      borderRadius: '12px',
                      border: '2px solid var(--color-espresso)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="radio" checked readOnly style={{ accentColor: 'var(--color-espresso)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Complimentary Insured Courier</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>3–5 business days • BlueDart / Delhivery Express</div>
                      </div>
                    </div>
                    <strong style={{ color: 'var(--color-success)', fontSize: '0.9rem' }}>FREE</strong>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 20px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="radio" disabled />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Next-Day Air Priority (Metro Only)</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>Guaranteed 24-48 hr air shipping</div>
                      </div>
                    </div>
                    <strong style={{ fontSize: '0.9rem' }}>₹199</strong>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep('info')} className="btn-secondary" style={{ padding: '14px 24px' }}>
                    Back
                  </button>
                  <button onClick={handleProceedToPayment} className="btn-primary" style={{ flex: 1, padding: '14px' }}>
                    <span>Proceed to Payment</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '16px' }}>
                  Payment Method
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  <label
                    style={{
                      padding: '18px 20px',
                      borderRadius: '12px',
                      border: formData.paymentMethod === 'upi' ? '2px solid var(--color-espresso)' : '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'block'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={() => setFormData(p => ({ ...p, paymentMethod: 'upi' }))}
                          style={{ accentColor: 'var(--color-espresso)' }}
                        />
                        <span style={{ fontWeight: 600 }}>UPI (GPay / PhonePe / Paytm / BHIM)</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)', backgroundColor: 'rgba(19,138,91,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Fastest</span>
                    </div>
                    {formData.paymentMethod === 'upi' && (
                      <div style={{ marginTop: '12px', paddingLeft: '28px', fontSize: '0.82rem', color: 'var(--color-muted-text)' }}>
                        Instant verification QR will be presented on confirmation. Zero convenience fees.
                      </div>
                    )}
                  </label>

                  <label
                    style={{
                      padding: '18px 20px',
                      borderRadius: '12px',
                      border: formData.paymentMethod === 'card' ? '2px solid var(--color-espresso)' : '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'block'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData(p => ({ ...p, paymentMethod: 'card' }))}
                        style={{ accentColor: 'var(--color-espresso)' }}
                      />
                      <span style={{ fontWeight: 600 }}>Credit & Debit Cards (Visa, Mastercard, RuPay)</span>
                    </div>
                  </label>

                  <label
                    style={{
                      padding: '18px 20px',
                      borderRadius: '12px',
                      border: formData.paymentMethod === 'cod' ? '2px solid var(--color-espresso)' : '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'block'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData(p => ({ ...p, paymentMethod: 'cod' }))}
                        style={{ accentColor: 'var(--color-espresso)' }}
                      />
                      <span style={{ fontWeight: 600 }}>Cash on Delivery (OTP Verified)</span>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep('delivery')} className="btn-secondary" style={{ padding: '14px 24px' }}>
                    Back
                  </button>
                  <button onClick={handlePlaceOrder} className="btn-primary" style={{ flex: 1, padding: '14px' }}>
                    <Lock size={16} />
                    <span>Pay Securely {formatPrice(cartTotal)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Sidebar */}
          <div
            style={{
              padding: '28px',
              backgroundColor: 'var(--bg-cream)',
              borderRadius: 'var(--radius-editorial)',
              border: '1px solid var(--color-border)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, marginBottom: '16px' }}>
              In Your Bag ({cart.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '50px', height: '60px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F0ECE6', flexShrink: 0 }}>
                    <Image src={item.product.images[0]} alt={item.product.name} fill sizes="50px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-espresso)', lineHeight: 1.2 }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-text)' }}>Qty: {item.quantity} • {item.product.purity}</div>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{formatPrice(item.product.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Insured Delivery</span>
                <span style={{ color: shippingFee === 0 ? 'var(--color-success)' : 'inherit', fontWeight: 600 }}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, paddingTop: '10px', borderTop: '1px solid var(--color-border)', color: 'var(--color-espresso)' }}>
                <span>Total Due</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: 'var(--color-muted-text)', fontSize: '0.75rem' }}>
              <ShieldCheck size={16} color="var(--color-champagne)" />
              <span>BIS 925 Registered • Encrypted 256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
