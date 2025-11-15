import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let prompt = '';
    let systemPrompt = 'You are an expert resume writer and career coach.';

    // Build prompts based on enhancement type
    switch (type) {
      case 'summary':
        systemPrompt = `You are an expert resume writer. Generate professional resume summaries that:
- Use strong action verbs
- Include quantifiable achievements when possible
- Avoid buzzwords like "synergy", "leverage", "innovative"
- Are ATS-friendly and keyword-rich
- Sound authentic and human`;
        
        prompt = `Generate 3 professional summary versions for a resume with:
- Job Title: ${data.jobTitle}
- Years of Experience: ${data.yearsExperience}
- Key Skills: ${data.skills?.join(', ')}
- Industry: ${data.industry || 'general'}

Create 3 versions:
1. CONCISE (50-80 words) - Professional tone
2. DETAILED (80-130 words) - Friendly tone  
3. IMPACTFUL (130-150 words) - Authoritative tone

Return ONLY a JSON array with 3 objects, each having: {"version": "concise"|"detailed"|"impactful", "tone": string, "text": string, "wordCount": number}`;
        break;

      case 'bullet':
        systemPrompt = `You are an expert at writing achievement-focused resume bullets using the XYZ formula:
"Accomplished [X] measured by [Y] by doing [Z]"

Rules:
- Start with strong action verbs (Led, Accelerated, Optimized, Developed, Architected)
- Include quantifiable metrics (%, $, numbers)
- Show business impact, not just tasks
- Remove weak words (helped, worked, did, responsible for)
- Keep concise (1-2 lines)
- Be truthful and realistic`;

        prompt = `Transform this experience bullet using the XYZ formula:

Current: "${data.currentBullet}"
Job Title: ${data.jobTitle}
Company Type: ${data.companyType || 'general'}

Generate 3 enhanced versions with different metric focuses.
Return ONLY a JSON array with 3 objects, each having: {"text": string, "metrics": string[]}`;
        break;

      case 'skills':
        prompt = `Organize and optimize these skills:

Skills: ${data.skills?.join(', ')}

Task:
1. Categorize into: Technical, Tools & Platforms, Soft Skills, Languages
2. Remove duplicates (e.g., JavaScript = JS)
3. Identify outdated skills and suggest modern alternatives
4. Rank by market demand and relevance

Return ONLY a JSON object with: {
  "technical": string[],
  "tools": string[],
  "soft": string[],
  "languages": string[],
  "outdated": [{"skill": string, "suggestion": string}],
  "duplicates": string[]
}`;
        break;

      case 'project':
        prompt = `Suggest impact statements for this project:

Project: ${data.projectName}
Description: ${data.description}
Technologies: ${data.technologies?.join(', ')}

Suggest:
1. What metrics could apply (users, revenue, performance, time saved)
2. 3 strong resume bullets showing impact

Return ONLY a JSON object with: {
  "suggestedMetrics": [{"type": string, "example": string}],
  "bullets": [{"text": string, "focus": string}]
}`;
        break;

      default:
        throw new Error(`Unknown enhancement type: ${type}`);
    }

    console.log('Calling AI with type:', type);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse JSON from AI response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid AI response format');
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in resume-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
