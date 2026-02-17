import {
  TableRisk,
  ColumnRisk,
  HeaderFooterRisk,
  LayoutAnalysis,
  LayoutDetectorOptions,
  RiskLevel,
  PlatformType
} from './types';

/**
 * Detects all tables in the container and assesses their ATS risk
 * 
 * @param container - The HTML element to analyze for tables
 * @returns Array of TableRisk objects with severity assessments
 */
export function detectTables(container: HTMLElement): TableRisk[] {
  const tables = container.querySelectorAll('table');
  
  return Array.from(tables).map(table => {
    // Check if nested inside another table
    const isNested = table.closest('table') !== null;
    
    // Determine if layout table vs data table
    // Layout tables: single row, many cols, minimal styling
    const isLayoutTable = detectLayoutTable(table);
    
    // Calculate severity based on table characteristics
    let severity: RiskLevel = 'low';
    if (isNested) severity = 'critical';
    else if (isLayoutTable) severity = 'high';
    else if (table.rows.length > 5) severity = 'medium';
    
    // Determine affected platforms from research
    const platformsAffected: PlatformType[] = ['WORKDAY', 'TALEO', 'ICIMS'];
    if (isNested) platformsAffected.push('GREENHOUSE', 'LEVER');
    
    return {
      element: table,
      severity,
      isNested,
      isLayoutTable,
      rowCount: table.rows.length,
      colCount: table.rows[0]?.cells.length || 0,
      message: generateTableMessage(severity, isNested, isLayoutTable),
      platformsAffected,
      qualityPenalty: isNested ? 0.6 : isLayoutTable ? 0.4 : 0.2
    };
  });
}

/**
 * Detects if a table is being used for layout (not data)
 * 
 * Layout tables typically:
 * - Few rows (often 1-2)
 * - Many columns
 * - No th elements (no headers)
 * - Used for page layout
 * 
 * @param table - The table element to analyze
 * @returns True if the table appears to be a layout table
 */
function detectLayoutTable(table: HTMLTableElement): boolean {
  const hasNoHeaders = table.querySelectorAll('th').length === 0;
  const hasFewRows = table.rows.length <= 2;
  const hasManyCols = table.rows[0]?.cells.length > 3;
  
  return hasNoHeaders && hasFewRows && hasManyCols;
}

/**
 * Generates a user-friendly message describing the table risk
 * 
 * @param severity - The risk severity level
 * @param isNested - Whether the table is nested
 * @param isLayoutTable - Whether it's a layout table
 * @returns Human-readable risk message
 */
function generateTableMessage(
  severity: RiskLevel, 
  isNested: boolean, 
  isLayoutTable: boolean
): string {
  if (isNested) {
    return 'Nested tables detected - critical ATS parsing risk. Tables inside tables cause severe parsing failures in most ATS systems.';
  }
  
  if (isLayoutTable) {
    return 'Layout table detected - high risk. Using tables for layout (instead of data) causes 40% quality reduction in Workday and similar systems.';
  }
  
  if (severity === 'medium') {
    return 'Large data table detected - moderate risk. Complex tables may not render correctly in all ATS platforms.';
  }
  
  return 'Table detected - low risk. Simple data tables are generally ATS-compatible.';
}

/**
 * Detects column layouts in the container and assesses their ATS risk
 * 
 * Identifies CSS Grid (low risk), Flexbox row (medium risk), and 
 * Float-based columns (high risk).
 * 
 * @param container - The HTML element to analyze for columns
 * @returns Array of ColumnRisk objects with severity assessments
 */
export function detectColumns(container: HTMLElement): ColumnRisk[] {
  const risks: ColumnRisk[] = [];
  
  // Check all potential column containers
  const elements = container.querySelectorAll('*');
  
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    
    // CSS Grid columns
    if (style.display === 'grid') {
      const colCount = style.gridTemplateColumns.split(' ').length;
      if (colCount > 1) {
        risks.push({
          element: el as HTMLElement,
          severity: 'low', // Grid is most ATS-friendly
          type: 'grid',
          columnCount: colCount,
          message: `CSS Grid with ${colCount} columns detected - low risk`,
          platformsAffected: ['TALEO'],
          qualityPenalty: 0.1
        });
      }
    }
    
    // Flexbox row with multiple children
    if (style.display === 'flex' && style.flexDirection === 'row') {
      const childCount = el.children.length;
      if (childCount > 1) {
        risks.push({
          element: el as HTMLElement,
          severity: 'medium',
          type: 'flex',
          columnCount: childCount,
          message: `Flexbox row with ${childCount} items may cause text concatenation issues`,
          platformsAffected: ['WORKDAY', 'TALEO', 'ICIMS'],
          qualityPenalty: 0.25
        });
      }
    }
    
    // Float-based columns (legacy, high risk)
    const hasFloatChildren = Array.from(el.children).some(
      child => window.getComputedStyle(child).float !== 'none'
    );
    if (hasFloatChildren) {
      risks.push({
        element: el as HTMLElement,
        severity: 'high',
        type: 'float',
        columnCount: 2, // Usually 2-column float layouts
        message: 'Float-based columns detected (legacy layout, high ATS risk)',
        platformsAffected: ['WORKDAY', 'TALEO', 'GREENHOUSE', 'ICIMS'],
        qualityPenalty: 0.4
      });
    }
  });
  
  return risks;
}

/**
 * Detects header and footer elements with fixed/sticky positioning
 * 
 * Fixed headers and footers may cause content duplication issues
 * when resumes are paginated by ATS systems.
 * 
 * @param container - The HTML element to analyze for headers/footers
 * @returns Array of HeaderFooterRisk objects with severity assessments
 */
export function detectHeaderFooter(container: HTMLElement): HeaderFooterRisk[] {
  const risks: HeaderFooterRisk[] = [];
  const viewportHeight = window.innerHeight;
  
  // Check for fixed/sticky positioned elements
  const fixedElements = container.querySelectorAll(
    '[style*="position: fixed"], [style*="position:sticky"], .fixed, .sticky'
  );
  
  fixedElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const isFixed = style.position === 'fixed' || style.position === 'sticky';
    
    if (!isFixed) return;
    
    // Position-based detection
    const isHeader = rect.top < 100;
    const isFooter = rect.bottom > viewportHeight - 100;
    
    if (isHeader || isFooter) {
      risks.push({
        element: el as HTMLElement,
        severity: 'high',
        type: isHeader ? 'header' : 'footer',
        position: isHeader ? 'top' : 'bottom',
        isFixed: true,
        content: el.textContent?.trim().substring(0, 100) || '',
        message: `${isHeader ? 'Header' : 'Footer'} with fixed positioning may duplicate across pages`,
        platformsAffected: ['WORKDAY', 'TALEO', 'ICIMS']
      });
    }
  });
  
  return risks;
}
