import React, { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useJob } from '@/shared/contexts/JobContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useToast } from '@/shared/ui/use-toast';
import {
  getKeywordIntegrationContext,
  detectKeywordCategory,
  type KeywordIntegrationContext
} from '@/shared/lib/keywordIntegration';

interface JDKeywordHintsProps {
  currentSection: 'summary' | 'experience' | 'skills';
  className?: string;
  onKeywordSelect?: (keyword: string, suggestion: string) => void;
}

export const JDKeywordHints: React.FC<JDKeywordHintsProps> = ({
  currentSection,
  className,
  onKeywordSelect
}) => {
  const { currentJob } = useJob();
  const { resumeData } = useResume();
  const { toast } = useToast();
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);

  // Handle keyword selection - call parent callback with keyword and example
  const handleKeywordSelect = (keyword: string) => {
    const context = getKeywordIntegrationContext(keyword, detectKeywordCategory(keyword));
    const exampleSentence = context.exampleSentence;

    if (onKeywordSelect) {
      onKeywordSelect(keyword, exampleSentence);
    }

    // Also copy to clipboard for convenience
    navigator.clipboard.writeText(keyword);
    toast({
      title: 'Keyword copied',
      description: `${keyword} - ${exampleSentence}`,
      duration: 2000
    });
  };

  // Get integration context for a keyword
  const getIntegrationContext = (keyword: string): KeywordIntegrationContext => {
    const category = detectKeywordCategory(keyword);
    return getKeywordIntegrationContext(keyword, category);
  };
  
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
    handleKeywordSelect(keyword);
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
            <div key={keyword} className="relative">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs cursor-pointer transition-colors",
                  expandedKeyword === keyword
                    ? "bg-amber-200 dark:bg-amber-800 border-amber-400"
                    : "hover:bg-amber-100 dark:hover:bg-amber-900"
                )}
                onClick={() => setExpandedKeyword(
                  expandedKeyword === keyword ? null : keyword
                )}
              >
                {keyword}
                {expandedKeyword === keyword ? (
                  <ChevronUp className="w-3 h-3 ml-1" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-1" />
                )}
              </Badge>

              {/* Integration Suggestion Dropdown */}
              {expandedKeyword === keyword && (
                <div className="absolute z-10 mt-1 left-0 w-72 bg-white dark:bg-slate-900 border border-amber-200 rounded-md shadow-lg p-3">
                  <KeywordIntegrationSuggestion
                    keyword={keyword}
                    section={currentSection}
                    onCopy={() => handleCopyKeyword(keyword)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Integration Guide */}
        {missingKeywords.length > 0 && currentSection === 'experience' && (
          <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-start gap-1.5">
              <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
              <span>
                <strong>Tip:</strong> Add keywords to bullet points that mention tools,
                teams, or achievements. Example: "Led team <em>using React</em> to..."
              </span>
            </div>
          </div>
        )}

        <p className="text-xs text-amber-700 dark:text-amber-300">
          Click keyword for integration tips, or click to copy
        </p>
      </div>
    </Card>
  );
};

// Sub-component for keyword integration suggestions
interface KeywordIntegrationSuggestionProps {
  keyword: string;
  section: string;
  onCopy: () => void;
}

const KeywordIntegrationSuggestion: React.FC<KeywordIntegrationSuggestionProps> = ({
  keyword,
  section,
  onCopy
}) => {
  const context = getKeywordIntegrationContext(keyword, detectKeywordCategory(keyword));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{keyword}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
        >
          Copy
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Try these phrases:</p>
        <div className="space-y-1">
          {context.integrationPhrases.slice(0, 3).map((phrase, idx) => (
            <p key={idx} className="text-amber-700 dark:text-amber-300">
              • {phrase}...
            </p>
          ))}
        </div>
      </div>

      <div className="text-xs bg-amber-50 dark:bg-amber-950 p-2 rounded">
        <p className="font-medium mb-1">Example:</p>
        <p className="italic text-amber-800 dark:text-amber-200">
          {context.exampleSentence}
        </p>
      </div>

      {section === 'experience' && (
        <p className="text-xs text-muted-foreground">
          💡 Best for: bullet points mentioning tools or achievements
        </p>
      )}
    </div>
  );
};

export default JDKeywordHints;
