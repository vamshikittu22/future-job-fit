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
    // For demo purposes, we'll use a public demo key or fallback to mock
    // In production, this should be handled via backend/environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'demo';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async callGemini(resumeText: string, jobDescription?: string, model = "gemini-1.5-flash"): Promise<string> {
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
${jobDescription || 'N/A'}`;

      const result = await generativeModel.generateContent(`${systemPrompt}\n\n${userPrompt}`);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini API call failed:', error);
      // Fallback mock response for demo
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`### Evaluation
ATS Score: 85/100  
Missing Keywords: React, TypeScript, Node.js, API Development, Agile, Testing
Suggestions: 
• Add specific metrics and quantifiable achievements (increased performance by X%, reduced load times by Y seconds)
• Include more technical keywords from the job description to improve ATS compatibility
• Strengthen leadership and collaboration examples with concrete team size and project outcomes

### Rewritten Resume
John Smith
Senior Full-Stack Developer

PROFESSIONAL SUMMARY
Results-driven Full-Stack Developer with 5+ years of experience building scalable web applications using React, Node.js, and cloud technologies. Proven track record of delivering high-performance solutions that increased user engagement by 40% and reduced system response times by 60%.

TECHNICAL SKILLS
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, Python, RESTful APIs, GraphQL
• Database: PostgreSQL, MongoDB, Redis
• Cloud: AWS, Docker, Kubernetes, CI/CD pipelines
• Tools: Git, Jest, Webpack, Agile/Scrum methodologies

PROFESSIONAL EXPERIENCE

Senior Full-Stack Developer | TechCorp Inc. | 2021 - Present
• Led development of customer-facing web application serving 50,000+ users, resulting in 35% increase in user retention
• Implemented automated testing framework reducing bug reports by 45% and deployment time by 50%
• Collaborated with cross-functional team of 8 members to deliver 15+ features under tight deadlines
• Optimized database queries and API endpoints, improving application performance by 60%

Full-Stack Developer | StartupXYZ | 2019 - 2021
• Built responsive e-commerce platform handling 10,000+ transactions monthly
• Developed RESTful APIs and microservices architecture supporting 99.9% uptime
• Mentored 3 junior developers and conducted code reviews to maintain high code quality standards
• Integrated third-party payment systems (Stripe, PayPal) ensuring secure transaction processing

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2019

PROJECTS
• E-Commerce Dashboard: React-based admin panel with real-time analytics and inventory management
• Task Management API: Node.js microservice with JWT authentication and role-based access control`);
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
      const geminiResponse = await this.callGemini(request.resumeText, request.jobDescription, request.model);
      return this.parseGeminiResponse(geminiResponse);
    } catch (error) {
      console.error('Resume evaluation failed:', error);
      throw new Error('Failed to evaluate resume. Please try again.');
    }
  }

  private parseGeminiResponse(response: string): ResumeEvaluationResponse {
    return this.parseGPTResponse(response);
  }
}

export const resumeAI = new ResumeAIService();
