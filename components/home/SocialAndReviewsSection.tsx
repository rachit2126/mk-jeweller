'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface ReviewItem {
  id: string;
  customerName: string;
  productName?: string;
  rating: number;
  comment: string;
  avatar?: string;
  date?: string;
}

const INSTAGRAM_POSTS = [
  {
    id: 'post-1',
    image: '/images/collections/necklace-editorial.jpg',
    alt: 'MK Silver Hub necklace worn by customer',
    link: 'https://instagram.com/mksilverhub',
  },
  {
    id: 'post-2',
    image: '/images/collections/rings-editorial.jpg',
    alt: 'MK Silver Hub stacking rings',
    link: 'https://instagram.com/mksilverhub',
  },
  {
    id: 'post-3',
    image: '/images/collections/earrings-editorial.jpg',
    alt: 'MK Silver Hub floral earrings',
    link: 'https://instagram.com/mksilverhub',
  },
  {
    id: 'post-4',
    image: '/images/occasions/everyday-elegance.jpg',
    alt: 'MK Silver Hub everyday silver bracelet',
    link: 'https://instagram.com/mksilverhub',
  },
  {
    id: 'post-5',
    image: '/images/why-choose/made-with-love-packaging.jpg',
    alt: 'MK Silver Hub luxury gift packaging',
    link: 'https://instagram.com/mksilverhub',
  },
  {
    id: 'post-6',
    image: '/images/occasions/gifting-collection.jpg',
    alt: 'MK Silver Hub silver bangle stack',
    link: 'https://instagram.com/mksilverhub',
  },
];

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-default-1',
    customerName: 'Priya Sharma',
    productName: 'Minimal Silver Ring',
    rating: 5,
    comment: 'Absolutely love the quality and design. The jewellery is so elegant and perfect for everyday wear.',
    avatar: '/images/avatars/customer.jpg',
  },
  {
    id: 'rev-default-2',
    customerName: 'Ananya Sharma',
    productName: 'Petal Bloom Stud Earrings',
    rating: 5,
    comment: 'My husband surprised me with the Petal Bloom earrings. The packaging with hallmark certificate and anti-tarnish pouch is so thoughtful.',
    avatar: '/images/avatars/customer.jpg',
  },
  {
    id: 'rev-default-3',
    customerName: 'Meera Rajput',
    productName: 'Classic Solitaire Pendant',
    rating: 5,
    comment: 'Pure 925 sterling silver without nickel. I have worn my solitaire pendant every day with zero irritation. Exceptional craft from Jaipur!',
    avatar: '/images/avatars/customer.jpg',
  },
];

export default function SocialAndReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          const mapped = data.reviews.map((r: any) => ({
            id: r.id,
            customerName: r.customerName || r.author || 'Valued Patron',
            productName: r.productName || r.purchasedProduct || 'Fine 925 Sterling Silver',
            rating: r.rating || 5,
            comment: r.comment || r.content || 'Exceptional craftsmanship and authentic 925 silver.',
            avatar: r.avatar || r.avatarUrl || '/images/avatars/customer.jpg',
          }));
          setReviews(mapped);
        }
      })
      .catch((err) => console.error('Failed to load reviews:', err));
  }, []);

  const nextReview = () => {
    setCurrentIdx((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIdx] || DEFAULT_REVIEWS[0];

  return (
    <section
      aria-label="Community Stories and Customer Testimonials"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 'clamp(56px, 7vw, 96px) 0',
        borderTop: '1px solid #E8E7E2',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 40px)',
        }}
      >
        <div className="stories-split-grid">
          {/* Left Column: As Seen In Your Stories (@MKSILVERHUB) */}
          <div className="stories-col">
            <span
              style={{
                fontFamily: 'var(--font-ui), "Jost", -apple-system, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6F6F6A',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              @MKSILVERHUB
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: '#111111',
                margin: '0 0 24px 0',
                lineHeight: 1.1,
              }}
            >
              AS SEEN IN YOUR STORIES
            </h2>

            {/* 6-Image Grid (3 x 2) */}
            <div className="insta-masonry">
              {INSTAGRAM_POSTS.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="insta-item"
                >
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    sizes="(max-width: 768px) 33vw, 15vw"
                    style={{ objectFit: 'cover' }}
                    className="insta-img"
                  />
                  <div className="insta-hover-overlay">
                    <InstagramIcon size={20} />
                    <span className="insta-hover-text">VIEW POST</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Loved By You (Single Luxury Testimonial Slider) */}
          <div className="reviews-col">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: '#111111',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                LOVED BY YOU
              </h2>

              {/* Slider Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={prevReview}
                  aria-label="Previous review"
                  className="review-arrow-btn"
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </button>
                <button
                  onClick={nextReview}
                  aria-label="Next review"
                  className="review-arrow-btn"
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Review Card */}
            <div className="testimonial-card">
              <span className="quote-mark">“</span>

              <p className="quote-text">
                {currentReview.comment}
              </p>

              <div className="reviewer-info">
                <div>
                  <h4 className="reviewer-name">{currentReview.customerName}</h4>
                  {currentReview.productName && (
                    <span className="reviewed-product">{currentReview.productName}</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', color: '#111111' }}>
                    {Array.from({ length: currentReview.rating }).map((_, i) => (
                      <Star key={i} size={13} fill="#111111" stroke="#111111" />
                    ))}
                  </div>

                  <div className="reviewer-avatar">
                    <Image
                      src="/images/logo/mk-monogram-silver.png"
                      alt="Verified MK Silver Hub Patron"
                      width={28}
                      height={28}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stories-split-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: flex-start;
        }

        .insta-masonry {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .insta-item {
          position: relative;
          aspect-ratio: 1/1;
          background-color: #F8F7F3;
          overflow: hidden;
          display: block;
        }

        .insta-img {
          transition: transform 0.5s ease;
        }

        .insta-hover-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(17, 17, 17, 0.65);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.25s ease;
          z-index: 2;
        }

        .insta-hover-text {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FFFFFF;
        }

        .insta-item:hover .insta-hover-overlay {
          opacity: 1;
        }

        .insta-item:hover .insta-img {
          transform: scale(1.08);
        }

        .reviews-col {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .testimonial-card {
          background-color: #F8F7F3;
          border: 1px solid #E8E7E2;
          padding: clamp(28px, 4vw, 40px);
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          min-height: 260px;
          position: relative;
        }

        .quote-mark {
          font-family: var(--font-display), "Cormorant Garamond", Georgia, serif;
          font-size: 4.5rem;
          line-height: 0.8;
          color: #BFC1C4;
          display: block;
          margin-bottom: 8px;
        }

        .quote-text {
          font-family: var(--font-body), "Jost", -apple-system, sans-serif;
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          line-height: 1.6;
          color: '#252525';
          font-style: italic;
          margin: 0 0 28px 0;
          flex: 1;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #E8E7E2;
          padding-top: 18px;
        }

        .reviewer-name {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #111111;
          margin: 0 0 2px 0;
        }

        .reviewed-product {
          font-family: var(--font-ui), "Jost", sans-serif;
          font-size: 0.76rem;
          color: #6F6F6A;
        }

        .reviewer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .review-arrow-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #E8E7E2;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .review-arrow-btn:hover {
          background-color: #111111;
          color: #FFFFFF;
          border-color: #111111;
        }

        @media (max-width: 900px) {
          .stories-split-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
