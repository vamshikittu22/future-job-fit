import { Settings } from "lucide-react";
import { Button } from "./ui/button";

interface CustomizeAIButtonProps {
  onClick: () => void;
}

export default function CustomizeAIButton({ onClick }: CustomizeAIButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 h-10 border-muted hover:bg-muted/50 transition-all duration-200"
    >
      <Settings className="w-4 h-4" />
      <span className="hidden sm:inline">Customize AI</span>
    </Button>
  );
}