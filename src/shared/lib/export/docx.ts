import { Document, HeadingLevel, Paragraph, TextRun, Packer, AlignmentType, UnderlineType, BorderStyle } from 'docx';
import { ResumeData } from '@/shared/lib/initialData';

const getDocxStyles = (template: string) => {
  const t = template.toLowerCase();

  interface DocxStyle {
    fontBody: string;
    fontHeading: string;
    colorHeadings: string;
    colorSubheadings: string;
    alignment: (typeof AlignmentType)[keyof typeof AlignmentType];
    headerAlignment: (typeof AlignmentType)[keyof typeof AlignmentType];
    showLines: boolean;
    boldName: boolean;
  }

  const styles: DocxStyle = {
    fontBody: 'Arial',
    fontHeading: 'Arial',
    colorHeadings: '000000',
    colorSubheadings: '666666',
    alignment: AlignmentType.LEFT,
    headerAlignment: AlignmentType.LEFT,
    showLines: false,
    boldName: true,
  };

  switch (t) {
    case 'modern':
      styles.fontBody = 'Calibri';
      styles.fontHeading = 'Calibri';
      styles.colorHeadings = '2563EB'; // Blue
      styles.colorSubheadings = '4B5563';
      styles.headerAlignment = AlignmentType.LEFT;
      styles.showLines = true;
      break;
    case 'creative':
      styles.fontBody = 'Georgia'; // Serif mixed
      styles.fontHeading = 'Arial';
      styles.colorHeadings = '7C3AED'; // Purple
      styles.colorSubheadings = '5B21B6';
      styles.headerAlignment = AlignmentType.CENTER;
      styles.alignment = AlignmentType.CENTER; // Center some elements?
      styles.showLines = false;
      break;
    case 'classic':
      styles.fontBody = 'Times New Roman';
      styles.fontHeading = 'Times New Roman';
      styles.colorHeadings = '000000';
      styles.colorSubheadings = '000000';
      styles.headerAlignment = AlignmentType.CENTER;
      styles.showLines = true;
      break;
    case 'minimal':
    default:
      // Default styles apply
      break;
  }
  return styles;
};

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

  const style = getDocxStyles(template);
  const sections: Paragraph[] = [];

  // 1. Header (Name & Contact)
  sections.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: style.headerAlignment,
      children: [
        new TextRun({
          text: personal?.name || 'Resume',
          bold: style.boldName,
          size: 32, // 16pt
          font: style.fontHeading,
          color: style.colorHeadings,
        }),
      ],
      spacing: { after: 100 },
    })
  );

  const contactInfo = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.website,
    personal?.linkedin ? `LinkedIn: ${personal.linkedin}` : '',
    personal?.github ? `GitHub: ${personal.github}` : '',
  ].filter(Boolean);

  if (contactInfo.length > 0) {
    sections.push(
      new Paragraph({
        alignment: style.headerAlignment,
        children: [
          new TextRun({
            text: contactInfo.join(' | '),
            size: 20, // 10pt
            font: style.fontBody,
            color: style.colorSubheadings,
          }),
        ],
        spacing: { after: 400 },
        border: style.showLines && template === 'classic' ? { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } } : undefined,
      })
    );
  }

  // Helper to create Section Headings
  const createSectionHeading = (text: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      text: text.toUpperCase(),
      alignment: AlignmentType.LEFT, // Sections usually left aligned even in centered layouts for readability, or match style
      spacing: { before: 200, after: 100 },
      border: style.showLines ? { bottom: { color: style.colorHeadings, space: 1, style: BorderStyle.SINGLE, size: 6 } } : undefined,
      run: {
        font: style.fontHeading,
        color: style.colorHeadings,
        size: 24, // 12pt
        bold: true,
      }
    });
  };

  // 2. Summary
  if (summary) {
    sections.push(createSectionHeading('SUMMARY'));
    sections.push(
      new Paragraph({
        text: summary,
        spacing: { after: 200 },
        run: { font: style.fontBody, size: 22 }
      })
    );
  }

  // 3. Experience
  if (experience.length > 0) {
    sections.push(createSectionHeading('EXPERIENCE'));
    experience.forEach((exp) => {
      // Title Line
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.title,
              bold: true,
              size: 22,
              font: style.fontBody,
            }),
            new TextRun({
              text: `\t${exp.startDate} - ${exp.endDate || 'Present'}`,
              bold: true,
              size: 20,
              font: style.fontBody,
            }),
          ],
          tabStops: [{ type: "right" as any, position: 9000 }],
        })
      );
      // Company Line
      if (exp.company) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.company,
                italics: true,
                size: 20,
                font: style.fontBody,
                color: style.colorSubheadings
              })
            ],
            spacing: { after: 50 },
          })
        )
      }

      if (exp.description) {
        sections.push(
          new Paragraph({
            text: exp.description,
            spacing: { after: 150 },
            run: { font: style.fontBody, size: 22 }
          })
        );
      }
    });
  }

  // 4. Education
  if (education.length > 0) {
    sections.push(createSectionHeading('EDUCATION'));
    education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.school,
              bold: true,
              size: 22,
              font: style.fontBody,
            }),
            new TextRun({
              text: `\t${edu.startDate} - ${edu.endDate || 'Present'}`,
              bold: true,
              size: 20,
              font: style.fontBody,
            }),
          ],
          tabStops: [{ type: "right" as any, position: 9000 }],
          spacing: { after: 30 },
        })
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree,
              italics: true,
              size: 20,
              font: style.fontBody,
              color: style.colorSubheadings
            })
          ],
          spacing: { after: 100 }
        })
      )
    });
  }

  // 5. Projects
  if (projects.length > 0) {
    sections.push(createSectionHeading('PROJECTS'));
    projects.forEach((proj) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 22,
              font: style.fontBody,
            }),
            new TextRun({
              text: `\t${proj.startDate || ''} - ${proj.endDate || ''}`,
              bold: true,
              size: 20,
              font: style.fontBody,
            }),
          ],
          tabStops: [{ type: "right" as any, position: 9000 }],
        })
      );

      if (proj.role) {
        sections.push(new Paragraph({ text: proj.role, spacing: { after: 30 }, run: { italics: true, font: style.fontBody, size: 20 } }));
      }

      if (proj.description) {
        sections.push(
          new Paragraph({
            text: proj.description,
            spacing: { after: 50 },
            run: { font: style.fontBody, size: 22 }
          })
        );
      }

      if (proj.technologies?.length) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Technologies: ", bold: true, font: style.fontBody, size: 20 }),
              new TextRun({ text: proj.technologies.join(", "), font: style.fontBody, size: 20 })
            ],
            spacing: { after: 50 }
          })
        )
      }

      if (proj.bullets?.length) {
        proj.bullets.forEach(b => {
          sections.push(
            new Paragraph({
              text: `• ${b}`,
              indent: { left: 400 },
              run: { font: style.fontBody, size: 22 },
            })
          )
        })
      }

      sections.push(new Paragraph({ text: "", spacing: { after: 100 } })); // Spacer
    });
  }

  // 6. Skills
  let skillsContent = '';
  if (Array.isArray(skills)) {
    skillsContent = skills.map(cat => `${cat.category}: ${cat.items.join(', ')}`).join(' | ');
  } else if (skills) {
    // Legacy structure support
    const s = skills as any;
    const parts = [
      s.languages?.length ? `Languages: ${s.languages.join(', ')}` : '',
      s.frameworks?.length ? `Frameworks: ${s.frameworks.join(', ')}` : '',
      s.tools?.length ? `Tools: ${s.tools.join(', ')}` : '',
    ].filter(Boolean);
    skillsContent = parts.join(' | ');
  }

  if (skillsContent) {
    sections.push(createSectionHeading('SKILLS'));
    sections.push(
      new Paragraph({
        text: skillsContent,
        spacing: { after: 200 },
        run: { font: style.fontBody, size: 22 }
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // ~2cm
          },
        },
        children: sections,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: style.fontBody,
            size: 22, // 11pt default
            color: "000000"
          }
        }
      }
    }
  });

  const buffer = await Packer.toBuffer(doc);
  return new Blob([buffer as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
};
