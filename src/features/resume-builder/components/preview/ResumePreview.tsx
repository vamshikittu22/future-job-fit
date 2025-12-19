import React, { useRef, useState, useEffect, useMemo } from "react";
import { cn } from "@/shared/lib/utils";
import { SECTION_NAMES } from "@/shared/constants/sectionNames";
import type { ResumeData } from "@/shared/types/resume";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 20;

// Conversion factor (approximate for screen display, adjustable)
const MM_TO_PX = 3.78;
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;
const PAGE_MARGIN_PX = PAGE_MARGIN_MM * MM_TO_PX;

// Vertical buffer to avoid overcrowding the bottom
const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - (PAGE_MARGIN_PX * 2);

// ============================================================================
// STYLES & THEMES
// ============================================================================

const getThemeStyles = (template: string) => {
    const t = template.toLowerCase();

    // RxResume Inspired "Onyx/Modern" Base
    const base = {
        // Layout: Crisp, clean, paper-like
        page: "bg-white shadow-xl mb-8 mx-auto relative overflow-hidden [font-family:var(--font-family)] text-gray-800 subpixel-antialiased",

        // Header
        headerWrapper: "pb-6 mb-2 border-b border-gray-100 text-center",
        headerTitle: "text-4xl font-extrabold tracking-tight [color:var(--title-color)] mb-1",
        headerSubtitle: "text-lg font-medium [color:var(--subheadings-color)] tracking-wide mb-3",
        headerContact: "flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-gray-500",

        // Sections
        sectionTitle: "flex items-center gap-4 text-xs font-bold uppercase tracking-[0.15em] [color:var(--headings-color)] mb-4 mt-6",
        sectionLine: "flex-1 h-px bg-gray-100",

        // Items
        item: "mb-4",
        itemHeader: "flex justify-between items-baseline mb-0.5",
        itemTitle: "text-sm font-bold [color:var(--title-color)]",
        itemSubtitle: "text-xs font-medium [color:var(--subheadings-color)] opacity-90",
        itemDate: "text-[10px] font-semibold [color:var(--primary-color)] opacity-70 whitespace-nowrap ml-4",
        itemDesc: "text-[11px] leading-relaxed text-gray-600 mt-1 text-justify",

        // Lists & Tags
        list: "list-disc pl-3 space-y-0.5 mt-1 marker:text-gray-300",
        link: "hover:[color:var(--links-color)] hover:underline transition-colors",
        tag: "text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-100 mr-1 mb-1 inline-block",
    };

    if (t === 'modern') {
        return {
            ...base,
            headerWrapper: "mb-8 text-left border-b-4 [border-color:var(--primary-color)] pb-4",
            headerTitle: "text-5xl font-bold [color:var(--title-color)] tracking-tighter mb-0",
            headerSubtitle: "text-xl [color:var(--subheadings-color)] font-medium mb-4",
            headerContact: "flex flex-wrap gap-4 text-sm font-medium text-gray-600",

            sectionTitle: "text-lg font-bold [color:var(--headings-color)] border-b border-gray-200 pb-2 mb-4 mt-8 uppercase tracking-normal block",
            sectionLine: "hidden",

            itemTitle: "text-sm font-bold [color:var(--title-color)]",
            itemDate: "text-xs font-bold [color:var(--primary-color)]",
            tag: "text-[10px] font-bold px-2 py-1 [background-color:var(--primary-color-muted)] [color:var(--links-color)] rounded mr-1 mb-1 inline-block",
        };
    }

    if (t === 'creative') {
        return {
            ...base,
            page: cn(base.page, "bg-stone-50"),
            headerWrapper: "mb-8 text-center py-8 [background-color:var(--primary-color-muted)] -mx-8 px-8",
            headerTitle: "text-4xl font-bold [color:var(--title-color)] mb-2",
            headerSubtitle: "text-base italic [color:var(--subheadings-color)] mb-0",

            sectionTitle: "text-center text-sm font-bold [color:var(--headings-color)] mb-6 mt-8 border-b [border-color:var(--primary-color-muted)] pb-2 mx-12",
            sectionLine: "hidden",

            itemHeader: "flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1",
            itemTitle: "text-sm font-bold [color:var(--title-color)]",
            itemDate: "text-[10px] italic [color:var(--primary-color)]",
            tag: "text-[10px] px-3 py-0.5 border [border-color:var(--primary-color-muted)] [color:var(--links-color)] rounded-full mr-1 mb-1 inline-block bg-white",
        };
    }

    if (t === 'executive') {
        return {
            ...base,
            headerWrapper: "mb-10 text-left border-l-[6px] [border-color:var(--primary-color)] pl-6 py-2 bg-gray-50",
            headerTitle: "text-4xl font-black uppercase tracking-tight [color:var(--title-color)] mb-1",
            headerSubtitle: "text-lg font-bold uppercase tracking-widest [color:var(--subheadings-color)] mb-4",
            headerContact: "flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider",

            sectionTitle: "text-lg font-black [color:var(--headings-color)] border-b-2 [border-color:var(--primary-color)] pb-1 mb-5 mt-10 uppercase tracking-tight block",
            sectionLine: "hidden",

            itemHeader: "flex justify-between items-baseline mb-1",
            itemTitle: "text-sm font-bold [color:var(--title-color)] uppercase",
            itemSubtitle: "text-xs font-semibold italic text-gray-600",
            itemDate: "text-[10px] font-black [color:var(--primary-color)] uppercase tracking-tighter",
            tag: "text-[9px] font-bold px-2 py-0.5 bg-gray-900 text-white rounded-sm mr-1 mb-1 inline-block uppercase tracking-tight",
        };
    }

    if (t === 'elegant') {
        return {
            ...base,
            headerWrapper: "mb-12 text-center",
            headerTitle: "text-5xl font-light italic [color:var(--title-color)] mb-3 serif",
            headerSubtitle: "text-[10px] tracking-[0.4em] uppercase font-medium [color:var(--subheadings-color)] mb-6",
            headerContact: "flex justify-center flex-wrap gap-x-8 gap-y-2 text-[9px] uppercase tracking-[0.2em] text-gray-400",

            sectionTitle: "text-center text-[10px] font-bold uppercase tracking-[0.4em] [color:var(--headings-color)] mb-8 mt-12 border-y py-2.5 [border-color:var(--primary-color-muted)] block",
            sectionLine: "hidden",

            itemHeader: "flex flex-col items-center mb-2",
            itemTitle: "text-xs font-bold uppercase tracking-[0.2em] [color:var(--title-color)]",
            itemSubtitle: "text-[10px] italic text-gray-500 mb-1",
            itemDate: "text-[9px] tracking-[0.2em] [color:var(--primary-color)] mb-2",
            tag: "text-[9px] border-b [border-color:var(--primary-color)] [color:var(--links-color)] mx-2 mb-2 inline-block uppercase tracking-widest",
        };
    }

    if (t === 'classic') {
        return {
            ...base,
            page: cn(base.page, "text-gray-900"),
            headerWrapper: "mb-6 text-center border-b-2 [border-color:var(--title-color)] pb-4",
            headerTitle: "text-3xl font-bold uppercase tracking-widest [color:var(--title-color)] mb-2",
            headerSubtitle: "text-base italic [color:var(--subheadings-color)] mb-2",

            sectionTitle: "text-center text-sm font-bold uppercase border-b [border-color:var(--headings-color)] pb-1 mb-3 mt-6 tracking-wider [color:var(--headings-color)] block",
            sectionLine: "hidden",

            itemTitle: "text-sm font-bold [color:var(--title-color)]",
            itemSubtitle: "text-xs italic [color:var(--subheadings-color)]",
            itemDate: "text-xs italic [color:var(--primary-color)]",

            list: "list-disc pl-4 space-y-0.5 mt-1 marker:text-black",
            tag: "text-[10px] border border-gray-300 px-2 py-0.5 rounded-none mr-2 bg-transparent [color:var(--links-color)] italic",
        };
    }

    if (t === 'minimal') {
        return {
            ...base,
            headerWrapper: "mb-6 text-left pb-4",
            headerTitle: "text-3xl font-light tracking-tight [color:var(--title-color)]",
            headerSubtitle: "text-base font-normal text-gray-400 mb-4",
            headerContact: "flex flex-wrap gap-4 text-[10px] text-gray-400 uppercase tracking-widest",

            sectionTitle: "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-4 mt-8 block",
            sectionLine: "hidden",

            itemTitle: "text-sm font-medium [color:var(--title-color)]",
            itemSubtitle: "text-xs text-gray-400",
            itemDate: "text-[10px] text-gray-300",
            tag: "text-[9px] text-gray-400 border border-gray-100 px-2 py-0.5 rounded-full mr-1 mb-1 inline-block",
        };
    }

    return base;
};

// ============================================================================
// COMPONENT: ResumePreview
// ============================================================================

interface ResumePreviewProps {
    resumeData: ResumeData | null;
    template: string;
    sectionOrder: string[];
    onScaleChange?: (scale: number) => void;
    manualScale?: number;
    onTotalPagesChange?: (pages: number) => void;
}

// Data structure for a "Render Block"
type RenderBlock = {
    id: string;
    type: string;
    content: React.ReactNode;
};

export default function ResumePreview({
    resumeData,
    template,
    sectionOrder,
    onScaleChange,
    manualScale,
    onTotalPagesChange
}: ResumePreviewProps) {
    const resumeDataString = JSON.stringify(resumeData);

    const themeSettings = useMemo(() => {
        const t = template.toLowerCase();
        const config = resumeData?.metadata?.themeConfig?.[t];

        const primary = config?.primaryColor || (
            t === 'modern' ? '#2563eb' :
                t === 'creative' ? '#7c3aed' :
                    t === 'executive' ? '#111827' :
                        t === 'elegant' ? '#db2777' :
                            '#000000'
        );

        return {
            primaryColor: primary,
            fontFamily: config?.fontFamily || (
                t === 'classic' || t === 'executive' ? "'Playfair Display', serif" :
                    t === 'creative' || t === 'elegant' ? "'EB Garamond', serif" :
                        "'Inter', sans-serif"
            ),
            titleColor: config?.titleColor || (
                t === 'modern' ? '#1e3a8a' :
                    t === 'creative' ? '#4c1d95' :
                        t === 'executive' ? '#000000' :
                            t === 'elegant' ? '#9d174d' :
                                '#000000'
            ),
            headingsColor: config?.headingsColor || (
                t === 'modern' ? '#1e3a8a' :
                    t === 'creative' ? '#4c1d95' :
                        t === 'executive' ? '#111827' :
                            t === 'elegant' ? '#831843' :
                                '#000000'
            ),
            subheadingsColor: config?.subheadingsColor || (
                t === 'modern' ? '#2563eb' :
                    t === 'creative' ? '#7c3aed' :
                        t === 'executive' ? '#4b5563' :
                            t === 'elegant' ? '#be185d' :
                                '#000000'
            ),
            linksColor: config?.linksColor || (
                t === 'modern' ? '#2563eb' :
                    t === 'creative' ? '#7c3aed' :
                        t === 'elegant' ? '#db2777' :
                            '#2563eb'
            ),
            primaryColorMuted: primary + '10',
        };
    }, [resumeDataString, template]);

    const styles = getThemeStyles(template);

    // --------------------------------------------------------------------------
    // 1. FLATTEN DATA INTO BLOCKS
    // --------------------------------------------------------------------------
    const blocks = useMemo<RenderBlock[]>(() => {
        if (!resumeData) return [];
        const b: RenderBlock[] = [];

        // Helper for consistent title rendering
        const renderTitle = (title: string) => (
            <div className={styles.sectionTitle}>
                <span>{title}</span>
                <div className={styles.sectionLine} />
            </div>
        );


        // Iterate through sectionOrder for main content
        sectionOrder.forEach(sectionKey => {
            // Personal Info
            if (sectionKey === 'personal' && resumeData.personal) {
                const { name, title, email, phone, location, linkedin, website, github } = resumeData.personal;
                b.push({
                    id: 'personal',
                    type: 'header',
                    content: (
                        <div className={styles.headerWrapper}>
                            <h1 className={styles.headerTitle}>{name}</h1>
                            {title && <p className={styles.headerSubtitle}>{title}</p>}

                            <div className={styles.headerContact}>
                                {[email, phone, location].filter(Boolean).map((v, i) => (
                                    <div key={i} className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                                        <span>{v}</span>
                                    </div>
                                ))}
                            </div>

                            {(linkedin || website || github) && (
                                <div className={cn(styles.headerContact, "mt-1")}>
                                    {website && <a href={website} className={styles.link} target="_blank" rel="noreferrer">Portfolio</a>}
                                    {linkedin && <a href={linkedin} className={styles.link} target="_blank" rel="noreferrer">LinkedIn</a>}
                                    {github && <a href={github} className={styles.link} target="_blank" rel="noreferrer">GitHub</a>}
                                </div>
                            )}
                        </div>
                    )
                });
            }

            // Summary
            if (sectionKey === 'summary' && resumeData.summary) {
                b.push({ id: 'summary-title', type: 'title', content: renderTitle(SECTION_NAMES.summary) });
                b.push({ id: 'summary-content', type: 'item', content: <p className={styles.itemDesc}>{resumeData.summary}</p> });
            }
            if (sectionKey === 'experience' && Array.isArray(resumeData.experience) && resumeData.experience.length) {
                b.push({ id: 'exp-title', type: 'title', content: renderTitle(SECTION_NAMES.experience) });
                resumeData.experience.forEach((exp, idx) => {
                    b.push({
                        id: `exp-${idx}`,
                        type: 'item',
                        content: (
                            <div className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <h4 className={styles.itemTitle}>{exp.title}</h4>
                                    <div className={styles.itemDate}>
                                        {exp.startDate} — {exp.endDate || 'Present'}
                                    </div>
                                </div>
                                <div className={styles.itemSubtitle}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                                {exp.description && <p className={styles.itemDesc}>{exp.description}</p>}
                                {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                                    <ul className={styles.list}>
                                        {exp.bullets.map((bullet, i) => <li key={i} className="text-[11px] text-gray-600">{bullet}</li>)}
                                    </ul>
                                )}
                            </div>
                        )
                    });
                });
            }

            if (sectionKey === 'education' && Array.isArray(resumeData.education) && resumeData.education.length) {
                b.push({ id: 'edu-title', type: 'title', content: renderTitle(SECTION_NAMES.education) });
                resumeData.education.forEach((edu, idx) => {
                    b.push({
                        id: `edu-${idx}`,
                        type: 'item',
                        content: (
                            <div className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                                        <h4 className={styles.itemTitle}>{edu.school}</h4>
                                        <span className="hidden sm:inline text-gray-300 text-xs">|</span>
                                        <div className={styles.itemSubtitle}>{edu.degree}</div>
                                    </div>
                                    <div className={styles.itemDate}>
                                        {edu.startDate} — {edu.endDate || 'Present'}
                                    </div>
                                </div>
                                {edu.description && <p className={styles.itemDesc}>{edu.description}</p>}
                            </div>
                        )
                    });
                });
            }

            // Skills (Pills Style)
            if (sectionKey === 'skills') {
                const skillsList = Array.isArray(resumeData.skills)
                    ? resumeData.skills
                    : (typeof resumeData.skills === 'object' && resumeData.skills !== null)
                        ? Object.entries(resumeData.skills).map(([category, items]) => ({
                            category,
                            items: Array.isArray(items) ? items : []
                        }))
                        : [];

                if (skillsList.length > 0) {
                    b.push({ id: 'skills-title', type: 'title', content: renderTitle(SECTION_NAMES.skills) });
                    b.push({
                        id: 'skills-content',
                        type: 'item',
                        content: (
                            <div className="grid grid-cols-1 gap-y-2">
                                {skillsList.map((cat, idx) => (
                                    <div key={idx} className="flex items-baseline">
                                        <span className="text-[11px] font-bold text-gray-900 w-32 shrink-0">{cat.category}</span>
                                        <div className="flex flex-wrap gap-1">
                                            {cat.items.map((skill, si) => (
                                                <span key={si} className={styles.tag}>{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    });
                }
            }

            // Projects
            if (sectionKey === 'projects' && Array.isArray(resumeData.projects) && resumeData.projects.length) {
                b.push({ id: 'proj-title', type: 'title', content: renderTitle(SECTION_NAMES.projects) });
                resumeData.projects.forEach((proj, idx) => {
                    b.push({
                        id: `proj-${idx}`,
                        type: 'item',
                        content: (
                            <div className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <h4 className={styles.itemTitle}>{proj.name}</h4>
                                    {(proj.startDate || proj.endDate) && (
                                        <div className={styles.itemDate}>{proj.startDate} — {proj.endDate || 'Present'}</div>
                                    )}
                                </div>
                                <p className={styles.itemDesc}>{proj.description}</p>
                                {proj.technologies && (
                                    <p className="text-[10px] text-gray-600 mt-1"><strong>Tech:</strong> {proj.technologies}</p>
                                )}
                            </div>
                        )
                    });
                });
            }

            // Achievements
            if (sectionKey === 'achievements' && Array.isArray(resumeData.achievements) && resumeData.achievements.length) {
                b.push({
                    id: 'ach-title',
                    type: 'title',
                    content: renderTitle(SECTION_NAMES.achievements)
                });
                b.push({
                    id: 'ach-content',
                    type: 'item',
                    content: (
                        <ul className={styles.list}>
                            {resumeData.achievements.map((ach, idx) => (
                                <li key={idx} className="text-[11px] text-gray-700">
                                    <strong className="font-medium">{ach.title}</strong>
                                    {ach.date && <span className="text-gray-500 text-[10px] ml-2">({ach.date})</span>}
                                    {ach.description && <div className="mt-0.5 text-gray-600">{ach.description}</div>}
                                </li>
                            ))}
                        </ul>
                    )
                });
            }

            // Certifications
            if (sectionKey === 'certifications' && Array.isArray(resumeData.certifications) && resumeData.certifications.length) {
                b.push({
                    id: 'cert-title',
                    type: 'title',
                    content: renderTitle(SECTION_NAMES.certifications)
                });
                resumeData.certifications.forEach((cert, idx) => {
                    b.push({
                        id: `cert-${idx}`,
                        type: 'item',
                        content: (
                            <div className={styles.item}>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-sm">{cert.name}</span>
                                    {cert.date && <span className="text-xs text-gray-500">{cert.date}</span>}
                                </div>
                                <div className="text-xs text-gray-600">{cert.issuer}</div>
                            </div>
                        )
                    });
                });
            }

            // Custom Sections
            const customSec = resumeData.customSections?.find(cs => cs.id === sectionKey);
            if (customSec && Array.isArray(customSec.entries) && customSec.entries.length) {
                b.push({
                    id: `cs-${customSec.id}-title`,
                    type: 'title',
                    content: renderTitle(customSec.title)
                });
                customSec.entries.forEach((entry, idx) => {
                    const firstField = customSec.fields[0];
                    const otherFields = customSec.fields.slice(1);
                    b.push({
                        id: `cs-${customSec.id}-${idx}`,
                        type: 'item',
                        content: (
                            <div className={styles.item}>
                                <div className="font-semibold text-sm">
                                    {String(entry.values[firstField.id] || '')}
                                </div>
                                {otherFields.map(f => entry.values[f.id] ? (
                                    <div key={f.id} className="text-[11px] text-gray-600">
                                        <strong>{f.name}:</strong> {Array.isArray(entry.values[f.id]) ? (entry.values[f.id] as string[]).join(', ') : String(entry.values[f.id])}
                                    </div>
                                ) : null)}
                            </div>
                        )
                    });
                });
            }
        });

        return b;
    }, [resumeDataString, template, sectionOrder, styles]);


    // --------------------------------------------------------------------------
    // 2. MEASUREMENT & PAGINATION LOGIC
    // --------------------------------------------------------------------------
    const MeasureContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<RenderBlock[][]>([[]]);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calculateLayout = () => {
            if (!MeasureContainerRef.current || !contentRef.current) return;

            const parentWidth = MeasureContainerRef.current.offsetWidth;
            const availableWidth = parentWidth - 32;
            const autoScale = Math.max(0.3, Math.min(availableWidth / A4_WIDTH_PX, 1.5));

            const finalScale = manualScale || autoScale;
            setScale(finalScale);

            if (onScaleChange && !manualScale) {
                onScaleChange(autoScale);
            }

            const itemNodes = Array.from(contentRef.current.children) as HTMLElement[];
            const newPages: RenderBlock[][] = [];
            let currentPageBlocks: RenderBlock[] = [];
            let currentHeight = 0;
            const HEIGHT_LIMIT = CONTENT_HEIGHT_PX;

            if (itemNodes.length === 0) {
                setPages([[]]);
                return;
            }

            itemNodes.forEach((node, index) => {
                const block = blocks[index];
                if (!block) return;

                const height = node.offsetHeight;
                const style = window.getComputedStyle(node);
                const marginTop = parseInt(style.marginTop || '0', 10);
                const marginBottom = parseInt(style.marginBottom || '0', 10);
                const totalItemHeight = height + marginTop + marginBottom;

                if (currentHeight + totalItemHeight > HEIGHT_LIMIT) {
                    if (currentPageBlocks.length > 0) {
                        newPages.push(currentPageBlocks);
                    }
                    currentPageBlocks = [block];
                    currentHeight = totalItemHeight;
                } else {
                    currentPageBlocks.push(block);
                    currentHeight += totalItemHeight;
                }
            });

            if (currentPageBlocks.length > 0) {
                newPages.push(currentPageBlocks);
            }

            setPages(newPages.length > 0 ? newPages : [[]]);
            if (onTotalPagesChange) {
                onTotalPagesChange(newPages.length || 1);
            }
        };

        const timeoutId = setTimeout(calculateLayout, 50);
        window.addEventListener('resize', calculateLayout);

        return () => {
            window.removeEventListener('resize', calculateLayout);
            clearTimeout(timeoutId);
        };

    }, [blocks, template]);


    // --------------------------------------------------------------------------
    // 3. RENDER
    // --------------------------------------------------------------------------
    return (
        <div
            ref={MeasureContainerRef}
            className="flex flex-col items-center min-h-full w-full overflow-x-hidden"
            style={{
                '--primary-color': themeSettings.primaryColor,
                '--primary-color-muted': themeSettings.primaryColorMuted,
                '--title-color': themeSettings.titleColor,
                '--headings-color': themeSettings.headingsColor,
                '--subheadings-color': themeSettings.subheadingsColor,
                '--links-color': themeSettings.linksColor,
                '--font-family': themeSettings.fontFamily,
            } as React.CSSProperties}
        >

            {/* Hidden Measurement Layer */}
            <div
                ref={contentRef}
                className="absolute top-0 left-0 invisible -z-50 pointer-events-none bg-white [font-family:var(--font-family)] text-gray-800"
                style={{ width: `${A4_WIDTH_PX}px`, padding: `${PAGE_MARGIN_PX}px` }}
                aria-hidden="true"
            >
                {blocks.map((block) => (
                    <div key={block.id} className="measure-block">
                        {block.content}
                    </div>
                ))}
            </div>

            {/* Visible Content Layer (Scaled) */}
            <div
                style={{
                    transform: `scale(${manualScale || scale})`,
                    transformOrigin: 'top center',
                    width: `${A4_WIDTH_PX}px`,
                }}
                id="resume-preview-container"
                className="resume-preview"
            >
                {pages.map((pageBlocks, pageIndex) => (
                    <div
                        key={pageIndex}
                        className={cn(
                            styles.page,
                            "resume-page",
                            "print:shadow-none print:my-0 print:mx-0 print:w-full print:h-screen"
                        )}
                        style={{
                            width: `${A4_WIDTH_PX}px`,
                            minHeight: `${A4_HEIGHT_PX}px`,
                            padding: `${PAGE_MARGIN_PX}px`,
                        }}
                    >
                        {pageBlocks.map(block => (
                            <div key={`${pageIndex}-${block.id}`}>
                                {block.content}
                            </div>
                        ))}

                        <div className="absolute bottom-4 right-8 text-xs text-gray-400 print:hidden">
                            Page {pageIndex + 1} of {pages.length}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
