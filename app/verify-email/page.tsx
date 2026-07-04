'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState('');
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (token) {
      authApi
        .verifyEmail(token)
        .then(async () => {
          await refresh();
          router.push('/dashboard');
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Verification failed');
          setLoading(false);
        });
    }
  }, [token, router, refresh]);

  const handleResend = async () => {
    if (!email) return;
    try {
      await authApi.resendVerification(email);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch {}
  };

  if (token) {
    if (loading && !error) {
      return (
        <Card className="w-full max-w-md border-gray-200">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-700">Verifying your email...</p>
          </CardContent>
        </Card>
      );
    }
    if (error) {
      return (
        <Card className="w-full max-w-md border-gray-200">
          <CardHeader>
            <CardTitle className="text-red-600">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert><AlertDescription className="text-red-600">{error}</AlertDescription></Alert>
            <Link href="/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }
  }

  return (
    <Card className="w-full max-w-md border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Check Your Email</CardTitle>
        <CardDescription>We sent a verification link to {email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Click the link in your email to verify your account and log in.</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Resend Verification Email
        </Button>
        {resendSent && <p className="text-sm text-green-600 text-center">Email sent!</p>}
        <Link href="/login">
          <Button variant="outline" className="w-full text-gray-700 border-gray-300 hover:bg-gray-50">
            Back to Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
