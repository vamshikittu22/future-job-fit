import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ExternalLink } from "lucide-react";
import { CustomSectionData } from "./CustomSectionModal";

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
      <h3 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3">
        {section.title.toUpperCase()}
      </h3>
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
  const renderPersonalInfo = () => {
    const personalInfo = resumeData.personal || {};
    
    return (
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.name || "Your Name"}
        </h1>
        {personalInfo.title && (
          <h2 className="text-xl font-semibold text-gray-800 mt-1">
            {personalInfo.title}
          </h2>
        )}
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-gray-700">
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="text-blue-900 hover:underline">
              {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}
          {personalInfo.website && (
            <a 
              href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900 hover:underline"
            >
              {personalInfo.website.replace(/^https?:\/\//, '')}
            </a>
          )}
          {(personalInfo.links || []).map((link: any) => (
            <a 
              key={link.id}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const summaryText = resumeData.summary || '';
    
    if (!summaryText) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3">
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

    const skillsWithItems = skills.filter(
      (category: any) => category && Array.isArray(category.items) && category.items.length > 0
    );

    if (skillsWithItems.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3">
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
        <h3 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3">
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
        <h3 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3">
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
        <h3 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3">
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
                      className="text-sm text-blue-900 hover:underline whitespace-nowrap"
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
        <h3 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3">
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
        <h3 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3">
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
                  className="text-blue-900 hover:underline text-xs"
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
      .map(sectionId => {
        const Component = sectionComponents[sectionId];
        return Component ? (
          <div key={sectionId}>
            {Component()}
          </div>
        ) : null;
      });

    // Then render custom sections
    const customSections = resumeData.customSections?.map((section: CustomSectionData) => (
      <CustomSectionPreview key={section.id} section={section} />
    )) || [];

    return [...regularSections, ...customSections];
  };

  return (
    <div className="resume-preview bg-white p-8 w-full h-full overflow-y-auto text-gray-900">
      {renderSections()}
    </div>
  );
}