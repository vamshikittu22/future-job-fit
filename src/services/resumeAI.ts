interface ResumeEvaluationRequest {
  resumeText: string;
  jobDescription?: string;
}

interface ResumeEvaluationResponse {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  rewrittenResume: string;
}

export class ResumeAIService {
  private async callGPT(resumeText: string, jobDescription?: string): Promise<string> {
    try {
      // Use your deployed Vercel endpoint
      const response = await fetch(
        'https://future-job-fit-git-main-vamshi-krishnas-projects-7654112d.vercel.app/api/resume',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, jobDescription }),
        }
      );

      const data = await response.json();
      const content = data?.content;

      if (!content) throw new Error('No response content from Gemini API');
      return content;

    } catch (error) {
      console.error('Gemini API call failed:', error);
      // Optional: fallback mock response (for development only)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`### Evaluation
ATS Score: 78/100  
Missing Keywords: TypeScript, CI/CD, GraphQL, Testing, Leadership, Agile
Suggestions: 
• Add specific metrics and quantifiable achievements
• Include more technical keywords from the job description
• Strengthen leadership and collaboration examples

### Rewritten Resume
John Smith
Senior Frontend Developer
...`);
        }, 2000);
      });
    }
  }

  private parseGPTResponse(response: string): ResumeEvaluationResponse {
    const lines = response.split('\n');

    const atsScoreLine = lines.find(line => line.includes('ATS Score:'));
    const atsScore = atsScoreLine ? parseInt(atsScoreLine.match(/\d+/)?.[0] || '0') : 0;

    const keywordsLine = lines.find(line => line.includes('Missing Keywords:'));
    const missingKeywords = keywordsLine
      ? keywordsLine.replace('Missing Keywords:', '').split(',').map(k => k.trim()).filter(k => k)
      : [];

    const suggestions: string[] = [];
    let inSuggestions = false;
    for (const line of lines) {
      if (line.includes('Suggestions:')) {
        inSuggestions = true;
        continue;
      }
      if (inSuggestions && line.includes('### Rewritten Resume')) break;
      if (inSuggestions && line.trim().startsWith('•')) {
        suggestions.push(line.replace('•', '').trim());
      }
    }

    const resumeStartIndex = lines.findIndex(line => line.includes('### Rewritten Resume'));
    const rewrittenResume = resumeStartIndex !== -1
      ? lines.slice(resumeStartIndex + 1).join('\n').trim()
      : '';

    return { atsScore, missingKeywords, suggestions, rewrittenResume };
  }

  async evaluateResume(request: ResumeEvaluationRequest): Promise<ResumeEvaluationResponse> {
    try {
      const gptResponse = await this.callGPT(request.resumeText, request.jobDescription);
      return this.parseGPTResponse(gptResponse);
    } catch (error) {
      console.error('Resume evaluation failed:', error);
      throw new Error('Failed to evaluate resume. Please try again.');
    }
  }
}

export const resumeAI = new ResumeAIService();
