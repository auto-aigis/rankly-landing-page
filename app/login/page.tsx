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
import { useAuth } from '@/app/_lib/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unverified, setUnverified] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnverified(false);
    setLoading(true);

    try {
      await authApi.login(email, password);
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg === 'email_not_verified') {
        setUnverified(true);
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendVerification(email);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Sign In</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {unverified && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  Please verify your email first.
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={handleResend}
                    className="text-yellow-800 underline p-0 h-auto"
                  >
                    Resend verification email
                  </Button>
                  {resendSent && <span className="text-green-600 text-sm block mt-1">Email sent!</span>}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
