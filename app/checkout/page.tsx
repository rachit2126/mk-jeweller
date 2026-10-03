'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, CheckCircle2, ArrowRight, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { useCommerce } from '@/components/commerce/CommerceContext';
import { formatPrice } from '@/lib/format';

type Step = 'info' | 'address' | 'delivery' | 'payment' | 'success';

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartTotal, shippingFee, clearCart } = useCommerce();
  const [currentStep, setCurrentStep] = useState<Step>('info');

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'online',
  });

  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 'info') {
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery') {
      setCurrentStep('payment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setSubmitError('Your bag is currently empty.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        customerName: formData.fullName.trim() || 'Valued Patron',
        email: formData.email,
        phone: formData.phone,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          sku: (item.product as any).sku || `MK-${(item.product.category || 'JEW').toUpperCase().slice(0, 3)}`,
          image: item.product.images?.[0] || '/images/products/placeholder.jpg',
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        })),
        subtotal: cartSubtotal,
        discount: 0,
        tax: 0,
        shipping: shippingFee,
        amount: cartTotal,
        paymentStatus: 'paid',
        paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI',
        shippingAddress: {
          addressLine: `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}`,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pincode,
          country: 'India',
        },
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order in database.');
      }

      setOrderNumber(data.order.id);
      setCurrentStep('success');
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (currentStep === 'success') {
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          minHeight: '80vh',
          padding: '80px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '540px',
            width: '100%',
            backgroundColor: '#F8F7F3',
            border: '1px solid #E8E7E2',
            padding: '48px 36px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle2 size={28} />
          </div>

          <span
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#6F6F6A',
            }}
          >
            ORDER CONFIRMED
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: '2.4rem',
              fontWeight: 500,
              margin: '8px 0 16px',
              color: '#111111',
            }}
          >
            Thank You For Your Patronage
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.88rem',
              color: '#4A4A46',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            Your order <strong>{orderNumber}</strong> has been logged into our Jaipur atelier system. A tracking notification will be dispatched to <strong>{formData.email}</strong> once hallmarked and shipped.
          </p>

          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            CONTINUE BROWSING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        padding: '32px 0 100px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            paddingBottom: '20px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
            color: '#6F6F6A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link href="/cart" style={{ color: '#6F6F6A', textDecoration: 'none' }}>
            Cart
          </Link>
          <span>/</span>
          <span style={{ color: '#111111', fontWeight: 600 }}>Checkout</span>
        </nav>

        {/* Multi-Step Indicator Bar (Screen 7 in Mockup) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            backgroundColor: '#F8F7F3',
            border: '1px solid #E8E7E2',
            marginBottom: '36px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontWeight: currentStep === 'info' ? 700 : 500, color: currentStep === 'info' ? '#111111' : '#6F6F6A' }}>
            1 Information
          </span>
          <ChevronRight size={14} color="#BFC1C4" />
          <span style={{ fontWeight: currentStep === 'address' ? 700 : 500, color: currentStep === 'address' ? '#111111' : '#6F6F6A' }}>
            2 Address
          </span>
          <ChevronRight size={14} color="#BFC1C4" />
          <span style={{ fontWeight: currentStep === 'delivery' ? 700 : 500, color: currentStep === 'delivery' ? '#111111' : '#6F6F6A' }}>
            3 Delivery
          </span>
          <ChevronRight size={14} color="#BFC1C4" />
          <span style={{ fontWeight: currentStep === 'payment' ? 700 : 500, color: currentStep === 'payment' ? '#111111' : '#6F6F6A' }}>
            4 Payment
          </span>
        </div>

        {/* 2-Column Split: Form Fields | Order Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)',
            gap: 'clamp(28px, 4.5vw, 56px)',
            alignItems: 'start',
          }}
          className="checkout-split-grid"
        >
          {/* ======================================================= */}
          {/* LEFT: CHECKOUT FORM STEPS (Screen 7 in Mockup)          */}
          {/* ======================================================= */}
          <div>
            <form onSubmit={handleNextStep}>
              {/* STEP 1 & 2: Contact Info & Address */}
              {(currentStep === 'info' || currentStep === 'address') && (
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                      fontSize: '1.45rem',
                      fontWeight: 600,
                      color: '#111111',
                      margin: '0 0 16px',
                    }}
                  >
                    Contact Information
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="customer@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #E8E7E2',
                          backgroundColor: '#FFFFFF',
                          fontSize: '0.84rem',
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          autoComplete="name"
                          placeholder="Your Name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid #E8E7E2',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.84rem',
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                          Phone (for delivery updates) *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid #E8E7E2',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.84rem',
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <h2
                    style={{
                      fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                      fontSize: '1.45rem',
                      fontWeight: 600,
                      color: '#111111',
                      margin: '0 0 16px',
                    }}
                  >
                    Shipping Address
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        autoComplete="street-address"
                        placeholder="House / Flat / Street Name"
                        value={formData.address}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #E8E7E2',
                          backgroundColor: '#FFFFFF',
                          fontSize: '0.84rem',
                          fontFamily: 'var(--font-ui), "Jost", sans-serif',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          autoComplete="address-level2"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid #E8E7E2',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.84rem',
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid #E8E7E2',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.84rem',
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#6F6F6A', marginBottom: '6px' }}>
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          autoComplete="postal-code"
                          placeholder="302001"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid #E8E7E2',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.84rem',
                            fontFamily: 'var(--font-ui), "Jost", sans-serif',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '14px 32px',
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      border: 'none',
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>CONTINUE TO DELIVERY</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* STEP 3: Delivery Options */}
              {currentStep === 'delivery' && (
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                      fontSize: '1.45rem',
                      fontWeight: 600,
                      color: '#111111',
                      margin: '0 0 16px',
                    }}
                  >
                    Select Delivery Method
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        border: '1.5px solid #111111',
                        backgroundColor: '#F8F7F3',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={formData.deliveryMethod === 'standard'}
                          onChange={() => setFormData((p) => ({ ...p, deliveryMethod: 'standard' }))}
                          style={{ accentColor: '#111111' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111111' }}>
                            Standard Insured Doorstep Delivery
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6F6F6A' }}>
                            Delivered in 3–5 business days with tamper-proof seal
                          </div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111111' }}>
                        Free
                      </span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('address')}
                      style={{
                        padding: '14px 24px',
                        backgroundColor: '#FFFFFF',
                        color: '#111111',
                        border: '1px solid #E8E7E2',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '14px 32px',
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        border: 'none',
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Payment */}
              {currentStep === 'payment' && (
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                      fontSize: '1.45rem',
                      fontWeight: 600,
                      color: '#111111',
                      margin: '0 0 16px',
                    }}
                  >
                    Select Payment Method
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        border: formData.paymentMethod === 'online' ? '1.5px solid #111111' : '1px solid #E8E7E2',
                        backgroundColor: formData.paymentMethod === 'online' ? '#F8F7F3' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'online'}
                          onChange={() => setFormData((p) => ({ ...p, paymentMethod: 'online' }))}
                          style={{ accentColor: '#111111' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111111' }}>
                            Online Payment (UPI, Credit/Debit Card, NetBanking)
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6F6F6A' }}>
                            100% Encrypted & Insured Gateway
                          </div>
                        </div>
                      </div>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        border: formData.paymentMethod === 'cod' ? '1.5px solid #111111' : '1px solid #E8E7E2',
                        backgroundColor: formData.paymentMethod === 'cod' ? '#F8F7F3' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={() => setFormData((p) => ({ ...p, paymentMethod: 'cod' }))}
                          style={{ accentColor: '#111111' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111111' }}>
                            Cash on Delivery (COD)
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6F6F6A' }}>
                            Pay in cash or UPI at the time of delivery
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {submitError && (
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: '#FFEBEE',
                        color: '#B71C1C',
                        fontSize: '0.82rem',
                        marginBottom: '18px',
                      }}
                    >
                      {submitError}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('delivery')}
                      style={{
                        padding: '14px 24px',
                        backgroundColor: '#FFFFFF',
                        color: '#111111',
                        border: '1px solid #E8E7E2',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        padding: '16px 0',
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        border: 'none',
                        fontFamily: 'var(--font-ui), "Jost", sans-serif',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isSubmitting ? 'PROCESSING...' : `PLACE ORDER (${formatPrice(cartTotal)})`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* ======================================================= */}
          {/* RIGHT: ORDER SUMMARY CARD (Screen 7 in Mockup)          */}
          {/* ======================================================= */}
          <div
            style={{
              backgroundColor: '#F8F7F3',
              border: '1px solid #E8E7E2',
              padding: 'clamp(20px, 2.5vw, 32px)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#111111',
                margin: '0 0 16px',
                borderBottom: '1px solid #E8E7E2',
                paddingBottom: '12px',
              }}
            >
              Order Summary
            </h2>

            {/* Item Previews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '54px',
                      height: '64px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E7E2',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="60px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        color: '#111111',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#6F6F6A' }}>
                      Qty: {item.quantity} {item.variant ? `· ${item.variant}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#111111' }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div
              style={{
                borderTop: '1px solid #E8E7E2',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '0.84rem',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6F6F6A' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#111111' }}>{formatPrice(cartSubtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6F6F6A' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: '#111111' }}>
                  {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #E8E7E2',
                  paddingTop: '14px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#111111',
                }}
              >
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Payment Security Badges (UPI, Visa, RuPay) */}
            <div
              style={{
                borderTop: '1px solid #E8E7E2',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.7rem',
                color: '#6F6F6A',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Lock size={13} color="#111111" />
                <span style={{ fontWeight: 600, color: '#111111' }}>Secure Encrypted Payments</span>
              </div>
              <div style={{ letterSpacing: '0.12em', color: '#252525', fontWeight: 600 }}>
                UPI · VISA · MASTERCARD · RUPAY
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .checkout-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
