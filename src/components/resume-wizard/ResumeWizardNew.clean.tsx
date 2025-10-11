import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, Download, Printer, X, Briefcase, GraduationCap, Code2, FolderOpen, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Components
import { Header } from './header';
import { ResumePreview } from './preview/ResumePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Form Components
// Form Components
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { CertificationsForm } from './forms/CertificationsForm';

// Section Components
import { ATSSection } from './sections/ATSSection';

// Types
import { ResumeData } from './types';
import { initialResumeData } from './data/initialData';

const sections = [
  { id: 'personal', title: 'Personal Info', value: 'personal', icon: <FileText className="h-4 w-4 mr-2" /> },
  { id: 'experience', title: 'Experience', value: 'experience', icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { id: 'education', title: 'Education', value: 'education', icon: <GraduationCap className="h-4 w-4 mr-2" /> },
  { id: 'skills', title: 'Skills', value: 'skills', icon: <Code2 className="h-4 w-4 mr-2" /> },
  { id: 'projects', title: 'Projects', value: 'projects', icon: <FolderOpen className="h-4 w-4 mr-2" /> },
  { id: 'certifications', title: 'Certifications', value: 'certifications', icon: <Award className="h-4 w-4 mr-2" /> },
  { id: 'ats', title: 'ATS Score', value: 'ats', icon: <Sparkles className="h-4 w-4 mr-2" /> },
];

const ResumeWizardNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : initialResumeData;
  });

  // Save to localStorage when resumeData changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const handleAnalyzeATS = async (jobDescription: string) => {
    try {
      setIsAnalyzing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock ATS analysis
      const atsScore = {
        score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        suggestions: [
          'Add more relevant skills from the job description',
          'Include more quantifiable achievements in your experience',
          'Add more industry-specific keywords'
        ],
        lastUpdated: new Date().toISOString(),
        jobDescription
      };

      setResumeData(prev => ({
        ...prev,
        atsScore
      }));

      toast({
        title: 'Analysis Complete',
        description: 'Your resume has been analyzed for ATS compatibility.'
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze resume. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePersonalChange = (personal: any) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, ...personal }
    }));
  };

  // Other handler functions for different sections...

  return (
    <div className="min-h-screen bg-muted/40">
      <Header 
        onPreview={() => setIsPreviewOpen(true)}
        onDownload={() => {}}
      />

      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resume Sections</CardTitle>
                <CardDescription>
                  Complete all sections to create a strong resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabsList className="flex flex-col h-auto p-0">
                  {sections.map((section) => (
                    <TabsTrigger 
                      key={section.id}
                      value={section.value}
                      className="w-full justify-start px-4 py-3"
                      onClick={() => setActiveTab(section.value)}
                    >
                      {section.icon}
                      {section.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} className="space-y-6">
              {/* Personal Info Tab */}
              <TabsContent value="personal" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Personal Information</CardTitle>
                    <CardDescription>Tell us about yourself</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PersonalInfoForm 
                      personal={resumeData.personal}
                      onChange={handlePersonalChange}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ATS Score Tab */}
              <TabsContent value="ats" className="m-0">
                <ATSSection 
                  atsScore={resumeData.atsScore}
                  onAnalyze={handleAnalyzeATS}
                  isAnalyzing={isAnalyzing}
                />
              </TabsContent>

              {/* Add other tabs here following the same pattern */}
            </Tabs>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl w-[90%] h-[90vh] p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <DialogHeader>
              <DialogTitle>Resume Preview</DialogTitle>
            </DialogHeader>
            <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(100%-60px)]">
            <ResumePreview 
              data={resumeData}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              onDownload={() => {}}
              onPrint={() => {}}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeWizardNew;
