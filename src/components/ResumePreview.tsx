import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ExternalLink, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { printResume } from "@/lib/printUtils";

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

export default function ResumePreview({ 
  resumeData, 
  template, 
  currentPage,
  sectionOrder 
}: ResumePreviewProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  // Print function
  const handlePrint = () => {
    const resumeElement = pageRef.current?.querySelector('.resume-content') as HTMLElement;
    if (!resumeElement) return;
    
    printResume(resumeElement, resumeData.personal?.name || 'My Resume');
  };

  // Force static styling for resume preview - not affected by theme
  const previewClasses = cn(
    'bg-white text-gray-900',
    'p-8 max-w-4xl mx-auto',
    'shadow-lg my-8',
    'print:shadow-none print:my-0 print:p-0',
    'transition-none',
    'h-[calc(100vh-200px)] overflow-y-auto',
    'resume-container',
    'relative' // For positioning the print button
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
          SUMMARY
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
          TECHNICAL SKILLS
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
          PROFESSIONAL EXPERIENCE
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
          EDUCATION
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
          PROJECTS
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
          ACHIEVEMENTS
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
          CERTIFICATIONS
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

  // Calculate content for page break detection
  const renderContent = () => (
    <div className="space-y-8 print:space-y-6">
      {renderSections()}
    </div>
  );

  // Screen styles for the resume container
  const screenStyles = `
    .resume-container {
      scrollbar-width: thin;
      scrollbar-color: #9ca3af #e5e7eb;
    }
    .resume-container::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .resume-container::-webkit-scrollbar-track {
      background: #e5e7eb;
      border-radius: 3px;
    }
    .resume-container::-webkit-scrollbar-thumb {
      background-color: #9ca3af;
      border-radius: 3px;
    }
  `;

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: screenStyles }} />
      
      <Button 
        onClick={handlePrint}
        className="fixed bottom-8 right-8 print:hidden z-50 shadow-lg"
        size="lg"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print / Save as PDF
      </Button>
      
      <div className="text-xs text-gray-500 mb-2 print:hidden">
        <p>Tip: For best results when printing/saving as PDF:</p>
        <ol className="list-decimal pl-5 mt-1">
          <li>Click the "Print / Save as PDF" button above</li>
          <li>In the print dialog, select "Save as PDF" as the destination</li>
          <li>Set scale to 100%</li>
          <li>Disable headers and footers</li>
          <li>Ensure margins are set to "Default" or "None"</li>
        </ol>
      </div>
      
      <Card className={previewClasses} ref={pageRef}>
        <div className="resume-content">
          {renderContent()}
        </div>
      </Card>
    </div>
  );
}