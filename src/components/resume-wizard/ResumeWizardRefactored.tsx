import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Icons
import { 
  User, Briefcase, GraduationCap, Code, Award, FileText, Plus, X, Pencil, Trash2, Mail, 
  Phone, MapPin, Globe, Linkedin, Github, Share2, Folder, BadgeCheck, Check, ChevronLeft
} from 'lucide-react';

// Components
import { PersonalInfo } from './personal-info/PersonalInfo';
import { Summary } from './summary/Summary';
import { ExperienceForm, ExperienceList } from './experience';
import { EducationForm, EducationList } from './education';
import { SkillsSection } from './skills/SkillsSection';
import { ProjectForm, ProjectList } from './projects';
import { AchievementForm, AchievementList } from './achievements';
import { CertificationForm, CertificationList } from './certifications';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useResume } from '@/contexts/ResumeContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Types
import { ResumeData } from '@/lib/initialData';
type Experience = ResumeData['experience'][0];
type Education = ResumeData['education'][0];
type Project = ResumeData['projects'][0];
type Achievement = ResumeData['achievements'][0];
type Certification = ResumeData['certifications'][0];

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: string;
};

export const ResumeWizardRefactored = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resumeData, updateResumeData } = useResume();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({});
  const [educationForm, setEducationForm] = useState<Partial<Education>>({});
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ technologies: [] });
  const [achievementForm, setAchievementForm] = useState<Partial<Achievement>>({});
  const [certificationForm, setCertificationForm] = useState<Partial<Certification>>({});
  const [newSkill, setNewSkill] = useState({ name: '', type: 'languages' as const });
  
  // Dialog states
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] = useState(false);
  
  // Editing states
  const [editingExperience, setEditingExperience] = useState<number | null>(null);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<number | null>(null);
  const [editingCertification, setEditingCertification] = useState<number | null>(null);

  // Form data state
  const [formData, setFormData] = useState<ResumeData>({
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: {
      languages: [],
      frameworks: [],
      tools: []
    },
    projects: [],
    achievements: [],
    certifications: [],
    customSections: []
  });

  // Load saved data on mount
  useEffect(() => {
    if (resumeData) {
      setFormData(resumeData);
    }
  }, [resumeData]);

  // Handle form field changes
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [name]: value
      }
    }));
  };

  const handleSummaryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      summary: value
    }));
  };

  // Experience handlers
  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExperience = {
      ...experienceForm,
      id: uuidv4(),
      current: false
    } as Experience;

    if (editingExperience !== null) {
      const updatedExperiences = [...formData.experience];
      updatedExperiences[editingExperience] = newExperience;
      setFormData(prev => ({
        ...prev,
        experience: updatedExperiences
      }));
      setEditingExperience(null);
    } else {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience]
      }));
    }

    setExperienceForm({});
    setIsExperienceDialogOpen(false);
  };

  const handleEditExperience = (index: number) => {
    setExperienceForm(formData.experience[index]);
    setEditingExperience(index);
    setIsExperienceDialogOpen(true);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = formData.experience.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      experience: updatedExperiences
    }));
  };

  // Education handlers (similar to experience handlers)
  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEducation = {
      ...educationForm,
      id: uuidv4()
    } as Education;

    if (editingEducation !== null) {
      const updatedEducation = [...formData.education];
      updatedEducation[editingEducation] = newEducation;
      setFormData(prev => ({
        ...prev,
        education: updatedEducation
      }));
      setEditingEducation(null);
    } else {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
    }

    setEducationForm({});
    setIsEducationDialogOpen(false);
  };

  // Similar handlers for projects, achievements, and certifications
  // ...

  // Save resume
  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      await updateResumeData(formData);
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
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const totalSections = 7; // personal, summary, experience, education, skills, projects, achievements/certifications
    
    if (formData.personal.name && formData.personal.email) completed++;
    if (formData.summary) completed++;
    if (formData.experience.length > 0) completed++;
    if (formData.education.length > 0) completed++;
    if (Object.values(formData.skills).some(skill => skill.length > 0)) completed++;
    if (formData.projects.length > 0) completed++;
    if (formData.achievements.length > 0 || formData.certifications.length > 0) completed++;
    
    return Math.round((completed / totalSections) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Navigation sections
  const sections: Section[] = [
    { id: 'personal', title: 'Personal Info', icon: <User className="h-4 w-4" />, value: 'personal' },
    { id: 'summary', title: 'Summary', icon: <FileText className="h-4 w-4" />, value: 'summary' },
    { id: 'experience', title: 'Experience', icon: <Briefcase className="h-4 w-4" />, value: 'experience' },
    { id: 'education', title: 'Education', icon: <GraduationCap className="h-4 w-4" />, value: 'education' },
    { id: 'skills', title: 'Skills', icon: <Code className="h-4 w-4" />, value: 'skills' },
    { id: 'projects', title: 'Projects', icon: <Folder className="h-4 w-4" />, value: 'projects' },
    { id: 'achievements', title: 'Achievements', icon: <Award className="h-4 w-4" />, value: 'achievements' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Resume Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveResume} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button size="sm" disabled={completionPercentage < 50}>
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resume Progress</CardTitle>
                <CardDescription>{completionPercentage}% Complete</CardDescription>
                <Progress value={completionPercentage} className="h-2" />
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="space-y-2">
                  <TabsList className="flex-col h-auto p-0 bg-transparent">
                    {sections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={section.value}
                        className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted"
                      >
                        <span className="mr-2">{section.icon}</span>
                        {section.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {sections.find(s => s.value === activeTab)?.title || 'Resume Details'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'personal' && 'Provide your personal details to get started with your resume.'}
                  {activeTab === 'summary' && 'Write a brief summary about yourself and your professional background.'}
                  {activeTab === 'experience' && 'Add your work experience to showcase your professional journey.'}
                  {activeTab === 'education' && 'List your educational background and qualifications.'}
                  {activeTab === 'skills' && 'Highlight your key skills and areas of expertise.'}
                  {activeTab === 'projects' && 'Showcase your projects and contributions.'}
                  {activeTab === 'achievements' && 'List your notable achievements and awards.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Personal Info Tab */}
                  <TabsContent value="personal">
                    <PersonalInfo 
                      data={formData.personal} 
                      onChange={handlePersonalChange} 
                    />
                  </TabsContent>

                  {/* Summary Tab */}
                  <TabsContent value="summary">
                    <Summary 
                      value={formData.summary} 
                      onChange={handleSummaryChange} 
                    />
                  </TabsContent>

                  {/* Experience Tab */}
                  <TabsContent value="experience">
                    <div className="space-y-4">
                      <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setEditingExperience(null)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Experience
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingExperience !== null ? 'Edit Experience' : 'Add New Experience'}
                            </DialogTitle>
                          </DialogHeader>
                          <ExperienceForm
                            experience={experienceForm}
                            onSubmit={handleExperienceSubmit}
                            onChange={(field, value) => setExperienceForm(prev => ({ ...prev, [field]: value }))}
                            onCancel={() => setIsExperienceDialogOpen(false)}
                            isEditing={editingExperience !== null}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <ExperienceList 
                        experiences={formData.experience}
                        onEdit={handleEditExperience}
                        onRemove={handleRemoveExperience}
                      />
                    </div>
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value="education">
                    <div className="space-y-4">
                      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setEditingEducation(null)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Education
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingEducation !== null ? 'Edit Education' : 'Add New Education'}
                            </DialogTitle>
                          </DialogHeader>
                          <EducationForm
                            education={educationForm}
                            onSubmit={handleEducationSubmit}
                            onChange={(field, value) => setEducationForm(prev => ({ ...prev, [field]: value })}
                            onCancel={() => setIsEducationDialogOpen(false)}
                            isEditing={editingEducation !== null}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <EducationList 
                        education={formData.education}
                        onEdit={handleEditEducation}
                        onRemove={handleRemoveEducation}
                      />
                    </div>
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills">
                    <SkillsSection 
                      skills={formData.skills}
                      newSkill={newSkill}
                      onAddSkill={(e) => {
                        e.preventDefault();
                        if (!newSkill.name.trim()) return;
                        
                        setFormData(prev => ({
                          ...prev,
                          skills: {
                            ...prev.skills,
                            [newSkill.type]: [...prev.skills[newSkill.type as keyof typeof prev.skills], newSkill.name]
                          }
                        }));
                        
                        setNewSkill({ name: '', type: 'languages' });
                      }}
                      onSkillChange={(field, value) => {
                        setNewSkill(prev => ({
                          ...prev,
                          [field]: value
                        }));
                      }}
                      onRemoveSkill={(category, index) => {
                        const updatedSkills = { ...formData.skills };
                        updatedSkills[category] = updatedSkills[category].filter((_, i) => i !== index);
                        
                        setFormData(prev => ({
                          ...prev,
                          skills: updatedSkills
                        }));
                      }}
                    />
                  </TabsContent>

                  {/* Projects Tab */}
                  <TabsContent value="projects">
                    <div className="space-y-4">
                      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setEditingProject(null)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Project
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingProject !== null ? 'Edit Project' : 'Add New Project'}
                            </DialogTitle>
                          </DialogHeader>
                          <ProjectForm
                            project={projectForm}
                            onSubmit={(e) => {
                              e.preventDefault();
                              const newProject = {
                                ...projectForm,
                                id: uuidv4(),
                                technologies: projectForm.technologies || []
                              } as Project;

                              if (editingProject !== null) {
                                const updatedProjects = [...formData.projects];
                                updatedProjects[editingProject] = newProject;
                                setFormData(prev => ({
                                  ...prev,
                                  projects: updatedProjects
                                }));
                                setEditingProject(null);
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  projects: [...prev.projects, newProject]
                                }));
                              }

                              setProjectForm({ technologies: [] });
                              setIsProjectDialogOpen(false);
                            }}
                            onChange={(field, value) => setProjectForm(prev => ({ ...prev, [field]: value }))}
                            onCancel={() => setIsProjectDialogOpen(false)}
                            isEditing={editingProject !== null}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <ProjectList 
                        projects={formData.projects}
                        onEdit={(index) => {
                          setProjectForm(formData.projects[index]);
                          setEditingProject(index);
                          setIsProjectDialogOpen(true);
                        }}
                        onRemove={(index) => {
                          setFormData(prev => ({
                            ...prev,
                            projects: prev.projects.filter((_, i) => i !== index)
                          }));
                        }}
                      />
                    </div>
                  </TabsContent>

                  {/* Achievements Tab */}
                  <TabsContent value="achievements">
                    <div className="space-y-4">
                      <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setEditingAchievement(null)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Achievement
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingAchievement !== null ? 'Edit Achievement' : 'Add New Achievement'}
                            </DialogTitle>
                          </DialogHeader>
                          <AchievementForm
                            achievement={achievementForm}
                            onSubmit={(e) => {
                              e.preventDefault();
                              const newAchievement = {
                                ...achievementForm,
                                id: uuidv4()
                              } as Achievement;

                              if (editingAchievement !== null) {
                                const updatedAchievements = [...formData.achievements];
                                updatedAchievements[editingAchievement] = newAchievement;
                                setFormData(prev => ({
                                  ...prev,
                                  achievements: updatedAchievements
                                }));
                                setEditingAchievement(null);
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  achievements: [...prev.achievements, newAchievement]
                                }));
                              }

                              setAchievementForm({});
                              setIsAchievementDialogOpen(false);
                            }}
                            onChange={(field, value) => setAchievementForm(prev => ({ ...prev, [field]: value }))}
                            onCancel={() => setIsAchievementDialogOpen(false)}
                            isEditing={editingAchievement !== null}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <AchievementList 
                        achievements={formData.achievements}
                        onEdit={(index) => {
                          setAchievementForm(formData.achievements[index]);
                          setEditingAchievement(index);
                          setIsAchievementDialogOpen(true);
                        }}
                        onRemove={(index) => {
                          setFormData(prev => ({
                            ...prev,
                            achievements: prev.achievements.filter((_, i) => i !== index)
                          }));
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              {/* Navigation Buttons */}
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.value === activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(sections[currentIndex - 1].value);
                    }
                  }}
                  disabled={sections[0].value === activeTab}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {sections.findIndex(s => s.value === activeTab) + 1} of {sections.length}
                </div>
                <Button 
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.value === activeTab);
                    if (currentIndex < sections.length - 1) {
                      setActiveTab(sections[currentIndex + 1].value);
                    }
                  }}
                  disabled={sections[sections.length - 1].value === activeTab}
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeWizardRefactored;
