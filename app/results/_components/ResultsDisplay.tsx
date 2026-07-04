'use client';

import { VisibilityScore } from '@/app/_lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ResultsDisplay({ score }: { score: VisibilityScore }) {
  const maxScore = Math.max(score.score_percentage, ...score.competitor_scores.map((c) => c.score), 100);

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="pt-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Your AI Visibility Score</p>
            <p className="text-6xl font-bold text-blue-600">{score.score_percentage}%</p>
            <p className="text-gray-600 mt-3">{score.brand_name} mentions in AI responses</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Competitor Comparison</CardTitle>
          <CardDescription>How your score stacks up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-900">{score.brand_name}</span>
                <span className="text-blue-600 font-bold">{score.score_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(score.score_percentage / maxScore) * 100}%` }}
                />
              </div>
            </div>
            {score.competitor_scores.map((competitor) => (
              <div key={competitor.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{competitor.name}</span>
                  <span className="text-gray-600">{competitor.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: `${(competitor.score / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Recommendations</CardTitle>
          <CardDescription>Action items to increase your AI visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {score.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3">
                <Badge className="bg-blue-100 text-blue-700 mt-1 flex-shrink-0">{i + 1}</Badge>
                <div>
                  <p className="font-semibold text-gray-900">{rec.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
