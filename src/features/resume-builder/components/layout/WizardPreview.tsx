import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useWizard } from '@/shared/contexts/WizardContext';
import ResumePreview from '@/features/resume-builder/components/preview/ResumePreview';
import { TEMPLATE_OPTIONS } from '@/shared/config/wizardSteps';
import type { ResumeData } from '@/shared/types/resume';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WizardPreview: React.FC = () => {
  const { resumeData } = useResume();
  const { wizardState } = useWizard();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Default section order if not specified
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

  // Calculate scale to fit container
  const [scale, setScale] = useState(1);
  const A4_ASPECT_RATIO = 210 / 297; // A4 aspect ratio (width/height)

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 40; // Account for padding
      const containerHeight = container.clientHeight - 100; // Account for pagination
      
      // Calculate scale based on width and height constraints
      const widthScale = containerWidth / (210 * 3.78); // 210mm to px
      const heightScale = containerHeight / (297 * 3.78); // 297mm to px
      
      // Use the smaller scale to ensure the entire page is visible
      setScale(Math.min(widthScale, heightScale, 1)); // Cap at 100%
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-50 p-4 overflow-auto">
      <div className="flex flex-col items-center justify-center min-h-full">
        <div 
          className="bg-white shadow-lg"
          style={{
            width: `${210 * 3.78}px`,
            height: `${297 * 3.78}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          <ResumePreview 
            resumeData={resumeData as ResumeData} 
            template={wizardState.selectedTemplate || TEMPLATE_OPTIONS[0].id}
            currentPage={currentPage}
            sectionOrder={sectionOrder}
            onTotalPagesChange={setTotalPages}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-24"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="w-24"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardPreview;
