'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/app/_lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.register(email, password, displayName);
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Create Account</CardTitle>
          <CardDescription>Sign up to start tracking your AI visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900">Display Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 text-gray-900"
              />
            </div>

            {error && <Alert><AlertDescription className="text-red-600">{error}</AlertDescription></Alert>}

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
