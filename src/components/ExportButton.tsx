import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileType, FileCode, Loader2, CheckCircle, X } from 'lucide-react';
import { useResumeExport, ExportFormat } from '@/hooks/useResumeExport';
import { FormattedResumeData } from '@/templates/resumeDataUtils';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  data: FormattedResumeData;
  fileName?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  onExportStart?: () => void;
  onExportSuccess?: () => void;
  onExportError?: (error: Error) => void;
}

const formatIcons = {
  pdf: <FileText className="h-4 w-4 mr-2" />,
  word: <FileCode className="h-4 w-4 mr-2" />,
  text: <FileType className="h-4 w-4 mr-2" />,
};

const formatLabels = {
  pdf: 'PDF',
  word: 'Word',
  text: 'Text',
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  fileName = 'resume',
  className,
  variant = 'outline',
  size = 'default',
  showLabel = true,
  onExportStart,
  onExportSuccess,
  onExportError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isExporting,
    error,
    progress,
    currentFormat,
    exportAsPdf,
    exportAsWord,
    exportAsText,
  } = useResumeExport({
    onSuccess: onExportSuccess,
    onError: onExportError,
  });

  const handleExport = async (format: ExportFormat) => {
    onExportStart?.();
    try {
      switch (format) {
        case 'pdf':
          await exportAsPdf(data, fileName);
          break;
        case 'word':
          await exportAsWord(data, fileName);
          break;
        case 'text':
          await exportAsText(data, fileName);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      // Close the dropdown after a short delay
      setTimeout(() => setIsOpen(false), 500);
    }
  };

  const renderButtonContent = () => {
    if (isExporting) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {showLabel && (
            <span>
              Exporting {currentFormat ? formatLabels[currentFormat] : ''}...
              {progress > 0 && ` (${Math.round(progress)}%)`}
            </span>
          )}
        </>
      );
    }

    if (error) {
      return (
        <>
          <X className="h-4 w-4 mr-2 text-destructive" />
          {showLabel && <span>Export Failed</span>}
        </>
      );
    }

    return (
      <>
        <Download className="h-4 w-4 mr-2" />
        {showLabel && <span>Export</span>}
      </>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn('relative', className)}
          disabled={isExporting}
          aria-label="Export resume"
        >
          {renderButtonContent()}
          
          {/* Progress indicator */}
          {isExporting && progress > 0 && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-primary/20"
              style={{ width: `${progress}%` }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(formatIcons).map(([format, icon]) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format as ExportFormat)}
            disabled={isExporting}
            className="cursor-pointer"
          >
            {icon}
            <span>{formatLabels[format as keyof typeof formatLabels]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
