import { useState } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { resumeAI, EnhancementResponse, EnhancementRequest } from '@/shared/api/resumeAI';

export interface SummaryVersion {
  version: 'concise' | 'detailed' | 'impactful';
  tone: string;
  text: string;
  wordCount: number;
}

export interface BulletEnhancement {
  text: string;
  metrics: string[];
}

export interface SkillsOrganization {
  technical: string[];
  tools: string[];
  soft: string[];
  languages: string[];
  outdated: Array<{ skill: string; suggestion: string }>;
  duplicates: string[];
}

export interface ProjectImpact {
  suggestedMetrics: Array<{ type: string; example: string }>;
  bullets: Array<{ text: string; focus: string }>;
}

export const useResumeAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const enhanceSummary = async (data: {
    jobTitle: string;
    yearsExperience: string;
    skills: string[];
    industry?: string;
  }): Promise<SummaryVersion[] | null> => {
    setIsLoading(true);
    try {
      // Map to the new enhanceSection logic for variants
      const request: EnhancementRequest = {
        section_type: 'summary',
        original_text: `Job Title: ${data.jobTitle}, Years: ${data.yearsExperience}, Skills: ${data.skills.join(', ')}`,
        industry_keywords: data.industry,
        quick_preset: 'ATS Optimized'
      };

      const response = await resumeAI.enhanceSection(request);

      // Map global variants to the specific SummaryVersion format for the old UI
      return response.variants.map((v, i) => ({
        version: i === 0 ? 'concise' : i === 1 ? 'detailed' : 'impactful',
        tone: 'Professional',
        text: v,
        wordCount: v.split(' ').length
      }));
    } catch (error: any) {
      console.error('Error enhancing summary:', error);
      toast({
        title: 'Enhancement Failed',
        description: error.message || 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceBullet = async (data: {
    currentBullet: string;
    jobTitle: string;
    companyType?: string;
  }): Promise<BulletEnhancement[] | null> => {
    setIsLoading(true);
    try {
      const request: EnhancementRequest = {
        section_type: 'experience',
        original_text: data.currentBullet,
        target_role: data.jobTitle,
        quick_preset: 'Maximum Impact'
      };

      const response = await resumeAI.enhanceSection(request);

      return response.variants.map(v => ({
        text: v,
        metrics: [] // The service already incorporates metrics into the text
      }));
    } catch (error: any) {
      console.error('Error enhancing bullet:', error);
      toast({
        title: 'Enhancement Failed',
        description: error.message || 'Failed to enhance bullet. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const organizeSkills = async (data: {
    skills: string[];
  }): Promise<SkillsOrganization | null> => {
    setIsLoading(true);
    try {
      // Call edge function with organizeSkills task
      const request: EnhancementRequest = {
        section_type: 'skills',
        original_text: data.skills.join(', '),
        quick_preset: 'ATS Optimized',
        highlight_areas: ['categorize', 'deduplicate', 'identify-outdated']
      };

      const response = await resumeAI.enhanceSection(request);

      // Parse the AI response to extract categorized skills
      // The AI should return variants where we can parse categories from
      if (response.variants && response.variants.length > 0) {
        // Try to parse structured response from the first variant
        const firstVariant = response.variants[0];

        // Attempt to parse as JSON if the AI returned structured data
        try {
          const parsed = JSON.parse(firstVariant);
          if (parsed.technical || parsed.tools || parsed.soft || parsed.languages) {
            return {
              technical: parsed.technical || [],
              tools: parsed.tools || [],
              soft: parsed.soft || [],
              languages: parsed.languages || [],
              outdated: parsed.outdated || [],
              duplicates: parsed.duplicates || []
            };
          }
        } catch {
          // Not JSON - use intelligent categorization based on skill names
        }

        // Fallback: Intelligently categorize the skills locally
        const technical: string[] = [];
        const tools: string[] = [];
        const soft: string[] = [];
        const languages: string[] = [];
        const duplicates: string[] = [];

        // Common patterns for categorization
        const toolPatterns = /^(aws|azure|docker|kubernetes|git|jenkins|jira|figma|sketch|photoshop|vscode|vim|webpack|vite|npm|yarn|postman|slack|notion|confluence|terraform|ansible)/i;
        const languagePatterns = /^(javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|php|swift|kotlin|scala|r|sql|html|css|bash|powershell|perl|objective-c|dart|lua|matlab|assembly)/i;
        const softPatterns = /^(leadership|communication|teamwork|problem.?solving|critical.?thinking|collaboration|mentoring|agile|scrum|project.?management|time.?management|presentation|negotiation|conflict.?resolution|adaptability|creativity)/i;

        const seen = new Set<string>();

        for (const skill of data.skills) {
          const normalized = skill.trim().toLowerCase();

          // Check for duplicates
          if (seen.has(normalized)) {
            duplicates.push(skill);
            continue;
          }
          seen.add(normalized);

          // Categorize
          if (languagePatterns.test(skill)) {
            languages.push(skill);
          } else if (toolPatterns.test(skill)) {
            tools.push(skill);
          } else if (softPatterns.test(skill)) {
            soft.push(skill);
          } else {
            technical.push(skill);
          }
        }

        return {
          technical,
          tools,
          soft,
          languages,
          outdated: [], // Would need AI to identify outdated tech
          duplicates
        };
      }

      // If no variants, return null
      toast({
        title: 'Organization Failed',
        description: 'Could not organize skills. Please try again.',
        variant: 'destructive',
      });
      return null;
    } catch (error: any) {
      console.error('Error organizing skills:', error);
      toast({
        title: 'Organization Failed',
        description: error.message || 'Failed to organize skills. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const suggestProjectImpact = async (data: {
    projectName: string;
    description: string;
    technologies: string[];
  }): Promise<ProjectImpact | null> => {
    setIsLoading(true);
    try {
      return null; // Update as needed
    } catch (error: any) {
      console.error('Error suggesting project impact:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    enhanceSummary,
    enhanceBullet,
    organizeSkills,
    suggestProjectImpact,
  };
};
