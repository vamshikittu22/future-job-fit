import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { WizardStepContainer } from '@/components/wizard/WizardStepContainer';
import { ProgressStepper } from '@/components/wizard/ProgressStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';

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
        <div className="space-y-4">
          {resumeData.projects?.map((project, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.role && <p className="text-sm text-muted-foreground">{project.role}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(project, index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeProject(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {(project.startDate || project.endDate) && (
                  <p className="text-xs text-muted-foreground">
                    {project.startDate} - {project.endDate || 'Present'}
                    {project.url && (
                      <span className="ml-2">• <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Project</a></span>
                    )}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.technologies.map(tech => (
                      <span key={tech} className="bg-muted px-2 py-1 rounded-md text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {resumeData.projects?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No projects added yet. Click "Add Project" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </WizardStepContainer>
  );
};
