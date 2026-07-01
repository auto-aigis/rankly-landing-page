"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { coreApi } from '../../_lib/api';
import { useAuth } from '../../_components/AuthProvider';
import { TIER_LIMITS, Query } from '../../_lib/types';
import { Plus, Trash2, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

export default function QueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [newQuery, setNewQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const { user } = useAuth();

  const limits = TIER_LIMITS[user?.tier || 'free'];
  const canRefresh = user?.tier !== 'free';

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    try {
      const data = await coreApi.getQueries();
      setQueries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load queries');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newQuery.trim()) return;
    if (queries.length >= limits.max_queries) {
      setError(`Query limit reached (${limits.max_queries}). Upgrade to add more.`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const created = await coreApi.addQuery(newQuery);
      setQueries([...queries, created]);
      setNewQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add query');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await coreApi.deleteQuery(id);
      setQueries(queries.filter((q) => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleRefresh = async (id: string) => {
    if (!canRefresh) return;
    setRefreshingId(id);
    try {
      await coreApi.refreshQuery(id);
      await loadQueries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setRefreshingId(null);
    }
  };

  const handleExport = async () => {
    if (!limits.has_csv_export) {
      setError('CSV export available on Professional plan and above');
      return;
    }
    setError('');
    // CSV export would be called here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tracked Queries</h1>
          <p className="text-gray-600">Add and manage the queries you want to track</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {queries.length} / {limits.max_queries} queries
          </Badge>
          {limits.has_csv_export && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Query</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="e.g., best CRM for nonprofits"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={submitting || !newQuery.trim()}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Queries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : queries.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No queries yet. Add your first query above.</p>
          ) : (
            <div className="space-y-2">
              {queries.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{q.query_text}</span>
                  <div className="flex items-center gap-2">
                    {q.last_run && (
                      <span className="text-xs text-gray-500">
                        Last run: {new Date(q.last_run).toLocaleDateString()}
                      </span>
                    )}
                    {canRefresh && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRefresh(q.id)}
                        disabled={refreshingId === q.id}
                      >
                        {refreshingId === q.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
