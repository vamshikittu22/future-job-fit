import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { WizardStepContainer } from '@/components/wizard/WizardStepContainer';
import { ProgressStepper } from '@/components/wizard/ProgressStepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SkillsStep: React.FC = () => {
  const { resumeData, updateResumeData } = useResume();
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

  return (
    <WizardStepContainer
      title="Skills"
      description="Add your technical skills, frameworks, and tools"
    >
      <ProgressStepper />

      <div className="space-y-6">
        {/* Total Skills Counter */}
        {totalSkills > 0 && (
          <div className="text-center">
            <Badge variant={totalSkills >= 5 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {totalSkills} Total Skills
              {totalSkills < 5 && ' (Add at least 5)'}
            </Badge>
          </div>
        )}

        {/* Programming Languages */}
        <Card>
          <CardHeader>
            <CardTitle>Programming Languages</CardTitle>
            <CardDescription>
              Languages you're proficient in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inputs.languages}
                onChange={(e) => setInputs({ ...inputs, languages: e.target.value })}
                onKeyPress={(e) => handleKeyPress(e, 'languages')}
                placeholder="Type a language and press Enter"
              />
              <Button
                onClick={() => handleAddSkill('languages')}
                disabled={!inputs.languages.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {skills.languages && skills.languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-sm gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill('languages', index)}
                      className="hover:text-destructive"
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
                {suggestedSkills.languages
                  .filter((s) => !skills.languages?.includes(s))
                  .slice(0, 6)
                  .map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => {
                        updateResumeData('skills', {
                          ...skills,
                          languages: [...(skills.languages || []), skill],
                        });
                      }}
                    >
                      + {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frameworks & Libraries */}
        <Card>
          <CardHeader>
            <CardTitle>Frameworks & Libraries</CardTitle>
            <CardDescription>
              Frameworks and libraries you work with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inputs.frameworks}
                onChange={(e) => setInputs({ ...inputs, frameworks: e.target.value })}
                onKeyPress={(e) => handleKeyPress(e, 'frameworks')}
                placeholder="Type a framework and press Enter"
              />
              <Button
                onClick={() => handleAddSkill('frameworks')}
                disabled={!inputs.frameworks.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {skills.frameworks && skills.frameworks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-sm gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill('frameworks', index)}
                      className="hover:text-destructive"
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
                {suggestedSkills.frameworks
                  .filter((s) => !skills.frameworks?.includes(s))
                  .slice(0, 6)
                  .map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => {
                        updateResumeData('skills', {
                          ...skills,
                          frameworks: [...(skills.frameworks || []), skill],
                        });
                      }}
                    >
                      + {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tools & Technologies */}
        <Card>
          <CardHeader>
            <CardTitle>Tools & Technologies</CardTitle>
            <CardDescription>
              Development tools and platforms you use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inputs.tools}
                onChange={(e) => setInputs({ ...inputs, tools: e.target.value })}
                onKeyPress={(e) => handleKeyPress(e, 'tools')}
                placeholder="Type a tool and press Enter"
              />
              <Button
                onClick={() => handleAddSkill('tools')}
                disabled={!inputs.tools.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {skills.tools && skills.tools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-sm gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill('tools', index)}
                      className="hover:text-destructive"
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
                {suggestedSkills.tools
                  .filter((s) => !skills.tools?.includes(s))
                  .slice(0, 6)
                  .map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => {
                        updateResumeData('skills', {
                          ...skills,
                          tools: [...(skills.tools || []), skill],
                        });
                      }}
                    >
                      + {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WizardStepContainer>
  );
};
