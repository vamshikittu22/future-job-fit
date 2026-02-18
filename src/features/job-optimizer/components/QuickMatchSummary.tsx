/**
 * Quick Match Summary Component
 * 
 * Lightweight summary of match intelligence for the main Results page.
 * Shows key scores without heavy computation.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickMatchSummaryProps {
  atsScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  jobDescription: string;
}

export function QuickMatchSummary({ 
  atsScore, 
  matchingKeywords, 
  missingKeywords,
  jobDescription 
}: QuickMatchSummaryProps) {
  // Quick skill categories from keywords
  const skillCategories = {
    languages: ['javascript', 'typescript', 'python', 'java', 'c++', 'go', 'rust', 'ruby', 'php'],
    frameworks: ['react', 'angular', 'vue', 'node', 'django', 'spring', 'express', 'nextjs'],
    cloud: ['aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform', 'serverless'],
    databases: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'nosql', 'dynamodb'],
    tools: ['git', 'jira', 'jenkins', 'ci/cd', 'agile', 'scrum', 'figma']
  };

  // Count keywords by category
  const jdLower = jobDescription.toLowerCase();
  const categoryCounts = Object.entries(skillCategories).reduce((acc, [cat, skills]) => {
    const count = skills.filter(s => jdLower.includes(s)).length;
    return { ...acc, [cat]: count };
  }, {} as Record<string, number>);

  const totalRequired = matchingKeywords.length + missingKeywords.length;
  const matchRate = totalRequired > 0 ? Math.round((matchingKeywords.length / totalRequired) * 100) : 0;

  // Get top missing skills (first 5)
  const topMissing = missingKeywords.slice(0, 5);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Match Intelligence
          <Badge variant="outline" className="ml-auto text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Quick View
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Match Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Match Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${matchRate >= 70 ? 'text-green-600' : matchRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {matchRate}%
            </span>
            <span className="text-xs text-muted-foreground">
              ({matchingKeywords.length}/{totalRequired} skills)
            </span>
          </div>
        </div>

        {/* Skill Categories in JD */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Skills in Job Description</span>
          <div className="flex flex-wrap gap-1">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              count > 0 && (
                <Badge key={cat} variant="secondary" className="text-xs">
                  {cat}: {count}
                </Badge>
              )
            ))}
          </div>
        </div>

        {/* Top Missing Skills */}
        {topMissing.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">Priority Gaps</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {topMissing.map((skill, i) => (
                <Badge key={i} variant="destructive" className="text-xs bg-red-100 text-red-700 hover:bg-red-200">
                  {skill}
                </Badge>
              ))}
              {missingKeywords.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{missingKeywords.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Match Quality */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {atsScore >= 80 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Strong Match</span>
              </>
            ) : atsScore >= 60 ? (
              <>
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">Moderate Match</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">Needs Work</span>
              </>
            )}
          </div>
          
          <Link to="/match-intelligence">
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
              Deep Analysis
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuickMatchSummary;
