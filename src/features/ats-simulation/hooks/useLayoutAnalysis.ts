/**
 * useLayoutAnalysis Hook
 * 
 * React hook for real-time DOM layout detection with debouncing.
 * Analyzes resume preview containers to identify ATS-risky structures.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  analyzeLayout, 
  LayoutAnalysis, 
  LayoutDetectorOptions 
} from '../detector/layoutDetector';

/**
 * React hook for analyzing DOM layout structures
 * 
 * Performs layout analysis on the referenced container element
 * with 500ms debouncing to prevent excessive re-analysis.
 * 
 * @param containerRef - React ref to the HTMLElement to analyze
 * @param options - Configuration options for detection
 * @param deps - Additional dependencies to trigger re-analysis
 * @returns LayoutAnalysis or null if container not ready
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const analysis = useLayoutAnalysis(containerRef, {
 *   checkTables: true,
 *   checkColumns: true,
 *   checkHeaderFooter: true
 * }, [resumeData]);
 * 
 * // Use analysis to display risks
 * if (analysis?.overallRisk === 'critical') {
 *   return <WarningBanner score={analysis.riskScore} />;
 * }
 * ```
 */
export function useLayoutAnalysis(
  containerRef: React.RefObject<HTMLElement>,
  options: LayoutDetectorOptions = {},
  deps: React.DependencyList = []
): LayoutAnalysis | null {
  const [analysis, setAnalysis] = useState<LayoutAnalysis | null>(null);
  const lastAnalysisRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const performAnalysis = useCallback(() => {
    if (!containerRef.current) return;
    
    // Debounce: only analyze every 500ms max
    const now = Date.now();
    if (now - lastAnalysisRef.current < 500) {
      // Clear existing timeout and set new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        performAnalysis();
      }, 500);
      return;
    }
    
    try {
      const result = analyzeLayout(containerRef.current, options);
      setAnalysis(result);
      lastAnalysisRef.current = now;
    } catch (error) {
      console.error('Layout analysis failed:', error);
    }
  }, [containerRef, options]);
  
  useEffect(() => {
    // Initial analysis
    performAnalysis();
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [performAnalysis]);
  
  // Re-run analysis when deps change
  useEffect(() => {
    performAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  return analysis;
}

export default useLayoutAnalysis;
