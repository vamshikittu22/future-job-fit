import { compress, decompress } from './compression';
import { checkQuota, getQuotaStatus } from './quota';
import { 
  wrapVersioned, 
  getStorageVersion, 
  isVersionSupported, 
  STORAGE_VERSION 
} from './schemaVersion';
import { runMigration, MigrationError } from './migrate';

/**
 * Safe storage wrapper with compression, quota checking, and schema versioning
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
 * Load with compression migration support - tries compressed first, falls back to raw
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

/**
 * Save data with schema versioning and compression
 * Wraps data with version metadata before compression
 * 
 * @param key - storage key
 * @param data - data to save
 * @param version - optional version override (defaults to CURRENT)
 */
export function setItemVersioned<T>(
  key: string, 
  data: T, 
  version: number = STORAGE_VERSION.CURRENT
): void {
  // Wrap with version metadata
  const versioned = wrapVersioned(data, version);
  
  // Serialize and compress
  const serialized = JSON.stringify(versioned);
  const compressed = compress(serialized);
  
  // Check quota before saving
  const quotaCheck = checkQuota(new Blob([compressed]).size);
  if (!quotaCheck.allowed) {
    throw new Error(`Storage quota exceeded: ${quotaCheck.reason}`);
  }
  
  localStorage.setItem(key, compressed);
  
  // Dev mode logging
  if (import.meta.env.DEV) {
    const status = getQuotaStatus();
    console.log(
      `[Storage] Saved ${key}: v${version}, ` +
      `${formatBytes(status.used)} / ${formatBytes(status.total)} ` +
      `(${status.percentUsed.toFixed(1)}%)`
    );
  }
}

/**
 * Load data with schema migration and decompression
 * Automatically migrates data from older versions to current
 * 
 * @param key - storage key
 * @returns parsed and migrated data, or null if not found
 * @throws MigrationError if migration fails
 */
export function getItemVersioned<T>(key: string): T | null {
  const compressed = localStorage.getItem(key);
  if (!compressed) return null;
  
  // Decompress
  let raw: string;
  try {
    raw = decompress(compressed);
  } catch {
    // Fallback to raw data (uncompressed legacy)
    raw = compressed;
  }
  
  // Get current version
  const currentVersion = getStorageVersion(key);
  
  // No version info - treat as legacy v1
  if (currentVersion === null) {
    try {
      const parsed = JSON.parse(raw);
      return parsed as T;
    } catch (error) {
      console.error(`[Storage] Failed to parse legacy data for ${key}:`, error);
      return null;
    }
  }
  
  // Check if version is supported
  if (!isVersionSupported(currentVersion)) {
    const error = new MigrationError(
      `Storage version ${currentVersion} not supported for ${key}`,
      currentVersion,
      STORAGE_VERSION.CURRENT
    );
    
    if (import.meta.env.DEV) {
      console.error(`[Storage] ${error.message}`);
      throw error;
    }
    
    // In production, return null gracefully
    console.warn(`[Storage] Unsupported version ${currentVersion} for ${key}, returning null`);
    return null;
  }
  
  // Current version - parse and return
  if (currentVersion === STORAGE_VERSION.CURRENT) {
    try {
      const parsed = JSON.parse(raw);
      return parsed.data as T;
    } catch (error) {
      console.error(`[Storage] Failed to parse versioned data for ${key}:`, error);
      return null;
    }
  }
  
  // Migration needed
  try {
    const migrated = runMigration<T>(
      key,
      raw,
      currentVersion,
      STORAGE_VERSION.CURRENT
    );
    
    // Dev mode logging
    if (import.meta.env.DEV) {
      console.log(
        `[Storage] Migrated ${key}: v${currentVersion} → v${STORAGE_VERSION.CURRENT}`
      );
    }
    
    return migrated;
  } catch (error) {
    if (error instanceof MigrationError) {
      console.error(`[Storage] Migration failed for ${key}:`, error.message);
      
      if (import.meta.env.DEV) {
        throw error;
      }
    } else {
      console.error(`[Storage] Unexpected error migrating ${key}:`, error);
    }
    return null;
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
