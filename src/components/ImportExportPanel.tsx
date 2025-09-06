import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, FileText, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

interface ImportExportPanelProps {
  resumeText: string;
  onResumeImport: (content: string) => void;
  hasContent: boolean;
}

export default function ImportExportPanel({ resumeText, onResumeImport, hasContent }: ImportExportPanelProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === "text/plain") {
        const text = await file.text();
        onResumeImport(text);
        toast({
          title: "File Imported",
          description: "Resume content has been loaded successfully."
        });
      } else {
        toast({
          title: "Unsupported File Type",
          description: "Please upload a .txt file. PDF and DOCX support coming soon.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to read the file. Please try again.",
        variant: "destructive"
      });
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExportTxt = () => {
    if (!resumeText) {
      toast({
        title: "No Content",
        description: "Please add resume content before exporting.",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Resume Exported",
      description: "Resume has been downloaded as resume.txt"
    });
  };

  const handleExportPdf = () => {
    toast({
      title: "Coming Soon",
      description: "PDF export will be available in the next update.",
    });
  };

  const handleExportDocx = () => {
    toast({
      title: "Coming Soon", 
      description: "DOCX export will be available in the next update.",
    });
  };

  // Only show if there's content or user is actively working
  if (!hasContent) {
    return null;
  }

  return (
    <Card className="p-4 shadow-swiss bg-gradient-card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Import / Export</h3>
        </div>

        {/* Import Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Import Resume</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileImport}
              className="hidden"
              id="resume-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import File
            </Button>
            <div className="text-xs text-muted-foreground">
              .txt, .pdf, .docx
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            AI will analyze and fill missing fields automatically
          </p>
        </div>

        <Separator />

        {/* Export Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Export Resume</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTxt}
              className="flex items-center gap-2"
              disabled={!resumeText}
            >
              <Download className="w-4 h-4" />
              TXT
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              className="flex items-center gap-2"
            >
              <File className="w-4 h-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDocx}
              className="flex items-center gap-2"
            >
              <File className="w-4 h-4" />
              DOCX
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Retains template, colors, and fonts
          </p>
        </div>
      </div>
    </Card>
  );
}