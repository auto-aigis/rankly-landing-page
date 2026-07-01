"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { settingsApi } from '../../_lib/api';
import { SettingsData } from '../../_lib/types';
import { Loader2, Save, Key, AlertCircle, Check } from 'lucide-react';

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [competitors, setCompetitors] = useState<string[]>(['']);
  const [openaiKey, setOpenaiKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsApi.get();
      setData(settings);
      setDisplayName(settings.user.display_name || '');
      setBrandName(settings.brands[0]?.name || '');
      setWebsiteUrl(settings.brands[0]?.website_url || '');
      setCompetitors(settings.competitors.length > 0 ? settings.competitors.map((c) => c.name) : ['']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await settingsApi.update({
        display_name: displayName || undefined,
        brand_name: brandName || undefined,
        website_url: websiteUrl || undefined,
        competitors: competitors.filter((c) => c.trim()),
        openai_api_key: openaiKey || undefined,
        perplexity_api_key: perplexityKey || undefined,
      });
      setSuccess(true);
      setOpenaiKey('');
      setPerplexityKey('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateCompetitor = (index: number, value: string) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  const addCompetitor = () => setCompetitors([...competitors, '']);
  const removeCompetitor = (index: number) => setCompetitors(competitors.filter((_, i) => i !== index));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          Settings saved successfully!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={data?.user.email || ''} disabled className="bg-gray-50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
          <CardDescription>Your primary brand information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input id="websiteUrl" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://acme.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competitors</CardTitle>
          <CardDescription>Brands you want to track against</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {competitors.map((comp, i) => (
            <div key={i} className="flex gap-2">
              <Input value={comp} onChange={(e) => updateCompetitor(i, e.target.value)} placeholder={`Competitor ${i + 1}`} />
              {competitors.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeCompetitor(i)}>×</Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addCompetitor}>+ Add Competitor</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Keys
          </CardTitle>
          <CardDescription>Add your own API keys for query simulation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openaiKey">OpenAI API Key</Label>
            <Input
              id="openaiKey"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder={data?.openai_api_key_set ? '••••••••' : 'sk-...'}
            />
            {data?.openai_api_key_set && <p className="text-xs text-gray-500">Already set - leave blank to keep</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="perplexityKey">Perplexity API Key</Label>
            <Input
              id="perplexityKey"
              type="password"
              value={perplexityKey}
              onChange={(e) => setPerplexityKey(e.target.value)}
              placeholder={data?.perplexity_api_key_set ? '••••••••' : 'pplx-...'}
            />
            {data?.perplexity_api_key_set && <p className="text-xs text-gray-500">Already set - leave blank to keep</p>}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Changes
      </Button>
    </div>
  );
}
