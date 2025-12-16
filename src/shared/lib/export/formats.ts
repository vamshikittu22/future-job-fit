import { ResumeData } from '@/shared/lib/initialData';
import { generatePdfFromElement } from '@/shared/lib/export/pdf';
import { generateDocx } from '@/shared/lib/export/docx';

const escapeLatex = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

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

export const generateHTML = (resumeData: ResumeData, template: string = 'minimal'): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [], achievements = [], certifications = [] } = resumeData;

  const allSkills = Array.isArray(skills)
    ? skills.flatMap(cat => cat.items)
    : [...(skills?.languages || []), ...(skills?.frameworks || []), ...(skills?.tools || [])];

  // Theme Config
  const t = template.toLowerCase();
  let fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  let headingColor = "#2c3e50";
  let textAlign = "left";
  let headerAlign = "center";
  let showLines = false;

  switch (t) {
    case 'modern':
      fontFamily = "'Calibri', 'Segoe UI', sans-serif";
      headingColor = "#2563EB"; // Blue
      headerAlign = "left";
      showLines = true;
      break;
    case 'creative':
      fontFamily = "'Georgia', serif";
      headingColor = "#7C3AED"; // Purple
      headerAlign = "center";
      showLines = false;
      break;
    case 'classic':
      fontFamily = "'Times New Roman', serif";
      headingColor = "#000000";
      headerAlign = "center";
      textAlign = "left"; // classic usually left aligned body
      showLines = true;
      break;
    default: // minimal
      fontFamily = "Arial, sans-serif";
      headingColor = "#333333";
      headerAlign = "left";
      showLines = false;
      break;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personal?.name || 'Resume'} - Resume</title>
  <style>
    :root {
        --heading-color: ${headingColor};
        --font-family: ${fontFamily};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: var(--font-family);
      line-height: 1.5;
      color: #333;
      background-color: #f0f0f0;
    }

    .page {
      background-color: white;
      width: 210mm;
      min-height: 297mm;
      margin: 40px auto;
      padding: 20mm;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    h1 {
      font-size: 24pt;
      margin-bottom: 5px;
      color: var(--heading-color);
      text-transform: uppercase;
      text-align: ${headerAlign};
    }

    h2 {
      font-size: 14pt;
      margin-top: 15pt;
      margin-bottom: 8pt;
      border-bottom: ${showLines ? '2px solid var(--heading-color)' : 'none'};
      padding-bottom: ${showLines ? '2px' : '0'};
      color: var(--heading-color);
      text-transform: uppercase;
      text-align: left; /* Section headers usually left */
    }

    h3 { font-size: 11pt; font-weight: bold; margin-bottom: 2px; }
    p, li { font-size: 10pt; }
    a { color: var(--heading-color); text-decoration: none; }

    header { text-align: ${headerAlign}; margin-bottom: 20px; }
    
    .contact-info {
      font-size: 10pt;
      color: #555;
      display: flex;
      justify-content: ${headerAlign === 'center' ? 'center' : 'flex-start'};
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .section { margin-bottom: 15px; }
    .entry { margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; font-weight: bold; }
    .entry-subheader { font-style: italic; color: #555; }
    
    .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { 
        background: #f0f4f8; padding: 2px 8px; border-radius: 4px; font-size: 9pt; 
        border: 1px solid #dae1e7;
    }

    @media print {
      body { background: white; }
      .page { margin: 0; box-shadow: none; width: 100%; padding: 0; }
      @page { size: A4; margin: 15mm 20mm; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <h1>${personal?.name || ''}</h1>
      <div class="contact-info">
        ${[personal?.email, personal?.phone, personal?.location, personal?.website, personal?.linkedin].filter(Boolean).join(' | ')}
      </div>
    </header>

    ${summary ? `<section><h2>Summary</h2><p>${summary}</p></section>` : ''}
    
    ${experience.length ? `<section><h2>Experience</h2>${experience.map(e => `
        <div class="entry">
            <div class="entry-header"><span>${e.title}</span><span>${e.startDate} - ${e.endDate || 'Present'}</span></div>
            <div class="entry-subheader">${e.company}</div>
            <p>${e.description || ''}</p>
        </div>`).join('')}</section>` : ''}

    ${education.length ? `<section><h2>Education</h2>${education.map(e => `
        <div class="entry">
            <div class="entry-header"><span>${e.school}</span><span>${e.startDate} - ${e.endDate || 'Present'}</span></div>
            <div class="entry-subheader">${e.degree}</div>
        </div>`).join('')}</section>` : ''}

    ${projects.length ? `<section><h2>Projects</h2>${projects.map(p => `
        <div class="entry">
            <div class="entry-header"><span>${p.name}</span><span>${p.startDate} - ${p.endDate}</span></div>
            ${p.role ? `<div class="entry-subheader">${p.role}</div>` : ''}
            <p>${p.description}</p>
            ${p.technologies?.length ? `<p><strong>Technologies:</strong> ${p.technologies.join(', ')}</p>` : ''}
             ${p.bullets?.length ? `<ul>${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>`).join('')}</section>` : ''}
    
     ${allSkills.length ? `<section><h2>Skills</h2><div class="skills-list">${allSkills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div></section>` : ''}
  </div>
</body>
</html>`;
};

export const generateLaTeX = (resumeData: ResumeData, template: string = 'minimal'): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [] } = resumeData;
  const t = template.toLowerCase();

  // LaTeX Config
  let fontPackage = "\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}";
  let headerStyle = "\\begin{center}";
  let headerEnd = "\\end{center}";
  let sectionColor = "";

  if (t === 'modern') {
    fontPackage += "\n\\usepackage{lmodern}\n\\renewcommand{\\familydefault}{\\sfdefault}"; // Sans serif
    sectionColor = "\\color{blue}"; // Requires xcolor
  } else if (t === 'creative') {
    fontPackage += "\n\\usepackage{charter}"; // Serif style
    sectionColor = "\\color{violet}";
  } else if (t === 'classic') {
    fontPackage += "\n\\usepackage{times}";
  }

  // Minimal defaults to standard article font (Computer Modern)

  return `\\documentclass[11pt,a4paper]{article}
${fontPackage}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\geometry{margin=1in}

\\begin{document}

${headerStyle}
{\\Huge \\textbf{${escapeLatex(personal?.name || 'Resume')}}}\\\\
\\vspace{0.2cm}
${[personal?.email, personal?.phone, personal?.location].filter((s): s is string => !!s).map(s => escapeLatex(s)).join(' $\\mid$ ')}
${headerEnd}

${summary ? `\\section*{Summary}\n${escapeLatex(summary)}\n` : ''}

${experience.length ? `\\section*{Experience}\n${experience.map(exp => `
\\noindent \\textbf{${escapeLatex(exp.title)}} \\hfill ${escapeLatex(exp.startDate)} - ${escapeLatex(exp.endDate || 'Present')}\\\\
\\textit{${escapeLatex(exp.company)}}\\\\
${escapeLatex(exp.description || '')}\\vspace{0.2cm}
`).join('\n')}` : ''}

${education.length ? `\\section*{Education}\n${education.map(edu => `
\\noindent \\textbf{${escapeLatex(edu.degree)}} \\hfill ${escapeLatex(edu.startDate)} - ${escapeLatex(edu.endDate || 'Present')}\\\\
\\textit{${escapeLatex(edu.school)}}\\vspace{0.2cm}
`).join('\n')}` : ''}

${projects.length ? `\\section*{Projects}\n${projects.map(proj => `
\\noindent \\textbf{${escapeLatex(proj.name)}} \\hfill ${escapeLatex(proj.startDate)} - ${escapeLatex(proj.endDate)}\\\\
${escapeLatex(proj.description || '')}\\\\
${proj.technologies?.length ? `\\textbf{Technologies:} ${escapeLatex(proj.technologies.join(', '))}` : ''}
${proj.bullets ? `\\begin{itemize}${proj.bullets.map(b => `\\item ${escapeLatex(b)}`).join('')}\\end{itemize}` : ''}
\\vspace{0.2cm}
`).join('\n')}` : ''}

\\end{document}`;
};

export const generateMarkdown = (resumeData: ResumeData): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [] } = resumeData;

  let md = `# ${personal?.name || 'Resume'}\n\n`;
  const contact = [personal?.email, personal?.phone, personal?.location, personal?.website, personal?.linkedin].filter(Boolean).join(' | ');
  md += `${contact}\n\n`;

  if (summary) {
    md += `## Summary\n\n${summary}\n\n`;
  }

  if (experience.length > 0) {
    md += `## Experience\n\n`;
    experience.forEach(exp => {
      md += `### ${exp.title}\n`;
      md += `**${exp.company}** | ${exp.startDate} - ${exp.endDate || 'Present'}\n\n`;
      if (exp.description) md += `${exp.description}\n\n`;
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(b => md += `- ${b}\n`);
        md += '\n';
      }
    });
  }

  if (education.length > 0) {
    md += `## Education\n\n`;
    education.forEach(edu => {
      md += `### ${edu.school}\n`;
      md += `**${edu.degree}** | ${edu.startDate} - ${edu.endDate || 'Present'}\n\n`;
      if (edu.description) md += `${edu.description}\n\n`;
    });
  }

  if (skills) {
    const allSkills = Array.isArray(skills)
      ? skills.flatMap(cat => cat.items)
      : [...(skills?.languages || []), ...(skills?.frameworks || []), ...(skills?.tools || [])];

    if (allSkills.length > 0) {
      md += `## Skills\n\n${allSkills.join(', ')}\n\n`;
    }
  }

  if (projects.length > 0) {
    md += `## Projects\n\n`;
    projects.forEach(proj => {
      md += `### ${proj.name}\n`;
      md += `${proj.startDate} - ${proj.endDate}\n\n`;
      md += `${proj.description}\n\n`;
      if (proj.technologies && proj.technologies.length > 0) {
        md += `**Technologies:** ${proj.technologies.join(', ')}\n\n`;
      }
      if (proj.bullets && proj.bullets.length > 0) {
        proj.bullets.forEach(b => md += `- ${b}\n`);
        md += '\n';
      }
    });
  }

  return md;
};

export const generatePlainText = (resumeData: ResumeData): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [] } = resumeData;

  let txt = `${personal?.name || 'Resume'}\n`;
  txt += `${'='.repeat((personal?.name || 'Resume').length)}\n\n`;

  const contact = [personal?.email, personal?.phone, personal?.location, personal?.website, personal?.linkedin].filter(Boolean).join(' | ');
  txt += `${contact}\n\n`;

  if (summary) {
    txt += `SUMMARY\n-------\n${summary}\n\n`;
  }

  if (experience.length > 0) {
    txt += `EXPERIENCE\n----------\n`;
    experience.forEach(exp => {
      txt += `${exp.title}\n`;
      txt += `${exp.company} | ${exp.startDate} - ${exp.endDate || 'Present'}\n`;
      if (exp.description) txt += `${exp.description}\n`;
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(b => txt += `• ${b}\n`);
      }
      txt += '\n';
    });
  }

  if (education.length > 0) {
    txt += `EDUCATION\n---------\n`;
    education.forEach(edu => {
      txt += `${edu.school}\n`;
      txt += `${edu.degree} | ${edu.startDate} - ${edu.endDate || 'Present'}\n`;
      if (edu.description) txt += `${edu.description}\n`;
      txt += '\n';
    });
  }

  if (skills) {
    const allSkills = Array.isArray(skills)
      ? skills.flatMap(cat => cat.items)
      : [...(skills?.languages || []), ...(skills?.frameworks || []), ...(skills?.tools || [])];

    if (allSkills.length > 0) {
      txt += `SKILLS\n------\n${allSkills.join(', ')}\n\n`;
    }
  }

  if (projects.length > 0) {
    txt += `PROJECTS\n--------\n`;
    projects.forEach(proj => {
      txt += `${proj.name}\n`;
      txt += `${proj.startDate} - ${proj.endDate}\n`;
      txt += `${proj.description}\n`;
      if (proj.technologies && proj.technologies.length > 0) {
        txt += `Technologies: ${proj.technologies.join(', ')}\n`;
      }
      if (proj.bullets && proj.bullets.length > 0) {
        proj.bullets.forEach(b => txt += `• ${b}\n`);
      }
      txt += '\n';
    });
  }

  return txt;
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
