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
    const personalInfo = resumeData.personalInfo || resumeData.personal || {};
    
    return (
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          {personalInfo.name || "Your Name"}
        </h1>
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
    // Handle nested summary structure properly
    let summaryText = '';
    if (typeof resumeData.summary === 'string') {
      summaryText = resumeData.summary;
    } else if (resumeData.summary && typeof resumeData.summary === 'object') {
      summaryText = resumeData.summary.summary || '';
    }
    
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
    if (!resumeData.skills?.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-2 py-1"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    if (!resumeData.experience?.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Work Experience
        </h2>
        <div className="space-y-4">
          {resumeData.experience.map((exp: any, index: number) => (
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
              
              {exp.bullets?.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                  {exp.bullets.map((bullet: string, bulletIndex: number) => (
                    bullet.trim() && (
                      <li key={bulletIndex} className="leading-relaxed">
                        {bullet}
                      </li>
                    )
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (!resumeData.education?.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Education
        </h2>
        <div className="space-y-3">
          {resumeData.education.map((edu: any, index: number) => (
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
    if (!resumeData.projects?.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Projects
        </h2>
        <div className="space-y-4">
          {resumeData.projects.map((project: any, index: number) => (
            <div key={project.id || index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {project.name || "Project Name"}
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </h3>
                  <p className="text-xs text-accent">
                    {project.tech || "Technologies"}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {project.duration || "Duration"}
                </div>
              </div>
              
              {project.bullets?.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                  {project.bullets.map((bullet: string, bulletIndex: number) => (
                    bullet.trim() && (
                      <li key={bulletIndex} className="leading-relaxed">
                        {bullet}
                      </li>
                    )
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (!resumeData.achievements?.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Achievements
        </h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {resumeData.achievements.map((achievement: any, index: number) => {
            // Handle both string and object formats
            const achievementText = typeof achievement === 'string' 
              ? achievement 
              : achievement.title || achievement.description || '';
            
            return achievementText.trim() && (
              <li key={index} className="leading-relaxed">
                {achievementText}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderCertifications = () => {
    if (!resumeData.certifications?.length) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3 border-b border-primary/20 pb-1">
          Certifications
        </h2>
        <div className="flex flex-wrap gap-2">
          {resumeData.certifications.map((cert: any, index: number) => {
            // Handle both string and object formats
            const certText = typeof cert === 'string' 
              ? cert 
              : cert.name || cert.title || '';
            
            return certText.trim() && (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-1"
              >
                {certText}
              </Badge>
            );
          })}
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
            {!resumeData.personalInfo?.name && (
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