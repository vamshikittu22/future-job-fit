import { ResumeData, ThemeSettings } from '@/shared/types/resume';
import { generatePdfFromElement } from '@/shared/lib/export/pdf';

const escapeLatex = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

export const exportFormats = {
  'pdf-formatted': { name: 'PDF (Formatted)', extension: '.pdf', description: 'Beautiful formatted PDF' },
  'pdf-ats': { name: 'PDF (ATS-Friendly)', extension: '.pdf', description: 'Plain text PDF optimized for ATS' },
  'docx': { name: 'Word Document', extension: '.docx', description: 'Editable Word format' },
  'html': { name: 'HTML', extension: '.html', description: 'Standalone HTML file' },
  'latex': { name: 'LaTeX', extension: '.tex', description: 'LaTeX source' },
  'markdown': { name: 'Markdown', extension: '.md', description: 'Markdown format' },
  'txt': { name: 'Plain Text', extension: '.txt', description: 'Simple text format' },
  'json': { name: 'JSON Data', extension: '.json', description: 'Raw data for import' },
};

export const generateHTML = (resumeData: ResumeData, template: string = 'modern'): string => {
  const {
    personal, summary, experience = [], education = [],
    skills, projects = [], achievements = [], certifications = [],
    customSections = []
  } = resumeData;

  const allSkills = Array.isArray(skills)
    ? skills.flatMap(cat => cat.items)
    : [...(skills?.languages || []), ...(skills?.frameworks || []), ...(skills?.tools || [])];

  const t = template.toLowerCase();

  let fontFamily = "'Inter', -apple-system, sans-serif";
  let headingColor = "#111827";
  let primaryColor = "#111827";
  let headerAlign = "center";
  let headerWrapperStyles = "padding-bottom: 24px; border-bottom: 1px solid #f3f4f6;";
  let sectionTitleStyles = "font-size: 9pt; text-transform: uppercase; letter-spacing: 0.15em; border: none;";
  let pageBg = "#ffffff";
  let bodyColor = "#374151";
  let nameStyles = "font-size: 24pt; font-weight: 800; letter-spacing: -0.025em;";
  let subtitleStyles = "font-size: 12pt; font-weight: 500; color: #6b7280; margin-bottom: 5px;";
  let itemTitleColor = "#111827";
  let itemDateColor = "#6b7280";

  // Override with user customization if available
  const themeConfig = resumeData.metadata?.themeConfig?.[t];

  if (themeConfig) {
    if (themeConfig.primaryColor) primaryColor = themeConfig.primaryColor;
    if (themeConfig.fontFamily) fontFamily = themeConfig.fontFamily;
    if (themeConfig.titleColor) headingColor = themeConfig.titleColor;
  }

  if (t === 'modern') {
    fontFamily = themeConfig?.fontFamily || "'Inter', sans-serif";
    headingColor = themeConfig?.titleColor || "#1e3a8a";
    primaryColor = themeConfig?.primaryColor || "#2563eb";
    headerAlign = "left";
    headerWrapperStyles = `border-bottom: 4px solid ${primaryColor}; padding-bottom: 16px; margin-bottom: 32px;`;
    sectionTitleStyles = `font-size: 14pt; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; text-transform: uppercase; letter-spacing: normal; color: ${themeConfig?.headingsColor || primaryColor};`;
    nameStyles = `font-size: 32pt; font-weight: 700; color: ${themeConfig?.titleColor || headingColor}; letter-spacing: -0.05em;`;
    subtitleStyles = `font-size: 16pt; font-weight: 500; color: ${themeConfig?.subheadingsColor || primaryColor}; margin-bottom: 10px;`;
    itemTitleColor = themeConfig?.titleColor || headingColor;
    itemDateColor = themeConfig?.primaryColor || primaryColor;
  } else if (t === 'creative') {
    fontFamily = themeConfig?.fontFamily || "'Georgia', serif";
    headingColor = themeConfig?.titleColor || "#4c1d95";
    primaryColor = themeConfig?.primaryColor || "#7c3aed";
    headerAlign = "center";
    headerWrapperStyles = `background: ${primaryColor}10; margin: -20mm -20mm 32px -20mm; padding: 32px 20mm;`;
    sectionTitleStyles = `font-size: 11pt; border-bottom: 1px solid ${primaryColor}20; padding-bottom: 8px; margin: 32px 48px 16px 48px; text-transform: none; color: ${themeConfig?.headingsColor || primaryColor};`;
    pageBg = "#fafaf9";
    nameStyles = `font-size: 28pt; font-weight: 700; color: ${themeConfig?.titleColor || headingColor};`;
    subtitleStyles = `font-size: 12pt; font-style: italic; color: ${themeConfig?.subheadingsColor || primaryColor};`;
    itemDateColor = themeConfig?.primaryColor || primaryColor;
    itemTitleColor = themeConfig?.titleColor || headingColor;
  } else if (t === 'classic') {
    fontFamily = themeConfig?.fontFamily || "'Times New Roman', Times, serif";
    headingColor = themeConfig?.titleColor || "#000000";
    primaryColor = themeConfig?.primaryColor || "#000000";
    headerAlign = "center";
    headerWrapperStyles = `border-bottom: 2px solid ${themeConfig?.titleColor || headingColor}; padding-bottom: 16px; margin-bottom: 24px;`;
    sectionTitleStyles = `font-size: 11pt; border-bottom: 1px solid ${themeConfig?.headingsColor || headingColor}; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; justify-content: center; color: ${themeConfig?.headingsColor || headingColor};`;
    nameStyles = `font-size: 22pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: ${themeConfig?.titleColor || headingColor};`;
    subtitleStyles = `font-size: 12pt; font-style: italic; color: ${themeConfig?.subheadingsColor || primaryColor};`;
    itemTitleColor = themeConfig?.titleColor || headingColor;
    itemDateColor = themeConfig?.primaryColor || primaryColor;
    bodyColor = "#000000";
  }

  const linksColor = themeConfig?.linksColor || primaryColor;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${personal?.name || 'Resume'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${fontFamily}; line-height: 1.5; color: ${bodyColor}; background-color: #f3f4f6; padding: 40px 0; -webkit-font-smoothing: antialiased; }
    .page { background-color: ${pageBg}; width: 210mm; min-height: 297mm; margin: 0 auto; padding: 20mm; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
    header { text-align: ${headerAlign}; ${headerWrapperStyles} }
    h1 { ${nameStyles} color: ${headingColor}; margin-bottom: 4px; }
    .subtitle { ${subtitleStyles} }
    .contact { display: flex; justify-content: ${headerAlign === 'center' ? 'center' : 'flex-start'}; flex-wrap: wrap; gap: 12px; font-size: 9pt; color: #6b7280; }
    h2 { ${sectionTitleStyles} color: ${headingColor}; font-weight: 700; margin-top: 24px; margin-bottom: 16px; display: flex; align-items: center; }
    ${t !== 'modern' && t !== 'classic' ? 'h2::after { content: ""; flex: 1; height: 1px; background: #e5e7eb; margin-left: 16px; }' : ''}
    .entry { margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; font-weight: 700; color: ${itemTitleColor}; font-size: 10pt; }
    .entry-sub { font-style: italic; color: #4b5563; font-size: 9pt; margin-bottom: 2px; }
    .entry-desc { font-size: 9pt; color: #4b5563; text-align: justify; margin-top: 4px; }
    ul { padding-left: 16px; margin-top: 4px; }
    li { margin-bottom: 2px; color: #4b5563; }
    .tag-container { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
    .tag { background: #f3f4f6; color: #374151; padding: 1px 6px; border-radius: 4px; font-size: 8pt; border: 1px solid #e5e7eb; }
    a { color: ${linksColor}; text-decoration: none; }
    @media print { body { background: white; padding: 0; } .page { box-shadow: none; margin: 0; width: 100%; border: none; } @page { size: A4; margin: 15mm; } }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <h1>${personal?.name || ''}</h1>
      ${personal?.title ? `<div class="subtitle">${personal.title}</div>` : ''}
      <div class="contact">
        ${[personal?.email, personal?.phone, personal?.location, personal?.website, personal?.linkedin, personal?.github].filter(Boolean).join(' | ')}
      </div>
    </header>

    ${summary ? `<section><h2>Summary</h2><p class="entry-desc">${summary}</p></section>` : ''}

    ${experience.length ? `<section><h2>Experience</h2>${experience.map(e => `
      <div class="entry">
        <div class="entry-header">
          <span>${e.title}</span>
          <span style="font-size: 8pt; color: ${itemDateColor}; font-weight: 600;">${e.startDate} — ${e.endDate || 'Present'}</span>
        </div>
        <div class="entry-sub">${e.company}${e.location ? `, ${e.location}` : ''}</div>
        <div class="entry-desc">
          ${e.description ? `<p>${e.description}</p>` : ''}
          ${e.bullets?.length ? `<ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
      </div>`).join('')}</section>` : ''}

    ${education.length ? `<section><h2>Education</h2>${education.map(e => `
      <div class="entry">
        <div class="entry-header">
          <span>${e.school}</span>
          <span style="font-size: 8pt; color: ${itemDateColor}; font-weight: 600;">${e.startDate} — ${e.endDate || 'Present'}</span>
        </div>
        <div class="entry-sub">${e.degree}${e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</div>
        ${e.description ? `<div class="entry-desc">${e.description}</div>` : ''}
      </div>`).join('')}</section>` : ''}

    ${projects.length ? `<section><h2>Projects</h2>${projects.map(p => `
      <div class="entry">
        <div class="entry-header">
          <span>${p.name}</span>
          <span style="font-size: 8pt; color: ${itemDateColor}; font-weight: 600;">${p.startDate || ''} — ${p.endDate || ''}</span>
        </div>
        ${p.role ? `<div class="entry-sub">${p.role}</div>` : ''}
        <div class="entry-desc">
          <p>${p.description}</p>
          ${p.technologies?.length ? `<div class="tag-container">${p.technologies.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
        </div>
      </div>`).join('')}</section>` : ''}

    ${allSkills.length ? `<section><h2>Skills</h2><div class="tag-container">${allSkills.map(s => `<span class="tag">${s}</span>`).join('')}</div></section>` : ''}

    ${achievements.length ? `<section><h2>Achievements</h2>${achievements.map(a => `
      <div class="entry">
        <div class="entry-header">
          <span>${a.title}</span>
          <span style="font-size: 8pt; color: ${itemDateColor}; font-weight: 600;">${a.date || ''}</span>
        </div>
        ${a.issuer ? `<div class="entry-sub">${a.issuer}</div>` : ''}
        <div class="entry-desc">${a.description}</div>
      </div>`).join('')}</section>` : ''}

    ${certifications.length ? `<section><h2>Certifications</h2>${certifications.map(c => `
      <div class="entry">
        <div class="entry-header">
          <span>${c.name}</span>
          <span style="font-size: 8pt; color: ${itemDateColor}; font-weight: 600;">${c.date || ''}</span>
        </div>
        <div class="entry-sub">${c.issuer}</div>
        ${c.credentialUrl ? `<div class="entry-desc"><a href="${c.credentialUrl}" style="color: ${linksColor}; text-decoration: none;">View Credential</a></div>` : ''}
      </div>`).join('')}</section>` : ''}

    ${customSections.map(cs => cs.entries?.length ? `
      <section>
        <h2>${cs.title}</h2>
        ${cs.entries.map(entry => `
          <div class="entry">
            <div class="entry-header">
              <span>${String(entry.values[cs.fields[0].id] || '')}</span>
            </div>
            ${cs.fields.slice(1).map(f => entry.values[f.id] ? `
              <div class="entry-desc"><strong>${f.name}:</strong> ${Array.isArray(entry.values[f.id]) ? (entry.values[f.id] as string[]).join(', ') : String(entry.values[f.id])}</div>
            ` : '').join('')}
          </div>
        `).join('')}
      </section>
    ` : '').join('')}
  </div>
</body>
</html>`;
};

export const generateLaTeX = (resumeData: ResumeData, template: string = 'modern'): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [], achievements = [], certifications = [], customSections = [] } = resumeData;
  const t = template.toLowerCase();
  const themeConfig = resumeData.metadata?.themeConfig?.[t];

  const colors = {
    primary: (themeConfig?.primaryColor || (t === 'modern' ? '#2563eb' : t === 'creative' ? '#7c3aed' : '#000000')).replace('#', ''),
    title: (themeConfig?.titleColor || (t === 'modern' ? '#1e3a8a' : t === 'creative' ? '#4c1d95' : '#000000')).replace('#', ''),
    headings: (themeConfig?.headingsColor || (t === 'modern' ? '#1e3a8a' : t === 'creative' ? '#4c1d95' : '#000000')).replace('#', ''),
    subheadings: (themeConfig?.subheadingsColor || (t === 'modern' ? '#2563eb' : t === 'creative' ? '#7c3aed' : '#000000')).replace('#', ''),
    links: (themeConfig?.linksColor || (t === 'modern' ? '#2563eb' : t === 'creative' ? '#7c3aed' : '#2563eb')).replace('#', ''),
  };

  let fontPackage = "\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}";
  const fontMap: Record<string, string> = {
    "'Inter', sans-serif": "\\usepackage[sfdefault]{inter}",
    "'Times New Roman', Times, serif": "\\usepackage{times}",
    "'Georgia', serif": "\\usepackage{charter}",
    "'Roboto', sans-serif": "\\usepackage[sfdefault]{roboto}",
    "'Outfit', sans-serif": "\\usepackage[sfdefault]{helvet}"
  };

  if (themeConfig?.fontFamily && fontMap[themeConfig.fontFamily]) {
    fontPackage += "\n" + fontMap[themeConfig.fontFamily];
  } else {
    if (t === 'modern') {
      fontPackage += "\n\\usepackage{lmodern}\n\\renewcommand{\\familydefault}{\\sfdefault}";
    } else if (t === 'creative') {
      fontPackage += "\n\\usepackage{charter}";
    } else if (t === 'classic') {
      fontPackage += "\n\\usepackage{times}";
    }
  }

  const headerAlign = t === 'modern' ? "flushleft" : "center";

  return `\\documentclass[10pt,a4paper]{article}
${fontPackage}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\geometry{margin=0.6in}
\\definecolor{primary}{HTML}{${colors.primary}}
\\definecolor{title}{HTML}{${colors.title}}
\\definecolor{headings}{HTML}{${colors.headings}}
\\definecolor{subheadings}{HTML}{${colors.subheadings}}
\\definecolor{links}{HTML}{${colors.links}}

\\titleformat{\\section}{\\bfseries\\large\\uppercase\\color{headings}}{}{0em}{}[{\\color{headings}\\titlerule}]

\\begin{document}
\\begin{${headerAlign}}
{\\Huge \\textbf{\\color{title}${escapeLatex(personal?.name || 'Resume')}}}\\\\
\\vspace{0.1cm}
{\\large \\color{subheadings} ${escapeLatex(personal?.title || '')}}\\\\
\\vspace{0.2cm}
${[personal?.email, personal?.phone, personal?.location, personal?.website, personal?.linkedin, personal?.github].filter((s): s is string => !!s).map(s => escapeLatex(s)).join(' $\\mid$ ')}
\\end{${headerAlign}}

${summary ? `\\section*{Summary}\n${escapeLatex(summary)}\n` : ''}

${experience.length ? `\\section*{Experience}\n${experience.map(exp => `\\noindent \\textbf{\\color{title}${escapeLatex(exp.title)}} \\hfill \\small{\\color{primary}${escapeLatex(exp.startDate)} — ${escapeLatex(exp.endDate || 'Present')}}}\\\\ \\textit{\\color{subheadings}${escapeLatex(exp.company)}}\\\\ ${escapeLatex(exp.description || '')}${exp.bullets?.length ? `\\begin{itemize}[itemsep=0pt,topsep=2pt]\\item ${exp.bullets.map(b => escapeLatex(b)).join('\\item ')}\\end{itemize}` : ''}\\vspace{0.3cm}`).join('\n')}` : ''}

${education.length ? `\\section*{Education}\n${education.map(edu => `\\noindent \\textbf{\\color{title}${escapeLatex(edu.school)}} \\hfill \\small{\\color{primary}${escapeLatex(edu.startDate)} — ${escapeLatex(edu.endDate || 'Present')}}}\\\\ \\textit{\\color{subheadings}${escapeLatex(edu.degree)}}\\\\ ${escapeLatex(edu.description || '')}\\vspace{0.3cm}`).join('\n')}` : ''}

${projects.length ? `\\section*{Projects}\n${projects.map(p => `\\noindent \\textbf{\\color{title}${escapeLatex(p.name)}} \\hfill \\small{\\color{primary}${escapeLatex(p.startDate || '')} — ${escapeLatex(p.endDate || '')}}}\\\\ ${escapeLatex(p.description || '')}\\vspace{0.3cm}`).join('\n')}` : ''}

${achievements.length ? `\\section*{Achievements}\n${achievements.map(a => `\\noindent \\textbf{\\color{title}${escapeLatex(a.title)}} \\hfill \\small{\\color{primary}${escapeLatex(a.date || '')}}}\\\\ ${escapeLatex(a.description || '')}\\vspace{0.3cm}`).join('\n')}` : ''}

${certifications.length ? `\\section*{Certifications}\n${certifications.map(c => `\\noindent \\textbf{\\color{title}${escapeLatex(c.name)}} \\hfill \\small{\\color{primary}${escapeLatex(c.date || '')}}}\\\\ \\textit{\\color{subheadings}${escapeLatex(c.issuer)}}\\vspace{0.3cm}`).join('\n')}` : ''}

${customSections.map(cs => cs.entries?.length ? `\\section*{${escapeLatex(cs.title)}}\n${cs.entries.map(e => `\\noindent \\textbf{${escapeLatex(String(e.values[cs.fields[0].id] || ''))}}\\\\ ${cs.fields.slice(1).map(f => e.values[f.id] ? `\\textbf{${escapeLatex(f.name)}:} ${escapeLatex(Array.isArray(e.values[f.id]) ? (e.values[f.id] as string[]).join(', ') : String(e.values[f.id]))}\\\\ ` : '').join('')}\\vspace{0.3cm}`).join('\n')}` : '').join('')}

\\end{document}`;
};

export const generateMarkdown = (resumeData: ResumeData): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [], achievements = [], certifications = [], customSections = [] } = resumeData;
  let md = `# ${personal?.name || 'Resume'}\n\n${[personal?.email, personal?.phone, personal?.location, personal?.website, personal?.linkedin, personal?.github].filter(Boolean).join(' | ')}\n\n`;
  if (summary) md += `## Summary\n\n${summary}\n\n`;
  if (experience.length) { md += `## Experience\n\n`; experience.forEach(e => md += `### ${e.title} at ${e.company}\n${e.startDate} - ${e.endDate || 'Present'}\n\n${e.description || ''}\n\n`); }
  if (education.length) { md += `## Education\n\n`; education.forEach(e => md += `### ${e.school}\n${e.degree} | ${e.startDate} - ${e.endDate || 'Present'}\n\n${e.description || ''}\n\n`); }
  if (projects.length) { md += `## Projects\n\n`; projects.forEach(p => md += `### ${p.name}\n${p.startDate} - ${p.endDate || ''}\n\n${p.description}\n\n`); }
  if (achievements.length) { md += `## Achievements\n\n`; achievements.forEach(a => md += `### ${a.title}\n${a.date || ''}\n\n${a.description}\n\n`); }
  if (certifications.length) { md += `## Certifications\n\n`; certifications.forEach(c => md += `### ${c.name}\n${c.issuer} | ${c.date || ''}\n\n`); }
  customSections.forEach(cs => { if (cs.entries?.length) { md += `## ${cs.title}\n\n`; cs.entries.forEach(e => { md += `### ${String(e.values[cs.fields[0].id] || '')}\n`; cs.fields.slice(1).forEach(f => { if (e.values[f.id]) md += `**${f.name}:** ${Array.isArray(e.values[f.id]) ? (e.values[f.id] as string[]).join(', ') : String(e.values[f.id])}\n`; }); md += '\n'; }); } });
  return md;
};

export const generatePlainText = (resumeData: ResumeData): string => {
  const { personal, summary, experience = [], education = [], skills, projects = [], achievements = [], certifications = [], customSections = [] } = resumeData;
  let txt = `${personal?.name || 'Resume'}\n${'='.repeat((personal?.name || 'Resume').length)}\n\n`;
  txt += `${[personal?.email, personal?.phone, personal?.location, personal?.website, personal?.linkedin, personal?.github].filter(Boolean).join(' | ')}\n\n`;
  if (summary) txt += `SUMMARY\n-------\n${summary}\n\n`;
  if (experience.length) { txt += `EXPERIENCE\n----------\n`; experience.forEach(e => txt += `${e.title}\n${e.company} | ${e.startDate} - ${e.endDate || 'Present'}\n${e.description || ''}\n\n`); }
  if (education.length) { txt += `EDUCATION\n---------\n`; education.forEach(e => txt += `${e.school}\n${e.degree} | ${e.startDate} - ${e.endDate || 'Present'}\n${e.description || ''}\n\n`); }
  if (projects.length) { txt += `PROJECTS\n--------\n`; projects.forEach(p => txt += `${p.name}\n${p.startDate} - ${p.endDate || ''}\n${p.description}\n\n`); }
  if (achievements.length) { txt += `ACHIEVEMENTS\n------------\n`; achievements.forEach(a => txt += `${a.title}\n${a.date || ''}\n${a.description}\n\n`); }
  if (certifications.length) { txt += `CERTIFICATIONS\n--------------\n`; certifications.forEach(c => txt += `${c.name}\n${c.issuer} | ${c.date || ''}\n\n`); }
  customSections.forEach(cs => { if (cs.entries?.length) { txt += `${cs.title.toUpperCase()}\n${'-'.repeat(cs.title.length)}\n`; cs.entries.forEach(e => { txt += `- ${String(e.values[cs.fields[0].id] || '')}\n`; cs.fields.slice(1).forEach(f => { if (e.values[f.id]) txt += `  ${f.name}: ${Array.isArray(e.values[f.id]) ? (e.values[f.id] as string[]).join(', ') : String(e.values[f.id])}\n`; }); txt += '\n'; }); } });
  return txt;
};

export const generateATSPdf = async (resumeData: ResumeData): Promise<Blob> => {
  const text = generatePlainText(resumeData);
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;left:-9999px;font-family:Arial;font-size:12pt;width:210mm;padding:20mm;background:white;';
  div.innerHTML = `<pre style="white-space:pre-wrap;">${text}</pre>`;
  document.body.appendChild(div);
  const blob = await generatePdfFromElement(div);
  document.body.removeChild(div);
  return blob;
};
