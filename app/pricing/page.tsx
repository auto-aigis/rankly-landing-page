'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/_lib/hooks';
import { analyticsApi } from '@/app/_lib/api';

export default function PricingPage() {
  const { user } = useAuth();
  const [paddleReady, setPaddleReady] = useState(false);
  const priceIds = {
    starter: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STARTER ?? null,
    professional: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PROFESSIONAL ?? null,
  };

  useEffect(() => {
    if (document.querySelector('script[src*="paddle"]')) {
      setPaddleReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      const Paddle = (window as any).Paddle;
      if (Paddle) {
        Paddle.Environment.set('sandbox');
        Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
          eventCallback: () => {},
        });
        setPaddleReady(true);
      }
    };
    document.head.appendChild(script);
  }, []);

  const handleCheckout = async (tier: 'starter' | 'professional') => {
    await analyticsApi.recordEvent('paddle_cta_clicked');
    if (!user) {
      window.location.href = '/login?redirect=/pricing';
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
      customData: { userId: user.id },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600">Track your AI visibility with confidence</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Free</CardTitle>
            <CardDescription>One-time scoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">$0</p>
              <p className="text-sm text-gray-600">Always free</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ One AI visibility score</li>
              <li>✓ Competitor comparison</li>
              <li>✓ Actionable recommendations</li>
              <li>✗ No tracking</li>
              <li>✗ No history</li>
            </ul>
            <Button variant="outline" className="w-full text-gray-700 border-gray-300 hover:bg-gray-50">
              Try for Free
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Starter</CardTitle>
            <CardDescription>For growing brands</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-blue-600">$49</p>
              <p className="text-sm text-gray-600">/month</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Weekly automated tracking</li>
              <li>✓ Email reports</li>
              <li>✓ Track 1 brand</li>
              <li>✓ Score history</li>
              <li>✗ Competitor alerts</li>
            </ul>
            <Button
              onClick={() => handleCheckout('starter')}
              disabled={!paddleReady}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Choose Starter
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-600 relative">
          <div className="absolute -top-3 right-4 bg-white px-2">
            <Badge className="bg-blue-600">Most Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-gray-900">Professional</CardTitle>
            <CardDescription>For agencies & enterprises</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-blue-600">$149</p>
              <p className="text-sm text-gray-600">/month</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Weekly tracking</li>
              <li>✓ Email reports</li>
              <li>✓ Unlimited brands</li>
              <li>✓ Competitor change alerts</li>
              <li>✓ Priority support</li>
            </ul>
            <Button
              onClick={() => handleCheckout('professional')}
              disabled={!paddleReady}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Choose Professional
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
