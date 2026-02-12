import { useEffect, useState } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Progress } from "@/shared/ui/progress";
import { ArrowLeft, Download, Copy, Target, AlertCircle, CheckCircle, TrendingUp, Plus, Sparkles, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/shared/hooks/use-toast";
import { motion } from "framer-motion";
import AppNavigation from "@/shared/components/layout/AppNavigation";
import Footer from "@/shared/components/layout/Footer";
import { resumeAI } from "@/shared/api/resumeAI";
import { usePyNLP } from "@/shared/hooks/usePyNLP";
import { extractATSKeywords } from "@/shared/lib/atsKeywords";
import KeywordIntegrationModal from "@/features/job-optimizer/components/KeywordIntegrationModal";
import ExportOptimizedModal from "@/features/job-optimizer/components/ExportOptimizedModal";

interface EvaluationResult {
  atsScore: number;
  missingKeywords: string[];
  matchingKeywords: string[];
  suggestions: string[];
  rewrittenResume: string;
  improvements?: string[];
  nextSteps?: string[];
  source: 'pyodide' | 'api' | 'local';
}

export default function Results() {
  const { scoreATS, optimizeResume, status: pyStatus, isReady } = usePyNLP();
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keywordModalOpen, setKeywordModalOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const runAnalysis = async () => {
      const savedResumeText = localStorage.getItem("resumeText");
      const savedJobDescription = localStorage.getItem("jobDescription");

      if (!savedResumeText) {
        navigate("/input");
        return;
      }

      setResumeText(savedResumeText);
      setJobDescription(savedJobDescription || "");

      try {
        setError(null);
        let result: EvaluationResult;

        // If we have a job description, calculate real keyword matches
        if (savedJobDescription) {
          // Extract keywords using the ATS keyword extractor
          const jdKeywords = extractATSKeywords(savedJobDescription).slice(0, 30);

          const resumeLower = savedResumeText.toLowerCase();
          const matchingKeywords = jdKeywords.filter(kw =>
            resumeLower.includes(kw.toLowerCase())
          );
          const missingKeywords = jdKeywords.filter(kw =>
            !resumeLower.includes(kw.toLowerCase())
          );

          // Calculate ATS score
          const atsScore = jdKeywords.length > 0
            ? Math.round((matchingKeywords.length / jdKeywords.length) * 100)
            : 50;

          // Generate contextual suggestions based on actual analysis
          const suggestions: string[] = [];
          if (missingKeywords.length > 5) {
            suggestions.push(`Consider adding ${Math.min(5, missingKeywords.length)} of the missing keywords to improve your match score.`);
          }
          if (atsScore < 60) {
            suggestions.push("Your resume may need significant tailoring for this job. Focus on the technical skills mentioned in the job description.");
          } else if (atsScore < 80) {
            suggestions.push("Good foundation! Adding a few more relevant keywords could push you past ATS filters.");
          }
          if (missingKeywords.some(kw => kw.toLowerCase().includes('lead') || kw.toLowerCase().includes('manage'))) {
            suggestions.push("The job description emphasizes leadership. Highlight any team lead or mentoring experience.");
          }
          if (missingKeywords.length > 0) {
            suggestions.push(`Top priority keywords to add: ${missingKeywords.slice(0, 3).join(', ')}`);
          }

          result = {
            atsScore,
            missingKeywords,
            matchingKeywords,
            suggestions: suggestions.length > 0 ? suggestions : [
              "Your resume shows good alignment with this job description.",
              "Consider reviewing the missing keywords section to further optimize."
            ],
            rewrittenResume: savedResumeText, // Start with original, user can optimize later
            improvements: matchingKeywords.length > 5
              ? ["Strong keyword alignment detected", "Resume structure appears ATS-friendly"]
              : undefined,
            nextSteps: [
              "Review missing keywords and click to add them to your resume",
              "Click 'AI Optimize' to generate an enhanced version",
              "Export your optimized resume in multiple formats"
            ],
            source: 'local'
          };

          // Try to enhance with Pyodide if available
          if (isReady) {
            try {
              const pyResult = await scoreATS(savedResumeText, savedJobDescription);
              // Merge Pyodide results for more accuracy
              result.atsScore = Math.round((result.atsScore + pyResult.score) / 2);
              if (pyResult.suggestions?.length > 0) {
                result.suggestions = [...result.suggestions, ...pyResult.suggestions.slice(0, 2)];
              }
              result.source = 'pyodide';
            } catch (pyErr) {
              console.warn("Pyodide scoring failed, using local analysis:", pyErr);
            }
          }

        } else {
          // No job description - basic analysis
          result = {
            atsScore: 70,
            missingKeywords: [],
            matchingKeywords: [],
            suggestions: [
              "No job description provided - general analysis only.",
              "For targeted optimization, go back and add a job description.",
              "Review your resume for common ATS best practices."
            ],
            rewrittenResume: savedResumeText,
            source: 'local'
          };
        }

        setEvaluation(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred during analysis");
      } finally {
        setIsLoading(false);
      }
    };

    runAnalysis();
  }, [navigate, isReady, scoreATS]);

  const handleAIOptimize = async () => {
    if (!evaluation || !resumeText) return;

    setIsOptimizing(true);
    try {
      let optimizedResume = resumeText;

      // Try Pyodide optimization first
      if (isReady && jobDescription) {
        try {
          optimizedResume = await optimizeResume(resumeText, jobDescription);
          toast({
            title: "Resume Optimized",
            description: "Your resume has been enhanced with missing keywords.",
          });
        } catch (pyErr) {
          console.warn("Pyodide optimization failed:", pyErr);
        }
      }

      // If Pyodide didn't work, try API
      if (optimizedResume === resumeText && jobDescription) {
        try {
          const apiResult = await resumeAI.evaluateResume({
            resumeText,
            jobDescription,
          });
          if (apiResult.rewrittenResume && apiResult.rewrittenResume !== resumeText) {
            optimizedResume = apiResult.rewrittenResume;
            toast({
              title: "Resume Optimized",
              description: "AI has enhanced your resume for this job.",
            });
          }
        } catch (apiErr) {
          console.warn("API optimization failed:", apiErr);
        }
      }

      // Update state with optimized resume
      if (optimizedResume !== resumeText) {
        setEvaluation({
          ...evaluation,
          rewrittenResume: optimizedResume,
          improvements: [...(evaluation.improvements || []), "AI optimization applied"]
        });
        localStorage.setItem("resumeText", optimizedResume);
      } else {
        toast({
          title: "No Changes Needed",
          description: "Your resume is already well-optimized for this job.",
        });
      }
    } catch (err) {
      toast({
        title: "Optimization Failed",
        description: "Could not optimize resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Resume text has been copied to your clipboard",
    });
  };

  const handleKeywordClick = (keyword: string) => {
    setSelectedKeyword(keyword);
    setKeywordModalOpen(true);
  };

  const handleKeywordApply = (updatedResume: string) => {
    if (evaluation) {
      // Remove the injected keyword from missing and add to matching
      const updatedMissingKeywords = evaluation.missingKeywords.filter(
        k => k.toLowerCase() !== selectedKeyword.toLowerCase()
      );
      const updatedMatchingKeywords = [
        ...evaluation.matchingKeywords,
        selectedKeyword
      ];

      // Recalculate score
      const totalKeywords = updatedMissingKeywords.length + updatedMatchingKeywords.length;
      const newScore = totalKeywords > 0
        ? Math.round((updatedMatchingKeywords.length / totalKeywords) * 100)
        : evaluation.atsScore;

      setEvaluation({
        ...evaluation,
        rewrittenResume: updatedResume,
        missingKeywords: updatedMissingKeywords,
        matchingKeywords: updatedMatchingKeywords,
        atsScore: newScore
      });

      // Update localStorage
      localStorage.setItem("resumeText", updatedResume);
      setResumeText(updatedResume);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold mb-2">Analyzing your resume...</h2>
            <p className="text-muted-foreground">Calculating ATS compatibility and keyword matches</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              {error || "Failed to analyze your resume. Please try again."}
            </p>
            <Link to="/input">
              <Button variant="secondary">Try Again</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <motion.div
        className="swiss-container swiss-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Analysis Results
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real-time ATS analysis based on your resume and job description
          </p>
          <Badge variant="outline" className="mt-3">
            Analysis source: {evaluation.source === 'pyodide' ? 'Pyodide NLP' : evaluation.source === 'api' ? 'Cloud AI' : 'Local Processing'}
          </Badge>
        </motion.div>

        {/* Results Grid */}
        <div className="max-w-7xl mx-auto space-y-10">
          {/* ATS Score Dashboard */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 shadow-swiss bg-gradient-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getScoreBg(evaluation.atsScore)} ${getScoreColor(evaluation.atsScore)}`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ATS Score</h3>
                    <div className={`text-2xl font-bold ${getScoreColor(evaluation.atsScore)}`}>
                      {evaluation.atsScore}/100
                    </div>
                  </div>
                </div>
                <Progress value={evaluation.atsScore} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {evaluation.atsScore >= 80 ? "Excellent compatibility" :
                    evaluation.atsScore >= 60 ? "Good, needs improvement" : "Requires optimization"}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 shadow-swiss bg-gradient-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Keywords Match</h3>
                    <div className="text-2xl font-bold text-green-600">
                      {evaluation.matchingKeywords.length}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Keywords found in your resume</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 shadow-swiss bg-gradient-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Missing Keywords</h3>
                    <div className="text-2xl font-bold text-red-600">
                      {evaluation.missingKeywords.length}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Click below to add them</p>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Analysis Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Keyword Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6 shadow-swiss bg-gradient-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">Keyword Analysis</h2>
                </div>

                {/* Matching Keywords */}
                {evaluation.matchingKeywords.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold">Matching Keywords ({evaluation.matchingKeywords.length})</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {evaluation.matchingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {evaluation.missingKeywords.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold">Missing Keywords ({evaluation.missingKeywords.length})</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Click a keyword to add it to your resume
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {evaluation.missingKeywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="destructive"
                          className="bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 hover:scale-105 transition-all flex items-center gap-1"
                          onClick={() => handleKeywordClick(keyword)}
                        >
                          <Plus className="w-3 h-3" />
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.missingKeywords.length === 0 && evaluation.matchingKeywords.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No job description provided for keyword analysis.</p>
                    <Link to="/input">
                      <Button variant="link" className="mt-2">Add job description →</Button>
                    </Link>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Suggestions */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Improvement Suggestions
                  </h4>
                  <ul className="space-y-3">
                    {evaluation.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm flex items-start gap-3">
                        <span className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Optimized Resume Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="p-6 shadow-swiss bg-gradient-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-semibold">Your Resume</h2>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAIOptimize}
                      disabled={isOptimizing || !jobDescription}
                      className="hover:shadow-swiss transition-all duration-300"
                    >
                      {isOptimizing ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      AI Optimize
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(evaluation.rewrittenResume)}
                      className="hover:shadow-swiss transition-all duration-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExportModalOpen(true)}
                      className="hover:shadow-swiss transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <motion.div
                  className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {evaluation.rewrittenResume}
                  </pre>
                </motion.div>
              </Card>
            </motion.div>
          </div>

          {/* Additional Insights */}
          {(evaluation.improvements || evaluation.nextSteps) && (
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {evaluation.improvements && (
                <Card className="p-6 shadow-swiss bg-gradient-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Analysis Insights
                  </h3>
                  <ul className="space-y-2">
                    {evaluation.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {evaluation.nextSteps && (
                <Card className="p-6 shadow-swiss bg-gradient-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Next Steps
                  </h3>
                  <ul className="space-y-2">
                    {evaluation.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link to="/input">
            <Button variant="outline" size="lg" className="px-8 hover:shadow-swiss transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Input
            </Button>
          </Link>
          <Link to="/resume-wizard">
            <Button variant="secondary" size="lg" className="px-8 hover:shadow-swiss transition-all duration-300">
              Open Resume Wizard
            </Button>
          </Link>
        </motion.div>
      </motion.div>
      <Footer />

      {/* Keyword Integration Modal */}
      <KeywordIntegrationModal
        open={keywordModalOpen}
        onOpenChange={setKeywordModalOpen}
        keyword={selectedKeyword}
        resumeText={evaluation?.rewrittenResume || ""}
        onApply={handleKeywordApply}
      />

      {/* Export Modal */}
      <ExportOptimizedModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        resumeText={evaluation?.rewrittenResume || ""}
        atsScore={evaluation?.atsScore}
      />
    </div>
  );
}