/**
 * ATS Report Modal
 * 
 * Modal wrapper for displaying the ATS Risk Report in a dialog.
 * Integrates with the resume wizard workflow.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { ATSRiskReport } from '@/features/ats-simulation';

interface ATSReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeText: string;
  resumeElement?: HTMLElement | null;
}

/**
 * Modal component that displays the ATS Risk Report.
 * 
 * @param open - Whether the modal is open
 * @param onOpenChange - Callback when open state changes
 * @param resumeText - Plain text of the resume for analysis
 * @param resumeElement - Optional DOM element for layout analysis
 */
export function ATSReportModal({ 
  open, 
  onOpenChange, 
  resumeText, 
  resumeElement 
}: ATSReportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🤖</span>
            ATS Compatibility Analysis
          </DialogTitle>
          <DialogDescription>
            See how major ATS systems will parse your resume
          </DialogDescription>
        </DialogHeader>
        
        <ATSRiskReport 
          resumeText={resumeText}
          resumeElement={resumeElement || undefined}
          className="mt-4"
        />
        
        <div className="mt-6 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-600 pt-4">
          <div>
            <span className="font-medium">Tip:</span> Green scores indicate good compatibility. 
            Yellow/red scores suggest improvements.
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
