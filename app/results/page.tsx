'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { scoreApi } from '@/app/_lib/api';
import type { ScoreRun } from '@/app/_lib/types';

function ResultsContent() {
  const searchParams = useSearchParams();
  const runId = searchParams.get('run_id');
  const [score, setScore] = useState<ScoreRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!runId) {
      setError('No score run found.');
      setLoading(false);
      return;
    }

    const fetchScore = async () => {
      try {
        const data = await scoreApi.get(runId);
        setScore(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load score.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [runId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-center text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error || !score) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error || 'Score not found.'}</p>
            <a
              href="/"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Run New Score
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Your AI Visibility Score</h1>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Score for {score.brand_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-blue-600">
              {score.visibility_score.toFixed(1)}%
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Appears in {score.visibility_score.toFixed(1)}% of AI responses
            </p>
            {score.is_demo_mode && (
              <Badge className="mt-4" variant="outline">
                Demo Mode
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Compared to Competitors</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(score.competitor_scores).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(score.competitor_scores).map(([name, score_val]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span className="text-gray-700">{name}</span>
                    <span className="font-medium text-gray-900">
                      {(score_val as number).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No competitors to compare.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {score.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {idx + 1}
                </div>
                <p className="text-gray-700">{rec}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={() => {
            window.location.href = '/pricing';
          }}
          className="flex-1"
        >
          Track this score over time
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = '/';
          }}
          className="flex-1"
        >
          Run Another Score
        </Button>
      </div>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}