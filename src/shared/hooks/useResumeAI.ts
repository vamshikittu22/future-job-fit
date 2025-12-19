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
      // Minimal mapping for skills organization if needed
      // For now, returning a basic fallback or we can implement it in the service
      const raw = await resumeAI.improveContent('Skills', data.skills, 'organized');
      // If it's a string, we might need to parse. The service should return what we need.
      return null; // Update as needed if this feature is used
    } catch (error: any) {
      console.error('Error organizing skills:', error);
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
