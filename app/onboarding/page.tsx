'use client';

import { useAuth } from '@/app/_lib/hooks';
import { scanApi, coreApi } from '@/app/_lib/api';

export default function OnboardingPage() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Onboarding</h1>
      <p className="text-gray-600">Get started with Rankly.</p>
    </div>
  );
}