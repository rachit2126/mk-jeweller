import React, { Suspense } from 'react';
import UnifiedLoginForm from '@/components/auth/UnifiedLoginForm';

export const metadata = {
  title: 'Sign In | MK Silver Hub Enterprise Admin',
  description: 'Sign in to access MK Silver Hub administrative control center.',
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5F0] text-stone-500 font-sans text-sm">
        Loading sign in...
      </div>
    }>
      <UnifiedLoginForm initialRedirect="/admin" />
    </Suspense>
  );
}
