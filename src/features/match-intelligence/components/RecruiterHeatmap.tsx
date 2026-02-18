/**
 * RecruiterHeatmap Component
 * 
 * Visual F-pattern overlay showing where recruiters focus attention based on 
 * eye-tracking research (89% first fixation on top-left).
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useRecruiterHeatmap } from '../hooks/useRecruiterHeatmap';
import type { HeatmapZone } from '../types';

interface RecruiterHeatmapProps {
  /** Optional: pass actual section positions from resume preview */
  sectionPositions?: Array<{
    id: string;
    type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
    top: number;
    left: number;
    height: number;
    width: number;
  }>;
}

export function RecruiterHeatmap({ sectionPositions }: RecruiterHeatmapProps) {
  const [isActive, setIsActive] = useState(false);
  const { zones, totalAttentionTime } = useRecruiterHeatmap({
    sectionPositions,
    useGenericFallback: true,
  });

  if (!isActive) {
    return (
      <Card>
        <CardContent className="py-8 text-center space-y-4">
          <div className="text-4xl">👁️</div>
          <div>
            <h3 className="font-medium mb-2">Recruiter Attention Heatmap</h3>
            <p className="text-sm text-muted-foreground mb-4">
              See where recruiters focus their attention based on F-pattern eye-tracking research.
            </p>
            <Button onClick={() => setIsActive(true)}>
              Show Heatmap
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate SVG overlay
  const renderHeatmapOverlay = () => (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {zones.map((zone: HeatmapZone) => (
        <rect
          key={zone.id}
          x={zone.position.x}
          y={zone.position.y}
          width={zone.dimensions.width}
          height={zone.dimensions.height}
          fill={zone.color}
          className="transition-opacity duration-300"
        />
      ))}
      {/* F-pattern guide lines */}
      <line
        x1="0" y1="5" x2="100" y2="5"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
        strokeDasharray="2"
      />
      <line
        x1="5" y1="0" x2="5" y2="100"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
        strokeDasharray="2"
      />
    </svg>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Recruiter Heatmap</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsActive(false)}
          >
            Hide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heatmap visualization */}
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg aspect-[1/1.4] overflow-hidden">
          {renderHeatmapOverlay()}
          
          {/* Legend overlay */}
          <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/90 rounded p-2 text-xs">
            <div className="font-medium mb-1">Attention Zones</div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500"></span>
              <span>High (2s+)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-orange-500"></span>
              <span>Medium (1-2s)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-500"></span>
              <span>Low (&lt;1s)</span>
            </div>
          </div>
        </div>

        {/* Zone details */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">F-Pattern Analysis</h4>
          <p className="text-xs text-muted-foreground">
            Based on eye-tracking research: recruiters spend ~{totalAttentionTime.toFixed(0)} seconds scanning resumes in an F-pattern.
          </p>
          
          <div className="space-y-1">
            {zones.slice(0, 4).map((zone: HeatmapZone) => (
              <div 
                key={zone.id}
                className="flex items-center justify-between text-sm p-2 rounded bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="capitalize">{zone.resumeSection}</span>
                </div>
                <span className="text-muted-foreground">
                  {zone.attentionSeconds?.toFixed(1)}s
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Research note */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Research insight:</strong> 89% of recruiters' first fixation is on the top-left (name & title). 
            Place your most important achievements in the first third of each section.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecruiterHeatmap;
