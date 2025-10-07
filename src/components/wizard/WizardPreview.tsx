import React, { useState, useMemo } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { useWizard } from '@/contexts/WizardContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import ResumePreview from '@/components/ResumePreview';
import { TEMPLATE_OPTIONS } from '@/config/wizardSteps';
import {
  ZoomIn,
  ZoomOut,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const WizardPreview: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { resumeData } = useResume();
  const { wizardState } = useWizard();
  
  const scale = zoomLevel / 100;
  const template = wizardState.selectedTemplate || TEMPLATE_OPTIONS[0].id;
  
  // Log resume data for debugging
  console.log('Resume Data in WizardPreview:', JSON.stringify(resumeData, null, 2));
  
  // Default section order if not specified
  const defaultSectionOrder = [
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
  
  // Ensure sectionOrder exists and includes all default sections
  const sectionOrder = useMemo(() => {
    const customOrder = resumeData?.sectionOrder || [];
    // Merge with defaults, preserving order and adding any missing sections
    return [
      ...new Set([
        ...customOrder,
        ...defaultSectionOrder.filter(section => !customOrder.includes(section))
      ])
    ];
  }, [resumeData?.sectionOrder, resumeData?.customSections]);
  
  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log('Downloading resume...');
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className={cn(
      "h-full w-full flex flex-col bg-background",
      isFullscreen ? "fixed inset-0 z-50 p-0" : "p-4"
    )}>
      <div className={cn(
        "flex items-center justify-between mb-4 bg-background",
        isFullscreen ? "p-4 border-b sticky top-0 z-10" : ""
      )}>
        <h3 className="text-lg font-semibold">Resume Preview</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
            disabled={zoomLevel <= 50}
            title="Zoom out"
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-foreground w-12 text-center">
            {zoomLevel}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
            disabled={zoomLevel >= 200}
            title="Zoom in"
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            title="Download PDF"
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            title="Refresh preview"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 flex justify-center items-start">
          <div 
            className="bg-background shadow-lg"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: '210mm',
              minHeight: '297mm',
              transition: 'transform 0.2s ease-in-out',
              margin: '0 auto',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className="p-8 bg-white">
              <ResumePreview 
                resumeData={resumeData} 
                template={template}
                currentPage={1}
                sectionOrder={sectionOrder}
                showPersonalInfo={true}
                showCustomSections={true}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default WizardPreview;
