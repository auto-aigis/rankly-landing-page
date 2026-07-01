"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { reportsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { CitationReportItem, TIER_LIMITS } from '@/app/_lib/types';
import { Lock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CitationsReportPage() {
  const [data, setData] = useState<CitationReportItem[]>([]);
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
      const result = await reportsApi.getCitations();
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
          <h1 className="text-2xl font-semibold text-gray-900">Citation Analysis</h1>
          <p className="text-gray-600">See which sources are cited when your brand appears</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Citation Analysis</h1>
        <p className="text-gray-600">Which sources are cited when your brand appears in AI answers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Citations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {data.reduce((sum, d) => sum + d.frequency, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unique Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Owned Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {data.filter((d) => d.is_owned).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Cited URLs</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No citations yet</p>
          ) : (
            <div className="space-y-2">
              {data.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:underline truncate"
                    >
                      {item.url}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={item.is_owned ? 'default' : 'outline'}>
                      {item.is_owned ? 'Owned' : 'Third-party'}
                    </Badge>
                    <Badge variant="secondary">{item.frequency}</Badge>
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
