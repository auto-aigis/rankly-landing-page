"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { scanApi } from '../_lib/api';
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';

export default function HeroScanForm() {
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) { setError('Please enter your brand name'); return; }
    setError('');
    setLoading(true);
    setProgress(10);
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 5, 90));
    }, 1500);
    try {
      const result = await scanApi.run(brandName.trim(), category.trim() || undefined);
      clearInterval(progressInterval);
      setProgress(100);
      router.push(`/score?id=${result.scan_id}&brand=${encodeURIComponent(result.brand_name)}`);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Scan failed. Please try again.');
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Your brand name (e.g. Acme Inc)"
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !brandName.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          {loading ? 'Scanning...' : 'Get My Score'}
        </button>
      </div>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category / industry (optional — e.g. CRM, HR software)"
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Querying AI engines across 15 prompts&hellip; this takes ~30 seconds
          </p>
        </div>
      )}
    </form>
  );
}
