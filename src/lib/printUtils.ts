/**
 * Utility functions for handling print and PDF export
 */

type PrintOptions = {
  title?: string;
  styles?: string[];
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
};

export const printElement = (element: HTMLElement, options: PrintOptions = {}) => {
  const { title = 'Document', styles = [], onBeforePrint, onAfterPrint } = options;
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Unable to open print window. Please allow popups for this site.');
    return;
  }
  
  // Get all styles from the current document
  const allStyles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules || [])
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .filter(Boolean);
  
  // Create a clone of the element to avoid modifying the original
  const elementClone = element.cloneNode(true) as HTMLElement;
  
  // Create the print document
  const printDocument = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
            color: black;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-container {
            padding: 0;
            margin: 0;
            width: 100%;
            min-height: 100vh;
          }
          ${allStyles.join('\n')}
          ${styles.join('\n')}
          
          /* Ensure print styles are applied */
          @media print {
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              padding: 0;
              margin: 0;
            }
            .print-container {
              padding: 0;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${elementClone.outerHTML}
        </div>
        <script>
          // Wait for all resources to load before printing
          function triggerPrint() {
            // Force a reflow to ensure all styles are applied
            document.body.offsetHeight;
            
            // Remove any existing print event listeners to prevent duplicates
            const newOnAfterPrint = ${onAfterPrint ? `function() {
              ${onAfterPrint.toString().replace(/[\n\r]+/g, '')}
            }` : 'null'};
            
            window.onafterprint = function() {
              if (newOnAfterPrint) newOnAfterPrint();
              // Give it a moment before closing to ensure print is complete
              setTimeout(() => window.close(), 100);
            };
            
            // Trigger print
            window.print();
          }
          
          // Wait for all resources to load
          if (document.readyState === 'complete') {
            setTimeout(triggerPrint, 300);
          } else {
            window.addEventListener('load', () => {
              setTimeout(triggerPrint, 300);
            });
          }
        </script>
      </body>
    </html>
  `;
  
  // Call before print callback if provided
  if (onBeforePrint) {
    onBeforePrint();
  }
  
  // Write the document
  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
};

/**
 * Print the resume with proper styling
 */
export const printResume = (resumeElement: HTMLElement, name = 'Resume') => {
  const printStyles = [
    // Hide everything except the resume content
    `
    @media print {
      body > *:not(.print-container) {
        display: none !important;
      }
      .print-container {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      // Prevent breaking inside sections
      .section-container {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      // Allow breaking between sections
      .resume-content > div:not(:first-child) {
        page-break-before: auto;
        break-before: auto;
      }
    }
    `
  ];
  
  printElement(resumeElement, {
    title: `${name} - Resume`,
    styles: printStyles,
    onAfterPrint: () => {
      console.log('Print completed or cancelled');
    }
  });
};
