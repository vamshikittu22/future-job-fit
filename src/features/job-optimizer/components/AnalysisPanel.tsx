import { useState } from "react";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
    AlertCircle,
    CheckCircle,
    Target,
    TrendingUp,
    Plus,
    Sparkles,
    Lightbulb,
    BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { extractATSKeywords } from "@/shared/lib/atsKeywords";
import KeywordIntegrationModal from "./KeywordIntegrationModal";

interface AnalysisPanelProps {
    resumeText: string;
    jobDescription: string;
    onResumeUpdate: (updatedResume: string) => void;
}

export default function AnalysisPanel({
    resumeText,
    jobDescription,
    onResumeUpdate
}: AnalysisPanelProps) {
    const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
    const [integrationModalOpen, setIntegrationModalOpen] = useState(false);

    // Use the intelligent ATS keyword system
    const keywords = extractATSKeywords(jobDescription).slice(0, 25);

    // Check which keywords are missing from resume
    const missingKeywords = keywords.filter(keyword =>
        !resumeText.toLowerCase().includes(keyword.toLowerCase())
    );

    const matchingKeywords = keywords.filter(keyword =>
        resumeText.toLowerCase().includes(keyword.toLowerCase())
    );

    // Calculate rough ATS score
    const atsScore = keywords.length > 0
        ? Math.round((matchingKeywords.length / keywords.length) * 100)
        : 0;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-green-500/10 border-green-500/30";
        if (score >= 60) return "bg-yellow-500/10 border-yellow-500/30";
        return "bg-red-500/10 border-red-500/30";
    };

    const handleKeywordClick = (keyword: string) => {
        setSelectedKeyword(keyword);
        setIntegrationModalOpen(true);
    };

    const handleIntegrationApply = (updatedResume: string) => {
        onResumeUpdate(updatedResume);
        setIntegrationModalOpen(false);
        setSelectedKeyword(null);
    };

    const hasData = resumeText.trim() && jobDescription.trim();

    return (
        <>
            <Card className="h-full shadow-swiss bg-gradient-card flex flex-col">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Real-time Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                            ATS scoring & keyword gaps
                        </p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <AnimatePresence mode="wait">
                        {hasData ? (
                            <motion.div
                                key="analysis"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* ATS Score Card */}
                                <Card className={`p-4 border ${getScoreBg(atsScore)}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>
                                                {atsScore}%
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">ATS Match Score</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {matchingKeywords.length}/{keywords.length} keywords matched
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className={`w-5 h-5 ${getScoreColor(atsScore)}`} />
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${atsScore}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                </Card>

                                {/* Quick Tips */}
                                {atsScore < 80 && (
                                    <Card className="p-4 bg-accent/5 border-accent/20">
                                        <div className="flex items-start gap-3">
                                            <Lightbulb className="w-5 h-5 text-accent mt-0.5" />
                                            <div>
                                                <h5 className="font-medium text-sm mb-1">Quick Tip</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    Click on any missing keyword below to integrate it into your resume with AI assistance.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                <Separator />

                                {/* Missing Keywords - Clickable */}
                                {missingKeywords.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                            <h4 className="font-semibold">
                                                Missing Keywords ({missingKeywords.length})
                                            </h4>
                                            <Badge variant="outline" className="ml-auto text-xs">
                                                Click to add
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Click a keyword to integrate it into your resume:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {missingKeywords.map(keyword => (
                                                <Badge
                                                    key={keyword}
                                                    variant="destructive"
                                                    className="bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer transition-colors group"
                                                    onClick={() => handleKeywordClick(keyword)}
                                                >
                                                    <Plus className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Matching Keywords */}
                                {matchingKeywords.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <h4 className="font-semibold">
                                                Matched Keywords ({matchingKeywords.length})
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {matchingKeywords.map(keyword => (
                                                <Badge
                                                    key={keyword}
                                                    variant="default"
                                                    className="bg-green-100 text-green-800"
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Suggestions */}
                                {missingKeywords.length > 0 && (
                                    <>
                                        <Separator />
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles className="w-5 h-5 text-accent" />
                                                <h4 className="font-semibold">Suggested Actions</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {missingKeywords.slice(0, 3).map((keyword, idx) => (
                                                    <Card
                                                        key={keyword}
                                                        className="p-3 cursor-pointer hover:bg-muted/50 hover:border-accent transition-all group"
                                                        onClick={() => handleKeywordClick(keyword)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Target className="w-4 h-4 text-accent" />
                                                                <span className="text-sm">
                                                                    Add <strong>"{keyword}"</strong> to your experience
                                                                </span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Perfect Score Message */}
                                {atsScore >= 90 && (
                                    <Card className="p-4 bg-green-500/10 border-green-500/30">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                            <div>
                                                <h5 className="font-medium">Excellent Match!</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    Your resume is well-aligned with this job description.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                            >
                                <BarChart3 className="w-16 h-16 mb-4 opacity-30" />
                                <p className="text-center">
                                    Add your resume and job description<br />
                                    to see real-time analysis
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ScrollArea>
            </Card>

            {/* Keyword Integration Modal */}
            <KeywordIntegrationModal
                open={integrationModalOpen}
                onOpenChange={setIntegrationModalOpen}
                keyword={selectedKeyword || ""}
                resumeText={resumeText}
                onApply={handleIntegrationApply}
                allMissingKeywords={missingKeywords}
            />
        </>
    );
}
