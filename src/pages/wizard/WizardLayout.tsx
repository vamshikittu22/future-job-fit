import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';
import { WizardProvider } from '@/contexts/WizardContext';
import { WizardSidebar } from '@/components/wizard/WizardSidebar';
import WizardPreview from '@/components/wizard/WizardPreview';
import { Button } from '@/components/ui/button';
import { Menu, Eye, Sun, Moon, Undo2, Redo2, Save, MoonIcon, SunIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/hooks/useTheme';
import { useMediaQuery } from '@/hooks/use-media-query';

export const WizardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  // Default to showing preview on desktop/tablet, hidden on mobile
  const [isPreviewVisible, setIsPreviewVisible] = useState(!isMobile);
  
  // Adjust preview visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      setIsPreviewVisible(false);
    } else {
      setIsPreviewVisible(true);
    }
  }, [isMobile]);
  const { theme, setTheme } = useTheme();
  
  // Get resume context for saving/loading drafts
  const { undo, redo, canUndo, canRedo, saveResume } = useResume();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleUndo = () => {
    if (canUndo) {
      undo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      await saveResume();
      setLastSaved(new Date());
      toast({
        title: 'Draft saved',
        description: 'Your progress has been saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate dynamic widths based on sidebar and preview visibility
  const getContentWidth = () => {
    if (isMobile) return 'w-full';
    if (!isPreviewVisible) return 'w-full';
    if (isSidebarCollapsed) return 'w-3/5';
    return 'w-1/2';
  };

  const getPreviewWidth = () => {
    if (isSidebarCollapsed) return 'w-2/5';
    return 'w-1/2';
  };

  return (
    <WizardProvider>
      <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
        {/* Main grid container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Collapsible */}
          <div
            className={cn(
              'transition-all duration-300 ease-in-out border-r bg-card h-full overflow-y-auto',
              isMobile ? 'hidden' : isSidebarCollapsed ? 'w-16' : 'w-72',
              'flex-shrink-0',
              'z-10' // Ensure sidebar stays above other content
            )}
          >
            <WizardSidebar 
              isCollapsed={isSidebarCollapsed}
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>

          {/* Main content area with preview */}
          <div className="flex-1 flex overflow-hidden min-w-0">
            {/* Form content - Always takes remaining space */}
            <div
              className={cn(
                'flex flex-col h-full overflow-y-auto',
                'transition-all duration-300',
                getContentWidth(),
                'min-w-0' // Allow content to shrink below its minimum size
              )}
            >
            {/* Mobile header with menu toggle */}
            {isMobile && (
              <div className="flex items-center justify-between border-b bg-card p-4 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">Resume Wizard</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Desktop Toolbar */}
            {!isMobile && (
              <div className="flex items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 py-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                    className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Shift+Z)"
                    className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    title="Save Draft (Ctrl+S)"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    <span>Save Draft</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-muted-foreground hover:text-foreground"
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  >
                    {theme === 'dark' ? (
                      <SunIcon className="h-4 w-4" />
                    ) : (
                      <MoonIcon className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isPreviewVisible ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>
              </div>
            )}

              {/* Main content area - full height with scrolling */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto w-full">
                  <Outlet />
                </div>
              </div>
            </div>

            {/* Right Preview Panel */}
            {!isMobile && isPreviewVisible && (
              <div 
                className={cn(
                  'border-l bg-muted/30 flex-shrink-0 overflow-y-auto',
                  'transition-all duration-300',
                  getPreviewWidth(),
                  'flex flex-col',
                  'min-w-0' // Allow preview to shrink if needed
                )}
              >
                <div className="flex-1 overflow-y-auto p-2 flex justify-center">
                  <div className="w-full max-w-[210mm] h-full" style={{ aspectRatio: '210/297' }}>
                    <WizardPreview />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile FAB for preview */}
        {isMobile && (
          <Button
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
            size="icon"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-6 w-6" />
          </Button>
        )}

        {/* Mobile preview modal */}
        {isMobile && isPreviewOpen && (
          <div className="fixed inset-0 z-50 bg-background flex flex-col">
            <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
              <h2 className="text-lg font-semibold">Preview</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
                className="ml-auto"
              >
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 flex justify-center">
              <div className="w-full max-w-[210mm] h-full" style={{ aspectRatio: '210/297' }}>
                <WizardPreview />
              </div>
            </div>
          </div>
        )}
        {/* Mobile sidebar overlay */}
        {isMobile && !isSidebarCollapsed && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/50" 
              onClick={() => setIsSidebarCollapsed(true)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-80 bg-card shadow-xl">
              <WizardSidebar
                isCollapsed={false}
                onToggle={() => setIsSidebarCollapsed(true)}
              />
            </div>
          </>
        )}
      </div>
    </WizardProvider>
  );
};
