import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { SECTION_NAMES, type SectionKey } from "@/constants/sectionNames";
import { Button } from "@/components/ui/button";
import type { ResumeData, ResumePreviewProps, CustomSection } from "@/types/resume";

// A4 dimensions in mm and pixels (moved to the top)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.78; // Approximate conversion
const PAGE_MARGIN_MM = 15;
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;
const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - (PAGE_MARGIN_MM * MM_TO_PX * 2);

// Reusing the CustomSection type from our types file
type CustomSectionData = CustomSection & {
  // Add any additional properties specific to the preview if needed
  items?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
    link?: string;
  }>;
}

// Using imported ResumePreviewProps from types/resume

const CustomSectionPreview = ({ section }: { section: CustomSectionData }) => {
  if (!section.items || section.items.length === 0) return null;

  return (
    <div className="mb-8">
      {section.description && (
        <p className="text-gray-800 mb-4">{section.description}</p>
      )}
      
      <div className="space-y-4">
        {section.items.map((item) => (
          <div key={item.id} className="pb-4">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-gray-900">
                {item.title}
              </h4>
              {item.date && (
                <span className="text-sm text-gray-700 whitespace-nowrap ml-4">
                  {item.date}
                </span>
              )}
            </div>
            {item.subtitle && (
              <p className="text-sm text-gray-700 mt-1">
                {item.subtitle}
              </p>
            )}
            {item.description && (
              <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">
                {item.description}
              </p>
            )}
            {item.link && (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm mt-1 inline-flex items-center"
              >
                {item.link}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple page break component
const PageBreak = () => <div style={{ pageBreakAfter: 'always' }} />;

const PrintStyles = () => {
  return (
    <style>
      {`@media print {
        @page {
          size: A4;
          margin: 15mm 15mm 15mm 15mm;
        }
        
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
        }

        .page-number {
          position: absolute;
          bottom: 10mm;
          right: 15mm;
          font-size: 10pt;
          color: #666;
        }
        
        .page {
          page-break-after: always;
        }
        
        .page:last-child {
          page-break-after: auto;
        }
      }
      
      @media (max-width: 768px) {
        .a4-container {
          max-width: 95vw;
          max-height: calc(100vh - 150px);
        }
      }
      
      @media (max-width: 480px) {
        .a4-container {
          max-width: 98vw;
          max-height: calc(100vh - 120px);
        }
      }`}
    </style>
  );
};

// Base styles with high contrast defaults
const baseStyles = {
  // Text colors - all high contrast
  primary: 'text-gray-900 font-semibold',
  secondary: 'text-gray-900',
  text: 'text-gray-900',
  muted: 'text-gray-800',
  
  // Background and borders - no light colors
  accent: 'bg-white',
  border: 'border-gray-300',
  highlight: 'bg-white',
  card: 'bg-white',
  
  // Links with good contrast
  link: 'text-blue-700 hover:text-blue-900 font-medium border-b border-blue-700 hover:border-blue-900',
  
  // Section styling with clear hierarchy
  sectionTitle: 'text-gray-900 border-b-2 border-gray-900 font-bold uppercase tracking-wide mb-4 pb-2',
  
  // Custom section styles
  customSection: 'mb-8',
  customSectionTitle: 'text-gray-900 font-semibold uppercase tracking-wider text-sm border-b-2 border-gray-900 pb-2 mb-4',
  customItem: 'mb-6 pb-6 border-b border-gray-300 last:border-0 last:pb-0',
  
  // Personal info section
  personalInfo: 'mb-10',
  
  // Standard section styling
  section: 'mb-10',
  item: 'mb-6 pb-6 border-b border-gray-300 last:border-0 last:pb-0',
  itemTitle: 'text-gray-900 font-semibold',
  itemSubtitle: 'text-gray-900 text-sm font-medium',
  date: 'text-sm text-gray-900 font-medium',
};

// Creative template styles - high contrast with pink accents
const creativeStyles = {
  ...baseStyles,
  // Text colors with pink accent
  primary: 'text-pink-800 font-semibold',
  secondary: 'text-gray-900',
  text: 'text-gray-900',
  muted: 'text-gray-900',
  
  // Interactive elements
  link: 'text-pink-800 hover:text-pink-900 font-medium border-b border-pink-800 hover:border-pink-900',
  
  // Section styling
  sectionTitle: 'text-pink-800 border-b-2 border-pink-800 font-bold uppercase tracking-wide mb-4 pb-2',
  section: 'mb-10 p-6 border border-pink-200 rounded-lg',
  item: 'mb-6 pb-6 border-b border-pink-200 last:border-0 last:pb-0',
  
  // Personal info with subtle pink background
  personalInfo: 'mb-10 p-8 border border-pink-200 rounded-lg bg-pink-50',
  
  // Custom sections
  customSection: 'mb-8 p-6 border border-pink-200 rounded-lg',
  customSectionTitle: 'text-pink-800 font-semibold uppercase tracking-wider text-sm border-b-2 border-pink-800 pb-2 mb-4',
  customItem: 'mb-6 pb-6 border-b border-pink-200 last:border-0 last:pb-0',
  
  // Ensure text remains high contrast
  itemTitle: 'text-pink-800 font-semibold',
  itemSubtitle: 'text-gray-900 text-sm font-medium',
  date: 'text-sm text-gray-900 font-medium',
};

// Modern template - clean with blue accents and high contrast
const modernStyles = {
  ...baseStyles,
  // Text colors with blue accent
  primary: 'text-blue-800 font-semibold',
  link: 'text-blue-800 hover:text-blue-900 font-medium border-b border-blue-800 hover:border-blue-900',
  
  // Section styling with blue accents
  sectionTitle: 'text-blue-800 border-b-2 border-blue-800 font-bold uppercase tracking-wide mb-4 pb-2',
  
  // Personal info with subtle blue background
  personalInfo: 'mb-10 p-8 border border-blue-200 rounded-lg bg-blue-50',
  
  // Custom sections
  customSectionTitle: 'text-blue-800 font-semibold uppercase tracking-wider text-sm border-b-2 border-blue-800 pb-2 mb-4',
  
  // Ensure text remains high contrast
  itemTitle: 'text-blue-800 font-semibold',
};

// Minimal template styles - clean and modern with proper contrast
const minimalStyles = {
  ...baseStyles,
  // Base text colors with good contrast
  primary: 'text-gray-900 font-semibold',
  secondary: 'text-gray-800',
  text: 'text-gray-900',
  muted: 'text-gray-800',
  
  // Section styling with proper contrast
  sectionTitle: 'text-gray-900 font-semibold uppercase tracking-wider text-sm border-b-2 border-gray-900 pb-2 mb-4',
  
  // Layout and spacing
  section: 'mb-10',
  item: 'mb-8 last:mb-0 pb-8 border-b border-gray-900 last:border-0',
  
  // Typography with better contrast
  itemTitle: 'text-gray-900 font-semibold',
  itemSubtitle: 'text-gray-900 text-sm font-medium',
  
  // Date and meta information
  date: 'text-sm text-gray-900 font-medium',
  
  // Links with good contrast
  link: 'text-blue-700 hover:text-blue-900 font-medium border-b border-blue-700 hover:border-blue-900',
  
  // Personal info section
  personalInfo: 'mb-10',
  
  // Custom sections
  customSection: 'mb-8',
  customSectionTitle: 'text-gray-900 font-semibold uppercase tracking-wider text-sm border-b-2 border-gray-900 pb-2 mb-4',
  customItem: 'mb-6 pb-6 border-b border-gray-200 last:border-0 last:pb-0',
  
  // Remove unnecessary decorations
  card: '',
  border: 'border-gray-200',
  highlight: 'bg-gray-50',
  
  // Ensure text is always dark on light background
  '& *': 'text-gray-900'
};

// Get template colors based on the selected template
const getTemplateColors = (templateName: string) => {
  const template = templateName.toLowerCase();
  
  if (template === 'creative') {
    return creativeStyles;
  }
  
  if (template === 'modern') {
    return modernStyles;
  }
  
  if (template === 'minimal') {
    return minimalStyles;
  }
  
  // For classic and other templates, use the base styles
  return baseStyles;
};

// Get template styles based on the selected template
const getTemplateStyles = (templateName: string) => {
  const colors = getTemplateColors(templateName);
  const isCreative = templateName.toLowerCase() === 'creative';
  const isModern = templateName.toLowerCase() === 'modern';

  // Base styles for all templates
  const baseStyles = {
    sectionTitle: cn(
      'text-lg font-bold mb-4 pb-2',
      colors.sectionTitle
    ),
    card: cn(
      'rounded-lg shadow-sm',
      colors.card,
      'border',
      colors.border
    ),
    section: cn(colors.section),
    item: cn(colors.item),
    itemTitle: cn('font-semibold', colors.primary),
    itemSubtitle: cn('text-sm', colors.muted),
    date: cn('text-sm whitespace-nowrap', colors.muted),
    link: colors.link,
    personalInfo: colors.personalInfo,
    customSection: colors.customSection,
    customSectionTitle: colors.customSectionTitle,
    customItem: colors.customItem
  };

  // Creative template applies custom styling to all sections
  if (isCreative) {
    return {
      ...baseStyles,
      section: cn(colors.section, 'p-6 rounded-lg border shadow-sm'),
      item: cn(colors.item, 'p-4')
    };
  }

  // Modern template only styles the personal info section
  if (isModern) {
    return {
      ...baseStyles,
      personalInfo: colors.personalInfo
    };
  }

  // Default template (plain)
  return baseStyles;
};

interface ResumePreviewProps {
  resumeData: ResumeData | null;
  template: string;
  currentPage: number;
  sectionOrder: string[];
  onTotalPagesChange?: (pages: number) => void;
  onPageChange?: (page: number) => void;
}

export default function ResumePreview({ 
  resumeData, 
  template, 
  currentPage,
  sectionOrder,
  onTotalPagesChange,
  onPageChange
}: ResumePreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  
  // Calculate total pages and notify parent
  const totalPages = useMemo(() => {
    if (!resumeData) return 1;
    
    // For now, return 1 as the default number of pages
    // We'll update this once renderContent is properly defined
    return 1;
    
    // The following code is commented out because it depends on renderContent
    // which is causing initialization issues
    /*
    let count = 1;
    const content = renderContent();
    if (content?.props?.children) {
      count += React.Children.toArray(content.props.children).filter((child: any) => 
        React.isValidElement(child) && child.type === PageBreak
      ).length;
    }
    return count;
    */
  }, [resumeData]);
  
  // Notify parent when total pages change
  useEffect(() => {
    if (onTotalPagesChange) {
      onTotalPagesChange(totalPages);
    }
  }, [totalPages, onTotalPagesChange]);

  const colors = useMemo(() => getTemplateColors(template), [template]);
  const styles = useMemo(() => getTemplateStyles(template), [template]);
  
  // Light mode styles
  const lightModeStyles = {
    '--text-primary': '#1f2937',    // text-gray-800
    '--bg-primary': '#ffffff',      // bg-white
    '--border-primary': '#e5e7eb',  // border-gray-200
    '--text-secondary': '#4b5563',  // text-gray-600
    '--text-heading': '#111827',    // text-gray-900
    '--link': '#2563eb',            // text-blue-600
    '--link-hover': '#1d4ed8'       // text-blue-700
  } as React.CSSProperties;

  // Handle scroll events to update current page
  const handleScroll = useCallback(() => {
    if (contentRef.current && onPageChange) {
      const scrollPosition = contentRef.current.scrollTop;
      const scrollPage = Math.floor(scrollPosition / (297 * 3.78)) + 1; // 297mm in pixels
      if (scrollPage >= 1 && scrollPage <= totalPages) {
        onPageChange(scrollPage);
      }
    }
  }, [totalPages, onPageChange]);

  // Handle page change with scroll
  const scrollToPage = useCallback((page: number) => {
    if (contentRef.current) {
      const pageHeight = 297 * 3.78; // A4 height in pixels
      contentRef.current.scrollTo({
        top: (page - 1) * pageHeight,
        behavior: 'smooth'
      });
      
      // Update the current page
      if (onPageChange) {
        onPageChange(page);
      }
    }
  }, [onPageChange]);

// Force light mode colors for all elements
  const previewClasses = cn(
    // Base layout and sizing
    'w-full p-0 m-0',
    'shadow-lg my-8',
    'transition-none',
    'h-[calc(100vh-200px)] overflow-auto',
    'resume-container font-sans',
    'relative',
    'mx-[14.17px] my-[14.17px] p-8',
    'aspect-[210/297]', // A4 aspect ratio (210mm x 297mm)
    'text-base leading-relaxed',
    // Force light colors
    'bg-white text-gray-800',
    // Force all text to be dark
    '[&]:text-gray-800',
    // Force all backgrounds to be white
    '[&]:bg-white',
    // Force all borders to be light
    '[&]:border-gray-200',
    // Force specific element colors
    '[&_.text-muted-foreground]:text-gray-600',
    '[&_.text-muted]:text-gray-600',
    '[&_h1]:text-gray-900',
    '[&_h2]:text-gray-800',
    '[&_h3]:text-gray-700',
    // Force links
    '[&_a]:text-blue-600',
    '[&_a:hover]:text-blue-800',
    // Force section titles
    '[&_.section-title]:text-gray-900',
    // Apply theme colors (light mode only)
    colors.text
  );

  const renderPersonalInfo = () => {
    const { personal } = resumeData || {};
    if (!personal) {
      console.log('No personal data found in resumeData:', resumeData);
      return (
        <div className={cn("p-6 rounded-lg border shadow-sm", styles.personalInfo)}>
          <p className="text-center text-gray-600">No personal information available. Please check your resume data.</p>
        </div>
      );
    }

    const contactItems = [
      { icon: '✉️', value: personal.email },
      { icon: '📱', value: personal.phone },
      { icon: '📍', value: personal.location },
      { icon: '🔗', value: personal.website, isLink: true },
      { icon: '💼', value: personal.linkedin, isLink: true, prefix: 'linkedin.com/in/' },
      { icon: '🐙', value: personal.github, isLink: true, prefix: 'github.com/' },
    ].filter(item => item.value);

    return (
      <div className={styles.personalInfo}>
        <div className="text-center mb-4">
          <h2 className={cn("text-3xl font-bold mb-2", styles.itemTitle)}>
            {personal.name || 'Your Name'}
          </h2>
          {personal.title && (
            <h3 className={cn("text-xl", styles.itemSubtitle)}>{personal.title}</h3>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {contactItems.length > 0 ? (
            contactItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="opacity-80">{item.icon}</span>
                {item.isLink ? (
                  <a 
                    href={`https://${item.prefix ? item.prefix : ''}${item.value}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn("hover:underline", styles.link)}
                  >
                    {item.prefix ? item.value.replace(/^https?:\/\//, '').replace(item.prefix, '') : item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm italic text-muted-foreground">No contact information provided</p>
          )}
        </div>
        <Separator className={colors.border} />
      </div>
    );
  };

  const renderSummary = () => {
    if (!resumeData?.summary) return null;
    
    return (
      <div className="mb-6">
        <h3 className={styles.sectionTitle}>
          {SECTION_NAMES.summary.toUpperCase()}
        </h3>
        <p className="whitespace-pre-line text-gray-800">
          {resumeData.summary}
        </p>
      </div>
    );
  };

  const renderSkills = () => {
    const skills = resumeData.skills || [];

    // Handle both old object format and new array format
    let skillsArray;
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === 'object' && skills !== null) {
      // Convert object format to array format
      skillsArray = Object.entries(skills).map(([name, items]) => ({
        id: name,
        name,
        items: Array.isArray(items) ? items : []
      }));
    } else {
      skillsArray = [];
    }

    const skillsWithItems = skillsArray.filter(
      (category: any) => category && Array.isArray(category.items) && category.items.length > 0
    );

    if (skillsWithItems.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={styles.sectionTitle}>
          {SECTION_NAMES.skills.toUpperCase()}
        </h3>
        <div className="space-y-2">
          {skillsWithItems.map((category: any) => (
            <div key={category.id || category.name} className="flex flex-wrap items-baseline gap-2">
              <span className="font-bold">{category.name}:</span>
              <span className="text-gray-800">
                {category.items.join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    const experiences = resumeData.experience || [];
    if (experiences.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className={styles.sectionTitle}>
          {SECTION_NAMES.experience.toUpperCase()}
        </h3>
        <div className="space-y-6">
          {experiences.map((exp: any, index: number) => {
            const title = exp.title || exp.position || 'Position';
            const when = exp.duration || ((exp.startDate || exp.endDate) ? `${exp.startDate || ''}${exp.startDate || exp.endDate ? ' - ' : ''}${exp.endDate || 'Present'}` : '');
            const bullets = Array.isArray(exp.bullets) ? exp.bullets.filter((b: string) => b && b.trim().length > 0) : [];
            return (
              <div key={exp.id || index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{title}</h4>
                    <div className="font-medium">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </div>
                  </div>
                  {when && (
                    <div className="text-sm font-medium whitespace-nowrap">
                      {when}
                    </div>
                  )}
                </div>
                {exp.description && (
                  <div className="mt-2 text-sm text-gray-800">
                    {exp.description}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="mt-2 pl-5 list-disc space-y-1">
                    {bullets.map((bullet: string, i: number) => (
                      <li key={i} className="text-sm text-gray-800">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    const education = resumeData.education || [];
    if (education.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className={styles.sectionTitle}>
          {SECTION_NAMES.education.toUpperCase()}
        </h3>
        <div className="space-y-4">
          {education.map((edu: any, index: number) => (
            <div key={edu.id || index}>
              <div className="flex justify-between">
                <h4 className="font-bold">{edu.degree}</h4>
                <span className="text-sm font-medium">
                  {edu.year || ((edu.startDate || edu.endDate) ? `${edu.startDate || ''}${edu.startDate || edu.endDate ? ' - ' : ''}${edu.endDate || 'Present'}` : '')}
                </span>
              </div>
              <div className="font-medium">
                {edu.school}
                {edu.location && `, ${edu.location}`}
              </div>
              {edu.gpa && (
                <div className="text-sm text-gray-800">
                  GPA: {edu.gpa}
                </div>
              )}
              {Array.isArray(edu.bullets) && edu.bullets.length > 0 && (
                <ul className="mt-2 pl-5 list-disc space-y-1">
                  {edu.bullets.map((b: string, i: number) => (
                    <li key={i} className="text-sm text-gray-800">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const projects = resumeData.projects || [];
    if (projects.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className={styles.sectionTitle}>
          {SECTION_NAMES.projects.toUpperCase()}
        </h3>
        <div className="space-y-6">
          {projects.map((project: any, index: number) => {
            const when = project.duration || ((project.startDate || project.endDate) ? `${project.startDate || ''}${project.startDate || project.endDate ? ' - ' : ''}${project.endDate || 'Present'}` : '');
            const bullets = Array.isArray(project.bullets) ? project.bullets.filter((b: string) => b && b.trim().length > 0) : [];
            
            return (
              <div key={project.id || index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{project.name}</h4>
                    {when && (
                      <div className="text-sm font-medium text-gray-800">{when}</div>
                    )}
                  </div>
                  {project.link && (
                    <a 
                      href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm ${styles.link} whitespace-nowrap`}
                    >
                      View Project
                    </a>
                  )}
                </div>
                {project.tech && (
                  <div className="text-sm mt-1 text-gray-800">
                    <span className="font-bold">Technologies:</span> {project.tech}
                  </div>
                )}
                {project.description && (
                  <p className="text-sm mt-2 text-gray-800">{project.description}</p>
                )}
                {bullets.length > 0 && (
                  <ul className="mt-2 pl-5 list-disc space-y-1">
                    {bullets.map((b: string, i: number) => (
                      <li key={i} className="text-sm text-gray-800">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    const achievements = resumeData.achievements || [];
    if (!achievements || achievements.length === 0) return null;

    // Support legacy string[] and new object format { id, title, date }
    return (
      <div className="mb-6">
        <h3 className={styles.sectionTitle}>
          {SECTION_NAMES.achievements.toUpperCase()}
        </h3>
        <ul className="space-y-2 list-disc pl-5">
          {achievements.map((ach: any, idx: number) => {
            if (typeof ach === 'string') {
              return <li key={idx} className="text-sm text-gray-800">{ach}</li>;
            }
            const text = ach.title || ach.text || '';
            const date = ach.date ? ` • ${ach.date}` : '';
            return (
              <li key={ach.id || idx} className="text-sm text-gray-800">
                {text}
                {date}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderCertifications = () => {
    const certifications = resumeData.certifications || [];
    if (certifications.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className={styles.sectionTitle}>
          {SECTION_NAMES.certifications.toUpperCase()}
        </h3>
        <div className="space-y-3">
          {certifications.map((cert: any, index: number) => (
            <div key={cert.id || index}>
              <div className="font-bold">{cert.name}</div>
              <div>
                {cert.issuer}
                {cert.date && ` • ${cert.date}`}
              </div>
              {cert.link && (
                <a
                  href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.link} text-xs`}
                >
                  View Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sectionComponents: { [key: string]: () => JSX.Element | null } = {
    personal: renderPersonalInfo,
    summary: renderSummary,
    skills: renderSkills,
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    certifications: renderCertifications,
    achievements: renderAchievements,
    custom: () => null, // We'll handle custom sections separately
  };

  const renderSections = () => {
    // First render regular sections
    const regularSections = sectionOrder
      .filter(sectionId => sectionId !== 'custom' && !sectionId.startsWith('custom-'))
      .map((sectionId) => {
        const Component = sectionComponents[sectionId];
        return Component ? (
          <div key={sectionId} className="section-container">
            {Component()}
          </div>
        ) : null;
      });

    // Then render custom sections
    const customSections = resumeData.customSections?.map((section: CustomSectionData) => (
      <div key={section.id} className="section-container">
        <h3 className={styles.sectionTitle}>{section.title.toUpperCase()}</h3>
        <CustomSectionPreview section={section} />
      </div>
    )) || [];

    return [...regularSections, ...customSections];
  };

  // Render custom section
  const renderCustomSection = (section: any) => {
    if (!section) return null;
    
    return (
      <div key={section.id} className={cn("mb-6", colors.secondary)}>
        <h3 className={styles.sectionTitle}>
          {section.title?.toUpperCase() || 'CUSTOM SECTION'}
        </h3>
        {section.description && (
          <p className="mb-4">{section.description}</p>
        )}
        {section.items?.map((item: any, index: number) => (
          <div key={item.id || index} className="mb-4">
            <div className="flex justify-between items-start">
              <h4 className={cn("font-semibold", colors.primary)}>{item.title}</h4>
              {item.date && (
                <span className={cn("text-sm", colors.secondary)}>
                  {item.date}
                </span>
              )}
            </div>
            {item.subtitle && (
              <div className={cn("text-sm", colors.secondary)}>{item.subtitle}</div>
            )}
            {item.description && (
              <p className="text-sm mt-1">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render a section with appropriate styling based on template
  const renderSection = (sectionId: string, content: React.ReactNode) => {
    if (!content) return null;
    
    const isCreative = template.toLowerCase() === 'creative';
    const isModern = template.toLowerCase() === 'modern';
    const isPersonalInfo = sectionId === 'personal';
    
    // For creative template, all sections get the creative styling
    if (isCreative) {
      return (
        <div 
          key={sectionId} 
          className={cn(
            'p-6 rounded-lg border shadow-sm mb-6',
            'bg-pink-50 border-pink-100', // Full opacity for better consistency
            isPersonalInfo && 'border-pink-200 shadow-md', // Keep special border for personal info
            styles.section,
            'text-gray-800' // Ensure text is readable on the pink background
          )}
        >
          {content}
        </div>
      );
    }
    
    // Modern template: Only personal info gets special treatment
    if (isModern && isPersonalInfo) {
      return (
        <div key={sectionId} className={styles.personalInfo}>
          {content}
        </div>
      );
    }
    
    // Default: Plain section with standard spacing
    return (
      <div key={sectionId} className="mb-6">
        {content}
      </div>
    );
  };

  // Render content with proper page breaks and template-specific styling
  const renderContent = useCallback(() => {
    if (!resumeData) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No resume data available
        </div>
      );
    }
    
    const { customSections = [] } = resumeData || {};
    
    // Get all section components in order
    const sectionComponents: { [key: string]: JSX.Element | null } = {
      personal: renderPersonalInfo(),
      summary: renderSummary(),
      experience: renderExperience(),
      education: renderEducation(),
      skills: renderSkills(),
      projects: renderProjects(),
      achievements: renderAchievements(),
      certifications: renderCertifications(),
      // Add custom sections
      ...customSections.reduce((acc: any, section: any) => {
        acc[section.id] = renderCustomSection(section.id);
        return acc;
      }, {})
    };
    
    // Get the order of sections to render
    const sectionsToRender = sectionOrder || [
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'achievements',
      'certifications',
      ...customSections.map((s: any) => s.id)
    ];
    
    // Filter out null/undefined sections and render them with appropriate styling
    const content = (
      <div className="space-y-6">
        {sectionsToRender
          .filter((sectionId: string) => sectionComponents[sectionId])
          .map((sectionId: string) => 
            renderSection(sectionId, sectionComponents[sectionId])
          )}
      </div>
    );
    
    // Render the content in a page container
    return (
      <div className="relative print:block">
        <div className="page">
          <div className="space-y-8 print:space-y-6">
            {content}
          </div>
          {totalPages > 1 && (
            <div className="page-number print:hidden">Page {currentPage} of {totalPages}</div>
          )}
        </div>
      </div>
    );
  }, [resumeData, sectionOrder, template]);

  // Screen and print styles for the resume container
  const screenStyles = `
    /* Base styles for both screen and print */
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }

    .a4-container {
      aspect-ratio: 210 / 297;
      max-width: min(90vw, 1200px);
      max-height: calc(100vh - 200px);
      margin: 2rem auto;
      position: relative;
      width: 100%;
      transform-origin: top center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      background: white;
      box-sizing: border-box;
      overflow: hidden;
    }
    
    .a4-container .resume-card {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
      background: white;
      display: flex;
      flex-direction: column;
    }
    
    .resume-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 2rem;
      -webkit-overflow-scrolling: touch;
      position: relative;
    }

    .page {
      page-break-after: always;
      break-after: page;
      min-height: calc(100% - 3rem);
      margin-bottom: 1.5rem;
      position: relative;
    }

    .page:last-child {
      page-break-after: auto;
      break-after: auto;
      margin-bottom: 0;
    }

    .page-number {
      position: absolute;
      bottom: 0;
      right: 2rem;
      font-size: 0.75rem;
      color: #6b7280;
    }
    
    /* Scrollbar styles */
    .resume-content::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    .resume-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    .resume-content::-webkit-scrollbar-thumb {
      background-color: #9ca3af;
      border-radius: 4px;
    }
    
    .resume-content::-webkit-scrollbar-thumb:hover {
      background-color: #6b7280;
    }
    
    /* Print styles moved to PrintStyles component */
    
    @media (max-width: 1024px) {
      .a4-container {
        width: 100% !important;
        height: auto !important;
        max-height: calc(100vh - 160px) !important;
        aspect-ratio: 210/297;
        padding: 0.5rem;
      }
      
      /* Adjust for smaller screens */
      @media (max-height: 800px) {
        .a4-container {
          max-height: 70vh !important;
        }
      }
      
      /* Mobile specific adjustments */
      @media (max-width: 480px) {
        .a4-container {
          max-height: 60vh !important;
          padding: 0.25rem;
        }
      }
    }
  `;
  // Handle scroll events to update current page
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    
    const handleScroll = () => {
      const scrollPosition = content.scrollTop;
      const newPage = Math.round(scrollPosition / CONTENT_HEIGHT_PX) + 1;
      
      if (newPage !== currentPage && onPageChange) {
        onPageChange(newPage);
      }
    };
    
    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  }, [currentPage, onPageChange, CONTENT_HEIGHT_PX]);
  
  // Handle scroll events to update current page
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    
    const handleScroll = () => {
      const pageHeight = A4_HEIGHT_PX - (PAGE_MARGIN_MM * MM_TO_PX * 2);
      const scrollPosition = content.scrollTop;
      const newPage = Math.round(scrollPosition / pageHeight) + 1;
      
      if (newPage !== currentPage && onPageChange) {
        onPageChange(newPage);
      }
    };
    
    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  }, [currentPage, onPageChange]);
  
  // Handle print
  const handlePrint = useCallback(() => {
    // Ensure we're on the first page before printing
    scrollToPage(1);
    // Small delay to ensure scroll completes
    setTimeout(() => window.print(), 100);
  }, [scrollToPage]);
  
  // Calculate content dimensions
  const contentPadding = `${PAGE_MARGIN_MM}mm`;
  const contentWidth = `calc(100% - ${PAGE_MARGIN_MM * 2}mm)`;

  // Light mode styles are defined at the top of the component



  // Render only the current page's content
  const renderCurrentPage = () => {
    const content = renderContent();
    if (!content || !content.props || !content.props.children) return null;
    
    // If it's a single page, return as is
    if (totalPages === 1) return content;

    // Find all page breaks
    const children = React.Children.toArray(content.props.children);
    const pageBreaks = children.reduce<number[]>((acc, child, index) => {
      if (React.isValidElement(child) && child.type === PageBreak) {
        acc.push(index);
      }
      return acc;
    }, []);

    // Calculate start and end indices for current page
    const startIdx = currentPage === 1 ? 0 : (pageBreaks[currentPage - 2] || 0) + 1;
    const endIdx = pageBreaks[currentPage - 1] || children.length;

    // Return only the current page's content
    return React.cloneElement(content, {
      children: children.slice(startIdx, endIdx).filter(child => 
        !(React.isValidElement(child) && child.type === PageBreak)
      )
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        className={cn(
          'flex-1',
          'print:overflow-visible',
          template.toLowerCase() === 'creative' ? 'bg-pink-50' : 'bg-white',
          'resume-content',
          'print:shadow-none',
          'relative',
          'overflow-auto'
        )}
        style={{
          ...lightModeStyles,
          color: 'rgb(31, 41, 55)',
          backgroundColor: template.toLowerCase() === 'creative' ? '#fdf2f8' : 'white',
          padding: '15mm',
          boxSizing: 'border-box',
        }}
        ref={contentRef}
      >
        {renderCurrentPage()}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-24"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-24"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @page {
            size: A4;
            margin: 0;
          }
          
          @media print {
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            
            .print\:hidden {
              display: none !important;
            }

            .page-break {
              page-break-after: always;
              break-after: page;
            }
          }
        `
      }} />
    </div>
  );
}