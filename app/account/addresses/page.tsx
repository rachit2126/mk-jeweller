import React, { Suspense } from 'react';
import LuxuryAccountExperience from '@/components/account/LuxuryAccountExperience';

export const metadata = {
  title: 'My Addresses | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'Manage your delivery addresses and shipping destinations.',
};

export default function AccountAddressesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ backgroundColor: '#F8F7F3', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#6F6F6A', fontSize: '0.85rem' }}>Loading your addresses...</p>
        </div>
      }
    >
      <LuxuryAccountExperience initialTab="addresses" />
    </Suspense>
  );
}
