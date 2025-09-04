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
      // Replace this URL with your actual Vercel serverless endpoint
      const response = await fetch('https://https://future-job-jo4gehj63-vamshi-krishnas-projects-7654112d.vercel.app/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) throw new Error('No GPT response content received.');
      return content;

    } catch (error) {
      console.error('GPT call failed, using mock response:', error);

      // Fallback: Mock response for testing
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`### Evaluation
ATS Score: 78/100  
Missing Keywords: TypeScript, CI/CD, GraphQL, Testing, Leadership, Agile
Suggestions: 
• Add specific metrics and quantifiable achievements (increased performance by X%, managed team of Y people)
• Include more technical keywords from the job description to improve ATS matching
• Strengthen leadership and collaboration examples with concrete results

### Rewritten Resume
John Smith
Senior Frontend Developer
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Results-driven Senior Frontend Developer with 5+ years of experience building scalable web applications. Expert in React, TypeScript, and modern JavaScript with proven leadership capabilities and strong problem-solving skills. Passionate about delivering high-quality user experiences and mentoring development teams.

TECHNICAL SKILLS
• Frontend: React, TypeScript, JavaScript (ES6+), HTML5, CSS3
• Styling: Tailwind CSS, Styled Components, SCSS, Material-UI
• Testing: Jest, Cypress, React Testing Library, Unit Testing
• Tools: Git, CI/CD pipelines, Webpack, Vite, Docker
• State Management: Redux, Zustand, Context API
• Backend: Node.js, REST APIs, GraphQL, SQL, MongoDB

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp | 2020-Present
• Developed 15+ scalable React applications serving 100K+ users, improving performance by 40%
• Led cross-functional team of 5 developers, mentoring junior staff and conducting code reviews
• Implemented TypeScript migration reducing bugs by 60% and improving developer productivity by 25%
• Collaborated with product managers and designers to deliver pixel-perfect, responsive interfaces
• Established CI/CD pipelines reducing deployment time from 2 hours to 15 minutes
• Architected micro-frontend system improving code reusability across 8 different products

Software Engineer | StartupXYZ | 2018-2020
• Built responsive frontend interfaces using React and modern CSS frameworks for 50K+ users
• Integrated REST APIs and GraphQL endpoints, optimizing database queries improving load times by 30%
• Participated in agile development process with daily standups, sprint planning, and retrospectives
• Implemented comprehensive testing suite achieving 90%+ code coverage
• Collaborated with UX/UI designers to translate wireframes into interactive web applications

EDUCATION
Bachelor of Science in Computer Science | State University | 2014-2018
GPA: 3.7/4.0

ACHIEVEMENTS & PROJECTS
• Reduced application bundle size by 35% through code splitting and lazy loading optimization
• Mentored 3 junior developers who were promoted to mid-level positions within 12 months
• Led successful migration of legacy jQuery codebase to modern React architecture
• Open source contributor with 500+ GitHub stars across personal projects`);
        }, 2000);
      });
    }
  }

  private parseGPTResponse(response: string): ResumeEvaluationResponse {
    const lines = response.split('\n');
    
    // Extract ATS Score
    const atsScoreLine = lines.find(line => line.includes('ATS Score:'));
    const atsScore = atsScoreLine ? parseInt(atsScoreLine.match(/\d+/)?.[0] || '0') : 0;
    
    // Extract Missing Keywords
    const keywordsLine = lines.find(line => line.includes('Missing Keywords:'));
    const missingKeywords = keywordsLine 
      ? keywordsLine.replace('Missing Keywords:', '').split(',').map(k => k.trim()).filter(k => k)
      : [];
    
    // Extract Suggestions
    const suggestions: string[] = [];
    let inSuggestions = false;
    for (const line of lines) {
      if (line.includes('Suggestions:')) {
        inSuggestions = true;
        continue;
      }
      if (inSuggestions && line.includes('### Rewritten Resume')) {
        break;
      }
      if (inSuggestions && line.trim().startsWith('•')) {
        suggestions.push(line.replace('•', '').trim());
      }
    }
    
    // Extract Rewritten Resume
    const resumeStartIndex = lines.findIndex(line => line.includes('### Rewritten Resume'));
    const rewrittenResume = resumeStartIndex !== -1 
      ? lines.slice(resumeStartIndex + 1).join('\n').trim()
      : '';
    
    return {
      atsScore,
      missingKeywords,
      suggestions,
      rewrittenResume
    };
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
