import React, { useState } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { X, Plus, Sparkles, Code } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { AnimatedAccordion } from '@/features/resume-builder/components/editor/AnimatedAccordion';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';

export const SkillsStep: React.FC = () => {
  const { resumeData, updateResumeData, setResumeData } = useResume();
  const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);
  const [inputs, setInputs] = useState({
    languages: '',
    frameworks: '',
    tools: '',
  });

  const skills = resumeData.skills || { languages: [], frameworks: [], tools: [] };

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
        <div className="flex items-center justify-between">
          {/* Total Skills Counter */}
          {totalSkills > 0 && (
            <Badge variant={totalSkills >= 5 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {totalSkills} Total Skills
              {totalSkills < 5 && ' (Add at least 5)'}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAIEnhanceModalOpen(true)}
            className="gap-2 ml-auto"
          >
            <Sparkles className="h-4 w-4" />
            Enhance with AI
          </Button>
        </div>

        <AnimatedAccordion
          items={skillCategories.map((category) => ({
            id: category.id,
            title: category.title,
            badge: category.skills.length > 0 ? `${category.skills.length} skills` : undefined,
            icon: category.icon,
            content: (
              <CardContent className="pt-0">
                <CardDescription className="mb-4">{category.description}</CardDescription>
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
      />
    </WizardStepContainer>
  );
};
