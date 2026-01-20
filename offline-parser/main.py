# Resume Parser - Offline NLP Service (Lightweight Version)
# Uses regex and basic NLP patterns instead of spaCy for Python 3.14 compatibility

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import re
import logging
from collections import Counter

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Resume Parser API",
    description="Offline NLP service for resume parsing, keyword matching, and ATS scoring",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class ParseResumeRequest(BaseModel):
    text: str

class ParseResumeResponse(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    sections: Dict[str, Any] = {}

class MatchKeywordsRequest(BaseModel):
    resumeText: str
    jobDescription: str

class MatchKeywordsResponse(BaseModel):
    matched: List[str]
    missing: List[str]
    matchRatio: float
    resumeKeywords: List[str]
    jdKeywords: List[str]

class ScoreATSRequest(BaseModel):
    parsedResume: Optional[Dict[str, Any]] = None
    resumeText: Optional[str] = None
    jobDescription: Optional[str] = None

class ScoreBreakdown(BaseModel):
    keywordMatch: int
    formatScore: int
    sectionCompleteness: int
    readability: int
    actionVerbScore: int

class ScoreATSResponse(BaseModel):
    score: int
    breakdown: ScoreBreakdown
    suggestions: List[str]

class HealthResponse(BaseModel):
    status: str
    model: str
    version: str

# --- Parsing Utilities ---

# Common regex patterns (Python 3.14 compatible)
EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z]+')
PHONE_PATTERN = re.compile(r'[+]?[0-9][0-9 .()\-]{8,}[0-9]')
LINKEDIN_PATTERN = re.compile(r'linkedin\.com/in/[a-zA-Z0-9]+', re.IGNORECASE)
GITHUB_PATTERN = re.compile(r'github\.com/[a-zA-Z0-9]+', re.IGNORECASE)
URL_PATTERN = re.compile(r'https?://[^\s]+')

# Section headers
SECTION_HEADERS = {
    'experience': ['experience', 'employment', 'work history', 'professional experience', 'work experience'],
    'education': ['education', 'academic', 'qualifications', 'degrees'],
    'skills': ['skills', 'technical skills', 'competencies', 'technologies', 'expertise'],
    'projects': ['projects', 'personal projects', 'portfolio', 'side projects'],
    'summary': ['summary', 'objective', 'profile', 'about', 'professional summary'],
    'certifications': ['certifications', 'certificates', 'licenses', 'credentials'],
    'achievements': ['achievements', 'awards', 'honors', 'accomplishments']
}

# Tech skills patterns (expanded)
TECH_SKILLS = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'SQL', 'R', 'Scala', 'Cobol', 'Fortran',
    'React', 'Angular', 'Vue', 'Next.js', 'Nuxt.js', 'Svelte', 'SolidJS', 'Node.js', 'Express', 'Deno', 'Bun', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Rails', 'Laravel', 'ASP.NET',
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'DigitalOcean', 'Heroku', 'Netlify', 'Vercel',
    'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Pulumi', 'Jenkins', 'Git', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'CI/CD', 'DevOps', 'SRE',
    'PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'Kafka', 'RabbitMQ', 'Supabase', 'Firebase', 'Prisma', 'Drizzle',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'OpenCV', 'HuggingFace', 'Transformers', 'LLM', 'LangChain', 'OpenAI',
    'REST', 'GraphQL', 'gRPC', 'SOAP', 'API', 'Microservices', 'Serverless', 'WebSockets', 'TRPC',
    'Agile', 'Scrum', 'Kanban', 'TDD', 'BDD', 'Jira', 'Confluence',
    'Docker Compose', 'Podman', 'Helm', 'Flux', 'ArgoCD', 'Prometheus', 'Grafana', 'ELK Stack', 'DataDog', 'New Relic'
]

# Strong action verbs
ACTION_VERBS = {
    'led', 'managed', 'developed', 'created', 'designed', 'implemented', 'built',
    'architected', 'engineered', 'orchestrated', 'spearheaded', 'launched',
    'delivered', 'achieved', 'increased', 'reduced', 'improved', 'optimized',
    'streamlined', 'automated', 'collaborated', 'mentored', 'trained'
}

# Stop words for keyword extraction
STOP_WORDS = {
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'it', 'its', 'their',
    'our', 'your', 'my', 'we', 'they', 'you', 'i', 'he', 'she', 'can', 'all', 'each',
    'such', 'what', 'when', 'where', 'how', 'why', 'very', 'just', 'also', 'more',
    'about', 'up', 'out', 'if', 'than', 'so', 'no', 'not', 'only', 'own', 'same',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between'
}

def extract_contact_info(text: str) -> dict:
    """Extract contact information from resume text."""
    result = {}
    
    emails = EMAIL_PATTERN.findall(text)
    if emails:
        result['email'] = emails[0]
    
    phones = PHONE_PATTERN.findall(text)
    if phones:
        # Keep only digits, +, (), spaces.  Hyphen at end of char class for Python 3.14 compat
        phone = re.sub(r'[^0-9+() -]', '', phones[0]).strip()
        if len(re.sub(r'[^0-9]', '', phone)) >= 10:
            result['phone'] = phone
    
    linkedin = LINKEDIN_PATTERN.search(text)
    if linkedin:
        result['linkedin'] = linkedin.group(0)
    
    github = GITHUB_PATTERN.search(text)
    if github:
        result['github'] = github.group(0)
    
    urls = URL_PATTERN.findall(text)
    for url in urls:
        if 'linkedin' not in url.lower() and 'github' not in url.lower():
            result['website'] = url
            break
    
    return result

def extract_name(text: str) -> Optional[str]:
    """Extract name from resume using heuristics."""
    lines = text.strip().split('\n')
    for line in lines[:5]:
        line = line.strip()
        if not line:
            continue
        words = line.split()
        if 2 <= len(words) <= 4:
            if all(word[0].isupper() for word in words if word.isalpha()):
                if not any(header in line.lower() for headers in SECTION_HEADERS.values() for header in headers):
                    return line
    return None

def extract_skills(text: str) -> List[str]:
    """Extract skills from resume text using pattern matching."""
    skills = set()
    text_lower = text.lower()
    
    for skill in TECH_SKILLS:
        if skill.lower() in text_lower:
            skills.add(skill)
    
    return list(skills)[:50]

def identify_section(line: str) -> Optional[str]:
    """Identify if a line is a section header."""
    line_lower = line.lower().strip()
    for section_name, keywords in SECTION_HEADERS.items():
        for keyword in keywords:
            if line_lower == keyword or line_lower.startswith(keyword + ':') or line_lower.startswith(keyword + ' '):
                return section_name
    return None

def parse_resume_sections(text: str) -> Dict[str, str]:
    """Split resume into sections based on headers."""
    sections = {}
    current_section = 'header'
    current_content = []
    
    lines = text.split('\n')
    for line in lines:
        section = identify_section(line)
        if section:
            if current_content:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = section
            current_content = []
        else:
            current_content.append(line)
    
    if current_content:
        sections[current_section] = '\n'.join(current_content).strip()
    
    return sections

def extract_keywords(text: str, top_n: int = 20) -> List[str]:
    """Extract top keywords using word frequency."""
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    words = [w for w in words if w not in STOP_WORDS]
    
    word_counts = Counter(words)
    return [word for word, _ in word_counts.most_common(top_n)]

def calculate_readability(text: str) -> int:
    """Calculate readability score (0-100)."""
    score = 100
    
    sentences = text.split('.')
    avg_sentence_length = sum(len(s.split()) for s in sentences) / max(len(sentences), 1)
    if avg_sentence_length > 25:
        score -= 10
    elif avg_sentence_length > 35:
        score -= 20
    
    words = text.split()
    complex_words = sum(1 for w in words if len(w) > 12)
    if complex_words / max(len(words), 1) > 0.1:
        score -= 10
    
    bullet_count = text.count('•') + text.count('-') + text.count('*')
    if bullet_count > 5:
        score += 5
    
    return max(0, min(100, score))

# --- API Endpoints ---

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        model="regex-based",
        version="1.0.0"
    )

@app.post("/parse-resume", response_model=ParseResumeResponse)
async def parse_resume(request: ParseResumeRequest):
    """Parse resume text and extract structured data."""
    try:
        text = request.text
        contact = extract_contact_info(text)
        name = extract_name(text)
        raw_sections = parse_resume_sections(text)
        skills = extract_skills(text)
        
        sections = {}
        if 'summary' in raw_sections:
            sections['summary'] = raw_sections['summary']
        if 'experience' in raw_sections:
            sections['experience'] = raw_sections['experience']
        if 'education' in raw_sections:
            sections['education'] = raw_sections['education']
        sections['skills'] = skills
        if 'projects' in raw_sections:
            sections['projects'] = raw_sections['projects']
        if 'certifications' in raw_sections:
            sections['certifications'] = raw_sections['certifications']
        if 'achievements' in raw_sections:
            sections['achievements'] = raw_sections['achievements']
        
        return ParseResumeResponse(
            name=name,
            email=contact.get('email'),
            phone=contact.get('phone'),
            linkedin=contact.get('linkedin'),
            github=contact.get('github'),
            website=contact.get('website'),
            sections=sections
        )
    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")

@app.post("/match-keywords", response_model=MatchKeywordsResponse)
async def match_keywords(request: MatchKeywordsRequest):
    """Compare resume keywords against job description."""
    try:
        resume_keywords = set(extract_keywords(request.resumeText, 30))
        jd_keywords = set(extract_keywords(request.jobDescription, 30))
        
        matched = list(resume_keywords & jd_keywords)
        missing = list(jd_keywords - resume_keywords)
        
        match_ratio = len(matched) / max(len(jd_keywords), 1)
        
        return MatchKeywordsResponse(
            matched=matched,
            missing=missing[:15],
            matchRatio=round(match_ratio, 2),
            resumeKeywords=list(resume_keywords),
            jdKeywords=list(jd_keywords)
        )
    except Exception as e:
        logger.error(f"Error matching keywords: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Keyword matching failed: {str(e)}")

@app.post("/score-ats", response_model=ScoreATSResponse)
async def score_ats(request: ScoreATSRequest):
    """Calculate ATS compatibility score."""
    try:
        suggestions = []
        
        resume_text = request.resumeText or ""
        if request.parsedResume and 'sections' in request.parsedResume:
            resume_text = ' '.join(str(v) for v in request.parsedResume['sections'].values())
        
        jd_text = request.jobDescription or ""
        
        # Keyword Match Score
        if jd_text:
            resume_kw = set(extract_keywords(resume_text, 30))
            jd_kw = set(extract_keywords(jd_text, 30))
            matched = resume_kw & jd_kw
            keyword_score = int((len(matched) / max(len(jd_kw), 1)) * 100)
            missing = list(jd_kw - resume_kw)[:5]
            if missing:
                suggestions.append(f"Add these keywords: {', '.join(missing)}")
        else:
            keyword_score = 70
        
        # Format Score
        sections = parse_resume_sections(resume_text)
        required_sections = ['summary', 'experience', 'education', 'skills']
        found_sections = sum(1 for s in required_sections if s in sections)
        format_score = int((found_sections / len(required_sections)) * 100)
        
        if 'summary' not in sections:
            suggestions.append("Add a professional summary section")
        if 'skills' not in sections:
            suggestions.append("Add a dedicated skills section")
        
        # Section Completeness
        total_content = sum(len(str(v)) for v in sections.values())
        if total_content < 500:
            section_score = 50
            suggestions.append("Add more detail to your resume sections")
        elif total_content < 1500:
            section_score = 75
        else:
            section_score = 90
        
        # Readability Score
        readability_score = calculate_readability(resume_text)
        
        # Action Verb Score
        words = resume_text.lower().split()
        action_verb_count = sum(1 for w in words if w in ACTION_VERBS)
        action_score = min(100, action_verb_count * 10)
        
        if action_score < 50:
            suggestions.append("Use stronger action verbs (led, achieved, implemented, optimized)")
        
        # Overall Score
        overall_score = int(
            keyword_score * 0.35 +
            format_score * 0.20 +
            section_score * 0.20 +
            readability_score * 0.10 +
            action_score * 0.15
        )
        
        if overall_score < 70:
            suggestions.append("Include quantifiable achievements (numbers, percentages)")
        
        return ScoreATSResponse(
            score=overall_score,
            breakdown=ScoreBreakdown(
                keywordMatch=keyword_score,
                formatScore=format_score,
                sectionCompleteness=section_score,
                readability=readability_score,
                actionVerbScore=action_score
            ),
            suggestions=suggestions[:6]
        )
    except Exception as e:
        logger.error(f"Error scoring ATS: {str(e)}")
        raise HTTPException(status_code=500, detail=f"ATS scoring failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
