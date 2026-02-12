import { z } from 'zod';

/**
 * OAuth 2.0 token response from LinkedIn.
 * Per user decision: OAuth 2.0 + PKCE for authentication.
 * Note: Tokens stored in memory only, not persisted.
 */
export interface LinkedInOAuthResponse {
  /** Access token for API calls */
  access_token: string;
  /** Token expiration time in seconds */
  expires_in: number;
  /** Granted scopes */
  scope: string;
  /** Token type (always 'Bearer') */
  token_type: 'Bearer';
  /** OpenID Connect ID token (if OpenID scope requested) */
  id_token?: string;
}

/**
 * Schema for validating LinkedInOAuthResponse
 */
export const linkedInOAuthResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number().positive(),
  scope: z.string(),
  token_type: z.literal('Bearer'),
  id_token: z.string().optional(),
});

/**
 * Basic LinkedIn profile data available without partner program.
 * 
 * Note: LinkedIn's basic API only provides limited fields.
 * Full profile data requires LinkedIn Partner Program approval.
 * Per research: Only basic profile is available without partner program.
 */
export interface LinkedInBasicProfile {
  /** LinkedIn member ID */
  id: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Professional headline */
  headline?: string;
  /** Profile picture URL */
  profilePictureUrl?: string;
  /** Custom URL slug (vanity name) */
  vanityName?: string;
}

/**
 * Schema for validating LinkedInBasicProfile
 */
export const linkedInBasicProfileSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  headline: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
  vanityName: z.string().optional(),
});

/**
 * Mapping status showing which resume fields were imported from LinkedIn.
 */
export interface LinkedInMappedFields {
  /** Personal info mapping status */
  personal: {
    /** Whether name was imported */
    name: boolean;
    /** Whether title was imported from headline */
    title: boolean;
    /** Whether email was imported */
    email: boolean;
  };
  /** Experience import statistics */
  experience: {
    /** Number of positions imported */
    imported: number;
    /** Total positions available */
    total: number;
  };
  /** Education import statistics */
  education: {
    /** Number of institutions imported */
    imported: number;
    /** Total institutions available */
    total: number;
  };
  /** Skills import statistics */
  skills: {
    /** Number of skills imported */
    imported: number;
    /** Total skills available */
    total: number;
  };
}

/**
 * Schema for validating LinkedInMappedFields
 */
export const linkedInMappedFieldsSchema = z.object({
  personal: z.object({
    name: z.boolean(),
    title: z.boolean(),
    email: z.boolean(),
  }),
  experience: z.object({
    imported: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
  education: z.object({
    imported: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
  skills: z.object({
    imported: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
});

/**
 * Full LinkedIn profile with mapping to resume fields.
 */
export interface LinkedInProfile {
  /** Basic profile information */
  basic: LinkedInBasicProfile;
  /** Email address (if available) */
  email?: string;
  /** Mapping status for imported fields */
  mappedFields: LinkedInMappedFields;
  /** Complete raw API response for debugging */
  rawData: Record<string, unknown>;
}

/**
 * Schema for validating LinkedInProfile
 */
export const linkedInProfileSchema = z.object({
  basic: linkedInBasicProfileSchema,
  email: z.string().email().optional(),
  mappedFields: linkedInMappedFieldsSchema,
  rawData: z.record(z.unknown()),
});

/**
 * Connection state for LinkedIn OAuth.
 * Per user decision: tokens stored in memory only (not persisted).
 */
export interface LinkedInConnectionState {
  /** Whether user is currently connected */
  isConnected: boolean;
  /** When the connection was established */
  connectedAt?: string;
  /** When the token expires */
  expiresAt?: string;
  /** Granted OAuth scopes */
  scopes: string[];
  /** Cached basic profile info */
  profile?: LinkedInBasicProfile;
}

/**
 * Schema for validating LinkedInConnectionState
 */
export const linkedInConnectionStateSchema = z.object({
  isConnected: z.boolean(),
  connectedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  scopes: z.array(z.string()),
  profile: linkedInBasicProfileSchema.optional(),
});

/**
 * Result of importing LinkedIn data to resume.
 */
export interface LinkedInImportResult {
  /** Whether the import was successful */
  success: boolean;
  /** Fields that were successfully imported */
  importedFields: string[];
  /** Fields that were skipped (already filled or user chose to skip) */
  skippedFields: string[];
  /** Any errors that occurred during import */
  errors: string[];
  /** Fields that need manual user review */
  requiresManualReview: string[];
}

/**
 * Schema for validating LinkedInImportResult
 */
export const linkedInImportResultSchema = z.object({
  success: z.boolean(),
  importedFields: z.array(z.string()),
  skippedFields: z.array(z.string()),
  errors: z.array(z.string()),
  requiresManualReview: z.array(z.string()),
});

/**
 * PKCE parameters for OAuth flow.
 * Generated client-side, stored temporarily (not tokens).
 */
export interface PKCEParams {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

/**
 * Schema for validating PKCEParams
 */
export const pkceParamsSchema = z.object({
  codeVerifier: z.string(),
  codeChallenge: z.string(),
  state: z.string(),
});

/**
 * OAuth error types from LinkedIn.
 */
export type LinkedInOAuthErrorType =
  | 'invalid_grant'
  | 'access_denied'
  | 'invalid_request'
  | 'invalid_scope'
  | 'server_error'
  | 'state_mismatch'
  | 'unknown';

/**
 * API error types.
 */
export type LinkedInAPIErrorType =
  | 'network_error'
  | 'auth_error'
  | 'rate_limit'
  | 'not_found'
  | 'permission_denied'
  | 'server_error'
  | 'unknown';

// Type exports for convenience
export type LinkedInOAuthResponseType = z.infer<typeof linkedInOAuthResponseSchema>;
export type LinkedInBasicProfileType = z.infer<typeof linkedInBasicProfileSchema>;
export type LinkedInProfileType = z.infer<typeof linkedInProfileSchema>;
export type LinkedInConnectionStateType = z.infer<typeof linkedInConnectionStateSchema>;
export type LinkedInImportResultType = z.infer<typeof linkedInImportResultSchema>;
export type LinkedInMappedFieldsType = z.infer<typeof linkedInMappedFieldsSchema>;
export type PKCEParamsType = z.infer<typeof pkceParamsSchema>;
