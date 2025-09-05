import { GoogleGenerativeAI } from "@google/generative-ai";

interface ResumeEvaluationRequest {
  resumeText: string;
  jobDescription?: string;
  model?: string;
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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "demo";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async callGemini(
    resumeText: string,
    jobDescription?: string,
    model = "gemini-1.5-flash"
  ): Promise<string> {
    try {
      const generativeModel = this.genAI.getGenerativeModel({ model });

      const systemPrompt = `You are an expert ATS resume builder and career coach.
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
        request.model
      );
      return this.parseGeminiResponse(geminiResponse);
    } catch (error) {
      console.error("Resume evaluation failed:", error);
      throw new Error("Failed to evaluate resume. Please try again.");
    }
  }
}

export const resumeAI = new ResumeAIService();
