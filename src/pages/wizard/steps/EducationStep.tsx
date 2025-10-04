import React, { useState, useEffect } from 'react';
import { WizardStepContainer } from '@/components/wizard/WizardStepContainer';
import { ProgressStepper } from '@/components/wizard/ProgressStepper';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GraduationCap, Save, Trash2, Edit, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface EducationFormData {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
  gpa?: string;
}

export const EducationStep: React.FC = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<EducationFormData>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: '',
    gpa: ''
  });

  useEffect(() => {
    if (editingIndex !== null && resumeData.education[editingIndex]) {
      const education = resumeData.education[editingIndex];
      setFormData({
        id: education.id,
        institution: education.institution || '',
        degree: education.degree || '',
        fieldOfStudy: education.fieldOfStudy || '',
        startDate: education.startDate || '',
        endDate: education.endDate || '',
        description: education.description || '',
        gpa: education.gpa || ''
      });
    }
  }, [editingIndex, resumeData.education]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: '',
      gpa: ''
    });
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const educationData = {
      id: formData.id || uuidv4(),
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      gpa: formData.gpa
    };

    if (editingIndex !== null) {
      updateEducation(editingIndex, educationData);
    } else {
      addEducation(educationData);
    }
    
    resetForm();
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      removeEducation(index);
      if (editingIndex === index) {
        resetForm();
      }
    }
  };

  return (
    <WizardStepContainer
      title="Education"
      description="Add your educational background"
    >
      <ProgressStepper />
      
      <div className="space-y-6">
        {!isAdding && (
          <div className="flex justify-end">
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </div>
        )}

        {(isAdding || editingIndex !== null) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingIndex !== null ? 'Edit Education' : 'Add New Education'}
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Institution*</label>
                    <Input
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="University/College Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Degree*</label>
                    <Input
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="e.g., Bachelor of Science"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Field of Study*</label>
                    <Input
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleChange}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GPA</label>
                    <Input
                      name="gpa"
                      type="text"
                      value={formData.gpa}
                      onChange={handleChange}
                      placeholder="e.g., 3.8/4.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date*</label>
                    <Input
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date (or expected)</label>
                    <Input
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details about your education, achievements, or relevant coursework"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingIndex !== null ? 'Update' : 'Save'} Education
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          {resumeData.education.length > 0 ? (
            resumeData.education.map((edu, index) => (
              <Card key={index} className="group relative">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{edu.degree} in {edu.fieldOfStudy}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.startDate && format(new Date(edu.startDate), 'MMM yyyy')}
                        {edu.endDate ? ` - ${format(new Date(edu.endDate), 'MMM yyyy')}` : ' - Present'}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                      {edu.description && (
                        <p className="mt-2 text-sm whitespace-pre-line">{edu.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No education entries yet. Click 'Add Education' to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </WizardStepContainer>
  );
};
