'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { scanApi } from '@/app/_lib/api';
import { useEffect, useState } from 'react';

export default function ScorePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [user, router]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Score</h1>
      <p className="text-gray-600">Your AI visibility score will appear here.</p>
    </div>
  );
}