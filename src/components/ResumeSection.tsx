import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  User,
  FileText,
  Code,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Trophy,
  Award
} from "lucide-react";

interface ResumeSectionProps {
  sectionId: string;
  index: number;
  resumeData: any;
  updateResumeData: (section: string, data: any) => void;
  isActive: boolean;
  onActivate: () => void;
}

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

export default function ResumeSection({
  sectionId,
  index,
  resumeData,
  updateResumeData,
  isActive,
  onActivate
}: ResumeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(isActive);
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
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      handleSkillsChange([...resumeData.skills, skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleSkillsChange(resumeData.skills.filter((skill: string) => skill !== skillToRemove));
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
    updateResumeData('experience', [...resumeData.experience, newExp]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = resumeData.experience.map((exp: any) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateResumeData('experience', updated);
  };

  const removeExperience = (id: string) => {
    updateResumeData('experience', resumeData.experience.filter((exp: any) => exp.id !== id));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      tech: "",
      duration: "",
      bullets: [""]
    };
    updateResumeData('projects', [...resumeData.projects, newProject]);
  };

  const updateProject = (id: string, field: string, value: any) => {
    const updated = resumeData.projects.map((proj: any) =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    updateResumeData('projects', updated);
  };

  const removeProject = (id: string) => {
    updateResumeData('projects', resumeData.projects.filter((proj: any) => proj.id !== id));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      year: "",
      gpa: ""
    };
    updateResumeData('education', [...resumeData.education, newEdu]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    const updated = resumeData.education.map((edu: any) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateResumeData('education', updated);
  };

  const removeEducation = (id: string) => {
    updateResumeData('education', resumeData.education.filter((edu: any) => edu.id !== id));
  };

  const renderPersonalInfo = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={resumeData.personalInfo?.name || ''}
          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={resumeData.personalInfo?.email || ''}
          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={resumeData.personalInfo?.phone || ''}
          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={resumeData.personalInfo?.location || ''}
          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
          placeholder="New York, NY"
        />
      </div>
      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          value={resumeData.personalInfo?.linkedin || ''}
          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
        />
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={resumeData.personalInfo?.website || ''}
          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
          placeholder="www.johndoe.com"
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div>
      <Label htmlFor="summary">Professional Summary</Label>
      <Textarea
        id="summary"
        value={resumeData.summary}
        onChange={(e) => updateResumeData('summary', e.target.value)}
        placeholder="Experienced software engineer with expertise in..."
        className="min-h-[120px]"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">
          {resumeData.summary.length} characters
        </span>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Polish
        </Button>
      </div>
    </div>
  );

  const renderSkills = () => {
    const [newSkill, setNewSkill] = useState("");

    return (
      <div>
        <Label>Technical Skills</Label>
        <div className="flex gap-2 mb-4">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addSkill(newSkill);
                setNewSkill("");
              }
            }}
          />
          <Button
            variant="outline"
            onClick={() => {
              addSkill(newSkill);
              setNewSkill("");
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => (
    <div className="space-y-6">
      {resumeData.experience.map((exp: any, index: number) => (
        <Card key={exp.id} className="p-4 border-dashed">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Experience #{index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(exp.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Job Title</Label>
              <Input
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Tech Corp"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                placeholder="Jan 2022 - Present"
              />
            </div>
          </div>
          <div>
            <Label>Key Achievements</Label>
            {exp.bullets.map((bullet: string, bulletIndex: number) => (
              <div key={bulletIndex} className="flex gap-2 mb-2">
                <Input
                  value={bullet}
                  onChange={(e) => {
                    const newBullets = [...exp.bullets];
                    newBullets[bulletIndex] = e.target.value;
                    updateExperience(exp.id, 'bullets', newBullets);
                  }}
                  placeholder="• Improved system performance by 40%..."
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newBullets = exp.bullets.filter((_: string, i: number) => i !== bulletIndex);
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
                updateExperience(exp.id, 'bullets', [...exp.bullets, ""]);
              }}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bullet
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={addExperience}
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Experience
      </Button>
    </div>
  );

  const renderSectionContent = () => {
    switch (sectionId) {
      case 'personal':
        return renderPersonalInfo();
      case 'summary':
        return renderSummary();
      case 'skills':
        return renderSkills();
      case 'experience':
        return renderExperience();
      case 'education':
        return <div className="text-center py-8 text-muted-foreground">Education section coming soon...</div>;
      case 'projects':
        return <div className="text-center py-8 text-muted-foreground">Projects section coming soon...</div>;
      case 'achievements':
        return <div className="text-center py-8 text-muted-foreground">Achievements section coming soon...</div>;
      case 'certifications':
        return <div className="text-center py-8 text-muted-foreground">Certifications section coming soon...</div>;
      default:
        return null;
    }
  };

  return (
    <Draggable draggableId={sectionId} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-6"
        >
          <Card className={`transition-all duration-200 ${
            isActive ? 'ring-1 ring-primary shadow-accent' : 'hover:shadow-swiss'
          }`}>
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => {
                onActivate();
                setIsExpanded(!isExpanded);
              }}
            >
              <div className="flex items-center gap-3">
                <div {...provided.dragHandleProps} className="cursor-grab hover:cursor-grabbing">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold capitalize">
                  {sectionId.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Enhance
                </Button>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
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