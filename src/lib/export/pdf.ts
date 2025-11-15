import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../../lib/initialData';

export const generatePdf = async (resumeData: ResumeData, template: string = 'minimal'): Promise<Blob> => {
  // In a real implementation, you would render the resume using the template
  // and convert it to PDF using html2canvas and jsPDF
  
  // For now, we'll create a simple PDF with the resume data
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(24);
  doc.text(resumeData.personal?.name || 'Resume', 20, 20);
  
  // Add contact information
  doc.setFontSize(12);
  const contactInfo = [
    resumeData.personal?.email,
    resumeData.personal?.phone,
    resumeData.personal?.location
  ].filter(Boolean).join(' | ');
  
  doc.text(contactInfo, 20, 30);
  
  // Add a line separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Add sections
  let yPos = 45;
  
  // Summary
  if (resumeData.summary) {
    doc.setFontSize(16);
    doc.text('Summary', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(resumeData.summary, 170);
    doc.text(splitText, 20, yPos);
    yPos += splitText.length * 6 + 10;
  }
  
  // Convert to blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

export const generatePdfFromElement = async (element: HTMLElement): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  return pdf.output('blob');
};
