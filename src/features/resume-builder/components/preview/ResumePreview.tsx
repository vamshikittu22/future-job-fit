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

// ============================================================================
// STYLES & THEMES
// ============================================================================

const getThemeStyles = (template: string) => {
    const t = template.toLowerCase();

    // RxResume Inspired "Onyx/Modern" Base
    const base = {
        // Layout: Crisp, clean, paper-like
        page: "bg-white shadow-xl mb-8 mx-auto relative overflow-hidden font-sans text-gray-800 subpixel-antialiased",

        // Header: distinct & clean. We'll handle layout in the block, but here are utilities.
        headerWrapper: "pb-6 mb-2 border-b border-gray-100 text-center",
        headerTitle: "text-4xl font-extrabold tracking-tight text-gray-900 mb-1",
        headerSubtitle: "text-lg font-medium text-gray-500 tracking-wide mb-3",
        headerContact: "flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-gray-500",

        // Sections
        sectionTitle: "flex items-center gap-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-4 mt-6",
        sectionLine: "h-px flex-grow bg-gray-200", // The line to the right of title

        // Items
        item: "mb-3 group",
        itemHeader: "flex justify-between items-baseline mb-0.5",
        itemTitle: "text-sm font-bold text-gray-900",
        itemSubtitle: "text-xs font-medium text-gray-600",
        itemDate: "text-[10px] font-semibold text-gray-500 whitespace-nowrap ml-4",
        itemDesc: "text-[11px] leading-relaxed text-gray-600 mt-1 text-justify",

        // Lists & Tags
        list: "list-disc pl-3 space-y-0.5 mt-1 marker:text-gray-300",
        link: "hover:text-blue-600 hover:underline transition-colors",
        tag: "text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-100 mr-1 mb-1 inline-block",
    };

    // Modern: Blue, Clean Block headers, Tabular layout hints
    if (t === 'modern') {
        return {
            ...base,
            headerWrapper: "mb-8 text-left border-b-4 border-blue-600 pb-4",
            headerTitle: "text-5xl font-bold text-blue-900 tracking-tighter mb-0",
            headerSubtitle: "text-xl text-blue-600 font-medium mb-4",
            headerContact: "flex flex-wrap gap-4 text-sm font-medium text-gray-600",

            sectionTitle: "text-lg font-bold text-blue-800 border-b border-gray-200 pb-2 mb-4 mt-8 uppercase tracking-normal block",
            sectionLine: "hidden", // Hide the side-line

            itemTitle: "text-sm font-bold text-blue-900",
            itemDate: "text-xs font-bold text-blue-600",
            tag: "text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded mr-1 mb-1 inline-block",
        };
    }

    // Creative: Serif, Centered, Colorful
    if (t === 'creative') {
        return {
            ...base,
            page: cn(base.page, "bg-stone-50"), // Slight warmth
            headerWrapper: "mb-8 text-center py-8 bg-purple-50 -mx-8 px-8", // Full bleed header background
            headerTitle: "text-4xl font-serif font-bold text-purple-900 mb-2",
            headerSubtitle: "text-base font-serif italic text-purple-600 mb-0",

            sectionTitle: "text-center text-sm font-serif font-bold text-purple-800 mb-6 mt-8 border-b border-purple-100 pb-2 mx-12",
            sectionLine: "hidden",

            itemHeader: "flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1",
            itemTitle: "text-sm font-bold text-gray-900 font-serif",
            itemDate: "text-[10px] italic text-purple-500",
            tag: "text-[10px] px-3 py-0.5 border border-purple-200 text-purple-800 rounded-full mr-1 mb-1 inline-block bg-white",
        };
    }

    // Classic: Traditional, Serif, Black & White
    if (t === 'classic') {
        return {
            ...base,
            page: cn(base.page, "font-serif text-gray-900"),

            headerWrapper: "mb-6 text-center border-b-2 border-gray-900 pb-4",
            headerTitle: "text-3xl font-serif font-bold uppercase tracking-widest text-gray-900 mb-2",
            headerSubtitle: "text-base font-serif italic text-gray-700 mb-2",

            sectionTitle: "text-center text-sm font-serif font-bold uppercase border-b border-gray-900 pb-1 mb-3 mt-6 tracking-wider text-black block",
            sectionLine: "hidden",

            itemTitle: "text-sm font-bold font-serif text-gray-900",
            itemSubtitle: "text-xs font-serif italic text-gray-700",
            itemDate: "text-xs font-serif italic text-gray-900",

            list: "list-disc pl-4 space-y-0.5 mt-1 marker:text-black",
            tag: "text-[10px] font-serif border border-gray-300 px-2 py-0.5 rounded-none mr-2 bg-transparent text-gray-900 italic",
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
}

// Data structure for a "Render Block"
type RenderBlock = {
    id: string;
    type: string;
    content: React.ReactNode;
};

export default function ResumePreview({ resumeData, template, sectionOrder }: ResumePreviewProps) {
    const styles = getThemeStyles(template);

    // --------------------------------------------------------------------------
    // 1. FLATTEN DATA INTO BLOCKS
    // --------------------------------------------------------------------------
    const resumeDataString = JSON.stringify(resumeData);

    const blocks = useMemo<RenderBlock[]>(() => {
        if (!resumeData) return [];
        const b: RenderBlock[] = [];

        // --- Personal Info (Dynamic Style per Template) ---
        if (resumeData.personal) {
            const { name, title, email, phone, location, linkedin, website } = resumeData.personal;
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

                        {(linkedin || website) && (
                            <div className={cn(styles.headerContact, "mt-1")}>
                                {website && <a href={website} className={styles.link} target="_blank" rel="noreferrer">Portfolio</a>}
                                {linkedin && <a href={linkedin} className={styles.link} target="_blank" rel="noreferrer">LinkedIn</a>}
                            </div>
                        )}
                    </div>
                )
            });
        }

        // --- Ordered Sections ---
        const activeSectionOrder = sectionOrder || Object.keys(SECTION_NAMES);

        activeSectionOrder.forEach(sectionKey => {

            // Helper for Section Titles (RxResume style: Text + Line)
            const renderTitle = (title: string) => (
                <div className={styles.sectionTitle}>
                    <span>{title}</span>
                    <div className={styles.sectionLine} />
                </div>
            );

            // Summary
            if (sectionKey === 'summary' && resumeData.summary) {
                b.push({ id: 'summary-title', type: 'title', content: renderTitle(SECTION_NAMES.summary) });
                b.push({
                    id: 'summary-content',
                    type: 'content',
                    content: <p className={styles.itemDesc}>{resumeData.summary}</p>
                });
            }

            // Experience
            if (sectionKey === 'experience' && resumeData.experience?.length) {
                b.push({ id: 'exp-title', type: 'title', content: renderTitle(SECTION_NAMES.experience) });
                resumeData.experience.forEach((exp, idx) => {
                    b.push({
                        id: `exp-${idx}`,
                        type: 'item',
                        content: (
                            <div className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                                        <h4 className={styles.itemTitle}>{exp.title}</h4>
                                        <span className="hidden sm:inline text-gray-300 text-xs">|</span>
                                        <div className={styles.itemSubtitle}>{exp.company} {exp.location ? `, ${exp.location}` : ''}</div>
                                    </div>
                                    <div className={styles.itemDate}>
                                        {exp.startDate} — {exp.endDate || 'Present'}
                                    </div>
                                </div>
                                {exp.description && <p className={styles.itemDesc}>{exp.description}</p>}
                                {exp.bullets && exp.bullets.length > 0 && (
                                    <ul className={styles.list}>
                                        {exp.bullets.filter(Boolean).map((bulb, bi) => (
                                            <li key={bi} className="text-[11px] text-gray-600 pl-1">{bulb}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )
                    });
                });
            }

            // Education
            if (sectionKey === 'education' && resumeData.education?.length) {
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
                                {edu.gpa && <p className="text-[11px] text-gray-500 mt-0.5">GPA: {edu.gpa}</p>}
                                {edu.bullets && (
                                    <ul className={styles.list}>
                                        {edu.bullets.map((b, i) => <li key={i} className="text-[11px] text-gray-600">{b}</li>)}
                                    </ul>
                                )}
                            </div>
                        )
                    });
                });
            }

            // Skills (Pills Style)
            if (sectionKey === 'skills') {
                const skillsList = Array.isArray(resumeData.skills) ? resumeData.skills : [];
                if (skillsList.length > 0) {
                    b.push({ id: 'skills-title', type: 'title', content: renderTitle(SECTION_NAMES.skills) });
                    b.push({
                        id: 'skills-content',
                        type: 'item',
                        content: (
                            <div className="grid grid-cols-1 gap-y-2">
                                {skillsList.map((cat, idx) => (
                                    <div key={idx} className="flex items-baseline">
                                        <span className="text-[11px] font-bold text-gray-900 w-32 shrink-0">{cat.name}</span>
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
            if (sectionKey === 'projects' && resumeData.projects?.length) {
                b.push({
                    id: 'proj-title',
                    type: 'title',
                    content: <h3 className={styles.sectionTitle}>{SECTION_NAMES.projects}</h3>
                });
                resumeData.projects.forEach((proj, idx) => {
                    b.push({
                        id: `proj-${idx}`,
                        type: 'item',
                        content: (
                            <div className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <h4 className={styles.itemTitle}>{proj.name}</h4>
                                    {(proj.startDate || proj.endDate) && (
                                        <div className={styles.itemDate}>{proj.startDate} - {proj.endDate || 'Present'}</div>
                                    )}
                                </div>
                                <p className={styles.itemDesc}>{proj.description}</p>
                                {proj.technologies && (
                                    <p className="text-sm text-gray-600 mt-1"><strong>Tech:</strong> {proj.technologies}</p>
                                )}
                                {proj.bullets && proj.bullets.length > 0 && (
                                    <ul className={styles.list}>
                                        {proj.bullets.map((b, i) => <li key={i} className="text-sm text-gray-700">{b}</li>)}
                                    </ul>
                                )}
                            </div>
                        )
                    });
                });
                b.push({ id: 'proj-spacer', type: 'spacer', content: <div className="h-4" /> });
            }

            // Achievements
            if (sectionKey === 'achievements' && resumeData.achievements?.length) {
                b.push({
                    id: 'ach-title',
                    type: 'title',
                    content: <h3 className={styles.sectionTitle}>{SECTION_NAMES.achievements}</h3>
                });
                b.push({
                    id: 'ach-content',
                    type: 'item',
                    content: (
                        <ul className={styles.list}>
                            {resumeData.achievements.map((ach, idx) => (
                                <li key={idx} className="text-sm text-gray-700">
                                    {typeof ach === 'string' ? ach : (
                                        <>
                                            <strong className="font-medium">{ach.title}</strong>
                                            {ach.date && <span className="text-gray-500 text-xs ml-2">({ach.date})</span>}
                                            {ach.description && <div className="mt-1">{ach.description}</div>}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )
                });
                b.push({ id: 'ach-spacer', type: 'spacer', content: <div className="h-4" /> });
            }

            // Certifications
            if (sectionKey === 'certifications' && resumeData.certifications?.length) {
                b.push({
                    id: 'cert-title',
                    type: 'title',
                    content: <h3 className={styles.sectionTitle}>{SECTION_NAMES.certifications}</h3>
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
                b.push({ id: 'cert-spacer', type: 'spacer', content: <div className="h-4" /> });
            }

        });

        // Remove last spacer to avoid trailing empty gap
        if (b.length > 0 && b[b.length - 1].type === 'spacer') {
            b.pop();
        }

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

            // 1. Calculate Scale directly from parent container width
            // We want the A4 Page (A4_WIDTH_PX) to fit into the parent width
            // minus some padding (e.g., 32px for p-4)
            const parentWidth = MeasureContainerRef.current.offsetWidth;
            const availableWidth = parentWidth - 32; // deduction for padding

            // Determine scale to fit width
            // Default A4 pixel width is approx 794px
            // Clamp scale between 0.3 and 2.5 to avoid breaking layout
            const newScale = Math.max(0.3, Math.min(availableWidth / A4_WIDTH_PX, 2.5));
            setScale(newScale);

            // 2. Measure & Paginate Content (Strict A4 Logic)
            const itemNodes = Array.from(contentRef.current.children) as HTMLElement[];

            const newPages: RenderBlock[][] = [];
            let currentPageBlocks: RenderBlock[] = [];
            let currentHeight = 0;

            // Strict A4 content height limit
            const HEIGHT_LIMIT = CONTENT_HEIGHT_PX;

            if (itemNodes.length === 0) {
                setPages([[]]);
                return;
            }

            itemNodes.forEach((node, index) => {
                const block = blocks[index];
                if (!block) return;

                // We measure the Natural Height at A4 width (because contentRef is fixed width)
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

            setPages(newPages);
        };

        // Run initially and on resize
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
            className="flex flex-col items-center bg-gray-100 min-h-full w-full overflow-x-hidden p-4"
        >

            {/* Hidden Measurement Layer - FIXED A4 WIDTH */}
            <div
                ref={contentRef}
                className="absolute top-0 left-0 invisible -z-50 pointer-events-none bg-white font-sans text-gray-800"
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
                    transform: `scale(${scale})`,
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
                            "resume-page", // Marker for PDF export
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

                        {/* Page Number */}
                        <div className="absolute bottom-4 right-8 text-xs text-gray-400 print:hidden">
                            Page {pageIndex + 1} of {pages.length}
                        </div>
                    </div>
                ))}
            </div>

            {/* Print Styles Injection */}
            <style dangerouslySetInnerHTML={{
                __html: `
            @media print {
                body { background: white; }
                @page { size: A4; margin: 0; }
                .print\\:hidden { display: none !important; }
            }
            `
            }} />
        </div>
    );
}
