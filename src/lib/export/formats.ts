import { ResumeData } from '../initialData';
import { generatePdfFromElement } from './pdf';
import { generateDocx } from './docx';

export const exportFormats = {
  'pdf-formatted': {
    name: 'PDF (Formatted)',
    extension: '.pdf',
    description: 'Beautiful formatted PDF with your chosen template',
  },
  'pdf-ats': {
    name: 'PDF (ATS-Friendly)',
    extension: '.pdf',
    description: 'Plain text PDF optimized for ATS systems',
  },
  'docx': {
    name: 'Word Document',
    extension: '.docx',
    description: 'Editable Microsoft Word format',
  },
  'html': {
    name: 'HTML',
    extension: '.html',
    description: 'Standalone HTML file',
  },
  'latex': {
    name: 'LaTeX',
    extension: '.tex',
    description: 'LaTeX source for academic CVs',
  },
  'markdown': {
    name: 'Markdown',
    extension: '.md',
    description: 'Plain markdown format',
  },
  'txt': {
    name: 'Plain Text',
    extension: '.txt',
    description: 'Simple text format',
  },
  'json': {
    name: 'JSON Data',
    extension: '.json',
    description: 'Raw data format for importing',
  },
};

export const generateHTML = (resumeData: ResumeData): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [] } = resumeData;
  
  const allSkills = Array.isArray(skills) 
    ? skills.flatMap(cat => cat.items)
    : [...(skills?.languages || []), ...(skills?.frameworks || []), ...(skills?.tools || [])];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personal?.name || 'Resume'}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { margin-bottom: 5px; }
    .contact { color: #666; margin-bottom: 20px; }
    h2 { border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 30px; }
    .item { margin-bottom: 20px; }
    .item-header { display: flex; justify-content: space-between; font-weight: bold; }
    .skills { display: flex; flex-wrap: wrap; gap: 10px; }
    .skill-badge { background: #eee; padding: 5px 10px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>${personal?.name || ''}</h1>
  <div class="contact">${[personal?.email, personal?.phone, personal?.location].filter(Boolean).join(' | ')}</div>
  
  ${summary ? `<section><h2>Summary</h2><p>${summary}</p></section>` : ''}
  
  ${experience.length ? `
    <section>
      <h2>Experience</h2>
      ${experience.map(exp => `
        <div class="item">
          <div class="item-header">
            <span>${exp.title} - ${exp.company}</span>
            <span>${exp.startDate} - ${exp.endDate || 'Present'}</span>
          </div>
          <p>${exp.description || ''}</p>
        </div>
      `).join('')}
    </section>
  ` : ''}
  
  ${education.length ? `
    <section>
      <h2>Education</h2>
      ${education.map(edu => `
        <div class="item">
          <div class="item-header">
            <span>${edu.degree} - ${edu.school}</span>
            <span>${edu.startDate} - ${edu.endDate || 'Present'}</span>
          </div>
        </div>
      `).join('')}
    </section>
  ` : ''}
  
  ${allSkills.length ? `
    <section>
      <h2>Skills</h2>
      <div class="skills">
        ${allSkills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
      </div>
    </section>
  ` : ''}
</body>
</html>`;
};

export const generateMarkdown = (resumeData: ResumeData): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [] } = resumeData;
  
  let md = `# ${personal?.name || 'Resume'}\n\n`;
  md += `${[personal?.email, personal?.phone, personal?.location].filter(Boolean).join(' | ')}\n\n`;
  
  if (summary) {
    md += `## Summary\n\n${summary}\n\n`;
  }
  
  if (experience.length) {
    md += `## Experience\n\n`;
    experience.forEach(exp => {
      md += `### ${exp.title} - ${exp.company}\n`;
      md += `*${exp.startDate} - ${exp.endDate || 'Present'}*\n\n`;
      if (exp.description) md += `${exp.description}\n\n`;
    });
  }
  
  if (education.length) {
    md += `## Education\n\n`;
    education.forEach(edu => {
      md += `### ${edu.degree} - ${edu.school}\n`;
      md += `*${edu.startDate} - ${edu.endDate || 'Present'}*\n\n`;
    });
  }
  
  const allSkills = Array.isArray(skills) 
    ? skills.flatMap(cat => cat.items)
    : [...(skills?.languages || []), ...(skills?.frameworks || []), ...(skills?.tools || [])];
    
  if (allSkills.length) {
    md += `## Skills\n\n`;
    md += allSkills.join(' • ');
    md += '\n\n';
  }
  
  return md;
};

export const generatePlainText = (resumeData: ResumeData): string => {
  const { personal, summary, experience = [], education = [], skills } = resumeData;
  
  let txt = `${personal?.name || 'Resume'}\n`;
  txt += `${[personal?.email, personal?.phone, personal?.location].filter(Boolean).join(' | ')}\n\n`;
  txt += '='.repeat(80) + '\n\n';
  
  if (summary) {
    txt += `SUMMARY\n${summary}\n\n`;
  }
  
  if (experience.length) {
    txt += `EXPERIENCE\n${'-'.repeat(80)}\n`;
    experience.forEach(exp => {
      txt += `${exp.title} - ${exp.company}\n`;
      txt += `${exp.startDate} - ${exp.endDate || 'Present'}\n`;
      if (exp.description) txt += `${exp.description}\n`;
      txt += '\n';
    });
  }
  
  if (education.length) {
    txt += `EDUCATION\n${'-'.repeat(80)}\n`;
    education.forEach(edu => {
      txt += `${edu.degree} - ${edu.school}\n`;
      txt += `${edu.startDate} - ${edu.endDate || 'Present'}\n\n`;
    });
  }
  
  const allSkills = Array.isArray(skills) 
    ? skills.flatMap(cat => cat.items)
    : [...(skills?.languages || []), ...(skills?.frameworks || []), ...(skills?.tools || [])];
    
  if (allSkills.length) {
    txt += `SKILLS\n${'-'.repeat(80)}\n`;
    txt += allSkills.join(', ');
    txt += '\n';
  }
  
  return txt;
};

export const generateLaTeX = (resumeData: ResumeData): string => {
  const { personal, summary, experience = [], education = [], skills } = resumeData;
  
  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}
\\usepackage{hyperref}

\\begin{document}

\\begin{center}
{\\Huge \\textbf{${personal?.name || 'Resume'}}}\\\\
\\vspace{0.2cm}
${[personal?.email, personal?.phone, personal?.location].filter(Boolean).join(' $\\mid$ ')}
\\end{center}

${summary ? `\\section*{Summary}\n${summary}\n` : ''}

${experience.length ? `
\\section*{Experience}
${experience.map(exp => `
\\textbf{${exp.title}} \\hfill ${exp.startDate} - ${exp.endDate || 'Present'}\\\\
\\textit{${exp.company}}\\\\
${exp.description || ''}\\\\
`).join('\n')}
` : ''}

${education.length ? `
\\section*{Education}
${education.map(edu => `
\\textbf{${edu.degree}} \\hfill ${edu.startDate} - ${edu.endDate || 'Present'}\\\\
\\textit{${edu.school}}\\\\
`).join('\n')}
` : ''}

${(() => {
  const allSkills = Array.isArray(skills) 
    ? skills.flatMap(cat => cat.items)
    : [...(skills?.languages || []), ...(skills?.frameworks || []), ...(skills?.tools || [])];
  return allSkills.length ? `
\\section*{Skills}
${allSkills.join(', ')}
` : '';
})()}

\\end{document}`;
};

export const generateATSPdf = async (resumeData: ResumeData): Promise<Blob> => {
  // Create a simple, ATS-friendly HTML structure
  const html = generatePlainText(resumeData);
  const tempDiv = document.createElement('div');
  tempDiv.style.cssText = 'position:absolute;left:-9999px;font-family:Arial;font-size:12pt;line-height:1.5;';
  tempDiv.innerHTML = `<pre style="white-space:pre-wrap;font-family:Arial;">${html}</pre>`;
  document.body.appendChild(tempDiv);
  
  const blob = await generatePdfFromElement(tempDiv);
  document.body.removeChild(tempDiv);
  
  return blob;
};
