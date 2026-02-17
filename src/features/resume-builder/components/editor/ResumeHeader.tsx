import { FileText } from "lucide-react";
import { Progress } from "@/shared/ui/progress";
import { Button } from "@/shared/ui/button";

interface ResumeHeaderProps {
  completionPercentage: number;
  onSave: () => void;
}

export const ResumeHeader = ({ completionPercentage, onSave }: ResumeHeaderProps) => {
  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Resume Builder</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium">{completionPercentage}% Complete</span>
            <Progress value={completionPercentage} className="h-2 w-24" />
          </div>
          <Button 
            onClick={onSave}
            variant="outline"
            size="sm"
          >
            Save Resume
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ResumeHeader;
