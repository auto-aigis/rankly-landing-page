export interface User {
  id: string;
  email: string;
  display_name: string | null;
  is_email_verified: boolean;
  created_at: string;
}

export interface Subscription {
  status: 'inactive' | 'active' | 'canceled';
  tier: 'starter' | 'professional' | null;
  paddle_subscription_id: string | null;
  current_period_end: string | null;
}

export interface ScoreRun {
  id: string;
  brand_name: string;
  competitor_names: string[];
  industry_category: string;
  visibility_score: number;
  competitor_scores: Record<string, number>;
  recommendations: string[];
  is_demo_mode: boolean;
  created_at: string;
}

export interface PricingTier {
  name: string;
  price: number;
  billing_interval: string;
  paddle_price_id: string;
  features: string[];
}

export interface PricingResponse {
  tiers: PricingTier[];
}

export interface ApiKey {
  service_name: 'openai' | 'perplexity';
  api_key_masked: string;
}

export interface DashboardData {
  id?: string;
  name?: string;
  value?: number;
  description?: string;
  [key: string]: any;
}

export interface Query {
  id: string;
  user_id: string;
  content: string;
  results?: any[];
  created_at: string;
}

export const TIER_LIMITS = {
  starter: {
    queries_per_month: 100,
    max_competitors: 5,
    export_formats: ['csv'],
  },
  professional: {
    queries_per_month: 1000,
    max_competitors: 20,
    export_formats: ['csv', 'json', 'pdf'],
  },
};
