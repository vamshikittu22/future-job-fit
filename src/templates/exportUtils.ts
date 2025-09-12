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

// Word Export using html-docx-js
export const exportToWord = async (data: FormattedResumeData, fileName: string = 'resume'): Promise<void> => {
  try {
    // Import the library dynamically
    const htmlDocx = (await import('html-docx-js/dist/html-docx')).default;
    
    // Create HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          h1 { 
            color: #2c3e50; 
            margin-bottom: 10px; 
            font-size: 24pt;
          }
          h2 { 
            color: #34495e; 
            margin: 20px 0 10px; 
            border-bottom: 1px solid #eee; 
            padding-bottom: 5px;
            font-size: 18pt;
          }
          .section { 
            margin-bottom: 20px; 
          }
          .job-title { 
            font-weight: bold;
            font-size: 12pt;
            margin-top: 10px;
          }
          .company { 
            font-style: italic;
            font-size: 11pt;
          }
          .date { 
            color: #7f8c8d;
            font-size: 10pt;
            margin-bottom: 5px;
          }
          ul { 
            margin: 5px 0; 
            padding-left: 20px;
          }
          li {
            margin-bottom: 3px;
          }
          p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${escapeHtml(data.personalInfo.firstName)} ${escapeHtml(data.personalInfo.lastName)}</h1>
          <div class="contact-info">
            ${data.personalInfo.email ? `<span>${escapeHtml(data.personalInfo.email)}</span> | ` : ''}
            ${escapeHtml(data.personalInfo.phone || '')}
            ${data.personalInfo.location ? ` | ${escapeHtml(data.personalInfo.location)}` : ''}
          </div>
        </div>`;

    // Add Summary
    if (data.summary) {
      htmlContent += `
        <div class="section">
          <h2>SUMMARY</h2>
          <p>${escapeHtml(data.summary)}</p>
        </div>`;
    }

    // Add Experience
    if (data.experience?.length > 0) {
      htmlContent += `<div class="section"><h2>EXPERIENCE</h2>`;
      data.experience.forEach(exp => {
        htmlContent += `
          <div class="job">
            <div class="job-title">${escapeHtml(exp.title || '')}</div>
            <div class="company">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
            <div class="date">${escapeHtml(exp.startDate || '')} - ${escapeHtml(exp.endDate || 'Present')}</div>
            ${exp.description ? `<p>${escapeHtml(exp.description)}</p>` : ''}
            ${exp.highlights?.length ? `
              <ul>
                ${exp.highlights.map(h => h ? `<li>${escapeHtml(h)}</li>` : '').join('')}
              </ul>
            ` : ''}
          </div>`;
      });
      htmlContent += `</div>`;
    }

    // Close HTML
    htmlContent += `</body></html>`;

    // Convert HTML to DOCX and trigger download
    const converted = htmlDocx.asBlob(htmlContent);
    saveAs(converted, `${fileName}.docx`);

  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
};

// Helper function to escape HTML special characters
function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
