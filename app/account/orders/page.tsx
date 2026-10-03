import React, { Suspense } from 'react';
import LuxuryAccountExperience from '@/components/account/LuxuryAccountExperience';

export const metadata = {
  title: 'My Orders | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'View and track your MK Silver Hub orders and shipments.',
};

export default function AccountOrdersPage() {
  return (
    <Suspense
      fallback={
        <div style={{ backgroundColor: '#F8F7F3', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#6F6F6A', fontSize: '0.85rem' }}>Loading your orders...</p>
        </div>
      }
    >
      <LuxuryAccountExperience initialTab="orders" />
    </Suspense>
  );
}
