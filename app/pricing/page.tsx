'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { pricingApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import type { PricingTier } from '@/app/_lib/types';

export default function Pricing() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadPaddle = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        const paddle = (window as any).Paddle;
        if (paddle) {
          paddle.Environment.set('sandbox');
          paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            eventCallback: (data: any) => {
              if (data.event === 'checkout.completed') {
                const txnId = data.data.transaction_id;
                paddle.Checkout.close();
                window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
              }
            },
          });
        }
      };
      document.body.appendChild(script);
    };

    loadPaddle();
    pricingApi
      .get()
      .then((data) => setTiers(data.tiers))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = (tier: PricingTier) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!tier.paddle_price_id) return;

    const paddle = (window as any).Paddle;
    if (paddle?.Checkout) {
      paddle.Checkout.open({
        items: [{ priceId: tier.paddle_price_id, quantity: 1 }],
      });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-center text-gray-600">Loading pricing...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Pricing</h1>
      <p className="mb-12 text-lg text-gray-600">
        Choose the plan that fits your brand tracking needs.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col ${
              tier.name === 'Professional' ? 'border-blue-300 md:scale-105' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  ${tier.price}
                </span>
                {tier.price > 0 && (
                  <span className="text-gray-600">/month</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="mb-6 space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscribe(tier)}
                className="w-full"
                variant={tier.name === 'Professional' ? 'default' : 'outline'}
              >
                {tier.price === 0 ? 'Get Started' : 'Subscribe'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
