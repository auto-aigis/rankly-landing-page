"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { reportsApi } from '../../../_lib/api';
import { useAuth } from '../../../_components/AuthProvider';
import { Recommendation, TIER_LIMITS } from '../../../_lib/types';
import { Lock, Lightbulb, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState<string | null>(null);
  const { user } = useAuth();

  const limits = TIER_LIMITS[user?.tier || 'free'];
  const hasAccess = user?.tier !== 'free';
  const isStarter = user?.tier === 'starter';

  useEffect(() => {
    if (hasAccess) loadData();
    else setLoading(false);
  }, [hasAccess]);

  const loadData = async () => {
    try {
      const result = await reportsApi.getRecommendations();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (queryId: string) => {
    setGenerating(queryId);
    try {
      await reportsApi.generateRecommendation(queryId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setGenerating(null);
    }
  };

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Optimization Recommendations</h1>
          <p className="text-gray-600">AI-generated content suggestions to boost visibility</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upgrade to Access</h3>
            <p className="text-gray-600 mb-4">This feature is available on Starter and above</p>
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

  const displayData = isStarter ? data.slice(0, 3) : data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Optimization Recommendations</h1>
          <p className="text-gray-600">AI-generated content suggestions to increase your visibility</p>
        </div>
        {isStarter && data.length > 3 && (
          <Link href="/pricing" className="text-sm text-indigo-600 hover:underline">
            Upgrade for unlimited
          </Link>
        )}
      </div>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      {data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 mb-4">Add queries and let AI analyze gaps to generate recommendations</p>
            <Link href="/dashboard/queries">
              <Button>Go to Queries</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayData.map((rec) => (
            <Card key={rec.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{rec.query_text}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {rec.current_rate}% → {rec.target_rate}%
                      </Badge>
                      <Badge variant="secondary">Rank #{rec.priority_rank}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-900">{rec.content_action}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    Generated {new Date(rec.generated_at).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerate(rec.query_id)}
                    disabled={generating === rec.query_id}
                  >
                    {generating === rec.query_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Regenerate'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
