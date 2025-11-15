import { Document, HeadingLevel, Paragraph, TextRun, Packer } from 'docx';
import { ResumeData } from '../../lib/initialData';

export const generateDocx = async (resumeData: ResumeData, template: string = 'minimal'): Promise<Blob> => {
  const { 
    personal, 
    summary = '', 
    experience = [], 
    education = [],
    skills,
    projects = [],
    achievements = [],
    certifications = []
  } = resumeData;

  const sections: Paragraph[] = [];

  // Add header with name and contact info
  const header = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({
        text: personal?.name || 'Resume',
        bold: true,
        size: 32,
      }),
    ],
  });

  const contactInfo = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.website,
    personal?.linkedin ? `LinkedIn: ${personal.linkedin}` : '',
    personal?.github ? `GitHub: ${personal.github}` : '',
  ].filter(Boolean);

  const contactParagraph = new Paragraph({
    children: [
      new TextRun({
        text: contactInfo.join(' • '),
        size: 22,
      }),
    ],
    spacing: { after: 400 },
  });

  sections.push(header, contactParagraph);

  // Add summary
  if (summary) {
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: 'SUMMARY',
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: summary,
        spacing: { after: 400 },
      })
    );
  }

  // Add experience
  if (experience.length > 0) {
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: 'EXPERIENCE',
        spacing: { before: 400, after: 200 },
      })
    );

    experience.forEach((exp) => {
      const titleCompany = [exp.title, exp.company].filter(Boolean).join(', ');
      const dateRange = [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' - ');
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: titleCompany,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: `\t${dateRange}`,
              bold: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );

      if (exp.description) {
        sections.push(
          new Paragraph({
            text: exp.description,
            spacing: { after: 200 },
          })
        );
      }
    });
  }

  // Add education
  if (education.length > 0) {
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: 'EDUCATION',
        spacing: { before: 400, after: 200 },
      })
    );

    education.forEach((edu) => {
      const degreeSchool = [edu.degree, edu.school].filter(Boolean).join(', ');
      const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: degreeSchool,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: `\t${dateRange}`,
              bold: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );
    });
  }

  // Add skills
  let skillsContent = '';
  if (Array.isArray(skills)) {
    skillsContent = skills.map(cat => `${cat.category}: ${cat.items.join(', ')}`).join(' • ');
  } else if (skills) {
    const parts = [
      skills.languages?.length > 0 ? `Languages: ${skills.languages.join(', ')}` : '',
      skills.frameworks?.length > 0 ? `Frameworks: ${skills.frameworks.join(', ')}` : '',
      skills.tools?.length > 0 ? `Tools: ${skills.tools.join(', ')}` : '',
    ].filter(Boolean);
    skillsContent = parts.join(' • ');
  }

  if (skillsContent) {
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: 'SKILLS',
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: skillsContent,
        spacing: { after: 400 },
      })
    );
  }

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  // Generate the document as a blob
  const buffer = await Packer.toBuffer(doc);
  return new Blob([buffer as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
};
