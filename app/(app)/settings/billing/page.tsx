"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { settingsApi } from '../../_lib/api';
import { Tier, TIER_LIMITS } from '../../_lib/types';
import { useAuth } from '../../_components/AuthProvider';
import { CreditCard, Calendar, AlertCircle, ExternalLink } from 'lucide-react';

export default function BillingPage() {
  const [billing, setBilling] = useState<{ tier: Tier; status: string; current_period_end: string | null; price_id: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, refresh } = useAuth();

  const tier = user?.tier || 'free';
  const limits = TIER_LIMITS[tier];

  useEffect(() => {
    loadBilling();
  }, []);

  const loadBilling = async () => {
    try {
      const data = await settingsApi.getBilling();
      setBilling(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <p className="text-gray-600">Manage your subscription</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900 capitalize">{tier}</span>
                <Badge variant={tier === 'free' ? 'outline' : 'default'}>
                  {billing?.status || 'active'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {tier === 'free' ? 'Free forever' : `${limits.max_queries} queries, ${limits.max_competitors} competitors`}
              </p>
            </div>
            {tier !== 'free' && (
              <Button variant="outline" size="sm">
                Manage Subscription
              </Button>
            )}
          </div>

          {billing?.current_period_end && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              Renews on {new Date(billing.current_period_end).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>

      {tier === 'free' && (
        <Card>
          <CardContent className="py-6 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upgrade to Unlock More</h3>
            <p className="text-gray-600 mb-4">Get more queries, competitors, and advanced features</p>
            <Link href="/pricing">
              <Button>View Plans</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Plan Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Queries</span>
              <p className="font-medium text-gray-900">{limits.max_queries}</p>
            </div>
            <div>
              <span className="text-gray-500">Competitors</span>
              <p className="font-medium text-gray-900">{limits.max_competitors}</p>
            </div>
            <div>
              <span className="text-gray-500">Data Retention</span>
              <p className="font-medium text-gray-900">{limits.data_retention_days} days</p>
            </div>
            <div>
              <span className="text-gray-500">Team Seats</span>
              <p className="font-medium text-gray-900">{limits.max_seats}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
