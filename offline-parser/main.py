# Resume Parser - Offline NLP Service
# FastAPI + spaCy-based resume parsing, keyword matching, and ATS scoring

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import logging

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

# Load spaCy model (will be downloaded in Docker build)
try:
    nlp = spacy.load("en_core_web_lg")
    logger.info("spaCy model loaded successfully")
except OSError:
    logger.warning("Large model not found, falling back to small model")
    nlp = spacy.load("en_core_web_sm")

# --- Pydantic Models ---

class ParseResumeRequest(BaseModel):
    text: str

class ParsedSection(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    dates: Optional[str] = None
    description: Optional[str] = None

class ParsedEducation(BaseModel):
    degree: Optional[str] = None
    school: Optional[str] = None
    field: Optional[str] = None
    year: Optional[str] = None
    gpa: Optional[str] = None

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

# Common regex patterns
EMAIL_PATTERN = re.compile(r'[\w\.-]+@[\w\.-]+\.\w+')
PHONE_PATTERN = re.compile(r'[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}')
LINKEDIN_PATTERN = re.compile(r'(?:linkedin\.com/in/|linkedin:?\s*)[a-zA-Z0-9_-]+', re.IGNORECASE)
GITHUB_PATTERN = re.compile(r'(?:github\.com/|github:?\s*)[a-zA-Z0-9_-]+', re.IGNORECASE)
URL_PATTERN = re.compile(r'https?://[^\s<>"{}|\\^`\[\]]+')
DATE_PATTERN = re.compile(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4}(?:\s*[-–]\s*(?:Present|Current|\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}))?)', re.IGNORECASE)
GPA_PATTERN = re.compile(r'(?:GPA|Grade):\s*([\d.]+(?:/[\d.]+)?)', re.IGNORECASE)

# Section headers to identify resume sections
SECTION_HEADERS = {
    'experience': ['experience', 'employment', 'work history', 'professional experience', 'work experience'],
    'education': ['education', 'academic', 'qualifications', 'degrees'],
    'skills': ['skills', 'technical skills', 'competencies', 'technologies', 'expertise'],
    'projects': ['projects', 'personal projects', 'portfolio', 'side projects'],
    'summary': ['summary', 'objective', 'profile', 'about', 'professional summary'],
    'certifications': ['certifications', 'certificates', 'licenses', 'credentials'],
    'achievements': ['achievements', 'awards', 'honors', 'accomplishments']
}

# Strong action verbs for ATS scoring
ACTION_VERBS = {
    'led', 'managed', 'developed', 'created', 'designed', 'implemented', 'built',
    'architected', 'engineered', 'orchestrated', 'spearheaded', 'launched',
    'delivered', 'achieved', 'increased', 'reduced', 'improved', 'optimized',
    'streamlined', 'automated', 'collaborated', 'mentored', 'trained'
}

def extract_contact_info(text: str) -> dict:
    """Extract contact information from resume text."""
    result = {}
    
    # Email
    emails = EMAIL_PATTERN.findall(text)
    if emails:
        result['email'] = emails[0]
    
    # Phone
    phones = PHONE_PATTERN.findall(text)
    if phones:
        # Clean up phone number
        phone = re.sub(r'[^\d+()-\s]', '', phones[0]).strip()
        if len(re.sub(r'\D', '', phone)) >= 10:
            result['phone'] = phone
    
    # LinkedIn
    linkedin = LINKEDIN_PATTERN.search(text)
    if linkedin:
        result['linkedin'] = linkedin.group(0)
    
    # GitHub
    github = GITHUB_PATTERN.search(text)
    if github:
        result['github'] = github.group(0)
    
    # Website (excluding linkedin/github)
    urls = URL_PATTERN.findall(text)
    for url in urls:
        if 'linkedin' not in url.lower() and 'github' not in url.lower():
            result['website'] = url
            break
    
    return result

def extract_name(text: str, doc) -> Optional[str]:
    """Extract name from resume using NER and heuristics."""
    # First, try spaCy NER for PERSON entities
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            return ent.text
    
    # Fallback: assume first line with 2-4 capitalized words is the name
    lines = text.strip().split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if not line:
            continue
        words = line.split()
        if 2 <= len(words) <= 4:
            if all(word[0].isupper() for word in words if word.isalpha()):
                # Exclude lines that look like headers
                if not any(header in line.lower() for headers in SECTION_HEADERS.values() for header in headers):
                    return line
    
    return None

def extract_skills(text: str, doc) -> List[str]:
    """Extract skills from resume text using NLP and pattern matching."""
    skills = set()
    
    # Common tech skills to look for
    tech_patterns = [
        r'\b(Python|JavaScript|TypeScript|Java|C\+\+|C#|Ruby|Go|Rust|Swift|Kotlin|PHP|SQL|R|Scala)\b',
        r'\b(React|Angular|Vue|Node\.js|Express|Django|Flask|FastAPI|Spring|Rails|Laravel)\b',
        r'\b(AWS|Azure|GCP|Docker|Kubernetes|Terraform|Jenkins|Git|CI/CD|DevOps)\b',
        r'\b(PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch|Kafka|RabbitMQ)\b',
        r'\b(TensorFlow|PyTorch|Scikit-learn|Pandas|NumPy|Machine Learning|Deep Learning|NLP)\b',
        r'\b(REST|GraphQL|API|Microservices|Agile|Scrum|TDD|BDD)\b'
    ]
    
    for pattern in tech_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        skills.update(m for m in matches)
    
    # Also extract noun phrases that might be skills
    for chunk in doc.noun_chunks:
        if 1 <= len(chunk.text.split()) <= 3:
            # Check if it looks like a skill (not a person name, place, etc.)
            if not any(ent.label_ in ['PERSON', 'GPE', 'ORG'] for ent in chunk.ents):
                skills.add(chunk.text.strip())
    
    return list(skills)[:50]  # Limit to 50 skills

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
    """Extract top keywords using TF-IDF-like approach with spaCy."""
    doc = nlp(text.lower())
    
    # Focus on nouns, proper nouns, and adjectives
    keywords = []
    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN'] and not token.is_stop and len(token.text) > 2:
            keywords.append(token.lemma_)
    
    # Also include noun phrases
    for chunk in doc.noun_chunks:
        if 1 <= len(chunk.text.split()) <= 3:
            keywords.append(chunk.text.strip())
    
    # Count frequency
    from collections import Counter
    keyword_counts = Counter(keywords)
    
    return [kw for kw, _ in keyword_counts.most_common(top_n)]

def calculate_readability(text: str) -> int:
    """Calculate readability score (0-100) based on various factors."""
    score = 100
    
    # Penalize very long sentences
    sentences = text.split('.')
    avg_sentence_length = sum(len(s.split()) for s in sentences) / max(len(sentences), 1)
    if avg_sentence_length > 25:
        score -= 10
    elif avg_sentence_length > 35:
        score -= 20
    
    # Penalize too many complex words
    words = text.split()
    complex_words = sum(1 for w in words if len(w) > 12)
    if complex_words / max(len(words), 1) > 0.1:
        score -= 10
    
    # Bonus for bullet points
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
        model=nlp.meta["name"],
        version="1.0.0"
    )

@app.post("/parse-resume", response_model=ParseResumeResponse)
async def parse_resume(request: ParseResumeRequest):
    """Parse resume text and extract structured data."""
    try:
        text = request.text
        doc = nlp(text)
        
        # Extract contact info
        contact = extract_contact_info(text)
        
        # Extract name
        name = extract_name(text, doc)
        
        # Parse sections
        raw_sections = parse_resume_sections(text)
        
        # Extract skills
        skills = extract_skills(text, doc)
        
        # Build response
        sections = {}
        
        if 'summary' in raw_sections:
            sections['summary'] = raw_sections['summary']
        
        if 'experience' in raw_sections:
            # For now, return raw text - future: parse into structured entries
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
        resume_keywords = set(kw.lower() for kw in extract_keywords(request.resumeText, 30))
        jd_keywords = set(kw.lower() for kw in extract_keywords(request.jobDescription, 30))
        
        matched = list(resume_keywords & jd_keywords)
        missing = list(jd_keywords - resume_keywords)
        
        match_ratio = len(matched) / max(len(jd_keywords), 1)
        
        return MatchKeywordsResponse(
            matched=matched,
            missing=missing[:15],  # Limit missing to 15 most important
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
        
        # Get resume text
        resume_text = request.resumeText or ""
        if request.parsedResume and 'sections' in request.parsedResume:
            resume_text = ' '.join(str(v) for v in request.parsedResume['sections'].values())
        
        jd_text = request.jobDescription or ""
        
        # 1. Keyword Match Score (0-100)
        if jd_text:
            resume_kw = set(kw.lower() for kw in extract_keywords(resume_text, 30))
            jd_kw = set(kw.lower() for kw in extract_keywords(jd_text, 30))
            matched = resume_kw & jd_kw
            keyword_score = int((len(matched) / max(len(jd_kw), 1)) * 100)
            
            missing = list(jd_kw - resume_kw)[:5]
            if missing:
                suggestions.append(f"Add these keywords: {', '.join(missing)}")
        else:
            keyword_score = 70  # Default if no JD provided
        
        # 2. Format Score (section completeness)
        sections = parse_resume_sections(resume_text)
        required_sections = ['summary', 'experience', 'education', 'skills']
        found_sections = sum(1 for s in required_sections if s in sections)
        format_score = int((found_sections / len(required_sections)) * 100)
        
        if 'summary' not in sections:
            suggestions.append("Add a professional summary section")
        if 'skills' not in sections:
            suggestions.append("Add a dedicated skills section")
        
        # 3. Section Completeness (based on content length)
        total_content = sum(len(str(v)) for v in sections.values())
        if total_content < 500:
            section_score = 50
            suggestions.append("Add more detail to your resume sections")
        elif total_content < 1500:
            section_score = 75
        else:
            section_score = 90
        
        # 4. Readability Score
        readability_score = calculate_readability(resume_text)
        
        # 5. Action Verb Score
        doc = nlp(resume_text.lower())
        verbs = [token.lemma_ for token in doc if token.pos_ == 'VERB']
        action_verb_count = sum(1 for v in verbs if v in ACTION_VERBS)
        action_score = min(100, action_verb_count * 10)
        
        if action_score < 50:
            suggestions.append("Use stronger action verbs (led, achieved, implemented, optimized)")
        
        # Calculate overall score (weighted average)
        overall_score = int(
            keyword_score * 0.35 +
            format_score * 0.20 +
            section_score * 0.20 +
            readability_score * 0.10 +
            action_score * 0.15
        )
        
        # Add generic suggestions if score is low
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
            suggestions=suggestions[:6]  # Limit to 6 suggestions
        )
        
    except Exception as e:
        logger.error(f"Error scoring ATS: {str(e)}")
        raise HTTPException(status_code=500, detail=f"ATS scoring failed: {str(e)}")

# Entry point for running locally
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
