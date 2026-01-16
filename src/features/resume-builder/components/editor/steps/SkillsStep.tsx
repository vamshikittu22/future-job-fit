import React, { useState } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { X, Plus, Sparkles, Code, HelpCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { AnimatedAccordion } from '@/features/resume-builder/components/editor/AnimatedAccordion';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';
import { AIEnhanceButton } from '@/shared/ui/ai-enhance-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';

export const SkillsStep: React.FC = () => {
  const { resumeData, updateResumeData, setResumeData } = useResume();
  const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);
  const [inputs, setInputs] = useState({
    languages: '',
    frameworks: '',
    tools: '',
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const skillsData = resumeData.skills;
  const skills = (skillsData && !Array.isArray(skillsData)
    ? skillsData
    : { languages: [], frameworks: [], tools: [] }) as { languages: string[]; frameworks: string[]; tools: string[] };

  const handleAddSkill = (category: 'languages' | 'frameworks' | 'tools') => {
    const value = inputs[category].trim();
    if (!value) return;

    const currentSkills = skills[category] || [];
    if (currentSkills.includes(value)) {
      return; // Duplicate
    }

    updateResumeData('skills', {
      ...skills,
      [category]: [...currentSkills, value],
    });

    setInputs({ ...inputs, [category]: '' });
  };

  const handleRemoveSkill = (category: 'languages' | 'frameworks' | 'tools', index: number) => {
    const currentSkills = skills[category] || [];
    updateResumeData('skills', {
      ...skills,
      [category]: currentSkills.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, category: 'languages' | 'frameworks' | 'tools') => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill(category);
    }
  };

  const suggestedSkills = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Ruby', 'PHP'],
    frameworks: ['React', 'Vue', 'Angular', 'Node.js', 'Django', 'Flask', 'Spring', 'Laravel'],
    tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Jira', 'Figma'],
  };

  const totalSkills = (skills.languages?.length || 0) +
    (skills.frameworks?.length || 0) +
    (skills.tools?.length || 0);

  const handleAIEnhance = (enhancedData: any) => {
    setResumeData(enhancedData);
  };

  const skillCategories = [
    {
      id: 'languages',
      title: 'Programming Languages',
      description: 'Languages you\'re proficient in',
      icon: <Code className="h-4 w-4 text-muted-foreground" />,
      skills: skills.languages || [],
      input: inputs.languages,
      onInputChange: (value: string) => setInputs({ ...inputs, languages: value }),
      onAdd: () => handleAddSkill('languages'),
      onRemove: (index: number) => handleRemoveSkill('languages', index),
      onKeyPress: (e: React.KeyboardEvent) => handleKeyPress(e, 'languages'),
      suggested: suggestedSkills.languages,
    },
    {
      id: 'frameworks',
      title: 'Frameworks & Libraries',
      description: 'Frameworks and libraries you work with',
      icon: <Code className="h-4 w-4 text-muted-foreground" />,
      skills: skills.frameworks || [],
      input: inputs.frameworks,
      onInputChange: (value: string) => setInputs({ ...inputs, frameworks: value }),
      onAdd: () => handleAddSkill('frameworks'),
      onRemove: (index: number) => handleRemoveSkill('frameworks', index),
      onKeyPress: (e: React.KeyboardEvent) => handleKeyPress(e, 'frameworks'),
      suggested: suggestedSkills.frameworks,
    },
    {
      id: 'tools',
      title: 'Tools & Technologies',
      description: 'Development tools and platforms you use',
      icon: <Code className="h-4 w-4 text-muted-foreground" />,
      skills: skills.tools || [],
      input: inputs.tools,
      onInputChange: (value: string) => setInputs({ ...inputs, tools: value }),
      onAdd: () => handleAddSkill('tools'),
      onRemove: (index: number) => handleRemoveSkill('tools', index),
      onKeyPress: (e: React.KeyboardEvent) => handleKeyPress(e, 'tools'),
      suggested: suggestedSkills.tools,
    },
  ];

  return (
    <WizardStepContainer
      title="Skills"
      description="Add your technical skills, frameworks, and tools"
    >
      <ProgressStepper />

      <div className="space-y-6">
        {/* Skills Summary Card */}
        <Card className={cn(
          "border-2 transition-colors duration-200",
          totalSkills >= 5 ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" : "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
        )}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Skill Breakdown */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {totalSkills >= 5 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-amber-500" />
                  )}
                  <span className="font-semibold text-lg">{totalSkills} Total Skills</span>
                </div>

                {/* Category Breakdown */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">|</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <Badge variant="outline" className="gap-1">
                            <Code className="h-3 w-3" />
                            Languages: {skills.languages?.length || 0}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            Frameworks: {skills.frameworks?.length || 0}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            Tools: {skills.tools?.length || 0}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <div className="space-y-2 text-sm">
                          <p className="font-semibold">How skills are categorized:</p>
                          <ul className="space-y-1 text-xs">
                            <li><strong>Languages:</strong> Programming languages (Python, JavaScript, Java, etc.)</li>
                            <li><strong>Frameworks:</strong> Libraries & frameworks (React, Django, Spring, etc.)</li>
                            <li><strong>Tools:</strong> Dev tools & platforms (Git, Docker, AWS, etc.)</li>
                          </ul>
                          <p className="text-xs text-muted-foreground italic">
                            Skills are added to the category you select when typing.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Status Message & AI Button */}
              <div className="flex items-center gap-3">
                {totalSkills < 5 && (
                  <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    Add {5 - totalSkills} more to meet minimum
                  </span>
                )}
                {totalSkills >= 5 && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ Minimum met
                  </span>
                )}
                <AIEnhanceButton
                  onClick={() => setIsAIEnhanceModalOpen(true)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatedAccordion
          items={skillCategories.map((category) => ({
            id: category.id,
            title: category.title,
            badge: category.skills.length > 0 ? `${category.skills.length} skills` : undefined,
            icon: category.icon,
            content: (
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <CardDescription>{category.description}</CardDescription>
                  <AIEnhanceButton
                    variant="ghost"
                    onClick={() => {
                      setActiveCategory(category.id);
                      setIsAIEnhanceModalOpen(true);
                    }}
                    className="h-7 text-[10px] text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    AI Enhance Category
                  </AIEnhanceButton>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={category.input}
                      onChange={(e) => category.onInputChange(e.target.value)}
                      onKeyPress={category.onKeyPress}
                      placeholder={`Type a ${category.id === 'languages' ? 'language' : category.id === 'frameworks' ? 'framework' : 'tool'} and press Enter`}
                    />
                    <Button
                      onClick={category.onAdd}
                      disabled={!category.input.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {category.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-sm gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => category.onRemove(index)}
                            className="hover:text-destructive"
                            aria-label={`Remove ${skill}`}
                            title={`Remove ${skill}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Suggested:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.suggested
                        .filter((s) => !category.skills.includes(s))
                        .slice(0, 6)
                        .map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => {
                              updateResumeData('skills', {
                                ...skills,
                                [category.id]: [...category.skills, skill],
                              });
                            }}
                          >
                            + {skill}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            ),
          }))}
          type="single"
          defaultValue="languages"
        />
      </div>

      <AIEnhanceModal
        open={isAIEnhanceModalOpen}
        onOpenChange={setIsAIEnhanceModalOpen}
        resumeData={resumeData}
        onEnhance={handleAIEnhance}
        step="skills"
        targetField={activeCategory}
      />
    </WizardStepContainer>
  );
};
