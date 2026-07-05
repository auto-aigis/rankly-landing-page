'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { scoreApi } from '@/app/_lib/api';

const industries = [
  'SaaS',
  'E-commerce',
  'Marketing',
  'Analytics',
  'CRM',
  'HR Tech',
  'Project Management',
  'Design Tools',
  'Development',
  'Other',
];

export default function ScoreForm() {
  const [brand, setBrand] = useState('');
  const [competitor1, setCompetitor1] = useState('');
  const [competitor2, setCompetitor2] = useState('');
  const [industry, setIndustry] = useState('SaaS');
  const [customIndustry, setCustomIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!brand.trim()) {
      setError('Brand name is required.');
      return;
    }

    setLoading(true);
    try {
      const finalIndustry = industry === 'Other' ? customIndustry : industry;
      const competitors = [
        competitor1.trim(),
        competitor2.trim(),
      ].filter((c) => c);

      const utmSource = searchParams.get('utm_source') || undefined;
      const utmMedium = searchParams.get('utm_medium') || undefined;
      const utmCampaign = searchParams.get('utm_campaign') || undefined;

      const result = await scoreApi.run(
        brand.trim(),
        finalIndustry,
        competitors,
        utmSource,
        utmMedium,
        utmCampaign
      );

      router.push(`/results?run_id=${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Score run failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Your AI Visibility Score</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Your Brand Name *</Label>
            <Input
              id="brand"
              type="text"
              placeholder="e.g., Slack"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitor1">Competitor 1 (Optional)</Label>
            <Input
              id="competitor1"
              type="text"
              placeholder="e.g., Microsoft Teams"
              value={competitor1}
              onChange={(e) => setCompetitor1(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitor2">Competitor 2 (Optional)</Label>
            <Input
              id="competitor2"
              type="text"
              placeholder="e.g., Discord"
              value={competitor2}
              onChange={(e) => setCompetitor2(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry / Category</Label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {industry === 'Other' && (
            <div className="space-y-2">
              <Label htmlFor="customIndustry">Specify Your Industry</Label>
              <Input
                id="customIndustry"
                type="text"
                placeholder="e.g., Cryptocurrency"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Calculating... (this may take a moment)' : 'Calculate Score'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}