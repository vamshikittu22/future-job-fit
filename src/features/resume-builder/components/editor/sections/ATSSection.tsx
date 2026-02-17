import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { ATSScoreForm } from '@/features/resume-builder/components/editor/forms/ATSScoreForm';

export interface ATSSectionProps {
  atsScore?: {
    score: number;
    suggestions: string[];
    lastUpdated: string;
    jobDescription: string;
  };
  onAnalyze: (jobDescription: string) => Promise<void>;
  isAnalyzing: boolean;
}

export const ATSSection = ({ atsScore, onAnalyze, isAnalyzing }: ATSSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">ATS Score & Optimization</CardTitle>
        <CardDescription>
          Get your resume's ATS score and optimization suggestions based on a job description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ATSScoreForm 
          atsScore={atsScore}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </CardContent>
    </Card>
  );
};

export default ATSSection;
