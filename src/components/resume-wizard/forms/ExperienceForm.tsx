import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2 } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export const ExperienceForm = ({ experiences, onChange }: ExperienceFormProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({
    id: '',
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: [],
    skills: [],
  });

  const handleAddExperience = () => {
    if (
      !formData.company ||
      !formData.position ||
      !formData.startDate
    ) {
      return;
    }

    const newExperience: Experience = {
      id: editingId || `exp-${Date.now()}`,
      company: formData.company || '',
      position: formData.position || '',
      location: formData.location || '',
      startDate: formData.startDate || '',
      endDate: formData.current ? '' : formData.endDate || '',
      current: formData.current || false,
      description: formData.description || [],
      skills: formData.skills || [],
    };

    if (editingId) {
      onChange(
        experiences.map((exp) =>
          exp.id === editingId ? newExperience : exp
        )
      );
    } else {
      onChange([...experiences, newExperience]);
    }

    resetForm();
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.current ? '' : exp.endDate,
      current: exp.current,
      description: [...exp.description],
      skills: [...(exp.skills || [])],
    });
    setEditingId(exp.id);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [],
      skills: [],
    });
    setEditingId(null);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...(formData.description || [])];
    newDescriptions[index] = value;
    setFormData({ ...formData, description: newDescriptions });
  };

  const addDescription = () => {
    setFormData({
      ...formData,
      description: [...(formData.description || []), ''],
    });
  };

  const removeDescription = (index: number) => {
    const newDescriptions = [...(formData.description || [])];
    newDescriptions.splice(index, 1);
    setFormData({ ...formData, description: newDescriptions });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="position">Job Title *</Label>
          <Input
            id="position"
            value={formData.position || ''}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            placeholder="Senior Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company || ''}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            placeholder="Acme Inc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="New York, NY"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="month"
            value={formData.startDate || ''}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <div className="flex items-center gap-2">
            <Input
              id="endDate"
              type="month"
              value={formData.current ? '' : formData.endDate || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endDate: e.target.value,
                  current: false,
                })
              }
              disabled={formData.current}
              className="flex-1"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    current: e.target.checked,
                    endDate: e.target.checked ? 'Present' : '',
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="current">I currently work here</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Job Description</Label>
        {(formData.description || []).map((desc, index) => (
          <div key={index} className="flex items-start gap-2">
            <Textarea
              value={desc}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              placeholder="Describe your responsibilities and achievements"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeDescription(index)}
              className="text-destructive hover:text-destructive/90"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDescription}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Description Point
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {editingId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleAddExperience}
          disabled={
            !formData.company || !formData.position || !formData.startDate
          }
        >
          {editingId ? 'Update Experience' : 'Add Experience'}
        </Button>
      </div>

      {experiences.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Work Experience</h3>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{exp.position}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(exp)}
                      className="h-8 w-8"
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
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m13.5 6.5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(exp.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
