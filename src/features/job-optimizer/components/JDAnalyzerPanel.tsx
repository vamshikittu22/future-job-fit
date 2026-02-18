import { useCallback, useEffect, useMemo, useState } from 'react';
import { Briefcase, FileText } from 'lucide-react';

import EmptyStatePrompt from '@/features/job-optimizer/components/EmptyStatePrompt';
import PanelHeader from '@/features/job-optimizer/components/PanelHeader';
import { useJobAnalyzer } from '@/features/job-optimizer/hooks/useJobAnalyzer';
import { useJob } from '@/shared/contexts/JobContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';

const DEFAULT_JOB_ID = 'current-job';

function renderExperienceYears(years: string[]): string {
  if (!years.length) {
    return 'Not explicitly stated';
  }

  return years.join(', ');
}

export default function JDAnalyzerPanel() {
  const { currentJob, setCurrentJob } = useJob();
  const jobDescription = currentJob?.description ?? '';
  const [draftDescription, setDraftDescription] = useState(jobDescription);
  const hasJobDescription = Boolean(jobDescription.trim());
  const analysis = useJobAnalyzer(jobDescription);

  useEffect(() => {
    setDraftDescription(jobDescription);
  }, [jobDescription]);

  const syncDescriptionToJob = useCallback(
    (nextDescription: string) => {
      const now = new Date().toISOString();
      const baseJob =
        currentJob ?? {
          id: DEFAULT_JOB_ID,
          title: 'Current Job Analysis',
          company: '',
          description: '',
          extractedFields: [],
          requirements: [],
          status: 'draft' as const,
          metadata: {
            createdAt: now,
            updatedAt: now,
          },
        };

      setCurrentJob({
        ...baseJob,
        description: nextDescription,
        metadata: {
          ...baseJob.metadata,
          updatedAt: now,
        },
      });
    },
    [currentJob, setCurrentJob]
  );

  const handleDescriptionChange = (nextDescription: string) => {
    setDraftDescription(nextDescription);
    syncDescriptionToJob(nextDescription);
  };

  const clearDescription = () => {
    handleDescriptionChange('');
  };

  const descriptionWordCount = useMemo(() => {
    const trimmed = draftDescription.trim();
    if (!trimmed) {
      return 0;
    }

    return trimmed.split(/\s+/).length;
  }, [draftDescription]);

  const topKeywords = analysis.keywords.keywords.slice(0, 15);
  const requiredSkills = analysis.requirements.required;
  const preferredSkills = analysis.requirements.preferred;
  const insightLines = [
    `Role type: ${analysis.insights.roleType}`,
    analysis.insights.techStack.length
      ? `Tech stack detected: ${analysis.insights.techStack.join(', ')}`
      : 'Tech stack detected: none identified yet',
    `Experience signal: ${renderExperienceYears(analysis.insights.experienceYears)}`,
  ];

  return (
    <Card className="flex h-full flex-col">
      <PanelHeader
        icon={Briefcase}
        title="JD Analysis"
        badge={analysis.isAnalyzing ? 'Analyzing...' : `${topKeywords.length} keywords`}
      />

      <div className="space-y-3 border-b p-4">
        <Textarea
          id="job-description-textarea"
          value={draftDescription}
          onChange={(event) => handleDescriptionChange(event.target.value)}
          placeholder="Paste the full job description here..."
          className="min-h-[120px] resize-none"
        />

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {descriptionWordCount > 0
              ? `${descriptionWordCount} words loaded`
              : 'Paste a role description to generate requirements and keyword analysis.'}
          </span>
          {draftDescription.trim() ? (
            <Button type="button" size="sm" variant="ghost" onClick={clearDescription}>
              Clear JD
            </Button>
          ) : null}
        </div>
      </div>

      {!hasJobDescription ? (
        <EmptyStatePrompt
          icon={FileText}
          title="Analyze Job Description"
          description="Paste a job description above to unlock role requirements, keyword frequency, and key insights."
        />
      ) : (
        <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-transparent p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{analysis.overview.roleTitle}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{analysis.overview.seniority}</Badge>
                  {analysis.overview.location ? (
                    <Badge variant="outline">{analysis.overview.location}</Badge>
                  ) : null}
                  {analysis.overview.company ? (
                    <Badge variant="outline">{analysis.overview.company}</Badge>
                  ) : null}
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Use this panel to understand the job independently from your resume.</p>
                <p>
                  Requirements, keyword frequency, and role signals update automatically
                  as the job description changes.
                </p>
              </div>
            </div>
          </ScrollArea>
          </TabsContent>

          <TabsContent value="requirements" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full p-4">
            <div className="space-y-5">
              <section>
                <h4 className="mb-2 text-sm font-medium">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.length ? (
                    requiredSkills.map((skill) => (
                      <Badge key={`required-${skill}`} variant="destructive" className="text-xs">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No required skills detected yet.</p>
                  )}
                </div>
              </section>

              <section>
                <h4 className="mb-2 text-sm font-medium">Preferred Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {preferredSkills.length ? (
                    preferredSkills.map((skill) => (
                      <Badge key={`preferred-${skill}`} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No preferred skills detected yet.</p>
                  )}
                </div>
              </section>
            </div>
          </ScrollArea>
          </TabsContent>

          <TabsContent value="keywords" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full p-4">
            {topKeywords.length ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {topKeywords.map((item) => (
                  <Badge key={item.keyword} variant="outline" className="justify-between px-3 py-1.5">
                    <span className="truncate">{item.keyword}</span>
                    <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[11px]">
                      {item.frequency}
                    </span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No keywords detected yet.</p>
            )}
          </ScrollArea>
          </TabsContent>

          <TabsContent value="insights" className="mt-0 min-h-0 flex-1">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {insightLines.map((line, index) => (
                <div key={line} className="space-y-3">
                  <p className="text-sm">{line}</p>
                  {index < insightLines.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </div>
          </ScrollArea>
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
}
