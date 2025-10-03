import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { WizardProvider } from '@/contexts/WizardContext';
import { WizardSidebar } from '@/components/wizard/WizardSidebar';
import WizardPreview from '@/components/wizard/WizardPreview';
import { Button } from '@/components/ui/button';
import { Menu, Eye, Sun, Moon, Undo2, Redo2, Save, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

export const WizardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { theme, setTheme } = useTheme();
  
  // Mock functions for undo/redo/save - replace with actual implementations
  const handleUndo = () => console.log('Undo');
  const handleRedo = () => console.log('Redo');
  const handleSaveDraft = () => console.log('Save Draft');

  return (
    <WizardProvider>
      <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
        {/* Main grid container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Collapsible */}
          <div
            className={cn(
              'transition-all duration-300 ease-in-out border-r bg-card h-full overflow-y-auto',
              isMobile ? 'hidden' : isSidebarCollapsed ? 'w-16' : 'w-64 lg:w-72',
              'flex-shrink-0'
            )}
          >
            <WizardSidebar 
              isCollapsed={isSidebarCollapsed}
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>

          {/* Main content area with preview */}
          <div className="flex-1 flex overflow-hidden">
            {/* Form content */}
            <div
              className={cn(
                'flex flex-col h-full overflow-y-auto',
                isMobile ? 'w-full' : isPreviewVisible ? 'w-1/2' : 'w-full',
                'min-w-0' // Ensure flex items can shrink below their content size
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
                    title="Undo (Ctrl+Z)"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRedo}
                    title="Redo (Ctrl+Shift+Z)"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveDraft}
                    title="Save Draft (Ctrl+S)"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    <span className="text-xs">Save Draft</span>
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
              <div className="flex-1 min-h-0">
                <Outlet />
              </div>
            </div>

            {/* Right Preview Panel */}
            {!isMobile && isPreviewVisible && (
              <div className="w-1/2 border-l bg-muted/30 flex-shrink-0 overflow-y-auto">
                <WizardPreview />
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
          <div className="fixed inset-0 z-50 bg-background">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Preview</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Close
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
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
