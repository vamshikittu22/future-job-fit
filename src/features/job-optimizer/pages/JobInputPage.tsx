import { useState } from 'react';

import CustomizeAIModal from '@/features/job-optimizer/components/CustomizeAIModal';
import ExportOptimizedModal from '@/features/job-optimizer/components/ExportOptimizedModal';
import JobOptimizerLayout from '@/features/job-optimizer/components/JobOptimizerLayout';
import { useJob } from '@/shared/contexts/JobContext';
import AppNavigation from '@/shared/components/layout/AppNavigation';
import Footer from '@/shared/components/layout/Footer';
import CustomizeAIButton from '@/shared/components/common/CustomizeAIButton';
import ModelSelector from '@/shared/components/common/ModelSelector';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

function getResumeTextFromCurrentJob(currentJob: unknown): string {
  if (!currentJob || typeof currentJob !== 'object') {
    return '';
  }

  const candidate = currentJob as { resumeText?: string };
  return candidate.resumeText ?? '';
}

function getJobStatusLabel(currentJob: unknown): string {
  if (!currentJob || typeof currentJob !== 'object') {
    return 'Waiting for input';
  }

  const candidate = currentJob as { description?: string };
  const hasDescription = Boolean(candidate.description?.trim());

  return hasDescription ? 'JD loaded' : 'Waiting for input';
}

export default function JobInputPage() {
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [, setCustomInstructions] = useState<unknown>(null);
  const { currentJob } = useJob();

  const resumeText = getResumeTextFromCurrentJob(currentJob);
  const jobStatus = getJobStatusLabel(currentJob);
  const resumeStatus = resumeText.trim() ? 'Resume loaded' : 'Resume empty';

  return (
    <div className="flex h-screen flex-col">
      <AppNavigation />

      <div className="border-b bg-background/95 px-4 py-3">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold">Job Optimizer</h1>
            <p className="text-sm text-muted-foreground">Compare your resume with the role in a dedicated 3-panel workspace.</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[11px] font-medium">
                {resumeStatus}
              </Badge>
              <Badge variant="outline" className="text-[11px] font-medium">
                {jobStatus}
              </Badge>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            <ModelSelector value={selectedModel} onValueChange={setSelectedModel} />
            <CustomizeAIButton onClick={() => setCustomizeModalOpen(true)} />
            <Button type="button" variant="outline" size="sm" onClick={() => setExportModalOpen(true)}>
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 h-[calc(100vh-theme(spacing.16)-theme(spacing.20))] overflow-hidden">
        <JobOptimizerLayout />
      </div>

      <Footer />

      <CustomizeAIModal
        open={customizeModalOpen}
        onOpenChange={setCustomizeModalOpen}
        onSave={setCustomInstructions}
      />

      <ExportOptimizedModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        resumeText={resumeText}
      />
    </div>
  );
}
