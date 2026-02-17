import React, { useState, useEffect } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Textarea } from '@/shared/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Sparkles, Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';
import { AIEnhanceButton } from '@/shared/ui/ai-enhance-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { InlineRecommendations } from '@/features/resume-builder/components/ats';

export const SummaryStep: React.FC = () => {
  const { resumeData, updateResumeData, setResumeData } = useResume();
  const [summary, setSummary] = useState(resumeData.summary || '');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    // Sync word/char counts
    const words = summary.trim().split(/\s+/).filter(Boolean).length;
    const chars = summary.length;
    setWordCount(words);
    setCharCount(chars);
  }, [summary]);

  // Sync with global state when it changes externally (e.g. loading sample data)
  useEffect(() => {
    if (resumeData.summary && resumeData.summary !== summary) {
      setSummary(resumeData.summary);
      // We don't reset isEnhanced here to allow "Load Sample" to potentially show enhancement if we wanted, 
      // but typically loading external data resets local edit state. 
      // For now, let's keep it simple: if external data loads, it's not "just enhanced" by this user session's button.
      setIsEnhanced(false);
    }
  }, [resumeData.summary]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateResumeData('summary', summary);
    }, 500);
    return () => clearTimeout(timer);
  }, [summary, updateResumeData]);

  const getWordCountColor = () => {
    if (wordCount >= 100 && wordCount <= 150) return 'text-green-500';
    if (wordCount > 0) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  const getCharCountColor = () => {
    if (charCount > 800) return 'text-red-500';
    if (charCount > 700) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  const examplePlaceholders = [
    "Results-driven software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact solutions that increased user engagement by 40%. Passionate about clean code, performance optimization, and mentoring junior developers.",
    "Creative marketing professional specializing in digital campaigns and brand strategy with 7+ years of experience. Successfully managed $2M+ in ad spend, achieving 150% ROI across multiple channels. Expert in SEO, content marketing, and data-driven decision making. Committed to building authentic brand narratives that resonate with target audiences.",
    "Experienced financial analyst with expertise in data modeling, forecasting, and strategic planning. 6+ years analyzing complex financial data to drive business decisions for Fortune 500 companies. Proficient in SQL, Python, and advanced Excel. Known for translating technical insights into actionable recommendations for executive leadership.",
  ];

  const [placeholderIndex] = useState(Math.floor(Math.random() * examplePlaceholders.length));

  return (
    <WizardStepContainer
      title="Professional Summary"
      description="Write a compelling summary that highlights your experience and value proposition"
    >
      <ProgressStepper />

      {/* ATS Inline Recommendations */}
      <InlineRecommendations section="summary" className="mb-4" />

      <div className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">Your Professional Summary</CardTitle>
                <CardDescription className="mt-2 text-sm">
                  Aim for 100-150 words that capture your experience, skills, and career goals
                </CardDescription>
              </div>
              <AIEnhanceButton
                className="ml-4"
                onClick={() => setIsAIEnhanceModalOpen(true)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setIsEnhanced(false);
              }}
              placeholder={examplePlaceholders[placeholderIndex]}
              className={cn(
                "min-h-[220px] resize-none text-base leading-relaxed transition-colors duration-200",
                wordCount >= 100 && wordCount <= 150 && "border-green-500 focus-visible:ring-green-500/30",
                wordCount > 0 && wordCount < 50 && "border-amber-500 focus-visible:ring-amber-500/30",
                charCount > 800 && "border-destructive focus-visible:ring-destructive/30"
              )}
              maxLength={800}
            />

            {/* Word and Character Counter */}
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <div className="flex items-center gap-6">
                <span className={cn('font-medium', getWordCountColor())}>
                  {wordCount} words
                  <span className="text-muted-foreground ml-1 font-normal">(100-150 recommended)</span>
                </span>
                <span className={cn('font-medium', getCharCountColor())}>
                  {charCount}/800 characters
                </span>
              </div>
              {wordCount >= 100 && wordCount <= 150 && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  ✓ Optimal Length
                </Badge>
              )}
            </div>

            {/* Warnings */}
            {charCount > 800 && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                <AlertDescription>
                  Your summary exceeds the maximum character limit. Please shorten it.
                </AlertDescription>
              </Alert>
            )}
            {wordCount > 0 && wordCount < 50 && (
              <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  Your summary is quite short. Consider expanding it to 100-150 words for better impact.
                </AlertDescription>
              </Alert>
            )}

            {isEnhanced && (
              <div className="flex items-center gap-2 text-sm text-primary font-medium animate-in fade-in slide-in-from-top-1 bg-primary/5 rounded-md px-3 py-2">
                <Sparkles className="w-4 h-4" />
                Enhanced with AI
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tips">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>Tips for a Great Summary</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Include 2-3 key skills or specializations</strong> that are relevant to your target role
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Mention years of experience</strong> to establish credibility
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Highlight 1-2 major achievements with metrics</strong> (e.g., "increased revenue by 30%")
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Use industry-relevant keywords</strong> that match job descriptions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Avoid first-person pronouns</strong> (I, me, my) - write in third person or implied first person
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Skip clichés and buzzwords</strong> like "team player," "hard worker," "go-getter"
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <AIEnhanceModal
        open={isAIEnhanceModalOpen}
        onOpenChange={setIsAIEnhanceModalOpen}
        resumeData={resumeData}
        onEnhance={(enhancedData) => {
          setResumeData(enhancedData);
          if (enhancedData.summary) {
            setSummary(enhancedData.summary);
            setIsEnhanced(true);
          }
        }}
        step="summary"
      />
    </WizardStepContainer>
  );
};
