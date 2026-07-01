"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { paddleApi } from '../_lib/api';
import { useAuth } from '../_components/AuthProvider';
import { Tier, BillingInterval, TierLimits, TIER_LIMITS } from '../_lib/types';
import { Check, X, Sparkles } from 'lucide-react';

const TIERS: { tier: Tier; name: string; desc: string }[] = [
  { tier: 'free', name: 'Free', desc: 'For getting started' },
  { tier: 'starter', name: 'Starter', desc: 'For small teams' },
  { tier: 'professional', name: 'Professional', desc: 'For growing businesses' },
  { tier: 'business', name: 'Business', desc: 'For larger organizations' },
];

const PRICES = {
  starter: { monthly: 49, yearly: 39 },
  professional: { monthly: 149, yearly: 119 },
  business: { monthly: 349, yearly: 279 },
};

const FEATURES = [
  { key: 'max_brands', label: 'Brands', free: '1', starter: '1', professional: '3', business: '10' },
  { key: 'max_queries', label: 'Queries', free: '10', starter: '100', professional: '500', business: '2,000' },
  { key: 'data_retention_days', label: 'Data Retention', free: '7 days', starter: '30 days', professional: '90 days', business: '180 days' },
  { key: 'max_competitors', label: 'Competitors', free: '0', starter: '3', professional: '10', business: '10' },
  { key: 'has_competitor_comparison', label: 'Competitor Comparison', free: false, starter: true, professional: true, business: true },
  { key: 'has_recommendations', label: 'Recommendations', free: false, starter: 'Top 3', professional: 'Unlimited', business: 'Unlimited' },
  { key: 'has_csv_export', label: 'CSV Export', free: false, starter: false, professional: true, business: true },
  { key: 'has_pdf_export', label: 'PDF Export', free: false, starter: false, professional: false, business: true },
  { key: 'max_seats', label: 'Team Seats', free: '1', starter: '1', professional: '1', business: '3' },
  { key: 'has_api_access', label: 'API Access', free: false, starter: false, professional: false, business: true },
];

function PricingContent() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refresh } = useAuth();

  const currentTier = user?.tier || 'free';

  const handleSubscribe = async (tier: Tier) => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (tier === 'free') return;
    setLoading(tier);
    setError('');
    try {
      const { client_token } = await paddleApi.checkout(tier, billingInterval);
      const paddle = (window as any).Paddle;
      if (paddle) {
        paddle.Checkout.open({ items: [{ priceId: '', quantity: 1 }], customData: { user_id: user.id } });
      } else {
        console.log('Paddle not loaded, token:', client_token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-600 mb-8">Choose the plan that fits your needs</p>
          <div className="flex items-center justify-center gap-3">
            <span className={billingInterval === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>Monthly</span>
            <Switch checked={billingInterval === 'yearly'} onCheckedChange={(v) => setBillingInterval(v ? 'yearly' : 'monthly')} />
            <span className={billingInterval === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">Save 20%</Badge>
            </span>
          </div>
        </div>

        {error && <div className="mb-6 p-3 text-red-600 bg-red-50 rounded-lg">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {TIERS.map(({ tier, name, desc }) => {
            const limits = TIER_LIMITS[tier];
            const price = tier === 'free' ? 0 : PRICES[tier as keyof typeof PRICES][billingInterval];
            const isCurrentTier = currentTier === tier;
            const isPro = tier === 'professional';

            return (
              <Card key={tier} className={isPro ? 'border-indigo-600 ring-2 ring-indigo-100' : ''}>
                <CardHeader>
                  {isPro && <Badge className="w-fit mb-2 bg-indigo-600">Most Popular</Badge>}
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    {tier !== 'free' && <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {FEATURES.map((feature) => {
                      const val = feature[tier];
                      const isTrue = val === true;
                      const isFalse = val === false;
                      return (
                        <li key={feature.key} className="flex items-center gap-2 text-sm">
                          {isFalse ? <X className="w-4 h-4 text-gray-300" /> : <Check className="w-4 h-4 text-green-500" />}
                          <span className={isFalse ? 'text-gray-400' : 'text-gray-700'}>
                            {typeof val === 'boolean' ? feature.label : `${feature.label}: ${val}`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrentTier ? (
                    <Button className="w-full" variant="secondary" disabled>Current Plan</Button>
                  ) : tier === 'free' ? (
                    <Button className="w-full" variant="outline">Get Started</Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={loading === tier}
                      onClick={() => handleSubscribe(tier)}
                    >
                      {loading === tier ? 'Loading...' : `Upgrade to ${name}`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    }>
    >
      <PricingContent />
    </Suspense>
  );
}
