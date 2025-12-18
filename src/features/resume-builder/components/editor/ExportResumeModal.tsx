import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { FileText, FileJson, FileCode, Printer, Download, Eye } from 'lucide-react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useWizard } from '@/shared/contexts/WizardContext';
import { useToast } from '@/shared/ui/use-toast';
import { generatePdfFromElement } from '@/shared/lib/export/pdf';
import { generateDocx } from '@/shared/lib/export/docx';
import ResumePreview from '@/features/resume-builder/components/preview/ResumePreview';
import {
  generateHTML,
  generatePlainText,
  generateLaTeX
} from '@/shared/lib/export/formats';

import { saveAs } from 'file-saver';

interface ExportResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportResumeModal({ open, onOpenChange }: ExportResumeModalProps) {
  const { resumeData } = useResume();
  const { wizardState } = useWizard();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');

  const template = wizardState?.selectedTemplate || 'modern';

  const handleExport = async (format: string) => {
    try {
      setIsExporting(format);
      let blob: Blob;
      let filename = `resume-${format}`;

      switch (format) {
        case 'pdf':
          const previewElement = document.querySelector('.resume-preview') as HTMLElement;
          if (!previewElement) throw new Error('Preview not found');
          blob = await generatePdfFromElement(previewElement);
          filename += '.pdf';
          break;
        case 'docx':
          blob = await generateDocx(resumeData, template);
          filename += '.docx';
          break;
        case 'txt':
          const txt = generatePlainText(resumeData);
          blob = new Blob([txt], { type: 'text/plain' });
          filename += '.txt';
          break;
        case 'latex':
          const latex = generateLaTeX(resumeData, template);
          blob = new Blob([latex], { type: 'text/plain' });
          filename += '.tex';
          break;
        case 'html':
          const html = generateHTML(resumeData, template);
          blob = new Blob([html], { type: 'text/html' });
          filename += '.html';
          break;
        case 'json':
          const dataStr = JSON.stringify(resumeData, null, 2);
          blob = new Blob([dataStr], { type: 'application/json' });
          filename += '.json';
          break;
        default:
          throw new Error('Unsupported format');
      }

      saveAs(blob, filename);
      toast({
        title: 'Success',
        description: `Resume exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Error',
        description: `Failed to export as ${format.toUpperCase()}`,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(null);
    }
  };

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

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 48; // Account for padding
      const containerHeight = container.clientHeight - 48;

      const targetWidth = 210 * 3.78;
      const targetHeight = 297 * 3.78;

      const widthScale = containerWidth / targetWidth;
      const heightScale = containerHeight / targetHeight;

      setScale(Math.min(widthScale, heightScale, 1));
    };

    if (activeTab === 'preview') {
      updateScale();
      window.addEventListener('resize', updateScale);
    }
    return () => window.removeEventListener('resize', updateScale);
  }, [activeTab, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] md:max-w-4xl max-h-[90vh] h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Printer className="h-6 w-6 text-primary" />
            Print & Export Resume
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b bg-muted/30">
            <TabsList className="my-2">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Step 1: Preview
              </TabsTrigger>
              <TabsTrigger value="download" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Step 2: Download
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="flex-1 overflow-auto p-4 md:p-8 bg-muted/20 flex flex-col items-center mt-0 ring-0 h-full" ref={containerRef}>
            <div className="bg-white shadow-2xl origin-top transition-transform duration-300" style={{
              width: '210mm',
              minHeight: '297mm',
              transform: `scale(${scale})`,
              marginBottom: `calc(-297mm * (1 - ${scale}))`
            }}>
              <ResumePreview
                resumeData={resumeData}
                template={template}
                sectionOrder={sectionOrder}
              />
            </div>
          </TabsContent>

          <TabsContent value="download" className="flex-1 overflow-auto p-6 md:p-12 mt-0 ring-0">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Select a format to download</h3>
                <p className="text-sm text-muted-foreground">Download your resume in your preferred format for applications or academic use.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 justify-start p-4 hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => handleExport('pdf')}
                  disabled={!!isExporting}
                >
                  <FileText className="h-8 w-8 text-red-500 mr-4 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold text-base">PDF Document</div>
                    <div className="text-xs text-muted-foreground">Best for protein & ATS (Formatted)</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 justify-start p-4 hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => handleExport('docx')}
                  disabled={!!isExporting}
                >
                  <FileText className="h-8 w-8 text-blue-500 mr-4 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold text-base">Word Document</div>
                    <div className="text-xs text-muted-foreground">Editable .docx format</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 justify-start p-4 hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => handleExport('txt')}
                  disabled={!!isExporting}
                >
                  <FileText className="h-8 w-8 text-gray-500 mr-4 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold text-base">Plain Text</div>
                    <div className="text-xs text-muted-foreground">Simple .txt for copy-pasting</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 justify-start p-4 hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => handleExport('latex')}
                  disabled={!!isExporting}
                >
                  <FileCode className="h-8 w-8 text-green-500 mr-4 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold text-base">LaTeX Source</div>
                    <div className="text-xs text-muted-foreground">Academic CV format (.tex)</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 justify-start p-4 hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => handleExport('html')}
                  disabled={!!isExporting}
                >
                  <FileCode className="h-8 w-8 text-orange-500 mr-4 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold text-base">HTML File</div>
                    <div className="text-xs text-muted-foreground">Self-contained web page</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 justify-start p-4 hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => handleExport('json')}
                  disabled={!!isExporting}
                >
                  <FileJson className="h-8 w-8 text-purple-500 mr-4 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold text-base">JSON Data</div>
                    <div className="text-xs text-muted-foreground">Raw data for backup/import</div>
                  </div>
                </Button>
              </div>

              {isExporting && (
                <div className="flex justify-center items-center gap-2 text-primary animate-pulse py-4">
                  <Download className="h-5 w-5 animate-bounce" />
                  <span className="font-semibold text-lg">Preparing your file...</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
