import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { X, Plus, Trash2, Star, StarOff, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/shared/ui/switch';
import { Skill, SkillCategory } from '@/features/resume-builder/components/editor/types';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

const skillCategories: SkillCategory[] = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Tools & Platforms',
  'Design',
  'Soft Skills',
  'Languages',
  'Other',
];

export const SkillsForm = ({ skills, onChange }: SkillsFormProps) => {
  const [showProficiency, setShowProficiency] = useState<boolean>(true);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 3, // Default to intermediate
    category: 'Other',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;

    const skill: Skill = {
      id: editingId || `skill-${Date.now()}`,
      ...newSkill,
      showProficiency: showProficiency
    };

    if (editingId) {
      onChange(skills.map((s) => (s.id === editingId ? { ...s, ...skill } : s)));
    } else {
      onChange([...skills, skill]);
    }

    setNewSkill({ name: '', level: 3, category: 'Other' });
    setEditingId(null);
  };

  const handleEdit = (skill: Skill) => {
    setNewSkill({
      name: skill.name,
      level: skill.level,
      category: skill.category,
    });
    setShowProficiency(skill.showProficiency !== false);
    setEditingId(skill.id);
  };

  const handleDelete = (id: string) => {
    onChange(skills.filter((skill) => skill.id !== id));
    if (editingId === id) {
      setNewSkill({ name: '', level: 3, category: 'Other' });
      setEditingId(null);
    }
  };

  const renderStars = (level: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setNewSkill({ ...newSkill, level: star as 1 | 2 | 3 | 4 | 5 })}
            className="p-1 text-muted-foreground hover:text-yellow-500 focus:outline-none"
          >
            {star <= level ? (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="h-5 w-5" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'][level - 1]}
        </span>
      </div>
    );
  };

  const getSkillsByCategory = () => {
    const categories: { [key: string]: Skill[] } = {};
    
    // Initialize categories
    skillCategories.forEach(category => {
      categories[category] = [];
    });
    
    // Group skills by category
    skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });
    
    return categories;
  };

  const skillGroups = getSkillsByCategory();

  return (
    <div className="space-y-8">
      <div className="space-y-6 p-4 border rounded-lg bg-card">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {editingId ? 'Edit Skill' : 'Add New Skill'}
          </h3>
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-proficiency" 
              checked={showProficiency}
              onCheckedChange={setShowProficiency}
            />
            <Label htmlFor="show-proficiency" className="flex items-center gap-2 cursor-pointer">
              {showProficiency ? (
                <><Eye className="h-4 w-4" /> Show Proficiency</>
              ) : (
                <><EyeOff className="h-4 w-4" /> Hide Proficiency</>
              )}
            </Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name *</Label>
            <Input
              id="skillName"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              placeholder="e.g., React, Project Management"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillCategory">Category</Label>
            <select
              id="skillCategory"
              value={newSkill.category}
              onChange={(e) =>
                setNewSkill({
                  ...newSkill,
                  category: e.target.value as SkillCategory,
                })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {skillCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {showProficiency && (
            <div className="space-y-2 md:col-span-2">
              <Label>Proficiency Level</Label>
              {renderStars(newSkill.level)}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNewSkill({ name: '', level: 3, category: 'Other' });
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleAddSkill}
            disabled={!newSkill.name.trim()}
          >
            {editingId ? 'Update Skill' : 'Add Skill'}
          </Button>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Your Skills</h3>
          
          {Object.entries(skillGroups).map(([category, categorySkills]) => {
            if (categorySkills.length === 0) return null;
            
            return (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-muted-foreground">{category}</h4>
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="group relative p-3 pr-8 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                      <div className="font-medium">{skill.name}</div>
                      {showProficiency && (
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`h-3 w-3 rounded-full mr-1 ${
                                star <= skill.level ? 'bg-yellow-400' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => handleEdit(skill)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive/90"
                          onClick={() => handleDelete(skill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="pt-2 text-sm text-muted-foreground">
            <p>Tip: Drag and drop skills to reorder them (coming soon)</p>
          </div>
        </div>
      )}
    </div>
  );
};
