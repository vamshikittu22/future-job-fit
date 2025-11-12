import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Zap, Target, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIEnhanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: any;
  onEnhance: (enhancedData: any) => void;
  step?: 'summary' | 'experience' | 'skills' | null;
}

const tonePresets = [
  { id: 'formal', label: 'Formal', description: 'Professional and traditional tone' },
  { id: 'modern', label: 'Modern', description: 'Contemporary and dynamic language' },
  { id: 'concise', label: 'Concise', description: 'Brief and to-the-point' },
  { id: 'impactful', label: 'Impactful', description: 'Strong action verbs and results' },
  { id: 'creative', label: 'Creative', description: 'Innovative and engaging tone' },
];

const focusAreas = [
  { id: 'technical', label: 'Technical Skills', icon: Zap },
  { id: 'leadership', label: 'Leadership', icon: Target },
  { id: 'results', label: 'Results & Impact', icon: Sparkles },
  { id: 'collaboration', label: 'Collaboration', icon: Shield },
];

const strategyPresets = [
  {
    id: 'ats-optimized',
    name: 'ATS Optimized',
    description: 'Maximize compatibility with Applicant Tracking Systems',
    features: ['Keyword optimization', 'Standard formatting', 'Clear section headers']
  },
  {
    id: 'concise',
    name: 'Concise Professional',
    description: 'Clean, brief, and impactful content',
    features: ['Shortened descriptions', 'Key achievements focus', 'Bullet point optimization']
  },
  {
    id: 'impactful',
    name: 'Maximum Impact',
    description: 'Emphasize achievements and quantifiable results',
    features: ['Metrics highlighting', 'Achievement rewriting', 'Strong action verbs']
  }
];

export default function AIEnhanceModal({ 
  open, 
  onOpenChange, 
  resumeData, 
  onEnhance,
  step = null
}: AIEnhanceModalProps) {
  const [selectedTone, setSelectedTone] = useState('modern');
  const [selectedFocus, setSelectedFocus] = useState<string[]>(['technical']);
  const [keywords, setKeywords] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const handleFocusToggle = (focusId: string) => {
    setSelectedFocus(prev => 
      prev.includes(focusId) 
        ? prev.filter(id => id !== focusId)
        : [...prev, focusId]
    );
  };

  const handlePresetApply = async (presetId: string) => {
    setIsEnhancing(true);
    
    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock enhancement based on preset and step
    const enhanced = { ...resumeData };
    
    if (step === 'summary') {
      switch (presetId) {
        case 'ats-optimized':
          if (enhanced.summary) {
            enhanced.summary = enhanced.summary + " Experienced in agile methodologies, cross-functional collaboration, and project management.";
          }
          break;
        case 'concise':
          if (enhanced.summary && enhanced.summary.length > 200) {
            enhanced.summary = enhanced.summary.substring(0, 197) + "...";
          }
          break;
        case 'impactful':
          if (enhanced.summary) {
            enhanced.summary = enhanced.summary.replace(/^[a-z]/, (match: string) => 
              match.toUpperCase()
            );
          }
          break;
      }
    } else if (step === 'experience') {
      switch (presetId) {
        case 'ats-optimized':
          if (enhanced.experience) {
            enhanced.experience = enhanced.experience.map((exp: any) => ({
              ...exp,
              description: exp.description + "\n• Utilized industry best practices and modern development methodologies"
            }));
          }
          break;
        case 'concise':
          if (enhanced.experience) {
            enhanced.experience = enhanced.experience.map((exp: any) => ({
              ...exp,
              description: exp.description && exp.description.length > 200 
                ? exp.description.substring(0, 197) + "..."
                : exp.description
            }));
          }
          break;
        case 'impactful':
          if (enhanced.experience) {
            enhanced.experience = enhanced.experience.map((exp: any) => ({
              ...exp,
              description: exp.description?.replace(/^•\s*[a-z]/, (match: string) => 
                '• ' + ['Achieved', 'Delivered', 'Optimized', 'Implemented'][Math.floor(Math.random() * 4)]
              )
            }));
          }
          break;
      }
    } else if (step === 'skills') {
      switch (presetId) {
        case 'ats-optimized':
          if (enhanced.skills) {
            const additionalSkills = ['Agile', 'Scrum', 'DevOps', 'CI/CD'];
            enhanced.skills = {
              ...enhanced.skills,
              tools: [...(enhanced.skills.tools || []), ...additionalSkills.filter(s => !enhanced.skills.tools?.includes(s))]
            };
          }
          break;
        case 'concise':
          // Keep only top skills
          if (enhanced.skills) {
            enhanced.skills = {
              languages: enhanced.skills.languages?.slice(0, 5) || [],
              frameworks: enhanced.skills.frameworks?.slice(0, 5) || [],
              tools: enhanced.skills.tools?.slice(0, 5) || []
            };
          }
          break;
        case 'impactful':
          // Add modern equivalents
          if (enhanced.skills) {
            const modernSkills = ['TypeScript', 'React', 'Node.js', 'Docker', 'Kubernetes'];
            enhanced.skills = {
              ...enhanced.skills,
              frameworks: [...(enhanced.skills.frameworks || []), ...modernSkills.filter(s => !enhanced.skills.frameworks?.includes(s))]
            };
          }
          break;
      }
    } else {
      // Global enhancement (no step specified)
      switch (presetId) {
        case 'ats-optimized':
          if (enhanced.summary) {
            enhanced.summary = enhanced.summary + " Experienced in agile methodologies, cross-functional collaboration, and project management.";
          }
          break;
        case 'concise':
          if (enhanced.experience) {
            enhanced.experience = enhanced.experience.map((exp: any) => ({
              ...exp,
              description: exp.description && exp.description.length > 200 
                ? exp.description.substring(0, 197) + "..."
                : exp.description
            }));
          }
          break;
        case 'impactful':
          if (enhanced.experience) {
            enhanced.experience = enhanced.experience.map((exp: any) => ({
              ...exp,
              description: exp.description?.replace(/^•\s*[a-z]/, (match: string) => 
                '• ' + ['Achieved', 'Delivered', 'Optimized', 'Implemented'][Math.floor(Math.random() * 4)]
              )
            }));
          }
          break;
      }
    }
    
    setIsEnhancing(false);
    onEnhance(enhanced);
    onOpenChange(false);
    
    toast({
      title: "Resume enhanced!",
      description: `Applied ${presetId.replace('-', ' ')} strategy${step ? ` to ${step}` : ''}.`,
    });
  };

  const handleCustomEnhance = async () => {
    setIsEnhancing(true);
    
    // Simulate custom AI enhancement
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const enhanced = { ...resumeData };
    // Apply custom enhancements based on selections
    
    setIsEnhancing(false);
    onEnhance(enhanced);
    onOpenChange(false);
    
    toast({
      title: "Custom enhancement applied!",
      description: "Your resume has been enhanced with your custom preferences.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Resume Enhancement
            {step && (
              <span className="text-sm text-muted-foreground font-normal">
                - {step === 'summary' ? 'Professional Summary' : step === 'experience' ? 'Work Experience' : 'Skills'}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Quick Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Choose a Strategy</h3>
              {strategyPresets.map((preset) => (
                <Card key={preset.id} className="p-4 hover:shadow-swiss transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{preset.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {preset.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {preset.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePresetApply(preset.id)}
                      disabled={isEnhancing}
                      className="ml-4"
                    >
                      {isEnhancing ? 'Enhancing...' : 'Apply'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div className="space-y-6">
              {/* Tone Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Tone & Style</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tonePresets.map((tone) => (
                    <Card
                      key={tone.id}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedTone === tone.id 
                          ? 'border-primary shadow-accent' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTone(tone.id)}
                    >
                      <h4 className="font-medium mb-1">{tone.label}</h4>
                      <p className="text-xs text-muted-foreground">{tone.description}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Focus Areas */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Highlight Areas</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {focusAreas.map((area) => {
                    const Icon = area.icon;
                    return (
                      <Card
                        key={area.id}
                        className={`p-3 cursor-pointer transition-all ${
                          selectedFocus.includes(area.id)
                            ? 'border-primary shadow-accent bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handleFocusToggle(area.id)}
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{area.label}</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <Label htmlFor="keywords" className="text-base font-semibold">
                  Industry Keywords
                </Label>
                <Textarea
                  id="keywords"
                  placeholder="Enter relevant keywords for your industry/role (e.g., React, JavaScript, Team Leadership, Agile, etc.)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Restrictions */}
              <div>
                <Label htmlFor="restrictions" className="text-base font-semibold">
                  Restrictions (Optional)
                </Label>
                <Textarea
                  id="restrictions"
                  placeholder="Any words or phrases to avoid (e.g., avoid buzzwords, keep under 2 pages, etc.)"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCustomEnhance}
                  disabled={isEnhancing}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isEnhancing ? 'Enhancing...' : 'Enhance Resume'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}