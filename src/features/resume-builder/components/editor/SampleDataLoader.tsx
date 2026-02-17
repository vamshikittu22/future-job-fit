import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { loadSampleData } from '@/shared/lib/sampleResumeData';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useWizard } from '@/shared/contexts/WizardContext';
import { useToast } from '@/shared/hooks/use-toast';
import { FileText, Briefcase, GraduationCap, Code, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SampleDataLoaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SampleDataLoader: React.FC<SampleDataLoaderProps> = ({
  open,
  onOpenChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setResumeData } = useResume();
  const { triggerAutoSave } = useWizard();
  const { toast } = useToast();

  const sampleData = loadSampleData();

  const handleLoadSample = async () => {
    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    try {
      setResumeData(sampleData);
      triggerAutoSave();
      
      toast({
        title: 'Sample data loaded!',
        description: 'Your resume has been populated with sample data. Feel free to customize it.',
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to load sample data:', error);
      toast({
        title: 'Error loading sample data',
        description: 'Please try again or contact support if the issue persists.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dataStats = [
    {
      icon: FileText,
      label: 'Professional Summary',
      value: '220 words',
      color: 'text-blue-600',
    },
    {
      icon: Briefcase,
      label: 'Work Experience',
      value: '3 positions',
      color: 'text-green-600',
    },
    {
      icon: GraduationCap,
      label: 'Education',
      value: '1 degree',
      color: 'text-purple-600',
    },
    {
      icon: Code,
      label: 'Skills & Projects',
      value: '22 skills, 2 projects',
      color: 'text-orange-600',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-primary" />
            Load Sample Resume Data
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Start with a complete, professional resume example that you can customize to match your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Alert Warning */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Loading sample data will replace all current resume content. 
              This action can be undone using Ctrl+Z or the Undo button.
            </AlertDescription>
          </Alert>

          {/* Sample Data Preview */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              What's Included
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dataStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className={`${stat.color} mt-0.5`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{stat.label}</div>
                      <div className="text-xs text-muted-foreground">{stat.value}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sample Profile Info */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Sample Profile</h4>
              <Badge variant="secondary">ATS-Optimized</Badge>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Sarah Chen</strong> - Senior Full-Stack Engineer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">
                  7+ years experience with quantified achievements
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">
                  Action verbs, metrics, and ATS-friendly formatting
                </span>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Quantified Results', 'Action Verbs', 'Clean Format', 'Skills Matrix', 'Project Showcase', 'Certifications'].map(
              (feature) => (
                <Badge key={feature} variant="outline" className="justify-center py-1">
                  {feature}
                </Badge>
              )
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleLoadSample} disabled={isLoading}>
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <FileText className="h-4 w-4" />
                </motion.div>
                Loading...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Load Sample Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SampleDataLoader;
