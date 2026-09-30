'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Authenticity',
    question: 'How can I be certain that MK Silver Hub jewellery is pure 925 sterling silver?',
    answer: 'Every single piece created by MK Silver Hub is crafted from 92.5% pure elemental silver bullion and stamped with the official Bureau of Indian Standards (BIS) 925 hallmark. Your shipment includes a physical Hallmark Certificate of Authenticity specifying gross weight and silver purity.'
  },
  {
    category: 'Jewellery',
    question: 'Will MK Silver Hub jewellery turn black or tarnish?',
    answer: 'Solid 925 sterling silver can naturally react with trace atmospheric sulfur over time. However, all our creations are finished with a premium anti-tarnish rhodium barrier that protects against natural oxidation. Regular gentle wear also helps keep silver bright as skin oils act as a natural barrier.'
  },
  {
    category: 'Shipping',
    question: 'How long does delivery take across India and what are the charges?',
    answer: 'We offer complimentary insured doorstep shipping on all orders above ₹999. For orders below ₹999, a nominal flat fee of ₹99 applies. Orders are dispatched from our Jaipur facility within 24 hours and delivered in 3 to 5 business days via BlueDart and Delhivery Express.'
  },
  {
    category: 'Returns',
    question: 'What is your return and exchange policy?',
    answer: 'We provide an easy 15-day return and exchange window from the date of delivery. If you are not completely delighted with your purchase, contact us on WhatsApp (+91 74250 58118) or your account portal, and we will arrange a complimentary doorstep pickup and process your full refund.'
  },
  {
    category: 'Payments',
    question: 'Which payment methods are accepted?',
    answer: 'We support 100% secure, encrypted payments via UPI (GPay, PhonePe, Paytm), Credit & Debit cards (Visa, MasterCard, RuPay), Netbanking, and Cash on Delivery with mobile OTP verification.'
  },
  {
    category: 'Sizing',
    question: 'How do I choose the correct ring or bangle size?',
    answer: 'Our rings feature either adjustable comfort bands (fitting US sizes 6 to 9) or standard Indian ring sizes (10 to 18). Bangles are available in 2.4, 2.6, and 2.8 inner diameter sizes. If you need sizing guidance, message us on WhatsApp with a picture of your existing jewellery.'
  }
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaqs = FAQ_ITEMS.filter(
    f =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '50px 0 100px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="eyebrow">HELP & SUPPORT</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'var(--color-espresso)', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-muted-text)', maxWidth: '600px', margin: '0 auto 28px' }}>
            Find quick answers regarding our BIS 925 hallmarking, care, delivery, and returns.
          </p>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              padding: '10px 20px',
              maxWidth: '520px',
              margin: '0 auto',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}
          >
            <Search size={18} color="var(--color-champagne)" style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Search by topic, e.g. hallmarking, shipping, return..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.92rem', color: 'var(--color-espresso)' }}
            />
          </div>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-cream)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '22px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    gap: '16px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-champagne)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      {faq.category}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-espresso)', fontFamily: 'var(--font-display)' }}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0,
                      color: 'var(--color-espresso)'
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 22px', fontSize: '0.92rem', color: 'var(--color-muted-text)', lineHeight: 1.65, borderTop: '1px solid rgba(229, 222, 213, 0.5)', paddingTop: '16px' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
