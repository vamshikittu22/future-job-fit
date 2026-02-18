/**
 * Similarity Calculator
 *
 * TF-IDF based semantic similarity calculation between resume and job description.
 * Provides cosine similarity scoring with section-level breakdown.
 */

import type { SemanticScore, SectionScores } from '../types';

/**
 * Calculate cosine similarity between two vectors
 * Cosine similarity = (A · B) / (||A|| * ||B||)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  if (a.length === 0) return 0;

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Tokenize text into words (simple tokenizer)
 * Filters out words with less than 3 characters
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

/**
 * Calculate term frequency for a document
 * TF(t) = (Count of t in document) / (Max count of any term in document)
 */
function termFrequency(text: string): Map<string, number> {
  const tokens = tokenize(text);
  const tf = new Map<string, number>();

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  // Normalize by document length
  const maxFreq = Math.max(...Array.from(tf.values()), 1);
  for (const [key, value] of tf) {
    tf.set(key, value / maxFreq);
  }

  return tf;
}

/**
 * Calculate IDF (inverse document frequency) for a corpus
 * IDF(t) = log((N + 1) / (df(t) + 1)) + 1 (with smoothing)
 */
function calculateIDF(documents: string[]): Map<string, number> {
  const idf = new Map<string, number>();
  const docCount = documents.length;

  // Get all unique terms
  const allTerms = new Set<string>();
  for (const doc of documents) {
    for (const token of tokenize(doc)) {
      allTerms.add(token);
    }
  }

  // Calculate IDF for each term
  for (const term of allTerms) {
    let docsWithTerm = 0;
    for (const doc of documents) {
      if (tokenize(doc).includes(term)) {
        docsWithTerm++;
      }
    }
    // IDF with smoothing
    idf.set(term, Math.log((docCount + 1) / (docsWithTerm + 1)) + 1);
  }

  return idf;
}

/**
 * Calculate TF-IDF vector for a document
 * TF-IDF(t) = TF(t) * IDF(t)
 */
function tfidf(text: string, idf: Map<string, number>): number[] {
  const tf = termFrequency(text);
  const tokens = [...new Set(tokenize(text))];

  return tokens.map((term) => (tf.get(term) || 0) * (idf.get(term) || 1));
}

/**
 * Calculate TF-IDF based similarity between two texts
 * Uses cosine similarity on TF-IDF vectors
 */
function calculateTFIDFSimilarity(text1: string, text2: string): number {
  const documents = [text1, text2];
  const idf = calculateIDF(documents);

  const vec1 = tfidf(text1, idf);
  const vec2 = tfidf(text2, idf);

  // Pad vectors to same length
  const maxLen = Math.max(vec1.length, vec2.length);
  while (vec1.length < maxLen) vec1.push(0);
  while (vec2.length < maxLen) vec2.push(0);

  return cosineSimilarity(vec1, vec2);
}

/**
 * Calculate keyword-based similarity using Jaccard index
 * Jaccard(A, B) = |A ∩ B| / |A ∪ B|
 */
function calculateKeywordSimilarity(text1: string, text2: string): number {
  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  // Jaccard similarity
  return intersection.size / union.size;
}

/**
 * Extract sections from resume text based on common headers
 */
function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {
    summary: '',
    experience: '',
    skills: '',
    education: '',
  };

  const lines = text.split('\n');
  let currentSection = '';

  const sectionHeaders: Record<string, string> = {
    summary: 'summary',
    profile: 'summary',
    objective: 'summary',
    professional: 'summary',
    experience: 'experience',
    work: 'experience',
    employment: 'experience',
    history: 'experience',
    skills: 'skills',
    technical: 'skills',
    technologies: 'skills',
    competencies: 'skills',
    education: 'education',
    academic: 'education',
    qualifications: 'education',
  };

  for (const line of lines) {
    const lower = line.toLowerCase().trim();
    const header = sectionHeaders[lower];

    if (header) {
      currentSection = header;
    } else if (currentSection && line.trim()) {
      sections[currentSection] += line + ' ';
    }
  }

  return sections;
}

/**
 * Calculate similarity for a section pair
 */
function calculateSectionSimilarity(resumeSection: string, jdSection: string): number {
  if (!resumeSection.trim() || !jdSection.trim()) return 0;
  const result = calculateSemanticSimilarityInternal(resumeSection, jdSection);
  return result.overall;
}

/**
 * Internal implementation without section extraction (to avoid infinite recursion)
 */
function calculateSemanticSimilarityInternal(
  resumeText: string,
  jobDescription: string
): { overall: number } {
  // Primary: TF-IDF based similarity
  const tfidfSim = calculateTFIDFSimilarity(resumeText, jobDescription);

  // Secondary: Keyword overlap
  const keywordSim = calculateKeywordSimilarity(resumeText, jobDescription);

  // Combined score (weighted average)
  const overall = (tfidfSim * 0.7 + keywordSim * 0.3) * 100;

  return {
    overall: Math.min(100, Math.max(0, overall)),
  };
}

/**
 * Calculate interpretation based on score
 */
function getInterpretation(score: number): SemanticScore['interpretation'] {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

/**
 * Main function: Calculate semantic similarity between resume and job description
 *
 * Uses TF-IDF with cosine similarity as primary method,
 * with keyword Jaccard similarity as secondary.
 *
 * @param resumeText - Full resume text
 * @param jobDescription - Full job description text
 * @returns SemanticScore with overall and section-level scores
 */
export function calculateSemanticSimilarity(
  resumeText: string,
  jobDescription: string
): SemanticScore {
  // Primary: TF-IDF based similarity
  const tfidfSim = calculateTFIDFSimilarity(resumeText, jobDescription);

  // Secondary: Keyword overlap
  const keywordSim = calculateKeywordSimilarity(resumeText, jobDescription);

  // Combined score (weighted average)
  const overall = (tfidfSim * 0.7 + keywordSim * 0.3) * 100;

  // Section-level analysis
  const sections = extractSections(resumeText);
  const jdSections = extractSections(jobDescription);

  const sectionScores: SectionScores = {
    summary: calculateSectionSimilarity(sections.summary, jdSections.responsibilities || jdSections.summary || ''),
    experience: calculateSectionSimilarity(sections.experience, jdSections.requirements || jdSections.responsibilities || ''),
    skills: calculateSectionSimilarity(sections.skills, jdSections.skills || ''),
    education: calculateSectionSimilarity(sections.education, jdSections.education || jdSections.qualifications || ''),
  };

  return {
    overall: Math.min(100, Math.max(0, overall)),
    bySection: sectionScores,
    interpretation: getInterpretation(overall),
  };
}

/**
 * Mock embedding generation (for when embeddings API unavailable)
 * Generates a deterministic pseudo-random vector based on text hash
 */
export function generateMockEmbedding(text: string): number[] {
  // Generate a deterministic pseudo-random vector based on text hash
  const hash = hashString(text);
  const seed = hash % 10000;
  const rng = seededRandom(seed);

  const embedding: number[] = [];
  for (let i = 0; i < 128; i++) {
    embedding.push(rng() * 2 - 1); // Random between -1 and 1
  }

  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  return embedding.map((v) => v / magnitude);
}

/**
 * Simple string hash function (djb2)
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash * 33) ^ char;
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator (Linear Congruential Generator)
 */
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export default calculateSemanticSimilarity;
