import { AlertCircle, Sparkles, Target } from 'lucide-react';

import EmptyStatePrompt from '@/features/job-optimizer/components/EmptyStatePrompt';
import PanelHeader from '@/features/job-optimizer/components/PanelHeader';
import { useMatchComparison } from '@/features/job-optimizer/hooks/useMatchComparison';
import { useJob } from '@/shared/contexts/JobContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type RecommendationPriority = 'high' | 'medium' | 'low';

const PRIORITY_ORDER: Record<RecommendationPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getScoreColorClass(score: number): string {
  if (score >= 80) {
    return 'text-emerald-600';
  }
  if (score >= 60) {
    return 'text-amber-600';
  }
  return 'text-rose-600';
}

function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 80) {
    return 'default';
  }
  if (score >= 60) {
    return 'secondary';
  }
  return 'destructive';
}

function getIndicatorClass(score: number): string {
  if (score >= 80) {
    return 'bg-emerald-500';
  }
  if (score >= 60) {
    return 'bg-amber-500';
  }
  return 'bg-rose-500';
}

function getPriorityBadgeVariant(priority: RecommendationPriority): 'destructive' | 'secondary' | 'outline' {
  if (priority === 'high') {
    return 'destructive';
  }
  if (priority === 'medium') {
    return 'secondary';
  }
  return 'outline';
}

function toResumeText(resumeData: unknown): string {
  if (!resumeData || typeof resumeData !== 'object') {
    return '';
  }

  const data = resumeData as Record<string, unknown>;
  const parts: string[] = [];

  const personal = data.personal as Record<string, unknown> | undefined;
  if (personal) {
    parts.push(String(personal.name ?? ''), String(personal.email ?? ''), String(personal.phone ?? ''));
  }

  parts.push(String(data.summary ?? ''));

  const experience = Array.isArray(data.experience) ? data.experience : [];
  for (const item of experience) {
    const exp = item as Record<string, unknown>;
    parts.push(String(exp.title ?? ''), String(exp.company ?? ''));
    if (Array.isArray(exp.bullets)) {
      parts.push(...exp.bullets.map((bullet) => String(bullet ?? '')));
    }
  }

  const skills = data.skills;
  if (Array.isArray(skills)) {
    for (const category of skills) {
      const bucket = category as Record<string, unknown>;
      if (Array.isArray(bucket.items)) {
        parts.push(...bucket.items.map((value) => String(value ?? '')));
      }
    }
  } else if (skills && typeof skills === 'object') {
    const legacy = skills as Record<string, unknown>;
    for (const key of ['languages', 'frameworks', 'tools']) {
      const list = legacy[key];
      if (Array.isArray(list)) {
        parts.push(...list.map((value) => String(value ?? '')));
      }
    }
  }

  const education = Array.isArray(data.education) ? data.education : [];
  for (const item of education) {
    const edu = item as Record<string, unknown>;
    parts.push(String(edu.school ?? ''), String(edu.degree ?? ''), String(edu.fieldOfStudy ?? ''));
  }

  const projects = Array.isArray(data.projects) ? data.projects : [];
  for (const item of projects) {
    const project = item as Record<string, unknown>;
    parts.push(String(project.name ?? ''), String(project.description ?? ''));
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

export default function MatchComparisonPanel() {
  const { currentJob } = useJob();
  const { resumeData } = useResume();

  const currentJobWithResume = currentJob as (typeof currentJob & { resumeText?: string }) | null;
  const resumeText = [toResumeText(resumeData), currentJobWithResume?.resumeText ?? '']
    .filter(Boolean)
    .join(' ')
    .trim();
  const jobDescription = currentJob?.description ?? '';

  const hasResume = Boolean(resumeText.trim());
  const hasJD = Boolean(jobDescription.trim());

  const analysis = useMatchComparison(resumeText, jobDescription);
  const atsScore = clamp(analysis.atsScore);

  const requiredGaps = analysis.keywordGaps.filter((gap) => gap.importance === 'required');
  const preferredGaps = analysis.keywordGaps.filter((gap) => gap.importance === 'preferred');
  const sortedRecommendations = [...analysis.recommendations].sort(
    (left, right) => PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority]
  );

  if (!hasResume && !hasJD) {
    return (
      <Card className="flex h-full flex-col">
        <EmptyStatePrompt
          icon={Target}
          title="Match Analysis Ready"
          description="Upload resume and paste JD to see how well they align."
        />
      </Card>
    );
  }

  if (!hasResume || !hasJD) {
    const missingPart = !hasResume ? 'resume' : 'job description';

    return (
      <Card className="flex h-full flex-col">
        <EmptyStatePrompt
          icon={AlertCircle}
          title="Need Both Resume & JD"
          description={`Add your ${missingPart} to unlock ATS score, keyword gaps, and optimization actions.`}
        />
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <PanelHeader
        icon={Target}
        title="Match Analysis"
        actions={
          <Badge variant={getScoreBadgeVariant(atsScore)} className="min-w-[72px] justify-center text-xs">
            ATS {atsScore}
          </Badge>
        }
      />

      <Tabs defaultValue="score" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-transparent p-1">
          <TabsTrigger value="score">Score</TabsTrigger>
          <TabsTrigger value="gaps">Gaps</TabsTrigger>
          <TabsTrigger value="similarity">Similarity</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <ScrollArea className="min-h-0 flex-1">
          <TabsContent value="score" className="m-0 p-4">
            <div className="space-y-5">
              <div className="text-center">
                <p className={`text-6xl font-bold ${getScoreColorClass(atsScore)}`}>{atsScore}</p>
                <p className="text-sm text-muted-foreground">Overall ATS Match</p>
              </div>

              <Progress value={atsScore} indicatorClassName={getIndicatorClass(atsScore)} />

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Keywords (50%)</span>
                    <span>{clamp(analysis.matchBreakdown.keywords)}%</span>
                  </div>
                  <Progress value={analysis.matchBreakdown.keywords} indicatorClassName="bg-blue-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Semantic (25%)</span>
                    <span>{clamp(analysis.matchBreakdown.semantic)}%</span>
                  </div>
                  <Progress value={analysis.matchBreakdown.semantic} indicatorClassName="bg-cyan-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Format (15%)</span>
                    <span>{clamp(analysis.matchBreakdown.format)}%</span>
                  </div>
                  <Progress value={analysis.matchBreakdown.format} indicatorClassName="bg-indigo-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Length (10%)</span>
                    <span>{clamp(analysis.matchBreakdown.length)}%</span>
                  </div>
                  <Progress value={analysis.matchBreakdown.length} indicatorClassName="bg-violet-500" />
                </div>
              </div>

              {analysis.isAnalyzing ? <p className="text-xs text-muted-foreground">Refreshing match data...</p> : null}
            </div>
          </TabsContent>

          <TabsContent value="gaps" className="m-0 space-y-5 p-4">
            <section>
              <h4 className="mb-2 text-sm font-medium">Required Keywords</h4>
              <div className="space-y-2">
                {requiredGaps.length ? (
                  requiredGaps.map((gap) => (
                    <div key={`required-${gap.keyword}`} className="rounded-md border p-3">
                      <Badge variant="destructive">{gap.keyword}</Badge>
                      <p className="mt-2 text-xs text-muted-foreground">{gap.suggestions.join(' • ')}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No missing required keywords detected.</p>
                )}
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-sm font-medium">Preferred Keywords</h4>
              <div className="space-y-2">
                {preferredGaps.length ? (
                  preferredGaps.map((gap) => (
                    <div key={`preferred-${gap.keyword}`} className="rounded-md border p-3">
                      <Badge variant="secondary">{gap.keyword}</Badge>
                      <p className="mt-2 text-xs text-muted-foreground">{gap.suggestions.join(' • ')}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No missing preferred keywords detected.</p>
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="similarity" className="m-0 space-y-5 p-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-muted"
                style={{
                  background: `conic-gradient(rgb(8 145 178) ${clamp(analysis.semanticSimilarity)}%, transparent 0)`,
                }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background text-xl font-semibold">
                  {clamp(analysis.semanticSimilarity)}%
                </div>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                Your resume content aligns {clamp(analysis.semanticSimilarity)}% with the job requirements.
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Top Matching Phrases</h4>
              {analysis.topMatchingPhrases.length ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.topMatchingPhrases.map((phrase) => (
                    <Badge key={phrase} variant="outline">
                      {phrase}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No strong matching phrases identified yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="m-0 space-y-3 p-4">
            {sortedRecommendations.length ? (
              sortedRecommendations.map((recommendation, index) => (
                <Alert
                  key={`${recommendation.action}-${index}`}
                  variant={recommendation.priority === 'high' ? 'destructive' : 'default'}
                >
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    <span>Action Item</span>
                    <Badge variant={getPriorityBadgeVariant(recommendation.priority)}>
                      {recommendation.priority.toUpperCase()}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="space-y-3">
                    <p>{recommendation.action}</p>
                    <Button size="sm" variant="outline" type="button">
                      Add to Resume
                    </Button>
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No action items yet. Your resume and JD are closely aligned.</p>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
