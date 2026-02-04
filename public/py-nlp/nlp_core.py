# Resume Parser - Offline NLP Core
# Pure Python implementation (No FastAPI/Pydantic) for Pyodide compatibility

import re
import json
from collections import Counter
from typing import Optional, List, Dict, Any, Set

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

# Shared constants - will be loaded from shared-constants.json
TECH_SKILLS: List[str] = []
SOFT_SKILLS: List[str] = []
STOP_WORDS: Set[str] = set()
_constants_loaded = False

def _load_shared_constants() -> None:
    """Load shared constants from shared-constants.json file."""
    global TECH_SKILLS, SOFT_SKILLS, STOP_WORDS, _constants_loaded
    
    if _constants_loaded:
        return
    
    try:
        # Try to read from filesystem (works in both Pyodide and regular Python)
        with open('shared-constants.json', 'r', encoding='utf-8') as f:
            constants = json.load(f)
        TECH_SKILLS = constants.get('TECH_SKILLS', [])
        SOFT_SKILLS = constants.get('SOFT_SKILLS', [])
        STOP_WORDS = set(constants.get('STOP_WORDS', []))
        _constants_loaded = True
        print('[Shared Constants] Loaded from shared-constants.json')
    except Exception as e:
        print(f'[Shared Constants] Failed to load from file: {e}, using defaults')
        # Fallback defaults
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
        SOFT_SKILLS = [
            'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
            'collaboration', 'mentoring', 'management', 'strategic', 'innovative'
        ]
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
        _constants_loaded = True

def ensure_constants_loaded() -> None:
    """Ensure shared constants are loaded before use."""
    if not _constants_loaded:
        _load_shared_constants()

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

# Load constants on module import
_load_shared_constants()

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

# =============================================================================
# NEW ATS ENGINE V2 - Structured responses matching TypeScript contracts
# =============================================================================

# --- Type Constants ---
KEYWORD_CATEGORIES = ['hard_skill', 'tool', 'concept', 'soft_skill']

SOFT_SKILL_PATTERNS = [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'collaboration', 'mentoring', 'management', 'strategic', 'innovative',
    'adaptable', 'creative', 'detail-oriented', 'organized', 'proactive'
]

TOOL_KEYWORDS = [
    'docker', 'kubernetes', 'git', 'jenkins', 'jira', 'terraform', 'ansible', 
    'github', 'gitlab', 'confluence', 'prometheus', 'grafana', 'datadog',
    'helm', 'argocd', 'circleci', 'travis', 'bamboo', 'slack', 'notion'
]

JD_SECTION_PATTERNS = {
    'requirements': ['requirements', 'qualifications', 'must have', 'required', 'you have', 'you bring'],
    'responsibilities': ['responsibilities', 'duties', 'what you will do', 'role', 'you will'],
    'nice_to_have': ['nice to have', 'preferred', 'bonus', 'plus', 'ideal'],
    'about': ['about us', 'about the company', 'who we are', 'company', 'we are']
}

def _generate_id() -> str:
    """Generate a simple unique ID."""
    import hashlib
    import time
    return hashlib.md5(f"{time.time()}".encode()).hexdigest()[:12]


def _categorize_keyword(keyword: str) -> str:
    """Categorize a keyword into hard_skill, tool, concept, or soft_skill."""
    kw_lower = keyword.lower()
    
    # Check if it's a tool
    if any(tool in kw_lower for tool in TOOL_KEYWORDS):
        return 'tool'
    
    # Check if it's a soft skill
    if any(soft in kw_lower for soft in SOFT_SKILL_PATTERNS):
        return 'soft_skill'
    
    # Check if it's a known tech skill (hard skill)
    for skill in TECH_SKILLS:
        if skill.lower() == kw_lower:
            return 'hard_skill'
    
    # Default to concept
    return 'concept'


def parse_jd(text: str) -> dict:
    """
    Parse a job description into a structured JobDescriptionModel.
    
    Returns a dict matching the TypeScript JobDescriptionModel interface:
    {
        id: string,
        rawText: string,
        sections: Record<string, string>,
        categorizedKeywords: KeywordModel[]
    }
    """
    # Parse sections
    sections = {}
    lines = text.split('\n')
    current_section = 'general'
    current_content = []
    
    for line in lines:
        lower_line = line.lower().strip()
        found_section = None
        
        # Check each section pattern
        for section_key, patterns in JD_SECTION_PATTERNS.items():
            for pattern in patterns:
                if pattern in lower_line and len(lower_line) < 60:
                    found_section = section_key
                    break
            if found_section:
                break
        
        if found_section:
            if current_content:
                sections[current_section] = '\n'.join(current_content)
            current_section = found_section
            current_content = []
        else:
            current_content.append(line)
    
    if current_content:
        sections[current_section] = '\n'.join(current_content)
    
    # Extract and categorize keywords
    categorized_keywords = []
    text_lower = text.lower()
    keyword_counts = {}
    
    # Find all tech skills in the JD
    for skill in TECH_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        if matches:
            keyword_counts[skill.lower()] = len(matches)
    
    # Add multi-word phrase detection
    multi_word_patterns = [
        r'\b(spring boot|react native|machine learning|deep learning|data science|full stack|front.?end|back.?end|cloud computing|ci/cd)\b'
    ]
    for pattern in multi_word_patterns:
        matches = re.findall(pattern, text_lower)
        for match in matches:
            key = match.lower()
            if key not in keyword_counts:
                keyword_counts[key] = 1
    
    # Determine which section each keyword came from (prioritize requirements)
    requirements_text = sections.get('requirements', '').lower()
    
    for keyword, count in keyword_counts.items():
        category = _categorize_keyword(keyword)
        
        # Determine section
        jd_section = 'general'
        if keyword in requirements_text:
            jd_section = 'requirements'
        
        # Calculate weight (requirements get 1.5x boost)
        base_weight = 1.0
        frequency_bonus = min(count - 1, 2) * 0.25
        section_bonus = 0.5 if jd_section == 'requirements' else 0
        
        categorized_keywords.append({
            'keyword': keyword,
            'category': category,
            'weight': base_weight + frequency_bonus + section_bonus,
            'frequency': count,
            'jdSection': jd_section
        })
    
    # Sort by weight descending
    categorized_keywords.sort(key=lambda x: x['weight'], reverse=True)
    
    return {
        'id': _generate_id(),
        'rawText': text,
        'sections': sections,
        'categorizedKeywords': categorized_keywords
    }


def parse_resume_canonical(text: str) -> dict:
    """
    Parse a resume into a canonical format with location strings for each token.
    
    Returns a dict with:
    {
        sections: {summary: str, experience: [], skills: [], ...},
        tokens: [{text: str, location: str, normalized: str}, ...]
    }
    """
    sections = parse_resume_sections(text)
    tokens = []
    
    # Process summary
    summary = sections.get('summary', '')
    if summary:
        for word in summary.lower().split():
            clean = re.sub(r'[^a-zA-Z0-9\-+#]', '', word)
            if clean and clean not in STOP_WORDS:
                tokens.append({
                    'text': clean,
                    'location': 'summary:0',
                    'normalized': clean.lower()
                })
    
    # Process experience (extract bullet points)
    experience_text = sections.get('experience', '')
    if experience_text:
        bullets = re.split(r'\n\s*[-•*]\s*', experience_text)
        for i, bullet in enumerate(bullets):
            bullet = bullet.strip()
            if bullet:
                words = bullet.lower().split()
                for word in words:
                    clean = re.sub(r'[^a-zA-Z0-9\-+#]', '', word)
                    if clean and clean not in STOP_WORDS:
                        tokens.append({
                            'text': clean,
                            'location': f'experience:0:bullets:{i}',
                            'normalized': clean.lower()
                        })
    
    # Process skills
    skills_text = sections.get('skills', '')
    if skills_text:
        # Skills are usually comma-separated
        skills = re.split(r'[,\n•\-*]', skills_text)
        for i, skill in enumerate(skills):
            skill = skill.strip()
            if skill:
                tokens.append({
                    'text': skill,
                    'location': f'skills:0:list:{i}',
                    'normalized': skill.lower()
                })
    
    # Also extract tech skills from full text
    text_lower = text.lower()
    for skill in TECH_SKILLS:
        if skill.lower() in text_lower:
            tokens.append({
                'text': skill,
                'location': 'detected',
                'normalized': skill.lower()
            })
    
    return {
        'sections': sections,
        'tokens': tokens
    }


def _normalize_for_fuzzy_matching(text: str) -> str:
    """
    Normalize text for fuzzy matching by removing common suffixes and variations.
    E.g., "ReactJS" -> "react", "React.js" -> "react", "Node.JS" -> "node"
    """
    # Convert to lowercase
    normalized = text.lower()
    
    # Remove common suffixes/prefixes for tech terms
    suffixes = ['.js', '.ts', '.jsx', '.tsx', 'js', 'ts', 'jsx', 'tsx', '.net', 'js', 'py']
    for suffix in suffixes:
        if normalized.endswith(suffix):
            normalized = normalized[:-len(suffix)]
            break
    
    # Remove version numbers (e.g., "python3" -> "python")
    normalized = re.sub(r'\d+$', '', normalized)
    
    # Remove common abbreviations
    abbreviations = {'js': 'javascript', 'ts': 'typescript', 'py': 'python'}
    if normalized in abbreviations:
        normalized = abbreviations[normalized]
    
    return normalized.strip()


def _calculate_similarity(str1: str, str2: str) -> float:
    """
    Calculate similarity between two strings using Levenshtein distance ratio.
    Returns a value between 0.0 and 1.0.
    """
    # Quick exact match
    if str1 == str2:
        return 1.0
    
    # Normalize both strings
    norm1 = _normalize_for_fuzzy_matching(str1)
    norm2 = _normalize_for_fuzzy_matching(str2)
    
    # Check normalized match
    if norm1 == norm2:
        return 0.95  # High similarity for normalized match
    
    # Check if one contains the other
    if norm1 in norm2 or norm2 in norm1:
        return 0.9
    
    # Calculate Levenshtein distance
    len1, len2 = len(norm1), len(norm2)
    if len1 == 0 or len2 == 0:
        return 0.0
    
    # Create distance matrix
    matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    
    for i in range(len1 + 1):
        matrix[i][0] = i
    for j in range(len2 + 1):
        matrix[0][j] = j
    
    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            cost = 0 if norm1[i - 1] == norm2[j - 1] else 1
            matrix[i][j] = min(
                matrix[i - 1][j] + 1,      # deletion
                matrix[i][j - 1] + 1,      # insertion
                matrix[i - 1][j - 1] + cost # substitution
            )
    
    distance = matrix[len1][len2]
    max_len = max(len1, len2)
    similarity = 1.0 - (distance / max_len) if max_len > 0 else 0.0
    
    return similarity


def match_keywords(jd_model: dict, resume_model: dict, fuzzy_threshold: float = 0.85) -> list:
    """
    Match JD keywords against resume tokens with fuzzy matching support.
    
    Args:
        jd_model: Job description model with categorized keywords
        resume_model: Resume model with tokens
        fuzzy_threshold: Minimum similarity score (0.0-1.0) for fuzzy matches
    
    Returns a list of MatchResultModel dicts:
    {
        keyword: string,
        category: KeywordCategory,
        status: MatchStatus,
        locations: string[],
        scoreContribution: number,
        matchedVariant: string | None  # The actual variant found (e.g., "ReactJS" for keyword "React")
    }
    """
    results = []
    resume_tokens = resume_model.get('tokens', [])
    
    # Create a set of normalized resume tokens for fast lookup
    resume_token_set = {t['normalized'] for t in resume_tokens}
    
    # Create a location map
    location_map = {}
    for token in resume_tokens:
        normalized = token['normalized']
        if normalized not in location_map:
            location_map[normalized] = []
        if token['location'] not in location_map[normalized]:
            location_map[normalized].append(token['location'])
    
    for kw in jd_model.get('categorizedKeywords', []):
        keyword = kw['keyword']
        keyword_normalized = keyword.lower()
        matched_variant = None
        
        # Check for exact match
        locations = location_map.get(keyword_normalized, [])
        
        # Also check for partial matches (e.g., "react" in "react.js")
        if not locations:
            for token_norm in resume_token_set:
                if keyword_normalized in token_norm or token_norm in keyword_normalized:
                    if token_norm in location_map:
                        locations = location_map[token_norm]
                        matched_variant = token_norm
                    break
        
        # Fuzzy matching for variations (e.g., "React" vs "ReactJS" vs "React.js")
        if not locations:
            best_match = None
            best_similarity = 0.0
            
            for token_norm in resume_token_set:
                similarity = _calculate_similarity(keyword_normalized, token_norm)
                if similarity >= fuzzy_threshold and similarity > best_similarity:
                    best_similarity = similarity
                    best_match = token_norm
            
            if best_match and best_match in location_map:
                locations = location_map[best_match]
                matched_variant = best_match
        
        if locations:
            status = 'matched'
            score_contribution = kw['weight'] * 5
        else:
            status = 'missing'
            score_contribution = 0
        
        result = {
            'keyword': keyword,
            'category': kw['category'],
            'status': status,
            'locations': locations,
            'scoreContribution': score_contribution
        }
        
        # Only add matchedVariant if there's a fuzzy match
        if matched_variant and matched_variant != keyword_normalized:
            result['matchedVariant'] = matched_variant
        
        results.append(result)
    
    return results


def calculate_ats_score(jd_model: dict, match_results: list, resume_text: str) -> dict:
    """
    Calculate the ATS score breakdown from match results.
    
    Returns ATSScoreBreakdown:
    {
        hardSkillScore: number,
        toolsScore: number,
        conceptScore: number,
        roleTitleScore: number,
        structureScore: number,
        total: number
    }
    """
    # Group by category
    by_category = {
        'hard_skill': {'matched': 0, 'total': 0},
        'tool': {'matched': 0, 'total': 0},
        'concept': {'matched': 0, 'total': 0},
        'soft_skill': {'matched': 0, 'total': 0}
    }
    
    for result in match_results:
        cat = result['category']
        if cat in by_category:
            by_category[cat]['total'] += 1
            if result['status'] == 'matched':
                by_category[cat]['matched'] += 1
    
    # Calculate category scores (0-100)
    def calc_score(cat):
        if by_category[cat]['total'] == 0:
            return 100  # No requirements = perfect score
        return int((by_category[cat]['matched'] / by_category[cat]['total']) * 100)
    
    hard_skill_score = calc_score('hard_skill')
    tools_score = calc_score('tool')
    concept_score = calc_score('concept')
    
    # Role title match (simplified - check for common title patterns)
    role_title_score = 75  # Default
    
    # Structure score - check for key sections
    text_lower = resume_text.lower()
    has_experience = bool(re.search(r'experience|work history|employment', text_lower))
    has_education = bool(re.search(r'education|degree|university', text_lower))
    has_skills = bool(re.search(r'skills|technologies|proficient', text_lower))
    structure_score = (40 if has_experience else 0) + (30 if has_education else 0) + (30 if has_skills else 0)
    
    # Total using formula: (HardSkill * 0.45) + (Tools * 0.20) + (Concepts * 0.20) + (RoleTitle * 0.10) + (Structure * 0.05)
    total = int(
        hard_skill_score * 0.45 +
        tools_score * 0.20 +
        concept_score * 0.20 +
        role_title_score * 0.10 +
        structure_score * 0.05
    )
    
    return {
        'hardSkillScore': hard_skill_score,
        'toolsScore': tools_score,
        'conceptScore': concept_score,
        'roleTitleScore': role_title_score,
        'structureScore': structure_score,
        'total': total
    }


def generate_recommendations(match_results: list) -> list:
    """
    Generate actionable recommendations from match results.
    
    Returns a list of Recommendation dicts:
    {
        id: string,
        message: string,
        severity: 'info' | 'warning' | 'critical',
        targetLocation?: string,
        category?: KeywordCategory,
        keyword?: string
    }
    """
    recommendations = []
    
    # Group missing keywords by category
    missing_by_category = {
        'hard_skill': [],
        'tool': [],
        'concept': [],
        'soft_skill': []
    }
    
    for result in match_results:
        if result['status'] == 'missing':
            cat = result['category']
            if cat in missing_by_category:
                missing_by_category[cat].append(result['keyword'])
    
    # Generate recommendations for missing high-priority keywords
    if missing_by_category['hard_skill']:
        keywords = missing_by_category['hard_skill'][:3]
        recommendations.append({
            'id': _generate_id(),
            'message': f"Add these technical skills to your experience or skills section: {', '.join(keywords)}",
            'severity': 'critical',
            'targetLocation': 'experience',
            'category': 'hard_skill'
        })
    
    if missing_by_category['tool']:
        keywords = missing_by_category['tool'][:3]
        recommendations.append({
            'id': _generate_id(),
            'message': f"Consider adding experience with these tools: {', '.join(keywords)}",
            'severity': 'warning',
            'targetLocation': 'skills',
            'category': 'tool'
        })
    
    if missing_by_category['concept']:
        keywords = missing_by_category['concept'][:2]
        recommendations.append({
            'id': _generate_id(),
            'message': f"Include these relevant concepts in your resume: {', '.join(keywords)}",
            'severity': 'info',
            'targetLocation': 'summary',
            'category': 'concept'
        })
    
    return recommendations


def evaluate_ats(resume_text: str, jd_text: str) -> dict:
    """
    Complete ATS evaluation - the main entry point for structured ATS analysis.
    
    Returns ATSEvaluationResponse:
    {
        jdModel: JobDescriptionModel,
        matchResults: MatchResultModel[],
        scoreBreakdown: ATSScoreBreakdown,
        recommendations: Recommendation[]
    }
    """
    # Parse JD
    jd_model = parse_jd(jd_text)
    
    # Parse resume
    resume_model = parse_resume_canonical(resume_text)
    
    # Match keywords
    match_results = match_keywords(jd_model, resume_model)
    
    # Calculate score
    score_breakdown = calculate_ats_score(jd_model, match_results, resume_text)
    
    # Generate recommendations
    recommendations = generate_recommendations(match_results)
    
    return {
        'jdModel': jd_model,
        'matchResults': match_results,
        'scoreBreakdown': score_breakdown,
        'recommendations': recommendations
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
