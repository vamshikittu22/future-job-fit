import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { FileText, Briefcase, Settings, Eye, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import AppNavigation from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import ModelSelector from "@/components/ModelSelector";
import CustomizeAIButton from "@/components/CustomizeAIButton";
import CustomizeAIModal from "@/components/CustomizeAIModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import PreviewPanel from "@/components/PreviewPanel";
import ImportExportPanel from "../components/ImportExportPanel";

export default function ResumeInput() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [customInstructions, setCustomInstructions] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  
  // AI Options State
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sectionToggles, setSectionToggles] = useState({
    summary: true,
    projects: true,
    skills: true,
    experience: true
  });
  const [bulletMode, setBulletMode] = useState<'expand' | 'shorten' | 'normal'>('normal');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load data from localStorage if coming from Create Resume
  useEffect(() => {
    const savedResume = localStorage.getItem("resumeText");
    const savedJD = localStorage.getItem("jobDescription");
    const savedTags = localStorage.getItem("selectedTags");
    const savedTemplate = localStorage.getItem("selectedTemplate");
    
    if (savedResume) setResumeText(savedResume);
    if (savedJD) setJobDescription(savedJD);
    if (savedTags) setSelectedTags(JSON.parse(savedTags));
    if (savedTemplate) setSelectedTemplate(savedTemplate);
  }, []);

  const handleGenerate = () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume Required",
        description: "Please paste your resume text before generating.",
        variant: "destructive",
      });
      return;
    }
    
    // Show confirmation modal instead of directly navigating
    setConfirmModalOpen(true);
  };

  const handleConfirmGeneration = () => {
    // Store data in localStorage for Results page
    localStorage.setItem("resumeText", resumeText);
    localStorage.setItem("jobDescription", jobDescription);
    localStorage.setItem("selectedModel", selectedModel);
    
    // Store custom instructions if available
    if (customInstructions) {
      localStorage.setItem("customInstructions", JSON.stringify(customInstructions));
    }
    
    setConfirmModalOpen(false);
    navigate("/results");
  };

  // AI Options
  const tags = ["Cloud", "Backend", "UI/UX", "Java", "Python", "Testing", "Services"];
  const templates = ["Optimize for ATS", "Highlight Cloud Skills", "Concise & Impactful"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const selectTemplate = (template: string) => {
    setSelectedTemplate(template);
    // Apply template-specific optimizations
    if (template === "Optimize for ATS") {
      setSectionToggles({ summary: true, projects: true, skills: true, experience: true });
      setBulletMode('expand');
    } else if (template === "Concise & Impactful") {
      setBulletMode('shorten');
    }
  };

  const toggleSection = (section: keyof typeof sectionToggles) => {
    setSectionToggles(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleResumeImport = (content: string) => {
    setResumeText(content);
  };

  const loadExample = () => {
    setResumeText(`John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith

EXPERIENCE
Senior Software Engineer - TechCorp (2020-Present)
• Developed scalable web applications using React and Node.js
• Led team of 5 developers on client projects
• Improved application performance by 40%
• Collaborated with cross-functional teams

Software Engineer - StartupXYZ (2018-2020)  
• Built responsive frontend interfaces
• Worked with REST APIs and databases
• Participated in agile development process

EDUCATION
Bachelor of Science in Computer Science
State University (2014-2018)

SKILLS
JavaScript, React, Node.js, Python, SQL, Git`);

    setJobDescription(`We are seeking a Senior Frontend Developer to join our dynamic team. The ideal candidate will have:

REQUIREMENTS:
• 5+ years of experience in frontend development
• Expert knowledge of React, TypeScript, and modern JavaScript
• Experience with state management (Redux, Zustand)
• Proficiency in CSS frameworks (Tailwind, Styled Components)
• Knowledge of testing frameworks (Jest, Cypress)
• Experience with CI/CD pipelines and deployment
• Strong problem-solving and communication skills
• Bachelor's degree in Computer Science or related field

PREFERRED:
• Experience with Next.js or similar frameworks
• Knowledge of GraphQL and Apollo Client
• Familiarity with micro-frontend architectures
• Previous leadership or mentoring experience`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <motion.div 
        className="container mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-center">Resume Analysis</h1>
          <p className="text-center text-muted-foreground mt-2">
            Paste your resume and job description to get started
          </p>
        </motion.div>

        {/* Model Selection & Controls */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ModelSelector 
            value={selectedModel} 
            onValueChange={setSelectedModel} 
          />
          <CustomizeAIButton onClick={() => setCustomizeModalOpen(true)} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </motion.div>

        {/* AI Options Panel */}
        <motion.div
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <Card className="p-6 shadow-swiss bg-gradient-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Enhancement Options</h3>
                <p className="text-sm text-muted-foreground">Configure how AI should optimize your resume</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quick Templates */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Templates</Label>
                <div className="space-y-2">
                  {templates.map(template => (
                    <Badge
                      key={template}
                      variant={selectedTemplate === template ? "default" : "outline"}
                      className="cursor-pointer w-full justify-center py-2 text-xs"
                      onClick={() => selectTemplate(template)}
                    >
                      {template}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Focus Tags */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Focus Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Section Toggles */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">AI Updates</Label>
                <div className="space-y-3">
                  {Object.entries(sectionToggles).map(([section, enabled]) => (
                    <div key={section} className="flex items-center justify-between">
                      <Label htmlFor={section} className="text-xs capitalize cursor-pointer">
                        {section}
                      </Label>
                      <Switch
                        id={section}
                        checked={enabled}
                        onCheckedChange={() => toggleSection(section as keyof typeof sectionToggles)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet Control */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Content Length</Label>
                <div className="space-y-2">
                  {(['normal', 'expand', 'shorten'] as const).map(mode => (
                    <Badge
                      key={mode}
                      variant={bulletMode === mode ? "default" : "outline"}
                      className="cursor-pointer w-full justify-center py-2 text-xs capitalize"
                      onClick={() => setBulletMode(mode)}
                    >
                      {mode} Bullets
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className={`grid gap-8 max-w-7xl mx-auto ${showPreview ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Resume Input */}
          <Card className="p-6 shadow-swiss bg-gradient-card hover:shadow-accent transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label htmlFor="resume" className="text-lg font-semibold">
                  Resume Text
                </Label>
                <p className="text-sm text-muted-foreground">
                  Copy and paste your resume content
                </p>
              </div>
            </div>
            
            <Textarea
              id="resume"
              placeholder="Paste your resume here (copy from Word/PDF)&#10;&#10;Include your contact info, experience, education, and skills..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[400px] text-sm leading-relaxed"
            />
          </Card>

          {/* Job Description Input */}
          <Card className="p-6 shadow-swiss bg-gradient-card hover:shadow-accent transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label htmlFor="job-description" className="text-lg font-semibold">
                  Job Description <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add the target job posting for better tailoring
                </p>
              </div>
            </div>
            
            <Textarea
              id="job-description"
              placeholder="Paste the target job description here&#10;&#10;Include requirements, responsibilities, and preferred qualifications..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[400px] text-sm leading-relaxed"
            />
          </Card>

          {/* Import/Export Panel - Contextual */}
          <div className="space-y-4">
            <ImportExportPanel 
              resumeText={resumeText}
              onResumeImport={handleResumeImport}
              hasContent={!!resumeText || !!jobDescription}
            />
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <PreviewPanel 
                resumeText={resumeText}
                jobDescription={jobDescription}
                customInstructions={customInstructions}
              />
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleGenerate}
            disabled={!resumeText.trim()}
            className="px-8 hover:shadow-accent transition-all duration-300"
          >
            Generate Resume
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={loadExample}
            className="px-8 hover:shadow-swiss transition-all duration-300"
          >
            Load Example
          </Button>
        </motion.div>
      </motion.div>
      
      <CustomizeAIModal
        open={customizeModalOpen}
        onOpenChange={setCustomizeModalOpen}
        onSave={setCustomInstructions}
      />
      
      <ConfirmationModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirmGeneration}
        resumeText={resumeText}
        jobDescription={jobDescription}
        customInstructions={customInstructions}
        selectedModel={selectedModel}
      />
      
      <Footer />
    </div>
  );
}