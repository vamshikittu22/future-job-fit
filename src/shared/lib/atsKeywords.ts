/**
 * ATS Keyword System
 * Provides a comprehensive dictionary of technology names, industries, and skills
 * used to filter and extract meaningful keywords from Job Descriptions.
 *
 * ⚠️  ALL entries here are PLAIN TEXT (no regex escaping).
 *     The extractATSKeywords function handles escaping internally.
 */

export const TECH_KEYWORDS = [
    // Programming Languages
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift',
    'Kotlin', 'PHP', 'SQL', 'R', 'Scala', 'Cobol', 'Fortran', 'Dart', 'Assembly', 'MATLAB',
    'Shell', 'Bash', 'PowerShell',
    // Frontend
    'React', 'Angular', 'Vue', 'Next.js', 'Nuxt.js', 'Svelte', 'SolidJS', 'Remix', 'Tailwind',
    'Sass', 'Less', 'Redux', 'Zustand', 'Framer Motion', 'Web Components', 'HTML5', 'CSS3',
    'Bootstrap', 'Material UI', 'Shadcn',
    // Backend & Frameworks
    'Node.js', 'Express', 'Deno', 'Bun', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Rails',
    'Laravel', 'ASP.NET', 'NestJS', 'Koa', 'Hapi', 'Phoenix', 'Gorilla Mux', 'Fiber',
    // Cloud & Infrastructure
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'DigitalOcean', 'Heroku', 'Netlify', 'Vercel',
    'CloudFront', 'Lambda', 'S3', 'EC2', 'RDS', 'Redshift', 'CloudFormation', 'Route53', 'IAM',
    // DevOps & Tools
    'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Pulumi', 'Jenkins', 'Git', 'GitHub Actions',
    'GitLab CI', 'CircleCI', 'CI/CD', 'DevOps', 'SRE', 'Helm', 'ArgoCD', 'Prometheus', 'Grafana',
    'ELK Stack', 'DataDog', 'New Relic', 'Datadog',
    // Databases
    'PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'Kafka',
    'RabbitMQ', 'Supabase', 'Firebase', 'Prisma', 'Drizzle', 'DynamoDB', 'Snowflake', 'BigQuery',
    'Oracle', 'SQLite',
    // AI & Data Science
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn',
    'OpenCV', 'HuggingFace', 'Transformers', 'LLM', 'LangChain', 'OpenAI', 'Computer Vision',
    'NLP', 'Neural Networks', 'Deep Learning', 'Machine Learning', 'Data Engineering',
    // APIs & Architecture
    'REST', 'GraphQL', 'gRPC', 'SOAP', 'API', 'Microservices', 'Serverless', 'WebSockets', 'TRPC',
    'Event-driven', 'SOA', 'DDD', 'TDD', 'BDD', 'Monolith',
    // Mobile
    'iOS', 'Android', 'Flutter', 'React Native', 'Ionic', 'Capacitor', 'SwiftUI', 'Jetpack Compose',
    // Testing
    'Jest', 'Cypress', 'Playwright', 'Vitest', 'Testing Library', 'Mocha', 'Chai', 'Selenium', 'Postman',
    // Management & Process
    'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Lean', 'Six Sigma', 'Product Management',
    'Project Management', 'SDLC', 'Waterfall',
];

export const INDUSTRY_KEYWORDS = [
    'Fintech', 'Healthcare', 'E-commerce', 'SaaS', 'Edtech', 'Adtech', 'Cybersecurity',
    'Logistics', 'Real Estate', 'Gaming', 'Web3', 'Blockchain', 'Crypto', 'Biotech',
    'Automotive', 'Renewable Energy',
];

export const SOFT_SKILLS = [
    'Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Critical Thinking',
    'Adaptability', 'Time Management', 'Conflict Resolution', 'Mentorship', 'Creativity',
    'Empathy', 'Public Speaking',
];

// Combine all into a master plain-text list
export const ATS_KEYWORDS = [...TECH_KEYWORDS, ...INDUSTRY_KEYWORDS, ...SOFT_SKILLS];

/**
 * Escapes special regex characters in a plain-text keyword string.
 * Handles C++, C#, Node.js, Next.js, CI/CD, etc. correctly.
 */
function escapeForRegex(keyword: string): string {
    return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a word-boundary-aware regex for a keyword.
 * Uses lookbehind/lookahead instead of \b to support
 * keywords that end or start with non-word characters (e.g., C++, C#, Next.js).
 */
function buildKeywordPattern(keyword: string): RegExp {
    const escaped = escapeForRegex(keyword);
    // Use negative lookbehind/lookahead for alphanumeric boundaries
    // This correctly handles "C++", "C#", "Node.js", "ASP.NET", "CI/CD", etc.
    return new RegExp(`(?<![a-zA-Z0-9._])${escaped}(?![a-zA-Z0-9._])`, 'gi');
}

/**
 * Extracts valid ATS keywords found in the provided text.
 * Prioritizes predefined tech and skill keywords.
 * Uses proper regex escaping and boundary detection.
 *
 * @param text - The job description or resume text to scan.
 * @returns Array of matched keyword strings (original casing from ATS_KEYWORDS).
 */
export const extractATSKeywords = (text: string): string[] => {
    if (!text || !text.trim()) return [];

    const found = new Set<string>();

    for (const keyword of ATS_KEYWORDS) {
        try {
            const pattern = buildKeywordPattern(keyword);
            if (pattern.test(text)) {
                found.add(keyword);
            }
        } catch {
            // Fallback: simple case-insensitive substring check
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                found.add(keyword);
            }
        }
    }

    return Array.from(found);
};

/**
 * Extracts ATS keywords from a JD and categorises them as required or preferred.
 * Follows Jobscan-style classification: lines containing "required", "must", "minimum"
 * contribute required keywords; lines with "preferred", "nice to have", "bonus" contribute
 * preferred keywords; all other matched keywords are classified as preferred by default.
 */
export interface CategorisedKeyword {
    keyword: string;
    importance: 'required' | 'preferred';
}

export const extractCategorisedATSKeywords = (jobDescription: string): CategorisedKeyword[] => {
    if (!jobDescription || !jobDescription.trim()) return [];

    const lines = jobDescription.split(/\r?\n/);
    const requiredKeywords = new Set<string>();
    const preferredKeywords = new Set<string>();

    // Pass 1: per-line classification (respects section context)
    const sectionState: { type: 'required' | 'preferred' | null } = { type: null };

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const lower = line.toLowerCase();

        // Detect section headers that switch context
        if (/^(required\s+qualifications?|requirements?|must[\s-]have|minimum\s+qualifications?|what\s+you[\s']+need|what\s+we[\s']+need|what\s+we[\s']+require|basic\s+qualifications?)\b/i.test(line)) {
            sectionState.type = 'required';
            continue;
        }
        if (/^(preferred\s+qualifications?|nice[\s-]to[\s-]have|plus|bonus|preferred|good[\s-]to[\s-]have|what\s+would\s+be\s+(great|a\s+plus))/i.test(line)) {
            sectionState.type = 'preferred';
            continue;
        }
        // Reset section on empty-like structural lines (e.g., "About Us", "Benefits")
        if (/^(about\s+(us|the\s+(company|role|team))|responsibilities|what\s+you[\s']+will|your\s+role|job\s+summary|overview|benefits|compensation|perks)/i.test(lower)) {
            sectionState.type = null;
        }

        // Inline signals (override section context for this line only)
        const lineIsRequired =
            sectionState.type === 'required' ||
            /\b(required|must(\s+have)?|mandatory|minimum|you\s+(must|need\s+to)\s+have)\b/i.test(line);
        const lineIsPreferred =
            sectionState.type === 'preferred' ||
            /\b(preferred|nice[\s-]to[\s-]have|bonus|plus|ideally|a\s+plus)\b/i.test(line);

        for (const keyword of ATS_KEYWORDS) {
            try {
                const pattern = buildKeywordPattern(keyword);
                if (pattern.test(line)) {
                    if (lineIsRequired && !preferredKeywords.has(keyword)) {
                        requiredKeywords.add(keyword);
                    } else if (!requiredKeywords.has(keyword)) {
                        preferredKeywords.add(keyword);
                    }
                }
            } catch {
                if (line.toLowerCase().includes(keyword.toLowerCase())) {
                    if (lineIsRequired && !preferredKeywords.has(keyword)) {
                        requiredKeywords.add(keyword);
                    } else if (!requiredKeywords.has(keyword)) {
                        preferredKeywords.add(keyword);
                    }
                }
            }
        }
    }

    const result: CategorisedKeyword[] = [];
    for (const kw of requiredKeywords) {
        result.push({ keyword: kw, importance: 'required' });
    }
    for (const kw of preferredKeywords) {
        if (!requiredKeywords.has(kw)) {
            result.push({ keyword: kw, importance: 'preferred' });
        }
    }

    // Sort: required first, then preferred; alphabetically within each group
    result.sort((a, b) => {
        if (a.importance !== b.importance) {
            return a.importance === 'required' ? -1 : 1;
        }
        return a.keyword.localeCompare(b.keyword);
    });

    return result;
};
