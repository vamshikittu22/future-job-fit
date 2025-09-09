import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Save, Eye, Download, Upload, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FloatingToolbarProps {
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onImport: () => void;
  onEnhanceAI: () => void;
  showPreview: boolean;
}

export default function FloatingToolbar({
  onSave,
  onPreview,
  onExport,
  onImport,
  onEnhanceAI,
  showPreview
}: FloatingToolbarProps) {
  const { toast } = useToast();

  const handleSave = () => {
    onSave();
    toast({
      title: "Draft saved",
      description: "Your resume has been saved as a draft.",
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-2 bg-background/95 backdrop-blur border rounded-2xl shadow-swiss">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-10 w-10 p-0"
          >
            <Save className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Save Draft</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showPreview ? "default" : "ghost"}
            size="sm"
            onClick={onPreview}
            className="h-10 w-10 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{showPreview ? "Hide Preview" : "Show Preview"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-10 w-10 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export Resume</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onImport}
            className="h-10 w-10 p-0"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Import Resume</p>
        </TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onEnhanceAI}
            className="h-10 px-3 bg-gradient-accent text-primary-foreground border-0 hover:opacity-90"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            AI
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Enhance with AI</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}