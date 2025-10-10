import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Download, X, FileText, FileCode, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '../lib/initialData';
import { saveAs } from 'file-saver';
import { generatePdf } from '../lib/export/pdf';
import { generateDocx } from '../lib/export/docx';

declare module 'file-saver' {
  export function saveAs(blob: Blob | string, filename?: string): void;
}

type ExportResumeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: ResumeData;
  template?: string;
  children?: React.ReactNode;
};

const ExportResumeModal = ({ 
  open,
  onOpenChange,
  resumeData,
  template = 'minimal',
  children
}: ExportResumeModalProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const { toast } = useToast();

  const handleExport = async (format: 'pdf' | 'docx' | 'json') => {
    setIsExporting(true);
    setExportStatus({ type: null, message: '' });

    try {
      let file: Blob;
      let filename = `resume_${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'pdf':
          file = await generatePdf(resumeData, template);
          filename += '.pdf';
          break;
        case 'docx':
          file = await generateDocx(resumeData, template);
          filename += '.docx';
          break;
        case 'json':
          file = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
          filename += '.json';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      saveAs(file, filename);
      setExportStatus({
        type: 'success',
        message: `Successfully exported as ${filename}`
      });
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus({
        type: 'error',
        message: `Failed to export: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Export Resume</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Download your resume in your preferred format
              </DialogDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
              disabled={isExporting}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline"
                className="h-16 justify-start px-4 py-3 text-left"
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">PDF Document</p>
                    <p className="text-xs text-muted-foreground">Best for printing and sharing</p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline"
                className="h-16 justify-start px-4 py-3 text-left"
                onClick={() => handleExport('docx')}
                disabled={isExporting}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Word Document</p>
                    <p className="text-xs text-muted-foreground">Editable in Microsoft Word</p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline"
                className="h-16 justify-start px-4 py-3 text-left"
                onClick={() => handleExport('json')}
                disabled={isExporting}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <FileCode className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">JSON Data</p>
                    <p className="text-xs text-muted-foreground">For backup and data transfer</p>
                  </div>
                </div>
              </Button>
            </div>

            {isExporting && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Preparing your export...</span>
              </div>
            )}

            {exportStatus.type && (
              <div className={`flex items-start gap-2 rounded-md p-3 text-sm ${
                exportStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {exportStatus.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium">
                    {exportStatus.type === 'success' ? 'Export successful' : 'Export failed'}
                  </p>
                  <p className="text-xs">{exportStatus.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportResumeModal;
