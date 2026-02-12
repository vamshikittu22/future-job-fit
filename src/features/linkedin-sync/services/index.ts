/**
 * LinkedIn Sync Services
 * 
 * This module provides OAuth 2.0 + PKCE flow and LinkedIn API client
 * for syncing LinkedIn profile data with the resume builder.
 * 
 * Security notes:
 * - Tokens are stored in memory only (not persisted to localStorage)
 * - PKCE flow keeps secrets server-side via Supabase Edge Function
 * - localStorage is only used for temporary PKCE state (cleared after callback)
 * 
 * Usage:
 * ```typescript
 * import { 
 *   initiateOAuthFlow, 
 *   handleOAuthCallback,
 *   fetchBasicProfile,
 *   disconnectLinkedIn,
 *   getConnectionState 
 * } from '@/features/linkedin-sync/services';
 * ```
 */

// OAuth flow exports
export {
  initiateOAuthFlow,
  handleOAuthCallback,
  generatePKCE,
  LINKEDIN_SCOPES,
  LinkedInOAuthError,
  hasActiveOAuthFlow,
  clearOAuthState,
} from './oauth';

// API Client exports
export {
  LinkedInAPIClient,
  fetchBasicProfile,
  disconnectLinkedIn,
  getConnectionState,
  LinkedInAPIError,
  setAccessToken,
  getAccessToken,
  isTokenValid,
  clearTokens,
  isLinkedInConnected,
  linkedInClient,
} from './linkedinAPI';

// Re-export types for convenience
export type {
  LinkedInOAuthResponse,
  LinkedInBasicProfile,
  LinkedInProfile,
  LinkedInConnectionState,
  LinkedInImportResult,
  PKCEParams,
  LinkedInOAuthErrorType,
  LinkedInAPIErrorType,
} from '@/features/linkedin-sync/types';
