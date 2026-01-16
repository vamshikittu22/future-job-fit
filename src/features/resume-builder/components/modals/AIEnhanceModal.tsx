import { Plus, Sparkles, Zap, Target, Shield, Check, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/shared/hooks/use-toast";
import { resumeAI, EnhancementResponse, EnhancementRequest } from "@/shared/api/resumeAI";
import { cn } from "@/shared/lib/utils";

interface AIEnhanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: any;
  onEnhance: (enhancedData: any) => void;
  step?: 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'achievements' | 'certifications' | string | null;
  targetItemIndex?: number | null;
  targetField?: string | null;
}

const tonePresets = [
  { id: 'Formal', label: 'Formal', description: 'Professional and traditional tone' },
  { id: 'Modern', label: 'Modern', description: 'Contemporary and dynamic language' },
  { id: 'Concise', label: 'Concise', description: 'Brief and to-the-point' },
  { id: 'Impactful', label: 'Impactful', description: 'Strong action verbs and results' },
  { id: 'Creative', label: 'Creative', description: 'Innovative and engaging tone' },
];

const focusAreas = [
  { id: 'Technical Skills', label: 'Technical Skills', icon: Zap },
  { id: 'Leadership', label: 'Leadership', icon: Target },
  { id: 'Results & Impact', label: 'Results & Impact', icon: Sparkles },
  { id: 'Collaboration', label: 'Collaboration', icon: Shield },
];

const strategyPresets = [
  {
    id: 'ATS Optimized',
    name: 'ATS Optimized',
    description: 'Maximize compatibility with Applicant Tracking Systems',
    features: ['Keyword optimization', 'Standard formatting', 'Clear section headers']
  },
  {
    id: 'Concise Professional',
    name: 'Concise Professional',
    description: 'Clean, brief, and impactful content',
    features: ['Shortened descriptions', 'Key achievements focus', 'Bullet point optimization']
  },
  {
    id: 'Maximum Impact',
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
  step = null,
  targetItemIndex = null,
  targetField = null
}: AIEnhanceModalProps) {
  const [selectedTone, setSelectedTone] = useState<string[]>(['Modern']);
  const [selectedFocus, setSelectedFocus] = useState<string[]>(['Technical Skills']);
  const [keywords, setKeywords] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [aiNotes, setAiNotes] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('presets');

  const { toast } = useToast();

  const handleToneToggle = (toneId: string) => {
    setSelectedTone(prev =>
      prev.includes(toneId)
        ? prev.filter(id => id !== toneId)
        : [...prev, toneId]
    );
  };

  const handleFocusToggle = (focusId: string) => {
    setSelectedFocus(prev =>
      prev.includes(focusId)
        ? prev.filter(id => id !== focusId)
        : [...prev, focusId]
    );
  };

  const performEnhancement = async (params: Partial<EnhancementRequest>) => {
    setIsEnhancing(true);
    setSelectedIndex(null);
    setVariants([]);
    setAiNotes(null);

    try {
      let originalText = "";

      const getSectionData = (key: string) => {
        const data = resumeData[key];
        if (targetItemIndex !== null && Array.isArray(data)) {
          const item = data[targetItemIndex];
          if (targetField && typeof item === 'object') return item[targetField] || "";
          return typeof item === 'string' ? item : JSON.stringify(item);
        }
        return typeof data === 'string' ? data : JSON.stringify(data);
      };

      if (step?.startsWith('custom:')) {
        const sectionId = step.replace('custom:', '');
        const section = resumeData.customSections?.find((s: any) => s.id === sectionId);
        if (section && targetItemIndex !== null) {
          const entry = section.entries[targetItemIndex];
          if (targetField) originalText = entry.values[targetField] || "";
          else originalText = JSON.stringify(entry.values);
        } else {
          originalText = JSON.stringify(section);
        }
      } else if (step === 'skills' && targetField) {
        // Handle specific skill categories
        const skillsObj = resumeData.skills || {};
        const items = skillsObj[targetField] || [];
        originalText = Array.isArray(items) ? items.join(', ') : JSON.stringify(items);
      } else {
        originalText = getSectionData(step || 'summary');
      }

      const request: EnhancementRequest = {
        section_type: (step?.startsWith('custom:') ? 'experience' : step || 'summary') as any,
        original_text: originalText,
        industry_keywords: keywords,
        restrictions: restrictions,
        ...params
      };

      const result = await resumeAI.enhanceSection(request);

      if (!result.variants || result.variants.length === 0) {
        toast({
          title: "AI Response Unavailable",
          description: result.notes || "We couldn't generate any improvements at this time. Please check your API key settings or try again later.",
          variant: "destructive"
        });
        setVariants([]);
      } else {
        setVariants(result.variants);
        setAiNotes(result.notes || null);
        setSelectedIndex(0);
      }
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

  const handleApplyVariant = () => {
    if (selectedIndex === null) return;

    const selectedText = variants[selectedIndex];
    const newData = { ...resumeData };

    const safeUpdateSection = (key: string, value: string, isArray: boolean) => {
      try {
        if (targetItemIndex !== null && Array.isArray(newData[key])) {
          const arr = [...newData[key]];
          const item = { ...arr[targetItemIndex] };
          if (targetField) item[targetField] = value;
          else if (typeof item === 'string') arr[targetItemIndex] = value;
          else Object.assign(item, JSON.parse(value));
          arr[targetItemIndex] = item;
          newData[key] = arr;
          return true;
        }

        if (isArray && (value.startsWith('[') || value.startsWith('{'))) {
          newData[key] = JSON.parse(value);
          return true;
        } else if (!isArray) {
          newData[key] = value;
          return true;
        }
      } catch (e) {
        console.error(`Failed to parse AI response for ${key}:`, e);
      }
      return false;
    };

    let success = false;
    if (step?.startsWith('custom:')) {
      const sectionId = step.replace('custom:', '');
      const sections = [...(resumeData.customSections || [])];
      const sIndex = sections.findIndex(s => s.id === sectionId);
      if (sIndex !== -1 && targetItemIndex !== null) {
        const section = { ...sections[sIndex] };
        const entries = [...section.entries];
        const entry = { ...entries[targetItemIndex] };
        if (targetField) {
          entry.values = { ...entry.values, [targetField]: selectedText };
        } else {
          try {
            entry.values = JSON.parse(selectedText);
          } catch {
            // Fallback if AI didn't return JSON
          }
        }
        entries[targetItemIndex] = entry;
        section.entries = entries;
        sections[sIndex] = section;
        newData.customSections = sections;
        success = true;
      }
    } else if (step === 'summary') {
      newData.summary = selectedText;
      success = true;
    } else if (step === 'experience') {
      success = safeUpdateSection('experience', selectedText, true);
    } else if (step === 'skills') {
      if (targetField) {
        // targetField is the category name (languages, frameworks, tools)
        const skillsObj = { ...(resumeData.skills || {}) };
        try {
          // AI might return a JSON array or a comma-separated string
          if (selectedText.startsWith('[') || selectedText.startsWith('{')) {
            skillsObj[targetField] = JSON.parse(selectedText);
          } else {
            skillsObj[targetField] = selectedText.split(',').map(s => s.trim()).filter(Boolean);
          }
          newData.skills = skillsObj;
          success = true;
        } catch (e) {
          console.error("Failed to parse AI skills:", e);
          // Fallback: treat as comma separated
          skillsObj[targetField] = selectedText.split(',').map(s => s.trim()).filter(Boolean);
          newData.skills = skillsObj;
          success = true;
        }
      } else {
        success = safeUpdateSection('skills', selectedText, true);
      }
    } else if (step === 'projects') {
      success = safeUpdateSection('projects', selectedText, true);
    } else if (step === 'education') {
      success = safeUpdateSection('education', selectedText, true);
    } else if (step === 'achievements') {
      success = safeUpdateSection('achievements', selectedText, true);
    } else if (step === 'certifications') {
      success = safeUpdateSection('certifications', selectedText, true);
    }

    if (success) {
      onEnhance(newData);
      onOpenChange(false);
      setVariants([]);
      setSelectedIndex(null);
    } else {
      toast({
        title: "Application Failed",
        description: "The AI response was not in the correct format for this section. Please try a different variant or preset.",
        variant: "destructive"
      });
    }
  };

  const renderVariants = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Choose a Variation
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setVariants([]); setSelectedIndex(null); }}
          className="text-muted-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Different Settings
        </Button>
      </div>

      <div className="grid gap-4">
        {variants.map((variant, index) => (
          <Card
            key={index}
            className={cn(
              "p-4 cursor-pointer transition-all border-2",
              selectedIndex === index
                ? "border-primary bg-primary/5 shadow-md"
                : "hover:border-primary/30"
            )}
            onClick={() => setSelectedIndex(index)}
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={selectedIndex === index ? "default" : "outline"}>
                    Option {index + 1}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {variant}
                </p>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                selectedIndex === index ? "bg-primary border-primary" : "border-muted"
              )}>
                {selectedIndex === index && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {aiNotes && (
        <Alert className="bg-muted/50 border-none">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs italic">
            AI Note: {aiNotes}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => { setVariants([]); setSelectedIndex(null); }}>
          Back
        </Button>
        <Button onClick={handleApplyVariant} className="px-8">
          Apply Selected Version
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border-border shadow-xl">
        <DialogHeader className="pb-6 border-b space-y-3">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              AI Resume Enhancement
              {step && (
                <Badge variant="secondary" className="ml-3 font-normal capitalize">
                  {step}
                </Badge>
              )}
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground ml-15">
            Choose a strategy or customize your enhancement preferences
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          {isEnhancing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <Sparkles className="w-6 h-6 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <p className="text-lg font-medium animate-pulse">Crafting your professional story...</p>
              <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
            </div>
          ) : variants.length > 0 ? (
            renderVariants()
          ) : (
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="presets">Quick Presets</TabsTrigger>
                <TabsTrigger value="custom">Custom Strategy</TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="space-y-6 mt-0">
                <div className="grid gap-4">
                  {strategyPresets.map((preset) => (
                    <Card
                      key={preset.id}
                      className="p-5 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
                      onClick={() => performEnhancement({ quick_preset: preset.id as any })}
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold mb-1">{preset.name}</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {preset.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {preset.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-[10px] uppercase tracking-wider">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          className="ml-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Select
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-8 mt-0">
                <div className="grid gap-8">
                  {/* Tone Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-bold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Tone & Style
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {tonePresets.map((tone) => (
                        <Card
                          key={tone.id}
                          className={cn(
                            "p-3 cursor-pointer transition-all border-2",
                            selectedTone.includes(tone.id)
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/30'
                          )}
                          onClick={() => handleToneToggle(tone.id)}
                        >
                          <h4 className="font-semibold text-sm mb-1">{tone.label}</h4>
                          <p className="text-[10px] text-muted-foreground leading-tight">{tone.description}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div className="space-y-4">
                    <Label className="text-base font-bold flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Highlight Areas
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {focusAreas.map((area) => {
                        const Icon = area.icon;
                        const isSelected = selectedFocus.includes(area.id);
                        return (
                          <Card
                            key={area.id}
                            className={cn(
                              "p-3 cursor-pointer transition-all border-2",
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-primary/30'
                            )}
                            onClick={() => handleFocusToggle(area.id)}
                          >
                            <div className="flex flex-col items-center gap-2 text-center">
                              <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                              <span className="text-xs font-semibold">{area.label}</span>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="keywords" className="font-bold">Industry Keywords</Label>
                      <Textarea
                        id="keywords"
                        placeholder="React, Leadership, Agile..."
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="h-24 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restrictions" className="font-bold">Restrictions (Optional)</Label>
                      <Textarea
                        id="restrictions"
                        placeholder="Keep under 200 words, avoid 'synergy'..."
                        value={restrictions}
                        onChange={(e) => setRestrictions(e.target.value)}
                        className="h-24 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => performEnhancement({ tone_style: selectedTone, highlight_areas: selectedFocus })}
                      disabled={isEnhancing}
                      className="px-8 gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate Variants
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper to provide missing Alert components if not available
const Alert = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("flex items-start gap-3 p-4 rounded-lg bg-muted text-muted-foreground", className)}>
    {children}
  </div>
);

const AlertDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("text-xs", className)}>{children}</div>
);
