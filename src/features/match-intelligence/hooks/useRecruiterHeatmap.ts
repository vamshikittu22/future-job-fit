/**
 * useRecruiterHeatmap Hook
 * 
 * Provides F-pattern heatmap zones for resume preview visualization.
 * Based on eye-tracking research showing recruiters spend <10 seconds scanning resumes.
 */

import { useMemo } from 'react';
import { 
  generateHeatmapZones, 
  generateGenericHeatmap, 
  calculateTotalAttention,
  type SectionPositionInput
} from '../utils/heatmapGenerator';
import type { HeatmapZone } from '../types';

export interface UseRecruiterHeatmapResult {
  zones: HeatmapZone[];
  totalAttentionTime: number;
  isLoading: boolean;
}

export interface UseRecruiterHeatmapOptions {
  /** Optional section positions from actual resume DOM */
  sectionPositions?: SectionPositionInput[];
  /** Whether to use generic fallback */
  useGenericFallback?: boolean;
}

/**
 * Hook to generate recruiter F-pattern heatmap zones
 */
export function useRecruiterHeatmap(
  options: UseRecruiterHeatmapOptions = {}
): UseRecruiterHeatmapResult {
  const { sectionPositions, useGenericFallback = true } = options;

  const result = useMemo(() => {
    let zones: HeatmapZone[];

    if (sectionPositions && sectionPositions.length > 0) {
      // Use actual section positions if available
      zones = generateHeatmapZones(sectionPositions);
    } else if (useGenericFallback) {
      // Use generic F-pattern template
      zones = generateGenericHeatmap();
    } else {
      zones = [];
    }

    return {
      zones,
      totalAttentionTime: calculateTotalAttention(zones),
    };
  }, [sectionPositions, useGenericFallback]);

  return {
    ...result,
    isLoading: false,
  };
}

export default useRecruiterHeatmap;
