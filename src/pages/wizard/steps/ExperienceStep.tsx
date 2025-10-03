import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { WizardStepContainer } from '@/components/wizard/WizardStepContainer';
import { ProgressStepper } from '@/components/wizard/ProgressStepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, GripVertical, Briefcase } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const ExperienceStep: React.FC = () => {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleOpenDialog = (index?: number) => {
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

  return (
    <WizardStepContainer
      title="Work Experience"
      description="Add your professional work history with achievements and responsibilities"
    >
      <ProgressStepper />

      <div className="space-y-4">
        {resumeData.experience && resumeData.experience.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {resumeData.experience.map((exp, index) => (
              <AccordionItem key={exp.id} value={exp.id} asChild>
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-start gap-4 flex-1 text-left">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exp.company}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
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
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={formData.current}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, current: checked as boolean })
                }
              />
              <Label htmlFor="current" className="cursor-pointer">
                I currently work here
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description & Achievements *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="• Managed team of 5 developers&#10;• Increased efficiency by 30%&#10;• Led migration to microservices architecture"
                className="min-h-[150px]"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                Use bullet points (•) to list your responsibilities and achievements. Include metrics where possible.
              </p>
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
    </WizardStepContainer>
  );
};
