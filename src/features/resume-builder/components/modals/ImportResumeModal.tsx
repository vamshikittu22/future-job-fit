import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Progress } from "@/shared/ui/progress";
import { Badge } from "@/shared/ui/badge";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

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
    }
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Simulate file processing with progress updates
      const intervals = [20, 40, 60, 80, 95];
      
      for (let i = 0; i < intervals.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(intervals[i]);
      }
      
      // Mock extracted data - in a real app, this would come from an AI parsing service
      const mockData = {
        personalInfo: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          linkedin: "linkedin.com/in/johndoe",
          website: "johndoe.dev"
        },
        summary: "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams.",
        skills: [
          "JavaScript", "TypeScript", "React", "Node.js", "Python", 
          "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB"
        ],
        experience: [
          {
            id: "1",
            title: "Senior Software Engineer",
            company: "Tech Corp",
            location: "San Francisco, CA",
            duration: "2021 - Present",
            bullets: [
              "Led development of microservices architecture serving 1M+ users daily",
              "Improved application performance by 40% through optimization techniques",
              "Mentored 3 junior developers and conducted code reviews"
            ]
          },
          {
            id: "2",
            title: "Software Engineer",
            company: "StartupXYZ",
            location: "Remote",
            duration: "2019 - 2021",
            bullets: [
              "Built responsive web applications using React and TypeScript",
              "Integrated third-party APIs and payment systems",
              "Collaborated with design team to implement pixel-perfect UIs"
            ]
          }
        ],
        education: [
          {
            id: "1",
            degree: "Bachelor of Science in Computer Science",
            school: "University of California, Berkeley",
            year: "2019",
            gpa: "3.8"
          }
        ],
        projects: [
          {
            id: "1",
            name: "E-commerce Platform",
            tech: "React, Node.js, PostgreSQL, Stripe",
            duration: "2023",
            bullets: [
              "Built full-stack e-commerce platform with payment integration",
              "Implemented real-time inventory management system",
              "Deployed using Docker and AWS ECS"
            ]
          }
        ],
        achievements: [
          "AWS Certified Solutions Architect",
          "Hackathon winner - Best Technical Implementation (2022)",
          "Employee of the Month - Q2 2023"
        ],
        certifications: [
          "AWS Solutions Architect Associate",
          "Google Cloud Professional Developer",
          "Certified Kubernetes Administrator"
        ]
      };
      
      // Mock issues detection
      const mockIssues = [
        "Phone number format detected, please verify",
        "Some work experience dates may need clarification",
        "Skills section may benefit from reorganization"
      ];
      
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExtractedData(mockData);
      setIssues(mockIssues);
      
      toast({
        title: "Resume processed successfully",
        description: "Review the extracted information and make any necessary corrections.",
      });
      
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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
                    <div><strong>Name:</strong> {extractedData.personalInfo.name}</div>
                    <div><strong>Email:</strong> {extractedData.personalInfo.email}</div>
                    <div><strong>Phone:</strong> {extractedData.personalInfo.phone}</div>
                    <div><strong>Location:</strong> {extractedData.personalInfo.location}</div>
                  </div>
                </Card>
                
                {/* Skills */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Technical Skills ({extractedData.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {extractedData.skills.slice(0, 8).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {extractedData.skills.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{extractedData.skills.length - 8} more
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
                        <div className="text-muted-foreground">{exp.company}</div>
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
                        <div className="text-muted-foreground">{edu.school}</div>
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