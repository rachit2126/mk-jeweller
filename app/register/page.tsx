import React, { Suspense } from 'react';
import LuxuryRegisterPage from '@/components/auth/LuxuryRegisterPage';

export const metadata = {
  title: 'Create Account | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'Join MK Silver Hub patron club to discover fine 925 sterling silver jewellery, track your orders and enjoy exclusive privileges.',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-500 font-sans text-sm">
        Loading registration...
      </div>
    }>
      <LuxuryRegisterPage />
    </Suspense>
  );
}
