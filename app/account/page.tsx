import React, { Suspense } from 'react';
import LuxuryAccountExperience from '@/components/account/LuxuryAccountExperience';

export const metadata = {
  title: 'My Account | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'Manage your MK Silver Hub patron account, view orders, addresses, wishlist and preferences.',
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div style={{ backgroundColor: '#F8F7F3', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#6F6F6A', fontSize: '0.85rem' }}>Loading your patron account...</p>
        </div>
      }
    >
      <LuxuryAccountExperience initialTab="overview" />
    </Suspense>
  );
}
