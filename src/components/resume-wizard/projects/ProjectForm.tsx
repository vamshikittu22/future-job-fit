import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AIEnhanceButton } from '../AIEnhanceButton';
import { ProjectImpactModal } from '../ProjectImpactModal';
import { ResumeData } from "@/lib/initialData";

type Project = ResumeData['projects'][0];

interface ProjectFormProps {
  project: Partial<Project>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Project, value: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const ProjectForm = ({
  project,
  onSubmit,
  onChange,
  onCancel,
  isEditing,
}: ProjectFormProps) => {
  const [showAIModal, setShowAIModal] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            name="name"
            value={project.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="My Awesome Project"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Your Role</Label>
          <Input
            id="role"
            name="role"
            value={project.role || ''}
            onChange={(e) => onChange('role', e.target.value)}
            placeholder="e.g. Lead Developer"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description">Description *</Label>
            <AIEnhanceButton 
              onClick={() => setShowAIModal(true)}
              size="sm"
              disabled={!project.name || !project.technologies?.length}
            >
              Get AI Impact Suggestions
            </AIEnhanceButton>
          </div>
          <Textarea
            id="description"
            name="description"
            value={project.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Briefly describe the project and your contributions..."
            rows={4}
            required
          />
        </div>

        <ProjectImpactModal
          open={showAIModal}
          onOpenChange={setShowAIModal}
          projectName={project.name || ''}
          description={project.description || ''}
          technologies={project.technologies || []}
          onSelect={(bullet) => onChange('description', (project.description || '') + '\n' + bullet)}
        />
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="technologies">Technologies Used</Label>
          <Input
            id="technologies"
            name="technologies"
            value={project.technologies?.join(', ') || ''}
            onChange={(e) => onChange('technologies', e.target.value.split(',').map(t => t.trim()))}
            placeholder="e.g. React, Node.js, MongoDB"
          />
          <p className="text-xs text-muted-foreground">Separate technologies with commas</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="month"
            value={project.startDate || ''}
            onChange={(e) => onChange('startDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            name="endDate"
            type="month"
            value={project.endDate || ''}
            onChange={(e) => onChange('endDate', e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="url">Project URL (optional)</Label>
          <Input
            id="url"
            name="url"
            type="url"
            value={project.url || ''}
            onChange={(e) => onChange('url', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Project' : 'Add Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
