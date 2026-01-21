import { useEffect, useState } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Progress } from "@/shared/ui/progress";
import { ArrowLeft, Download, Copy, RefreshCw, Target, AlertCircle, CheckCircle, TrendingUp, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/shared/hooks/use-toast";
import { motion } from "framer-motion";
import LoadingSpinner from "@/shared/components/common/LoadingSpinner";
import AppNavigation from "@/shared/components/layout/AppNavigation";
import Footer from "@/shared/components/layout/Footer";
import { resumeAI } from "@/shared/api/resumeAI";
import { usePyNLP } from "@/shared/hooks/usePyNLP";
import KeywordIntegrationModal from "@/features/job-optimizer/components/KeywordIntegrationModal";
import ExportOptimizedModal from "@/features/job-optimizer/components/ExportOptimizedModal";

interface EvaluationResult {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  rewrittenResume: string;
  matchingKeywords?: string[];
  improvements?: string[];
  nextSteps?: string[];
}

export default function Results() {
  const { scoreATS, optimizeResume, status: pyStatus, isReady } = usePyNLP();
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keywordModalOpen, setKeywordModalOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const evaluateResume = async () => {
      const resumeText = localStorage.getItem("resumeText");
      const jobDescription = localStorage.getItem("jobDescription");
      const selectedModel = localStorage.getItem("selectedModel") || "gemini-2.5-flash";
      const customInstructions = localStorage.getItem("customInstructions");

      if (!resumeText) {
        navigate("/input");
        return;
      }

      try {
        setError(null);
        let result: EvaluationResult;

        try {
          // Attempt API evaluation first for full features (rewriting, etc)
          result = await resumeAI.evaluateResume({
            resumeText,
            jobDescription: jobDescription || undefined,
            model: selectedModel,
            customInstructions: customInstructions ? JSON.parse(customInstructions) : undefined
          });

          // Optional: Augment or verify with local NLP if available
          if (isReady && jobDescription) {
            const pyResult = await scoreATS(resumeText, jobDescription);
            console.log("Local NLP Verification Score:", pyResult.score);
          }
        } catch (apiErr) {
          console.warn("API evaluation failed, attempting local NLP fallback...", apiErr);

          if (isReady && jobDescription) {
            const pyResult = await scoreATS(resumeText, jobDescription);
            const pyOptimized = await optimizeResume(resumeText, jobDescription);

            result = {
              atsScore: pyResult.score,
              missingKeywords: pyResult.missing,
              matchingKeywords: pyResult.matchingKeywords,
              suggestions: [
                "Local AI optimization engine is currently active.",
                "Missing keywords have been injected into your skills and summary sections.",
                "Review the matching keywords and improvements below."
              ],
              rewrittenResume: pyOptimized, // Correctly use the optimized version
              improvements: ["Injected missing technical keywords", "Balanced content for ATS compatibility"],
              nextSteps: ["Review the new keywords in the 'Optimized Resume' panel", "Export the updated version for your application"]
            };

            toast({
              title: "Using Local Optimization",
              description: "Our local engine has tailored your resume based on detected keywords.",
            });
          } else if (!isReady) {
            throw new Error("API and AI engine are both unavailable. Check your connection.");
          } else {
            throw apiErr;
          }
        }

        setEvaluation(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    evaluateResume();
  }, [navigate, isReady, scoreATS, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Resume text has been copied to your clipboard",
    });
  };

  const downloadAsText = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
        ...(evaluation.matchingKeywords || []),
        selectedKeyword
      ];

      setEvaluation({
        ...evaluation,
        rewrittenResume: updatedResume,
        missingKeywords: updatedMissingKeywords,
        matchingKeywords: updatedMatchingKeywords
      });
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
            <p className="text-muted-foreground">Our AI is evaluating your resume and generating improvements</p>
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
            Your personalized resume analysis with AI-powered optimization
          </p>
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
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${evaluation.atsScore >= 80 ? 'bg-green-100 text-green-600' :
                    evaluation.atsScore >= 60 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ATS Score</h3>
                    <div className="text-2xl font-bold text-accent">{evaluation.atsScore}/100</div>
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
                    <div className="text-2xl font-bold text-accent">
                      {evaluation.matchingKeywords?.length || 0}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Keywords found in resume</p>
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
                    <div className="text-2xl font-bold text-accent">
                      {evaluation.missingKeywords?.length || 0}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Opportunities to add</p>
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
                {evaluation.matchingKeywords && evaluation.matchingKeywords.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold">Matching Keywords ({evaluation.matchingKeywords.length})</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {evaluation.matchingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="default" className="bg-green-100 text-green-800">
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

                <Separator className="my-6" />

                {/* Suggestions */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
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

            {/* Rewritten Resume Card */}
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
                    <h2 className="text-xl font-semibold">Optimized Resume</h2>
                  </div>

                  <div className="flex gap-2">
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
                    Key Improvements Made
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
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link to="/input">
            <Button variant="secondary" size="lg" className="px-8 hover:shadow-swiss transition-all duration-300">
              Analyze Another Resume
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