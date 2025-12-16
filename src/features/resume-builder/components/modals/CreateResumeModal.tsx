import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, GraduationCap, Award, Briefcase, Code, Target, FileText, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CreateResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabValue = 'blank' | 'sample' | 'import';

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  education: string;
  certifications: string;
  projects: string;
  achievements: string;
  experience: string;
  jobDescription: string;
};

export default function CreateResumeModal({ open, onOpenChange }: CreateResumeModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabValue>('blank');
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  const defaultFormData: FormData = {
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: [],
    education: "",
    certifications: "",
    projects: "",
    achievements: "",
    experience: "",
    jobDescription: ""
  };

  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [newSkill, setNewSkill] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("swiss");

  const skillCategories = {
    languages: ["JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust"],
    frontend: ["React", "Vue", "Angular", "HTML", "CSS", "Tailwind", "Bootstrap"],
    backend: ["Node.js", "Express", "Django", "Spring", ".NET", "FastAPI"],
    database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "DynamoDB"],
    cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Serverless"],
    tools: ["Git", "CI/CD", "Jest", "Cypress", "Webpack", "Vite"]
  };

  const tags = ["Cloud", "Backend", "UI/UX", "Java", "Python", "Testing", "Services"];
  const templates = ["Optimize for ATS", "Highlight Cloud Skills", "Concise & Impactful"];

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    if (template === "Optimize for ATS") {
      setFormData(prev => ({
        ...prev,
        summary: "Results-driven professional with proven track record in delivering high-quality solutions..."
      }));
    }
  };

  const loadSampleData = () => {
    setFormData({
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      summary: "Senior Software Engineer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Passionate about building scalable and maintainable applications.",
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker", "Python", "SQL"],
      education: "Bachelor of Science in Computer Science\nStanford University, 2018",
      experience: "Senior Software Engineer at TechCorp (2020-Present)\n• Led a team of 5 developers to deliver a new customer portal\n• Improved application performance by 40% through code optimization\n• Implemented CI/CD pipeline reducing deployment time by 60%\n\nSoftware Developer at WebSolutions (2018-2020)\n• Developed and maintained RESTful APIs using Node.js\n• Collaborated with cross-functional teams to deliver new features",
      projects: "E-commerce Platform (2022)\n• Built with React, Node.js, and MongoDB\n• Implemented payment integration with Stripe\n\nTask Management App (2021)\n• Developed using React and Firebase\n• Real-time updates using WebSockets",
      certifications: "AWS Certified Solutions Architect - Associate\nGoogle Cloud Professional Developer",
      achievements: "Employee of the Year 2022 at TechCorp\nPublished article on Microservices Architecture",
      jobDescription: ""
    });
    setSelectedTemplate("swiss");
  };

  const handleImport = () => {
    try {
      setIsImporting(true);
      const parsedData = JSON.parse(importData);
      
      // Basic validation
      if (!parsedData.name || !parsedData.email) {
        throw new Error("Invalid resume data: Missing required fields");
      }
      
      // Map the imported data to our form structure
      setFormData({
        name: parsedData.name || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        location: parsedData.location || "",
        summary: parsedData.summary || parsedData.objective || "",
        skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
        education: parsedData.education ? 
          parsedData.education.map((edu: any) => 
            `${edu.degree} in ${edu.fieldOfStudy}\n${edu.school}, ${edu.endYear}`
          ).join('\n\n') : "",
        experience: parsedData.experience ? 
          parsedData.experience.map((exp: any) => 
            `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n${exp.description || ''}${exp.achievements ? '\n• ' + exp.achievements.join('\n• ') : ''}`
          ).join('\n\n') : "",
        projects: parsedData.projects ? 
          parsedData.projects.map((proj: any) => 
            `${proj.name} (${proj.technologies?.join(', ')})\n${proj.description || ''}`
          ).join('\n\n') : "",
        certifications: parsedData.certifications ? 
          parsedData.certifications.map((cert: any) => 
            `${cert.name} (${cert.issuer} - ${cert.date})`
          ).join('\n') : "",
        achievements: parsedData.awards ? 
          parsedData.awards.map((award: any) => 
            `${award.title} - ${award.awarder} (${award.date})`
          ).join('\n') : "",
        jobDescription: ""
      });
      
      setSelectedTemplate("swiss");
      setActiveTab('blank');
      toast({
        title: "Resume imported successfully",
        description: "Your resume data has been loaded. Please review and make any necessary changes.",
      });
    } catch (error) {
      console.error("Error importing resume:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Invalid resume data format",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreate = () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in at least your name and email address.",
        variant: "destructive"
      });
      return;
    }

    // Build resume text from form data
    const resumeText = `${formData.name}
${formData.email}${formData.phone ? ` | ${formData.phone}` : ''}${formData.location ? ` | ${formData.location}` : ''}

${formData.summary ? `PROFESSIONAL SUMMARY\n${formData.summary}\n` : ''}
${formData.skills.length > 0 ? `TECHNICAL SKILLS\n${formData.skills.join(', ')}\n\n` : ''}${formData.experience ? `EXPERIENCE\n${formData.experience}\n\n` : ''}${formData.projects ? `PROJECTS\n${formData.projects}\n\n` : ''}${formData.education ? `EDUCATION\n${formData.education}\n\n` : ''}${formData.certifications ? `CERTIFICATIONS\n${formData.certifications}\n\n` : ''}${formData.achievements ? `ACHIEVEMENTS\n${formData.achievements}` : ''}`.trim();

    // Store data and navigate
    localStorage.setItem("resumeText", resumeText);
    localStorage.setItem("jobDescription", formData.jobDescription);
    localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
    localStorage.setItem("selectedTemplate", selectedTemplate);
    
    onOpenChange(false);
    navigate("/input");
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setSelectedTags([]);
    setNewSkill("");
    setImportData("");
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when closing
      resetForm();
      setActiveTab('blank');
    }
    onOpenChange(isOpen);
  };

  const renderForm = () => (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Column - Personal Info & Content */}
      <div className="space-y-6">
        {/* Personal Information */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Personal Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        </Card>

        {/* Professional Summary */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Professional Summary</h3>
          </div>
          <Textarea
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Experienced software engineer with 5+ years..."
            className="min-h-[100px]"
          />
        </Card>

        {/* Technical Skills */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Technical Skills</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
              />
              <Button onClick={() => addSkill(newSkill)} size="sm">Add</Button>
            </div>
            
            {/* Quick Add Skills */}
            <div className="space-y-2">
              {Object.entries(skillCategories).map(([category, skills]) => (
                <div key={category}>
                  <Label className="text-xs text-muted-foreground capitalize">{category}</Label>
                  <div className="flex flex-wrap gap-1">
                    {skills.map(skill => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div>
                <Label className="text-sm">Selected Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map(skill => (
                    <Badge key={skill} variant="default" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Right Column - Experience & Settings */}
      <div className="space-y-6">
        {/* AI Options */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">AI Options</h3>
          
          {/* Quick Templates */}
          <div className="space-y-2 mb-4">
            <Label className="text-sm">Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              {templates.map(template => (
                <Badge
                  key={template}
                  variant={selectedTemplate === template ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  {template}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm">Focus Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Experience */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Experience</h3>
          </div>
          <Textarea
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            placeholder="Senior Software Engineer - Company (2020-Present)&#10;• Achievement 1&#10;• Achievement 2"
            className="min-h-[120px]"
          />
        </Card>

        {/* Projects */}
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Projects</h4>
          <Textarea
            value={formData.projects}
            onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value }))}
            placeholder="Project Name - Description and technologies used..."
            className="min-h-[80px]"
          />
        </Card>

        {/* Education */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Education</h3>
          </div>
          <Textarea
            value={formData.education}
            onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
            placeholder="Bachelor of Science in Computer Science&#10;University Name (2018-2022)"
            className="min-h-[60px]"
          />
        </Card>

        {/* Optional Job Description */}
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Target Job Description (Optional)</h4>
          <Textarea
            value={formData.jobDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
            placeholder="Paste the job description you're targeting..."
            className="min-h-[100px]"
          />
        </Card>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Resume</DialogTitle>
        </DialogHeader>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value as TabValue);
            if (value === 'sample') {
              loadSampleData();
            }
          }} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="blank">
              <FileText className="w-4 h-4 mr-2" />
              Blank
            </TabsTrigger>
            <TabsTrigger value="sample">
              <FileText className="w-4 h-4 mr-2" />
              Sample
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Import Resume</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Paste your JSON resume data or upload a JSON file. Supported formats: JSON Resume, LinkedIn export.
              </p>
              
              <Textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your JSON resume data here..."
                className="min-h-[200px] font-mono text-sm"
              />
              
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setImportData(event.target?.result as string);
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={!importData.trim() || isImporting}
                >
                  {isImporting ? 'Importing...' : 'Import Resume'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="blank" className="mt-0">
            {renderForm()}
          </TabsContent>

          <TabsContent value="sample" className="mt-0">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Sample Resume Loaded</h3>
                <p className="text-sm text-muted-foreground">
                  Review and edit the sample resume data below. You can switch to the "Blank" tab to start from scratch.
                </p>
              </div>
              {renderForm()}
            </div>
          </TabsContent>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {activeTab === 'blank' && 'Fill in your details to create a new resume'}
                {activeTab === 'sample' && 'Review and customize the sample resume'}
                {activeTab === 'import' && 'Import your existing resume data'}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setActiveTab('blank');
                  }}
                  disabled={activeTab === 'import'}
                >
                  Reset
                </Button>
                <Button 
                  onClick={activeTab === 'import' ? handleImport : handleCreate} 
                  disabled={activeTab === 'import' ? !importData.trim() || isImporting : !formData.name || !formData.email}
                >
                  {activeTab === 'import' ? 
                    (isImporting ? 'Importing...' : 'Import & Continue') : 
                    'Create Resume'}
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
