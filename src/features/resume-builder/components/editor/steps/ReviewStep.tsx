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

      <div className="space-y-6">
        {/* ATS Score Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>ATS Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - atsScore / 100)}`}
                    className={cn('transition-all duration-500', getATSScoreColor(atsScore))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-3xl font-bold', getATSScoreColor(atsScore))}>
                    {atsScore}
                  </span>
                  <span className="text-xs text-muted-foreground">out of 100</span>
                </div>
              </div>
              <div className="flex-1">
                <Badge variant={atsScore >= 70 ? 'default' : 'destructive'} className="mb-2">
                  {getATSScoreLabel(atsScore)}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Your resume is {atsScore >= 70 ? 'well-optimized' : 'needs improvement'} for Applicant Tracking Systems
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => {
            const hasData = Array.isArray(section.data)
              ? section.data.length > 0
              : Boolean(section.data && (typeof section.data === 'object' ? Object.keys(section.data).length > 0 : section.data));

            return (
              <Card key={section.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {section.name}
                        {section.isCustom && (
                          <span className="ml-2 text-xs text-muted-foreground font-normal">
                            (Custom)
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {hasData ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            {section.isCustom ? 'Added' : 'Complete'}
                          </span>
                        ) : (
                          'Not added'
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Your Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button size="lg" className="w-full">
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                <FileText className="mr-2 h-5 w-5" />
                Download DOCX
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </WizardStepContainer>
  );
};
