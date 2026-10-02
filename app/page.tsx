import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import TrustStrip from '@/components/home/TrustStrip';
import CategorySection from '@/components/home/CategorySection';
import EditorialBanner from '@/components/home/EditorialBanner';
import BestSellersSection from '@/components/home/BestSellersSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import MenJewellerySection from '@/components/home/MenJewellerySection';
import MinimalCollectionSection from '@/components/home/MinimalCollectionSection';
import OccasionSection from '@/components/home/OccasionSection';
import SocialAndReviewsSection from '@/components/home/SocialAndReviewsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

import RootedInCraftSection from '@/components/home/RootedInCraftSection';

export default function HomePage() {
  return (
    <>
      {/* 01 Full-Screen Editorial Silver Jewellery Hero */}
      <HeroSlider />

      {/* 02 Hallmark Trust / Benefits Strip */}
      <TrustStrip />

      {/* 03 Shop by Category Asymmetric Grid */}
      <CategorySection />

      {/* 04 The Art of Silver Full-Width Black Campaign Banner */}
      <EditorialBanner />

      {/* 05 Best Sellers Product Slider (Live MongoDB) */}
      <BestSellersSection />

      {/* 06 New Arrivals Product Showcase (Live MongoDB) */}
      <NewArrivalsSection />

      {/* 07 Silver for Him (Men's Jewellery) */}
      <MenJewellerySection />

      {/* 08 The Minimal Collection (Less. But Better.) */}
      <MinimalCollectionSection />

      {/* 09 Jewellery for Every Moment (Curated Occasions) */}
      <OccasionSection />

      {/* 10 Rooted In Craft Heritage Section */}
      <RootedInCraftSection />

      {/* 11 Community Stories & Customer Testimonials Split */}
      <SocialAndReviewsSection />

      {/* 12 Stay in the Loop (Newsletter) */}
      <NewsletterSection />
    </>
  );
}
