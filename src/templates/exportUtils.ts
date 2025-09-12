import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { FormattedResumeData } from './resumeDataUtils';

// PDF Export
export const exportToPDF = async (data: FormattedResumeData, fileName: string = 'resume'): Promise<void> => {
  // Create a temporary container for the resume
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '210mm';
  container.style.minHeight = '297mm';
  container.style.padding = '20mm';
  container.style.margin = '0 auto';
  container.style.boxSizing = 'border-box';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '9999';
  container.style.visibility = 'hidden';
  document.body.appendChild(container);

  try {
    // Import React and ReactDOM dynamically to avoid SSR issues
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    const { BaseResumeTemplate } = await import('@/templates/BaseResumeTemplate');

    // Create root and render the resume
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(BaseResumeTemplate, { 
      data,
      className: 'pdf-export' 
    }));

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Make container visible right before capture
    container.style.visibility = 'visible';
    
    // Create a new PDF with proper dimensions (A4)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Create canvas with higher resolution for better quality
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      removeContainer: false,
      windowWidth: 794, // A4 width in pixels at 96dpi
      windowHeight: 1123, // A4 height in pixels at 96dpi
      onclone: (clonedDoc) => {
        // Hide any elements that might cause duplication
        const elements = clonedDoc.querySelectorAll('.pdf-export');
        elements.forEach((el, index) => {
          if (index > 0) {
            (el as HTMLElement).style.display = 'none';
          }
        });
      }
    });

    // Calculate dimensions for the PDF
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

    // Save the PDF
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Clean up
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
};

// Word Export
export const exportToWord = async (data: FormattedResumeData, fileName: string = 'resume'): Promise<void> => {
  try {
    const { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType } = await import('docx');
    
    // Helper function to create a section with proper spacing
    const createSection = (title: string, content: any[]) => {
      return [
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        ...content,
        new Paragraph({ text: '' }), // Add some space after section
      ];
    };

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1000,    // ~1 inch
                right: 1000,  // ~1 inch
                bottom: 1000, // ~1 inch
                left: 1000,   // ~1 inch
              },
            },
          },
          children: [
            // Header
            new Paragraph({
              text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.toUpperCase(),
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            
            // Contact Information
            new Paragraph({
              children: [
                new TextRun({
                  text: data.personalInfo.email,
                  size: 22,
                }),
                new TextRun({
                  text: ' • ',
                  size: 22,
                }),
                new TextRun({
                  text: data.personalInfo.phone || '',
                  size: 22,
                }),
                ...(data.personalInfo.location ? [
                  new TextRun({
                    text: ' • ',
                    size: 22,
                  }),
                  new TextRun({
                    text: data.personalInfo.location,
                    size: 22,
                  })
                ] : []),
                ...(data.personalInfo.website ? [
                  new TextRun({
                    text: ' • ',
                    size: 22,
                  }),
                  new TextRun({
                    text: data.personalInfo.website.replace(/^https?:\/\//, ''),
                    size: 22,
                    color: '0000FF',
                    underline: {}
                  })
                ] : []),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            
            // Summary
            ...(data.summary ? createSection('SUMMARY', [
              new Paragraph({
                text: data.summary,
                spacing: { after: 200 },
              })
            ]) : []),
            
            // Experience
            ...(data.experience.length > 0 ? createSection('EXPERIENCE', data.experience.flatMap(exp => [
              new Paragraph({
                text: exp.title,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200 },
              }),
              new Paragraph({
                text: `${exp.company}${exp.location ? ` • ${exp.location}` : ''}`,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: `${exp.startDate} - ${exp.endDate || 'Present'}`,
                spacing: { after: 200 },
              }),
              ...(exp.description ? [new Paragraph({
                text: exp.description,
                spacing: { after: 200 },
              })] : []),
              ...(exp.highlights?.map(item => 
                new Paragraph({
                  text: `• ${item}`,
                  bullet: { level: 0 },
                  spacing: { before: 100 },
                })
              ) || []),
            ])) : []),
            
            // Education
            ...(data.education.length > 0 ? createSection('EDUCATION', data.education.flatMap(edu => [
              new Paragraph({
                text: edu.degree,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200 },
              }),
              new Paragraph({
                text: `${edu.school}${edu.location ? `, ${edu.location}` : ''}`,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: `${edu.startDate} - ${edu.endDate || 'Present'}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}`,
                spacing: { after: 200 },
              }),
            ])) : []),
            
            // Skills
            ...(Object.keys(data.skills).length > 0 ? createSection('SKILLS', [
              new Paragraph({
                children: Object.entries(data.skills).flatMap(([category, skills], i) => [
                  new TextRun({
                    text: `${category}: `,
                    bold: true,
                  }),
                  new TextRun({
                    text: `${skills.join(', ')}${i < Object.keys(data.skills).length - 1 ? ' \n' : ''}`,
                  })
                ]),
              })
            ]) : []),
            
            // Projects
            ...(data.projects.length > 0 ? createSection('PROJECTS', data.projects.flatMap(project => [
              new Paragraph({
                text: project.name,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200 },
              }),
              ...(project.description ? [new Paragraph({
                text: project.description,
                spacing: { after: 100 },
              })] : []),
              ...(project.technologies?.length ? [new Paragraph({
                text: `Technologies: ${project.technologies.join(', ')}`,
                italics: true,
                spacing: { after: 200 },
              })] : []),
            ])) : []),
            
            // Certifications
            ...(data.certifications.length > 0 ? createSection('CERTIFICATIONS', data.certifications.map(cert => 
              new Paragraph({
                text: `${cert.name}${cert.issuer ? `, ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}`,
                bullet: { level: 0 },
                spacing: { before: 100 },
              })
            )) : []),
            
            // Custom Sections
            ...data.customSections.flatMap(section => 
              createSection(section.title.toUpperCase(), [
                new Paragraph({
                  text: Array.isArray(section.content) 
                    ? section.content.join('\n\n') 
                    : section.content,
                  spacing: { after: 200 },
                })
              ])
            ),
          ],
        },
      ],
    });

    // Generate the document
    const buffer = await Packer.toBlob(doc);
    
    // Create a blob URL and trigger download
    saveAs(buffer, `${fileName}.docx`);
    
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
};

// Text Export
export const exportToText = async (data: FormattedResumeData, fileName: string = 'resume'): Promise<void> => {
  try {
    let textContent = '';

    // Add header
    textContent += `${data.personalInfo.firstName} ${data.personalInfo.lastName}\n`;
    if (data.personalInfo.title) {
      textContent += `${data.personalInfo.title}\n`;
    }
    textContent += '\n';
    
    // Add contact information
    const contactInfo = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.website
    ].filter(Boolean).join(' | ');
    
    textContent += `${contactInfo}\n\n`;

    // Add summary
    if (data.summary) {
      textContent += `SUMMARY\n${'='.repeat(50)}\n${data.summary}\n\n`;
    }

    // Add experience
    if (data.experience.length > 0) {
      textContent += `EXPERIENCE\n${'='.repeat(50)}\n`;
      data.experience.forEach(exp => {
        textContent += `\n${exp.title}\n`;
        textContent += `${exp.company}${exp.location ? `, ${exp.location}` : ''}\n`;
        textContent += `${exp.startDate} - ${exp.endDate || 'Present'}\n`;
        if (exp.description) {
          textContent += `${exp.description}\n`;
        }
        if (exp.highlights?.length) {
          exp.highlights.forEach(highlight => {
            textContent += `• ${highlight}\n`;
          });
        }
        textContent += '\n';
      });
    }

    // Add education
    if (data.education.length > 0) {
      textContent += `\nEDUCATION\n${'='.repeat(50)}\n`;
      data.education.forEach(edu => {
        textContent += `\n${edu.degree}\n`;
        textContent += `${edu.school}${edu.location ? `, ${edu.location}` : ''}\n`;
        textContent += `${edu.startDate} - ${edu.endDate || 'Present'}`;
        if (edu.gpa) {
          textContent += ` | GPA: ${edu.gpa}`;
        }
        textContent += '\n';
      });
    }

    // Add skills
    if (Object.keys(data.skills).length > 0) {
      textContent += `\nSKILLS\n${'='.repeat(50)}\n\n`;
      Object.entries(data.skills).forEach(([category, skills]) => {
        textContent += `${category}: ${skills.join(', ')}\n`;
      });
    }

    // Add projects
    if (data.projects.length > 0) {
      textContent += `\nPROJECTS\n${'='.repeat(50)}\n`;
      data.projects.forEach(project => {
        textContent += `\n${project.name}\n`;
        if (project.description) {
          textContent += `${project.description}\n`;
        }
        if (project.technologies?.length) {
          textContent += `Technologies: ${project.technologies.join(', ')}\n`;
        }
      });
    }

    // Add certifications
    if (data.certifications.length > 0) {
      textContent += `\nCERTIFICATIONS\n${'='.repeat(50)}\n\n`;
      data.certifications.forEach(cert => {
        textContent += `• ${cert.name}`;
        if (cert.issuer) textContent += `, ${cert.issuer}`;
        if (cert.date) textContent += ` (${cert.date})`;
        textContent += '\n';
      });
    }

    // Add custom sections
    if (data.customSections.length > 0) {
      data.customSections.forEach(section => {
        textContent += `\n${section.title.toUpperCase()}\n${'='.repeat(50)}\n\n`;
        if (Array.isArray(section.content)) {
          textContent += section.content.join('\n\n');
        } else {
          textContent += section.content;
        }
        textContent += '\n';
      });
    }

    // Create and download the text file
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${fileName}.txt`);

  } catch (error) {
    console.error('Error generating text resume:', error);
    throw error;
  }
};

// Main export function
export const exportResume = async (
  data: FormattedResumeData,
  format: 'pdf' | 'word' | 'text',
  fileName: string = 'resume'
): Promise<void> => {
  switch (format) {
    case 'pdf':
      return exportToPDF(data, fileName);
    case 'word':
      return exportToWord(data, fileName);
    case 'text':
      return exportToText(data, fileName);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

export default {
  exportToPDF,
  exportToWord,
  exportToText,
  exportResume,
};
