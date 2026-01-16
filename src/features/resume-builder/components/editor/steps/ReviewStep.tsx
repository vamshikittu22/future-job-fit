import React from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useATS } from '@/shared/hooks/use-ats';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { CheckCircle, Download, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SectionData {
  id: string;
  name: string;
  data: any;
  isCustom?: boolean;
}

export const ReviewStep: React.FC = () => {
  const { resumeData } = useResume();
  const { atsScore, analysis } = useATS(resumeData);

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
        {/* ATS Score Dashboard */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">ATS Compatibility Score</CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="flex-1">
                <Badge
                  variant={atsScore >= 70 ? 'default' : 'destructive'}
                  className="mb-3 text-sm px-3 py-1"
                >
                  {getATSScoreLabel(atsScore)}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your resume is <strong>{atsScore >= 70 ? 'well-optimized' : 'needs improvement'}</strong> for Applicant Tracking Systems. {atsScore >= 70 ? 'Great job! Your resume should pass most ATS filters.' : 'Consider adding more keywords and metrics to improve your score.'}
                </p>
              </div>
            </div>
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
