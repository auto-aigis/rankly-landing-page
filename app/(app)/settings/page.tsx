'use client';

import { useEffect, useState } from 'react';
import { settingsApi } from '@/app/_lib/api';
import { ApiKeyStatus } from '@/app/_lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [keys, setKeys] = useState<ApiKeyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [openaiKey, setOpenaiKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi
      .getKeys()
      .then(setKeys)
      .catch(() => setKeys([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveOpenAI = async () => {
    setSaving(true);
    try {
      await settingsApi.updateKey('openai', openaiKey);
      setOpenaiKey('');
      const updated = await settingsApi.getKeys();
      setKeys(updated);
    } catch {}
    setSaving(false);
  };

  const handleSavePerplexity = async () => {
    setSaving(true);
    try {
      await settingsApi.updateKey('perplexity', perplexityKey);
      setPerplexityKey('');
      const updated = await settingsApi.getKeys();
      setKeys(updated);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-600 mb-6">Manage your API keys for scoring</p>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">API Keys</CardTitle>
          <CardDescription>Optional: provide your own OpenAI and Perplexity keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">OpenAI</h3>
            {keys.find((k) => k.service_name === 'openai') ? (
              <p className="text-sm text-gray-600">Key configured: {keys.find((k) => k.service_name === 'openai')?.masked_key}</p>
            ) : (
              <p className="text-sm text-gray-600">No key configured</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="openai-key" className="text-gray-900">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="openai-key"
                  type={showKeys ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="border-gray-300 text-gray-900 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKeys(!showKeys)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSaveOpenAI}
                disabled={saving || !openaiKey}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save OpenAI Key
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900">Perplexity</h3>
            {keys.find((k) => k.service_name === 'perplexity') ? (
              <p className="text-sm text-gray-600">Key configured: {keys.find((k) => k.service_name === 'perplexity')?.masked_key}</p>
            ) : (
              <p className="text-sm text-gray-600">No key configured</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="perplexity-key" className="text-gray-900">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="perplexity-key"
                  type={showKeys ? 'text' : 'password'}
                  placeholder="pplx-..."
                  value={perplexityKey}
                  onChange={(e) => setPerplexityKey(e.target.value)}
                  className="border-gray-300 text-gray-900 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKeys(!showKeys)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSavePerplexity}
                disabled={saving || !perplexityKey}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Perplexity Key
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
