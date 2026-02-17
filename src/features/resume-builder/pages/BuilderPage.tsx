import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ResumeData } from '@/shared/lib/initialData';
import { ExportResumeModal } from '@/features/resume-builder/components/editor/ExportResumeModal';
import { ImportResumeModal } from '@/features/resume-builder/components/editor/ImportResumeModal';
import { Header } from '@/features/resume-builder/components/editor/header';
import { Sidebar } from '@/features/resume-builder/components/editor/sidebar';

// Types
type Experience = ResumeData['experience'][0];
type Education = ResumeData['education'][0];
type Skills = ResumeData['skills'];
type Project = ResumeData['projects'][0];
type Achievement = ResumeData['achievements'][0];
type Certification = ResumeData['certifications'][0];

type Section = {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
};

// Icons
import {
  User, Briefcase, GraduationCap, Code, Award, FileText, Plus, X, Pencil, Trash2, Mail,
  Phone, MapPin, Globe, Linkedin, Github, Share2, Folder, BadgeCheck, Download, Upload,
  RotateCcw, RotateCw, Save, Home
} from 'lucide-react';

// Components
import { EducationForm } from '@/features/resume-builder/components/editor/education/EducationForm';
import { EducationList } from '@/features/resume-builder/components/editor/education/EducationList';

// UI Components
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';



const ResumeWizard = () => {
  // Hooks - Single declarations only
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    resumeData,
    updateResumeData,
    saveResume,
    undo,
    redo,
    canUndo,
    canRedo,
    setResumeData
  } = useResume();

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Debug log for modal state changes
  useEffect(() => {
    console.log('Import modal state:', showImportModal);
  }, [showImportModal]);

  useEffect(() => {
    console.log('Export modal state:', showExportModal);
  }, [showExportModal]);

  // Navigation sections
  const sections: Section[] = [
    { id: 'personal', title: 'Personal Info', icon: <User className="h-4 w-4" />, value: 'personal' },
    { id: 'summary', title: 'Summary', icon: <FileText className="h-4 w-4" />, value: 'summary' },
    { id: 'experience', title: 'Experience', icon: <Briefcase className="h-4 w-4" />, value: 'experience' },
    { id: 'education', title: 'Education', icon: <GraduationCap className="h-4 w-4" />, value: 'education' },
    { id: 'skills', title: 'Skills', icon: <Code className="h-4 w-4" />, value: 'skills' },
    { id: 'projects', title: 'Projects', icon: <Folder className="h-4 w-4" />, value: 'projects' },
    { id: 'achievements', title: 'Achievements', icon: <Award className="h-4 w-4" />, value: 'achievements' },
    { id: 'certifications', title: 'Certifications', icon: <BadgeCheck className="h-4 w-4" />, value: 'certifications' },
  ];

  // Form Data State - Initialize with default values first
  const [formData, setFormData] = useState<ResumeData>(() => {
    // Only use resumeData if it exists and has data
    if (resumeData && Object.keys(resumeData).length > 0) {
      return {
        personal: {
          name: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
          ...resumeData.personal
        },
        summary: resumeData.summary || '',
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: {
          languages: [],
          frameworks: [],
          tools: [],
          ...resumeData.skills
        },
        projects: resumeData.projects || [],
        achievements: resumeData.achievements || [],
        certifications: resumeData.certifications || [],
        customSections: resumeData.customSections || []
      };
    }

    // Default empty state
    return {
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
    };
  });

  // Handle saving resume
  const handleSaveResume = async () => {
    try {
      setIsSaving(true);
      await saveResume();
      toast({
        title: "Success",
        description: "Resume saved successfully!",
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle import/export
  const handleImport = () => setShowImportModal(true);
  const handleExport = () => setShowExportModal(true);

  // Handle successful import
  const handleImportSuccess = () => {
    setShowImportModal(false);
    toast({
      title: "Success",
      description: "Resume imported successfully!",
    });
  };

  // Save resume data to localStorage on changes
  useEffect(() => {
    if (resumeData && Object.keys(resumeData).length > 0) {
      saveResume();
    }
  }, [resumeData, saveResume]);

  // Form State
  const [newSkill, setNewSkill] = useState<{ type: keyof Skills; name: string }>({ type: 'languages', name: '' });

  // Form data states
  const [experienceForm, setExperienceForm] = useState<Omit<Experience, 'id'>>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false
  });

  const [educationForm, setEducationForm] = useState<Omit<Education, 'id'>>({
    degree: '',
    school: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    name: '',
    description: '',
    url: '',
    technologies: []
  });

  const [achievementForm, setAchievementForm] = useState<Omit<Achievement, 'id'>>({
    title: '',
    date: '',
    description: ''
  });

  const [certificationForm, setCertificationForm] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    date: '',
    credentialUrl: ''
  });

  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<number | null>(null);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<number | null>(null);
  const [editingCertification, setEditingCertification] = useState<number | null>(null);
  const [editingCustomSection, setEditingCustomSection] = useState<number | null>(null);

  // Handle personal info changes
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Create the updated personal data
    const updatedPersonal = {
      ...formData.personal,
      [name]: value
    };

    // Update the form data state
    setFormData(prev => ({
      ...prev,
      personal: updatedPersonal
    }));

    // Also update the resume data in context
    updateResumeData('personal', updatedPersonal);
  };

  // Handle education form changes
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update resume data when formData changes
  useEffect(() => {
    if (updateResumeData) {
      updateResumeData('experience', formData.experience);
      updateResumeData('education', formData.education);
      updateResumeData('skills', formData.skills);
      updateResumeData('projects', formData.projects);
      updateResumeData('achievements', formData.achievements);
      updateResumeData('certifications', formData.certifications);
      updateResumeData('customSections', formData.customSections);
    }
  }, [formData, updateResumeData]);

  // Load initial data from context
  useEffect(() => {
    if (resumeData && Object.keys(resumeData).length > 0) {
      // Only update if there's actual data and it's different from current formData
      setFormData(prev => {
        // Create a new state object with the updated values
        const newState = {
          ...prev,
          personal: resumeData.personal || prev.personal,
          summary: resumeData.summary || prev.summary,
          experience: resumeData.experience || [],
          education: resumeData.education || [],
          skills: resumeData.skills || { languages: [], frameworks: [], tools: [] },
          projects: resumeData.projects || [],
          achievements: resumeData.achievements || [],
          certifications: resumeData.certifications || []
        };

        // Only return new state if it's different from current state
        return JSON.stringify(prev) !== JSON.stringify(newState) ? newState : prev;
      });
    }
  }, [resumeData]);

  // Handle project form changes
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle experience form changes
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setExperienceForm(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }));
  };

  // Handle achievement form changes
  const handleAchievementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAchievementForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Handle adding a new skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    setFormData(prev => {
      const updatedSkills = {
        ...prev.skills,
        [newSkill.type]: [...prev.skills[newSkill.type], newSkill.name.trim()]
      };

      return {
        ...prev,
        skills: updatedSkills
      };
    });

    setNewSkill(prev => ({ ...prev, name: '' }));
  };

  // Handle removing a skill
  const handleRemoveSkill = (category: keyof Skills, index: number) => {
    setFormData(prev => {
      const categorySkills = prev.skills[category] || [];
      const updatedSkills = {
        ...prev.skills,
        [category]: categorySkills.filter((_, i) => i !== index)
      };

      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };

  // Handle experience form submission
  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newExperience = {
      ...experienceForm,
      id: uuidv4()
    };

    if (editingExperience !== null) {
      // Update existing experience
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.map((exp, i) =>
          i === editingExperience ? newExperience : exp
        )
      }));
    } else {
      // Add new experience
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience]
      }));
    }

    // Reset form
    setExperienceForm({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    });

    setIsExperienceDialogOpen(false);
    setEditingExperience(null);
  };

  // Handle project form submission
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProject !== null) {
      // Update existing project
      const updatedProjects = [...formData.projects];
      updatedProjects[editingProject] = {
        ...projectForm,
        id: updatedProjects[editingProject].id
      };

      setFormData(prev => ({
        ...prev,
        projects: updatedProjects
      }));

      setEditingProject(null);
    } else {
      // Add new project
      setFormData(prev => ({
        ...prev,
        projects: [
          ...prev.projects,
          {
            ...projectForm,
            id: uuidv4()
          }
        ]
      }));
    }

    // Reset form
    setProjectForm({
      name: '',
      description: '',
      url: '',
      technologies: []
    });

    // Close dialog
    setIsProjectDialogOpen(false);
  };

  // Handle editing a project entry
  const handleEditProject = (index: number) => {
    const project = formData.projects[index];
    setProjectForm(project);
    setEditingProject(index);
    setIsProjectDialogOpen(true);
  };

  // Handle removing a project entry
  const handleRemoveProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Handle editing an achievement entry
  const handleEditAchievement = (index: number) => {
    const achievement = formData.achievements[index];
    setAchievementForm(achievement);
    setEditingAchievement(index);
    setIsAchievementDialogOpen(true);
  };

  // Handle removing an achievement entry
  const handleRemoveAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Handle certification form submission
  const handleCertificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCertification !== null) {
      // Update existing certification
      const updatedCertifications = [...formData.certifications];
      updatedCertifications[editingCertification] = {
        ...certificationForm,
        id: updatedCertifications[editingCertification].id
      };

      setFormData(prev => ({
        ...prev,
        certifications: updatedCertifications
      }));

      setEditingCertification(null);
    } else {
      // Add new certification
      setFormData(prev => ({
        ...prev,
        certifications: [
          ...prev.certifications,
          {
            ...certificationForm,
            id: uuidv4()
          }
        ]
      }));
    }

    // Reset form
    setCertificationForm({
      name: '',
      issuer: '',
      date: '',
      url: ''
    });

    // Close dialog
    setIsCertificationDialogOpen(false);
  };

  // Handle editing a certification entry
  const handleEditCertification = (index: number) => {
    const certification = formData.certifications[index];
    setCertificationForm(certification);
    setEditingCertification(index);
    setIsCertificationDialogOpen(true);
  };

  // Handle removing a certification entry
  const handleRemoveCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Handle removing an experience entry
  const handleRemoveExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Handle editing an experience entry
  const handleEditExperience = (index: number) => {
    const exp = formData.experience[index];
    setExperienceForm(exp);
    setEditingExperience(index);
    setIsExperienceDialogOpen(true);
  };

  // Handle education form submission
  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEducation = {
      ...educationForm,
      id: uuidv4()
    };

    if (editingEducation !== null) {
      // Update existing education
      setFormData(prev => ({
        ...prev,
        education: prev.education.map((edu, i) =>
          i === editingEducation ? newEducation : edu
        )
      }));
      setEditingEducation(null);
    } else {
      // Add new education
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
    }

    // Reset form
    setEducationForm({
      degree: '',
      school: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    });

    // Close dialog
    setIsEducationDialogOpen(false);
  };

  // Handle editing an education entry
  const handleEditEducation = (index: number) => {
    const edu = formData.education[index];
    setEducationForm(edu);
    setEditingEducation(index);
    setIsEducationDialogOpen(true);
  };

  // Handle removing an education entry
  const handleRemoveEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const total = 7; // Total number of sections

    if (formData.personal.name && formData.personal.email) completed++;
    if (formData.summary) completed++;
    if (formData.experience.length > 0) completed++;
    if (formData.education.length > 0) completed++;
    if (Object.values(formData.skills).some(skill => skill.length > 0)) completed++;
    if (formData.projects.length > 0) completed++;
    if (formData.achievements.length > 0 || formData.certifications.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Add theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Add your theme toggling logic here
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <Header
        onUndo={onUndo}
        onRedo={onRedo}
        onSave={handleSaveResume}
        onToggleTheme={toggleTheme}
        onTogglePreview={togglePreview}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving}
        isDarkMode={isDarkMode}
        isPreviewOpen={isPreviewOpen}
      />

      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <Sidebar
            sections={sections}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            completionPercentage={completionPercentage}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

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
                  {activeTab === 'certifications' && 'Add your professional certifications and licenses.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                  {/* Summary Tab */}
                  <TabsContent value="summary" className="mt-0">
                    <div>
                      <Textarea
                        className="min-h-[200px]"
                        value={formData.summary}
                        onChange={(e) => {
                          const newSummary = e.target.value;
                          // Update local state
                          setFormData(prev => ({
                            ...prev,
                            summary: newSummary
                          }));
                          // Update context
                          updateResumeData('summary', newSummary);
                        }}
                        placeholder="Experienced professional with a passion for..."
                      />
                    </div>
                  </TabsContent>

                  {/* Personal Info Tab */}
                  <TabsContent value="personal" className="mt-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.personal.name}
                            onChange={handlePersonalChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.personal.email}
                            onChange={handlePersonalChange}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.personal.phone}
                            onChange={handlePersonalChange}
                            placeholder="(123) 456-7890"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.personal.location}
                            onChange={handlePersonalChange}
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.personal.website}
                            onChange={handlePersonalChange}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            name="linkedin"
                            value={formData.personal.linkedin}
                            onChange={handlePersonalChange}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            name="github"
                            value={formData.personal.github}
                            onChange={handlePersonalChange}
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Experience Tab */}
                  <TabsContent value="experience">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Work Experience</CardTitle>
                          <CardDescription>
                            List your work experience in reverse chronological order.
                          </CardDescription>
                        </div>
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
                            <form onSubmit={handleExperienceSubmit}>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input
                                      id="title"
                                      name="title"
                                      value={experienceForm.title}
                                      onChange={handleExperienceChange}
                                      placeholder="e.g. Software Engineer"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                      id="company"
                                      name="company"
                                      value={experienceForm.company}
                                      onChange={handleExperienceChange}
                                      placeholder="Company Name"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                      id="location"
                                      name="location"
                                      value={experienceForm.location}
                                      onChange={handleExperienceChange}
                                      placeholder="City, Country"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                      id="startDate"
                                      name="startDate"
                                      type="date"
                                      value={experienceForm.startDate}
                                      onChange={handleExperienceChange}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                      id="endDate"
                                      name="endDate"
                                      type="date"
                                      value={experienceForm.endDate}
                                      onChange={handleExperienceChange}
                                      disabled={experienceForm.current}
                                    />
                                  </div>
                                  <div className="space-y-2 flex items-end">
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id="current"
                                        name="current"
                                        checked={experienceForm.current}
                                        onCheckedChange={(checked) =>
                                          setExperienceForm(prev => ({ ...prev, current: checked }))
                                        }
                                      />
                                      <Label htmlFor="current">I currently work here</Label>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                    id="description"
                                    name="description"
                                    value={experienceForm.description}
                                    onChange={handleExperienceChange}
                                    placeholder="Describe your role and responsibilities"
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsExperienceDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  {editingExperience !== null ? 'Update' : 'Add'} Experience
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {formData.experience.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Briefcase className="mx-auto h-12 w-12 mb-2 opacity-20" />
                            <p>No work experience added yet.</p>
                            <p className="text-sm">Click the button above to add your first job.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {formData.experience.map((exp, index) => (
                              <div key={exp.id} className="border rounded-lg p-4 relative group">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{exp.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {exp.company} • {exp.location}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditExperience(index)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveExperience(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                {exp.description && (
                                  <p className="mt-2 text-sm">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value="education">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Education</CardTitle>
                          <CardDescription>
                            List your educational background in reverse chronological order.
                          </CardDescription>
                        </div>
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
                              onChange={(field, value) => setEducationForm(prev => ({ ...prev, [field]: value }))}
                              onCancel={() => setIsEducationDialogOpen(false)}
                              isEditing={editingEducation !== null}
                            />
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        <EducationList
                          education={formData.education}
                          onEdit={handleEditEducation}
                          onRemove={handleRemoveEducation}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills">
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>
                          Add your technical and professional skills.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddSkill} className="mb-6">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1">
                              <Input
                                placeholder="Add a skill"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="w-full sm:w-auto">
                              <select
                                value={newSkill.type}
                                onChange={(e) => setNewSkill(prev => ({ ...prev, type: e.target.value as keyof Skills }))}
                                className="border rounded-md px-3 py-2 text-sm"
                              >
                                <option value="languages">Languages</option>
                                <option value="frameworks">Frameworks</option>
                                <option value="tools">Tools</option>
                              </select>
                            </div>
                            <Button type="submit">Add Skill</Button>
                          </div>
                        </form>

                        <div className="space-y-6">
                          {(['languages', 'frameworks', 'tools'] as const).map((category) => (
                            formData.skills[category]?.length > 0 && (
                              <div key={category} className="space-y-2">
                                <h3 className="font-medium capitalize">{category}</h3>
                                <div className="flex flex-wrap gap-2">
                                  {formData.skills[category]?.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                      {skill}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(category, index)}
                                        className="opacity-70 hover:opacity-100"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Projects Tab */}
                  <TabsContent value="projects">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Projects</CardTitle>
                          <CardDescription>
                            Showcase your projects and open-source contributions.
                          </CardDescription>
                        </div>
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
                            <form onSubmit={handleProjectSubmit}>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      value={projectForm.name}
                                      onChange={handleProjectChange}
                                      placeholder="e.g. E-commerce Website"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="url">Project URL (optional)</Label>
                                    <Input
                                      id="url"
                                      name="url"
                                      value={projectForm.url}
                                      onChange={handleProjectChange}
                                      placeholder="https://example.com"
                                      type="url"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="technologies">Technologies (comma separated)</Label>
                                  <Input
                                    id="technologies"
                                    name="technologies"
                                    value={projectForm.technologies.join(', ')}
                                    onChange={(e) => {
                                      const techs = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                                      setProjectForm(prev => ({ ...prev, technologies: techs }));
                                    }}
                                    placeholder="React, Node.js, MongoDB"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                    id="description"
                                    name="description"
                                    value={projectForm.description}
                                    onChange={handleProjectChange}
                                    placeholder="Describe the project, your role, and key features"
                                    className="min-h-[100px]"
                                    required
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  {editingProject !== null ? 'Update' : 'Add'} Project
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {formData.projects.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Folder className="mx-auto h-12 w-12 mb-2 opacity-20" />
                            <p>No projects added yet.</p>
                            <p className="text-sm">Click the button above to add your first project.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {formData.projects.map((project, index) => (
                              <div key={project.id} className="border rounded-lg p-4 relative group">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{project.name}</h3>
                                    {project.url && (
                                      <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
                                      >
                                        {new URL(project.url).hostname}
                                      </a>
                                    )}
                                    {project.technologies.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {project.technologies.map((tech, i) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditProject(index)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveProject(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                {project.description && (
                                  <p className="mt-2 text-sm">{project.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Achievements Tab */}
                  <TabsContent value="achievements">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Achievements</CardTitle>
                          <CardDescription>
                            Highlight your professional achievements and awards.
                          </CardDescription>
                        </div>
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
                            <form onSubmit={(e) => {
                              e.preventDefault();

                              if (editingAchievement !== null) {
                                // Update existing achievement
                                const updatedAchievements = [...formData.achievements];
                                updatedAchievements[editingAchievement] = {
                                  ...achievementForm,
                                  id: updatedAchievements[editingAchievement].id
                                };

                                setFormData(prev => ({
                                  ...prev,
                                  achievements: updatedAchievements
                                }));

                                setEditingAchievement(null);
                              } else {
                                // Add new achievement
                                setFormData(prev => ({
                                  ...prev,
                                  achievements: [
                                    ...prev.achievements,
                                    {
                                      ...achievementForm,
                                      id: uuidv4()
                                    }
                                  ]
                                }));
                              }

                              // Reset form
                              setAchievementForm({
                                title: '',
                                date: '',
                                description: ''
                              });

                              // Close dialog
                              setIsAchievementDialogOpen(false);
                            }}>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="title">Title</Label>
                                  <Input
                                    id="title"
                                    name="title"
                                    value={achievementForm.title}
                                    onChange={handleAchievementChange}
                                    placeholder="e.g. Employee of the Month"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="date">Date</Label>
                                  <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={achievementForm.date}
                                    onChange={handleAchievementChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                    id="description"
                                    name="description"
                                    value={achievementForm.description}
                                    onChange={handleAchievementChange}
                                    placeholder="Describe the achievement and its significance"
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAchievementDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  {editingAchievement !== null ? 'Update' : 'Add'} Achievement
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {formData.achievements.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Award className="mx-auto h-12 w-12 mb-2 opacity-20" />
                            <p>No achievements added yet.</p>
                            <p className="text-sm">Click the button above to add your first achievement.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {formData.achievements.map((achievement, index) => (
                              <div key={achievement.id} className="border rounded-lg p-4 relative group">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{achievement.title}</h3>
                                    {achievement.date && (
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditAchievement(index)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveAchievement(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                {achievement.description && (
                                  <p className="mt-2 text-sm">{achievement.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Certifications Tab */}
                  <TabsContent value="certifications">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Certifications</CardTitle>
                          <CardDescription>
                            List your professional certifications and courses.
                          </CardDescription>
                        </div>
                        <Dialog open={isCertificationDialogOpen} onOpenChange={setIsCertificationDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setEditingCertification(null)}>
                              <Plus className="mr-2 h-4 w-4" /> Add Certification
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                {editingCertification !== null ? 'Edit Certification' : 'Add New Certification'}
                              </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCertificationSubmit}>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="name">Certification Name</Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      value={certificationForm.name}
                                      onChange={(e) => setCertificationForm(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="e.g. AWS Certified Solutions Architect"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="issuer">Issuing Organization</Label>
                                    <Input
                                      id="issuer"
                                      name="issuer"
                                      value={certificationForm.issuer}
                                      onChange={(e) => setCertificationForm(prev => ({ ...prev, issuer: e.target.value }))}
                                      placeholder="e.g. Amazon Web Services"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="date">Date Issued</Label>
                                    <Input
                                      id="date"
                                      name="date"
                                      type="date"
                                      value={certificationForm.date}
                                      onChange={(e) => setCertificationForm(prev => ({ ...prev, date: e.target.value }))}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="url">Credential URL (optional)</Label>
                                    <Input
                                      id="url"
                                      name="url"
                                      type="url"
                                      value={certificationForm.url}
                                      onChange={(e) => setCertificationForm(prev => ({ ...prev, url: e.target.value }))}
                                      placeholder="https://example.com/certificate/123"
                                    />
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCertificationDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  {editingCertification !== null ? 'Update' : 'Add'} Certification
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {formData.certifications.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <BadgeCheck className="mx-auto h-12 w-12 mb-2 opacity-20" />
                            <p>No certifications added yet.</p>
                            <p className="text-sm">Click the button above to add your first certification.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {formData.certifications.map((cert, index) => (
                              <div key={cert.id} className="border rounded-lg p-4 relative group">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{cert.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {cert.issuer}
                                      {cert.date && ` • ${new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`}
                                    </p>
                                    {cert.url && (
                                      <a
                                        href={cert.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline inline-block mt-1"
                                      >
                                        View Credential
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditCertification(index)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveCertification(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Import/Export Modals - Moved to root level */}
      <ImportResumeModal
        open={showImportModal}
        onOpenChange={(open) => {
          console.log('Import modal open state:', open);
          setShowImportModal(open);
        }}
      />

      <ExportResumeModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        resumeData={formData}
      />
    </div>
  );
};

export default ResumeWizard;
