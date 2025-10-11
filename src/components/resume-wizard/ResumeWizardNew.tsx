import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { FileText, Eye, Download, Printer, Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { ResumePreview } from './preview/ResumePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Form Components
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { CertificationsForm } from './forms/CertificationsForm';

// Types
import { ResumeData, PersonalInfo, Experience, Education, Project, Skill, Certification } from './types';


// Initial data
const initialResumeData: ResumeData = {
  personal: {
    id: uuidv4(),
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
};

const ResumeWizardNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : {
      personal: {
        id: uuidv4(),
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
    };
  });
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Save resume data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  // Handle form updates
  const handlePersonalInfoChange = useCallback((data: Partial<PersonalInfo>) => {
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
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: 'Resume saved successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Download resume as PDF
  const handleDownloadPdf = useCallback(() => {
    // Implement PDF download logic here
    toast({
      title: 'Download',
      description: 'Preparing your PDF download...',
    });
  }, [toast]);

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
