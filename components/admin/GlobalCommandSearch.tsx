'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Package, ShoppingBag, User, Layers, ArrowRight } from 'lucide-react';

interface SearchResult {
  type: 'product' | 'order' | 'customer' | 'category';
  title: string;
  subtitle: string;
  url: string;
  image?: string;
}

export default function GlobalCommandSearch({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'product': return <Package size={16} className="item-icon product" />;
      case 'order': return <ShoppingBag size={16} className="item-icon order" />;
      case 'customer': return <User size={16} className="item-icon customer" />;
      default: return <Layers size={16} className="item-icon category" />;
    }
  };

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Input Bar */}
        <div className="search-input-row">
          <Search size={18} className="search-lead-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, customers, categories..."
            className="search-cmd-input"
          />
          {query && (
            <button onClick={() => setQuery('')} className="clear-btn">
              <X size={14} />
            </button>
          )}
          <kbd className="esc-key">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="results-container">
          {loading && <div className="loading-state">Searching records...</div>}

          {!loading && results.length > 0 && (
            <div className="results-list">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="result-row"
                  onClick={() => handleSelect(item.url)}
                >
                  <div className="result-icon-box">{getIcon(item.type)}</div>
                  <div className="result-text-col">
                    <span className="result-title">{item.title}</span>
                    <span className="result-subtitle">{item.subtitle}</span>
                  </div>
                  <ArrowRight size={14} className="result-arrow" />
                </div>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="empty-state">No matching records found for &quot;{query}&quot;</div>
          )}

          {!query && (
            <div className="hints-box">
              <span className="hint-label">Quick Suggestions</span>
              <div className="hint-tags">
                <span onClick={() => setQuery('necklace')}>Necklace</span>
                <span onClick={() => setQuery('ring')}>Ring</span>
                <span onClick={() => setQuery('#MKT')}>Orders</span>
                <span onClick={() => setQuery('earrings')}>Earrings</span>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .search-modal-backdrop {
            position: fixed;
            inset: 0;
            background-color: rgba(52, 39, 39, 0.45);
            backdrop-filter: blur(4px);
            z-index: 200;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: clamp(60px, 12vh, 120px);
          }

          .search-modal-card {
            width: min(92%, 620px);
            background-color: #FFFFFF;
            border-radius: 18px;
            box-shadow: 0 24px 60px rgba(52, 39, 39, 0.2);
            border: 1px solid #EAE2DB;
            overflow: hidden;
            animation: modalSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes modalSlide {
            from { opacity: 0; transform: translateY(-8px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .search-input-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-bottom: 1px solid #F0E8E2;
          }

          .search-lead-icon {
            color: #111111;
            flex-shrink: 0;
          }

          .search-cmd-input {
            flex: 1;
            border: none;
            background: none;
            font-family: var(--font-ui), 'Jost', sans-serif;
            font-size: 1rem;
            color: #342727;
            outline: none;
          }

          .clear-btn {
            background: none;
            border: none;
            color: #806D68;
            cursor: pointer;
            padding: 4px;
          }

          .esc-key {
            background-color: #F8F1EC;
            border: 1px solid #E8D8D0;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 0.68rem;
            font-family: inherit;
            color: #806D68;
            font-weight: 600;
          }

          .results-container {
            max-height: 380px;
            overflow-y: auto;
            padding: 12px 14px;
          }

          .loading-state, .empty-state {
            padding: 28px;
            text-align: center;
            color: #806D68;
            font-family: var(--font-ui), 'Jost', sans-serif;
            font-size: 0.88rem;
          }

          .results-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .result-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.15s ease;
          }

          .result-row:hover {
            background-color: #FFF5F2;
          }

          .result-icon-box {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            background-color: #F8F7F3;
            border: 1px solid #E8E7E2;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          :global(.item-icon.product) { color: #111111; }
          :global(.item-icon.order) { color: #4A5568; }
          :global(.item-icon.customer) { color: #1E7E5E; }
          :global(.item-icon.category) { color: #C07D1C; }

          .result-text-col {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .result-title {
            font-family: var(--font-ui), 'Jost', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            color: #342727;
          }

          .result-subtitle {
            font-family: var(--font-ui), 'Jost', sans-serif;
            font-size: 0.74rem;
            color: #806D68;
          }

          .result-arrow {
            color: #D9C8BE;
          }

          .hints-box {
            padding: 16px 12px;
          }

          .hint-label {
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #806D68;
            display: block;
            margin-bottom: 8px;
          }

          .hint-tags {
            display: flex;
            gap: 8px;
          }

          .hint-tags span {
            background-color: #F8F7F3;
            border: 1px solid #E8E7E2;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.78rem;
            color: #111111;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .hint-tags span:hover {
            background-color: #111111;
            color: #FFFFFF;
            border-color: #111111;
          }
        `}</style>
      </div>
    </div>
  );
}
