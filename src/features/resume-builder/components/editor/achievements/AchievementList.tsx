import { Award, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ResumeData } from "@/shared/lib/initialData";

type Achievement = ResumeData['achievements'][0];

interface AchievementListProps {
  achievements: Achievement[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export const AchievementList = ({
  achievements,
  onEdit,
  onRemove,
}: AchievementListProps) => {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Award className="mx-auto h-12 w-12 mb-2 opacity-20" />
        <p>No achievements added yet.</p>
        <p className="text-sm">Click the button above to add your first achievement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {achievements.map((achievement, index) => (
        <div key={achievement.id} className="border rounded-lg p-4 relative group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{achievement.title}</h3>
              {achievement.issuer && (
                <p className="text-sm text-muted-foreground">{achievement.issuer}</p>
              )}
              {achievement.description && (
                <p className="mt-2 text-sm">{achievement.description}</p>
              )}
              {achievement.date && (
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(achievement.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
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

export default AchievementList;
