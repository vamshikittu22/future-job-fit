import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, FileText, FileJson, FileCode } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import { useToast } from '@/components/ui/use-toast';

interface ExportResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportResumeModal({ open, onOpenChange }: ExportResumeModalProps) {
  const { resumeData } = useResume();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportAsJson = () => {
    try {
      const dataStr = JSON.stringify(resumeData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = 'resume.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: 'Success',
        description: 'Resume exported successfully as JSON',
      });
    } catch (error) {
      console.error('Error exporting resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to export resume',
        variant: 'destructive',
      });
    }
  };

  const exportAsPdf = () => {
    // This would be implemented with a PDF generation library
    toast({
      title: 'Coming Soon',
      description: 'PDF export will be available in the next update',
    });
  };

  const exportAsDocx = () => {
    // This would be implemented with a DOCX generation library
    toast({
      title: 'Coming Soon',
      description: 'Word export will be available in the next update',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Resume</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={exportAsPdf}
            disabled={isExporting}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export as PDF (.pdf)
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={exportAsDocx}
            disabled={isExporting}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export as Word (.docx)
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={exportAsJson}
            disabled={isExporting}
          >
            <FileJson className="mr-2 h-4 w-4" />
            Export as JSON (.json)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
