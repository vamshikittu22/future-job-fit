import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ExternalLink } from "lucide-react";

interface ResumePreviewProps {
  resumeData: any;
  template: string;
  currentPage: number;
}

export default function ResumePreview({ 
  resumeData, 
  template, 
  currentPage 
}: ResumePreviewProps) {
  const renderPersonalInfo = () => {
    const personalInfo = resumeData.personal || {};
    
    return (
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          {personalInfo.name || "Your Name"}
        </h1>
        {personalInfo.title && (
          <p className="text-lg text-muted-foreground mb-3">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div className="flex justify-center gap-4 mt-2 text-sm">
            {personalInfo.linkedin && (
              <span className="text-primary hover:underline cursor-pointer">
                LinkedIn
              </span>
            )}
            {personalInfo.website && (
              <span className="text-primary hover:underline cursor-pointer">
                Portfolio
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSummary = () => {
    const summaryText = resumeData.summary?.summary || '';
    
    if (!summaryText) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summaryText}
        </p>
      </div>
    );
  };

  const renderSkills = () => {
    const skillCategories = resumeData.skills?.categories || [];
    if (!skillCategories.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Technical Skills
        </h2>
        <div className="space-y-3">
          {skillCategories.map((category: any, index: number) => (
            <div key={index}>
              {category.name && (
                <h3 className="font-medium text-sm mb-2">{category.name}</h3>
              )}
              <div className="flex flex-wrap gap-2">
                {(category.skills || []).map((skill: string, skillIndex: number) => (
                  <Badge 
                    key={skillIndex} 
                    variant="secondary" 
                    className="text-xs px-2 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    const experiences = resumeData.experience?.experiences || [];
    if (!experiences.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Work Experience
        </h2>
        <div className="space-y-4">
          {experiences.map((exp: any, index: number) => (
            <div key={exp.id || index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-sm">
                    {exp.title || "Job Title"}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {exp.company || "Company Name"}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{exp.duration || "Duration"}</div>
                  <div>{exp.location || "Location"}</div>
                </div>
              </div>
              
              {exp.description && (
                <div className="text-sm text-muted-foreground leading-relaxed ml-2">
                  <pre className="whitespace-pre-wrap font-sans">
                    {exp.description}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    const education = resumeData.education?.items || [];
    if (!education.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Education
        </h2>
        <div className="space-y-3">
          {education.map((edu: any, index: number) => (
            <div key={edu.id || index} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm">
                  {edu.degree || "Degree"}
                </h3>
                <p className="text-sm text-primary">
                  {edu.school || "School Name"}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>{edu.year || "Year"}</div>
                {edu.gpa && <div>GPA: {edu.gpa}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const projects = resumeData.projects?.items || [];
    if (!projects.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Projects
        </h2>
        <div className="space-y-4">
          {projects.map((project: any, index: number) => (
            <div key={project.id || index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {project.name || "Project Name"}
                    {project.link && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                  </h3>
                  <p className="text-xs text-accent">
                    {project.tech || "Technologies"}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {project.duration || "Duration"}
                </div>
              </div>
              
              {project.description && (
                <div className="text-sm text-muted-foreground leading-relaxed ml-2">
                  <pre className="whitespace-pre-wrap font-sans">
                    {project.description}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    const achievements = resumeData.achievements?.items || [];
    if (!achievements.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Achievements
        </h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {achievements.map((achievement: string, index: number) => (
            achievement.trim() && (
              <li key={index} className="leading-relaxed">
                {achievement}
              </li>
            )
          ))}
        </ul>
      </div>
    );
  };

  const renderCertifications = () => {
    const certifications = resumeData.certifications?.items || [];
    if (!certifications.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Certifications
        </h2>
        <div className="space-y-2">
          {certifications.map((cert: any, index: number) => (
            <div key={cert.id || index} className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">{cert.name || "Certification"}</h3>
                <p className="text-xs text-muted-foreground">{cert.issuer || "Issuer"}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {cert.date || "Date"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-swiss">
      <div className="p-1 bg-muted/30 rounded-t-lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-3 py-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Resume Preview</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Page {currentPage}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="p-8 bg-background">
          {/* A4 Page Simulation */}
          <div className="min-h-[297mm] bg-white shadow-sm p-8 mx-auto" style={{ width: '210mm' }}>
            {renderPersonalInfo()}
            {renderSummary()}
            {renderSkills()}
            {renderExperience()}
            {renderEducation()}
            {renderProjects()}
            {renderAchievements()}
            {renderCertifications()}
            
            {/* Empty State */}
            {!resumeData.personal?.name && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start building your resume to see the preview</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}