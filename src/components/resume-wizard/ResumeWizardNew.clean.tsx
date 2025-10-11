import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, Download, Printer, X, Briefcase, GraduationCap, Code2, FolderOpen, Award, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Sidebar } from './sidebar';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : initialResumeData;
  });

  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalSections = sections.length;
    let completedSections = 0;

    // Check each section for completion
    sections.forEach(section => {
      if (section.id === 'personal' && resumeData.personal?.name) completedSections++;
      else if (section.id === 'experience' && resumeData.experience?.length > 0) completedSections++;
      else if (section.id === 'education' && resumeData.education?.length > 0) completedSections++;
      else if (section.id === 'skills' && resumeData.skills?.length > 0) completedSections++;
      else if (section.id === 'projects' && resumeData.projects?.length > 0) completedSections++;
      else if (section.id === 'certifications' && resumeData.certifications?.length > 0) completedSections++;
      else if (section.id === 'ats' && resumeData.atsScore) completedSections++;
    });

    return Math.round((completedSections / totalSections) * 100);
  };

  const completionPercentage = calculateCompletion();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  // Toggle preview panel
  const [showPreview, setShowPreview] = useState(false);
  const togglePreview = () => setShowPreview(!showPreview);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Resume Builder</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePreview}>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> Fullscreen Preview
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Always visible on desktop, collapsible on mobile */}
          <div className={`lg:w-1/4 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <Sidebar
              sections={sections}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              completionPercentage={completionPercentage}
              isMobileMenuOpen={isMobileMenuOpen}
              onToggleMobileMenu={toggleMobileMenu}
            />
          </div>

          {/* Main Content */}
          <div className={`${showPreview ? 'lg:w-1/2' : 'lg:w-3/4'} w-full`}>
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

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:w-1/4 w-full lg:block">
              <Card className="h-full">
                <CardHeader className="border-b">
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100vh-200px)] overflow-auto">
                  <ResumePreview 
                    data={resumeData}
                    currentPage={1}
                    totalPages={1}
                    onPageChange={() => {}}
                    onDownload={() => {}}
                    onPrint={() => {}}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl w-[90%] h-[90vh] p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <DialogHeader>
              <DialogTitle>Fullscreen Preview</DialogTitle>
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
