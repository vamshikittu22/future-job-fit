import { useMemo } from 'react';
import { Briefcase, FileText } from 'lucide-react';

import EmptyStatePrompt from '@/features/job-optimizer/components/EmptyStatePrompt';
import PanelHeader from '@/features/job-optimizer/components/PanelHeader';
import { useJobAnalyzer } from '@/features/job-optimizer/hooks/useJobAnalyzer';
import { useJob } from '@/shared/contexts/JobContext';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

function renderExperienceYears(years: string[]): string {
  if (!years.length) {
    return 'Not explicitly stated';
  }

  return years.join(', ');
}

export default function JDAnalyzerPanel() {
  const { currentJob } = useJob();
  const jobDescription = currentJob?.description ?? '';
  const hasJobDescription = Boolean(jobDescription.trim());
  const analysis = useJobAnalyzer(jobDescription);

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

  const analyzerSuggestions = useMemo(() => {
    const suggestions: string[] = [];

    if (!analysis.overview.roleTitle || analysis.overview.roleTitle === 'Role title not detected') {
      suggestions.push('Add a clear role title near the top of the JD for better analysis accuracy.');
    }

    if (requiredSkills.length < 3) {
      suggestions.push('Add more required skills and must-have criteria to improve match precision.');
    }

    if (preferredSkills.length === 0) {
      suggestions.push('Add a preferred/nice-to-have section to help prioritize optimization suggestions.');
    }

    if (topKeywords.length < 8) {
      suggestions.push('Include specific tools/frameworks and domain terms to strengthen keyword extraction.');
    }

    if (!analysis.insights.experienceYears.length) {
      suggestions.push('Specify expected years of experience (for example: "3+ years") for better fit scoring.');
    }

    return suggestions;
  }, [analysis, preferredSkills.length, requiredSkills.length, topKeywords.length]);

  return (
    <Card className="flex h-full flex-col">
      <PanelHeader
        icon={Briefcase}
        title="JD Analysis"
        badge={analysis.isAnalyzing ? 'Analyzing...' : `${topKeywords.length} keywords`}
      />

      {!hasJobDescription ? (
        <EmptyStatePrompt
          icon={FileText}
          title="Analyze Job Description"
          description="Paste a job description in the left JD panel to unlock role requirements, keyword frequency, and key insights here."
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
            <div className="space-y-4">
              {insightLines.map((line, index) => (
                <div key={line} className="space-y-3">
                  <p className="text-sm">{line}</p>
                  {index < insightLines.length - 1 ? <Separator /> : null}
                </div>
              ))}

              <Separator />

              <section className="space-y-2">
                <h4 className="text-sm font-medium">JD Improvements</h4>
                {analyzerSuggestions.length ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {analyzerSuggestions.map((suggestion) => (
                      <li key={suggestion} className="rounded-md border bg-muted/40 px-3 py-2">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    JD quality looks strong. You can now focus on resume-side optimization in Match Analysis.
                  </p>
                )}
              </section>
            </div>
          </ScrollArea>
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
}
