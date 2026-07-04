'use client';

import { useState } from 'react';
import { scoreApi } from '@/app/_lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function EmailCapture({ scoreId }: { scoreId: string }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await scoreApi.captureEmail(scoreId, email);
      setSent(true);
      setEmail('');
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Get Full Report</CardTitle>
        <CardDescription>Email your complete visibility report</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 text-gray-900 flex-1"
          />
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            Send
          </Button>
        </form>
        {sent && <p className="text-sm text-green-600 mt-2">Report sent to {email}!</p>}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}
