import React from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useJob } from '@/shared/contexts/JobContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useToast } from '@/shared/ui/use-toast';

interface JDKeywordHintsProps {
  currentSection: 'summary' | 'experience' | 'skills';
  className?: string;
}

export const JDKeywordHints: React.FC<JDKeywordHintsProps> = ({
  currentSection,
  className
}) => {
  const { currentJob } = useJob();
  const { resumeData } = useResume();
  const { toast } = useToast();
  
  // Return null if no JD linked or no keywords extracted
  if (!currentJob || !currentJob.extractedFields) return null;
  
  // Extract keywords from extractedFields
  const extractKeywords = () => {
    const fields = currentJob.extractedFields || [];
    const keywords = fields
      .filter(field => field.fieldType === 'skill' || field.fieldType === 'requirement')
      .map(field => field.value);
    
    return keywords;
  };
  
  // Extract relevant keywords from JD based on section
  const getSectionKeywords = () => {
    const allKeywords = extractKeywords();
    
    switch (currentSection) {
      case 'summary':
        return allKeywords.slice(0, 5);
      case 'experience':
        return allKeywords.slice(0, 5);
      case 'skills':
        return allKeywords.slice(0, 8);
      default:
        return [];
    }
  };
  
  // Extract text from resume section
  const getSectionText = () => {
    switch (currentSection) {
      case 'summary':
        return resumeData.summary || '';
      case 'experience':
        return resumeData.experience
          ?.map(exp => `${exp.title} ${exp.company} ${exp.description || ''} ${exp.bullets?.join(' ') || ''}`)
          .join(' ') || '';
      case 'skills':
        return resumeData.skills?.flatMap(cat => cat.items).join(' ') || '';
      default:
        return '';
    }
  };
  
  const sectionKeywords = getSectionKeywords();
  const sectionText = getSectionText().toLowerCase();
  
  // Find missing keywords (case-insensitive)
  const missingKeywords = sectionKeywords.filter(keyword => 
    !sectionText.includes(keyword.toLowerCase())
  );
  
  // Copy keyword to clipboard
  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast({
      title: "Copied to clipboard",
      description: `"${keyword}" copied. Add it naturally to your content.`,
      duration: 2000
    });
  };
  
  // All keywords present - show success
  if (missingKeywords.length === 0) {
    return (
      <Card className={cn("p-3 bg-green-50 dark:bg-green-950 border-green-200", className)}>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-xs text-green-700 dark:text-green-300">
            Good JD alignment! All key terms present.
          </span>
        </div>
      </Card>
    );
  }
  
  // Missing keywords - show suggestions
  return (
    <Card className={cn("p-3 bg-amber-50 dark:bg-amber-950 border-amber-200", className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
            Missing keywords from JD
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {missingKeywords.slice(0, 5).map(keyword => (
            <Badge
              key={keyword}
              variant="outline"
              className="text-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
              onClick={() => handleCopyKeyword(keyword)}
            >
              {keyword}
            </Badge>
          ))}
        </div>
        
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Click to copy. Consider adding these naturally to your content.
        </p>
      </div>
    </Card>
  );
};
