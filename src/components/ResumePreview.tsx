import React, { useRef, useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTION_NAMES, type SectionKey } from "@/constants/sectionNames";
import { Button } from "@/components/ui/button";

interface CustomSectionData {
  id: string;
  title: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
    link?: string;
  }>;
}

interface ResumePreviewProps {
  resumeData: any;
  template: string;
  currentPage: number;
  sectionOrder: string[];
}

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

// Template styles with different color schemes
const TEMPLATE_STYLES = {
  modern: {
    primary: '#3b82f6',   // blue-500
    secondary: '#60a5fa', // blue-400
    accent: '#1e40af',    // blue-700
    text: '#1f2937',      // gray-800
    background: '#ffffff',
    sectionBg: '#f9fafb'  // gray-50
  },
  professional: {
    primary: '#4f46e5',   // indigo-600
    secondary: '#6366f1', // indigo-500
    accent: '#3730a3',    // indigo-800
    text: '#111827',      // gray-900
    background: '#ffffff',
    sectionBg: '#f8fafc'  // slate-50
  },
  creative: {
    primary: '#8b5cf6',   // violet-500
    secondary: '#a78bfa', // violet-400
    accent: '#6d28d9',    // violet-700
    text: '#1f2937',      // gray-800
    background: '#ffffff',
    sectionBg: '#f5f3ff'  // violet-50
  },
  minimal: {
    primary: '#10b981',   // emerald-500
    secondary: '#34d399', // emerald-400
    accent: '#047857',    // emerald-700
    text: '#1f2937',      // gray-800
    background: '#ffffff',
    sectionBg: '#ecfdf5'  // emerald-50
  }
} as const;

type TemplateName = keyof typeof TEMPLATE_STYLES;

// Simple page break component
const PageBreak = () => (
  <div style={{ pageBreakAfter: 'always' }}></div>
);

// Helper function to get contrast color
const getContrastColor = (hexColor: string) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  resumeData = {}, 
  template = 'modern', 
  sectionOrder = [] 
}) => {
  // Get the selected template styles or default to modern
  const currentTemplate = template as TemplateName;
  const templateStyle = TEMPLATE_STYLES[currentTemplate] || TEMPLATE_STYLES.modern;
  
  // Generate CSS variables for the template
  const templateVars = {
    '--primary-color': templateStyle.primary,
    '--secondary-color': templateStyle.secondary,
    '--accent-color': templateStyle.accent,
    '--text-color': templateStyle.text,
    '--section-bg': templateStyle.sectionBg,
    '--background-color': templateStyle.background,
    '--border-color': 'rgba(0, 0, 0, 0.1)',
    '--heading-color': templateStyle.primary,
    '--subheading-color': templateStyle.secondary,
    '--link-color': templateStyle.primary,
    '--link-hover-color': templateStyle.accent
  } as React.CSSProperties;
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number>(1);
  const [currentViewPage, setCurrentViewPage] = useState<number>(1);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Calculate pages based on content height
  useEffect(() => {
    const calculatePages = () => {
      if (contentRef.current) {
        // Force reflow to ensure content is rendered
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
        
        // Calculate number of pages needed based on content height
        const pageHeight = A4_HEIGHT_PX - (PAGE_MARGIN_MM * MM_TO_PX * 2);
        const calculatedPages = Math.max(1, Math.ceil(height / pageHeight));
        setPages(calculatedPages);
        
        // Ensure current page is within bounds and reset to first page on content change
        setCurrentViewPage(prev => {
          const newPage = Math.min(prev, calculatedPages);
          return newPage < 1 ? 1 : newPage;
        });
        
        // Scroll to current page
        if (contentRef.current) {
          const scrollPosition = (currentViewPage - 1) * pageHeight;
          contentRef.current.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    // Add a small delay to ensure all content is rendered
    const timer = setTimeout(calculatePages, 100);
    
    // Also calculate on window resize
    window.addEventListener('resize', calculatePages);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePages);
    };
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
    'bg-white text-gray-900',
    'w-full p-0 m-0', // Remove centering and padding for print
    'shadow-lg my-8',
    'transition-none',
    'h-[calc(100vh-200px)] overflow-main', // Use responsive overflow class
    'resume-container',
    'relative',
    'mx-[14.17px] my-[14.17px] p-8', // Add 5mm margins and padding for better visibility
    'aspect-[210/297]' // A4 aspect ratio (210mm x 297mm)
  );
  
  const getTemplateStyles = (name: string) => {
    switch ((name || 'minimal').toLowerCase()) {
      case 'colorful':
        return {
          sectionTitle: 'text-lg font-bold border-b-2 border-indigo-600 pb-1 mb-3',
          link: 'text-indigo-700 hover:underline',
          accentText: 'text-indigo-700',
        };
      case 'experienced':
        return {
          sectionTitle: 'text-lg font-bold border-b-2 border-gray-600 pb-1 mb-3',
          link: 'text-gray-800 hover:underline',
          accentText: 'text-gray-800',
        };
      case 'student':
        return {
          sectionTitle: 'text-lg font-bold border-b-2 border-emerald-600 pb-1 mb-3',
          link: 'text-emerald-700 hover:underline',
          accentText: 'text-emerald-700',
        };
      case 'creative':
        return {
          sectionTitle: 'text-lg font-bold border-b-2 border-pink-600 pb-1 mb-3',
          link: 'text-pink-700 hover:underline',
          accentText: 'text-pink-700',
        };
      case 'minimal':
      default:
        return {
          sectionTitle: 'text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3',
          link: 'text-blue-900 hover:underline',
          accentText: 'text-gray-900',
        };
    }
  };
  const styles = getTemplateStyles(template);

  const renderPersonalInfo = () => {
    // Use the component's templateStyle which is already defined
    const personal = resumeData?.personal || {};
    
    if (!personal || Object.keys(personal).length === 0) {
      return (
        <div className="mb-6 p-4 border border-dashed border-red-300 bg-red-50 rounded">
          <p className="text-red-700 text-center">No personal information available. Please check your resume data.</p>
        </div>
      );
    }
    
    // Use the component's templateStyle which is already defined
    const textColor = templateStyle.text || '#111827'; // Default to gray-900 if undefined
    const primaryColor = templateStyle.primary || '#3b82f6'; // Default to blue-500 if undefined
    const secondaryColor = templateStyle.secondary || '#60a5fa'; // Default to blue-400 if undefined
    
    const contactItems = [
      { icon: '✉️', value: personal.email },
      { icon: '📱', value: personal.phone },
      { icon: '📍', value: personal.location },
      { icon: '🔗', value: personal.website, isLink: true },
      { icon: '💼', value: personal.linkedin, isLink: true, prefix: 'linkedin.com/in/' },
      { icon: '🐙', value: personal.github, isLink: true, prefix: 'github.com/' },
    ].filter(item => item.value);

    return (
      <div className="mb-8" style={{ color: textColor }}>
        <div className="text-center mb-4">
          <h2 
            className="text-3xl font-bold mb-1"
            style={{ color: primaryColor }}
          >
            {personal.name || 'Your Name'}
          </h2>
          {personal.title && (
            <h3 
              className="text-lg font-medium"
              style={{ color: secondaryColor }}
            >
              {personal.title}
            </h3>
          )}
        </div>
        
        {contactItems.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-4">
            {contactItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <span style={{ color: primaryColor, opacity: 0.8 }}>{item.icon}</span>
                {item.isLink ? (
                  <a 
                    href={`https://${item.prefix ? item.prefix : ''}${item.value}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: primaryColor }}
                  >
                    {item.prefix ? item.value.replace(/^https?:\/\//, '').replace(item.prefix, '') : item.value}
                  </a>
                ) : (
                  <span style={{ color: textColor }}>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No contact information provided</p>
        )}
        <Separator className="my-4" />
      </div>
    );
  };

  const renderSummary = () => {
    const summaryText = resumeData.summary || '';
    if (!summaryText) return null;
    
    return (
      <div className="mb-6">
        <h3 
          className="text-lg font-bold border-b-2 pb-1 mb-3"
          style={{ borderColor: templateStyle.primary, color: templateStyle.primary }}
        >
          {SECTION_NAMES.summary.toUpperCase()}
        </h3>
        <p className="whitespace-pre-line" style={{ color: templateStyle.text }}>
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

  const renderSections = useCallback(() => {
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
  }, [sectionOrder, resumeData.customSections]);

  // Render content with proper page breaks
  const renderContent = useCallback(() => {
    if (!contentRef.current) {
      return null;
    }
    
    // Get all sections to be rendered
    const { personal = {}, customSections = [] } = resumeData || {};
    
    // Ensure we have a valid section order
    const validSectionOrder = Array.isArray(sectionOrder) && sectionOrder.length > 0 
      ? sectionOrder 
      : ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'achievements', 'certifications', ...(customSections?.map((s: any) => s.id) || [])];
    
    // Render a custom section by ID
    const renderCustomSection = (sectionId: string) => {
      const section = customSections.find((s: any) => s.id === sectionId);
      if (!section) return null;
      
      return (
        <div key={section.id} className="mb-6">
          <h3 className={styles.sectionTitle}>
            {section.title?.toUpperCase() || 'CUSTOM SECTION'}
          </h3>
          {section.description && (
            <p className="text-gray-700 mb-4">{section.description}</p>
          )}
          {section.items?.map((item: any, index: number) => (
            <div key={item.id || index} className="mb-4">
              <div className="flex justify-between items-start">
                <h4 className="font-bold">{item.title}</h4>
                {item.date && (
                  <span className="text-sm text-gray-600">
                    {item.date}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <div className="text-sm text-gray-700">{item.subtitle}</div>
              )}
              {item.description && (
                <p className="text-sm text-gray-800 mt-1">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      );
    };
    
    // Get all section components in order
    const renderContent = () => {
    const customSections = resumeData.customSections || [];
    const primaryColor = templateStyle.primary || '#3b82f6'; // Default to blue-500 if undefined
    
    const sections = {
      personal: renderPersonalInfo(),
      summary: renderSummary(),
      experience: renderExperience(),
      education: renderEducation(),
      skills: renderSkills(),
      projects: renderProjects(),
      achievements: renderAchievements(),
      certifications: renderCertifications(),
      // Add custom sections with consistent styling
      ...(customSections || []).reduce((acc: any, section: any) => {
        if (section && section.id) {
          acc[section.id] = (
            <div key={section.id} className="mb-6">
              <h3 
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                {section.title?.toUpperCase() || 'CUSTOM SECTION'}
              </h3>
              <CustomSectionPreview section={section} />
            </div>
          );
        }
        return acc;
      }, {})
    };
    
    // Get the ordered sections to render, filtering out any undefined sections
    const sectionsToRender = (sectionOrder || [
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'achievements',
      'certifications',
      ...(customSections || []).map((s: any) => s.id)
    ])
    .filter((sectionId: string) => sectionComponents[sectionId])
    .map((sectionId: string) => (
      <div key={sectionId} className="mb-8">
        {sectionComponents[sectionId]()}
      </div>
    ));
    
    // Always render all sections in a single container
    // Let the browser handle page breaks naturally based on content
    return (
      <div className="relative print:block">
        <div className="page">
          <div className="space-y-8 print:space-y-6">
            {sectionsToRender}
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
    
    /* Print styles */
    @media print {
      @page {
        size: A4;
        margin: 15mm 15mm 15mm 15mm;
      }
      
      body, html {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        width: 210mm;
        height: 297mm;
      }

      body * {
        visibility: hidden; /* Hide everything by default */
      }

      .a4-container, .a4-container * {
        visibility: visible; /* Only show the resume content */
      }

      .a4-container {
        position: relative !important;
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        transform: none !important;
        overflow: visible !important;
        background: white !important;
      }
      
      .resume-card {
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        min-height: 100% !important;
      }
      
      .resume-content {
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
        height: auto !important;
        min-height: 100% !important;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto !important;
        padding: 15mm !important;
        box-sizing: border-box;
        position: relative;
        background: white;
      }

      .page-number {
        position: absolute;
        bottom: 10mm;
        right: 15mm;
        font-size: 10pt;
        color: #666;
      }
      
      /* Let the browser handle page breaks naturally */
      .page {
        page-break-after: always;
      }
      
      .page:last-child {
        page-break-after: auto;
      }
    }
    
    /* Responsive adjustments */
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
    }
  `;
  // Add a print button handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Calculate content width with margins
  const contentWidth = `calc(100% - ${PAGE_MARGIN_MM * 2}mm)`;
  const contentPadding = `${PAGE_MARGIN_MM}mm`;

  // Apply template styles to the main container
  const containerStyle: React.CSSProperties = {
    ...templateVars,
    color: templateStyle.text,
    backgroundColor: templateStyle.background,
    '--primary': templateStyle.primary,
    '--secondary': templateStyle.secondary,
    '--text': templateStyle.text,
    '--bg': templateStyle.background,
    '--section-bg': templateStyle.sectionBg,
    '--a4-width': `${A4_WIDTH_MM}mm`,
    '--a4-height': `${A4_HEIGHT_MM}mm`,
    '--page-margin': `${PAGE_MARGIN_MM}mm`
  };

  return (
    <div 
      className="w-full min-h-screen p-4 print:p-0"
      style={containerStyle}
    >
      {/* Print button */}
      <div className="w-full max-w-[210mm] mx-auto mb-4 print:hidden">
        <Button 
          style={{ borderColor: templateStyle.primary, color: templateStyle.primary }}
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
};