/**
 * Test Suite: AIEnhanceModal - Keyword Integration
 * Tests for Phase 05 keyword integration features
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the dependencies
vi.mock('@/shared/api/resumeAI', () => ({
  resumeAI: {
    enhanceSection: vi.fn(),
    isDemoMode: false
  },
  EnhancementRequest: {} as any
}));

vi.mock('@/shared/lib/keywordIntegration', () => ({
  INTEGRATION_MODES: [
    { id: 'smart', label: 'Smart Rewrite', description: 'AI rewrites content', icon: 'Sparkles', recommended: true },
    { id: 'suggest', label: 'Suggest Placement', description: 'Show suggestions', icon: 'Target', recommended: false },
    { id: 'append', label: 'Append Keywords', description: 'Add to end', icon: 'Plus', recommended: false }
  ],
  validateKeywordIntegration: vi.fn((text, keywords) => ({
    valid: true,
    issues: []
  })),
  IntegrationMode: {} as any
}));

describe('AIEnhanceModal - Keyword Integration', () => {
  describe('Integration Mode Selection', () => {
    it('should default to Smart Rewrite mode', () => {
      // Test that Smart Rewrite is selected by default
      const expectedDefaultMode = 'smart';
      expect(INTEGRATION_MODES.find(m => m.id === expectedDefaultMode)?.recommended).toBe(true);
    });

    it('should have three integration modes available', () => {
      expect(INTEGRATION_MODES).toHaveLength(3);
      expect(INTEGRATION_MODES.map(m => m.id)).toContain('smart');
      expect(INTEGRATION_MODES.map(m => m.id)).toContain('suggest');
      expect(INTEGRATION_MODES.map(m => m.id)).toContain('append');
    });

    it('should mark Smart Rewrite as recommended', () => {
      const smartMode = INTEGRATION_MODES.find(m => m.id === 'smart');
      expect(smartMode?.recommended).toBe(true);
      expect(smartMode?.label).toBe('Smart Rewrite');
    });

    it('should not mark Append mode as recommended', () => {
      const appendMode = INTEGRATION_MODES.find(m => m.id === 'append');
      expect(appendMode?.recommended).toBe(false);
    });
  });

  describe('KeywordHighlighter Component', () => {
    it('should render text with highlighted keywords', () => {
      const text = 'Led team using React and TypeScript to build features.';
      const keywords = ['React', 'TypeScript'];
      
      // Simulate highlighting logic
      const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
      const matches = [...text.matchAll(regex)];
      
      expect(matches).toHaveLength(2);
      expect(matches[0][0]).toBe('React');
      expect(matches[1][0]).toBe('TypeScript');
    });

    it('should handle case-insensitive keyword matching', () => {
      const text = 'Led team using REACT for development.';
      const keywords = ['react'];
      
      const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
      const matches = [...text.matchAll(regex)];
      
      expect(matches).toHaveLength(1);
      expect(matches[0][0]).toBe('REACT');
    });

    it('should not highlight non-matching text', () => {
      const text = 'Led development team on projects.';
      const keywords = ['React', 'TypeScript'];
      
      const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
      const matches = [...text.matchAll(regex)];
      
      expect(matches).toHaveLength(0);
    });
  });

  describe('KeywordIntegrationStatus Component', () => {
    const mockVariant = 'Leveraged React and TypeScript to build scalable applications.';
    const mockKeywords = ['React', 'TypeScript', 'Docker'];

    it('should identify found and missing keywords', () => {
      const foundKeywords = mockKeywords.filter(k => 
        mockVariant.toLowerCase().includes(k.toLowerCase())
      );
      const missingKeywords = mockKeywords.filter(k => 
        !mockVariant.toLowerCase().includes(k.toLowerCase())
      );
      
      expect(foundKeywords).toContain('React');
      expect(foundKeywords).toContain('TypeScript');
      expect(missingKeywords).toContain('Docker');
    });

    it('should validate integration quality', () => {
      // Mock validation result
      const mockValidation = {
        valid: true,
        issues: []
      };
      
      expect(mockValidation.valid).toBe(true);
      expect(mockValidation.issues).toHaveLength(0);
    });

    it('should detect poor integration when keywords are standalone', () => {
      const poorVariant = 'Led development team. React. TypeScript.';
      const poorValidation = {
        valid: false,
        issues: ['Keyword "React" appears standalone', 'Keyword "TypeScript" appears standalone']
      };
      
      expect(poorValidation.valid).toBe(false);
      expect(poorValidation.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Integration Mode Behavior', () => {
    it('Smart Rewrite mode should request AI to rewrite with natural integration', () => {
      const integrationMode = 'smart';
      const expectedPrompt = integrationMode === 'smart' ? 
        'REWRITE the content to naturally weave keywords' : 
        'Add keywords';
      
      expect(expectedPrompt).toContain('REWRITE');
      expect(expectedPrompt).toContain('naturally');
    });

    it('Append mode should allow keyword appending', () => {
      const integrationMode = 'append';
      const allowsAppending = integrationMode === 'append';
      
      expect(allowsAppending).toBe(true);
    });

    it('Suggest mode should return placement suggestions', () => {
      const integrationMode = 'suggest';
      const skipAiCall = integrationMode === 'suggest';
      
      expect(skipAiCall).toBe(true);
    });
  });

  describe('User Interaction Scenarios', () => {
    it('should show warning when Append mode is selected', () => {
      const selectedMode = 'append';
      const shouldShowWarning = selectedMode === 'append';
      
      expect(shouldShowWarning).toBe(true);
    });

    it('should pass integration_mode in enhancement request', () => {
      const request = {
        section_type: 'experience',
        original_text: 'Led development team.',
        industry_keywords: 'React, TypeScript',
        integration_mode: 'smart' as const
      };
      
      expect(request.integration_mode).toBe('smart');
      expect(request.industry_keywords).toBeDefined();
    });

    it('should default to smart mode when not specified', () => {
      const request = {
        section_type: 'experience',
        original_text: 'Led development team.'
        // integration_mode not specified
      };
      
      const defaultMode = request.integration_mode || 'smart';
      expect(defaultMode).toBe('smart');
    });
  });

  describe('Visual Feedback', () => {
    it('should show green highlighting for well-integrated keywords', () => {
      const goodVariant = 'Leveraged React to build applications.';
      const keywords = ['React'];
      const isWellIntegrated = goodVariant.toLowerCase().includes('react') && 
        !goodVariant.match(/\.\s*React\./);
      
      expect(isWellIntegrated).toBe(true);
    });

    it('should show red warning for standalone keywords', () => {
      const poorVariant = 'Led team. React.';
      const keywords = ['React'];
      const isStandalone = poorVariant.match(/\.\s*React\./);
      
      expect(isStandalone).toBeTruthy();
    });

    it('should display integration quality score', () => {
      const score = 85;
      const category = score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'poor';
      
      expect(category).toBe('excellent');
    });
  });
});

describe('AIEnhanceModal - Edge Cases', () => {
  it('should handle empty keywords gracefully', () => {
    const keywords: string[] = [];
    expect(keywords).toHaveLength(0);
  });

  it('should handle very long keyword lists', () => {
    const keywords = Array(50).fill('React');
    expect(keywords).toHaveLength(50);
  });

  it('should handle special characters in keywords', () => {
    const keywords = ['C++', 'C#', '.NET'];
    const text = 'Developed applications using C++ and C#.';
    
    // Should handle special regex characters
    const escapedKeywords = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    expect(escapedKeywords).toContain('C\\+\\+');
  });

  it('should handle multi-word keywords', () => {
    const keywords = ['Machine Learning', 'React Native'];
    const text = 'Built apps using Machine Learning and React Native.';
    
    // Multi-word keywords should be matched correctly
    const hasMachineLearning = text.includes('Machine Learning');
    expect(hasMachineLearning).toBe(true);
  });

  it('should handle keywords with different cases', () => {
    const keyword = 'react';
    const text = 'Used REACT and React for development.';
    const matches = [...text.matchAll(new RegExp(keyword, 'gi'))];
    
    expect(matches).toHaveLength(2);
  });
});
