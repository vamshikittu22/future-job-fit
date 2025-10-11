import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2, GraduationCap } from 'lucide-react';
import { Education } from '../types';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationForm = ({ education, onChange }: EducationFormProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({
    id: '',
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  const handleAddEducation = () => {
    if (!formData.institution || !formData.degree || !formData.startDate) {
      return;
    }

    const newEducation: Education = {
      id: editingId || `edu-${Date.now()}`,
      institution: formData.institution || '',
      degree: formData.degree || '',
      fieldOfStudy: formData.fieldOfStudy || '',
      startDate: formData.startDate || '',
      endDate: formData.current ? 'Present' : formData.endDate || '',
      current: formData.current || false,
      description: formData.description || '',
    };

    if (editingId) {
      onChange(
        education.map((edu) => (edu.id === editingId ? newEducation : edu))
      );
    } else {
      onChange([...education, newEducation]);
    }

    resetForm();
  };

  const handleEdit = (edu: Education) => {
    setFormData({
      ...edu,
      current: edu.endDate === 'Present',
    });
    setEditingId(edu.id);
  };

  const handleDelete = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution *</Label>
          <Input
            id="institution"
            value={formData.institution || ''}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            placeholder="University of Example"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">Degree *</Label>
          <Input
            id="degree"
            value={formData.degree || ''}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            placeholder="Bachelor of Science"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fieldOfStudy">Field of Study</Label>
          <Input
            id="fieldOfStudy"
            value={formData.fieldOfStudy || ''}
            onChange={(e) =>
              setFormData({ ...formData, fieldOfStudy: e.target.value })
            }
            placeholder="Computer Science"
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
                id="currentEducation"
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
              <Label htmlFor="currentEducation">Currently Studying</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Notable achievements, coursework, or activities"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {editingId && (
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleAddEducation}
          disabled={
            !formData.institution || !formData.degree || !formData.startDate
          }
        >
          {editingId ? 'Update Education' : 'Add Education'}
        </Button>
      </div>

      {education.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full mt-1">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {edu.fieldOfStudy && (
                          <span>{edu.fieldOfStudy} • </span>
                        )}
                        {edu.startDate} - {edu.endDate || 'Present'}
                      </p>
                      {edu.description && (
                        <p className="mt-2 text-sm">{edu.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(edu)}
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
                      onClick={() => handleDelete(edu.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
