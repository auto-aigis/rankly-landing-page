export type Tier = 'free' | 'starter' | 'professional' | 'business';
export type BillingInterval = 'monthly' | 'yearly';
export type QueryEngine = 'chatgpt' | 'perplexity';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  onboarding_complete: boolean;
  tier: Tier;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  website_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Competitor {
  id: string;
  name: string;
}

export interface Subscription {
  tier: Tier;
  status: 'active' | 'canceled' | 'past_due' | 'inactive';
  current_period_end: string | null;
  price_id: string | null;
  billing_interval?: BillingInterval | null;
}

export interface DashboardData {
  visibility_score: number;
  answer_frequency: { chatgpt: number; perplexity: number };
  citation_share: Record<string, number>;
  recent_feed: RecentFeedItem[];
}

export interface RecentFeedItem {
  query: string;
  engine: QueryEngine;
  appeared: boolean;
  cited_urls: string[];
  timestamp: string;
}

export interface Query {
  id: string;
  query_text: string;
  last_run?: string | null;
  created_at: string;
}

export interface QueryResult {
  id: string;
  query_id: string;
  engine: QueryEngine;
  brand_appeared: boolean;
  answer_text: string;
  cited_urls: string[];
  simulated_at: string;
}

export interface VisibilityReportItem {
  query_text: string;
  appearance_count: number;
  total_runs: number;
  percentage: number;
}

export interface CitationReportItem {
  url: string;
  is_owned: boolean;
  frequency: number;
}

export interface CompetitorReportItem {
  brand_name: string;
  overall_percentage: number;
  per_query: { query: string; appeared: boolean }[];
}

export interface GapReportItem {
  query_text: string;
  competitors_present: string[];
  brand_absent: boolean;
}

export interface Recommendation {
  id: string;
  query_id: string;
  query_text: string;
  current_rate: number;
  target_rate: number;
  content_action: string;
  priority_rank: number;
  generated_at: string;
}

export interface TeamMember {
  id: string;
  email: string;
  status: 'pending' | 'joined';
  joined_at: string | null;
}

export interface SettingsData {
  user: User;
  brands: Brand[];
  competitors: Competitor[];
  openai_api_key_set: boolean;
  perplexity_api_key_set: boolean;
}

export interface CheckoutResponse {
  price_id: string;
  client_token: string;
}

export interface ApiKeyResponse {
  key: string;
  created_at: string;
}

export interface ScanCompetitorScore {
  name: string;
  score: number;
}

export interface ScanRecommendation {
  action: string;
  estimated_lift: string;
  topic?: string;
}

export interface ScanResult {
  scan_id: string;
  brand_name: string;
  category?: string;
  score: number;
  prompts_used: number;
  prompts_matched: number;
  competitor_scores: ScanCompetitorScore[];
  recommendations: ScanRecommendation[];
  created_at: string;
}

export interface TierLimits {
  max_brands: number;
  max_queries: number;
  max_competitors: number;
  data_retention_days: number;
  has_competitor_comparison: boolean;
  has_recommendations: boolean;
  has_api_access: boolean;
  has_pdf_export: boolean;
  has_csv_export: boolean;
  max_seats: number;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  free: {
    max_brands: 1, max_queries: 10, max_competitors: 0, data_retention_days: 7,
    has_competitor_comparison: false, has_recommendations: false,
    has_api_access: false, has_pdf_export: false, has_csv_export: false, max_seats: 1,
  },
  starter: {
    max_brands: 1, max_queries: 100, max_competitors: 3, data_retention_days: 30,
    has_competitor_comparison: true, has_recommendations: true,
    has_api_access: false, has_pdf_export: false, has_csv_export: false, max_seats: 1,
  },
  professional: {
    max_brands: 3, max_queries: 500, max_competitors: 10, data_retention_days: 90,
    has_competitor_comparison: true, has_recommendations: true,
    has_api_access: false, has_pdf_export: false, has_csv_export: true, max_seats: 1,
  },
  business: {
    max_brands: 10, max_queries: 2000, max_competitors: 10, data_retention_days: 180,
    has_competitor_comparison: true, has_recommendations: true,
    has_api_access: true, has_pdf_export: true, has_csv_export: true, max_seats: 3,
  },
};
