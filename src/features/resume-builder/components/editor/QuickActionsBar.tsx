import React, { useEffect, useCallback, memo, useState, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useWizard } from '@/shared/contexts/WizardContext';
import { useAPIKey } from '@/shared/contexts/APIKeyContext';
import { useTheme } from '@/shared/hooks/useTheme';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { useToast } from '@/shared/hooks/use-toast';
import {
  Undo2,
  Redo2,
  Save,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  Loader2,
  Moon,
  Sun,
  Key,
  Trash2,
  Upload,
  MoreVertical,
} from 'lucide-react';
import { usePyNLP } from '@/shared/hooks/usePyNLP';
import { cn } from '@/shared/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface QuickActionsBarProps {
  onLoadSample: () => void;
  onLoadImport?: () => void;
  onAIEnhance: () => void;
  onTogglePreview: () => void;
  onExport: () => void;
  onAPIKeySettings?: () => void;
  isPreviewVisible: boolean;
  isSaving?: boolean;
}

const QuickActionsBarComponent: React.FC<QuickActionsBarProps> = ({
  onLoadSample,
  onLoadImport,
  onAIEnhance,
  onTogglePreview,
  onExport,
  onAPIKeySettings,
  isPreviewVisible,
  isSaving = false,
}) => {
  const { undo, redo, canUndo, canRedo, saveResume, clearForm } = useResume();
  const { status: pyStatus, error: pyError } = usePyNLP();
  const { wizardState } = useWizard();
  const { isUsingCustomKey, keyState } = useAPIKey();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [localSaving, setLocalSaving] = React.useState(false);
  
  // Track container width for responsive button visibility
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // ResizeObserver to detect actual container width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setLocalSaving(true);
      await saveResume();
      toast({
        title: 'Saved successfully',
        description: 'Your resume has been saved.',
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: 'Save failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLocalSaving(false);
    }
  }, [saveResume, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if we're not in an input/textarea/select
      if (e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement) {
        return;
      }

      // Ctrl+S or Cmd+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl+Z or Cmd+Z - Undo
      else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Ctrl+Shift+Z or Ctrl+Y - Redo
      else if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        if (canRedo) redo();
      }
      // Ctrl+Shift+P - Toggle Preview
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        onTogglePreview();
      }
    };

    // Use capture phase to ensure we catch the event before other handlers
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [canUndo, canRedo, undo, redo, onTogglePreview, handleSave]);

  const getPyStatusColor = () => {
    switch (pyStatus) {
      case 'ready': return 'text-green-500';
      case 'loading': return 'text-yellow-500 animate-pulse';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getPyStatusLabel = () => {
    switch (pyStatus) {
      case 'ready': return 'AI Engine Ready';
      case 'loading': return 'Initializing AI Engine...';
      case 'error': return 'AI Engine Error';
      default: return 'AI Engine Offline';
    }
  };

  if (isMobile) {
    return null; // Don't show on mobile to save space
  }

  // Responsive breakpoints based on container width
  const showNLPStatus = containerWidth > 1000;
  const showAllButtons = containerWidth > 900;
  const showMostButtons = containerWidth > 700;
  const showBasicButtons = containerWidth > 500;

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        ref={containerRef}
        className="sticky top-0 z-20 flex items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 py-2 shadow-sm"
      >
        {/* Left Actions - Critical controls (always visible) */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                className="h-9 px-3"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                className="h-9 px-3"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Redo (Ctrl+Shift+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* AI Enhance - Critical for main workflow */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAIEnhance}
                className="h-9 px-3 text-primary hover:text-primary"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">AI Enhance</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Enhance resume with AI</p>
            </TooltipContent>
          </Tooltip>

          {/* Pyodide Status Indicator - Show on wide screens */}
          {showNLPStatus && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-1 ml-2 rounded-full bg-muted/30 border border-muted select-none cursor-help">
                  <div className={cn("h-2 w-2 rounded-full", getPyStatusColor().split(' ')[0])} />
                  <span className="text-[10px] font-mono tracking-tighter uppercase text-muted-foreground whitespace-nowrap">
                    NLP Core
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{getPyStatusLabel()}</p>
                {pyError && <p className="text-[10px] text-red-400 mt-1">{pyError}</p>}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Center - Auto-save Status (show on wide screens) */}
        {showAllButtons && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {wizardState.autoSaveStatus === 'saving' && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {wizardState.autoSaveStatus === 'saved' && (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>All changes saved</span>
              </>
            )}
            {wizardState.autoSaveStatus === 'error' && (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>Save failed</span>
              </>
            )}
          </div>
        )}

        {/* Right Actions - Essential controls + Overflow */}
        <div className="flex items-center gap-1">
          {/* Toggle Preview - Always visible (critical) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePreview}
                className="h-9 px-3"
              >
                {isPreviewVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Hide Preview</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Show Preview</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Toggle preview (Ctrl+Shift+P)</p>
            </TooltipContent>
          </Tooltip>

          {/* Export - Always visible (critical) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={onExport}
                className="h-9 px-3"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Export resume</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Theme Toggle - Show on basic+ screens */}
          {showBasicButtons && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 px-3"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Overflow Menu - Contains secondary actions */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>More actions</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="w-56">
              {/* File Actions */}
              <DropdownMenuItem onClick={onLoadSample}>
                <FileText className="h-4 w-4 mr-2" />
                Load Sample Resume
              </DropdownMenuItem>

              {onLoadImport && (
                <DropdownMenuItem onClick={onLoadImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import from File
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={handleSave} disabled={localSaving || isSaving}>
                {localSaving || isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Draft (Ctrl+S)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Settings */}
              {onAPIKeySettings && (
                <DropdownMenuItem onClick={onAPIKeySettings}>
                  <Key className="h-4 w-4 mr-2" />
                  <span className={cn(isUsingCustomKey && "text-green-500")}>
                    {isUsingCustomKey 
                      ? `API Key (${keyState.provider.toUpperCase()}) ✓` 
                      : 'Configure API Key'
                    }
                  </span>
                </DropdownMenuItem>
              )}

              {/* Show theme toggle in menu on narrow screens */}
              {!showBasicButtons && (
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Switch to Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Switch to Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {/* Destructive Action */}
              <DropdownMenuItem 
                onClick={clearForm}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const QuickActionsBar = memo(QuickActionsBarComponent, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.isPreviewVisible === nextProps.isPreviewVisible &&
    prevProps.isSaving === nextProps.isSaving
  );
});

QuickActionsBar.displayName = 'QuickActionsBar';

export default QuickActionsBar;
