import { ResumeData } from '@/shared/lib/initialData';

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
  personalLinks?: Array<{ label: string; url: string }>;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    description?: string[];
    highlights?: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location?: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    gpa?: string;
    year?: string;
  }>;
  skills: Record<string, string[]>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    highlights?: string[];
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  achievements?: string[];
  languages?: Array<{ language: string; proficiency?: string }>;
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
    if (!skill) return acc;
    // Accept either `category` or `name` for the group label
    const label = (skill.category || skill.name || '').toString().trim();
    if (!label) return acc;
    if (!acc[label]) {
      acc[label] = [];
    }
    
    if (Array.isArray(skill.items)) {
      acc[label] = [...new Set([...(acc[label] || []), ...skill.items])];
    } else if (typeof skill.items === 'string') {
      // If items is a comma-separated string
      const parts = skill.items.split(',').map((s: string) => s.trim()).filter(Boolean);
      acc[label] = [...new Set([...(acc[label] || []), ...parts])];
    }
    
    return acc;
  }, {} as Record<string, string[]>);
};

/**
 * Format raw resume data into the structure expected by the template
 */
export const formatResumeData = (data: ResumeData): FormattedResumeData => {
  // Extract personal info with extended properties for compatibility
  const personalExtended = data.personal as {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
  };
  
  const name = (personalExtended?.name || '').toString().trim();
  const firstNameFromName = name ? name.split(' ')[0] : '';
  const lastNameFromName = name ? name.split(' ').slice(1).join(' ') : '';
  const personalInfo = {
    firstName: personalExtended?.firstName || firstNameFromName || '',
    lastName: personalExtended?.lastName || lastNameFromName || '',
    title: personalExtended?.title || '',
    email: personalExtended?.email || '',
    phone: personalExtended?.phone || '',
    location: personalExtended?.location || '',
    website: personalExtended?.website || personalExtended?.linkedin || personalExtended?.portfolio || '',
  };

  // Normalize personal links (website/linkedin + custom links[])
  const rawLinks = Array.isArray((data as any).personal?.links) ? (data as any).personal.links : [];
  const personalLinks: Array<{ label: string; url: string }> = [];
  if (personalExtended?.website) personalLinks.push({ label: 'Website', url: personalExtended.website });
  if (personalExtended?.linkedin) personalLinks.push({ label: 'LinkedIn', url: personalExtended.linkedin });
  if (personalExtended?.github) personalLinks.push({ label: 'GitHub', url: personalExtended.github });
  if (personalExtended?.portfolio) personalLinks.push({ label: 'Portfolio', url: personalExtended.portfolio });
  rawLinks.forEach((l: any) => {
    if (l && (l.url || l.href)) {
      personalLinks.push({ label: l.label || l.name || 'Link', url: l.url || l.href });
    }
  });

  // Format experience with extended properties for compatibility
  const experience = (data.experience || []).map((exp: any) => {
    // Accept `position` as alias for `title`
    const title = exp.title || exp.position || '';
    // Derive dates from `duration` if explicit dates are missing
    let startDateRaw = exp.startDate;
    let endDateRaw = exp.endDate;
    if ((!startDateRaw && !endDateRaw) && typeof exp.duration === 'string') {
      const parts = exp.duration.split('-');
      if (parts.length >= 1) startDateRaw = parts[0]?.trim();
      if (parts.length >= 2) endDateRaw = parts[1]?.trim();
    }
    return {
      title,
      company: exp.company || '',
      location: exp.location,
      startDate: startDateRaw ? formatDate(startDateRaw) : '',
      endDate: endDateRaw ? formatDate(endDateRaw) : 'Present',
      description: exp.description,
      highlights: exp.bullets || exp.highlights || [],
    };
  });

  // Format education with extended properties for compatibility
  const education = (data.education || []).map((edu: any) => {
    // Handle both school and institution fields
    const school = edu.school || edu.institution || '';
    const location = edu.location || '';
    const degree = edu.degree || (edu.fieldOfStudy ? `${edu.fieldOfStudy}` : '') || '';
    
    // Handle dates - prefer year if available, otherwise use start/end dates
    let startDate = '';
    let endDate = '';
    
    if (edu.year) {
      // If year is provided, use it as is
      startDate = edu.year;
    } else if (edu.startDate) {
      // Otherwise format the dates
      startDate = formatDate(edu.startDate);
      if (edu.endDate) {
        endDate = formatDate(edu.endDate);
      } else if (edu.isCurrent) {
        endDate = 'Present';
      }
    }
    
    return {
      degree,
      school,
      location,
      startDate,
      endDate,
      isCurrent: edu.isCurrent,
      gpa: edu.gpa,
      year: edu.year // Keep original year if provided
    };
  });

  // Format projects with extended properties for compatibility
  const projects = (data.projects || []).map((project: any) => ({
    name: project.name || '',
    description: project.description || '',
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : (typeof project.tech === 'string' ? project.tech.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
    url: project.url || project.link,
    highlights: project.bullets || [], // Map bullets to highlights
  }));

  // Format certifications with extended properties for compatibility
  const certifications = (data.certifications || []).map((cert: any) => ({
    name: cert.name || '',
    issuer: cert.issuer || '',
    date: cert.date || '',
    url: cert.url || cert.credentialUrl || cert.link,
  }));

  // Achievements
  const achievements = (data.achievements || []).map((ach: any) => {
    if (typeof ach === 'string') return ach;
    const text = ach?.title || ach?.text || '';
    const date = ach?.date ? ` (${ach.date})` : '';
    return `${text}${date}`.trim();
  }).filter((s: string) => s);

  // Languages
  const languages = ((data as any).languages || []).map((lng: any) => ({
    language: lng.language || lng.name || '',
    proficiency: lng.proficiency || lng.level || '',
  })).filter((l: any) => l.language);

  // Format custom sections with extended properties for compatibility
  const customSections = (data.customSections || []).map((section: any) => {
    if (Array.isArray(section.items) && section.items.length > 0) {
      // Flatten items to a readable string array
      const contentList = section.items.map((item: any) => {
        const header = [item.title, item.subtitle, item.date].filter(Boolean).join(' | ');
        const desc = item.description ? `\n${item.description}` : '';
        const link = item.link ? `\nLink: ${item.link}` : '';
        return `${header}${desc}${link}`.trim();
      });
      return {
        title: section.title || 'Untitled Section',
        content: contentList,
      };
    }
    return {
      title: section.title || 'Untitled Section',
      content: Array.isArray(section.content) 
        ? section.content.filter(Boolean) 
        : (section.content || ''),
    };
  });

  return {
    personalInfo,
    personalLinks,
    summary: data.summary || (data.personal as any)?.summary || '',
    experience,
    education,
    skills: formatSkills((data.skills as any) || []),
    projects,
    certifications,
    achievements,
    languages,
    customSections,
  };
};

// Export all utility functions
export default {
  formatResumeData,
  formatDate,
  formatSkills,
};
