import { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Lightbulb, ChevronRight, ChevronLeft, Info, Target, CheckCircle } from 'lucide-react';
import { StepGuideCard } from '@/features/resume-builder/components/helpers/StepGuideCard';
import { AIPromptCard } from '@/features/resume-builder/components/helpers/AIPromptCard';
import { CharacterGuidance } from '@/features/resume-builder/components/helpers/CharacterGuidance';
import { JDKeywordHints } from '@/features/resume-builder/components/helpers/JDKeywordHints';
import { JDMatchSnapshot } from '@/features/resume-builder/components/helpers/JDMatchSnapshot';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useJob } from '@/shared/contexts/JobContext';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';

interface HelperContent {
  stepId: string;
  title: string;
  description: string;
  tips: string[];
  aiPromptExamples?: string[];
  characterTarget?: [number, number];
}

interface WizardHelperRailProps {
  currentStepId: string;
  showCollapseButton?: boolean;
}

const STEP_HELPER_CONTENT: Record<string, HelperContent> = {
  template: {
    stepId: 'template',
    title: 'Choose Your Template',
    description: 'Template doesn\'t affect ATS parsing logic. Choose based on visual preference and industry norms. All templates are ATS-compatible and properly structured.',
    tips: [
      'Modern: Best for tech, creative, and startup roles',
      'Professional: Ideal for corporate, finance, and traditional industries',
      'Minimal: Clean design that highlights content over style',
      'Creative: Great for design, marketing, and portfolio-heavy roles',
      'You can change templates anytime without losing data'
    ]
  },
  personal: {
    stepId: 'personal',
    title: 'Personal Information',
    description: 'Complete all contact fields. Use professional email. LinkedIn URL optional but recommended. This information appears at the top of your resume and makes it easy for recruiters to contact you.',
    tips: [
      'Use a professional email address (avoid nicknames)',
      'Include area code with phone number',
      'LinkedIn URL should be your custom URL (linkedin.com/in/yourname)',
      'Optional: Add portfolio website or GitHub for tech roles',
      'Ensure all information is current and accurate'
    ]
  },
  summary: {
    stepId: 'summary',
    title: 'Professional Summary',
    description: 'Your elevator pitch. Focus on current/target role, years of experience, top skills, and value proposition. This is the first thing recruiters read after your name.',
    tips: [
      'Keep it to 3-4 lines (100-150 words)',
      'Start with your current or target role',
      'Quantify experience (e.g., "5+ years in...")',
      'Highlight 2-3 key skills relevant to the job',
      'End with unique value or specialization'
    ],
    aiPromptExamples: [
      "Make this ATS-friendly",
      "Add industry keywords",
      "Emphasize leadership",
      "Quantify achievements"
    ],
    characterTarget: [100, 150]
  },
  experience: {
    stepId: 'experience',
    title: 'Work Experience',
    description: 'Showcase achievements, not just responsibilities. Use PAR format: Problem → Action → Result. Focus on measurable impact and specific contributions to the organization.',
    tips: [
      'Use action verbs (Led, Implemented, Optimized, Architected)',
      'Quantify impact with numbers, %, or $ whenever possible',
      'Include 3-5 bullet points per role (most important achievements)',
      'List most recent experience first (reverse chronological)',
      'Focus on achievements, not daily duties'
    ],
    aiPromptExamples: [
      "Add quantified metrics",
      "ATS optimize this role",
      "Highlight technical skills",
      "Emphasize leadership"
    ],
    characterTarget: [3, 5]
  },
  education: {
    stepId: 'education',
    title: 'Education',
    description: 'Degree, institution, year. GPA if >3.5. Relevant coursework if early career. Keep this section concise unless you\'re a recent graduate with limited work experience.',
    tips: [
      'List degree, major, institution, and graduation year',
      'Include GPA only if above 3.5 (or 3.7 for competitive fields)',
      'Add relevant coursework if early career (<2 years experience)',
      'Include honors, awards, or scholarships if notable',
      'Most recent education first'
    ]
  },
  skills: {
    stepId: 'skills',
    title: 'Skills',
    description: 'Organize skills by category (Technical, Tools, Soft Skills). Match job description keywords. This section is critical for ATS keyword matching and recruiter screening.',
    tips: [
      'Group by category for easy scanning (Technical, Languages, Tools)',
      'Include both hard and soft skills',
      'Match keywords from job descriptions you\'re targeting',
      'Be specific (e.g., "React 18" vs "JavaScript")',
      'List proficiency level if relevant (Expert, Proficient, Familiar)'
    ]
  },
  projects: {
    stepId: 'projects',
    title: 'Projects',
    description: 'Showcase technical depth. Include tech stack, your role, impact. Projects demonstrate practical skills and initiative, especially valuable for technical roles and career changers.',
    tips: [
      'Include project name, duration, and brief description',
      'Highlight tech stack and tools used',
      'Specify your role (solo project, team lead, contributor)',
      'Quantify impact (users, performance gains, revenue)',
      'Link to live demo or GitHub repo if available'
    ],
    aiPromptExamples: [
      "Turn into impact bullets",
      "Emphasize outcomes",
      "Highlight tech stack"
    ]
  },
  achievements: {
    stepId: 'achievements',
    title: 'Achievements',
    description: 'Quantified outcomes. Example: "Increased X by Y%". Recognition, awards, and measurable accomplishments that demonstrate exceptional performance.',
    tips: [
      'Use numbers and percentages to quantify impact',
      'Include company awards, performance recognitions',
      'Highlight competition wins or industry recognition',
      'Keep each achievement to 1-2 lines',
      'Focus on results, not just participation'
    ]
  },
  certifications: {
    stepId: 'certifications',
    title: 'Certifications',
    description: 'Only relevant, recent entries. Include certification name, issuing organization, and date. Focus on industry-recognized certifications that validate your expertise.',
    tips: [
      'List only relevant certifications for your target role',
      'Include issuing organization and date obtained',
      'Add expiration date if applicable',
      'Prioritize industry-standard certifications (AWS, PMP, etc.)',
      'Remove outdated or expired certifications'
    ]
  },
  review: {
    stepId: 'review',
    title: 'Review & Export',
    description: 'Final checks: ATS score >70%, all required fields complete, consistent formatting. Run a final review before exporting to ensure your resume is polished and ready.',
    tips: [
      'Run ATS analysis and aim for score >70%',
      'Check for spelling and grammar errors',
      'Ensure consistent date formatting throughout',
      'Verify all contact information is accurate',
      'Export in PDF format for best compatibility'
    ]
  }
};

export const WizardHelperRail: React.FC<WizardHelperRailProps> = ({ currentStepId, showCollapseButton = true }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('wizard-helper-rail-collapsed');
    return saved !== 'true'; // Default to expanded (true)
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [aiModalPrompt, setAiModalPrompt] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  const { resumeData, setResumeData } = useResume();
  const { currentJob } = useJob();
  
  // Check if JD is linked
  const hasLinkedJD = !!currentJob && !!currentJob.title;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wizard-helper-rail-collapsed', String(!isExpanded));
  }, [isExpanded]);

  const content = STEP_HELPER_CONTENT[currentStepId] || STEP_HELPER_CONTENT.personal;

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const handleAIPromptClick = (prompt: string) => {
    setAiModalPrompt(prompt);
    setIsAIModalOpen(true);
  };

  const handleAIEnhance = (enhancedData: any) => {
    setResumeData(enhancedData);
    setIsAIModalOpen(false);
  };

  const getSectionTypeFromStepId = (stepId: string): string => {
    // Map step IDs to section types for AIEnhanceModal
    const mapping: Record<string, string> = {
      summary: 'summary',
      experience: 'experience',
      education: 'education',
      skills: 'skills',
      projects: 'projects',
      achievements: 'achievements',
      certifications: 'certifications'
    };
    return mapping[stepId] || 'summary';
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with toggle */}
      <div className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold">Step Guide</span>
        </div>
        {showCollapseButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="h-8 w-8"
            title={isExpanded ? 'Collapse helper rail' : 'Expand helper rail'}
          >
            {isExpanded ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Content area with collapse animation */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              >
                <ScrollArea className="h-[calc(100vh-3.5rem)]">
                  <div className="p-4 space-y-4">
                    {/* "What this does" card */}
                    <StepGuideCard
                      icon={Info}
                      iconColor="text-blue-600"
                      iconBgColor="bg-blue-100 dark:bg-blue-900"
                      title="What this section does"
                      content={content.description}
                    />

                    {/* "How to make it strong" card */}
                    <StepGuideCard
                      icon={Target}
                      iconColor="text-green-600"
                      iconBgColor="bg-green-100 dark:bg-green-900"
                      title="How to make it strong"
                      content={
                        <ul className="space-y-1.5">
                          {content.tips.map((tip, idx) => (
                            <li key={idx} className="flex gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      }
                    />

                    {/* AI Quick Actions for relevant steps */}
                    {content.aiPromptExamples && (
                      <AIPromptCard
                        examples={content.aiPromptExamples}
                        onApply={handleAIPromptClick}
                      />
                    )}

                    {/* Character Guidance for Summary step */}
                    {currentStepId === 'summary' && resumeData.summary && (
                      <CharacterGuidance
                        currentLength={resumeData.summary.split(/\s+/).filter(w => w).length}
                        targetRange={[100, 150]}
                        unit="words"
                        guidanceText="3-4 lines, 100-150 words. Focus on value proposition."
                      />
                    )}

                    {/* Character Guidance for Experience step */}
                    {currentStepId === 'experience' && resumeData.experience && resumeData.experience.length > 0 && (
                      <CharacterGuidance
                        currentLength={resumeData.experience[0]?.description?.split('\n').filter(b => b.trim()).length || 0}
                        targetRange={[3, 5]}
                        unit="bullets"
                        guidanceText="3-5 bullet points per role. Start with action verbs."
                      />
                    )}

                    {/* JD Keyword Hints for Summary, Experience, Skills steps */}
                    {hasLinkedJD && ['summary', 'experience', 'skills'].includes(currentStepId) && (
                      <JDKeywordHints currentSection={currentStepId as any} />
                    )}

                    {/* JD Match Snapshot for Review step */}
                    {currentStepId === 'review' && hasLinkedJD && (
                      <JDMatchSnapshot />
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* AI Enhance Modal */}
      <AIEnhanceModal
        open={isAIModalOpen}
        onOpenChange={setIsAIModalOpen}
        resumeData={resumeData}
        onEnhance={handleAIEnhance}
        initialPrompt={aiModalPrompt}
        step={getSectionTypeFromStepId(currentStepId)}
      />
    </div>
  );
};
