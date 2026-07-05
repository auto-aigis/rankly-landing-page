const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === 'string') msg = d;
      else if (Array.isArray(d))
        msg = d.map((e: any) => e.msg).join(', ');
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

import type {
  User,
  Subscription,
  ScoreRun,
  PricingResponse,
  ApiKey,
} from './types';

export const authApi = {
  register: (email: string, password: string, display_name?: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    }),
  login: (email: string, password: string) =>
    apiFetch<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    apiFetch<{ status: string }>('/api/auth/logout', {
      method: 'POST',
    }),
  me: () => apiFetch<User>('/api/auth/me'),
  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  subscription: () => apiFetch<Subscription>('/api/auth/subscription'),
  resendVerification: (email: string) =>
    apiFetch<{ status: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const scoreApi = {
  run: (
    brand_name: string,
    industry_category: string,
    competitor_names?: string[],
    utm_source?: string,
    utm_medium?: string,
    utm_campaign?: string
  ) =>
    apiFetch<ScoreRun>('/api/score/run', {
      method: 'POST',
      body: JSON.stringify({
        brand_name,
        competitor_names: competitor_names || [],
        industry_category,
        utm_source,
        utm_medium,
        utm_campaign,
      }),
    }),
  get: (run_id: string) => apiFetch<ScoreRun>(`/api/score/${run_id}`),
};

export const pricingApi = {
  get: () => apiFetch<PricingResponse>('/api/pricing'),
};

export const settingsApi = {
  getKeys: () => apiFetch<ApiKey[]>('/api/settings/keys'),
  saveKey: (service_name: 'openai' | 'perplexity', api_key: string) =>
    apiFetch<{ status: string; service_name: string }>('/api/settings/keys', {
      method: 'POST',
      body: JSON.stringify({ service_name, api_key }),
    }),
  deleteKey: (service_name: string) =>
    apiFetch<{ status: string }>(`/api/settings/keys/${service_name}`, {
      method: 'DELETE',
    }),
};

export const paymentsApi = {
  verifyTransaction: (transaction_id: string) =>
    apiFetch<{ status: string; tier: string | null }>(
      '/api/payments/verify-transaction',
      {
        method: 'POST',
        body: JSON.stringify({ transaction_id }),
      }
    ),
};

// Alias for backward compatibility
export const paymentApi = paymentsApi;

// Placeholder APIs for dashboard features (returns empty data)
export const competitorsApi = {
  getAnalysis: () => apiFetch<any>('/api/competitors/analysis'),
};

export const gapsApi = {
  getGaps: () => apiFetch<any>('/api/gaps'),
};

export const reportsApi = {
  getReports: () => apiFetch<any>('/api/reports'),
};

export const analyticsApi = {
  getAnalytics: () => apiFetch<any>('/api/analytics'),
};
