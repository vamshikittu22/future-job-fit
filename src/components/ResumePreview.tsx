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

// Page break configuration
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;
const MM_TO_PX = 3.78; // Approximate conversion
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - 30; // 15mm margin top and bottom
const CONTENT_HEIGHT_PX = CONTENT_HEIGHT_MM * MM_TO_PX;

// Component to handle page breaks
const PageBreak = ({ isLast = false }: { isLast?: boolean }) => (
  <div className={cn("page-break", !isLast ? "page" : "")}>
    {!isLast && <div className="page-number">Page {isLast ? '' : ''}</div>}
  </div>
);

export default function ResumePreview({ 
  resumeData, 
  template, 
  currentPage,
  sectionOrder 
}: ResumePreviewProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number>(1);
  const [currentViewPage, setCurrentViewPage] = useState<number>(1);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Calculate pages based on content height
  useEffect(() => {
    if (contentRef.current) {
      // Calculate the actual height of the content
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
      
      // Calculate number of pages needed based on content height
      // We'll use a simpler approach and let the browser handle pagination
      const calculatedPages = Math.max(1, Math.ceil(height / CONTENT_HEIGHT_PX));
      setPages(calculatedPages);
      
      // Reset to first page when content changes
      setCurrentViewPage(1);
    }
  }, [resumeData, template, sectionOrder]);

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
    const { personal } = resumeData;
    if (!personal) return null;

    const contactItems = [
      { icon: '✉️', value: personal.email },
      { icon: '📱', value: personal.phone },
      { icon: '📍', value: personal.location },
      { icon: '🔗', value: personal.website, isLink: true },
      { icon: '💼', value: personal.linkedin, isLink: true, prefix: 'linkedin.com/in/' },
      { icon: '🐙', value: personal.github, isLink: true, prefix: 'github.com/' },
    ].filter(item => item.value);

    return (
      <div className="mb-6">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            {personal.name || 'Your Name'}
          </h2>
          {personal.title && (
            <h3 className="text-lg text-gray-700">{personal.title}</h3>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700 mb-4">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="opacity-70">{item.icon}</span>
              {item.isLink ? (
                <a 
                  href={`https://${item.prefix ? item.prefix : ''}${item.value}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.prefix ? item.value.replace(/^https?:\/\//, '').replace(item.prefix, '') : item.value}
                </a>
              ) : (
                <span>{item.value}</span>
              )}
            </div>
          ))}
        </div>
        <Separator className="my-4" />
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

  // Render content with proper page breaks
  const renderContent = () => {
    if (!contentRef.current) return null;
    
    // Get all sections to be rendered
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

  return (
    <div className="relative w-full h-full">
      <style dangerouslySetInnerHTML={{ __html: screenStyles }} />
      
      {/* Print button */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button 
          onClick={handlePrint}
          variant="outline"
          className="bg-white hover:bg-gray-50 shadow-md"
        >
          Print / Save as PDF
        </Button>
      </div>
      
      {/* A4 aspect ratio container - Fixed proportions */}
      <div className="a4-container">
        <Card 
          className={cn(
            'resume-card bg-white text-gray-900 transition-none relative',
            'print:shadow-none print:border-0 print:bg-transparent'
          )} 
          ref={pageRef}
        >
          <div 
            className="resume-content print:bg-white" 
            ref={contentRef}
            onScroll={handleScroll}
          >
            {renderContent()}
          </div>
          
          {/* Page navigation (only show if multiple pages) */}
          {pages > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 print:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => scrollToPage(currentViewPage - 1)}
                disabled={currentViewPage <= 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center px-4 text-sm text-gray-600">
                Page {currentViewPage} of {pages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => scrollToPage(currentViewPage + 1)}
                disabled={currentViewPage >= pages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}