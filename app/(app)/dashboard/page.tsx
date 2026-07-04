'use client';

import { useEffect, useState } from 'react';
import { scoreApi } from '@/app/_lib/api';
import { ScoreHistoryItem } from '@/app/_lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function DashboardPage() {
  const [scores, setScores] = useState<ScoreHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scoreApi
      .getHistory()
      .then(setScores)
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Scores</h1>
      <p className="text-gray-600 mb-6">Track your brand's AI visibility over time</p>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : scores.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="pt-6 text-center text-gray-600">
            No scores yet. Get your first AI visibility score!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {scores.map((score) => (
            <Link key={score.id} href={`/results/${score.id}`}>
              <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{score.brand_name}</h3>
                      <p className="text-sm text-gray-500">{score.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{score.score_percentage}%</p>
                      <p className="text-xs text-gray-500">{new Date(score.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
