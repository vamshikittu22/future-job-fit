import { GoogleGenerativeAI } from "@google/generative-ai";

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
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "demo").trim();
    console.log("Gemini key loaded:", import.meta.env.VITE_GEMINI_API_KEY);

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async callGemini(
    resumeText: string,
    jobDescription?: string,
    model = "gemini-1.5-flash",
    customInstructions?: any
  ): Promise<string> {
    try {
      const generativeModel = this.genAI.getGenerativeModel({ model });

      let systemPrompt = `You are an expert ATS resume builder and career coach.
Evaluate resumes and rewrite them into optimized, ATS-friendly versions.

Tasks:
1. Evaluate the resume and provide:
   - ATS Compatibility Score (0-100)
   - Missing job-relevant keywords (from the job description if provided)
   - Top 3 suggestions for improvement (bullets, metrics, formatting)

2. Rewrite the resume into a clean, ATS-optimized format.
   - Use standard sections: Summary, Skills, Experience, Education, Projects
   - Keep language concise, measurable, and keyword-rich
   - Tailor to the Job Description if provided

Format your response as:

### Evaluation
ATS Score: X/100  
Missing Keywords: …  
Suggestions: …  

### Rewritten Resume
[Resume here]`;

      // Add custom instructions if provided
      if (customInstructions) {
        systemPrompt += `\n\nAdditional Custom Instructions:`;

        if (customInstructions.resumeLength) {
          systemPrompt += `\n- Target resume length: ${customInstructions.resumeLength} page(s)`;
        }

        if (customInstructions.selectedTags?.length > 0) {
          systemPrompt += `\n- Emphasize these areas: ${customInstructions.selectedTags.join(', ')}`;
        }

        if (customInstructions.targetAudience) {
          systemPrompt += `\n- Target audience: ${customInstructions.targetAudience}`;
        }

        if (customInstructions.leadershipGoals) {
          systemPrompt += `\n- Leadership focus: ${customInstructions.leadershipGoals}`;
        }

        if (customInstructions.metrics) {
          systemPrompt += `\n- Metrics emphasis: ${customInstructions.metrics}`;
        }

        if (customInstructions.summaryCount) {
          systemPrompt += `\n- Professional summary bullets: ${customInstructions.summaryCount}`;
        }

        if (customInstructions.projectCount) {
          systemPrompt += `\n- Maximum projects to include: ${customInstructions.projectCount}`;
        }

        if (customInstructions.prdrAllocation) {
          const allocations = Object.entries(customInstructions.prdrAllocation)
            .map(([key, value]) => `${key}: ${value}%`)
            .join(', ');
          systemPrompt += `\n- Skill emphasis allocation: ${allocations}`;
        }

        if (customInstructions.customInstructions) {
          systemPrompt += `\n- Custom guidance: ${customInstructions.customInstructions}`;
        }
      }

      const userPrompt = `Resume:
${resumeText}

Job Description:
${jobDescription || "N/A"}`;

      const result = await generativeModel.generateContent(
        `${systemPrompt}\n\n${userPrompt}`
      );

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API call failed:", error);
      return "### Evaluation\nATS Score: 0/100\nMissing Keywords: []\nSuggestions: []\n\n### Rewritten Resume\n[Error parsing resume]";
    }
  }

  private parseGeminiResponse(response: string): ResumeEvaluationResponse {
    const lines = response.split("\n");

    const atsScoreLine = lines.find((line) => line.includes("ATS Score:"));
    const atsScore = atsScoreLine
      ? parseInt(atsScoreLine.match(/\d+/)?.[0] || "0")
      : 0;

    const keywordsLine = lines.find((line) =>
      line.includes("Missing Keywords:")
    );
    const missingKeywords = keywordsLine
      ? keywordsLine
        .replace("Missing Keywords:", "")
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)
      : [];

    const suggestions: string[] = [];
    let inSuggestions = false;
    for (const line of lines) {
      if (line.includes("Suggestions:")) {
        inSuggestions = true;
        continue;
      }
      if (inSuggestions && line.includes("### Rewritten Resume")) break;
      if (inSuggestions && line.trim().startsWith("•")) {
        suggestions.push(line.replace("•", "").trim());
      }
    }

    const resumeStartIndex = lines.findIndex((line) =>
      line.includes("### Rewritten Resume")
    );
    const rewrittenResume =
      resumeStartIndex !== -1
        ? lines.slice(resumeStartIndex + 1).join("\n").trim()
        : "";

    return { atsScore, missingKeywords, suggestions, rewrittenResume };
  }

  async evaluateResume(
    request: ResumeEvaluationRequest
  ): Promise<ResumeEvaluationResponse> {
    try {
      const geminiResponse = await this.callGemini(
        request.resumeText,
        request.jobDescription,
        request.model,
        request.customInstructions
      );
      return this.parseGeminiResponse(geminiResponse);
    } catch (error) {
      console.error("Resume evaluation failed:", error);
      throw new Error("Failed to evaluate resume. Please try again.");
    }
  }

  async analyzeSection(sectionName: string, content: any): Promise<any> {
    try {
      const prompt = `
        Analyze the following resume section (${sectionName}) and provide feedback.
        Return ONLY valid JSON with this structure:
        {
          "score": number (0-100),
          "strengths": string[],
          "weaknesses": string[],
          "suggestions": string[]
        }

        Content to analyze:
        ${JSON.stringify(content, null, 2)}
      `;

      if (this.genAI.apiKey === 'demo' || !this.genAI.apiKey) {
        throw new Error('Demo mode');
      }

      const result = await this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent(prompt);
      const text = await result.response.text();
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (error) {
      console.warn(`Failed to analyze section ${sectionName} (using fallback):`, error);
      // Fallback mock response
      return {
        score: 75,
        strengths: ["Clear structure", "Good use of basics"],
        weaknesses: ["Lacks quantifiable metrics", "Could be more specific"],
        suggestions: ["Add numbers to show impact", "Use stronger action verbs", "Tailor to the job description"]
      };
    }
  }

  async improveContent(sectionName: string, content: any, tone: string = 'professional'): Promise<any> {
    try {
      const prompt = `
        Rewrite the following resume section (${sectionName}) to be more ${tone}.
        Improve clarity, impact, and fix grammar.
        Return ONLY valid JSON with the improved content matching the original structure.

        Original Content:
        ${JSON.stringify(content, null, 2)}
      `;

      if (this.genAI.apiKey === 'demo' || !this.genAI.apiKey) {
        throw new Error('Demo mode');
      }

      const result = await this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent(prompt);
      const text = await result.response.text();
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (error) {
      console.warn(`Failed to improve section ${sectionName} (using fallback):`, error);

      // Smart Fallback strategy for Demo Mode
      if (typeof content === 'string') {
        // Improve Summary/Text by swapping weak verbs
        let improved = content
          .replace(/\b(worked on|worked with)\b/gi, "collaborated on")
          .replace(/\b(helped)\b/gi, "facilitated")
          .replace(/\b(led|managed)\b/gi, "spearheaded")
          .replace(/\b(created|made)\b/gi, "engineered")
          .replace(/\b(changed)\b/gi, "transformed")
          .replace(/\b(good)\b/gi, "exceptional");

        return improved;

      } else if (Array.isArray(content)) {
        // Improve Experience/Projects in Demo Mode
        return content.map((item: any) => ({
          ...item,
          description: item.description
            ? item.description
              .replace(/\b(responsibility included|duties were)\b/gi, "Key achievements included")
              .replace(/\b(worked on)\b/gi, "executed")
              .replace(/\b(helped)\b/gi, "assisted")
            : ""
        }));
      } else if (typeof content === 'object') {
        return content;
      }
      throw error;
    }
  }
}

export const resumeAI = new ResumeAIService();
