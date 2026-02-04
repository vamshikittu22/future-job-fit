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

// --- ATS Engine Types (Deterministic, No LLM) ---
type KeywordCategory = 'hard_skill' | 'tool' | 'concept' | 'soft_skill';
type MatchStatus = 'matched' | 'partial' | 'missing';
type RecommendationSeverity = 'info' | 'warning' | 'critical';

interface KeywordModel {
  keyword: string;
  category: KeywordCategory;
  weight: number;
  frequency: number;
  jdSection: string;
}

interface MatchResultModel {
  keyword: string;
  category: KeywordCategory;
  status: MatchStatus;
  locations: string[];
  scoreContribution: number;
}

interface ATSScoreBreakdown {
  hardSkillScore: number;
  toolsScore: number;
  conceptScore: number;
  roleTitleScore: number;
  structureScore: number;
  total: number;
}

interface JobDescriptionModel {
  id: string;
  rawText: string;
  sections: Record<string, string>;
  categorizedKeywords: KeywordModel[];
}

interface Recommendation {
  id: string;
  message: string;
  severity: RecommendationSeverity;
  targetLocation?: string;
  category?: KeywordCategory;
  keyword?: string;
}

interface ATSEvaluationResponse {
  jdModel: JobDescriptionModel;
  matchResults: MatchResultModel[];
  scoreBreakdown: ATSScoreBreakdown;
  recommendations: Recommendation[];
}

interface ParseJDRequest {
  rawText: string;
}

interface EvaluateATSRequest {
  resumeText: string;
  jobDescriptionText: string;
}

// --- ATS Engine Constants ---
const TECH_SKILLS: string[] = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'SQL', 'R', 'Scala',
  'React', 'Angular', 'Vue', 'Next.js', 'Nuxt.js', 'Svelte', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Rails', 'Laravel', 'ASP.NET',
  'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'Git', 'GitHub Actions', 'GitLab CI', 'CI/CD', 'DevOps',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Kafka', 'RabbitMQ', 'Supabase', 'Firebase', 'Prisma',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'LangChain', 'OpenAI',
  'REST', 'GraphQL', 'gRPC', 'API', 'Microservices', 'Serverless', 'WebSockets',
  'Agile', 'Scrum', 'Kanban', 'TDD', 'Jira',
  'Tailwind', 'Sass', 'Lambda', 'S3', 'EC2', 'RDS', 'DynamoDB',
  'Mobile', 'iOS', 'Android', 'Flutter', 'React Native'
];

const SOFT_SKILLS: string[] = [
  'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
  'collaboration', 'mentoring', 'management', 'strategic', 'innovative'
];

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'it', 'its', 'their',
  'our', 'your', 'my', 'we', 'they', 'you', 'i', 'he', 'she', 'can', 'all', 'each'
]);

// --- ATS Engine Helper Functions ---
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function parseJDSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const sectionPatterns = [
    { key: 'requirements', patterns: ['requirements', 'qualifications', 'must have', 'required'] },
    { key: 'responsibilities', patterns: ['responsibilities', 'duties', 'what you will do', 'role'] },
    { key: 'nice_to_have', patterns: ['nice to have', 'preferred', 'bonus', 'plus'] },
    { key: 'about', patterns: ['about us', 'about the company', 'who we are', 'company'] }
  ];

  const lines = text.split('\n');
  let currentSection = 'general';
  let currentContent: string[] = [];

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();
    let foundSection = false;

    for (const { key, patterns } of sectionPatterns) {
      if (patterns.some(p => lowerLine.includes(p) && lowerLine.length < 50)) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n');
        }
        currentSection = key;
        currentContent = [];
        foundSection = true;
        break;
      }
    }

    if (!foundSection) {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }

  return sections;
}

function extractKeywords(text: string): KeywordModel[] {
  const keywords: KeywordModel[] = [];
  const keywordCounts = new Map<string, { count: number; section: string }>();
  const textLower = text.toLowerCase();

  // Extract tech skills (exact match)
  for (const skill of TECH_SKILLS) {
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = textLower.match(pattern);
    if (matches) {
      keywordCounts.set(skill.toLowerCase(), { count: matches.length, section: 'general' });
    }
  }

  // Extract multi-word phrases (common tech patterns)
  const multiWordPatterns = [
    /\b(spring boot|react native|machine learning|deep learning|data science|full stack|front end|back end|cloud computing)\b/gi
  ];
  for (const pattern of multiWordPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        const key = match.toLowerCase();
        if (!keywordCounts.has(key)) {
          keywordCounts.set(key, { count: 1, section: 'general' });
        }
      }
    }
  }

  // Convert to KeywordModel array
  for (const [keyword, data] of keywordCounts) {
    // Categorize
    let category: KeywordCategory = 'concept';
    const keywordLower = keyword.toLowerCase();

    if (TECH_SKILLS.some(s => s.toLowerCase() === keywordLower)) {
      // Determine if tool or hard skill
      if (['docker', 'kubernetes', 'git', 'jenkins', 'jira', 'terraform', 'ansible'].some(t => keywordLower.includes(t))) {
        category = 'tool';
      } else {
        category = 'hard_skill';
      }
    } else if (SOFT_SKILLS.some(s => keywordLower.includes(s))) {
      category = 'soft_skill';
    }

    // Weight based on frequency (cap at 3)
    const baseWeight = 1.0;
    const frequencyBonus = Math.min(data.count - 1, 2) * 0.25;

    keywords.push({
      keyword,
      category,
      weight: baseWeight + frequencyBonus,
      frequency: data.count,
      jdSection: data.section
    });
  }

  return keywords;
}

function parseJDInternal(rawText: string): JobDescriptionModel {
  const sections = parseJDSections(rawText);
  const categorizedKeywords = extractKeywords(rawText);

  // Boost weights for keywords in requirements section
  const requirementsText = (sections['requirements'] || '').toLowerCase();
  for (const kw of categorizedKeywords) {
    if (requirementsText.includes(kw.keyword.toLowerCase())) {
      kw.weight *= 1.5;
      kw.jdSection = 'requirements';
    }
  }

  return {
    id: generateId(),
    rawText,
    sections,
    categorizedKeywords
  };
}

function matchKeywords(jdModel: JobDescriptionModel, resumeText: string): MatchResultModel[] {
  const results: MatchResultModel[] = [];
  const resumeLower = resumeText.toLowerCase();

  for (const kw of jdModel.categorizedKeywords) {
    const keywordLower = kw.keyword.toLowerCase();
    const pattern = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = resumeLower.match(pattern);

    let status: MatchStatus = 'missing';
    const locations: string[] = [];

    if (matches && matches.length > 0) {
      status = 'matched';
      // Find approximate locations
      const lines = resumeText.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
          locations.push(`line:${i}`);
        }
      }
    }

    // Calculate score contribution (matched = full weight, missing = 0)
    const scoreContribution = status === 'matched' ? kw.weight * 5 : 0;

    results.push({
      keyword: kw.keyword,
      category: kw.category,
      status,
      locations,
      scoreContribution
    });
  }

  return results;
}

function calculateATSScore(jdModel: JobDescriptionModel, matchResults: MatchResultModel[], resumeText: string): ATSScoreBreakdown {
  // Group by category
  const byCategory: Record<KeywordCategory, { matched: number; total: number }> = {
    hard_skill: { matched: 0, total: 0 },
    tool: { matched: 0, total: 0 },
    concept: { matched: 0, total: 0 },
    soft_skill: { matched: 0, total: 0 }
  };

  for (const result of matchResults) {
    byCategory[result.category].total++;
    if (result.status === 'matched') {
      byCategory[result.category].matched++;
    } else if (result.status === 'partial') {
      byCategory[result.category].matched += 0.5;
    }
  }

  // Calculate category scores (0-100)
  const hardSkillScore = byCategory.hard_skill.total > 0
    ? Math.round((byCategory.hard_skill.matched / byCategory.hard_skill.total) * 100)
    : 100;

  const toolsScore = byCategory.tool.total > 0
    ? Math.round((byCategory.tool.matched / byCategory.tool.total) * 100)
    : 100;

  const conceptScore = byCategory.concept.total > 0
    ? Math.round((byCategory.concept.matched / byCategory.concept.total) * 100)
    : 100;

  // Role/title match - simplified (check if common title words appear)
  const roleTitleScore = 75; // Simplified for now

  // Structure score - check for key sections
  const hasExperience = /experience|work history|employment/i.test(resumeText);
  const hasEducation = /education|degree|university/i.test(resumeText);
  const hasSkills = /skills|technologies|proficient/i.test(resumeText);
  const structureScore = ((hasExperience ? 40 : 0) + (hasEducation ? 30 : 0) + (hasSkills ? 30 : 0));

  // Total using formula: (HardSkill * 0.45) + (Tools * 0.20) + (Concepts * 0.20) + (RoleTitle * 0.10) + (Structure * 0.05)
  const total = Math.round(
    hardSkillScore * 0.45 +
    toolsScore * 0.20 +
    conceptScore * 0.20 +
    roleTitleScore * 0.10 +
    structureScore * 0.05
  );

  return {
    hardSkillScore,
    toolsScore,
    conceptScore,
    roleTitleScore,
    structureScore,
    total
  };
}

function generateRecommendations(matchResults: MatchResultModel[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Group missing keywords by category
  const missingByCategory: Record<KeywordCategory, string[]> = {
    hard_skill: [],
    tool: [],
    concept: [],
    soft_skill: []
  };

  for (const result of matchResults) {
    if (result.status === 'missing') {
      missingByCategory[result.category].push(result.keyword);
    }
  }

  // Generate recommendations for missing high-priority keywords
  if (missingByCategory.hard_skill.length > 0) {
    recommendations.push({
      id: generateId(),
      message: `Add these technical skills: ${missingByCategory.hard_skill.slice(0, 3).join(', ')}`,
      severity: 'critical',
      category: 'hard_skill'
    });
  }

  if (missingByCategory.tool.length > 0) {
    recommendations.push({
      id: generateId(),
      message: `Consider adding experience with: ${missingByCategory.tool.slice(0, 3).join(', ')}`,
      severity: 'warning',
      category: 'tool'
    });
  }

  if (missingByCategory.concept.length > 0) {
    recommendations.push({
      id: generateId(),
      message: `Include relevant concepts: ${missingByCategory.concept.slice(0, 2).join(', ')}`,
      severity: 'info',
      category: 'concept'
    });
  }

  return recommendations;
}

function evaluateATSInternal(resumeText: string, jdText: string): ATSEvaluationResponse {
  const jdModel = parseJDInternal(jdText);
  const matchResults = matchKeywords(jdModel, resumeText);
  const scoreBreakdown = calculateATSScore(jdModel, matchResults, resumeText);
  const recommendations = generateRecommendations(matchResults);

  return {
    jdModel,
    matchResults,
    scoreBreakdown,
    recommendations
  };
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

    } else if (task === 'parseJD') {
      // Deterministic JD parsing (no LLM)
      const { rawText } = body as ParseJDRequest;
      console.log('[ATS Engine] Parsing JD (deterministic)');
      responseData = parseJDInternal(rawText);

    } else if (task === 'evaluateATS') {
      // Deterministic ATS evaluation (no LLM)
      const { resumeText, jobDescriptionText } = body as EvaluateATSRequest;
      console.log('[ATS Engine] Evaluating ATS (deterministic)');
      responseData = evaluateATSInternal(resumeText, jobDescriptionText);

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
