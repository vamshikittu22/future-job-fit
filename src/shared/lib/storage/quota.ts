/**
 * Storage quota utilities with correct byte-size calculation
 * 
 * NOTE: Uses Blob to calculate actual UTF-16 byte size, not string length.
 * This is critical for accurate localStorage quota monitoring.
 */

/**
 * Get actual byte size of localStorage (not string length)
 * CORRECT: Uses Blob to calculate real UTF-16 byte size
 */
export function getLocalStorageSize(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      // Blob calculates actual byte size, not character count
      total += new Blob([key + value]).size;
    }
  }
  return total;
}

export const STORAGE_QUOTA = 5 * 1024 * 1024; // 5MB
export const WARNING_THRESHOLD = 4 * 1024 * 1024; // 4MB

export interface QuotaStatus {
  used: number;
  total: number;
  remaining: number;
  percentUsed: number;
  warning: boolean;
  critical: boolean;
}

export function getQuotaStatus(): QuotaStatus {
  const used = getLocalStorageSize();
  const total = STORAGE_QUOTA;
  const remaining = total - used;
  const percentUsed = (used / total) * 100;
  
  return {
    used,
    total,
    remaining,
    percentUsed,
    warning: used > WARNING_THRESHOLD,
    critical: used > total * 0.95
  };
}

export function checkQuota(neededBytes: number): {
  allowed: boolean;
  reason?: string;
} {
  const status = getQuotaStatus();
  
  if (status.used + neededBytes > STORAGE_QUOTA) {
    return {
      allowed: false,
      reason: `Need ${neededBytes} bytes, only ${status.remaining} available`
    };
  }
  
  return { allowed: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}
