import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { FileText, FileJson, FileCode, FileArchive } from 'lucide-react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useWizard } from '@/shared/contexts/WizardContext';
import { useToast } from '@/shared/ui/use-toast';
import { generatePdfFromElement } from '@/shared/lib/export/pdf';
import { generateDocx } from '@/shared/lib/export/docx';
import {
  generateHTML,
  generateMarkdown,
  generatePlainText,
  generateLaTeX,
  generateATSPdf,
  exportFormats
} from '@/shared/lib/export/formats';
import JSZip from 'jszip';

interface ExportResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportResumeModal({ open, onOpenChange }: ExportResumeModalProps) {
  const { resumeData } = useResume();
  const { wizardState } = useWizard();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const template = wizardState?.selectedTemplate || 'minimal';

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsJson = () => {
    try {
      const dataStr = JSON.stringify(resumeData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      downloadFile(blob, 'resume.json');

      toast({
        title: 'Success',
        description: 'Resume exported as JSON',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export resume',
        variant: 'destructive',
      });
    }
  };

  const exportAsPdfFormatted = async () => {
    try {
      setIsExporting(true);
      const previewElement = document.querySelector('.resume-preview') as HTMLElement;
      if (!previewElement) throw new Error('Preview not found');

      const blob = await generatePdfFromElement(previewElement);
      downloadFile(blob, 'resume.pdf');

      toast({
        title: 'Success',
        description: 'Resume exported as formatted PDF',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPdfATS = async () => {
    try {
      setIsExporting(true);
      const blob = await generateATSPdf(resumeData);
      downloadFile(blob, 'resume-ats.pdf');

      toast({
        title: 'Success',
        description: 'ATS-friendly PDF exported',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export ATS PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsDocx = async () => {
    try {
      setIsExporting(true);
      const blob = await generateDocx(resumeData, template);
      downloadFile(blob, 'resume.docx');

      toast({
        title: 'Success',
        description: 'Resume exported as Word document',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export Word document',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsHTML = () => {
    const html = generateHTML(resumeData, template);
    const blob = new Blob([html], { type: 'text/html' });
    downloadFile(blob, 'resume.html');

    toast({
      title: 'Success',
      description: 'Resume exported as HTML',
    });
  };

  const exportAsMarkdown = () => {
    const md = generateMarkdown(resumeData);
    const blob = new Blob([md], { type: 'text/markdown' });
    downloadFile(blob, 'resume.md');

    toast({
      title: 'Success',
      description: 'Resume exported as Markdown',
    });
  };

  const exportAsPlainText = () => {
    const txt = generatePlainText(resumeData);
    const blob = new Blob([txt], { type: 'text/plain' });
    downloadFile(blob, 'resume.txt');

    toast({
      title: 'Success',
      description: 'Resume exported as plain text',
    });
  };

  const exportAsLaTeX = () => {
    const latex = generateLaTeX(resumeData, template);
    const blob = new Blob([latex], { type: 'text/plain' });
    downloadFile(blob, 'resume.tex');

    toast({
      title: 'Success',
      description: 'Resume exported as LaTeX',
    });
  };

  const exportAllFormats = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();

      // JSON
      zip.file('resume.json', JSON.stringify(resumeData, null, 2));

      // HTML
      zip.file('resume.html', generateHTML(resumeData, template));

      // Markdown
      zip.file('resume.md', generateMarkdown(resumeData));

      // Plain text
      zip.file('resume.txt', generatePlainText(resumeData));

      // LaTeX
      zip.file('resume.tex', generateLaTeX(resumeData, template));

      // DOCX
      const docxBlob = await generateDocx(resumeData, template);
      zip.file('resume.docx', docxBlob);

      // PDF Formatted
      const previewElement = document.querySelector('.resume-preview') as HTMLElement;
      if (previewElement) {
        const pdfBlob = await generatePdfFromElement(previewElement);
        zip.file('resume-formatted.pdf', pdfBlob);
      }

      // PDF ATS
      const atsBlob = await generateATSPdf(resumeData);
      zip.file('resume-ats.pdf', atsBlob);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadFile(zipBlob, 'resume-all-formats.zip');

      toast({
        title: 'Success',
        description: 'All formats exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export all formats',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-3">
            <Button
              variant="default"
              className="justify-start h-auto py-3"
              onClick={exportAllFormats}
              disabled={isExporting}
            >
              <FileArchive className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Export All Formats (ZIP)</div>
                <div className="text-xs opacity-80">Download all 8 formats in one package</div>
              </div>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or select individual format</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={exportAsPdfFormatted}
              disabled={isExporting}
            >
              <FileText className="mr-2 h-4 w-4" />
              <div className="text-left flex-1">
                <div className="font-medium">PDF (Formatted)</div>
                <div className="text-xs text-muted-foreground">Beautiful PDF with your template</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={exportAsPdfATS}
              disabled={isExporting}
            >
              <FileText className="mr-2 h-4 w-4" />
              <div className="text-left flex-1">
                <div className="font-medium">PDF (ATS-Friendly)</div>
                <div className="text-xs text-muted-foreground">Plain format for applicant tracking systems</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={exportAsDocx}
              disabled={isExporting}
            >
              <FileText className="mr-2 h-4 w-4" />
              <div className="text-left flex-1">
                <div className="font-medium">Word Document (.docx)</div>
                <div className="text-xs text-muted-foreground">Editable Microsoft Word format</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={exportAsHTML}
              disabled={isExporting}
            >
              <FileCode className="mr-2 h-4 w-4" />
              <div className="text-left flex-1">
                <div className="font-medium">HTML (.html)</div>
                <div className="text-xs text-muted-foreground">Standalone web page</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={exportAsLaTeX}
              disabled={isExporting}
            >
              <FileCode className="mr-2 h-4 w-4" />
              <div className="text-left flex-1">
                <div className="font-medium">LaTeX (.tex)</div>
                <div className="text-xs text-muted-foreground">LaTeX source for academic CVs</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={exportAsMarkdown}
              disabled={isExporting}
            >
              <FileCode className="mr-2 h-4 w-4" />
              <div className="text-left flex-1">
                <div className="font-medium">Markdown (.md)</div>
                <div className="text-xs text-muted-foreground">Plain markdown format</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={exportAsPlainText}
              disabled={isExporting}
            >
              <FileText className="mr-2 h-4 w-4" />
              <div className="text-left flex-1">
                <div className="font-medium">Plain Text (.txt)</div>
                <div className="text-xs text-muted-foreground">Simple text format</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={exportAsJson}
              disabled={isExporting}
            >
              <FileJson className="mr-2 h-4 w-4" />
              <div className="text-left flex-1">
                <div className="font-medium">JSON Data (.json)</div>
                <div className="text-xs text-muted-foreground">Raw data for importing later</div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
