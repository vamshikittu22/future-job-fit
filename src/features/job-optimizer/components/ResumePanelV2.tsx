import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileUp, Upload, User, Mail, Phone, FileText, Trash2, PencilLine } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import { useToast } from "@/shared/hooks/use-toast";
import { useJob } from "@/shared/contexts/JobContext";
import { useResume } from "@/shared/contexts/ResumeContext";
import { useResumeUpload, type ResumeSummary } from "@/features/job-optimizer/hooks/useResumeUpload";

interface HeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

function PanelHeader({ title, subtitle, actions }: HeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b px-5 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <FileText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold">{title}</h3>
        <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

interface EmptyStatePromptProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

function EmptyStatePrompt({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}: EmptyStatePromptProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileUp className="h-8 w-8" />
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex items-center gap-2">
        <Button onClick={onAction}>
          <Upload className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
        {secondaryActionLabel && onSecondaryAction ? (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

const DEFAULT_JOB_ID = "current-job";

export default function ResumePanelV2() {
  const { toast } = useToast();
  const { uploadFile, extractResumeSummary } = useResumeUpload();
  const { currentJob, setCurrentJob } = useJob();
  const { resumeData } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resumeFromJobContext = useMemo(() => {
    const current = currentJob as (typeof currentJob & { resumeText?: string }) | null;
    return current?.resumeText ?? "";
  }, [currentJob]);

  const [resumeText, setResumeText] = useState(resumeFromJobContext);
  const [resumeSummary, setResumeSummary] = useState<ResumeSummary | null>(
    resumeFromJobContext ? extractResumeSummary(resumeFromJobContext) : null
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (resumeFromJobContext && !resumeText) {
      setResumeText(resumeFromJobContext);
      setResumeSummary(extractResumeSummary(resumeFromJobContext));
      setIsEditing(false);
    }
  }, [extractResumeSummary, resumeFromJobContext, resumeText]);

  const syncResumeToJobContext = useCallback(
    (nextText: string) => {
      const now = new Date().toISOString();
      const baseJob =
        currentJob ?? {
          id: DEFAULT_JOB_ID,
          title: "Current Job Analysis",
          company: "",
          description: "",
          extractedFields: [],
          requirements: [],
          status: "draft" as const,
          metadata: {
            createdAt: now,
            updatedAt: now
          }
        };

      const nextJob = {
        ...baseJob,
        metadata: {
          ...baseJob.metadata,
          updatedAt: now
        }
      };

      (nextJob as { resumeText?: string }).resumeText = nextText;
      setCurrentJob(nextJob);
    },
    [currentJob, setCurrentJob]
  );

  const handleAnalyzeResume = useCallback(() => {
    const trimmed = resumeText.trim();
    if (!trimmed) {
      toast({
        title: "No resume text",
        description: "Paste your resume text or upload a file before analyzing."
      });
      return;
    }

    const parsedSummary = extractResumeSummary(trimmed);
    setResumeSummary(parsedSummary);
    syncResumeToJobContext(trimmed);
    setIsEditing(false);
  }, [extractResumeSummary, resumeText, syncResumeToJobContext, toast]);

  const handleFileSelected = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      try {
        const uploadedText = await uploadFile(file);
        const parsedSummary = extractResumeSummary(uploadedText);
        setResumeText(uploadedText);
        setResumeSummary(parsedSummary);
        syncResumeToJobContext(uploadedText);
        setIsEditing(false);
      } catch {
        // Toast is shown in hook when upload fails.
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [extractResumeSummary, syncResumeToJobContext, uploadFile]
  );

  const handleClear = useCallback(() => {
    setResumeText("");
    setResumeSummary(null);
    setIsEditing(false);
    syncResumeToJobContext("");

    toast({
      title: "Resume cleared",
      description: "You can now upload a new file or paste different resume text."
    });
  }, [syncResumeToJobContext, toast]);

  const fallbackSummary = useMemo<ResumeSummary>(() => {
    const personal = resumeData.personal;
    const fullName = personal?.name?.trim();
    const email = personal?.email?.trim();
    const phone = personal?.phone?.trim();

    if (!fullName && !email && !phone) {
      return {};
    }

    return {
      name: fullName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      summaryExcerpt: resumeSummary?.summaryExcerpt
    };
  }, [resumeData.personal, resumeSummary?.summaryExcerpt]);

  const displaySummary = resumeSummary ?? fallbackSummary;
  const hasResume = Boolean(resumeText.trim());
  const showSummaryState = hasResume && !isEditing;
  const showEmptyState = !hasResume && !isEditing;
  const showInputState = isEditing;

  return (
    <Card className="h-full min-h-[520px] overflow-hidden p-0">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf"
        className="hidden"
        onChange={handleFileSelected}
      />

      {showEmptyState ? (
        <EmptyStatePrompt
          title="Upload Your Resume"
          description="Drag and drop a file or paste your resume text to begin analysis."
          actionLabel="Upload File"
          onAction={() => fileInputRef.current?.click()}
          secondaryActionLabel="Paste Text"
          onSecondaryAction={() => setIsEditing(true)}
        />
      ) : null}

      {showInputState ? (
        <div className="flex h-full flex-col">
          <PanelHeader title="Resume Panel" subtitle="Upload a file or paste resume text" />

          <div className="flex flex-1 flex-col gap-3 p-5">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>

            <Textarea
              value={resumeText}
              placeholder="Or paste your resume text here..."
              className="min-h-[250px] flex-1"
              onChange={(event) => {
                const nextValue = event.target.value;
                setResumeText(nextValue);
                syncResumeToJobContext(nextValue);
              }}
            />

            <Button type="button" onClick={handleAnalyzeResume}>
              Analyze Resume
            </Button>
          </div>
        </div>
      ) : null}

      {showSummaryState ? (
        <div className="flex h-full flex-col">
          <PanelHeader
            title="Resume Panel"
            subtitle="Quick extracted resume summary"
            actions={<Badge variant="secondary">Uploaded</Badge>}
          />

          <div className="flex-1 space-y-4 p-5">
            <Card className="space-y-3 p-4">
              {displaySummary.name ? (
                <div className="flex items-start gap-2 text-sm">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{displaySummary.name}</span>
                </div>
              ) : null}

              {displaySummary.email ? (
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{displaySummary.email}</span>
                </div>
              ) : null}

              {displaySummary.phone ? (
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{displaySummary.phone}</span>
                </div>
              ) : null}

              <div className="pt-1 text-sm text-muted-foreground">
                {displaySummary.summaryExcerpt || "Summary preview unavailable. Click Edit to review your resume text."}
              </div>
            </Card>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                <PencilLine className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button type="button" variant="destructive" onClick={handleClear}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
