import { useCallback, useEffect, useMemo, useState } from 'react';
import { Briefcase, FileText } from 'lucide-react';

import EmptyStatePrompt from '@/features/job-optimizer/components/EmptyStatePrompt';
import PanelHeader from '@/features/job-optimizer/components/PanelHeader';
import { useJob } from '@/shared/contexts/JobContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';

const DEFAULT_JOB_ID = 'current-job';

export default function JDInputPanel() {
  const { currentJob, setCurrentJob } = useJob();
  const jobDescription = currentJob?.description ?? '';
  const [draftDescription, setDraftDescription] = useState(jobDescription);

  useEffect(() => {
    setDraftDescription(jobDescription);
  }, [jobDescription]);

  const syncDescriptionToJob = useCallback(
    (nextDescription: string) => {
      const now = new Date().toISOString();
      const baseJob =
        currentJob ?? {
          id: DEFAULT_JOB_ID,
          title: 'Current Job Analysis',
          company: '',
          description: '',
          extractedFields: [],
          requirements: [],
          status: 'draft' as const,
          metadata: {
            createdAt: now,
            updatedAt: now,
          },
        };

      setCurrentJob({
        ...baseJob,
        description: nextDescription,
        metadata: {
          ...baseJob.metadata,
          updatedAt: now,
        },
      });
    },
    [currentJob, setCurrentJob]
  );

  const handleDescriptionChange = (nextDescription: string) => {
    setDraftDescription(nextDescription);
    syncDescriptionToJob(nextDescription);
  };

  const clearDescription = () => {
    handleDescriptionChange('');
  };

  const wordCount = useMemo(() => {
    const trimmed = draftDescription.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [draftDescription]);

  return (
    <Card className="flex h-full flex-col">
      <PanelHeader icon={Briefcase} title="Job Description" badge={wordCount ? `${wordCount} words` : undefined} />

      <div className="space-y-3 p-4">
        <Textarea
          id="job-description-input"
          value={draftDescription}
          onChange={(event) => handleDescriptionChange(event.target.value)}
          placeholder="Paste the full job description here..."
          className="min-h-[160px] resize-none"
        />

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {wordCount > 0
              ? `${wordCount} words loaded`
              : 'Paste a JD here. Match analysis and suggestions appear on the right panel.'}
          </span>
          {draftDescription.trim() ? (
            <Button type="button" size="sm" variant="ghost" onClick={clearDescription}>
              Clear JD
            </Button>
          ) : null}
        </div>
      </div>

      {!draftDescription.trim() ? (
        <EmptyStatePrompt
          icon={FileText}
          title="Add Job Description"
          description="Paste the role description above. Scores, gaps, and recommendations will update in the right panel."
        />
      ) : null}
    </Card>
  );
}
