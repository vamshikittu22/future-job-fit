import { useState, useEffect } from "react";
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
    Target
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
}

interface BulletPoint {
    text: string;
    index: number;
    section?: string;
}

export default function KeywordIntegrationModal({
    open,
    onOpenChange,
    keyword,
    resumeText,
    onApply,
}: KeywordIntegrationModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([]);
    const [selectedBullet, setSelectedBullet] = useState<BulletPoint | null>(null);
    const [editedText, setEditedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Parse resume into bullet points when modal opens
    useEffect(() => {
        if (open && resumeText) {
            const parsed = parseResumeBullets(resumeText);
            setBulletPoints(parsed);
            setStep(1);
            setSelectedBullet(null);
            setEditedText("");
        }
    }, [open, resumeText]);

    const parseResumeBullets = (text: string): BulletPoint[] => {
        const lines = text.split('\n');
        const bullets: BulletPoint[] = [];
        let currentSection = "";

        lines.forEach((line, index) => {
            const trimmed = line.trim();

            // Detect section headers (all caps or ending with colon)
            if (trimmed.match(/^[A-Z][A-Z\s]+$/) || trimmed.endsWith(':')) {
                currentSection = trimmed.replace(':', '');
                return;
            }

            // Detect bullet points (starts with •, -, *, or has content after whitespace)
            if (trimmed.match(/^[•\-\*]\s/) || (trimmed.length > 20 && trimmed.match(/^[A-Z]/))) {
                bullets.push({
                    text: trimmed.replace(/^[•\-\*]\s*/, ''),
                    index,
                    section: currentSection
                });
            }
        });

        return bullets;
    };

    const handleSelectBullet = (bullet: BulletPoint) => {
        setSelectedBullet(bullet);
        setEditedText(bullet.text);
        setStep(2);
    };

    const handleAISuggest = async () => {
        if (!selectedBullet) return;

        setIsLoading(true);
        try {
            const result = await resumeAI.rewriteBulletWithKeyword({
                originalBullet: selectedBullet.text,
                keyword,
            });
            setEditedText(result.rewrittenBullet);
            toast({
                title: "AI Suggestion Ready",
                description: `Enhanced with "${keyword}"`,
            });
        } catch (error) {
            console.error("AI suggestion failed:", error);
            // Fallback: simple insertion
            const enhanced = `${selectedBullet.text} (${keyword})`;
            setEditedText(enhanced);
            toast({
                title: "Using simple enhancement",
                description: "AI unavailable, keyword appended manually",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (!selectedBullet) return;

        const lines = resumeText.split('\n');
        const originalLine = lines[selectedBullet.index];

        // Preserve bullet prefix if present
        const bulletPrefix = originalLine.match(/^(\s*[•\-\*]\s*)/)?.[1] || '';
        lines[selectedBullet.index] = bulletPrefix + editedText;

        const updatedResume = lines.join('\n');
        onApply(updatedResume);

        toast({
            title: "Resume Updated",
            description: `Successfully integrated "${keyword}"`,
        });

        onOpenChange(false);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedBullet(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-accent" />
                        Inject Keyword
                    </DialogTitle>
                    <DialogDescription>
                        Add <Badge variant="secondary" className="mx-1">{keyword}</Badge> to your resume
                    </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-1 overflow-hidden"
                        >
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                    Select a bullet point to enhance:
                                </h3>
                            </div>
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-2">
                                    {bulletPoints.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No bullet points detected in resume.</p>
                                            <p className="text-sm mt-2">Try adding content with bullets (•, -, *)</p>
                                        </div>
                                    ) : (
                                        bulletPoints.map((bullet, idx) => (
                                            <Card
                                                key={idx}
                                                className="p-3 cursor-pointer hover:bg-muted/50 hover:border-accent transition-all group"
                                                onClick={() => handleSelectBullet(bullet)}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        {bullet.section && (
                                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                                                {bullet.section}
                                                            </span>
                                                        )}
                                                        <p className="text-sm mt-1">{bullet.text}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </motion.div>
                    )}

                    {step === 2 && selectedBullet && (
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
                                className="self-start mb-4"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Original:
                                    </label>
                                    <div className="mt-1 p-3 bg-muted/50 rounded-md text-sm">
                                        {selectedBullet.text}
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium">
                                            <Edit3 className="w-4 h-4 inline mr-1" />
                                            Edit with keyword:
                                        </label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAISuggest}
                                            disabled={isLoading}
                                            className="text-accent hover:text-accent"
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
                                        className="min-h-[120px] resize-none"
                                        placeholder="Edit the bullet point to include the keyword..."
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Tip: Click "AI Suggest" to automatically integrate "{keyword}"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <DialogFooter className="mt-4">
                    {step === 2 && (
                        <Button
                            onClick={handleApply}
                            disabled={!editedText.trim() || editedText === selectedBullet?.text}
                            className="gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Apply Changes
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
