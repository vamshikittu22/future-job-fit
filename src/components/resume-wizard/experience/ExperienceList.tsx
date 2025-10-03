import { Briefcase, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Experience } from "@/lib/initialData";

interface ExperienceListProps {
  experiences: Experience[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export const ExperienceList = ({
  experiences,
  onEdit,
  onRemove,
}: ExperienceListProps) => {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Briefcase className="mx-auto h-12 w-12 mb-2 opacity-20" />
        <p>No work experience added yet.</p>
        <p className="text-sm">Click the button above to add your first work experience.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <div key={exp.id} className="border rounded-lg p-4 relative group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{exp.title}</h3>
              <p className="text-sm text-muted-foreground">
                {exp.company}
                {exp.location && ` • ${exp.location}`}
                {exp.startDate &&
                  ` • ${new Date(exp.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })} - ${
                    exp.current
                      ? 'Present'
                      : exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })
                      : 'Present'
                  }`}
              </p>
              {exp.description && (
                <p className="mt-2 text-sm">{exp.description}</p>
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

export default ExperienceList;
