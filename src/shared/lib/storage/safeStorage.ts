import { compress, decompress } from './compression';
import { checkQuota, getQuotaStatus } from './quota';

/**
 * Safe storage wrapper with compression and quota checking
 */

export function setItemCompressed(key: string, value: string): void {
  const compressed = compress(value);
  const check = checkQuota(new Blob([compressed]).size);
  
  if (!check.allowed) {
    throw new Error(`Storage quota exceeded: ${check.reason}`);
  }
  
  localStorage.setItem(key, compressed);
}

export function getItemCompressed(key: string): string | null {
  const compressed = localStorage.getItem(key);
  if (!compressed) return null;
  return decompress(compressed);
}

/**
 * Load with migration support - tries compressed first, falls back to raw
 * This handles the transition from uncompressed to compressed storage
 */
export function getItemWithMigration(key: string): string | null {
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  // Try decompression first (handles compressed data)
  try {
    return decompress(data);
  } catch {
    // If decompression fails, might be uncompressed legacy data
    // Return as-is for backward compatibility
    return data;
  }
}
