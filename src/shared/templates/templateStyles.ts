/**
 * Template Style Registry
 * 
 * Single source of truth for template styling across all export formats (PDF, DOCX, HTML, LaTeX).
 * All export generators should consume these style configurations to ensure visual consistency.
 */

/**
 * Color values without # prefix (for DOCX compatibility)
 * Example: "1F2937" not "#1F2937"
 */
export interface TemplateColors {
    // Primary branding color
    primary: string;

    // Text colors
    title: string;        // Main resume name
    heading: string;      // Section headers (Experience, Education, etc.)
    subheading: string;   // Job titles, company names, dates
    body: string;         // Paragraph text, descriptions
    muted: string;        // Secondary info, metadata
    link: string;         // URLs, hyperlinks

    // UI accents
    border?: string;      // Section borders, separator lines
    background?: string;  // Background fill (usually white/transparent)
}

export interface TemplateFonts {
    // Font families
    body: string;         // Body text font
    heading: string;      // Heading font (can be same as body)

    // Fallback for environments without the specified font
    fallback?: string;    // e.g., 'sans-serif', 'serif'
}

export interface TemplateSizes {
    // Font sizes in points (pt)
    titleSize: number;       // Name size (e.g., 36pt)
    headingSize: number;     // Section headers (e.g., 18pt)
    subheadingSize: number;  // Job titles, school names (e.g., 14pt)
    bodySize: number;        // Normal text (e.g., 11pt)
    smallSize: number;       // Dates, locations, metadata (e.g., 10pt)
}

export interface TemplateLayout {
    // Text alignment
    headerAlign: 'left' | 'center' | 'right';
    bodyAlign: 'left' | 'justified' | 'right';

    // Spacing (in points)
    sectionSpacing: number;  // Space between sections
    itemSpacing: number;     // Space between items within a section
    lineHeight: number;      // Text line height multiplier

    // Visual elements
    showBorders: boolean;         // Show section separator lines
    showIcons: boolean;           // Show icons for contact info
    borderStyle?: 'solid' | 'dashed' | 'double';
    borderThickness?: number;     // In points
}

export interface TemplateStyleConfig {
    id: string;
    name: string;
    colors: TemplateColors;
    fonts: TemplateFonts;
    sizes: TemplateSizes;
    layout: TemplateLayout;
    description?: string;
}

/**
 * Template Style Registry
 * 
 * All templates should be defined here with complete style configurations.
 * Export formats (DOCX, HTML, LaTeX) will read from this registry.
 */
export const TEMPLATE_STYLES: Record<string, TemplateStyleConfig> = {
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean, simple design with maximum content focus',
        colors: {
            primary: '111827',      // gray-900
            title: '111827',        // gray-900
            heading: '374151',      // gray-700
            subheading: '6B7280',   // gray-500
            body: '1F2937',         // gray-800
            muted: '9CA3AF',        // gray-400
            link: '2563EB',         // blue-600
        },
        fonts: {
            body: 'Arial',
            heading: 'Arial',
            fallback: 'sans-serif',
        },
        sizes: {
            titleSize: 36,
            headingSize: 18,
            subheadingSize: 14,
            bodySize: 11,
            smallSize: 10,
        },
        layout: {
            headerAlign: 'center',
            bodyAlign: 'justified',
            sectionSpacing: 16,
            itemSpacing: 10,
            lineHeight: 1.4,
            showBorders: false,
            showIcons: false,
        },
    },

    modern: {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary design with bold blue accents',
        colors: {
            primary: '2563EB',      // blue-600
            title: '1E3A8A',        // blue-900
            heading: '1E40AF',      // blue-800
            subheading: '1F2937',   // gray-800
            body: '374151',         // gray-700
            muted: '6B7280',        // gray-500
            link: '2563EB',         // blue-600
            border: '93C5FD',       // blue-300
        },
        fonts: {
            body: 'Calibri',
            heading: 'Calibri',
            fallback: 'sans-serif',
        },
        sizes: {
            titleSize: 42,
            headingSize: 20,
            subheadingSize: 14,
            bodySize: 11,
            smallSize: 10,
        },
        layout: {
            headerAlign: 'left',
            bodyAlign: 'justified',
            sectionSpacing: 18,
            itemSpacing: 12,
            lineHeight: 1.5,
            showBorders: true,
            showIcons: true,
            borderStyle: 'solid',
            borderThickness: 2,
        },
    },

    creative: {
        id: 'creative',
        name: 'Creative',
        description: 'Artistic design with purple accents and elegant typography',
        colors: {
            primary: '7C3AED',      // violet-600
            title: '4C1D95',        // violet-900
            heading: '5B21B6',      // violet-800
            subheading: '7C3AED',   // violet-600
            body: '1F2937',         // gray-800
            muted: '6B7280',        // gray-500
            link: '7C3AED',         // violet-600
        },
        fonts: {
            body: 'Georgia',
            heading: 'Georgia',
            fallback: 'serif',
        },
        sizes: {
            titleSize: 38,
            headingSize: 19,
            subheadingSize: 14,
            bodySize: 11,
            smallSize: 10,
        },
        layout: {
            headerAlign: 'center',
            bodyAlign: 'justified',
            sectionSpacing: 20,
            itemSpacing: 12,
            lineHeight: 1.6,
            showBorders: false,
            showIcons: false,
        },
    },

    classic: {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional academic CV style with serif fonts',
        colors: {
            primary: '000000',      // black
            title: '000000',        // black
            heading: '000000',      // black
            subheading: '374151',   // gray-700
            body: '1F2937',         // gray-800
            muted: '6B7280',        // gray-500
            link: '000000',         // black
            border: '000000',       // black
        },
        fonts: {
            body: 'Times New Roman',
            heading: 'Times New Roman',
            fallback: 'serif',
        },
        sizes: {
            titleSize: 40,
            headingSize: 16,
            subheadingSize: 14,
            bodySize: 12,
            smallSize: 11,
        },
        layout: {
            headerAlign: 'center',
            bodyAlign: 'justified',
            sectionSpacing: 14,
            itemSpacing: 10,
            lineHeight: 1.3,
            showBorders: true,
            showIcons: false,
            borderStyle: 'solid',
            borderThickness: 1,
        },
    },

    // Additional templates from registry
    colorful: {
        id: 'colorful',
        name: 'Colorful',
        description: 'Vibrant multi-color design',
        colors: {
            primary: 'EF4444',      // red-500
            title: 'DC2626',        // red-600
            heading: 'F59E0B',      // amber-500
            subheading: '10B981',   // emerald-500
            body: '1F2937',         // gray-800
            muted: '6B7280',        // gray-500
            link: '3B82F6',         // blue-500
            border: 'F59E0B',       // amber-500
        },
        fonts: {
            body: 'Arial',
            heading: 'Arial',
            fallback: 'sans-serif',
        },
        sizes: {
            titleSize: 40,
            headingSize: 18,
            subheadingSize: 14,
            bodySize: 11,
            smallSize: 10,
        },
        layout: {
            headerAlign: 'center',
            bodyAlign: 'justified',
            sectionSpacing: 16,
            itemSpacing: 10,
            lineHeight: 1.5,
            showBorders: true,
            showIcons: true,
            borderStyle: 'solid',
            borderThickness: 2,
        },
    },

    corporate: {
        id: 'corporate',
        name: 'Corporate',
        description: 'Professional corporate style',
        colors: {
            primary: '1F2937',      // gray-800
            title: '111827',        // gray-900
            heading: '374151',      // gray-700
            subheading: '4B5563',   // gray-600
            body: '1F2937',         // gray-800
            muted: '9CA3AF',        // gray-400
            link: '1F2937',         // gray-800
            border: 'D1D5DB',       // gray-300
        },
        fonts: {
            body: 'Arial',
            heading: 'Arial',
            fallback: 'sans-serif',
        },
        sizes: {
            titleSize: 36,
            headingSize: 16,
            subheadingSize: 13,
            bodySize: 11,
            smallSize: 10,
        },
        layout: {
            headerAlign: 'center',
            bodyAlign: 'justified',
            sectionSpacing: 14,
            itemSpacing: 8,
            lineHeight: 1.3,
            showBorders: true,
            showIcons: false,
            borderStyle: 'solid',
            borderThickness: 1,
        },
    },

    elegant: {
        id: 'elegant',
        name: 'Elegant',
        description: 'Sophisticated serif design',
        colors: {
            primary: '92400E',      // amber-900
            title: '78350F',        // amber-950
            heading: '92400E',      // amber-900
            subheading: 'B45309',   // amber-700
            body: '1F2937',         // gray-800
            muted: '6B7280',        // gray-500
            link: '92400E',         // amber-900
        },
        fonts: {
            body: 'Georgia',
            heading: 'Georgia',
            fallback: 'serif',
        },
        sizes: {
            titleSize: 38,
            headingSize: 18,
            subheadingSize: 14,
            bodySize: 11,
            smallSize: 10,
        },
        layout: {
            headerAlign: 'center',
            bodyAlign: 'justified',
            sectionSpacing: 18,
            itemSpacing: 10,
            lineHeight: 1.5,
            showBorders: false,
            showIcons: false,
        },
    },
};

/**
 * Get template style configuration with fallback to minimal
 * @param templateId - Template ID (e.g., 'modern', 'creative')
 * @returns Template style configuration
 */
export const getTemplateStyle = (templateId: string): TemplateStyleConfig => {
    const normalizedId = templateId.toLowerCase();
    return TEMPLATE_STYLES[normalizedId] || TEMPLATE_STYLES.minimal;
};

/**
 * Apply theme configuration overrides to a template style
 * @param baseStyle - Base template style
 * @param themeConfig - User theme customizations (partial colors)
 * @returns Template style with theme overrides applied
 */
export const applyThemeConfig = (
    baseStyle: TemplateStyleConfig,
    themeConfig?: Partial<TemplateColors>
): TemplateStyleConfig => {
    if (!themeConfig) return baseStyle;

    return {
        ...baseStyle,
        colors: {
            ...baseStyle.colors,
            ...Object.fromEntries(
                Object.entries(themeConfig)
                    .filter(([_, value]) => value) // Remove undefined/null values
                    .map(([key, value]) => [key, value.replace('#', '')]) // Strip # prefix
            ),
        },
    };
};

/**
 * Get list of all available templates
 * @returns Array of template metadata
 */
export const getAllTemplates = (): Array<{ id: string; name: string; description: string }> => {
    return Object.values(TEMPLATE_STYLES).map(({ id, name, description }) => ({
        id,
        name,
        description: description || '',
    }));
};
