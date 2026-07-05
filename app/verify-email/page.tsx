'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';

function VerifyEmailContent() {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      setLoading(true);
      authApi
        .verifyEmail(token)
        .then(async () => {
          await refresh();
          router.push('/dashboard');
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : 'Verification failed.'
          );
        })
        .finally(() => setLoading(false));
    }
  }, [token, router, refresh]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setMessage('Email sent! Check your inbox.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to resend verification.'
      );
    } finally {
      setResending(false);
    }
  };

  if (token && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifying Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (token && error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verification Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <p className="mt-4 text-sm text-gray-600">
              The verification link may have expired. Please request a new one.
            </p>
            <Button
              onClick={handleResend}
              disabled={resending}
              className="mt-4 w-full"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Check your inbox — we sent a verification link to <strong>{email}</strong>.
          </p>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-2">
            <Button
              onClick={handleResend}
              disabled={resending}
              variant="outline"
              className="w-full"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <a
              href="/login"
              className="block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}