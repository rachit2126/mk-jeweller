'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

interface SearchOverlayProps {
  isOpen?: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Silver Rings',
  '925 Necklaces',
  'Stud Earrings',
  'Bracelets',
  'New Arrivals',
  'Bridal Polki',
];

export default function SearchOverlay({ isOpen = true, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/products?limit=4&isBestSeller=true')
      .then(res => res.json())
      .then(data => {
        if (data.products) setTrendingProducts(data.products);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    onClose();
  };

  return (
    <motion.div
      className="search-overlay-wrapper"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="search-card">
        {/* Top Header & Search Input */}
        <div className="search-header-row">
          <div className="header-eyebrow">Search Jewellery</div>
          <button onClick={onClose} aria-label="Close search" className="close-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="search-input-form">
          <div className="search-input-box">
            <Search size={20} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search necklaces, rings, earrings..."
              className="search-text-input"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="clear-query-btn"
                aria-label="Clear search input"
              >
                <X size={15} />
              </button>
            )}
            <button type="submit" className="search-submit-btn">
              <span>Search</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </form>

        {/* Popular Search Pills */}
        <div className="popular-searches-box">
          <div className="tags-label">
            <TrendingUp size={13} color="#B76E79" />
            <span>Popular Searches</span>
          </div>
          <div className="tags-row">
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="search-tag-pill"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Products */}
        <div className="trending-section">
          <div className="trending-label">Trending Products</div>
          <div className="trending-grid">
            {trendingProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.slug}`}
                onClick={onClose}
                className="trending-product-card"
              >
                <div className="prod-thumb">
                  <Image
                    src={prod.images[0]}
                    alt={prod.name}
                    fill
                    sizes="64px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="prod-info">
                  <span className="prod-name">{prod.name}</span>
                  <span className="prod-price">{formatPrice(prod.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .search-overlay-wrapper {
          position: absolute;
          top: calc(100% + 14px);
          left: 0;
          right: 0;
          z-index: 130;
          display: flex;
          justify-content: center;
          padding: 0 20px;
          pointer-events: auto;
        }

        .search-card {
          width: 100%;
          max-width: 900px;
          background: rgba(255, 249, 243, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid rgba(232, 216, 208, 0.85);
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(65, 40, 35, 0.12), 0 4px 16px rgba(183, 110, 121, 0.08);
          padding: 24px 28px;
        }

        .search-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .header-eyebrow {
          font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #2D201E;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #806D68;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 180ms ease, color 180ms ease;
        }

        .close-btn:hover {
          background-color: #F8F7F3;
          color: #111111;
        }

        .search-input-form {
          margin-bottom: 16px;
        }

        .search-input-box {
          position: relative;
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1.5px solid #111111;
          border-radius: 0px;
          padding: 4px 6px 4px 18px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .search-input-box:focus-within {
          border-color: #111111;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }

        :global(.search-icon) {
          color: #111111;
          flex-shrink: 0;
          margin-right: 12px;
        }

        .search-text-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.94rem;
          color: #111111;
          outline: none;
          padding: 8px 0;
        }

        .search-text-input::placeholder {
          color: #6F6F6A;
        }

        .clear-query-btn {
          background: transparent;
          border: none;
          color: #6F6F6A;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #111111;
          color: #FFFFFF;
          padding: 8px 18px;
          border-radius: 0px;
          border: none;
          font-family: var(--font-ui), 'Jost', sans-serif;
          fontSize: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 180ms ease;
        }

        .search-submit-btn:hover {
          background: #252525;
        }

        /* POPULAR SEARCHES */
        .popular-searches-box {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tags-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #111111;
        }

        .tags-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .search-tag-pill {
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          color: #111111;
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 0px;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .search-tag-pill:hover {
          background: #F8F7F3;
          border-color: #111111;
          color: #111111;
        }

        /* TRENDING PRODUCTS */
        .trending-section {
          border-top: 1px solid #E8E7E2;
          padding-top: 16px;
        }

        .trending-label {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #111111;
          margin-bottom: 12px;
        }

        .trending-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .trending-product-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFFFFF;
          border: 1px solid #E8E7E2;
          border-radius: 0px;
          padding: 8px 10px;
          text-decoration: none;
          transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

        .trending-product-card:hover {
          border-color: rgba(183, 110, 121, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(183, 110, 121, 0.10);
        }

        .prod-thumb {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          overflow: hidden;
          background: #FCECE9;
          flex-shrink: 0;
        }

        .prod-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          text-align: left;
        }

        .prod-name {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #2D201E;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .prod-price {
          font-family: var(--font-ui), 'Jost', sans-serif;
          font-size: 0.76rem;
          font-weight: 600;
          color: #B76E79;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .trending-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </motion.div>
  );
}
