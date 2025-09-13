import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { FormattedResumeData, formatResumeData } from './resumeDataUtils';

// Create a temporary container for rendering the preview
export const renderPreview = async (data: any, template: string = 'default') => {
  const exportId = `resume-preview-${Date.now()}`;
  const container = document.createElement('div');
  container.id = exportId;
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

  let root: any = null;

  try {
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    const { default: ResumePreview } = await import('@/components/ResumePreview');

    root = ReactDOM.createRoot(container);
    root.render(React.createElement(ResumePreview, { 
      resumeData: data,
      template: template,
      currentPage: 1,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages', 'custom']
    }));

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    container.style.visibility = 'visible';
    
    return { container, cleanup: () => {
      if (root) root.unmount();
      if (container.parentNode) document.body.removeChild(container);
    }};
  } catch (error) {
    if (root) root.unmount();
    if (container.parentNode) document.body.removeChild(container);
    throw error;
  }
};

// PDF Export using the preview component
export const exportToPDF = async (data: any, fileName: string = 'resume', template?: string): Promise<void> => {
  const { container, cleanup } = await renderPreview(data, template);
  
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Capture the preview as an image
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      removeContainer: false,
      windowWidth: 794, // A4 width in pixels at ~96 DPI
      windowHeight: 1123, // A4 height in pixels at ~96 DPI
    });

    const imgData = canvas.toDataURL('image/png');

    // Scale image to full PDF width, compute proportional height
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

    // Paginate by re-drawing with a negative y offset for subsequent pages
    let yOffset = -pdfHeight; // start at -1 page height
    while (imgHeight + yOffset > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight, undefined, 'FAST');
      yOffset -= pdfHeight;
    }

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    cleanup();
  }
};

// Word Export using the preview component (image-based to preserve exact styling)
export const exportToWord = async (data: any, fileName: string = 'resume', _template?: string): Promise<void> => {
  try {
    console.log('=== WORD EXPORT DEBUG ===');
    console.log('1. Input data:', JSON.stringify(data, null, 2));
    
    const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import('docx');

    // Normalize input to FormattedResumeData used by templates/exports
    const formatted: FormattedResumeData = (data && (data as FormattedResumeData).personalInfo)
      ? (data as FormattedResumeData)
      : formatResumeData(data);
    
    console.log('2. After formatResumeData:', JSON.stringify(formatted, null, 2));

    const children: Paragraph[] = [];

    // Header
    const fullName = `${formatted.personalInfo.firstName} ${formatted.personalInfo.lastName}`.trim();
    if (fullName) children.push(new Paragraph({ text: fullName, heading: HeadingLevel.HEADING_1 }));
    const contact = [
      formatted.personalInfo.email,
      formatted.personalInfo.phone,
      formatted.personalInfo.location,
      formatted.personalInfo.website,
    ].filter(Boolean).join(' | ');
    if (contact) children.push(new Paragraph({ text: contact }));

    // Optional personal links (Website, LinkedIn, GitHub, Portfolio, or custom)
    if (formatted.personalLinks && formatted.personalLinks.length) {
      formatted.personalLinks.forEach(link => {
        if (link.url) {
          children.push(new Paragraph({ text: `${link.label}: ${link.url}` }));
        }
      });
    }

    // Summary
    if (formatted.summary) {
      children.push(new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_2 }));
      // Preserve line breaks by splitting into separate paragraphs
      formatted.summary.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed) children.push(new Paragraph({ text: trimmed }));
      });
    }

    // Experience
    if (formatted.experience?.length) {
      children.push(new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_2 }));
      formatted.experience.forEach(exp => {
        if (exp.title) children.push(new Paragraph({ text: exp.title, heading: HeadingLevel.HEADING_3 }));
        const metaLeft = [exp.company, exp.location].filter(Boolean).join(', ');
        const dates = `${exp.startDate || ''}${(exp.startDate || exp.endDate) ? ' - ' : ''}${exp.endDate || 'Present'}`;
        const metaLine = [metaLeft, dates].filter(Boolean).join(' | ');
        if (metaLine) children.push(new Paragraph({ text: metaLine }));

        if (Array.isArray(exp.description) && exp.description.length) {
          exp.description.forEach(line => children.push(new Paragraph({ text: line })));
        }
        if (exp.highlights?.length) {
          exp.highlights.forEach(h => children.push(new Paragraph({ text: h, bullet: { level: 0 } })));
        }
      });
    }

    // Education
    if (formatted.education?.length) {
      children.push(new Paragraph({ text: 'Education', heading: HeadingLevel.HEADING_2 }));
      
      formatted.education.forEach(edu => {
        // Degree and School on first line
        const degreeLine = [];
        if (edu.degree) degreeLine.push(edu.degree);
        if (edu.school) degreeLine.push(edu.school);
        
        if (degreeLine.length > 0) {
          children.push(new Paragraph({
            text: degreeLine.join(' | '),
            bold: true
          }));
        }
        
        // Location, Dates, and GPA on second line
        const detailsLine = [];
        if (edu.location) detailsLine.push(edu.location);
        
        // Handle dates
        if (edu.startDate || edu.endDate) {
          const startDate = edu.startDate || '';
          const endDate = edu.endDate || (edu.startDate ? 'Present' : '');
          const dateSeparator = edu.startDate && (edu.endDate || edu.isCurrent) ? ' - ' : '';
          detailsLine.push(`${startDate}${dateSeparator}${endDate}`);
        } else if (edu.year) {
          detailsLine.push(edu.year);
        }
        
        // Add GPA if exists
        if (edu.gpa) {
          detailsLine.push(`GPA: ${edu.gpa}`);
        }
        
        if (detailsLine.length > 0) {
          children.push(new Paragraph({
            text: detailsLine.join(' | '),
            indent: { left: 200 },
            spacing: { after: 100 }
          }));
        }
      });
    }

    // Skills
    if (formatted.skills && Object.keys(formatted.skills).length) {
      children.push(new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_2 }));
      Object.entries(formatted.skills).forEach(([group, list]) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${group}: `, bold: true }),
            new TextRun({ text: (list || []).join(', ') }),
          ],
        }));
      });
    }

    // Projects
    if (formatted.projects && formatted.projects.length) {
      children.push(new Paragraph({ text: 'Projects', heading: HeadingLevel.HEADING_2 }));
      
      formatted.projects.forEach(project => {
        const projectTitle = [project.name, project.technologies?.join(', ')].filter(Boolean).join(' | ');
        
        // Project title with technologies
        if (projectTitle) {
          children.push(new Paragraph({
            text: projectTitle,
            bullet: { level: 0 },
          }));
        }

        // Project description if present
        if (project.description) {
          children.push(new Paragraph({
            text: project.description,
            indent: { left: 720 },
          }));
        }

        // Project highlights/bullets if present
        if (project.highlights && project.highlights.length) {
          project.highlights.forEach(highlight => {
            children.push(new Paragraph({
              text: highlight,
              bullet: { level: 1 },
            }));
          });
        }

        // Project URL if present
        if (project.url) {
          children.push(new Paragraph({
            text: `Link: ${project.url}`,
            indent: { left: 720 },
            style: 'small',
          }));
        }

        children.push(new Paragraph({ text: '' })); // Add space after each project
      });
    }

    // Certifications
    if (formatted.certifications?.length) {
      children.push(new Paragraph({ text: 'Certifications', heading: HeadingLevel.HEADING_2 }));
      formatted.certifications.forEach(c => {
        const line = `${c.name}${c.issuer ? `, ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}`;
        if (line) children.push(new Paragraph({ text: line }));
        if (c.url) children.push(new Paragraph({ text: c.url }));
      });
    }

    // Achievements
    if (formatted.achievements && formatted.achievements.length) {
      children.push(new Paragraph({ text: 'Achievements', heading: HeadingLevel.HEADING_2 }));
      formatted.achievements.forEach((a) => {
        children.push(new Paragraph({ text: a, bullet: { level: 0 } }));
      });
    }

    // Languages
    if (formatted.languages && formatted.languages.length) {
      children.push(new Paragraph({ text: 'Languages', heading: HeadingLevel.HEADING_2 }));
      formatted.languages.forEach((l) => {
        const line = `${l.language}${l.proficiency ? ` — ${l.proficiency}` : ''}`;
        children.push(new Paragraph({ text: line }));
      });
    }

    // Custom Sections
    if (formatted.customSections?.length) {
      formatted.customSections.forEach(section => {
        if (!section.title || !section.content) return;
        
        children.push(new Paragraph({ 
          text: section.title, 
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }));
        
        if (Array.isArray(section.content)) {
          section.content.forEach((item, idx) => {
            if (item) {
              children.push(new Paragraph({
                text: item,
                bullet: { level: 0 },
                spacing: { before: 100, after: 100 }
              }));
            }
          });
        } else if (section.content) {
          children.push(new Paragraph({
            text: section.content,
            spacing: { before: 100, after: 100 }
          }));
        }
      });
    }

    const { Document: _D } = await import('docx'); // keep dynamic import consistent
    const doc = new Document({
      sections: [
        {
          properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
  } catch (error) {
    console.error('Error generating editable Word document:', error);
    throw error;
  }
};

// Text Export - accepts either raw JSON or already formatted data
export const exportToText = async (data: any, fileName: string = 'resume'): Promise<void> => {
  let formatted: FormattedResumeData;
  if (data && (data as FormattedResumeData).personalInfo) {
    formatted = data as FormattedResumeData;
  } else {
    formatted = formatResumeData(data);
  }

  let text = '';
  
  // Personal Info
  if (formatted.personalInfo) {
    text += `${formatted.personalInfo.firstName} ${formatted.personalInfo.lastName}\n`;
    text += `${formatted.personalInfo.title}\n\n`;
    
    const contactInfo = [
      formatted.personalInfo.email,
      formatted.personalInfo.phone,
      formatted.personalInfo.location,
      formatted.personalInfo.website
    ].filter(Boolean).join(' | ');
    
    text += `${contactInfo}\n\n`;

    // Personal links
    if (formatted.personalLinks && formatted.personalLinks.length) {
      formatted.personalLinks.forEach(link => {
        if (link.url) text += `${link.label}: ${link.url}\n`;
      });
      text += `\n`;
    }
  }
  
  // Summary
  if (formatted.summary) {
    text += `SUMMARY\n${'='.repeat(50)}\n${formatted.summary}\n\n`;
  }
  
  // Experience
  if (formatted.experience?.length) {
    text += `EXPERIENCE\n${'='.repeat(50)}\n`;
    formatted.experience.forEach(exp => {
      text += `\n${exp.title} | ${exp.company}`;
      if (exp.location) text += `, ${exp.location}`;
      text += `\n${exp.startDate} - ${exp.endDate || 'Present'}\n`;
      if (exp.description) text += `${Array.isArray(exp.description) ? exp.description.join(' ') : exp.description}\n`;
      if (exp.highlights?.length) {
        exp.highlights.forEach(item => text += `• ${item}\n`);
      }
      text += '\n';
    });
  }

  // Education
  if (formatted.education?.length) {
    text += `EDUCATION\n${'='.repeat(50)}\n`;
    formatted.education.forEach(edu => {
      text += `\n${edu.degree} | ${edu.school}`;
      if (edu.location) text += `, ${edu.location}`;
      if (edu.startDate || edu.endDate) {
        const startDate = edu.startDate || '';
        const endDate = edu.endDate || (edu.startDate ? 'Present' : '');
        const dateSeparator = edu.startDate && (edu.endDate || edu.isCurrent) ? ' - ' : '';
        text += `\n${startDate}${dateSeparator}${endDate}`;
      } else if (edu.year) {
        text += `\n${edu.year}`;
      }
      if (edu.gpa) text += `\nGPA: ${edu.gpa}`;
      text += '\n';
    });
  }
  
  // Skills
  if (formatted.skills) {
    text += `SKILLS\n${'='.repeat(50)}\n`;
    Object.keys(formatted.skills).forEach(skill => {
      text += `${skill}: ${formatted.skills[skill].join(', ')}\n`;
    });
    text += '\n';
  }
  
  // Projects
  if (formatted.projects?.length) {
    text += `PROJECTS\n${'='.repeat(50)}\n`;
    formatted.projects.forEach(project => {
      // Title
      const title = project.name || '';
      if (title) text += `\n${title}\n`;
      
      // Description
      if (project.description) text += `${project.description}\n`;
      
      // Technologies
      if (project.technologies?.length) text += `Technologies: ${project.technologies.join(', ')}\n`;
      
      // Highlights / bullets
      if (project.highlights && project.highlights.length) {
        project.highlights.forEach(h => {
          text += `• ${h}\n`;
        });
      }
      
      // URL
      if (project.url) text += `Link: ${project.url}\n`;
      
      text += '\n';
    });
  }
  
  // Certifications
  if (formatted.certifications?.length) {
    text += `CERTIFICATIONS\n${'='.repeat(50)}\n`;
    formatted.certifications.forEach(certification => {
      text += `${certification.name}`;
      if (certification.issuer) text += ` | ${certification.issuer}`;
      if (certification.date) text += ` (${certification.date})`;
      text += '\n\n';
    });
  }
  
  // Achievements
  if (formatted.achievements && formatted.achievements.length) {
    text += `ACHIEVEMENTS\n${'='.repeat(50)}\n`;
    formatted.achievements.forEach(achievement => {
      text += `${achievement}\n`;
    });
    text += '\n';
  }

  // Languages
  if (formatted.languages && formatted.languages.length) {
    text += `LANGUAGES\n${'='.repeat(50)}\n`;
    formatted.languages.forEach(language => {
      text += `${language.language} — ${language.proficiency}\n`;
    });
    text += '\n';
  }

  // Custom Sections
  if (formatted.customSections?.length) {
    formatted.customSections.forEach(section => {
      text += `${section.title.toUpperCase()}\n${'='.repeat(section.title.length)}\n`;
      if (Array.isArray(section.content)) {
        section.content.forEach(item => {
          // Split multi-line content and bullet each line
          item.split('\n').forEach(line => {
            if (line.trim()) text += `• ${line.trim()}\n`;
          });
        });
      } else if (section.content) {
        section.content.toString().split('\n').forEach(line => {
          if (line.trim()) text += `• ${line.trim()}\n`;
        });
      }
      text += '\n';
    });
  }
  
  // Save as text file
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${fileName}.txt`);
};

// Main export function
export const exportResume = async (
  data: any,
  format: 'pdf' | 'word' | 'text',
  fileName: string = 'resume',
  options?: { template?: string }
): Promise<void> => {
  try {
    switch (format) {
      case 'pdf':
        await exportToPDF(data, fileName, options?.template);
        break;
      case 'word':
        await exportToWord(data, fileName, options?.template);
        break;
      case 'text':
        await exportToText(data, fileName);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error(`Error exporting ${format}:`, error);
    throw error;
  }
};

export default {
  renderPreview,
  exportToPDF,
  exportToWord,
  exportToText,
  exportResume
};
