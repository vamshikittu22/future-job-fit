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
    'Docker Compose', 'Podman', 'Helm', 'Flux', 'ArgoCD', 'Prometheus', 'Grafana', 'ELK Stack', 'DataDog', 'New Relic',
    'Tailwind', 'Sass', 'Less', 'CloudFront', 'Lambda', 'S3', 'EC2', 'RDS', 'Redshift', 'BigQuery', 'Snowflake', 'DynamoDB',
    'Mobile', 'iOS', 'Android', 'Flutter', 'React Native', 'Ionic', 'Capacitor', 'Embedded', 'Firmware', 'Real-time', 'Distributed'
]

# Words that should NEVER be considered keywords in an ATS context
PROHIBITED_KEYWORDS = {
    'remote', 'located', 'location', 'charleston', 'duration', 'contract', 'months', 'years', 'only', 'must', 'zone', 
    'time', 'work', 'corp', 'company', 'business', 'professional', 'summary', 'objective', 'skills', 'education', 
    'experience', 'projects', 'achievements', 'awards', 'honors', 'background', 'profile'
}

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
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'using', 'well', 'used', 'many', 'some', 'most', 'very', 'often', 'like', 'every',
    'any', 'both', 'once', 'here', 'there', 'too', 'now', 'page', 'site', 'work',
    'data', 'new', 'time', 'team', 'first', 'level', 'based', 'using', 'throughout'
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
    # 1. Identify explicit technical skills first
    text_lower = text.lower()
    found_tech = []
    for skill in TECH_SKILLS:
        # Use word boundaries for tech skills to avoid partial matches like 'Go' in 'Google'
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_tech.append(skill.lower())
    
    # 2. Extract other potentially relevant words (nouns/adj with >3 chars)
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text_lower)
    
    # Filter out stop words, prohibited words, and action verbs
    filtered = []
    for w in words:
        if (w not in STOP_WORDS and 
            w not in PROHIBITED_KEYWORDS and 
            w not in ACTION_VERBS and 
            len(w) > 3): # Favor longer words for non-predefined skills
            filtered.append(w)
            
    # Count frequencies
    word_counts = Counter(filtered)
    
    # Combine tech skills with top generic keywords
    # Tech skills get priority and are always included if they exist
    tech_set = set(found_tech)
    generic_keywords = [word for word, count in word_counts.most_common(topn) if word not in tech_set]
    
    combined = found_tech + generic_keywords
    return combined[:topn]

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

def rewrite_bullet(bullet: str, keyword: str) -> str:
    """Intelligently integrate a keyword into a bullet point."""
    trimmed = bullet.strip()
    if not trimmed:
        return f"• Proficient in {keyword.title()}."
    
    keyword = keyword.title()
    # Simple semantic replacement
    if 'experience' in trimmed.lower():
        return re.sub(r'experience', f'experience in {keyword}', trimmed, flags=re.IGNORECASE, count=1)
    if 'expertise' in trimmed.lower():
        return re.sub(r'expertise', f'expertise in {keyword}', trimmed, flags=re.IGNORECASE, count=1)
    if 'developed' in trimmed.lower():
        return re.sub(r'developed', f'developed {keyword}-driven', trimmed, flags=re.IGNORECASE, count=1)
    if 'using' in trimmed.lower():
        return re.sub(r'using', f'using {keyword} and', trimmed, flags=re.IGNORECASE, count=1)
        
    # Default: Append with a transition
    suffix = f" utilizing {keyword}"
    if trimmed.endswith('.'):
        return trimmed[:-1] + suffix + "."
    return trimmed + suffix + "."

def score_ats(resume_text: str, job_desc: str) -> dict:
    """Entry point for ATS scoring."""
    suggestions = []
    
    # Keyword Match
    # Extract name to filter it out from keywords
    candidate_name = extract_name(resume_text)
    name_parts = set(candidate_name.lower().split()) if candidate_name else set()
    
    resume_kw = set(extract_keywords(resume_text, 30)) - name_parts
    jd_kw = set(extract_keywords(job_desc, 30)) - name_parts
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

def optimize_resume(resume_text: str, job_desc: str) -> str:
    """Intelligently optimize resume by injecting missing keywords."""
    sections = parse_resume_sections(resume_text)
    
    # Identify missing keywords
    candidate_name = extract_name(resume_text)
    name_parts = set(candidate_name.lower().split()) if candidate_name else set()
    
    resume_kw = set(extract_keywords(resume_text, 50)) - name_parts
    jd_kw = set(extract_keywords(job_desc, 30)) - name_parts
    missing = list(jd_kw - resume_kw)
    
    if not missing:
        return resume_text

    # 1. Distribute some keywords into Experience Section (Better Integration)
    experience_content = sections.get('experience', '')
    experience_keywords = missing[:min(len(missing), 5)] # Take first few for experience
    remaining_keywords = missing[min(len(missing), 5):]
    
    if experience_content:
        lines = experience_content.split('\n')
        updated_lines = []
        kw_idx = 0
        for line in lines:
            trimmed = line.strip()
            # If it's a bullet point and we still have keywords to integrate
            if (trimmed.startswith('•') or trimmed.startswith('-') or trimmed.startswith('*')) and kw_idx < len(experience_keywords):
                prefix = ""
                if trimmed.startswith('•'): prefix = "• "
                elif trimmed.startswith('-'): prefix = "- "
                elif trimmed.startswith('*'): prefix = "* "
                
                raw_text = trimmed.lstrip('•-* ')
                line = prefix + rewrite_bullet(raw_text, experience_keywords[kw_idx])
                kw_idx += 1
            updated_lines.append(line)
        sections['experience'] = '\n'.join(updated_lines)

    # 2. Update/Add Skills section with remaining
    skills_text = sections.get('skills', '')
    if remaining_keywords:
        new_skills = [m.title() for m in remaining_keywords]
        if skills_text:
            sections['skills'] = skills_text + ", " + ", ".join(new_skills)
        else:
            sections['skills'] = ", ".join(new_skills)

    # 3. Enhance Summary if it exists
    summary_text = sections.get('summary', '')
    if summary_text:
        buzzwords = ", ".join([m.title() for m in missing[:2]])
        sections['summary'] = f"{summary_text.strip()} Expert in {buzzwords} with a focus on delivering high-impact solutions."

    # 3. Reconstruct Resume
    ordered_sections = ['header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements']
    output = []
    
    # Header is special - it's usually just the top part
    if 'header' in sections:
        output.append(sections['header'])
    
    for sec in ordered_sections[1:]:
        if sec in sections:
            # Add header for the section
            header_name = sec.upper()
            output.append(f"\n{header_name}")
            output.append(sections[sec])
            
    return "\n".join(output)

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
