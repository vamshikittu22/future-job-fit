import { RotateCcw, RotateCw, Save, Moon, Sun, Eye, EyeOff, FileText } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { Progress } from '@/shared/ui/progress';
import { HeaderProps, HeaderButtonProps } from '@/features/resume-builder/components/editor/header/Header.types';

const HeaderButton = ({
  icon,
  label,
  showLabel = true,
  className = '',
  ...props
}: HeaderButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    className={`h-9 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent ${className}`}
    {...props}
  >
    <span className="flex items-center">
      {icon}
      {showLabel && <span className="ml-2 hidden sm:inline">{label}</span>}
    </span>
  </Button>
);

export const Header = ({
  onUndo,
  onRedo,
  onSave,
  onToggleTheme,
  onTogglePreview,
  canUndo,
  canRedo,
  isSaving,
  isDarkMode,
  isPreviewOpen,
  completionPercentage = 0,
}: HeaderProps) => {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Resume Builder</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 w-40">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {completionPercentage}% Complete
              </span>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md p-1 rounded-lg border">
          {/* Undo/Redo Buttons */}
          <HeaderButton
            icon={<RotateCcw className="h-4 w-4" />}
            label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          />
          
          <HeaderButton
            icon={<RotateCw className="h-4 w-4" />}
            label="Redo"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          />
          
          <Separator orientation="vertical" className="h-5 mx-1" />
          
          {/* Save Button */}
          <HeaderButton
            icon={<Save className="h-4 w-4" />}
            label={isSaving ? 'Saving...' : 'Save Draft'}
            onClick={onSave}
            disabled={isSaving}
            title="Save Draft (Ctrl+S)"
          />
          
          <Separator orientation="vertical" className="h-5 mx-1" />
          
          {/* Theme Toggle */}
          <HeaderButton
            icon={isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            onClick={onToggleTheme}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          />
          
          {/* Preview Toggle */}
          <HeaderButton
            icon={isPreviewOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            label={isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
            onClick={onTogglePreview}
            title={isPreviewOpen ? 'Hide preview' : 'Show preview'}
          />
        </div>
      </div>
    </header>
  );
};
