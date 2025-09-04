import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Target, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { resumeAI } from "@/services/resumeAI";

interface EvaluationResult {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  rewrittenResume: string;
}

export default function Results() {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const evaluateResume = async () => {
      const resumeText = localStorage.getItem("resumeText");
      const jobDescription = localStorage.getItem("jobDescription");

      if (!resumeText) {
        navigate("/input");
        return;
      }

      try {
        setError(null);
        const result = await resumeAI.evaluateResume({
          resumeText,
          jobDescription: jobDescription || undefined
        });
        setEvaluation(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    evaluateResume();
  }, [navigate]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
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
        <Navigation />
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
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Analysis Results</h1>
          <p className="text-center text-muted-foreground mt-2">
            Your personalized resume analysis and optimization
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Evaluation Card */}
          <Card className="p-6 shadow-swiss bg-gradient-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold">Evaluation</h2>
            </div>

            {/* ATS Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">ATS Score</span>
                <Badge variant={evaluation.atsScore >= 80 ? "default" : "secondary"} className="text-lg px-3 py-1">
                  {evaluation.atsScore}/100
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${evaluation.atsScore}%` }}
                ></div>
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {evaluation.missingKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Top 3 Suggestions
              </h3>
              <ul className="space-y-2">
                {evaluation.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent mt-0.5">
                      {index + 1}
                    </span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Rewritten Resume Card */}
          <Card className="p-6 shadow-swiss bg-gradient-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold">Tailored Resume</h2>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(evaluation.rewrittenResume)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadAsText(evaluation.rewrittenResume, "tailored-resume.txt")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {evaluation.rewrittenResume}
              </pre>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          <Link to="/input">
            <Button variant="secondary" size="lg" className="px-8">
              Analyze Another Resume
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}