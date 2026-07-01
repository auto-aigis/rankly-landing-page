"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { reportsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { VisibilityReportItem, TIER_LIMITS } from '@/app/_lib/types';
import { TrendingUp, Lock } from 'lucide-react';
import Link from 'next/link';

export default function VisibilityReportPage() {
  const [data, setData] = useState<VisibilityReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const limits = TIER_LIMITS[user?.tier || 'free'];
  const hasAccess = user?.tier !== 'free';

  useEffect(() => {
    if (hasAccess) loadData();
    else setLoading(false);
  }, [hasAccess]);

  const loadData = async () => {
    try {
      const result = await reportsApi.getVisibility();
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
          <h1 className="text-2xl font-semibold text-gray-900">AI Visibility Report</h1>
          <p className="text-gray-600">Track your brand appears in AI-generated answers</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upgrade to Access</h3>
            <p className="text-gray-600 mb-4">This report is available on Starter and above</p>
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

  const overallPercentage = data.length > 0
    ? Math.round(data.reduce((sum, d) => sum + d.percentage, 0) / data.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">AI Visibility Report</h1>
        <p className="text-gray-600">How often your brand appears in AI-generated answers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{overallPercentage}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Queries Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Available on Professional+</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per-Query Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No query results yet</p>
          ) : (
            <div className="space-y-3">
              {data.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 flex-1">{item.query_text}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {item.appearance_count} / {item.total_runs}
                    </span>
                    <Badge variant={item.percentage >= 50 ? 'default' : 'outline'}>
                      {item.percentage}%
                    </Badge>
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
