import { Document, HeadingLevel, Paragraph, TextRun, Packer, AlignmentType, UnderlineType, BorderStyle } from 'docx';
import { ResumeData } from '@/shared/types/resume';
import { getTemplateStyle, applyThemeConfig, TemplateStyleConfig } from '@/shared/templates/templateStyles';

/**
 * Convert template style configuration to DOCX-specific format
 * @param style - Template style configuration from registry
 * @returns DOCX-compatible style object
 */
const convertTemplateStyleToDocx = (style: TemplateStyleConfig) => {
  // Map alignment types
  const getAlignment = (align: string): typeof AlignmentType[keyof typeof AlignmentType] => {
    switch (align) {
      case 'center':
        return AlignmentType.CENTER;
      case 'right':
        return AlignmentType.RIGHT;
      case 'justified':
        return AlignmentType.JUSTIFIED;
      default:
        return AlignmentType.LEFT;
    }
  };

  return {
    // Fonts
    fontBody: style.fonts.body,
    fontHeading: style.fonts.heading,

    // Colors (already without # prefix in registry)
    colorPrimary: style.colors.primary,
    colorTitle: style.colors.title,
    colorHeadings: style.colors.heading,
    colorSubheadings: style.colors.subheading,
    colorBody: style.colors.body,
    colorMuted: style.colors.muted,
    colorLinks: style.colors.link,

    // Sizes (convert points to half-points for DOCX)
    nameSize: style.sizes.titleSize * 2,
    sectionSize: style.sizes.headingSize * 2,
    subheadingSize: style.sizes.subheadingSize * 2,
    bodySize: style.sizes.bodySize * 2,
    smallSize: style.sizes.smallSize * 2,

    // Layout - Alignment
    headerAlignment: getAlignment(style.layout.headerAlign),
    bodyAlignment: getAlignment(style.layout.bodyAlign),
    alignment: getAlignment(style.layout.bodyAlign),

    // Layout - Spacing (convert points to twips: 1pt = 20 twips)
    sectionSpacing: style.layout.sectionSpacing * 20,
    itemSpacing: style.layout.itemSpacing * 20,

    // Layout - Visual elements
    showLines: style.layout.showBorders,
    showIcons: style.layout.showIcons,
    borderColor: style.colors.border || style.colors.heading,
    borderThickness: (style.layout.borderThickness || 1) * 8, // Convert to eighths of a point

    // Template-specific flags (for backward compatibility)
    italicSubtitle: style.id === 'creative',
    uppercaseName: style.id === 'classic',
    headerPadding: style.layout.headerAlign === 'center' ? 300 : 200,
  };
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

  // Get template style from centralized registry
  const baseStyle = getTemplateStyle(template);

  // Convert ThemeSettings to TemplateColors format if exists
  const themeConfig = resumeData.metadata?.themeConfig?.[template.toLowerCase()];
  const themeColors = themeConfig ? {
    primary: themeConfig.primaryColor?.replace('#', ''),
    title: themeConfig.titleColor?.replace('#', ''),
    heading: themeConfig.headingsColor?.replace('#', ''),
    subheading: themeConfig.subheadingsColor?.replace('#', ''),
    link: themeConfig.linksColor?.replace('#', ''),
  } : undefined;

  // Apply any theme customizations
  const finalStyle = applyThemeConfig(baseStyle, themeColors);

  // Convert to DOCX-specific format
  const style = convertTemplateStyleToDocx(finalStyle);
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
