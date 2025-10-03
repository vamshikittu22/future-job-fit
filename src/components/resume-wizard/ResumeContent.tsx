import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Section } from "@/lib/types";
import { ReactNode } from "react";

interface ResumeContentProps {
  activeTab: string;
  sections: Section[];
  children: ReactNode;
}

export const ResumeContent = ({
  activeTab,
  sections,
  children,
}: ResumeContentProps) => {
  const getTabDescription = (tabValue: string) => {
    switch (tabValue) {
      case 'personal':
        return 'Provide your personal details to get started with your resume.';
      case 'summary':
        return 'Write a brief summary about yourself and your professional background.';
      case 'experience':
        return 'Add your work experience to showcase your professional journey.';
      case 'education':
        return 'List your educational background and qualifications.';
      case 'skills':
        return 'Highlight your key skills and areas of expertise.';
      case 'projects':
        return 'Showcase your projects and contributions.';
      case 'achievements':
        return 'List your notable achievements and awards.';
      case 'certifications':
        return 'Add your professional certifications and licenses.';
      default:
        return '';
    }
  };

  return (
    <div className="lg:col-span-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {sections.find(s => s.value === activeTab)?.title || 'Resume Details'}
          </CardTitle>
          <CardDescription>
            {getTabDescription(activeTab)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={() => {}} className="w-full">
            {children}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeContent;
