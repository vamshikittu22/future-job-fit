import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Target, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Lightbulb,
  FileText
} from "lucide-react";

interface ATSScorePanelProps {
  resumeData: any;
}

interface ScoreAnalysis {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'suggestion';
    message: string;
    suggestion: string;
  }>;
  strengths: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
}

const commonKeywords = [
  'leadership', 'management', 'project', 'team', 'development', 
  'analysis', 'communication', 'problem-solving', 'innovative',
  'results', 'achieved', 'implemented', 'optimized', 'collaboration'
];

const actionVerbs = [
  'achieved', 'developed', 'implemented', 'managed', 'led',
  'created', 'improved', 'optimized', 'delivered', 'designed'
];

export default function ATSScorePanel({ resumeData }: ATSScorePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysis, setAnalysis] = useState<ScoreAnalysis | null>(null);

  useEffect(() => {
    analyzeResume();
  }, [resumeData]);

  const analyzeResume = () => {
    const issues: ScoreAnalysis['issues'] = [];
    const strengths: string[] = [];
    let score = 0;

    // Check personal info completeness
    const personalInfo = resumeData.personalInfo || {};
    if (personalInfo.name && personalInfo.email) {
      score += 15;
      strengths.push("Contact information is complete");
    } else {
      issues.push({
        type: 'error',
        message: 'Missing essential contact information',
        suggestion: 'Add your full name and email address'
      });
    }

    // Check summary
    const summary = typeof resumeData.summary === 'string' ? resumeData.summary : resumeData.summary?.summary || '';
    if (summary && summary.length > 50) {
      score += 15;
      strengths.push("Professional summary is present");
    } else {
      issues.push({
        type: 'warning',
        message: 'Professional summary is missing or too short',
        suggestion: 'Add a 3-4 sentence summary highlighting your key qualifications'
      });
    }

    // Check skills section
    let totalSkills = 0;
    if (resumeData.skills) {
      if (Array.isArray(resumeData.skills)) {
        totalSkills = resumeData.skills.length;
      } else if (typeof resumeData.skills === 'object') {
        totalSkills = Object.values(resumeData.skills).flat().length;
      }
    }
    
    if (totalSkills >= 5) {
      score += 15;
      strengths.push(`${totalSkills} skills listed`);
    } else {
      issues.push({
        type: 'suggestion',
        message: 'Limited skills section',
        suggestion: 'Add more relevant technical and soft skills'
      });
    }

    // Check experience section
    const experience = resumeData.experience || [];
    if (experience.length > 0) {
      score += 20;
      strengths.push(`${experience.length} work experience entries`);
      
      // Check for bullet points and action verbs
      const hasBullets = experience.some((exp: any) => exp.bullets && exp.bullets.length > 0);
      if (hasBullets) {
        score += 10;
        strengths.push("Experience includes detailed bullet points");
      } else {
        issues.push({
          type: 'warning',
          message: 'Experience lacks detailed descriptions',
          suggestion: 'Add bullet points describing your achievements and responsibilities'
        });
      }
    } else {
      issues.push({
        type: 'error',
        message: 'No work experience listed',
        suggestion: 'Add your professional work experience'
      });
    }

    // Check education
    if (resumeData.education && resumeData.education.length > 0) {
      score += 10;
      strengths.push("Education information included");
    } else {
      issues.push({
        type: 'suggestion',
        message: 'No education information',
        suggestion: 'Consider adding your educational background'
      });
    }

    // Keyword analysis
    const allText = JSON.stringify(resumeData).toLowerCase();
    const foundKeywords = commonKeywords.filter(keyword => allText.includes(keyword));
    const missingKeywords = commonKeywords.filter(keyword => !allText.includes(keyword));

    if (foundKeywords.length >= 5) {
      score += 10;
      strengths.push(`Contains ${foundKeywords.length} relevant keywords`);
    } else {
      issues.push({
        type: 'suggestion',
        message: 'Low keyword density',
        suggestion: 'Include more industry-relevant keywords naturally in your content'
      });
    }

    // Action verb analysis
    const foundActionVerbs = actionVerbs.filter(verb => allText.includes(verb));
    if (foundActionVerbs.length >= 3) {
      score += 5;
      strengths.push("Uses strong action verbs");
    } else {
      issues.push({
        type: 'suggestion',
        message: 'Limited use of action verbs',
        suggestion: 'Start bullet points with strong action verbs like "achieved," "developed," "managed"'
      });
    }

    // Projects section bonus
    if (resumeData.projects && resumeData.projects.length > 0) {
      score += 10;
      strengths.push(`${resumeData.projects.length} projects showcased`);
    }

    setAnalysis({
      score: Math.min(score, 100),
      issues: issues.slice(0, 3), // Show top 3 issues
      strengths,
      keywords: {
        found: foundKeywords,
        missing: missingKeywords.slice(0, 5) // Show top 5 missing
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  if (!analysis) return null;

  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur">
      <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-auto">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">ATS Score</h3>
          </div>
          
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}
              </div>
              <div className="text-sm text-muted-foreground">
                {getScoreLabel(analysis.score)}
              </div>
            </div>
            
            <Progress 
              value={analysis.score} 
              className="h-2"
            />
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {analysis.strengths.length}
                </div>
                <div className="text-xs text-muted-foreground">Strengths</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-600">
                  {analysis.issues.filter(i => i.type === 'warning').length}
                </div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-600">
                  {analysis.issues.filter(i => i.type === 'error').length}
                </div>
                <div className="text-xs text-muted-foreground">Issues</div>
              </div>
            </div>
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto text-left"
            >
              <span className="font-medium">View Details</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Top Issues */}
              {analysis.issues.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Top Issues
                  </h4>
                  <div className="space-y-2">
                    {analysis.issues.map((issue, index) => (
                      <Card key={index} className="p-3 border-l-4 border-l-yellow-500">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {issue.type === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                            {issue.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                            {issue.type === 'suggestion' && <Lightbulb className="w-4 h-4 text-blue-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">
                              {issue.message}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {issue.suggestion}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Strengths
                  </h4>
                  <div className="space-y-1">
                    {analysis.strengths.slice(0, 3).map((strength, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Keywords
                </h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Found ({analysis.keywords.found.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywords.found.slice(0, 6).map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {analysis.keywords.missing.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Consider adding</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.keywords.missing.slice(0, 4).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}