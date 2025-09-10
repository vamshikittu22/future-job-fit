import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Save, Eye, Download, Upload, Sparkles, Minimize2, Maximize2, Move } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  const handleSave = () => {
    onSave();
    toast({
      title: "Draft saved",
      description: "Your resume has been saved as a draft.",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useState(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  });

  return (
    <Card
      className={cn(
        "fixed z-50 bg-background/95 backdrop-blur border shadow-swiss transition-all duration-300",
        isMinimized ? "w-12 h-12" : "w-auto",
        isDragging ? "cursor-grabbing shadow-accent" : "cursor-grab"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {isMinimized ? (
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(false)}
            className="h-6 w-6 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="p-2">
          {/* Drag Handle */}
          <div
            className="flex items-center justify-between mb-2 px-2 py-1 rounded cursor-grab hover:bg-muted/50"
            onMouseDown={handleMouseDown}
          >
            <Move className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Toolbar Actions */}
          <div className="flex items-center gap-2">
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
        </div>
      )}
    </Card>
  );
}