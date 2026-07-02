"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { coreApi, scanApi } from '../_lib/api';
import { useAuth } from '../_components/AuthProvider';

const steps = [
  { num: 1, title: 'Brand Name', desc: 'Tell us your brand' },
  { num: 2, title: 'Website', desc: 'Your primary website' },
  { num: 3, title: 'Competitors', desc: 'Who you compete with' },
];

function OnboardingContent() {
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [competitors, setCompetitors] = useState<string[]>(['', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get('scan_id');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.onboarding_complete) router.push('/dashboard');
  }, [user, router]);

  // Pre-fill from scan if available
  useEffect(() => {
    if (scanId) {
      scanApi.get(scanId).then((scan) => {
        setBrandName(scan.brand_name);
        if (scan.competitor_scores?.length) {
          setCompetitors([
            scan.competitor_scores[0]?.name || '',
            scan.competitor_scores[1]?.name || '',
            scan.competitor_scores[2]?.name || '',
          ]);
        }
      }).catch(() => {});
    }
  }, [scanId]);

  const addCompetitor = () => { if (competitors.length < 5) setCompetitors([...competitors, '']); };
  const removeCompetitor = (i: number) => { if (competitors.length > 1) setCompetitors(competitors.filter((_, idx) => idx !== i)); };
  const updateCompetitor = (i: number, val: string) => { const u = [...competitors]; u[i] = val; setCompetitors(u); };

  const handleNext = () => {
    if (step === 1 && !brandName.trim()) { setError('Please enter your brand name'); return; }
    if (step === 2 && !websiteUrl.trim()) { setError('Please enter your website URL'); return; }
    if (step === 2 && !websiteUrl.match(/^https?:\/\/.+/)) { setError('Please enter a valid URL (include https://)'); return; }
    setError('');
    if (step < 3) setStep(step + 1); else handleSubmit();
  };

  const handleSubmit = async () => {
    const valid = competitors.filter((c) => c.trim());
    if (valid.length < 3) { setError('Please add at least 3 competitors'); return; }
    setLoading(true);
    try {
      await coreApi.completeOnboarding(brandName, websiteUrl, valid);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Rankly</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            {steps.map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s.num ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{s.num}</div>
                <span className={`text-sm hidden sm:block ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.title}</span>
                {s.num < 3 && <div className="w-6 h-px bg-gray-300" />}
              </div>
            ))}
          </div>
          <CardDescription className="text-center mt-2">Step {step}: {steps[step - 1].desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="brand">Your Brand Name</Label>
              <Input id="brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Acme Inc." autoFocus />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://acme.com" />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <Label>Competitors (3&ndash;5)</Label>
              {competitors.map((comp, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={comp} onChange={(e) => updateCompetitor(i, e.target.value)} placeholder={`Competitor ${i + 1}`} />
                  {competitors.length > 3 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCompetitor(i)}>×</Button>
                  )}
                </div>
              ))}
              {competitors.length < 5 && (
                <Button type="button" variant="outline" onClick={addCompetitor} className="w-full">+ Add Competitor</Button>
              )}
            </div>
          )}
          <Button onClick={handleNext} className="w-full" disabled={loading}>
            {loading ? 'Saving...' : step < 3 ? 'Next →' : 'Complete Setup'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
