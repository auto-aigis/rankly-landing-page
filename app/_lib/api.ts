import { Tier, BillingInterval, DashboardData, Query, VisibilityReportItem, CitationReportItem, CompetitorReportItem, GapReportItem, Recommendation, TeamMember, SettingsData, CheckoutResponse, ApiKeyResponse, Subscription, ScanResult } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === 'string') msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(', ');
      else if (err.error) msg = err.error;
      else if (err.message) msg = err.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, scan_id?: string, utm_source?: string, utm_medium?: string, utm_campaign?: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, scan_id, utm_source, utm_medium, utm_campaign }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ id: string; email: string; display_name: string | null; onboarding_complete: boolean; tier: Tier; created_at: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiFetch<{ status: string }>('/api/auth/logout', { method: 'POST' }),

  me: () => apiFetch<{ id: string; email: string; display_name: string | null; onboarding_complete: boolean; tier: Tier; created_at: string }>('/api/auth/me'),

  subscription: () => apiFetch<Subscription>('/api/auth/subscription'),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const scanApi = {
  run: (brandName: string, category?: string) =>
    apiFetch<ScanResult>('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ brand_name: brandName, category }),
    }),

  get: (scanId: string) => apiFetch<ScanResult>(`/api/scan/${scanId}`),
};

export const coreApi = {
  completeOnboarding: (brandName: string, websiteUrl: string, competitors: string[]) =>
    apiFetch<{ status: string }>('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify({ brand_name: brandName, website_url: websiteUrl, competitors }),
    }),

  getDashboard: () => apiFetch<DashboardData>('/api/dashboard'),

  getQueries: () => apiFetch<Query[]>('/api/queries'),

  addQuery: (queryText: string) =>
    apiFetch<Query>('/api/queries', {
      method: 'POST',
      body: JSON.stringify({ query_text: queryText }),
    }),

  deleteQuery: (queryId: string) =>
    apiFetch<{ status: string }>(`/api/queries/${queryId}`, { method: 'DELETE' }),

  refreshQuery: (queryId: string) =>
    apiFetch<{ status: string }>(`/api/queries/${queryId}/refresh`, { method: 'POST' }),
};

export const reportsApi = {
  getVisibility: () => apiFetch<VisibilityReportItem[]>('/api/reports/visibility'),
  getCitations: () => apiFetch<CitationReportItem[]>('/api/reports/citations'),
  getCompetitors: () => apiFetch<CompetitorReportItem[]>('/api/reports/competitors'),
  getGaps: () => apiFetch<GapReportItem[]>('/api/reports/gaps'),
  getRecommendations: () => apiFetch<Recommendation[]>('/api/reports/recommendations'),
  generateRecommendation: (queryId: string) =>
    apiFetch<{ status: string }>(`/api/reports/recommendations/generate?query_id=${queryId}`, { method: 'POST' }),
  exportCsv: (reportType: string) => apiFetch<{ csv_data: string }>(`/api/reports/export/csv?type=${reportType}`),
};

export const settingsApi = {
  get: () => apiFetch<SettingsData>('/api/settings'),

  update: (data: {
    display_name?: string;
    brand_name?: string;
    website_url?: string;
    competitors?: string[];
    openai_api_key?: string;
    perplexity_api_key?: string;
  }) => apiFetch<{ status: string }>('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),

  getTeam: () => apiFetch<TeamMember[]>('/api/settings/team'),

  inviteTeamMember: (email: string) =>
    apiFetch<{ status: string }>('/api/settings/team/invite', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  removeTeamMember: (memberId: string) =>
    apiFetch<{ status: string }>(`/api/settings/team/${memberId}`, { method: 'DELETE' }),

  generateApiKey: () => apiFetch<ApiKeyResponse>('/api/settings/api-key', { method: 'POST' }),

  getBilling: () =>
    apiFetch<{
      tier: Tier;
      status: string;
      current_period_end: string | null;
      price_id: string | null;
    }>('/api/settings/billing'),
};

export const paddleApi = {
  checkout: (tier: Tier, billingInterval: BillingInterval) =>
    apiFetch<CheckoutResponse>('/api/paddle/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),

  verifyTransaction: (transactionId: string) =>
    apiFetch<{ status: string; tier: string }>('/api/paddle/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    }),

  getSubscription: () => apiFetch<Subscription>('/api/paddle/subscription'),
};
