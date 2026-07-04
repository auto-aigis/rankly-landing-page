'use client';

import { useAuth } from '@/app/_lib/hooks';
import { settingsApi } from '@/app/_lib/api';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApiSettingsPage() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const keys = await settingsApi.getKeys();
        setApiKeys(keys || []);
      } catch (error) {
        console.error('Failed to load API keys:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchKeys();
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">API Settings</h1>
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">Manage your API keys here.</p>
          {apiKeys.length === 0 ? (
            <p className="text-gray-600">No API keys configured.</p>
          ) : (
            <div className="space-y-2">
              {apiKeys.map((key, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">{key.service_name}</p>
                  <p className="text-sm text-gray-600">{key.masked_key}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}