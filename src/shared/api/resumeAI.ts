import { supabase } from '@/shared/integrations/supabase/client';

export type AIProvider = 'openai' | 'gemini' | 'groq';

export interface EnhancementRequest {
  section_type: 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'achievements' | 'certifications';
  original_text: string;
  quick_preset?: 'ATS Optimized' | 'Concise Professional' | 'Maximum Impact' | null;
  tone_style?: string[];
  highlight_areas?: string[];
  industry_keywords?: string;
  restrictions?: string;
  job_description?: string;
  target_role?: string;
}

export interface EnhancementResponse {
  section_type: string;
  preset_used: string | null;
  applied_tone_style: string[];
  applied_highlight_areas: string[];
  variants: string[];
  notes?: string;
}

interface ResumeEvaluationRequest {
  resumeText: string;
  jobDescription?: string;
  model?: string;
  customInstructions?: any;
}

interface ResumeEvaluationResponse {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  rewrittenResume: string;
}

export class ResumeAIService {
  private provider: AIProvider;
  private demoMode: boolean = false;

  constructor() {
    // Get provider from environment or default to gemini
    const provider = import.meta.env.VITE_AI_PROVIDER?.trim();
    this.provider = (provider as AIProvider) || 'gemini';

    // Check if demo mode is enabled (no real API calls)
    this.demoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true';

    console.log(`[AI Service] Using provider: ${this.provider} ${this.demoMode ? '(DEMO MODE)' : '(server-side via Supabase Edge Function)'}`);
  }

  public get isDemoMode(): boolean {
    return this.demoMode;
  }

  public get currentProvider(): AIProvider {
    return this.provider;
  }

  /**
   * Calls the Supabase Edge Function for AI operations
   * All API keys are securely stored on the server
   */
  private async callEdgeFunction(task: string, data: any): Promise<any> {
    // If demo mode is enabled, return mock responses
    if (this.demoMode) {
      console.log(`[AI Service] Demo mode - returning mock response for: ${task}`);
      return this.getDemoResponse(task, data);
    }

    try {
      const { data: result, error } = await supabase.functions.invoke('resume-ai', {
        body: {
          task,
          provider: this.provider,
          ...data,
        },
      });

      if (error) {
        throw new Error(error.message || 'Edge function call failed');
      }

      return result;
    } catch (error) {
      console.error('[AI Service] Edge function error:', error);

      // If edge function fails, fall back to demo mode
      console.log('[AI Service] Falling back to demo mode');
      return this.getDemoResponse(task, data);
    }
  }

  /**
   * Demo mode responses for testing without Supabase
   */
  private getDemoResponse(task: string, data: any): any {
    if (task === 'enhanceSection') {
      const original = data.original_text || '';

      // Basic lexical variations for demo mode
      const variants = [
        original.replace(/Experienced/i, 'A seasoned').replace(/Building/i, 'Architecting').replace(/Expert/i, 'Strategist'),
        `Accomplished professional with a proven track record in ${original.toLowerCase()}.`,
        `Dynamic individual leveraging expertise to drive results in ${original.toLowerCase()}.`,
        `Focused on delivering high-quality solutions through ${original.toLowerCase()}.`
      ];

      return {
        section_type: data.section_type,
        preset_used: data.quick_preset || null,
        applied_tone_style: data.tone_style || [],
        applied_highlight_areas: data.highlight_areas || [],
        variants: variants,
        notes: 'Demo mode: These are sample enhancements. Connect Supabase for AI-powered results.'
      };
    }

    if (task === 'analyzeSection') {
      return {
        score: 75,
        strengths: ['Clear structure', 'Good use of action verbs', 'Relevant keywords present'],
        weaknesses: ['Could add more metrics', 'Consider stronger opening statement'],
        suggestions: ['Add 2-3 quantifiable achievements', 'Include industry-specific keywords']
      };
    }

    if (task === 'evaluateResume') {
      return {
        atsScore: 78,
        missingKeywords: ['leadership', 'agile', 'cross-functional'],
        suggestions: [
          'Add more quantifiable achievements',
          'Include relevant certifications',
          'Use stronger action verbs at the start of each bullet'
        ],
        rewrittenResume: data.resumeText || ''
      };
    }

    return { message: 'Demo mode active' };
  }

  async enhanceSection(request: EnhancementRequest): Promise<EnhancementResponse> {
    try {
      console.log(`[AI Service] Enhancing section: ${request.section_type}`);

      const result = await this.callEdgeFunction('enhanceSection', request);

      return result;
    } catch (error: any) {
      console.error('[AI Service] Enhancement failed:', error);

      // Return fallback with error message
      return this.getFallbackEnhancement(request, error.message);
    }
  }

  async analyzeSection(sectionId: string, content: any): Promise<any> {
    try {
      const result = await this.callEdgeFunction('analyzeSection', {
        sectionId,
        content: typeof content === 'string' ? content : JSON.stringify(content),
      });

      return result;
    } catch (error) {
      console.error('[AI Service] Section analysis failed:', error);

      // Return fallback analysis
      return {
        score: 70,
        strengths: ['Content is present'],
        weaknesses: ['AI analysis failed/unavailable'],
        suggestions: ['Check your API settings or try again later'],
      };
    }
  }

  async evaluateResume(request: ResumeEvaluationRequest): Promise<ResumeEvaluationResponse> {
    try {
      const result = await this.callEdgeFunction('evaluateResume', {
        resumeText: request.resumeText,
        jobDescription: request.jobDescription,
      });

      return result;
    } catch (error) {
      console.error('[AI Service] Resume evaluation failed:', error);

      // Return fallback evaluation
      return {
        atsScore: 75,
        missingKeywords: [],
        suggestions: ['AI evaluation unavailable', 'Please try again later'],
        rewrittenResume: request.resumeText,
      };
    }
  }

  // Legacy compatibility method
  async improveContent(sectionName: string, content: any, tone: string): Promise<any> {
    const request: EnhancementRequest = {
      section_type: sectionName.toLowerCase() as any,
      original_text: typeof content === 'string' ? content : JSON.stringify(content),
      tone_style: [tone],
    };

    const response = await this.enhanceSection(request);
    return response.variants[0] || content; // Return first variant or original
  }

  private getFallbackEnhancement(request: EnhancementRequest, errorMessage?: string): EnhancementResponse {
    return {
      section_type: request.section_type,
      preset_used: request.quick_preset || null,
      applied_tone_style: request.tone_style || [],
      applied_highlight_areas: request.highlight_areas || [],
      variants: [],
      notes: errorMessage || 'AI Service is currently unavailable. Please check your connection and try again.',
    };
  }
}

export const resumeAI = new ResumeAIService();
