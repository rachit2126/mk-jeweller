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
      {/* 01 Hero Slider */}
      <HeroSlider />

      {/* 02 Shop By Category / Collections */}
      <CategorySection />

      {/* 03 Trust Strip (Floating overlap between Collections & Best Sellers) */}
      <TrustStrip />

      {/* 04 Best Sellers */}
      <BestSellersSection />

      {/* 05 New Arrivals */}
      <NewArrivalsSection />

      {/* 06 Editorial Campaign */}
      <EditorialBanner />

      {/* 07 Curated Occasions */}
      <OccasionSection />

      {/* 08 Why Choose MK Silver Hub */}
      <BrandStorySection />

      {/* 09 Testimonials */}
      <ReviewsSection />

      {/* 10 Newsletter */}
      <NewsletterSection />
    </>
  );
}
