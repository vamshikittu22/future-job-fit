import { useState, useCallback } from 'react';
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  FolderOpen, 
  Award, 
  Sparkles, 
  Eye, 
  FileDown, 
  Plus, 
  Edit, 
  Printer, 
  X,
  Menu as MenuIcon,
  Sun,
  Moon,
  Undo2,
  Redo2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { initialResumeData } from './data/initialData';
import { useToast } from '@/components/ui/use-toast';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { CertificationsForm } from './forms/CertificationsForm';

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
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  languages: string[];
}

// Simple ResumePreview component
const ResumePreview = ({ data }: { data: ResumeData }) => (
  <div className="space-y-6 p-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold">{data.personal.name || 'Your Name'}</h1>
      <p className="text-muted-foreground">
        {[data.personal.email, data.personal.phone, data.personal.location]
          .filter(Boolean)
          .join(' • ')}
      </p>
    </div>

    {data.personal.summary && (
      <div>
        <h2 className="text-lg font-semibold border-b">Summary</h2>
        <p className="mt-2">{data.personal.summary}</p>
      </div>
    )}

    {data.experience.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold border-b">Experience</h2>
        <div className="mt-2 space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <h3 className="font-medium">{exp.title}</h3>
              <p className="text-sm text-muted-foreground">
                {exp.company} • {exp.startDate} - {exp.endDate || 'Present'}
              </p>
              <p className="mt-1 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {data.education.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold border-b">Education</h2>
        <div className="mt-2 space-y-4">
          {data.education.map((edu, i) => (
            <div key={i}>
              <h3 className="font-medium">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">
                {edu.institution} • {edu.startDate} - {edu.endDate}
              </p>
              {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>
    )}

    {data.skills.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold border-b">Skills</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.skills.map((skill, i) => (
            <span key={i} className="bg-secondary px-3 py-1 rounded-full text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

interface HeaderProps {
  onSave: () => void;
  isSaving: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onToggleTheme: () => void;
  onTogglePreview: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDarkMode: boolean;
  isPreviewOpen: boolean;
  completionPercentage: number;
}

const Header = ({ 
  onSave, 
  isSaving, 
  onUndo, 
  onRedo, 
  onToggleTheme, 
  onTogglePreview, 
  canUndo, 
  canRedo, 
  isDarkMode, 
  isPreviewOpen,
  completionPercentage
}: HeaderProps) => (
  <header className="bg-primary text-primary-foreground shadow-sm">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Resume Builder</h1>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onUndo} disabled={!canUndo || isSaving}>
          <Undo2 className="h-4 w-4 mr-2" />
          Undo
        </Button>
        <Button variant="outline" onClick={onRedo} disabled={!canRedo || isSaving}>
          <Redo2 className="h-4 w-4 mr-2" />
          Redo
        </Button>
        <Button variant="outline" onClick={onToggleTheme}>
          {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          {isDarkMode ? 'Light' : 'Dark'}
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Resume'}
        </Button>
      </div>
    </div>
  </header>
);
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
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
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
      // Create a new object with all required fields
      const newResumeData = {
        ...initialResumeData,
        personal: {
          ...initialResumeData.personal,
          portfolioUrl: initialResumeData.personal.portfolioUrl || '',
          linkedinUrl: initialResumeData.personal.linkedinUrl || '',
          githubUrl: initialResumeData.personal.githubUrl || ''
        }
      };
      setResumeData(newResumeData);
    }
  }, [isSaving]);

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

  // Simple form components
  const renderForm = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={resumeData.personal.name}
                  onChange={(e) => handlePersonalInfoChange({ name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={resumeData.personal.email}
                  onChange={(e) => handlePersonalInfoChange({ email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={resumeData.personal.phone}
                  onChange={(e) => handlePersonalInfoChange({ phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={resumeData.personal.location}
                  onChange={(e) => handlePersonalInfoChange({ location: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Summary</label>
              <Textarea
                value={resumeData.personal.summary}
                onChange={(e) => handlePersonalInfoChange({ summary: e.target.value })}
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
        );
      case 'experience':
        return (
          <div>
            <Button className="mb-4">
              <Plus className="h-4 w-4 mr-2" /> Add Experience
            </Button>
            {resumeData.experience.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No experience added yet
              </div>
            )}
          </div>
        );
      case 'education':
        return (
          <div>
            <Button className="mb-4">
              <Plus className="h-4 w-4 mr-2" /> Add Education
            </Button>
            {resumeData.education.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No education added yet
              </div>
            )}
          </div>
        );
      case 'skills':
        return (
          <div>
            <Button className="mb-4">
              <Plus className="h-4 w-4 mr-2" /> Add Skill
            </Button>
            {resumeData.skills.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No skills added yet
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

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

      {/* KEEP this container (uses the form components) */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resume Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {resumeSections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeTab === section.value ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleTabChange(section.value)}
                    >
                      {section.icon}
                      {section.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
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
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  </TabsList>

                  <div className="h-[calc(100vh-400px)] overflow-y-auto pr-4">
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

                    <TabsContent value="experience" className="m-0">
                      <ExperienceForm
                        experiences={resumeData.experience}
                        onChange={handleExperienceChange}
                      />
                    </TabsContent>

                    <TabsContent value="education" className="m-0">
                      <EducationForm
                        education={resumeData.education}
                        onChange={handleEducationChange}
                      />
                    </TabsContent>

                    <TabsContent value="skills" className="m-0">
                      <SkillsForm
                        skills={resumeData.skills}
                        onChange={handleSkillsChange}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                    <FileDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={isPreviewOpen ? 'default' : 'outline'} 
                    onClick={onTogglePreview}
                    className="flex items-center"
                    disabled={isSaving}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isPreviewOpen ? 'Close Preview' : 'Preview'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-[1/1.4142] bg-white border rounded-md overflow-auto">
                  <ResumePreview data={resumeData} />
                </div>
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
          <div className="h-[calc(100%-60px)] p-4 overflow-auto">
            <ResumePreview data={resumeData} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeWizardNew;