'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { scoreApi } from '@/app/_lib/api';
import type { ScoreRun } from '@/app/_lib/types';

export default function Results() {
  const router = useRouter();
  const { user } = useAuth();
  const [runs, setRuns] = useState<ScoreRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?message=Please%20log%20in%20to%20view%20your%20scores');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    // In a real app, we would load runs from an API
    setLoading(false);
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Scores</h1>
        <Link href="/" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Run New Score
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : runs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              No scores yet.{' '}
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-700">
                Run your first score
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {runs.map((run) => (
            <Card key={run.id} className="cursor-pointer hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{run.brand_name}</CardTitle>
                    <p className="mt-2 text-sm text-gray-600">{run.industry_category}</p>
                  </div>
                  <Badge variant="secondary">{run.visibility_score}% Visibility</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Competitors: {run.competitor_names.join(', ')}</p>
                <p className="mt-2 text-sm text-gray-500">Ran on {new Date(run.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
