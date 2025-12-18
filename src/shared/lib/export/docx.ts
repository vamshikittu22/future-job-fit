import { Document, HeadingLevel, Paragraph, TextRun, Packer, AlignmentType, UnderlineType, BorderStyle } from 'docx';
import { ResumeData } from '@/shared/types/resume';

const getDocxStyles = (template: string, themeConfig?: any) => {
  const t = template.toLowerCase();

  interface DocxStyle {
    fontBody: string;
    fontHeading: string;
    colorTitle: string;
    colorHeadings: string;
    colorSubheadings: string;
    colorLinks: string;
    colorPrimary: string;
    colorMuted: string;
    alignment: (typeof AlignmentType)[keyof typeof AlignmentType];
    headerAlignment: (typeof AlignmentType)[keyof typeof AlignmentType];
    showLines: boolean;
    nameSize: number;
    sectionSize: number;
    bodySize: number;
    italicSubtitle: boolean;
    uppercaseName: boolean;
    headerPadding: number;
  }

  const styles: DocxStyle = {
    fontBody: 'Arial',
    fontHeading: 'Arial',
    colorTitle: '111827',
    colorHeadings: '111827',
    colorSubheadings: '374151',
    colorLinks: '2563EB',
    colorPrimary: '111827',
    colorMuted: '6B7280',
    alignment: AlignmentType.LEFT,
    headerAlignment: AlignmentType.CENTER,
    showLines: false,
    nameSize: 48,
    sectionSize: 18,
    bodySize: 18,
    italicSubtitle: false,
    uppercaseName: false,
    headerPadding: 200,
  };

  switch (t) {
    case 'modern':
      styles.fontBody = 'Calibri';
      styles.fontHeading = 'Calibri';
      styles.colorTitle = '1E3A8A';
      styles.colorHeadings = '1E3A8A';
      styles.colorSubheadings = '4B5563';
      styles.colorPrimary = '2563EB';
      styles.colorLinks = '2563EB';
      styles.headerAlignment = AlignmentType.LEFT;
      styles.nameSize = 64;
      styles.sectionSize = 28;
      styles.showLines = true;
      break;
    case 'creative':
      styles.fontBody = 'Georgia';
      styles.fontHeading = 'Georgia';
      styles.colorTitle = '4C1D95';
      styles.colorHeadings = '4C1D95';
      styles.colorSubheadings = '5B21B6';
      styles.colorPrimary = '7C3AED';
      styles.colorLinks = '7C3AED';
      styles.headerAlignment = AlignmentType.CENTER;
      styles.italicSubtitle = true;
      styles.headerPadding = 400;
      break;
    case 'classic':
      styles.fontBody = 'Times New Roman';
      styles.fontHeading = 'Times New Roman';
      styles.colorTitle = '000000';
      styles.colorHeadings = '000000';
      styles.colorSubheadings = '000000';
      styles.colorPrimary = '000000';
      styles.colorLinks = '000000';
      styles.headerAlignment = AlignmentType.CENTER;
      styles.nameSize = 44;
      styles.showLines = true;
      styles.uppercaseName = true;
      break;
  }

  if (themeConfig) {
    if (themeConfig.primaryColor) styles.colorPrimary = themeConfig.primaryColor.replace('#', '');
    if (themeConfig.titleColor) styles.colorTitle = themeConfig.titleColor.replace('#', '');
    if (themeConfig.headingsColor) styles.colorHeadings = themeConfig.headingsColor.replace('#', '');
    if (themeConfig.subheadingsColor) styles.colorSubheadings = themeConfig.subheadingsColor.replace('#', '');
    if (themeConfig.linksColor) styles.colorLinks = themeConfig.linksColor.replace('#', '');

    if (themeConfig.fontFamily) {
      const fontMap: Record<string, string> = {
        "'Inter', sans-serif": 'Inter',
        "'Times New Roman', Times, serif": 'Times New Roman',
        "'Georgia', serif": 'Georgia',
        "'Roboto', sans-serif": 'Roboto',
        "'Outfit', sans-serif": 'Calibri'
      };
      const docxFont = fontMap[themeConfig.fontFamily];
      if (docxFont) {
        styles.fontBody = docxFont;
        styles.fontHeading = docxFont;
      }
    }
  }

  return styles;
};

export const generateDocx = async (resumeData: ResumeData, template: string = 'modern'): Promise<Blob> => {
  const {
    personal,
    summary = '',
    experience = [],
    education = [],
    skills,
    projects = [],
    achievements = [],
    certifications = [],
    customSections = []
  } = resumeData;

  const style = getDocxStyles(template, resumeData.metadata?.themeConfig?.[template.toLowerCase()]);
  const sections: Paragraph[] = [];

  sections.push(
    new Paragraph({
      alignment: style.headerAlignment,
      children: [
        new TextRun({
          text: personal?.name || 'Resume',
          bold: true,
          size: style.nameSize,
          font: style.fontHeading,
          color: style.colorTitle,
          allCaps: style.uppercaseName,
        }),
      ],
      spacing: { before: 0, after: 100 },
    })
  );

  if (personal?.title) {
    sections.push(
      new Paragraph({
        alignment: style.headerAlignment,
        children: [
          new TextRun({
            text: personal.title,
            size: 24,
            font: style.fontHeading,
            color: style.colorSubheadings,
            italics: style.italicSubtitle,
            bold: true,
          })
        ],
        spacing: { after: 150 },
      })
    );
  }

  const contactInfo = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.website,
    personal?.linkedin,
    personal?.github,
  ].filter(Boolean).join(' | ');

  sections.push(
    new Paragraph({
      alignment: style.headerAlignment,
      children: [
        new TextRun({
          text: contactInfo,
          size: 18,
          font: style.fontBody,
          color: style.colorMuted,
        }),
      ],
      spacing: { after: 300 },
      border: style.showLines && template.toLowerCase() === 'classic' ? {
        bottom: { color: style.colorTitle, space: 1, style: BorderStyle.SINGLE, size: 12 }
      } : undefined
    })
  );

  const createSectionTitle = (text: string) => {
    return new Paragraph({
      alignment: template.toLowerCase() === 'classic' ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: style.sectionSize,
          font: style.fontHeading,
          color: style.colorHeadings,
        }),
      ],
      spacing: { before: 300, after: 150 },
      border: style.showLines ? {
        bottom: { color: style.colorHeadings, space: 1, style: BorderStyle.SINGLE, size: 6 }
      } : undefined
    });
  };

  if (summary) {
    sections.push(createSectionTitle('Summary'));
    sections.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: summary,
            size: style.bodySize,
            font: style.fontBody,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  if (experience.length > 0) {
    sections.push(createSectionTitle('Experience'));
    experience.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.title,
              bold: true,
              size: 20,
              font: style.fontHeading,
              color: style.colorTitle,
            }),
            new TextRun({
              text: `\t${exp.startDate} — ${exp.endDate || 'Present'}`,
              size: 16,
              font: style.fontBody,
              color: style.colorPrimary,
              bold: true,
            }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
          spacing: { before: 100 },
        })
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.company}${exp.location ? `, ${exp.location}` : ''}`,
              italics: true,
              size: 18,
              font: style.fontBody,
              color: style.colorSubheadings,
            }),
          ],
          spacing: { after: 80 },
        })
      );
      if (exp.description) {
        sections.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: exp.description, size: 18, font: style.fontBody }),
            ],
            spacing: { after: 50 },
          })
        );
      }
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.filter(Boolean).forEach((bullet) => {
          sections.push(
            new Paragraph({
              text: bullet,
              bullet: { level: 0 },
              spacing: { after: 50 },
            })
          );
        });
      }
    });
  }

  if (education.length > 0) {
    sections.push(createSectionTitle('Education'));
    education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.school, bold: true, size: 20, color: style.colorTitle }),
            new TextRun({
              text: `\t${edu.startDate} — ${edu.endDate || 'Present'}`,
              size: 16,
              color: style.colorPrimary,
              bold: true,
            }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
          spacing: { before: 100 },
        })
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree}${edu.fieldOfStudy || edu.field ? ` in ${edu.fieldOfStudy || edu.field}` : ''}`,
              italics: true,
              size: 18,
              color: style.colorSubheadings
            })
          ],
          spacing: { after: edu.description ? 80 : 150 },
        })
      );
      if (edu.description) {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: edu.description, size: 18 })],
            spacing: { after: 150 },
          })
        );
      }
    });
  }

  const allSkills = Array.isArray(skills)
    ? skills.map(cat => `${cat.category}: ${cat.items.join(', ')}`)
    : [`Languages: ${skills?.languages?.join(', ')}`, `Frameworks: ${skills?.frameworks?.join(', ')}`, `Tools: ${skills?.tools?.join(', ')}`].filter(s => !s.endsWith(': '));

  if (allSkills.length > 0) {
    sections.push(createSectionTitle('Skills'));
    allSkills.forEach(skillLine => {
      sections.push(new Paragraph({
        children: [new TextRun({ text: skillLine, size: 18 })],
        spacing: { after: 100 }
      }));
    });
  }

  if (projects.length > 0) {
    sections.push(createSectionTitle('Projects'));
    projects.forEach(p => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: p.name, bold: true, size: 20, color: style.colorTitle }),
          new TextRun({ text: `\t${p.startDate || ''} — ${p.endDate || ''}`, size: 16, color: style.colorPrimary, bold: true })
        ],
        tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
        spacing: { before: 100 }
      }));
      if (p.role) {
        sections.push(new Paragraph({
          children: [new TextRun({ text: p.role, italics: true, size: 18, color: style.colorSubheadings })],
          spacing: { after: 50 }
        }));
      }
      sections.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: p.description, size: 18 })],
        spacing: { after: 100 }
      }));
      if (p.technologies?.length) {
        sections.push(new Paragraph({
          children: [
            new TextRun({ text: 'Technologies: ', bold: true, size: 16 }),
            new TextRun({ text: p.technologies.join(', '), size: 16 })
          ],
          spacing: { after: 100 }
        }));
      }
    });
  }

  if (achievements.length > 0) {
    sections.push(createSectionTitle('Achievements'));
    achievements.forEach(a => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: a.title, bold: true, size: 20, color: style.colorTitle }),
          new TextRun({ text: `\t${a.date || ''}`, size: 16, color: style.colorPrimary, bold: true })
        ],
        tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
        spacing: { before: 100 }
      }));
      if (a.issuer) {
        sections.push(new Paragraph({
          children: [new TextRun({ text: a.issuer, italics: true, size: 18, color: style.colorSubheadings })],
          spacing: { after: 50 }
        }));
      }
      sections.push(new Paragraph({
        children: [new TextRun({ text: a.description, size: 18 })],
        spacing: { after: 150 }
      }));
    });
  }

  if (certifications.length > 0) {
    sections.push(createSectionTitle('Certifications'));
    certifications.forEach(c => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: c.name, bold: true, size: 20, color: style.colorTitle }),
          new TextRun({ text: `\t${c.date || ''}`, size: 16, color: style.colorPrimary, bold: true })
        ],
        tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }]
      }));
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: c.issuer, italics: true, size: 18, color: style.colorSubheadings }),
          c.credentialUrl ? new TextRun({ text: `\tView Credential`, size: 16, color: style.colorLinks, underline: { type: UnderlineType.SINGLE } }) : new TextRun({ text: '' })
        ],
        tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
        spacing: { after: 150 }
      }));
    });
  }

  if (customSections.length > 0) {
    customSections.forEach(cs => {
      if (cs.entries?.length) {
        sections.push(createSectionTitle(cs.title));
        cs.entries.forEach(entry => {
          const firstField = cs.fields[0];
          const otherFields = cs.fields.slice(1);

          sections.push(new Paragraph({
            children: [
              new TextRun({
                text: String(entry.values[firstField.id] || ''),
                bold: true,
                size: 20,
                color: style.colorTitle
              })
            ],
            spacing: { before: 100 }
          }));

          otherFields.forEach(field => {
            const val = entry.values[field.id];
            if (val) {
              sections.push(new Paragraph({
                children: [
                  new TextRun({ text: `${field.name}: `, bold: true, size: 18 }),
                  new TextRun({ text: Array.isArray(val) ? val.join(', ') : String(val), size: 18 })
                ],
                spacing: { after: 50 }
              }));
            }
          });
          sections.push(new Paragraph({ spacing: { after: 100 } }));
        });
      }
    });
  }

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children: sections,
    }],
    styles: {
      default: {
        document: {
          run: { font: style.fontBody, size: style.bodySize, color: "374151" }
        }
      }
    }
  });

  return await Packer.toBlob(doc);
};
