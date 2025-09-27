// Export all template components
export * from './BaseResumeTemplate';

// Export utility functions
export * from './resumeDataUtils';

// Export types
export type { FormattedResumeData } from './resumeDataUtils';

export default {
  // Default export with all exports for easier importing
  ...require('./resumeDataUtils'),
  BaseResumeTemplate: require('./BaseResumeTemplate').default,
};
