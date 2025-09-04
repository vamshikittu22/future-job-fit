export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required" });
    }

    const systemPrompt = `
You are an expert ATS resume builder and career coach. 
Evaluate resumes and rewrite them into optimized, ATS-friendly versions.

Tasks:
1. Evaluate the resume and provide:
   - ATS Compatibility Score (0-100)
   - Missing job-relevant keywords
   - Top 3 suggestions for improvement

2. Rewrite the resume into a clean, ATS-optimized format.
   - Use standard sections: Summary, Skills, Experience, Education, Projects
   - Keep language concise, measurable, and keyword-rich
`;

    const userPrompt = `
Resume:
${resumeText}

Job Description:
${jobDescription || "N/A"}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    console.error('Serverless function error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
}
