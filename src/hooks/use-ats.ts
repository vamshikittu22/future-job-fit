import { useState, useEffect } from 'react';
import { ResumeData } from '@/lib/initialData';

const KEYWORDS = {
  technical: ['react', 'typescript', 'javascript', 'css', 'html', 'node.js', 'next.js', 'graphql', 'rest', 'api', 'git', 'webpack', 'babel', 'agile', 'tailwind'],
  actionVerbs: ['developed', 'led', 'managed', 'created', 'implemented', 'designed', 'architected', 'optimized', 'automated', 'streamlined'],
  degrees: ['bachelor', 'master', 'phd', 'mba', 'diploma', 'certification', 'certificate'],
};

const SCORING_WEIGHTS = {
  summaryKeywords: 15,
  skillsMatch: 25,
  experienceKeywords: 20,
  experienceImpact: 15,
  projectsKeywords: 10,
  educationRelevance: 5,
  achievements: 5,
  formatting: 5,
};

const countKeywords = (text: string, keywords: string[]): { count: number; matched: string[] } => {
  const lowerText = text.toLowerCase();
  const matched = keywords.filter(kw => new RegExp(`\\b${kw}\\b`, 'i').test(lowerText));
  return { count: matched.length, matched: Array.from(new Set(matched)) };
};

const checkQuantifiable = (text: string): boolean => /[\d%$x]/.test(text.toLowerCase());

export const useATS = (resumeData: ResumeData) => {
  const [atsScore, setAtsScore] = useState(0);
  const [analysis, setAnalysis] = useState<any>({});

  useEffect(() => {
    if (!resumeData) return;

    let totalScore = 0;
    const newAnalysis: any = {
      keywords: { matched: [], total: KEYWORDS.technical.length },
      sections: {},
      suggestions: [],
    };

    // 1. Summary Analysis
    const summaryText = resumeData.summary || '';
    const summaryMatch = countKeywords(summaryText, [...KEYWORDS.technical, ...KEYWORDS.actionVerbs]);
    const summaryScore = Math.min((summaryMatch.count / 5) * SCORING_WEIGHTS.summaryKeywords, SCORING_WEIGHTS.summaryKeywords);
    totalScore += summaryScore;
    newAnalysis.keywords.matched.push(...summaryMatch.matched);
    newAnalysis.sections.summary = (summaryScore / SCORING_WEIGHTS.summaryKeywords) * 100;
    if (summaryMatch.count < 3) newAnalysis.suggestions.push({ text: 'Add more role-specific keywords to your summary.', priority: 'high' });
    if (summaryText.length < 50) newAnalysis.suggestions.push({ text: 'Expand summary to at least 50 characters.', priority: 'medium' });

    // 2. Skills Analysis
    const skills = resumeData.skills || [];
    let allSkills: string[] = [];
    
    // Handle both old and new skills format
    if (Array.isArray(skills)) {
      // New format: Array of categories with items
      allSkills = skills.flatMap(category => 
        Array.isArray(category.items) ? category.items : []
      );
    } else if (typeof skills === 'object' && skills !== null) {
      // Old format: { languages: [], frameworks: [], tools: [] }
      allSkills = Object.values(skills).flat();
    }
    
    const skillsMatch = countKeywords(allSkills.join(' '), KEYWORDS.technical);
    const skillsScore = (skillsMatch.count / KEYWORDS.technical.length) * SCORING_WEIGHTS.skillsMatch;
    totalScore += skillsScore;
    newAnalysis.keywords.matched.push(...skillsMatch.matched);
    newAnalysis.sections.skills = (skillsScore / SCORING_WEIGHTS.skillsMatch) * 100;
    if (skillsMatch.count < KEYWORDS.technical.length / 2) {
      newAnalysis.suggestions.push({ 
        text: 'Add more technical skills relevant to the job description.', 
        priority: 'high' 
      });
    }

    // 3. Experience Analysis
    let experienceKeywordCount = 0;
    let quantifiableBullets = 0;
    let uniqueVerbs: string[] = [];
    (resumeData.experience || []).forEach(exp => {
      const expText = [exp.title, exp.company, ...exp.bullets].join(' ');
      const expMatch = countKeywords(expText, [...KEYWORDS.technical, ...KEYWORDS.actionVerbs]);
      experienceKeywordCount += expMatch.count;
      exp.bullets.forEach(b => { if (checkQuantifiable(b)) quantifiableBullets++; });
      uniqueVerbs.push(...countKeywords(exp.bullets.join(' '), KEYWORDS.actionVerbs).matched);
    });
    const experienceKeywordScore = Math.min((experienceKeywordCount / 10) * SCORING_WEIGHTS.experienceKeywords, SCORING_WEIGHTS.experienceKeywords);
    const experienceImpactScore = ((quantifiableBullets / (resumeData.experience?.length || 1)) / 2) * SCORING_WEIGHTS.experienceImpact;
    totalScore += experienceKeywordScore + experienceImpactScore;
    newAnalysis.sections.experience = ((experienceKeywordScore + experienceImpactScore) / (SCORING_WEIGHTS.experienceKeywords + SCORING_WEIGHTS.experienceImpact)) * 100;
    if (quantifiableBullets < resumeData.experience?.length) newAnalysis.suggestions.push({ text: 'Include more measurable results in Experience bullets.', priority: 'high' });
    if (Array.from(new Set(uniqueVerbs)).length < 5) newAnalysis.suggestions.push({ text: 'Use a variety of action verbs in Experience.', priority: 'medium' });

    // 4. Projects
    let projectKeywordCount = 0;
    (resumeData.projects || []).forEach(proj => {
      const projText = [proj.name, proj.tech, ...proj.bullets].join(' ');
      projectKeywordCount += countKeywords(projText, KEYWORDS.technical).count;
    });
    const projectsScore = Math.min((projectKeywordCount / 5) * SCORING_WEIGHTS.projectsKeywords, SCORING_WEIGHTS.projectsKeywords);
    totalScore += projectsScore;
    newAnalysis.sections.projects = (projectsScore / SCORING_WEIGHTS.projectsKeywords) * 100;

    // 5. Education
    let educationMatches = 0;
    (resumeData.education || []).forEach(ed => {
      educationMatches += countKeywords(ed.degree + ' ' + ed.field, KEYWORDS.degrees).count;
    });
    const educationScore = Math.min((educationMatches / 3) * SCORING_WEIGHTS.educationRelevance, SCORING_WEIGHTS.educationRelevance);
    totalScore += educationScore;
    newAnalysis.sections.education = (educationScore / SCORING_WEIGHTS.educationRelevance) * 100;
    if (educationMatches === 0) newAnalysis.suggestions.push({ text: 'Add relevant degrees or certifications.', priority: 'medium' });

    // 6. Achievements / Certifications
    let achievementCount = (resumeData.achievements || []).length;
    const achievementsScore = Math.min((achievementCount / 5) * SCORING_WEIGHTS.achievements, SCORING_WEIGHTS.achievements);
    totalScore += achievementsScore;
    newAnalysis.sections.achievements = (achievementsScore / SCORING_WEIGHTS.achievements) * 100;
    if (achievementCount === 0) newAnalysis.suggestions.push({ text: 'Add notable achievements or certifications.', priority: 'medium' });

    // 7. Formatting
    let formattingScore = SCORING_WEIGHTS.formatting;
    if (!resumeData.summary) formattingScore -= 3;
    if ((resumeData.experience || []).length === 0) formattingScore -= 4;
    if ((resumeData.skills || []).length === 0) formattingScore -= 3;
    totalScore += Math.max(0, formattingScore);

    newAnalysis.keywords.matched = Array.from(new Set(newAnalysis.keywords.matched));
    setAtsScore(Math.min(100, Math.round(totalScore)));
    setAnalysis(newAnalysis);

  }, [resumeData]);

  return { atsScore, analysis };
};
