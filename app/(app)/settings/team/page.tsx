'use client';

import { useAuth } from '@/app/_lib/hooks';
import { TIER_LIMITS } from '@/app/_lib/types';

export default function TeamSettingsPage() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Settings</h1>
      <p className="text-gray-600">Manage your team and permissions.</p>
    </div>
  );
}