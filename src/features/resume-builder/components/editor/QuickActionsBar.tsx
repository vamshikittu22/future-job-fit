import React, { useEffect, useCallback, memo } from 'react';
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
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';

interface QuickActionsBarProps {
  onLoadSample: () => void;
  onAIEnhance: () => void;
  onTogglePreview: () => void;
  onExport: () => void;
  onAPIKeySettings?: () => void;
  isPreviewVisible: boolean;
  isSaving?: boolean;
}

const QuickActionsBarComponent: React.FC<QuickActionsBarProps> = ({
  onLoadSample,
  onAIEnhance,
  onTogglePreview,
  onExport,
  onAPIKeySettings,
  isPreviewVisible,
  isSaving = false,
}) => {
  const { undo, redo, canUndo, canRedo, saveResume } = useResume();
  const { wizardState } = useWizard();
  const { isUsingCustomKey, keyState } = useAPIKey();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [localSaving, setLocalSaving] = React.useState(false);

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

  if (isMobile) {
    return null; // Don't show on mobile to save space
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 py-2 shadow-sm">
        {/* Left Actions */}
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

          {/* Load Sample */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoadSample}
                className="h-9 px-3"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Load Sample</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Load sample resume data</p>
            </TooltipContent>
          </Tooltip>

          {/* AI Enhance */}
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

          {/* API Key Settings */}
          {onAPIKeySettings && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAPIKeySettings}
                  className={cn(
                    "h-9 px-3",
                    isUsingCustomKey && "text-green-500 hover:text-green-600"
                  )}
                >
                  <Key className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">
                    {isUsingCustomKey ? 'API Key ✓' : 'API Key'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {isUsingCustomKey
                    ? `Using your ${keyState.provider.toUpperCase()} key`
                    : 'Configure your own API key'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Center - Auto-save Status */}
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

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Toggle Preview */}
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

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Save */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={localSaving || isSaving}
                className="h-9 px-3"
              >
                {localSaving || isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                <span className="hidden md:inline">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Save draft (Ctrl+S)</p>
            </TooltipContent>
          </Tooltip>

          {/* Export */}
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

          {/* Theme Toggle */}
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
