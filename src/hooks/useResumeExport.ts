import { useState, useCallback } from 'react';
import { FormattedResumeData } from '@/templates/resumeDataUtils';
import { exportToPDF, exportToWord, exportToText } from '@/templates/exportUtils';

export type ExportFormat = 'pdf' | 'word' | 'text';

interface UseResumeExportProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

const EXPORT_FUNCTIONS = {
  pdf: exportToPDF,
  word: exportToWord,
  text: exportToText,
};

export const useResumeExport = ({ 
  onSuccess, 
  onError, 
  onProgress 
}: UseResumeExportProps = {}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentFormat, setCurrentFormat] = useState<ExportFormat | null>(null);

  // Update progress and notify parent
  const updateProgress = useCallback((value: number) => {
    setProgress(value);
    onProgress?.(value);
  }, [onProgress]);

  /**
   * Export resume in the specified format
   */
  const handleExport = useCallback(async (
    data: FormattedResumeData,
    format: ExportFormat,
    fileName: string = 'resume'
  ) => {
    setIsExporting(true);
    setError(null);
    setCurrentFormat(format);
    updateProgress(10);
    
    try {
      const exportFn = EXPORT_FUNCTIONS[format];
      if (!exportFn) {
        throw new Error(`Unsupported export format: ${format}`);
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        updateProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      await exportFn(data, fileName);
      
      clearInterval(progressInterval);
      updateProgress(100);
      onSuccess?.();
      
      // Reset progress after a short delay
      setTimeout(() => updateProgress(0), 500);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to export resume');
      setError(error);
      onError?.(error);
      updateProgress(0);
      throw error;
    } finally {
      setIsExporting(false);
      setCurrentFormat(null);
    }
  }, [onSuccess, onError, updateProgress]);

  // Convenience methods for direct usage
  const exportAsPdf = useCallback((data: FormattedResumeData, fileName?: string) => 
    handleExport(data, 'pdf', fileName),
    [handleExport]
  );

  const exportAsWord = useCallback((data: FormattedResumeData, fileName?: string) => 
    handleExport(data, 'word', fileName),
    [handleExport]
  );

  const exportAsText = useCallback((data: FormattedResumeData, fileName?: string) => 
    handleExport(data, 'text', fileName),
    [handleExport]
  );

  return {
    // State
    isExporting,
    error,
    progress,
    currentFormat,
    
    // Actions
    exportResume: handleExport,
    
    // Convenience methods
    exportAsPdf,
    exportAsWord,
    exportAsText,
    
    // Reset state
    reset: () => {
      setError(null);
      setProgress(0);
      setIsExporting(false);
      setCurrentFormat(null);
    },
  };
};

export default useResumeExport;
