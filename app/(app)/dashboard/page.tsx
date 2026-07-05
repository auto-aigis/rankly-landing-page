'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/_lib/hooks';
import { paymentsApi } from '@/app/_lib/api';

function DashboardContent() {
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const checkout = searchParams.get('checkout');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    if (checkout === 'success' && transactionId) {
      setVerifying(true);
      paymentsApi
        .verifyTransaction(transactionId)
        .then(() => {
          router.replace('/dashboard');
        })
        .catch(() => {
          router.replace('/dashboard');
        })
        .finally(() => setVerifying(false));
    }
  }, [checkout, transactionId, router]);

  if (verifying) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-center text-gray-600">Payment processing... please wait</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.display_name || user?.email}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Track your brand's AI visibility over time. Run a new score or view
            your tracked brands.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-900">Get Started</h3>
              <p className="mt-2 text-sm text-gray-600">
                Subscribe to Rankly to track your brand continuously.
              </p>
              <a
                href="/pricing"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                View Pricing
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}