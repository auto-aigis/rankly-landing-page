'use client';

import { useAuth } from '@/app/_lib/hooks';
import { gapsApi } from '@/app/_lib/api';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GapsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const report = await gapsApi.getReport();
        setData(report);
      } catch (error) {
        console.error('Failed to load gaps report:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchGaps();
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Visibility Gaps</h1>
      {data ? (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Your visibility gaps will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-600">No gap data available yet.</p>
      )}
    </div>
  );
}