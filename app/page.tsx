import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import TrustStrip from '@/components/home/TrustStrip';
import CategorySection from '@/components/home/CategorySection';
import BestSellersSection from '@/components/home/BestSellersSection';
import EditorialBanner from '@/components/home/EditorialBanner';
import OccasionSection from '@/components/home/OccasionSection';
import BrandStorySection from '@/components/home/BrandStorySection';
import ReviewsSection from '@/components/home/ReviewsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <>
      {/* 01 Hero Video/Image Slider */}
      <HeroSlider />

      {/* 02 Shop By Collections */}
      <CategorySection />

      {/* 03 Benefits Strip */}
      <TrustStrip />

      {/* 04 Best Sellers */}
      <BestSellersSection />

      {/* 05 Editorial Bridal Banner */}
      <EditorialBanner />

      {/* 06 Three Feature Cards */}
      <OccasionSection />

      {/* 07 Why Choose MK Silver Hub */}
      <BrandStorySection />

      {/* 08 Testimonial */}
      <ReviewsSection />

      {/* 09 Newsletter */}
      <NewsletterSection />
    </>
  );
}
