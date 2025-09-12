import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  CheckCircle,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from 'file-saver';
import { exportResume } from '@/templates/exportUtils';
import { formatResumeData } from '@/templates/resumeDataUtils';

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
  const resumePreviewRef = useRef<HTMLDivElement>(null);

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

  const updateProgress = (progress: number) => {
    setExportProgress(progress);
  };

  const renderResumePreview = () => {
    if (!resumeData) return null;
    
    return (
      <div className="resume-preview bg-white p-8 w-[210mm] min-h-[297mm] mx-auto print:m-0 text-black">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black">{resumeData.personal?.name || 'Your Name'}</h1>
          {resumeData.personal?.title && (
            <h2 className="text-xl font-semibold text-black mt-1">{resumeData.personal.title}</h2>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
            {resumeData.personal?.email && (
              <a href={`mailto:${resumeData.personal.email}`} className="text-blue-900 hover:underline">
                {resumeData.personal.email}
              </a>
            )}
            {resumeData.personal?.phone && <span>{resumeData.personal.phone}</span>}
            {resumeData.personal?.location && <span>{resumeData.personal.location}</span>}
            {resumeData.personal?.website && (
              <a 
                href={resumeData.personal.website.startsWith('http') ? resumeData.personal.website : `https://${resumeData.personal.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-900 hover:underline"
              >
                {resumeData.personal.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {resumeData.personal?.linkedin && (
              <a 
                href={resumeData.personal.linkedin.startsWith('http') ? resumeData.personal.linkedin : `https://${resumeData.personal.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-900 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {(resumeData.personal?.links || []).map((link: any) => (
              <a
                key={link.id}
                href={link.url?.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        {resumeData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              SUMMARY
            </h3>
            <p className="whitespace-pre-line">{resumeData.summary}</p>
          </div>
        )}

        {/* Skills Section */}
        {(Array.isArray(resumeData.skills) && resumeData.skills.filter((c: any) => Array.isArray(c.items) && c.items.length > 0).length > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              TECHNICAL SKILLS
            </h3>
            <div className="space-y-2">
              {resumeData.skills
                .filter((c: any) => Array.isArray(c.items) && c.items.length > 0)
                .map((category: any) => (
                  <div key={category.id} className="flex flex-wrap items-baseline gap-2">
                    <span className="font-bold">{category.name}:</span>
                    <span>{category.items.join(', ')}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {resumeData.experience?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              PROFESSIONAL EXPERIENCE
            </h3>
            <div className="space-y-6">
              {resumeData.experience.map((exp: any, index: number) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{exp.position || 'Position'}</h4>
                      <div className="font-medium">
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </div>
                    </div>
                    <div className="text-sm font-medium whitespace-nowrap">
                      {exp.duration || ((exp.startDate || exp.endDate) ? `${exp.startDate || ''}${exp.startDate || exp.endDate ? ' - ' : ''}${exp.endDate || 'Present'}` : '')}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="mt-2 text-sm">
                      {exp.description}
                    </div>
                  )}
                  {exp.bullets?.length > 0 && (
                    <ul className="mt-2 pl-5 list-disc space-y-1">
                      {exp.bullets.map((bullet: string, i: number) => (
                        <li key={i} className="text-sm">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {resumeData.education?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              EDUCATION
            </h3>
            <div className="space-y-4">
              {resumeData.education.map((edu: any, index: number) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{edu.degree}</h4>
                    <span className="text-sm font-medium">
                      {edu.year || ((edu.startDate || edu.endDate) ? `${edu.startDate || ''}${edu.startDate || edu.endDate ? ' - ' : ''}${edu.endDate || 'Present'}` : '')}
                    </span>
                  </div>
                  <div className="font-medium">
                    {edu.school}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  {edu.gpa && (
                    <div className="text-sm">
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {resumeData.projects?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              PROJECTS
            </h3>
            <div className="space-y-6">
              {resumeData.projects.map((project: any, index: number) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{project.name}</h4>
                      {(project.duration || project.startDate || project.endDate) && (
                        <div className="text-sm font-medium">{project.duration || `${project.startDate || ''}${project.startDate || project.endDate ? ' - ' : ''}${project.endDate || 'Present'}`}</div>
                      )}
                    </div>
                    {project.link && (
                      <a 
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-900 hover:underline whitespace-nowrap"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  {project.tech && (
                    <div className="text-sm mt-1">
                      <span className="font-bold">Technologies:</span> {project.tech}
                    </div>
                  )}
                  {project.description && (
                    <p className="text-sm mt-2">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {resumeData.certifications?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              CERTIFICATIONS
            </h3>
            <div className="space-y-3">
              {resumeData.certifications.map((cert: any, index: number) => (
                <div key={index} className="text-sm">
                  <div className="font-bold">{cert.name}</div>
                  <div>
                    {cert.issuer}
                    {cert.date && ` • ${cert.date}`}
                  </div>
                  {(cert.link || cert.credentialUrl) && (
                    <a 
                      href={(cert.link || cert.credentialUrl).startsWith('http') ? (cert.link || cert.credentialUrl) : `https://${cert.link || cert.credentialUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-900 hover:underline text-xs"
                    >
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {Array.isArray(resumeData.customSections) && resumeData.customSections.length > 0 && (
          <div className="space-y-6">
            {resumeData.customSections.map((section: any) => (
              <div key={section.id} className="mb-6">
                <h3 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
                  {(section.title || '').toUpperCase()}
                </h3>
                {section.description && (
                  <p className="text-sm mb-3">{section.description}</p>
                )}
                {Array.isArray(section.items) && section.items.length > 0 && (
                  <div className="space-y-4">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold">{item.title}</div>
                            {item.subtitle && (
                              <div className="font-medium">{item.subtitle}</div>
                            )}
                          </div>
                          {item.date && (
                            <div className="text-sm font-medium whitespace-nowrap">{item.date}</div>
                          )}
                        </div>
                        {item.description && (
                          <div className="mt-1 whitespace-pre-line">{item.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const generateTextContent = () => {
    if (!resumeData) return 'No resume data available';
    
    const { personal, summary, skills, experience, education, projects, certifications, customSections } = resumeData;
    let content = '';
    
    // Personal Info
    if (personal?.name) content += `${personal.name}\n`;
    if (personal?.title) content += `${personal.title}\n`;
    if (personal?.email) content += `Email: ${personal.email}\n`;
    if (personal?.phone) content += `Phone: ${personal.phone}\n`;
    if (personal?.linkedin) content += `LinkedIn: ${personal.linkedin}\n`;
    if (personal?.website) content += `Website: ${personal.website}\n\n`;
    
    // Summary
    if (summary) {
      content += `SUMMARY\n${summary}\n\n`;
    }
    
    // Skills
    if (Array.isArray(skills) && skills.filter((c: any) => Array.isArray(c.items) && c.items.length > 0).length > 0) {
      content += 'SKILLS\n';
      skills
        .filter((c: any) => Array.isArray(c.items) && c.items.length > 0)
        .forEach(category => {
          content += `- ${category.name}: ${category.items.join(', ')}\n`;
        });
      content += '\n';
    }
    
    // Experience
    if (experience?.length > 0) {
      content += 'EXPERIENCE\n';
      experience.forEach(exp => {
        content += `${exp.title || 'Position'}\n`;
        content += `${exp.company || 'Company'}`;
        if (exp.location) content += `, ${exp.location}`;
        if (exp.duration || exp.startDate || exp.endDate) content += ` | ${exp.duration || `${exp.startDate || ''}${exp.startDate || exp.endDate ? ' - ' : ''}${exp.endDate || 'Present'}`}`;
        content += '\n';
        
        if (exp.bullets?.length > 0) {
          exp.bullets.forEach((bullet: string) => { content += `• ${bullet}\n`; });
        }
        content += '\n';
      });
    }
    
    // Education
    if (education?.length > 0) {
      content += 'EDUCATION\n';
      education.forEach(edu => {
        content += `${edu.degree} in ${edu.fieldOfStudy}`;
        if (edu.school) content += `, ${edu.school}`;
        if (edu.location) content += `, ${edu.location}`;
        if (edu.startDate || edu.endDate) content += ` (${edu.startDate || ''} - ${edu.endDate || ''})`;
        content += '\n';
        if (edu.gpa) content += `GPA: ${edu.gpa}\n`;
        content += '\n';
      });
    }

    // Projects
    if (projects?.length > 0) {
      content += 'PROJECTS\n';
      projects.forEach(proj => {
        content += `${proj.name}`;
        if (proj.url) content += ` (${proj.url})`;
        content += '\n';
        if (proj.description) content += `${proj.description}\n`;
        if (proj.technologies?.length > 0) {
          content += `Technologies: ${proj.technologies.join(', ')}\n`;
        }
        content += '\n';
      });
    }

    // Certifications
    if (certifications?.length > 0) {
      content += 'CERTIFICATIONS\n';
      certifications.forEach(cert => {
        content += `${cert.name}`;
        if (cert.issuer) content += `, ${cert.issuer}`;
        if (cert.date) content += ` (${cert.date})`;
        if (cert.credentialUrl) content += `\n${cert.credentialUrl}`;
        content += '\n\n';
      });
    }

    // Custom Sections
    if (Array.isArray(customSections) && customSections.length > 0) {
      customSections.forEach(section => {
        content += `${(section.title || '').toUpperCase()}\n`;
        if (section.description) content += `${section.description}\n\n`;
        if (Array.isArray(section.items) && section.items.length > 0) {
          section.items.forEach(item => {
            content += `${item.title}\n`;
            if (item.subtitle) content += `${item.subtitle}\n`;
            if (item.date) content += `${item.date}\n`;
            if (item.description) content += `${item.description}\n\n`;
          });
        }
        content += '\n';
      });
    }

    return content;
  };

  const handleExport = async () => {
    console.log('Export clicked with data:', resumeData); // Debug log
    
    if (!resumeData) {
      console.error('No resume data available for export');
      toast({
        title: "Export failed",
        description: "No resume data available to export. Please ensure your resume has content.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);
    
    try {
      // Simulate progress updates
      const steps = [
        { progress: 20, message: "Preparing resume data..." },
        { progress: 40, message: "Applying template styling..." },
        { progress: 60, message: "Generating document..." },
        { progress: 80, message: "Optimizing for format..." },
        { progress: 100, message: "Export complete!" }
      ];
      
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 300));
        updateProgress(step.progress);
      }
      
      setExportComplete(true);
      
      const name = resumeData?.personal?.name?.replace(/\s+/g, '_') || 'resume';
      const baseName = `${name}_${new Date().toISOString().split('T')[0]}`;
       
      switch (format) {
        case 'pdf':
          await exportResume(formatResumeData(resumeData), 'pdf', baseName);
          break;
          
        case 'docx':
          await exportResume(formatResumeData(resumeData), 'word', baseName);
          break;
          
        case 'json':
          const jsonContent = JSON.stringify(resumeData, null, 2);
          const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
          saveAs(jsonBlob, `${baseName}.json`);
          break;
          
        case 'txt':
          await exportResume(formatResumeData(resumeData), 'text', baseName);
          break;
          
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      toast({
        title: "Export successful",
        description: `Your resume has been exported as ${baseName}.${format}`,
      });
      
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred during export. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedFormat = formatOptions.find(f => f.id === format);

  // Reset export state when modal opens/closes
  useEffect(() => {
    if (open) {
      setExportProgress(0);
      setExportComplete(false);
      setIsExporting(false);
      
      // Ensure the preview is visible before exporting
      if (resumePreviewRef.current) {
        resumePreviewRef.current.style.display = 'block';
      }
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [open]);
  
  // Add a style tag for print-specific styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .resume-preview, .resume-preview * {
          visibility: visible;
        }
        .resume-preview {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 0;
          margin: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>Export Resume</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="format" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Select Format</h3>
              <RadioGroup 
                value={format} 
                onValueChange={(value) => setFormat(value)}
                className="grid gap-4"
              >
                {formatOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={option.id} className="font-medium">
                            {option.name}
                          </Label>
                          {option.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Export Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Colors</Label>
                    <p className="text-sm text-muted-foreground">
                      Export with your selected color scheme
                    </p>
                  </div>
                  <Switch 
                    checked={includeColors} 
                    onCheckedChange={setIncludeColors} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Custom Fonts</Label>
                    <p className="text-sm text-muted-foreground">
                      Embed custom fonts in the export
                    </p>
                  </div>
                  <Switch 
                    checked={includeFonts} 
                    onCheckedChange={setIncludeFonts} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Layout</Label>
                    <p className="text-sm text-muted-foreground">
                      Preserve the original layout
                    </p>
                  </div>
                  <Switch 
                    checked={includeLayout} 
                    onCheckedChange={setIncludeLayout} 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Hidden preview for PDF generation */}
        <div 
          ref={resumePreviewRef}
          className="fixed left-[-9999px] top-0 w-[210mm] bg-white"
          style={{ display: 'none' }}
        >
          {renderResumePreview()}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t mt-6">
          <div className="text-sm text-muted-foreground">
            {format && (
              <span>Exporting as <span className="font-medium">{selectedFormat?.name}</span></span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Resume
                </>
              )}
            </Button>
          </div>
        </div>
        
        {isExporting && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Exporting {selectedFormat?.name}...</span>
              <span>{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
            {exportComplete && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Export complete! Your download will start shortly.</span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}