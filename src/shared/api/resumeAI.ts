import { supabase } from '@/shared/integrations/supabase/client';
import type {
  JobDescriptionModel,
  ATSEvaluationResponse
} from '@/shared/types/ats';
import { trackAICall, initAISession } from '@/shared/lib/ai/costTracker';
import { trackEvent, AnalyticsEvent } from '@/shared/lib/analytics';

// Initialize AI session tracking on module load
initAISession();

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
  matchingKeywords?: string[];
  suggestions: string[];
  improvements?: string[];
  rewrittenResume: string;
}

export class ResumeAIService {
  private provider: AIProvider;
  private demoMode: boolean = false;
  private offlineMode: boolean = false;
  private offlineParserUrl: string;
  private offlineParserHealthy: boolean = false;

  constructor() {
    // Get provider from environment or default to gemini
    const provider = import.meta.env.VITE_AI_PROVIDER?.trim();
    this.provider = (provider as AIProvider) || 'gemini';

    // Check if demo mode is enabled (no real API calls)
    this.demoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true';

    // Check if offline parser mode is enabled
    this.offlineMode = import.meta.env.VITE_OFFLINE_PARSER === 'true';
    this.offlineParserUrl = import.meta.env.VITE_OFFLINE_PARSER_URL || 'http://localhost:8000';

    console.log(`[AI Service] Using provider: ${this.provider} ${this.demoMode ? '(DEMO MODE)' : this.offlineMode ? '(OFFLINE PARSER MODE)' : '(server-side via Supabase Edge Function)'}`);

    // Check offline parser health on startup if enabled
    if (this.offlineMode) {
      this.checkOfflineParserHealth();
    }
  }

  public get isDemoMode(): boolean {
    return this.demoMode;
  }

  public get currentProvider(): AIProvider {
    return this.provider;
  }

  public get isOfflineMode(): boolean {
    return this.offlineMode && this.offlineParserHealthy;
  }

  public get offlineParserStatus(): 'healthy' | 'unhealthy' | 'disabled' {
    if (!this.offlineMode) return 'disabled';
    return this.offlineParserHealthy ? 'healthy' : 'unhealthy';
  }

  /**
   * Check if offline parser is available
   */
  private async checkOfflineParserHealth(): Promise<void> {
    try {
      const response = await fetch(`${this.offlineParserUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (response.ok) {
        const data = await response.json();
        this.offlineParserHealthy = data.status === 'healthy';
        console.log(`[AI Service] Offline parser health: ${data.status}`);
      } else {
        this.offlineParserHealthy = false;
        console.warn(`[AI Service] Offline parser check failed on ${this.offlineParserUrl}. Falling back to Cloud LLM.`);
      }
    } catch (error) {
      this.offlineParserHealthy = false;
      console.warn(`[AI Service] Offline parser not responding at ${this.offlineParserUrl}. Ensure it's running via 'cd offline-parser && python main.py'. Error:`, error);
    }
  }

  /**
   * Call the offline parser service
   */
  private async callOfflineParser(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.offlineParserUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `Offline parser request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Check if user has provided their own API key for this session
   */
  private getSessionAPIKey(): { provider: AIProvider; apiKey: string } | null {
    try {
      const stored = sessionStorage.getItem('user_api_key_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.apiKey) {
          return { provider: parsed.provider, apiKey: parsed.apiKey };
        }
      }
    } catch (e) {
      // Session storage not available
    }
    return null;
  }

  /**
   * Make direct API call to Gemini with user's API key
   */
  private async callGeminiDirect(apiKey: string, task: string, data: any): Promise<any> {
    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    let prompt = '';
    if (task === 'enhanceSection') {
      prompt = `You are a professional resume writer. Enhance the following ${data.section_type} section.
Original text: ${data.original_text}
${data.quick_preset ? `Style: ${data.quick_preset}` : ''}
${data.tone_style?.length ? `Tone: ${data.tone_style.join(', ')}` : ''}
${data.industry_keywords ? `Include keywords: ${data.industry_keywords}` : ''}

Provide 3 enhanced variants. Return as JSON: {"variants": ["variant1", "variant2", "variant3"], "notes": "brief explanation"}`;
    } else if (task === 'analyzeSection') {
      prompt = `Analyze this resume section and provide feedback.
Content: ${data.content}

Return as JSON: {"score": 0-100, "strengths": ["..."], "weaknesses": ["..."], "suggestions": ["..."]}`;
    } else if (task === 'evaluateResume') {
      prompt = `Evaluate this resume for ATS compatibility.
Resume: ${data.resumeText}
${data.jobDescription ? `Job Description: ${data.jobDescription}` : ''}

Return as JSON: {"atsScore": 0-100, "missingKeywords": ["..."], "suggestions": ["..."]}`;
    }

    const response = await fetch(`${baseUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API call failed');
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('[AI Service] Failed to parse Gemini response as JSON');
    }

    // Fallback response structure
    if (task === 'enhanceSection') {
      return { variants: [text], notes: 'Direct API response' };
    }
    return { message: text };
  }

  /**
   * Calls the Supabase Edge Function for AI operations
   * Or uses user's API key for direct calls if available
   */
  private async callEdgeFunction(task: string, data: any): Promise<any> {
    // Check for user-provided API key first
    const sessionKey = this.getSessionAPIKey();
    if (sessionKey) {
      console.log(`[AI Service] Using user-provided ${sessionKey.provider} API key`);
      try {
        if (sessionKey.provider === 'gemini') {
          return await this.callGeminiDirect(sessionKey.apiKey, task, data);
        }
        // Add other providers here (OpenAI, Groq) as needed
        console.warn(`[AI Service] Direct API calls not yet implemented for: ${sessionKey.provider}`);
      } catch (error: any) {
        console.error('[AI Service] Direct API call failed:', error.message);
        // Don't fall through to edge function, return error to user
        throw error;
      }
    }

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
      const original = data.resumeText || '';
      const missing = ['Cloud Architecture', 'Agile Methodology', 'Team Leadership'];

      // Basic simulated optimization for demo mode
      let optimized = original;
      if (original.toLowerCase().includes('skills')) {
        optimized = original.replace(/skills/i, `SKILLS\n${missing.join(', ')}, `);
      } else {
        optimized = `${original}\n\nSKILLS\n${missing.join(', ')}`;
      }

      return {
        atsScore: 78,
        missingKeywords: missing,
        suggestions: [
          'Add more quantifiable achievements to your experience bullets',
          'Include relevant certifications for Cloud Architecture',
          'Use stronger action verbs at the start of each bullet (e.g., Orchestrated instead of Worked)'
        ],
        rewrittenResume: optimized,
        improvements: ['Injected critical industry keywords', 'Reformated skills for ATS scanning']
      };
    }

    return { message: 'Demo mode active' };
  }

  async enhanceSection(request: EnhancementRequest): Promise<EnhancementResponse> {
    const startTime = performance.now();
    
    try {
      console.log(`[AI Service] Enhancing section: ${request.section_type}`);

      const result = await this.callEdgeFunction('enhanceSection', request);
      const duration = performance.now() - startTime;
      
      // Track cost (ESTIMATED)
      trackAICall(
        this.provider,
        'gemini-1.5-flash',
        'enhance_section',
        request.original_text,
        JSON.stringify(result.variants),
        duration,
        true
      );
      
      // Track event (metadata only, no content)
      trackEvent(AnalyticsEvent.AI_ENHANCE_USED, {
        section_type: request.section_type,
        provider: this.provider,
        demo_mode: this.demoMode
      });

      return result;
    } catch (error: any) {
      const duration = performance.now() - startTime;
      
      trackAICall(
        this.provider,
        'gemini-1.5-flash',
        'enhance_section',
        request.original_text,
        '',
        duration,
        false,
        String(error)
      );
      
      trackEvent(AnalyticsEvent.AI_ERROR, {
        operation: 'enhance_section',
        error_type: this.categorizeError(error)
      });
      
      console.error('[AI Service] Enhancement failed:', error);

      // Return fallback with error message
      return this.getFallbackEnhancement(request, error.message);
    }
  }

  async analyzeSection(sectionId: string, content: any): Promise<any> {
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const startTime = performance.now();

    // Try offline parser first if available
    if (this.isOfflineMode) {
      try {
        console.log('[AI Service] Using offline parser for section analysis');
        const scoreResult = await this.callOfflineParser('/score-ats', {
          resumeText: contentStr
        });
        
        const duration = performance.now() - startTime;
        trackAICall(
          'offline',
          'local-parser',
          'analyze_section',
          contentStr,
          JSON.stringify(scoreResult),
          duration,
          true
        );

        return {
          score: scoreResult.score,
          strengths: [
            `Keyword match: ${scoreResult.breakdown.keywordMatch}%`,
            `Format score: ${scoreResult.breakdown.formatScore}%`,
            `Readability: ${scoreResult.breakdown.readability}%`
          ],
          weaknesses: scoreResult.suggestions.slice(0, 2),
          suggestions: scoreResult.suggestions,
          source: 'offline'
        };
      } catch (error) {
        console.warn('[AI Service] Offline parser failed, falling back to LLM:', error);
      }
    }

    try {
      const result = await this.callEdgeFunction('analyzeSection', {
        sectionId,
        content: contentStr,
      });
      
      const duration = performance.now() - startTime;
      trackAICall(
        this.provider,
        'gemini-1.5-flash',
        'analyze_section',
        contentStr,
        JSON.stringify(result),
        duration,
        true
      );

      return { ...result, source: 'llm' };
    } catch (error) {
      const duration = performance.now() - startTime;
      trackAICall(
        this.provider,
        'gemini-1.5-flash',
        'analyze_section',
        contentStr,
        '',
        duration,
        false,
        String(error)
      );
      
      trackEvent(AnalyticsEvent.AI_ERROR, {
        operation: 'analyze_section',
        error_type: this.categorizeError(error)
      });
      
      console.error('[AI Service] Section analysis failed:', error);

      // Return fallback analysis
      return {
        score: 70,
        strengths: ['Content is present'],
        weaknesses: ['AI analysis failed/unavailable'],
        suggestions: ['Check your API settings or try again later'],
        source: 'fallback'
      };
    }
  }

  async evaluateResume(request: ResumeEvaluationRequest): Promise<ResumeEvaluationResponse & { source?: string }> {
    const startTime = performance.now();
    
    // Try offline parser first if available
    if (this.isOfflineMode) {
      try {
        console.log('[AI Service] Using offline parser for resume evaluation');

        // Parse resume structure
        const parseResult = await this.callOfflineParser('/parse-resume', {
          text: request.resumeText
        });

        // Match keywords against job description
        let matchResult = { matched: [], missing: [], matchRatio: 0 };
        if (request.jobDescription) {
          matchResult = await this.callOfflineParser('/match-keywords', {
            resumeText: request.resumeText,
            jobDescription: request.jobDescription
          });
        }

        // Score ATS compatibility
        const scoreResult = await this.callOfflineParser('/score-ats', {
          parsedResume: parseResult,
          resumeText: request.resumeText,
          jobDescription: request.jobDescription
        });
        
        const duration = performance.now() - startTime;
        trackAICall(
          'offline',
          'local-parser',
          'evaluate_resume',
          request.resumeText + (request.jobDescription || ''),
          JSON.stringify({ scoreResult, matchResult }),
          duration,
          true
        );

        return {
          atsScore: scoreResult.score,
          missingKeywords: matchResult.missing,
          matchingKeywords: matchResult.matched,
          suggestions: scoreResult.suggestions,
          improvements: scoreResult.suggestions.slice(0, 3), // Alias suggestions as improvements
          rewrittenResume: request.resumeText, // No rewrite in offline mode
          source: 'offline'
        };
      } catch (error) {
        console.warn('[AI Service] Offline parser failed, falling back to LLM:', error);
      }
    }

    try {
      const result = await this.callEdgeFunction('evaluateResume', {
        resumeText: request.resumeText,
        jobDescription: request.jobDescription,
      });
      
      const duration = performance.now() - startTime;
      trackAICall(
        this.provider,
        'gemini-1.5-flash',
        'evaluate_resume',
        request.resumeText + (request.jobDescription || ''),
        JSON.stringify(result),
        duration,
        true
      );
      
      trackEvent(AnalyticsEvent.AI_ATS_SCORED, {
        provider: this.provider,
        has_jd: !!request.jobDescription,
        demo_mode: this.demoMode
      });

      return { ...result, source: 'llm' };
    } catch (error) {
      const duration = performance.now() - startTime;
      trackAICall(
        this.provider,
        'gemini-1.5-flash',
        'evaluate_resume',
        request.resumeText + (request.jobDescription || ''),
        '',
        duration,
        false,
        String(error)
      );
      
      trackEvent(AnalyticsEvent.AI_ERROR, {
        operation: 'evaluate_resume',
        error_type: this.categorizeError(error)
      });
      
      console.error('[AI Service] Resume evaluation failed:', error);

      // Return fallback evaluation
      return {
        atsScore: 75,
        missingKeywords: [],
        suggestions: ['AI evaluation unavailable', 'Please try again later'],
        rewrittenResume: request.resumeText,
        source: 'fallback'
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

  private categorizeError(error: unknown): string {
    const message = String(error).toLowerCase();
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('rate')) return 'rate_limit';
    if (message.includes('network')) return 'network';
    return 'unknown';
  }

  /**
   * Rewrite a single bullet point to incorporate a specific keyword
   */
  async rewriteBulletWithKeyword(request: {
    originalBullet: string;
    keyword: string;
    context?: string;
  }): Promise<{ rewrittenBullet: string }> {
    console.log(`[AI Service] Rewriting bullet with keyword: ${request.keyword}`);

    // Check for user-provided API key first
    const sessionKey = this.getSessionAPIKey();
    if (sessionKey && sessionKey.provider === 'gemini') {
      try {
        const prompt = `You are a professional resume writer. Rewrite this resume bullet point to naturally incorporate the keyword "${request.keyword}".

Original bullet point: "${request.originalBullet}"

Rules:
1. Keep the same meaning and achievements
2. Naturally integrate the keyword - don't just append it
3. Maintain professional tone
4. Keep similar length
5. Use strong action verbs

Return ONLY the rewritten bullet point, nothing else.`;

        const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        const response = await fetch(`${baseUrl}?key=${sessionKey.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7 }
          })
        });

        if (response.ok) {
          const result = await response.json();
          const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (text) {
            return { rewrittenBullet: text };
          }
        }
      } catch (error) {
        console.warn('[AI Service] Direct Gemini call failed for bullet rewrite:', error);
      }
    }

    // Try edge function
    if (!this.demoMode) {
      try {
        const result = await this.callEdgeFunction('rewriteBullet', {
          originalBullet: request.originalBullet,
          keyword: request.keyword,
          context: request.context
        });
        if (result?.rewrittenBullet) {
          return result;
        }
      } catch (error) {
        console.warn('[AI Service] Edge function failed for bullet rewrite:', error);
      }
    }

    // Fallback: More intelligent semantic insertion
    const bullet = request.originalBullet;
    const keyword = request.keyword;
    const kwTitle = keyword.charAt(0).toUpperCase() + keyword.slice(1);

    let rewritten = bullet.trim();

    // Semantic replacement patterns
    if (rewritten.toLowerCase().includes('experience')) {
      rewritten = rewritten.replace(/experience/i, `experience in ${kwTitle}`);
    } else if (rewritten.toLowerCase().includes('developed')) {
      rewritten = rewritten.replace(/developed/i, `developed ${kwTitle}-driven`);
    } else if (rewritten.toLowerCase().includes('expertise')) {
      rewritten = rewritten.replace(/expertise/i, `expertise in ${kwTitle}`);
    } else if (rewritten.toLowerCase().includes('using')) {
      rewritten = rewritten.replace(/using/i, `using ${kwTitle} and`);
    } else {
      // Append naturally
      const suffix = ` utilizing ${kwTitle}`;
      if (rewritten.endsWith('.')) {
        rewritten = rewritten.slice(0, -1) + suffix + ".";
      } else {
        rewritten = rewritten + suffix + ".";
      }
    }

    return { rewrittenBullet: rewritten };
  }

  // =============================================================================
  // NEW ATS V2 METHODS - Deterministic, structured ATS evaluation
  // =============================================================================

  /**
   * Parse a job description into a structured model with categorized keywords.
   * Uses the cloud Edge Function for processing.
   * This is deterministic (no LLM involved in the core parsing).
   */
  async parseJDCloud(rawText: string): Promise<JobDescriptionModel> {
    console.log('[AI Service] Parsing JD via cloud');

    try {
      const result = await this.callEdgeFunction('parseJD', { rawText });
      return result as JobDescriptionModel;
    } catch (error: any) {
      console.error('[AI Service] Cloud JD parsing failed:', error);
      throw new Error(`Failed to parse job description: ${error.message}`);
    }
  }

  /**
   * Full ATS evaluation using the cloud Edge Function.
   * Parses JD, matches keywords, calculates score, and generates recommendations.
   * This is deterministic (no LLM involved in scoring/matching).
   * 
   * @param resumeText - The resume text content
   * @param jobDescriptionText - The job description text content
   * @returns Complete ATS evaluation response with breakdown and recommendations
   */
  async evaluateATSCloud(
    resumeText: string,
    jobDescriptionText: string
  ): Promise<ATSEvaluationResponse> {
    console.log('[AI Service] Evaluating ATS via cloud (deterministic)');

    try {
      const result = await this.callEdgeFunction('evaluateATS', {
        resumeText,
        jobDescriptionText
      });
      return result as ATSEvaluationResponse;
    } catch (error: any) {
      console.error('[AI Service] Cloud ATS evaluation failed:', error);
      throw new Error(`Failed to evaluate ATS: ${error.message}`);
    }
  }
}

export const resumeAI = new ResumeAIService();
