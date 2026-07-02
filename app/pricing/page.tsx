"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { paddleApi } from '../_lib/api';
import { useAuth } from '../_components/AuthProvider';
import { Tier, BillingInterval, TIER_LIMITS } from '../_lib/types';
import { Check, X, Zap } from 'lucide-react';

const TIERS: { tier: Tier; name: string; desc: string }[] = [
  { tier: 'free', name: 'Free', desc: 'For getting started' },
  { tier: 'starter', name: 'Starter', desc: 'For growing teams' },
  { tier: 'professional', name: 'Pro', desc: 'For serious marketers' },
  { tier: 'business', name: 'Business', desc: 'For larger organizations' },
];

const PRICES = {
  starter: { monthly: 49, yearly: 39 },
  professional: { monthly: 149, yearly: 112 },
  business: { monthly: 349, yearly: 279 },
};

const FEATURES = [
  { key: 'max_brands', label: 'Brands tracked', free: '1', starter: '1', professional: '3', business: '10' },
  { key: 'max_queries', label: 'Queries', free: '10', starter: '100', professional: '500', business: '2,000' },
  { key: 'data_retention', label: 'History', free: '7 days', starter: '30 days', professional: '90 days', business: '180 days' },
  { key: 'max_competitors', label: 'Competitors', free: '0', starter: '3', professional: '10', business: '10' },
  { key: 'competitor_compare', label: 'Competitor comparison', free: false, starter: true, professional: true, business: true },
  { key: 'recommendations', label: 'Content recommendations', free: false, starter: 'Top 3', professional: 'Unlimited', business: 'Unlimited' },
  { key: 'csv_export', label: 'CSV export', free: false, starter: false, professional: true, business: true },
  { key: 'pdf_export', label: 'PDF export', free: false, starter: false, professional: false, business: true },
  { key: 'team_seats', label: 'Team seats', free: '1', starter: '1', professional: '1', business: '3' },
  { key: 'api_access', label: 'API access', free: false, starter: false, professional: false, business: true },
];

function PricingContent() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const currentTier = user?.tier || 'free';

  const handleSubscribe = async (tier: Tier) => {
    if (!user) { router.push('/register'); return; }
    if (tier === 'free') return;
    setLoading(tier);
    setError('');
    try {
      const { price_id, client_token } = await paddleApi.checkout(tier, billingInterval);
      const paddle = (window as any).Paddle;
      if (paddle && price_id) {
        paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { successUrl: `${window.location.origin}/dashboard?checkout=success` },
        });
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
          <p className="text-xl text-gray-600 mb-8">Start free. Upgrade when you need more.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingInterval === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >Monthly</button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingInterval === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">Save 25%</Badge>
            </button>
          </div>
        </div>

        {error && <div className="mb-6 p-3 text-red-600 bg-red-50 rounded-lg text-center">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {TIERS.map(({ tier, name, desc }) => {
            const price = tier === 'free' ? 0 : PRICES[tier as keyof typeof PRICES][billingInterval];
            const isCurrentTier = currentTier === tier;
            const isPro = tier === 'professional';
            return (
              <Card key={tier} className={`flex flex-col ${isPro ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-lg' : ''}`}>
                <CardHeader>
                  {isPro && <Badge className="w-fit mb-2 bg-indigo-600 text-white"><Zap className="w-3 h-3 mr-1" />Most Popular</Badge>}
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    {tier !== 'free' && <span className="text-gray-500 text-sm">/mo</span>}
                    {tier === 'free' && <span className="text-gray-500 text-sm"> forever</span>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {FEATURES.map((feature) => {
                      const val = feature[tier as keyof typeof feature];
                      const isFalse = val === false;
                      return (
                        <li key={feature.key} className="flex items-start gap-2 text-sm">
                          {isFalse
                            ? <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                            : <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
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
                    <Button className="w-full" variant="outline" onClick={() => router.push('/register')}>Get Started Free</Button>
                  ) : (
                    <Button
                      className={`w-full ${isPro ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
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

        <p className="text-center text-sm text-gray-500 mt-8">
          All plans include a 14-day free trial. No credit card required for Free tier.
        </p>
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
      <PricingContent />
    </Suspense>
  );
}
