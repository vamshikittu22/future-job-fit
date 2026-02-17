/**
 * Layout Detection Types
 * 
 * TypeScript types for DOM-based layout analysis that identifies
 * ATS-risky structures in resume previews.
 */

/** Risk severity levels for layout elements */
export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

/** ATS platform types that may have specific layout issues */
export type PlatformType = 
  | 'WORKDAY' 
  | 'TALEO' 
  | 'GREENHOUSE' 
  | 'LEVER' 
  | 'ICIMS' 
  | 'SAP';

/** Layout column types for column detection */
export type ColumnType = 'grid' | 'flex' | 'float';

/** Header/footer element types */
export type HeaderFooterType = 'header' | 'footer' | 'fixed' | 'repeated';

/** Position for header/footer detection */
export type PositionType = 'top' | 'bottom';

/**
 * Risk assessment for a table element
 */
export interface TableRisk {
  /** The table element being analyzed */
  element: HTMLTableElement;
  /** Severity level of the risk */
  severity: RiskLevel;
  /** Whether this table is nested inside another table */
  isNested: boolean;
  /** Whether this appears to be a layout table vs data table */
  isLayoutTable: boolean;
  /** Number of rows in the table */
  rowCount: number;
  /** Number of columns in the table */
  colCount: number;
  /** Human-readable description of the risk */
  message: string;
  /** Platforms affected by this table */
  platformsAffected: PlatformType[];
  /** Quality penalty factor (0-1, e.g., 0.4 for Workday) */
  qualityPenalty: number;
}

/**
 * Risk assessment for a column layout
 */
export interface ColumnRisk {
  /** The element containing columns */
  element: HTMLElement;
  /** Severity level of the risk */
  severity: RiskLevel;
  /** Type of column layout (grid/flex/float) */
  type: ColumnType;
  /** Number of columns detected */
  columnCount: number;
  /** Human-readable description of the risk */
  message: string;
  /** Platforms affected by this column layout */
  platformsAffected: PlatformType[];
  /** Quality penalty factor (0-1) */
  qualityPenalty: number;
}

/**
 * Risk assessment for header/footer elements
 */
export interface HeaderFooterRisk {
  /** The header/footer element */
  element: HTMLElement;
  /** Severity level of the risk */
  severity: RiskLevel;
  /** Type of element (header/footer/fixed/repeated) */
  type: HeaderFooterType;
  /** Position (top for header, bottom for footer) */
  position: PositionType;
  /** Whether element uses fixed/sticky positioning */
  isFixed: boolean;
  /** Detected content (truncated for display) */
  content: string;
  /** Human-readable description of the risk */
  message: string;
  /** Platforms affected by this header/footer */
  platformsAffected: PlatformType[];
}

/**
 * Options for configuring layout detection
 */
export interface LayoutDetectorOptions {
  /** CSS selector for the container to analyze */
  containerSelector?: string;
  /** Whether to check for tables */
  checkTables?: boolean;
  /** Whether to check for column layouts */
  checkColumns?: boolean;
  /** Whether to check for headers/footers */
  checkHeaderFooter?: boolean;
  /** Viewport height for pagination detection */
  viewportHeight?: number;
}

/**
 * Complete layout analysis result
 */
export interface LayoutAnalysis {
  /** Timestamp of when analysis was performed */
  timestamp: number;
  /** The container element that was analyzed */
  element: HTMLElement;
  /** Array of table risks found */
  tables: TableRisk[];
  /** Array of column risks found */
  columns: ColumnRisk[];
  /** Array of header/footer risks found */
  headerFooter: HeaderFooterRisk[];
  /** Overall risk level (highest severity found) */
  overallRisk: RiskLevel;
  /** Risk score from 0-100 (higher = more risky) */
  riskScore: number;
}
