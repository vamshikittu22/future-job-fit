import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Briefcase, Settings, AlertCircle, CheckCircle } from "lucide-react";

interface PreviewPanelProps {
  resumeText: string;
  jobDescription: string;
  customInstructions?: any;
}

export default function PreviewPanel({ resumeText, jobDescription, customInstructions }: PreviewPanelProps) {
  // Extract keywords from job description for highlighting
  const extractKeywords = (jd: string) => {
    if (!jd) return [];
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    return jd.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 20); // Top 20 keywords
  };

  const keywords = extractKeywords(jobDescription);
  
  // Check which keywords are missing from resume
  const missingKeywords = keywords.filter(keyword => 
    !resumeText.toLowerCase().includes(keyword.toLowerCase())
  );

  const matchingKeywords = keywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword.toLowerCase())
  );

  // Calculate rough ATS score
  const atsScore = keywords.length > 0 
    ? Math.round((matchingKeywords.length / keywords.length) * 100)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="h-full shadow-swiss bg-gradient-card">
      <Tabs defaultValue="resume" className="h-full flex flex-col">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="jd" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Description
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Analysis
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="resume" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Resume Preview</h3>
              {resumeText ? (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {resumeText}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No resume content yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="jd" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Job Description</h3>
              {jobDescription ? (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {jobDescription}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No job description added</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Resume Analysis</h3>
              
              {jobDescription && resumeText ? (
                <>
                  {/* ATS Score */}
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>
                        {atsScore}%
                      </div>
                      <div>
                        <h4 className="font-semibold">ATS Match Score</h4>
                        <p className="text-sm text-muted-foreground">
                          Based on keyword matching
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Matching Keywords */}
                  {matchingKeywords.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold">Matching Keywords ({matchingKeywords.length})</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {matchingKeywords.map(keyword => (
                          <Badge key={keyword} variant="default" className="bg-green-100 text-green-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {missingKeywords.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold">Missing Keywords ({missingKeywords.length})</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {missingKeywords.map(keyword => (
                          <Badge key={keyword} variant="destructive" className="bg-red-100 text-red-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Consider adding these keywords to improve your ATS score
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Custom Instructions Preview */}
                  {customInstructions && (
                    <div>
                      <h4 className="font-semibold mb-3">Custom AI Instructions</h4>
                      <div className="bg-muted/30 p-3 rounded-lg text-sm">
                        <p>Instructions configured - AI will use these when generating your resume</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Add resume content and job description to see analysis</p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}