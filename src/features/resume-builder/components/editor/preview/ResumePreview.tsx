import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResumeData } from '@/features/resume-builder/components/editor/types';
import { format } from 'date-fns';

interface ResumePreviewProps {
  data: ResumeData;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDownload: () => void;
  onPrint: () => void;
}

export const ResumePreview = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onDownload,
  onPrint,
}: ResumePreviewProps) => {
  const { personal, experience, education, skills, projects, certifications } = data;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Resume Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-lg">
        <Card className="w-full h-full p-8 bg-white shadow-lg print:shadow-none print:border-0 text-gray-800">
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{personal?.name}</h1>
            <div className="flex flex-wrap justify-center gap-4 mt-2 text-gray-600">
              {personal?.email && <span>{personal.email}</span>}
              {personal?.phone && <span>• {personal.phone}</span>}
              {personal?.location && <span>• {personal.location}</span>}
            </div>
            {personal?.summary && personal.summary.trim() !== '' && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Summary</h2>
                <p className="max-w-3xl mx-auto text-gray-700 text-justify">
                  {personal.summary}
                </p>
              </div>
            )}
          </header>

          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-gray-800">Experience</h2>
            {experience && experience.length > 0 ? (
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <div className="text-gray-600">
                          {exp.company} • {exp.location}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                      </div>
                    </div>
                    {exp.description && (
                      <ul className="mt-2 pl-5 list-disc space-y-1">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No experience added yet</p>
            )}
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-gray-800">Education</h2>
            {education && education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <div className="text-gray-600">
                        {edu.institution}
                        {edu.fieldOfStudy && ` • ${edu.fieldOfStudy}`}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No education information added yet</p>
            )}
          </section>

          {/* Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-gray-800">Skills</h2>
            {skills && skills.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-sm">
                    <div className="font-medium text-gray-900">{skill.name}</div>
                    {skill.showProficiency !== false && (
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`h-2 w-2 rounded-full mr-1 ${
                              star <= skill.level ? 'bg-foreground' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No skills added yet</p>
            )}
          </section>

          {/* Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-gray-800">Projects</h2>
            {projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:underline"
                          >
                            Code
                          </a>
                        )}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No projects added yet</p>
            )}
          </section>

          {/* Certifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-gray-800">
              Certifications
            </h2>
            {certifications && certifications.length > 0 ? (
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      <div className="text-sm text-gray-600">
                        {formatDate(cert.date)}
                      </div>
                    </div>
                    <div className="text-gray-700">{cert.issuer}</div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No certifications added yet</p>
            )}
          </section>
        </Card>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
