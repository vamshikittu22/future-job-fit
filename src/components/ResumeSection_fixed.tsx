import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  User, 
  FileText, 
  Code, 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Trophy, 
  Award,
  Sparkles,
  GripVertical
} from "lucide-react";

const sectionIcons = {
  personal: User,
  summary: FileText,
  skills: Code,
  experience: Briefcase,
  education: GraduationCap,
  projects: FolderOpen,
  achievements: Trophy,
  certifications: Award
};

interface ResumeSectionProps {
  sectionId: string;
  index: number;
  resumeData: any;
  updateResumeData: (section: string, data: any) => void;
  isActive: boolean;
  onActivate: () => void;
}

export default function ResumeSection({
  sectionId,
  index,
  resumeData,
  updateResumeData,
  isActive,
  onActivate
}: ResumeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(isActive);
  const [newSkill, setNewSkill] = useState("");
  const Icon = sectionIcons[sectionId as keyof typeof sectionIcons];

  const handlePersonalInfoChange = (field: string, value: string) => {
    updateResumeData('personalInfo', {
      ...(resumeData.personalInfo || {}),
      [field]: value
    });
  };

  const handleSkillsChange = (skills: string[]) => {
    updateResumeData('skills', skills);
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !(resumeData.skills || []).includes(skill.trim())) {
      handleSkillsChange([...(resumeData.skills || []), skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleSkillsChange((resumeData.skills || []).filter((skill: string) => skill !== skillToRemove));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      duration: "",
      bullets: [""]
    };
    updateResumeData('experience', [...(resumeData.experience || []), newExp]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = (resumeData.experience || []).map((exp: any) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateResumeData('experience', updated);
  };

  const removeExperience = (id: string) => {
    updateResumeData('experience', (resumeData.experience || []).filter((exp: any) => exp.id !== id));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      tech: "",
      duration: "",
      bullets: [""]
    };
    updateResumeData('projects', [...(resumeData.projects || []), newProject]);
  };

  const updateProject = (id: string, field: string, value: any) => {
    const updated = (resumeData.projects || []).map((proj: any) =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    updateResumeData('projects', updated);
  };

  const removeProject = (id: string) => {
    updateResumeData('projects', (resumeData.projects || []).filter((proj: any) => proj.id !== id));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      year: "",
      gpa: ""
    };
    updateResumeData('education', [...(resumeData.education || []), newEdu]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    const updated = (resumeData.education || []).map((edu: any) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateResumeData('education', updated);
  };

  const removeEducation = (id: string) => {
    updateResumeData('education', (resumeData.education || []).filter((edu: any) => edu.id !== id));
  };

  const addAchievement = () => {
    const newAchievement = {
      id: Date.now().toString(),
      title: "",
      description: "",
      date: "",
      organization: ""
    };
    updateResumeData('achievements', [...(resumeData.achievements || []), newAchievement]);
  };

  const updateAchievement = (id: string, field: string, value: string) => {
    const updated = (resumeData.achievements || []).map((achievement: any) =>
      achievement.id === id ? { ...achievement, [field]: value } : achievement
    );
    updateResumeData('achievements', updated);
  };

  const removeAchievement = (id: string) => {
    updateResumeData('achievements', (resumeData.achievements || []).filter((achievement: any) => achievement.id !== id));
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      link: ""
    };
    updateResumeData('certifications', [...(resumeData.certifications || []), newCert]);
  };

  const updateCertification = (id: string, field: string, value: string) => {
    const updated = (resumeData.certifications || []).map((cert: any) =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    updateResumeData('certifications', updated);
  };

  const removeCertification = (id: string) => {
    updateResumeData('certifications', (resumeData.certifications || []).filter((cert: any) => cert.id !== id));
  };

  const renderPersonalInfo = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={resumeData.personalInfo?.name || ''}
          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={resumeData.personalInfo?.email || ''}
          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="+1 (555) 123-4567"
          value={resumeData.personalInfo?.phone || ''}
          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, State"
          value={resumeData.personalInfo?.location || ''}
          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          placeholder="linkedin.com/in/johndoe"
          value={resumeData.personalInfo?.linkedin || ''}
          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          placeholder="johndoe.com"
          value={resumeData.personalInfo?.website || ''}
          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div>
      <Label htmlFor="summary">Professional Summary</Label>
      <Textarea
        id="summary"
        placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        rows={4}
        value={typeof resumeData.summary === 'string' ? resumeData.summary : resumeData.summary?.summary || ''}
        onChange={(e) => updateResumeData('summary', e.target.value)}
      />
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Polish
        </Button>
      </div>
    </div>
  );

  const renderSkills = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Technical Skills</Label>
          <p className="text-xs text-muted-foreground mb-3">Add your technical skills, programming languages, frameworks, and tools</p>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., React, Python, AWS..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newSkill.trim()) {
                  addSkill(newSkill);
                  setNewSkill("");
                }
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (newSkill.trim()) {
                addSkill(newSkill);
                setNewSkill("");
              }
            }}
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
        
        {(resumeData.skills || []).length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Your Skills ({(resumeData.skills || []).length})</Label>
            <div className="flex flex-wrap gap-2">
              {(resumeData.skills || []).map((skill: string, index: number) => (
                <Badge
                  key={`skill-${index}`}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 hover:bg-secondary/80 transition-colors"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {(resumeData.skills || []).length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
            <Code className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No skills added yet</p>
            <p className="text-xs text-muted-foreground">Add your first skill above</p>
          </div>
        )}
      </div>
    );
  };

  const renderExperience = () => (
    <div className="space-y-6">
      <Button
        onClick={addExperience}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Work Experience
      </Button>
      
      {(resumeData.experience || []).map((exp: any, index: number) => (
        <Card key={exp.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <Input
                  placeholder="Job Title"
                  value={exp.title || ''}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                />
                <Input
                  placeholder="Company Name"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                />
                <Input
                  placeholder="Location"
                  value={exp.location || ''}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                />
                <Input
                  placeholder="Duration (e.g., Jan 2020 - Present)"
                  value={exp.duration || ''}
                  onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div>
              <Label>Key Achievements & Responsibilities</Label>
              {(exp.bullets || []).map((bullet: string, bulletIndex: number) => (
                <div key={bulletIndex} className="flex gap-2 mt-2">
                  <Textarea
                    placeholder="• Describe your achievement or responsibility..."
                    value={bullet}
                    onChange={(e) => {
                      const newBullets = [...exp.bullets];
                      newBullets[bulletIndex] = e.target.value;
                      updateExperience(exp.id, 'bullets', newBullets);
                    }}
                    rows={2}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newBullets = exp.bullets.filter((_: any, i: number) => i !== bulletIndex);
                      updateExperience(exp.id, 'bullets', newBullets);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newBullets = [...(exp.bullets || []), ""];
                  updateExperience(exp.id, 'bullets', newBullets);
                }}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bullet Point
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <Button
        onClick={addEducation}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Education
      </Button>
      
      {(resumeData.education || []).map((edu: any, index: number) => (
        <Card key={edu.id} className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Degree (e.g., Bachelor of Science)"
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  />
                  <Input
                    placeholder="School/University"
                    value={edu.school || ''}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Graduation Year"
                    value={edu.year || ''}
                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                  />
                  <Input
                    placeholder="GPA (optional)"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <Button
        onClick={addProject}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Project
      </Button>
      
      {(resumeData.projects || []).map((project: any, index: number) => (
        <Card key={project.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <Input
                  placeholder="Project Name"
                  value={project.name || ''}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                />
                <Input
                  placeholder="Technologies Used"
                  value={project.tech || ''}
                  onChange={(e) => updateProject(project.id, 'tech', e.target.value)}
                />
                <Input
                  placeholder="Duration"
                  value={project.duration || ''}
                  onChange={(e) => updateProject(project.id, 'duration', e.target.value)}
                />
                <Input
                  placeholder="Project Link (optional)"
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div>
              <Label>Project Description & Key Features</Label>
              {(project.bullets || []).map((bullet: string, bulletIndex: number) => (
                <div key={bulletIndex} className="flex gap-2 mt-2">
                  <Textarea
                    placeholder="• Describe project features, technologies, or achievements..."
                    value={bullet}
                    onChange={(e) => {
                      const newBullets = [...project.bullets];
                      newBullets[bulletIndex] = e.target.value;
                      updateProject(project.id, 'bullets', newBullets);
                    }}
                    rows={2}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newBullets = project.bullets.filter((_: any, i: number) => i !== bulletIndex);
                      updateProject(project.id, 'bullets', newBullets);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newBullets = [...(project.bullets || []), ""];
                  updateProject(project.id, 'bullets', newBullets);
                }}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Description Point
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Achievements & Accomplishments</Label>
        <p className="text-xs text-muted-foreground mb-3">Add your notable achievements, awards, and accomplishments</p>
      </div>
      
      <Button
        type="button"
        variant="outline"
        onClick={addAchievement}
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Achievement
      </Button>
      
      {(resumeData.achievements || []).length > 0 && (
        <div className="space-y-3">
          {(resumeData.achievements || []).map((achievement: any, index: number) => (
            <Card key={achievement.id || index} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Achievement title (e.g., Employee of the Year)"
                      value={achievement.title || ''}
                      onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                    />
                    <Textarea
                      placeholder="Describe your achievement and its impact..."
                      value={achievement.description || ''}
                      onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Date (e.g., 2023)"
                        value={achievement.date || ''}
                        onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)}
                      />
                      <Input
                        placeholder="Organization (optional)"
                        value={achievement.organization || ''}
                        onChange={(e) => updateAchievement(achievement.id, 'organization', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(achievement.id)}
                    className="ml-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {(resumeData.achievements || []).length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No achievements added yet</p>
          <p className="text-xs text-muted-foreground">Click "Add Achievement" to get started</p>
        </div>
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Certifications & Licenses</Label>
        <p className="text-xs text-muted-foreground mb-3">Add your professional certifications, licenses, and credentials</p>
      </div>
      
      <Button
        type="button"
        variant="outline"
        onClick={addCertification}
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Certification
      </Button>
      
      {(resumeData.certifications || []).length > 0 && (
        <div className="space-y-3">
          {(resumeData.certifications || []).map((cert: any, index: number) => (
            <Card key={cert.id || index} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Certification name (e.g., AWS Solutions Architect)"
                      value={cert.name || ''}
                      onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Issuing organization"
                        value={cert.issuer || ''}
                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      />
                      <Input
                        placeholder="Date obtained"
                        value={cert.date || ''}
                        onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Credential URL or ID (optional)"
                      value={cert.link || ''}
                      onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(cert.id)}
                    className="ml-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {(resumeData.certifications || []).length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No certifications added yet</p>
          <p className="text-xs text-muted-foreground">Click "Add Certification" to get started</p>
        </div>
      )}
    </div>
  );

  const renderSectionContent = () => {
    switch (sectionId) {
      case "personal":
        return renderPersonalInfo();
      case "summary":
        return renderSummary();
      case "skills":
        return renderSkills();
      case "experience":
        return renderExperience();
      case "education":
        return renderEducation();
      case "projects":
        return renderProjects();
      case "achievements":
        return renderAchievements();
      case "certifications":
        return renderCertifications();
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Section content not implemented yet</p>
          </div>
        );
    }
  };

  const getSectionTitle = (id: string) => {
    const titles: { [key: string]: string } = {
      personal: "Personal Information",
      summary: "Professional Summary",
      skills: "Technical Skills",
      experience: "Work Experience",
      education: "Education",
      projects: "Projects",
      achievements: "Achievements",
      certifications: "Certifications"
    };
    return titles[id] || id.charAt(0).toUpperCase() + id.slice(1);
  };

  return (
    <Draggable draggableId={sectionId} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-6"
        >
          <Card className={`transition-all duration-200 ${isActive ? 'ring-2 ring-primary' : ''}`}>
            <div
              {...provided.dragHandleProps}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                onActivate();
                setIsExpanded(!isExpanded);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">
                    {getSectionTitle(sectionId)}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Polish
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {isExpanded && (
              <>
                <Separator />
                <div className="p-6">
                  {renderSectionContent()}
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
}
