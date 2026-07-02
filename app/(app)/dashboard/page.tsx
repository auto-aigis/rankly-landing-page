"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { coreApi, paddleApi, authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { DashboardData, TIER_LIMITS } from '@/app/_lib/types';
import { TrendingUp, MessageCircle, FileText, Clock, Check, X, Zap } from 'lucide-react';
import Link from 'next/link';

function ScoreRing({ score }: { score: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle cx="64" cy="64" r={radius} stroke="#4f46e5" strokeWidth="8" fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-600">AI Visibility</span>
    </div>
  );
}

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refresh } = useAuth();
  const checkoutSuccess = searchParams.get('checkout') === 'success';
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    if (checkoutSuccess && transactionId) {
      paddleApi.verifyTransaction(transactionId)
        .then(() => refresh())
        .then(() => router.replace('/dashboard'))
        .catch(() => {
          let attempts = 0;
          const poll = async () => {
            try {
              const sub = await authApi.subscription();
              if (sub.tier !== 'free') { await refresh(); router.replace('/dashboard'); return; }
            } catch {}
            if (++attempts < 20) setTimeout(poll, 2000);
          };
          poll();
        });
    } else {
      coreApi.getDashboard()
        .then(setData)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
        .finally(() => setLoading(false));
    }
  }, [checkoutSuccess, transactionId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  if (error) return <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  const limits = TIER_LIMITS[user?.tier || 'free'];

  return (
    <div className="space-y-6">
      {checkoutSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <Check className="w-5 h-5" /> Payment processing&hellip; please wait.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI Visibility Dashboard</h1>
          <p className="text-gray-600">Track your brand&apos;s presence in AI-powered search</p>
        </div>
        {user?.tier === 'free' && (
          <Link href="/pricing"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            <Zap className="w-4 h-4" /> Upgrade
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">AI Visibility Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <ScoreRing score={data?.visibility_score || 0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Answer Frequency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">ChatGPT</span>
              </div>
              <span className="font-semibold text-gray-900">{data?.answer_frequency.chatgpt || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data?.answer_frequency.chatgpt || 0}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Perplexity</span>
              </div>
              <span className="font-semibold text-gray-900">{data?.answer_frequency.perplexity || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data?.answer_frequency.perplexity || 0}%` }} />
            </div>
          </CardContent>
        </Card>

        {limits.has_competitor_comparison && data?.citation_share && Object.keys(data.citation_share).length > 0 ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Competitor Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(data.citation_share).map(([name, share]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{name}</span>
                    <span className="text-gray-500">{share}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${share}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-indigo-200">
            <CardContent className="flex flex-col items-center justify-center h-full py-8 text-center">
              <Zap className="w-8 h-8 text-indigo-400 mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">Unlock Competitor Insights</p>
              <p className="text-xs text-gray-500 mb-3">See how you rank vs. competitors</p>
              <Link href="/pricing" className="text-sm font-medium text-indigo-600 hover:underline">View plans →</Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent AI Answers</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recent_feed && data.recent_feed.length > 0 ? (
            <div className="space-y-3">
              {data.recent_feed.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.appeared ? 'bg-green-100' : 'bg-red-100'}`}>
                    {item.appeared ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.query}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="capitalize">{item.engine}</span>
                      <span>•</span>
                      <span>{item.cited_urls.length} sources</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No query results yet.</p>
              <p className="text-sm text-gray-400">Add queries to start tracking your AI visibility.</p>
              <Link href="/dashboard/queries" className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline">Add queries →</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
