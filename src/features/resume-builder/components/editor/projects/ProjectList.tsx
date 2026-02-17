import { Folder, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ResumeData } from "@/shared/lib/initialData";

type Project = ResumeData['projects'][0];

interface ProjectListProps {
  projects: Project[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export const ProjectList = ({
  projects,
  onEdit,
  onRemove,
}: ProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Folder className="mx-auto h-12 w-12 mb-2 opacity-20" />
        <p>No projects added yet.</p>
        <p className="text-sm">Click the button above to add your first project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={project.id} className="border rounded-lg p-4 relative group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{project.name}</h3>
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              {project.role && (
                <p className="text-sm text-muted-foreground">{project.role}</p>
              )}
              <p className="text-sm">{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              {(project.startDate || project.endDate) && (
                <p className="text-xs text-muted-foreground mt-2">
                  {project.startDate} - {project.endDate || 'Present'}
                </p>
              )}
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(index)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
