import { ResumeData, ThemeSettings } from '@/shared/types/resume';
import { generatePdfFromElement } from '@/shared/lib/export/pdf';
import { getTemplateStyle, applyThemeConfig } from '@/shared/templates/templateStyles';

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

  // Get template style from centralized registry
  const baseStyle = getTemplateStyle(template);

  // Convert ThemeSettings to TemplateColors format if exists
  const themeConfig = resumeData.metadata?.themeConfig?.[template.toLowerCase()];
  const themeColors = themeConfig ? {
    primary: themeConfig.primaryColor?.replace('#', ''),
    title: themeConfig.titleColor?.replace('#', ''),
    heading: themeConfig.headingsColor?.replace('#', ''),
    subheading: themeConfig.subheadingsColor?.replace('#', ''),
    link: themeConfig.linksColor?.replace('#', ''),
  } : undefined;

  // Apply any theme customizations
  const finalStyle = applyThemeConfig(baseStyle, themeColors);

  // Extract values for HTML  
  const fontFamily = finalStyle.fonts.body;
  const headingColor = `#${finalStyle.colors.heading}`;
  const primaryColor = `#${finalStyle.colors.primary}`;
  const titleColor = `#${finalStyle.colors.title}`;
  const subheadingColor = `#${finalStyle.colors.subheading}`;
  const bodyColor = `#${finalStyle.colors.body}`;
  const mutedColor = `#${finalStyle.colors.muted}`;
  const linksColor = `#${finalStyle.colors.link}`;
  const borderColor = finalStyle.colors.border ? `#${finalStyle.colors.border}` : headingColor;

  const headerAlign = finalStyle.layout.headerAlign;
  const showBorders = finalStyle.layout.showBorders;
  const titleSize = finalStyle.sizes.titleSize;
  const headingSize = finalStyle.sizes.headingSize;
  const bodySize = finalStyle.sizes.bodySize;
  const smallSize = finalStyle.sizes.smallSize;
  const subheadingSize = finalStyle.sizes.subheadingSize;

  // Build template-specific styles
  const pageBg = '#ffffff';
  const headerWrapperStyles = showBorders
    ? `border-bottom: ${finalStyle.layout.borderThickness || 2}px solid ${borderColor}; padding-bottom: 24px; margin-bottom: 32px;`
    : 'padding-bottom: 24px; margin-bottom: 24px;';

  const sectionTitleStyles = showBorders
    ? `font-size: ${headingSize}pt; border-bottom: 1px solid ${borderColor}; padding-bottom: 8px; text-transform: uppercase;`
    : `font-size: ${headingSize}pt; text-transform: uppercase; letter-spacing: 0.1em;`;

  const nameStyles = `font-size: ${titleSize}pt; font-weight: 700; color: ${titleColor}; line-height: 1.1;`;
  const subtitleStyles = `font-size: ${subheadingSize}pt; font-weight: 500; color: ${subheadingColor}; margin-bottom: 10px;`;
  const itemTitleColor = titleColor;
  const itemDateColor = primaryColor;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${personal?.name || 'Resume'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400&family=Roboto:wght@400;700&family=Outfit:wght@400;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --primary: ${primaryColor};
      --title: ${titleColor};
      --heading: ${headingColor};
      --subheading: ${subheadingColor};
      --body: ${bodyColor};
      --muted: ${mutedColor};
      --border: ${borderColor};
    }

    body { 
      font-family: ${fontFamily}, -apple-system, sans-serif; 
      line-height: ${finalStyle.layout.lineHeight}; 
      color: var(--body); 
      background-color: #f3f4f6; 
      padding: 40px 0; 
      -webkit-font-smoothing: antialiased; 
    }

    .page { 
      background-color: ${pageBg}; 
      width: 210mm; 
      min-height: 297mm; 
      margin: 0 auto; 
      padding: 20mm; 
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); 
      position: relative;
    }

    header { text-align: ${headerAlign}; ${headerWrapperStyles} }
    h1 { ${nameStyles} margin-bottom: 4px; }
    .subtitle { ${subtitleStyles} }
    
    .contact { 
      display: flex; 
      justify-content: ${headerAlign === 'center' ? 'center' : headerAlign === 'left' ? 'flex-start' : 'flex-end'}; 
      flex-wrap: wrap; 
      gap: 16px; 
      font-size: ${smallSize}pt; 
      color: var(--muted); 
      margin-top: 8px;
    }

    section { margin-bottom: ${finalStyle.layout.sectionSpacing}pt; }
    
    h2 { 
      ${sectionTitleStyles} 
      color: var(--heading); 
      font-weight: 700; 
      margin-top: 24px; 
      margin-bottom: 16px; 
      display: flex; 
      align-items: center; 
      page-break-after: avoid;
    }
    
    ${!showBorders ? 'h2::after { content: ""; flex: 1; height: 1px; background: #e5e7eb; margin-left: 16px; }' : ''}

    .entry { margin-bottom: ${finalStyle.layout.itemSpacing}pt; page-break-inside: avoid; }
    
    .entry-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: baseline; 
      font-weight: 700; 
      color: ${itemTitleColor}; 
      font-size: ${bodySize}pt; 
    }
    
    .entry-sub { 
      font-size: ${subheadingSize}pt; 
      font-weight: 600; 
      color: var(--subheading); 
      margin-bottom: 2px; 
    }
    
    .entry-meta {
      font-size: ${smallSize}pt;
      color: var(--muted);
      font-style: italic;
      margin-bottom: 4px;
    }

    .entry-desc { 
      font-size: ${bodySize}pt; 
      color: var(--body); 
      text-align: ${finalStyle.layout.bodyAlign}; 
      margin-top: 4px; 
    }

    ul { padding-left: 20px; margin-top: 6px; list-style-type: disc; }
    li { margin-bottom: 4px; color: var(--body); font-size: ${bodySize}pt; }

    .tag-container { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 6px; 
      margin-top: 8px; 
    }
    
    .tag { 
      background: #f8fafc; 
      color: var(--body); 
      padding: 2px 10px; 
      border-radius: 6px; 
      font-size: ${smallSize}pt; 
      border: 1px solid #e2e8f0; 
      font-weight: 500;
    }

    a { color: ${linksColor}; text-decoration: none; }
    a:hover { text-decoration: underline; }

    @media print { 
      body { background: white; padding: 0; } 
      .page { box-shadow: none; margin: 0; width: 100%; border: none; padding: 15mm; } 
      @page { size: A4; margin: 0; }
      h2 { break-after: avoid; }
      .entry { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <h1>${personal?.name || ''}</h1>
      ${personal?.title ? `<div class="subtitle">${personal.title}</div>` : ''}
      <div class="contact">
        ${[
      personal?.email ? `<span>${personal.email}</span>` : '',
      personal?.phone ? `<span>${personal.phone}</span>` : '',
      personal?.location ? `<span>${personal.location}</span>` : '',
      personal?.website ? `<a href="${personal.website}">${personal.website.replace(/^https?:\/\//, '')}</a>` : '',
      personal?.linkedin ? `<a href="${personal.linkedin}">LinkedIn</a>` : '',
      personal?.github ? `<a href="${personal.github}">GitHub</a>` : ''
    ].filter(Boolean).join(' <span style="color: #cbd5e1;">|</span> ')}
      </div>
    </header>

    ${summary ? `<section><h2>Summary</h2><div class="entry-desc">${summary}</div></section>` : ''}

    ${experience.length ? `<section><h2>Experience</h2>${experience.map(e => `
      <div class="entry">
        <div class="entry-header">
          <span>${e.title}</span>
          <span style="color: ${itemDateColor};">${e.startDate} — ${e.endDate || 'Present'}</span>
        </div>
        <div class="entry-sub">${e.company}</div>
        ${e.location ? `<div class="entry-meta">${e.location}</div>` : ''}
        <div class="entry-desc">
          ${e.description ? `<p>${e.description}</p>` : ''}
          ${e.bullets?.length ? `<ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
      </div>`).join('')}</section>` : ''}

    ${education.length ? `<section><h2>Education</h2>${education.map(e => `
      <div class="entry">
        <div class="entry-header">
          <span>${e.school}</span>
          <span style="color: ${itemDateColor};">${e.startDate} — ${e.endDate || 'Present'}</span>
        </div>
        <div class="entry-sub">${e.degree}${e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</div>
        ${e.description ? `<div class="entry-desc">${e.description}</div>` : ''}
      </div>`).join('')}</section>` : ''}

    ${projects.length ? `<section><h2>Projects</h2>${projects.map(p => `
      <div class="entry">
        <div class="entry-header">
          <span>${p.name}</span>
          <span style="color: ${itemDateColor};">${p.startDate || ''} — ${p.endDate || ''}</span>
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
          <span style="color: ${itemDateColor};">${a.date || ''}</span>
        </div>
        ${a.issuer ? `<div class="entry-sub">${a.issuer}</div>` : ''}
        <div class="entry-desc">${a.description}</div>
      </div>`).join('')}</section>` : ''}

    ${certifications.length ? `<section><h2>Certifications</h2>${certifications.map(c => `
      <div class="entry">
        <div class="entry-header">
          <span>${c.name}</span>
          <span style="color: ${itemDateColor};">${c.date || ''}</span>
        </div>
        <div class="entry-sub">${c.issuer}</div>
        ${c.credentialUrl ? `<div class="entry-desc"><a href="${c.credentialUrl}">View Credential</a></div>` : ''}
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

  // Get template style from centralized registry
  const baseStyle = getTemplateStyle(template);

  // Convert ThemeSettings to TemplateColors format if exists
  const themeConfig = resumeData.metadata?.themeConfig?.[template.toLowerCase()];
  const themeColors = themeConfig ? {
    primary: themeConfig.primaryColor?.replace('#', ''),
    title: themeConfig.titleColor?.replace('#', ''),
    heading: themeConfig.headingsColor?.replace('#', ''),
    subheading: themeConfig.subheadingsColor?.replace('#', ''),
    link: themeConfig.linksColor?.replace('#', ''),
  } : undefined;

  // Apply any theme customizations
  const finalStyle = applyThemeConfig(baseStyle, themeColors);

  // Extract colors for LaTeX (already without # prefix)
  const colors = {
    primary: finalStyle.colors.primary,
    title: finalStyle.colors.title,
    headings: finalStyle.colors.heading,
    subheadings: finalStyle.colors.subheading,
    links: finalStyle.colors.link,
  };

  // Map font to LaTeX package
  const fontPackages = [
    "\\usepackage[utf8]{inputenc}",
    "\\usepackage[T1]{fontenc}"
  ];

  const fontBody = finalStyle.fonts.body.toLowerCase();
  if (fontBody.includes('times')) {
    fontPackages.push("\\usepackage{times}");
  } else if (fontBody.includes('georgia') || fontBody.includes('charter')) {
    fontPackages.push("\\usepackage{charter}");
  } else if (fontBody.includes('roboto')) {
    fontPackages.push("\\usepackage[sfdefault]{roboto}");
  } else {
    fontPackages.push("\\usepackage{lmodern}");
    fontPackages.push("\\renewcommand{\\familydefault}{\\sfdefault}");
  }

  const headerAlign = finalStyle.layout.headerAlign === 'left' ? "flushleft" : "center";

  return `\\documentclass[10pt,a4paper]{article}
${fontPackages.join('\n')}
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
