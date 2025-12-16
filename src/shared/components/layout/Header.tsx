import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Save,
  Eye,
  Download,
  Upload,
  Sparkles,
  BookText,
  Target,
} from 'lucide-react';

interface HeaderProps {
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onImport: () => void;
  onEnhanceAI: () => void;
  showPreview: boolean;
}

export default function Header({
  onSave,
  onPreview,
  onExport,
  onImport,
  onEnhanceAI,
  showPreview,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-background border-b px-6 flex items-center justify-between z-40">
      <h1 className="text-xl font-bold">Resume Builder</h1>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save your progress</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onPreview}>
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle live preview</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export as PDF</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onImport}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import from file</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onEnhanceAI}>
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance with AI
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Use AI to improve your resume</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <BookText className="w-4 h-4 mr-2" />
                Resume Strategy
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get expert resume advice</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-2" />
                ATS Toggle
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle ATS optimization view</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}