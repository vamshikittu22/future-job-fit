import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Eye, Home, Sparkles, ChevronDown, ChevronUp, Link2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/shared/lib/utils';
import { WizardProvider, useWizard } from '@/shared/contexts/WizardContext';
import { ATSProvider } from '@/shared/contexts/ATSContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useJob } from '@/shared/contexts/JobContext';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { useToast } from '@/shared/ui/use-toast';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { WizardSidebar } from '@/features/resume-builder/components/layout/WizardSidebar';
import WizardPreview from '@/features/resume-builder/components/layout/WizardPreview';
import { WizardHelperRail } from '@/features/resume-builder/components/layout/WizardHelperRail';
import QuickActionsBar from '@/features/resume-builder/components/editor/QuickActionsBar';
import SampleDataLoader from '@/features/resume-builder/components/editor/SampleDataLoader';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';
import APIKeySettingsModal from '@/features/resume-builder/components/modals/APIKeySettingsModal';
import { ExportResumeModal } from '@/features/resume-builder/components/editor/ExportResumeModal';
import ImportResumeModal from '@/features/resume-builder/components/modals/ImportResumeModal';
import GodModePanel from '@/features/resume-builder/components/editor/GodModePanel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { MobileProgressBar } from '@/features/resume-builder/components/layout/MobileProgressBar';
import { MobileActionBar } from '@/features/resume-builder/components/layout/MobileActionBar';

const WizardLayoutContent: React.FC = () => {
  const { currentStep } = useWizard();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeData, setResumeData } = useResume();
  const { toast } = useToast();
  const { currentJob } = useJob();
  
  // Check if JD is linked
  const hasLinkedJD = !!currentJob && !!currentJob.title;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHelperOpen, setIsHelperOpen] = useState(() => {
    // Load helper state from localStorage (default: closed)
    const saved = localStorage.getItem('wizard-helper-panel-open');
    return saved === 'true';
  });
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSampleDataModalOpen, setIsSampleDataModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAPIKeyModalOpen, setIsAPIKeyModalOpen] = useState(false);
  const [lastStepId, setLastStepId] = useState<string | undefined>(currentStep?.id);

  // God Mode State
  const [isGodMode, setIsGodMode] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Persist helper panel state
  useEffect(() => {
    localStorage.setItem('wizard-helper-panel-open', String(isHelperOpen));
  }, [isHelperOpen]);

  const toggleHelper = () => {
    setIsHelperOpen(prev => !prev);
  };

  useEffect(() => {
    if (currentStep?.id) {
      setLastStepId(currentStep.id);
    }
  }, [currentStep?.id]);

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
                onToggleHelper={toggleHelper}
                isHelperOpen={isHelperOpen}
              />
            </div>
          )}

          {/* Helper Panel (Floating Left Side) - Slides in between Sidebar and Editor */}
          <AnimatePresence>
            {!isMobile && isHelperOpen && (
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-[300px] border-r bg-background flex-shrink-0 overflow-y-auto"
              >
                <WizardHelperRail 
                  currentStepId={currentStep?.id || 'personal'} 
                  showCollapseButton={false} 
                  onClose={toggleHelper}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor Panel (Center) */}
          <div
            className={cn(
              'flex flex-col h-full overflow-y-auto min-w-0',
              'transition-all duration-300',
              getContentWidth()
            )}
          >
            <div className="flex items-center justify-between border-b bg-card p-4 flex-shrink-0">
              <div className="flex items-center space-x-3">
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
                <h1 className="text-lg font-semibold">Resume Wizard</h1>
                
                {/* Linked JD Badge */}
                {hasLinkedJD && (
                  <Badge 
                    variant="secondary" 
                    className="flex items-center gap-1.5 px-2 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => navigate('/job-optimizer')}
                  >
                    <Link2 className="h-3 w-3" />
                    <span className="text-xs max-w-[200px] truncate">
                      Linked: {currentJob.title}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </Badge>
                )}
              </div>

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
                onLoadImport={() => setIsImportModalOpen(true)}
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

          {/* Preview Panel (Right Side) - Always visible on desktop */}
          {!isMobile && (
            <AnimatePresence mode="wait">
              {isPreviewVisible && (
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
          )}
        </div>

        <SampleDataLoader open={isSampleDataModalOpen} onOpenChange={setIsSampleDataModalOpen} />

        <ImportResumeModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onImport={setResumeData}
        />

        <AIEnhanceModal
          open={isAIEnhanceModalOpen}
          onOpenChange={setIsAIEnhanceModalOpen}
          resumeData={resumeData}
          onEnhance={handleAIEnhance}
        />

        <ExportResumeModal open={isExportModalOpen} onOpenChange={setIsExportModalOpen} />

        <APIKeySettingsModal open={isAPIKeyModalOpen} onOpenChange={setIsAPIKeyModalOpen} />
      </div>

      {/* Mobile Progress Bar (Top) */}
      {isMobile && <MobileProgressBar />}

      {/* Mobile Helper Rail Accordion (Above Action Bar) */}
      {isMobile && (
        <Accordion type="single" collapsible className="border-t bg-background">
          <AccordionItem value="helper" className="border-none">
            <AccordionTrigger className="px-4 py-2 text-xs font-medium hover:no-underline">
              📘 Step Guide
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 max-h-[300px] overflow-auto">
              <WizardHelperRail currentStepId={currentStep?.id || 'personal'} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Mobile Action Bar (Bottom) */}
      {isMobile && <MobileActionBar onOpenDrawer={() => setIsSidebarCollapsed(false)} />}

      {/* Mobile Sidebar as Sheet Drawer */}
      {isMobile && (
        <Sheet open={!isSidebarCollapsed} onOpenChange={(open) => setIsSidebarCollapsed(!open)}>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Resume Steps</SheetTitle>
            </SheetHeader>
            <WizardSidebar 
              isCollapsed={false} 
              onToggle={() => setIsSidebarCollapsed(true)} 
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Preview as Sheet */}
      {isMobile && (
        <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <SheetContent side="right" className="w-full p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Preview</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-auto p-2 flex justify-center">
              <div className="w-full max-w-[210mm]">
                <WizardPreview />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      <GodModePanel isOpen={isGodMode} onClose={() => setIsGodMode(false)} />
    </>
  );
};

const WizardLayout: React.FC = () => (
  <WizardProvider>
    <ATSProvider>
      <WizardLayoutContent />
    </ATSProvider>
  </WizardProvider>
);

export { WizardLayout };
export default WizardLayout;
