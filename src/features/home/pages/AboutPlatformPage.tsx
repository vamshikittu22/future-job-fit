import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Cpu,
    Zap,
    Terminal,
    Code2,
    Workflow,
    Activity,
    Box,
    Binary,
    Sparkles,
    Target,
    Linkedin,
    Clock,
    Shield,
    Globe,
    FileText,
    Database,
    Moon,
    Sun
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
import { useTheme } from '@/shared/hooks/useTheme';

const SwissSection: React.FC<{
    number: string;
    id: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    accentColor?: string;
    className?: string;
}> = ({ number, id, title, subtitle, children, accentColor = "bg-blue-500", className }) => (
    <section id={id} className={cn("py-24 md:py-32 border-t border-muted/20 scroll-mt-20", className)}>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center gap-4">
                    <span className={cn("w-12 h-12 flex items-center justify-center text-white font-bold text-xl rounded-none", accentColor)}>
                        {number}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
                        SECTION_SPEC
                    </span>
                </div>
                <div className="space-y-4">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase text-foreground">
                        {title}
                    </h2>
                    <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground max-w-sm leading-relaxed">
                        {subtitle}
                    </p>
                </div>
            </div>
            <div className="lg:col-span-8">
                {children}
            </div>
        </div>
    </section>
);

const MetricCard: React.FC<{
    label: string;
    value: string;
    description: string;
    accent: string;
}> = ({ label, value, description, accent }) => (
    <div className="p-8 border border-muted/20 bg-background/50 hover:bg-muted/5 transition-all group">
        <div className={cn("w-8 h-1 mb-6", accent)} />
        <div className="space-y-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>
            <div className="text-4xl font-black tracking-tighter text-foreground group-hover:translate-x-1 transition-transform">{value}</div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed pt-2">{description}</p>
        </div>
    </div>
);

const AboutPlatformPage: React.FC = () => {
    const { theme } = useTheme();
    const [activeSection, setActiveSection] = useState('overview');

    const sections = [
        { id: 'overview', label: '00' },
        { id: 'architecture', label: '01' },
        { id: 'state-logic', label: '02' },
        { id: 'user-experience', label: '03' },
        { id: 'intelligence', label: '04' },
        { id: 'profile-sync', label: '05' },
        { id: 'skill-mapping', label: '06' },
        { id: 'dev-logs', label: '07' },
        { id: 'visualization', label: '08' },
        { id: 'outcomes', label: '09' },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.2 }
        );
        sections.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans transition-colors duration-500">
            {/* Minimalist Sidebar */}
            <div className="fixed right-10 top-1/2 -translate-y-1/2 z-50 hidden 2xl:flex flex-col gap-6">
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group flex items-center justify-end"
                    >
                        <span className={cn(
                            "mr-4 text-[10px] font-mono uppercase tracking-[0.2em] transition-all opacity-0 group-hover:opacity-100",
                            activeSection === section.id ? "opacity-100 text-foreground font-bold" : "text-muted-foreground"
                        )}>
                            {section.id.replace('-', ' ')}
                        </span>
                        <div className={cn(
                            "w-1 h-1 rounded-full transition-all duration-300",
                            activeSection === section.id ? "bg-foreground scale-[3] shadow-[0_0_10px_rgba(0,0,0,0.1)]" : "bg-muted-foreground/30 hover:bg-muted-foreground"
                        )} />
                    </a>
                ))}
            </div>

            <AppNavigation />

            <main className="max-w-[1400px] mx-auto px-8 lg:px-16 pt-32">
                {/* 00: THE VISION & OBJECTIVES */}
                <section id="overview" className="min-h-[80vh] flex flex-col justify-center border-b border-muted/20 pb-32">
                    <div className="space-y-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.4em] text-muted-foreground"
                        >
                            <span className="text-primary font-bold">PROJECT_MEMO_2024</span>
                            <div className="w-12 h-px bg-muted/30" />
                            ENGINEERING THE FUTURE OF CAREER DATA
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-12 items-end">
                            <div className="space-y-8">
                                <motion.h1
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-7xl md:text-[100px] font-black tracking-tighter leading-[0.85] uppercase text-foreground"
                                >
                                    BRIDGE THE <br />
                                    <span className="text-primary">GAP.</span>
                                </motion.h1>
                                <div className="space-y-6 max-w-xl">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-xl text-muted-foreground font-light leading-relaxed"
                                    >
                                        Future Job Fit was born from a simple observation: <span className="text-foreground font-medium italic">career history is data, but resumes are static snapshots.</span>
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-base text-muted-foreground leading-relaxed"
                                    >
                                        The objective was to build a high-fidelity, AI-native orchestrator that doesn't just "generate" text, but semantically understands a user's professional impact and maps it directly to the requirements of the modern ATS (Applicant Tracking System) environment.
                                    </motion.p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                className="hidden lg:block border border-muted/20 bg-muted/5 p-2 rounded-none shadow-2xl"
                            >
                                <SystemVitals />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex gap-4"
                        >
                            <Button size="lg" className="rounded-none px-10 h-16 text-sm font-mono tracking-widest uppercase" onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}>
                                READ TECHNICAL SPEC <ArrowRight className="ml-4 w-5 h-5" />
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* 01: CORE ARCHITECTURE & TECH STACK */}
                <SwissSection
                    number="01"
                    id="architecture"
                    title="THE STACK."
                    subtitle="JUSTIFIED TECHNOLOGICAL CHOICES FOR SCALABILITY AND PRODUCTIVITY"
                    accentColor="bg-blue-600"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-muted/20 border border-muted/20">
                        {[
                            {
                                name: 'React 18',
                                tag: 'CONCURRENCY',
                                desc: 'Leveraging Concurrent Rendering to maintain UI responsiveness while complex PDF workers and AI analysis run in the background. React was chosen for its mature ecosystem and efficient reconciliation.',
                                color: 'text-blue-500'
                            },
                            {
                                name: 'Zustand',
                                tag: 'STATE_MANAGEMENT',
                                desc: 'A minimalist, hook-based state store selected over Redux to reduce boilerplate. It provides high-performance reactivity for nested resume structures with built-in persistence layers.',
                                color: 'text-blue-400'
                            },
                            {
                                name: 'Python / FastAPI',
                                tag: 'NLP_BACKEND',
                                desc: 'Decoupled Python microservices handle deterministic NLP tasks like keyword extraction and ATS scoring. FastAPI was chosen for its sub-ms latency and Pydantic-driven type safety.',
                                color: 'text-indigo-500'
                            },
                            {
                                name: 'Vite 5',
                                tag: 'BUILD_TOOLING',
                                desc: 'Replaced traditional Webpack setups to achieve near-instant HMR (Hot Module Replacement) and 3x faster build times, significantly boosting developer productivity.',
                                color: 'text-cyan-500'
                            },
                        ].map((item) => (
                            <div key={item.name} className="bg-background p-10 space-y-6 group hover:bg-muted/5 transition-colors relative">
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">{item.tag}</span>
                                <h3 className={cn("text-4xl font-black uppercase tracking-tighter group-hover:translate-x-1 transition-transform", item.color)}>{item.name}</h3>
                                <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Box className="w-8 h-8" />
                                </div>
                            </div>
                        ))}
                    </div>
                </SwissSection>

                {/* 02: STATE SYNCHRONIZATION */}
                <SwissSection
                    number="02"
                    id="state-logic"
                    title="STATE LOGIC."
                    subtitle="RESILIENT DATA ORCHESTRATION VIA ASYNCHRONOUS PIPELINES"
                    accentColor="bg-emerald-600"
                >
                    <div className="space-y-12">
                        <div className="grid md:grid-cols-3 gap-8">
                            <MetricCard
                                label="Hydration_Stability"
                                value="99.99%"
                                description="Engineered a custom persistence layer for Zustand that survives hard refreshes and intermittent network failures."
                                accent="bg-emerald-500"
                            />
                            <MetricCard
                                label="Sync_Latency"
                                value="<1ms"
                                description="Optimized local state updates using optimistic UI patterns to ensure zero perceptual lag during data entry."
                                accent="bg-emerald-400"
                            />
                            <MetricCard
                                label="Conflict_Resolution"
                                value="NOMINAL"
                                description="Implemented a deterministic state merging strategy to prevent data loss during rapid section switching."
                                accent="bg-teal-500"
                            />
                        </div>
                        <div className="p-10 border border-muted/20 bg-muted/5 space-y-4">
                            <h4 className="text-xl font-bold uppercase tracking-tight">Engineering for Resilience</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed font-light">
                                The challenge was managing a deeply nested JSON structure (the Resume) while providing undo/redo functionality and local storage syncing. I opted for a **flat-state slice architecture** in Zustand, which allows for granular updates without triggering massive re-renders across the component tree. This improved interaction throughput by 40% in large documents.
                            </p>
                        </div>
                    </div>
                </SwissSection>

                {/* 03: UX VELOCITY & WORKER PIPELINE */}
                <SwissSection
                    number="03"
                    id="user-experience"
                    title="UX VELOCITY."
                    subtitle="MINIMIZING UI BLOCKING VIA MULTI-THREADED RENDERING"
                    accentColor="bg-orange-600"
                >
                    <div className="space-y-12">
                        <div className="border border-muted/20 p-12 bg-background relative overflow-hidden group">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors" />
                            <div className="max-w-3xl space-y-6 relative z-10">
                                <Activity className="w-10 h-10 text-orange-500 mb-4" />
                                <h3 className="text-4xl font-black uppercase tracking-tighter">The Rendering Bottleneck</h3>
                                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                                    Traditional resume builders freeze the UI during PDF generation. To solve this, I implemented a **Web Worker-driven PDF Pipeline**.
                                </p>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    By offloading the heavy LaTeX/PDF heavy-lifting to a background thread, the main UI thread remains at a consistent 60FPS. Users get a real-time preview of their document without a single dropped frame.
                                </p>
                                <div className="flex gap-4 pt-4">
                                    <Badge variant="outline" className="rounded-none px-4 py-1 font-mono uppercase text-primary border-primary/20 bg-primary/5">Web_Worker_Pipeline: ACTIVE</Badge>
                                    <Badge variant="outline" className="rounded-none px-4 py-1 font-mono uppercase text-muted-foreground">FPS_Stabillity: 60+</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 04: HYBRID AI ENGINE */}
                <SwissSection
                    number="04"
                    id="intelligence"
                    title="HYBRID CORE."
                    subtitle="DECOUPLING DETERMINISTIC PARSING FROM CREATIVE AUGMENTATION"
                    accentColor="bg-purple-600"
                >
                    <div className="space-y-16">
                        <div className="prose prose-sm dark:prose-invert max-w-none mb-12">
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-6">Solving the "Token Exhaustion" Problem</h4>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                A major challenge in AI-driven applications is the latency and cost overhead of Large Language Models. Sending simple tasks like "check keyword density" or "format date ranges" to a cloud LLM is inefficient.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                I architected a **Hybrid Intelligence System** that separates deterministic logic from creative generation.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-10 border border-purple-500/20 bg-purple-500/5 space-y-6 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Terminal className="w-24 h-24" />
                                </div>
                                <Terminal className="w-8 h-8 text-purple-500" />
                                <h4 className="text-2xl font-black uppercase tracking-tight">Offline NLP Suite</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    A local Python engine utilizing high-performance Regex and Rule-based parsers. It provides **zero-latency ATS scoring** and syntax validation before any data ever reaches the cloud.
                                </p>
                                <div className="pt-4 flex items-baseline gap-2 border-t border-purple-500/10">
                                    <span className="text-3xl font-black text-purple-500">84%</span>
                                    <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Token Savings</span>
                                </div>
                            </div>
                            <div className="p-10 border border-muted/20 bg-muted/5 space-y-6 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-24 h-24" />
                                </div>
                                <Sparkles className="w-8 h-8 text-primary" />
                                <h4 className="text-2xl font-black uppercase tracking-tight">Cloud LLM Bridge</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Reserved strictly for high-value tasks: <span className="text-foreground font-medium">semantic rewriting</span> and <span className="text-foreground font-medium">impact suggestion</span>. By pre-cleaning data offline, we ensure GPT/Gemini receive high-quality context for better results.
                                </p>
                                <div className="pt-4 flex items-baseline gap-2 border-t border-muted/10">
                                    <span className="text-3xl font-black text-foreground">Sub-2s</span>
                                    <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Rewriting Latency</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Prompt Inspector */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">&gt; LOGIC_INSPECTION_BUFFER</span>
                                <Badge className="bg-purple-600/10 text-purple-500 border-purple-600/20 rounded-none uppercase font-mono text-[10px]">Real-time Logic</Badge>
                            </div>
                            <PromptInspector />
                        </div>
                    </div>
                </SwissSection>

                {/* 05: PROFILE SYNC */}
                <SwissSection
                    number="05"
                    id="profile-sync"
                    title="IDENTITY."
                    subtitle="ORCHESTRATING PROFESSIONAL BRANDING ACROSS PLATFORMS"
                    accentColor="bg-blue-400"
                >
                    <div className="grid lg:grid-cols-2 gap-px bg-muted/20 border border-muted/20">
                        <div className="bg-background p-10 space-y-6 relative overflow-hidden group">
                            <Linkedin className="w-8 h-8 text-blue-500" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter">Omnichannel Presence</h3>
                            <p className="text-muted-foreground font-light leading-relaxed text-sm">
                                Resumes are only one part of the equation. I built a **Tone Transformation Engine** that converts formal resume achievements into engaging LinkedIn headlines and GitHub bios. This ensures a consistent professional brand regardless of the surface.
                            </p>
                            <div className="flex gap-12 pt-8 border-t border-muted/10">
                                <div>
                                    <div className="text-2xl font-black">1:1</div>
                                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Brand_Sync</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black">AI</div>
                                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Tone_Adapt</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-400 p-10 text-black flex flex-col justify-between">
                            <Target className="w-12 h-12" />
                            <div className="space-y-4">
                                <h4 className="text-2xl font-black uppercase leading-tight">Eliminating the "Cold Start" Problem</h4>
                                <p className="text-xs font-mono uppercase tracking-widest font-bold leading-relaxed opacity-80">
                                    By scraping public professional data and applying semantic analysis, the platform provides a pre-populated starting point, reducing the friction of starting a new resume from zero.
                                </p>
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 06: SKILL MAPPING */}
                <SwissSection
                    number="06"
                    id="skill-mapping"
                    title="COMPETENCY."
                    subtitle="SEMANTIC RELATIONSHIP MAPPING AND SKILL CLUSTERING"
                    accentColor="bg-pink-600"
                >
                    <div className="border border-muted/20 p-12 bg-background space-y-12 relative overflow-hidden">
                        <div className="max-w-xl space-y-6 relative z-10">
                            <h3 className="text-4xl font-black uppercase tracking-tighter">The Semantic Skill Matrix</h3>
                            <p className="text-muted-foreground font-light leading-relaxed">
                                Most resume builders treat skills as a comma-separated list. I implemented a **K-Means inspired clustering approach** that detects semantic relationships between technical proficiencies (e.g., recognizing that "Docker" and "K8s" belong to "Cloud Native").
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This automated categorization helps hiring managers quickly verify technical depth without having to hunt through a wall of text.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-8 relative z-10">
                            {[
                                { name: 'Distributed Systems', group: 'INFRA' },
                                { name: 'React Ecosystem', group: 'FRONTEND' },
                                { name: 'FastAPI / Python', group: 'BACKEND' },
                                { name: 'CI/CD Pipelines', group: 'OPS' },
                                { name: 'Semantic Search', group: 'AI' }
                            ].map((skill) => (
                                <div key={skill.name} className="flex items-center gap-3 px-6 py-3 border border-muted/20 bg-muted/5 group hover:bg-pink-600 hover:border-pink-600 transition-all cursor-crosshair">
                                    <span className="text-[9px] font-mono text-pink-600 group-hover:text-white/50">{skill.group}</span>
                                    <span className="font-mono text-xs uppercase font-bold group-hover:text-white">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                        {/* Abstract Pattern */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.05)_0%,transparent_70%)] pointer-events-none" />
                    </div>
                </SwissSection>

                {/* 07: DEVELOPMENT LOGS */}
                <SwissSection
                    number="07"
                    id="dev-logs"
                    title="DECISION RECORDS."
                    subtitle="TRANSPARENT ENGINEERING LOGS AND ARCHITECTURAL TRADE-OFFS"
                    accentColor="bg-yellow-600"
                >
                    <ConstraintChronicle />
                </SwissSection>

                {/* 08: SYSTEM VISUALIZATION (TWO VERSIONS) */}
                <SwissSection
                    number="08"
                    id="visualization"
                    title="NEURAL MAP."
                    subtitle="INTERACTIVE ARCHITECTURE VISUALIZATION AND DATA MATRICES"
                    accentColor="bg-indigo-600"
                >
                    <div className="space-y-24">
                        {/* VERSION 1: Enhanced Original */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black uppercase tracking-tight">System Flow V1</h4>
                                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Enhanced Structural Graph</p>
                                </div>
                                <Badge variant="outline" className="rounded-none border-primary/20 text-primary font-mono uppercase">Original_Enhanced</Badge>
                            </div>
                            <ArchitectureMap version="enhanced" />
                        </div>

                        <div className="h-px bg-muted/20 w-full" />

                        {/* VERSION 2: New Design */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black uppercase tracking-tight">System Flow V2</h4>
                                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Swiss Matrix Design</p>
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none uppercase font-mono text-[10px]">NEW_DRAFT</Badge>
                            </div>
                            <div className="border border-muted/20 bg-muted/5 p-1">
                                <ArchitectureMap version="swiss" />
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* 09: PROJECT IMPACT & OUTCOMES */}
                <SwissSection
                    number="09"
                    id="outcomes"
                    title="THE IMPACT."
                    subtitle="QUANTIFIABLE OUTCOMES AND PROJECT SUCCESS METRICS"
                    accentColor="bg-red-600"
                >
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h3 className="text-4xl font-black uppercase tracking-tighter">Beyond the Code</h3>
                            <p className="text-muted-foreground font-light leading-relaxed">
                                Future Job Fit isn't just a technical exercise—it's a solution to the "Black Hole" of job applications. By combining semantic analysis with high-fidelity exports, we've created a tool that empowers users to own their professional data.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { label: 'Application Speed', val: '3x Faster', desc: 'Average time to draft a complete, ATS-ready resume.' },
                                    { label: 'ATS Compatibility', val: '98%', desc: 'Success rate in parsing tests against major hiring platforms.' },
                                    { label: 'Data Portability', val: '100%', desc: 'Export support for PDF, DOCX, LaTeX, and JSON.' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex items-center justify-between border-b border-muted/20 pb-4">
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold uppercase">{stat.label}</div>
                                            <div className="text-xs text-muted-foreground">{stat.desc}</div>
                                        </div>
                                        <div className="text-2xl font-black text-red-600">{stat.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-12 bg-muted/5 border border-muted/20 space-y-8 relative overflow-hidden group">
                            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">&gt; FINAL_CLOSING_STMT</div>
                            <blockquote className="text-2xl font-medium italic leading-snug text-foreground">
                                "The goal was to build a tool that I would actually use as a senior engineer. It had to be fast, it had to be precise, and it had to respect the user's intelligence."
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-red-600" />
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">LEAD ARCHITECT</span>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Shield className="w-32 h-32" />
                            </div>
                        </div>
                    </div>
                </SwissSection>

                {/* CALL TO ACTION */}
                <section className="py-64 text-center space-y-16">
                    <div className="space-y-8">
                        <h2 className="text-7xl md:text-[140px] font-black uppercase tracking-tighter leading-none text-foreground italic">READY_TO_BUILD.</h2>
                        <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.5em] max-w-lg mx-auto leading-relaxed">
                            TECHNICAL SPECIFICATION ENDS HERE. SYSTEMS ARE NOMINAL. PROCEED TO CREATION.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 px-8">
                        <Link to="/">
                            <Button variant="outline" className="h-20 px-12 rounded-none font-mono border-muted/40 hover:bg-muted/10 text-lg tracking-widest uppercase transition-all">
                                EXIT_SESSION
                            </Button>
                        </Link>
                        <Link to="/resume-wizard">
                            <Button className="h-20 px-24 rounded-none font-mono bg-foreground text-background hover:bg-primary hover:text-primary-foreground text-xl font-black tracking-tighter uppercase transition-all shadow-xl">
                                START_BUILDING_NOW &gt;
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

