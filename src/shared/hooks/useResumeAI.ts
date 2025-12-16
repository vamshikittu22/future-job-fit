import { useState } from 'react';
import { supabase } from '@/shared/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';

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
      const { data: result, error } = await supabase.functions.invoke('resume-ai', {
        body: { type: 'summary', data },
      });

      if (error) throw error;

      return result.result as SummaryVersion[];
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
      const { data: result, error } = await supabase.functions.invoke('resume-ai', {
        body: { type: 'bullet', data },
      });

      if (error) throw error;

      return result.result as BulletEnhancement[];
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
      const { data: result, error } = await supabase.functions.invoke('resume-ai', {
        body: { type: 'skills', data },
      });

      if (error) throw error;

      return result.result as SkillsOrganization;
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
      const { data: result, error } = await supabase.functions.invoke('resume-ai', {
        body: { type: 'project', data },
      });

      if (error) throw error;

      return result.result as ProjectImpact;
    } catch (error: any) {
      console.error('Error suggesting project impact:', error);
      toast({
        title: 'Suggestion Failed',
        description: error.message || 'Failed to suggest impact. Please try again.',
        variant: 'destructive',
      });
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
