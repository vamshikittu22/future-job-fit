# 📄 Resume Export System

This directory manages the transformation of `ResumeData` into professional documents (PDF, Word, LaTeX, HTML, and Markdown).

## 🌟 Supported Formats

- **PDF (Formatted)**: High-fidelity, template-based rendering using `jsPDF` and `html2canvas`.
- **PDF (ATS-Friendly)**: A text-only PDF optimized for machine readability.
- **DOCX**: Structured Microsoft Word document generation via `docx.js`.
- **HTML**: A standalone, self-contained web version of your resume.
- **LaTeX**: Professional TEX source for academic or technical users.
- **Markdown & TXT**: Clean text versions for easy copy-pasting or minimalists.
- **JSON**: Portable data format for imports and backups.

## 🛠️ Core Utilities

### `formats.ts`
The central hub for export logic.
- **`generateHTML`**: Generates a thematic HTML string based on the chosen template (Modern, Creative, Classic).
- **`generateLaTeX`**: Maps resume data to LaTeX commands.
- **`generateMarkdown` / `generatePlainText`**: Simple serializers for text-based exports.

### `pdf.ts`
Handles the complexity of client-side PDF generation:
- Uses `generatePdfFromElement` to convert hidden DOM nodes into A4-sized PDF blobs.
- Manages print-specific CSS and DPI scaling.

### `docx.ts`
Builds a word document object model:
- Define sections, styles, and headers.
- Handles bulleted lists and multi-column contact info.

## 🎨 Templates

The system supports a variety of themes:
1. **Modern**: Blue-accented, clean sans-serif layout.
2. **Creative**: Elegant serif typography with colored backgrounds.
3. **Classic**: Traditional, black-and-white serif layout (Times New Roman inspired).
4. **Minimal**: Focused on whitespace and readability.

## 🚀 Usage

To trigger an export from a component:

```tsx
import { exportResume } from '@/shared/lib/export/formats';
import { useResume } from '@/shared/contexts/ResumeContext';

const { resumeData } = useResume();

const handleDownload = async () => {
  const blob = await exportResume('pdf-formatted', resumeData, 'modern');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume.pdf`;
  link.click();
};
```

## 📝 Best Practices
- **Printing**: All templates include `@media print` rules to ensure the web view matches the exported PDF.
- **Validation**: Ensure `resumeData` is valid before calling export functions to avoid broken layouts.
