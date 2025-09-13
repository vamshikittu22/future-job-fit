import React from 'react';
import { FormattedResumeData } from './resumeDataUtils';

interface BaseResumeTemplateProps {
  data: FormattedResumeData;
  className?: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
      {title}
    </h2>
    <div className="pl-2">
      {children}
    </div>
  </div>
);

const ExperienceItem: React.FC<{
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string[];
  highlights?: string[];
}> = ({ title, company, location, startDate, endDate, description, highlights }) => (
  <div className="mb-4">
    <div className="flex justify-between">
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <div className="text-gray-800">{company}{location && ` • ${location}`}</div>
      </div>
      <div className="text-gray-600 text-sm">
        {startDate} - {endDate}
      </div>
    </div>
    {description && <p className="mt-1 text-gray-700">{description.join('. ')}</p>}
    {highlights && highlights.length > 0 && (
      <ul className="list-disc pl-5 mt-1 space-y-1">
        {highlights.map((highlight, i) => (
          <li key={i} className="text-gray-800">{highlight}</li>
        ))}
      </ul>
    )}
  </div>
);

const EducationItem: React.FC<{
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}> = ({ degree, school, location, startDate, endDate, gpa }) => (
  <div className="mb-4">
    <div className="flex justify-between">
      <div>
        <h3 className="font-bold text-gray-900">{degree}</h3>
        <div className="text-gray-800">{school}{location && `, ${location}`}</div>
      </div>
      <div className="text-gray-600 text-sm">
        {startDate} - {endDate}
      </div>
    </div>
    {gpa && <div className="mt-1 text-sm text-gray-700">GPA: {gpa}</div>}
  </div>
);

const SkillCategory: React.FC<{ title: string; skills: string[] }> = ({ title, skills }) => (
  <div className="mb-4">
    <h4 className="font-semibold text-gray-900">{title}</h4>
    <div className="flex flex-wrap gap-2 mt-1">
      {skills.map((skill, i) => (
        <span 
          key={i} 
          className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

export const BaseResumeTemplate: React.FC<BaseResumeTemplateProps> = ({ data, className = '' }) => {
  const {
    personalInfo,
    summary,
    experience = [],
    education = [],
    skills = {},
    projects = [],
    certifications = [],
    customSections = []
  } = data;

  return (
    <div className={`font-sans text-gray-900 max-w-4xl mx-auto p-8 ${className}`}>
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-xl text-indigo-700 font-medium mb-2">
          {personalInfo.title}
        </h2>
        <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-700">
          {personalInfo.email && (
            <div>{personalInfo.email}</div>
          )}
          {personalInfo.phone && (
            <div>{personalInfo.phone}</div>
          )}
          {personalInfo.location && (
            <div>{personalInfo.location}</div>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} className="text-indigo-600 hover:underline">
              {personalInfo.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </header>

      <main className="space-y-8">
        {/* Summary */}
        {summary && (
          <Section title="Summary">
            <p className="text-gray-800">{summary}</p>
          </Section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Professional Experience">
            {experience.map((exp, i) => (
              <ExperienceItem key={i} {...exp} />
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu, i) => (
              <EducationItem key={i} {...edu} />
            ))}
          </Section>
        )}

        {/* Skills */}
        {Object.keys(skills).length > 0 && (
          <Section title="Skills">
            <div className="space-y-4">
              {Object.entries(skills).map(([category, skillList]) => (
                <SkillCategory 
                  key={category} 
                  title={category} 
                  skills={skillList} 
                />
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((project, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  {project.url && (
                    <a 
                      href={project.url} 
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      View Project
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="mt-1 text-gray-800">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications">
            <ul className="space-y-2">
              {certifications.map((cert, i) => (
                <li key={i} className="flex justify-between">
                  <div>
                    <span className="font-medium">{cert.name}</span>
                    {cert.issuer && <span className="text-gray-700"> • {cert.issuer}</span>}
                    {cert.date && <span className="text-gray-600 text-sm"> • {cert.date}</span>}
                  </div>
                  {cert.url && (
                    <a 
                      href={cert.url} 
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Custom Sections */}
        {customSections.map((section, i) => (
          <div key={i} className="mb-6">
            {section.title && (
              <h3 className="text-lg font-semibold mb-2">
                {section.title}
              </h3>
            )}
            {Array.isArray(section.content) ? (
              <ul className="list-disc pl-5 space-y-1">
                {section.content.map((item, idx) => (
                  <li key={idx} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm whitespace-pre-line">
                {section.content}
              </p>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default BaseResumeTemplate;
