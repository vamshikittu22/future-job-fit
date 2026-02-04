import React, { useState } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useATS } from '@/shared/hooks/use-ats';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { Textarea } from '@/shared/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { CheckCircle, Download, FileText, ChevronDown, ChevronUp, Info, AlertTriangle, Target, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SectionData {
  id: string;
  name: string;
  data: any;
  isCustom?: boolean;
}

export const ReviewStep: React.FC = () => {
  const { resumeData } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [jdExpanded, setJdExpanded] = useState(false);

  // Use the enhanced ATS hook with optional JD
  const {
    atsScore,
    analysis,
    atsScoreBreakdown,
    matchResults,
    recommendations,
    loading,
    error,
    getKeywordsByStatus
  } = useATS(resumeData, jobDescription || undefined);

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getATSScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  // Score breakdown categories with labels and weights
  const scoreCategories = [
    { key: 'hardSkillScore', label: 'Hard Skills', weight: '45%', description: 'Technical skills and domain expertise' },
    { key: 'toolsScore', label: 'Tools & Technologies', weight: '20%', description: 'Software, frameworks, and platforms' },
    { key: 'conceptScore', label: 'Concepts', weight: '20%', description: 'Methodologies and domain knowledge' },
    { key: 'roleTitleScore', label: 'Role Match', weight: '10%', description: 'Job title and position alignment' },
    { key: 'structureScore', label: 'Structure', weight: '5%', description: 'Resume format and sections' },
  ];

  // Get keyword counts by status
  const matchedCount = matchResults ? getKeywordsByStatus('matched').length : 0;
  const partialCount = matchResults ? getKeywordsByStatus('partial').length : 0;
  const missingCount = matchResults ? getKeywordsByStatus('missing').length : 0;

  // Base sections
  const baseSections: SectionData[] = [
    { id: 'personal', name: 'Personal Info', data: resumeData.personal },
    { id: 'summary', name: 'Summary', data: resumeData.summary },
    { id: 'experience', name: 'Experience', data: resumeData.experience },
    { id: 'education', name: 'Education', data: resumeData.education },
    { id: 'skills', name: 'Skills', data: resumeData.skills },
    { id: 'projects', name: 'Projects', data: resumeData.projects },
    { id: 'achievements', name: 'Achievements', data: resumeData.achievements },
    { id: 'certifications', name: 'Certifications', data: resumeData.certifications },
  ];

  // Add custom sections
  const customSections: SectionData[] = (resumeData.customSections || []).map(section => ({
    id: `custom-${section.id}`,
    name: section.title || 'Custom Section',
    data: section,
    isCustom: true
  }));

  // Combine all sections
  const sections = [...baseSections, ...customSections];

  return (
    <WizardStepContainer
      title="Review & Export"
      description="Review your resume and export it"
      hideNavigation
    >
      <ProgressStepper />

      <div className="space-y-8">
        {/* Optional JD Input for Enhanced Analysis */}
        <Card className="border-border shadow-sm">
          <Collapsible open={jdExpanded} onOpenChange={setJdExpanded}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Job Description Analysis
                      {jobDescription && (
                        <Badge variant="secondary" className="ml-2">Active</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Paste a job description to get targeted ATS analysis with keyword matching
                    </CardDescription>
                  </div>
                  {jdExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <Textarea
                  placeholder="Paste the job description here to get detailed keyword matching and tailored recommendations..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px] resize-y"
                />
                {jobDescription && (
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {jobDescription.length} characters
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setJobDescription('')}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* ATS Score Dashboard */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              ATS Compatibility Score
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardTitle>
            {error && (
              <p className="text-sm text-destructive mt-1">{error}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Circular Score */}
              <div className="flex items-center gap-8">
                <div className="relative h-36 w-36 flex-shrink-0">
                  <svg className="h-36 w-36 -rotate-90 transform">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-muted/30"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 64}`}
                      strokeDashoffset={`${2 * Math.PI * 64 * (1 - atsScore / 100)}`}
                      className={cn('transition-all duration-500', getATSScoreColor(atsScore))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-4xl font-bold', getATSScoreColor(atsScore))}>
                      {atsScore}
                    </span>
                    <span className="text-xs text-muted-foreground">out of 100</span>
                  </div>
                </div>
                <div>
                  <Badge
                    variant={atsScore >= 70 ? 'default' : 'destructive'}
                    className="mb-3 text-sm px-3 py-1"
                  >
                    {getATSScoreLabel(atsScore)}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                    {jobDescription ? (
                      <>Your resume has been analyzed against the target job description.</>
                    ) : (
                      <>Add a job description above for targeted keyword matching and recommendations.</>
                    )}
                  </p>
                </div>
              </div>

              {/* Score Breakdown Table (when JD is provided) */}
              {atsScoreBreakdown && (
                <div className="flex-1 border-l pl-8 hidden lg:block">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    Score Breakdown
                  </h4>
                  <div className="space-y-3">
                    {scoreCategories.map(({ key, label, weight }) => {
                      const score = atsScoreBreakdown[key as keyof typeof atsScoreBreakdown] as number;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-32">{label}</span>
                          <div className="flex-1 max-w-32">
                            <Progress value={score} className="h-2" />
                          </div>
                          <span className={cn('text-sm font-medium w-12 text-right', getATSScoreColor(score))}>
                            {score}%
                          </span>
                          <span className="text-xs text-muted-foreground w-10">({weight})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Keyword Match Summary (when JD is provided) */}
            {matchResults && matchResults.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold mb-3">Keyword Match Summary</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">{matchedCount} Matched</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">{partialCount} Partial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">{missingCount} Missing</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations (when JD is provided) */}
            {recommendations && recommendations.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {recommendations.slice(0, 5).map((rec) => (
                    <li key={rec.id} className="flex items-start gap-2 text-sm">
                      <Badge
                        variant={rec.severity === 'critical' ? 'destructive' : rec.severity === 'warning' ? 'secondary' : 'outline'}
                        className="text-xs mt-0.5"
                      >
                        {rec.severity}
                      </Badge>
                      <span className="text-muted-foreground">{rec.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section Summary */}
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
            Resume Sections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => {
              const hasData = Array.isArray(section.data)
                ? section.data.length > 0
                : Boolean(section.data && (typeof section.data === 'object' ? Object.keys(section.data).length > 0 : section.data));

              return (
                <Card key={section.id} className="border-border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">
                          {section.name}
                          {section.isCustom && (
                            <span className="ml-2 text-xs text-muted-foreground font-normal">
                              (Custom)
                            </span>
                          )}
                        </h4>
                        <p className="text-sm">
                          {hasData ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <CheckCircle className="h-4 w-4" />
                              {section.isCustom ? 'Added' : 'Complete'}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Not added</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Export Options */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Export Your Resume</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Download your resume in professional formats
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button size="lg" className="w-full h-14 text-base shadow-accent">
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>
              <Button size="lg" variant="outline" className="w-full h-14 text-base">
                <FileText className="mr-2 h-5 w-5" />
                Download DOCX
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">
              Both formats are ATS-compatible and ready for job applications
            </p>
          </CardContent>
        </Card>
      </div>
    </WizardStepContainer>
  );
};

