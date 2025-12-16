import React, { useState, useEffect } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Textarea } from '@/shared/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';

export const SummaryStep: React.FC = () => {
  const { resumeData, updateResumeData, setResumeData } = useResume();
  const [summary, setSummary] = useState(resumeData.summary || '');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);

  useEffect(() => {
    const words = summary.trim().split(/\s+/).filter(Boolean).length;
    const chars = summary.length;
    setWordCount(words);
    setCharCount(chars);
  }, [summary]);

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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle>Your Professional Summary</CardTitle>
                <CardDescription className="mt-1">
                  Aim for 100-150 words that capture your experience, skills, and career goals
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsAIEnhanceModalOpen(true)}
              >
                <Sparkles className="h-4 w-4" />
                Enhance with AI
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={examplePlaceholders[placeholderIndex]}
              className="min-h-[200px] resize-none"
              maxLength={800}
            />

            {/* Word and Character Counter */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className={cn('font-medium', getWordCountColor())}>
                  {wordCount} words
                  <span className="text-muted-foreground ml-1">(100-150 recommended)</span>
                </span>
                <span className={cn('font-medium', getCharCountColor())}>
                  {charCount}/800 characters
                </span>
              </div>
              {wordCount >= 100 && wordCount <= 150 && (
                <Badge variant="default" className="bg-green-500">
                  Optimal Length
                </Badge>
              )}
            </div>

            {/* Warnings */}
            {charCount > 800 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Your summary exceeds the maximum character limit. Please shorten it.
                </AlertDescription>
              </Alert>
            )}
            {wordCount > 0 && wordCount < 50 && (
              <Alert>
                <AlertDescription>
                  Your summary is quite short. Consider expanding it to 100-150 words for better impact.
                </AlertDescription>
              </Alert>
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
          }
        }}
        step="summary"
      />
    </WizardStepContainer>
  );
};
