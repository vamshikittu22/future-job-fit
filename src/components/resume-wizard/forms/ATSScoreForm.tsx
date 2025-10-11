import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ATSScore } from '../types/resume.types';

interface ATSScoreFormProps {
  atsScore?: ATSScore;
  onAnalyze: (jobDescription: string) => Promise<void>;
  isAnalyzing: boolean;
}

export const ATSScoreForm = ({ atsScore, onAnalyze, isAnalyzing }: ATSScoreFormProps) => {
  const [jobDescription, setJobDescription] = useState(atsScore?.jobDescription || '');

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    await onAnalyze(jobDescription);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ATS Score & Optimization</CardTitle>
        <p className="text-sm text-muted-foreground">
          Get your resume's ATS score and optimization suggestions based on a job description.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[150px]"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !jobDescription.trim()}
              className="mt-2"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze for ATS'}
            </Button>
          </div>
        </div>

        {atsScore && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>ATS Score</Label>
                <span className="text-sm font-medium">{atsScore.score}%</span>
              </div>
              <Progress value={atsScore.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(atsScore.lastUpdated).toLocaleString()}
              </p>
            </div>

            {atsScore.suggestions.length > 0 && (
              <div className="space-y-2">
                <Label>Optimization Suggestions</Label>
                <ul className="space-y-2 text-sm">
                  {atsScore.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
