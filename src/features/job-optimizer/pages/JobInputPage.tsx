import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Badge } from "@/shared/ui/badge";
import { Switch } from "@/shared/ui/switch";
import { FileText, Briefcase, Zap, Trash2, Upload, Copy, Download, FileDown } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { motion } from "framer-motion";
import { useResume } from "@/shared/contexts/ResumeContext";
import AppNavigation from "@/shared/components/layout/AppNavigation";
import Footer from "@/shared/components/layout/Footer";
import ModelSelector from "@/shared/components/common/ModelSelector";
import CustomizeAIButton from "@/shared/components/common/CustomizeAIButton";
import CustomizeAIModal from "@/features/job-optimizer/components/CustomizeAIModal";
import AnalysisPanel from "@/features/job-optimizer/components/AnalysisPanel";
import ImportExportPanel from "@/shared/components/common/ImportExportPanel";
import ExportOptimizedModal from "@/features/job-optimizer/components/ExportOptimizedModal";

export default function ResumeInput() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [customInstructions, setCustomInstructions] = useState<any>({
    resumeLength: 2,
    fontSizes: {
      heading: "18px",
      subheading: "14px",
      body: "11px"
    },
    summaryBullets: [],
    summaryCount: 3,
    skillCategories: {
      languages: [],
      frameworks: [],
      databases: [],
      tools: []
    },
    projectCount: 4,
    experienceBullets: [],
    bulletPunctuation: "none",
    boldKeywords: true,
    chronologicalOrder: true,
    prdrAllocation: {
      backend: 30,
      frontend: 25,
      cloud: 20,
      devops: 10,
      testing: 10,
      security: 5
    },
    validateVersions: true,
    techStackOverrides: [],
    updateSteps: [],
    targetAudience: "",
    leadershipGoals: "",
    metrics: "",
    customInstructions: "",
    selectedTags: []
  });

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

  const { toast } = useToast();
  const { clearForm } = useResume();

  // Load data from localStorage
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

  // Save to localStorage on change
  useEffect(() => {
    if (resumeText) localStorage.setItem("resumeText", resumeText);
    if (jobDescription) localStorage.setItem("jobDescription", jobDescription);
  }, [resumeText, jobDescription]);

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
    setShowImport(false);
    toast({
      title: "Resume Imported",
      description: "Your resume has been loaded successfully.",
    });
  };

  const handleResumeUpdate = (updatedResume: string) => {
    setResumeText(updatedResume);
    localStorage.setItem("resumeText", updatedResume);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeText);
    toast({
      title: "Copied!",
      description: "Resume copied to clipboard.",
    });
  };

  const loadExample = () => {
    setResumeText(`John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith

EXPERIENCE

TechCorp Inc. - Senior Software Engineer (2020-Present)
• Developed scalable web applications using React and Node.js serving 100K+ users
• Led team of 5 developers on client-facing dashboard projects
• Improved application performance by 40% through caching and optimization
• Collaborated with cross-functional teams to deliver features on schedule

StartupXYZ - Software Engineer (2018-2020)
• Built responsive frontend interfaces with modern JavaScript frameworks
• Designed and implemented REST APIs with PostgreSQL databases
• Participated in agile development process with 2-week sprint cycles
• Reduced bug count by 35% through comprehensive unit testing

PROJECTS

E-Commerce Platform
• Architected microservices backend handling 50K daily transactions
• Implemented real-time inventory management with WebSocket updates

Analytics Dashboard
• Created interactive data visualization using D3.js and Chart.js
• Optimized queries reducing load time from 5s to 800ms

EDUCATION

Bachelor of Science in Computer Science
State University (2014-2018)

SKILLS
JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS, Docker`);

    setJobDescription(`We are seeking a Senior Frontend Developer to join our dynamic team. The ideal candidate will have:

REQUIREMENTS:
• 5+ years of experience in frontend development
• Expert knowledge of React, TypeScript, and modern JavaScript
• Experience with state management (Redux, Zustand, Context API)
• Proficiency in CSS frameworks (Tailwind CSS, Styled Components)
• Knowledge of testing frameworks (Jest, Cypress, React Testing Library)
• Experience with CI/CD pipelines and deployment automation
• Strong problem-solving and communication skills
• Bachelor's degree in Computer Science or related field

PREFERRED:
• Experience with Next.js or similar frameworks
• Knowledge of GraphQL and Apollo Client
• Understanding of micro-frontend architectures
• Previous leadership or mentoring experience
• AWS or cloud platform certifications

RESPONSIBILITIES:
• Lead frontend development initiatives across multiple products
• Mentor junior developers and conduct code reviews
• Collaborate with designers to implement pixel-perfect UIs
• Drive technical decisions and architecture improvements`);

    toast({
      title: "Example Loaded",
      description: "Sample resume and job description loaded. Check the Analysis panel!",
    });
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all inputs?")) {
      setResumeText("");
      setJobDescription("");
      setSelectedTags([]);
      setSelectedTemplate("");
      setSectionToggles({
        summary: true,
        projects: true,
        skills: true,
        experience: true
      });
      setBulletMode('normal');
      localStorage.removeItem("resumeText");
      localStorage.removeItem("jobDescription");

      toast({
        title: "Cleared",
        description: "All inputs have been reset.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <motion.div
        className="swiss-container swiss-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Resume Optimizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Paste your resume and job description to see real-time ATS analysis. Click missing keywords to add them.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-3 mb-6"
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
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={!resumeText}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            disabled={!resumeText}
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadExample}
          >
            Load Example
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Import Panel (collapsible) */}
        {showImport && (
          <motion.div
            className="max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ImportExportPanel
              resumeText={resumeText}
              onResumeImport={handleResumeImport}
              hasContent={!!resumeText}
            />
          </motion.div>
        )}

        {/* AI Options Panel - Collapsible */}
        <motion.details
          className="max-w-4xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" />
            AI Enhancement Options (click to expand)
          </summary>
          <Card className="p-6 shadow-swiss bg-gradient-card">
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
        </motion.details>

        {/* Main Content Grid - 3 columns */}
        <motion.div
          className="grid lg:grid-cols-3 gap-6 max-w-[1800px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Resume Input - Column 1 */}
          <Card className="p-5 shadow-swiss bg-gradient-card hover:shadow-accent transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent" />
              </div>
              <div>
                <Label htmlFor="resume" className="text-base font-semibold">
                  Your Resume
                </Label>
                <p className="text-xs text-muted-foreground">
                  Paste or type your resume
                </p>
              </div>
            </div>

            <Textarea
              id="resume"
              placeholder="Paste your resume here...&#10;&#10;Include Experience, Projects, Skills, etc."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[450px] text-sm leading-relaxed font-mono"
            />

            <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
              <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
              <span>{resumeText.length} chars</span>
            </div>
          </Card>

          {/* Job Description Input - Column 2 */}
          <Card className="p-5 shadow-swiss bg-gradient-card hover:shadow-accent transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-accent" />
              </div>
              <div>
                <Label htmlFor="job-description" className="text-base font-semibold">
                  Job Description
                </Label>
                <p className="text-xs text-muted-foreground">
                  Paste target job posting
                </p>
              </div>
            </div>

            <Textarea
              id="job-description"
              placeholder="Paste the job description here...&#10;&#10;Include requirements and qualifications."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[450px] text-sm leading-relaxed"
            />

            <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
              <span>{jobDescription.split(/\s+/).filter(Boolean).length} words</span>
              <span>{jobDescription.length} chars</span>
            </div>
          </Card>

          {/* Analysis Panel - Column 3 */}
          <div className="min-h-[530px]">
            <AnalysisPanel
              resumeText={resumeText}
              jobDescription={jobDescription}
              onResumeUpdate={handleResumeUpdate}
            />
          </div>
        </motion.div>
      </motion.div>

      <CustomizeAIModal
        open={customizeModalOpen}
        onOpenChange={setCustomizeModalOpen}
        onSave={setCustomInstructions}
      />

      <ExportOptimizedModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        resumeText={resumeText}
      />

      <Footer />
    </div>
  );
}