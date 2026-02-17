import { cn } from '@/shared/lib/utils';
import { RiskLevel, PlatformType } from '../types';

/**
 * Props for the RiskItemsList component
 */
export interface RiskItemsListProps {
  /** Array of risk items to display */
  risks: Array<{
    severity: RiskLevel;
    category: string;
    message: string;
    suggestion: string;
    platforms: PlatformType[];
  }>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Severity icons mapping
 */
const severityIcons: Record<RiskLevel, string> = {
  [RiskLevel.CRITICAL]: '🔴',
  [RiskLevel.HIGH]: '🟠',
  [RiskLevel.MEDIUM]: '🟡',
  [RiskLevel.LOW]: '🔵',
  [RiskLevel.NONE]: '✅',
};

/**
 * Severity order for sorting (critical first)
 */
const severityOrder: Record<RiskLevel, number> = {
  [RiskLevel.CRITICAL]: 0,
  [RiskLevel.HIGH]: 1,
  [RiskLevel.MEDIUM]: 2,
  [RiskLevel.LOW]: 3,
  [RiskLevel.NONE]: 4,
};

/**
 * Risk items list component sorted by severity
 * 
 * Displays expandable cards showing:
 * - Severity icon
 * - Risk message
 * - Affected platforms
 * - Expandable suggestion for fix
 * 
 * Sorted by: Critical > High > Medium > Low > None
 * 
 * @example
 * ```tsx
 * <RiskItemsList 
 *   risks={[
 *     { severity: 'high', category: 'Layout', message: 'Table detected', suggestion: 'Remove tables', platforms: ['workday'] }
 *   ]}
 * />
 * ```
 */
export function RiskItemsList({ risks, className }: RiskItemsListProps) {
  // Sort risks by severity (critical first)
  const sortedRisks = [...risks].sort((a, b) => {
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Issues ({risks.length})
      </h3>
      
      {sortedRisks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🎉</div>
          <p>No issues detected!</p>
          <p className="text-sm">Your resume looks ATS-friendly.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedRisks.map((risk, i) => (
            <details 
              key={i} 
              className="group border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              <summary className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <span>{severityIcons[risk.severity]}</span>
                <span className="flex-1 font-medium text-sm dark:text-white">{risk.message}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {risk.platforms.slice(0, 2).join(', ')}
                  {risk.platforms.length > 2 && '...'}
                </span>
              </summary>
              <div className="px-3 pb-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">
                <p className="font-medium text-gray-700 dark:text-gray-200">Suggestion:</p>
                <p>{risk.suggestion}</p>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

export default RiskItemsList;
