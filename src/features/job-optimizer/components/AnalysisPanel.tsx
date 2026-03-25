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
    BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { extractCategorisedATSKeywords, type CategorisedKeyword } from "@/shared/lib/atsKeywords";
import KeywordIntegrationModal from "./KeywordIntegrationModal";
import { Link } from "react-router-dom";

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

    // Use the intelligent ATS keyword system with required/preferred classification
    const categorised: CategorisedKeyword[] = extractCategorisedATSKeywords(jobDescription).slice(0, 35);

    // Check which keywords are missing/matching from resume
    const missingKeywords = categorised.filter(({ keyword }) =>
        !resumeText.toLowerCase().includes(keyword.toLowerCase())
    );
    const matchingKeywords = categorised.filter(({ keyword }) =>
        resumeText.toLowerCase().includes(keyword.toLowerCase())
    );

    // Flat string arrays for the KeywordIntegrationModal
    const missingKeywordStrings = missingKeywords.map(k => k.keyword);

    // Weighted ATS score: required keywords count 1.5x (mirrors Jobscan/JobSuit scoring)
    const requiredTotal = categorised.filter(k => k.importance === 'required').length;
    const preferredTotal = categorised.filter(k => k.importance === 'preferred').length;
    const requiredMatched = matchingKeywords.filter(k => k.importance === 'required').length;
    const preferredMatched = matchingKeywords.filter(k => k.importance === 'preferred').length;

    const atsScore = categorised.length > 0
        ? Math.round(
            ((requiredMatched * 1.5 + preferredMatched * 0.5) /
            Math.max(requiredTotal * 1.5 + preferredTotal * 0.5, 1)) * 100
          )
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
                            ATS scoring &amp; keyword gaps
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
                                className="space-y-4"
                            >
                                {/* Score Metrics Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* ATS Score */}
                                    <Card className={`p-3 border ${getScoreBg(atsScore)}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className={`w-4 h-4 ${getScoreColor(atsScore)}`} />
                                            <span className="text-xs text-muted-foreground">ATS Score</span>
                                        </div>
                                        <div className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>
                                            {atsScore}%
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Weighted (req ×1.5)
                                        </p>
                                    </Card>

                                    {/* Match Rate */}
                                    <Card className="p-3 border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs text-muted-foreground">Match Rate</span>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {categorised.length > 0
                                                ? Math.round((matchingKeywords.length / categorised.length) * 100)
                                                : 0}%
                                        </div>
                                    </Card>

                                    {/* Matched */}
                                    <Card className="p-3 border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span className="text-xs text-muted-foreground">Matched</span>
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {matchingKeywords.length}
                                        </div>
                                    </Card>

                                    {/* Gaps */}
                                    <Card className="p-3 border bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            <span className="text-xs text-muted-foreground">Gaps</span>
                                        </div>
                                        <div className="text-2xl font-bold text-red-600">
                                            {missingKeywords.length}
                                        </div>
                                    </Card>
                                </div>

                                {/* Skills detected in JD */}
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        Skills in Job Description
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {categorised.length > 0 ? (
                                            categorised.slice(0, 12).map(({ keyword }) => (
                                                <Badge key={keyword} variant="secondary" className="text-xs">
                                                    {keyword}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No common skills detected</span>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Missing Keywords — split by required / preferred à la Jobscan */}
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

                                        {/* Required missing */}
                                        {missingKeywords.some(k => k.importance === 'required') && (
                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Required</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {missingKeywords
                                                        .filter(k => k.importance === 'required')
                                                        .map(({ keyword }) => (
                                                            <Badge
                                                                key={keyword}
                                                                variant="destructive"
                                                                className="bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer transition-colors group border border-red-300"
                                                                onClick={() => handleKeywordClick(keyword)}
                                                            >
                                                                <Plus className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                {keyword}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Preferred missing */}
                                        {missingKeywords.some(k => k.importance === 'preferred') && (
                                            <div>
                                                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Preferred</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {missingKeywords
                                                        .filter(k => k.importance === 'preferred')
                                                        .map(({ keyword }) => (
                                                            <Badge
                                                                key={keyword}
                                                                className="bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer transition-colors group border border-orange-200"
                                                                onClick={() => handleKeywordClick(keyword)}
                                                            >
                                                                <Plus className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                {keyword}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
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
                                            {matchingKeywords.map(({ keyword }) => (
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
                                                {missingKeywords.slice(0, 3).map(({ keyword, importance }) => (
                                                    <Card
                                                        key={keyword}
                                                        className="p-3 cursor-pointer hover:bg-muted/50 hover:border-accent transition-all group"
                                                        onClick={() => handleKeywordClick(keyword)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Target className="w-4 h-4 text-accent" />
                                                                <span className="text-sm">
                                                                    Add <strong>&quot;{keyword}&quot;</strong> to your experience
                                                                </span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`text-xs ml-1 ${importance === 'required'
                                                                        ? 'border-red-300 text-red-600'
                                                                        : 'border-orange-300 text-orange-600'}`}
                                                                >
                                                                    {importance}
                                                                </Badge>
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

                {/* Deep Analysis Button */}
                {hasData && (
                    <div className="p-4 border-t bg-blue-50 dark:bg-blue-950/30">
                        <Link to="/match-intelligence">
                            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Deep Analysis
                            </Button>
                        </Link>
                    </div>
                )}
            </Card>

            {/* Keyword Integration Modal */}
            <KeywordIntegrationModal
                open={integrationModalOpen}
                onOpenChange={setIntegrationModalOpen}
                keyword={selectedKeyword || ""}
                resumeText={resumeText}
                onApply={handleIntegrationApply}
                allMissingKeywords={missingKeywordStrings}
            />
        </>
    );
}
