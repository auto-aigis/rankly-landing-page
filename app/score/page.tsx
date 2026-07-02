"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { scanApi } from '@/app/_lib/api';
import { ScanResult } from '@/app/_lib/types';
import { TrendingUp, ArrowRight, Check, Zap, Users, Lightbulb, Star } from 'lucide-react';
import Link from 'next/link';

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 30 ? '#16a34a' : score >= 15 ? '#f59e0b' : '#ef4444';
  const label = score >= 30 ? 'Strong' : score >= 15 ? 'Moderate' : 'Low';
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="none" />
          <circle cx="80" cy="80" r={radius} stroke={color} strokeWidth="12" fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black" style={{ color }}>{score}%</span>
          <span className="text-sm font-medium text-gray-500">{label}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600 text-center">of AI answers mention your brand</p>
    </div>
  );
}

function ScorePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scanId = searchParams.get('id');
  const brandName = searchParams.get('brand');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!scanId) { router.replace('/'); return; }
    scanApi.get(scanId)
      .then(setResult)
      .catch(() => setError('Could not load results. The scan may have expired.'))
      .finally(() => setLoading(false));
  }, [scanId]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Analyzing AI responses&hellip;</p>
        <p className="text-sm text-gray-400 mt-1">Querying 15 AI prompts across ChatGPT</p>
      </div>
    </div>
  );

  if (error || !result) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-red-600 mb-4">{error || 'Results not found.'}</p>
        <Link href="/" className="text-indigo-600 hover:underline">Try again</Link>
      </div>
    </div>
  );

  const registerUrl = `/register?scan_id=${result.scan_id}&brand=${encodeURIComponent(result.brand_name)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Rankly</span>
          </Link>
          <Link href={registerUrl}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Save My Score <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Score hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide mb-2">AI Visibility Report</p>
          <h1 className="text-3xl font-black text-gray-900 mb-1">{result.brand_name}</h1>
          {result.category && <p className="text-gray-500 mb-6">{result.category}</p>}
          <div className="flex justify-center mb-6">
            <ScoreGauge score={Math.round(result.score)} />
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>{result.prompts_matched} of {result.prompts_used} prompts matched</span>
            </div>
          </div>
        </div>

        {/* Competitor comparison */}
        {result.competitor_scores && result.competitor_scores.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Competitor Comparison</h2>
            </div>
            <div className="space-y-4">
              {/* User brand row */}
              <div className="flex items-center gap-4">
                <span className="w-32 text-sm font-semibold text-indigo-700 truncate">{result.brand_name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${Math.min(result.score, 100)}%` }} />
                </div>
                <span className="w-12 text-sm font-bold text-indigo-700 text-right">{Math.round(result.score)}%</span>
              </div>
              {result.competitor_scores.map((comp) => (
                <div key={comp.name} className="flex items-center gap-4">
                  <span className="w-32 text-sm text-gray-600 truncate">{comp.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-full transition-all"
                      style={{ width: `${Math.min(comp.score, 100)}%` }} />
                  </div>
                  <span className="w-12 text-sm text-gray-600 text-right">{Math.round(comp.score)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">Top Content Recommendations</h2>
            </div>
            <div className="space-y-4">
              {result.recommendations.slice(0, 3).map((rec, i) => (
                <div key={i} className="flex gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{rec.action}</p>
                    <p className="text-xs text-green-700 font-semibold mt-1">{rec.estimated_lift}</p>
                    {rec.topic && <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-1 inline-block">{rec.topic}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <Star className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
          <h2 className="text-2xl font-black mb-2">Save your score &amp; track progress</h2>
          <p className="text-indigo-200 mb-6">Create a free account to monitor your AI visibility over time and get weekly updates.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={registerUrl}
              className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
              Create Free Account
            </Link>
            <Link href="/pricing"
              className="px-8 py-3 border border-indigo-400 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
              View Paid Plans
            </Link>
          </div>
          <p className="text-xs text-indigo-300 mt-4">No credit card required &bull; Free forever</p>
        </div>
      </main>
    </div>
  );
}

export default function ScorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    }>
      <ScorePageContent />
    </Suspense>
  );
}
