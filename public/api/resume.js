import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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
   - Missing job-relevant keywords (from the job description if provided)
   - Top 3 suggestions for improvement (bullets, metrics, formatting)

2. Rewrite the resume into a clean, ATS-optimized format.
   - Use standard sections: Summary, Skills, Experience, Education, Projects
   - Keep language concise, measurable, and keyword-rich
   - Tailor to the Job Description if provided

Format your response as:

### Evaluation
ATS Score: X/100  
Missing Keywords: keyword1, keyword2, keyword3  
Suggestions: 
• Suggestion 1
• Suggestion 2
• Suggestion 3

### Rewritten Resume
[Resume here]
`;

    const userPrompt = `Resume:\n${resumeText}\n${jobDescription ? `Job Description:\n${jobDescription}` : ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "";

    res.status(200).json({ result: message });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
