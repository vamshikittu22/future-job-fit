import React, { useState, useEffect } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Badge } from '@/shared/ui/badge';
import { Plus, Trash2, GripVertical, Briefcase, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { AnimatedAccordion } from '@/features/resume-builder/components/editor/AnimatedAccordion';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';

export const ExperienceStep: React.FC = () => {
  const { resumeData, addExperience, updateExperience, removeExperience, setResumeData } = useResume();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  const [isEnhanced, setIsEnhanced] = useState(false);

  // Removed useEffect that was auto-resetting isEnhanced

  const handleOpenDialog = (index?: number) => {
    setIsEnhanced(false);
    if (index !== undefined) {
      const exp = resumeData.experience[index];
      setFormData({
        title: exp.title,
        company: exp.company,
        location: exp.location || '',
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.description,
      });
      setEditingIndex(index);
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      });
      setEditingIndex(null);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      updateExperience(editingIndex, {
        ...resumeData.experience[editingIndex],
        ...formData,
      });
    } else {
      addExperience({
        id: uuidv4(),
        ...formData,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      removeExperience(index);
    }
  };

  const handleAIEnhance = (enhancedData: any) => {
    setResumeData(enhancedData);
    // Also update the form data if we are editing
    if (editingIndex !== null && enhancedData.experience && enhancedData.experience[editingIndex]) {
      setFormData(prev => ({
        ...prev,
        description: enhancedData.experience[editingIndex].description
      }));
      setIsEnhanced(true);
    }
  };

  const experienceItems = resumeData.experience?.map((exp, index) => ({
    id: exp.id || `exp-${index}`,
    title: `${exp.title} at ${exp.company}`,
    badge: exp.current ? 'Current' : undefined,
    icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
    content: (
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {exp.location && <span>{exp.location}</span>}
            {exp.location && <span>•</span>}
            <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
          </div>
          {exp.description && (
            <div className="text-sm whitespace-pre-line bg-muted/50 p-4 rounded-md">
              {exp.description}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog(index)}
            >
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
  })) || [];

  return (
    <WizardStepContainer
      title="Work Experience"
      description="Add your professional work history with achievements and responsibilities"
    >
      <ProgressStepper />

      <div className="space-y-4">

        {resumeData.experience && resumeData.experience.length > 0 ? (
          <AnimatedAccordion
            items={experienceItems}
            type="single"
            defaultValue={experienceItems[0]?.id}
          />
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No work experience added yet</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Add your work experience to showcase your career journey
              </p>
            </CardContent>
          </Card>
        )}

        <Button onClick={() => handleOpenDialog()} className="w-full" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Work Experience
        </Button>
      </div>

      {/* Experience Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? 'Edit' : 'Add'} Work Experience
            </DialogTitle>
            <DialogDescription>
              Provide details about your role and achievements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Checkbox
                id="current"
                checked={formData.current}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, current: checked as boolean })
                }
              />
              <Label htmlFor="current" className="cursor-pointer font-medium">
                I currently work here
              </Label>
            </div>

            {/* Description Section with clearer header */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="description" className="text-base font-semibold">
                    Description & Achievements *
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use bullet points (•) to list your responsibilities and achievements
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAIEnhanceModalOpen(true)}
                  className="h-9 text-sm gap-2 shadow-sm hover:shadow-accent transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Enhance with AI
                </Button>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setIsEnhanced(false);
                }}
                placeholder="• Managed team of 5 developers&#10;• Increased efficiency by 30%&#10;• Led migration to microservices architecture"
                className="min-h-[180px] text-base leading-relaxed"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                Use bullet points (•) to list your responsibilities and achievements. Include metrics where possible.
              </p>
              {isEnhanced && (
                <div className="flex items-center gap-2 text-xs text-purple-600 font-medium animate-in fade-in slide-in-from-top-1 mt-2">
                  <Sparkles className="w-3 h-3" />
                  Enhanced with AI
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.company || !formData.description}
            >
              {editingIndex !== null ? 'Update' : 'Add'} Experience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIEnhanceModal
        open={isAIEnhanceModalOpen}
        onOpenChange={setIsAIEnhanceModalOpen}
        resumeData={resumeData}
        onEnhance={handleAIEnhance}
        step="experience"
        targetItemIndex={editingIndex}
        targetField="description"
      />
    </WizardStepContainer>
  );
};
