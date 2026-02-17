import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { X, Plus, Trash2, ExternalLink, Github } from 'lucide-react';
import { Project } from '@/features/resume-builder/components/editor/types';

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export const ProjectsForm = ({ projects, onChange }: ProjectsFormProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>(() => ({
    id: '',
    name: '',
    description: '',
    technologies: [],
    url: '',
    githubUrl: '',
  }));
  const [newTech, setNewTech] = useState('');

  const handleAddProject = () => {
    if (!formData.name || !formData.description) return;

    const project: Project = {
      id: editingId || `proj-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      technologies: formData.technologies || [],
      url: formData.url || '',
      githubUrl: formData.githubUrl || '',
    };

    if (editingId) {
      onChange(projects.map((p) => (p.id === editingId ? project : p)));
    } else {
      onChange([...projects, project]);
    }

    resetForm();
  };

  const handleEdit = (project: Project) => {
    setFormData({
      ...project,
      technologies: project.technologies || [],
    });
    setEditingId(project.id);
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter((project) => project.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      technologies: [],
      url: '',
      githubUrl: '',
    });
    setNewTech('');
    setEditingId(null);
  };

  const addTechnology = () => {
    if (!newTech.trim() || !formData.technologies) return;
    setFormData({
      ...formData,
      technologies: [...(formData.technologies || []), newTech.trim()],
    });
    setNewTech('');
  };

  const removeTechnology = (techToRemove: string) => {
    setFormData({
      ...formData,
      technologies: (formData.technologies || []).filter(
        (tech) => tech !== techToRemove
      ),
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6 p-4 border rounded-lg bg-card">
        <h3 className="text-lg font-medium">
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="My Awesome Project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description *</Label>
            <Textarea
              id="projectDescription"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="A brief description of the project, its purpose, and your role."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Technologies Used</Label>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
                placeholder="e.g., React, Node.js"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTechnology}
                disabled={!newTech.trim()}
              >
                Add
              </Button>
            </div>
            {(formData.technologies || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies?.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectUrl">Live Demo URL (optional)</Label>
              <div className="relative">
                <Input
                  id="projectUrl"
                  type="url"
                  value={formData.url || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="pl-10"
                />
                <ExternalLink className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub Repository (optional)</Label>
              <div className="relative">
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/username/repo"
                  className="pl-10"
                />
                <Github className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
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
            onClick={handleAddProject}
            disabled={!formData.name || !formData.description}
          >
            {editingId ? 'Update Project' : 'Add Project'}
          </Button>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Your Projects</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative p-4 border rounded-lg hover:bg-accent/20 transition-colors h-full flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-lg">{project.name}</h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(project)}
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
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 flex-grow">
                  {project.description && project.description.length > 120
                    ? `${project.description.substring(0, 120)}...`
                    : project.description || 'No description provided'}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-auto pt-2 border-t">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
