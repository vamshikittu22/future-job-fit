# Resume Export System

This directory contains the core functionality for exporting resumes in multiple formats (PDF, Word, and plain text) with consistent styling and structure.

## Features

- **Multiple Export Formats**: Export resumes as PDF, Word (DOCX), or plain text
- **Consistent Styling**: Uniform appearance across all export formats
- **Responsive Design**: Adapts to different content lengths and screen sizes
- **Progress Tracking**: Real-time export progress updates
- **Error Handling**: Comprehensive error handling with user feedback
- **Customizable**: Easy to extend with new formats or custom templates

## Components

### BaseResumeTemplate

The main template component that defines the structure of the resume. It takes formatted resume data and renders it consistently across all export formats.

### Export Utilities

- `exportToPDF`: Generates a PDF version of the resume using jsPDF and html2canvas
- `exportToWord`: Creates a Word document using docx
- `exportToText`: Generates a plain text version of the resume
- `exportResume`: Unified function to handle all export formats

### Data Utilities

- `formatResumeData`: Converts the application's resume data structure into a format suitable for the templates
- `formatDate`: Helper function to format dates consistently

### Hooks

- `useResumeExport`: Custom hook that manages the export process, including loading states and error handling

### Components

- `ExportButton`: A reusable button component with a dropdown menu for selecting export formats

## Usage

### Using the ExportButton Component

The easiest way to add export functionality is to use the `ExportButton` component:

```tsx
import { ExportButton } from '@/components/ExportButton';
import { useResume } from '@/contexts/ResumeContext';
import { formatResumeData } from '@/templates/resumeDataUtils';

function MyComponent() {
  const { resumeData } = useResume();
  const formattedData = formatResumeData(resumeData);
  
  return (
    <ExportButton 
      data={formattedData}
      fileName="my-resume"
      variant="outline"
      size="sm"
      onExportStart={() => console.log('Export started')}
      onExportSuccess={() => console.log('Export successful')}
      onExportError={(error) => console.error('Export failed:', error)}
    />
  );
}
```

### Using the useResumeExport Hook

For more control, you can use the `useResumeExport` hook directly:

```tsx
import { useResumeExport } from '@/hooks/useResumeExport';
import { formatResumeData } from '@/templates/resumeDataUtils';

function MyComponent() {
  const { exportAsPdf, exportAsWord, exportAsText, isExporting } = useResumeExport({
    onSuccess: () => console.log('Export successful'),
    onError: (error) => console.error('Export failed:', error),
  });
  
  const formattedData = formatResumeData(resumeData);
  
  return (
    <div>
      <button 
        onClick={() => exportAsPdf(formattedData, 'my-resume')}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export as PDF'}
      </button>
      
      {/* Other export buttons */}
    </div>
  );
}
```

### Customizing the Template

To customize the resume template, modify the `BaseResumeTemplate` component. The template uses Tailwind CSS for styling, so you can easily adjust the appearance by updating the className props.

## Adding a New Export Format

1. Create a new export function in `exportUtils.ts` following the pattern of the existing ones
2. Update the `ExportFormat` type in `useResumeExport.ts`
3. Add the new format to the `formatIcons` and `formatLabels` objects in `ExportButton.tsx`
4. Update the `handleExport` function in `ExportButton.tsx` to support the new format

## Dependencies

- `jspdf`: For PDF generation
- `html2canvas`: For converting HTML to canvas
- `docx`: For Word document generation
- `file-saver`: For handling file downloads

## Known Issues

- Complex layouts may not render perfectly in all formats
- Some advanced styling features may not be supported in all export formats
- Large documents may take longer to generate and export

## Troubleshooting

### PDF Export Issues
- Ensure all images have proper CORS headers if loaded from external sources
- Check the browser console for any errors during export
- For complex layouts, try simplifying the HTML structure

### Word Export Issues
- Complex layouts may not translate perfectly to Word
- Some CSS styles may not be supported in Word

### Text Export Issues
- Text export is intentionally simple and may not preserve all formatting
- Complex layouts will be flattened to plain text
