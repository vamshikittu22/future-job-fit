import { ResumeData } from './initialData';

export const sampleResumeData: ResumeData = {
  personal: {
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://sarahchen.dev',
    linkedin: 'https://linkedin.com/in/sarahchen',
    github: 'https://github.com/sarahchen',
    title: 'Senior Full-Stack Engineer',
  },
  summary: 'Results-driven Senior Full-Stack Engineer with 7+ years of experience building scalable web applications and leading cross-functional teams. Expert in React, Node.js, and cloud architecture with a proven track record of delivering high-impact solutions that increased user engagement by 150% and reduced infrastructure costs by 40%. Passionate about mentoring junior developers and implementing best practices in modern software development.',
  experience: [
    {
      id: '1',
      title: 'Senior Full-Stack Engineer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: `• Led development of microservices architecture serving 2M+ daily active users, resulting in 40% reduction in API response time
• Architected and implemented CI/CD pipeline using GitHub Actions and Docker, reducing deployment time from 2 hours to 15 minutes
• Mentored team of 5 junior developers through code reviews and pair programming sessions, improving team velocity by 35%
• Spearheaded migration from monolithic to microservices architecture, reducing infrastructure costs by $120K annually
• Implemented comprehensive testing strategy achieving 90%+ code coverage and reducing production bugs by 60%`,
    },
    {
      id: '2',
      title: 'Full-Stack Developer',
      company: 'InnovateTech',
      location: 'San Francisco, CA',
      startDate: '2019-01',
      endDate: '2021-02',
      current: false,
      description: `• Developed and launched 15+ customer-facing features in React/Node.js stack, increasing user engagement by 150%
• Optimized database queries and implemented Redis caching, improving page load times by 65%
• Collaborated with UX team to redesign core user workflows, resulting in 25% increase in conversion rates
• Built real-time notification system using WebSockets serving 500K+ concurrent connections
• Established automated testing framework reducing QA cycle time from 3 days to 8 hours`,
    },
    {
      id: '3',
      title: 'Junior Software Engineer',
      company: 'StartupVentures',
      location: 'San Francisco, CA',
      startDate: '2017-06',
      endDate: '2018-12',
      current: false,
      description: `• Developed responsive web applications using React, Redux, and Material-UI
• Implemented RESTful APIs using Node.js and Express, serving 100K+ requests daily
• Participated in agile development process including daily standups, sprint planning, and retrospectives
• Contributed to open-source internal component library used across 5 product teams
• Reduced page bundle size by 40% through code splitting and lazy loading optimization`,
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      fieldOfStudy: 'Computer Science',
      startDate: '2013-09',
      endDate: '2017-05',
      description: 'GPA: 3.8 | Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Web Development',
    },
  ],
  skills: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'SQL', 'HTML/CSS'],
    frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'GraphQL', 'Redux', 'Tailwind CSS'],
    tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'GitHub Actions', 'Jest', 'Cypress'],
  },
  projects: [
    {
      id: '1',
      name: 'DevCollab Platform',
      role: 'Lead Developer',
      description: 'Built collaborative coding platform enabling real-time pair programming with 10K+ monthly active users. Implemented WebRTC for video chat, Monaco Editor for code editing, and WebSocket-based synchronization. GitHub: https://github.com/sarahchen/devcollab',
      technologies: ['React', 'Node.js', 'WebRTC', 'Socket.io', 'MongoDB', 'AWS'],
      url: 'https://devcollab-demo.com',
      startDate: '2022-06',
      endDate: '2023-01',
    },
    {
      id: '2',
      name: 'AI Resume Optimizer',
      role: 'Full-Stack Developer',
      description: 'Created SaaS application using GPT-4 API to optimize resumes for ATS systems. Implemented keyword extraction, formatting analysis, and A/B testing for resume variations. Achieved 5K+ users in first 3 months. GitHub: https://github.com/sarahchen/resume-ai',
      technologies: ['Next.js', 'TypeScript', 'OpenAI API', 'Prisma', 'PostgreSQL', 'Stripe'],
      url: 'https://ai-resume-optimizer.com',
      startDate: '2023-02',
      endDate: '2023-08',
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'AWS Certified Solutions Architect',
      date: '2022-05',
      description: 'Professional level certification demonstrating expertise in designing distributed systems on AWS',
    },
    {
      id: '2',
      title: 'Hackathon Winner - Best AI Application',
      date: '2023-03',
      description: 'Led team to victory at TechCrunch Disrupt hackathon with AI-powered code review assistant',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      date: '2022-05',
      expiryDate: '2025-05',
      credentialId: 'AWS-PSA-12345',
      url: 'https://aws.amazon.com/verification',
    },
    {
      id: '2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2023-01',
      expiryDate: '2026-01',
      credentialId: 'CKA-67890',
      url: 'https://www.cncf.io/certification/cka/',
    },
  ],
  customSections: [],
};

export const loadSampleData = (): ResumeData => {
  return JSON.parse(JSON.stringify(sampleResumeData));
};
