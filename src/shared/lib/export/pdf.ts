import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '@/shared/lib/initialData';

export const generatePdf = async (resumeData: ResumeData, template: string = 'minimal'): Promise<Blob> => {
  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.text(resumeData.personal?.name || 'Resume', 20, 20);

  doc.setFontSize(12);
  const contactInfo = [
    resumeData.personal?.email,
    resumeData.personal?.phone,
    resumeData.personal?.location
  ].filter(Boolean).join(' | ');

  doc.text(contactInfo, 20, 30);

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  let yPos = 45;

  if (resumeData.summary) {
    doc.setFontSize(16);
    doc.text('Summary', 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(resumeData.summary, 170);
    doc.text(splitText, 20, yPos);
    yPos += splitText.length * 6 + 10;
  }

  if (resumeData.experience && resumeData.experience.length > 0) {
    doc.setFontSize(16);
    doc.text('Experience', 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    resumeData.experience.forEach(exp => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${exp.title} - ${exp.company}`, 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`${exp.startDate} - ${exp.endDate || 'Present'}`, 20, yPos);
      yPos += 6;
      if (exp.description) {
        const splitDesc = doc.splitTextToSize(exp.description, 170);
        doc.text(splitDesc, 20, yPos);
        yPos += splitDesc.length * 6;
      }
      yPos += 4;
    });
    yPos += 6;
  }

  if (resumeData.education && resumeData.education.length > 0) {
    doc.setFontSize(16);
    doc.text('Education', 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    resumeData.education.forEach(edu => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree} - ${edu.school}`, 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.startDate} - ${edu.endDate || 'Present'}`, 20, yPos);
      yPos += 10;
    });
  }

  if (resumeData.projects && resumeData.projects.length > 0) {
    doc.setFontSize(16);
    doc.text('Projects', 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    resumeData.projects.forEach(project => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${project.name}`, 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      if (project.description) {
        const splitDesc = doc.splitTextToSize(project.description, 170);
        doc.text(splitDesc, 20, yPos);
        yPos += splitDesc.length * 6;
      }
      yPos += 4;
    });
    yPos += 6;
  }

  if (resumeData.achievements && resumeData.achievements.length > 0) {
    doc.setFontSize(16);
    doc.text('Achievements', 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    resumeData.achievements.forEach(ach => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${ach.title}`, 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`${ach.issuer || ''} | ${ach.date || ''}`, 20, yPos);
      yPos += 6;
      if (ach.description) {
        const splitDesc = doc.splitTextToSize(ach.description, 170);
        doc.text(splitDesc, 20, yPos);
        yPos += splitDesc.length * 6;
      }
      yPos += 4;
    });
    yPos += 6;
  }

  if (resumeData.certifications && resumeData.certifications.length > 0) {
    doc.setFontSize(16);
    doc.text('Certifications', 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    resumeData.certifications.forEach(cert => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${cert.name}`, 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`${cert.issuer} | ${cert.date || ''}`, 20, yPos);
      yPos += 10;
    });
  }

  const allSkills = Array.isArray(resumeData.skills)
    ? resumeData.skills.flatMap(cat => cat.items)
    : [...(resumeData.skills?.languages || []), ...(resumeData.skills?.frameworks || []), ...(resumeData.skills?.tools || [])];

  if (allSkills.length > 0) {
    doc.setFontSize(16);
    doc.text('Skills', 20, yPos);
    yPos += 10;
    doc.setFontSize(11);
    const splitSkills = doc.splitTextToSize(allSkills.join(', '), 170);
    doc.text(splitSkills, 20, yPos);
    yPos += splitSkills.length * 6 + 10;
  }

  return doc.output('blob');
};

export const generatePdfFromElement = async (element: HTMLElement): Promise<Blob> => {
  console.log('Starting PDF generation (Page-by-Page)...');

  // Create a clone to isolate from screen rendering context
  const clone = element.cloneNode(true) as HTMLElement;

  // RESET TRANSFORM: Ensure native A4 scale
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'top left';

  // Mount off-screen
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '210mm';
  container.style.zIndex = '-9999';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Find all individual pages in the clone
    // We added 'resume-page' class in ResumePreview.tsx specifically for this
    const pages = Array.from(clone.querySelectorAll('.resume-page')) as HTMLElement[];

    if (pages.length === 0) {
      console.warn('No .resume-page elements found. Falling back to simple capture.');
      // Fallback: Capture the whole thing if pages aren't marked
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: false,
        backgroundColor: '#ffffff'
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      // If height > 297, this will squash or crop. But this is just a fallback.
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297));
      return pdf.output('blob');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pdfHeight = 297;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      console.log(`Capturing Page ${i + 1}/${pages.length}`);

      // Capture this specific page
      const canvas = await html2canvas(page, {
        scale: 2, // High res for crisp text
        useCORS: true,
        logging: false,
        allowTaint: false,
        backgroundColor: '#ffffff', // Ensure white background
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');

      // Add to PDF
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to fill A4 page exactly
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    console.log('PDF generation complete.');
    return pdf.output('blob');

  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
