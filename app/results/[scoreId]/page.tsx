'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { scoreApi, paymentApi } from '@/app/_lib/api';
import { VisibilityScore } from '@/app/_lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResultsDisplay } from '../_components/ResultsDisplay';
import { EmailCapture } from '../_components/EmailCapture';
import { UpgradeCTA } from '../_components/UpgradeCTA';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/_lib/hooks';

function ResultsPageContent({ scoreId }: { scoreId: string }) {
  const [score, setScore] = useState<VisibilityScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    scoreApi
      .getById(scoreId)
      .then(setScore)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load score'))
      .finally(() => setLoading(false));
  }, [scoreId]);

  useEffect(() => {
    if (transactionId && user && !checking) {
      setChecking(true);
      paymentApi
        .verifyTransaction(transactionId)
        .then(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('transaction_id');
          url.searchParams.delete('checkout');
          window.history.replaceState({}, '', url.toString());
        })
        .catch(() => {})
        .finally(() => setChecking(false));
    }
  }, [transactionId, user, checking]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-60 rounded-lg" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  if (error || !score) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          {error || 'Score not found'}
          <Button onClick={() => window.location.reload()} variant="link" className="text-red-800 underline">
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <ResultsDisplay score={score} />
      <EmailCapture scoreId={scoreId} />
      <UpgradeCTA scoreId={scoreId} />
    </div>
  );
}

export default function ResultsPage({ params }: { params: Promise<{ scoreId: string }> }) {
  const [scoreId, setScoreId] = useState('');

  useEffect(() => {
    params.then((p) => setScoreId(p.scoreId));
  }, [params]);

  if (!scoreId) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your AI Visibility Score</h1>
      <Suspense fallback={<div className="text-center text-gray-600">Loading results...</div>}>
        <ResultsPageContent scoreId={scoreId} />
      </Suspense>
    </div>
  );
}
