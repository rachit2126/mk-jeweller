import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import CategorySection from '@/components/home/CategorySection';
import TrustStrip from '@/components/home/TrustStrip';
import BestSellersSection from '@/components/home/BestSellersSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import EditorialBanner from '@/components/home/EditorialBanner';
import OccasionSection from '@/components/home/OccasionSection';
import BrandStorySection from '@/components/home/BrandStorySection';
import ReviewsSection from '@/components/home/ReviewsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <>
      {/* 01 Floating Mobile Navbar is in layout.tsx */}

      {/* 02 Hero Slider */}
      <HeroSlider />

      {/* 03 Shop By Category / Collections */}
      <CategorySection />

      {/* 04 Trust Strip (Floating overlap bridge between Collections & Best Sellers) */}
      <TrustStrip />

      {/* 05 Best Sellers */}
      <BestSellersSection />

      {/* 06 New Arrivals */}
      <NewArrivalsSection />

      {/* 07 Editorial Campaign */}
      <EditorialBanner />

      {/* 08 Curated Occasions */}
      <OccasionSection />

      {/* 09 Why Choose MK Silver Hub */}
      <BrandStorySection />

      {/* 10 Testimonials */}
      <ReviewsSection />

      {/* 11 Newsletter */}
      <NewsletterSection />

      {/* 12 Compact Mobile Footer is in layout.tsx */}
      {/* 13 Floating WhatsApp is in layout.tsx */}
      {/* 14 Fixed Bottom Navigation is in layout.tsx */}
    </>
  );
}
