import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Download, Target, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface EvaluationResult {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  rewrittenResume: string;
}

export default function Results() {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to GPT
    const resumeText = localStorage.getItem("resumeText");
    const jobDescription = localStorage.getItem("jobDescription");

    if (!resumeText) {
      return;
    }

    // Mock evaluation result for demo
    setTimeout(() => {
      setEvaluation({
        atsScore: 78,
        missingKeywords: ["TypeScript", "CI/CD", "GraphQL", "Testing", "Leadership"],
        suggestions: [
          "Add specific metrics and quantifiable achievements",
          "Include more technical keywords from the job description",
          "Strengthen leadership and collaboration examples"
        ],
        rewrittenResume: `John Smith
Senior Frontend Developer
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Results-driven Senior Frontend Developer with 5+ years of experience building scalable web applications. Expert in React, TypeScript, and modern JavaScript with proven leadership capabilities and strong problem-solving skills.

TECHNICAL SKILLS
• Frontend: React, TypeScript, JavaScript (ES6+), HTML5, CSS3
• Styling: Tailwind CSS, Styled Components, SCSS
• Testing: Jest, Cypress, React Testing Library
• Tools: Git, CI/CD pipelines, Webpack, Vite
• State Management: Redux, Zustand, Context API
• Backend: Node.js, REST APIs, GraphQL, SQL

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp | 2020-Present
• Developed 15+ scalable React applications serving 100K+ users, improving performance by 40%
• Led cross-functional team of 5 developers, mentoring junior staff and conducting code reviews
• Implemented TypeScript migration reducing bugs by 60% and improving developer productivity
• Collaborated with product managers and designers to deliver pixel-perfect, responsive interfaces
• Established CI/CD pipelines reducing deployment time from 2 hours to 15 minutes

Software Engineer | StartupXYZ | 2018-2020
• Built responsive frontend interfaces using React and modern CSS frameworks
• Integrated REST APIs and optimized database queries improving load times by 30%
• Participated in agile development process with daily standups and sprint planning
• Implemented comprehensive testing suite achieving 90%+ code coverage

EDUCATION
Bachelor of Science in Computer Science | State University | 2014-2018
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems

ACHIEVEMENTS
• Reduced application bundle size by 35% through code splitting and optimization
• Mentored 3 junior developers who were promoted within 12 months
• Led successful migration of legacy codebase to modern React architecture`
      });
      setIsLoading(false);
    }, 2000);
  }, []);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold mb-2">Analyzing your resume...</h2>
          <p className="text-muted-foreground">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <Link to="/input">
            <Button variant="secondary">Try Again</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/input">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Analysis Results</h1>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Evaluation Card */}
          <Card className="p-6 shadow-swiss">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
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
          <Card className="p-6 shadow-swiss">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
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
    </div>
  );
}