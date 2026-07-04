'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { scoreApi } from '@/app/_lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const history = await scoreApi.getHistory();
        setScores(history || []);
      } catch (error) {
        console.error('Failed to load scores:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchScores();
    }
  }, [user]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">{"Track your brand's AI visibility"}</p>
      </div>

      {scores.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-center mb-4">No scores yet. Run your first scan to get started.</p>
            <div className="text-center">
              <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {scores.map((score) => (
            <Card key={score.id} className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{score.brand_name}</CardTitle>
                <CardDescription>{score.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600 mb-2">{score.score_percentage}%</p>
                <Button onClick={() => router.push(`/results/${score.id}`)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
