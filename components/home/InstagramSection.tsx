'use client';

import React from 'react';
import Image from 'next/image';
import { InstagramIcon } from '@/components/ui/Icons';

const POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop' },
  { id: 2, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop' },
  { id: 3, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop' },
  { id: 4, image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop' },
  { id: 5, image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop' },
  { id: 6, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop' },
  { id: 7, image: 'https://images.unsplash.com/photo-1611591475805-4c07b6f635c0?q=80&w=600&auto=format&fit=crop' },
];

export default function InstagramSection() {
  return (
    <section
      style={{
        backgroundColor: '#FFF9F3',
        padding: 'clamp(54px, 7vw, 84px) 0 clamp(40px, 5vw, 64px)',
      }}
    >
      <div className="container">
        {/* Eyebrow Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui), "Jost", sans-serif',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.24em',
              color: '#3B2B2B',
              textTransform: 'uppercase',
            }}
          >
            FOLLOW US @MKSILVERHUB
          </span>
        </div>

        {/* 7 Images Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '12px',
          }}
          className="ig-gallery-grid"
        >
          {POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-photo-box"
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%',
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: '#FFE3D3',
                border: '1px solid #E8D8D0',
                display: 'block',
                boxShadow: '0 4px 14px rgba(59, 43, 43, 0.05)',
              }}
            >
              <Image
                src={post.image}
                alt="MK Silver Hub jewellery styling"
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 14vw"
                style={{ objectFit: 'cover', transition: 'transform 0.45s ease' }}
                className="ig-photo-img"
              />

              {/* Hover overlay with Instagram icon */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(183, 110, 121, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  opacity: 0,
                  transition: 'opacity 0.25s ease',
                }}
                className="ig-hover-overlay"
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    color: '#B76E79',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InstagramIcon size={18} color="#B76E79" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ig-photo-box:hover .ig-photo-img {
          transform: scale(1.06);
        }
        .ig-photo-box:hover .ig-hover-overlay {
          opacity: 1;
        }
        @media (max-width: 1024px) {
          .ig-gallery-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .ig-gallery-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 12px !important;
            padding: 4px 14px 12px 14px !important;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .ig-gallery-grid::-webkit-scrollbar {
            display: none;
          }
          :global(.ig-photo-box) {
            flex: 0 0 140px !important;
            width: 140px !important;
            height: 140px !important;
            padding-top: 0 !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}
