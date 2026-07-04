export interface User {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface Subscription {
  status: 'inactive' | 'active';
  tier: 'starter' | 'professional' | null;
  current_period_end: string | null;
}

export interface VisibilityScore {
  id: string;
  brand_name: string;
  website_url?: string;
  category: string;
  score_percentage: number;
  competitor_scores: { name: string; score: number }[];
  recommendations: { title: string; description: string }[];
  created_at: string;
}

export interface ScoreHistoryItem {
  id: string;
  brand_name: string;
  category: string;
  score_percentage: number;
  created_at: string;
}

export interface ApiKeyStatus {
  service_name: 'openai' | 'perplexity';
  masked_key: string;
}

export const TIER_LIMITS = {
  starter: 5,
  professional: 50,
};
