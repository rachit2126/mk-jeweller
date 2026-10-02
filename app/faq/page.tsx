'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How do I know MK Silver Hub jewellery is pure 925 sterling silver?',
    answer: 'Every creation is cast in solid 92.5% pure silver bullion and stamped with the official Bureau of Indian Standards (BIS) 925 hallmark. A physical Certificate of Authenticity specifying purity and gross weight accompanies every delivery.',
  },
  {
    question: 'Will solid 925 sterling silver tarnish over time?',
    answer: 'Solid 925 silver can naturally interact with trace environmental sulfur. To prevent discoloration, our pieces are triple-sealed with a protective platinum-group rhodium barrier. Regular gentle wear also keeps silver naturally polished through skin contact.',
  },
  {
    question: 'What are your delivery timelines and shipping charges across India?',
    answer: 'We provide complimentary insured doorstep shipping on all orders above ₹1,000. Orders under ₹1,000 carry a flat ₹99 fee. Dispatch takes place within 24–48 hours from Jaipur, with standard delivery arriving in 3–5 business days.',
  },
  {
    question: 'What is your return and exchange policy?',
    answer: 'We offer an unconditional 7-day return and exchange window. If your jewellery does not fit or delight you, contact our WhatsApp concierge (+91 74250 58118) to arrange a complimentary insured reverse pickup and rapid refund.',
  },
  {
    question: 'What payment options do you support?',
    answer: 'We accept 100% secure, encrypted online payments via UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, MasterCard, RuPay), NetBanking, and Cash on Delivery with SMS OTP confirmation.',
  },
  {
    question: 'How do I select the right ring or chain length?',
    answer: 'Most of our rings feature versatile sizes (US 6 to 9) or standard Indian ring sizes (10 to 18). Necklaces are typically offered in 16-inch, 18-inch, and 20-inch lengths. Consult our Size Guide or WhatsApp our team for personalized styling assistance.',
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaqs = FAQ_ITEMS.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#111111',
        minHeight: '100vh',
        padding: '0 0 100px',
      }}
    >
      <div
        style={{
          maxWidth: '880px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            padding: '24px 0 32px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-ui), "Jost", sans-serif',
            color: '#6F6F6A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link href="/" style={{ color: '#6F6F6A', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: '#111111', fontWeight: 600 }}>FAQ</span>
        </nav>

        {/* Title */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid #E8E7E2', paddingBottom: '20px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 500,
              color: '#111111',
              margin: '0 0 10px',
            }}
          >
            Frequently Asked Questions
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.9rem',
              color: '#6F6F6A',
              margin: 0,
            }}
          >
            Quick answers regarding BIS 925 hallmarks, care, shipping, and returns.
          </p>
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8F7F3',
            border: '1px solid #E8E7E2',
            padding: '12px 16px',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          <Search size={18} color="#6F6F6A" />
          <input
            type="text"
            placeholder="Search questions (e.g. hallmarks, delivery, returns)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '0.86rem',
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              color: '#111111',
            }}
          />
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F8F7F3',
                  border: '1px solid #E8E7E2',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#111111',
                    }}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    color="#111111"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 24px',
                      fontFamily: 'var(--font-ui), "Jost", sans-serif',
                      fontSize: '0.88rem',
                      lineHeight: 1.65,
                      color: '#4A4A46',
                      borderTop: '1px solid #E8E7E2',
                      paddingTop: '16px',
                    }}
                  >
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
