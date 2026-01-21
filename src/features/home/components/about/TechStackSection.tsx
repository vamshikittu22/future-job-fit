import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { ArrowRight } from 'lucide-react';
import { SwissSection } from './BaseComponents';

export const TechStackSection: React.FC = () => {
    return (
        <SwissSection
            number="01"
            id="architecture"
            title="THE ENGINE."
            subtitle="BUILT FOR SPEED"
            accentColor="bg-violet-600"
            titleClassName="text-violet-950 dark:text-violet-50"
            subtitleClassName="text-violet-600 dark:text-violet-400"
            className="relative bg-gradient-to-br from-violet-50/50 via-background to-blue-50/50 dark:from-violet-900/10 dark:via-background dark:to-blue-900/10 group/section overflow-hidden"
            description="A high-performance intelligence system designed for recruitment accuracy: Local engine for privacy, Edge Functions for security, and Cloud AI for candidate storytelling."
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
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-violet-200">LOCAL_RECRUIT_SCIENCE</span>
                                    </div>
                                    <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">PYODIDE 3.12+</Badge>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-black uppercase italic tracking-tight">BROWSER_NATIVE NLP</h4>
                                    <p className="text-violet-200 text-sm mt-2 leading-relaxed">
                                        Pyodide (Python in WebAssembly) executes directly in your browser. Handles deterministic tasks like parsing, ATS scoring, and keyword matching at native speeds—zero cloud latency, zero server cost.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['Pyodide', 'WASM', 'WebWorkers', 'Regex NLP'].map(t => (
                                        <span key={t} className="px-2 py-1 bg-white/10 backdrop-blur-sm text-[10px] font-mono uppercase">{t}</span>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-violet-200">LATENCY: &lt;50ms</span>
                                    <span className="text-[10px] font-mono text-violet-200">NETWORK: NONE</span>
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
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-blue-200">SECURE_CLOUD_INTELLIGENCE</span>
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
    );
};
