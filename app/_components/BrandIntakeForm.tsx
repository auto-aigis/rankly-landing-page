'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { scoreApi, analyticsApi } from '@/app/_lib/api';

export function BrandIntakeForm() {
  const router = useRouter();
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      setError('Brand name is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await scoreApi.submit(brandName, websiteUrl || undefined, category || undefined);
      await analyticsApi.recordEvent('form_submitted', result.id);
      router.push(`/results/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto border-gray-200">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-700">Querying ChatGPT and Perplexity...</p>
          <p className="text-sm text-gray-500 mt-2">This takes ~60 seconds</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">AI Visibility Score</CardTitle>
        <CardDescription>See how often AI tools mention your brand</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name" className="text-gray-900">Brand Name *</Label>
            <Input
              id="brand-name"
              placeholder="e.g., Slack"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="border-gray-300 text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-url" className="text-gray-900">Website URL</Label>
            <Input
              id="website-url"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="border-gray-300 text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-900">Industry</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-gray-300 text-gray-900">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="B2B Services">B2B Services</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Get My AI Visibility Score — Free
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
