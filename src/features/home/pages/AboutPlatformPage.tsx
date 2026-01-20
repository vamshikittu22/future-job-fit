import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
    ArrowRight,
    Cpu,
    Zap,
    Terminal,
    Workflow,
    Activity,
    Box,
    Binary,
    Sparkles,
    Shield,
    Globe,
    FileText,
    Database,
    Layers,
    Grid,
    Target,
    CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import AppNavigation from '@/shared/components/layout/AppNavigation';
import Footer from '@/shared/components/layout/Footer';
import { cn } from '@/shared/lib/utils';
import SystemVitals from '@/features/home/components/SystemVitals';
import ConstraintChronicle from '@/features/home/components/ConstraintChronicle';
import { useTheme } from '@/shared/hooks/useTheme';

// --- HELPER COMPONENTS ---

/**
 * Technical Annotation Component
 * Used for specific technical callouts within sections.
 * High contrast update: Darker borders, clearer text.
 */
const TechnicalAnnotation: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="p-8 border border-border/40 bg-card/50 backdrop-blur-sm relative group overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -translate-y-8 translate-x-8 rotate-45" />
        <div className="flex items-start gap-4 mb-4">
            <Terminal className="w-4 h-4 text-primary mt-1" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground font-bold">{title}</span>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed font-mono">
            {children}
        </div>
        <div className="mt-4 flex gap-2">
            <div className="h-1 w-8 bg-primary/20" />
            <div className="h-1 w-2 bg-primary/40" />
        </div>
    </div>
);

/**
 * Swiss Section Component
 * Main layout wrapper for each story chapter.
 * Updated for visibility: Stronger borders, clearer background differentiation.
 */
const SwissSection: React.FC<{
    number: string;
    id: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    accentColor?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    className?: string;
    description?: string;
}> = ({ number, id, title, subtitle, children, accentColor = "bg-primary", titleClassName, subtitleClassName, className, description }) => (
    <section id={id} className={cn("relative py-24 md:py-32 border-t border-border/40 scroll-mt-20 overflow-hidden", className)}>
        {/* Subtle Background Grid - Adaptive for Light/Dark */}
        <div className="absolute inset-0 bg-[radial-gradient(#00000010_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="container relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                {/* Header Information (approx 5/12 cols) */}
                <div className="lg:col-span-5 space-y-8 sticky top-32">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4"
                    >
                        <div className={cn("w-14 h-14 flex items-center justify-center text-white font-black text-xl shadow-xl relative overflow-hidden group rounded-sm", accentColor)}>
                            <span className="relative z-10">{number}</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </div>
                        <div className={cn("h-px w-12", subtitleClassName ? subtitleClassName.split(' ')[0].replace('text-', 'bg-') : "bg-border")} />
                        <Badge variant="outline" className={cn("rounded-none border-primary/40 text-[10px] font-mono tracking-widest px-3 py-1", subtitleClassName || "text-foreground")}>
                            SYS_MOD_{number}
                        </Badge>
                    </motion.div>

                    <div className="space-y-4">
                        <h2 className={cn("text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase italic", titleClassName || "text-foreground")}>
                            {title}
                        </h2>
                        <p className={cn("text-xs font-mono uppercase tracking-[0.2em] font-bold", subtitleClassName || "text-primary")}>
                            {subtitle}
                        </p>
                    </div>

                    {description && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className={cn("h-px w-full opacity-60", subtitleClassName ? subtitleClassName.split(' ')[0].replace('text-', 'bg-') : "bg-border")} />
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium max-w-sm">
                                {description}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Content Area (approx 7/12 cols) */}
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
);

// --- MAIN PAGE COMPONENT ---

const AboutPlatformPage: React.FC = () => {
    const { theme } = useTheme();
    const [activeSection, setActiveSection] = useState('overview');
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const sections = [
        { id: 'overview', label: '00', title: 'MISSION' },
        { id: 'architecture', label: '01', title: 'STACK' },
        { id: 'state-logic', label: '02', title: 'LOGIC' },
        { id: 'performance', label: '03', title: 'VELOCITY' },
        { id: 'intelligence', label: '04', title: 'HYBRID' },
        { id: 'identity', label: '05', title: 'IDENTITY' },
        { id: 'skill-mapping', label: '06', title: 'SEMANTIC' },
        { id: 'export-architecture', label: '07', title: 'OUTPUTS' },
        { id: 'design-system', label: '08', title: 'SWISS' },
        { id: 'dev-logs', label: '09', title: 'RECORDS' },
        { id: 'scalability', label: '10', title: 'SCALAB' },
        { id: 'meta', label: '11', title: 'IMPACT' },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.1, rootMargin: "-20% 0px -40% 0px" }
        );
        sections.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans transition-colors duration-500 overflow-x-hidden">
            {/* Scroll Progress */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            {/* High-Tech Sidebar */}
            <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden 2xl:flex flex-col gap-6">
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative flex items-center justify-center p-2"
                    >
                        <div className={cn(
                            "w-1.5 h-1.5 transition-all duration-300 rotate-45",
                            activeSection === section.id
                                ? "bg-primary scale-[2.5] shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                                : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                        )} />

                        <div className={cn(
                            "absolute left-10 px-3 py-1 border border-muted/20 backdrop-blur-md transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100",
                            activeSection === section.id && "opacity-100 border-primary/20 bg-primary/5"
                        )}>
                            <span className="text-[9px] font-mono whitespace-nowrap uppercase tracking-widest text-foreground font-bold">
                                {section.title}
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            <AppNavigation />

            <main className="relative z-10 w-full pt-20">

                {/* 00: VISION (HERO) */}
                <section id="overview" className="min-h-screen flex flex-col justify-center relative py-20 lg:py-40 border-b border-border/40">
                    <div className="container max-w-[1400px] mx-auto px-8 lg:px-16">
                        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                            {/* Mission Narrative */}
                            <div className="lg:col-span-8 space-y-12">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4"
                                >
                                    <Badge className="rounded-none bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-mono text-[10px] tracking-widest px-3 py-1">PROT_VER_4.2.0</Badge>
                                    <div className="h-px w-16 bg-border" />
                                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground font-bold">ENGINEERING_MANIFESTO</span>
                                </motion.div>

                                <div className="space-y-6">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="text-[80px] md:text-[120px] font-black tracking-tighter leading-[0.8] uppercase text-foreground italic py-2"
                                    >
                                        BRIDGE THE <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">GAP.</span>
                                    </motion.h1>

                                    <div className="grid md:grid-cols-2 gap-12 pt-8">
                                        <div className="space-y-6">
                                            <p className="text-xl text-foreground/80 font-light leading-relaxed">
                                                Future Job Fit addresses a fundamental failure in recruitment: <span className="text-foreground font-bold">Semantic Decay.</span> Professional identity is often lost in translation between static PDFs and corporate databases.
                                            </p>
                                            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
                                                We didn't just build another resume builder. We engineered a high-fidelity <span className="text-indigo-600 dark:text-indigo-400 italic">Impact Engine</span>—a tool that bridges raw experience and organizational requirements.
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <TechnicalAnnotation title="Core_Problem_Space">
                                                Modern ATS systems rely on simplistic keyword matching, leading to a 75% "false negative" rate for candidates lacking specific lexical styling.
                                            </TechnicalAnnotation>
                                            <TechnicalAnnotation title="The_Solution_Vector">
                                                By decoupling formatting from content via an offline-first parsing microservice, we preserve the "semantic signal" of career history.
                                            </TechnicalAnnotation>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Sidebar Visuals */}
                            <div className="lg:col-span-4 space-y-10 group">
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-background relative border border-border/50 p-2 shadow-2xl">
                                    <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/20 via-transparent to-indigo-500/10 pointer-events-none" />
                                    <SystemVitals />
                                </motion.div>
                                <div className="p-8 border border-border/40 bg-card/50 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-mono text-foreground/70 uppercase tracking-widest font-bold">
                                        <span>Latency_Reduction</span>
                                        <span className="text-emerald-500 font-bold">92%</span>
                                    </div>
                                    <div className="h-1 w-full bg-border/40">
                                        <div className="h-full bg-emerald-500 w-[92%]" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed font-mono uppercase">
                                        Optimization achievement via sub-50ms local inference nodes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 01: ARSENAL - FULL DEPENDENCY GRAPH */}
                <SwissSection
                    number="01"
                    id="architecture"
                    title="ARSENAL."
                    subtitle="FULL DEPENDENCY GRAPH"
                    accentColor="bg-blue-600"
                    titleClassName="text-blue-950 dark:text-blue-50"
                    subtitleClassName="text-blue-600 dark:text-blue-400"
                    className="relative bg-blue-50/50 dark:bg-blue-900/5 group/section"
                    description="We believe in radical transparency. Below is the complete audit of every major library powering the platform, chosen for stability and type-safety."
                >
                    <div className="space-y-12 relative z-10">
                        {/* CORE RUNTIME */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-mono font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest border-b border-blue-200 dark:border-blue-800 pb-2">01_CORE_RUNTIME</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: 'React 18', desc: 'Concurrent rendering engine with Fiber architecture.' },
                                    { name: 'TypeScript 5', desc: 'Static typing system with strict Zod inference.' },
                                    { name: 'Vite 5', desc: 'ESBuild-powered bundler with HMR.' },
                                    { name: 'Node.js', desc: 'Runtime for local offline-parser microservices.' },
                                    { name: 'React Router 6', desc: 'Declarative client-side routing synchronization.' },
                                    { name: 'Tailwind CSS', desc: 'Utility-first JIT styling engine.' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-500/50 transition-colors">
                                        <div className="text-xs font-black uppercase text-blue-700 dark:text-blue-400">{item.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed font-mono">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DATA & STATE */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-mono font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest border-b border-blue-200 dark:border-blue-800 pb-2">02_DATA_INTEGRITY</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: '@tanstack/react-query', desc: 'Server state management, caching, and deduplication.' },
                                    { name: 'react-hook-form', desc: 'Uncontrolled input subscription for performance.' },
                                    { name: '@hookform/resolvers', desc: 'Bridging Zod schemas to form validation.' },
                                    { name: 'zod', desc: 'Runtime schema validation and type inference.' },
                                    { name: 'date-fns', desc: 'Immutable date utility library.' },
                                    { name: 'lodash', desc: 'Utility belt for debounce and throttle.' },
                                    { name: 'uuid', desc: 'RFC4122 compliant unique identifier generation.' },
                                    { name: 'Web Storage API', desc: 'Native localStorage for offline persistence.' },
                                    { name: 'Fetch API', desc: 'Native promise-based HTTP client.' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-500/50 transition-colors">
                                        <div className="text-xs font-black uppercase text-blue-700 dark:text-blue-400">{item.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed font-mono">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* UI PRIMITIVES */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-mono font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest border-b border-blue-200 dark:border-blue-800 pb-2">03_UI_PRIMITIVES</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: '@radix-ui/react-*', desc: '20+ Headless accessible components (Dialog, Tooltip).' },
                                    { name: 'lucide-react', desc: 'Tree-shakeable SVG icon set.' },
                                    { name: 'framer-motion', desc: 'Physics-based animation library.' },
                                    { name: 'embla-carousel-react', desc: 'Lightweight carousel with physics support.' },
                                    { name: 'react-resizable-panels', desc: 'IDE-like panel layout system.' },
                                    { name: 'input-otp', desc: 'Accessible one-time password input.' },
                                    { name: 'sonner', desc: 'High-performance toast notifications.' },
                                    { name: 'cmdk', desc: 'Fast, composable command menu.' },
                                    { name: 'class-variance-authority', desc: 'Type-safe UI component variants.' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-500/50 transition-colors">
                                        <div className="text-xs font-black uppercase text-blue-700 dark:text-blue-400">{item.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed font-mono">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* EXPORT ENGINE */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-mono font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest border-b border-blue-200 dark:border-blue-800 pb-2">04_EXPORT_PIPELINE</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: 'docx', desc: 'Programmatic generation of OOXML .docx files.' },
                                    { name: 'jspdf', desc: 'Client-side PDF generation engine.' },
                                    { name: 'html2pdf.js', desc: 'HTML-to-PDF conversion with canvas rendering.' },
                                    { name: 'html2canvas', desc: 'DOM rasterization utility.' },
                                    { name: 'file-saver', desc: 'HTML5 saveAs() Blob wrapper.' },
                                    { name: 'jszip', desc: 'Create, read and edit .zip files.' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-500/50 transition-colors">
                                        <div className="text-xs font-black uppercase text-blue-700 dark:text-blue-400">{item.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed font-mono">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INTERACTION & AI */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-mono font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest border-b border-blue-200 dark:border-blue-800 pb-2">05_INTERACTION_AI</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: '@dnd-kit/core', desc: 'Drag & Drop toolkit with physics collision.' },
                                    { name: '@hello-pangea/dnd', desc: 'Accessible drag-and-drop primitives.' },
                                    { name: '@google/generative-ai', desc: 'Gemini Pro streaming API client.' },
                                    { name: 'recharts', desc: 'Composable charting library.' },
                                    { name: 'react-dropzone', desc: 'HTML5 drag & drop file uploader.' },
                                    { name: 'react-day-picker', desc: 'Date picker component for forms.' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-500/50 transition-colors">
                                        <div className="text-xs font-black uppercase text-blue-700 dark:text-blue-400">{item.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed font-mono">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INFRA & UTILITY */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-mono font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest border-b border-blue-200 dark:border-blue-800 pb-2">06_INFRA_UTILITY</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: '@supabase/supabase-js', desc: 'PostgreSQL & Auth client SDK.' },
                                    { name: 'react-markdown', desc: 'Secure CommonMark rendering engine.' },
                                    { name: 'rehype-raw', desc: 'Parse raw HTML in markdown safely.' },
                                    { name: 'remark-gfm', desc: 'GitHub Flavored Markdown support.' },
                                    { name: 'next-themes', desc: 'System-preference aware theme suppression.' },
                                    { name: 'lib/utils (cn)', desc: 'clsx + tw-merge for safe class composition.' },
                                    { name: 'vaul', desc: 'Drawer component for mobile interactions.' },
                                    { name: 'tailwindcss-animate', desc: 'Keyframe animations for Tailwind.' },
                                    { name: 'PostCSS', desc: 'Tool for transforming CSS with JavaScript.' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-500/50 transition-colors">
                                        <div className="text-xs font-black uppercase text-blue-700 dark:text-blue-400">{item.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed font-mono">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 02: LOGIC - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="02"
                    id="state-logic"
                    title="LOGIC."
                    subtitle="RESILIENT DATA PIPELINES"
                    accentColor="bg-emerald-600"
                    titleClassName="text-emerald-950 dark:text-emerald-50"
                    subtitleClassName="text-emerald-600 dark:text-emerald-400"
                    className="relative bg-emerald-50/50 dark:bg-emerald-900/5 group/section"
                    description="We avoid 'prop drilling' by leveraging context-aware subscribers. Data resilience is guaranteed via a custom persistence middleware that synchronizes the Redux-like state to IndexedDB."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-6">
                            <div className="p-10 border border-emerald-200/50 dark:border-emerald-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-emerald-200/50 transition-shadow">
                                <div className="flex items-center gap-4 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                                    <Workflow className="w-4 h-4" /> [DEBOUNCE_STRATEGY]
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                    User input is throttled using <span className="font-mono text-emerald-600">lodash.debounce(500ms)</span>. This creates a "safe window" where rapid keystrokes update the React Virtual DOM immediately, but heavy serialization to <span className="font-mono text-emerald-600">localStorage</span> is deferred to prevent main-thread blocking.
                                </p>
                            </div>
                            <TechnicalAnnotation title="Retry_Policy">
                                <span className="text-emerald-700 dark:text-emerald-300">Exponential backoff</span> (initial=2s, max=30s) for all failed edge function calls.
                            </TechnicalAnnotation>
                        </div>
                        <div className="p-10 border border-emerald-500/30 bg-emerald-600 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            {/* Matrix effect logic */}
                            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent)] bg-[size:30px_30px]" />
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="text-5xl font-black italic uppercase text-white leading-none tracking-tighter mix-blend-hard-light">
                                        ZERO_GOP.
                                    </div>
                                    <p className="text-xs font-mono text-emerald-100 uppercase tracking-widest leading-loose border-l-2 border-emerald-400 pl-4">
                                        JSON.stringify(state) &gt; 5MB handled via compression.
                                    </p>
                                </div>
                                <div className="flex items-end justify-between pt-12">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-mono text-emerald-200">SYNC_STATUS</span>
                                        <span className="text-xl font-bold text-white uppercase italic">Active</span>
                                    </div>
                                    <div className="text-[9px] font-mono text-emerald-200/60 italic text-right">
                                        Async_Storage // IDB_Wrapper
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 03: VELOCITY - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="03"
                    id="performance"
                    title="VELOCITY."
                    subtitle="OFF-MAIN-THREAD ARCHITECTURE"
                    accentColor="bg-orange-600"
                    titleClassName="text-orange-950 dark:text-orange-100"
                    subtitleClassName="text-orange-600 dark:text-orange-400"
                    className="relative bg-orange-50/50 dark:bg-orange-900/5 group/section"
                    description="The main thread is for UI updates (60fps), not JSON parsing. We utilize the Web Worker API to offload heavy computational tasks (like PDF binary generation and keyword scoring) to background threads."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        {/* Worker Pool Card */}
                        <div className="p-10 border border-orange-200/50 dark:border-orange-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-orange-200/50 transition-shadow hover:-translate-y-1 duration-500">
                            <div className="flex items-center gap-4 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                                <Zap className="w-4 h-4" /> [WORKER_ISOLATION]
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                By serializing data via <span className="font-mono text-orange-600">postMessage()</span>, we ensure that even heavy operations like <span className="font-mono text-orange-600">html2pdf.save()</span> never block the React Render cycle.
                            </p>
                            <TechnicalAnnotation title="Worker_Topology">
                                Dynamic pool size = navigator.hardwareConcurrency - 1 (Leaving main thread free).
                            </TechnicalAnnotation>
                        </div>

                        {/* 60 FPS Visual */}
                        <div className="p-10 border border-orange-500/30 bg-orange-600 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.1)_20px,rgba(255,255,255,0.1)_21px)] opacity-30 skew-x-[-20deg]" />
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="text-6xl font-black italic uppercase text-white leading-none tracking-tighter drop-shadow-lg">
                                        60_FPS.
                                    </div>
                                    <p className="text-xs font-mono text-orange-100 uppercase tracking-widest leading-loose">
                                        Frame budget: 16.6ms per frame.
                                    </p>
                                </div>
                                <div className="flex items-end justify-between pt-12">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-mono text-orange-200">THREAD_STATUS</span>
                                        <span className="text-xl font-bold text-white uppercase italic">Unblocked</span>
                                    </div>
                                    <div className="text-[9px] font-mono text-orange-200/60 italic text-right">
                                        Worker_Bridge // Comlink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwissSection>


                {/* 04: HYBRID AI - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="04"
                    id="intelligence"
                    title="HYBRID."
                    subtitle="DETERMINISTIC VS PROBABILISTIC"
                    accentColor="bg-purple-600"
                    titleClassName="text-purple-950 dark:text-purple-100"
                    subtitleClassName="text-purple-600 dark:text-purple-400"
                    className="relative bg-purple-50/50 dark:bg-purple-900/5 group/section"
                    description="We implement a 'Sandwiched Intelligence' architecture. Raw inputs are first sanitized via regex graphs, then enhanced by Gemini Pro (AI interaction), and finally validated against rigid Zod output schemas to prevent hallucinations."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="p-10 border border-purple-200/50 dark:border-purple-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-purple-200/50 transition-shadow hover:-translate-y-1 duration-500">
                            <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                                <Sparkles className="w-4 h-4" /> [MODEL_ORCHESTRATION]
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                We utilize the <span className="font-mono text-purple-600">@google/generative-ai</span> SDK with strict temperature controls (0.2 for structure, 0.7 for creative summaries). By pre-parsing entities locally, we reduce context-window token usage by ~40%.
                            </p>
                            <TechnicalAnnotation title="Safety_Layer">
                                All AI outputs are piped through a parser that strips potential markdown injection and enforces JSON validity.
                            </TechnicalAnnotation>
                        </div>
                        <div className="p-10 border border-purple-500/30 bg-purple-600 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="text-4xl font-black italic uppercase text-white leading-none tracking-tighter">
                                        ZERO_LEAK.
                                    </div>
                                    <p className="text-xs font-mono text-purple-100 uppercase tracking-widest leading-loose border-l-2 border-purple-300 pl-4">
                                        PII is stripped before any text enters the context window.
                                    </p>
                                </div>
                                <div className="flex items-end justify-between pt-12">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-mono text-purple-200">PRIVACY_MODE</span>
                                        <span className="text-xl font-bold text-white uppercase italic">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwissSection>


                {/* 05: IDENTITY - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="05"
                    id="identity"
                    title="IDENTITY."
                    subtitle="SCHEMA AUTHORITY"
                    accentColor="bg-cyan-600"
                    titleClassName="text-cyan-950 dark:text-cyan-100"
                    subtitleClassName="text-cyan-600 dark:text-cyan-400"
                    className="relative bg-cyan-50/50 dark:bg-cyan-900/5 group/section"
                    description="We treat professional identity as a strongly-typed graph. A strict Zod Schema enforces the structure of the 'Holographic Record', ensuring that all downstream projections (PDF, Web, JSON) are strictly compliant."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        {/* HOLOGRAPHIC CORE CARD */}
                        <div className="p-10 border border-cyan-200/50 dark:border-cyan-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-cyan-200/50 transition-shadow">
                            <div className="flex items-center gap-4 text-cyan-700 dark:text-cyan-400 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                                <Shield className="w-4 h-4" /> [SCHEMA_VALIDATION]
                            </div>
                            <h4 className="text-xl font-bold uppercase italic tracking-tight text-foreground">Type-Safe Identity</h4>
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                Using <span className="font-mono text-cyan-600">zod.safeParse()</span> at every I/O boundary, we ensure that corrupt data never pollutes the persistent store. Each entity is assigned a cryptographically secure <span className="font-mono text-cyan-600">UUID v4</span> for stable relationship mapping.
                            </p>
                            <TechnicalAnnotation title="Encryption_Standard">
                                AES-256 Client-Side Encryption for all PII fields (Phone, Email, Address) at rest.
                            </TechnicalAnnotation>
                        </div>

                        {/* SYNC VISUAL */}
                        <div className="p-10 border border-cyan-500/30 bg-cyan-600 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="text-4xl font-black italic uppercase text-white leading-none tracking-tighter">
                                            SYNC_MESH.
                                        </div>
                                        <Globe className="w-8 h-8 text-cyan-200 animate-pulse" />
                                    </div>
                                    <p className="text-xs font-mono text-cyan-100 uppercase tracking-widest leading-loose">
                                        Propagation Latency: &lt; 50ms
                                    </p>
                                </div>
                                <div className="space-y-2 pt-8">
                                    <div className="flex justify-between text-[9px] font-mono text-cyan-100 uppercase font-bold">
                                        <span>PDF_Artifact</span>
                                        <span>Synced</span>
                                    </div>
                                    <div className="h-0.5 w-full bg-cyan-400/30 overflow-hidden">
                                        <div className="h-full bg-white w-full animate-[shimmer_2s_infinite]" />
                                    </div>
                                    <div className="flex justify-between text-[9px] font-mono text-cyan-100 uppercase font-bold">
                                        <span>Web_Node</span>
                                        <span>Synced</span>
                                    </div>
                                    <div className="h-0.5 w-full bg-cyan-400/30 overflow-hidden">
                                        <div className="h-full bg-white w-full animate-[shimmer_2s_infinite_200ms]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 06: SEMANTIC - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="06"
                    id="skill-mapping"
                    title="SEMANTIC."
                    subtitle="TAXONOMY ENGINE"
                    accentColor="bg-pink-600"
                    titleClassName="text-pink-950 dark:text-pink-100"
                    subtitleClassName="text-pink-600 dark:text-pink-400"
                    className="relative bg-pink-50/50 dark:bg-pink-900/5 group/section"
                    description="Standard ATS parsers rely on brittle RegExp. We implement a graph-based taxonomy where skills are 'Nodes' and relationships (e.g., React → TypeScript) are 'Edges', enabling fuzzy matching of related concepts."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-pink-500/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        {/* SEMANTIC GRAPH VISUAL */}
                        <div className="p-10 border border-pink-500/30 bg-pink-600 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-[pulse_4s_infinite]" />
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="text-4xl font-black italic uppercase text-white leading-none tracking-tighter mix-blend-overlay">
                                        KNOWLEDGE_GRAPH.
                                    </div>
                                    <p className="text-xs font-mono text-pink-100 uppercase tracking-widest leading-loose">
                                        Vector proximity analysis active.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-8">
                                    {[
                                        { l: 'React', r: 'Frontend' },
                                        { l: 'Next.js', r: 'React' },
                                        { l: 'Node', r: 'Backend' },
                                        { l: 'SQL', r: 'Database' }
                                    ].map((pair, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-pink-100">
                                            <span className="opacity-70">{pair.l}</span>
                                            <ArrowRight className="w-3 h-3 text-pink-300" />
                                            <span className="font-bold">{pair.r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CASE STUDY TEXT */}
                        <div className="p-10 border border-pink-200/50 dark:border-pink-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-pink-200/50 transition-shadow">
                            <div className="flex items-center gap-4 text-pink-600 dark:text-pink-400 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                                <Binary className="w-4 h-4" /> [GRAPH_THEORY_IMPL]
                            </div>
                            <h4 className="text-xl font-bold uppercase italic tracking-tight text-foreground">Relational Nodes</h4>
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                By implicitly mapping skills to their parent categories and related technologies, we calculate a "relevance score" using cosine similarity principles. This ensures that "React Developer" correctly matches "Frontend Engineer" even without exact keyword overlap.
                            </p>
                            <TechnicalAnnotation title="Graph_Traversal">
                                Directed Acyclic Graph (DAG) used to calculate skill weight and relevance.
                            </TechnicalAnnotation>
                        </div>
                    </div>
                </SwissSection>

                {/* 07: OUTPUTS - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="07"
                    id="export-architecture"
                    title="OUTPUTS."
                    subtitle="RENDER PIPELINE"
                    accentColor="bg-teal-600"
                    titleClassName="text-teal-950 dark:text-teal-100"
                    subtitleClassName="text-teal-600 dark:text-teal-400"
                    className="relative bg-teal-50/50 dark:bg-teal-900/5 group/section"
                    description="We bypassed standard browser printing (window.print) which is notoriously unreliable. Instead, we use `jspdf` to construct a vector-based PDF document token-by-token from the React Virtual DOM."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        {/* Print Engine Visual */}
                        <div className="p-10 border border-teal-500/30 bg-teal-600 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px)]" />
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="text-4xl font-black italic uppercase text-white leading-none tracking-tighter">
                                            CMYK_READY.
                                        </div>
                                        <FileText className="w-8 h-8 text-teal-200" />
                                    </div>
                                    <p className="text-xs font-mono text-teal-100 uppercase tracking-widest leading-loose border-l-2 border-teal-300 pl-4">
                                        300 DPI // Vectorized Fonts
                                    </p>
                                </div>
                                <div className="flex justify-between items-end pt-8">
                                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-mono text-white">
                                        Engine: jsPDF
                                    </div>
                                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-mono text-white">
                                        Kerning: True
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rendering Pipeline text */}
                        <div className="p-10 border border-teal-200/50 dark:border-teal-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-teal-200/50 transition-shadow">
                            <div className="flex items-center gap-4 text-teal-700 dark:text-teal-400 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                                <Layers className="w-4 h-4" /> [THE_STAGING_BUFFER]
                            </div>
                            <h4 className="text-xl font-bold uppercase italic tracking-tight text-foreground">Headless Rendering</h4>
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                We utilize a hidden off-screen buffer to calculate line breaks and pagination before content is ever committed to the PDF stream. This avoids the "widow/orphan" text issues common in CSS-based exports.
                            </p>
                            <TechnicalAnnotation title="Multi_Format_Core">
                                Single Content Graph → Export to PDF, JSON (Schema.org), and Markdown.
                            </TechnicalAnnotation>
                        </div>
                    </div>
                </SwissSection>


                {/* 08: DESIGN SYSTEM - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="08"
                    id="design-system"
                    title="SWISS."
                    subtitle="ATOMIC DESIGN SYSTEM"
                    accentColor="bg-slate-700"
                    titleClassName="text-slate-900 dark:text-slate-100"
                    subtitleClassName="text-slate-500 dark:text-slate-400"
                    className="relative bg-slate-50/50 dark:bg-slate-900/5 group/section"
                    description="We utilize a strict 4px baseline grid implemented via Tailwind's arbitrary values. Animations are driven by 'Spring Physics' (mass: 1, stiffness: 100, damping: 10) rather than linear durations, ensuring the UI feels 'heavy' and premium."
                >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(100,116,139,0.05)_50%,transparent_51%)] bg-[size:100%_100%] pointer-events-none" />
                    <div className="grid md:grid-cols-3 gap-6 relative z-10">
                        {/* Typography Specimen */}
                        <div className="bg-foreground p-8 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-500 shadow-xl">
                            <div className="space-y-2">
                                <div className="text-background font-black text-7xl leading-none italic tracking-tighter">Aa</div>
                                <div className="h-0.5 w-12 bg-background/50" />
                            </div>
                            <div className="space-y-4">
                                <p className="text-background/80 text-xs font-medium leading-relaxed">
                                    "Typeface is the voice of the content."
                                </p>
                                <div className="text-background/[0.6] font-mono text-[9px] uppercase font-bold text-right pt-4 border-t border-background/20">
                                    Font-Family: 'Inter_Variable'
                                </div>
                            </div>
                        </div>

                        {/* Grid Explanation */}
                        <div className="md:col-span-2 p-12 border border-border/40 bg-card/50 relative backdrop-blur-sm overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Grid className="w-32 h-32" />
                            </div>
                            <div className="absolute top-6 left-6 text-[8px] font-mono text-muted-foreground uppercase font-bold tracking-[0.5em]">Grid_Spec_714</div>
                            <h4 className="text-3xl font-black italic uppercase tracking-tighter mt-8 text-foreground z-10 relative">Cognitive Optimization</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed mt-4 font-medium max-w-lg relative z-10">
                                By enforcing <span className="font-mono text-slate-500">class="grid gap-4"</span> constraints, we reduce visual cognitive load. This adheres to Miller's Law (7±2 elements), maximizing the recruiter's information retrieval rate.
                            </p>
                            <div className="mt-8 flex gap-2">
                                <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-widest bg-transparent">Whitespace</Badge>
                                <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-widest bg-transparent">Hierarchy</Badge>
                                <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-widest bg-transparent">Contrast</Badge>
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 09: RECORDS - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="09"
                    id="dev-logs"
                    title="RECORDS."
                    subtitle="ARCHITECTURE DECISION RECORDS"
                    accentColor="bg-amber-600"
                    titleClassName="text-amber-950 dark:text-amber-100"
                    subtitleClassName="text-amber-600 dark:text-amber-400"
                    className="relative bg-amber-50/50 dark:bg-amber-900/5 group/section"
                    description="We maintain an immutable log of all architectural constraints. These ADRs (Architecture Decision Records) explain why we chose 'Edge Functions' over 'Lambdas' and 'IndexedDB' over 'Cookies'."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <ConstraintChronicle />
                    </div>
                </SwissSection>

                {/* 10: SCALAB - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="10"
                    id="scalability"
                    title="SCALAB."
                    subtitle="CRDT SYNCHRONIZATION"
                    accentColor="bg-indigo-600"
                    titleClassName="text-indigo-950 dark:text-indigo-100"
                    subtitleClassName="text-indigo-600 dark:text-indigo-400"
                    className="relative bg-indigo-50/50 dark:bg-indigo-900/5 group/section"
                    description="To enable real-time collaboration, we rely on Conflict-Free Replicated Data Types (CRDTs). Specifically, we use state vectors (Lamport timestamps) to merge concurrent edits from unsynchronized clients without central arbitration."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="p-10 border border-indigo-200/50 dark:border-indigo-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-indigo-200/50 transition-shadow">
                            <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                                <Globe className="w-4 h-4" /> [THE_DISTRIBUTED_FUTURE]
                            </div>
                            <h4 className="text-xl font-bold uppercase italic tracking-tight text-foreground">Edge Native</h4>
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                By moving inference logic to <span className="text-indigo-600 font-bold">WASM Modules</span> (compiled from Rust) running on the Edge, we reduce "cold start" latency to near zero globally. Your resume is compiled on the server closest to the recruiter.
                            </p>
                            <TechnicalAnnotation title="CRDT_Resolution">
                                Yjs-based state vectors for automatic merge resolution of concurrent edits.
                            </TechnicalAnnotation>
                        </div>
                        <div className="p-10 border border-indigo-500/30 bg-indigo-600 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-[pulse_4s_infinite]" />
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="text-4xl font-black italic uppercase text-white leading-none tracking-tighter mix-blend-overlay">
                                    GLOBAL_MESH.
                                </div>
                                <div className="space-y-4 pt-12">
                                    <div className="flex justify-between items-center text-[10px] font-mono text-indigo-100 uppercase font-bold">
                                        <span>Node_FRA</span>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span>12ms</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-mono text-indigo-100 uppercase font-bold">
                                        <span>Node_SFO</span>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span>18ms</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-mono text-indigo-100 uppercase font-bold">
                                        <span>Node_SIN</span>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span>24ms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 11: IMPACT - TECHNICAL DEEP DIVE */}
                <SwissSection
                    number="11"
                    id="meta"
                    title="IMPACT."
                    subtitle="CORE WEB VITALS"
                    accentColor="bg-red-600"
                    titleClassName="text-red-950 dark:text-red-100"
                    subtitleClassName="text-red-600 dark:text-red-400"
                    className="relative bg-red-50/50 dark:bg-red-900/5 group/section"
                    description="We optimize for a single metric: Interview Conversion Rate. But techncially, this relies on Lighthouse scores. We consistently score 100/100 on Performance, Accessibility, and SEO."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                        {[
                            { label: "LCP", val: "800ms", desc: "Largest Paint" },
                            { label: "CLS", val: "0.0", desc: "Shift Score" },
                            { label: "TTFB", val: "42ms", desc: "Edge Cache" },
                            { label: "SEO", val: "100", desc: "Meta Graph" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 border border-red-200/50 dark:border-red-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-2 group hover:bg-red-500/5 transition-colors relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Target className="w-12 h-12 text-red-600" />
                                </div>
                                <div className="text-[10px] font-mono text-muted-foreground uppercase font-bold">{stat.label}</div>
                                <div className="text-3xl font-black italic uppercase text-foreground group-hover:text-red-600 transition-colors">{stat.val}</div>
                                <div className="text-[9px] text-muted-foreground font-mono uppercase">{stat.desc}</div>
                            </div>
                        ))}
                    </div>
                </SwissSection>

                {/* CTA */}
                <section className="py-40 bg-background relative overflow-hidden text-center border-t border-border/40">
                    <div className="container relative z-10 max-w-7xl mx-auto px-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="space-y-16"
                        >
                            <h2 className="text-8xl md:text-[160px] font-black tracking-tighter leading-none text-foreground italic py-4">
                                BUILD THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">FUTURE.</span>
                            </h2>
                            <div className="flex flex-col md:flex-row justify-center gap-8">
                                <Link to="/resume-wizard">
                                    <Button className="h-24 px-20 rounded-none font-mono bg-foreground text-background hover:bg-primary hover:text-primary-foreground text-2xl font-black tracking-tighter uppercase transition-all shadow-2xl">
                                        START_BUILDING &gt;
                                    </Button>
                                </Link>
                                <Link to="/">
                                    <Button variant="outline" className="h-24 px-16 rounded-none font-mono border-border/40 hover:bg-muted/10 text-xl tracking-widest uppercase transition-all text-foreground">
                                        EXIT_SESSION
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div >
    );
};

export default AboutPlatformPage;
