import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResumeData } from '@/lib/initialData';

type Skills = ResumeData['skills'];

interface SkillsSectionProps {
  skills: Skills;
  onAddSkill: (e: React.FormEvent) => void;
  onRemoveSkill: (category: keyof Skills, index: number) => void;
  newSkill: { name: string; type: keyof Skills };
  onSkillChange: (field: 'name' | 'type', value: string) => void;
}

export const SkillsSection = ({
  skills,
  onAddSkill,
  onRemoveSkill,
  newSkill,
  onSkillChange,
}: SkillsSectionProps) => {
  return (
    <div className="space-y-6">
      <form onSubmit={onAddSkill} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              placeholder="Add a skill"
              value={newSkill.name}
              onChange={(e) => onSkillChange('name', e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={newSkill.type}
              onChange={(e) => onSkillChange('type', e.target.value as keyof Skills)}
              className="border rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="languages">Languages</option>
              <option value="frameworks">Frameworks</option>
              <option value="tools">Tools</option>
            </select>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Add Skill
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {(['languages', 'frameworks', 'tools'] as const).map((category) => (
          skills[category]?.length > 0 && (
            <div key={category} className="space-y-2">
              <h3 className="font-medium capitalize">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills[category]?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => onRemoveSkill(category, index)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
