import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportResumeModal({ open, onOpenChange }: ImportResumeModalProps) {
  const { setResumeData } = useResume();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is a JSON file
    if (!file.name.endsWith('.json')) {
      setError('Please upload a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Basic validation of the imported data
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid file format');
        }
        
        // Update the resume data with the imported data
        setResumeData(prev => ({
          ...prev,
          ...data,
          // Ensure arrays are properly initialized
          experience: data.experience || [],
          education: data.education || [],
          skills: data.skills || { languages: [], frameworks: [], tools: [] },
          projects: data.projects || [],
          achievements: data.achievements || [],
          certifications: data.certifications || [],
          customSections: data.customSections || []
        }));
        
        toast({
          title: 'Success',
          description: 'Resume imported successfully',
        });
        
        // Close the modal
        onOpenChange(false);
      } catch (err) {
        console.error('Error importing resume:', err);
        setError('Failed to import resume. Please check the file format.');
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading the file');
      setIsLoading(false);
    };
    
    setIsLoading(true);
    setError(null);
    reader.readAsText(file);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Resume</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload a JSON file to import your resume data
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleClick}
                disabled={isLoading}
              >
                <FileText className="mr-2 h-4 w-4" />
                {isLoading ? 'Importing...' : 'Select File'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Supported format: JSON (.json)</p>
            <p>Maximum file size: 5MB</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
