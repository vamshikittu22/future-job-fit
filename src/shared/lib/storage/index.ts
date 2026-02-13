// Storage utilities with compression, quota management, and schema versioning
export * from './compression';
export * from './quota';
export * from './safeStorage';
export * from './schemaVersion';
export * from './migrate';

// Import migrations to register them (side effects)
import './migrations/v1-to-v2';
