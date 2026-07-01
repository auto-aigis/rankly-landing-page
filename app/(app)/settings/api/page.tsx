"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { settingsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { ApiKeyResponse, TIER_LIMITS } from '@/app/_lib/types';
import { Lock, Key, Loader2, Copy, Check, AlertCircle } from 'lucide-react';

export default function APIPage() {
  const [apiKey, setApiKey] = useState<ApiKeyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const tier = user?.tier || 'free';
  const hasAccess = tier === 'business';

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const key = await settingsApi.generateApiKey();
      setApiKey(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (apiKey?.key) {
      navigator.clipboard.writeText(apiKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">API Access</h1>
          <p className="text-gray-600">Get API keys for external integrations</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Business Tier Required</h3>
            <p className="text-gray-600 mb-4">This feature is available on Business plan</p>
            <a href="/pricing" className="text-indigo-600 font-medium hover:underline">View plans</a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">API Access</h1>
        <p className="text-gray-600">Generate API keys for external integrations</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Your API Key
          </CardTitle>
          <CardDescription>Use this key to authenticate API requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKey ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm font-mono text-gray-900 truncate">{apiKey.key}</code>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Created: {new Date(apiKey.created_at).toLocaleString()}
              </p>
              <Button variant="outline" onClick={handleGenerate} disabled={generating}>
                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Regenerate Key
              </Button>
            </>
          ) : (
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
              Generate API Key
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-gray-600">Available endpoints:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>GET /api/v1/visibility - Get visibility scores</li>
            <li>GET /api/v1/queries - Get query results</li>
            <li>GET /api/v1/citations - Get citation data</li>
          </ul>
          <p className="text-gray-500 mt-4">
            Include the header <code className="bg-gray-100 px-1">X-API-Key: your-key</code> with all requests.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
