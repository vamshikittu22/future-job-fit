import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { WizardStepContainer } from '@/components/wizard/WizardStepContainer';
import { ProgressStepper } from '@/components/wizard/ProgressStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, X, Save, Code } from 'lucide-react';
import { AnimatedAccordion } from '@/components/resume-wizard/AnimatedAccordion';

export const ProjectsStep: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    description: '',
    technologies: [] as string[],
    url: '',
    startDate: '',
    endDate: ''
  });
  const [techInput, setTechInput] = useState('');

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      role: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: ''
    });
    setTechInput('');
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      technologies: [...formData.technologies],
      id: formData.id || Date.now().toString()
    };

    if (editingIndex !== null) {
      updateProject(editingIndex, projectData);
    } else {
      addProject(projectData);
    }
    
    resetForm();
  };

  const handleEdit = (project: any, index: number) => {
    setFormData({
      id: project.id,
      name: project.name || '',
      role: project.role || '',
      description: project.description || '',
      technologies: project.technologies || [],
      url: project.url || '',
      startDate: project.startDate || '',
      endDate: project.endDate || ''
    });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  return (
    <WizardStepContainer
      title="Projects"
      description="Showcase your notable projects"
    >
      <ProgressStepper />
      
      <div className="space-y-6">
        {!isAdding ? (
          <Button 
            onClick={() => setIsAdding(true)}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={resetForm}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name *</label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Project Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Role</label>
                    <Input 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="Your Role"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the project, your role, and key achievements"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Technologies</label>
                  <div className="flex gap-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add technology"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addTechnology}
                    >
                      Add
                    </Button>
                  </div>
                  {formData.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.technologies.map(tech => (
                        <div key={tech} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                          {tech}
                          <button 
                            type="button"
                            onClick={() => removeTechnology(tech)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={`Remove ${tech}`}
                            title={`Remove ${tech}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project URL</label>
                    <Input 
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input 
                      type="month"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input 
                      type="month"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingIndex !== null ? 'Update' : 'Save'} Project
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Projects List */}
        {resumeData.projects && resumeData.projects.length > 0 ? (
          <AnimatedAccordion
            items={resumeData.projects.map((project, index) => ({
              id: project.id || `project-${index}`,
              title: project.name,
              badge: project.role || undefined,
              icon: <Code className="h-4 w-4 text-muted-foreground" />,
              content: (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {(project.startDate || project.endDate) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{project.startDate} - {project.endDate || 'Present'}</span>
                        {project.url && (
                          <>
                            <span>•</span>
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              View Project
                            </a>
                          </>
                        )}
                      </div>
                    )}
                    {project.description && (
                      <p className="text-sm whitespace-pre-line bg-muted/50 p-4 rounded-md">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project, index)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeProject(index)}
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
            defaultValue={resumeData.projects[0]?.id || `project-0`}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No projects added yet. Click "Add Project" to get started.</p>
          </div>
        )}
      </div>
    </WizardStepContainer>
  );
};
