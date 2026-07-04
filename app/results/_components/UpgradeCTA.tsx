'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';

export function UpgradeCTA({ scoreId }: { scoreId: string }) {
  const { user } = useAuth();
  const priceIds = {
    starter: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STARTER ?? null,
    professional: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PROFESSIONAL ?? null,
  };

  const handleCheckout = async (tier: 'starter' | 'professional') => {
    await analyticsApi.recordEvent('paddle_cta_clicked', scoreId);

    if (!user) {
      const loginUrl = `/login?redirect=/results/${scoreId}`;
      window.location.href = loginUrl;
      return;
    }

    const priceId = priceIds[tier];
    if (!priceId) {
      alert(`Price not configured for ${tier}`);
      return;
    }

    const Paddle = (window as any).Paddle;
    if (!Paddle) {
      alert('Payment service loading... please try again');
      return;
    }

    Paddle.Checkout.open({
      items: [{ priceId }],
      customData: { scoreId, userId: user.id },
      settings: { displayMode: 'overlay' },
    });
  };

  return (
    <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="text-gray-900">Track Your Score Weekly</CardTitle>
        <CardDescription>Upgrade to automate visibility tracking and get insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Starter</h3>
            <p className="text-2xl font-bold text-blue-600 mb-3">$49<span className="text-sm text-gray-600">/mo</span></p>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              <li>✓ Weekly tracking</li>
              <li>✓ Email reports</li>
              <li>✓ 1 brand</li>
              <li>✓ Score history</li>
            </ul>
            <Button
              onClick={() => handleCheckout('starter')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Choose Starter
            </Button>
          </div>

          <div className="border-2 border-blue-600 rounded-lg p-4 relative">
            <div className="absolute -top-3 left-4 bg-white px-2">
              <span className="text-xs font-semibold text-blue-600">POPULAR</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional</h3>
            <p className="text-2xl font-bold text-blue-600 mb-3">$149<span className="text-sm text-gray-600">/mo</span></p>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              <li>✓ Weekly tracking</li>
              <li>✓ Email reports</li>
              <li>✓ Unlimited brands</li>
              <li>✓ Competitor alerts</li>
              <li>✓ Priority support</li>
            </ul>
            <Button
              onClick={() => handleCheckout('professional')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Choose Professional
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
