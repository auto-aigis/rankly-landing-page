"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { reportsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { GapReportItem, TIER_LIMITS } from '@/app/_lib/types';
import { Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function GapsReportPage() {
  const [data, setData] = useState<GapReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const hasAccess = user?.tier === 'professional' || user?.tier === 'business';

  useEffect(() => {
    if (hasAccess) loadData();
    else setLoading(false);
  }, [hasAccess]);

  const loadData = async () => {
    try {
      const result = await reportsApi.getGaps();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Knowledge Gap Analysis</h1>
          <p className="text-gray-600">Find queries where competitors appear but you don&apos;t</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Tier Required</h3>
            <p className="text-gray-600 mb-4">This report is available on Professional and Business</p>
            <Link href="/pricing" className="text-indigo-600 font-medium hover:underline">View plans</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Knowledge Gap Analysis</h1>
        <p className="text-gray-600">Topics where your brand is absent but competitors appear</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gap Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Priority Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-gray-600">High competitor presence</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queries with Gaps</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No gaps found - great job!</p>
          ) : (
            <div className="space-y-3">
              {data.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{item.query_text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">Competitors appearing:</span>
                    {item.competitors_present.map((comp, j) => (
                      <Badge key={j} variant="outline">{comp}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
