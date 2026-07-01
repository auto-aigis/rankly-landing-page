import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardData } from '@/app/_lib/types';

interface StatsGridProps {
  data: DashboardData | null;
  loading: boolean;
}

export function StatsGrid({ data, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></CardHeader>
            <CardContent><div className="h-20 bg-gray-100 rounded animate-pulse" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Visibility Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{data?.visibility_score || 0}</div>
          <p className="text-xs text-gray-500 mt-1">out of 100</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">ChatGPT Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{data?.answer_frequency.chatgpt || 0}%</div>
          <p className="text-xs text-gray-500 mt-1">brand appears in answers</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Perplexity Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{data?.answer_frequency.perplexity || 0}%</div>
          <p className="text-xs text-gray-500 mt-1">brand appears in answers</p>
        </CardContent>
      </Card>
    </div>
  );
}
