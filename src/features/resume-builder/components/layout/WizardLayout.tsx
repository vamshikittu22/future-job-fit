import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Eye, Home, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/shared/lib/utils';
import { WizardProvider, useWizard } from '@/shared/contexts/WizardContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { useToast } from '@/shared/ui/use-toast';
import { Button } from '@/shared/ui/button';
import { WizardSidebar } from '@/features/resume-builder/components/layout/WizardSidebar';
import WizardPreview from '@/features/resume-builder/components/layout/WizardPreview';
import QuickActionsBar from '@/features/resume-builder/components/editor/QuickActionsBar';
import SampleDataLoader from '@/features/resume-builder/components/editor/SampleDataLoader';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';
import APIKeySettingsModal from '@/features/resume-builder/components/modals/APIKeySettingsModal';
import { ExportResumeModal } from '@/features/resume-builder/components/editor/ExportResumeModal';
import GodModePanel from '@/features/resume-builder/components/editor/GodModePanel';

const WizardLayoutContent: React.FC = () => {
  const { currentStep } = useWizard();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSampleDataModalOpen, setIsSampleDataModalOpen] = useState(false);
  const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAPIKeyModalOpen, setIsAPIKeyModalOpen] = useState(false);
  const [lastStepId, setLastStepId] = useState<string | undefined>(currentStep?.id);

  // God Mode State
  const [isGodMode, setIsGodMode] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  useEffect(() => {
    if (currentStep?.id) {
      setLastStepId(currentStep.id);
    }
  }, [currentStep?.id]);

  const { resumeData, setResumeData } = useResume();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Reset click count after delay
  useEffect(() => {
    if (logoClickCount === 0) return;
    const timer = setTimeout(() => setLogoClickCount(0), 1000); // 1 second window
    return () => clearTimeout(timer);
  }, [logoClickCount]);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Prevent default navigation if we are in the middle of a triple click
    // But we need to allow navigation on single click.
    // Actually, let's just use the badge as the trigger, so the main logo still navigates.
  };

  useEffect(() => {
    setIsPreviewVisible(!isMobile);
    if (!isMobile) {
      setIsPreviewOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    setIsPreviewVisible(!isMobile);
    if (!isMobile) {
      setIsPreviewOpen(false);
    }
  }, [isMobile]);

  // Listen for collapse-sidebar event from WizardStepContainer
  useEffect(() => {
    const handleCollapseSidebar = () => {
      if (isMobile) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('collapse-sidebar', handleCollapseSidebar);
    return () => window.removeEventListener('collapse-sidebar', handleCollapseSidebar);
  }, [isMobile]);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleAIEnhance = (enhancedData: any) => {
    setResumeData(enhancedData);
    toast({
      title: 'Resume enhanced!',
      description: 'Your resume has been enhanced with AI.',
    });
  };

  const getSidebarWidth = () => {
    if (isMobile) return 'hidden';
    return isSidebarCollapsed ? 'w-16' : 'w-64';
  };

  const getContentWidth = () => {
    if (isMobile) return 'w-full';
    if (!isPreviewVisible) {
      return isSidebarCollapsed ? 'w-[calc(100%-4rem)]' : 'w-[calc(100%-16rem)]';
    }
    return 'flex-1';
  };

  const getPreviewWidth = () => {
    if (!isPreviewVisible) return 'w-0';
    return 'w-[35%]'; // 35% of screen width for comfortable viewing
  };

  return (
    <>
      <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Panel (Left Side) */}
          {!isMobile && (
            <div
              className={cn(
                'transition-all duration-300 ease-in-out border-r bg-card h-full overflow-y-auto',
                getSidebarWidth(),
                'flex-shrink-0 z-10'
              )}
            >
              <WizardSidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
              />
            </div>
          )}

          {/* Editor Panel (Center) */}
          <div
            className={cn(
              'flex flex-col h-full overflow-y-auto min-w-0',
              'transition-all duration-300',
              getContentWidth()
            )}
          >
            <div className="flex items-center justify-between border-b bg-card p-4 flex-shrink-0">
              <div className="flex items-center space-x-2">
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed((prev) => !prev)}>
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 font-semibold text-lg hover:bg-transparent"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="bg-primary text-primary-foreground rounded-md px-2 py-1 cursor-pointer" onClick={() => navigate('/')}>Resume</span>
                  <span
                    className="cursor-pointer select-none hover:text-accent transition-colors font-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (logoClickCount >= 2) {
                        setIsGodMode(prev => !prev);
                        setLogoClickCount(0);
                        toast({
                          title: isGodMode ? "GOD MODE DISABLED" : "GOD MODE ENABLED",
                          description: isGodMode ? "Developer Console Deactivated." : "Developer Console Active. Monitoring real-time engine stats.",
                          className: "bg-black border-accent text-accent font-mono"
                        });
                      } else {
                        setLogoClickCount(prev => prev + 1);
                      }
                    }}
                  >
                    AI
                  </span>
                </Button>
              </div>

              <h1 className="text-lg font-semibold">Resume Wizard</h1>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  title="Go to Home"
                >
                  <Home className="h-5 w-5" />
                </Button>
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(true)}>
                    <Eye className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {!isMobile && (
              <QuickActionsBar
                onLoadSample={() => setIsSampleDataModalOpen(true)}
                onAIEnhance={() => setIsAIEnhanceModalOpen(true)}
                onTogglePreview={() => setIsPreviewVisible((prev) => !prev)}
                onExport={() => setIsExportModalOpen(true)}
                onAPIKeySettings={() => setIsAPIKeyModalOpen(true)}
                isPreviewVisible={isPreviewVisible}
                isSaving={false}
              />
            )}

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full h-full p-4">
                <motion.div
                  key={`${location.pathname}-${currentStep?.id || lastStepId || 'default'}`}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.15,
                    ease: 'easeOut'
                  }}
                  className="w-full h-full"
                >
                  <Outlet />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Preview Panel (Right Side) - Slides in from right */}
          <AnimatePresence>
            {!isMobile && isPreviewVisible && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(
                  'bg-muted/30 flex-shrink-0 overflow-y-auto scrollbar-hide border-l',
                  getPreviewWidth(),
                  'flex flex-col min-w-0'
                )}
              >
                <WizardPreview />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SampleDataLoader open={isSampleDataModalOpen} onOpenChange={setIsSampleDataModalOpen} />

        <AIEnhanceModal
          open={isAIEnhanceModalOpen}
          onOpenChange={setIsAIEnhanceModalOpen}
          resumeData={resumeData}
          onEnhance={handleAIEnhance}
        />

        <ExportResumeModal open={isExportModalOpen} onOpenChange={setIsExportModalOpen} />

        <APIKeySettingsModal open={isAPIKeyModalOpen} onOpenChange={setIsAPIKeyModalOpen} />
      </div>

      {isMobile && (
        <Button
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition-all z-30"
          size="icon"
          onClick={() => setIsPreviewOpen(true)}
          title="Full Preview"
        >
          <Eye className="h-6 w-6" />
        </Button>
      )}

      {isMobile && isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
            <h2 className="text-lg font-semibold">Preview</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(false)} className="ml-auto">
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

      {isMobile && !isSidebarCollapsed && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsSidebarCollapsed(true)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80 bg-card shadow-xl">
            <WizardSidebar isCollapsed={false} onToggle={() => setIsSidebarCollapsed(true)} />
          </div>
        </>
      )}
      <GodModePanel isOpen={isGodMode} onClose={() => setIsGodMode(false)} />
    </>
  );
};

const WizardLayout: React.FC = () => (
  <WizardProvider>
    <WizardLayoutContent />
  </WizardProvider>
);

export { WizardLayout };
export default WizardLayout;
