import { GraduationCap, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ResumeData } from "@/shared/lib/initialData";

type Education = ResumeData['education'][0];

interface EducationListProps {
  education: Education[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export const EducationList = ({
  education,
  onEdit,
  onRemove,
}: EducationListProps) => {
  if (education.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <GraduationCap className="mx-auto h-12 w-12 mb-2 opacity-20" />
        <p>No education information added yet.</p>
        <p className="text-sm">Click the button above to add your first education entry.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <div key={edu.id} className="border rounded-lg p-4 relative group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">
                {edu.school}
                {edu.fieldOfStudy && ` • ${edu.fieldOfStudy}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {edu.startDate} - {edu.endDate || 'Present'}
              </p>
              {edu.description && (
                <p className="mt-2 text-sm">{edu.description}</p>
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

export default EducationList;
