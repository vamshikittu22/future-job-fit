import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Progress } from "@/shared/ui/progress";
import { Badge } from "@/shared/ui/badge";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { usePyNLP } from "@/shared/hooks/usePyNLP";
import { extractTextFromFile } from "@/shared/utils/textExtraction";

interface ImportResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (resumeData: any) => void;
}

export default function ImportResumeModal({
  open,
  onOpenChange,
  onImport
}: ImportResumeModalProps) {
  const { parseResume, status, isReady } = usePyNLP();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file.",
          variant: "destructive"
        });
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      setExtractedData(null);
      setIssues([]);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      // 1. Extract text from file
      setProgress(20);
      const text = await extractTextFromFile(file);
      setProgress(40);

      // 2. Parse using Pyodide
      if (!isReady) {
        throw new Error("AI engine is still initializing. Please wait a moment.");
      }

      setProgress(60);
      const result = await parseResume(text);
      setProgress(90);

      // 3. Map Python result to ResumeData
      const mappedData = mapPythonDataToResume(result);

      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));

      setExtractedData(mappedData);

      // Basic issue detection
      const foundIssues = [];
      if (!mappedData.personal.name) foundIssues.push("Name could not be extracted automatically.");
      if (!mappedData.experience.length) foundIssues.push("No work experience identified.");
      if (!mappedData.skills.tools.length) foundIssues.push("No technical skills identified.");
      setIssues(foundIssues);

      toast({
        title: "Resume processed successfully",
        description: "Review the extracted information and make any necessary corrections.",
      });

    } catch (error: any) {
      console.error("Processing failed:", error);
      toast({
        title: "Processing failed",
        description: error.message || "There was an error processing your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const mapPythonDataToResume = (pyData: any) => {
    const sections = pyData.sections || {};

    return {
      personal: {
        name: pyData.name || "",
        email: pyData.email || "",
        phone: pyData.phone || "",
        location: pyData.location || "",
        website: pyData.website || "",
        linkedin: pyData.linkedin || "",
        github: pyData.github || "",
      },
      summary: sections.summary || "",
      experience: (sections.experience || []).map((exp: string, idx: number) => ({
        id: `exp-${idx}`,
        title: exp.split('\n')[0] || "Unknown Title",
        company: "Extracted Company",
        description: exp,
        startDate: "",
        endDate: "",
        current: false,
        bullets: exp.split('\n').slice(1).filter(l => l.trim())
      })),
      education: (sections.education || []).map((edu: string, idx: number) => ({
        id: `edu-${idx}`,
        degree: edu.split('\n')[0] || "Unknown Degree",
        school: "Extracted University",
        startDate: "",
        endDate: "",
        description: edu
      })),
      skills: {
        languages: [],
        frameworks: [],
        tools: pyData.skills || []
      },
      projects: (sections.projects || []).map((proj: string, idx: number) => ({
        id: `proj-${idx}`,
        name: proj.split('\n')[0] || "Project",
        description: proj,
        technologies: [],
        bullets: proj.split('\n').slice(1).filter(l => l.trim())
      })),
      achievements: (sections.achievements || []).map((ach: string, idx: number) => ({
        id: `ach-${idx}`,
        title: ach.split('\n')[0] || "Achievement",
        description: ach
      })),
      certifications: (sections.certifications || []).map((cert: string, idx: number) => ({
        id: `cert-${idx}`,
        name: cert.split('\n')[0] || "Certification",
        issuer: "",
        date: ""
      })),
      customSections: [],
      metadata: {
        lastUpdated: new Date().toISOString()
      }
    };
  };

  const handleImport = () => {
    if (extractedData) {
      onImport(extractedData);
      onOpenChange(false);
      reset();
    }
  };

  const reset = () => {
    setFile(null);
    setIsProcessing(false);
    setProgress(0);
    setExtractedData(null);
    setIssues([]);
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!file && (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload your resume</h3>
              <p className="text-muted-foreground mb-4">
                Supports PDF, DOCX, and TXT files up to 5MB
              </p>
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
              />
              <Button asChild>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          )}

          {file && !extractedData && (
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing resume with AI...
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {!isProcessing && (
                <div className="flex gap-3">
                  <Button onClick={processFile} className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Process Resume
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    Choose Different File
                  </Button>
                </div>
              )}
            </Card>
          )}

          {extractedData && (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {issues.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Review Required:</strong> We found {issues.length} item(s) that may need your attention.
                    <ul className="mt-2 space-y-1">
                      {issues.map((issue, index) => (
                        <li key={index} className="text-sm">• {issue}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* Personal Info */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {extractedData.personal.name}</div>
                    <div><strong>Email:</strong> {extractedData.personal.email}</div>
                    <div><strong>Phone:</strong> {extractedData.personal.phone}</div>
                    <div><strong>Location:</strong> {extractedData.personal.location}</div>
                  </div>
                </Card>

                {/* Summary */}
                {extractedData.summary && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Professional Summary
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-4">
                      {extractedData.summary}
                    </p>
                  </Card>
                )}

                {/* Skills */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Technical Skills ({extractedData.skills.tools.length})
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {extractedData.skills.tools.slice(0, 8).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {extractedData.skills.tools.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{extractedData.skills.tools.length - 8} more
                      </Badge>
                    )}
                  </div>
                </Card>

                {/* Experience */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Work Experience ({extractedData.experience.length})
                  </h3>
                  <div className="space-y-3">
                    {extractedData.experience.map((exp: any, index: number) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{exp.title}</div>
                        <div className="text-muted-foreground text-[10px] line-clamp-2">{exp.description}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Education */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Education ({extractedData.education.length})
                  </h3>
                  <div className="space-y-2 text-sm">
                    {extractedData.education.map((edu: any, index: number) => (
                      <div key={index}>
                        <div className="font-medium">{edu.degree}</div>
                        <div className="text-muted-foreground text-[10px] line-clamp-1">{edu.description}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {extractedData && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleImport} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Import Resume
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}