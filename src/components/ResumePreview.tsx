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

// A4 dimensions in mm and pixels
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.78; // Approximate conversion
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;
const PAGE_MARGIN_MM = 15; // 15mm margins on all sides
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - (PAGE_MARGIN_MM * 2);
const CONTENT_HEIGHT_PX = CONTENT_HEIGHT_MM * MM_TO_PX;

// Simple page break component
const PageBreak = () => (
  <div style={{ pageBreakAfter: 'always' }}></div>
);

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

// Get template colors based on the selected template
const getTemplateColors = (templateName: string) => {
  const templates: Record<string, any> = {
    colorful: {
      primary: 'text-indigo-900 dark:text-indigo-300 font-semibold',
      secondary: 'text-gray-900 dark:text-gray-200',
      accent: 'bg-indigo-50 dark:bg-indigo-900/40',
      border: 'border-indigo-200 dark:border-indigo-700',
      highlight: 'bg-indigo-50/80 dark:bg-indigo-900/30',
      sectionTitle: 'text-indigo-900 dark:text-indigo-300 border-indigo-400 dark:border-indigo-600 font-bold',
      link: 'text-indigo-800 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200',
      card: 'bg-white dark:bg-gray-800',
      text: 'text-gray-900 dark:text-gray-200',
      muted: 'text-gray-800 dark:text-gray-400',
    },
    experienced: {
      primary: 'text-gray-900 dark:text-gray-100 font-semibold',
      secondary: 'text-gray-900 dark:text-gray-300',
      accent: 'bg-gray-50 dark:bg-gray-800/60',
      border: 'border-gray-300 dark:border-gray-700',
      highlight: 'bg-gray-100/50 dark:bg-gray-800/40',
      sectionTitle: 'text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-600 font-bold',
      link: 'text-blue-800 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200',
      card: 'bg-white dark:bg-gray-800',
      text: 'text-gray-900 dark:text-gray-200',
      muted: 'text-gray-800 dark:text-gray-400',
    },
    student: {
      primary: 'text-emerald-900 dark:text-emerald-300 font-semibold',
      secondary: 'text-gray-900 dark:text-gray-200',
      accent: 'bg-emerald-50 dark:bg-emerald-900/40',
      border: 'border-emerald-300 dark:border-emerald-700',
      highlight: 'bg-emerald-50/80 dark:bg-emerald-900/30',
      sectionTitle: 'text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600 font-bold',
      link: 'text-emerald-800 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200',
      card: 'bg-white dark:bg-gray-800',
      text: 'text-gray-900 dark:text-gray-200',
      muted: 'text-gray-800 dark:text-gray-400',
    },
    creative: {
      primary: 'text-pink-900 dark:text-pink-300 font-semibold',
      secondary: 'text-gray-900 dark:text-gray-200',
      accent: 'bg-pink-50 dark:bg-pink-900/40',
      border: 'border-pink-300 dark:border-pink-700',
      highlight: 'bg-pink-50/80 dark:bg-pink-900/30',
      sectionTitle: 'text-pink-900 dark:text-pink-300 border-pink-400 dark:border-pink-600 font-bold',
      link: 'text-pink-800 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-200',
      card: 'bg-white dark:bg-gray-800',
      text: 'text-gray-900 dark:text-gray-200',
      muted: 'text-gray-800 dark:text-gray-400',
    },
    minimal: {
      primary: 'text-blue-900 dark:text-blue-300 font-semibold',
      secondary: 'text-gray-900 dark:text-gray-200',
      accent: 'bg-blue-50 dark:bg-blue-900/40',
      border: 'border-blue-300 dark:border-blue-700',
      highlight: 'bg-blue-50/80 dark:bg-blue-900/30',
      sectionTitle: 'text-blue-900 dark:text-blue-300 border-blue-400 dark:border-blue-600 font-bold',
      link: 'text-blue-800 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200',
      card: 'bg-white dark:bg-gray-800',
      text: 'text-gray-900 dark:text-gray-200',
      muted: 'text-gray-800 dark:text-gray-400',
    }
  };

  return templates[templateName.toLowerCase()] || templates.minimal;
};

// Get template styles based on the selected template
const getTemplateStyles = (templateName: string) => {
  const colors = getTemplateColors(templateName);
  
  return {
    sectionTitle: cn(
      'text-lg font-bold mb-2 pb-1 border-b',
      colors.sectionTitle,
      colors.border
    ),
    card: cn(
      'p-6 rounded-lg shadow-sm',
      colors.accent,
      colors.border,
      'border'
    ),
    section: cn('mb-6', colors.secondary),
    itemTitle: cn('font-semibold', colors.primary),
    itemSubtitle: 'text-sm text-muted-foreground',
    date: 'text-sm text-muted-foreground whitespace-nowrap',
    link: colors.link,
  };
};

export default function ResumePreview({ resumeData, template, currentPage, sectionOrder }: ResumePreviewProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number>(1);
  const [currentViewPage, setCurrentViewPage] = useState<number>(1);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Define colors and styles
  const colors = useMemo(() => getTemplateColors(template), [template]);
  const styles = useMemo(() => getTemplateStyles(template), [template]);

  // Calculate pages based on content height
  useEffect(() => {
    if (contentRef.current) {
      // Calculate the actual height of the content
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
      
      // Calculate number of pages needed based on content height
      // Use the content height minus margins for calculation
      const calculatedPages = Math.max(1, Math.ceil(height / (A4_HEIGHT_PX - (PAGE_MARGIN_MM * MM_TO_PX * 2))));
      setPages(calculatedPages);
      
      // Reset to first page when content changes
      setCurrentViewPage(1);
    }
  }, [resumeData, template, sectionOrder, A4_HEIGHT_PX, PAGE_MARGIN_MM, MM_TO_PX]);

  const scrollToPage = useCallback((pageNumber: number) => {
    if (contentRef.current) {
      const scrollPosition = (pageNumber - 1) * CONTENT_HEIGHT_PX;
      contentRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentViewPage(pageNumber);
    }
  }, []);

  // Handle scroll events to update current page
  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const scrollPosition = contentRef.current.scrollTop;
      const currentPage = Math.floor(scrollPosition / CONTENT_HEIGHT_PX) + 1;
      setCurrentViewPage(Math.min(Math.max(1, currentPage), pages));
    }
  }, [pages]);

// Force static styling for resume preview - not affected by theme
  const previewClasses = cn(
    'bg-white dark:bg-gray-800',
    'w-full p-0 m-0', // Remove centering and padding for print
    'shadow-lg my-8',
    'transition-none',
    'h-[calc(100vh-200px)] overflow-auto', // Use responsive overflow class
    'resume-container font-sans',
    'relative',
    'mx-[14.17px] my-[14.17px] p-8', // Add 5mm margins and padding for better visibility
    'aspect-[210/297]', // A4 aspect ratio (210mm x 297mm)
    'text-base leading-relaxed',
    colors.text
  );

  const renderPersonalInfo = () => {
    const { personal } = resumeData || {};
    if (!personal) {
      console.log('No personal data found in resumeData:', resumeData);
      return (
        <div className={cn("mb-6 p-4 border border-dashed rounded", colors.border, colors.accent)}>
          <p className={cn("text-center", colors.secondary)}>No personal information available. Please check your resume data.</p>
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

    // Debug log
    console.log('Personal info being rendered:', { personal, contactItems });

    return (
      <div className={cn("mb-8", colors.primary)}>
        <div className="text-center mb-4">
          <h2 className={cn("text-3xl font-bold mb-1", colors.primary)}>
            {personal.name || 'Your Name'}
          </h2>
          {personal.title && (
            <h3 className={cn("text-lg font-medium", colors.secondary)}>{personal.title}</h3>
          )}
        </div>
        
        <div className={cn("flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-6", colors.secondary)}>
          {contactItems.length > 0 ? (
            contactItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="opacity-80">{item.icon}</span>
                {item.isLink ? (
                  <a 
                    href={`https://${item.prefix ? item.prefix : ''}${item.value}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn("hover:underline", colors.link)}
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
    const summaryText = resumeData.summary || '';
    
    if (!summaryText) return null;
    
    return (
      <div className="mb-6">
        <h3 className={styles.sectionTitle}>
          {SECTION_NAMES.summary.toUpperCase()}
        </h3>
        <p className="whitespace-pre-line text-gray-800">
          {summaryText}
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

  // Render content with proper page breaks
  const renderContent = () => {
    if (!contentRef.current) {
      console.log('Content ref not ready');
      return null;
    }
    
    // Get all sections to be rendered
    const { personal = {}, customSections = [] } = resumeData || {};
    console.log('Rendering content with data:', { personal, customSections });
    
    // Get custom sections by ID
    const getCustomSection = (id: string) => {
      return customSections?.find((s: any) => s.id === id);
    };
    
    // Render a custom section by ID
    const renderCustomSection = (sectionId: string) => {
      const section = customSections.find((s) => s.id === sectionId);
      if (!section) return null;
      
      return (
        <div key={section.id} className={cn('mb-8', colors.text)}>
          <h3 className={cn(
            'text-xl font-bold border-b-2 pb-2 mb-4',
            colors.sectionTitle,
            'uppercase tracking-wide'
          )}>
            {section.title || 'Custom Section'}
          </h3>
          
          {section.description && (
            <p className={cn('mb-6', colors.text)}>{section.description}</p>
          )}
          
          {section.entries?.map((entry, index) => (
            <div 
              key={entry.id || index} 
              className={cn('mb-6 p-4 rounded-lg', colors.highlight)}
            >
              {section.fields.map((field) => {
                const value = entry.values[field.id];
                if (!value) return null;
                
                return (
                  <div key={field.id} className="mb-3 last:mb-0">
                    <h4 className={cn('font-semibold', colors.primary)}>
                      {field.name}
                    </h4>
                    <div className={cn('mt-1', colors.text)}>
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    };
    
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
    
    // Filter out null/undefined sections and render them in order
    const content = sectionsToRender
      .filter((sectionId: string) => sectionComponents[sectionId])
      .map((sectionId: string) => sectionComponents[sectionId]);
    
    return <div className="space-y-6">{content}</div>;
    const sections = renderSections();
    
    // Always render all sections in a single container
    // Let the browser handle page breaks naturally based on content
    return (
      <div className="relative print:block">
        <div className="page">
          <div className="space-y-8 print:space-y-6">
            {sections}
          </div>
          {pages > 1 && (
            <div className="page-number print:hidden">Page 1 of {pages}</div>
          )}
        </div>
      </div>
    );
  };

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
    
    @media (max-width: 480px) {
      .a4-container {
        max-width: 98vw;
        max-height: calc(100vh - 120px);
      }
    }
  `;
  // Add a print button handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Calculate content width with margins
  const contentWidth = `calc(100% - ${PAGE_MARGIN_MM * 2}mm)`;
  const contentPadding = `${PAGE_MARGIN_MM}mm`;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 print:p-0">
      {/* Print button */}
      <div className="w-full max-w-[210mm] mx-auto mb-4 print:hidden">
        <Button 
          onClick={handlePrint}
          variant="outline"
          className="bg-white hover:bg-gray-50 shadow-md"
        >
          Print / Save as PDF
        </Button>
      </div>

      {/* A4 Container */}
      <div 
        className="mx-auto bg-white shadow-lg print:shadow-none"
        style={{
          width: '210mm',
          minHeight: '297mm',
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          padding: contentPadding
        }}
      >
        {/* Main content area */}
        <div 
          ref={contentRef}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            position: 'relative'
          }}
        >
          {renderContent()}
        </div>

        {/* Page navigation */}
        {pages > 1 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 print:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToPage(currentViewPage - 1)}
              disabled={currentViewPage <= 1}
              className="bg-white/90 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center px-4 text-sm text-gray-600 bg-white/90 backdrop-blur-sm rounded-md">
              Page {currentViewPage} of {pages}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToPage(currentViewPage + 1)}
              disabled={currentViewPage >= pages}
              className="bg-white/90 backdrop-blur-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}