import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData } from '@/shared/types/resume';
import { generateHTML } from './formats';

/**
 * Generates a simple ATS-friendly PDF. Delegates to generateFormattedPdf
 */
export const generatePdf = async (resumeData: ResumeData, template: string = 'minimal'): Promise<Blob> => {
  return generateFormattedPdf(resumeData, template);
};

/**
 * THE GOLD STANDARD: Generates a pixel-perfect PDF by rendering the centralized HTML 
 * export into a hidden container and capturing it with html2canvas and jsPDF.
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

  try {
    // Generate the blob
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    console.log('PDF generation complete.');
    return pdf.output('blob');
  } catch (error) {
    console.error('HTML to PDF conversion failed:', error);
    throw error;
  } finally {
    document.body.removeChild(worker);
  }
};

/**
 * Legacy/Alternative: Captures an existing element from the DOM.
 */
export const generatePdfFromElement = async (element: HTMLElement): Promise<Blob> => {
  console.log('Starting PDF generation from DOM element...');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  });
  
  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  
  return pdf.output('blob');
};

