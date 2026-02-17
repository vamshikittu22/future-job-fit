/**
 * Migration: v1 → v2
 * 
 * Adds ATS optimization tracking fields to ResumeData.
 * This demonstrates the migration pattern for schema evolution.
 * 
 * v1: Basic ResumeData without ATS tracking
 * v2: ResumeData with atsOptimized flag and lastOptimizedAt timestamp
 */

import { registerMigration } from '../migrate';
import type { ResumeData } from '@/shared/types/resume';

// v1 ResumeData type (without ATS fields)
interface ResumeDataV1 extends ResumeData {
  // v1 didn't have these fields
  atsOptimized?: undefined;
  lastOptimizedAt?: undefined;
  optimizationHistory?: undefined;
}

// v2 ResumeData type (with ATS fields)
interface ResumeDataV2 extends ResumeData {
  atsOptimized: boolean;
  lastOptimizedAt: string | null;
  optimizationHistory: Array<{
    date: string;
    score: number;
    changes: string[];
  }>;
}

registerMigration<ResumeDataV1, ResumeDataV2>({
  fromVersion: 1,
  toVersion: 2,
  name: 'add-ats-optimization-tracking',
  migrate: (v1) => {
    // CRITICAL: Return NEW object, never mutate v1
    const v2: ResumeDataV2 = {
      ...v1,
      // Add new fields with default values
      atsOptimized: false,
      lastOptimizedAt: null,
      optimizationHistory: []
    };

    return v2;
  }
});
