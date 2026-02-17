/**
 * ATS Keyword System
 * Provides a comprehensive dictionary of technology names, industries, and skills
 * used to filter and extract meaningful keywords from Job Descriptions.
 */

export const TECH_KEYWORDS = [
    // Programming Languages
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C\\+\\+', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'SQL', 'R', 'Scala', 'Cobol', 'Fortran', 'Dart', 'Assembly', 'MATLAB', 'Shell', 'Bash', 'PowerShell',
    // Frontend
    'React', 'Angular', 'Vue', 'Next\\.js', 'Nuxt\\.js', 'Svelte', 'SolidJS', 'Remix', 'Tailwind', 'Sass', 'Less', 'Redux', 'Zustand', 'Framer Motion', 'Web Components', 'HTML5', 'CSS3', 'Bootstrap', 'Material UI', 'Shadcn',
    // Backend & Frameworks
    'Node\\.js', 'Express', 'Deno', 'Bun', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Rails', 'Laravel', 'ASP\\.NET', 'NestJS', 'Koa', 'Hapi', 'Phoenix', 'Gorilla Mux', 'Fiber',
    // Cloud & Infrastructure
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'DigitalOcean', 'Heroku', 'Netlify', 'Vercel', 'CloudFront', 'Lambda', 'S3', 'EC2', 'RDS', 'Redshift', 'CloudFormation', 'Route53', 'IAM',
    // DevOps & Tools
    'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Pulumi', 'Jenkins', 'Git', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'CI/CD', 'DevOps', 'SRE', 'Helm', 'ArgoCD', 'Prometheus', 'Grafana', 'ELK Stack', 'DataDog', 'New Relic', 'Datadog',
    // Databases
    'PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'Kafka', 'RabbitMQ', 'Supabase', 'Firebase', 'Prisma', 'Drizzle', 'DynamoDB', 'Snowflake', 'BigQuery', 'Oracle', 'SQLite',
    // AI & Data Science
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'OpenCV', 'HuggingFace', 'Transformers', 'LLM', 'LangChain', 'OpenAI', 'Computer Vision', 'NLP', 'Neural Networks', 'Deep Learning', 'Machine Learning', 'Data Engineering',
    // APIs & Architecture
    'REST', 'GraphQL', 'gRPC', 'SOAP', 'API', 'Microservices', 'Serverless', 'WebSockets', 'TRPC', 'Event-driven', 'SOA', 'DDD', 'TDD', 'BDD', 'Monolith',
    // Mobile
    'iOS', 'Android', 'Flutter', 'React Native', 'Ionic', 'Capacitor', 'SwiftUI', 'Jetpack Compose',
    // Testing
    'Jest', 'Cypress', 'Playwright', 'Vitest', 'Testing Library', 'Mocha', 'Chai', 'Selenium', 'Postman',
    // Management & Process
    'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Lean', 'Six Sigma', 'Product Management', 'Project Management', 'SDLC', 'Waterfall'
];

export const INDUSTRY_KEYWORDS = [
    'Fintech', 'Healthcare', 'E-commerce', 'SaaS', 'Edtech', 'Adtech', 'Cybersecurity', 'Logistics', 'Real Estate', 'Gaming', 'Web3', 'Blockchain', 'Crypto', 'Biotech', 'Automotive', 'Renewable Energy'
];

export const SOFT_SKILLS = [
    'Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Critical Thinking', 'Adaptability', 'Time Management', 'Conflict Resolution', 'Mentorship', 'Creativity', 'Empathy', 'Public Speaking'
];

// Combine all into a master regex-safe list
export const ATS_KEYWORDS = [...TECH_KEYWORDS, ...INDUSTRY_KEYWORDS, ...SOFT_SKILLS];

/**
 * Extracts valid ATS keywords from a string of text.
 * Prioritizes predefined tech and skill keywords.
 */
export const extractATSKeywords = (text: string): string[] => {
    if (!text) return [];
    const textLower = text.toLowerCase();
    const found = new Set<string>();

    ATS_KEYWORDS.forEach(keyword => {
        // Escape dots for regex and handle C++ case
        const pattern = new RegExp(`\\b${keyword.replace('.', '\\.')}\\b`, 'gi');
        if (pattern.test(text)) {
            found.add(keyword);
        }
    });

    return Array.from(found);
};
