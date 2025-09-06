import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { FileCheck, FileText, Briefcase, Settings, Sparkles } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  resumeText: string;
  jobDescription: string;
  customInstructions: any;
  selectedModel: string;
}

export default function ConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  resumeText,
  jobDescription,
  customInstructions,
  selectedModel
}: ConfirmationModalProps) {
  const formatInstructionsSummary = () => {
    if (!customInstructions) return "Using default AI instructions";
    
    const sections = [];
    
    if (customInstructions.selectedTags?.length > 0) {
      sections.push(`Focus areas: ${customInstructions.selectedTags.join(', ')}`);
    }
    
    if (customInstructions.targetAudience) {
      sections.push(`Target: ${customInstructions.targetAudience}`);
    }
    
    if (customInstructions.customInstructions) {
      sections.push(`Custom instructions: ${customInstructions.customInstructions.slice(0, 100)}${customInstructions.customInstructions.length > 100 ? '...' : ''}`);
    }
    
    return sections.length > 0 ? sections.join(' • ') : "Using customized AI instructions";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Confirm Resume Generation
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Model Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-sm">
                  {selectedModel === "gemini-1.5-flash" ? "Gemini 1.5 Flash (Fast)" : "Gemini 1.5 Pro (Advanced)"}
                </Badge>
              </CardContent>
            </Card>

            {/* Resume Content */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Resume Content
                </CardTitle>
                <CardDescription>
                  {resumeText.length} characters • {resumeText.split('\n').filter(line => line.trim()).length} lines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {resumeText.slice(0, 300)}
                    {resumeText.length > 300 && "..."}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  {jobDescription ? `${jobDescription.length} characters` : "No job description provided"}
                </CardDescription>
              </CardHeader>
              {jobDescription && (
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 max-h-32 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {jobDescription.slice(0, 300)}
                      {jobDescription.length > 300 && "..."}
                    </pre>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Custom Instructions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  AI Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {formatInstructionsSummary()}
                </div>
                
                {customInstructions?.selectedTags?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Focus Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {customInstructions.selectedTags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="px-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}