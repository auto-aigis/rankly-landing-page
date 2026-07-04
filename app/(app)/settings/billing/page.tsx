'use client';

import { useAuth } from '@/app/_lib/hooks';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Billing</h1>
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Manage your subscription and billing information here.</p>
        </CardContent>
      </Card>
    </div>
  );
}