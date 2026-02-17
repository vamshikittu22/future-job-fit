/**
 * Storage Schema Versioning System
 * 
 * Provides version management for localStorage data to enable safe migrations
 * when data structures evolve. All stored data includes version metadata.
 */

export const STORAGE_VERSION = {
  CURRENT: 2,      // Increment on breaking changes
  MIN_SUPPORTED: 1,
} as const;

export type StorageVersion = number;

export interface VersionedData<T> {
  version: StorageVersion;
  migratedAt?: string;
  data: T;
}

/**
 * Get the version of stored data
 * @param key - localStorage key
 * @returns version number, or null if no data exists, or 1 for legacy unversioned data
 */
export function getStorageVersion(key: string): StorageVersion | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  
  try {
    const parsed = JSON.parse(raw);
    // Check if versioned format
    if (parsed && typeof parsed.version === 'number') {
      return parsed.version;
    }
    // Legacy unversioned data - treat as v1
    return 1;
  } catch {
    return 1;
  }
}

/**
 * Check if a storage version is supported
 * @param version - version number to check
 * @returns true if version can be migrated
 */
export function isVersionSupported(version: StorageVersion): boolean {
  return version >= STORAGE_VERSION.MIN_SUPPORTED && 
         version <= STORAGE_VERSION.CURRENT;
}

/**
 * Wrap data with version metadata
 * @param data - the data to wrap
 * @param version - version number (defaults to CURRENT)
 * @returns VersionedData with metadata
 */
export function wrapVersioned<T>(data: T, version: number = STORAGE_VERSION.CURRENT): VersionedData<T> {
  return {
    version,
    migratedAt: new Date().toISOString(),
    data
  };
}

/**
 * Unwrap versioned data, returning just the data portion
 * @param versioned - VersionedData object
 * @returns the data portion
 */
export function unwrapVersioned<T>(versioned: VersionedData<T>): T {
  return versioned.data;
}

/**
 * Check if data is in versioned format
 * @param value - any value to check
 * @returns true if value has versioned structure
 */
export function isVersioned<T>(value: unknown): value is VersionedData<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    typeof (value as VersionedData<T>).version === 'number' &&
    'data' in value
  );
}
