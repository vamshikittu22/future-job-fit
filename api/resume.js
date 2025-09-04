// /api/resume.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // CORS preflight
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    // Compose prompt
    const systemPrompt = `
You are an expert ATS resume builder and career coach.
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
[Resume here]
`;

    const userPrompt = `
Resume:
${resumeText}

Job Description:
${jobDescription || 'N/A'}
`;

    // Call Gemini API
    const response = await fetch('https://generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `${systemPrompt}\n${userPrompt}`,
        temperature: 0.4,
        maxOutputTokens: 1000,
      }),
    });

    const data = await response.json();

    const content = data?.candidates?.[0]?.content;

    if (!content) {
      return res.status(500).json({ error: 'No response from Gemini API' });
    }

    return res.status(200).json({ content });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
