import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useWizard } from '@/shared/contexts/WizardContext';
import ResumePreview from '@/features/resume-builder/components/preview/ResumePreview';
import { TEMPLATE_OPTIONS } from '@/shared/config/wizardSteps';
import type { ResumeData } from '@/shared/types/resume';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const WizardPreview: React.FC = () => {
  const { resumeData } = useResume();
  const { wizardState } = useWizard();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionOrder = [
    'personal',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'achievements',
    'certifications',
    ...(resumeData?.customSections?.map((sec: any) => sec.id) || [])
  ];

  const updateScale = useCallback(() => {
    if (!containerRef.current || !isAutoFit) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 48; // Padding
    const containerHeight = container.clientHeight - 120; // Pagination area

    const widthScale = containerWidth / (210 * 3.78);
    const heightScale = containerHeight / (297 * 3.78);

    setZoom(Math.min(widthScale, heightScale, 1.2));
  }, [isAutoFit]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleZoom = (delta: number) => {
    setIsAutoFit(false);
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2.5));
  };

  // Scroll to page when currentPage changes
  useEffect(() => {
    const previewContainer = document.getElementById('resume-preview-container');
    if (previewContainer) {
      const pageElements = previewContainer.getElementsByClassName('resume-page');
      if (pageElements[currentPage - 1]) {
        pageElements[currentPage - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage]);

  return (
    <div ref={containerRef} className="w-full h-full bg-muted/30 dark:bg-slate-950 flex flex-col overflow-hidden relative">
      {/* External Toolbar - Theme Content Aware */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-background/80 backdrop-blur-md border-b border-border z-30 sticky top-0 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(-0.1)}
            title="Zoom Out"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="text-[11px] font-bold w-12 text-center text-foreground tabular-nums opacity-80">
            {Math.round(zoom * 100)}%
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(0.1)}
            title="Zoom In"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1.5 shadow-sm" />
          <Button
            variant={isAutoFit ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              setIsAutoFit(true);
              updateScale();
            }}
            className={cn(
              "h-7 px-2.5 gap-1.5 text-[10px] uppercase tracking-wider font-extrabold transition-all",
              isAutoFit
                ? "bg-primary text-primary-foreground shadow-sm scale-105"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <Maximize2 className="h-3 w-3" />
            Auto Fit
          </Button>
        </div>

        <div className="flex items-center gap-2.5 bg-muted/50 p-1 rounded-lg border border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-primary disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-2 text-[10px] font-black text-foreground tabular-nums flex items-center gap-1">
            <span className="text-primary">{currentPage}</span>
            <span className="opacity-30">/</span>
            <span>{totalPages}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-primary disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area - Distraction Free */}
      <div className="flex-1 overflow-auto p-8 flex justify-center items-start scrollbar-hide selection:bg-primary/20">
        <div
          className="origin-top transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            transform: `scale(${zoom})`,
            marginBottom: `${(297 * 3.78 * (zoom - 1)) + 120}px`,
          }}
        >
          <ResumePreview
            resumeData={resumeData as ResumeData}
            template={wizardState.selectedTemplate || TEMPLATE_OPTIONS[0].id}
            sectionOrder={sectionOrder}
            manualScale={zoom}
            onScaleChange={(s) => isAutoFit && setZoom(s)}
            onTotalPagesChange={setTotalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default WizardPreview;
