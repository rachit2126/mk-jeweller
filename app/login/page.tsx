import React, { Suspense } from 'react';
import LuxuryLoginPage from '@/components/auth/LuxuryLoginPage';

export const metadata = {
  title: 'Sign In | MK Silver Hub — Fine 925 Sterling Jewellery',
  description: 'Sign in to access your MK Silver Hub patron account, track orders, manage addresses and wishlist.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-500 font-sans text-sm">
        Loading sign in...
      </div>
    }>
      <LuxuryLoginPage />
    </Suspense>
  );
}
