/**
 * F-Pattern Heatmap Generator
 * 
 * Generates heatmap zones based on eye-tracking research showing recruiters
 * spend <10 seconds scanning resumes in an F-pattern.
 * Based on Wonsulting and JobEase studies: 89% first fixation on top-left.
 */

import type { HeatmapZone, SectionPosition } from '../types';

// Section position data from resume layout
export interface SectionPositionInput {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  top: number;      // Percentage from top (0-100)
  left: number;    // Percentage from left (0-100)
  height: number;  // Percentage height (0-100)
  width: number;   // Percentage width (0-100)
}

// Base F-pattern attention weights (from eye-tracking research)
// Based on Wonsulting and JobEase studies: 
// - 89% first fixation on top-left
// - <10 seconds total scanning time
// - F-pattern: horizontal top scan, vertical left scan, content scanning
const F_PATTERN_WEIGHTS = {
  // First line gets highest attention (89% first fixation)
  topLine: 1.0,
  // Second line partial (reading first few words)
  secondLine: 0.7,
  // Left margin - vertical scanning path
  leftMargin: 0.85,
  // Main content area
  content: 0.5,
  // Right edge - rarely looked at
  rightEdge: 0.2,
};

// Attention time in seconds per zone (research data)
const ATTENTION_TIMES: Record<string, number> = {
  header: 2.0,       // Name & title - first impression
  summary: 1.5,      // Value proposition
  experience: 3.0,   // Most important section
  education: 0.8,   // Secondary
  skills: 1.2,      // Quick scan
  projects: 1.5,     // Achievement highlights
  certifications: 0.5,
  custom: 0.5,
};

// Zone colors by intensity (red = hot, green = cool)
const ZONE_COLORS = [
  { r: 239, g: 68, b: 68 },   // Red - highest attention
  { r: 249, g: 115, b: 22 },  // Orange
  { r: 234, g: 179, b: 8 },   // Yellow
  { r: 34, g: 197, b: 94 },   // Green
];

// Default F-pattern zones (generic template)
export const F_PATTERN_ZONES: Omit<HeatmapZone, 'position' | 'dimensions'>[] = [
  { id: 'z1', resumeSection: 'header', attention: 1.0, attentionSeconds: 2.0, label: 'Name & Title', color: '' },
  { id: 'z2a', resumeSection: 'summary', attention: 0.7, attentionSeconds: 1.5, label: 'Professional Summary', color: '' },
  { id: 'z3a', resumeSection: 'experience', attention: 0.85, attentionSeconds: 3.0, label: 'Latest Role', color: '' },
  { id: 'z3b', resumeSection: 'experience', attention: 0.6, attentionSeconds: 2.0, label: 'Previous Role', color: '' },
  { id: 'z4', resumeSection: 'skills', attention: 0.5, attentionSeconds: 1.2, label: 'Skills Scan', color: '' },
  { id: 'z5', resumeSection: 'education', attention: 0.3, attentionSeconds: 0.8, label: 'Education', color: '' },
];

// Get color for attention level
function getZoneColor(attention: number, alpha: number): string {
  const colorIndex = Math.min(Math.floor(attention * 4), 3);
  const color = ZONE_COLORS[colorIndex];
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

/**
 * Generate heatmap zones from actual section positions
 */
export function generateHeatmapZones(
  sections: SectionPositionInput[]
): HeatmapZone[] {
  const zones: HeatmapZone[] = [];

  // Sort sections by position (top to bottom)
  const sortedSections = [...sections].sort((a, b) => a.top - b.top);

  sortedSections.forEach((section, index) => {
    let intensity: number;
    let attentionTime: number;

    // First section gets highest attention
    if (index === 0) {
      intensity = F_PATTERN_WEIGHTS.topLine;
      attentionTime = ATTENTION_TIMES[section.type] || 1.0;
    } else if (index === 1) {
      intensity = F_PATTERN_WEIGHTS.secondLine;
      attentionTime = (ATTENTION_TIMES[section.type] || 1.0) * 0.7;
    } else if (section.left < 10) {
      // Left margin = F-pattern vertical scan
      intensity = F_PATTERN_WEIGHTS.leftMargin;
      attentionTime = (ATTENTION_TIMES[section.type] || 1.0) * 0.8;
    } else if (section.left > 50) {
      // Right edge - rarely looked at
      intensity = F_PATTERN_WEIGHTS.rightEdge;
      attentionTime = (ATTENTION_TIMES[section.type] || 1.0) * 0.3;
    } else {
      intensity = F_PATTERN_WEIGHTS.content;
      attentionTime = ATTENTION_TIMES[section.type] || 1.0;
    }

    // Calculate alpha based on attention (0.1 to 0.4 for visibility)
    const alpha = 0.1 + (intensity * 0.3);

    zones.push({
      id: `zone-${section.id}`,
      resumeSection: section.type,
      position: { x: section.left, y: section.top },
      dimensions: { width: section.width, height: section.height },
      attention: intensity,
      label: `${section.type} (${attentionTime.toFixed(1)}s)`,
      color: getZoneColor(intensity, alpha),
      attentionSeconds: attentionTime,
    });
  });

  return zones;
}

/**
 * Generate generic F-pattern overlay (fallback when no section data)
 */
export function generateGenericHeatmap(): HeatmapZone[] {
  const zones: HeatmapZone[] = [];
  
  const genericPositions: SectionPositionInput[] = [
    { id: 'header', type: 'header', top: 0, left: 0, width: 100, height: 8 },
    { id: 'summary', type: 'summary', top: 10, left: 0, width: 100, height: 10 },
    { id: 'experience', type: 'experience', top: 25, left: 0, width: 100, height: 35 },
    { id: 'skills', type: 'skills', top: 65, left: 0, width: 100, height: 10 },
    { id: 'education', type: 'education', top: 78, left: 0, width: 100, height: 8 },
  ];

  genericPositions.forEach((pos, index) => {
    let intensity: number;
    if (index === 0) intensity = 1.0;
    else if (index === 1) intensity = 0.7;
    else if (index === 2) intensity = 0.85;
    else intensity = 0.4;

    const alpha = 0.1 + (intensity * 0.3);

    zones.push({
      id: `zone-${pos.type}`,
      resumeSection: pos.type,
      position: { x: pos.left, y: pos.top },
      dimensions: { width: pos.width, height: pos.height },
      attention: intensity,
      label: `${pos.type} (${ATTENTION_TIMES[pos.type] || 1.0}s)`,
      color: getZoneColor(intensity, alpha),
      attentionSeconds: ATTENTION_TIMES[pos.type] || 1.0,
    });
  });

  return zones;
}

/**
 * Calculate total attention time
 */
export function calculateTotalAttention(zones: HeatmapZone[]): number {
  return zones.reduce((total, zone) => total + (zone.attentionSeconds || 0), 0);
}
