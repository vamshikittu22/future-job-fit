# Storage Schema Documentation

## Overview

The storage system uses schema versioning to safely evolve data structures over time without data loss. All stored data includes version metadata and can be automatically migrated when schemas change.

---

## Version History

| Version | Date | Changes | Migration |
|---------|------|---------|-----------|
| 1 | 2024-01 | Initial (unversioned) legacy format | - |
| 2 | 2024-02 | Added ATS optimization tracking fields | `v1-to-v2` |

---

## Storage Keys

### Primary Keys

| Key | Type | Description |
|-----|------|-------------|
| `resumeBuilderDraft` | `VersionedData<ResumeData>` | Current resume being edited |
| `resumeBuilderSnapshots` | `VersionedData<SavedVersion[]>` | Saved version history (max 20) |
| `fjf_job_data` | `VersionedData<JobData>` | Current job description draft |
| `fjf_saved_jobs` | `VersionedData<SavedJob[]>` | Saved job descriptions (max 50) |

### Backup Keys (Auto-generated)

| Pattern | Description |
|---------|-------------|
| `{key}_backup_v{version}_{timestamp}` | Automatic backup before migration |

---

## Data Format

All data is stored as `VersionedData<T>`:

```typescript
interface VersionedData<T> {
  version: number;           // Schema version (starts at 1)
  migratedAt?: string;       // ISO timestamp of last migration
  data: T;                   // Actual payload
}
```

### Example

```json
{
  "version": 2,
  "migratedAt": "2024-02-12T10:30:00Z",
  "data": {
    "personal": { ... },
    "experience": [ ... ],
    "atsOptimized": false,
    "lastOptimizedAt": null
  }
}
```

---

## Migration Process

### How It Works

1. **Read** version from storage using `getStorageVersion(key)`
2. **Check** if version is supported with `isVersionSupported(version)`
3. **Migrate** if needed using sequential chain:
   - Create backup: `{key}_backup_v{version}_{timestamp}`
   - Run migrations in order: v1 → v2 → v3
   - Return migrated data
4. **Save** with new version using `setItemVersioned()`

### Sequential Chain (NOT Range Filter)

```
v1 → v2 → v3 → vCurrent
```

Each migration must be sequential. No skipping versions allowed.

### Safety Rules

- ✅ Backup created BEFORE every migration
- ✅ Never mutate original object (always return new)
- ✅ Fail loudly in dev mode
- ✅ No silent failures in production (return null)
- ✅ Sequential chain only (no version skipping)

---

## Creating a New Migration

### 1. Define Type Changes

```typescript
// src/shared/lib/storage/migrations/v2-to-v3.ts

interface ResumeDataV2 extends ResumeData {
  atsOptimized: boolean;
}

interface ResumeDataV3 extends ResumeData {
  atsOptimized: boolean;
  optimizationScore: number;
  optimizationSuggestions: string[];
}
```

### 2. Register Migration

```typescript
import { registerMigration } from '../migrate';

registerMigration<ResumeDataV2, ResumeDataV3>({
  fromVersion: 2,
  toVersion: 3,
  name: 'add-optimization-scoring',
  migrate: (v2) => {
    // Return NEW object, never mutate v2
    return {
      ...v2,
      optimizationScore: 0,
      optimizationSuggestions: []
    };
  }
});
```

### 3. Update Storage Version

```typescript
// src/shared/lib/storage/schemaVersion.ts

export const STORAGE_VERSION = {
  CURRENT: 3,      // Increment this
  MIN_SUPPORTED: 1,
} as const;
```

### 4. Import Migration

```typescript
// src/shared/lib/storage/index.ts

// Import migrations to register them (side effects)
import './migrations/v1-to-v2';
import './migrations/v2-to-v3';  // Add new import
```

### 5. Update Documentation

Add entry to Version History table in this file.

---

## API Reference

### Schema Version Functions

```typescript
// Get version of stored data
getStorageVersion(key: string): number | null

// Check if version is supported
isVersionSupported(version: number): boolean

// Wrap data with version metadata
wrapVersioned<T>(data: T, version?: number): VersionedData<T>

// Unwrap versioned data
unwrapVersioned<T>(versioned: VersionedData<T>): T

// Type guard for versioned data
isVersioned<T>(value: unknown): value is VersionedData<T>
```

### Migration Functions

```typescript
// Register a migration
registerMigration<TFrom, TTo>(migration: Migration<TFrom, TTo>): void

// Build sequential migration path
buildMigrationPath(fromVersion: number, toVersion: number): Migration[]

// Run migration with mandatory backup
runMigration<T>(key: string, rawData: string, fromVersion: number, toVersion: number): T

// Check if migration is needed
needsMigration(currentVersion: number, targetVersion: number): boolean
```

### Storage Functions

```typescript
// Save with versioning and compression
setItemVersioned<T>(key: string, data: T, version?: number): void

// Load with migration and decompression
getItemVersioned<T>(key: string): T | null

// Legacy functions (compression only)
setItemCompressed(key: string, value: string): void
getItemCompressed(key: string): string | null
getItemWithMigration(key: string): string | null
```

---

## Error Handling

### MigrationError

```typescript
class MigrationError extends Error {
  readonly fromVersion: number;
  readonly toVersion: number;
  
  constructor(message: string, fromVersion: number, toVersion: number);
}
```

### Behavior by Environment

| Scenario | Dev Mode | Production |
|----------|----------|------------|
| Unsupported version | Throw `MigrationError` | Return `null`, log warning |
| Migration failure | Throw `MigrationError` | Return `null`, log error |
| Parse failure | Throw error | Return `null`, log error |

---

## Testing Migrations

### Manual Testing

1. Save data in old format to localStorage
2. Update `STORAGE_VERSION.CURRENT`
3. Register migration
4. Reload app - migration should run automatically
5. Verify backup was created
6. Verify data migrated correctly

### Backup Recovery

```javascript
// To restore from backup
const backupKey = 'resumeBuilderDraft_backup_v1_1234567890123';
const backupData = localStorage.getItem(backupKey);
localStorage.setItem('resumeBuilderDraft', backupData);
```

---

## Migration Checklist

Before deploying a new migration:

- [ ] Migration returns NEW object (no mutation)
- [ ] Migration handles all edge cases (null, undefined, missing fields)
- [ ] `STORAGE_VERSION.CURRENT` incremented
- [ ] Migration imported in `storage/index.ts`
- [ ] Version History table updated
- [ ] Migration tested with real data
- [ ] Backup recovery tested

---

## Related Files

| File | Purpose |
|------|---------|
| `src/shared/lib/storage/schemaVersion.ts` | Version constants and helpers |
| `src/shared/lib/storage/migrate.ts` | Migration framework |
| `src/shared/lib/storage/safeStorage.ts` | Versioned storage functions |
| `src/shared/lib/storage/migrations/` | Migration definitions |
| `src/shared/contexts/ResumeContext.tsx` | Uses versioned storage |
| `src/shared/contexts/JobContext.tsx` | Uses versioned storage |

---

*Last updated: 2024-02-13*
