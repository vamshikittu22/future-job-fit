// Export all template components
export * from '@/shared/templates/BaseResumeTemplate';

// Export utility functions
export * from '@/shared/templates/resumeDataUtils';

// Export types
export type { FormattedResumeData } from '@/shared/templates/resumeDataUtils';

import * as ResumeDataUtils from '@/shared/templates/resumeDataUtils';
import BaseResumeTemplate from '@/shared/templates/BaseResumeTemplate';

export default {
  ...ResumeDataUtils,
  BaseResumeTemplate,
};
