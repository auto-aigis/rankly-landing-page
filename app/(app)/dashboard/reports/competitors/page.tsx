'use client';

import { useAuth } from '@/app/_lib/hooks';
import { competitorsApi } from '@/app/_lib/api';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompetitorsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const report = await competitorsApi.getReport();
        setData(report);
      } catch (error) {
        console.error('Failed to load competitors report:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCompetitors();
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Competitors Report</h1>
      {data ? (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Competitor Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Your competitor analysis will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-600">No competitor data available yet.</p>
      )}
    </div>
  );
}