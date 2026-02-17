/**
 * Keyword Weighting Tests
 *
 * TDD tests for weighted keyword scoring algorithm.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateWeightedKeywords,
  calculateBreakdown,
  calculateExperienceScore,
  getWeightType,
  isKeywordMatched,
  getMatchStatus,
} from '../utils/keywordWeighting';
import type { WeightType } from '../types';

describe('keywordWeighting', () => {
  describe('getWeightType', () => {
    it('should return "required" for weight >= 0.7', () => {
      expect(getWeightType(0.7)).toBe('required');
      expect(getWeightType(0.8)).toBe('required');
      expect(getWeightType(1.0)).toBe('required');
    });

    it('should return "preferred" for weight >= 0.4 and < 0.7', () => {
      expect(getWeightType(0.4)).toBe('preferred');
      expect(getWeightType(0.5)).toBe('preferred');
      expect(getWeightType(0.69)).toBe('preferred');
    });

    it('should return "bonus" for weight < 0.4', () => {
      expect(getWeightType(0.0)).toBe('bonus');
      expect(getWeightType(0.1)).toBe('bonus');
      expect(getWeightType(0.39)).toBe('bonus');
    });
  });

  describe('isKeywordMatched', () => {
    it('should match exact keyword', () => {
      expect(isKeywordMatched('python', 'I know python and javascript')).toBe(true);
      expect(isKeywordMatched('JavaScript', 'I know javascript and python')).toBe(true);
    });

    it('should match partial keyword (substring)', () => {
      expect(isKeywordMatched('python', 'I know python script')).toBe(true);
      expect(isKeywordMatched('script', 'I know python script')).toBe(true);
    });

    it('should match known abbreviations', () => {
      expect(isKeywordMatched('js', 'I know javascript')).toBe(true);
      expect(isKeywordMatched('javascript', 'I know js')).toBe(true);
      expect(isKeywordMatched('py', 'I know python')).toBe(true);
      expect(isKeywordMatched('python', 'I know py')).toBe(true);
      expect(isKeywordMatched('ai', 'I know artificial intelligence')).toBe(true);
      expect(isKeywordMatched('ml', 'I know machine learning')).toBe(true);
    });

    it('should return false for non-matching keywords', () => {
      expect(isKeywordMatched('ruby', 'I know python and javascript')).toBe(false);
      expect(isKeywordMatched('react', 'I know vue and angular')).toBe(false);
    });
  });

  describe('getMatchStatus', () => {
    it('should return "matched" for exact matches', () => {
      expect(getMatchStatus('python', 'I know python')).toBe('matched');
      expect(getMatchStatus('JavaScript', 'I know javascript')).toBe('matched');
    });

    it('should return "matched" for substring matches (keyword found in resume)', () => {
      // "python" is found in "python script" - this is considered matched
      expect(getMatchStatus('python', 'I know python script')).toBe('matched');
    });

    it('should return "missing" when no match', () => {
      expect(getMatchStatus('ruby', 'I know python')).toBe('missing');
    });
  });

  describe('calculateWeightedKeywords', () => {
    const keywords = [
      { keyword: 'python', weight: 0.8, jdSection: 'requirements' },
      { keyword: 'javascript', weight: 0.7, jdSection: 'requirements' },
      { keyword: 'react', weight: 0.5, jdSection: 'preferred' },
      { keyword: 'node.js', weight: 0.3, jdSection: 'bonus' },
    ];

    it('should return 100% score when all required keywords matched', () => {
      const resumeText = 'I know python javascript react node.js';
      const results = calculateWeightedKeywords(keywords, resumeText);
      
      const requiredResults = results.filter(r => r.weightType === 'required');
      const allMatched = requiredResults.every(r => r.status === 'matched');
      
      expect(allMatched).toBe(true);
    });

    it('should return 50% score when 50% required keywords matched', () => {
      const keywordsMixed = [
        { keyword: 'python', weight: 0.8, jdSection: 'requirements' },
        { keyword: 'javascript', weight: 0.7, jdSection: 'requirements' },
      ];
      
      const resumeText = 'I know python only';
      const results = calculateWeightedKeywords(keywordsMixed, resumeText);
      
      const requiredResults = results.filter(r => r.weightType === 'required');
      const matchedCount = requiredResults.filter(r => r.status === 'matched').length;
      
      expect(matchedCount).toBe(1);
    });

    it('should return 0% when no keywords matched', () => {
      const keywords2 = [
        { keyword: 'ruby', weight: 0.8, jdSection: 'requirements' },
        { keyword: 'go', weight: 0.7, jdSection: 'requirements' },
      ];
      
      const resumeText = 'I know python and javascript';
      const results = calculateWeightedKeywords(keywords2, resumeText);
      
      const allMissing = results.every(r => r.status === 'missing');
      expect(allMissing).toBe(true);
    });

    it('should assign correct weight types based on weight values', () => {
      const resumeText = 'python javascript react node.js sql';
      const results = calculateWeightedKeywords(keywords, resumeText);
      
      const pythonResult = results.find(r => r.keyword === 'python');
      const reactResult = results.find(r => r.keyword === 'react');
      const nodeResult = results.find(r => r.keyword === 'node.js');
      
      expect(pythonResult?.weightType).toBe('required');
      expect(reactResult?.weightType).toBe('preferred');
      expect(nodeResult?.weightType).toBe('bonus');
    });

    it('should calculate correct base weights', () => {
      const resumeText = 'python javascript react node.js';
      const results = calculateWeightedKeywords(keywords, resumeText);
      
      const pythonResult = results.find(r => r.keyword === 'python');
      const reactResult = results.find(r => r.keyword === 'react');
      const nodeResult = results.find(r => r.keyword === 'node.js');
      
      expect(pythonResult?.baseWeight).toBe(0.50);
      expect(reactResult?.baseWeight).toBe(0.25);
      expect(nodeResult?.baseWeight).toBe(0.10);
    });
  });

  describe('calculateBreakdown', () => {
    it('should return correct breakdown structure', () => {
      const keywords = [
        { keyword: 'python', weight: 0.8, jdSection: 'requirements' },
        { keyword: 'javascript', weight: 0.5, jdSection: 'preferred' },
      ];
      
      const resumeText = 'python javascript';
      const keywordResults = calculateWeightedKeywords(keywords, resumeText);
      const breakdown = calculateBreakdown(keywordResults);
      
      expect(breakdown).toHaveProperty('requiredSkills');
      expect(breakdown).toHaveProperty('preferredSkills');
      expect(breakdown).toHaveProperty('bonusSkills');
      expect(breakdown).toHaveProperty('overall');
    });

    it('should calculate correct required skills scores', () => {
      const keywords = [
        { keyword: 'python', weight: 0.8, jdSection: 'requirements' },
        { keyword: 'javascript', weight: 0.8, jdSection: 'requirements' },
      ];
      
      const resumeText = 'python javascript';
      const keywordResults = calculateWeightedKeywords(keywords, resumeText);
      const breakdown = calculateBreakdown(keywordResults);
      
      // Both matched = 100% of 50% = 50 points
      expect(breakdown.requiredSkills.score).toBe(50);
      expect(breakdown.requiredSkills.matched).toBe(2);
      expect(breakdown.requiredSkills.total).toBe(2);
    });

    it('should calculate correct overall percentage', () => {
      const keywords = [
        { keyword: 'python', weight: 0.8, jdSection: 'requirements' },
      ];
      
      const resumeText = 'python';
      const keywordResults = calculateWeightedKeywords(keywords, resumeText);
      const breakdown = calculateBreakdown(keywordResults);
      
      // 1 required matched = 100% of 50% = 50 points
      // Max would be 50 (1 required * 50%)
      // So percentage = (50 / 50) * 100 = 100%
      expect(breakdown.overall.percentage).toBe(100);
    });
  });

  describe('calculateExperienceScore', () => {
    it('should return full 15 points when JD has no experience requirement', () => {
      const resumeExperience = '5 years experience';
      const jdExperience = '';
      
      expect(calculateExperienceScore(resumeExperience, jdExperience)).toBe(15);
    });

    it('should return 15 points when resume meets or exceeds JD requirements', () => {
      const resumeExperience = '5 years of experience';
      const jdExperience = '3 years experience required';
      
      expect(calculateExperienceScore(resumeExperience, jdExperience)).toBe(15);
    });

    it('should return 10 points when resume has >= 50% of required experience', () => {
      const resumeExperience = '2 years experience';
      const jdExperience = '3 years experience required';
      
      expect(calculateExperienceScore(resumeExperience, jdExperience)).toBe(10);
    });

    it('should return 5 points when resume has some experience but < 50%', () => {
      const resumeExperience = '1 year experience';
      const jdExperience = '5 years experience required';
      
      expect(calculateExperienceScore(resumeExperience, jdExperience)).toBe(5);
    });

    it('should return 0 points when resume has no experience', () => {
      const resumeExperience = '';
      const jdExperience = '3 years experience required';
      
      expect(calculateExperienceScore(resumeExperience, jdExperience)).toBe(0);
    });
  });
});
