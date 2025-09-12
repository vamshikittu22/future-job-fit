import { ResumeData } from '@/lib/initialData';

export interface FormattedResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    description?: string;
    highlights?: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location?: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Record<string, string[]>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  customSections: Array<{
    title: string;
    content: string | string[];
  }>;
}

/**
 * Format date to a readable format
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Present';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format skills into categorized groups
 */
const formatSkills = (skills: any[]): Record<string, string[]> => {
  if (!Array.isArray(skills)) return {};
  
  return skills.reduce((acc, skill) => {
    if (!skill || !skill.category || !skill.items) return acc;
    
    const category = skill.category.trim();
    if (!acc[category]) {
      acc[category] = [];
    }
    
    if (Array.isArray(skill.items)) {
      acc[category] = [...new Set([...acc[category], ...skill.items])];
    } else if (typeof skill.items === 'string') {
      acc[category] = [...new Set([...acc[category], skill.items])];
    }
    
    return acc;
  }, {} as Record<string, string[]>);
};

/**
 * Format raw resume data into the structure expected by the template
 */
export const formatResumeData = (data: ResumeData): FormattedResumeData => {
  // Extract personal info
  const personalInfo = {
    firstName: data.personal?.firstName || '',
    lastName: data.personal?.lastName || '',
    title: data.personal?.title || '',
    email: data.personal?.email || '',
    phone: data.personal?.phone || '',
    location: data.personal?.location || '',
    website: data.personal?.website || '',
  };

  // Format experience
  const experience = (data.experience || []).map(exp => ({
    title: exp.title || '',
    company: exp.company || '',
    location: exp.location,
    startDate: formatDate(exp.startDate),
    endDate: formatDate(exp.endDate),
    description: exp.description,
    highlights: exp.bullets || [],
  }));

  // Format education
  const education = (data.education || []).map(edu => ({
    degree: edu.degree || '',
    school: edu.school || '',
    location: edu.location,
    startDate: formatDate(edu.startDate),
    endDate: formatDate(edu.endDate),
    gpa: edu.gpa,
  }));

  // Format projects
  const projects = (data.projects || []).map(project => ({
    name: project.name || '',
    description: project.description || '',
    technologies: project.technologies || [],
    url: project.url,
  }));

  // Format certifications
  const certifications = (data.certifications || []).map(cert => ({
    name: cert.name || '',
    issuer: cert.issuer || '',
    date: cert.date || '',
    url: cert.url,
  }));

  // Format custom sections
  const customSections = (data.customSections || []).map(section => ({
    title: section.title || 'Untitled Section',
    content: Array.isArray(section.content) 
      ? section.content.filter(Boolean) 
      : section.content || '',
  }));

  return {
    personalInfo,
    summary: data.summary || '',
    experience,
    education,
    skills: formatSkills(data.skills || []),
    projects,
    certifications,
    customSections,
  };
};

// Export all utility functions
export default {
  formatResumeData,
  formatDate,
  formatSkills,
};
