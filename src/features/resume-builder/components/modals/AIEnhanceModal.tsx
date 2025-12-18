import { Plus, Sparkles, Zap, Target, Shield } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/hooks/use-toast";
import { resumeAI } from "@/shared/api/resumeAI";

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

    try {
      let contentToEnhance: any;
      if (step === 'summary') contentToEnhance = resumeData.summary;
      else if (step === 'experience') contentToEnhance = resumeData.experience;
      else if (step === 'skills') contentToEnhance = resumeData.skills;
      else contentToEnhance = resumeData; // Global fallback

      // Map formatted preset ID to a tone string Gemini understands
      const toneMap: Record<string, string> = {
        'ats-optimized': 'ATS-friendly and keyword-rich',
        'concise': 'concise and direct',
        'impactful': 'results-oriented and impactful'
      };

      const tone = toneMap[presetId] || 'professional';
      const enhancedContent = await resumeAI.improveContent(step || 'Resume', contentToEnhance, tone);

      // reconstruct the full data object
      const newData = { ...resumeData };
      if (step === 'summary') newData.summary = enhancedContent;
      else if (step === 'experience') newData.experience = enhancedContent;
      else if (step === 'skills') newData.skills = enhancedContent;

      onEnhance(newData);
      onOpenChange(false);

      toast({
        title: "Resume enhanced!",
        description: `Applied ${presetId.replace('-', ' ')} strategy${step ? ` to ${step}` : ''}.`,
      });
    } catch (error) {
      console.error("Enhancement failed:", error);
      toast({
        title: "Enhancement Failed",
        description: "AI service could not process your request.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCustomEnhance = async () => {
    setIsEnhancing(true);

    try {
      let contentToEnhance: any;
      if (step === 'summary') contentToEnhance = resumeData.summary;
      else if (step === 'experience') contentToEnhance = resumeData.experience;
      else if (step === 'skills') contentToEnhance = resumeData.skills;
      else contentToEnhance = resumeData;

      // Construct a detailed tone description
      const toneParams = [
        `Tone: ${tonePresets.find(t => t.id === selectedTone)?.label || 'Professional'}`,
        `Focus Areas: ${selectedFocus.map(id => focusAreas.find(f => f.id === id)?.label).join(', ')}`,
        keywords ? `Keywords: ${keywords}` : '',
        restrictions ? `Restrictions: ${restrictions}` : ''
      ].filter(Boolean).join('. ');

      const enhancedContent = await resumeAI.improveContent(step || 'Resume', contentToEnhance, toneParams);

      const newData = { ...resumeData };
      if (step === 'summary') newData.summary = enhancedContent;
      else if (step === 'experience') newData.experience = enhancedContent;
      else if (step === 'skills') newData.skills = enhancedContent;

      onEnhance(newData);
      onOpenChange(false);

      toast({
        title: "Custom enhancement applied!",
        description: "Your resume has been enhanced with your custom preferences.",
      });
    } catch (error) {
      console.error("Custom enhancement failed:", error);
      toast({
        title: "Enhancement Failed",
        description: "AI service could not process your request.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
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
                      className={`p-3 cursor-pointer transition-all ${selectedTone === tone.id
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
                        className={`p-3 cursor-pointer transition-all ${selectedFocus.includes(area.id)
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