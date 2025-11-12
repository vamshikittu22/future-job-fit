import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Plus, Briefcase, GraduationCap, Code, Award, Sparkles } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import PersonalInfo from "./personal-info/PersonalInfo";
import Summary from "./summary/Summary";
import { ExperienceList, ExperienceForm } from "./experience";
import { CertificationsForm } from "./forms/CertificationsForm";

const ResumeWizard = () => {
  const { resumeData, updateResumeData } = useResume();
  const [activeTab, setActiveTab] = useState("personal");
  
  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: <FileText className="h-4 w-4" /> },
    { id: 'summary', label: 'Summary', icon: <FileText className="h-4 w-4" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="h-4 w-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="h-4 w-4" /> },
    { id: 'ats', label: 'ATS Score', icon: <Sparkles className="h-4 w-4" /> },
  ];
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<number | null>(null);
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<number | null>(null);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateResumeData('personal', {
      ...resumeData.personal,
      [name]: value,
    });
  };

  const handleSummaryChange = (value: string) => {
    updateResumeData('summary', value);
  };

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const experienceData = {
      id: editingExperience !== null ? resumeData.experience[editingExperience].id : crypto.randomUUID(),
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      current: formData.get('current') === 'on',
      description: formData.get('description') as string,
    };

    const updatedExperiences = [...resumeData.experience];
    if (editingExperience !== null) {
      updatedExperiences[editingExperience] = experienceData;
    } else {
      updatedExperiences.push(experienceData);
    }

    updateResumeData('experience', updatedExperiences);
    setIsExperienceDialogOpen(false);
    setEditingExperience(null);
  };

  const handleEditExperience = (index: number) => {
    setEditingExperience(index);
    setIsExperienceDialogOpen(true);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = resumeData.experience.filter((_, i) => i !== index);
    updateResumeData('experience', updatedExperiences);
  };

  const handleCertificationsChange = (certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }>) => {
    updateResumeData('certifications', certifications);
  };

  const calculateCompletion = () => {
    const total = 100; // Total possible score
    let completed = 0;

    // Personal info
    if (resumeData.personal.name) completed += 10;
    if (resumeData.personal.email) completed += 5;
    if (resumeData.personal.phone) completed += 5;

    // Summary
    if (resumeData.summary) completed += 10;

    // Experience
    if (resumeData.experience.length > 0) completed += 30;

    // Education
    if (resumeData.education.length > 0) completed += 20;

    // Skills
    if (Array.isArray(resumeData.skills)) {
      if (resumeData.skills.length > 0) {
        completed += 20;
      }
    } else if (resumeData.skills && typeof resumeData.skills === 'object') {
      if ((resumeData.skills as any).technical?.length > 0 || 
          (resumeData.skills as any).soft?.length > 0 || 
          (resumeData.skills as any).languages?.length > 0 ||
          (resumeData.skills as any).frameworks?.length > 0 ||
          (resumeData.skills as any).tools?.length > 0) {
        completed += 20;
      }
    }

    return Math.min(Math.round((completed / total) * 100), 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Resume Builder</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium">{completionPercentage}% Complete</span>
              <Progress value={completionPercentage} className="h-2 w-24" />
            </div>
            <Button>Save Resume</Button>
          </div>
        </div>
      </header>

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
                  <TabsTrigger 
                    value="personal" 
                    className="w-full justify-start px-4 py-3"
                    onClick={() => setActiveTab("personal")}
                  >
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="summary" 
                    className="w-full justify-start px-4 py-3"
                    onClick={() => setActiveTab("summary")}
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className="w-full justify-start px-4 py-3"
                    onClick={() => setActiveTab("experience")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className="w-full justify-start px-4 py-3"
                    onClick={() => setActiveTab("education")}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className="w-full justify-start px-4 py-3"
                    onClick={() => setActiveTab("skills")}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger 
                    value="certifications" 
                    className="w-full justify-start px-4 py-3"
                    onClick={() => setActiveTab("certifications")}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Certifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ats" 
                    className="w-full justify-start px-4 py-3"
                    onClick={() => setActiveTab("ats")}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    ATS Score
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {activeTab === 'personal' && 'Personal Information'}
                  {activeTab === 'summary' && 'Professional Summary'}
                  {activeTab === 'experience' && 'Work Experience'}
                  {activeTab === 'education' && 'Education'}
                  {activeTab === 'skills' && 'Skills'}
                  {activeTab === 'certifications' && 'Certifications'}
                  {activeTab === 'ats' && 'ATS Score'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'personal' && 'Tell us about yourself'}
                  {activeTab === 'summary' && 'Write a brief overview of your professional background'}
                  {activeTab === 'experience' && 'List your work experience in reverse chronological order'}
                  {activeTab === 'education' && 'Add your educational background'}
                  {activeTab === 'skills' && 'List your skills and proficiencies'}
                  {activeTab === 'certifications' && 'Add your professional certifications and licenses'}
                  {activeTab === 'ats' && 'Check your resume\'s ATS compatibility'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'personal' && (
                  <PersonalInfo 
                    data={resumeData.personal} 
                    onChange={handlePersonalChange} 
                  />
                )}
                
                {activeTab === 'summary' && (
                  <Summary 
                    value={resumeData.summary} 
                    onChange={handleSummaryChange} 
                  />
                )}
                
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Work Experience</h3>
                      <Button 
                        onClick={() => {
                          setEditingExperience(null);
                          setIsExperienceDialogOpen(true);
                        }}
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Experience
                      </Button>
                    </div>
                    <ExperienceList 
                      experiences={resumeData.experience || []}
                      onEdit={handleEditExperience}
                      onRemove={handleRemoveExperience}
                    />
                    {isExperienceDialogOpen && (
                      <ExperienceForm
                        experience={editingExperience !== null ? resumeData.experience[editingExperience] : {}}
                        onSubmit={handleExperienceSubmit}
                        onChange={() => {}}
                        isEditing={editingExperience !== null}
                        onCancel={() => {
                          setIsExperienceDialogOpen(false);
                          setEditingExperience(null);
                        }}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'certifications' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Professional Certifications</h3>
                    </div>
                    <CertificationsForm 
                      certifications={resumeData.certifications || []}
                      onChange={handleCertificationsChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeWizard;
