import React, { Suspense } from 'react';
import LuxuryAuthExperience from '@/components/auth/LuxuryAuthExperience';

export const metadata = {
  title: 'Sign In | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'Sign in to access your MK Silver Hub patron account, track orders, manage addresses and wishlist.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5F0] text-stone-500 font-sans text-sm">
        Loading sign in...
      </div>
    }>
      <LuxuryAuthExperience initialMode="login" />
    </Suspense>
  );
}
