import { AnalyticsEvent, EventProperties } from './events';

export interface AnalyticsProvider {
  track(event: string, properties?: EventProperties): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(name: string, properties?: EventProperties): void;
}

// Console provider for development
class ConsoleProvider implements AnalyticsProvider {
  track(event: string, properties?: EventProperties): void {
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, properties);
    }
  }
  
  identify(userId: string): void {
    if (import.meta.env.DEV) {
      console.log('[Analytics] Identify:', userId);
    }
  }
  
  page(name: string, properties?: EventProperties): void {
    if (import.meta.env.DEV) {
      console.log('[Analytics] Page:', name, properties);
    }
  }
}

let provider: AnalyticsProvider = new ConsoleProvider();

export function setAnalyticsProvider(newProvider: AnalyticsProvider): void {
  provider = newProvider;
}

/**
 * Track event - NO PII
 * Safe: metadata, types, counts
 * NEVER: content, names, emails
 */
export function trackEvent(
  event: AnalyticsEvent, 
  properties?: EventProperties
): void {
  // Sanitize: ensure no PII in properties
  const safeProperties = sanitizeProperties(properties);
  provider.track(event, safeProperties);
}

function sanitizeProperties(
  props?: EventProperties
): EventProperties | undefined {
  if (!props) return undefined;
  
  // Remove any potential PII fields
  const { 
    name, email, phone, address, // Remove contact info
    content, text, description,   // Remove content
    company, employer,            // Remove company names
    ...safe 
  } = props as Record<string, unknown>;
  
  return safe as EventProperties;
}

export function identifyUser(userId: string): void {
  // Only anonymous ID, never email or name
  provider.identify(userId);
}

export function trackPageView(
  pageName: string, 
  properties?: EventProperties
): void {
  provider.page(pageName, properties);
}
