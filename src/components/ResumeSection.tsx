import { useState, useEffect, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Pencil, X, Check, ChevronDown, ChevronUp, GripVertical, FileText, Briefcase, GraduationCap, FolderOpen, Trophy, Award, User, Code, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define the SkillCategoryType interface
interface SkillCategoryProps {
  category: {
    id: string;
    name: string;
    items: string[];
  };
  onUpdate: (id: string, updates: { name?: string; items?: string[] }) => void;
  onRemove: (id: string) => void;
  onAddSkill: (categoryId: string, skill: string) => void;
  onRemoveSkill: (categoryId: string, skillIndex: number) => void;
}

// Define the SkillCategoryType interface
interface SkillCategoryType {
  id: string;
  name: string;
  items: string[];
}

const PREDEFINED_CATEGORIES: SkillCategoryType[] = [
  { id: 'frontend', name: 'Frontend', items: [] },
  { id: 'backend', name: 'Backend', items: [] },
  { id: 'cloud', name: 'Cloud', items: [] },
  { id: 'databases', name: 'Databases', items: [] },
  { id: 'devops', name: 'DevOps', items: [] },
  { id: 'mobile', name: 'Mobile', items: [] },
  { id: 'testing', name: 'Testing', items: [] },
  { id: 'design', name: 'Design', items: [] },
  { id: 'languages', name: 'Languages', items: [] },
  { id: 'tools', name: 'Tools', items: [] }
];

const SkillCategory = ({ 
  category, 
  onUpdate, 
  onRemove,
  onAddSkill,
  onRemoveSkill 
}: SkillCategoryProps) => {
  const [newSkill, setNewSkill] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName]);

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAddSkill(category.id, newSkill);
      setNewSkill('');
    }
  };

  const handleUpdateName = () => {
    if (categoryName.trim()) {
      onUpdate(category.id, { name: categoryName });
    } else {
      setCategoryName(category.name);
    }
    setIsEditingName(false);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-3">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onBlur={handleUpdateName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateName();
                if (e.key === 'Escape') {
                  setCategoryName(category.name);
                  setIsEditingName(false);
                }
              }}
              className="h-8 w-48"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{category.name}</h3>
            <button 
              onClick={() => {
                setCategoryName(category.name);
                setIsEditingName(true);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              type="button"
              aria-label="Edit category name"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onRemove(category.id)}
          aria-label={`Remove ${category.name} category`}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Remove
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3 min-h-8">
        {category.items.length > 0 ? (
          category.items.map((skill, index) => (
            <Badge 
              key={`${category.id}-${index}`} 
              variant="secondary" 
              className="flex items-center gap-1.5 px-2.5 py-1 text-foreground/90 bg-muted hover:bg-muted/80"
            >
              {skill}
              <button 
                onClick={() => onRemoveSkill(category.id, index)}
                className="text-muted-foreground hover:text-destructive transition-colors rounded-full p-0.5 -mr-1.5"
                type="button"
                aria-label={`Remove ${skill} from ${category.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No skills added yet. Start typing below to add skills.
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <Input
          placeholder={`Add ${category.name} skill...`}
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            } else if (e.key === 'Escape') {
              setNewSkill('');
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="flex-1"
          aria-label={`Add skill to ${category.name}`}
        />
        <Button 
          type="button" 
          onClick={handleAdd}
          disabled={!newSkill.trim()}
          variant="outline"
          className="shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
};

const SkillPreview = ({ categories }: { categories: SkillCategoryType[] }) => (
  <div className="space-y-3">
    {categories.map((category) => (
      <div key={category.id} className="mb-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="text-sm font-semibold text-foreground leading-7">
            {category.name}:
          </h4>
          <div className="flex flex-wrap gap-1.5 items-center">
            {category.items.length > 0 ? (
              category.items.map((skill, index) => (
                <span 
                  key={`${category.id}-${index}`}
                  className="text-sm font-normal text-foreground/90"
                >
                  {skill}
                  {index < category.items.length - 1 ? ',' : ''}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground italic">
                No skills added
              </span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const sectionIcons = {
  personal: User,
  summary: FileText,
  skills: Code,
  experience: Briefcase,
  education: GraduationCap,
  projects: FolderOpen,
  achievements: Trophy,
  certifications: Award,
};

interface ResumeSectionProps {
  sectionId: string;
  index: number;
  resumeData: any;
  updateResumeData: (section: string, data: any) => void;
  isActive?: boolean;
  onActivate?: () => void;
  addCustomSection?: (section: any) => void;
  updateCustomSection?: (index: number, data: any) => void;
  removeCustomSection?: (id: string) => void;
}

const CustomSectionEditor = ({ section, onUpdate }: { section: any; onUpdate: (section: any) => void }) => {
  const updateItem = (itemId: string, field: string, value: string) => {
    onUpdate({
      ...section,
      items: section.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    });
  };

  const addItem = () => {
    onUpdate({
      ...section,
      items: [
        ...section.items,
        { id: Date.now().toString(), title: '', description: '' }
      ]
    });
  };

  const removeItem = (itemId: string) => {
    if (section.items.length > 1) {
      onUpdate({
        ...section,
        items: section.items.filter(item => item.id !== itemId)
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{section.title}</h3>
      </div>
      
      {section.description && (
        <p className="text-sm text-muted-foreground">{section.description}</p>
      )}

      <div className="space-y-4">
        {section.items.map((item: any) => (
          <div key={item.id} className="space-y-2 border rounded-lg p-4 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                  placeholder="Item title"
                />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  value={item.description || ''}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Item description"
                  rows={2}
                />
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => removeItem(item.id)}
              disabled={section.items.length <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={addItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );
};

const ResumeSection = ({
  sectionId,
  index,
  resumeData,
  updateResumeData,
  isActive = false,
  onActivate,
  addCustomSection,
  updateCustomSection,
  removeCustomSection,
}: ResumeSectionProps) => {
  // Find the custom section if this is a custom section
  const customSection = resumeData?.customSections?.find((s: any) => s.id === sectionId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [skillsData, setSkillsData] = useState<SkillCategoryType[]>([]);
  const [localCustomSections, setLocalCustomSections] = useState<any[]>(resumeData?.customSections || []);
  
  // Update local state when resumeData changes
  useEffect(() => {
    setLocalCustomSections(resumeData?.customSections || []);
  }, [resumeData?.customSections]);
  
  // Get the appropriate icon for the section
  const Icon = sectionIcons[sectionId as keyof typeof sectionIcons] || FileText;
  
  // If this is a custom section, ensure we have the section data
  if (sectionId.startsWith('custom-') && !customSection) {
    return (
      <div className="p-4 border rounded-lg bg-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Section Not Found</h3>
        </div>
        <p className="text-muted-foreground">
          This section could not be loaded. It may have been removed.
        </p>
      </div>
    );
  }

  useEffect(() => {
    // Convert new skills object structure to old array structure for compatibility
    if (resumeData.skills && typeof resumeData.skills === 'object' && !Array.isArray(resumeData.skills)) {
      // New structure: { languages: [], frameworks: [], tools: [] }
      const allSkills = [
        ...resumeData.skills.languages.map(skill => ({ id: 'languages', name: 'Languages', items: resumeData.skills.languages })),
        ...resumeData.skills.frameworks.map(skill => ({ id: 'frameworks', name: 'Frameworks', items: resumeData.skills.frameworks })),
        ...resumeData.skills.tools.map(skill => ({ id: 'tools', name: 'Tools', items: resumeData.skills.tools }))
      ];
      
      if (allSkills.length > 0) {
        setSkillsData(allSkills);
      } else {
        setSkillsData([
          { id: 'languages', name: 'Languages', items: [] },
          { id: 'frameworks', name: 'Frameworks', items: [] },
          { id: 'tools', name: 'Tools', items: [] }
        ]);
      }
    } else if (Array.isArray(resumeData.skills) && resumeData.skills.length > 0) {
      // Old array structure
      setSkillsData(resumeData.skills);
    } else {
      // Default empty structure
      setSkillsData([
        { id: 'languages', name: 'Languages', items: [] },
        { id: 'frameworks', name: 'Frameworks', items: [] },
        { id: 'tools', name: 'Tools', items: [] }
      ]);
    }
  }, [resumeData.skills]);

  useEffect(() => {
    setIsExpanded(isActive);
  }, [isActive]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    updateResumeData('personal', {
      ...(resumeData.personal || {}),
      [field]: value
    });
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
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
      startDate: "",
      endDate: "",
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
      startDate: "",
      endDate: "",
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
      date: "",
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

  const handleAddSkill = (categoryId: string, skill: string) => {
    const newSkills = skillsData.map(cat => 
      cat.id === categoryId 
        ? { ...cat, items: [...cat.items, skill] } 
        : cat
    );
    setSkillsData(newSkills);
    updateResumeData('skills', newSkills);
  };

  const handleRemoveSkill = (categoryId: string, skillIndex: number) => {
    const newSkills = skillsData.map(cat => 
      cat.id === categoryId
        ? { 
            ...cat, 
            items: cat.items.filter((_, idx) => idx !== skillIndex) 
          }
        : cat
    );
    setSkillsData(newSkills);
    updateResumeData('skills', newSkills);
  };

  const handleUpdateCategory = (id: string, updates: { name?: string; items?: string[] }) => {
    const newSkills = skillsData.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    setSkillsData(newSkills);
    updateResumeData('skills', newSkills);
  };

  const handleRemoveCategory = (id: string) => {
    const newSkills = skillsData.filter(cat => cat.id !== id);
    setSkillsData(newSkills);
    updateResumeData('skills', newSkills);
  };

  const handleAddCategory = () => {
    const newCategory: SkillCategoryType = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      items: []
    };
    setSkillsData([...skillsData, newCategory]);
    updateResumeData('skills', [...skillsData, newCategory]);
  };

  const renderSkills = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {skillsData.map((category) => (
            <SkillCategory
              key={category.id}
              category={category}
              onUpdate={handleUpdateCategory}
              onRemove={handleRemoveCategory}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
            />
          ))}
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCategory}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill Category
        </Button>
      </div>
    );
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={resumeData.personal?.name || ''}
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={resumeData.personal?.title || ''}
              onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={resumeData.personal?.email || ''}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={resumeData.personal?.phone || ''}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              placeholder="(123) 456-7890"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={resumeData.personal?.location || ''}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={resumeData.personal?.linkedin || ''}
              onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={resumeData.personal?.website || ''}
              onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);

  const renderSummary = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Professional Summary</h3>
        <Badge variant="outline" className="text-xs">
          {resumeData.summary?.length || 0} characters
        </Badge>
      </div>
      <Textarea
        ref={summaryTextareaRef}
        id="summary"
        className="min-h-[120px] resize-none bg-background"
        placeholder="Write a compelling summary of your professional background, key skills, and career objectives..."
        value={resumeData.summary || ''}
        onChange={(e) => updateResumeData('summary', e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const cursorPosition = e.currentTarget.selectionStart;
            const textBefore = resumeData.summary?.substring(0, cursorPosition) || '';
            const textAfter = resumeData.summary?.substring(cursorPosition) || '';
            updateResumeData('summary', `${textBefore}\n${textAfter}`);
            // Set cursor position after the newline
            setTimeout(() => {
              if (summaryTextareaRef.current) {
                const newCursorPosition = cursorPosition + 1;
                summaryTextareaRef.current.selectionStart = newCursorPosition;
                summaryTextareaRef.current.selectionEnd = newCursorPosition;
                summaryTextareaRef.current.focus();
              }
            }, 0);
          }
        }}
      />
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
      
      {(resumeData.experience || []).map((exp: any, index: number) => (
        <Card key={exp.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Experience {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`exp-title-${exp.id}`}>Job Title *</Label>
                <Input
                  id={`exp-title-${exp.id}`}
                  placeholder="Software Engineer"
                  value={exp.title || ''}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`exp-company-${exp.id}`}>Company *</Label>
                <Input
                  id={`exp-company-${exp.id}`}
                  placeholder="Tech Corp"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`exp-location-${exp.id}`}>Location</Label>
                <Input
                  id={`exp-location-${exp.id}`}
                  placeholder="San Francisco, CA"
                  value={exp.location || ''}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`exp-start-${exp.id}`}>Start</Label>
                  <Input
                    id={`exp-start-${exp.id}`}
                    placeholder="Jan 2020"
                    value={exp.startDate || ''}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`exp-end-${exp.id}`}>End</Label>
                  <Input
                    id={`exp-end-${exp.id}`}
                    placeholder="Present"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label>Key Achievements</Label>
              <div className="space-y-2 mt-2">
                {(exp.bullets || []).map((bullet: string, bulletIndex: number) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <Input
                      placeholder="Describe your achievement..."
                      value={bullet}
                      onChange={(e) => updateExperience(exp.id, 'bullets', [...exp.bullets.slice(0, bulletIndex), e.target.value, ...exp.bullets.slice(bulletIndex + 1)])}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateExperience(exp.id, 'bullets', exp.bullets.filter((_: any, i: number) => i !== bulletIndex))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateExperience(exp.id, 'bullets', [...(exp.bullets || []), ""])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
      
      {(resumeData.education || []).map((edu: any, index: number) => (
        <Card key={edu.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Education {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`edu-degree-${edu.id}`}>Degree *</Label>
                <Input
                  id={`edu-degree-${edu.id}`}
                  placeholder="Bachelor of Science"
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`edu-school-${edu.id}`}>School *</Label>
                <Input
                  id={`edu-school-${edu.id}`}
                  placeholder="University Name"
                  value={edu.school || ''}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`edu-start-${edu.id}`}>Start</Label>
                  <Input
                    id={`edu-start-${edu.id}`}
                    placeholder="2018"
                    value={edu.startDate || ''}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`edu-end-${edu.id}`}>End</Label>
                  <Input
                    id={`edu-end-${edu.id}`}
                    placeholder="2022"
                    value={edu.endDate || ''}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`edu-year-${edu.id}`}>Year</Label>
                <Input
                  id={`edu-year-${edu.id}`}
                  placeholder="2020"
                  value={edu.year || ''}
                  onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`edu-gpa-${edu.id}`}>GPA (Optional)</Label>
                <Input
                  id={`edu-gpa-${edu.id}`}
                  placeholder="3.8"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        onClick={addProject}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
      
      {(resumeData.projects || []).map((project: any, index: number) => (
        <Card key={project.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Project {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`proj-name-${project.id}`}>Project Name *</Label>
                <Input
                  id={`proj-name-${project.id}`}
                  placeholder="My Awesome Project"
                  value={project.name || ''}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`proj-tech-${project.id}`}>Technologies</Label>
                <Input
                  id={`proj-tech-${project.id}`}
                  placeholder="React, Node.js, MongoDB"
                  value={project.tech || ''}
                  onChange={(e) => updateProject(project.id, 'tech', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`proj-start-${project.id}`}>Start</Label>
                  <Input
                    id={`proj-start-${project.id}`}
                    placeholder="Jan 2023"
                    value={project.startDate || ''}
                    onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`proj-end-${project.id}`}>End</Label>
                  <Input
                    id={`proj-end-${project.id}`}
                    placeholder="Mar 2023"
                    value={project.endDate || ''}
                    onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`proj-duration-${project.id}`}>Duration</Label>
                <Input
                  id={`proj-duration-${project.id}`}
                  placeholder="3 months"
                  value={project.duration || ''}
                  onChange={(e) => updateProject(project.id, 'duration', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`proj-link-${project.id}`}>Link (Optional)</Label>
                <Input
                  id={`proj-link-${project.id}`}
                  placeholder="https://github.com/user/project"
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Project Details</Label>
              <div className="space-y-2 mt-2">
                {(project.bullets || []).map((bullet: string, bulletIndex: number) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <Input
                      placeholder="Describe project feature or achievement..."
                      value={bullet}
                      onChange={(e) => updateProject(project.id, 'bullets', [...project.bullets.slice(0, bulletIndex), e.target.value, ...project.bullets.slice(bulletIndex + 1)])}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateProject(project.id, 'bullets', project.bullets.filter((_: any, i: number) => i !== bulletIndex))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateProject(project.id, 'bullets', [...(project.bullets || []), ""])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Detail
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {(resumeData.achievements || []).map((achievement: any, index: number) => (
          <div key={achievement.id || index} className="grid grid-cols-3 gap-2 items-center">
            <Input
              placeholder="Achievement title..."
              value={typeof achievement === 'string' ? achievement : (achievement.title || '')}
              onChange={(e) => {
                const list = (resumeData.achievements || []).map((a: any, i: number) => {
                  if (i !== index) return a;
                  if (typeof a === 'string') return { id: `ach-${Date.now()}`, title: e.target.value, date: '' };
                  return { ...a, title: e.target.value };
                });
                updateResumeData('achievements', list);
              }}
            />
            <Input
              placeholder="Date (e.g., 2024)"
              value={typeof achievement === 'string' ? '' : (achievement.date || '')}
              onChange={(e) => {
                const list = (resumeData.achievements || []).map((a: any, i: number) => i === index ? (typeof a === 'string' ? { id: `ach-${Date.now()}`, title: a, date: e.target.value } : { ...a, date: e.target.value }) : a);
                updateResumeData('achievements', list);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => updateResumeData('achievements', (resumeData.achievements || []).filter((_: any, i: number) => i !== index))}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => updateResumeData('achievements', [...(resumeData.achievements || []), { id: `ach-${Date.now()}`, title: '', date: '' }])}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        onClick={addCertification}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
      
      {(resumeData.certifications || []).map((cert: any, index: number) => (
        <Card key={cert.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Certification {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`cert-name-${cert.id}`}>Certification Name *</Label>
                <Input
                  id={`cert-name-${cert.id}`}
                  placeholder="AWS Certified Developer"
                  value={cert.name || ''}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization *</Label>
                <Input
                  id={`cert-issuer-${cert.id}`}
                  placeholder="Amazon Web Services"
                  value={cert.issuer || ''}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`cert-date-${cert.id}`}>Date Obtained</Label>
                <Input
                  id={`cert-date-${cert.id}`}
                  placeholder="March 2023"
                  value={cert.date || ''}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`cert-link-${cert.id}`}>Credential Link (Optional)</Label>
                <Input
                  id={`cert-link-${cert.id}`}
                  placeholder="https://credential-url.com"
                  value={cert.link || ''}
                  onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const getSectionTitle = (id: string) => {
    // First check if it's a custom section
    if (id.startsWith('custom-') && resumeData?.customSections) {
      const customSection = resumeData.customSections.find((s: any) => s.id === id);
      if (customSection) {
        return customSection.title || 'Custom Section';
      }
    }

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

  const renderCustomSectionContent = () => {
    if (!customSection) return (
      <div className="p-4 text-center text-muted-foreground">
        Custom section not found. Please refresh the page or try again.
      </div>
    );
    
    // Ensure items array exists
    const sectionItems = customSection.items || [];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Section Title</Label>
            <Input
              value={customSection.title || ''}
              onChange={(e) => {
                if (updateCustomSection) {
                  const sectionIndex = resumeData.customSections?.findIndex((s: any) => s.id === sectionId) ?? -1;
                  if (sectionIndex !== -1) {
                    updateCustomSection(sectionIndex, {
                      ...customSection,
                      title: e.target.value
                    });
                  }
                } else {
                  const updatedSections = [...(resumeData.customSections || [])];
                  const sectionIndex = updatedSections.findIndex((s: any) => s.id === sectionId);
                  if (sectionIndex !== -1) {
                    updatedSections[sectionIndex] = {
                      ...updatedSections[sectionIndex],
                      title: e.target.value
                    };
                    updateResumeData('customSections', updatedSections);
                  }
                }
              }}
              placeholder="Section Title"
            />
          </div>
          <div>
            <Label>Description (Optional)</Label>
            <Textarea
              value={customSection.description || ''}
              onChange={(e) => {
                if (updateCustomSection) {
                  const sectionIndex = resumeData.customSections?.findIndex((s: any) => s.id === sectionId) ?? -1;
                  if (sectionIndex !== -1) {
                    updateCustomSection(sectionIndex, {
                      ...customSection,
                      description: e.target.value
                    });
                  }
                } else {
                  const updatedSections = [...(resumeData.customSections || [])];
                  const sectionIndex = updatedSections.findIndex((s: any) => s.id === sectionId);
                  if (sectionIndex !== -1) {
                    updatedSections[sectionIndex] = {
                      ...updatedSections[sectionIndex],
                      description: e.target.value
                    };
                    updateResumeData('customSections', updatedSections);
                  }
                }
              }}
              placeholder="Section description"
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Items</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (updateCustomSection) {
                  const sectionIndex = resumeData.customSections?.findIndex((s: any) => s.id === sectionId) ?? -1;
                  if (sectionIndex !== -1) {
                    const newItem = {
                      id: `item-${Date.now()}`,
                      title: '',
                      subtitle: '',
                      date: '',
                      description: ''
                    };
                    updateCustomSection(sectionIndex, {
                      ...customSection,
                      items: [...(customSection.items || []), newItem]
                    });
                  }
                } else {
                  const updatedSections = [...(resumeData.customSections || [])];
                  const sectionIndex = updatedSections.findIndex((s: any) => s.id === sectionId);
                  if (sectionIndex !== -1) {
                    const newItem = {
                      id: `item-${Date.now()}`,
                      title: '',
                      subtitle: '',
                      date: '',
                      description: ''
                    };
                    updatedSections[sectionIndex] = {
                      ...updatedSections[sectionIndex],
                      items: [...(updatedSections[sectionIndex].items || []), newItem]
                    };
                    updateResumeData('customSections', updatedSections);
                  }
                }
                    }
                  } else {
                    const updatedSections = [...(resumeData.customSections || [])];
                    const sectionIndex = updatedSections.findIndex((s: any) => s.id === sectionId);
                    if (sectionIndex !== -1) {
                      const newItem = {
                        id: `item-${Date.now()}`,
                        title: '',
                        subtitle: '',
                        date: '',
                        link: '',
                        description: ''
                      };
                      updatedSections[sectionIndex] = {
                        ...updatedSections[sectionIndex],
                        items: [...(updatedSections[sectionIndex].items || []), newItem]
                      };
                      updateResumeData('customSections', updatedSections);
                    }
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
                      {sectionItems.map((item: any, itemIndex: number) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Item {itemIndex + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (updateCustomSection) {
                      const sectionIndex = resumeData.customSections?.findIndex((s: any) => s.id === sectionId) ?? -1;
                      if (sectionIndex !== -1) {
                        updateCustomSection(sectionIndex, {
                          ...customSection,
                          items: customSection.items.filter((_: any, i: number) => i !== itemIndex)
                        });
                      }
                    } else {
                      const updatedSections = [...(resumeData.customSections || [])];
                      const sectionIndex = updatedSections.findIndex((s: any) => s.id === sectionId);
                      if (sectionIndex !== -1) {
                        updatedSections[sectionIndex] = {
                          ...updatedSections[sectionIndex],
                          items: updatedSections[sectionIndex].items.filter((_: any, i: number) => i !== itemIndex)
                        };
                        updateResumeData('customSections', updatedSections);
                      }
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title || ''}
                    onChange={(e) => updateCustomSectionItem(sectionId, itemIndex, 'title', e.target.value)}
                    placeholder="Item title"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Subtitle (Optional)</Label>
                  <Input
                    value={item.subtitle || ''}
                    onChange={(e) => updateCustomSectionItem(sectionId, itemIndex, 'subtitle', e.target.value)}
                    placeholder="Item subtitle"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Date (Optional)</Label>
                  <Input
                    value={item.date || ''}
                    onChange={(e) => updateCustomSectionItem(sectionId, itemIndex, 'date', e.target.value)}
                    placeholder="e.g., Jan 2023 - Present"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Link (Optional)</Label>
                  <Input
                    value={item.link || ''}
                    onChange={(e) => updateCustomSectionItem(sectionId, itemIndex, 'link', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={item.description || ''}
                    onChange={(e) => updateCustomSectionItem(sectionId, itemIndex, 'description', e.target.value)}
                    placeholder="Detailed description"
                    rows={3}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  };

  const updateCustomSectionItem = (sectionId: string, itemIndex: number, field: string, value: string) => {
    if (!resumeData?.customSections) return;
    
    const sectionIndex = resumeData.customSections.findIndex((s: any) => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    const section = resumeData.customSections[sectionIndex];
    const updatedItems = [...(section.items || [])];
    
    // Ensure the item exists
    if (!updatedItems[itemIndex]) {
      updatedItems[itemIndex] = { id: `item-${Date.now()}` };
    }
    
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      [field]: value
    };
    
    const updatedSection = {
      ...section,
      items: updatedItems
    };
    
    // Use the context method if available, otherwise fall back to updateResumeData
    if (updateCustomSection) {
      updateCustomSection(sectionIndex, updatedSection);
    } else {
      const updatedSections = [...resumeData.customSections];
      updatedSections[sectionIndex] = updatedSection;
      updateResumeData('customSections', updatedSections);
    }
  };

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
        if (sectionId.startsWith('custom-')) {
          return renderCustomSectionContent();
        }
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Select a section to edit</p>
          </div>
        );
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

export default ResumeSection;
