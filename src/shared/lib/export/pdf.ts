import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { ResumeData } from '@/shared/types/resume';
import { generateHTML } from './formats';

/**
 * Generates a simple ATS-friendly PDF. Delegates to generateFormattedPdf
 * using the canonical html2pdf pipeline so only one PDF dependency is needed.
 */
export const generatePdf = async (resumeData: ResumeData, template: string = 'minimal'): Promise<Blob> => {
  return generateFormattedPdf(resumeData, template);
};

/**
 * THE GOLD STANDARD: Generates a pixel-perfect PDF by rendering the centralized HTML 
 * export into a hidden container and capturing it with html2pdf.js.
 * This ensures PDF matches HTML and DOCX exactly.
 */
export const generateFormattedPdf = async (resumeData: ResumeData, template: string = 'modern'): Promise<Blob> => {
  console.log('Generating High-Fidelity PDF from Registry styles...');

  // 1. Get the source-of-truth HTML
  const html = generateHTML(resumeData, template);

  // 2. Create a hidden element to render it
  const worker = document.createElement('div');
  worker.style.position = 'fixed';
  worker.style.left = '-9999px';
  worker.style.top = '0';
  worker.innerHTML = html;
  document.body.appendChild(worker);

  // Focus on the .page content inside the generated HTML
  const element = worker.querySelector('.page') as HTMLElement;
  if (!element) {
    document.body.removeChild(worker);
    throw new Error('Failed to generate PDF: HTML structure invalid');
  }

  // Define html2pdf options for A4 high-res
  const opt = {
    margin: 0,
    filename: `resume-${template}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      logging: false
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    // Generate the blob
    const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
    console.log('PDF generation complete.');
    return pdfBlob;
  } catch (error) {
    console.error('HTML to PDF conversion failed:', error);
    throw error;
  } finally {
    document.body.removeChild(worker);
  }
};

/**
 * Legacy/Alternative: Captures an existing element from the DOM.
 * Now refactored to use html2pdf for better reliability.
 */
export const generatePdfFromElement = async (element: HTMLElement): Promise<Blob> => {
  console.log('Starting PDF generation from DOM element...');

  const opt = {
    margin: 0,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  return html2pdf().set(opt).from(element).output('blob');
};

