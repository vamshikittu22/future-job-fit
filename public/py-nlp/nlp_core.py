# Resume Parser - Offline NLP Core
# Pure Python implementation (No FastAPI/Pydantic) for Pyodide compatibility

import re
from collections import Counter
from typing import Optional, List, Dict, Any

# --- Constants & Patterns ---

EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z]+')
PHONE_PATTERN = re.compile(r'[+]?[0-9][0-9 .()\-]{8,}[0-9]')
LINKEDIN_PATTERN = re.compile(r'linkedin\.com/in/[a-zA-Z0-9]+', re.IGNORECASE)
GITHUB_PATTERN = re.compile(r'github\.com/[a-zA-Z0-9]+', re.IGNORECASE)
URL_PATTERN = re.compile(r'https?://[^\s]+')

SECTION_HEADERS = {
    'experience': ['experience', 'employment', 'work history', 'professional experience', 'work experience'],
    'education': ['education', 'academic', 'qualifications', 'degrees'],
    'skills': ['skills', 'technical skills', 'competencies', 'technologies', 'expertise'],
    'projects': ['projects', 'personal projects', 'portfolio', 'side projects'],
    'summary': ['summary', 'objective', 'profile', 'about', 'professional summary'],
    'certifications': ['certifications', 'certificates', 'licenses', 'credentials'],
    'achievements': ['achievements', 'awards', 'honors', 'accomplishments']
}

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

ACTION_VERBS = {
    'led', 'managed', 'developed', 'created', 'designed', 'implemented', 'built',
    'architected', 'engineered', 'orchestrated', 'spearheaded', 'launched',
    'delivered', 'achieved', 'increased', 'reduced', 'improved', 'optimized',
    'streamlined', 'automated', 'collaborated', 'mentored', 'trained'
}

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

# --- Internal Utilities ---

def extract_contact_info(text: str) -> dict:
    result = {}
    emails = EMAIL_PATTERN.findall(text)
    if emails:
        result['email'] = emails[0]
    phones = PHONE_PATTERN.findall(text)
    if phones:
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
    skills = set()
    text_lower = text.lower()
    for skill in TECH_SKILLS:
        if skill.lower() in text_lower:
            skills.add(skill)
    return list(skills)[:50]

def identify_section(line: str) -> Optional[str]:
    line_lower = line.lower().strip()
    for section_name, keywords in SECTION_HEADERS.items():
        for keyword in keywords:
            if line_lower == keyword or line_lower.startswith(keyword + ':') or line_lower.startswith(keyword + ' '):
                return section_name
    return None

def parse_resume_sections(text: str) -> Dict[str, str]:
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

def extract_keywords(text: str, topn: int = 30) -> List[str]:
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    words = [w for w in words if w not in STOP_WORDS]
    word_counts = Counter(words)
    return [word for word, _ in word_counts.most_common(topn)]

def calculate_readability(text: str) -> int:
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

# --- Public API Functions ---

def parse_resume(text: str) -> dict:
    """Entry point for parsing a resume string."""
    contact = extract_contact_info(text)
    name = extract_name(text)
    raw_sections = parse_resume_sections(text)
    skills = extract_skills(text)
    
    sections = {}
    for key in ['summary', 'experience', 'education', 'projects', 'certifications', 'achievements']:
        if key in raw_sections:
            content = raw_sections[key]
            if key == 'summary':
                sections[key] = content
            else:
                # Split entries by double newline or common separators
                items = [item.strip() for item in re.split(r'\n\s*\n', content) if item.strip()]
                sections[key] = items
        else:
            sections[key] = [] if key != 'summary' else ""
    
    return {
        "name": name,
        "email": contact.get('email'),
        "phone": contact.get('phone'),
        "linkedin": contact.get('linkedin'),
        "github": contact.get('github'),
        "website": contact.get('website'),
        "sections": sections,
        "skills": skills
    }

def score_ats(resume_text: str, job_desc: str) -> dict:
    """Entry point for ATS scoring."""
    suggestions = []
    
    # Keyword Match
    resume_kw = set(extract_keywords(resume_text, 30))
    jd_kw = set(extract_keywords(job_desc, 30))
    matched = resume_kw & jd_kw
    match_ratio = len(matched) / max(len(jd_kw), 1)
    
    keyword_score = int(match_ratio * 100)
    missing = list(jd_kw - resume_kw)[:5]
    if missing:
        suggestions.append(f"Add these keywords: {', '.join(missing)}")
    
    # Format & Sections
    sections = parse_resume_sections(resume_text)
    required = ['summary', 'experience', 'education', 'skills']
    found = sum(1 for s in required if s in sections)
    format_score = int((found / len(required)) * 100)
    
    if 'summary' not in sections: suggestions.append("Add a professional summary section")
    if 'skills' not in sections: suggestions.append("Add a dedicated skills section")
    
    # Readability & Verbs
    readability_score = calculate_readability(resume_text)
    words = resume_text.lower().split()
    action_verb_count = sum(1 for w in words if w in ACTION_VERBS)
    action_score = min(100, action_verb_count * 10)
    
    if action_score < 50:
        suggestions.append("Use stronger action verbs (led, achieved, optimized)")
        
    overall_score = int(
        keyword_score * 0.40 +
        format_score * 0.20 +
        readability_score * 0.20 +
        action_score * 0.20
    )
    
    return {
        "score": overall_score,
        "matchRatio": round(match_ratio, 2),
        "matchingKeywords": list(matched),
        "missing": missing,
        "suggestions": suggestions[:5],
        "breakdown": {
            "keywordMatch": keyword_score,
            "formatScore": format_score,
            "readability": readability_score,
            "actionVerbs": action_score
        }
    }

if __name__ == "__main__":
    sample_resume = """
    John Doe
    john.doe@example.com | 123-456-7890
    linkedin.com/in/johndoe
    
    Summary
    Experienced Software Engineer with expertise in Python and React.
    
    Experience
    Senior Engineer at Tech Corp
    - Led a team of 5 developers to build a cloud platform using AWS and Docker.
    - Optimized database queries, reducing latency by 30%.
    
    Skills
    Python, JavaScript, React, AWS, Docker, SQL, Git
    """
    
    sample_jd = """
    We are looking for a Senior Software Engineer with strong Python and React skills.
    Experience with AWS and CI/CD is required.
    """
    
    print("--- Testing Parse Resume ---")
    parsed = parse_resume(sample_resume)
    import json
    print(json.dumps(parsed, indent=2))
    
    print("\n--- Testing ATS Score ---")
    scored = score_ats(sample_resume, sample_jd)
    print(json.dumps(scored, indent=2))
