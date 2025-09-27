import React from 'react';
import { Button } from './ui/button';
import { Download, Upload } from 'lucide-react';

type ImportExportPanelProps = {
  resumeText: string;
  onResumeImport: (content: string) => void;
  hasContent: boolean;
  className?: string;
};

const ImportExportPanel = ({ 
  resumeText, 
  onResumeImport, 
  hasContent, 
  className 
}: ImportExportPanelProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onResumeImport(content);
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.json"
        className="hidden"
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!hasContent}
          className={`flex items-center gap-2 ${!hasContent ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default ImportExportPanel;
