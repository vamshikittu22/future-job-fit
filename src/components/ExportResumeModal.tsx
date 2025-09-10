import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  File, 
  FileType,
  Settings,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: any;
  template: string;
}

export default function ExportResumeModal({
  open,
  onOpenChange,
  resumeData,
  template
}: ExportResumeModalProps) {
  const [format, setFormat] = useState("pdf");
  const [includeColors, setIncludeColors] = useState(true);
  const [includeFonts, setIncludeFonts] = useState(true);
  const [includeLayout, setIncludeLayout] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const { toast } = useToast();

  const formatOptions = [
    {
      id: "pdf",
      name: "PDF",
      icon: FileText,
      description: "Best for sharing and printing",
      recommended: true
    },
    {
      id: "docx",
      name: "Word Document",
      icon: File,
      description: "Editable format for further customization"
    },
    {
      id: "json",
      name: "JSON Data",
      icon: FileType,
      description: "Structured data for backup or transfer"
    },
    {
      id: "txt",
      name: "Plain Text",
      icon: FileType,
      description: "Simple text format for ATS systems"
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);
    
    try {
      // Simulate export process with progress updates
      const steps = [
        { progress: 20, message: "Preparing resume data..." },
        { progress: 40, message: "Applying template styling..." },
        { progress: 60, message: "Generating document..." },
        { progress: 80, message: "Optimizing for format..." },
        { progress: 100, message: "Export complete!" }
      ];
      
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setExportProgress(step.progress);
      }
      
      setExportComplete(true);
      
      // Create and download file
      const content = generateFileContent();
      const blob = new Blob([content], { 
        type: format === 'pdf' ? 'application/pdf' : 
              format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 
              format === 'json' ? 'application/json' :
              'text/plain' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${resumeData.personal?.name?.replace(/\s+/g, '_') || 'unnamed'}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Resume exported successfully",
        description: `Your resume has been downloaded as a ${format.toUpperCase()} file.`,
      });
      
      setTimeout(() => {
        setExportComplete(false);
        setIsExporting(false);
        onOpenChange(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive"
      });
      setIsExporting(false);
    }
  };

  const generateFileContent = () => {
    if (format === 'json') {
      return JSON.stringify(resumeData, null, 2);
    }
    
    // Handle both possible data structures and provide safe defaults
    const personalInfo = resumeData.personal || {};
    const summary = resumeData.summary?.summary || '';
    const skillCategories = resumeData.skills?.categories || [];
    const experience = resumeData.experience?.experiences || [];
    const education = resumeData.education?.items || [];
    const projects = resumeData.projects?.items || [];
    const achievements = resumeData.achievements?.items || [];
    const certifications = resumeData.certifications?.items || [];
    
    if (format === 'txt') {
      // Generate plain text resume
      let content = '';
      
      // Personal Info
      content += `${personalInfo.name || 'NAME'}\n`;
      if (personalInfo.title) content += `${personalInfo.title}\n`;
      if (personalInfo.email) content += `Email: ${personalInfo.email}\n`;
      if (personalInfo.phone) content += `Phone: ${personalInfo.phone}\n`;
      if (personalInfo.location) content += `Location: ${personalInfo.location}\n`;
      if (personalInfo.linkedin) content += `LinkedIn: ${personalInfo.linkedin}\n`;
      if (personalInfo.website) content += `Website: ${personalInfo.website}\n`;
      content += '\n';
      
      // Summary
      if (summary) {
        content += 'PROFESSIONAL SUMMARY\n';
        content += '='.repeat(20) + '\n';
        content += `${summary}\n\n`;
      }
      
      // Skills
      if (skillCategories?.length > 0) {
        content += 'TECHNICAL SKILLS\n';
        content += '='.repeat(15) + '\n';
        skillCategories.forEach((category: any) => {
          if (category.name && category.skills?.length > 0) {
            content += `${category.name}: ${category.skills.join(', ')}\n`;
          }
        });
        content += '\n';
      }
      
      // Experience
      if (experience?.length > 0) {
        content += 'WORK EXPERIENCE\n';
        content += '='.repeat(15) + '\n';
        experience.forEach((exp: any) => {
          content += `${exp.title || 'POSITION'}\n`;
          content += `${exp.company || 'COMPANY'} | ${exp.location || 'LOCATION'} | ${exp.duration || 'DURATION'}\n`;
          if (exp.description) {
            content += `${exp.description}\n`;
          }
          content += '\n';
        });
      }
      
      // Education
      if (education?.length > 0) {
        content += 'EDUCATION\n';
        content += '='.repeat(9) + '\n';
        education.forEach((edu: any) => {
          content += `${edu.degree || 'DEGREE'}\n`;
          content += `${edu.school || 'SCHOOL'} | ${edu.year || 'YEAR'}`;
          if (edu.gpa) content += ` | GPA: ${edu.gpa}`;
          content += '\n\n';
        });
      }
      
      // Projects
      if (projects?.length > 0) {
        content += 'PROJECTS\n';
        content += '='.repeat(8) + '\n';
        projects.forEach((project: any) => {
          content += `${project.name || 'PROJECT'}\n`;
          content += `Technologies: ${project.tech || 'N/A'} | ${project.duration || 'DURATION'}\n`;
          if (project.description) {
            content += `${project.description}\n`;
          }
          content += '\n';
        });
      }
      
      return content;
    }
    
    // For PDF and DOCX, return HTML-like structure (would need proper conversion in real app)
    return `Resume for ${personalInfo.name || 'User'} - ${format.toUpperCase()} format`;
  };

  const selectedFormat = formatOptions.find(f => f.id === format);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Resume
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-6">
            {!isExporting && !exportComplete && (
              <>
                {/* Format Selection */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Choose Format</Label>
                  <RadioGroup value={format} onValueChange={setFormat}>
                    <div className="grid gap-3">
                      {formatOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <div key={option.id} className="flex items-center space-x-3">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <label
                              htmlFor={option.id}
                              className="flex-1 cursor-pointer"
                            >
                              <Card className={`p-4 transition-all ${
                                format === option.id ? 'ring-1 ring-primary' : 'hover:bg-muted/50'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <Icon className="w-6 h-6 text-primary" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{option.name}</span>
                                      {option.recommended && (
                                        <Badge variant="default" className="text-xs">
                                          Recommended
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="options" className="space-y-6">
            {/* Export Options */}
            <div>
              <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Export Options
              </Label>
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Preserve Colors</Label>
                      <p className="text-sm text-muted-foreground">
                        Include template colors and styling
                      </p>
                    </div>
                    <Switch
                      checked={includeColors}
                      onCheckedChange={setIncludeColors}
                      disabled={format === 'txt' || format === 'json'}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Custom Fonts</Label>
                      <p className="text-sm text-muted-foreground">
                        Use template-specific typography
                      </p>
                    </div>
                    <Switch
                      checked={includeFonts}
                      onCheckedChange={setIncludeFonts}
                      disabled={format === 'txt' || format === 'json'}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Advanced Layout</Label>
                      <p className="text-sm text-muted-foreground">
                        Preserve spacing and positioning
                      </p>
                    </div>
                    <Switch
                      checked={includeLayout}
                      onCheckedChange={setIncludeLayout}
                      disabled={format === 'txt' || format === 'json'}
                    />
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Export Preview */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Export Summary</Label>
              <Card className="p-4 bg-muted/30">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{selectedFormat?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Template:</span>
                    <span className="font-medium capitalize">{template}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File name:</span>
                    <span className="font-medium">
                      {resumeData.personal?.name?.replace(/\s+/g, '_') || 'resume'}.{format}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Export Progress */}
        {isExporting && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Exporting your resume...</h3>
              <Progress value={exportProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                {exportProgress < 100 ? 'Processing...' : 'Almost done!'}
              </p>
            </div>
          </div>
        )}
        
        {/* Export Complete */}
        {exportComplete && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-600 mb-2">Export Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your resume has been downloaded successfully.
              </p>
            </div>
          </div>
        )}
        
        {/* Actions */}
        {!isExporting && !exportComplete && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export {selectedFormat?.name}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}