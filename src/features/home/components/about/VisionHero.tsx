import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/shared/ui/badge';
import SystemVitals from '@/features/home/components/SystemVitals';
import { TechnicalAnnotation } from './BaseComponents';

export const VisionHero: React.FC = () => {
    return (
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
                            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground font-bold">CORE_PRINCIPLES</span>
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
                                    <TechnicalAnnotation title="The_Challenge">
                                        Most recruitment systems rely on simplistic keyword matching, leading to a 75% "false negative" rate for highly qualified candidates.
                                    </TechnicalAnnotation>
                                    <TechnicalAnnotation title="The_Solution">
                                        By decoupling formatting from content via a browser-native parsing engine, we preserve the "semantic signal" of career history.
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
    );
};
