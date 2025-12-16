import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  RotateCcw, 
  Save,
  Info,
  Copy,
  FileCheck,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface CustomizeAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (instructions: CustomInstructions) => void;
}

interface CustomInstructions {
  // General Settings
  resumeLength: number;
  fontSizes: {
    heading: string;
    subheading: string;
    body: string;
  };

  // Professional Summary
  summaryBullets: string[];
  summaryCount: number;

  // Technical Skills
  skillCategories: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };

  // Experience & Projects
  projectCount: number;
  experienceBullets: string[];

  // Formatting & Style
  bulletPunctuation: string;
  boldKeywords: boolean;
  chronologicalOrder: boolean;

  // PRDR Allocation
  prdrAllocation: {
    backend: number;
    frontend: number;
    cloud: number;
    devops: number;
    testing: number;
    security: number;
  };

  // Timeline Tech Stack
  validateVersions: boolean;
  techStackOverrides: string[];

  // Resume Update Steps
  updateSteps: string[];

  // User Suggestions
  targetAudience: string;
  leadershipGoals: string;
  metrics: string;
  customInstructions: string;

  // Quick Tags
  selectedTags: string[];
}

const defaultInstructions: CustomInstructions = {
  resumeLength: 2,
  fontSizes: {
    heading: "18px",
    subheading: "14px",
    body: "11px"
  },
  summaryBullets: [
    "Experienced software engineer with [X] years in [domain]",
    "Expertise in [key technologies] with focus on [specialization]",
    "Led [number] of projects resulting in [measurable impact]"
  ],
  summaryCount: 3,
  skillCategories: {
    languages: ["JavaScript", "Python", "Java", "TypeScript"],
    frameworks: ["React", "Node.js", "Express", "Next.js"],
    databases: ["PostgreSQL", "MongoDB", "Redis"],
    tools: ["Git", "Docker", "AWS", "Jest"]
  },
  projectCount: 4,
  experienceBullets: [
    "Developed [technology] application that [impact/result]",
    "Collaborated with [team size] team to [achievement]",
    "Optimized [system/process] resulting in [measurable improvement]"
  ],
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
  updateSteps: [
    "Analyze job description for key requirements",
    "Match resume content to job keywords",
    "Quantify achievements with metrics",
    "Optimize for ATS compatibility",
    "Review formatting and consistency"
  ],
  targetAudience: "",
  leadershipGoals: "",
  metrics: "",
  customInstructions: "",
  selectedTags: []
};

const quickTags = [
  "Cloud", "Backend", "Frontend", "UI/UX", "Java", "Python", 
  "JavaScript", "React", "Node.js", "AWS", "Services", "Testing",
  "DevOps", "Security", "Leadership", "ATS-Optimized"
];

const quickTemplates = [
  {
    name: "Optimize for ATS",
    description: "Focus on keyword matching and ATS-friendly formatting",
    instructions: "Prioritize exact keyword matches from job description. Use standard section headings. Include relevant technical skills prominently. Quantify achievements with specific metrics."
  },
  {
    name: "Highlight Cloud Skills", 
    description: "Emphasize cloud architecture and DevOps experience",
    instructions: "Feature cloud technologies (AWS, Azure, GCP) prominently. Highlight infrastructure, scalability, and automation experience. Include specific cloud services used and their business impact."
  },
  {
    name: "Concise & Impactful",
    description: "Create a focused, results-driven resume",
    instructions: "Limit to 2 pages maximum. Use strong action verbs. Focus on quantifiable achievements. Remove redundant information. Prioritize most relevant experience for the target role."
  }
];

export default function CustomizeAIModal({ 
  open, 
  onOpenChange, 
  onSave 
}: CustomizeAIModalProps) {
  const [instructions, setInstructions] = useState<CustomInstructions>(defaultInstructions);
  const [expandedSections, setExpandedSections] = useState<string[]>(["general", "summary"]);
  const [characterCount, setCharacterCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved instructions from localStorage
    const saved = localStorage.getItem("customInstructions");
    if (saved) {
      try {
        setInstructions(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load saved instructions:", error);
      }
    }
  }, []);

  useEffect(() => {
    setCharacterCount(instructions.customInstructions.length);
  }, [instructions.customInstructions]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateInstructions = (updates: Partial<CustomInstructions>) => {
    const newInstructions = { ...instructions, ...updates };
    setInstructions(newInstructions);
    localStorage.setItem("customInstructions", JSON.stringify(newInstructions));
  };

  const addBullet = (type: 'summary' | 'experience') => {
    const key = type === 'summary' ? 'summaryBullets' : 'experienceBullets';
    updateInstructions({
      [key]: [...instructions[key], ""]
    });
  };

  const removeBullet = (type: 'summary' | 'experience', index: number) => {
    const key = type === 'summary' ? 'summaryBullets' : 'experienceBullets';
    updateInstructions({
      [key]: instructions[key].filter((_, i) => i !== index)
    });
  };

  const updateBullet = (type: 'summary' | 'experience', index: number, value: string) => {
    const key = type === 'summary' ? 'summaryBullets' : 'experienceBullets';
    const bullets = [...instructions[key]];
    bullets[index] = value;
    updateInstructions({
      [key]: bullets
    });
  };

  const updatePRDR = (category: keyof typeof instructions.prdrAllocation, value: number) => {
    updateInstructions({
      prdrAllocation: {
        ...instructions.prdrAllocation,
        [category]: value
      }
    });
  };

  const toggleTag = (tag: string) => {
    const newTags = instructions.selectedTags.includes(tag)
      ? instructions.selectedTags.filter(t => t !== tag)
      : [...instructions.selectedTags, tag];
    
    updateInstructions({ selectedTags: newTags });
  };

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    updateInstructions({ customInstructions: template.instructions });
    toast({
      title: "Template Applied",
      description: `Applied "${template.name}" template to custom instructions.`,
    });
  };

  const resetToDefaults = () => {
    setInstructions(defaultInstructions);
    localStorage.removeItem("customInstructions");
    toast({
      title: "Reset Complete", 
      description: "All settings have been reset to defaults.",
    });
  };

  const handleSave = () => {
    onSave(instructions);
    onOpenChange(false);
    toast({
      title: "Instructions Saved",
      description: "Your AI customization settings have been saved.",
    });
  };

  const prdrTotal = Object.values(instructions.prdrAllocation).reduce((sum, val) => sum + val, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Edit Resume Instructions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Templates</CardTitle>
              <CardDescription>
                Apply pre-configured settings for common resume optimization goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickTemplates.map((template) => (
                  <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => applyTemplate(template)}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Settings Tabs */}
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              {/* General Settings */}
              <Collapsible open={expandedSections.includes("general")} onOpenChange={() => toggleSection("general")}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle>General Settings</CardTitle>
                        {expandedSections.includes("general") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Resume Length (pages)</Label>
                        <Slider
                          value={[instructions.resumeLength]}
                          onValueChange={([value]) => updateInstructions({ resumeLength: value })}
                          max={3}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          Current: {instructions.resumeLength} page{instructions.resumeLength > 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Heading Size</Label>
                          <Select value={instructions.fontSizes.heading} onValueChange={(value) => 
                            updateInstructions({ fontSizes: { ...instructions.fontSizes, heading: value } })
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="16px">16px</SelectItem>
                              <SelectItem value="18px">18px</SelectItem>
                              <SelectItem value="20px">20px</SelectItem>
                              <SelectItem value="22px">22px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Subheading Size</Label>
                          <Select value={instructions.fontSizes.subheading} onValueChange={(value) => 
                            updateInstructions({ fontSizes: { ...instructions.fontSizes, subheading: value } })
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12px">12px</SelectItem>
                              <SelectItem value="14px">14px</SelectItem>
                              <SelectItem value="16px">16px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Body Size</Label>
                          <Select value={instructions.fontSizes.body} onValueChange={(value) => 
                            updateInstructions({ fontSizes: { ...instructions.fontSizes, body: value } })
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10px">10px</SelectItem>
                              <SelectItem value="11px">11px</SelectItem>
                              <SelectItem value="12px">12px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* PRDR Allocation */}
              <Collapsible open={expandedSections.includes("prdr")} onOpenChange={() => toggleSection("prdr")}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>PRDR Allocation</CardTitle>
                          <CardDescription>
                            Skill emphasis percentages (Total: {prdrTotal}%)
                          </CardDescription>
                        </div>
                        {expandedSections.includes("prdr") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      {Object.entries(instructions.prdrAllocation).map(([category, value]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="capitalize">{category}</Label>
                            <span className="text-sm font-medium">{value}%</span>
                          </div>
                          <Slider
                            value={[value]}
                            onValueChange={([newValue]) => updatePRDR(category as keyof typeof instructions.prdrAllocation, newValue)}
                            max={50}
                            min={0}
                            step={5}
                          />
                        </div>
                      ))}
                      {prdrTotal !== 100 && (
                        <div className="text-sm text-destructive">
                          ⚠ Total should equal 100% (Currently {prdrTotal}%)
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {/* Professional Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                  <CardDescription>
                    Customize summary bullets and structure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Summary Bullet Count</Label>
                    <Slider
                      value={[instructions.summaryCount]}
                      onValueChange={([value]) => updateInstructions({ summaryCount: value })}
                      max={5}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {instructions.summaryCount} bullets
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Summary Templates</Label>
                      <Button variant="outline" size="sm" onClick={() => addBullet('summary')}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {instructions.summaryBullets.map((bullet, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={bullet}
                            onChange={(e) => updateBullet('summary', index, e.target.value)}
                            placeholder="Summary bullet template..."
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeBullet('summary', index)}
                            disabled={instructions.summaryBullets.length <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                  <CardDescription>
                    Organize skills by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(instructions.skillCategories).map(([category, skills]) => (
                    <div key={category}>
                      <Label className="capitalize mb-2 block">{category}</Label>
                      <Input
                        value={skills.join(', ')}
                        onChange={(e) => updateInstructions({
                          skillCategories: {
                            ...instructions.skillCategories,
                            [category]: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          }
                        })}
                        placeholder={`Enter ${category} separated by commas...`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              {/* Quick Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Focus Tags</CardTitle>
                  <CardDescription>
                    Select tags to emphasize in your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {quickTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={instructions.selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Custom Instructions
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>
                    These instructions guide the AI when updating your resume along with the job description (0-1000 words)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Target Audience</Label>
                      <Input
                        value={instructions.targetAudience}
                        onChange={(e) => updateInstructions({ targetAudience: e.target.value })}
                        placeholder="e.g., Tech startups, Fortune 500..."
                      />
                    </div>
                    <div>
                      <Label>Leadership Goals</Label>
                      <Input
                        value={instructions.leadershipGoals}
                        onChange={(e) => updateInstructions({ leadershipGoals: e.target.value })}
                        placeholder="e.g., Team lead, Technical manager..."
                      />
                    </div>
                    <div>
                      <Label>Metrics Focus</Label>
                      <Input
                        value={instructions.metrics}
                        onChange={(e) => updateInstructions({ metrics: e.target.value })}
                        placeholder="e.g., Performance, Revenue, Users..."
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Additional Instructions</Label>
                      <div className="text-sm text-muted-foreground">
                        {characterCount}/1000 characters
                      </div>
                    </div>
                    <Textarea
                      value={instructions.customInstructions}
                      onChange={(e) => updateInstructions({ customInstructions: e.target.value.slice(0, 1000) })}
                      placeholder="Provide specific guidance for the AI to customize your resume..."
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Instructions
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}