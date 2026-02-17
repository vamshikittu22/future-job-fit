import { useState, useEffect, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import { Plus, Trash2, Pencil, X, Check, ChevronDown, ChevronUp, GripVertical, FileText, Briefcase, GraduationCap, FolderOpen, Trophy, Award, User, Code, Sparkles } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";

import { SkillCategory } from "@/features/resume-builder/components/editor/skills/SkillCategory";
import { SkillPreview } from "@/features/resume-builder/components/editor/skills/SkillPreview";
import { CustomSectionEditor } from "@/features/resume-builder/components/editor/custom/CustomSectionEditor";
import { SkillCategoryType } from "@/shared/types/resume";

import { ExperienceSection } from "@/features/resume-builder/components/editor/sections/ExperienceSection";
import { EducationSection } from "@/features/resume-builder/components/editor/sections/EducationSection";
import { ProjectSection } from "@/features/resume-builder/components/editor/sections/ProjectSection";
import { AchievementSection } from "@/features/resume-builder/components/editor/sections/AchievementSection";
import { CertificationSection } from "@/features/resume-builder/components/editor/sections/CertificationSection";

interface ResumeSectionProps {
  sectionId: string;
  index: number;
  resumeData: any;
  updateResumeData: (section: string, data: any) => void;
  isActive?: boolean;
  onActivate?: () => void;
  addCustomSection?: () => void;
  updateCustomSection?: (index: number, section: any) => void;
  removeCustomSection?: (index: number) => void;
}

const sectionIcons = {
  personal: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  projects: FolderOpen,
  skills: Code,
  achievements: Trophy,
  certifications: Award,
};

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
        ...resumeData.skills.languages.map((skill: any) => ({ id: 'languages', name: 'Languages', items: resumeData.skills.languages })),
        ...resumeData.skills.frameworks.map((skill: any) => ({ id: 'frameworks', name: 'Frameworks', items: resumeData.skills.frameworks })),
        ...resumeData.skills.tools.map((skill: any) => ({ id: 'tools', name: 'Tools', items: resumeData.skills.tools }))
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
    <ExperienceSection
      experience={resumeData.experience}
      updateResumeData={updateResumeData}
    />
  );

  const renderEducation = () => (
    <EducationSection
      education={resumeData.education}
      updateResumeData={updateResumeData}
    />
  );

  const renderProjects = () => (
    <ProjectSection
      projects={resumeData.projects}
      updateResumeData={updateResumeData}
    />
  );

  const renderAchievements = () => (
    <AchievementSection
      achievements={resumeData.achievements}
      updateResumeData={updateResumeData}
    />
  );

  const renderCertifications = () => (
    <CertificationSection
      certifications={resumeData.certifications}
      updateResumeData={updateResumeData}
    />
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
    } else if (updateResumeData) {
      const updatedSections = [...resumeData.customSections];
      updatedSections[sectionIndex] = updatedSection;
      updateResumeData('customSections', updatedSections);
    }
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
              className="w-full"
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
              className="w-full"
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
                const newItem = {
                  id: `item-${Date.now()}`,
                  title: '',
                  subtitle: '',
                  date: '',
                  link: '',
                  description: ''
                };

                if (updateCustomSection) {
                  const sectionIndex = resumeData.customSections?.findIndex((s: any) => s.id === sectionId) ?? -1;
                  if (sectionIndex !== -1) {
                    updateCustomSection(sectionIndex, {
                      ...customSection,
                      items: [...(customSection.items || []), newItem]
                    });
                  }
                } else {
                  const updatedSections = [...(resumeData.customSections || [])];
                  const sectionIndex = updatedSections.findIndex((s: any) => s.id === sectionId);
                  if (sectionIndex !== -1) {
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
          </div>

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
    );
  };

  const renderSectionContent = () => {
    if (!sectionId) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Select a section to edit</p>
        </div>
      );
    }

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
            <p className="text-muted-foreground">Section not found</p>
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
                onActivate?.();
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
};

export default ResumeSection;
