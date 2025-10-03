import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { useWizard } from '@/contexts/WizardContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TEMPLATE_OPTIONS } from '@/config/wizardSteps';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const WizardPreview: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  
  return (
    <div className="h-full w-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
            disabled={zoomLevel <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{zoomLevel}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
            disabled={zoomLevel >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 border rounded-lg bg-white dark:bg-gray-800 overflow-auto">
        <div 
          className="p-4"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top left',
            width: `${100 / (zoomLevel / 100)}%`,
            height: `${100 / (zoomLevel / 100)}%`,
          }}
        >
          <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-md">
            {/* Resume content will go here */}
            <div className="p-8">
              <h1 className="text-2xl font-bold">Your Resume</h1>
              <p className="mt-4">Your resume content will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardPreview;
