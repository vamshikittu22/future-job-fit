// Supabase import for future Edge Function token refresh
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { supabase } from '@/shared/integrations/supabase/client';
import type {
  LinkedInBasicProfile,
  LinkedInProfile,
  LinkedInConnectionState,
  LinkedInAPIErrorType,
} from '@/features/linkedin-sync/types';

/**
 * LinkedIn API Client
 * 
 * Security notes (per user decision):
 * - Tokens stored in memory ONLY (not localStorage/sessionStorage)
 * - Tokens cleared on page refresh
 * - No persistent token storage for security
 * 
 * Note on LinkedIn API limitations:
 * - Without Partner Program access, only basic profile data is available
 * - Full work history, education, and skills require Partner Program approval
 * - This implementation provides graceful degradation for limited data
 */

// LinkedIn API endpoints
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const LINKEDIN_USERINFO_ENDPOINT = 'https://api.linkedin.com/v2/userinfo';

// Mock mode flag
const MOCK_MODE = import.meta.env.VITE_LINKEDIN_MOCK_MODE === 'true';

// In-memory token storage (NOT exported - private to this module)
let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;
let cachedProfile: LinkedInBasicProfile | null = null;

/**
 * Custom error class for LinkedIn API errors
 */
export class LinkedInAPIError extends Error {
  public readonly type: LinkedInAPIErrorType;
  public readonly statusCode?: number;
  public readonly retryAfter?: number;

  constructor(
    message: string,
    type: LinkedInAPIErrorType = 'unknown',
    statusCode?: number,
    retryAfter?: number
  ) {
    super(message);
    this.name = 'LinkedInAPIError';
    this.type = type;
    this.statusCode = statusCode;
    this.retryAfter = retryAfter;
  }
}

/**
 * Set access token in memory
 */
export function setAccessToken(token: string, expiresIn: number): void {
  accessToken = token;
  tokenExpiresAt = Date.now() + (expiresIn * 1000);
  console.log('[LinkedIn API] Token set in memory (expires in', expiresIn, 'seconds)');
}

/**
 * Get access token if valid
 */
export function getAccessToken(): string | null {
  if (!accessToken || !tokenExpiresAt) {
    return null;
  }
  
  // Check if token is expired (with 60-second buffer)
  if (Date.now() >= tokenExpiresAt - 60000) {
    console.log('[LinkedIn API] Token expired or expiring soon');
    clearTokens();
    return null;
  }
  
  return accessToken;
}

/**
 * Check if token is valid and not expired
 */
export function isTokenValid(): boolean {
  return getAccessToken() !== null;
}

/**
 * Clear all tokens from memory
 */
export function clearTokens(): void {
  accessToken = null;
  tokenExpiresAt = null;
  cachedProfile = null;
  console.log('[LinkedIn API] Tokens cleared from memory');
}

/**
 * Get current connection state
 */
export function getConnectionState(): LinkedInConnectionState {
  const token = getAccessToken();
  
  if (!token) {
    return {
      isConnected: false,
      scopes: [],
    };
  }
  
  return {
    isConnected: true,
    connectedAt: new Date().toISOString(),
    expiresAt: tokenExpiresAt ? new Date(tokenExpiresAt).toISOString() : undefined,
    scopes: ['openid', 'profile', 'email'],
    profile: cachedProfile || undefined,
  };
}

/**
 * LinkedIn API Client Class
 * 
 * Provides methods for interacting with LinkedIn API
 * with automatic token handling and error management.
 */
export class LinkedInAPIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = LINKEDIN_API_BASE;
  }

  /**
   * Make authenticated request to LinkedIn API
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<unknown> {
    const token = getAccessToken();
    
    if (!token) {
      throw new LinkedInAPIError(
        'Not authenticated with LinkedIn. Please connect your account.',
        'auth_error',
        401
      );
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new LinkedInAPIError(
          'Rate limit exceeded. Please try again later.',
          'rate_limit',
          429,
          retryAfter ? parseInt(retryAfter, 10) : undefined
        );
      }
      
      // Handle authentication errors
      if (response.status === 401) {
        clearTokens();
        throw new LinkedInAPIError(
          'LinkedIn session expired. Please reconnect your account.',
          'auth_error',
          401
        );
      }
      
      // Handle not found
      if (response.status === 404) {
        throw new LinkedInAPIError(
          'Resource not found.',
          'not_found',
          404
        );
      }
      
      // Handle permission errors
      if (response.status === 403) {
        throw new LinkedInAPIError(
          'Permission denied. Your LinkedIn account may not have access to this resource.',
          'permission_denied',
          403
        );
      }
      
      // Handle server errors
      if (response.status >= 500) {
        throw new LinkedInAPIError(
          'LinkedIn API error. Please try again later.',
          'server_error',
          response.status
        );
      }
      
      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new LinkedInAPIError(
          errorData.message || `Request failed: ${response.status}`,
          'unknown',
          response.status
        );
      }
      
      // Return null for 204 No Content
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      // Re-throw LinkedInAPIError instances
      if (error instanceof LinkedInAPIError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new LinkedInAPIError(
          'Network error. Please check your connection.',
          'network_error'
        );
      }
      
      throw new LinkedInAPIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'unknown'
      );
    }
  }

  /**
   * Fetch basic profile using OpenID Connect userinfo endpoint
   * This is available without Partner Program access
   */
  async fetchBasicProfile(): Promise<LinkedInBasicProfile> {
    // Return mock data in mock mode
    if (MOCK_MODE) {
      console.log('[LinkedIn API] Returning mock profile data');
      const mockProfile: LinkedInBasicProfile = {
        id: 'mock-linkedin-id',
        firstName: 'John',
        lastName: 'Doe',
        headline: 'Senior Software Engineer',
        profilePictureUrl: 'https://example.com/avatar.jpg',
        vanityName: 'johndoe',
      };
      cachedProfile = mockProfile;
      return mockProfile;
    }

    try {
      // Use OpenID Connect userinfo endpoint (available with 'profile' scope)
      const data = await this.makeRequest(LINKEDIN_USERINFO_ENDPOINT) as {
        sub: string;
        name?: string;
        given_name?: string;
        family_name?: string;
        picture?: string;
        preferred_username?: string;
      };

      // Map OpenID Connect claims to our profile structure
      // Note: headline is not available via userinfo, requires additional API call
      const profile: LinkedInBasicProfile = {
        id: data.sub,
        firstName: data.given_name || data.name?.split(' ')[0] || '',
        lastName: data.family_name || data.name?.split(' ').slice(1).join(' ') || '',
        profilePictureUrl: data.picture,
        vanityName: data.preferred_username,
        // Headline requires additional API permissions
        headline: undefined,
      };

      cachedProfile = profile;
      return profile;
    } catch (error) {
      console.error('[LinkedIn API] Failed to fetch basic profile:', error);
      
      // Graceful degradation: return partial data if available
      if (cachedProfile) {
        console.log('[LinkedIn API] Returning cached profile');
        return cachedProfile;
      }
      
      throw error;
    }
  }

  /**
   * Fetch email address
   * Requires 'email' scope
   */
  async fetchEmail(): Promise<string | null> {
    if (MOCK_MODE) {
      return 'john.doe@example.com';
    }

    try {
      const data = await this.makeRequest(LINKEDIN_USERINFO_ENDPOINT) as {
        email?: string;
        email_verified?: boolean;
      };

      return data.email || null;
    } catch (error) {
      console.warn('[LinkedIn API] Failed to fetch email:', error);
      return null;
    }
  }

  /**
   * Fetch full profile with mapping information
   * 
   * Note: Without Partner Program access, this is limited to basic info.
   * Full work history, education, and skills require Partner Program approval.
   */
  async fetchFullProfile(): Promise<LinkedInProfile> {
    // Fetch basic profile and email in parallel
    const [basicProfile, email] = await Promise.all([
      this.fetchBasicProfile(),
      this.fetchEmail(),
    ]);

    // Build mapped fields information
    // This tracks what was successfully imported vs skipped
    const mappedFields: LinkedInProfile['mappedFields'] = {
      personal: {
        name: !!(basicProfile.firstName && basicProfile.lastName),
        title: !!basicProfile.headline,
        email: !!email,
      },
      // Without Partner Program, these are always 0
      experience: { imported: 0, total: 0 },
      education: { imported: 0, total: 0 },
      skills: { imported: 0, total: 0 },
    };

    return {
      basic: basicProfile,
      email: email || undefined,
      mappedFields,
      rawData: {},
    };
  }

  /**
   * Disconnect from LinkedIn
   * Clears tokens and optionally revokes on LinkedIn side
   */
  async disconnect(): Promise<void> {
    if (!accessToken) {
      return;
    }

    // Try to revoke token on LinkedIn side (best effort)
    try {
      // LinkedIn doesn't have a standard revocation endpoint
      // We just clear our local tokens
      console.log('[LinkedIn API] Disconnecting from LinkedIn');
    } catch (error) {
      console.warn('[LinkedIn API] Token revocation failed (non-critical):', error);
    }

    // Always clear local tokens
    clearTokens();
  }
}

// Create singleton instance
const linkedInClient = new LinkedInAPIClient();

/**
 * Fetch basic profile (convenience function using singleton)
 */
export async function fetchBasicProfile(): Promise<LinkedInBasicProfile> {
  return linkedInClient.fetchBasicProfile();
}

/**
 * Disconnect from LinkedIn (convenience function using singleton)
 */
export async function disconnectLinkedIn(): Promise<void> {
  return linkedInClient.disconnect();
}

/**
 * Check if currently connected to LinkedIn
 */
export function isLinkedInConnected(): boolean {
  return isTokenValid();
}

// Export singleton for advanced use cases
export { linkedInClient };
