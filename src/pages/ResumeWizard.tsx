import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ResumeData } from '@/lib/initialData';

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
  icon: React.ReactNode;
  value: string;
};

// Icons
import { 
  User, Briefcase, GraduationCap, Code, Award, FileText, Plus, X, 
  Pencil, Trash2, Mail, Phone, MapPin, Globe, Linkedin, Github, Share2,
  Calendar, CheckCircle, ChevronLeft, ChevronRight, Upload, Star, Folder, BadgeCheck
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useResume } from '@/contexts/ResumeContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

// Sidebar Component
const Sidebar = ({ sections, activeTab, onTabChange }: { 
  sections: Section[], 
  activeTab: string, 
  onTabChange: (value: string) => void 
}) => {
  return (
    <div className="w-64 border-r h-screen fixed left-0 top-0 p-4 bg-background overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 p-2">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">Resume Builder</h2>
        </div>
        
        <div className="space-y-1">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeTab === section.value ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${activeTab === section.value ? 'bg-accent' : ''}`}
              onClick={() => onTabChange(section.value)}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </Button>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="p-2 space-y-2">
          <Button variant="outline" className="w-full" onClick={() => window.print()}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <Button className="w-full" size="sm">
            Save & Exit
          </Button>
        </div>
      </div>
    </div>
  );
};

const ResumeWizard = () => {
  // Hooks - Single declarations only
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resumeData, updateResumeData } = useResume();
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  
  // Form Data State
  const [formData, setFormData] = useState<ResumeData>(() => ({
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
  }));

  // Form State
  const [newSkill, setNewSkill] = useState({ category: 'languages' as const, value: '' });
  const [editingExperience, setEditingExperience] = useState<number | null>(null);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  
  // Form states for experience and education
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

  // Update context when form data changes
  useEffect(() => {
    if (updateResumeData) {
      updateResumeData('personal', formData.personal);
      updateResumeData('summary', formData.summary);
      updateResumeData('experience', formData.experience);
      updateResumeData('education', formData.education);
      updateResumeData('skills', formData.skills);
      updateResumeData('projects', formData.projects);
      updateResumeData('achievements', formData.achievements);
      updateResumeData('certifications', formData.certifications);
    }
  }, [formData, updateResumeData]);
  
  // Load initial data from context
  useEffect(() => {
    if (resumeData) {
      setFormData(prev => ({
        ...prev,
        ...resumeData,
        // Ensure all required fields are present
        personal: {
          name: resumeData.personal?.name || '',
          email: resumeData.personal?.email || '',
          phone: resumeData.personal?.phone || '',
          location: resumeData.personal?.location || '',
          website: resumeData.personal?.website || '',
          linkedin: resumeData.personal?.linkedin || '',
          github: resumeData.personal?.github || ''
        },
        skills: {
          languages: [],
          frameworks: [],
          tools: [],
          ...resumeData.skills
        },
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        summary: resumeData.summary || ''
      }));
    }
  }, [resumeData]);
  
  // Handle experience form changes
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setExperienceForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  // Handle education form changes
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle adding a new skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.value.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [newSkill.category]: [...prev.skills[newSkill.category], newSkill.value.trim()]
        }
      }));
      setNewSkill({ ...newSkill, value: '' });
    }
  };
  
  // Handle removing a skill
  const handleRemoveSkill = (category: keyof Skills, index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };
  
  // Education form state
  const [educationForm, setEducationForm] = useState<Omit<Education, 'id'>>({
    degree: '',
    school: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // Handle loading experience data for editing
  useEffect(() => {
    if (isExperienceDialogOpen) {
      if (editingExperience !== null) {
        const exp = formData.experience[editingExperience];
        const { id, ...expData } = exp;
        setExperienceForm(expData);
      } else {
        setExperienceForm({
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          current: false
        });
      }
    }
  }, [isExperienceDialogOpen, editingExperience, formData.experience]);
  
  // Handle loading education data for editing
  useEffect(() => {
    if (isEducationDialogOpen) {
      if (editingEducation !== null) {
        const edu = formData.education[editingEducation];
        const { id, ...eduData } = edu;
        setEducationForm({
          ...eduData,
          description: eduData.description || ''
        });
      } else {
        setEducationForm({
          degree: '',
          school: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          description: ''
        });
      }
    }
  }, [isEducationDialogOpen, editingEducation, formData.education]);
  
  // Handle skill changes
  const handleSkillChange = (category: 'languages' | 'frameworks' | 'tools', index: number, value: string) => {
    const updatedSkills = { ...formData.skills };
    updatedSkills[category] = [...updatedSkills[category]];
    updatedSkills[category][index] = value;
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };
  
  // Add a new skill
  const handleAddSkill = (category: 'languages' | 'frameworks' | 'tools') => {
    const updatedSkills = { ...formData.skills };
    updatedSkills[category] = [...updatedSkills[category], ''];
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };
  
  // Remove a skill
  const handleRemoveSkill = (category: 'languages' | 'frameworks' | 'tools', index: number) => {
    const updatedSkills = { ...formData.skills };
    updatedSkills[category] = updatedSkills[category].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  // State for form data and UI
  const [formData, setFormData] = useState<ResumeData>({
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: {
      languages: [],
      frameworks: [],
      tools: []
    },
    projects: [],
    achievements: [],
    certifications: []
  });

  // Dialog states
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<number | null>(null);
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState('');
  
  // Form State
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

  // Hooks
  const navigate = useNavigate();
  const { updateResumeData } = useResume();
  const { toast } = useToast();

  // Handle input changes for personal info
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [name]: value
      }
    }));
  };
      }
    }));
  };

  // Handle experience form changes
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    setExperienceForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value
    }));
  };

  // Handle education form changes
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding a new skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSkill = newSkill.value.trim();
    const category = newSkill.category as keyof Skills;
    
    if (trimmedSkill) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...(prev.skills[category] || []), trimmedSkill]
        }
      }));
      
      setNewSkill(prev => ({ ...prev, value: '' }));
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (category: keyof Skills, index: number) => {
    const updatedSkills = {
      ...formData.skills,
      [category]: formData.skills[category].filter((_, i) => i !== index)
    };
    
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure required fields are present
    if (!experienceForm.title || !experienceForm.company || !experienceForm.startDate) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields (Title, Company, Start Date)',
        variant: 'destructive',
      });
      return;
    }
   // Handle editing experience
  const handleEditExperience = (index: number) => {
    setEditingExperience(index);
    const exp = formData.experience[index];
    const { id, ...expData } = exp;
    setExperienceForm(expData);
    setIsExperienceDialogOpen(true);
  };

  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure required fields are present
    if (!educationForm.degree || !educationForm.school || !educationForm.startDate) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields (Degree, School, Start Date)',
        variant: 'destructive',
      });
      return;
    }
   // Handle saving experience
  const handleSaveExperience = () => {
    if (editingExperience !== null) {
      const updatedExperience = [...formData.experience];
      updatedExperience[editingExperience] = {
        ...experienceForm,
        id: formData.experience[editingExperience].id
      };
      
      setFormData(prev => ({
        ...prev,
        experience: updatedExperience
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        experience: [
          ...prev.experience,
          {
            ...experienceForm,
            id: uuidv4()
          } as Experience
        ]
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

  // Handle editing education
  const handleEditEducation = (index: number) => {
    setEditingEducation(index);
    const edu = formData.education[index];
    const { id, ...eduData } = edu;
    setEducationForm(eduData);
    setIsEducationDialogOpen(true);
  };

  // Handle saving education
  const handleSaveEducation = () => {
    if (editingEducation !== null) {
      const updatedEducation = [...formData.education];
      updatedEducation[editingEducation] = {
        ...educationForm,
        id: formData.education[editingEducation].id
      } as Education;
      
      setFormData(prev => ({
        ...prev,
        education: updatedEducation
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        education: [
          ...prev.education,
          {
            ...educationForm,
            id: uuidv4()
          } as Education
        ]
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
    
    setIsEducationDialogOpen(false);
    setEditingEducation(null);
  };

  const handleDeleteExperience = (id: string) => {
    const updatedExperience = formData.experience.filter(exp => exp.id !== id);
    setFormData(prev => ({
      ...prev,
      experience: updatedExperience
    }));
    
    // Update the context
    if (updateResumeData) {
      updateResumeData('experience', updatedExperience);
    }
  };

  const handleDeleteEducation = (id: string) => {
    const updatedEducation = formData.education.filter(edu => edu.id !== id);
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));
    
    // Update the context
    if (updateResumeData) {
      updateResumeData('education', updatedEducation);
    }
  };

  const handleCreateResume = () => {
    if (!updateResumeData) {
      console.error('updateResumeData is not defined');
      return;
    }
    
    // Save the final state to context by updating each section
    updateResumeData('personal', formData.personal);
    updateResumeData('summary', formData.summary);
    updateResumeData('experience', formData.experience);
    updateResumeData('education', formData.education);
    updateResumeData('skills', formData.skills);
    updateResumeData('projects', formData.projects);
    updateResumeData('achievements', formData.achievements);
    updateResumeData('certifications', formData.certifications);
    
    setIsLoading(true);
    
    // Navigate after a short delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/create-resume');
      toast({
        title: "Resume created",
        description: "You can now continue editing your resume.",
      });
    }, 1000);
  };

  // Update context when form data changes
  useEffect(() => {
    updateResumeData(formData);
  }, [formData]);

  const sidebarItems = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'preview', label: 'Preview' }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Resume Wizard</h2>
          <p className="text-sm text-muted-foreground">Step-by-step resume builder</p>
        </div>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-2 space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button 
            className="w-full" 
            onClick={handleCreateResume}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Section */}
        <ScrollArea className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Tabs value={activeTab} className="space-y-6">
              {/* Personal Info */}
              <TabsContent value="personal" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Tell us about yourself
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      updateResumeData(formData);
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title *</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Software Engineer"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="(123) 456-7890"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          name="summary"
                          value={formData.summary}
                          onChange={handleInputChange}
                          placeholder="A passionate software engineer with 5+ years of experience..."
                          className="min-h-[120px]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="submit">
                          Save
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Experience */}
              <TabsContent value="experience" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      List your work history
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {formData.experience?.length > 0 ? (
                        formData.experience.map((exp) => (
                          <div key={exp.id} className="border rounded-lg p-4 relative group">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{exp.title || 'Job Title'}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {exp.company} {exp.location && `• ${exp.location}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </p>
                                {exp.description && (
                                  <p className="mt-2 text-sm whitespace-pre-line">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleEditExperience(exp)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteExperience(exp.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            No work experience added yet.
                          </p>
                        </div>
                      )}
                      <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full mt-4">
                            <Plus className="h-4 w-4 mr-2" /> Add Experience
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingExperience ? 'Edit Experience' : 'Add Experience'}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleExperienceSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="exp-title">Job Title *</Label>
                                <Input
                                  id="exp-title"
                                  name="title"
                                  value={experienceForm.title}
                                  onChange={handleExperienceChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="exp-company">Company *</Label>
                                <Input
                                  id="exp-company"
                                  name="company"
                                  value={experienceForm.company}
                                  onChange={handleExperienceChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="exp-location">Location</Label>
                                <Input
                                  id="exp-location"
                                  name="location"
                                  value={experienceForm.location}
                                  onChange={handleExperienceChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="exp-start">Start Date *</Label>
                                <Input
                                  id="exp-start"
                                  type="month"
                                  name="startDate"
                                  value={experienceForm.startDate}
                                  onChange={handleExperienceChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="exp-end">End Date</Label>
                                <Input
                                  id="exp-end"
                                  type="month"
                                  name="endDate"
                                  value={experienceForm.endDate}
                                  onChange={handleExperienceChange}
                                  disabled={experienceForm.current}
                                />
                              </div>
                              <div className="flex items-end">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="exp-current"
                                    name="current"
                                    checked={experienceForm.current}
                                    onChange={handleExperienceChange}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <Label htmlFor="exp-current">I currently work here</Label>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="exp-description">Description</Label>
                              <Textarea
                                id="exp-description"
                                name="description"
                                value={experienceForm.description}
                                onChange={handleExperienceChange}
                                placeholder="Describe your responsibilities and achievements..."
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsExperienceDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">
                                {editingExperience ? 'Update' : 'Add'} Experience
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education */}
              <TabsContent value="education" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Add your educational background
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {formData.education?.length > 0 ? (
                        formData.education.map((edu) => (
                          <div key={edu.id} className="border rounded-lg p-4 relative group">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{edu.degree || 'Degree'}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {edu.school} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {edu.startDate} - {edu.endDate || 'Present'}
                                </p>
                                {edu.description && (
                                  <p className="mt-2 text-sm whitespace-pre-line">
                                    {edu.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleEditEducation(edu)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteEducation(edu.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            No education information added yet.
                          </p>
                        </div>
                      )}
                      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full mt-4">
                            <Plus className="h-4 w-4 mr-2" /> Add Education
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingEducation ? 'Edit Education' : 'Add Education'}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEducationSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edu-degree">Degree *</Label>
                                <Input
                                  id="edu-degree"
                                  name="degree"
                                  value={educationForm.degree}
                                  onChange={handleEducationChange}
                                  placeholder="e.g., Bachelor of Science"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edu-school">School/University *</Label>
                                <Input
                                  id="edu-school"
                                  name="school"
                                  value={educationForm.school}
                                  onChange={handleEducationChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edu-field">Field of Study</Label>
                                <Input
                                  id="edu-field"
                                  name="fieldOfStudy"
                                  value={educationForm.fieldOfStudy}
                                  onChange={handleEducationChange}
                                  placeholder="e.g., Computer Science"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edu-start">Start Date *</Label>
                                <Input
                                  id="edu-start"
                                  type="month"
                                  name="startDate"
                                  value={educationForm.startDate}
                                  onChange={handleEducationChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edu-end">End Date (or expected)</Label>
                                <Input
                                  id="edu-end"
                                  type="month"
                                  name="endDate"
                                  value={educationForm.endDate}
                                  onChange={handleEducationChange}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edu-description">Description</Label>
                              <Textarea
                                id="edu-description"
                                name="description"
                                value={educationForm.description}
                                onChange={handleEducationChange}
                                placeholder="Notable achievements, coursework, or activities..."
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEducationDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">
                                {editingEducation ? 'Update' : 'Add'} Education
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills */}
              <TabsContent value="skills" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Add your professional skills
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <form onSubmit={handleAddSkill} className="flex gap-2">
                        <Input 
                          placeholder="Add a skill" 
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <Button type="submit">Add</Button>
                      </form>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills?.length > 0 ? (
                          formData.skills.map((skill, index) => (
                            <div key={index} className="relative group">
                              <div className="bg-secondary px-3 py-1 rounded-full text-sm pr-8">
                                {skill}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">
                              No skills added yet. Add your first skill above.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Example: JavaScript, React, Project Management
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preview */}
              <TabsContent value="preview" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Resume Preview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      This is how your resume will look
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-6">
                      <h2 className="text-2xl font-bold">{formData.name || 'Your Name'}</h2>
                      <p className="text-muted-foreground">{formData.title || 'Job Title'}</p>
                      
                      <div className="mt-4 space-y-2">
                        <p className="text-sm">{formData.email || 'email@example.com'}</p>
                        <p className="text-sm">{formData.phone || '(123) 456-7890'}</p>
                        <p className="text-sm">{formData.location || 'City, Country'}</p>
                      </div>

                      <Separator className="my-6" />

                      {formData.summary && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2">Summary</h3>
                          <p className="text-muted-foreground">{formData.summary}</p>
                        </div>
                      )}

                      {/* Add more preview sections as needed */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </ScrollArea>

        {/* Preview Panel */}
        <div className="w-1/3 border-l bg-muted/50 p-6 overflow-y-auto">
          <div className="sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{formData.name || 'Your Name'}</h2>
                {formData.title && (
                  <p className="text-lg text-muted-foreground">{formData.title}</p>
                )}
              </div>
              
              <div className="mt-4 space-y-1 text-sm">
                {formData.email && <p className="flex items-center"><Mail className="h-4 w-4 mr-2" /> {formData.email}</p>}
                {formData.phone && <p className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {formData.phone}</p>}
                {formData.location && <p className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {formData.location}</p>}
              </div>

              {(formData.email || formData.phone || formData.location) && (
                <Separator className="my-4" />
              )}

              {formData.summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{formData.summary}</p>
                </div>
              )}

              {formData.experience?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-1">Experience</h3>
                  <div className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        <p className="text-sm font-medium">{exp.company} {exp.location && `• ${exp.location}`}</p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">
                            {exp.description}
                          </p>
                        )}
                        {index < formData.experience.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.education?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-1">Education</h3>
                  <div className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {edu.school} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">
                            {edu.description}
                          </p>
                        )}
                        {index < formData.education.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.skills?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-secondary px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeWizard;
