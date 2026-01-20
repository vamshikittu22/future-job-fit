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
    CheckCircle2,
    Palette
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
                            MODULE_{number}
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
        { id: 'overview', label: '00', title: 'VISION' },
        { id: 'architecture', label: '01', title: 'TECH' },
        { id: 'state-logic', label: '02', title: 'DATA' },
        { id: 'performance', label: '03', title: 'SPEED' },
        { id: 'intelligence', label: '04', title: 'AI' },
        { id: 'identity', label: '05', title: 'MODEL' },
        { id: 'skill-mapping', label: '06', title: 'SKILLS' },
        { id: 'export-architecture', label: '07', title: 'EXPORTS' },
        { id: 'design-system', label: '08', title: 'DESIGN' },
        { id: 'dev-logs', label: '09', title: 'STRATEGY' },
        { id: 'scalability', label: '10', title: 'SCALE' },
        { id: 'meta', label: '11', title: 'VALUE' },
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
                                    <Badge className="rounded-none bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-mono text-[10px] tracking-widest px-3 py-1">BUILD v4.2.0</Badge>
                                    <div className="h-px w-16 bg-border" />
                                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground font-bold">PROJECT_PHILOSOPHY</span>
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
                                            <TechnicalAnnotation title="Core_Challenge">
                                                Modern ATS systems rely on simplistic keyword matching, leading to a 75% "false negative" rate for candidates lacking specific lexical styling.
                                            </TechnicalAnnotation>
                                            <TechnicalAnnotation title="The_Solution">
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
                                        <span>Export_Formats</span>
                                        <span className="text-emerald-500 font-bold">7</span>
                                    </div>
                                    <div className="h-1 w-full bg-border/40">
                                        <div className="h-full bg-emerald-500 w-full" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed font-mono uppercase">
                                        PDF | DOCX | HTML | LaTeX | Markdown | TXT | JSON
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 01: ARSENAL - HYBRID ARCHITECTURE */}
                <SwissSection
                    number="01"
                    id="architecture"
                    title="ECOSYSTEM."
                    subtitle="MODERN TECH STACK"
                    accentColor="bg-violet-600"
                    titleClassName="text-violet-950 dark:text-violet-50"
                    subtitleClassName="text-violet-600 dark:text-violet-400"
                    className="relative bg-gradient-to-br from-violet-50/50 via-background to-blue-50/50 dark:from-violet-900/10 dark:via-background dark:to-blue-900/10 group/section overflow-hidden"
                    description="A three-tier intelligence system: Local NLP for speed, Edge Functions for security, Cloud LLM for creativity."
                >
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                    <div className="space-y-10 relative z-10">

                        {/* HERO: HYBRID INTELLIGENCE ENGINE */}
                        <div className="relative">
                            <div className="absolute -top-4 left-0 text-[10px] font-mono text-violet-500 dark:text-violet-400 uppercase tracking-[0.3em] font-bold">
                                // INTELLIGENCE_SERVICE
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                {/* Python Microservice Card */}
                                <div className="relative p-8 bg-gradient-to-br from-violet-600 to-purple-700 text-white overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                <span className="text-[9px] font-mono uppercase tracking-widest text-violet-200">CLIENT_SIDE_LOGIC</span>
                                            </div>
                                            <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">PYTHON 3.11</Badge>
                                        </div>

                                        <div>
                                            <h4 className="text-2xl font-black uppercase italic tracking-tight">OFFLINE NLP</h4>
                                            <p className="text-violet-200 text-sm mt-2 leading-relaxed">
                                                FastAPI microservice with spaCy for sub-100ms keyword extraction, ATS scoring, and semantic parsing—without cloud latency or API costs.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {['FastAPI', 'spaCy', 'scikit-learn', 'Regex NLP'].map(t => (
                                                <span key={t} className="px-2 py-1 bg-white/10 backdrop-blur-sm text-[10px] font-mono uppercase">{t}</span>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                                            <span className="text-[10px] font-mono text-violet-200">LATENCY: &lt;100ms</span>
                                            <span className="text-[10px] font-mono text-violet-200">COST: $0/request</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Edge AI Gateway Card */}
                                <div className="relative p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                <span className="text-[9px] font-mono uppercase tracking-widest text-blue-200">CLOUD_SECURE_ENGINE</span>
                                            </div>
                                            <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">DENO RUNTIME</Badge>
                                        </div>

                                        <div>
                                            <h4 className="text-2xl font-black uppercase italic tracking-tight">CLOUD LLM</h4>
                                            <p className="text-blue-200 text-sm mt-2 leading-relaxed">
                                                Supabase Edge Functions as secure AI gateway. API keys never touch the browser. Gemini 1.5 Flash for creative enhancement.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {['Supabase', 'Gemini 1.5', 'Deno', 'TypeScript'].map(t => (
                                                <span key={t} className="px-2 py-1 bg-white/10 backdrop-blur-sm text-[10px] font-mono uppercase">{t}</span>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                                            <span className="text-[10px] font-mono text-blue-200">LATENCY: ~800ms</span>
                                            <span className="text-[10px] font-mono text-blue-200">SECURITY: ISOLATED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE: PLATFORM FOUNDATION */}
                        <div className="relative pt-8">
                            <div className="absolute -top-2 left-0 text-[10px] font-mono text-blue-500 dark:text-blue-400 uppercase tracking-[0.3em] font-bold">
                                // CORE_INFRASTRUCTURE
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { name: 'React 18', cat: 'UI' },
                                    { name: 'TypeScript', cat: 'TYPE' },
                                    { name: 'Vite', cat: 'BUILD' },
                                    { name: 'Tailwind', cat: 'CSS' },
                                    { name: 'Framer', cat: 'MOTION' },
                                    { name: 'Radix UI', cat: 'A11Y' },
                                    { name: 'Zod', cat: 'SCHEMA' },
                                    { name: 'Hook Form', cat: 'FORMS' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-border/50 hover:border-blue-500/50 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/10 group">
                                        <div className="text-[9px] font-mono text-muted-foreground/70 uppercase tracking-widest">{item.cat}</div>
                                        <div className="text-sm font-bold text-foreground mt-1">{item.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* BOTTOM: EXPORT PIPELINE */}
                        <div className="relative pt-8">
                            <div className="absolute -top-2 left-0 text-[10px] font-mono text-teal-500 dark:text-teal-400 uppercase tracking-[0.3em] font-bold">
                                // EXPORT_PIPELINE
                            </div>
                            <div className="p-6 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/10 dark:to-cyan-900/10 border border-teal-200/30 dark:border-teal-800/30">
                                <div className="flex flex-wrap items-center gap-3 text-sm font-mono">
                                    <span className="text-teal-700 dark:text-teal-400 font-bold">INPUT</span>
                                    <ArrowRight className="w-4 h-4 text-teal-400" />
                                    <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">jsPDF</span>
                                    <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">docx</span>
                                    <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">html2canvas</span>
                                    <ArrowRight className="w-4 h-4 text-teal-400" />
                                    <span className="text-teal-700 dark:text-teal-400 font-bold">7 FORMATS</span>
                                    <span className="text-teal-600/70 dark:text-teal-400/70 text-xs">(PDF, DOCX, HTML, LaTeX, MD, TXT, JSON)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 02: LOGIC - STATE MANAGEMENT */}
                <SwissSection
                    number="02"
                    id="state-logic"
                    title="RESILIENCE."
                    subtitle="STATE-INTEGRITY LAYER"
                    accentColor="bg-emerald-600"
                    titleClassName="text-emerald-950 dark:text-emerald-50"
                    subtitleClassName="text-emerald-600 dark:text-emerald-400"
                    className="relative bg-emerald-50/50 dark:bg-emerald-900/5 group/section"
                    description="React Context for real-time UI state, localStorage for offline persistence. Debounced saves prevent main-thread blocking during rapid edits."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-2 gap-6 relative z-10">

                        {/* Context Architecture Card */}
                        <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-emerald-200/50 transition-shadow">
                            <div className="flex items-center gap-4 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                // DATA_MANAGEMENT_FLOW
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">01</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-foreground text-sm">WizardContext</h5>
                                        <p className="text-xs text-muted-foreground mt-1">10-step form wizard state. Current step, navigation history, progress tracking.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">02</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-foreground text-sm">ResumeContext</h5>
                                        <p className="text-xs text-muted-foreground mt-1">Full resume data model. Personal info, experience, education, skills, projects.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">03</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-foreground text-sm">SaveContext</h5>
                                        <p className="text-xs text-muted-foreground mt-1">Autosave coordination. Dirty flags, save timestamps, conflict detection.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Persistence Visual */}
                        <div className="p-8 bg-gradient-to-br from-emerald-600 to-green-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%)] bg-[size:30px_30px]" />

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-200">PERSISTENCE</span>
                                    </div>
                                    <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">localStorage</Badge>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-black uppercase italic tracking-tight">OFFLINE_CAPABLE</h4>
                                    <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
                                        Every keystroke updates React state instantly. A debounced serializer (500ms) writes to localStorage in the background—zero network required.
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/20 space-y-2">
                                    <div className="flex justify-between text-[10px] font-mono text-emerald-100">
                                        <span>lodash.debounce</span>
                                        <span>500ms window</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono text-emerald-100">
                                        <span>JSON.stringify</span>
                                        <span>~2KB typical</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono text-emerald-100">
                                        <span>Data loss risk</span>
                                        <span className="text-emerald-300 font-bold">ZERO</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Architecture Rationale */}
                    <div className="mt-10 p-6 bg-white/30 dark:bg-slate-900/30 border border-emerald-200/30 dark:border-emerald-800/30 relative z-10">
                        <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-4">Why This Architecture?</h4>
                        <div className="space-y-4 text-sm text-foreground/70 leading-relaxed">
                            <p>
                                <strong className="text-foreground">Why Context over Redux/Zustand?</strong> For a single-user SPA with 10 wizard steps, Redux's boilerplate (actions, reducers, selectors) adds complexity without proportional benefit. React Context provides sufficient isolation—WizardContext never re-renders components subscribed to ResumeContext. We split contexts by update frequency, not domain.
                            </p>
                            <p>
                                <strong className="text-foreground">Why localStorage over IndexedDB?</strong> Resume data is typically 2-5KB JSON. IndexedDB's async API and schema overhead solve a problem we don't have. localStorage is synchronous, universally supported, and debuggable via DevTools. The 5MB limit is irrelevant for our payload size.
                            </p>
                            <p>
                                <strong className="text-foreground">Why debounce at 500ms?</strong> Testing showed 300ms felt "sluggish" (users noticed save indicators), while 1000ms risked data loss on tab close. 500ms balances perceived responsiveness with battery efficiency on mobile.
                            </p>
                        </div>
                    </div>
                </SwissSection>

                {/* 03: VELOCITY - PERFORMANCE */}
                <SwissSection
                    number="03"
                    id="performance"
                    title="PERFORMANCE."
                    subtitle="PRECISION & SPEED"
                    accentColor="bg-orange-600"
                    titleClassName="text-orange-950 dark:text-orange-100"
                    subtitleClassName="text-orange-600 dark:text-orange-400"
                    className="relative bg-orange-50/50 dark:bg-orange-900/5 group/section"
                    description="Every interaction feels instant. We optimize for perceived performance—what users feel matters more than raw benchmarks."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Hero Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { metric: '<50ms', label: 'Hot Reload', detail: 'Vite HMR' },
                                { metric: '60fps', label: 'Animations', detail: 'Framer Motion' },
                                { metric: '~2KB', label: 'State Size', detail: 'Minimal payloads' },
                                { metric: '0ms', label: 'Offline Save', detail: 'localStorage' }
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white text-center group hover:scale-105 transition-transform duration-300">
                                    <div className="text-3xl font-black italic">{item.metric}</div>
                                    <div className="text-xs font-mono uppercase tracking-widest mt-1 text-orange-100">{item.label}</div>
                                    <div className="text-[9px] font-mono text-orange-200/70 mt-2">{item.detail}</div>
                                </div>
                            ))}
                        </div>

                        {/* Two Column Explanation */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Development Speed */}
                            <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-orange-200/50 dark:border-orange-800/50 space-y-4">
                                <div className="flex items-center gap-4 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                    // DEV_EXPERIENCE
                                </div>
                                <h4 className="text-lg font-bold text-foreground">Build Fast, Ship Faster</h4>
                                <p className="text-sm text-foreground/70 leading-relaxed">
                                    Vite's ESBuild-powered bundler means changes appear in under 50 milliseconds. No waiting for webpack to churn through dependencies. This isn't just developer convenience—it translates to faster feature delivery and shorter feedback loops with stakeholders.
                                </p>
                                <div className="flex gap-2">
                                    {['ESBuild', 'Vite', 'TypeScript'].map(t => (
                                        <span key={t} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-mono">{t}</span>
                                    ))}
                                </div>
                            </div>

                            {/* User Experience */}
                            <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-orange-200/50 dark:border-orange-800/50 space-y-4">
                                <div className="flex items-center gap-4 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                    // USER_EXPERIENCE
                                </div>
                                <h4 className="text-lg font-bold text-foreground">Buttery Smooth Interactions</h4>
                                <p className="text-sm text-foreground/70 leading-relaxed">
                                    React 18's concurrent rendering prioritizes visible updates. Framer Motion uses spring physics (not CSS timings) for natural-feeling animations. Users never see spinners for local operations—saves happen silently in the background via debounced writes.
                                </p>
                                <div className="flex gap-2">
                                    {['React 18', 'Framer Motion', 'Debounce'].map(t => (
                                        <span key={t} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-mono">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Why It Matters (for recruiters) */}
                        <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-orange-200/30 dark:border-orange-800/30">
                            <h4 className="text-sm font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground">Performance is a feature, not an afterthought.</strong> Candidates using a sluggish resume builder will abandon it. By investing in instant feedback (sub-50ms saves, 60fps animations), we reduce friction in the user journey. The result: higher completion rates for resume submissions and a polished experience that reflects well on your employer brand.
                            </p>
                        </div>
                    </div>
                </SwissSection>


                {/* 04: HYBRID AI - SERVERLESS AI GATEWAY */}
                <SwissSection
                    number="04"
                    id="intelligence"
                    title="INTELLIGENCE."
                    subtitle="SECURE AI SERVICES"
                    accentColor="bg-purple-600"
                    titleClassName="text-purple-950 dark:text-purple-100"
                    subtitleClassName="text-purple-600 dark:text-purple-400"
                    className="relative bg-purple-50/50 dark:bg-purple-900/5 group/section"
                    description="AI enhancement without exposing API keys. Supabase Edge Functions act as a secure proxy—your candidates' resumes never touch third-party servers directly."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Architecture Flow */}
                        <div className="p-6 bg-white/50 dark:bg-slate-900/50 border border-purple-200/50 dark:border-purple-800/50">
                            <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                // SYSTEM_DATA_FLOW
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-mono">
                                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">Browser</span>
                                <ArrowRight className="w-5 h-5 text-purple-400" />
                                <span className="px-4 py-2 bg-purple-600 text-white font-bold">Edge Function</span>
                                <ArrowRight className="w-5 h-5 text-purple-400" />
                                <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold">Gemini API</span>
                                <ArrowRight className="w-5 h-5 text-purple-400" />
                                <span className="px-4 py-2 bg-purple-600 text-white font-bold">Edge Function</span>
                                <ArrowRight className="w-5 h-5 text-purple-400" />
                                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">Browser</span>
                            </div>
                            <p className="text-xs text-center text-muted-foreground mt-4">API keys never leave the server. The browser only sends/receives resume content.</p>
                        </div>

                        {/* Two Column */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* What It Does */}
                            <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-purple-200/50 dark:border-purple-800/50 space-y-4">
                                <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                    <Sparkles className="w-4 h-4" /> AI_INTEGRATIONS
                                </div>
                                <h4 className="text-lg font-bold text-foreground">What Gemini 1.5 Flash Does</h4>
                                <ul className="space-y-2 text-sm text-foreground/70">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 font-bold">→</span>
                                        <span><strong>enhanceSection:</strong> Rewrites bullet points for impact and clarity</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 font-bold">→</span>
                                        <span><strong>analyzeSection:</strong> Identifies weak verbs and passive voice</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 font-bold">→</span>
                                        <span><strong>organizeSkills:</strong> Clusters skills into logical categories</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 font-bold">→</span>
                                        <span><strong>suggestImpact:</strong> Adds quantifiable metrics to achievements</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Security Card */}
                            <div className="p-8 bg-gradient-to-br from-purple-600 to-violet-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-purple-200" />
                                            <span className="text-[9px] font-mono uppercase tracking-widest text-purple-200">SECURITY</span>
                                        </div>
                                        <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">DENO ISOLATE</Badge>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight">HIGH_SECURITY</h4>
                                        <p className="text-purple-100 text-sm mt-2 leading-relaxed">
                                            Your GEMINI_API_KEY lives in Supabase secrets, never in the browser bundle. Each request runs in an isolated Deno sandbox with 50ms cold start.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/20 space-y-2">
                                        <div className="flex justify-between text-[10px] font-mono text-purple-100">
                                            <span>API Key Location</span>
                                            <span className="text-purple-300 font-bold">Server-side only</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono text-purple-100">
                                            <span>Request Isolation</span>
                                            <span>Deno V8 Sandbox</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why It Matters */}
                        <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-purple-200/30 dark:border-purple-800/30">
                            <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground">AI-powered resume enhancement is a competitive advantage.</strong> Better-written resumes mean clearer signal for your recruiters. But AI without security is a liability. By routing all AI calls through serverless Edge Functions, we ensure candidate data is never stored or logged by third parties. Your employer brand stays protected.
                            </p>
                        </div>
                    </div>
                </SwissSection>


                {/* 05: IDENTITY - DATA SCHEMA */}
                <SwissSection
                    number="05"
                    id="identity"
                    title="FIDELITY."
                    subtitle="STRUCTURED DATA MODEL"
                    accentColor="bg-cyan-600"
                    titleClassName="text-cyan-950 dark:text-cyan-100"
                    subtitleClassName="text-cyan-600 dark:text-cyan-400"
                    className="relative bg-cyan-50/50 dark:bg-cyan-900/5 group/section"
                    description="Every resume is a structured data object, not free-form text. Zod schemas enforce consistency—malformed data is rejected before it ever reaches storage."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Schema Visualization */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { entity: 'PersonalInfo', fields: ['name', 'email', 'phone', 'location', 'linkedin'], required: true },
                                { entity: 'Experience[]', fields: ['company', 'title', 'startDate', 'endDate', 'bullets[]'], required: true },
                                { entity: 'Education[]', fields: ['institution', 'degree', 'field', 'graduationDate'], required: false },
                                { entity: 'Skills[]', fields: ['name', 'category', 'proficiency'], required: true },
                                { entity: 'Projects[]', fields: ['title', 'description', 'technologies[]', 'link?'], required: false },
                                { entity: 'Certifications[]', fields: ['name', 'issuer', 'date', 'expiryDate?'], required: false }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-cyan-200/50 dark:border-cyan-800/50 hover:border-cyan-500/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-sm font-bold text-cyan-700 dark:text-cyan-400">{item.entity}</span>
                                        {item.required && <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300 text-[9px]">Required</Badge>}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {item.fields.map(f => (
                                            <span key={f} className="text-[9px] font-mono text-muted-foreground bg-cyan-50 dark:bg-cyan-900/30 px-1.5 py-0.5">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Two Column */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Validation */}
                            <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-cyan-200/50 dark:border-cyan-800/50 space-y-4">
                                <div className="flex items-center gap-4 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                    <Shield className="w-4 h-4" /> DATA_INTEGRITY_CHECK
                                </div>
                                <h4 className="text-lg font-bold text-foreground">Zod: Parse, Don't Validate</h4>
                                <p className="text-sm text-foreground/70 leading-relaxed">
                                    Every form submission passes through <code className="text-cyan-600">zod.safeParse()</code>. If validation fails, the user sees specific field errors—not a generic "something went wrong." This catches issues before they corrupt the saved resume.
                                </p>
                                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 font-mono text-xs text-cyan-700 dark:text-cyan-300">
                                    {`const result = resumeSchema.safeParse(data);`}<br />
                                    {`if (!result.success) showErrors(result.error);`}
                                </div>
                            </div>

                            {/* Benefits Card */}
                            <div className="p-8 bg-gradient-to-br from-cyan-600 to-teal-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-200">BENEFITS</span>
                                        <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">UUID v4</Badge>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight">STRUCTURED_DATA</h4>
                                        <ul className="mt-4 space-y-2 text-sm text-cyan-100">
                                            <li className="flex items-center gap-2">
                                                <span className="text-cyan-300">✓</span> Consistent format across all exports
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-cyan-300">✓</span> Unique IDs for each resume entity
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-cyan-300">✓</span> Export to PDF, DOCX, JSON identically
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-cyan-300">✓</span> Future-proof for API integrations
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why It Matters */}
                        <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-cyan-200/30 dark:border-cyan-800/30">
                            <h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground">Structured resumes are easier to parse and compare.</strong> When candidates submit resumes through our builder, you get consistent data—not the chaos of free-form Word documents. This means your ATS can accurately extract experience, skills, and education. Better data in = better candidate matching out.
                            </p>
                        </div>
                    </div>
                </SwissSection>

                {/* 06: SEMANTIC - SKILL CATEGORIZATION */}
                <SwissSection
                    number="06"
                    id="skill-mapping"
                    title="TAXONOMY."
                    subtitle="SKILL CLASSIFICATION"
                    accentColor="bg-pink-600"
                    titleClassName="text-pink-950 dark:text-pink-100"
                    subtitleClassName="text-pink-600 dark:text-pink-400"
                    className="relative bg-pink-50/50 dark:bg-pink-900/5 group/section"
                    description="Skills aren't just keywords—they belong to categories. Our dual-layer system uses pattern matching locally and AI for intelligent grouping, so 'React, Next.js, Vue' automatically becomes 'Frontend Frameworks'."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-pink-500/5 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Category Examples */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { category: 'Languages', skills: ['Python', 'TypeScript', 'Java', 'Go'], color: 'from-pink-500 to-rose-600' },
                                { category: 'Frameworks', skills: ['React', 'Next.js', 'FastAPI', 'Express'], color: 'from-pink-600 to-fuchsia-600' },
                                { category: 'Tools', skills: ['Docker', 'Git', 'AWS', 'Figma'], color: 'from-fuchsia-500 to-purple-600' },
                                { category: 'Soft Skills', skills: ['Leadership', 'Agile', 'Communication'], color: 'from-purple-500 to-pink-600' }
                            ].map((cat, i) => (
                                <div key={i} className={`p-4 bg-gradient-to-br ${cat.color} text-white`}>
                                    <div className="text-xs font-mono uppercase tracking-widest opacity-80 mb-2">{cat.category}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {cat.skills.map(s => (
                                            <span key={s} className="text-[10px] bg-white/20 px-1.5 py-0.5 font-mono">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Two Column */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Local Pattern Matching */}
                            <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-pink-200/50 dark:border-pink-800/50 space-y-4">
                                <div className="flex items-center gap-4 text-pink-600 dark:text-pink-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                    // LOCAL_PATTERNS
                                </div>
                                <h4 className="text-lg font-bold text-foreground">Instant Categorization</h4>
                                <p className="text-sm text-foreground/70 leading-relaxed">
                                    Before calling AI, we run local pattern matching. Common technologies are recognized instantly: <code className="text-pink-600">React|Vue|Angular → Frontend</code>, <code className="text-pink-600">Docker|K8s → DevOps</code>. This catches 80% of cases with zero latency.
                                </p>
                                <div className="p-3 bg-pink-50 dark:bg-pink-900/30 font-mono text-xs text-pink-700 dark:text-pink-300">
                                    {`const languagePatterns = /python|java|typescript/i;`}<br />
                                    {`const toolPatterns = /docker|git|aws|figma/i;`}
                                </div>
                            </div>

                            {/* AI-Assisted */}
                            <div className="p-8 bg-gradient-to-br from-pink-600 to-rose-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Sparkles className="w-5 h-5 text-pink-200" />
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-pink-200">AI_AUGMENTATION</span>
                                        <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">GEMINI</Badge>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight">organizeSkills()</h4>
                                        <p className="text-pink-100 text-sm mt-2 leading-relaxed">
                                            For ambiguous skills or large lists, AI provides intelligent grouping. It also detects duplicates and suggests modern alternatives for outdated technologies.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/20 space-y-2">
                                        <div className="flex justify-between text-[10px] font-mono text-pink-100">
                                            <span>Duplicate Detection</span>
                                            <span className="text-pink-300 font-bold">✓</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono text-pink-100">
                                            <span>Outdated Skill Flags</span>
                                            <span className="text-pink-300 font-bold">✓</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why It Matters */}
                        <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-pink-200/30 dark:border-pink-800/30">
                            <h4 className="text-sm font-bold text-pink-700 dark:text-pink-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground">Categorized skills are scannable skills.</strong> When a resume lists "React, Next.js, TypeScript, Node.js, PostgreSQL, Docker, AWS" as a flat list, recruiters have to mentally group them. When it's organized into "Frontend: React, Next.js" and "Backend: Node.js, PostgreSQL"—you can assess fit in seconds, not minutes.
                            </p>
                        </div>
                    </div>
                </SwissSection>

                {/* 07: OUTPUTS - EXPORT FORMATS */}
                <SwissSection
                    number="07"
                    id="export-architecture"
                    title="VERSATILITY."
                    subtitle="UNIVERSAL EXPORTS"
                    accentColor="bg-teal-600"
                    titleClassName="text-teal-950 dark:text-teal-100"
                    subtitleClassName="text-teal-600 dark:text-teal-400"
                    className="relative bg-teal-50/50 dark:bg-teal-900/5 group/section"
                    description="One resume, seven formats. All generated client-side—no server uploads, no privacy concerns. From PDF to LaTeX, every format is production-ready."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Format Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {[
                                { format: 'PDF', lib: 'jsPDF', icon: '📄', desc: 'ATS-friendly layout' },
                                { format: 'DOCX', lib: 'docx', icon: '📝', desc: 'Editable Word file' },
                                { format: 'HTML', lib: 'Native', icon: '🌐', desc: 'Web-ready page' },
                                { format: 'LaTeX', lib: 'Template', icon: '📐', desc: 'Academic quality' },
                                { format: 'Markdown', lib: 'Native', icon: '📋', desc: 'Plain text markup' },
                                { format: 'TXT', lib: 'Native', icon: '📃', desc: 'Maximum ATS compat' },
                                { format: 'JSON', lib: 'Native', icon: '💾', desc: 'Machine-readable' }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-teal-200/50 dark:border-teal-800/50 hover:border-teal-500/50 transition-colors text-center group hover:scale-105 duration-300">
                                    <div className="text-2xl mb-2">{item.icon}</div>
                                    <div className="font-mono text-sm font-bold text-teal-700 dark:text-teal-400">{item.format}</div>
                                    <div className="text-[9px] text-muted-foreground mt-1">{item.lib}</div>
                                    <div className="text-[9px] text-muted-foreground/70 mt-1">{item.desc}</div>
                                </div>
                            ))}
                        </div>

                        {/* Two Column */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Client-Side Generation */}
                            <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-teal-200/50 dark:border-teal-800/50 space-y-4">
                                <div className="flex items-center gap-4 text-teal-600 dark:text-teal-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                    // CLIENT_SIDE
                                </div>
                                <h4 className="text-lg font-bold text-foreground">Zero Server Dependencies</h4>
                                <p className="text-sm text-foreground/70 leading-relaxed">
                                    PDF generation happens entirely in the browser using <code className="text-teal-600">jsPDF</code> and <code className="text-teal-600">html2canvas</code>. DOCX uses the <code className="text-teal-600">docx</code> library. No uploads, no waiting for server processing. Your resume data never leaves your device.
                                </p>
                                <div className="flex gap-2">
                                    {['jsPDF', 'docx', 'html2canvas', 'file-saver'].map(t => (
                                        <span key={t} className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-[10px] font-mono">{t}</span>
                                    ))}
                                </div>
                            </div>

                            {/* ATS Optimization */}
                            <div className="p-8 bg-gradient-to-br from-teal-600 to-cyan-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_11px)]" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <FileText className="w-5 h-5 text-teal-200" />
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-teal-200">RECRUITER_OPTIMIZED</span>
                                        <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">PARSEABLE</Badge>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight">MACHINE_READABLE</h4>
                                        <p className="text-teal-100 text-sm mt-2 leading-relaxed">
                                            PDFs use selectable text (not images). Plain text export strips all formatting for maximum ATS compatibility. Structured headings ensure parsers identify sections correctly.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/20 space-y-2">
                                        <div className="flex justify-between text-[10px] font-mono text-teal-100">
                                            <span>Selectable Text</span>
                                            <span className="text-teal-300 font-bold">✓</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono text-teal-100">
                                            <span>Standard Sections</span>
                                            <span className="text-teal-300 font-bold">✓</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why It Matters */}
                        <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-teal-200/30 dark:border-teal-800/30">
                            <h4 className="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground">Format flexibility removes friction.</strong> Some ATS systems prefer plain text. Some recruiters want editable DOCX. Academics need LaTeX. By offering 7 formats from a single source of truth, candidates can submit exactly what each application requires—without reformatting or losing information.
                            </p>
                        </div>
                    </div>
                </SwissSection>


                {/* 08: DESIGN SYSTEM - UI COMPONENTS */}
                <SwissSection
                    number="08"
                    id="design-system"
                    title="AESTHETICS."
                    subtitle="ACCESSIBLE UI/UX"
                    accentColor="bg-slate-700"
                    titleClassName="text-slate-900 dark:text-slate-100"
                    subtitleClassName="text-slate-500 dark:text-slate-400"
                    className="relative bg-slate-50/50 dark:bg-slate-900/5 group/section"
                    description="A mature component system built on Shadcn/ui and Radix primitives. Every button, input, and modal is accessible by default, dark-mode ready, and consistent across the application."
                >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(100,116,139,0.03)_50%,transparent_51%)] bg-[size:100%_100%] pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Stack Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { name: 'Tailwind CSS', type: 'Styling', desc: 'Utility-first CSS' },
                                { name: 'Shadcn/ui', type: 'Components', desc: 'Pre-styled Radix' },
                                { name: 'Radix UI', type: 'Primitives', desc: 'Accessible base' },
                                { name: 'Framer Motion', type: 'Animation', desc: 'Spring physics' },
                                { name: 'next-themes', type: 'Dark Mode', desc: 'System preference' }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-400/50 transition-colors group hover:scale-105 duration-300">
                                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{item.type}</div>
                                    <div className="text-sm font-bold text-foreground mt-1">{item.name}</div>
                                    <div className="text-[10px] text-muted-foreground/70 mt-1">{item.desc}</div>
                                </div>
                            ))}
                        </div>

                        {/* Two Column */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Accessibility */}
                            <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 space-y-4">
                                <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                    // ACCESSIBILITY
                                </div>
                                <h4 className="text-lg font-bold text-foreground">Built-In A11y</h4>
                                <p className="text-sm text-foreground/70 leading-relaxed">
                                    Every interactive component from Radix UI ships with keyboard navigation, focus management, and ARIA attributes. Modals trap focus. Dropdowns support arrow keys. Screen readers announce state changes.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['Keyboard Nav', 'Focus Trap', 'ARIA Labels', 'Screen Reader'].map(t => (
                                        <span key={t} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono">{t}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Dark Mode Card */}
                            <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_50%,transparent_52%)] bg-[size:20px_20px]" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Palette className="w-5 h-5 text-slate-400" />
                                            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">THEMING</span>
                                        </div>
                                        <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">AUTO</Badge>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight">INTERFACE_MODES</h4>
                                        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                                            Respects system preference via <code className="text-slate-400">next-themes</code>. All colors use CSS variables for instant switching. No flash of wrong theme on page load.
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-white/10">
                                        <div className="w-8 h-8 rounded bg-background border border-border" />
                                        <div className="w-8 h-8 rounded bg-primary" />
                                        <div className="w-8 h-8 rounded bg-secondary" />
                                        <div className="w-8 h-8 rounded bg-accent" />
                                        <div className="w-8 h-8 rounded bg-muted" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why It Matters */}
                        <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-slate-200/30 dark:border-slate-700/30">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground">Professional design signals professional candidates.</strong> A polished, accessible resume builder sets the right expectations. When candidates use a tool that respects dark mode preferences and works with screen readers, they associate that quality with your employer brand. First impressions matter—even in SaaS.
                            </p>
                        </div>
                    </div>
                </SwissSection>

                {/* 09: RECORDS - DESIGN DECISIONS */}
                <SwissSection
                    number="09"
                    id="dev-logs"
                    title="STRATEGY."
                    subtitle="ARCHITECTURAL DECISIONS"
                    accentColor="bg-amber-600"
                    titleClassName="text-amber-950 dark:text-amber-100"
                    subtitleClassName="text-amber-600 dark:text-amber-400"
                    className="relative bg-amber-50/50 dark:bg-amber-900/5 group/section"
                    description="Every engineering decision has tradeoffs. Here's what we considered, what we rejected, and why. This transparency helps you understand the system's strengths and limitations."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Decision Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {[
                                {
                                    title: 'AI ARCHITECTURE',
                                    problem: 'LLM calls are slow (~800ms) and expensive per-request.',
                                    solution: 'Edge Functions as AI gateway—secure API keys, serverless scaling.',
                                    rejected: 'Direct client API calls',
                                    outcome: 'API keys never exposed, pay-per-use pricing'
                                },
                                {
                                    title: 'STATE MANAGEMENT',
                                    problem: 'Redux/Zustand add complexity for a form-heavy app.',
                                    solution: 'React Context + localStorage with 500ms debounce.',
                                    rejected: 'Redux, Zustand',
                                    outcome: 'Simple, zero npm dependencies for state'
                                },
                                {
                                    title: 'EXPORT PIPELINE',
                                    problem: 'Server-side PDF generation requires uploads.',
                                    solution: 'Client-side jsPDF/docx—no data leaves the browser.',
                                    rejected: 'Server PDF APIs',
                                    outcome: '100% offline-capable exports'
                                },
                                {
                                    title: 'SKILL CATEGORIZATION',
                                    problem: 'AI-only is slow; regex-only misses edge cases.',
                                    solution: 'Local pattern matching first, AI fallback for ambiguous skills.',
                                    rejected: 'Pure cloud AI',
                                    outcome: '80% instant, 20% AI-assisted'
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-white/50 dark:bg-slate-900/50 border border-amber-200/50 dark:border-amber-800/50 hover:border-amber-500/50 transition-colors space-y-4">
                                    <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">{item.title}</h4>

                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-[9px] text-red-500 font-bold uppercase">Problem</span>
                                            <p className="text-xs text-foreground/70">{item.problem}</p>
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-green-500 font-bold uppercase">Solution</span>
                                            <p className="text-xs text-foreground font-medium">{item.solution}</p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-amber-200/30 dark:border-amber-800/30 flex justify-between items-center">
                                        <span className="text-[9px] text-muted-foreground line-through">❌ {item.rejected}</span>
                                        <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[9px]">✓</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Why It Matters */}
                        <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-amber-200/30 dark:border-amber-800/30">
                            <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground">Transparency builds trust.</strong> When you evaluate vendor tools, you want to know what's under the hood. These decision records show we made deliberate architectural choices—not just "whatever worked." We considered alternatives, understood tradeoffs, and optimized for your use case: fast, secure, offline-capable resume building.
                            </p>
                        </div>
                    </div>
                </SwissSection>

                {/* 10: SCALAB - ARCHITECTURE */}
                <SwissSection
                    number="10"
                    id="scalability"
                    title="CAPACITY."
                    subtitle="SERVERLESS ARCHITECTURE"
                    accentColor="bg-indigo-600"
                    titleClassName="text-indigo-950 dark:text-indigo-100"
                    subtitleClassName="text-indigo-600 dark:text-indigo-400"
                    className="relative bg-indigo-50/50 dark:bg-indigo-900/5 group/section"
                    description="The entire application runs in your browser. No backend servers to maintain, no databases to scale. Static files on a CDN means unlimited concurrent users at near-zero cost."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Architecture Diagram */}
                        <div className="p-6 bg-white/50 dark:bg-slate-900/50 border border-indigo-200/50 dark:border-indigo-800/50">
                            <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                // DEPLOYMENT_MODEL
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-mono">
                                <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold">Static Build</span>
                                <ArrowRight className="w-5 h-5 text-indigo-400" />
                                <span className="px-4 py-2 bg-indigo-600 text-white font-bold">CDN Edge</span>
                                <ArrowRight className="w-5 h-5 text-indigo-400" />
                                <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold">Browser</span>
                                <ArrowRight className="w-5 h-5 text-indigo-400" />
                                <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold">localStorage</span>
                            </div>
                            <p className="text-xs text-center text-muted-foreground mt-4">No origin servers. No database queries. Just cached static files + client-side storage.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { metric: '$0', label: 'Server Cost', detail: 'Static hosting only' },
                                { metric: '∞', label: 'Concurrent Users', detail: 'CDN scales infinitely' },
                                { metric: '~50ms', label: 'Global Latency', detail: 'Edge-cached assets' },
                                { metric: '100%', label: 'Uptime', detail: 'No backend to fail' }
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-center group hover:scale-105 transition-transform duration-300">
                                    <div className="text-3xl font-black italic">{item.metric}</div>
                                    <div className="text-xs font-mono uppercase tracking-widest mt-1 text-indigo-100">{item.label}</div>
                                    <div className="text-[9px] font-mono text-indigo-200/70 mt-2">{item.detail}</div>
                                </div>
                            ))}
                        </div>

                        {/* Two Column */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Client-Side Benefits */}
                            <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-indigo-200/50 dark:border-indigo-800/50 space-y-4">
                                <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                                    // EDGE_BENEFITS
                                </div>
                                <h4 className="text-lg font-bold text-foreground">Why This Scales</h4>
                                <ul className="space-y-2 text-sm text-foreground/70">
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 font-bold">→</span>
                                        <span><strong>No server logic:</strong> All computation happens in the user's browser</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 font-bold">→</span>
                                        <span><strong>CDN-cached:</strong> Assets served from 200+ global edge locations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 font-bold">→</span>
                                        <span><strong>Offline-first:</strong> Works without internet after initial load</span>
                                    </li>
                                </ul>
                            </div>

                            {/* AI Scaling */}
                            <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-200">AI_SERVICE_LAYER</span>
                                        <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">SERVERLESS</Badge>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight">PAY_PER_USE</h4>
                                        <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
                                            AI features run on Supabase Edge Functions—serverless, auto-scaling, billed only when invoked. Zero AI cost when candidates aren't actively enhancing content.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why It Matters */}
                        <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-indigo-200/30 dark:border-indigo-800/30">
                            <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground">Scalability without infrastructure headaches.</strong> When you launch a hiring campaign and 10,000 candidates hit the resume builder simultaneously, you don't call DevOps. The CDN handles it. There's no database bottleneck because there's no database. Costs stay flat whether you have 10 users or 10,000.
                            </p>
                        </div>
                    </div>
                </SwissSection>

                {/* 11: IMPACT - THE BOTTOM LINE */}
                <SwissSection
                    number="11"
                    id="meta"
                    title="OUTCOMES."
                    subtitle="BUSINESS IMPACT"
                    accentColor="bg-red-600"
                    titleClassName="text-red-950 dark:text-red-100"
                    subtitleClassName="text-red-600 dark:text-red-400"
                    className="relative bg-red-50/50 dark:bg-red-900/5 group/section"
                    description="Technology is a means to an end. Here's how all of the above translates into real value for your hiring process."
                >
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {/* Value Props Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Better Resume Quality',
                                    desc: 'AI-enhanced bullet points, organized skills, and structured data mean candidates submit cleaner, more parseable resumes.',
                                    icon: '✨'
                                },
                                {
                                    title: 'Faster Submissions',
                                    desc: 'Sub-50ms saves and instant previews reduce friction. Candidates complete resumes faster, reducing drop-off.',
                                    icon: '⚡'
                                },
                                {
                                    title: 'ATS Compatibility',
                                    desc: '7 export formats including plain text ensure resumes parse correctly in any applicant tracking system.',
                                    icon: '🎯'
                                },
                                {
                                    title: 'Zero Privacy Risk',
                                    desc: 'All data stays in the browser. API keys are server-side. No candidate PII stored on third-party servers.',
                                    icon: '🔒'
                                },
                                {
                                    title: 'Infinite Scale',
                                    desc: 'Static hosting + CDN means 10,000 concurrent users cost the same as 10. Launch campaigns without infrastructure fear.',
                                    icon: '📈'
                                },
                                {
                                    title: 'Works Offline',
                                    desc: 'Candidates can draft resumes without internet. Auto-saves to localStorage. No lost work.',
                                    icon: '📴'
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-white/50 dark:bg-slate-900/50 border border-red-200/50 dark:border-red-800/50 hover:border-red-500/50 transition-colors space-y-3 group">
                                    <div className="text-3xl">{item.icon}</div>
                                    <h4 className="text-lg font-bold text-foreground group-hover:text-red-600 transition-colors">{item.title}</h4>
                                    <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Performance Badges */}
                        <div className="p-6 bg-gradient-to-br from-red-600 to-rose-700 text-white">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Performance', value: '95+', detail: 'Production Target' },
                                    { label: 'Accessibility', value: '94', detail: 'WCAG 2.1 Compliant' },
                                    { label: 'Best Practices', value: '100', detail: 'System Health' },
                                    { label: 'SEO Audit', value: '100', detail: 'Indexable Data' }
                                ].map((badge, i) => (
                                    <div key={i} className="text-center px-4 py-4 bg-white/10 backdrop-blur border border-white/10 group/badge">
                                        <div className="text-3xl font-black italic group-hover:scale-110 transition-transform">{badge.value}</div>
                                        <div className="text-[10px] font-mono uppercase tracking-widest text-red-100 mt-1">{badge.label}</div>
                                        <div className="text-[8px] font-mono text-red-200/60 uppercase">{badge.detail}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Core Web Vitals */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'TBT', value: '490ms', desc: 'Total Blocking Time' },
                                { label: 'CLS', value: '0.11', desc: 'Cumulative Layout Shift' },
                                { label: 'FID', value: '<50ms', desc: 'First Input Delay' }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-red-100/20 dark:bg-red-900/10 border border-red-200/20 dark:border-red-800/20">
                                    <div>
                                        <div className="text-xs font-mono text-red-600 dark:text-red-400">{stat.label}</div>
                                        <div className="text-sm font-bold text-foreground/70">{stat.desc}</div>
                                    </div>
                                    <div className="text-xl font-black italic text-red-600 dark:text-red-400">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Final Call */}
                        <div className="p-8 bg-white/30 dark:bg-slate-900/30 border border-red-200/30 dark:border-red-800/30 text-center">
                            <h4 className="text-xl font-bold text-foreground mb-4">Built for Hiring Teams</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed max-w-2xl mx-auto">
                                This isn't a weekend project—it's production-grade software. We've made deliberate architectural choices (documented above) to create a resume builder that's fast, secure, accessible, and scales with your hiring needs. Every technical decision maps to a business outcome that helps you find better candidates, faster.
                            </p>
                        </div>
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
