import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AIEnhanceButton } from '../AIEnhanceButton';
import { BulletEnhanceModal } from '../BulletEnhanceModal';
import type { ResumeData } from "@/lib/initialData";

type Experience = ResumeData['experience'][number];

interface ExperienceFormProps {
  experience: Partial<Experience>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Experience, value: any) => void;
  isEditing: boolean;
  onCancel: () => void;
}

export const ExperienceForm = ({
  experience,
  onSubmit,
  onChange,
  isEditing,
  onCancel,
}: ExperienceFormProps) => {
  const [showAIModal, setShowAIModal] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={experience.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Senior Software Engineer"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={experience.company || ''}
            onChange={(e) => onChange('company', e.target.value)}
            placeholder="Acme Inc."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={experience.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="month"
            value={experience.startDate || ''}
            onChange={(e) => onChange('startDate', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="month"
            value={experience.endDate || ''}
            onChange={(e) => onChange('endDate', e.target.value)}
            disabled={experience.current}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="current"
              checked={experience.current || false}
              onCheckedChange={(checked) => {
                onChange('current', checked);
                if (checked) {
                  onChange('endDate', '');
                }
              }}
            />
            <Label htmlFor="current">I currently work here</Label>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="description">Description</Label>
          <AIEnhanceButton 
            onClick={() => setShowAIModal(true)}
            size="sm"
          >
            Enhance Bullets
          </AIEnhanceButton>
        </div>
        <Textarea
          id="description"
          value={experience.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe your role and responsibilities..."
          rows={4}
        />
      </div>

      <BulletEnhanceModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        currentBullet={experience.description || ''}
        jobTitle={experience.title || ''}
        onSelect={(enhanced) => onChange('description', enhanced)}
      />
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Experience' : 'Add Experience'}
        </Button>
      </div>
    </form>
  );
};

export default ExperienceForm;
