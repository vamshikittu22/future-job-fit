import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { FormattedResumeData } from './resumeDataUtils';

// PDF Export
export const exportToPDF = async (data: FormattedResumeData, fileName: string = 'resume'): Promise<void> => {
  const exportId = `pdf-export-${Date.now()}`;
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
    const { BaseResumeTemplate } = await import('@/templates/BaseResumeTemplate');

    root = ReactDOM.createRoot(container);
    root.render(React.createElement(BaseResumeTemplate, { 
      data,
      className: 'pdf-export' 
    }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    container.style.visibility = 'visible';

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Function to capture a page
    const capturePage = async (element: HTMLElement) => {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: false,
        windowWidth: 794,
        windowHeight: 1123,
        onclone: (clonedDoc) => {
          const containers = clonedDoc.querySelectorAll('div[id^="pdf-export-"]');
          containers.forEach(el => {
            if (el.id !== exportId) {
              (el as HTMLElement).remove();
            }
          });
        }
      });
      return canvas;
    };

    // Capture the main content
    const mainCanvas = await capturePage(container);
    const imgData = mainCanvas.toDataURL('image/png');
    const imgWidth = pdfWidth;
    const imgHeight = (mainCanvas.height * pdfWidth) / mainCanvas.width;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

    // Check if we need additional pages
    const contentHeight = mainCanvas.height * (pdfHeight / imgHeight);
    if (contentHeight > pdfHeight) {
      // Split content into sections that fit on a page
      const sectionHeight = pdfHeight * 0.9; // 90% of page height
      const sections = Math.ceil(contentHeight / sectionHeight);
      
      for (let i = 1; i < sections; i++) {
        pdf.addPage();
        const yOffset = -(sectionHeight * i);
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight, undefined, 'FAST');
      }
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    if (root) {
      root.unmount();
    }
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
};

// Word Export using docx (browser-safe)
export const exportToWord = async (data: FormattedResumeData, fileName: string = 'resume'): Promise<void> => {
  try {
    const { Document, Paragraph, TextRun, Packer, HeadingLevel } = await import('docx');

    const sections: any[] = [
      {
        properties: {
          page: {
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children: [
          new Paragraph({
            text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: data.personalInfo.email || '' }),
              ...(data.personalInfo.phone ? [new TextRun({ text: ' | ' }), new TextRun({ text: data.personalInfo.phone })] : []),
              ...(data.personalInfo.location ? [new TextRun({ text: ' | ' }), new TextRun({ text: data.personalInfo.location })] : []),
              ...(data.personalInfo.website ? [new TextRun({ text: ' | ' }), new TextRun({ text: data.personalInfo.website })] : []),
            ],
          }),
          ...(data.summary
            ? [
                new Paragraph({ text: 'SUMMARY', heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: data.summary }),
              ]
            : []),
          ...(data.experience?.length
            ? [
                new Paragraph({ text: 'EXPERIENCE', heading: HeadingLevel.HEADING_2 }),
                ...data.experience.flatMap((exp) => [
                  new Paragraph({ text: exp.title, heading: HeadingLevel.HEADING_3 }),
                  new Paragraph({
                    text: `${exp.company}${exp.location ? `, ${exp.location}` : ''} | ${exp.startDate} - ${exp.endDate || 'Present'}`,
                  }),
                  ...(exp.description ? [new Paragraph({ text: exp.description })] : []),
                  ...(exp.highlights?.map((h) => new Paragraph({ text: `• ${h}` })) || []),
                ]),
              ]
            : []),
          ...(data.education?.length
            ? [
                new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2 }),
                ...data.education.flatMap((edu) => [
                  new Paragraph({ text: edu.degree, heading: HeadingLevel.HEADING_3 }),
                  new Paragraph({ text: `${edu.school}${edu.location ? `, ${edu.location}` : ''}` }),
                  new Paragraph({
                    text: `${edu.startDate} - ${edu.endDate || 'Present'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`,
                  }),
                ]),
              ]
            : []),
          ...(Object.keys(data.skills || {}).length
            ? [
                new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }),
                ...Object.entries(data.skills).map(([k, v]) => new Paragraph({ text: `${k}: ${(v || []).join(', ')}` })),
              ]
            : []),
          ...(data.projects?.length
            ? [
                new Paragraph({ text: 'PROJECTS', heading: HeadingLevel.HEADING_2 }),
                ...data.projects.flatMap((p) => [
                  new Paragraph({ text: p.name, heading: HeadingLevel.HEADING_3 }),
                  ...(p.description ? [new Paragraph({ text: p.description })] : []),
                  ...(p.technologies?.length ? [new Paragraph({ text: `Technologies: ${p.technologies.join(', ')}` })] : []),
                ]),
              ]
            : []),
          ...(data.certifications?.length
            ? [
                new Paragraph({ text: 'CERTIFICATIONS', heading: HeadingLevel.HEADING_2 }),
                ...data.certifications.map((c) =>
                  new Paragraph({ text: `${c.name}${c.issuer ? `, ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}` })
                ),
              ]
            : []),
          ...(data.customSections?.length
            ? data.customSections.flatMap((section) => [
                new Paragraph({ text: section.title.toUpperCase(), heading: HeadingLevel.HEADING_2 }),
                ...(Array.isArray(section.content)
                  ? section.content.map((t) => new Paragraph({ text: t }))
                  : [new Paragraph({ text: section.content as string })]),
              ])
            : []),
        ],
      },
    ];

    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
};

// Text Export
export const exportToText = async (data: FormattedResumeData, fileName: string = 'resume'): Promise<void> => {
  try {
    let textContent = '';

    // Header
    textContent += `${data.personalInfo.firstName} ${data.personalInfo.lastName}\n`;
    if (data.personalInfo.title) {
      textContent += `${data.personalInfo.title}\n`;
    }
    textContent += '\n';

    // Contact Info
    const contactInfo = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.website
    ].filter(Boolean).join(' | ');
    
    textContent += `${contactInfo}\n\n`;

    // Summary
    if (data.summary) {
      textContent += `SUMMARY\n${'='.repeat(50)}\n${data.summary}\n\n`;
    }

    // Experience
    if (data.experience?.length > 0) {
      textContent += `EXPERIENCE\n${'='.repeat(50)}\n\n`;
      data.experience.forEach(exp => {
        textContent += `${exp.title}\n`;
        textContent += `${exp.company}${exp.location ? `, ${exp.location}` : ''} | ${exp.startDate} - ${exp.endDate || 'Present'}\n`;
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
  exportResume
};
