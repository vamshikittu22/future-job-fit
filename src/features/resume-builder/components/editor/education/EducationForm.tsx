import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { ResumeData } from "@/shared/lib/initialData";
type Education = ResumeData['education'][0];
import { DialogFooter } from "@/shared/ui/dialog";

interface EducationFormProps {
  education: Partial<Education>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Education, value: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const EducationForm = ({
  education,
  onSubmit,
  onChange,
  onCancel,
  isEditing,
}: EducationFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            name="degree"
            value={education.degree || ''}
            onChange={(e) => onChange('degree', e.target.value)}
            placeholder="e.g. Bachelor of Science"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school">School</Label>
          <Input
            id="school"
            name="school"
            value={education.school || ''}
            onChange={(e) => onChange('school', e.target.value)}
            placeholder="University Name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fieldOfStudy">Field of Study</Label>
          <Input
            id="fieldOfStudy"
            value={education.fieldOfStudy || ''}
            onChange={(e) => onChange('fieldOfStudy', e.target.value)}
            placeholder="Computer Science"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={education.startDate || ''}
            onChange={(e) => onChange('startDate', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (or expected)</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={education.endDate || ''}
            onChange={(e) => onChange('endDate', e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Education' : 'Add Education'}
        </Button>
      </div>
    </form>
  );
};

export default EducationForm;
