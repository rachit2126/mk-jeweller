import React, { Suspense } from 'react';
import LuxuryAccountExperience from '@/components/account/LuxuryAccountExperience';

export const metadata = {
  title: 'My Wishlist | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'View and manage your saved 925 sterling silver jewellery wishlist.',
};

export default function AccountWishlistPage() {
  return (
    <Suspense
      fallback={
        <div style={{ backgroundColor: '#F8F7F3', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#6F6F6A', fontSize: '0.85rem' }}>Loading your wishlist...</p>
        </div>
      }
    >
      <LuxuryAccountExperience initialTab="wishlist" />
    </Suspense>
  );
}
