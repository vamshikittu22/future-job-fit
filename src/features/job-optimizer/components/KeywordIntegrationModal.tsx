import { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
    Sparkles,
    Check,
    ArrowLeft,
    Loader2,
    ChevronRight,
    Edit3,
    Target,
    Plus,
    PenLine,
    Briefcase,
    FolderKanban,
    Building2,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/shared/hooks/use-toast";
import { resumeAI } from "@/shared/api/resumeAI";

interface KeywordIntegrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    keyword: string;
    resumeText: string;
    onApply: (updatedResume: string) => void;
    allMissingKeywords?: string[]; // All missing keywords for multi-select
}

interface ParsedBullet {
    text: string;
    lineIndex: number;
}

interface ExperienceItem {
    title: string;           // Company or Project name
    subtitle?: string;       // Role or dates
    lineIndex: number;       // Line where this experience starts
    sectionType: 'experience' | 'projects';
    bullets: ParsedBullet[];
}

// Patterns for detecting section headers
const EXPERIENCE_PATTERNS = /^(experience|work\s*history|employment|professional\s*experience|work\s*experience)/i;
const PROJECTS_PATTERNS = /^(projects|personal\s*projects|key\s*projects|selected\s*projects)/i;
const SKIP_SECTIONS = /^(skills|education|certifications|summary|objective|contact|interests|languages|references|awards|honors)/i;

export default function KeywordIntegrationModal({
    open,
    onOpenChange,
    keyword,
    resumeText,
    onApply,
    allMissingKeywords = [],
}: KeywordIntegrationModalProps) {
    // Steps: 1 = Choose experience, 2 = Choose action, 3 = Edit/Create
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null);
    const [action, setAction] = useState<'enhance' | 'new'>('enhance');
    const [selectedBullet, setSelectedBullet] = useState<ParsedBullet | null>(null);
    const [editedText, setEditedText] = useState("");
    const [newBulletText, setNewBulletText] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([keyword]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Parse resume into experience items with their bullets
    const experiences = useMemo(() => {
        if (!resumeText) return [];

        const lines = resumeText.split('\n');
        const items: ExperienceItem[] = [];
        let currentSectionType: 'experience' | 'projects' | null = null;
        let currentItem: ExperienceItem | null = null;
        let inSkippedSection = false;

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Detect section headers
            const isHeader = trimmed.match(/^[A-Z][A-Z\s]+$/) ||
                trimmed.match(/^[A-Z][A-Za-z\s]+:$/);

            if (isHeader) {
                const sectionName = trimmed.replace(/:$/, '').trim();

                if (SKIP_SECTIONS.test(sectionName)) {
                    inSkippedSection = true;
                    currentSectionType = null;
                    currentItem = null;
                    return;
                }

                inSkippedSection = false;

                if (EXPERIENCE_PATTERNS.test(sectionName)) {
                    currentSectionType = 'experience';
                    currentItem = null;
                } else if (PROJECTS_PATTERNS.test(sectionName)) {
                    currentSectionType = 'projects';
                    currentItem = null;
                } else {
                    currentSectionType = null;
                    currentItem = null;
                }
                return;
            }

            if (inSkippedSection || !currentSectionType) return;

            // Detect company/project title lines
            // These typically: don't start with bullet, contain company-role pattern or dates
            const isBullet = trimmed.match(/^[•\-\*]\s/);
            const hasDatePattern = trimmed.match(/\d{4}/) ||
                trimmed.match(/present/i) ||
                trimmed.match(/current/i);
            const hasDash = trimmed.includes(' - ') || trimmed.includes(' – ');

            if (!isBullet && (hasDatePattern || hasDash) && trimmed.length < 120) {
                // This is a company/project title line
                const parts = trimmed.split(/\s*[-–]\s*/);
                const title = parts[0].trim();
                const subtitle = parts.slice(1).join(' - ').trim();

                currentItem = {
                    title,
                    subtitle: subtitle || undefined,
                    lineIndex: index,
                    sectionType: currentSectionType,
                    bullets: []
                };
                items.push(currentItem);
                return;
            }

            // Detect bullet points
            if (currentItem && isBullet) {
                const bulletText = trimmed.replace(/^[•\-\*]\s*/, '');
                if (bulletText.length > 20) {
                    currentItem.bullets.push({
                        text: bulletText,
                        lineIndex: index
                    });
                }
            }
        });

        return items.filter(item => item.title && item.title.length > 2);
    }, [resumeText]);

    // Get available keywords for selection (excluding already selected)
    const availableKeywords = useMemo(() => {
        return allMissingKeywords.filter(k => !selectedKeywords.includes(k));
    }, [allMissingKeywords, selectedKeywords]);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setStep(1);
            setSelectedExperience(null);
            setAction('enhance');
            setSelectedBullet(null);
            setEditedText("");
            setNewBulletText("");
            setSelectedKeywords([keyword]);
        }
    }, [open, keyword]);

    const handleSelectExperience = (exp: ExperienceItem) => {
        setSelectedExperience(exp);
        setStep(2);
    };

    const handleSelectAction = (selectedAction: 'enhance' | 'new') => {
        setAction(selectedAction);
        setStep(3);
        if (selectedAction === 'new') {
            setNewBulletText("");
        }
    };

    const handleSelectBullet = (bullet: ParsedBullet) => {
        setSelectedBullet(bullet);
        setEditedText(bullet.text);
    };

    const toggleKeyword = (kw: string) => {
        if (selectedKeywords.includes(kw)) {
            // Don't allow removing the primary keyword
            if (kw === keyword) return;
            setSelectedKeywords(prev => prev.filter(k => k !== kw));
        } else if (selectedKeywords.length < 3) {
            setSelectedKeywords(prev => [...prev, kw]);
        } else {
            toast({
                title: "Maximum 3 keywords",
                description: "You can select up to 3 keywords per bullet point.",
                variant: "destructive"
            });
        }
    };

    // Smart bullet point templates with quantitative/qualitative patterns
    const generateSmartBullet = (keywords: string[], experienceTitle?: string): string => {
        const actionVerbs = [
            "Spearheaded", "Architected", "Implemented", "Developed", "Led",
            "Designed", "Engineered", "Optimized", "Delivered", "Built"
        ];
        const metrics = [
            "reducing processing time by 40%",
            "improving system performance by 35%",
            "increasing team productivity by 25%",
            "achieving 99.9% uptime",
            "serving 50K+ daily active users",
            "reducing deployment time from 2 hours to 15 minutes",
            "cutting operational costs by $150K annually",
            "accelerating feature delivery by 3x"
        ];
        const outcomes = [
            "resulting in faster time-to-market",
            "enabling seamless cross-team collaboration",
            "driving significant business impact",
            "establishing best practices adopted company-wide"
        ];

        const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

        // Smart keyword integration - don't repeat, use natural language
        if (keywords.length === 1) {
            const kw = keywords[0];
            const templates = [
                `${verb} ${kw} implementation across the platform, ${metric}`,
                `${verb} scalable solutions leveraging ${kw}, ${metric}`,
                `Led adoption of ${kw} practices, ${outcome}`,
                `Designed and implemented ${kw} architecture, ${metric}`,
                `${verb} end-to-end ${kw} workflows, ${metric}`
            ];
            return templates[Math.floor(Math.random() * templates.length)];
        } else if (keywords.length === 2) {
            const [kw1, kw2] = keywords;
            const templates = [
                `${verb} ${kw1} and ${kw2} integration, ${metric}`,
                `Led ${kw1} initiatives while implementing ${kw2} best practices, ${outcome}`,
                `Designed ${kw1} solutions with ${kw2}, ${metric}`,
                `${verb} platform features using ${kw1} and ${kw2}, ${metric}`
            ];
            return templates[Math.floor(Math.random() * templates.length)];
        } else {
            // 3 keywords - be creative and natural
            const [kw1, kw2, kw3] = keywords;
            const templates = [
                `${verb} ${kw1} architecture with ${kw2} and ${kw3}, ${metric}`,
                `Led cross-functional initiative combining ${kw1}, ${kw2}, and ${kw3}, ${outcome}`,
                `Designed ${kw1} solutions integrating ${kw2} and ${kw3} patterns, ${metric}`,
                `${verb} end-to-end workflows leveraging ${kw1}, ${kw2}, and ${kw3}, ${metric}`
            ];
            return templates[Math.floor(Math.random() * templates.length)];
        }
    };

    // Enhance existing bullet with keywords naturally
    const enhanceBulletWithKeywords = (originalBullet: string, keywords: string[]): string => {
        // If bullet already has metrics, just add keywords contextually
        const hasMetrics = /\d+%|\$\d+|(?:\d+[KMB]?\+?)/.test(originalBullet);

        // Add keywords naturally based on bullet structure
        let enhanced = originalBullet.trim();

        // Remove trailing period if present
        if (enhanced.endsWith('.')) {
            enhanced = enhanced.slice(0, -1);
        }

        // Smart additions based on keyword count
        if (keywords.length === 1) {
            if (!hasMetrics) {
                enhanced += `, leveraging ${keywords[0]} to improve efficiency by 30%`;
            } else {
                enhanced += `, utilizing ${keywords[0]} best practices`;
            }
        } else if (keywords.length === 2) {
            if (!hasMetrics) {
                enhanced += `, integrating ${keywords[0]} and ${keywords[1]} to reduce development time by 25%`;
            } else {
                enhanced += `, applying ${keywords[0]} and ${keywords[1]} methodologies`;
            }
        } else {
            const kwList = keywords.slice(0, -1).join(', ') + ` and ${keywords[keywords.length - 1]}`;
            if (!hasMetrics) {
                enhanced += `, combining ${kwList} for 40% performance improvement`;
            } else {
                enhanced += `, incorporating ${kwList}`;
            }
        }

        return enhanced;
    };

    const handleAISuggest = async () => {
        setIsLoading(true);
        try {
            if (action === 'enhance' && selectedBullet) {
                // Create a better prompt for enhancing
                const prompt = `Rewrite this resume bullet point to naturally incorporate these keywords: ${selectedKeywords.join(', ')}. 
                
Original bullet: "${selectedBullet.text}"

Rules:
- Keep the core achievement intact
- Add quantitative metrics if missing (%, numbers, scale)
- Don't repeat keywords
- Use strong action verbs
- Keep it concise (1-2 lines max)
- Make it sound natural, not forced`;

                const result = await resumeAI.rewriteBulletWithKeyword({
                    originalBullet: selectedBullet.text,
                    keyword: selectedKeywords.join(', '),
                    context: prompt
                });
                setEditedText(result.rewrittenBullet);
            } else if (action === 'new') {
                // Create a better prompt for new bullets
                const prompt = `Generate a strong resume bullet point for a ${selectedExperience?.sectionType || 'professional'} role at "${selectedExperience?.title || 'a company'}" that includes: ${selectedKeywords.join(', ')}.

Rules:
- Start with a strong action verb (Led, Architected, Designed, Implemented, etc.)
- Include quantitative impact (%, $, numbers, scale)
- Don't just list the keywords - weave them into an achievement
- Make it specific and impressive
- One sentence, 15-25 words`;

                const result = await resumeAI.rewriteBulletWithKeyword({
                    originalBullet: generateSmartBullet(selectedKeywords, selectedExperience?.title),
                    keyword: selectedKeywords.join(', '),
                    context: prompt
                });
                setNewBulletText(result.rewrittenBullet);
            }

            toast({
                title: "AI Suggestion Ready",
                description: `Enhanced with ${selectedKeywords.length} keyword(s)`,
            });
        } catch (error) {
            console.error("AI suggestion failed:", error);

            // Use smart fallback templates
            if (action === 'enhance' && selectedBullet) {
                setEditedText(enhanceBulletWithKeywords(selectedBullet.text, selectedKeywords));
            } else {
                setNewBulletText(generateSmartBullet(selectedKeywords, selectedExperience?.title));
            }

            toast({
                title: "Smart Template Applied",
                description: "Edit the suggestion to match your experience",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (!selectedExperience) return;

        const lines = resumeText.split('\n');

        if (action === 'enhance' && selectedBullet && editedText.trim()) {
            // Update existing bullet
            const originalLine = lines[selectedBullet.lineIndex];
            const bulletPrefix = originalLine.match(/^(\s*[•\-\*]\s*)/)?.[1] || '• ';
            lines[selectedBullet.lineIndex] = bulletPrefix + editedText;
        } else if (action === 'new' && newBulletText.trim()) {
            // Add new bullet after the last bullet of this experience
            let insertIndex: number;
            if (selectedExperience.bullets.length > 0) {
                const lastBullet = selectedExperience.bullets[selectedExperience.bullets.length - 1];
                insertIndex = lastBullet.lineIndex + 1;
            } else {
                // No bullets yet, insert after the title
                insertIndex = selectedExperience.lineIndex + 1;
            }

            // Get bullet prefix from existing bullets or default
            let bulletPrefix = '• ';
            if (selectedExperience.bullets.length > 0) {
                const sampleLine = lines[selectedExperience.bullets[0].lineIndex];
                bulletPrefix = sampleLine.match(/^(\s*[•\-\*]\s*)/)?.[1] || '• ';
            }

            lines.splice(insertIndex, 0, bulletPrefix + newBulletText);
        }

        const updatedResume = lines.join('\n');
        onApply(updatedResume);

        toast({
            title: action === 'enhance' ? "Bullet Updated" : "New Bullet Added",
            description: `Added ${selectedKeywords.length} keyword(s) to ${selectedExperience.title}`,
        });

        onOpenChange(false);
    };

    const handleBack = () => {
        if (step === 3) {
            setStep(2);
            setSelectedBullet(null);
            setEditedText("");
        } else if (step === 2) {
            setStep(1);
            setSelectedExperience(null);
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Select Experience";
            case 2: return selectedExperience?.title || "Choose Action";
            case 3: return action === 'enhance' ? "Enhance Bullet" : "Add New Bullet";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-accent" />
                        {getStepTitle()}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 flex-wrap">
                        Adding:
                        {selectedKeywords.map(kw => (
                            <Badge key={kw} variant="secondary" className="mx-0.5">
                                {kw}
                                {kw !== keyword && (
                                    <X
                                        className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive"
                                        onClick={() => toggleKeyword(kw)}
                                    />
                                )}
                            </Badge>
                        ))}
                        {selectedKeywords.length < 3 && step !== 1 && (
                            <span className="text-xs text-muted-foreground ml-1">
                                (+{3 - selectedKeywords.length} more available)
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2 px-1">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-accent' : 'bg-muted'
                                }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Choose Experience */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-1 overflow-hidden flex flex-col"
                        >
                            <p className="text-sm text-muted-foreground mb-3">
                                Choose which experience or project to add the keyword to:
                            </p>
                            <ScrollArea className="flex-1">
                                <div className="space-y-3 pr-4">
                                    {experiences.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                            <p className="font-medium">No experiences detected</p>
                                            <p className="text-sm mt-2">
                                                Make sure your resume has Experience or Projects sections.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Experience Items */}
                                            {experiences.filter(e => e.sectionType === 'experience').length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                                                        <Briefcase className="w-4 h-4" />
                                                        Work Experience
                                                    </div>
                                                    {experiences.filter(e => e.sectionType === 'experience').map((exp, idx) => (
                                                        <Card
                                                            key={idx}
                                                            className="p-4 cursor-pointer hover:bg-muted/50 hover:border-accent transition-all group"
                                                            onClick={() => handleSelectExperience(exp)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium">{exp.title}</div>
                                                                    {exp.subtitle && (
                                                                        <div className="text-sm text-muted-foreground">{exp.subtitle}</div>
                                                                    )}
                                                                    <div className="text-xs text-muted-foreground mt-1">
                                                                        {exp.bullets.length} bullet points
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Project Items */}
                                            {experiences.filter(e => e.sectionType === 'projects').length > 0 && (
                                                <div className="space-y-2 mt-4">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                                                        <FolderKanban className="w-4 h-4" />
                                                        Projects
                                                    </div>
                                                    {experiences.filter(e => e.sectionType === 'projects').map((exp, idx) => (
                                                        <Card
                                                            key={idx}
                                                            className="p-4 cursor-pointer hover:bg-muted/50 hover:border-accent transition-all group"
                                                            onClick={() => handleSelectExperience(exp)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium">{exp.title}</div>
                                                                    {exp.subtitle && (
                                                                        <div className="text-sm text-muted-foreground">{exp.subtitle}</div>
                                                                    )}
                                                                    <div className="text-xs text-muted-foreground mt-1">
                                                                        {exp.bullets.length} bullet points
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </ScrollArea>
                        </motion.div>
                    )}

                    {/* Step 2: Choose Action */}
                    {step === 2 && selectedExperience && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="self-start mb-3"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            <Card className="p-4 bg-muted/30 mb-4">
                                <div className="flex items-center gap-3">
                                    {selectedExperience.sectionType === 'experience' ? (
                                        <Briefcase className="w-5 h-5 text-accent" />
                                    ) : (
                                        <FolderKanban className="w-5 h-5 text-accent" />
                                    )}
                                    <div>
                                        <div className="font-medium">{selectedExperience.title}</div>
                                        {selectedExperience.subtitle && (
                                            <div className="text-sm text-muted-foreground">{selectedExperience.subtitle}</div>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            <p className="text-sm text-muted-foreground mb-4">
                                What would you like to do?
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <Card
                                    className="p-6 cursor-pointer hover:bg-muted/50 hover:border-accent transition-all text-center"
                                    onClick={() => handleSelectAction('enhance')}
                                >
                                    <Edit3 className="w-8 h-8 mx-auto mb-3 text-accent" />
                                    <div className="font-medium">Enhance Existing</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Modify an existing bullet point
                                    </p>
                                    <Badge variant="outline" className="mt-2">
                                        {selectedExperience.bullets.length} bullets
                                    </Badge>
                                </Card>

                                <Card
                                    className="p-6 cursor-pointer hover:bg-muted/50 hover:border-accent transition-all text-center"
                                    onClick={() => handleSelectAction('new')}
                                >
                                    <Plus className="w-8 h-8 mx-auto mb-3 text-accent" />
                                    <div className="font-medium">Write New Bullet</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Add a new bullet point
                                    </p>
                                    <Badge variant="outline" className="mt-2">
                                        Up to 3 keywords
                                    </Badge>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Edit/Create */}
                    {step === 3 && selectedExperience && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col overflow-hidden"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="self-start mb-3"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            {action === 'enhance' ? (
                                /* Enhance Mode */
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    {!selectedBullet ? (
                                        <>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                Select a bullet point from <strong>{selectedExperience.title}</strong>:
                                            </p>
                                            <ScrollArea className="flex-1">
                                                <div className="space-y-2 pr-4">
                                                    {selectedExperience.bullets.length === 0 ? (
                                                        <div className="text-center py-6 text-muted-foreground">
                                                            <p>No bullet points found.</p>
                                                            <Button
                                                                variant="outline"
                                                                className="mt-3"
                                                                onClick={() => handleSelectAction('new')}
                                                            >
                                                                <Plus className="w-4 h-4 mr-2" />
                                                                Write New Instead
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        selectedExperience.bullets.map((bullet, idx) => (
                                                            <Card
                                                                key={idx}
                                                                className="p-3 cursor-pointer hover:bg-muted/50 hover:border-accent transition-all"
                                                                onClick={() => handleSelectBullet(bullet)}
                                                            >
                                                                <p className="text-sm">{bullet.text}</p>
                                                            </Card>
                                                        ))
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Original:</label>
                                                <div className="mt-1 p-3 bg-muted/50 rounded-md text-sm">
                                                    {selectedBullet.text}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex-1 flex flex-col">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-sm font-medium flex items-center gap-1">
                                                        <PenLine className="w-4 h-4" />
                                                        Enhanced Version:
                                                    </label>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleAISuggest}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Sparkles className="w-4 h-4 mr-2" />
                                                        )}
                                                        AI Suggest
                                                    </Button>
                                                </div>
                                                <Textarea
                                                    value={editedText}
                                                    onChange={(e) => setEditedText(e.target.value)}
                                                    className="flex-1 min-h-[100px] resize-none"
                                                    placeholder="Edit the bullet point..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* New Bullet Mode */
                                <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
                                    {/* Keyword Selection for New Bullets */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Keywords to include (max 3):
                                        </label>
                                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                                            {selectedKeywords.map(kw => (
                                                <Badge key={kw} variant="default" className="gap-1">
                                                    {kw}
                                                    {kw !== keyword && (
                                                        <X
                                                            className="w-3 h-3 cursor-pointer hover:text-red-300"
                                                            onClick={() => toggleKeyword(kw)}
                                                        />
                                                    )}
                                                </Badge>
                                            ))}
                                            {availableKeywords.slice(0, 10).map(kw => (
                                                <Badge
                                                    key={kw}
                                                    variant="outline"
                                                    className={`cursor-pointer transition-colors ${selectedKeywords.length >= 3 ? 'opacity-50' : 'hover:bg-accent/20'
                                                        }`}
                                                    onClick={() => toggleKeyword(kw)}
                                                >
                                                    <Plus className="w-3 h-3 mr-1" />
                                                    {kw}
                                                </Badge>
                                            ))}
                                        </div>
                                        {availableKeywords.length > 10 && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                +{availableKeywords.length - 10} more keywords available
                                            </p>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium flex items-center gap-1">
                                                <PenLine className="w-4 h-4" />
                                                New Bullet Point:
                                            </label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAISuggest}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                )}
                                                AI Generate
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={newBulletText}
                                            onChange={(e) => setNewBulletText(e.target.value)}
                                            className="flex-1 min-h-[120px] resize-none"
                                            placeholder={`Write a new bullet point for ${selectedExperience.title}...\n\nExample: "Implemented ${selectedKeywords.join(' and ')} solutions that improved efficiency by 30%"`}
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            💡 Start with a strong action verb and include quantifiable results
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <DialogFooter className="mt-4">
                    {step === 3 && (
                        <Button
                            onClick={handleApply}
                            disabled={
                                (action === 'enhance' && (!selectedBullet || !editedText.trim() || editedText === selectedBullet?.text)) ||
                                (action === 'new' && !newBulletText.trim())
                            }
                            className="gap-2"
                        >
                            <Check className="w-4 h-4" />
                            {action === 'enhance' ? 'Apply Changes' : 'Add Bullet'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
