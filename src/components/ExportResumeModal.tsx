import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Download, X } from 'lucide-react';

import { ResumeData } from '../lib/initialData';

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
  template,
  children
}: ExportResumeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Export Resume</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a format to export your resume:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  // TODO: Implement PDF export
                  console.log('Exporting to PDF:', { resumeData, template });
                  alert('PDF export functionality will be implemented here');
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  // TODO: Implement DOCX export
                  console.log('Exporting to DOCX:', { resumeData, template });
                  alert('Word export functionality will be implemented here');
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export as Word (.docx)
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  // Export as JSON
                  const dataStr = JSON.stringify(resumeData, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = 'resume.json';
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                  onOpenChange(false);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportResumeModal;
