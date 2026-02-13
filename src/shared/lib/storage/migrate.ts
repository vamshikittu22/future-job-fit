/**
 * Sequential Migration Framework
 * 
 * Provides sequential chain migration with mandatory backups.
 * Uses sequential chain (v1 → v2 → v3) NOT range filtering.
 * 
 * Safety Rules:
 * 1. Backup created BEFORE every migration
 * 2. Never mutate original object
 * 3. Always return new object
 * 4. Log migration in dev mode
 * 5. Fail loudly in dev mode
 */

import type { StorageVersion } from './schemaVersion';

export interface Migration<TFrom, TTo> {
  fromVersion: number;
  toVersion: number;
  name: string;
  migrate: (data: TFrom) => TTo;
}

export class MigrationError extends Error {
  constructor(
    message: string,
    public readonly fromVersion: number,
    public readonly toVersion: number
  ) {
    super(message);
    this.name = 'MigrationError';
  }
}

// Migration registry - stores all registered migrations
const migrations: Migration<unknown, unknown>[] = [];

/**
 * Register a migration in the global registry
 * @param migration - The migration to register
 * @throws Error if migration from this version already exists
 */
export function registerMigration<TFrom, TTo>(
  migration: Migration<TFrom, TTo>
): void {
  // Validate no duplicates
  const exists = migrations.find(
    m => m.fromVersion === migration.fromVersion
  );
  if (exists) {
    throw new Error(
      `Migration from v${migration.fromVersion} already registered`
    );
  }
  // Type-safe cast to unknown variant for storage
  migrations.push(migration as Migration<unknown, unknown>);
}

/**
 * Get all registered migrations (for testing/debugging)
 * @returns array of registered migrations
 */
export function getRegisteredMigrations(): Migration<unknown, unknown>[] {
  return [...migrations];
}

/**
 * Clear all registered migrations (mainly for testing)
 */
export function clearMigrations(): void {
  migrations.length = 0;
}

/**
 * Build sequential migration path using chain approach
 * NOT range filter — sequential chain only: v1 → v2 → v3 → vCurrent
 * 
 * @param fromVersion - starting version
 * @param toVersion - target version
 * @returns array of migrations to run in sequence
 * @throws MigrationError if migration path cannot be built
 */
export function buildMigrationPath(
  fromVersion: number,
  toVersion: number
): Migration<unknown, unknown>[] {
  if (fromVersion >= toVersion) {
    return []; // No migration needed
  }

  let currentVersion = fromVersion;
  const path: Migration<unknown, unknown>[] = [];

  while (currentVersion < toVersion) {
    const next = migrations.find(
      m => m.fromVersion === currentVersion
    );

    if (!next) {
      throw new MigrationError(
        `No migration path from v${currentVersion} to v${currentVersion + 1}`,
        currentVersion,
        toVersion
      );
    }

    path.push(next);
    currentVersion = next.toVersion;
  }

  return path;
}

/**
 * Create a backup of data before migration
 * @param key - original storage key
 * @param rawData - raw string data to backup
 * @param version - version being backed up
 * @returns the backup key created
 */
export function createMigrationBackup(
  key: string,
  rawData: string,
  version: number
): string {
  const backupKey = `${key}_backup_v${version}_${Date.now()}`;
  localStorage.setItem(backupKey, rawData);
  
  if (import.meta.env.DEV) {
    console.log(`[Migration] Backup created: ${backupKey}`);
  }
  
  return backupKey;
}

/**
 * Run migration with MANDATORY backup
 * 
 * @param key - storage key (for backup naming)
 * @param rawData - raw JSON string from storage
 * @param fromVersion - current version of data
 * @param toVersion - target version
 * @returns migrated data object (unwrapped, no version metadata)
 * @throws MigrationError if migration fails
 */
export function runMigration<T>(
  key: string,
  rawData: string,
  fromVersion: number,
  toVersion: number
): T {
  // CRITICAL: Create backup BEFORE migration
  createMigrationBackup(key, rawData, fromVersion);

  const path = buildMigrationPath(fromVersion, toVersion);
  
  if (path.length === 0) {
    // Parse and return without migration
    const parsed = JSON.parse(rawData);
    return (parsed.data ?? parsed) as T;
  }

  // Start with the data portion (unwrap if versioned)
  let parsed = JSON.parse(rawData);
  let current: unknown = parsed.data ?? parsed;

  for (const migration of path) {
    try {
      if (import.meta.env.DEV) {
        console.log(`[Migration] Running: v${migration.fromVersion} → v${migration.toVersion} (${migration.name})`);
      }
      
      // CRITICAL: Never mutate original — migrate returns NEW object
      current = migration.migrate(current);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new MigrationError(
        `Migration v${migration.fromVersion}→v${migration.toVersion} failed: ${errorMessage}`,
        migration.fromVersion,
        migration.toVersion
      );
    }
  }

  return current as T;
}

/**
 * Check if migration is needed
 * @param currentVersion - current storage version
 * @param targetVersion - target version (defaults to CURRENT)
 * @returns true if migration is required
 */
export function needsMigration(
  currentVersion: number,
  targetVersion: number
): boolean {
  return currentVersion < targetVersion;
}

/**
 * Get available migration versions
 * @returns sorted array of fromVersions that have migrations
 */
export function getAvailableMigrations(): number[] {
  return migrations
    .map(m => m.fromVersion)
    .sort((a, b) => a - b);
}
