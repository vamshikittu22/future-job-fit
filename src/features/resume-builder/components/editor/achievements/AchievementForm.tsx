import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { ResumeData } from "@/shared/lib/initialData";

type Achievement = ResumeData['achievements'][0];

interface AchievementFormProps {
  achievement: Partial<Achievement>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Achievement, value: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const AchievementForm = ({
  achievement,
  onSubmit,
  onChange,
  onCancel,
  isEditing,
}: AchievementFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={achievement.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="e.g. Employee of the Month"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuer">Issuer</Label>
          <Input
            id="issuer"
            name="issuer"
            value={achievement.issuer || ''}
            onChange={(e) => onChange('issuer', e.target.value)}
            placeholder="e.g. Company Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="month"
            value={achievement.date || ''}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={achievement.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Brief description of the achievement..."
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Achievement' : 'Add Achievement'}
        </Button>
      </div>
    </form>
  );
};

export default AchievementForm;
