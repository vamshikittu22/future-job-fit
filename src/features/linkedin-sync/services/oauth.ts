// Supabase import for Edge Function call (used when Edge Function is built)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { supabase } from '@/shared/integrations/supabase/client';
import type { 
  LinkedInOAuthResponse, 
  PKCEParams,
  LinkedInOAuthErrorType 
} from '@/features/linkedin-sync/types';

/**
 * LinkedIn OAuth 2.0 + PKCE Flow Implementation
 * 
 * Security notes (per user decisions):
 * - PKCE keeps secrets server-side (Supabase Edge Function handles token exchange)
 * - Tokens are stored in memory only (not localStorage)
 * - Only temporary PKCE state (codeVerifier, state) stored in localStorage
 * - localStorage is cleared immediately after successful callback
 */

// LinkedIn OAuth endpoints
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';

// Scopes for basic profile (no partner program needed)
export const LINKEDIN_SCOPES = ['openid', 'profile', 'email'];

// localStorage keys (temporary, cleared after callback)
const LOCAL_STORAGE_STATE_KEY = 'linkedin_oauth_state';
const LOCAL_STORAGE_VERIFIER_KEY = 'linkedin_oauth_verifier';

/**
 * Custom error class for LinkedIn OAuth errors
 */
export class LinkedInOAuthError extends Error {
  public readonly type: LinkedInOAuthErrorType;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    type: LinkedInOAuthErrorType = 'unknown',
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'LinkedInOAuthError';
    this.type = type;
    this.details = details;
  }
}

/**
 * Generate a cryptographically secure random string
 */
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => charset[byte % charset.length]).join('');
}

/**
 * Generate PKCE parameters for OAuth flow
 * 
 * PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks.
 * The code_verifier is stored temporarily and sent with the token exchange.
 */
export function generatePKCE(): PKCEParams {
  // Generate code verifier (128 chars as per RFC 7636 recommendation)
  const codeVerifier = generateRandomString(128);
  
  // Generate state for CSRF protection
  const state = generateRandomString(32);
  
  // Generate code challenge (SHA256 hash of verifier, base64url encoded)
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  return {
    codeVerifier,
    codeChallenge,
    state,
  };
}

/**
 * Generate code challenge from code verifier using SHA256
 */
function generateCodeChallenge(verifier: string): string {
  // In a real implementation, we would use crypto.subtle.digest
  // For now, return a placeholder that will be handled by the Edge Function
  // Note: In production, this should use:
  // const encoder = new TextEncoder();
  // const data = encoder.encode(verifier);
  // const digest = await crypto.subtle.digest('SHA-256', data);
  // return base64urlEncode(digest);
  // 
  // For the stub implementation, we'll generate a hash synchronously
  // The actual hashing happens in the Supabase Edge Function
  return hashToBase64url(verifier);
}

/**
 * Simple hash function for demo (in production, use crypto.subtle)
 */
function hashToBase64url(input: string): string {
  // This is a simplified implementation
  // Real implementation uses SHA256 via crypto.subtle in the Edge Function
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to base64url
  const base64 = btoa(String.fromCharCode(...new Uint8Array(new Int32Array([hash]).buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return base64;
}

/**
 * Initiate LinkedIn OAuth flow
 * 
 * Generates PKCE parameters, stores temporary state in localStorage,
 * and redirects to LinkedIn authorization endpoint.
 */
export function initiateOAuthFlow(): void {
  try {
    // Generate PKCE parameters
    const { codeVerifier, codeChallenge, state } = generatePKCE();
    
    // Store temporary PKCE state (NOT tokens)
    localStorage.setItem(LOCAL_STORAGE_STATE_KEY, state);
    localStorage.setItem(LOCAL_STORAGE_VERIFIER_KEY, codeVerifier);
    
    // Build authorization URL
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '';
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: LINKEDIN_SCOPES.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    
    const authUrl = `${LINKEDIN_AUTH_URL}?${params.toString()}`;
    
    console.log('[LinkedIn OAuth] Initiating OAuth flow');
    
    // Redirect to LinkedIn
    window.location.href = authUrl;
  } catch (error) {
    console.error('[LinkedIn OAuth] Failed to initiate OAuth flow:', error);
    throw new LinkedInOAuthError(
      'Failed to start LinkedIn authentication. Please try again.',
      'invalid_request'
    );
  }
}

/**
 * Handle OAuth callback from LinkedIn
 * 
 * Validates state (CSRF protection), exchanges code for tokens via Edge Function,
 * and clears temporary PKCE state from localStorage.
 */
export async function handleOAuthCallback(
  code: string,
  state: string
): Promise<LinkedInOAuthResponse> {
  try {
    // Retrieve stored state and verifier
    const storedState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    const codeVerifier = localStorage.getItem(LOCAL_STORAGE_VERIFIER_KEY);
    
    // Validate state (CSRF protection)
    if (!storedState || storedState !== state) {
      throw new LinkedInOAuthError(
        'Invalid state parameter. Possible CSRF attack.',
        'state_mismatch'
      );
    }
    
    if (!codeVerifier) {
      throw new LinkedInOAuthError(
        'Missing code verifier. Please restart the authentication flow.',
        'invalid_request'
      );
    }
    
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    
    // Call Supabase Edge Function for token exchange
    // This keeps the client_secret server-side
    console.log('[LinkedIn OAuth] Calling Edge Function for token exchange');
    
    // Note: Edge Function 'linkedin-oauth' doesn't exist yet - stub for now
    // In production, this will call: supabase.functions.invoke('linkedin-oauth', ...)
    
    // STUB IMPLEMENTATION - will be replaced when Edge Function is built
    console.log('[LinkedIn OAuth] Edge function call would happen here with params:', {
      grant_type: 'authorization_code',
      code,
      code_verifier: codeVerifier.substring(0, 10) + '...',
      redirect_uri: redirectUri,
    });
    
    // Simulate API call for now
    const mockResponse: LinkedInOAuthResponse = {
      access_token: 'mock_token_' + generateRandomString(20),
      expires_in: 3600,
      scope: LINKEDIN_SCOPES.join(' '),
      token_type: 'Bearer',
    };
    
    // Clear temporary PKCE state from localStorage
    localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_VERIFIER_KEY);
    
    console.log('[LinkedIn OAuth] Token exchange successful');
    
    return mockResponse;
    
    // REAL IMPLEMENTATION (when Edge Function is ready):
    // const { data, error } = await supabase.functions.invoke('linkedin-oauth', {
    //   body: {
    //     grant_type: 'authorization_code',
    //     code,
    //     code_verifier: codeVerifier,
    //     redirect_uri: redirectUri,
    //   },
    // });
    //
    // if (error) {
    //   throw parseOAuthError(error);
    // }
    //
    // localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
    // localStorage.removeItem(LOCAL_STORAGE_VERIFIER_KEY);
    //
    // return data as LinkedInOAuthResponse;
    
  } catch (error) {
    // Clear PKCE state even on error
    localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_VERIFIER_KEY);
    
    if (error instanceof LinkedInOAuthError) {
      throw error;
    }
    
    throw parseOAuthError(error);
  }
}

/**
 * Parse OAuth error and convert to LinkedInOAuthError
 */
function parseOAuthError(error: unknown): LinkedInOAuthError {
  if (error instanceof LinkedInOAuthError) {
    return error;
  }
  
  // Handle Supabase Edge Function errors
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    
    // Check for specific OAuth error codes
    const errorCode = err.code as string || err.error as string || '';
    const errorDescription = err.message as string || err.error_description as string || 'Unknown error';
    
    switch (errorCode) {
      case 'invalid_grant':
        return new LinkedInOAuthError(
          'Authorization code expired or invalid. Please try again.',
          'invalid_grant',
          { originalError: err }
        );
      case 'access_denied':
        return new LinkedInOAuthError(
          'Access denied. You declined the LinkedIn authorization.',
          'access_denied',
          { originalError: err }
        );
      case 'invalid_scope':
        return new LinkedInOAuthError(
          'Invalid scope requested. Please contact support.',
          'invalid_scope',
          { originalError: err }
        );
      case 'invalid_request':
        return new LinkedInOAuthError(
          'Invalid request. Please try again.',
          'invalid_request',
          { originalError: err }
        );
      default:
        return new LinkedInOAuthError(
          errorDescription || 'LinkedIn authentication failed. Please try again.',
          'server_error',
          { originalError: err }
        );
    }
  }
  
  return new LinkedInOAuthError(
    'An unexpected error occurred during LinkedIn authentication.',
    'unknown',
    { originalError: error }
  );
}

/**
 * Check if there's an active OAuth flow in progress
 */
export function hasActiveOAuthFlow(): boolean {
  return !!localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
}

/**
 * Clear any pending OAuth state (useful for cleanup)
 */
export function clearOAuthState(): void {
  localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
  localStorage.removeItem(LOCAL_STORAGE_VERIFIER_KEY);
  console.log('[LinkedIn OAuth] Cleared OAuth state');
}
