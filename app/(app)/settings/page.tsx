'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { settingsApi } from '@/app/_lib/api';
import type { ApiKey } from '@/app/_lib/types';

export default function Settings() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [openaiKey, setOpenaiKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi
      .getKeys()
      .then((data) => {
        setKeys(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveOpenAI = async () => {
    if (!openaiKey) return;
    setSaving(true);
    try {
      await settingsApi.saveKey('openai', openaiKey);
      setSaved(true);
      setOpenaiKey('');
      setTimeout(() => setSaved(false), 3000);
      const data = await settingsApi.getKeys();
      setKeys(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePerplexity = async () => {
    if (!perplexityKey) return;
    setSaving(true);
    try {
      await settingsApi.saveKey('perplexity', perplexityKey);
      setSaved(true);
      setPerplexityKey('');
      setTimeout(() => setSaved(false), 3000);
      const data = await settingsApi.getKeys();
      setKeys(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">OpenAI API Key</h3>
                <p className="text-sm text-gray-600">
                  {keys.find((k) => k.service_name === 'openai')
                    ? `Saved: ${keys.find((k) => k.service_name === 'openai')?.api_key_masked}`
                    : 'No key saved'}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter OpenAI API key"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                  />
                  <Button
                    onClick={handleSaveOpenAI}
                    disabled={!openaiKey || saving}
                    className="whitespace-nowrap"
                  >
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Perplexity API Key</h3>
                <p className="text-sm text-gray-600">
                  {keys.find((k) => k.service_name === 'perplexity')
                    ? `Saved: ${keys.find((k) => k.service_name === 'perplexity')?.api_key_masked}`
                    : 'No key saved'}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter Perplexity API key"
                    value={perplexityKey}
                    onChange={(e) => setPerplexityKey(e.target.value)}
                  />
                  <Button
                    onClick={handleSavePerplexity}
                    disabled={!perplexityKey || saving}
                    className="whitespace-nowrap"
                  >
                    Save
                  </Button>
                </div>
              </div>

              {saved && (
                <p className="text-sm text-green-600">✓ API key saved successfully</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}