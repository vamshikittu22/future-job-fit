import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card } from "@/shared/ui/card";
import { Plus, X } from "lucide-react";

interface ProjectSectionProps {
    projects: any[];
    updateResumeData: (section: string, data: any) => void;
}

export const ProjectSection = ({ projects, updateResumeData }: ProjectSectionProps) => {
    const addProject = () => {
        const newProject = {
            id: Date.now().toString(),
            name: "",
            tech: "",
            startDate: "",
            endDate: "",
            bullets: [""]
        };
        updateResumeData('projects', [...(projects || []), newProject]);
    };

    const updateProject = (id: string, field: string, value: any) => {
        const updated = (projects || []).map((proj: any) =>
            proj.id === id ? { ...proj, [field]: value } : proj
        );
        updateResumeData('projects', updated);
    };

    const removeProject = (id: string) => {
        updateResumeData('projects', (projects || []).filter((proj: any) => proj.id !== id));
    };

    return (
        <div className="space-y-6">
            <Button
                type="button"
                variant="outline"
                onClick={addProject}
                className="w-full"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
            </Button>

            {(projects || []).map((project: any, index: number) => (
                <Card key={project.id} className="p-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium">Project {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProject(project.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`proj-name-${project.id}`}>Project Name *</Label>
                                <Input
                                    id={`proj-name-${project.id}`}
                                    placeholder="My Awesome Project"
                                    value={project.name || ''}
                                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`proj-tech-${project.id}`}>Technologies</Label>
                                <Input
                                    id={`proj-tech-${project.id}`}
                                    placeholder="React, Node.js, MongoDB"
                                    value={project.tech || ''}
                                    onChange={(e) => updateProject(project.id, 'tech', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor={`proj-start-${project.id}`}>Start</Label>
                                    <Input
                                        id={`proj-start-${project.id}`}
                                        placeholder="Jan 2023"
                                        value={project.startDate || ''}
                                        onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`proj-end-${project.id}`}>End</Label>
                                    <Input
                                        id={`proj-end-${project.id}`}
                                        placeholder="Mar 2023"
                                        value={project.endDate || ''}
                                        onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor={`proj-duration-${project.id}`}>Duration</Label>
                                <Input
                                    id={`proj-duration-${project.id}`}
                                    placeholder="3 months"
                                    value={project.duration || ''}
                                    onChange={(e) => updateProject(project.id, 'duration', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`proj-link-${project.id}`}>Link (Optional)</Label>
                                <Input
                                    id={`proj-link-${project.id}`}
                                    placeholder="https://github.com/user/project"
                                    value={project.link || ''}
                                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Project Details</Label>
                            <div className="space-y-2 mt-2">
                                {(project.bullets || []).map((bullet: string, bulletIndex: number) => (
                                    <div key={bulletIndex} className="flex gap-2">
                                        <Input
                                            placeholder="Describe project feature or achievement..."
                                            value={bullet}
                                            onChange={(e) => updateProject(project.id, 'bullets', [...project.bullets.slice(0, bulletIndex), e.target.value, ...project.bullets.slice(bulletIndex + 1)])}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => updateProject(project.id, 'bullets', project.bullets.filter((_: any, i: number) => i !== bulletIndex))}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateProject(project.id, 'bullets', [...(project.bullets || []), ""])}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Detail
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
