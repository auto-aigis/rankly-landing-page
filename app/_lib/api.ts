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
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name: displayName }),
    }),
  login: (email: string, password: string) =>
    apiFetch<any>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => apiFetch<{ status: string }>('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch<any>('/api/auth/me'),
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
  getSubscription: () => apiFetch<any>('/api/auth/subscription'),
};

export const scoreApi = {
  submit: (brandName: string, websiteUrl?: string, category?: string, competitorName?: string) =>
    apiFetch<any>('/api/score', {
      method: 'POST',
      body: JSON.stringify({ brand_name: brandName, website_url: websiteUrl, category, competitor_name: competitorName }),
    }),
  getById: (scoreId: string) => apiFetch<any>(`/api/score/${scoreId}`),
  captureEmail: (scoreId: string, email: string) =>
    apiFetch<{ status: string }>(`/api/score/${scoreId}/email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  getHistory: () => apiFetch<any[]>('/api/scores/history'),
};

export const settingsApi = {
  getKeys: () => apiFetch<any[]>('/api/settings/keys'),
  updateKey: (serviceName: 'openai' | 'perplexity', apiKey: string) =>
    apiFetch<{ status: string }>(`/api/settings/keys/${serviceName}`, {
      method: 'PUT',
      body: JSON.stringify({ api_key: apiKey }),
    }),
  deleteKey: (serviceName: 'openai' | 'perplexity') =>
    apiFetch<{ status: string }>(`/api/settings/keys/${serviceName}`, { method: 'DELETE' }),
};

export const paymentApi = {
  verifyTransaction: (transactionId: string) =>
    apiFetch<any>('/api/payments/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    }),
};

export const analyticsApi = {
  recordEvent: (eventName: string, scoreId?: string) =>
    apiFetch<{ status: string }>('/api/events', {
      method: 'POST',
      body: JSON.stringify({ event_name: eventName, score_id: scoreId }),
    }),
};

export const scanApi = {
  scan: (brandName: string, websiteUrl?: string) =>
    apiFetch<any>('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ brand_name: brandName, website_url: websiteUrl }),
    }),
  getStatus: (scanId: string) => apiFetch<any>(`/api/scan/${scanId}`),
};

export const coreApi = {
  getCore: () => apiFetch<any>('/api/core'),
  submitCore: (data: any) =>
    apiFetch<any>('/api/core', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
