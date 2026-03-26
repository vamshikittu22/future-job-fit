import { Plus, Sparkles, Zap, Target, Shield, Check, Loader2, RefreshCw, Wand2, ListPlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { HelpCircle, Info } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { resumeAI, EnhancementResponse, EnhancementRequest } from "@/shared/api/resumeAI";
import { cn } from "@/shared/lib/utils";
import { FullPreviewModal } from '@/features/resume-builder/components/modals/FullPreviewModal';
import { AIConnectionModal } from '@/features/resume-builder/components/modals/AIConnectionModal';
import { INTEGRATION_MODES, type IntegrationMode, validateKeywordIntegration } from "@/shared/lib/keywordIntegration";

interface AIEnhanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: ResumeData;
  onEnhance: (enhancedData: ResumeData) => void;
  step?: 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'achievements' | 'certifications' | string | null;
  targetItemIndex?: number | null;
  targetField?: string | null;
  initialPrompt?: string | null;
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

// Component to highlight keywords in variant text
interface KeywordHighlighterProps {
  text: string;
  keywords: string[];
}

const KeywordHighlighter: React.FC<KeywordHighlighterProps> = ({ text, keywords }) => {
  if (!keywords.length) return <span>{text}</span>;

  // Create regex to match any of the keywords
  const escapedKeywords = keywords.map(k =>
    k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const pattern = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');

  // Split text by keywords and map with highlighting
  const parts = text.split(pattern);
  const matches = text.match(pattern) || [];

  return (
    <span>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {matches[i] && (
            <mark className="bg-green-200 dark:bg-green-900 px-0.5 rounded font-medium">
              {matches[i]}
            </mark>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

// Component to show keyword integration status
interface KeywordIntegrationStatusProps {
  variant: string;
  keywords: string[];
}

const KeywordIntegrationStatus: React.FC<KeywordIntegrationStatusProps> = ({ variant, keywords }) => {
  const keywordList = keywords.filter(k => k.trim());
  if (!keywordList.length) return null;

  const foundKeywords = keywordList.filter(k =>
    variant.toLowerCase().includes(k.toLowerCase())
  );

  const missingKeywords = keywordList.filter(k =>
    !variant.toLowerCase().includes(k.toLowerCase())
  );

  const validation = validateKeywordIntegration(variant, foundKeywords);

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        {foundKeywords.map(kw => (
          <Badge
            key={kw}
            variant="outline"
            className="bg-green-50 dark:bg-green-950 border-green-200 text-green-700 text-xs"
          >
            <Check className="w-3 h-3 mr-1" />
            {kw}
          </Badge>
        ))}
        {missingKeywords.map(kw => (
          <Badge
            key={kw}
            variant="outline"
            className="bg-red-50 dark:bg-red-950 border-red-200 text-red-700 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            {kw}
          </Badge>
        ))}
      </div>

      {!validation.valid && validation.issues.length > 0 && (
        <p className="text-xs text-amber-600">
          ⚠️ {validation.issues[0]}
        </p>
      )}
    </div>
  );
};

// Component to show keyword variant quality
const KeywordVariantQuality: React.FC<{ variant: string; keywords: string[] }> = ({
  variant, keywords
}) => {
  if (!keywords.length) return null;

  const foundCount = keywords.filter(k =>
    variant.toLowerCase().includes(k.toLowerCase())
  ).length;
  const percentage = Math.round((foundCount / keywords.length) * 100);

  let color = "bg-red-100 text-red-700 border-red-200";
  if (percentage >= 80) color = "bg-green-100 text-green-700 border-green-200";
  else if (percentage >= 50) color = "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <Badge variant="outline" className={cn("text-[10px]", color)}>
      {foundCount}/{keywords.length} keywords
    </Badge>
  );
};

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
  targetField = null,
  initialPrompt = null
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
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [integrationMode, setIntegrationMode] = useState<IntegrationMode>('smart');

  const { toast } = useToast();

  // Handle initial prompt pre-fill
  useEffect(() => {
    if (initialPrompt && open) {
      setRestrictions(initialPrompt);
      setCurrentTab('custom'); // Switch to custom tab
    }
  }, [initialPrompt, open]);

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
        const section = resumeData.customSections?.find((s: ResumeData['customSections'][number]) => s.id === sectionId);
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
      integration_mode: integrationMode,
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

const renderVariants = () => {
  const keywordList = keywords.split(/[,;|]/).map(k => k.trim()).filter(Boolean);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Choose a Variation
          </h3>
          {integrationMode === 'smart' && keywords && (
            <p className="text-xs text-muted-foreground mt-1">
              Keywords integrated via Smart Rewrite mode
            </p>
          )}
        </div>
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

      {/* Keyword Legend */}
      {keywordList.length > 0 && (
        <div className="flex items-center gap-3 text-xs bg-muted/50 p-2 rounded">
          <span className="text-muted-foreground">Keyword indicators:</span>
          <span className="flex items-center gap-1">
            <mark className="bg-green-200 dark:bg-green-900 px-1 rounded">keyword</mark>
            = integrated
          </span>
          <span className="flex items-center gap-1 text-amber-600">
            <X className="w-3 h-3" />
            = missing
          </span>
        </div>
      )}

      {/* Variants */}
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
                  {/* Quality indicator */}
                  {keywordList.length > 0 && (
                    <KeywordVariantQuality variant={variant} keywords={keywordList} />
                  )}
                </div>

                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  <KeywordHighlighter
                    text={variant}
                    keywords={keywordList.filter(k =>
                      variant.toLowerCase().includes(k.toLowerCase())
                    )}
                  />
                </p>

                {/* Keyword integration status */}
                <KeywordIntegrationStatus variant={variant} keywords={keywordList} />
              </div>

              {/* Selection indicator */}
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

      {/* AI Notes */}
      {aiNotes && (
        <Alert className="bg-muted/50 border-none">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs italic">
            AI Note: {aiNotes}
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
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
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border-border shadow-xl">
        <DialogHeader className="pb-6 border-b space-y-3">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 flex items-center gap-3">
              AI Resume Enhancement
              {resumeAI.isDemoMode ? (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  Demo Mode
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                  <Check className="w-3 h-3 mr-1" />
                  Live Connected
                </Badge>
              )}
              {step && (
                <Badge variant="secondary" className="font-normal capitalize">
                  {step}
                </Badge>
              )}
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground ml-15">
            Choose a strategy or customize your enhancement preferences
          </p>

          {resumeAI.isDemoMode && (
            <Alert className="bg-amber-50 border-amber-200 mt-4">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 text-xs font-bold">Limited "Demo Mode" Active</AlertTitle>
              <AlertDescription className="text-amber-700 text-[11px] leading-relaxed">
                You are currently using <strong>lexical templates</strong> instead of real AI.
                Connecting to Supabase and providing an API key unlocks GPT-4o powered context-aware improvements.
                <Button
                  variant="link"
                  className="h-auto p-0 ml-1 text-[11px] font-bold text-amber-800 underline decoration-amber-400"
                  onClick={() => setShowConnectionModal(true)}
                >
                  How to connect?
                </Button>
              </AlertDescription>
            </Alert>
          )}
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

        {/* Integration Mode Selection */}
        <div className="space-y-3 pt-4 border-t">
          <Label className="text-base font-bold flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            Keyword Integration Mode
          </Label>

          <RadioGroup
            value={integrationMode}
            onValueChange={(value) => setIntegrationMode(value as IntegrationMode)}
            className="grid gap-3"
          >
            {INTEGRATION_MODES.map((mode) => (
              <div key={mode.id} className="relative">
                <RadioGroupItem
                  value={mode.id}
                  id={mode.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={mode.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                    "hover:border-primary/30",
                    integrationMode === mode.id
                      ? "border-primary bg-primary/5"
                      : "border-muted",
                    mode.recommended && "ring-1 ring-primary/20"
                  )}
                >
                  <div className="mt-0.5">
                    {mode.id === 'smart' && <Sparkles className="w-5 h-5 text-primary" />}
                    {mode.id === 'suggest' && <Target className="w-5 h-5 text-blue-500" />}
                    {mode.id === 'append' && <ListPlus className="w-5 h-5 text-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{mode.label}</span>
                      {mode.recommended && (
                        <Badge variant="secondary" className="text-[10px]">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mode.description}
                    </p>
                  </div>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                    integrationMode === mode.id
                      ? "bg-primary border-primary"
                      : "border-muted"
                  )}>
                    {integrationMode === mode.id && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {integrationMode === 'append' && (
            <Alert className="bg-orange-50 border-orange-200">
              <Info className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-xs text-orange-700">
                Append mode may reduce readability. Consider Smart Rewrite for better ATS results.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => performEnhancement({ tone_style: selectedTone, highlight_areas: selectedFocus })}
                            disabled={isEnhancing}
                            className="px-8 gap-2 relative overflow-hidden group"
                          >
                            <Sparkles className="w-4 h-4" />
                            Generate Variants
                            {resumeAI.isDemoMode && (
                              <span className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {resumeAI.isDemoMode
                            ? "Generate improvements using demo templates (Offline)"
                            : `Enhance using ${resumeAI.currentProvider.toUpperCase()} (Live AI)`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <AIConnectionModal
          open={showConnectionModal}
          onOpenChange={setShowConnectionModal}
        />
      </DialogContent>
    </Dialog>
  );
}
