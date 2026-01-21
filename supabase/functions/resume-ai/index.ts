// Supabase Edge Function for AI Resume Enhancement
// Secure server-side AI gateway supporting OpenAI, Gemini, and Groq

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Models & Config ---
const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_API_VERSION = "v1beta"; // Using v1beta for JSON response mode support

// --- Interface Definitions ---
interface EnhancementRequest {
  section_type: 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'achievements' | 'certifications';
  original_text: string;
  quick_preset?: 'ATS Optimized' | 'Concise Professional' | 'Maximum Impact' | null;
  tone_style?: string[];
  highlight_areas?: string[];
  job_description?: string;
  target_role?: string;
}

interface AnalysisRequest {
  sectionId: string;
  content: string;
}

interface SkillsRequest {
  skills: string[];
}

interface ProjectImpactRequest {
  projectName: string;
  description: string;
  technologies: string[];
}

interface EvaluationRequest {
  resumeText: string;
  jobDescription?: string;
}

// --- AI Client Helper ---
async function callGemini(prompt: string, temperature = 0.8): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const url = `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  console.log(`[Gemini Request] Model: ${GEMINI_MODEL}, Temp: ${temperature}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error('[Gemini API Error Status]:', response.status);
    console.error('[Gemini API Error Body]:', JSON.stringify(errorBody));
    throw new Error(errorBody.error?.message || `Gemini API failed with status ${response.status}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!text) {
    console.warn('[Gemini Warning] No text in response. Full result:', JSON.stringify(result));
    throw new Error('Gemini returned an empty response');
  }

  return text;
}

const getEnhancementSystemPrompt = (payload: EnhancementRequest): string => {
  return `You are a Career Expert & Resume Strategist. 
Your task is to rewrite the following resume content into 3 distinct, high-quality variations.

INPUT CONTENT:
${payload.original_text}

CONTEXT:
- Section: ${payload.section_type}
- Preset: ${payload.quick_preset || 'Standard'}
- Tone: ${payload.tone_style?.join(', ') || 'Professional'}

RULES:
1. Preserve all factual data (dates, tech, metrics). NEVER hallucinate details.
2. Use strong action verbs (Spearheaded, Architected, Orchestrated).
3. Quantify achievements whenever possible.
4. Ensure the 3 variations are DISTINCT from each other in structure and phrasing.
5. Variation 1: Focus on Keywords & ATS.
6. Variation 2: Focus on Leadership & Impact.
7. Variation 3: Focus on Conciseness & Clarity.

RESPONSE FORMAT (JSON ONLY):
{
  "variants": ["string", "string", "string"],
  "notes": "string explaining the strategy used"
}`;
};

// --- Main Handler ---
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { task, provider } = body;
    const aiProvider = provider || Deno.env.get('AI_PROVIDER') || 'gemini';

    console.log(`[AI Workflow] Task: ${task}, Provider: ${aiProvider}`);

    // Currently focusing on Gemini for the "Clear Setup" rewrite as requested
    if (aiProvider !== 'gemini') {
      throw new Error(`This optimized handler currently supports Gemini. Provider '${aiProvider}' is not yet refactored.`);
    }

    let responseData: any;

    if (task === 'enhanceSection') {
      const payload = body as EnhancementRequest;
      const prompt = getEnhancementSystemPrompt(payload);
      const text = await callGemini(prompt, 1.0); // High temp for variations
      responseData = JSON.parse(text.replace(/```json|```/g, '').trim());

    } else if (task === 'analyzeSection') {
      const { sectionId, content } = body as AnalysisRequest;
      const prompt = `Analyze this resume section content and provide feedback in JSON:
{
  "score": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[]
}
CONTENT: ${content}`;
      const text = await callGemini(prompt, 0.4); // Lower temp for factual analysis
      responseData = JSON.parse(text.replace(/```json|```/g, '').trim());

    } else if (task === 'evaluateResume') {
      const { resumeText, jobDescription } = body as EvaluationRequest;
      const prompt = `You are an expert ATS Resume Optimizer.
Evaluate the following resume against the job description and provide a high-quality optimization.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription || 'N/A'}

TASK:
1. Identify missing keywords (technologies, skills).
2. Calculate ATS score (0-100).
3. Provide 3-5 concrete suggestions for improvement.
4. Provide a FULLY REWRITTEN and OPTIMIZED version of the entire resume text.
   - INTEGRATE missing keywords naturally into the experience bullet points where they fit.
   - Use high-impact action verbs.
   - Maintain all original factual data.

Return ONLY a JSON object:
{
  "atsScore": number,
  "missingKeywords": ["..."],
  "suggestions": ["..."],
  "rewrittenResume": "string (the full optimized resume text)"
}`;
      const text = await callGemini(prompt, 0.5);
      responseData = JSON.parse(text.replace(/```json|```/g, '').trim());

    } else if (task === 'organizeSkills') {
      const { skills } = body as SkillsRequest;
      const prompt = `Organize these skills into categories (Technical, Tools, Soft, Languages). Detect duplicates and outdated tech. Return JSON:
{
  "technical": string[],
  "tools": string[],
  "soft": string[],
  "languages": string[],
  "duplicates": string[],
  "outdated": Array<{skill: string, suggestion: string}>
}
SKILLS: ${skills.join(', ')}`;
      const text = await callGemini(prompt, 0.3);
      responseData = JSON.parse(text.replace(/```json|```/g, '').trim());

    } else if (task === 'suggestProjectImpact') {
      const { projectName, description, technologies } = body as ProjectImpactRequest;
      const prompt = `Suggest quantifiable impact metrics for this project: ${projectName}. Return JSON:
{
  "suggestedMetrics": Array<{type: string, example: string}>,
  "bullets": Array<{text: string, focus: string}>
}
DESC: ${description}
TECH: ${technologies.join(', ')}`;
      const text = await callGemini(prompt, 0.7);
      responseData = JSON.parse(text.replace(/```json|```/g, '').trim());

    } else {
      throw new Error(`Unknown task: ${task}`);
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[AI Handler Master Error]:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
