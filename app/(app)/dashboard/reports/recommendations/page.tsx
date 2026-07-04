'use client';

import { useAuth } from '@/app/_lib/hooks';
import { reportsApi } from '@/app/_lib/api';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await reportsApi.getRecommendations();
        setRecommendations(data || []);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Recommendations</h1>
      {recommendations.length === 0 ? (
        <p className="text-gray-600">No recommendations available yet.</p>
      ) : (
        <div className="grid gap-4">
          {recommendations.map((rec, idx) => (
            <Card key={idx} className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{rec.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{rec.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}