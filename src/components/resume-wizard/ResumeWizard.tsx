import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Plus } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import PersonalInfo from "./personal-info/PersonalInfo";
import Summary from "./summary/Summary";
import { ExperienceList, ExperienceForm } from "./experience";

const ResumeWizard = () => {
  const { resumeData, updateResumeData } = useResume();
  const [activeTab, setActiveTab] = useState("personal");
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<number | null>(null);

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
    if (resumeData.skills.technical.length > 0 || 
        resumeData.skills.soft.length > 0 || 
        resumeData.skills.languages.length > 0) {
      completed += 20;
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
                    Experience
                  </TabsTrigger>
                  {/* Add other sections as needed */}
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
                </CardTitle>
                <CardDescription>
                  {activeTab === 'personal' && 'Tell us about yourself'}
                  {activeTab === 'summary' && 'Write a brief overview of your professional background'}
                  {activeTab === 'experience' && 'List your work experience in reverse chronological order'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  {/* Personal Info Tab */}
                  <TabsContent value="personal" className="mt-0">
                    <PersonalInfo 
                      data={resumeData.personal} 
                      onChange={handlePersonalChange} 
                    />
                  </TabsContent>

                  {/* Summary Tab */}
                  <TabsContent value="summary" className="mt-0">
                    <Summary 
                      value={resumeData.summary} 
                      onChange={handleSummaryChange} 
                    />
                  </TabsContent>

                  {/* Experience Tab */}
                  <TabsContent value="experience">
                    <ExperienceList 
                      experiences={resumeData.experience}
                      onEdit={handleEditExperience}
                      onRemove={handleRemoveExperience}
                    />
                    
                    <Button 
                      className="mt-6" 
                      onClick={() => {
                        setEditingExperience(null);
                        setIsExperienceDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Experience
                    </Button>

                    {/* Experience Form Dialog */}
                    <ExperienceForm 
                      experience={editingExperience !== null ? resumeData.experience[editingExperience] : {}}
                      onSubmit={handleExperienceSubmit}
                      onChange={(field, value) => {
                        // Handle form field changes
                        const updatedExperience = editingExperience !== null 
                          ? { ...resumeData.experience[editingExperience], [field]: value }
                          : { [field]: value };
                        
                        if (editingExperience !== null) {
                          const updatedExperiences = [...resumeData.experience];
                          updatedExperiences[editingExperience] = updatedExperience as any;
                          updateResumeData('experience', updatedExperiences);
                        }
                      }}
                      isEditing={editingExperience !== null}
                      onCancel={() => {
                        setIsExperienceDialogOpen(false);
                        setEditingExperience(null);
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeWizard;
