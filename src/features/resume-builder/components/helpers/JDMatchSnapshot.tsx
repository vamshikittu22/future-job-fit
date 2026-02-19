import React from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJob } from '@/shared/contexts/JobContext';
import { useMatchScore } from '@/features/match-intelligence/hooks/useMatchScore';
import { cn } from '@/shared/lib/utils';

interface JDMatchSnapshotProps {
  className?: string;
}

export const JDMatchSnapshot: React.FC<JDMatchSnapshotProps> = ({ className }) => {
  const { currentJob } = useJob();
  const { score: matchScore, breakdown } = useMatchScore();
  
  if (!currentJob || !currentJob.title) return null;
  
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Job Match Score</h3>
        <Button variant="outline" size="sm" asChild>
          <Link to="/job-optimizer">
            View Full Analysis <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{matchScore}%</span>
          <Badge variant={matchScore >= 80 ? "default" : "secondary"}>
            {matchScore >= 80 ? "Strong match" : "Room for improvement"}
          </Badge>
        </div>
        
        <Progress value={matchScore} className="h-2" />
        
        <p className="text-xs text-muted-foreground">
          Based on keyword overlap with "{currentJob.title}"
        </p>
        
        {breakdown && (
          <div className="pt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Required skills:</span>
              <span className="font-medium">{breakdown.requiredSkills.matched}/{breakdown.requiredSkills.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preferred skills:</span>
              <span className="font-medium">{breakdown.preferredSkills.matched}/{breakdown.preferredSkills.total}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
