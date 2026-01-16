import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Cpu,
    Layers,
    Zap,
    BarChart3,
    Terminal,
    Code2,
    Workflow,
    Shield,
    Activity,
    Box,
    Binary,
    Layout,
    Sparkles,
    Target,
    Linkedin,
    Clock,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import AppNavigation from '@/shared/components/layout/AppNavigation';
import Footer from '@/shared/components/layout/Footer';
import { cn } from '@/shared/lib/utils';
import SystemVitals from '@/features/home/components/SystemVitals';
import PromptInspector from '@/features/home/components/PromptInspector';
import ConstraintChronicle from '@/features/home/components/ConstraintChronicle';
import ArchitectureMap from '@/features/home/components/ArchitectureMap';

const ProtocolSection: React.FC<{
    number: string;
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    accentColor?: string;
}> = ({ number, id, title, subtitle, children, accentColor = "text-accent" }) => (
    <section id={id} className="min-h-screen py-32 border-t border-white/5 first:border-t-0">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
        >
            <div className="space-y-4">
                <span className={cn("text-[10px] font-mono uppercase tracking-[0.4em]", accentColor)}>
                    PROTOCOL {number}: {id.toUpperCase().replace('-', ' ')}
                </span>
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground pt-2 max-w-2xl">
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </motion.div>
    </section>
);

const MetricBlock: React.FC<{
    label: string;
    value: string;
    status: string;
    accent?: string;
}> = ({ label, value, status, accent = "text-accent" }) => (
    <div className="border border-white/10 p-8 space-y-4 bg-muted/5 group hover:bg-white/5 transition-colors">
        <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest block">{label}</span>
        <div className="text-5xl font-black tracking-tighter">{value}</div>
        <div className={cn("text-[10px] font-mono uppercase tracking-widest", accent)}>{status}</div>
    </div>
);

const AboutPlatformPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('blueprint');

    const sections = [
        { id: 'blueprint', label: '00' },
        { id: 'tech-stack', label: '01' },
        { id: 'decoupled-core', label: '02' },
        { id: 'usecase-speed', label: '03' },
        { id: 'usecase-impact', label: '04' },
        { id: 'usecase-network', label: '05' },
        { id: 'skills-intelligence', label: '06' },
        { id: 'constraint-chronicle', label: '07' },
        { id: 'system-architecture', label: '08' },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.3 }
        );
        sections.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-black font-sans">
            {/* Sidebar Navigation */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-8">
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative flex items-center justify-end"
                    >
                        <span className={cn(
                            "absolute right-10 text-[10px] font-mono uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap",
                            activeSection === section.id ? "opacity-100 text-accent font-bold" : "text-white/40"
                        )}>
                            {section.id.replace('-', ' ')}
                        </span>
                        <div className={cn(
                            "w-1 h-8 bg-white/10 transition-all duration-500",
                            activeSection === section.id ? "bg-accent w-1.5 h-12" : "hover:bg-white/30"
                        )} />
                    </a>
                ))}
            </div>

            <AppNavigation />

            <main className="max-w-[1400px] mx-auto px-8 lg:px-16">
                {/* HERO: BLUEPRINT */}
                <section id="blueprint" className="min-h-screen flex flex-col justify-center pt-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-16">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.5em] text-muted-foreground"
                            >
                                <div className="w-16 h-[1px] bg-accent" />
                                ARCHITECTURAL SPECIFICATION V2.0.0
                            </motion.div>

                            <div className="space-y-6">
                                <motion.h1
                                    initial={{ opacity: 0, y: 60 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.75] uppercase"
                                >
                                    ENGINEERING <br />
                                    BLUEPRINT.
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-xl md:text-2xl text-muted-foreground font-light max-w-xl leading-snug tracking-tight"
                                >
                                    A production-grade <span className="text-white font-medium italic underline decoration-accent/40 decoration-2 underline-offset-8">AI-Native Ecosystem</span> designed for high-concurrency career intelligence and precision state orchestration.
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex flex-wrap gap-8 pt-6"
                            >
                                <Button size="lg" className="rounded-none px-12 h-16 text-lg font-mono tracking-tighter hover:bg-white hover:text-black group bg-accent text-black border-none" onClick={() => document.getElementById('system-architecture')?.scrollIntoView({ behavior: 'smooth' })}>
                                    DECODE ARCHITECTURE <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </motion.div>
                        </div>

                        {/* System Vitals HUD */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="hidden lg:block w-full max-w-lg ml-auto"
                        >
                            <SystemVitals />
                        </motion.div>
                    </div>
                </section>

                {/* PROTOCOL 01: TECH STACK - THE FOUNDATION */}
                <ProtocolSection
                    number="01"
                    id="tech-stack"
                    title="THE ARSENAL."
                    subtitle="PRODUCTION-GRADE TECHNOLOGIES POWERING THIS PLATFORM"
                    accentColor="text-cyan-400"
                >
                    <div className="space-y-16">
                        {/* Hero Statement */}
                        <div className="max-w-4xl">
                            <p className="text-3xl md:text-4xl font-light text-muted-foreground leading-relaxed">
                                Built with <span className="text-white font-bold">battle-tested</span> technologies.
                                Every dependency chosen for <span className="text-cyan-400 italic">performance</span>,
                                <span className="text-cyan-400 italic"> developer experience</span>, and
                                <span className="text-cyan-400 italic"> scalability</span>.
                            </p>
                        </div>

                        {/* Featured Stack Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-cyan-400/10">
                            {[
                                { name: 'REACT 18', version: '18.2.0', category: 'UI FRAMEWORK', desc: 'Concurrent rendering with automatic batching. Suspense boundaries for async data fetching. Atomic component architecture.', highlight: true },
                                { name: 'TYPESCRIPT', version: '5.3.0', category: 'TYPE SYSTEM', desc: 'Strict null checks. Interface contracts for resume data structures. Compile-time error prevention.', highlight: true },
                                { name: 'VITE', version: '5.4.0', category: 'BUILD TOOL', desc: 'Sub-second HMR. ESBuild-powered bundling. Native ESM in development. Lightning-fast cold starts.', highlight: false },
                                { name: 'GEMINI 1.5', version: 'PRO', category: 'AI ENGINE', desc: 'Multi-modal career intelligence. Context-aware resume enhancement. Real-time ATS optimization.', highlight: true },
                            ].map((tech) => (
                                <motion.div
                                    key={tech.name}
                                    className={cn(
                                        "bg-black p-10 md:p-16 space-y-6 group relative overflow-hidden",
                                        tech.highlight && "border-l-4 border-cyan-400"
                                    )}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute top-0 right-0 p-6 font-mono text-[10px] text-cyan-400/30 uppercase">{tech.category}</div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase group-hover:text-cyan-400 transition-colors">{tech.name}</h3>
                                        <div className="font-mono text-xs text-muted-foreground">v{tech.version}</div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                                        {tech.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Secondary Stack */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                            {[
                                { name: 'TAILWINDCSS', desc: 'Utility-first CSS' },
                                { name: 'FRAMER MOTION', desc: 'Animation library' },
                                { name: 'RADIX UI', desc: 'Accessible primitives' },
                                { name: 'LUCIDE', desc: 'Icon system' },
                                { name: 'ZUSTAND', desc: 'State management' },
                                { name: 'REACT HOOK FORM', desc: 'Form handling' },
                                { name: 'ZOD', desc: 'Schema validation' },
                                { name: 'SUPABASE', desc: 'Backend infrastructure' },
                            ].map((tech) => (
                                <div key={tech.name} className="bg-black p-8 space-y-3 hover:bg-white/5 transition-colors cursor-default group">
                                    <h4 className="text-sm font-black uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{tech.name}</h4>
                                    <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">{tech.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Performance Badge */}
                        <div className="flex items-center justify-center gap-8 pt-8">
                            <div className="flex items-center gap-4 px-8 py-4 border border-cyan-400/20 bg-cyan-400/5">
                                <Zap className="w-6 h-6 text-cyan-400" />
                                <div>
                                    <div className="text-2xl font-black">100</div>
                                    <div className="text-[10px] font-mono uppercase text-muted-foreground">LIGHTHOUSE SCORE</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-8 py-4 border border-cyan-400/20 bg-cyan-400/5">
                                <Activity className="w-6 h-6 text-cyan-400" />
                                <div>
                                    <div className="text-2xl font-black">&lt;2s</div>
                                    <div className="text-[10px] font-mono uppercase text-muted-foreground">FIRST CONTENTFUL PAINT</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-8 py-4 border border-cyan-400/20 bg-cyan-400/5">
                                <Cpu className="w-6 h-6 text-cyan-400" />
                                <div>
                                    <div className="text-2xl font-black">0</div>
                                    <div className="text-[10px] font-mono uppercase text-muted-foreground">RUNTIME ERRORS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* PROTOCOL 02: DECOUPLED CORE */}
                <ProtocolSection
                    number="02"
                    id="decoupled-core"
                    title="DECOUPLED CORE."
                    subtitle="ORCHESTRATING THREE-PANEL REAL-TIME SYNCHRONIZATION VIA REACT CONTEXT PIPELINES"
                >
                    <div className="grid lg:grid-cols-2 gap-24">
                        <div className="space-y-12">
                            <p className="text-2xl text-muted-foreground font-light leading-relaxed border-l-4 border-accent pl-10 py-4">
                                The engine transitions from standard state management to a <span className="text-white">lag-free persistence bridge</span>. By isolating compute-heavy PDF rendering from the primary input thread, we achieve consistent 60FPS interactions.
                            </p>

                            <div className="bg-muted/5 border border-white/10 p-10 space-y-6 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-accent/40 uppercase">NODE_LOG_01</div>
                                <h4 className="text-sm font-mono uppercase tracking-widest font-bold flex items-center gap-3">
                                    <Workflow className="w-4 h-4 text-accent" /> HYDRATION STRATEGY
                                </h4>
                                <div className="font-mono text-xs text-muted-foreground leading-relaxed space-y-2">
                                    <p className="text-accent/80">&gt; INITIALIZING MODULE_PERSISTENCE...</p>
                                    <p>&gt; DEBOUNCING_LOCAL_STORAGE: 2000MS</p>
                                    <p>&gt; WORKER_THREAD: PDF_GENERATION_IDLE</p>
                                    <p>&gt; STATE_SYNC: COMPLETED with 0% LOSS</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <MetricBlock label="Frame Rate" value="60" status="STABLE" />
                            <MetricBlock label="Input Latency" value="2ms" status="ULTRA-LOW" />
                            <div className="col-span-2 border border-white/10 p-10 bg-accent/5">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-mono uppercase text-accent tracking-[0.2em] block">Data Throughput</span>
                                        <div className="text-4xl font-black italic">HIGH_FIDELITY</div>
                                    </div>
                                    <Binary className="w-12 h-12 text-accent/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* PROTOCOL 03: USE CASE - THE SPEED CREATOR */}
                <ProtocolSection
                    number="03"
                    id="usecase-speed"
                    title="THE SPEED CREATOR."
                    subtitle="MAXIMIZING EFFICIENCY VIA KEYBOARD-FIRST WORKFLOWS AND AI-ASSISTED BULLET GENERATION"
                >
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 border border-white/5 bg-muted/5 p-12 space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-accent" />
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Velocity Engine</h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Engineered for the "Fast Creator" persona. We implemented a <span className="text-white font-mono">Ctrl+K</span> Quick Add command center that allows users to populate an entire professional history section without touching their mouse.
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 pt-8">
                                <div className="space-y-2">
                                    <div className="text-xs font-mono uppercase text-accent tracking-widest">CONSTRAINT</div>
                                    <p className="text-xs text-muted-foreground italic">"Resume building is tedious and takes hours of manual formatting."</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs font-mono uppercase text-accent tracking-widest">RESOLUTION</div>
                                    <p className="text-xs text-muted-foreground italic">"One-touch Achievement Templates and AI-powered 'Bullet Enhancer' reduces creation time by 80%."</p>
                                </div>
                            </div>
                        </div>
                        <div className="border border-white/5 bg-accent p-10 text-black flex flex-col justify-between">
                            <Zap className="w-12 h-12" />
                            <div className="space-y-4">
                                <div className="text-7xl font-black tracking-tighter">80%</div>
                                <p className="text-xs font-mono uppercase font-bold tracking-widest">
                                    FASTER CREATION_TIME VS TRADITIONAL EDITORS
                                </p>
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* PROTOCOL 04: USE CASE - THE IMPACT HUNTER */}
                <ProtocolSection
                    number="04"
                    id="usecase-impact"
                    title="THE IMPACT HUNTER."
                    subtitle="ATS OPTIMIZATION & KEYWORD ORCHESTRATION: BRIDGING THE GAP BETWEEN HUMAN EXPERIENCE AND ALGORITHMIC SCANNERS"
                >
                    <div className="space-y-16">
                        <div className="grid md:grid-cols-4 gap-4">
                            <MetricBlock label="ATS Match" value="100%" status="VERIFIED" />
                            <MetricBlock label="Keyword Density" value="92%" status="OPTIMAL" />
                            <MetricBlock label="Readability" value="HIGH" status="A+" />
                            <MetricBlock label="Parsing Logic" value="JSON" status="0% LOSS" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="bg-white/5 border border-white/10 p-12 relative group h-full">
                                <div className="absolute top-0 right-0 p-8">
                                    <Target className="w-24 h-24 text-accent/10 -rotate-12 group-hover:text-accent/20 transition-colors" />
                                </div>
                                <div className="max-w-xl space-y-10">
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">"THE ANALYTICAL EDGE."</h3>
                                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                                        For the high-level candidate, every word counts. Our <span className="text-accent underline decoration-accent/20 underline-offset-8">Real-time ATS Scoreboard</span> analyzes content against 50+ recursion checks per second. It doesn't just score; it provides a surgical breakdown of missing high-impact metrics and specific industry keywords.
                                    </p>
                                    <div className="flex gap-12 font-mono text-[10px] uppercase tracking-widest border-t border-white/10 pt-10">
                                        <div className="space-y-2">
                                            <span className="text-accent opacity-50 block">TECH_SOLUTIONS</span>
                                            <span>RECURSIVE_KEYWORD_SCANNER</span>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-accent opacity-50 block">ALGO_METHOD</span>
                                            <span>WEIGHTED_METRIC_EXTRACTION</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Prompt Inspector */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                                        &gt; LOGIC_DEOBFUSCATION_MODULE
                                    </h4>
                                    <Badge variant="outline" className="font-mono text-[10px] uppercase border-accent/20 text-accent">Interactive</Badge>
                                </div>
                                <PromptInspector />
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* PROTOCOL 05: USE CASE - THE NETWORKING EXPERT */}
                <ProtocolSection
                    number="05"
                    id="usecase-network"
                    title="THE NETWORKER."
                    subtitle="LINKEDIN OPTIMIZATION & SOCIAL BRAND CONSISTENCY: UNIFYING PERSONAL BRANDING ACROSS PLATFORMS"
                >
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="border border-white/5 p-12 space-y-8 hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <Linkedin className="w-10 h-10 text-accent" />
                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">SOCIAL SYNC PIPELINE</h3>
                            </div>
                            <p className="text-muted-foreground font-light text-lg">
                                Resumes don't live in a vacuum. We developed a proprietary <span className="text-accent">LinkedIn Profile Optimizer</span> that takes professional history and pivots it into social-ready headlines and "About" sections that maximize engagement and profile views.
                            </p>
                            <div className="space-y-2 pt-4">
                                <div className="h-[1px] bg-white/10 w-full" />
                                <div className="flex justify-between text-[10px] font-mono text-muted-foreground py-2 uppercase tracking-widest">
                                    <span>Platform Consistency</span>
                                    <span className="text-accent">1:1 MATCH</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-muted/5 border border-white/10 p-12 flex flex-col justify-between group overflow-hidden relative">
                            <Sparkles className="absolute -right-6 -bottom-6 w-48 h-48 text-accent/5 group-hover:text-accent/10 transition-all duration-700" />
                            <div className="space-y-6 relative z-10">
                                <Badge className="bg-accent/10 text-accent border-accent/20 rounded-none font-mono">EXPERIMENTAL_AI_V2</Badge>
                                <h4 className="text-2xl font-black uppercase tracking-tight italic">"EMOTIONAL INTELLIGENCE IN DATA."</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    The model is fine-tuned to understand the nuance between a "Formal CV" tone and a "Relatable Professional" LinkedIn tone, automatically adjusting verb high-lighting and sentence structure for maximum social impact.
                                </p>
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* PROTOCOL 06: SKILLS INTELLIGENCE */}
                <ProtocolSection
                    number="06"
                    id="skills-intelligence"
                    title="SKILLS MATRIX."
                    subtitle="SEMANTIC SKILL GROUPING & HIERARCHICAL MAPPING: REVOLUTIONIZING COMPETENCY VISUALIZATION"
                >
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="border border-white/10 p-10 space-y-6">
                            <Layers className="w-10 h-10 text-accent" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter">SEMANTIC GROUPING</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Our algorithm doesn't just list skills; it understands their relationships. It automatically categorizes technical proficiencies into distinct clusters (e.g., "Frontend Infrastructure" vs "Cloud Operations"), creating a cleaner data story for recruiters.
                            </p>
                        </div>
                        <div className="lg:col-span-2 border border-white/10 bg-muted/5 p-10 flex flex-col justify-center gap-12">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-accent">
                                    <span>Cluster_Active: CLOUD_NATIVE</span>
                                    <span>Confidence: 99.4%</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GCP', 'CI/CD'].map((s) => (
                                        <div key={s} className="px-4 py-2 border border-accent/20 text-[10px] font-mono text-accent uppercase tracking-tighter hover:bg-accent hover:text-black transition-colors">
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-white/40">
                                    <span>Cluster_Inactive: LEGACY_STACK</span>
                                    <span>Confidence: 82.1%</span>
                                </div>
                                <div className="flex flex-wrap gap-3 opacity-30 grayscale">
                                    {['PHP', 'jQuery', 'Apache'].map((s) => (
                                        <div key={s} className="px-4 py-2 border border-white/20 text-[10px] font-mono uppercase tracking-tighter">
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* PROTOCOL 07: CONSTRAINT CHRONICLE */}
                <ProtocolSection
                    number="07"
                    id="constraint-chronicle"
                    title="ENGINEERING JOURNAL."
                    subtitle="HARD CONSTRAINTS & TRADE-OFFS: THE DECISIONS THAT DEFINED THE ARCHITECTURE"
                >
                    <ConstraintChronicle />
                </ProtocolSection>

                {/* PROTOCOL 08: SYSTEM ARCHITECTURE MAP */}
                <ProtocolSection
                    number="08"
                    id="system-architecture"
                    title="NEURAL MAP."
                    subtitle="VISUALIZING THE DECOUPLED CORE & DATA FLOW MATRICES"
                >
                    <ArchitectureMap />
                </ProtocolSection>

                {/* CALL TO ACTION */}
                <section className="py-48 text-center space-y-16">
                    <div className="space-y-6">
                        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">"BUILD THE FUTURE."</h2>
                        <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.4em]">
                            TECHNICAL SPECIFICATION ENDS HERE. EXECUTE DEPLOYMENT?
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-8 px-8">
                        <Link to="/">
                            <Button variant="outline" className="h-20 px-12 rounded-none font-mono border-white/20 hover:bg-white/10 text-lg tracking-widest uppercase">
                                &lt; ABORT_SESSION
                            </Button>
                        </Link>
                        <Link to="/resume-wizard">
                            <Button className="h-20 px-24 rounded-none font-mono bg-accent text-black hover:bg-white hover:text-black text-xl font-black tracking-tighter uppercase shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                LAUNCH_V2_ENGINE &gt;
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPlatformPage;
