'use client';

import { useAuth } from '@/app/_lib/hooks';
import { queriesApi } from '@/app/_lib/api';
import { TIER_LIMITS, Query } from '@/app/_lib/types';
import { useEffect, useState } from 'react';
import { Plus, Trash2, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QueriesPage() {
  const { user } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const data = await queriesApi.getAll();
        setQueries(data || []);
      } catch (error) {
        console.error('Failed to load queries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQueries();
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Queries</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Query
        </Button>
      </div>
      {queries.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-center">No queries yet. Create your first query to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <Card key={query.id} className="border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-gray-900">{query.query}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Results: {query.results.length}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}