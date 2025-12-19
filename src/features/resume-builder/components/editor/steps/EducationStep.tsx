import React, { useState, useEffect } from 'react';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { useResume } from '@/shared/contexts/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import { GraduationCap, Save, Trash2, Edit, Plus, X, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { AnimatedAccordion } from '@/features/resume-builder/components/editor/AnimatedAccordion';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';

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
  const { resumeData, addEducation, updateEducation, removeEducation, setResumeData } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);
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
        institution: education.school || education.institution || '',
        degree: education.degree || '',
        fieldOfStudy: education.fieldOfStudy || education.field || '',
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

  const handleAIEnhance = (enhancedData: any) => {
    setResumeData(enhancedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const educationData = {
      id: formData.id || uuidv4(),
      school: formData.institution,
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      field: formData.fieldOfStudy,
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
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAIEnhanceModalOpen(true)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Enhance with AI
            </Button>
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
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Description</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAIEnhanceModalOpen(true)}
                      className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Enhance with AI
                    </Button>
                  </div>
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
            <AnimatedAccordion
              items={resumeData.education.map((edu, index) => ({
                id: edu.id || `edu-${index}`,
                title: `${edu.degree} in ${edu.fieldOfStudy}`,
                badge: edu.gpa ? `GPA: ${edu.gpa}` : undefined,
                icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />,
                content: (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{edu.school || edu.institution}</span>
                        <span>•</span>
                        <span>
                          {edu.startDate && format(new Date(edu.startDate), 'MMM yyyy')}
                          {edu.endDate ? ` - ${format(new Date(edu.endDate), 'MMM yyyy')}` : ' - Present'}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="text-sm whitespace-pre-line bg-muted/50 p-4 rounded-md">{edu.description}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ),
              }))}
              type="single"
              defaultValue={resumeData.education[0]?.id || `edu-0`}
            />
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

      <AIEnhanceModal
        open={isAIEnhanceModalOpen}
        onOpenChange={setIsAIEnhanceModalOpen}
        resumeData={resumeData}
        onEnhance={(newData) => {
          setResumeData(newData);
          if (editingIndex !== null) {
            setFormData(prev => ({ ...prev, description: newData.education[editingIndex].description }));
          }
        }}
        step="education"
        targetItemIndex={editingIndex}
        targetField="description"
      />
    </WizardStepContainer>
  );
};
