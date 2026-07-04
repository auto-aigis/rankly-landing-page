'use client';

import { useAuth } from '@/app/_lib/hooks';
import { reportsApi } from '@/app/_lib/api';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VisibilityPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const visData = await reportsApi.getVisibility();
        setData(visData);
      } catch (error) {
        console.error('Failed to load visibility data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVisibility();
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Visibility Report</h1>
      {data ? (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Your AI Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Your visibility metrics will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-600">No visibility data available.</p>
      )}
    </div>
  );
}