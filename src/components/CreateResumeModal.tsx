import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, GraduationCap, Award, Briefcase, Code, Target } from "lucide-react";

interface CreateResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateResumeModal({ open, onOpenChange }: CreateResumeModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: [] as string[],
    education: "",
    certifications: "",
    projects: "",
    achievements: "",
    experience: "",
    jobDescription: ""
  });

  const [newSkill, setNewSkill] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

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
    // Apply template-specific modifications
    if (template === "Optimize for ATS") {
      setFormData(prev => ({
        ...prev,
        summary: "Results-driven professional with proven track record in delivering high-quality solutions..."
      }));
    }
  };

  const handleCreate = () => {
    // Build resume text from form data
    const resumeText = `${formData.name}
${formData.email} | ${formData.phone} | ${formData.location}

PROFESSIONAL SUMMARY
${formData.summary}

TECHNICAL SKILLS
${formData.skills.join(', ')}

EXPERIENCE
${formData.experience}

PROJECTS
${formData.projects}

EDUCATION
${formData.education}

CERTIFICATIONS
${formData.certifications}

ACHIEVEMENTS
${formData.achievements}`;

    // Store data and navigate
    localStorage.setItem("resumeText", resumeText);
    localStorage.setItem("jobDescription", formData.jobDescription);
    localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
    localStorage.setItem("selectedTemplate", selectedTemplate);
    
    onOpenChange(false);
    navigate("/input");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Resume</DialogTitle>
        </DialogHeader>

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

        <Separator />
        
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!formData.name || !formData.email}>
            Create Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}