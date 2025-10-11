import { useState, useCallback } from 'react';
import { FileText, Briefcase, GraduationCap, Code2, FolderOpen, Award, Sparkles, Eye, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
// Import Header component if it exists, or use a local header
const Header = ({ onSave, isSaving, onUndo }: { onSave: () => void; isSaving: boolean; onUndo: () => void }) => (
  <header className="bg-white shadow-sm">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Resume Builder</h1>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onUndo} disabled={isSaving}>
          Undo
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Resume'}
        </Button>
      </div>
    </div>
  </header>
);
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { initialResumeData } from './data/initialData';

// Types
interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    portfolioUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    summary: string;
  };
  experience: any[];
  education: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
  achievements: any[];
  languages: any[];
}

const resumeSections = [
  { 
    id: 'personal', 
    title: 'Personal Info', 
    value: 'personal', 
    icon: <FileText className="h-4 w-4 mr-2" /> 
  },
  { 
    id: 'experience', 
    title: 'Experience', 
    value: 'experience', 
    icon: <Briefcase className="h-4 w-4 mr-2" /> 
  },
  { 
    id: 'education', 
    title: 'Education', 
    value: 'education', 
    icon: <GraduationCap className="h-4 w-4 mr-2" /> 
  },
  { 
    id: 'skills', 
    title: 'Skills', 
    value: 'skills', 
    icon: <Code2 className="h-4 w-4 mr-2" /> 
  },
  { 
    id: 'projects', 
    title: 'Projects', 
    value: 'projects', 
    icon: <FolderOpen className="h-4 w-4 mr-2" /> 
  },
  { 
    id: 'certifications', 
    title: 'Certifications', 
    value: 'certifications', 
    icon: <Award className="h-4 w-4 mr-2" /> 
  },
  { 
    id: 'ats', 
    title: 'ATS Score', 
    value: 'ats', 
    icon: <Sparkles className="h-4 w-4 mr-2" /> 
  }
];

const ResumeWizardNew = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
      portfolioUrl: '',
      linkedinUrl: '',
      githubUrl: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [name]: value
      }
    }));
  };

  // Toggle preview panel
  const togglePreview = () => setShowPreview(!showPreview);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Close mobile menu when a tab is selected
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle form updates
  const handlePersonalInfoChange = useCallback((data: Partial<ResumeData['personal']>) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, ...data }
    }));
  }, []);

  const handleExperienceChange = useCallback((experience: Experience[]) => {
    setResumeData(prev => ({
      ...prev,
      experience
    }));
  }, []);

  const handleEducationChange = useCallback((education: Education[]) => {
    setResumeData(prev => ({
      ...prev,
      education
    }));
  }, []);

  const handleSkillsChange = useCallback((skills: Skill[]) => {
    setResumeData(prev => ({
      ...prev,
      skills
    }));
  }, []);

  const handleProjectsChange = useCallback((projects: Project[]) => {
    setResumeData(prev => ({
      ...prev,
      projects
    }));
  }, []);

  const handleCertificationsChange = useCallback((certifications: Certification[]) => {
    setResumeData(prev => ({
      ...prev,
      certifications
    }));
  }, []);

 // Print resume
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Save resume
  const handleSaveResume = useCallback(async () => {
    try {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setResumeData(initialResumeData);
    }
  }, [isSaving, initialResumeData]);

  // Download resume as PDF
  const handleDownloadPdf = useCallback(() => {
    // Implement PDF download logic here
    toast({
      title: 'Download',
      description: 'Preparing your PDF download...',
    });
  }, []);

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    let score = 0;
    const totalPoints = 10; // Total possible points

    // Personal Info (2 points)
    if (resumeData.personal?.name?.trim()) score += 1;
    if (resumeData.personal?.email?.trim() && resumeData.personal?.phone?.trim()) score += 1;

    // Summary (1 point)
    if (resumeData.personal?.summary?.trim()) score += 1;

    // Experience (2 points)
    if (resumeData.experience.length > 0) {
      score += 1;
      const hasDescription = resumeData.experience.some(exp => 
        exp.description && exp.description.length > 0
      );
      if (hasDescription) score += 1;
    }

    // Education (1 point)
    if (resumeData.education.length > 0) score += 1;

    // Skills (1 point)
    if (resumeData.skills.length > 0) score += 1;

    // Projects (1 point)
    if (resumeData.projects.length > 0) score += 1;

    // Certifications (1 point)
    if (resumeData.certifications.length > 0) score += 1;
    
    return Math.round((score / totalPoints) * 100);
  }, [resumeData]);

  // Check if a section is complete
  const isSectionComplete = useCallback((section: string) => {
    switch (section) {
      case 'personal':
        return !!resumeData.personal?.name?.trim() && 
               !!resumeData.personal?.email?.trim() && 
               !!resumeData.personal?.phone?.trim();
      case 'summary':
        return !!resumeData.personal?.summary?.trim();
      case 'experience':
        return resumeData.experience.length > 0;
      case 'education':
        return resumeData.education.length > 0;
      case 'skills':
        return resumeData.skills.length > 0;
      case 'projects':
        return resumeData.projects.length > 0;
      case 'certifications':
        return resumeData.certifications.length > 0;
      default:
        return false;
    }
  }, [resumeData]);

  const completionPercentage = calculateCompletion();

  // Define sections for the sidebar with icons and completion status
  const sections = [
    { 
      id: 'personal', 
      title: 'Personal Info', 
      value: 'personal',
      icon: () => (
        <div className="relative">
          <FileText className={`h-4 w-4 ${isSectionComplete('personal') ? 'text-green-500' : 'text-muted-foreground'}`} />
          {isSectionComplete('personal') && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>
      )
    },
    { 
      id: 'summary', 
      title: 'Summary', 
      value: 'summary',
      icon: () => (
        <div className="relative">
          <FileText className={`h-4 w-4 ${isSectionComplete('summary') ? 'text-green-500' : 'text-muted-foreground'}`} />
          {isSectionComplete('summary') && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>
      )
    },
    { 
      id: 'experience', 
      title: 'Experience', 
      value: 'experience',
      icon: () => (
        <div className="relative">
          <FileText className={`h-4 w-4 ${isSectionComplete('experience') ? 'text-green-500' : 'text-muted-foreground'}`} />
          {isSectionComplete('experience') && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>
      )
    },
    { 
      id: 'education', 
      title: 'Education', 
      value: 'education',
      icon: () => (
        <div className="relative">
          <FileText className={`h-4 w-4 ${isSectionComplete('education') ? 'text-green-500' : 'text-muted-foreground'}`} />
          {isSectionComplete('education') && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>
      )
    },
    { 
      id: 'skills', 
      title: 'Skills', 
      value: 'skills',
      icon: () => (
        <div className="relative">
          <FileText className={`h-4 w-4 ${isSectionComplete('skills') ? 'text-green-500' : 'text-muted-foreground'}`} />
          {isSectionComplete('skills') && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>
      )
    },
    { 
      id: 'projects', 
      title: 'Projects', 
      value: 'projects',
      icon: () => (
        <div className="relative">
          <FileText className={`h-4 w-4 ${isSectionComplete('projects') ? 'text-green-500' : 'text-muted-foreground'}`} />
          {isSectionComplete('projects') && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>
      )
    },
    { 
      id: 'certifications', 
      title: 'Certifications', 
      value: 'certifications',
      icon: () => (
        <div className="relative">
          <FileText className={`h-4 w-4 ${isSectionComplete('certifications') ? 'text-green-500' : 'text-muted-foreground'}`} />
          {isSectionComplete('certifications') && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSave={handleSaveResume}
        isSaving={isSaving}
        onUndo={() => {}}
        onRedo={() => {}}
        onToggleTheme={() => {}}
        onTogglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
        canUndo={false}
        canRedo={false}
        isDarkMode={false}
        isPreviewOpen={isPreviewOpen}
        completionPercentage={completionPercentage}
      />
      
      <div className="container py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-2">
            <Sidebar
              sections={sections}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              completionPercentage={completionPercentage}
              isMobileMenuOpen={isMobileMenuOpen}
              onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      {sections.find(s => s.value === activeTab)?.title || 'Edit Section'}
                    </h2>
                    <Button variant="outline" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                  
                  <Separator className="mb-6" />

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="h-[calc(100vh-400px)] overflow-y-auto pr-4">
                      {/* Personal Info */}
                      {/* Personal Info */}
                      <TabsContent value="personal" className="m-0">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium">Contact Information</h3>
                            <p className="text-sm text-muted-foreground">
                              Provide your basic contact information.
                            </p>
                          </div>
                          <PersonalInfoForm 
                            data={resumeData.personal} 
                            onChange={handlePersonalInfoChange} 
                          />
                        </div>
                      </TabsContent>

                      {/* Summary */}
                      <TabsContent value="summary" className="m-0">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium">Professional Summary</h3>
                            <p className="text-sm text-muted-foreground">
                              Write a short summary about your professional background and career goals.
                            </p>
                          </div>
                          <div className="space-y-4">
                            <Textarea
                              className="min-h-[200px]"
                              placeholder="Experienced software engineer with 5+ years of experience in web development..."
                              value={resumeData.personal.summary || ''}
                              onChange={(e) => 
                                handlePersonalInfoChange({ summary: e.target.value })
                              }
                            />
                            <p className="text-sm text-muted-foreground">
                              {resumeData.personal.summary?.length || 0} characters
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Experience */}
                      <TabsContent value="experience" className="m-0">
                        <ExperienceForm 
                          experiences={resumeData.experience} 
                          onChange={handleExperienceChange} 
                        />
                      </TabsContent>

                      {/* Education */}
                      <TabsContent value="education" className="m-0">
                        <EducationForm 
                          education={resumeData.education} 
                          onChange={handleEducationChange} 
                        />
                      </TabsContent>

                      {/* Skills */}
                      <TabsContent value="skills" className="m-0">
                        <SkillsForm 
                          skills={resumeData.skills} 
                          onChange={handleSkillsChange} 
                        />
                      </TabsContent>

                      {/* Projects */}
                      <TabsContent value="projects" className="m-0">
                        <ProjectsForm 
                          projects={resumeData.projects} 
                          onChange={handleProjectsChange} 
                        />
                      </TabsContent>

                      {/* Certifications */}
                      <TabsContent value="certifications" className="m-0">
                        <CertificationsForm 
                          certifications={resumeData.certifications} 
                          onChange={handleCertificationsChange} 
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Preview Panel - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <ResumePreview 
                  data={resumeData}
                  currentPage={1}
                  totalPages={1}
                  onPageChange={() => {}}
                  onDownload={handleDownloadPdf}
                  onPrint={handlePrint}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal - Mobile */}
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
          <div className="h-[calc(100%-60px)] p-4">
            <ResumePreview 
              data={resumeData}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              onDownload={handleDownloadPdf}
              onPrint={handlePrint}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeWizardNew;
